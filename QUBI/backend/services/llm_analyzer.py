"""
LLM-Powered Data Analysis — Groq (free) → Anthropic → fallback.

Priority:
1. Groq API (free tier, Llama 3.3 70B, 30 req/min)
2. Anthropic Claude (paid, most intelligent)
3. None → falls back to rule-based in ai_service.py
"""

import os
import json
from typing import Optional, List, Tuple, Dict
import pandas as pd
import numpy as np


def _build_schema_prompt(tables_info: list) -> str:
    """Build a prompt describing the data for the LLM."""
    sections = []
    for tbl in tables_info:
        name = tbl["name"]
        rows = tbl["rows"]
        cols_desc = []
        for c in tbl["columns"]:
            col_name = c["name"]
            dtype = c["dtype"]
            nunique = c["nunique"]
            sample = c.get("sample_values", [])
            null_pct = c.get("null_pct", 0)
            sample_str = ", ".join(str(s) for s in sample[:5])
            cols_desc.append(
                f"  - {col_name} ({dtype}, {nunique} unique, {null_pct}% null) — أمثلة: [{sample_str}]"
            )
        cols_text = "\n".join(cols_desc)
        sections.append(f"### جدول: {name} ({rows:,} سجل)\n{cols_text}")

    return "\n\n".join(sections)


def _extract_table_info(df: pd.DataFrame, table_name: str) -> dict:
    """Extract schema info from a DataFrame for the prompt."""
    columns = []
    for col in df.columns:
        series = df[col]
        dtype = str(series.dtype)
        nunique = 0
        sample_values = []
        null_pct = round(series.isna().mean() * 100, 1)

        try:
            non_null = series.dropna()
            if len(non_null) > 0:
                nunique = non_null.nunique()
                sample = non_null.head(8).tolist()
                sample_values = [str(v)[:50] for v in sample]
        except Exception:
            pass

        columns.append({
            "name": col,
            "dtype": dtype,
            "nunique": nunique,
            "null_pct": null_pct,
            "sample_values": sample_values,
        })

    return {
        "name": table_name,
        "rows": len(df),
        "columns": columns,
    }


SYSTEM_PROMPT = """أنت محلل بيانات محترف ومستشار لدعم اتخاذ القرار. مهمتك تحليل بنية البيانات المعطاة وتقترح لوحة بيانات (dashboard) احترافية تساعد متخذي القرار.

مهامك:
1. اقترح 6 مؤشرات أداء رئيسية (KPIs) — الأهم لصناع القرار
2. اقترح 12-14 رسم بياني يكشف رؤى حقيقية وقيّمة
3. اكتب 5 رؤى واكتشافات ذكية من البيانات

القواعد الصارمة:
- تجاهل أعمدة ID والأعمدة التقنية (token, uuid, hash, password, session, ip_address, user_agent, otp, saml, ldap, oauth, api_key, nonce, remote_uuid, remember_token)
- تجاهل الأعمدة التي >80% فارغة
- ركّز فقط على الأعمدة ذات المعنى للأعمال والقرارات
- كل العناوين والأوصاف بالعربي الفصيح — ممنوع أي كلمة إنجليزية
- لأعمدة boolean (0/1): اكتب وصف عربي واضح حسب سياق العمود (مثل: "متقاعد/نشط"، "منشور/مسودة")
- لا تستخدم "نسبة نعم" أو "نسبة لا" — دائماً اكتب المعنى الحقيقي
- أعطِ أوصاف مختصرة تشرح لماذا هذا الرسم مهم لمتخذ القرار
- نوّع أنواع الرسوم: pie للفئات القليلة (2-6)، bar للمقارنات، line للاتجاهات الزمنية، scatter للعلاقات
- اقترح cross-analysis بين جدولين إذا أمكن (مثلاً: متوسط X حسب Y)

أرجع النتيجة بصيغة JSON فقط — بدون أي نص أو شرح أو markdown."""

USER_PROMPT_TEMPLATE = """حلل البيانات التالية واقترح أفضل لوحة بيانات لدعم متخذي القرار:

{schema}

أرجع JSON فقط بهذا الشكل (بدون ```json أو أي markdown):
{{
  "kpis": [
    {{
      "label": "عنوان عربي واضح",
      "column": "اسم_العمود_من_البيانات",
      "aggregation": "count|sum|avg|nunique|pct_true",
      "icon": "database|percent|trending-up|hash|activity|bar-chart"
    }}
  ],
  "charts": [
    {{
      "chart_type": "bar|pie|line|scatter",
      "title": "عنوان عربي واضح",
      "description": "وصف مختصر بالعربي يشرح لماذا هذا الرسم مهم",
      "x_column": "اسم_عمود_المحور_الأفقي",
      "y_column": "اسم_عمود_المحور_الرأسي_أو_null",
      "aggregation": "count|mean|rate|histogram|count_over_time|bool_pie",
      "table": "اسم_الجدول_المصدر",
      "bool_labels": ["تسمية_false", "تسمية_true"]
    }}
  ],
  "insights": [
    {{
      "icon": "📊|🔗|⚠️|📈|💡",
      "title": "عنوان عربي",
      "description": "وصف مفصل بالعربي يدعم اتخاذ القرار — اذكر أرقام ونسب",
      "importance": "high|medium"
    }}
  ]
}}"""


