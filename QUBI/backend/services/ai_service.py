"""
Professional AI Analysis Engine v2.
- Analyzes ALL tables in a multi-table dataset
- Auto-cleans data before analysis
- Generates decision-support KPIs and charts
- Produces diverse chart types: bar, pie, stacked_bar, heatmap, frequency_matrix, radar, treemap, area, line, scatter, donut
- Full Arabic output
"""

import pandas as pd
import numpy as np
import os
import re
import math
import json as _json
from services.duckdb_service import get_dataframe, list_dataset_tables


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# COLUMN INTELLIGENCE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_SKIP_EXACT = {
    "id", "uuid", "guid", "pk", "remember_token", "password", "slug",
    "created_at", "updated_at", "deleted_at", "email_verified_at",
    "profile_image", "google_drive_link", "one_drive_link",
    "research_gate_link", "google_scholar_link", "remote_uuid",
    "batch_uuid", "request_hash", "request_params", "response_data",
    "full_record", "full_report", "properties", "payload",
    "input", "last_output", "options", "arguments", "help_text",
    "category_rankings", "citation_data", "sdg_info", "funding_info",
    "request_url",
    # ID columns that have readable name counterparts — skip these
    "faculty_no", "department_no", "college_no", "dept_no",
    "employee_id", "user_name",
}
_SKIP_CONTAINS = [
    "token", "password", "hash", "secret", "cookie", "session",
    "ip_address", "user_agent", "otp", "verification", "reset",
    "activation", "saml_", "ldap_", "oauth", "api_key", "nonce",
    "_uuid", "_guid", "show_english", "show_arabic", "_link",
    "remote_uuid", "remember_", "career_id", "scientific_rank_id",
    "skip_scholar", "second_saml", "first_saml", "is_first_saml",
    "class_name", "signature", "schedule_expression",
]
_JUNK_VALUES = {"", "nan", "none", "null", "n/a", "na", "-", "not found", "undefined", "0"}


def _skip_col(name):
    low = name.lower().strip()
    if low in _SKIP_EXACT:
        return True
    if low.endswith("_id") or low.endswith("_key") or low.endswith("_pk"):
        return True
    return any(s in low for s in _SKIP_CONTAINS)


def _is_auto_increment(series):
    if not pd.api.types.is_numeric_dtype(series):
        return False
    nn = series.dropna()
    if len(nn) < 20:
        return False
    return nn.nunique() / len(nn) > 0.95 and (nn.is_monotonic_increasing or nn.is_monotonic_decreasing)


def _clean_cat(series):
    s = series.astype(str).str.strip()
    s = s.where(~s.str.startswith("["), np.nan)
    s = s.where(~s.str.startswith("{"), np.nan)
    s = s.where(~s.str.lower().isin(_JUNK_VALUES), np.nan)
    return s.dropna()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATA PREPROCESSING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _preprocess(df):
    """Clean dataframe before analysis."""
    null_pct = df.isna().mean()
    keep_cols = null_pct[null_pct < 0.85].index.tolist()
    df = df[keep_cols]

    keep = [c for c in df.columns if not _skip_col(c)]
    df = df[keep]

    keep = [c for c in df.columns if not _is_auto_increment(df[c])]
    df = df[keep]

    for col in df.select_dtypes(include=["object"]).columns:
        sample = df[col].dropna().head(20)
        if len(sample) == 0:
            continue
        try:
            import warnings
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                parsed = pd.to_datetime(sample, errors="coerce", infer_datetime_format=True)
                if parsed.notna().mean() > 0.8:
                    df[col] = pd.to_datetime(df[col], errors="coerce", infer_datetime_format=True)
        except Exception:
            pass

    return df


def _classify(df):
    """Classify preprocessed columns into types."""
    numeric, categorical, boolean, dates = [], [], [], []

    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            dates.append(col)
        elif pd.api.types.is_numeric_dtype(df[col]):
            nn = df[col].dropna()
            if len(nn) == 0 or nn.nunique() <= 1:
                continue
            if set(nn.unique()).issubset({0, 1, 0.0, 1.0}):
                boolean.append(col)
            else:
                numeric.append(col)
        else:
            try:
                cleaned = _clean_cat(df[col])
                nuniq = cleaned.nunique()
                if 2 <= nuniq <= 50:
                    categorical.append(col)
            except Exception:
                continue

    return numeric, categorical, boolean, dates


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ARABIC LABELS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

_AR = {
    "name": "الاسم", "email": "البريد", "phone": "الهاتف",
    "phone_no": "رقم الهاتف", "mobile_no": "الجوال", "address": "العنوان",
    "gender": "الجنس", "age": "العمر", "about_me": "نبذة",
    "availability_time": "وقت التواجد",
    "status": "الحالة", "rank": "الرتبة الأكاديمية",
    "dept": "القسم", "department": "القسم", "department_no": "رقم القسم",
    "college": "الكلية", "faculty": "الكلية",
    "faculty_no": "رقم الكلية", "title": "العنوان", "type": "النوع",
    "category": "التصنيف", "employee_id": "رقم الموظف",
    "institution": "المؤسسة", "specialization": "التخصص",
    "qualification": "المؤهل", "degree": "الدرجة العلمية",
    "publications": "المنشورات", "visits": "الزيارات", "rating": "التقييم",
    "portal": "المنصة البحثية", "goal": "الهدف البحثي",
    "journal": "المجلة", "publisher": "الناشر",
    "journal_title": "المجلة", "publisher_name": "الناشر",
    "citations": "الاستشهادات", "times_cited": "مرات الاستشهاد",
    "citation_count": "عدد الاستشهادات",
    "impact_factor": "معامل التأثير", "quartile": "الربع",
    "research_area": "مجال البحث", "year": "السنة",
    "publication_year": "سنة النشر", "publication_type": "نوع المنشور",
    "is_published": "حالة النشر", "is_active": "حالة النشاط",
    "is_retired": "حالة التقاعد",
    "country": "الدولة", "city": "المدينة", "date": "التاريخ",
    "level": "المستوى", "source": "المصدر", "score": "الدرجة",
    "count": "العدد", "total": "الإجمالي", "description": "الوصف",
    "no_of_research": "عدد الأبحاث", "section": "القسم الأكاديمي",
    "edu_stage": "المرحلة الدراسية", "course_name": "اسم المقرر",
    "course_code": "رمز المقرر",
    "endpoint_type": "نوع الطلب", "is_from_cache": "من الذاكرة المؤقتة",
    "error_occurred": "حدوث خطأ", "response_time_ms": "زمن الاستجابة",
    "response_status": "حالة الاستجابة",
    "method": "الطريقة", "priority": "الأولوية",
    "jif_quartile": "ربع معامل التأثير", "jci_quartile": "ربع JCI",
    "jif": "معامل التأثير JIF", "jci": "مؤشر JCI",
    "total_citations": "إجمالي الاستشهادات",
    "citable_items": "العناصر القابلة للاستشهاد",
    "immediacy_index": "مؤشر الفورية",
    "report_year": "سنة التقرير",
    "oa_status": "حالة الوصول المفتوح",
    "language": "اللغة", "publisher": "الناشر",
    "references_count": "عدد المراجع",
    "usage_count_180": "الاستخدام (180 يوم)",
    "usage_count_all": "إجمالي الاستخدام",
    "page_count": "عدد الصفحات",
    "day": "اليوم", "start_time": "وقت البداية", "end_time": "وقت النهاية",
    "has_data": "يوجد بيانات",
    "run_count": "عدد التشغيل", "success_count": "مرات النجاح",
    "failure_count": "مرات الفشل",
    "is_enabled": "مفعّل", "is_hidden": "مخفي", "is_scheduled": "مجدول",
    "last_status": "آخر حالة", "group": "المجموعة",
    "is_successful": "ناجح", "api_calls_count": "عدد استدعاءات API",
    "is_primary": "أساسي",
    "classification": "التصنيف",
    "name_ar": "الاسم بالعربي", "name_en": "الاسم بالإنجليزي",
}

