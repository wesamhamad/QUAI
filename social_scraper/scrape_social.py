#!/usr/bin/env python3
"""
Social Media Scraper — multi-backend search for Qassim University mentions.

Backends (tried in order):
  1. SearXNG  — self-hosted meta-search (no CAPTCHA, no API key)
  2. Google Custom Search JSON API — free 100 queries/day
  3. Browser  — stealth Selenium fallback (may hit reCAPTCHA)

Usage:
    python3 scrape_social.py                                    # All platforms, AR+EN
    python3 scrape_social.py --lang ar --platforms facebook      # Arabic, Facebook only
    python3 scrape_social.py --max-pages 2 --json               # 2 pages, JSON output
    python3 scrape_social.py --backend searxng                   # Force SearXNG backend
    python3 scrape_social.py --backend google-api                # Force Google API
    python3 scrape_social.py --backend browser --headed          # Force browser (visible)
"""

import argparse
import csv
import hashlib
import json
import os
import random
import re
import sys
import time
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from threading import Lock
from urllib.parse import quote_plus

import requests
from dotenv import load_dotenv

# Load .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_DATABASE", "ai")
DB_USER = os.getenv("DB_USERNAME", "root")
DB_PASS = os.getenv("DB_PASSWORD", "")

# SearXNG (self-hosted meta-search)
SEARXNG_BASE_URL = os.getenv("SEARXNG_BASE_URL", "http://localhost:8888")

# Google Custom Search JSON API (optional)
GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY", "")
GOOGLE_CSE_CX = os.getenv("GOOGLE_CSE_CX", "")

QUERIES = {"ar": "جامعة القصيم", "en": "Qassim University"}

PLATFORMS = {
    "facebook": {"site_filter": "site:facebook.com", "domains": ["facebook.com", "fb.com", "fb.watch"]},
    "twitter": {"site_filter": "site:twitter.com OR site:x.com", "domains": ["twitter.com", "x.com"]},
    "instagram": {"site_filter": "site:instagram.com", "domains": ["instagram.com"]},
    "tiktok": {"site_filter": "site:tiktok.com", "domains": ["tiktok.com"]},
    "linkedin": {"site_filter": "site:linkedin.com", "domains": ["linkedin.com"]},
    "youtube": {"site_filter": "site:youtube.com", "domains": ["youtube.com", "youtu.be"]},
    "reddit": {"site_filter": "site:reddit.com", "domains": ["reddit.com"]},
    "snapchat": {"site_filter": "site:snapchat.com", "domains": ["snapchat.com"]},
    "pinterest": {"site_filter": "site:pinterest.com", "domains": ["pinterest.com"]},
}

# Domain lookup for URL classification
DOMAIN_TO_PLATFORM = {}
for _plat, _info in PLATFORMS.items():
    for _dom in _info["domains"]:
        DOMAIN_TO_PLATFORM[_dom] = _plat

print_lock = Lock()


def tprint(msg):
    with print_lock:
        print(msg, flush=True)


def human_delay(min_s=1.0, max_s=3.0):
    time.sleep(random.uniform(min_s, max_s))


# ─── Database ────────────────────────────────────────────────────────────────

def get_db_connection():
    import mysql.connector
    return mysql.connector.connect(
        host=DB_HOST, port=DB_PORT, database=DB_NAME,
        user=DB_USER, password=DB_PASS,
        charset="utf8mb4", collation="utf8mb4_unicode_ci",
    )


def get_or_create_source(cursor, conn):
    cursor.execute(
        "SELECT id FROM review_sources WHERE platform='social_media' AND external_id='social_searcher_web' LIMIT 1"
    )
    row = cursor.fetchone()
    if row:
        return row[0]
    sid = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO review_sources (id,platform,external_id,name,config,is_active,created_at,updated_at) "
        "VALUES (%s,'social_media','social_searcher_web','Social Searcher (Web Scraper)',%s,1,NOW(),NOW())",
        (sid, json.dumps({"method": "multi_backend_scraper"})),
    )
    conn.commit()
    return sid