def _get_groq_key() -> str:
    """Get Groq API key from env or .env files."""
    key = os.environ.get("GROQ_API_KEY", "")
    if key:
        return key
    for path in [".env", "../.env", "backend/.env", os.path.expanduser("~/.groq_api_key")]:
        try:
            expanded = os.path.expanduser(path) if "~" in path else path
            if os.path.exists(expanded):
                with open(expanded) as f:
                    for line in f:
                        if "GROQ_API_KEY" in line:
                            return line.split("=", 1)[1].strip().strip('"').strip("'")

        except Exception:
            continue
    return ""


def _get_anthropic_key() -> str:
    """Get Anthropic API key from env or .env files."""
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if key:
        return key
    for path in [".env", "../.env", "backend/.env", os.path.expanduser("~/.anthropic_api_key")]:
        try:
            expanded = os.path.expanduser(path) if "~" in path else path
            if os.path.exists(expanded):
                with open(expanded) as f:
                    for line in f:
                        if "ANTHROPIC_API_KEY" in line:
                            return line.split("=", 1)[1].strip().strip('"').strip("'")
                        elif line.strip().startswith("sk-ant-"):
                            return line.strip()
        except Exception:
            continue
    return ""


def _call_groq(schema_text: str) -> Optional[dict]:
    """Call Groq API (free tier — Llama 3.3 70B)."""
    api_key = _get_groq_key()
    if not api_key:
        print("[LLM] No Groq API key found")
        return None

    try:
        from groq import Groq
        client = Groq(api_key=api_key)

        user_prompt = USER_PROMPT_TEMPLATE.format(schema=schema_text)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4000,
            response_format={"type": "json_object"},
        )

        text = response.choices[0].message.content.strip()
        result = json.loads(text)
        print(f"[LLM] ✅ Groq analysis complete — {len(result.get('charts', []))} charts, {len(result.get('insights', []))} insights")
        return result

    except Exception as e:
        print(f"[LLM] Groq error: {e}")
        return None


def _call_anthropic(schema_text: str) -> Optional[dict]:
    """Call Anthropic Claude API (paid)."""
    api_key = _get_anthropic_key()
    if not api_key:
        print("[LLM] No Anthropic API key found")
        return None

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)

        user_prompt = USER_PROMPT_TEMPLATE.format(schema=schema_text)

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        text = response.content[0].text.strip()
        # Remove markdown code blocks if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text[:-3]
        if text.startswith("json"):
            text = text[4:]

        result = json.loads(text.strip())
        print(f"[LLM] ✅ Anthropic analysis complete — {len(result.get('charts', []))} charts, {len(result.get('insights', []))} insights")
        return result

    except Exception as e:
        print(f"[LLM] Anthropic error: {e}")
        return None


def analyze_with_llm(tables_data: list) -> Optional[dict]:
    """
    Analyze data using LLM. Priority: Groq (free) → Anthropic (paid) → None.
    Returns None if no API available (falls back to rule-based).
    """
    # Build schema info
    tables_info = []
    for name, df in tables_data:
        info = _extract_table_info(df, name)
        tables_info.append(info)

    schema_text = _build_schema_prompt(tables_info)

    # Try Groq first (free)
    print("[LLM] Trying Groq (free)...")
    result = _call_groq(schema_text)
    if result:
        return result

    # Try Anthropic (paid)
    print("[LLM] Trying Anthropic...")
    result = _call_anthropic(schema_text)
    if result:
        return result

    # No LLM available
    print("[LLM] No LLM available — falling back to rule-based analysis")
    return None


def compute_kpi_value(df: pd.DataFrame, kpi_spec: dict) -> Optional[dict]:
    """Compute actual KPI value from a spec returned by LLM."""
    col = kpi_spec.get("column", "")
    agg = kpi_spec.get("aggregation", "count")
    label = kpi_spec.get("label", "")
    icon = kpi_spec.get("icon", "database")

    try:
        if agg == "count":
            value = f"{len(df):,}"
        elif agg == "sum" and col in df.columns:
            value = f"{df[col].sum():,.0f}"
        elif agg == "avg" and col in df.columns:
            mean = df[col].mean()
            value = f"{mean:,.1f}" if abs(mean) >= 10 else f"{mean:,.2f}"
        elif agg == "nunique" and col in df.columns:
            value = f"{df[col].nunique():,}"
        elif agg == "pct_true" and col in df.columns:
            nn = df[col].dropna()
            if len(nn) == 0:
                return None
            # Handle both boolean (0/1) and string status columns
            if pd.api.types.is_numeric_dtype(nn):
                pct = round((nn == 1).sum() / len(nn) * 100, 1)
            else:
                # String column — count "active"-like values as True
                positive = {"active", "نشط", "yes", "نعم", "true", "1",
                            "published", "منشور", "approved", "مقبول",
                            "completed", "مكتمل", "enabled", "open"}
                pct = round(nn.astype(str).str.lower().str.strip().isin(positive).sum() / len(nn) * 100, 1)
            value = f"{pct}%"
            return {"label": label, "value": value, "icon": icon,
                    "trend": {"value": pct, "direction": "up" if pct > 50 else "down"}}
        else:
            value = f"{len(df):,}"

        return {"label": label, "value": value, "icon": icon}
    except Exception:
        return None