_BOOL_LABELS = {
    "is_published": ("غير منشور", "منشور"),
    "is_active": ("غير نشط", "نشط"),
    "is_retired": ("غير متقاعد", "متقاعد"),
    "is_from_cache": ("طلب مباشر", "من الذاكرة المؤقتة"),
    "error_occurred": ("بدون خطأ", "حدث خطأ"),
    "is_successful": ("فاشل", "ناجح"),
    "is_enabled": ("معطّل", "مفعّل"),
    "is_hidden": ("ظاهر", "مخفي"),
    "is_scheduled": ("غير مجدول", "مجدول"),
    "has_data": ("بدون بيانات", "يوجد بيانات"),
    "is_primary": ("ثانوي", "أساسي"),
}

_WORD_AR = {
    "is": "", "the": "", "a": "", "an": "", "of": "", "by": "", "from": "من",
    "total": "إجمالي", "count": "عدد", "number": "عدد", "avg": "متوسط",
    "average": "متوسط", "sum": "مجموع", "max": "أعلى", "min": "أقل",
    "rate": "معدل", "ratio": "نسبة", "percent": "نسبة",
    "active": "نشط", "inactive": "غير نشط", "status": "الحالة",
    "type": "النوع", "name": "الاسم", "date": "التاريخ", "time": "الوقت",
    "error": "خطأ", "success": "نجاح", "failed": "فشل", "cache": "ذاكرة مؤقتة",
    "response": "استجابة", "request": "طلب", "endpoint": "نقطة نهاية",
    "user": "مستخدم", "users": "المستخدمين", "admin": "مشرف",
    "research": "بحث", "published": "منشور", "publication": "منشور",
    "department": "القسم", "college": "الكلية", "faculty": "الكلية",
    "student": "طالب", "teacher": "معلم", "professor": "أستاذ",
    "log": "سجل", "logs": "السجلات", "api": "واجهة برمجية",
    "clarivate": "كلاريفيت", "scholar": "سكولار", "google": "جوجل",
    "academic": "أكاديمي", "qualification": "مؤهل", "qualifications": "المؤهلات",
    "interests": "الاهتمامات", "interest": "اهتمام",
    "tag": "وسم", "tags": "الأوسمة", "backup": "نسخة احتياطية",
    "researchers": "الباحثين", "researcher": "باحث",
    "teaching": "تدريس", "materials": "مواد", "material": "مادة",
    "categories": "التصنيفات", "journal": "مجلة", "reports": "التقارير",
    "office": "مكتب", "hours": "ساعات", "business": "عمل", "cards": "بطاقات",
    "optional": "اختياري", "infos": "معلومات", "info": "معلومة",
    "wos": "ويب أوف ساينس",
    # IT terms
    "task": "مهمة", "tasks": "المهام", "incident": "حادثة", "incidents": "الحوادث",
    "catalog": "كتالوج", "service": "خدمة", "services": "الخدمات",
    "install": "تثبيت", "scanner": "ماسح", "domain": "نطاق",
    "join": "انضمام", "zone": "منطقة", "area": "منطقة",
    "critical": "حرج", "moderate": "متوسط", "planning": "تخطيط",
    "request": "طلب", "support": "دعم", "network": "شبكة",
    "server": "خادم", "system": "نظام", "security": "أمان",
    "setup": "إعداد", "configure": "تكوين", "deploy": "نشر",
    "maintenance": "صيانة", "upgrade": "ترقية",
    "printer": "طابعة", "monitor": "شاشة",
    "short": "قصير", "description": "الوصف", "priority": "الأولوية",
    "state": "الحالة", "closed": "مغلق", "resolved": "محلول",
    "assigned": "معيّن", "category": "الفئة",
    "change": "تغيير", "problem": "مشكلة",
    "password": "كلمة المرور", "issue": "مشكلة", "issues": "المشاكل",
    "ticket": "تذكرة", "reset": "إعادة تعيين",
    "add": "إضافة", "remove": "حذف", "create": "إنشاء",
    "delete": "حذف", "share": "مشاركة", "transfer": "نقل",
    "power": "كهرباء", "outage": "انقطاع", "patch": "تصحيح",
    "license": "رخصة", "renewal": "تجديد",
    "file": "ملف", "files": "ملفات",
    "to": "إلى", "for": "لـ", "in": "في", "at": "في",
    "on": "على", "with": "مع", "about": "حول",
    "no": "لا", "not": "غير", "all": "الكل",
}

_VALUE_AR = {
    "male": "ذكر", "female": "أنثى", "m": "ذكر", "f": "أنثى",
    "active": "نشط", "inactive": "غير نشط", "retired": "متقاعد",
    "enabled": "مفعّل", "disabled": "معطّل",
    "approved": "معتمد", "pending": "معلّق", "rejected": "مرفوض",
    "published": "منشور", "draft": "مسودة", "unpublished": "غير منشور",
    "completed": "مكتمل", "open": "مفتوح", "closed": "مغلق",
    "yes": "نعم", "no": "لا", "true": "نعم", "false": "لا",
    "high": "عالي", "medium": "متوسط", "low": "منخفض",
    "professor": "أستاذ", "associate professor": "أستاذ مشارك",
    "assistant professor": "أستاذ مساعد", "lecturer": "محاضر",
    "teaching assistant": "معيد",
    "journal": "مجلة", "conference": "مؤتمر",
    "book chapter": "فصل كتاب", "book": "كتاب", "article": "مقالة",
    "research article": "مقالة بحثية",
    "google scholar": "قوقل سكولار", "wos": "ويب أوف ساينس",
    "scopus": "سكوبس",
    "phd": "دكتوراه", "master": "ماجستير", "bachelor": "بكالوريوس",
    "diploma": "دبلوم", "doctorate": "دكتوراه",
    "other": "أخرى", "unknown": "غير معروف",
    "accepted": "مقبول", "rejected": "مرفوض", "canceled": "ملغي",
    "cancelled": "ملغي", "waiting": "بانتظار", "processing": "قيد المعالجة",
    "submitted": "مقدّم", "reviewed": "مراجَع", "returned": "مُعاد",
    "on hold": "معلّق", "in review": "قيد المراجعة",
    "confirmed": "مؤكد", "unconfirmed": "غير مؤكد",
    "running": "يعمل", "stopped": "متوقف", "finished": "منتهي",
    "not started": "لم يبدأ", "overdue": "متأخر",
    "q1": "Q1", "q2": "Q2", "q3": "Q3", "q4": "Q4",
    "sunday": "الأحد", "monday": "الاثنين", "tuesday": "الثلاثاء",
    "wednesday": "الأربعاء", "thursday": "الخميس",
    "saturday": "السبت", "friday": "الجمعة",
    "book in series": "كتاب في سلسلة",
    "success": "نجاح", "failure": "فشل", "error": "خطأ",
    "am": "صباحاً", "pm": "مساءً",
    "internal": "داخلي", "external": "خارجي",
    # IT / Service Tasks
    "catalog task": "مهمة كتالوج", "incident": "حادثة", "incident task": "مهمة حادثة",
    "task": "مهمة", "catalog": "كتالوج", "service request": "طلب خدمة",
    "change request": "طلب تغيير", "problem": "مشكلة",
    "critical": "حرج", "moderate": "متوسط", "planning": "تخطيط",
    "install": "تثبيت", "scanner": "ماسح", "domain": "نطاق",
    "join": "انضمام", "join to domain": "انضمام للنطاق",
    "install a scanner": "تثبيت ماسح ضوئي",
    "new": "جديد", "assign": "تعيين", "assigned": "معيّن",
    "resolved": "محلول", "work in progress": "قيد العمل",
    "on hold": "معلّق", "awaiting": "بانتظار",
    "zone": "منطقة", "area": "منطقة", "region": "منطقة",
    "request": "طلب", "service": "خدمة", "support": "دعم",
    "maintenance": "صيانة", "upgrade": "ترقية", "update": "تحديث",
    "reset": "إعادة تعيين", "setup": "إعداد", "configure": "تكوين",
    "deploy": "نشر", "backup": "نسخ احتياطي", "restore": "استعادة",
    "network": "شبكة", "server": "خادم", "database": "قاعدة بيانات",
    "application": "تطبيق", "system": "نظام", "hardware": "عتاد",
    "software": "برمجيات", "security": "أمان", "access": "وصول",
    "permission": "صلاحية", "account": "حساب", "email": "بريد إلكتروني",
    "printer": "طابعة", "monitor": "شاشة", "laptop": "حاسب محمول",
    "desktop": "حاسب مكتبي", "phone": "هاتف", "mobile": "جوال",
    "vpn": "VPN", "wifi": "واي فاي", "internet": "إنترنت",
    "password": "كلمة المرور", "issue": "مشكلة", "issues": "المشاكل",
    "ticket": "تذكرة", "tickets": "التذاكر",
    "reset password": "إعادة تعيين كلمة المرور",
    "network issue": "مشكلة شبكة",
    "add user": "إضافة مستخدم", "remove user": "حذف مستخدم",
    "create account": "إنشاء حساب", "delete account": "حذف حساب",
    "file share": "مشاركة ملفات", "data transfer": "نقل بيانات",
    "power outage": "انقطاع كهرباء", "hardware failure": "عطل عتاد",
    "software installation": "تثبيت برمجيات",
    "license renewal": "تجديد رخصة", "patch update": "تحديث تصحيحي",
}

