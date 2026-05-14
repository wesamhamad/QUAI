#!/usr/bin/env python3
"""
Google Maps Reviews Scraper using ScrapingBee.
Scrapes ALL reviews from a Google Maps place using ScrapingBee's JS rendering
to scroll through the reviews panel and extract every review.

Usage:
    python3 scrape_google_maps.py                          # Default: Qassim University
    python3 scrape_google_maps.py --url "https://..."      # Custom Google Maps URL
    python3 scrape_google_maps.py --max-reviews 100        # Limit reviews
    python3 scrape_google_maps.py --json                   # Output JSON only
    python3 scrape_google_maps.py --scroll-count 30        # More scrolls = more reviews
"""

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_DATABASE", "ai")
DB_USER = os.getenv("DB_USERNAME", "root")
DB_PASS = os.getenv("DB_PASSWORD", "")

SCRAPINGBEE_API_KEY = os.getenv("SCRAPINGBEE_API_KEY", "")

# Default: Qassim University Google Maps (reviews tab)
DEFAULT_URL = "https://www.google.com/maps/place/Qassim+University/@26.3488806,43.7668031,17z/data=!4m8!3m7!1s0x158201a2e51ea661:0x4280bf3bc0653d99!8m2!3d26.3488806!4d43.7668031!9m1!1b1!16s%2Fm%2F04gkhys"
PLACE_ID = "0x158201a2e51ea661:0x4280bf3bc0653d99"

OUT_DIR = Path(__file__).parent / "output"


def get_db_connection():
    import mysql.connector
    return mysql.connector.connect(
        host=DB_HOST, port=DB_PORT, database=DB_NAME,
        user=DB_USER, password=DB_PASS,
        charset="utf8mb4", collation="utf8mb4_unicode_ci",
    )


def get_or_create_source(cursor, conn):
    cursor.execute(
        "SELECT id FROM review_sources WHERE platform='google_maps' AND external_id=%s LIMIT 1",
        (PLACE_ID,)
    )
    row = cursor.fetchone()
    if row:
        return row[0]
    sid = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO review_sources (id,platform,external_id,name,config,is_active,created_at,updated_at) "
        "VALUES (%s,'google_maps',%s,'Qassim University (Google Maps - ScrapingBee)',%s,1,NOW(),NOW())",
        (sid, PLACE_ID, json.dumps({"method": "scrapingbee"})),
    )
    conn.commit()
    return sid


def save_reviews_to_db(reviews):
    if not reviews:
        return 0
    conn = get_db_connection()
    cur = conn.cursor()
    source_id = get_or_create_source(cur, conn)
    new_count = 0
    for item in reviews:
        ext_id = hashlib.md5(
            (item.get("author", "") + "|" + item.get("text", "")[:100] + "|" + str(item.get("rating", ""))).encode()
        ).hexdigest()
        cur.execute("SELECT id FROM reviews WHERE platform='google_maps' AND external_review_id=%s LIMIT 1", (ext_id,))
        if cur.fetchone():
            continue
        url = item.get("author_url", "")
        if url and len(url) > 255:
            url = url[:255]
        cur.execute(
            "INSERT INTO reviews (id,review_source_id,platform,external_review_id,author_name,"
            "rating,content,language,published_at,url,raw_data,"
            "sentiment,sentiment_score,topics,is_analyzed,created_at,updated_at) "
            "VALUES (%s,%s,'google_maps',%s,%s,%s,%s,%s,%s,%s,%s,NULL,NULL,NULL,0,NOW(),NOW())",
            (str(uuid.uuid4()), source_id, ext_id, item.get("author"),
             item.get("rating"), item.get("text", ""),
             item.get("language", "ar"), item.get("date_parsed"),
             url, json.dumps(item, ensure_ascii=False)),
        )
        new_count += 1
    cur.execute("UPDATE review_sources SET last_scraped_at=NOW(),updated_at=NOW() WHERE id=%s", (source_id,))
    conn.commit()
    cur.close()
    conn.close()
    return new_count