def save_results_to_db(results):
    if not results:
        return 0
    conn = get_db_connection()
    cur = conn.cursor()
    source_id = get_or_create_source(cur, conn)
    new_count = 0
    for item in results:
        ext_id = hashlib.md5(
            (item.get("url") or item.get("title") or item.get("snippet", "")).encode()
        ).hexdigest()
        cur.execute("SELECT id FROM reviews WHERE platform='social_media' AND external_review_id=%s LIMIT 1", (ext_id,))
        if cur.fetchone():
            continue
        content = item.get("full_content") or item.get("snippet", "")
        title = item.get("title", "")
        if title and content:
            content = f"{title}\n\n{content}"
        elif title:
            content = title
        author = item.get("author") or item.get("source_platform")
        url = item.get("url")
        if url and len(url) > 255:
            url = url[:255]
        cur.execute(
            "INSERT INTO reviews (id,review_source_id,platform,external_review_id,author_name,"
            "rating,content,language,published_at,url,raw_data,"
            "sentiment,sentiment_score,topics,is_analyzed,created_at,updated_at) "
            "VALUES (%s,%s,'social_media',%s,%s,NULL,%s,%s,%s,%s,%s,NULL,NULL,NULL,0,NOW(),NOW())",
            (str(uuid.uuid4()), source_id, ext_id, author,
             content, item.get("language", "ar"), item.get("date"), url,
             json.dumps(item, ensure_ascii=False)),
        )
        new_count += 1
    cur.execute("UPDATE review_sources SET last_scraped_at=NOW(),updated_at=NOW() WHERE id=%s", (source_id,))
    conn.commit()
    cur.close()
    conn.close()
    return new_count


def parse_date(s):
    if not s:
        return None
    s = s.strip().rstrip(" —…·-").strip()
    for fmt in ["%b %d, %Y", "%B %d, %Y", "%Y-%m-%d", "%d/%m/%Y", "%d %b %Y", "%d %B %Y"]:
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            pass
    return None


def extract_date_from_text(text):
    if not text:
        return None
    for pattern in [r"(\w{3,9}\s+\d{1,2},\s*\d{4})", r"(\d{4}-\d{2}-\d{2})", r"(\d{1,2}\s+\w{3,9}\s+\d{4})"]:
        m = re.search(pattern, text)
        if m:
            return m.group(1)
    return None


# ─── Backend 1: SearXNG (best option — no CAPTCHA, no API key) ──────────────

