#!/usr/bin/env python3
"""
نموذج Zeroscope - جودة أفضل من ModelScope
يستخدم نفس الذاكرة تقريباً (~16GB) لكن نتائج أفضل
"""

import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.utils import export_to_video
import os
import sys

def generate_video(prompt, output_path="output.mp4", num_frames=24, num_inference_steps=40):
    """
    توليد فيديو من نص باستخدام Zeroscope

    Args:
        prompt (str): النص الوصفي للفيديو المطلوب
        output_path (str): مسار حفظ الفيديو
        num_frames (int): عدد الإطارات (24 = حوالي 3 ثواني)
        num_inference_steps (int): خطوات التوليد (40 للجودة الأفضل)
    """

    print(f"🎬 بدء توليد الفيديو باستخدام Zeroscope...")
    print(f"📝 الوصف: {prompt}")

    # تحديد الجهاز المناسب
    if torch.backends.mps.is_available():
        device = "mps"
        print("✅ استخدام Apple Silicon (MPS)")
    elif torch.cuda.is_available():
        device = "cuda"
        print("✅ استخدام GPU (CUDA)")
    else:
        device = "cpu"
        print("⚠️  استخدام CPU (سيكون بطيء)")

    try:
        print("📥 تحميل نموذج Zeroscope XL... (أفضل جودة)")

        # تحميل نموذج Zeroscope XL
        pipe = DiffusionPipeline.from_pretrained(
            "cerspense/zeroscope_v2_576w",
            torch_dtype=torch.float32 if device == "mps" else torch.float16
        )

        # تفعيل تحسينات الذاكرة
        pipe.enable_attention_slicing()
        pipe.enable_vae_slicing()

        if device != "mps":
            pipe = pipe.to(device)

        # تحسين جدولة الـ sampling
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)

        print("🎨 توليد الفيديو بجودة عالية... (قد يستغرق وقتاً)")

        # توليد الفيديو
        video_frames = pipe(
            prompt,
            num_inference_steps=num_inference_steps,
            num_frames=num_frames,
            height=320,  # دقة أعلى من ModelScope
            width=576,   # نسبة 16:9
            guidance_scale=12.5,  # للتحكم الأفضل بالنتيجة
        ).frames[0]

        # حفظ الفيديو
        print(f"💾 حفظ الفيديو في: {output_path}")
        export_to_video(video_frames, output_path, fps=8)

        print(f"✅ تم توليد الفيديو بنجاح!")
        print(f"📍 موقع الملف: {os.path.abspath(output_path)}")
        print(f"📊 الدقة: 576×320 (16:9)")
        print(f"⏱️  المدة: ~{num_frames/8:.1f} ثانية")

        return True

    except Exception as e:
        print(f"❌ حدث خطأ: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """الدالة الرئيسية"""

    if len(sys.argv) < 2:
        print("📖 الاستخدام:")
        print("  python3 generate_video_zeroscope.py \"النص الوصفي للفيديو\"")
        print("\n💡 مثال:")
        print("  python3 generate_video_zeroscope.py \"A cat playing with a ball\"")
        print("\n🎯 ملاحظات:")
        print("  - Zeroscope يعطي جودة أفضل من ModelScope")
        print("  - الدقة: 576×320 (16:9) - أعلى من ModelScope")
        print("  - يستخدم نفس الذاكرة تقريباً")
        return

    prompt = sys.argv[1]

    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"zeroscope_{timestamp}.mp4"

    generate_video(prompt, output_path)

if __name__ == "__main__":
    main()