def parse_relative_date(text):
    """Convert relative date like '3 months ago' or 'قبل 3 أشهر' to a date."""
    if not text:
        return None
    text = text.strip().lower()
    now = datetime.now()

    patterns_en = [
        (r"(\d+)\s*minute", "minutes"), (r"(\d+)\s*hour", "hours"),
        (r"(\d+)\s*day", "days"), (r"(\d+)\s*week", "weeks"),
        (r"(\d+)\s*month", "months"), (r"(\d+)\s*year", "years"),
        (r"a\s+month", "1month"), (r"a\s+year", "1year"), (r"a\s+week", "1week"),
    ]
    for pattern, unit in patterns_en:
        m = re.search(pattern, text)
        if m:
            if unit.startswith("1"):
                n, unit = 1, unit[1:]
            else:
                n = int(m.group(1))
            if unit == "minutes": return (now - timedelta(minutes=n)).strftime("%Y-%m-%d")
            if unit == "hours": return (now - timedelta(hours=n)).strftime("%Y-%m-%d")
            if unit == "days": return (now - timedelta(days=n)).strftime("%Y-%m-%d")
            if unit in ("week", "weeks"): return (now - timedelta(weeks=n)).strftime("%Y-%m-%d")
            if unit in ("month", "months"): return (now - timedelta(days=n * 30)).strftime("%Y-%m-%d")
            if unit in ("year", "years"): return (now - timedelta(days=n * 365)).strftime("%Y-%m-%d")

    arabic_patterns = [
        (r"قبل\s*(\d+)\s*دقيق", "minutes"), (r"قبل\s*(\d+)\s*ساع", "hours"),
        (r"قبل\s*(\d+)\s*يوم", "days"), (r"قبل\s*(\d+)\s*أسبوع", "weeks"),
        (r"قبل\s*(\d+)\s*شهر", "months"), (r"قبل\s*(\d+)\s*سن", "years"),
    ]
    for pattern, unit in arabic_patterns:
        m = re.search(pattern, text)
        if m:
            n = int(m.group(1))
            if unit == "minutes": return (now - timedelta(minutes=n)).strftime("%Y-%m-%d")
            if unit == "hours": return (now - timedelta(hours=n)).strftime("%Y-%m-%d")
            if unit == "days": return (now - timedelta(days=n)).strftime("%Y-%m-%d")
            if unit == "weeks": return (now - timedelta(weeks=n)).strftime("%Y-%m-%d")
            if unit == "months": return (now - timedelta(days=n * 30)).strftime("%Y-%m-%d")
            if unit == "years": return (now - timedelta(days=n * 365)).strftime("%Y-%m-%d")

    return None


def call_scrapingbee(api_key, params_dict):
    """Call ScrapingBee API with params as GET query string."""
    params_dict["api_key"] = api_key

    print(f"  Calling ScrapingBee API...")
    response = requests.get(
        "https://app.scrapingbee.com/api/v1/",
        params=params_dict,
        timeout=180,
    )

    remaining = response.headers.get("Spb-remaining-api-credit", "?")
    cost = response.headers.get("Spb-cost", "?")
    print(f"  Status: {response.status_code} | Cost: {cost} credits | Remaining: {remaining}")

    if response.status_code != 200:
        print(f"  ERROR: {response.text[:500]}")
        return None

    return response.text


