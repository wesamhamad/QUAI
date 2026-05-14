<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\SmartAdvisorService;
use App\Services\AiCompletionService;
use App\Services\UniversityApiClient;
use App\Services\FileExtractionApiService;
use App\Services\KnowledgeRetrievalService;
use Illuminate\Support\Facades\Storage;
use ReflectionMethod;
use ReflectionProperty;

/**
 * Smart Advisor Unit Tests
 *
 * Run all tests:
 *   php artisan test --filter=SmartAdvisorTest -v
 *
 * Run specific group:
 *   php artisan test --filter=SmartAdvisorTest --group=intent -v
 *   php artisan test --filter=SmartAdvisorTest --group=knowledge -v
 *   php artisan test --filter=SmartAdvisorTest --group=formatter -v
 */
class SmartAdvisorTest extends TestCase
{
    private SmartAdvisorService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Create service with mocked dependencies
        $this->service = new SmartAdvisorService(
            $this->createMock(AiCompletionService::class),
            $this->createMock(UniversityApiClient::class),
            $this->createMock(FileExtractionApiService::class),
            $this->createMock(KnowledgeRetrievalService::class),
        );
    }

    /**
     * Helper to call private methods via reflection
     */
    private function callPrivate(string $method, array $args = []): mixed
    {
        $ref = new ReflectionMethod(SmartAdvisorService::class, $method);
        $ref->setAccessible(true);
        return $ref->invoke($this->service, ...$args);
    }

    /**
     * Print a styled test result row
     */
    private function printResult(string $question, array|string $result, float $timeMs): void
    {
        $separator = str_repeat('─', 80);
        $output = is_array($result) ? implode(', ', $result) : $result;
        $preview = mb_substr($output, 0, 200);

        fwrite(STDOUT, "\n{$separator}\n");
        fwrite(STDOUT, "❓ السؤال:  {$question}\n");
        fwrite(STDOUT, "💡 النتيجة: {$preview}\n");
        fwrite(STDOUT, "⏱  الوقت:   " . number_format($timeMs, 2) . " ms\n");
    }

    // ═══════════════════════════════════════════════════════════════
    //  Intent Detection Tests (Keyword Fallback)
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group intent
     */
    public function test_intent_absences_arabic(): void
    {
        $question = 'كم نسبة غيابي في المقررات؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('absences', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_courses_arabic(): void
    {
        $question = 'وش المقررات المسجلة عندي هالفصل؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('courses', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_schedule_arabic(): void
    {
        $question = 'أبغى أشوف جدولي الدراسي';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('schedule', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_exams_arabic(): void
    {
        $question = 'متى اختبارات النهائي؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('exams', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_academic_standing_gpa(): void
    {
        $question = 'كم معدلي التراكمي؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('academic_standing', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_academic_standing_warning(): void
    {
        $question = 'هل عندي إنذار أكاديمي؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('academic_standing', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_financial_arabic(): void
    {
        $question = 'متى تنزل المكافأة الشهرية؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('financial', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_advisor_arabic(): void
    {
        $question = 'من هو مرشدي الأكاديمي؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('advisor', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_regulations_arabic(): void
    {
        $question = 'وش لائحة الحذف والإضافة؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('regulations', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_calendar_arabic(): void
    {
        $question = 'متى يبدأ التقويم الأكاديمي؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('calendar', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_announcements_arabic(): void
    {
        $question = 'هل فيه إعلانات جديدة في المقررات؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('announcements', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_course_content_arabic(): void
    {
        $question = 'أبغى أشوف محتوى المقررات والملفات';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('course_content', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_grades_arabic(): void
    {
        $question = 'كم درجتي في مادة البرمجة؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('grades', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_general_status_arabic(): void
    {
        $question = 'أبغى أعرف وضعي الأكاديمي كامل';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        // "وضعي" should trigger general status: courses, absences, academic_standing
        $this->assertContains('courses', $intents);
        $this->assertContains('absences', $intents);
        $this->assertContains('academic_standing', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_multi_intent_message(): void
    {
        $question = 'أبغى أعرف غيابي وجدولي ومعدلي';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('absences', $intents);
        $this->assertContains('schedule', $intents);
        $this->assertContains('academic_standing', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_english_courses(): void
    {
        $question = 'Show me my registered courses';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('courses', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_english_grades(): void
    {
        $question = 'What are my grades?';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('grades', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_unknown_defaults_to_general(): void
    {
        $question = 'مرحبا كيف حالك؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('general', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_disciplinary_regulations(): void
    {
        $question = 'وش عقوبة التأديب إذا غشيت في الاختبار؟';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('regulations', $intents);
    }

    /**
     * @group intent
     */
    public function test_intent_blackboard_content(): void
    {
        $question = 'أبغى أشوف المحاضرات في البلاك بورد';
        $start = microtime(true);
        $intents = $this->callPrivate('detectIntentFallback', [$question]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $intents, $timeMs);

        $this->assertContains('course_content', $intents);
    }

    // ═══════════════════════════════════════════════════════════════
    //  Knowledge Base Loading Tests
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group knowledge
     */
    public function test_knowledge_base_loads_all_for_regulations(): void
    {
        $question = 'تحميل قاعدة المعرفة - intent: regulations';
        $start = microtime(true);
        $result = $this->callPrivate('loadKnowledgeBase', [['regulations']]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->assertNotNull($result, 'Knowledge base should not be null');
        $this->assertStringContainsString('قاعدة المعرفة', $result);

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تحميل {$charCount} حرف من قاعدة المعرفة", $timeMs);

        fwrite(STDOUT, "\n📂 المحتوى المُحمّل (أول 500 حرف):\n");
        fwrite(STDOUT, mb_substr($result, 0, 500) . "\n...\n");
    }

    /**
     * @group knowledge
     */
    public function test_knowledge_base_loads_financial_files(): void
    {
        $question = 'تحميل قاعدة المعرفة - intent: financial';
        $start = microtime(true);
        $result = $this->callPrivate('loadKnowledgeBase', [['financial']]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->assertNotNull($result, 'Knowledge base should not be null for financial intent');

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تحميل {$charCount} حرف - يحتوي على معلومات المكافآت", $timeMs);

        $this->assertStringContainsString('مكافآت', $result);
    }

    /**
     * @group knowledge
     */
    public function test_knowledge_base_loads_absences_files(): void
    {
        $question = 'تحميل قاعدة المعرفة - intent: absences';
        $start = microtime(true);
        $result = $this->callPrivate('loadKnowledgeBase', [['absences']]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->assertNotNull($result, 'Knowledge base should not be null for absences intent');

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تحميل {$charCount} حرف - يحتوي على معلومات الحرمان", $timeMs);

        $this->assertStringContainsString('حرمان', $result);
    }

    /**
     * @group knowledge
     */
    public function test_knowledge_base_loads_grades_files(): void
    {
        $question = 'تحميل قاعدة المعرفة - intent: grades';
        $start = microtime(true);
        $result = $this->callPrivate('loadKnowledgeBase', [['grades']]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->assertNotNull($result, 'Knowledge base should not be null for grades intent');

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تحميل {$charCount} حرف - يحتوي على معلومات التقييم", $timeMs);

        $this->assertStringContainsString('تقييم', $result);
    }

    /**
     * @group knowledge
     */
    public function test_knowledge_base_loads_academic_standing_files(): void
    {
        $question = 'تحميل قاعدة المعرفة - intent: academic_standing';
        $start = microtime(true);
        $result = $this->callPrivate('loadKnowledgeBase', [['academic_standing']]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->assertNotNull($result, 'Knowledge base should not be null for academic_standing intent');

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تحميل {$charCount} حرف - يحتوي على معلومات الإنذارات والتخرج", $timeMs);

        $this->assertStringContainsString('إنذار', $result);
    }

    /**
     * @group knowledge
     */
    public function test_knowledge_base_all_files_exist(): void
    {
        $expectedFiles = [
            '01-سياسة-التأديب-الطلابي.md',
            '02-سياسة-الاعتذار-والتأجيل.md',
            '03-نظام-المكافآت-والإعانات.md',
            '04-لائحة-التحويل-بين-الكليات.md',
            '05-سياسة-الحرمان-من-الاختبارات.md',
            '06-حقوق-وواجبات-الطالب.md',
            '07-نظام-الإنذارات-الأكاديمية.md',
            '08-نظام-التخرج-ومتطلباته.md',
            '09-لائحة-الفصل-الصيفي.md',
            '10-سياسة-التقييم-والدرجات.md',
        ];

        $kbPath = config('quai.smart_advisor.knowledge_base_path', 'advisor_knowledge');
        $existingFiles = Storage::files($kbPath);
        $existingNames = array_map('basename', $existingFiles);

        fwrite(STDOUT, "\n📂 ملفات قاعدة المعرفة:\n");
        foreach ($expectedFiles as $file) {
            $exists = in_array($file, $existingNames);
            $icon = $exists ? '✅' : '❌';
            fwrite(STDOUT, "  {$icon} {$file}\n");
            $this->assertTrue($exists, "Missing knowledge base file: {$file}");
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  Formatter Tests (with mock data)
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group formatter
     */
    public function test_format_announcements_with_data(): void
    {
        $mockData = [
            [
                'title' => 'تذكير: موعد تسليم المشروع',
                'body' => '<p>يرجى تسليم المشروع النهائي قبل يوم الخميس القادم</p>',
                'created' => '2026-02-28',
                'course_name' => 'CS201 - هياكل البيانات',
            ],
            [
                'title' => 'تأجيل محاضرة الأربعاء',
                'body' => 'تم تأجيل محاضرة يوم الأربعاء إلى يوم الخميس نفس الوقت',
                'created' => '2026-02-27',
                'course_name' => 'MATH301 - التفاضل والتكامل',
            ],
        ];

        $question = 'تنسيق الإعلانات (2 إعلانات)';
        $start = microtime(true);
        $result = $this->callPrivate('formatAnnouncements', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('إعلانات', $result);
        $this->assertStringContainsString('تذكير', $result);
        $this->assertStringContainsString('CS201', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_announcements_empty(): void
    {
        $question = 'تنسيق الإعلانات (فارغ)';
        $start = microtime(true);
        $result = $this->callPrivate('formatAnnouncements', [[]]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        $this->assertStringContainsString('لا توجد إعلانات', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_course_grades_with_data(): void
    {
        $mockData = [
            [
                'course_name' => 'CS201 - هياكل البيانات',
                'course_id' => '_12345_1',
                'grades' => [
                    ['name' => 'الاختبار الأول', 'score' => '18', 'possible' => '20'],
                    ['name' => 'الاختبار الثاني', 'score' => '15', 'possible' => '20'],
                    ['name' => 'المشروع', 'score' => '28', 'possible' => '30'],
                    ['name' => 'الواجبات', 'score' => '9', 'possible' => '10'],
                ],
            ],
            [
                'course_name' => 'MATH301 - التفاضل والتكامل',
                'course_id' => '_12346_1',
                'grades' => [
                    ['name' => 'الاختبار الأول', 'score' => '12', 'possible' => '20'],
                    ['name' => 'الاختبار الثاني', 'score' => '14', 'possible' => '20'],
                ],
            ],
            [
                'course_name' => 'ENG101 - اللغة الإنجليزية',
                'course_id' => '_12347_1',
                'grades' => [],
            ],
        ];

        $question = 'تنسيق الدرجات (3 مقررات، 6 درجات)';
        $start = microtime(true);
        $result = $this->callPrivate('formatCourseGrades', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('درجات', $result);
        $this->assertStringContainsString('CS201', $result);
        $this->assertStringContainsString('90%', $result); // 18/20
        $this->assertStringContainsString('لا توجد درجات مسجلة', $result); // ENG101
    }

    /**
     * @group formatter
     */
    public function test_format_course_grades_empty(): void
    {
        $question = 'تنسيق الدرجات (فارغ)';
        $start = microtime(true);
        $result = $this->callPrivate('formatCourseGrades', [[]]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        $this->assertStringContainsString('لا توجد درجات', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_course_contents_with_data(): void
    {
        $mockData = [
            [
                'course_name' => 'CS201 - هياكل البيانات',
                'course_id' => '_12345_1',
                'contents' => [
                    ['title' => 'الأسبوع الأول - مقدمة', 'contentHandler' => 'resource/x-bb-folder', 'hasChildren' => true],
                    ['title' => 'محاضرة 1 - المصفوفات.pdf', 'contentHandler' => 'resource/x-bb-file', 'body' => 'شرح المصفوفات وعملياتها'],
                    ['title' => 'واجب 1 - المصفوفات', 'contentHandler' => 'resource/x-bb-assignment'],
                    ['title' => 'اختبار قصير 1', 'contentHandler' => 'resource/x-bb-asmt-test-link'],
                    ['title' => 'رابط خارجي - W3Schools', 'contentHandler' => 'resource/x-bb-externallink'],
                ],
            ],
            [
                'course_name' => 'MATH301 - التفاضل والتكامل',
                'course_id' => '_12346_1',
                'contents' => [],
            ],
        ];

        $question = 'تنسيق محتوى المقررات (2 مقرر، 5 عناصر)';
        $start = microtime(true);
        $result = $this->callPrivate('formatCourseContents', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('محتوى المقررات', $result);
        $this->assertStringContainsString('CS201', $result);
        $this->assertStringContainsString('📁', $result); // Folder icon
        $this->assertStringContainsString('📄', $result); // File icon
        $this->assertStringContainsString('📝', $result); // Assignment icon
        $this->assertStringContainsString('لا يوجد محتوى', $result); // MATH301 empty
    }

    /**
     * @group formatter
     */
    public function test_format_course_contents_empty(): void
    {
        $question = 'تنسيق محتوى المقررات (فارغ)';
        $start = microtime(true);
        $result = $this->callPrivate('formatCourseContents', [[]]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        $this->assertStringContainsString('لا يوجد محتوى', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_rewards_with_data(): void
    {
        $mockData = [
            ['amount' => '990', 'date' => '2026-02-01', 'status' => 'مصروفة'],
            ['amount' => '990', 'date' => '2026-01-01', 'status' => 'مصروفة'],
            ['amount' => '990', 'date' => '2025-12-01', 'status' => 'مصروفة'],
        ];

        $question = 'تنسيق المكافآت (3 مكافآت)';
        $start = microtime(true);
        $result = $this->callPrivate('formatRewards', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('المكافآت', $result);
        $this->assertStringContainsString('990', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_profile(): void
    {
        $mockData = [
            'profile' => [
                'name' => 'محمد أحمد العمري',
                'student_id' => '441234567',
                'academic' => [
                    'cumulative_gpa' => '4.25',
                    'semester_gpa' => '4.50',
                    'academic_level' => '5',
                    'academic_status' => 'فعال',
                    'total_earned_hours' => 75,
                    'total_plan_hours' => 135,
                    'current_registered_hours' => 18,
                    'remaining_hours_to_graduate' => 60,
                ],
                'major' => ['name' => 'علوم الحاسب'],
                'faculty' => ['name' => 'كلية الحاسب'],
            ],
        ];

        $question = 'تنسيق الملف الشخصي';
        $start = microtime(true);
        $result = $this->callPrivate('formatProfile', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('محمد أحمد العمري', $result);
        $this->assertStringContainsString('441234567', $result);
        $this->assertStringContainsString('4.25', $result);
        $this->assertStringContainsString('علوم الحاسب', $result);
    }

    /**
     * @group formatter
     */
    public function test_format_absences_with_data(): void
    {
        $mockData = [
            [
                'cource_name' => 'هياكل البيانات',
                'cource_code' => 'CS201',
                'absence_all_percent' => '18',
                'absence_excused_percent' => '5',
                'absences' => [
                    ['date' => '2026-02-10', 'excuse' => false],
                    ['date' => '2026-02-15', 'excuse' => true],
                    ['date' => '2026-02-20', 'excuse' => false],
                ],
            ],
            [
                'cource_name' => 'التفاضل والتكامل',
                'cource_code' => 'MATH301',
                'absence_all_percent' => '26',
                'absence_excused_percent' => '0',
                'absences' => [
                    ['date' => '2026-02-05'],
                    ['date' => '2026-02-12'],
                    ['date' => '2026-02-19'],
                    ['date' => '2026-02-22'],
                ],
            ],
        ];

        $question = 'تنسيق سجل الغياب (2 مقرر)';
        $start = microtime(true);
        $result = $this->callPrivate('formatAbsences', [$mockData]);
        $timeMs = (microtime(true) - $start) * 1000;

        $this->printResult($question, $result, $timeMs);

        fwrite(STDOUT, "\n📋 النتيجة المنسقة:\n{$result}\n");

        $this->assertStringContainsString('CS201', $result);
        $this->assertStringContainsString('MATH301', $result);
        $this->assertStringContainsString('⚠️', $result); // CS201 warning
        $this->assertStringContainsString('🔴', $result); // MATH301 critical (>25%)
    }

    // ═══════════════════════════════════════════════════════════════
    //  Full Context Formatter Test
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group formatter
     */
    public function test_format_full_student_context(): void
    {
        $mockContext = [
            'profile' => [
                'profile' => [
                    'name' => 'سعد العتيبي',
                    'student_id' => '442000123',
                    'academic' => [
                        'cumulative_gpa' => '3.85',
                        'academic_status' => 'فعال',
                        'total_earned_hours' => 90,
                        'total_plan_hours' => 135,
                    ],
                    'major' => ['name' => 'هندسة البرمجيات'],
                    'faculty' => ['name' => 'كلية الحاسب'],
                ],
            ],
            'current_courses' => [
                ['course_name' => 'CS301 - هندسة البرمجيات', 'section' => '7281'],
                ['course_name' => 'CS302 - قواعد البيانات', 'section' => '5432'],
            ],
            'announcements' => [
                ['title' => 'موعد الاختبار النصفي', 'course_name' => 'CS301', 'created' => '2026-02-25'],
            ],
            'course_grades' => [
                [
                    'course_name' => 'CS301 - هندسة البرمجيات',
                    'grades' => [
                        ['name' => 'Quiz 1', 'score' => '9', 'possible' => '10'],
                    ],
                ],
            ],
        ];

        $question = 'تنسيق سياق الطالب الكامل (ملف + مقررات + إعلانات + درجات)';
        $start = microtime(true);
        $result = $this->callPrivate('formatStudentContext', [$mockContext]);
        $timeMs = (microtime(true) - $start) * 1000;

        $charCount = mb_strlen($result);
        $this->printResult($question, "تم تنسيق {$charCount} حرف من بيانات الطالب", $timeMs);

        fwrite(STDOUT, "\n📋 السياق الكامل المنسق:\n");
        fwrite(STDOUT, $result . "\n");

        $this->assertStringContainsString('سعد العتيبي', $result);
        $this->assertStringContainsString('هندسة البرمجيات', $result);
        $this->assertStringContainsString('إعلانات', $result);
        $this->assertStringContainsString('درجات', $result);
    }

    // ═══════════════════════════════════════════════════════════════
    //  GPA Status Tests
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group formatter
     */
    public function test_gpa_status_levels(): void
    {
        $cases = [
            [4.8, '🌟', 'ممتاز'],
            [4.0, '✅', 'جيد جداً'],
            [3.0, '✅', 'جيد'],
            [2.5, '⚠️', 'مقبول'],
            [1.5, '🔴', 'ضعيف'],
        ];

        fwrite(STDOUT, "\n📊 مستويات المعدل التراكمي:\n");
        fwrite(STDOUT, str_repeat('─', 50) . "\n");

        foreach ($cases as [$gpa, $expectedIcon, $expectedText]) {
            $start = microtime(true);
            $result = $this->callPrivate('getGpaStatus', [(float) $gpa]);
            $timeMs = (microtime(true) - $start) * 1000;

            fwrite(STDOUT, "  GPA {$gpa} → {$result} (" . number_format($timeMs, 2) . " ms)\n");

            $this->assertStringContainsString($expectedIcon, $result);
            $this->assertStringContainsString($expectedText, $result);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  ensureReferencesPresent Tests (KB usage flag)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Helper to set the private knowledgeBaseUsed property
     */
    private function setKnowledgeBaseUsed(bool $value): void
    {
        $ref = new ReflectionProperty(SmartAdvisorService::class, 'knowledgeBaseUsed');
        $ref->setAccessible(true);
        $ref->setValue($this->service, $value);
    }

    /**
     * @group references
     */
    public function test_references_not_added_when_kb_not_used(): void
    {
        $this->setKnowledgeBaseUsed(false);
        $content = 'عندك 3 مقررات مسجلة هالفصل.';

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertEquals($content, $result, 'Content should be unchanged when KB not used');
        fwrite(STDOUT, "\n✅ بدون KB → المحتوى ما تغير\n");
    }

    /**
     * @group references
     */
    public function test_references_not_added_when_kb_not_used_even_for_regulation_content(): void
    {
        $this->setKnowledgeBaseUsed(false);
        $content = 'حسب اللائحة، الحد الأقصى للتسجيل 10 ساعات بالصيفي.';

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertEquals($content, $result, 'Even regulation-like content should not get refs when KB not used');
        fwrite(STDOUT, "\n✅ محتوى لوائح بدون KB → بدون مراجع\n");
    }

    /**
     * @group references
     */
    public function test_references_kept_when_kb_used_and_already_present(): void
    {
        $this->setKnowledgeBaseUsed(true);
        $content = "الحد الأقصى 10 ساعات بالصيفي.\n\n📚 المراجع:\n- لائحة الفصل الصيفي";

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertStringContainsString('المراجع', $result);
        $this->assertStringNotContainsString('ملاحظة', $result, 'Should not add reminder when refs already exist');
        fwrite(STDOUT, "\n✅ KB مستخدم + مراجع موجودة → ما انضافت مراجع إضافية\n");
    }

    /**
     * @group references
     */
    public function test_references_appended_when_kb_used_and_missing(): void
    {
        $this->setKnowledgeBaseUsed(true);
        $content = 'الحد الأقصى للتسجيل في الفصل الصيفي هو 10 ساعات.';

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertStringContainsString('ملاحظة', $result, 'Should append reminder when KB used but no refs');
        $this->assertStringContainsString('لائحة', $result);
        fwrite(STDOUT, "\n✅ KB مستخدم + بدون مراجع → انضافت مراجع تلقائياً\n");
    }

    /**
     * @group references
     */
    public function test_references_with_source_keyword(): void
    {
        $this->setKnowledgeBaseUsed(true);
        $content = "الحد الأقصى 10 ساعات.\n\nالمصدر: لائحة الفصل الصيفي";

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertStringContainsString('المصدر', $result);
        $this->assertStringNotContainsString('ملاحظة', $result, 'Should not add reminder when المصدر present');
        fwrite(STDOUT, "\n✅ KB مستخدم + كلمة 'المصدر' موجودة → ما انضافت مراجع\n");
    }

    /**
     * @group references
     */
    public function test_contradiction_detected_when_kb_used(): void
    {
        $this->setKnowledgeBaseUsed(true);
        $content = 'يجوز للطالب التسجيل، لكن لا يجوز تجاوز الحد الأقصى.';

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertStringContainsString('تنبيه', $result, 'Should detect contradiction');
        fwrite(STDOUT, "\n✅ تناقض (يجوز / لا يجوز) → تم اكتشافه\n");
    }

    /**
     * @group references
     */
    public function test_no_contradiction_check_when_kb_not_used(): void
    {
        $this->setKnowledgeBaseUsed(false);
        $content = 'يجوز للطالب التسجيل، لكن لا يجوز تجاوز الحد الأقصى.';

        $result = $this->callPrivate('ensureReferencesPresent', [$content]);

        $this->assertEquals($content, $result, 'No contradiction check when KB not used');
        fwrite(STDOUT, "\n✅ بدون KB → ما تتحقق من التناقضات\n");
    }

    // ═══════════════════════════════════════════════════════════════
    //  Knowledge Intents Expansion Tests
    // ═══════════════════════════════════════════════════════════════

    /**
     * @group intent
     */
    public function test_intent_summer_registration_detects_courses_or_regulations(): void
    {
        $question = 'كم ساعة أقدر أسجل بالصيفي؟';
        $intents = $this->callPrivate('detectIntentFallback', [$question]);

        // Should detect at least one of: courses, regulations, schedule
        $relevantIntents = array_intersect($intents, ['courses', 'regulations', 'schedule']);
        $this->assertNotEmpty($relevantIntents, 'Summer registration question should match courses/regulations/schedule');
        fwrite(STDOUT, "\n✅ سؤال صيفي → intents: " . implode(', ', $intents) . "\n");
    }

    /**
     * @group intent
     */
    public function test_intent_course_registration_hours(): void
    {
        $question = 'كم ساعة تسجيل أقدر آخذ هالفصل؟';
        $intents = $this->callPrivate('detectIntentFallback', [$question]);

        $this->assertContains('courses', $intents);
        fwrite(STDOUT, "\n✅ سؤال تسجيل ساعات → intents: " . implode(', ', $intents) . "\n");
    }
}
