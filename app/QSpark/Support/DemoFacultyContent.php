<?php

namespace App\QSpark\Support;

use App\QSpark\Models\QuizQuestion;

/**
 * The demo faculty member's teaching load: the courses, their Blackboard
 * shells and materials, and the AI-generated question bank per course.
 *
 * One source for the seeder (DemoDataSeeder) and for the runtime fallbacks:
 * when the cache tables hold nothing for the signed-in demo instructor, the
 * faculty screens still open on this catalog instead of an empty page, and a
 * course whose bank is empty is filled on first visit so its questions can be
 * edited, exported and deleted like real ones. Everything here is invented.
 */
final class DemoFacultyContent
{
    /** @return array<int, array{0: string, 1: string, 2: string, 3: string, 4: string, 5: string}> [course_no, code, name, section, activity_code, activity_name] */
    public static function catalog(): array
    {
        return [
            ['CRS-101', 'ACCT201', 'Financial Accounting',  '01', 'LEC', 'Lecture'],
            ['CRS-102', 'ACCT305', 'Managerial Accounting', '01', 'LEC', 'Lecture'],
            ['CRS-103', 'ACCT410', 'Auditing Principles',   '02', 'LEC', 'Lecture'],
            ['CRS-104', 'ACCT420', 'Taxation',              '01', 'LAB', 'Lab'],
        ];
    }

    /**
     * The roster — 25 invented students, the single source of every faculty
     * figure: the per-course counts, the dashboard total, the GPA and
     * attendance distributions, the students page and the reports.
     *
     * @return array<int, array{0: string, 1: string, 2: int, 3: float, 4: int}> [student_id, name, course index, GPA, attendance %]
     */
    public static function students(): array
    {
        return [
            // ACCT201 — Financial Accounting (7 students)
            ['444000001', 'نورة عبدالله سعد', 0, 4.90, 98],
            ['444000002', 'ريم خالد',          0, 4.60, 95],
            ['444000003', 'لينا فهد',          0, 4.20, 92],
            ['444000004', 'دانة سعد',          0, 3.90, 88],
            ['444000005', 'هاجر يوسف',         0, 3.40, 80],
            ['444000006', 'بدور ناصر',         0, 2.60, 70],
            ['444000007', 'تالا محمد',         0, 4.75, 91],
            // ACCT305 — Managerial Accounting (6 students)
            ['444000008', 'جوان عبدالعزيز',    1, 4.85, 97],
            ['444000009', 'شهد إبراهيم',       1, 4.50, 93],
            ['444000010', 'رزان حسن',          1, 4.00, 90],
            ['444000011', 'لمى أحمد',          1, 3.80, 85],
            ['444000012', 'عبير صالح',         1, 3.20, 78],
            ['444000013', 'مزون فيصل',         1, 2.40, 55],
            // ACCT410 — Auditing Principles (6 students)
            ['444000014', 'وجد طارق',          2, 4.95, 99],
            ['444000015', 'أسماء بدر',         2, 4.55, 94],
            ['444000016', 'هند ماجد',          2, 4.10, 91],
            ['444000017', 'منيرة محمد',        2, 3.85, 87],
            ['444000018', 'سلمى علي',          2, 3.60, 90],
            ['444000019', 'مها سعيد',          2, 3.10, 72],
            // ACCT420 — Taxation (6 students)
            ['444000020', 'يارا عبدالكريم',    3, 4.70, 96],
            ['444000021', 'لمار سلطان',        3, 4.65, 93],
            ['444000022', 'رنا عبدالرحمن',     3, 4.30, 90],
            ['444000023', 'ساره خالد',         3, 3.95, 86],
            ['444000024', 'دلال محمد',         3, 3.70, 82],
            ['444000025', 'فاطمة عبدالله',     3, 3.30, 90],
        ];
    }