def extract_reviews_from_html(html):
    """Parse Google Maps reviews from rendered HTML using BeautifulSoup."""
    soup = BeautifulSoup(html, "lxml")
    reviews = []

    # Strategy 1: Find review containers by known Google Maps CSS classes
    # Google Maps uses class "jftiEf" for each review container (2024-2026)
    review_containers = soup.select('[data-review-id]')
    if not review_containers:
        review_containers = soup.select('.jftiEf')
    if not review_containers:
        # Try other known container classes
        review_containers = soup.select('.gws-localreviews__google-review')

    # Deduplicate containers by data-review-id (Google Maps nests them multiple times)
    seen_ids = set()
    deduped_containers = []
    for c in review_containers:
        rid = c.get("data-review-id", "")
        if rid and rid in seen_ids:
            continue
        if rid:
            seen_ids.add(rid)
        deduped_containers.append(c)

    print(f"  Found {len(review_containers)} containers → {len(deduped_containers)} unique")
    review_containers = deduped_containers

    for container in review_containers:
        review = {}

        # Review ID
        review["review_id"] = container.get("data-review-id", "")

        # Author name - multiple possible selectors
        for sel in ['.d4r55', '.TSUbDb a', '.review-author', '.WNxzHc a']:
            author_el = container.select_one(sel)
            if author_el:
                review["author"] = author_el.get_text(strip=True)
                break

        # Author URL
        for sel in ['.WNxzHc a', '.d4r55 a', '.TSUbDb a']:
            author_link = container.select_one(sel)
            if author_link and author_link.get('href'):
                review["author_url"] = author_link['href']
                break

        # Rating - from aria-label on star elements (e.g. "4 stars" or "4 نجوم")
        for sel in ['.kvMYJc', '.lTi8oc', '.DU9Pgb', '[role="img"]']:
            star_el = container.select_one(sel)
            if star_el:
                aria = star_el.get('aria-label', '')
                m = re.search(r'(\d)', aria)
                if m:
                    review["rating"] = int(m.group(1))
                    break
        # Fallback: check any element with aria-label containing star/نجم in the container
        if "rating" not in review:
            for el in container.select('[aria-label]'):
                aria = el.get('aria-label', '')
                if re.search(r'star|نجم|نجوم', aria, re.IGNORECASE):
                    m = re.search(r'(\d)', aria)
                    if m:
                        review["rating"] = int(m.group(1))
                        break

        # Date text
        for sel in ['.rsqaWe', '.xRkPPb', '.dehysf', '.DZSIDd']:
            date_el = container.select_one(sel)
            if date_el:
                review["date_text"] = date_el.get_text(strip=True)
                break

        # Review text - the main review body
        for sel in ['.wiI7pd', '.Jtu6Td', '.review-full-text', '.MyEned span']:
            text_el = container.select_one(sel)
            if text_el:
                review["text"] = text_el.get_text(strip=True)
                break

        # "Read more" expanded text
        if not review.get("text"):
            text_el = container.select_one('.MyEned')
            if text_el:
                review["text"] = text_el.get_text(strip=True)

        # If still no text, try getting all text from container (minus author/date)
        if not review.get("text"):
            all_text = container.get_text(separator="\n", strip=True)
            if all_text and len(all_text) > 20:
                review["text"] = all_text

        if review.get("text") or review.get("rating"):
            reviews.append(review)

    # Strategy 2: If no containers found, try regex on raw HTML
    if not reviews:
        print("  No containers found, trying regex fallback...")
        html_text = soup.get_text()

        # Try to find embedded review data in JavaScript
        scripts = soup.find_all('script')
        for script in scripts:
            text = script.string or ""
            # Google Maps sometimes embeds review data as JSON in script tags
            review_matches = re.findall(
                r'\["([^"]{3,50})"\s*,\s*"[^"]*"\s*,\s*(\d)\s*,\s*"([^"]*)"',
                text
            )
            for author, rating, review_text in review_matches:
                if review_text and len(review_text) > 10:
                    reviews.append({
                        "author": author,
                        "rating": int(rating),
                        "text": review_text,
                    })

    # Strategy 3: Try to extract from the protobuf-like data Google Maps uses
    if not reviews:
        # Google Maps embeds data in window.APP_INITIALIZATION_STATE or similar
        all_html = str(soup)
        # Look for patterns like review text blocks
        text_blocks = re.findall(r'class="wiI7pd"[^>]*>([^<]+)</span>', all_html)
        author_blocks = re.findall(r'class="d4r55[^"]*"[^>]*>([^<]+)</div>', all_html)
        date_blocks = re.findall(r'class="rsqaWe"[^>]*>([^<]+)</span>', all_html)
        rating_blocks = re.findall(r'aria-label="(\d)\s*(?:stars?|نجوم|نجمة)"', all_html)

        if text_blocks:
            print(f"  Regex fallback found {len(text_blocks)} text blocks")
            for i, text in enumerate(text_blocks):
                reviews.append({
                    "text": text.strip(),
                    "author": author_blocks[i].strip() if i < len(author_blocks) else None,
                    "rating": int(rating_blocks[i]) if i < len(rating_blocks) else None,
                    "date_text": date_blocks[i].strip() if i < len(date_blocks) else None,
                })

    return reviews


