<?php
/**
 * Direct Ollama Model Test
 * Tests the model's ability to answer without our system prompts
 */

// Simple cURL-based test (no Laravel dependencies)

function callOllama($prompt, $temperature = 0.1, $numCtx = 4096) {
    $ch = curl_init('http://localhost:11434/api/generate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'model' => 'command-r7b-arabic',
        'prompt' => $prompt,
        'stream' => false,
        'options' => [
            'temperature' => $temperature,
            'num_ctx' => $numCtx,
        ]
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// Test 1: Simple question without knowledge base
echo "=== Test 1: Direct Model Test (No KB) ===\n\n";

$result1 = callOllama('هل الرسوب في مقرر يمنع الطالب من التخرج بمرتبة الشرف؟ أجب بنعم أو لا فقط.');

echo "Question: هل الرسوب في مقرر يمنع الطالب من التخرج بمرتبة الشرف؟\n";
echo "Answer: " . ($result1['response'] ?? 'ERROR') . "\n\n";

// Test 2: With explicit knowledge
echo "=== Test 2: With Explicit Knowledge ===\n\n";

$knowledge = <<<EOT
من لائحة الدراسة والاختبارات للمرحلة الجامعية:

شروط التخرج بمرتبة الشرف:
1. أن يحصل الطالب على معدل تراكمي لا يقل عن 3.75 من 5.00
2. عدم الرسوب في أي مقرر طوال فترة الدراسة
3. إنهاء متطلبات التخرج في مدة لا تزيد عن المدة المحددة للبرنامج

المصدر: لائحة الدراسة والاختبارات - صفحة 15
EOT;

$prompt2 = <<<EOT
أنت مساعد أكاديمي. استخدم المعلومات التالية للإجابة:

{$knowledge}

السؤال: هل الرسوب في مقرر يمنع الطالب من التخرج بمرتبة الشرف؟

تعليمات:
- اقرأ المعلومات بعناية
- أجب بوضوح: نعم أو لا
- اذكر السبب من المعلومات المعطاة
- لا تتناقض مع نفسك
EOT;

$result2 = callOllama($prompt2, 0.1, 8192);
echo "Answer: " . ($result2['response'] ?? 'ERROR') . "\n\n";

// Test 3: Check for contradictions
echo "=== Test 3: Contradiction Detection ===\n\n";

$answer = $result2['response'] ?? '';

$contradictions = [
    ['لا يمنع', 'يمنع'],
    ['لا يشترط', 'يشترط'],
    ['غير مطلوب', 'مطلوب'],
];

foreach ($contradictions as [$phrase1, $phrase2]) {
    $has1 = mb_stripos($answer, $phrase1) !== false;
    $has2 = mb_stripos($answer, $phrase2) !== false;
    
    if ($has1 && $has2) {
        echo "⚠️ CONTRADICTION FOUND: '{$phrase1}' AND '{$phrase2}' both present!\n";
    }
}

echo "\n=== Test Complete ===\n";