    /** Course rows in the shape SISService returns, for an instructor with no cached rows. */
    public static function courseRows(string $semester): array
    {
        $counts = array_fill(0, count(self::catalog()), 0);
        foreach (self::students() as [, , $courseIndex]) {
            $counts[$courseIndex]++;
        }

        return array_map(fn (array $c, int $i) => (object) [
            'course_no' => $c[0], 'course_code' => $c[1], 'course_name' => $c[2], 'section' => $c[3],
            'activity_code' => $c[4], 'activity_name' => $c[5], 'semester' => $semester,
            'student_count' => $counts[$i], 'campus_name' => 'Main Campus',
        ], self::catalog(), array_keys(self::catalog()));
    }

    /** Student rows in the shape SISService returns — the same roster the course counts are taken from. */
    public static function studentRows(string $semester): array
    {
        $catalog = self::catalog();

        return array_map(function (array $st) use ($catalog, $semester) {
            [$id, $name, $courseIndex, $gpa, $attendance] = $st;
            [$no, $code, $courseName, $section, $actCode] = $catalog[$courseIndex];

            return (object) [
                'student_id' => $id, 'student_name' => $name, 'course_no' => $no, 'course_code' => $code,
                'course_name' => $courseName, 'section' => $section, 'activity_code' => $actCode,
                'last_recorded_gpa' => (float) $gpa, 'attendance_percent' => (float) $attendance,
                'absence_percent' => (float) (100 - $attendance), 'semester' => $semester,
            ];
        }, self::students());
    }