def scrape_reviews(url, api_key, scroll_count=20, max_reviews=0):
    """
    Scrape Google Maps reviews using ScrapingBee.

    Strategy: Use ScrapingBee's js_scenario with simple scroll + wait instructions.
    Google Maps loads reviews in a scrollable side panel. We use evaluate to scroll
    that specific container. To stay within URL size limits, we use a single compact
    evaluate that does multiple scrolls in a loop.
    """
    # Make multiple API calls, each scrolling 12 times (~1 min each)
    # ScrapingBee times out around 15+ scrolls
    SCROLLS_PER_CALL = 12
    total_calls = max(1, (scroll_count + SCROLLS_PER_CALL - 1) // SCROLLS_PER_CALL)

    all_reviews = []
    OUT_DIR.mkdir(exist_ok=True)

    for call_num in range(total_calls):
        n = min(SCROLLS_PER_CALL, scroll_count - call_num * SCROLLS_PER_CALL)
        if n <= 0:
            break

        print(f"\n  --- API Call {call_num + 1}/{total_calls} ({n} scrolls) ---")

        js_code = (
            f"(async function(){{"
            f"var s=document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf')"
            f"||document.querySelector('.m6QErb.DxyBCb')"
            f"||document.querySelector('.m6QErb');"
            f"if(!s)return 'no-container';"
            f"for(var i=0;i<{n};i++){{"
            f"s.scrollTop=s.scrollHeight;"
            f"await new Promise(r=>setTimeout(r,1200));"
            f"}}"
            f"document.querySelectorAll('.w8nwRe,button.M77dve').forEach(b=>b.click());"
            f"return s.scrollHeight;"
            f"}})()"
        )

        js_scenario = {
            "instructions": [
                {"wait": 4000},
                {"evaluate": js_code},
                {"wait": 2000},
            ]
        }

        params = {
            "url": url,
            "render_js": "true",
            "premium_proxy": "true",
            "country_code": "sa",
            "wait": "4000",
            "custom_google": "true",
            "js_scenario": json.dumps(js_scenario),
        }

        html = call_scrapingbee(api_key, params)
        if not html:
            print(f"  Call {call_num + 1} failed, trying next...")
            continue

        # Save raw HTML
        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
        debug_file = OUT_DIR / f"gmaps_raw_{ts}_call{call_num + 1}.html"
        with open(debug_file, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  Raw HTML: {debug_file} ({len(html):,} chars)")

        # Extract reviews from this call
        reviews = extract_reviews_from_html(html)
        print(f"  Extracted {len(reviews)} reviews from call {call_num + 1}")

        all_reviews.extend(reviews)

    # Deduplicate across all calls by review_id
    seen_ids = set()
    unique_reviews = []
    for r in all_reviews:
        rid = r.get("review_id", "")
        if rid:
            if rid in seen_ids:
                continue
            seen_ids.add(rid)
        unique_reviews.append(r)

    print(f"\n  Total across all calls: {len(all_reviews)} → {len(unique_reviews)} unique")

    # Enrich with parsed dates and language detection
    for r in unique_reviews:
        if r.get("date_text"):
            r["date_parsed"] = parse_relative_date(r["date_text"])
        text = r.get("text", "")
        if any(c in text for c in "أبتثجحخدذرزسشصضطظعغفقكلمنهوي"):
            r["language"] = "ar"
        else:
            r["language"] = "en"

    if max_reviews > 0:
        unique_reviews = unique_reviews[:max_reviews]

    return unique_reviews


def main():
    parser = argparse.ArgumentParser(description="Scrape Google Maps Reviews (ScrapingBee)")
    parser.add_argument("--url", default=DEFAULT_URL, help="Google Maps URL")
    parser.add_argument("--api-key", default=SCRAPINGBEE_API_KEY, help="ScrapingBee API key")
    parser.add_argument("--max-reviews", type=int, default=0, help="Max reviews (0 = all)")
    parser.add_argument("--json", action="store_true", help="Output JSON only")
    parser.add_argument("--scroll-count", type=int, default=20, help="Scroll iterations (more = more reviews, each ~10 reviews)")
    args = parser.parse_args()

    api_key = args.api_key
    if not api_key:
        print("ERROR: ScrapingBee API key required.")
        print("  Set SCRAPINGBEE_API_KEY in .env or use --api-key YOUR_KEY")
        return 1

    OUT_DIR.mkdir(exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')

    print(f"{'='*60}")
    print(f"  Google Maps Reviews Scraper (ScrapingBee)")
    print(f"  URL: {args.url[:80]}...")
    print(f"  Scroll iterations: {args.scroll_count}")
    print(f"{'='*60}")

    reviews = scrape_reviews(args.url, api_key, args.scroll_count, args.max_reviews)

    # Dedup by author + text
    seen = set()
    unique = []
    for r in reviews:
        key = hashlib.md5((r.get("author", "") + "|" + r.get("text", "")[:100]).encode()).hexdigest()
        if key not in seen:
            seen.add(key)
            unique.append(r)

    print(f"\n{'='*60}")
    print(f"  DONE: {len(unique)} unique reviews")
    print(f"{'='*60}")

    if unique:
        ratings = {}
        for r in unique:
            rt = r.get("rating", "?")
            ratings[rt] = ratings.get(rt, 0) + 1
        for rt, c in sorted(ratings.items(), key=lambda x: str(x[0]), reverse=True):
            stars = "★" * int(rt) if isinstance(rt, (int, float)) and rt else "?"
            print(f"    {stars} ({rt}): {c} reviews")

        langs = {}
        for r in unique:
            l = r.get("language", "?")
            langs[l] = langs.get(l, 0) + 1
        for l, c in sorted(langs.items()):
            print(f"    Language {l}: {c}")

    # Save JSON
    json_file = OUT_DIR / f"gmaps_reviews_{ts}.json"
    with open(json_file, "w", encoding="utf-8") as fh:
        json.dump(unique, fh, ensure_ascii=False, indent=2)
    print(f"\n  JSON: {json_file}")

    # Save CSV
    csv_file = OUT_DIR / f"gmaps_reviews_{ts}.csv"
    with open(csv_file, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["#", "Author", "Rating", "Date", "Date (parsed)", "Review Text", "Language", "Review ID"])
        for i, r in enumerate(unique, 1):
            w.writerow([
                i, r.get("author", ""), r.get("rating", ""),
                r.get("date_text", ""), r.get("date_parsed", ""),
                r.get("text", ""), r.get("language", ""),
                r.get("review_id", ""),
            ])
    print(f"  CSV:  {csv_file}")

    if args.json:
        print(json.dumps(unique, ensure_ascii=False, indent=2))
    elif unique:
        try:
            n = save_reviews_to_db(unique)
            print(f"  Saved to DB: {n} new (of {len(unique)} unique)")
        except Exception as e:
            print(f"  DB save error: {e}")
            print(f"  Results safe in: {json_file}")
    else:
        print("  No reviews found. Check the raw HTML file for debugging.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