_TABLE_AR = {
    "users": "المستخدمين", "research": "الأبحاث", "researchers": "الباحثين",
    "research_interests": "الاهتمامات البحثية",
    "research_categories": "تصنيفات الأبحاث",
    "research_interest_tags": "أوسمة الاهتمامات البحثية",
    "academic_qualifications": "المؤهلات الأكاديمية",
    "teaching_materials": "المواد التدريسية",
    "clarivate_publications": "منشورات كلاريفيت",
    "clarivate_journals": "مجلات كلاريفيت",
    "clarivate_journal_reports": "تقارير المجلات",
    "clarivate_api_logs": "سجلات كلاريفيت",
    "clarivate_api_cache": "ذاكرة كلاريفيت",
    "office_hours": "الساعات المكتبية",
    "business_cards": "بطاقات العمل",
    "optional_faculty_infos": "معلومات اختيارية",
    "commands": "الأوامر",
    "activity_log": "سجل النشاط",
    "sessions": "الجلسات",
    "research_backup": "نسخة احتياطية للأبحاث",
    "model_has_roles": "أدوار المستخدمين",
    "roles": "الأدوار", "permissions": "الصلاحيات",
}


def _ar_table(name):
    low = name.lower().strip().replace("tbl_", "")
    if low in _TABLE_AR:
        return _TABLE_AR[low]
    return _ar(low)


_LLM_TRANSLATION_CACHE = {}

def _translate_value(val):
    """Translate English data values to Arabic. Handles multi-word values and number prefixes."""
    if not val or not isinstance(val, str):
        return val

    stripped = val.strip()

    # Handle "N text" pattern (e.g., "1 critical", "5 planning")
    import re as _re
    m = _re.match(r'^(\d+)\s+(.+)$', stripped)
    if m:
        num, text = m.group(1), m.group(2)
        translated_text = _translate_value(text)
        if translated_text != text:
            return "{} {}".format(num, translated_text)

    low = stripped.lower()
    if low in _VALUE_AR:
        return _VALUE_AR[low]
    # Check LLM cache
    if low in _LLM_TRANSLATION_CACHE:
        return _LLM_TRANSLATION_CACHE[low]
    # If it's all ASCII (English), try word-by-word translation
    if stripped.isascii() and len(stripped) > 1:
        words = low.replace("_", " ").replace("-", " ").split()
        translated = []
        for w in words:
            if w in _VALUE_AR:
                translated.append(_VALUE_AR[w])
            elif w in _WORD_AR and _WORD_AR[w]:
                translated.append(_WORD_AR[w])
            else:
                translated.append(w)
        result = " ".join(translated)
        if result != low:
            return result
    return val


def _batch_translate_values(values):
    """Use Groq LLM to translate a batch of English values to Arabic."""
    # Filter only English values not in cache
    to_translate = []
    for v in values:
        if isinstance(v, str) and v.isascii() and len(v) > 1:
            low = v.lower().strip()
            if low not in _VALUE_AR and low not in _LLM_TRANSLATION_CACHE:
                to_translate.append(v)

    if not to_translate:
        return

    # Deduplicate
    to_translate = list(set(to_translate))[:30]

    try:
        import os
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.environ.get("GROQ_API_KEY", "")
        if not api_key:
            return

        from groq import Groq
        client = Groq(api_key=api_key)

        prompt = "ترجم كل قيمة من الإنجليزية للعربية. أجب بصيغة JSON فقط: {\"english\": \"arabic\"}.\n\nالقيم:\n"
        prompt += "\n".join(["- " + v for v in to_translate])

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=1000,
        )
        text = response.choices[0].message.content.strip()
        # Parse JSON from response
        import json as _j
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        result = _j.loads(text)
        if isinstance(result, dict):
            for eng, arb in result.items():
                _LLM_TRANSLATION_CACHE[eng.lower().strip()] = arb
    except Exception:
        pass


def _ar(col):
    low = col.lower().strip()
    if low in _AR:
        return _AR[low]
    for prefix in ("is_", "has_", "can_", "should_"):
        if low.startswith(prefix) and low in _AR:
            return _AR[low]
    words = low.replace("_", " ").split()
    translated = []
    for w in words:
        if w in _WORD_AR:
            if _WORD_AR[w]:
                translated.append(_WORD_AR[w])
        elif w in _AR:
            translated.append(_AR[w])
        else:
            translated.append(w)
    result = " ".join(translated)
    return result if result else col


