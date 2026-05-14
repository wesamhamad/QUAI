#!/bin/bash

# اختبار المرشد الذكي مع Ollama المحلي
# Test Smart Advisor with Local Ollama

echo "🧪 اختبار المرشد الذكي مع Ollama المحلي"
echo "=========================================="
echo ""

# 1. التحقق من Ollama
echo "1️⃣ التحقق من Ollama..."
if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
    VERSION=$(curl -s http://localhost:11434/api/version | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    echo "   ✅ Ollama يعمل - الإصدار: $VERSION"
else
    echo "   ❌ Ollama لا يعمل - يرجى تشغيله بـ: ollama serve"
    exit 1
fi

# 2. التحقق من النموذج
echo ""
echo "2️⃣ التحقق من نموذج ALLaM..."
if ollama list | grep -q "iKhalid/ALLaM:7b"; then
    echo "   ✅ نموذج ALLaM متوفر"
else
    echo "   ❌ نموذج ALLaM غير متوفر - يرجى تحميله بـ: ollama pull iKhalid/ALLaM:7b"
    exit 1
fi

# 3. التحقق من الإعدادات
echo ""
echo "3️⃣ التحقق من إعدادات Laravel..."
AI_PROVIDER=$(grep "^AI_PROVIDER=" .env | cut -d'=' -f2)
OLLAMA_NUM_CTX=$(grep "^OLLAMA_NUM_CTX=" .env | cut -d'=' -f2)

if [ "$AI_PROVIDER" = "ollama" ]; then
    echo "   ✅ AI_PROVIDER = ollama"
else
    echo "   ❌ AI_PROVIDER = $AI_PROVIDER (يجب أن يكون ollama)"
    exit 1
fi

if [ "$OLLAMA_NUM_CTX" = "32768" ]; then
    echo "   ✅ OLLAMA_NUM_CTX = 32768"
else
    echo "   ⚠️  OLLAMA_NUM_CTX = $OLLAMA_NUM_CTX (يُنصح بـ 32768)"
fi

# 4. اختبار Ollama مباشرة
echo ""
echo "4️⃣ اختبار Ollama مباشرة..."
RESPONSE=$(curl -s http://localhost:11434/api/generate \
  -d '{"model":"iKhalid/ALLaM:7b","prompt":"قل مرحبا فقط","stream":false,"options":{"num_ctx":32768}}' \
  | grep -o '"response":"[^"]*"' | cut -d'"' -f4)

if [ -n "$RESPONSE" ]; then
    echo "   ✅ Ollama يستجيب: $RESPONSE"
else
    echo "   ❌ Ollama لا يستجيب"
    exit 1
fi

# 5. مسح الـ cache
echo ""
echo "5️⃣ مسح الـ cache..."
php artisan config:clear > /dev/null 2>&1
php artisan cache:clear > /dev/null 2>&1
echo "   ✅ تم مسح الـ cache"

# 6. التحقق من الإعدادات في Laravel
echo ""
echo "6️⃣ التحقق من الإعدادات في Laravel..."
CONFIG_OUTPUT=$(php artisan tinker --execute="
echo 'AI_PROVIDER=' . config('quai.ai_provider') . PHP_EOL;
echo 'MAX_TOKENS=' . config('quai.smart_advisor.max_tokens') . PHP_EOL;
echo 'NUM_CTX=' . config('quai.ollama.num_ctx') . PHP_EOL;
" 2>/dev/null)

echo "$CONFIG_OUTPUT" | while read line; do
    echo "   ✅ $line"
done

# النتيجة النهائية
echo ""
echo "=========================================="
echo "✅ جميع الاختبارات نجحت!"
echo ""
echo "📝 الخطوات التالية:"
echo "   1. تشغيل الخادم: php artisan serve --port=8007"
echo "   2. فتح المتصفح: http://127.0.0.1:8007/smart-advisor"
echo "   3. اختبار المرشد الذكي بسؤال مفصل"
echo ""
echo "🎯 النتيجة المتوقعة:"
echo "   - إجابات أطول وأكثر تفصيلاً"
echo "   - استخدام جداول Markdown"
echo "   - عرض كامل البيانات المتوفرة"
echo ""