def _searxng_fetch(query, language, max_pages, engines=None, retry_on_ratelimit=True):
    """Raw SearXNG search, returns list of raw result dicts.
    Fetches ALL pages up to max_pages, retrying on rate-limits and empty pages."""
    raw = []
    consecutive_empty = 0
    max_consecutive_empty = 2  # Only stop after 2 consecutive empty pages (not just 1)
    seen_urls = set()  # Track URLs to detect when we're getting duplicates

    params = {
        "q": query,
        "format": "json",
        "language": "ar" if language == "ar" else "en",
        "categories": "general",
    }
    if engines:
        params["engines"] = engines

    for page in range(1, max_pages + 1):
        params["pageno"] = page
        data = None
        retries = 0
        max_retries = 3

        while retries < max_retries:
            try:
                resp = requests.get(f"{SEARXNG_BASE_URL}/search", params=params, timeout=20)
                resp.raise_for_status()
                data = resp.json()
                break
            except requests.RequestException as e:
                retries += 1
                if retries < max_retries:
                    tprint(f"    SearXNG error (page {page}, retry {retries}): {e}")
                    time.sleep(5 * retries)
                else:
                    tprint(f"    SearXNG failed after {max_retries} retries (page {page}): {e}")

        if data is None:
            consecutive_empty += 1
            if consecutive_empty >= max_consecutive_empty:
                break
            continue

        # Check if engines are rate-limited
        unresponsive = data.get("unresponsive_engines", [])
        if unresponsive and not data.get("results"):
            suspended = [e for e in unresponsive if "Suspended" in str(e) or "CAPTCHA" in str(e)]
            if suspended and retry_on_ratelimit:
                tprint(f"    SearXNG engines rate-limited on page {page}: {[e[0] for e in suspended]}")
                # Progressive backoff: wait longer for later pages
                wait_time = min(30 + (page * 5), 90)
                tprint(f"    Waiting {wait_time}s for engines to recover...")
                time.sleep(wait_time)
                # Retry this page
                try:
                    resp = requests.get(f"{SEARXNG_BASE_URL}/search", params=params, timeout=20)
                    resp.raise_for_status()
                    data = resp.json()
                except requests.RequestException:
                    consecutive_empty += 1
                    if consecutive_empty >= max_consecutive_empty:
                        break
                    continue

        page_results = data.get("results", [])

        # Filter out results we've already seen (detect pagination exhaustion)
        new_results = []
        for r in page_results:
            url = r.get("url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                new_results.append(r)

        if not new_results:
            consecutive_empty += 1
            if consecutive_empty >= max_consecutive_empty:
                tprint(f"    Page {page}: no new results, pagination exhausted")
                break
            else:
                tprint(f"    Page {page}: no new results, trying next page...")
                human_delay(3.0, 6.0)
                continue
        else:
            consecutive_empty = 0  # Reset on success

        raw.extend(new_results)
        tprint(f"    Page {page}: +{len(new_results)} new results (total: {len(raw)})")

        # Delay between pages to avoid rate-limiting engines
        if page < max_pages:
            human_delay(4.0, 8.0)

    return raw


def _url_matches_platform(url, platform):
    """Check if a URL belongs to the given platform."""
    platform_info = PLATFORMS.get(platform, {})
    domains = platform_info.get("domains", [])
    url_lower = url.lower()
    return any(d in url_lower for d in domains)


def _classify_platform(url):
    """Classify a URL into a platform name, or None."""
    url_lower = url.lower()
    for dom, plat in DOMAIN_TO_PLATFORM.items():
        if dom in url_lower:
            return plat
    return None


def searxng_search(query, platform, language, max_pages=5):
    """Search via SearXNG — tries multiple strategies to maximize results for a platform."""
    platform_info = PLATFORMS.get(platform, {})
    site_filter = platform_info.get("site_filter", "")
    seen_urls = set()
    results = []

    def _add_results(raw):
        for r in raw:
            url = r.get("url", "")
            if _url_matches_platform(url, platform) and url not in seen_urls:
                seen_urls.add(url)
                results.append(_format_searxng_result(r, platform, language, query))

    # Strategy 1: site: filter (most precise)
    tprint(f"    [{platform}] Strategy 1: site: filter")
    _add_results(_searxng_fetch(f"{query} {site_filter}", language, max_pages))

    # Strategy 2: quoted query + site: filter
    tprint(f"    [{platform}] Strategy 2: quoted + site: filter")
    _add_results(_searxng_fetch(f'"{query}" {site_filter}', language, max_pages))

    # Strategy 3: domain as keyword (catches results where site: doesn't work)
    domains = platform_info.get("domains", [])
    domain_kw = domains[0] if domains else platform
    tprint(f"    [{platform}] Strategy 3: domain keyword ({domain_kw})")
    _add_results(_searxng_fetch(f"{query} {domain_kw}", language, max(3, max_pages // 2)))

    tprint(f"    [{platform}] Total: {len(results)} unique results")
    return results


def searxng_search_broad(query, language, max_pages=10):
    """Broad SearXNG search — get all results, classify by platform later.
    This is the most effective mode: gets lots of pages and sorts them into platforms.
    Uses multiple query variations to maximize result coverage."""
    seen = set()
    merged = []

    def _collect(raw):
        for r in raw:
            url = r.get("url", "")
            if url and url not in seen:
                seen.add(url)
                merged.append(r)

    # Variation 1: Exact match (quoted query)
    tprint(f"    Broad search: exact match \"{query}\"")
    _collect(_searxng_fetch(f'"{query}"', language, max_pages))

    # Variation 2: Unquoted query (broader match)
    tprint(f"    Broad search: unquoted \"{query}\"")
    _collect(_searxng_fetch(query, language, max_pages))

    # Variation 3: Query + "social media" or platform keywords for more coverage
    social_keywords = {
        "ar": ["تغريدة", "منشور", "فيديو", "تعليق"],
        "en": ["review", "post", "comment", "video", "thread"],
    }
    lang_keywords = social_keywords.get(language, social_keywords["en"])
    # Pick 2 random keywords to add variety without too many requests
    for kw in random.sample(lang_keywords, min(2, len(lang_keywords))):
        tprint(f"    Broad search: \"{query}\" + \"{kw}\"")
        _collect(_searxng_fetch(f'{query} {kw}', language, max(3, max_pages // 2)))
        human_delay(3.0, 6.0)

    tprint(f"    Broad search: {len(merged)} unique URLs collected")

    results = []
    for r in merged:
        url = r.get("url", "")
        plat = _classify_platform(url)
        if plat:
            results.append(_format_searxng_result(r, plat, language, query))

    return results


def _format_searxng_result(r, platform, language, query):
    """Format a raw SearXNG result dict into our standard format."""
    snippet = r.get("content", "")
    date_str = extract_date_from_text(snippet)
    if not date_str and r.get("publishedDate"):
        try:
            date_str = r["publishedDate"][:10]
        except Exception:
            pass

    return {
        "title": r.get("title", ""),
        "url": r.get("url", ""),
        "snippet": snippet,
        "date": parse_date(date_str),
        "source_site": r.get("parsed_url", [""])[1] if r.get("parsed_url") else "",
        "language": language,
        "query": query,
        "source_platform": platform,
        "backend": "searxng",
    }


# ─── Backend 2: Google Custom Search JSON API ───────────────────────────────

def google_api_search(query, platform, language, max_pages=1):
    """Search via Google Custom Search JSON API (free 100 queries/day)."""
    if not GOOGLE_CSE_API_KEY or not GOOGLE_CSE_CX:
        return None  # Signal: not configured

    platform_info = PLATFORMS.get(platform, {})
    site_filter = platform_info.get("site_filter", "")
    full_query = f"{query} {site_filter}"
    results = []

    for page in range(max_pages):
        start = page * 10 + 1
        try:
            resp = requests.get(
                "https://www.googleapis.com/customsearch/v1",
                params={
                    "key": GOOGLE_CSE_API_KEY,
                    "cx": GOOGLE_CSE_CX,
                    "q": full_query,
                    "start": start,
                    "lr": f"lang_{language}",
                    "num": 10,
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            tprint(f"    Google API error (page {page+1}): {e}")
            break

        items = data.get("items", [])
        if not items:
            break

        for item in items:
            snippet = item.get("snippet", "")
            date_str = extract_date_from_text(snippet)

            results.append({
                "title": item.get("title", ""),
                "url": item.get("link", ""),
                "snippet": snippet,
                "date": parse_date(date_str),
                "source_site": item.get("displayLink", ""),
                "language": language,
                "query": query,
                "source_platform": platform,
                "backend": "google-api",
            })

    return results


# ─── Backend 3: Browser fallback (stealth Selenium) ─────────────────────────

def browser_search(query, platform, language, max_pages=1, headed=False):
    """Last resort: use undetected-chromedriver to search Google directly."""
    try:
        import undetected_chromedriver as uc
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        from selenium.common.exceptions import TimeoutException, NoSuchElementException
    except ImportError:
        tprint("    undetected-chromedriver not installed, skipping browser backend")
        return None

    platform_info = PLATFORMS.get(platform, {})
    site_filter = platform_info.get("site_filter", "")
    full_query = f"{query} {site_filter}"
    results = []

    opts = uc.ChromeOptions()
    if not headed:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    viewports = [(1366, 768), (1440, 900), (1536, 864), (1920, 1080)]
    w, h = random.choice(viewports)
    opts.add_argument(f"--window-size={w},{h}")

    driver = None
    try:
        driver = uc.Chrome(options=opts, headless=not headed)
        driver.set_page_load_timeout(30)

        # Search Google directly (not social-searcher.com)
        search_url = f"https://www.google.com/search?q={quote_plus(full_query)}&hl={language}"
        driver.get(search_url)
        human_delay(3.0, 6.0)

        # Check for CAPTCHA
        page_src = driver.page_source.lower()
        if "verify that you are not a robot" in page_src or "unusual traffic" in page_src:
            if headed:
                tprint(f"    CAPTCHA detected! Solve it in the browser window...")
                for _ in range(24):
                    time.sleep(5)
                    page_src = driver.page_source.lower()
                    if "verify that you are not a robot" not in page_src and "unusual traffic" not in page_src:
                        tprint(f"    CAPTCHA solved!")
                        human_delay(2.0, 3.0)
                        break
                else:
                    return results
            else:
                tprint(f"    CAPTCHA in headless mode, can't solve")
                return results

        for page in range(max_pages):
            # Extract Google search results
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "#search .g, #rso .g"))
                )
            except TimeoutException:
                break

            elements = driver.find_elements(By.CSS_SELECTOR, "#search .g, #rso .g")
            if not elements:
                break

            for el in elements:
                title, url, snippet = "", "", ""
                try:
                    link = el.find_element(By.CSS_SELECTOR, "a[href]")
                    url = link.get_attribute("href") or ""
                    title_el = el.find_element(By.CSS_SELECTOR, "h3")
                    title = title_el.text.strip()
                except Exception:
                    continue

                try:
                    # Google snippet containers
                    for sel in [".VwiC3b", "[data-sncf]", ".IsZvec", ".s3v9rd"]:
                        try:
                            snip = el.find_element(By.CSS_SELECTOR, sel)
                            snippet = snip.text.strip()
                            if snippet:
                                break
                        except Exception:
                            continue
                except Exception:
                    pass

                if title or snippet:
                    date_str = extract_date_from_text(snippet)
                    results.append({
                        "title": title,
                        "url": url,
                        "snippet": snippet,
                        "date": parse_date(date_str),
                        "source_site": "",
                        "language": language,
                        "query": query,
                        "source_platform": platform,
                        "backend": "browser",
                    })

            # Try next page
            if page < max_pages - 1:
                try:
                    next_btn = driver.find_element(By.CSS_SELECTOR, '#pnnext, a[aria-label="Next"]')
                    next_btn.click()
                    human_delay(4.0, 8.0)
                except Exception:
                    break

    except Exception as e:
        tprint(f"    Browser error: {e}")
    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass

    return results


# ─── Enrichment: visit actual post URLs for full content ─────────────────────

def extract_full_content_http(url, platform, session=None):
    """Fetch a URL via HTTP and extract content from meta tags / HTML.
    Much faster and more reliable than browser-based enrichment."""
    from bs4 import BeautifulSoup

    if not session:
        session = requests.Session()

    USER_AGENTS = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    ]

    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    }

    fetch_url = url

    # Reddit: use old.reddit.com (serves real HTML, not JS app)
    if platform == "reddit" and "reddit.com" in url:
        fetch_url = url.replace("www.reddit.com", "old.reddit.com").replace("//reddit.com", "//old.reddit.com")

    # Reddit JSON API as alternative (works for posts and subreddits)
    reddit_json = None
    if platform == "reddit" and "reddit.com" in url:
        json_url = url.rstrip("/") + ".json"
        try:
            resp = session.get(json_url, headers=headers, timeout=10, allow_redirects=True)
            if resp.status_code == 200:
                reddit_json = resp.json()
        except Exception:
            pass

    html_resp = None
    try:
        html_resp = session.get(fetch_url, headers=headers, timeout=15, allow_redirects=True)
        html_resp.raise_for_status()
    except Exception:
        html_resp = None
        # If we got reddit JSON, we can still use it
        if not reddit_json:
            return None, None, None

    soup = BeautifulSoup(html_resp.text, "html.parser") if html_resp else None
    full_text = None
    author = None
    post_date = None

    # Extract from meta tags (works for most social platforms)
    def get_meta(names):
        if not soup:
            return None
        for name in names:
            tag = soup.find("meta", attrs={"property": name}) or soup.find("meta", attrs={"name": name})
            if tag and tag.get("content", "").strip():
                return tag["content"].strip()
        return None

    og_desc = get_meta(["og:description", "twitter:description", "description"])
    og_title = get_meta(["og:title", "twitter:title"])

    # Platform-specific extraction
    if platform in ("twitter", "x"):
        # X/Twitter often blocks, but og:description sometimes works via nitter-like redirect
        full_text = og_desc
        if og_title and " on X:" in og_title:
            author = og_title.split(" on X:")[0].strip()
        elif og_title and " on Twitter:" in og_title:
            author = og_title.split(" on Twitter:")[0].strip()
        # If og failed, try to extract from the page title at least
        if not full_text and soup:
            title_tag = soup.find("title")
            if title_tag and title_tag.text and len(title_tag.text) > 30:
                full_text = title_tag.text.strip()

    elif platform == "youtube":
        title_tag = soup.find("title") if soup else None
        yt_title = title_tag.text.strip().replace(" - YouTube", "") if title_tag else og_title
        if og_desc and yt_title:
            full_text = f"{yt_title}\n\n{og_desc}"
        else:
            full_text = og_desc or yt_title
        # Author from channel name meta
        channel = get_meta(["og:video:tag"]) or ""
        if not channel and soup:
            link_tag = soup.find("link", attrs={"itemprop": "name"})
            if link_tag:
                channel = link_tag.get("content", "")
        if channel:
            author = channel

    elif platform == "reddit":
        # Priority 1: Reddit JSON API (most reliable)
        if reddit_json:
            try:
                # Handle both post responses (list) and subreddit listings (dict)
                listing = None
                if isinstance(reddit_json, list) and len(reddit_json) > 0:
                    listing = reddit_json[0]
                elif isinstance(reddit_json, dict) and reddit_json.get("data"):
                    listing = reddit_json

                if listing and listing.get("data", {}).get("children"):
                    children = listing["data"]["children"]
                    texts = []
                    for child in children[:5]:  # First 5 posts
                        cdata = child.get("data", {})
                        selftext = cdata.get("selftext", "").strip()
                        title = cdata.get("title", "").strip()
                        if not author:
                            author = cdata.get("author", "")
                        created = cdata.get("created_utc")
                        if created and not post_date:
                            post_date = datetime.utcfromtimestamp(created).strftime("%Y-%m-%d")
                        if selftext:
                            texts.append(f"{title}\n{selftext}" if title else selftext)
                        elif title:
                            texts.append(title)
                    if texts:
                        full_text = "\n\n".join(texts)
            except Exception:
                pass

        # Priority 2: old.reddit.com HTML
        if not full_text and soup:
            # old.reddit has the post content in a .usertext-body div
            for sel in [".usertext-body .md", ".expando .md", '[data-test-id="post-content"]']:
                el = soup.select_one(sel)
                if el:
                    text = el.get_text(separator="\n", strip=True)
                    if text and len(text) > 20:
                        full_text = text
                        break
            # Title from old.reddit
            if not full_text:
                title_el = soup.select_one("a.title, [data-event-action='title']")
                if title_el:
                    full_text = title_el.get_text(strip=True)

        # Priority 3: og:description
        if not full_text:
            full_text = og_desc
        if not author and og_title:
            if " - posted by " in og_title:
                author = og_title.split(" - posted by ")[-1].strip()

    elif platform == "linkedin":
        full_text = og_desc
        if og_title:
            author = og_title.split(" on LinkedIn")[0].strip() if " on LinkedIn" in og_title else None
        # LinkedIn profile pages — extract headline from the page
        if not full_text and soup:
            # Profiles often have a title like "Name - Title - Company | LinkedIn"
            title_tag = soup.find("title")
            if title_tag:
                t = title_tag.text.strip().replace(" | LinkedIn", "")
                if t and len(t) > 10:
                    full_text = t

    elif platform == "instagram":
        full_text = og_desc
        if og_title and "'s " in og_title:
            author = og_title.split("'s ")[0].strip()
        elif og_title and " on Instagram" in og_title:
            author = og_title.split(" on Instagram")[0].strip()

    elif platform == "tiktok":
        full_text = og_desc
        if og_title:
            # TikTok titles are often like "username on TikTok"
            for sep in [" on TikTok", " | TikTok"]:
                if sep in og_title:
                    author = og_title.split(sep)[0].strip()
                    break

    elif platform == "facebook":
        full_text = og_desc

    elif platform == "pinterest":
        full_text = og_desc

    elif platform == "snapchat":
        full_text = og_desc

    # Generic fallback
    if not full_text:
        full_text = og_desc

    # Try to extract date from various meta tags
    if not post_date:
        date_str = get_meta(["article:published_time", "datePublished", "og:updated_time", "date"])
        if date_str and len(date_str) >= 10:
            post_date = date_str[:10]
    # JSON-LD date
    if not post_date and soup:
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                if isinstance(data, dict):
                    for key in ["datePublished", "dateCreated", "uploadDate"]:
                        if data.get(key):
                            post_date = str(data[key])[:10]
                            break
            except Exception:
                continue

    return full_text, author, post_date


def enrich_batch_worker(batch, headed):
    """Worker: fetch a batch of URLs via HTTP to extract full content."""
    session = requests.Session()
    enriched_count = 0
    errors = 0

    for item in batch:
        url = item.get("url", "")
        platform = item.get("source_platform", "")
        if not url or url.startswith("javascript:"):
            continue
        try:
            full_text, author, post_date = extract_full_content_http(url, platform, session)
            if full_text and len(full_text) > 20:
                item["full_content"] = full_text
                enriched_count += 1
            if author and not item.get("author"):
                item["author"] = author
            if post_date and not item.get("date"):
                item["date"] = post_date
            # Small delay to be polite
            time.sleep(random.uniform(0.3, 1.0))
        except Exception as e:
            errors += 1

    if errors:
        tprint(f"    (batch had {errors} HTTP errors)")

    return batch, enriched_count


# ─── Multi-backend search worker ────────────────────────────────────────────

def search_worker(task, backend, max_pages, headed, worker_index):
    """Search for one platform+language combo using the chosen backend."""
    lang = task["lang"]
    query = task["query"]
    platform = task["platform"]
    label = f"[{platform.upper()}/{lang}]"

    # Stagger launches
    stagger = worker_index * random.uniform(0.5, 1.5)
    if stagger > 0:
        time.sleep(stagger)

    tprint(f"  {label} Searching via {backend}...")

    results = None

    if backend == "searxng":
        results = searxng_search(query, platform, lang, max_pages=max_pages)
    elif backend == "google-api":
        results = google_api_search(query, platform, lang, max_pages=max_pages)
    elif backend == "browser":
        results = browser_search(query, platform, lang, max_pages=max_pages, headed=headed)
    elif backend == "auto":
        # Try backends in order: SearXNG -> Google API -> Browser
        results = searxng_search(query, platform, lang, max_pages=max_pages)
        if not results:
            tprint(f"  {label} SearXNG returned nothing, trying Google API...")
            results = google_api_search(query, platform, lang, max_pages=max_pages)
        if results is None:
            tprint(f"  {label} Google API not configured, trying browser...")
            results = browser_search(query, platform, lang, max_pages=max_pages, headed=headed)
        if results is None:
            results = []

    if results is None:
        results = []

    if results:
        tprint(f"  {label} Got {len(results)} results")
    else:
        tprint(f"  {label} No results")

    return {"label": label, "results": results, "error": None}


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Social Media Scraper (multi-backend)")
    parser.add_argument("--lang", choices=["ar", "en", "all"], default="all")
    parser.add_argument("--query", help="Custom query")
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--max-pages", type=int, default=10, help="Max pages per search (default: 10)")
    parser.add_argument("--headed", action="store_true")
    parser.add_argument("--platforms", help="e.g. facebook,twitter,youtube")
    parser.add_argument("--workers", type=int, default=3, help="Parallel workers (default: 3)")
    parser.add_argument("--backend", choices=["auto", "searxng", "google-api", "browser"],
                        default="auto", help="Search backend (default: auto)")
    parser.add_argument("--enrich", action="store_true", help="Phase 2: visit URLs to get full post content")
    parser.add_argument("--enrich-workers", type=int, default=3, help="Parallel browsers for enrichment")
    args = parser.parse_args()

    queries = {}
    if args.query:
        queries["custom"] = args.query
    elif args.lang == "all":
        queries = QUERIES.copy()
    else:
        queries[args.lang] = QUERIES[args.lang]

    platform_filter = None
    if args.platforms:
        platform_filter = set(p.strip().lower() for p in args.platforms.split(","))

    out = Path(__file__).parent / "output"
    out.mkdir(exist_ok=True)

    backend = args.backend

    # ── Phase 1: Search ──
    # Best strategy for SearXNG: broad search + classify results by URL domain.
    # This gets far more results than per-platform site: queries which are unreliable.
    all_results = []
    failed = []

    if backend in ("auto", "searxng"):
        print(f"Phase 1: Broad SearXNG search (classifying results by URL domain)")
        print(f"  SearXNG: {SEARXNG_BASE_URL}")
        print(f"  Max pages: {args.max_pages}")
        print()

        for lang, query in queries.items():
            tprint(f"  [{lang.upper()}] Searching: {query}")
            results = searxng_search_broad(query, lang, max_pages=args.max_pages)
            if platform_filter:
                results = [r for r in results if r["source_platform"] in platform_filter]
            all_results.extend(results)
            tprint(f"  [{lang.upper()}] Found {len(results)} social media results")
            human_delay(5.0, 10.0)

        # Also do per-platform targeted searches for platforms with few or 0 results
        platform_names = list(PLATFORMS.keys())
        if platform_filter:
            platform_names = [p for p in platform_names if p in platform_filter]

        # Count results per platform from the broad search
        platform_counts = {}
        for r in all_results:
            p = r.get("source_platform", "")
            platform_counts[p] = platform_counts.get(p, 0) + 1

        # Target platforms with < 5 results for deeper targeted search
        MIN_RESULTS_THRESHOLD = 5
        sparse_platforms = [p for p in platform_names if platform_counts.get(p, 0) < MIN_RESULTS_THRESHOLD]

        if sparse_platforms:
            tprint(f"\n  Targeted deep search for sparse platforms: {', '.join(sparse_platforms)}")
            tprint(f"  (platforms with <{MIN_RESULTS_THRESHOLD} results from broad search)")
            tasks = []
            for lang, query in queries.items():
                for plat in sparse_platforms:
                    tasks.append({"lang": lang, "query": query, "platform": plat})

            random.shuffle(tasks)  # Avoid hitting same platform simultaneously

            with ThreadPoolExecutor(max_workers=min(args.workers, len(tasks))) as pool:
                futures = {
                    pool.submit(search_worker, task, "searxng", args.max_pages, args.headed, i): task
                    for i, task in enumerate(tasks)
                }
                for future in as_completed(futures):
                    task = futures[future]
                    try:
                        result = future.result()
                        all_results.extend(result["results"])
                    except Exception:
                        pass

            # Show improved counts
            updated_counts = {}
            for r in all_results:
                p = r.get("source_platform", "")
                updated_counts[p] = updated_counts.get(p, 0) + 1
            tprint(f"\n  After targeted search:")
            for p in sorted(updated_counts, key=lambda x: -updated_counts[x]):
                before = platform_counts.get(p, 0)
                after = updated_counts[p]
                delta = f" (+{after - before})" if after > before else ""
                tprint(f"    {p:12s}: {after}{delta}")

    elif backend == "google-api":
        print(f"Using Google Custom Search JSON API")
        platform_names = list(PLATFORMS.keys())
        if platform_filter:
            platform_names = [p for p in platform_names if p in platform_filter]
        tasks = []
        for lang, query in queries.items():
            for plat in platform_names:
                tasks.append({"lang": lang, "query": query, "platform": plat})
        with ThreadPoolExecutor(max_workers=min(args.workers, len(tasks))) as pool:
            futures = {
                pool.submit(search_worker, task, backend, args.max_pages, args.headed, i): task
                for i, task in enumerate(tasks)
            }
            for future in as_completed(futures):
                try:
                    result = future.result()
                    all_results.extend(result["results"])
                except Exception:
                    pass

    elif backend == "browser":
        print(f"Using browser (stealth Selenium)")
        platform_names = list(PLATFORMS.keys())
        if platform_filter:
            platform_names = [p for p in platform_names if p in platform_filter]
        tasks = []
        for lang, query in queries.items():
            for plat in platform_names:
                tasks.append({"lang": lang, "query": query, "platform": plat})
        with ThreadPoolExecutor(max_workers=min(args.workers, len(tasks))) as pool:
            futures = {
                pool.submit(search_worker, task, backend, args.max_pages, args.headed, i): task
                for i, task in enumerate(tasks)
            }
            for future in as_completed(futures):
                try:
                    result = future.result()
                    all_results.extend(result["results"])
                except Exception:
                    pass

    # Dedup
    seen = set()
    unique = []
    for r in all_results:
        key = r.get("url") or (r.get("title", "") + r.get("snippet", "")[:50])
        if key and key not in seen:
            seen.add(key)
            unique.append(r)

    # Phase 2: Enrich
    if args.enrich and unique:
        enrich_workers = args.enrich_workers
        print(f"\n{'='*60}")
        print(f"  Phase 2: Enriching {len(unique)} results (visiting original URLs)...")
        print(f"  Using {enrich_workers} parallel browsers")
        print(f"{'='*60}")

        batch_size = max(1, len(unique) // enrich_workers)
        batches = [unique[i:i + batch_size] for i in range(0, len(unique), batch_size)]

        enriched_total = 0
        enriched_results = []

        with ThreadPoolExecutor(max_workers=enrich_workers) as pool:
            futures = [pool.submit(enrich_batch_worker, batch, args.headed) for batch in batches]
            for i, future in enumerate(as_completed(futures)):
                try:
                    batch_result, count = future.result()
                    enriched_results.extend(batch_result)
                    enriched_total += count
                    tprint(f"  Batch {i+1}/{len(batches)} done -- {count} enriched")
                except Exception as e:
                    tprint(f"  Batch {i+1} error: {e}")

        if enriched_results:
            unique = enriched_results
        print(f"  Enriched {enriched_total}/{len(unique)} results with full content")

    print(f"\n{'='*60}")
    print(f"  DONE: {len(unique)} unique results (from {len(all_results)} raw)")
    if failed:
        print(f"  FAILED: {', '.join(failed)}")
    print(f"{'='*60}")

    if unique:
        counts = {}
        for r in unique:
            p = r.get("source_platform", "?")
            counts[p] = counts.get(p, 0) + 1
        for p, c in sorted(counts.items(), key=lambda x: -x[1]):
            print(f"    {p:12s}: {c}")

        # Backend breakdown
        backends = {}
        for r in unique:
            b = r.get("backend", "?")
            backends[b] = backends.get(b, 0) + 1
        print(f"  Backends used: {backends}")

    # Save JSON
    f = out / f"social_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(f, "w", encoding="utf-8") as fh:
        json.dump(unique, fh, ensure_ascii=False, indent=2)
    print(f"\n  JSON saved: {f}")

    # Save CSV
    csv_f = out / f"social_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    with open(csv_f, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["#", "Platform", "Language", "Title", "URL", "Content", "Full Content",
                     "Author", "Date", "Source Site", "Query", "Backend"])
        for i, r in enumerate(unique, 1):
            w.writerow([i, r.get("source_platform", ""), r.get("language", ""), r.get("title", ""),
                        r.get("url", ""), r.get("snippet", ""), r.get("full_content", ""),
                        r.get("author", ""), r.get("date", ""),
                        r.get("source_site", ""), r.get("query", ""), r.get("backend", "")])
    print(f"  CSV saved:  {csv_f}")

    if not args.json and unique:
        try:
            n = save_results_to_db(unique)
            print(f"  Saved to DB: {n} new (of {len(unique)} unique)")
        except Exception as e:
            print(f"  DB save error: {e}")
            print(f"  Results are safe in: {f}")
    elif args.json:
        print(json.dumps(unique, ensure_ascii=False, indent=2))
    else:
        print("  Nothing to save.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