def _bool_lbl(col):
    return _BOOL_LABELS.get(col.lower().strip(), ("لا", "نعم"))


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ANALYSIS ENGINE v2 — Diverse chart generation
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _analyze_table(df_raw, table_label=""):
    """Analyze a single table and produce diverse chart types."""
    df = _preprocess(df_raw)
    if len(df) == 0 or len(df.columns) == 0:
        return {"insights": [], "charts": [], "kpis": []}

    numeric, categorical, boolean, dates = _classify(df)
    prefix = "{}: ".format(table_label) if table_label else ""

    insights = []
    charts = []
    kpis_data = []
    n = len(df)

    # Track chart types used to ensure diversity
    type_count = {}

    def _add_chart(spec):
        ct = spec.get("chart_type", "bar")
        type_count[ct] = type_count.get(ct, 0) + 1
        charts.append(spec)

    def _should_use(ct, max_per_type=5):
        return type_count.get(ct, 0) < max_per_type

    # ── 1. BOOLEAN ANALYSIS ──
    for col in boolean:
        low = col.lower().strip()
        if low not in _BOOL_LABELS:
            continue
        nn = df[col].dropna()
        if len(nn) == 0:
            continue
        true_n = int((nn == 1).sum())
        true_pct = round(true_n / len(nn) * 100, 1)
        false_pct = round(100 - true_pct, 1)
        lbl = _bool_lbl(col)
        ar = _ar(col)

        insights.append({
            "type": "ratio", "importance": "high",
            "title": "{}نسبة {}".format(prefix, lbl[1]),
            "description": "{}: {}% ({:,} من {:,}) — {}: {}%".format(lbl[1], true_pct, true_n, len(nn), lbl[0], false_pct),
        })
        # Donut for boolean ratios — more visually appealing
        if _should_use("donut"):
            _add_chart({
                "chart_type": "donut", "title": "{}نسبة {}".format(prefix, ar),
                "x_column": col, "aggregation": "bool_pie", "_lbl": lbl,
                "description": "{} مقابل {}".format(lbl[1], lbl[0]),
            })
        kpis_data.append({"label": "نسبة {}".format(lbl[1]), "value": "{}%".format(true_pct),
                          "icon": "percent", "trend": {"value": true_pct, "direction": "up" if true_pct > 50 else "down"}})

        # Gauge for boolean percentage — visual meter
        if _should_use("gauge"):
            _add_chart({
                "chart_type": "gauge",
                "title": "{}مقياس نسبة {}".format(prefix, lbl[1]),
                "x_column": col, "aggregation": "bool_gauge", "_lbl": lbl,
                "description": "نسبة {} من الإجمالي: {}%".format(lbl[1], true_pct),
            })

        # Cross boolean rate with top 2 categorical — stacked bar
        for cat in categorical[:2]:
            ar_cat = _ar(cat)
            if _should_use("stacked_bar"):
                _add_chart({
                    "chart_type": "stacked_bar",
                    "title": "{}{} حسب {}".format(prefix, lbl[1], ar_cat),
                    "x_column": cat, "y_column": col, "aggregation": "bool_stacked",
                    "_lbl": lbl,
                    "description": "توزيع {} و{} حسب {}".format(lbl[1], lbl[0], ar_cat),
                })

    # ── 2. CATEGORICAL ANALYSIS — diversify chart types ──
    cat_chart_cycle = ["pie", "bar", "treemap", "donut", "funnel", "radial_bar", "bar", "treemap"]
    for ci, col in enumerate(categorical):
        cleaned = _clean_cat(df[col])
        if len(cleaned) == 0:
            continue
        nuniq = cleaned.nunique()
        ar = _ar(col)

        # Pick chart type cyclically for diversity
        if nuniq <= 5:
            preferred = cat_chart_cycle[ci % len(cat_chart_cycle)]
            if preferred == "treemap" and nuniq < 3:
                preferred = "pie"
            if preferred == "funnel" and nuniq < 3:
                preferred = "donut"
        elif nuniq <= 12:
            # Alternate between horizontal_bar, treemap, funnel, radial_bar
            cycle_med = ["horizontal_bar", "bar", "treemap", "funnel", "radial_bar"]
            preferred = cycle_med[ci % len(cycle_med)]
        else:
            # High cardinality — horizontal bar or funnel for top items
            preferred = "funnel" if ci % 2 == 0 and _should_use("funnel") else "horizontal_bar"

        if _should_use(preferred):
            _add_chart({
                "chart_type": preferred,
                "title": "{}توزيع {}".format(prefix, ar),
                "x_column": col, "aggregation": "count",
                "description": "عدد السجلات حسب {}".format(ar),
            })

        # Radar for small categories with numeric — great for comparison
        if 3 <= nuniq <= 8 and numeric and _should_use("radar"):
            ar_num = _ar(numeric[0])
            _add_chart({
                "chart_type": "radar",
                "title": "{}مقارنة {} حسب {}".format(prefix, ar_num, ar),
                "x_column": col, "y_column": numeric[0], "aggregation": "mean",
                "description": "مقارنة رادارية لمتوسط {} عبر {}".format(ar_num, ar),
            })

        # Radial bar for small categories — circular comparison
        if 3 <= nuniq <= 8 and _should_use("radial_bar"):
            if numeric:
                ar_num = _ar(numeric[0])
                _add_chart({
                    "chart_type": "radial_bar",
                    "title": "{}��قارنة دائرية: {} حسب {}".format(prefix, ar_num, ar),
                    "x_column": col, "y_column": numeric[0],
                    "aggregation": "mean",
                    "description": "عرض دائري لمتوسط {} عبر {}".format(ar_num, ar),
                })
            else:
                # Use count as radial bar value
                _add_chart({
                    "chart_type": "radial_bar",
                    "title": "{}توزيع دائري: {}".format(prefix, ar),
                    "x_column": col, "aggregation": "count_radial",
                    "description": "عرض دائري لعدد السجلات حسب {}".format(ar),
                })

        # Cross categorical × numeric = bar chart (average comparison)
        for num in numeric[:1]:
            ar_num = _ar(num)
            if _should_use("bar"):
                _add_chart({
                    "chart_type": "bar",
                    "title": "{}متوسط {} حسب {}".format(prefix, ar_num, ar),
                    "x_column": col, "y_column": num, "aggregation": "mean",
                    "description": "مقارنة متوسط {} عبر {}".format(ar_num, ar),
                })

        # Grouped bar for two numeric columns compared across categories
        if 3 <= nuniq <= 10 and len(numeric) >= 2 and _should_use("grouped_bar"):
            ar_n1, ar_n2 = _ar(numeric[0]), _ar(numeric[1])
            _add_chart({
                "chart_type": "grouped_bar",
                "title": "{}{} و{} حسب {}".format(prefix, ar_n1, ar_n2, ar),
                "x_column": col, "columns": [numeric[0], numeric[1]],
                "aggregation": "grouped_mean",
                "description": "مقارنة متجاورة لـ {} و{} عبر {}".format(ar_n1, ar_n2, ar),
            })

    # ── 3. FREQUENCY MATRIX — cross-tab two categorical ──
    added_matrix = 0
    if len(categorical) >= 2:
        for i in range(len(categorical)):
            if added_matrix >= 2:
                break
            for j in range(i + 1, len(categorical)):
                if added_matrix >= 2:
                    break
                c1, c2 = categorical[i], categorical[j]
                cl1, cl2 = _clean_cat(df[c1]), _clean_cat(df[c2])
                n1, n2 = cl1.nunique(), cl2.nunique()
                if 2 <= n1 <= 10 and 2 <= n2 <= 10:
                    ar1, ar2 = _ar(c1), _ar(c2)
                    if _should_use("frequency_matrix"):
                        _add_chart({
                            "chart_type": "frequency_matrix",
                            "title": "{}مصفوفة التكرار: {} × {}".format(prefix, ar1, ar2),
                            "x_column": c1, "y_column": c2, "aggregation": "crosstab",
                            "description": "التكرارات المشتركة بين {} و{}".format(ar1, ar2),
                        })
                    if _should_use("stacked_bar"):
                        _add_chart({
                            "chart_type": "stacked_bar",
                            "title": "{}{} حسب {}".format(prefix, ar1, ar2),
                            "x_column": c1, "y_column": c2, "aggregation": "stacked",
                            "description": "توزيع {} داخل كل فئة من {}".format(ar2, ar1),
                        })
                    added_matrix += 1

    # ── 4. HEATMAP ──
    if len(categorical) >= 2:
        c1, c2 = categorical[0], categorical[1]
        cl1_n, cl2_n = _clean_cat(df[c1]).nunique(), _clean_cat(df[c2]).nunique()
        if 2 <= cl1_n <= 10 and 2 <= cl2_n <= 10:
            ar1, ar2 = _ar(c1), _ar(c2)
            if boolean and _should_use("heatmap"):
                bl = None
                for b in boolean:
                    if b.lower() in _BOOL_LABELS:
                        bl = b
                        break
                if bl:
                    lbl = _bool_lbl(bl)
                    _add_chart({
                        "chart_type": "heatmap",
                        "title": "{}خريطة حرارية: نسبة {} — {} × {}".format(prefix, lbl[1], ar1, ar2),
                        "x_column": c1, "y_column": c2, "z_column": bl,
                        "aggregation": "heatmap_rate",
                        "description": "نسبة {} حسب {} و{}".format(lbl[1], ar1, ar2),
                    })
            elif numeric and _should_use("heatmap"):
                ar_num = _ar(numeric[0])
                _add_chart({
                    "chart_type": "heatmap",
                    "title": "{}خريطة حرارية: متوسط {} — {} × {}".format(prefix, ar_num, ar1, ar2),
                    "x_column": c1, "y_column": c2, "z_column": numeric[0],
                    "aggregation": "heatmap_mean",
                    "description": "متوسط {} حسب {} و{}".format(ar_num, ar1, ar2),
                })

    # ── 5. NUMERIC ANALYSIS ──
    for col in numeric:
        nn = df[col].dropna()
        if len(nn) < 5:
            continue
        ar = _ar(col)
        mean_v, median_v, std_v = nn.mean(), nn.median(), nn.std()

        insights.append({
            "type": "statistic", "importance": "medium",
            "title": "{}إحصائيات {}".format(prefix, ar),
            "description": "المتوسط: {:,.1f} | الوسيط: {:,.1f} | الانحراف: {:,.1f} | أعلى: {:,.1f}".format(mean_v, median_v, std_v, nn.max()),
        })
        if _should_use("area"):
            _add_chart({
                "chart_type": "area", "title": "{}توزيع {}".format(prefix, ar),
                "x_column": col, "aggregation": "histogram",
                "description": "التوزيع التكراري لـ {}".format(ar),
            })
        fmt = "{:,.0f}".format(mean_v) if abs(mean_v) >= 10 else "{:,.2f}".format(mean_v)
        kpis_data.append({"label": "متوسط {}".format(ar), "value": fmt, "icon": "trending-up"})

    # ── 6. CORRELATIONS → scatter ──
    if len(numeric) >= 2:
        corr = df[numeric].corr()
        added = 0
        for i in range(len(numeric)):
            for j in range(i + 1, len(numeric)):
                r = corr.iloc[i, j]
                if abs(r) > 0.4 and added < 2 and _should_use("scatter"):
                    a, b = _ar(numeric[i]), _ar(numeric[j])
                    d = "طردية" if r > 0 else "عكسية"
                    s = "قوية" if abs(r) > 0.8 else "متوسطة"
                    insights.append({
                        "type": "correlation", "importance": "high",
                        "title": "{}علاقة {}: {} و{}".format(prefix, s, a, b),
                        "description": "معامل الارتباط = {:.2f} ({})".format(r, d),
                    })
                    _add_chart({
                        "chart_type": "scatter",
                        "title": "{}{} مقابل {}".format(prefix, a, b),
                        "x_column": numeric[i], "y_column": numeric[j], "aggregation": None,
                        "description": "العلاقة بين {} و{}".format(a, b),
                    })
                    added += 1

    # ── 7. TIME SERIES ──
    for dt in dates:
        if _should_use("line"):
            _add_chart({
                "chart_type": "line", "title": "{}الاتجاه الزمني".format(prefix),
                "x_column": dt, "y_column": "__count__", "aggregation": "count_over_time",
                "description": "تطور عدد السجلات عبر الزمن",
            })
        for num in numeric[:1]:
            ar_num = _ar(num)
            if _should_use("area"):
                _add_chart({
                    "chart_type": "area",
                    "title": "{}اتجاه {} عبر الزمن".format(prefix, ar_num),
                    "x_column": dt, "y_column": num, "aggregation": "avg_over_time",
                    "description": "تطور متوسط {} عبر الزمن".format(ar_num),
                })
        # Composed chart — bar + line overlay for count + cumulative
        if len(numeric) >= 1 and _should_use("composed"):
            ar_num = _ar(numeric[0])
            _add_chart({
                "chart_type": "composed",
                "title": "{}العدد ومتوسط {} عبر الزمن".format(prefix, ar_num),
                "x_column": dt, "columns": ["__count__", numeric[0]],
                "aggregation": "composed_over_time",
                "description": "مقارنة عدد السجلات ومتوسط {} عبر الزمن".format(ar_num),
            })

    # ── 8. DATA QUALITY insight ──
    total_missing = int(df_raw.isna().sum().sum())
    if total_missing > 0:
        pct = round(total_missing / max(df_raw.size, 1) * 100, 1)
        insights.append({
            "type": "quality", "importance": "high" if pct > 20 else "medium",
            "title": "{}جودة البيانات".format(prefix),
            "description": "اكتمال البيانات {:.1f}%".format(100 - pct),
        })

    return {"insights": insights, "charts": charts, "kpis": kpis_data}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CHART DATA COMPUTATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _compute_data(df_raw, chart):
    data = _compute_data_raw(df_raw, chart)
    # Post-process: translate ALL English string values in the returned data
    if data:
        # Collect all English string values for batch translation
        english_vals = set()
        for rec in data:
            for key in ("name", "x", "y"):
                v = rec.get(key)
                if isinstance(v, str) and v.isascii() and len(v) > 1:
                    english_vals.add(v)
            # Also check stacked bar keys (column names that are category values)
            for k in rec.keys():
                if k != "name" and isinstance(k, str) and k.isascii() and len(k) > 1:
                    pass  # keys can't be renamed easily

        if english_vals:
            _batch_translate_values(list(english_vals))

        # Now apply translations to values
        for rec in data:
            for key in ("name", "x", "y"):
                v = rec.get(key)
                if isinstance(v, str):
                    rec[key] = _translate_value(v)

        # Translate stacked bar / crosstab dict keys (category names)
        agg = chart.get("aggregation", "")
        if agg in ("stacked", "bool_stacked") and data:
            translated_data = []
            for rec in data:
                new_rec = {}
                for k, v in rec.items():
                    if k == "name":
                        new_rec[k] = v  # already translated above
                    elif isinstance(k, str) and k.isascii() and len(k) > 1:
                        new_rec[_translate_value(k)] = v
                    else:
                        new_rec[k] = v
                translated_data.append(new_rec)
            data = translated_data
    return data


