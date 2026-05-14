#!/bin/bash

# سكريبت للتحقق من اكتمال تحميل نموذج Whisper وتفعيله تلقائياً

DOWNLOAD_FILE="$HOME/.whisper-models/ggml-medium.bin.download"
FINAL_FILE="$HOME/.whisper-models/ggml-medium.bin"
ENV_FILE="/Users/wesam../Downloads/QU_Projects/humain/quai/.env"
EXPECTED_SIZE_MB=1420  # الحجم المتوقع تقريباً بالميجابايت

echo "🔍 فحص حالة تحميل نموذج Whisper..."
echo ""

if [ ! -f "$DOWNLOAD_FILE" ]; then
    echo "❌ ملف التحميل غير موجود"
    exit 1
fi

# الحصول على حجم الملف بالميجابايت
CURRENT_SIZE=$(du -m "$DOWNLOAD_FILE" | cut -f1)
PERCENTAGE=$((CURRENT_SIZE * 100 / EXPECTED_SIZE_MB))

echo "📊 التقدم: $CURRENT_SIZE MB / ~$EXPECTED_SIZE_MB MB ($PERCENTAGE%)"

if [ $CURRENT_SIZE -ge $EXPECTED_SIZE_MB ]; then
    echo ""
    echo "✅ اكتمل التحميل!"
    echo "🔄 جاري نقل الملف وتفعيله..."

    # نقل الملف
    mv "$DOWNLOAD_FILE" "$FINAL_FILE"

    echo "✅ تم نقل الملف بنجاح"

    # تحديث .env إذا لم يكن محدث
    if ! grep -q "^WHISPER_MODEL_PATH=" "$ENV_FILE"; then
        echo "" >> "$ENV_FILE"
        echo "WHISPER_MODEL_PATH=$FINAL_FILE" >> "$ENV_FILE"
        echo "✅ تم تحديث ملف .env"
    else
        echo "ℹ️  ملف .env محدث مسبقاً"
    fi

    # مسح الكاش
    cd /Users/wesam../Downloads/QU_Projects/humain/quai
    /opt/homebrew/bin/php artisan config:clear > /dev/null 2>&1

    echo ""
    echo "🎉 تم! النموذج جاهز للاستخدام"
    echo ""
    echo "📝 الخطوات التالية:"
    echo "   1. أعد تشغيل الخادم"
    echo "   2. جرب تسجيل اجتماع جديد"
    echo "   3. ستلاحظ تحسن كبير في جودة التفريغ!"

else
    echo ""
    echo "⏳ التحميل مازال مستمر... ($PERCENTAGE%)"
    echo "💡 يمكنك تشغيل هذا السكريبت مرة أخرى للتحقق"
fi
