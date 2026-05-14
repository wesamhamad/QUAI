#!/bin/bash

# سكريبت تلقائي لمراقبة وتفعيل نموذج Whisper عند اكتمال التحميل

echo "🤖 بدء المراقبة التلقائية لتحميل Whisper..."
echo "سيتم التحقق كل 30 ثانية حتى يكتمل التحميل"
echo ""

while true; do
    CURRENT_SIZE=$(du -m ~/.whisper-models/ggml-medium.bin.download 2>/dev/null | cut -f1)

    if [ -z "$CURRENT_SIZE" ]; then
        echo "⏳ $(date '+%H:%M:%S') - التحميل لم يبدأ بعد..."
    elif [ $CURRENT_SIZE -ge 1420 ]; then
        echo ""
        echo "✅ $(date '+%H:%M:%S') - اكتمل التحميل!"

        # تشغيل سكريبت التفعيل
        /Users/wesam../Downloads/QU_Projects/humain/quai/check_whisper_download.sh

        echo ""
        echo "🎊 جاهز! النموذج المفتوح المصدر مثبت ومفعّل"
        break
    else
        PERCENTAGE=$((CURRENT_SIZE * 100 / 1420))
        echo "⏳ $(date '+%H:%M:%S') - التقدم: ${CURRENT_SIZE}MB ($PERCENTAGE%)"
    fi

    sleep 30
done