    /**
     * Fill the instructor's cache tables from the demo catalog and roster
     * when they hold nothing for the term. Every faculty screen — dashboard,
     * courses, students, reports — reads these two tables, so filling them
     * once is what keeps the screens in agreement with each other.
     */
    public static function ensureCaches(?string $instructorId, ?string $semester): void
    {
        if (! $instructorId || ! $semester) {
            return;
        }
        try {
            $courses = \Illuminate\Support\Facades\DB::table('faculty_courses_cache')->where('instructor_id', $instructorId)->where('semester', $semester);
            $students = \Illuminate\Support\Facades\DB::table('faculty_students_cache')->where('instructor_id', $instructorId)->where('semester', $semester);
            if ($courses->exists() && $students->exists()) {
                return;
            }
            // Rebuild both together: a roster without its courses (or the reverse) is the contradiction to avoid.
            $courses->delete();
            $students->delete();
            foreach (self::courseRows($semester) as $c) {
                \Illuminate\Support\Facades\DB::table('faculty_courses_cache')->insert([
                    'instructor_id' => $instructorId, 'course_no' => $c->course_no, 'semester' => $semester,
                    'course_code' => $c->course_code, 'course_name' => $c->course_name, 'section' => $c->section,
                    'activity_code' => $c->activity_code, 'activity_name' => $c->activity_name, 'student_count' => $c->student_count,
                    'last_synced_at' => now(), 'created_at' => now(), 'updated_at' => now(),
                ]);
            }
            foreach (self::studentRows($semester) as $st) {
                \Illuminate\Support\Facades\DB::table('faculty_students_cache')->insert([
                    'instructor_id' => $instructorId, 'student_id' => $st->student_id, 'course_no' => $st->course_no, 'semester' => $semester,
                    'student_name' => $st->student_name, 'course_code' => $st->course_code, 'course_name' => $st->course_name,
                    'section' => $st->section, 'activity_code' => $st->activity_code, 'last_recorded_gpa' => $st->last_recorded_gpa,
                    'attendance_percent' => $st->attendance_percent, 'absence_percent' => $st->absence_percent,
                    'last_synced_at' => now(), 'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {
            // The runtime fallbacks in SISService still serve the same catalog and roster.
            \Illuminate\Support\Facades\Log::warning('DemoFacultyContent::ensureCaches failed', ['error' => $e->getMessage()]);
        }
    }

    /** The Blackboard shell matched to a course — what qu-api's /courses/blackboard adds per row. */
    public static function blackboardFor(object $course): array
    {
        return [
            'id' => '_demo'.preg_replace('/\D/', '', (string) $course->course_no).'_1',
            'uuid' => md5('bb-'.$course->course_code),
            'externalId' => $course->course_code.'_'.($course->section ?? '01').'_'.($course->semester ?? ''),
            'courseId' => $course->course_code.'-'.($course->section ?? '01'),
            'name' => $course->course_name,
        ];
    }

    public static function isDemoBlackboardId(string $id): bool
    {
        return str_starts_with($id, '_demo');
    }

    /**
     * The chapters each course's Blackboard shell carries. The course page
     * lists them as lecture slides and the dashboard's remedial-plan units
     * are taken from the same list, so the two can never name different chapters.
     *
     * @return array<string, array<int, string>> course code => chapter titles (1-based order)
     */
    public static function chapters(?string $locale = null): array
    {
        $ar = ($locale ?? app()->getLocale()) === 'ar';

        return $ar ? [
            'ACCT201' => ['المعادلة المحاسبية والقوائم المالية', 'تسجيل العمليات: المدين والدائن', 'قيود التسوية والاستحقاقات'],
            'ACCT305' => ['مفاهيم التكاليف وتصنيفاتها', 'تحليل التكلفة والحجم والربح', 'الموازنات وتحليل الانحرافات'],
            'ACCT410' => ['معايير المراجعة وأخلاقيات المهنة', 'أدلة المراجعة والتوثيق', 'الرقابة الداخلية وتقييم المخاطر'],
            'ACCT420' => ['مبادئ الضرائب', 'ضريبة القيمة المضافة', 'الزكاة وضريبة دخل الشركات'],
        ] : [
            'ACCT201' => ['The Accounting Equation and Financial Statements', 'Recording Transactions: Debits and Credits', 'Adjusting Entries and Accruals'],
            'ACCT305' => ['Cost Concepts and Classifications', 'Cost-Volume-Profit Analysis', 'Budgeting and Variance Analysis'],
            'ACCT410' => ['Audit Standards and Professional Ethics', 'Audit Evidence and Documentation', 'Internal Control and Risk Assessment'],
            'ACCT420' => ['Principles of Taxation', 'Value Added Tax (VAT)', 'Zakat and Corporate Income Tax'],
        ];
    }

    /**
     * The units students miss most — one chapter of each of two courses, with
     * the share of that course's roster it affects.
     *
     * @return array<int, array{course_code: string, chapter: int, error_rate: int, share: float}>
     */
    public static function weakChapters(): array
    {
        return [
            ['course_code' => 'ACCT201', 'chapter' => 3, 'error_rate' => 45, 'share' => 0.57],
            ['course_code' => 'ACCT305', 'chapter' => 2, 'error_rate' => 38, 'share' => 0.5],
        ];
    }

    /** «ACCT201 — Chapter 3: Adjusting Entries and Accruals» — the same words the course page shows. */
    public static function chapterLabel(string $courseCode, int $chapter): string
    {
        $title = self::chapters()[$courseCode][$chapter - 1] ?? null;
        $word = app()->getLocale() === 'ar' ? 'الفصل' : 'Chapter';

        return $courseCode.' — '.$word.' '.$chapter.($title ? ': '.$title : '');
    }

    /**
     * The remedial plan for one weak unit, written around that chapter: its
     * own slides on Blackboard and the course's question bank on QSpark.
     *
     * @return array<string, array<int, string>>
     */
    public static function remedialPlan(string $area): array
    {
        // The unit label arrives in whichever language the dashboard drew it in.
        preg_match('/^(\S+)\s+—\s+(?:Chapter|الفصل)\s+(\d+)(?::\s*(.+))?$/u', trim($area), $m);
        $code = $m[1] ?? '';
        $n = (int) ($m[2] ?? 0);
        $ar = app()->getLocale() === 'ar';
        // Always the reader's language, whatever language the label was sent in.
        $title = self::chapters()[$code][$n - 1] ?? ($m[3] ?? $area);

        if ($ar) {
            $chapter = $n > 0 ? "الفصل {$n} «{$title}»" : "«{$title}»";

            return [
                'teaching_methods' => [
                    "إعادة شرح {$chapter} بمثال محلول خطوة بخطوة قبل الانتقال للفصل التالي",
                    "مراجعة شرائح {$chapter} المرفوعة على Blackboard في أول عشر دقائق من المحاضرة القادمة",
                    'ربط كل مفهوم بحالة عملية قصيرة من بيئة الأعمال المحلية',
                ],
                'activities' => [
                    "تمرين صفّي في مجموعات صغيرة على مسائل {$chapter}",
                    "جلسة تدريس بالأقران يقودها الطلاب الأعلى أداءً في {$code}",
                    'ورقة عمل متدرجة الصعوبة تُسلَّم قبل الاختبار القصير',
                ],
                'assessments' => [
                    "اختبار قصير من بنك أسئلة {$code} على QSpark يبدأ بالمستوى السهل",
                    'إعادة القياس بعد أسبوعين على الأسئلة التي أخطأ فيها الطلاب',
                ],
                'resources' => [
                    "شرائح {$chapter} وورقة المراجعة النصفية على Blackboard",
                    "أسئلة {$code} المصدَّرة من QSpark كمراجعة منزلية",
                ],
                'youtube_videos' => [],
                'online_platforms' => [],
            ];
        }

        $chapter = $n > 0 ? "Chapter {$n} “{$title}”" : "“{$title}”";

        return [
            'teaching_methods' => [
                "Re-teach {$chapter} with one fully worked example before moving to the next chapter",
                "Open the next lecture with a ten-minute review of the {$chapter} slides on Blackboard",
                'Tie each concept to a short practical case from the local business environment',
            ],
            'activities' => [
                "In-class small-group exercise on {$chapter} problems",
                "Peer-tutoring session led by the top-performing students in {$code}",
                'A graded-difficulty worksheet handed in before the quiz',
            ],
            'assessments' => [
                "A short quiz from the {$code} question bank on QSpark, starting at the easy level",
                'Re-measure after two weeks on the questions students got wrong',
            ],
            'resources' => [
                "The {$chapter} slides and the midterm review sheet on Blackboard",
                "The {$code} questions exported from QSpark as take-home review",
            ],
            'youtube_videos' => [],
            'online_platforms' => [],
        ];
    }

    /** The course a demo Blackboard shell id belongs to (`_demo101_1` → ACCT201). */
    private static function courseCodeForShell(string $blackboardId): ?string
    {
        $digits = preg_replace('/\D/', '', explode('_', ltrim($blackboardId, '_'))[0] ?? '');
        foreach (self::catalog() as $c) {
            if (preg_replace('/\D/', '', $c[0]) === $digits) {
                return $c[1];
            }
        }

        return null;
    }

    /**
     * The course's top-level Blackboard contents: the syllabus, lecture slides
     * per chapter, a review sheet and one assignment — the Blackboard Learn
     * `contents` shape.
     *
     * @return array{results: array<int, array<string, mixed>>}
     */
    public static function contents(string $blackboardId): array
    {
        $file = fn (string $id, string $title, string $name) => [
            'id' => $blackboardId.'_'.$id, 'title' => $title, 'hasChildren' => false,
            'contentHandler' => ['id' => 'resource/x-bb-file', 'file' => ['fileName' => $name, 'mimeType' => 'application/pdf']],
            'availability' => ['available' => 'Yes'],
        ];
        $code = self::courseCodeForShell($blackboardId);
        $chapters = $code !== null ? (self::chapters()[$code] ?? []) : [];

        $ar = app()->getLocale() === 'ar';
        $results = [$file('syllabus', $ar ? 'خطة المقرر' : 'Course Syllabus', 'syllabus.pdf')];
        foreach ($chapters ?: ['', '', ''] as $i => $title) {
            $n = $i + 1;
            $results[] = $file('ch'.$n, ($ar ? 'الفصل ' : 'Chapter ').$n.($title !== '' ? ': '.$title : '').($ar ? ' — شرائح المحاضرة' : ' — Lecture Slides'), sprintf('chapter-%02d.pdf', $n));
        }
        $results[] = $file('rev', $ar ? 'ورقة مراجعة منتصف الفصل' : 'Midterm Review Sheet', 'midterm-review.pdf');
        $results[] = ['id' => $blackboardId.'_asg1', 'title' => $ar ? 'الواجب 1' : 'Assignment 1', 'hasChildren' => false, 'contentHandler' => ['id' => 'resource/x-bb-assignment'], 'availability' => ['available' => 'Yes']];

        return ['results' => $results];
    }

    /**
     * 15 AI-generated questions per course (5 easy, 5 medium, 5 hard).
     *
     * @return array<string, array{course_id: string, attachment_key: string, topic: string, questions: array<int, array{0: string, 1: array<int, string>, 2: int, 3: string}>}>
     */
    public static function questionBanks(): array
    {
        return [
            'ACCT201' => [
                'course_id' => 'CRS-101',
                'attachment_key' => 'demo-attachment-acct201-ch1',
                'topic' => 'Financial Accounting Fundamentals',
                'questions' => [
                    ['Financial accounting primarily serves which group of users?', ['Internal managers', 'External users such as investors and creditors', 'Production supervisors', 'Marketing staff'], 1, 'easy'],
                    ['Which equation underlies the balance sheet?', ['Assets = Liabilities − Equity', 'Assets = Liabilities + Equity', 'Assets + Liabilities = Equity', 'Assets × Liabilities = Equity'], 1, 'easy'],
                    ['Which financial statement reports a company\'s position at a point in time?', ['Income statement', 'Balance sheet', 'Cash flow statement', 'Statement of retained earnings'], 1, 'easy'],
                    ['Revenue minus expenses equals:', ['Gross assets', 'Net income', 'Total equity', 'Retained cash'], 1, 'easy'],
                    ['Which of the following is a current asset?', ['Land', 'Accounts receivable', 'Goodwill', 'Long-term debt'], 1, 'easy'],
                    ['A debit entry increases which type of account?', ['Liability', 'Revenue', 'Owner\'s equity', 'Expense'], 3, 'medium'],
                    ['Under accrual accounting, revenue is recognised when:', ['Cash is received', 'It is earned', 'The invoice is paid', 'The fiscal year ends'], 1, 'medium'],
                    ['Depreciation expense is best described as:', ['A cash outflow each period', 'The allocation of an asset\'s cost over its useful life', 'A reduction in the asset\'s market value', 'A liability owed to suppliers'], 1, 'medium'],
                    ['Which account normally carries a credit balance?', ['Cash', 'Equipment', 'Sales revenue', 'Prepaid rent'], 2, 'medium'],
                    ['An adjusting entry for accrued salaries will:', ['Debit cash and credit salaries', 'Debit salaries expense and credit salaries payable', 'Debit salaries payable and credit cash', 'Have no effect on the income statement'], 1, 'medium'],
                    ['IFRS stands for:', ['Internal Financial Reporting Standards', 'International Financial Reporting Standards', 'Indexed Financial Reporting System', 'Integrated Fiscal Reporting Standards'], 1, 'hard'],
                    ['Under the lower-of-cost-or-net-realisable-value rule, inventory is reported at:', ['Always historical cost', 'The lower of cost or net realisable value', 'Always selling price', 'Replacement cost only'], 1, 'hard'],
                    ['A company collects cash in advance for services. The entry recorded is:', ['Debit cash, credit service revenue', 'Debit cash, credit unearned revenue', 'Debit unearned revenue, credit cash', 'Debit accounts receivable, credit revenue'], 1, 'hard'],
                    ['Which inventory method generally yields the highest net income when prices are rising?', ['LIFO', 'FIFO', 'Weighted average', 'Specific identification'], 1, 'hard'],
                    ['The matching principle requires that:', ['Assets are matched with liabilities', 'Expenses are recognised in the same period as the revenues they help generate', 'Cash inflows match cash outflows', 'Revenues are deferred until cash is collected'], 1, 'hard'],
                ],
            ],
            'ACCT305' => [
                'course_id' => 'CRS-102',
                'attachment_key' => 'demo-attachment-acct305-ch1',
                'topic' => 'Managerial Accounting & Cost Analysis',
                'questions' => [
                    ['Managerial accounting information is prepared primarily for:', ['External investors', 'Internal managers and decision-makers', 'Tax authorities', 'External auditors'], 1, 'easy'],
                    ['Which of the following is a variable cost?', ['Factory rent', 'Direct materials', 'Straight-line depreciation', 'Salaried supervisor pay'], 1, 'easy'],
                    ['The contribution margin is calculated as:', ['Sales minus fixed costs', 'Sales minus variable costs', 'Sales minus total costs', 'Fixed costs minus variable costs'], 1, 'easy'],
                    ['A cost that stays constant in total as activity changes is a:', ['Variable cost', 'Fixed cost', 'Mixed cost', 'Step cost'], 1, 'easy'],
                    ['Which of these is a product cost in a manufacturing firm?', ['Sales commissions', 'Direct labour', 'Office utilities', 'Advertising'], 1, 'easy'],
                    ['The break-even point in units equals:', ['Fixed costs ÷ contribution margin per unit', 'Fixed costs ÷ sales price', 'Variable costs ÷ contribution margin', 'Total costs ÷ sales price'], 0, 'medium'],
                    ['In a contribution-margin income statement, costs are classified by:', ['Function', 'Behaviour (variable vs fixed)', 'Department', 'Product line'], 1, 'medium'],
                    ['A favourable direct materials price variance means:', ['Actual price was higher than standard', 'Actual price was lower than standard', 'More material was used than expected', 'Less material was used than expected'], 1, 'medium'],
                    ['Which costing method assigns only variable manufacturing costs to products?', ['Absorption costing', 'Variable (direct) costing', 'Job-order costing', 'Process costing'], 1, 'medium'],
                    ['A relevant cost for a decision is one that:', ['Has already been incurred', 'Differs between alternatives', 'Is always fixed', 'Is recorded in the general ledger'], 1, 'medium'],
                    ['A sunk cost is best described as:', ['A future cost that differs between alternatives', 'A past cost that cannot be changed by any current decision', 'An opportunity cost of the next best alternative', 'A variable cost per unit'], 1, 'hard'],
                    ['Under activity-based costing, overhead is allocated using:', ['A single plant-wide rate', 'Multiple cost drivers linked to activities', 'Direct labour hours only', 'Sales revenue'], 1, 'hard'],
                    ['With idle capacity, a special order priced above its variable cost should generally be:', ['Rejected, because it lowers the average price', 'Accepted, because it increases total contribution margin', 'Rejected, because fixed costs are not covered', 'Accepted only if it covers full absorption cost'], 1, 'hard'],
                    ['The high-low method is used to:', ['Set selling prices', 'Separate a mixed cost into fixed and variable components', 'Allocate joint costs', 'Compute the break-even point'], 1, 'hard'],
                    ['In make-or-buy decisions, avoidable fixed costs are:', ['Always irrelevant', 'Relevant because they change with the decision', 'Treated the same as sunk costs', 'Ignored because they are fixed'], 1, 'hard'],
                ],
            ],
            'ACCT410' => [
                'course_id' => 'CRS-103',
                'attachment_key' => 'demo-attachment-acct410-ch1',
                'topic' => 'Auditing Principles & Assurance',
                'questions' => [
                    ['The primary purpose of a financial statement audit is to:', ['Detect every fraud', 'Express an opinion on whether the statements are fairly presented', 'Prepare the company\'s financial statements', 'Guarantee future profitability'], 1, 'easy'],
                    ['An audit opinion stating the financial statements are fairly presented is called:', ['A qualified opinion', 'An unqualified (unmodified) opinion', 'An adverse opinion', 'A disclaimer of opinion'], 1, 'easy'],
                    ['Auditor independence means the auditor must be:', ['An employee of the client', 'Free from conflicts that impair objectivity', 'A major shareholder of the client', 'Related to client management'], 1, 'easy'],
                    ['Audit evidence is gathered to support the:', ['Client\'s marketing claims', 'Auditor\'s opinion', 'Company\'s tax return only', 'Board of directors\' salaries'], 1, 'easy'],
                    ['Which document outlines the scope and terms of an audit?', ['The management letter', 'The engagement letter', 'The audit report', 'The trial balance'], 1, 'easy'],
                    ['Inherent risk refers to:', ['The risk controls fail to catch a misstatement', 'The susceptibility of an assertion to misstatement before considering controls', 'The risk the auditor fails to detect a misstatement', 'The risk of issuing the wrong report type'], 1, 'medium'],
                    ['Which assertion relates to whether recorded assets actually exist?', ['Completeness', 'Existence', 'Valuation', 'Cut-off'], 1, 'medium'],
                    ['Tests of controls are performed to:', ['Detect all fraud', 'Evaluate the operating effectiveness of internal controls', 'Confirm account balances directly', 'Prepare adjusting entries'], 1, 'medium'],
                    ['Materiality in auditing is based on:', ['Only the size of an item', 'Whether an omission or misstatement could influence users\' decisions', 'The client\'s preference', 'The audit fee'], 1, 'medium'],
                    ['Confirming accounts receivable balances with customers is an example of:', ['A test of controls', 'A substantive procedure', 'An analytical-only procedure', 'A management estimate'], 1, 'medium'],
                    ['Audit risk is the risk that the auditor:', ['Loses the client', 'Issues an unmodified opinion on materially misstated statements', 'Spends too much time on the engagement', 'Fails to collect the audit fee'], 1, 'hard'],
                    ['When internal controls are assessed as strong, the auditor may:', ['Eliminate all substantive testing', 'Reduce the extent of substantive procedures', 'Increase detection risk to zero', 'Skip the engagement letter'], 1, 'hard'],
                    ['An adverse opinion is issued when:', ['There is a minor scope limitation', 'The financial statements are materially and pervasively misstated', 'The auditor lacks independence only', 'The client changes accounting estimates'], 1, 'hard'],
                    ['Professional scepticism requires the auditor to:', ['Assume management is always honest', 'Maintain a questioning mind and critically assess evidence', 'Rely solely on prior-year working papers', 'Accept client explanations without corroboration'], 1, 'hard'],
                    ['Analytical procedures are required during which audit phases?', ['Planning and final review', 'Only during fieldwork', 'Only after the report is issued', 'They are never required'], 0, 'hard'],
                ],
            ],
            'ACCT420' => [
                'course_id' => 'CRS-104',
                'attachment_key' => 'demo-attachment-acct420-ch1',
                'topic' => 'Principles of Taxation',
                'questions' => [
                    ['A tax levied directly on an individual\'s or company\'s income is a:', ['Indirect tax', 'Direct tax', 'Excise tax', 'Tariff'], 1, 'easy'],
                    ['Value Added Tax (VAT) is an example of a(n):', ['Direct tax on profits', 'Indirect tax on consumption', 'Tax on land only', 'Payroll tax'], 1, 'easy'],
                    ['Taxable income is generally calculated as:', ['Gross income minus allowable deductions', 'Gross income plus deductions', 'Total assets minus liabilities', 'Revenue minus dividends'], 0, 'easy'],
                    ['A tax deduction reduces:', ['The tax rate', 'Taxable income', 'The tax credit', 'Gross revenue only'], 1, 'easy'],
                    ['The party legally responsible for remitting a tax to the authority is the:', ['Tax consultant', 'Taxpayer', 'Auditor', 'Shareholder'], 1, 'easy'],
                    ['A progressive tax system is one where the tax rate:', ['Decreases as income rises', 'Increases as income rises', 'Stays the same at all income levels', 'Applies only to corporations'], 1, 'medium'],
                    ['A tax credit differs from a tax deduction because a credit:', ['Reduces taxable income', 'Reduces the tax liability directly', 'Increases gross income', 'Only applies to companies'], 1, 'medium'],
                    ['Zakat in Saudi Arabia is best described as:', ['A consumption tax on goods', 'A religiously mandated levy on qualifying wealth', 'A customs duty', 'A payroll contribution'], 1, 'medium'],
                    ['Withholding tax is typically:', ['Paid only at year-end by the taxpayer', 'Deducted at source from a payment', 'A refund of overpaid VAT', 'A penalty for late filing'], 1, 'medium'],
                    ['Double taxation refers to:', ['Filing two tax returns', 'The same income being taxed twice (e.g. corporate profit then dividends)', 'Paying tax in advance', 'A penalty equal to twice the tax'], 1, 'medium'],
                    ['A tax base is best defined as:', ['The rate applied to income', 'The amount or value on which a tax is calculated', 'The deadline for filing', 'The penalty for evasion'], 1, 'hard'],
                    ['Tax avoidance differs from tax evasion in that avoidance is:', ['Illegal concealment of income', 'The legal arrangement of affairs to minimise tax', 'Always penalised by fines', 'A form of withholding tax'], 1, 'hard'],
                    ['Under the standard VAT mechanism, a registered business remits:', ['All output VAT collected with no offset', 'Output VAT collected minus input VAT paid', 'Only input VAT', 'A flat fee regardless of sales'], 1, 'hard'],
                    ['A permanent difference between accounting and taxable income:', ['Reverses in a future period', 'Never reverses in future periods', 'Always creates a deferred tax asset', 'Is the same as a temporary difference'], 1, 'hard'],
                    ['The principle of tax neutrality suggests that taxes should:', ['Heavily favour one industry', 'Minimise distortion of economic decisions', 'Always be progressive', 'Be collected only from corporations'], 1, 'hard'],
                ],
            ],
        ];
    }

    /**
     * Make sure a demo course has its bank, and that part of it reads as
     * already exported: the faculty page separates «new» from «exported», and
     * a bank with nothing exported hides half of the feature.
     */
    public static function ensureQuestions(string $courseCode, ?string $instructorId = null, ?string $studentId = null): void
    {
        $bank = self::questionBanks()[$courseCode] ?? null;
        if ($bank === null) {
            return;
        }
        if (! QuizQuestion::where('course_code', $courseCode)->exists()) {
            foreach ($bank['questions'] as $k => [$q, $opts, $correct, $diff]) {
                QuizQuestion::query()->insert([
                    'attachment_key' => $bank['attachment_key'], 'question_hash' => md5("{$courseCode}|{$q}"),
                    'course_code' => $courseCode, 'course_id' => $bank['course_id'], 'question' => $q,
                    'options' => json_encode($opts), 'correct_index' => $correct, 'difficulty' => $diff,
                    'type' => 'enemy', 'language' => 'en', 'student_id' => $studentId, 'topic' => $bank['topic'],
                    'created_at' => now()->subDays(20 - $k), 'updated_at' => now()->subDays(20 - $k),
                ]);
            }
        }
        if (! QuizQuestion::where('course_code', $courseCode)->whereNotNull('exported_at')->exists()) {
            $by = $instructorId ?: 'E10001';
            $first = QuizQuestion::where('course_code', $courseCode)->orderBy('id')->limit(6)->pluck('id');
            QuizQuestion::whereIn('id', $first)->update(['exported_at' => now()->subDays(6), 'exported_by' => $by]);
            QuizQuestion::whereIn('id', $first->take(2))->update(['edited_at' => now()->subDays(7), 'edited_by' => $by]);
        }
    }
}
