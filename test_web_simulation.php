<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\SmartAdvisorService;
use App\Models\User;

echo "=== Web Interface Simulation Test ===\n\n";

// Get a real user
$user = User::first();
if (!$user) {
    echo "❌ No user found!\n";
    exit(1);
}

echo "User: {$user->name} (ID: {$user->id})\n\n";

// Test the exact question
$query = "هل الرسوب يمنع مرتبة الشرف؟";
echo "Question: {$query}\n\n";

// Call the service exactly as the web interface does
$advisorService = app(SmartAdvisorService::class);

try {
    $response = $advisorService->chat(
        user: $user,
        message: $query,
        conversationId: 'web-test-' . time()
    );
    
    $answer = $response['content'] ?? '';
    
    echo "📝 Response:\n";
    echo str_repeat('=', 80) . "\n";
    echo $answer . "\n";
    echo str_repeat('=', 80) . "\n\n";
    
    // Analysis
    echo "--- Analysis ---\n";
    $hasYes = mb_stripos($answer, 'نعم') !== false;
    $hasNo = mb_stripos($answer, 'لا') !== false;
    $hasReferences = mb_stripos($answer, 'المراجع') !== false || mb_stripos($answer, 'المصدر') !== false;
    
    echo ($hasYes ? '✅' : '❌') . " Contains 'نعم': " . ($hasYes ? 'YES' : 'NO') . "\n";
    echo ($hasNo ? '⚠️' : '✅') . " Contains 'لا': " . ($hasNo ? 'YES (WARNING!)' : 'NO') . "\n";
    echo ($hasReferences ? '✅' : '❌') . " Has References: " . ($hasReferences ? 'YES' : 'NO') . "\n";
    
    // Check for contradictions
    $contradictions = [
        ['لا يمنع', 'يمنع'],
        ['لا يشترط', 'يشترط'],
    ];
    
    echo "\nContradiction Check:\n";
    $foundContradiction = false;
    foreach ($contradictions as [$phrase1, $phrase2]) {
        $has1 = mb_stripos($answer, $phrase1) !== false;
        $has2 = mb_stripos($answer, $phrase2) !== false;
        
        if ($has1 && $has2) {
            echo "❌ CONTRADICTION: '{$phrase1}' AND '{$phrase2}' both present!\n";
            $foundContradiction = true;
        }
    }
    
    if (!$foundContradiction) {
        echo "✅ No contradictions detected\n";
    }
    
    // Final verdict
    echo "\n--- Final Verdict ---\n";
    $isCorrect = $hasYes && !$foundContradiction && $hasReferences;
    
    if ($isCorrect) {
        echo "✅ PASS: Response is correct!\n";
    } else {
        echo "❌ FAIL: Response has issues:\n";
        if (!$hasYes) echo "  - Missing correct answer ('نعم')\n";
        if ($foundContradiction) echo "  - Contains contradictions\n";
        if (!$hasReferences) echo "  - Missing references\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n=== Test Complete ===\n";