def _compute_data_raw(df_raw, chart):
    df = _preprocess(df_raw)
    x = chart.get("x_column")
    y = chart.get("y_column")
    agg = chart.get("aggregation")
    ct = chart.get("chart_type")

    try:
        if agg == "bool_pie":
            if x and x in df.columns:
                nn = df[x].dropna()
                lbl = chart.get("_lbl", ("لا", "نعم"))
                if pd.api.types.is_numeric_dtype(nn) and nn.nunique() <= 3:
                    return [{"name": lbl[1], "count": int((nn == 1).sum())},
                            {"name": lbl[0], "count": int((nn == 0).sum())}]
                else:
                    cleaned = _clean_cat(nn)
                    if len(cleaned) == 0:
                        return []
                    vc = cleaned.value_counts().head(10)
                    return [{"name": _translate_value(str(k)), "count": int(v)} for k, v in vc.items()]

        elif agg == "bool_stacked":
            # Stacked bar showing bool=0 vs bool=1 per category
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                lbl = chart.get("_lbl", ("لا", "نعم"))
                ct_table = pd.crosstab(tmp[x], tmp[y])
                top_x = ct_table.sum(axis=1).nlargest(12).index
                ct_table = ct_table.loc[ct_table.index.isin(top_x)]
                result = []
                for row_name in ct_table.index:
                    rec = {"name": _translate_value(str(row_name))}
                    for col_val in ct_table.columns:
                        label = lbl[1] if col_val == 1 else lbl[0]
                        rec[label] = int(ct_table.loc[row_name, col_val])
                    result.append(rec)
                return result

        elif agg == "histogram":
            if x and x in df.columns:
                s = df[x].dropna()
                if len(s) < 5:
                    return []
                bins = min(10, max(5, len(s) // 50))
                c, e = np.histogram(s, bins=bins)
                return [{"range": "{:,.0f} – {:,.0f}".format(e[i], e[i+1]), "count": int(c[i])} for i in range(len(c))]

        elif agg == "count":
            if x and x in df.columns:
                cleaned = _clean_cat(df[x])
                if len(cleaned) == 0:
                    return []
                vc = cleaned.value_counts().head(20)
                total = vc.sum()
                vc = vc[vc / total >= 0.003]  # drop <0.3%
                return [{"name": _translate_value(str(k)), "count": int(v)} for k, v in vc.items()]

        elif agg == "mean":
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                g = tmp.groupby(x)[y].mean().round(2).sort_values(ascending=False).head(15)
                return [{"name": _translate_value(str(k)), "value": float(v)} for k, v in g.items()]

        elif agg == "rate":
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                g = tmp.groupby(x)[y].mean().sort_values(ascending=False).head(15)
                return [{"name": _translate_value(str(k)), "value": round(float(v) * 100, 1)} for k, v in g.items()]

        elif agg == "count_over_time":
            if x and x in df.columns:
                s = df[x].dropna()
                if len(s) == 0:
                    return []
                if not pd.api.types.is_datetime64_any_dtype(s):
                    try:
                        s = pd.to_datetime(s, errors='coerce').dropna()
                    except Exception:
                        return []
                if len(s) == 0:
                    return []
                vc = s.dt.to_period("M").value_counts().sort_index().tail(36)
                return [{"name": str(k), "value": int(v)} for k, v in vc.items()]

        elif agg == "avg_over_time":
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].dropna()
                if len(tmp) == 0 or not pd.api.types.is_datetime64_any_dtype(tmp[x]):
                    return []
                tmp["_period"] = tmp[x].dt.to_period("M")
                g = tmp.groupby("_period")[y].mean().round(2).sort_index().tail(36)
                return [{"name": str(k), "value": float(v)} for k, v in g.items()]

        elif agg == "crosstab":
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp[y] = _clean_cat(df[y])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                ct_table = pd.crosstab(tmp[y], tmp[x])
                top_x = ct_table.sum(axis=0).nlargest(10).index
                top_y = ct_table.sum(axis=1).nlargest(10).index
                ct_table = ct_table.loc[ct_table.index.isin(top_y), ct_table.columns.isin(top_x)]
                result = []
                for row_name in ct_table.index:
                    for col_name in ct_table.columns:
                        result.append({
                            "x": _translate_value(str(col_name)),
                            "y": _translate_value(str(row_name)),
                            "value": int(ct_table.loc[row_name, col_name]),
                        })
                return result

        elif agg == "stacked":
            if x and y and x in df.columns and y in df.columns:
                tmp = df[[x, y]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp[y] = _clean_cat(df[y])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                ct_table = pd.crosstab(tmp[x], tmp[y])
                top_x = ct_table.sum(axis=1).nlargest(10).index
                top_y = ct_table.sum(axis=0).nlargest(6).index
                ct_table = ct_table.loc[ct_table.index.isin(top_x), ct_table.columns.isin(top_y)]
                result = []
                for row_name in ct_table.index:
                    rec = {"name": _translate_value(str(row_name))}
                    for col_name in ct_table.columns:
                        rec[_translate_value(str(col_name))] = int(ct_table.loc[row_name, col_name])
                    result.append(rec)
                return result

        elif agg == "heatmap_rate":
            z = chart.get("z_column")
            if x and y and z and x in df.columns and y in df.columns and z in df.columns:
                tmp = df[[x, y, z]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp[y] = _clean_cat(df[y])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                g = tmp.groupby([x, y])[z].mean().round(3)
                result = []
                for (xv, yv), val in g.items():
                    result.append({
                        "x": _translate_value(str(xv)),
                        "y": _translate_value(str(yv)),
                        "value": round(float(val) * 100, 1),
                    })
                return result

        elif agg == "heatmap_mean":
            z = chart.get("z_column")
            if x and y and z and x in df.columns and y in df.columns and z in df.columns:
                tmp = df[[x, y, z]].copy()
                tmp[x] = _clean_cat(df[x])
                tmp[y] = _clean_cat(df[y])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                g = tmp.groupby([x, y])[z].mean().round(2)
                result = []
                for (xv, yv), val in g.items():
                    result.append({
                        "x": _translate_value(str(xv)),
                        "y": _translate_value(str(yv)),
                        "value": float(val),
                    })
                return result

        elif agg == "count_radial":
            if x and x in df.columns:
                cleaned = _clean_cat(df[x])
                if len(cleaned) == 0:
                    return []
                vc = cleaned.value_counts().head(8)
                return [{"name": _translate_value(str(k)), "value": int(v)} for k, v in vc.items()]

        elif agg == "bool_gauge":
            if x and x in df.columns:
                nn = df[x].dropna()
                lbl = chart.get("_lbl", ("لا", "نعم"))
                if pd.api.types.is_numeric_dtype(nn) and nn.nunique() <= 3:
                    pct = round(float((nn == 1).mean()) * 100, 1)
                else:
                    cleaned = _clean_cat(nn)
                    if len(cleaned) == 0:
                        return []
                    top_val = cleaned.value_counts().index[0]
                    pct = round(float((cleaned == top_val).mean()) * 100, 1)
                    lbl = (lbl[0], _translate_value(str(top_val)))
                return [{"name": lbl[1], "value": pct}]

        elif agg == "grouped_mean":
            cols = chart.get("columns", [])
            if x and x in df.columns and len(cols) >= 2:
                valid_cols = [c for c in cols if c in df.columns and pd.api.types.is_numeric_dtype(df[c])]
                if len(valid_cols) < 2:
                    return []
                tmp = df[[x] + valid_cols].copy()
                tmp[x] = _clean_cat(df[x])
                tmp = tmp.dropna()
                if len(tmp) == 0:
                    return []
                g = tmp.groupby(x)[valid_cols].mean().round(2)
                top_x = g.sum(axis=1).nlargest(10).index
                g = g.loc[g.index.isin(top_x)]
                result = []
                for row_name in g.index:
                    rec = {"name": _translate_value(str(row_name))}
                    for c in valid_cols:
                        rec[_ar(c)] = float(g.loc[row_name, c])
                    result.append(rec)
                return result

        elif agg == "composed_over_time":
            cols = chart.get("columns", [])
            if x and x in df.columns and len(cols) >= 2:
                s = df[x].dropna()
                if not pd.api.types.is_datetime64_any_dtype(s):
                    try:
                        s = pd.to_datetime(s, errors='coerce').dropna()
                        df = df.copy()
                        df[x] = pd.to_datetime(df[x], errors='coerce')
                    except Exception:
                        return []
                if len(s) == 0:
                    return []
                tmp = df.copy()
                tmp["_period"] = tmp[x].dt.to_period("M")
                count_s = tmp.groupby("_period").size()
                num_col = cols[1] if cols[1] != "__count__" else (cols[0] if cols[0] != "__count__" else None)
                if num_col and num_col in df.columns:
                    avg_s = tmp.groupby("_period")[num_col].mean().round(2)
                else:
                    avg_s = count_s * 0
                periods = sorted(set(count_s.index) | set(avg_s.index))
                periods = periods[-36:]
                result = []
                for p in periods:
                    rec = {"name": str(p)}
                    rec["العدد"] = int(count_s.get(p, 0))
                    rec[_ar(num_col) if num_col else "القيمة"] = float(avg_s.get(p, 0))
                    result.append(rec)
                return result

        elif ct == "scatter":
            if x and y and x in df.columns and y in df.columns:
                if not pd.api.types.is_numeric_dtype(df[x]) or not pd.api.types.is_numeric_dtype(df[y]):
                    if pd.api.types.is_numeric_dtype(df[y]):
                        tmp = df[[x, y]].copy()
                        tmp[x] = _clean_cat(df[x])
                        tmp = tmp.dropna()
                        if len(tmp) > 0:
                            g = tmp.groupby(x)[y].mean().round(2).sort_values(ascending=False).head(15)
                            return [{"name": str(k), "value": float(v)} for k, v in g.items()]
                    return []
                sub = df[[x, y]].dropna()
                if len(sub) > 300:
                    sub = sub.sample(300, random_state=42)
                return [{"x": float(r[x]), "y": float(r[y])} for _, r in sub.iterrows()]

        return []
    except Exception:
        return []


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PUBLIC API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def auto_analyze(dataset_id):
    tables = list_dataset_tables(dataset_id)
    all_insights = []
    all_charts = []

    for tbl in tables:
        try:
            df = get_dataframe(dataset_id, tbl)
            label = _ar_table(tbl) if tbl != "main_data" else ""
            result = _analyze_table(df, label)
            all_insights.extend(result["insights"])
            all_charts.extend(result["charts"])
        except Exception:
            continue

    return {"dataset_id": dataset_id, "insights": all_insights, "suggested_charts": all_charts}


def _build_config_from_llm(dataset_id, tables, tables_dfs, llm, best_table_name):
    """Build dashboard config from LLM response."""
    from services.llm_analyzer import compute_kpi_value

    final_kpis = []
    for kpi_spec in llm.get("kpis", [])[:6]:
        col = kpi_spec.get("column", "")
        for tbl, df in tables_dfs:
            if col in df.columns or kpi_spec.get("aggregation") == "count":
                kpi = compute_kpi_value(df, kpi_spec)
                if kpi:
                    final_kpis.append(kpi)
                break

    charts_out = []
    for chart_spec in llm.get("charts", [])[:14]:
        x_col = chart_spec.get("x_column", "")
        y_col = chart_spec.get("y_column")
        agg = chart_spec.get("aggregation", "count")

        src_df = None
        target_table = chart_spec.get("table", "")
        if target_table:
            for tbl, df in tables_dfs:
                clean_name = tbl.replace("tbl_", "")
                if clean_name == target_table or tbl == target_table:
                    if x_col in df.columns:
                        src_df = df
                        break
        if src_df is None:
            for tbl, df in tables_dfs:
                if x_col in df.columns:
                    src_df = df
                    break
        if src_df is None:
            continue

        spec = {
            "chart_type": chart_spec.get("chart_type", "bar"),
            "x_column": x_col, "y_column": y_col,
            "aggregation": agg,
            "title": chart_spec.get("title", ""),
            "description": chart_spec.get("description", ""),
        }
        if chart_spec.get("bool_labels"):
            spec["_lbl"] = chart_spec["bool_labels"]

        data = _compute_data(src_df, spec)
        if not data:
            continue

        ct = chart_spec.get("chart_type", "bar")
        first = data[0] if data else {}
        has_name_count = "name" in first and "count" in first
        has_name_value = "name" in first and "value" in first
        has_xy = "x" in first and "y" in first

        if has_xy:
            xk, yk, rt = "x", ["y"], "scatter"
        elif has_name_count:
            xk, yk, rt = "name", ["count"], ct if ct in ("pie", "donut") else "bar"
        elif has_name_value:
            xk, yk, rt = "name", ["value"], ct if ct in ("pie", "donut", "line") else "bar"
        elif "range" in first:
            xk, yk, rt = "range", ["count"], "bar"
        else:
            xk, yk, rt = "name", ["value"], "bar"

        entry = {
            "id": "chart-{}".format(len(charts_out)),
            "chart_type": rt, "title": spec["title"],
            "description": spec.get("description", ""),
            "x_column": xk, "columns": yk, "data": data,
        }
        if rt == "scatter":
            entry["y_column"] = "y"
        if rt in ("pie", "donut"):
            vk = "count" if "count" in first else "value"
            entry["y_column"] = vk
            entry["x_column"] = "name"

        charts_out.append(entry)

    top_insights = llm.get("insights", [])[:5]

    preview_df = _preprocess(tables_dfs[0][1] if tables_dfs else pd.DataFrame())
    table_columns = preview_df.columns.tolist()
    table_data = _build_table_data(preview_df, table_columns)

    total_rows = sum(len(df) for _, df in tables_dfs)

    return {
        "dataset_id": dataset_id,
        "title": "لوحة البيانات — {:,} سجل".format(total_rows),
        "kpis": final_kpis,
        "charts": charts_out,
        "insights": top_insights,
        "filters": [],
        "table_columns": table_columns,
        "table_data": table_data,
        "_table_names": tables,
    }


def _build_table_data(preview_df, table_columns):
    table_data = []
    for _, row in preview_df.head(50).iterrows():
        rec = {}
        for col in table_columns:
            val = row[col]
            if pd.isna(val):
                rec[col] = None
            elif hasattr(val, "isoformat"):
                rec[col] = val.isoformat()
            elif isinstance(val, (np.integer,)):
                rec[col] = int(val)
            elif isinstance(val, (np.floating,)):
                rec[col] = round(float(val), 4)
            else:
                rec[col] = val
            try:
                _json.dumps(rec[col])
            except (TypeError, ValueError):
                rec[col] = str(val)
        table_data.append(rec)
    return table_data


def get_dashboard_config(dataset_id):
    """Build full dashboard config. Tries LLM first, falls back to rules."""
    tables = list_dataset_tables(dataset_id)

    tables_dfs = []
    best_table_name = "main_data"
    best_table_rows = 0
    for tbl in tables:
        try:
            df_raw = get_dataframe(dataset_id, tbl)
            if len(df_raw) == 0:
                continue
            tables_dfs.append((tbl, df_raw))
            if len(df_raw) > best_table_rows:
                best_table_rows = len(df_raw)
                best_table_name = tbl
        except Exception:
            continue

    # ── TRY LLM-POWERED ANALYSIS ──
    llm_result = None
    try:
        from services.llm_analyzer import analyze_with_llm
        llm_result = analyze_with_llm(tables_dfs)
    except Exception:
        pass

    if llm_result:
        return _build_config_from_llm(dataset_id, tables, tables_dfs, llm_result, best_table_name)

    # ── FALLBACK: RULE-BASED ANALYSIS ──
    all_charts_spec = []
    all_kpis = []
    all_insights = []

    for tbl, df_raw in tables_dfs:
        label = ""
        if tbl != "main_data" and len(tables) > 2:
            label = _ar_table(tbl)

        result = _analyze_table(df_raw, label)
        all_charts_spec.extend(result["charts"])
        all_kpis.extend(result["kpis"])
        all_insights.extend(result["insights"])

    # Build final KPIs
    total_rows = sum(len(df) for _, df in tables_dfs)
    final_kpis = [{"label": "إجمالي السجلات", "value": "{:,}".format(total_rows), "icon": "database"}]

    seen_labels = {"إجمالي السجلات"}
    for kpi in all_kpis:
        if kpi["label"] not in seen_labels and len(final_kpis) < 6:
            final_kpis.append(kpi)
            seen_labels.add(kpi["label"])

    # Compute chart data — pick best charts, limit per type for diversity
    charts_out = []
    type_used = {}
    MAX_PER_TYPE = 4

    for spec in all_charts_spec[:40]:
        ct = spec.get("chart_type", "bar")
        if type_used.get(ct, 0) >= MAX_PER_TYPE:
            continue

        src_df = None
        x = spec.get("x_column", "")
        for tbl, df_raw in tables_dfs:
            try:
                if x in df_raw.columns:
                    src_df = df_raw
                    break
            except Exception:
                continue

        if src_df is None:
            continue

        data = _compute_data(src_df, spec)
        if not data:
            continue

        agg = spec.get("aggregation")

        if agg in ("histogram",):
            xk, yk, rt = "range", ["count"], ct if ct == "area" else "bar"
        elif agg in ("count", "bool_pie"):
            xk, yk, rt = "name", ["count"], ct
        elif agg == "count_radial":
            xk, yk, rt = "name", ["value"], "radial_bar"
        elif agg in ("mean",):
            xk, yk, rt = "name", ["value"], ct if ct in ("radar",) else "bar"
        elif agg == "rate":
            xk, yk, rt = "name", ["value"], "bar"
        elif agg == "bool_gauge":
            xk, yk, rt = "name", ["value"], "gauge"
        elif agg == "grouped_mean":
            if data:
                cols = [k for k in data[0].keys() if k != "name"]
                xk, yk, rt = "name", cols, "grouped_bar"
            else:
                xk, yk, rt = "name", ["value"], "bar"
        elif agg == "composed_over_time":
            if data:
                cols = [k for k in data[0].keys() if k != "name"]
                xk, yk, rt = "name", cols, "composed"
            else:
                xk, yk, rt = "name", ["value"], "line"
        elif agg in ("count_over_time", "avg_over_time"):
            xk, yk, rt = "name", ["value"], ct if ct in ("area", "line") else "line"
        elif agg in ("crosstab", "heatmap_rate", "heatmap_mean"):
            xk, yk, rt = "x", ["value"], ct
        elif agg in ("stacked", "bool_stacked"):
            if data:
                cols = [k for k in data[0].keys() if k != "name"]
                xk, yk, rt = "name", cols, "stacked_bar"
            else:
                xk, yk, rt = "name", ["value"], "bar"
        elif ct == "scatter":
            xk, yk, rt = "x", ["y"], "scatter"
        else:
            xk, yk, rt = "name", ["value"], "bar"

        entry = {
            "id": "chart-{}".format(len(charts_out)),
            "chart_type": rt, "title": spec["title"],
            "description": spec.get("description", ""),
            "x_column": xk, "columns": yk, "data": data,
        }
        if ct == "scatter":
            entry["y_column"] = "y"
        if ct in ("pie", "donut") or agg == "bool_pie":
            entry["y_column"] = "count"
            entry["x_column"] = "name"
        if rt == "treemap":
            entry["y_column"] = "count"
            entry["x_column"] = "name"
        if rt == "horizontal_bar":
            vk = "count" if "count" in (data[0] if data else {}) else "value"
            entry["y_column"] = vk
            entry["x_column"] = "name"
        if rt == "radar":
            entry["y_column"] = "value"
            entry["x_column"] = "name"
        if rt in ("heatmap", "frequency_matrix"):
            entry["y_column"] = "y"
            entry["x_column"] = "x"
        if rt == "funnel":
            vk = "count" if "count" in (data[0] if data else {}) else "value"
            entry["y_column"] = vk
            entry["x_column"] = "name"
        if rt == "radial_bar":
            entry["y_column"] = "value"
            entry["x_column"] = "name"
        if rt == "gauge":
            entry["y_column"] = "value"
            entry["x_column"] = "name"
        if rt == "grouped_bar":
            entry["x_column"] = "name"
        if rt == "composed":
            entry["x_column"] = "name"

        charts_out.append(entry)
        type_used[rt] = type_used.get(rt, 0) + 1
        if len(charts_out) >= 25:
            break

    # Table preview
    preview_df = _preprocess(tables_dfs[0][1] if tables_dfs else pd.DataFrame())
    table_columns = preview_df.columns.tolist()
    table_data = _build_table_data(preview_df, table_columns)

    # Build top 5 insights
    priority = {"high": 0, "medium": 1, "low": 2}
    decision_types = {"ratio", "correlation", "quality"}
    decision_insights = [i for i in all_insights if i.get("type") in decision_types]
    other_insights = [i for i in all_insights if i.get("type") not in decision_types]
    sorted_insights = sorted(decision_insights, key=lambda i: priority.get(i.get("importance", "low"), 2))
    sorted_insights += sorted(other_insights, key=lambda i: priority.get(i.get("importance", "low"), 2))

    top_insights = []
    icons = {"ratio": "📊", "correlation": "🔗", "quality": "⚠️", "statistic": "📈", "overview": "📋"}
    for ins in sorted_insights[:5]:
        top_insights.append({
            "icon": icons.get(ins.get("type", ""), "💡"),
            "title": ins["title"],
            "description": ins["description"],
            "importance": ins.get("importance", "medium"),
        })

    return {
        "dataset_id": dataset_id,
        "title": "لوحة البيانات — {:,} سجل".format(total_rows),
        "kpis": final_kpis,
        "charts": charts_out,
        "insights": top_insights,
        "filters": [],
        "table_columns": table_columns,
        "table_data": table_data,
        "_table_names": tables,
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NATURAL LANGUAGE QUERY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def natural_language_query(dataset_id, query):
    df = get_dataframe(dataset_id)
    try:
        from pandasai import SmartDataframe
        api_key = os.environ.get("PANDASAI_API_KEY", "")
        sdf = SmartDataframe(df, config={"api_key": api_key, "enable_cache": False})
        result = sdf.chat(query)
        data = None
        if isinstance(result, pd.DataFrame):
            data = result.head(100).to_dict(orient="records")
            answer = "الاستعلام أرجع {} سجل.".format(len(result))
        elif isinstance(result, pd.Series):
            data = result.head(100).to_dict()
            answer = str(result)
        else:
            answer = str(result)
        return {"dataset_id": dataset_id, "query": query, "answer": answer, "data": data}
    except Exception:
        return _fallback_query(dataset_id, df, query)


def _fallback_query(dataset_id, df, query):
    q = query.lower()
    answer, data = "", None
    if any(w in q for w in ["متوسط", "average", "mean"]):
        num = df.select_dtypes(include=[np.number])
        means = num.mean().round(2).to_dict()
        answer = "المتوسطات: " + "، ".join("{}: {}".format(_ar(k), v) for k, v in means.items())
        data = [means]
    elif any(w in q for w in ["كم", "عدد", "count"]):
        answer = "البيانات تحتوي على {:,} سجل و{} عمود.".format(len(df), len(df.columns))
    else:
        answer = "البيانات: {:,} سجل، {} عمود.".format(len(df), len(df.columns))
    return {"dataset_id": dataset_id, "query": query, "answer": answer, "data": data}
