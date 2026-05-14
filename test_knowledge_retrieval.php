<?php
/**
 * Test Knowledge Retrieval System
 */

require __DIR__ . '/bootstrap/app.php';

$app = $app ?? require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\KnowledgeRetrievalService;

echo "=== Testing Knowledge Retrieval ===\n\n";

$service = new KnowledgeRetrievalService();

$query = "هل الرسوب يمنع مرتبة الشرف";

echo "Query: {$query}\n\n";

$result = $service->retrieve($query);

echo "=== Retrieved Knowledge ===\n";
echo $result;
echo "\n\n=== Analysis ===\n";

// Check if the correct information is present
$keywords = [
    'عدم الرسوب',
    'مرتبة الشرف',
    'شروط',
];

foreach ($keywords as $keyword) {
    $found = mb_stripos($result, $keyword) !== false;
    echo ($found ? '✅' : '❌') . " Keyword '{$keyword}': " . ($found ? 'FOUND' : 'NOT FOUND') . "\n";
}

echo "\n=== Test Complete ===\n";

