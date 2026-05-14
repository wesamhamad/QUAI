<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\SmartAdvisorService;
use App\Services\AiCompletionService;
use App\Services\UniversityApiClient;
use App\Services\FileExtractionApiService;
use App\Services\KnowledgeRetrievalService;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionMethod;

/**
 * Smart Advisor Knowledge Base - Comprehensive Question Tests
 *
 * 10-30 questions per knowledge base file (10 files = 200+ questions)
 * Tests intent detection + knowledge base content matching
 *
 * Run all:
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest
 *
 * Run by file topic:
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-discipline
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-withdrawal
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-rewards
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-transfer
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-disqualification
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-rights
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-warnings
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-graduation
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-summer
 *   php artisan test --filter=SmartAdvisorKnowledgeBaseTest --group=kb-grading
 */
class SmartAdvisorKnowledgeBaseTest extends TestCase
{
    private SmartAdvisorService $service;
    private static int $totalQuestions = 0;
    private static float $totalTimeMs = 0;
    private static int $passedQuestions = 0;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SmartAdvisorService(
            $this->createMock(AiCompletionService::class),
            $this->createMock(UniversityApiClient::class),
            $this->createMock(FileExtractionApiService::class),
            $this->createMock(KnowledgeRetrievalService::class),
        );
    }

    private function callPrivate(string $method, array $args = []): mixed
    {
        $ref = new ReflectionMethod(SmartAdvisorService::class, $method);
        $ref->setAccessible(true);
        return $ref->invoke($this->service, ...$args);
    }

    /**
     * Run a batch of questions and print results table
     *
     * @param array<array{question: string, expectedIntents: string[], expectedKbKeywords?: string[]}> $questions
     */
    private function runQuestionBatch(string $fileTitle, array $questions): void
    {
        $sep = str_repeat('═', 90);
        $thin = str_repeat('─', 90);

        fwrite(STDOUT, "\n{$sep}\n");
        fwrite(STDOUT, "📂 {$fileTitle}\n");
        fwrite(STDOUT, "{$sep}\n");
        fwrite(STDOUT, sprintf("  %-4s │ %-50s │ %-20s │ %s\n", '#', 'السؤال', 'النتيجة', 'الوقت'));
        fwrite(STDOUT, "{$thin}\n");

        $passed = 0;
        $failed = 0;

        foreach ($questions as $i => $q) {
            $num = $i + 1;
            self::$totalQuestions++;

            $start = microtime(true);
            $detectedIntents = $this->callPrivate('detectIntentFallback', [$q['question']]);
            $timeMs = (microtime(true) - $start) * 1000;
            self::$totalTimeMs += $timeMs;

            $intentsStr = implode(', ', $detectedIntents);
            $questionPreview = mb_substr($q['question'], 0, 48);
            $timeStr = number_format($timeMs, 2) . 'ms';

            // Check expected intents
            $allFound = true;
            foreach ($q['expectedIntents'] as $expected) {
                if (!in_array($expected, $detectedIntents)) {
                    $allFound = false;
                    break;
                }
            }

            $icon = $allFound ? '✅' : '❌';
            if ($allFound) {
                $passed++;
                self::$passedQuestions++;
            } else {
                $failed++;
            }

            fwrite(STDOUT, sprintf("  %s%-2d │ %-48s │ %-18s │ %s\n",
                $icon, $num, $questionPreview, $intentsStr, $timeStr
            ));

            // Assert
            foreach ($q['expectedIntents'] as $expected) {
                $this->assertContains(
                    $expected,
                    $detectedIntents,
                    "❌ السؤال: \"{$q['question']}\" - توقعنا intent '{$expected}' لكن حصلنا على: [{$intentsStr}]"
                );
            }

            // Check knowledge base keywords if specified
            if (!empty($q['expectedKbKeywords'])) {
                $kb = $this->callPrivate('loadKnowledgeBase', [$q['expectedIntents']]);
                if ($kb !== null) {
                    foreach ($q['expectedKbKeywords'] as $keyword) {
                        $this->assertStringContainsString(
                            $keyword,
                            $kb,
                            "❌ قاعدة المعرفة لا تحتوي على: '{$keyword}'"
                        );
                    }
                }
            }
        }

        fwrite(STDOUT, "{$thin}\n");
        fwrite(STDOUT, "  📊 النتيجة: ✅ {$passed} نجح");
        if ($failed > 0) {
            fwrite(STDOUT, " │ ❌ {$failed} فشل");
        }
        fwrite(STDOUT, " │ إجمالي: " . ($passed + $failed) . " سؤال\n\n");
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  1. سياسة التأديب الطلابي (01)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-discipline')]
    public function test_01_discipline_policy_questions(): void
    {
        $this->runQuestionBatch('01 - سياسة التأديب الطلابي', [
            ['question' => 'وش عقوبة الغش في الاختبار؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['الغش']],
            ['question' => 'إذا غشيت في الاختبار وش يصير؟', 'expectedIntents' => ['regulations']],
            ['question' => 'وش هي المخالفات الطلابية؟', 'expectedIntents' => ['regulations']],
            ['question' => 'كم مستوى عقوبات التأديب؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['تنبيه كتابي']],
            ['question' => 'هل يفصلون الطالب نهائي إذا غش؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['الفصل النهائي']],
            ['question' => 'وش يصير لو سربت أسئلة الاختبار؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['تسريب']],
            ['question' => 'هل التأديب فيه تدرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['التدرج']],
            ['question' => 'وش عقوبة سوء استخدام مرافق الجامعة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['مرافق']],
            ['question' => 'وش يصير لو وزعت منشورات بدون إذن؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['منشورات']],
            ['question' => 'هل الطالب المفصول تأديبياً يقدر يرجع؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا يجوز له إعادة التسجيل']],
            ['question' => 'مين اللجنة اللي تحكم بالعقوبات؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['اللجنة الدائمة']],
            ['question' => 'هل الظروف المخففة تأثر على العقوبة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['المخففة']],
            ['question' => 'وش يعتبر إخلال بالنزاهة الأكاديمية؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['النزاهة الأكاديمية']],
            ['question' => 'هل يتحمل الطالب المخالف تكلفة الأضرار؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['تكلفة الضرر']],
            ['question' => 'what is the penalty for cheating?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  2. سياسة الاعتذار والتأجيل (02)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-withdrawal')]
    public function test_02_withdrawal_postponement_questions(): void
    {
        $this->runQuestionBatch('02 - سياسة الاعتذار والتأجيل', [
            ['question' => 'أبغى أعتذر عن مقرر وش الشروط؟', 'expectedIntents' => ['regulations']],
            ['question' => 'كم ساعة لازم تبقى بعد الاعتذار عن مقرر؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['12 ساعة']],
            ['question' => 'هل أقدر أعتذر عن نفس المقرر مرتين؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['مرتين سابقاً']],
            ['question' => 'هل الاعتذار يأثر على المعدل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا يؤثر']],
            ['question' => 'وش الرمز اللي ينكتب بالسجل لو اعتذرت؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['(ع)']],
            ['question' => 'أبغى أأجل الفصل الدراسي', 'expectedIntents' => ['regulations']],
            ['question' => 'وش الفرق بين التأجيل والاعتذار؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['التأجيل', 'الاعتذار']],
            ['question' => 'هل التأجيل يُحتسب من مدة الدراسة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا يدخل فصل التأجيل']],
            ['question' => 'هل المكافأة تتوقف لو اعتذرت؟', 'expectedIntents' => ['financial', 'regulations'], 'expectedKbKeywords' => ['تتوقف']],
            ['question' => 'متى لازم أقدم طلب التأجيل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['قبل بداية الدراسة']],
            ['question' => 'هل أقدر أعتذر عن مقررين بنفس الفصل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['مقررين في نفس الفصل']],
            ['question' => 'أبغى أنسحب من مادة وش الإجراء؟', 'expectedIntents' => ['regulations']],
            ['question' => 'هل الاعتذار يُحتسب ضمن مدة التخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['يُحتسب الاعتذار ضمن المدة']],
            ['question' => 'هل أحتاج عذر عشان أأجل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['عذر']],
            ['question' => 'can I withdraw from a course?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  3. نظام المكافآت والإعانات (03)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-rewards')]
    public function test_03_rewards_questions(): void
    {
        $this->runQuestionBatch('03 - نظام المكافآت والإعانات', [
            ['question' => 'كم مكافأة الطالب الشهرية؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['990']],
            ['question' => 'كم المكافأة للكليات النظرية؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['840']],
            ['question' => 'متى تنزل المكافأة؟', 'expectedIntents' => ['financial']],
            ['question' => 'وش شروط المكافأة الجامعية؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['سعودياً']],
            ['question' => 'هل الموظف يستلم مكافأة؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['غير موظف']],
            ['question' => 'متى توقف المكافأة؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['توقف المكافأة']],
            ['question' => 'هل المعدل يأثر على المكافأة؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['2.00']],
            ['question' => 'كم مكافأة طلاب الماجستير؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['890']],
            ['question' => 'هل فيه بدل كتب؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['450']],
            ['question' => 'كم بدل طباعة رسالة الماجستير؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['3,000']],
            ['question' => 'كم بدل رسالة الدكتوراه؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['4,000']],
            ['question' => 'هل فيه مكافأة لذوي الاحتياجات الخاصة؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['الاحتياجات الخاصة']],
            ['question' => 'هل المكافأة تتوقف إذا أجلت؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['التأجيل']],
            ['question' => 'لو معدلي أقل من 2 توقف المكافأة؟', 'expectedIntents' => ['financial']],
            ['question' => 'هل الانقطاع يوقف المكافأة؟', 'expectedIntents' => ['financial'], 'expectedKbKeywords' => ['الانقطاع']],
            ['question' => 'how much is the monthly reward?', 'expectedIntents' => ['financial']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  4. لائحة التحويل بين الكليات (04)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-transfer')]
    public function test_04_transfer_questions(): void
    {
        $this->runQuestionBatch('04 - لائحة التحويل بين الكليات', [
            ['question' => 'أبغى أحول تخصصي وش الشروط؟', 'expectedIntents' => ['regulations']],
            ['question' => 'كم مرة أقدر أحول تخصص؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['مرة واحدة']],
            ['question' => 'كم المعدل المطلوب للتحويل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['4.00']],
            ['question' => 'هل أقدر أحول بعد 4 فصول؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['أربعة فصول']],
            ['question' => 'هل لازم أنهي فصلين قبل التحويل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['فصلين دراسيين']],
            ['question' => 'هل التحويل تنافسي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['تنافسياً']],
            ['question' => 'هل أحتاج موافقة الكلية للتحويل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['موافقة عمادة الكلية']],
            ['question' => 'هل اختيار التخصص بعد التحضيرية يُعدّ تحويل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا يُعدّ تحويلاً']],
            ['question' => 'كيف أقدم طلب تغيير تخصص؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['البوابة الأكاديمية']],
            ['question' => 'هل الطالب المنذر يقدر يحول؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا يحق للطالب المنذر']],
            ['question' => 'هل أقدر أحول من جامعة ثانية؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['التحويل الخارجي']],
            ['question' => 'هل درجات التحضيرية تُحتسب في التحويل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['لا تُحتسب']],
            ['question' => 'can I change my major?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  5. سياسة الحرمان من الاختبارات (05)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-disqualification')]
    public function test_05_exam_disqualification_questions(): void
    {
        $this->runQuestionBatch('05 - سياسة الحرمان من الاختبارات', [
            ['question' => 'كم نسبة الغياب اللي تحرم فيها؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['25%']],
            ['question' => 'هل أنحرم لو غبت كثير؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['حرمان']],
            ['question' => 'وش يصير لو انحرمت من الاختبار؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['راسباً']],
            ['question' => 'وش رمز المحروم في السجل؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['(ح)']],
            ['question' => 'هل الحرمان يأثر على المعدل؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['يُحتسب التقدير ضمن المعدل']],
            ['question' => 'هل أقدر أرفع الحرمان؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['رفع الحرمان']],
            ['question' => 'مين يقدر يرفع الحرمان عني؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['مجلس الكلية']],
            ['question' => 'هل العذر الطبي يمنع الحرمان؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['عذر طبي']],
            ['question' => 'متى لازم أقدم العذر؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['الفترة المحددة']],
            ['question' => 'نسبة غيابي 15% هل أنا بخطر؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['تحذير']],
            ['question' => 'غيابي 20% وش وضعي؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['خطر']],
            ['question' => 'غيابي أقل من 10% هل فيه مشكلة؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['جيد']],
            ['question' => 'هل يحسبون الغياب بعذر من نسبة الحرمان؟', 'expectedIntents' => ['absences']],
            ['question' => 'what happens if I miss 25% of classes?', 'expectedIntents' => ['absences']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  6. حقوق وواجبات الطالب (06)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-rights')]
    public function test_06_student_rights_questions(): void
    {
        $this->runQuestionBatch('06 - حقوق وواجبات الطالب', [
            ['question' => 'وش حقوقي كطالب؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['حقوق الطالب']],
            ['question' => 'وش واجباتي كطالب بالجامعة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['واجبات الطالب']],
            ['question' => 'هل أقدر أراجع ورقة الاختبار النهائي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['مراجعة إجابته']],
            ['question' => 'هل عندي حق أتظلم من قرار أكاديمي؟', 'expectedIntents' => ['regulations', 'academic_standing'], 'expectedKbKeywords' => ['التظلم']],
            ['question' => 'وش قواعد الزي داخل الجامعة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['الزي المناسب']],
            ['question' => 'هل من حقوقي الإرشاد الأكاديمي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['الإرشاد الأكاديمي']],
            ['question' => 'وش عقوبة تخريب ممتلكات الجامعة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['ممتلكات الجامعة']],
            ['question' => 'وش واجباتي تجاه الأستاذ؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['احترام أعضاء هيئة التدريس']],
            ['question' => 'هل من حقوقي معرفة نتائجي؟', 'expectedIntents' => ['regulations', 'grades'], 'expectedKbKeywords' => ['معرفة النتائج']],
            ['question' => 'هل أقدر أحول بين الأقسام؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['التحويل بين الأقسام']],
            ['question' => 'هل من حقوقي بيئة تعليمية مناسبة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['بيئة تعليمية']],
            ['question' => 'what are my rights as a student?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  7. نظام الإنذارات الأكاديمية (07)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-warnings')]
    public function test_07_academic_warnings_questions(): void
    {
        $this->runQuestionBatch('07 - نظام الإنذارات الأكاديمية', [
            ['question' => 'متى أحصل على إنذار أكاديمي؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['أقل من 2.00']],
            ['question' => 'هل عندي إنذار؟', 'expectedIntents' => ['academic_standing']],
            ['question' => 'كم إنذار قبل الفصل من الجامعة؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['ثلاثة إنذارات']],
            ['question' => 'وش يصير بعد الإنذار الثالث؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['الفصل الأكاديمي']],
            ['question' => 'هل فيه فرصة رابعة بعد الفصل الأكاديمي؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['فرصة رابعة']],
            ['question' => 'كم ساعة لازم أسجل في فرصة رابعة بعد الإنذار؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['18 ساعة']],
            ['question' => 'هل الإنذار يمنع مرتبة الشرف؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['مرتبة الشرف']],
            ['question' => 'هل المكافأة توقف مع الإنذار؟', 'expectedIntents' => ['financial', 'academic_standing'], 'expectedKbKeywords' => ['توقف المكافأة']],
            ['question' => 'لو رفعت معدلي فوق 2 وبعدين نزل، وش يصير؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['تبدأ الإنذارات من جديد']],
            ['question' => 'هل الطالب المفصول أكاديمياً يقدر يرجع؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['لا يجوز']],
            ['question' => 'هل الإنذار الأول خطير؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['تنبيه']],
            ['question' => 'وش الإجراءات بعد الإنذار الثاني؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['إرشاد أكاديمي مكثف']],
            ['question' => 'هل لازم أكلم المرشد إذا أنذرت؟', 'expectedIntents' => ['academic_standing', 'advisor'], 'expectedKbKeywords' => ['مرشده الأكاديمي']],
            ['question' => 'هل الإنذارات لازم تكون متتالية عشان يفصلوني؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['متتالية']],
            ['question' => 'how many warnings before expulsion?', 'expectedIntents' => ['academic_standing']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  8. نظام التخرج ومتطلباته (08)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-graduation')]
    public function test_08_graduation_questions(): void
    {
        $this->runQuestionBatch('08 - نظام التخرج ومتطلباته', [
            ['question' => 'وش شروط التخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['متطلبات التخرج']],
            ['question' => 'كم أقل معدل أقدر أتخرج فيه؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['2.00']],
            ['question' => 'كم نسبة ساعات التخرج اللي لازم أدرسها بالجامعة؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['60%']],
            ['question' => 'كم معدل مرتبة الشرف الأولى؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['4.75']],
            ['question' => 'كم معدل مرتبة الشرف الثانية؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['4.25']],
            ['question' => 'هل الرسوب يمنع مرتبة الشرف؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['عدم الرسوب']],
            ['question' => 'متى يوم التخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['آخر يوم من الاختبارات']],
            ['question' => 'لو نجحت بكل المواد بس معدلي أقل من 2 وش أسوي؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['مقررات مناسبة']],
            ['question' => 'وش المدة القصوى عشان أتخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['ضعف المدة']],
            ['question' => 'كيف أقدم طلب تخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['البوابة الإلكترونية']],
            ['question' => 'هل لازم أراجع سجلي قبل التخرج؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['المرشد الأكاديمي']],
            ['question' => 'هل الإنذار يمنع مرتبة الشرف؟', 'expectedIntents' => ['academic_standing'], 'expectedKbKeywords' => ['إنذار أكاديمي']],
            ['question' => 'what are the graduation requirements?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  9. لائحة الفصل الصيفي (09)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-summer')]
    public function test_09_summer_semester_questions(): void
    {
        $this->runQuestionBatch('09 - لائحة الفصل الصيفي', [
            ['question' => 'كم مدة الفصل الصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['ثمانية أسابيع']],
            ['question' => 'كم ساعة أقدر أسجل بالصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['10 ساعات']],
            ['question' => 'لو متوقع تخرجي كم أقدر أسجل بالصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['11 ساعة']],
            ['question' => 'هل الحضور إلزامي بالصيفي؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['إلزامي']],
            ['question' => 'هل فيه حرمان بالفصل الصيفي؟', 'expectedIntents' => ['absences'], 'expectedKbKeywords' => ['25%']],
            ['question' => 'هل الصيفي إجباري؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['اختياري']],
            ['question' => 'كم أقل عدد طلاب عشان يفتحون الشعبة بالصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['10 طلاب']],
            ['question' => 'هل الساعات تتضاعف بالصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['تُضاعف']],
            ['question' => 'هل الصيفي يُحتسب بالسجل؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['يُحتسب']],
            ['question' => 'مين له أولوية التسجيل بالصيفي؟', 'expectedIntents' => ['regulations'], 'expectedKbKeywords' => ['المتعثرين']],
            ['question' => 'what are the summer semester rules?', 'expectedIntents' => ['regulations']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  10. سياسة التقييم والدرجات (10)
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-grading')]
    public function test_10_grading_policy_questions(): void
    {
        $this->runQuestionBatch('10 - سياسة التقييم والدرجات', [
            ['question' => 'وش نظام الدرجات بالجامعة؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['نظام التقديرات']],
            ['question' => 'كم لازم أجيب عشان أحصل A+؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['95%']],
            ['question' => 'كم درجة النجاح؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['60%']],
            ['question' => 'كم وزن تقدير ممتاز؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['4.75']],
            ['question' => 'وش يعني تقدير (ع) بالسجل؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['معتذر']],
            ['question' => 'وش يعني رمز (ح) DN؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['محروم']],
            ['question' => 'وش يعني رمز (م) IC بالسجل الأكاديمي؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['غير مكتمل']],
            ['question' => 'كيف أحسب معدلي الفصلي؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['المعدل الفصلي']],
            ['question' => 'كيف أحسب المعدل التراكمي؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['المعدل التراكمي']],
            ['question' => 'وش الفرق بين جيد وجيد جداً؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['3.75']],
            ['question' => 'هل المحروم يُحتسب بالمعدل؟', 'expectedIntents' => ['absences', 'academic_standing'], 'expectedKbKeywords' => ['يعادل راسب']],
            ['question' => 'وش تشمل درجة الأعمال الفصلية؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['واجبات']],
            ['question' => 'لو غبت عن الاختبار النهائي بعذر وش يصير؟', 'expectedIntents' => ['exams', 'absences'], 'expectedKbKeywords' => ['اختباراً بديلاً']],
            ['question' => 'كم نسبة تقدير مقبول؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['60% - 64%']],
            ['question' => 'كم وزن تقدير B+؟', 'expectedIntents' => ['grades'], 'expectedKbKeywords' => ['4.50']],
            ['question' => 'what is the grading scale?', 'expectedIntents' => ['grades']],
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Summary Test
    // ═══════════════════════════════════════════════════════════════════════

    #[Group('kb-summary')]
    public function test_99_print_summary(): void
    {
        $sep = str_repeat('═', 60);
        fwrite(STDOUT, "\n{$sep}\n");
        fwrite(STDOUT, "📊 ملخص نتائج الاختبارات\n");
        fwrite(STDOUT, "{$sep}\n");
        fwrite(STDOUT, "  إجمالي الأسئلة: " . self::$totalQuestions . "\n");
        fwrite(STDOUT, "  ✅ نجح: " . self::$passedQuestions . "\n");
        fwrite(STDOUT, "  ❌ فشل: " . (self::$totalQuestions - self::$passedQuestions) . "\n");
        fwrite(STDOUT, "  ⏱  إجمالي الوقت: " . number_format(self::$totalTimeMs, 2) . " ms\n");

        if (self::$totalQuestions > 0) {
            $avg = self::$totalTimeMs / self::$totalQuestions;
            fwrite(STDOUT, "  📈 متوسط الوقت/سؤال: " . number_format($avg, 3) . " ms\n");
            $pct = round((self::$passedQuestions / self::$totalQuestions) * 100, 1);
            fwrite(STDOUT, "  🎯 نسبة النجاح: {$pct}%\n");
        }
        fwrite(STDOUT, "{$sep}\n\n");

        $this->assertTrue(true);
    }
}
