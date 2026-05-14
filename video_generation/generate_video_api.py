#!/usr/bin/env python3
"""
استخدام Replicate API - جودة عالية جداً بدون استهلاك ذاكرة محلية!
التكلفة: ~$0.01-0.05 لكل فيديو (رخيص جداً)
يستخدم GPU قوي في السحابة
"""

import os
import sys
import requests
from datetime import datetime

def generate_video_replicate(prompt, output_path="output.mp4"):
    """
    توليد فيديو باستخدام Replicate API

    تحتاج:
    1. إنشاء حساب في https://replicate.com
    2. الحصول على API token مجاني
    3. تثبيت: pip install replicate
    """

    try:
        import replicate
    except ImportError:
        print("❌ يجب تثبيت مكتبة replicate أولاً:")
        print("   pip3 install replicate")
        return False

    # التحقق من وجود API token
    api_token = os.environ.get("REPLICATE_API_TOKEN")
    if not api_token:
        print("❌ يجب تعيين REPLICATE_API_TOKEN")
        print("\n📝 الخطوات:")
        print("1. سجل في https://replicate.com")
        print("2. احصل على API token من https://replicate.com/account/api-tokens")
        print("3. نفذ: export REPLICATE_API_TOKEN='your-token-here'")
        return False

    print(f"🎬 بدء توليد الفيديو عبر Replicate API...")
    print(f"📝 الوصف: {prompt}")
    print(f"☁️  استخدام GPU في السحابة (بدون استهلاك ذاكرة محلية!)")

    try:
        # استخدام نموذج عالي الجودة
        print("🚀 استخدام نموذج Zeroscope XL في السحابة...")

        output = replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            input={
                "prompt": prompt,
                "num_frames": 24,
                "num_inference_steps": 50,  # جودة عالية!
            }
        )

        # تحميل الفيديو
        print("📥 تحميل الفيديو...")
        video_url = output

        response = requests.get(video_url)
        with open(output_path, 'wb') as f:
            f.write(response.content)

        print(f"✅ تم توليد الفيديو بنجاح!")
        print(f"📍 موقع الملف: {os.path.abspath(output_path)}")
        print(f"🎯 الجودة: عالية جداً (1024×576)")
        print(f"💰 التكلفة: ~$0.01-0.05")

        return True

    except Exception as e:
        print(f"❌ حدث خطأ: {str(e)}")
        return False

def main():
    """الدالة الرئيسية"""

    if len(sys.argv) < 2:
        print("📖 الاستخدام:")
        print("  python3 generate_video_api.py \"النص الوصفي للفيديو\"")
        print("\n💡 مثال:")
        print("  python3 generate_video_api.py \"A cat playing with a ball\"")
        print("\n🌟 المميزات:")
        print("  ✅ جودة عالية جداً (1024×576)")
        print("  ✅ لا يستهلك ذاكرة محلية")
        print("  ✅ سريع (2-3 دقائق فقط)")
        print("  💰 رخيص جداً (~$0.01 لكل فيديو)")
        print("\n📝 التحضير:")
        print("  1. pip3 install replicate")
        print("  2. سجل في https://replicate.com")
        print("  3. export REPLICATE_API_TOKEN='your-token'")
        return

    prompt = sys.argv[1]

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"replicate_{timestamp}.mp4"

    generate_video_replicate(prompt, output_path)

if __name__ == "__main__":
    main()
