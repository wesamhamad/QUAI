#!/usr/bin/env python3
"""
نموذج توليد الفيديو من النص - مصمم للعمل على Apple Silicon (M4)
يستخدم نموذج ModelScope Text-to-Video الذي يعمل على ذاكرة 16GB
"""

import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.utils import export_to_video
import os
import sys

def generate_video(prompt, output_path="output.mp4", num_frames=16, num_inference_steps=25):
    """
    توليد فيديو من نص

    Args:
        prompt (str): النص الوصفي للفيديو المطلوب
        output_path (str): مسار حفظ الفيديو
        num_frames (int): عدد الإطارات (16 للتوفير في الذاكرة)
        num_inference_steps (int): خطوات التوليد (25 للتوازن بين الجودة والسرعة)
    """

    print(f"🎬 بدء توليد الفيديو...")
    print(f"📝 الوصف: {prompt}")

    # تحديد الجهاز المناسب
    if torch.backends.mps.is_available():
        device = "mps"  # Apple Silicon
        print("✅ استخدام Apple Silicon (MPS)")
    elif torch.cuda.is_available():
        device = "cuda"
        print("✅ استخدام GPU (CUDA)")
    else:
        device = "cpu"
        print("⚠️  استخدام CPU (سيكون بطيء)")

    try:
        # تحميل النموذج
        print("📥 تحميل النموذج... (قد يستغرق وقتاً في المرة الأولى)")
        pipe = DiffusionPipeline.from_pretrained(
            "damo-vilab/text-to-video-ms-1.7b",
            torch_dtype=torch.float32 if device == "mps" else torch.float16,
            variant="fp16" if device != "mps" else None
        )

        # تفعيل تحسينات الذاكرة
        pipe.enable_attention_slicing()

        # نقل النموذج للجهاز المناسب
        if device != "mps":
            pipe = pipe.to(device)

        print("🎨 توليد الفيديو... (قد يستغرق عدة دقائق)")

        # توليد الفيديو
        video_frames = pipe(
            prompt,
            num_inference_steps=num_inference_steps,
            num_frames=num_frames,
            height=256,  # دقة منخفضة لتوفير الذاكرة
            width=256,
        ).frames[0]

        # حفظ الفيديو
        print(f"💾 حفظ الفيديو في: {output_path}")
        export_to_video(video_frames, output_path, fps=8)

        print(f"✅ تم توليد الفيديو بنجاح!")
        print(f"📍 موقع الملف: {os.path.abspath(output_path)}")

        return True

    except Exception as e:
        print(f"❌ حدث خطأ: {str(e)}")
        return False

def main():
    """الدالة الرئيسية"""

    # التحقق من وجود نص وصفي
    if len(sys.argv) < 2:
        print("📖 الاستخدام:")
        print("  python3 generate_video.py \"النص الوصفي للفيديو\"")
        print("\n💡 مثال:")
        print("  python3 generate_video.py \"A cat walking in a garden\"")
        return

    # الحصول على النص الوصفي
    prompt = sys.argv[1]

    # اسم الملف بناءً على الوقت
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"video_{timestamp}.mp4"

    # توليد الفيديو
    generate_video(prompt, output_path)

if __name__ == "__main__":
    main()
