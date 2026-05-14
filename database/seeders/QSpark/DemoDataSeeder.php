<?php

namespace Database\Seeders\QSpark;

use App\QSpark\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the demo sandbox with fictional but realistic data so every
 * dashboard renders non-empty.
 *
 * Idempotent: rerunning will upsert rather than duplicate.
 */
class DemoDataSeeder extends Seeder
{
    private const SEMESTER = '462';
    private const PASSWORD = 'demo1234';
    private const FACULTY_NO = '5';
    private const FACULTY_NAME = 'College of Business and Economics';
    private const DEPT_NO = '12';
    private const DEPT_NAME = 'Accounting Department';
    private const MAJOR_NO = '120';
    private const MAJOR_NAME = 'Accounting';

    public function run(): void
    {
        $password = Hash::make(self::PASSWORD);
        $now = Carbon::now();

        $this->command->info('Seeding demo users…');
        $admin = User::updateOrCreate(
            ['username' => 'demo_admin'],
            [
                'name' => 'System Admin',
                'email' => 'demo_admin@demo.qspark.test',
                'uuid' => 'demo_admin',
                'role' => 'admin',
                'password' => $password,
                'is_active' => true,
                'preferred_language' => 'en',
                'arabic_full_name' => 'مسؤول النظام',
                'english_full_name' => 'System Admin',
                'arabic_first_name' => 'مسؤول',
                'arabic_family_name' => 'النظام',
                'english_first_name' => 'System',
                'english_family_name' => 'Admin',
            ]
        );

        $faculty = User::updateOrCreate(
            ['username' => 'demo_faculty'],
            [
                'name' => 'Faculty Member',
                'email' => 'demo_faculty@demo.qspark.test',
                'uuid' => 'demo_faculty',
                'employee_id' => 'E10001',
                'role' => 'faculty',
                'password' => $password,
                'is_active' => true,
                'preferred_language' => 'en',
                'arabic_full_name' => 'د. خالد بن سعد',
                'english_full_name' => 'Dr. Khalid S.',
                'arabic_first_name' => 'خالد',
                'arabic_family_name' => '',
                'english_first_name' => 'Khalid',
                'english_family_name' => '',
            ]
        );

        $student = User::updateOrCreate(
            ['username' => 'demo_student'],
            [
                'name' => 'Test Student',
                'email' => 'demo_student@demo.qspark.test',
                'uuid' => '444000001',
                'role' => 'student',
                'password' => $password,
                'is_active' => true,
                'preferred_language' => 'ar',
                'arabic_full_name' => 'نورة عبدالله سعد',
                'english_full_name' => 'Noura Abdullah S',
                'arabic_first_name' => 'نورة',
                'arabic_family_name' => '',
                'english_first_name' => 'Noura',
                'english_family_name' => '',
            ]
        );

        $this->seedRolePivots($admin->id, $faculty->id, $student->id);
        $this->seedDailyVisits();
        $this->seedAdminFacultyCaches();
        $this->seedAdminStudentsCache();
        $this->seedAdminEngagementMetrics();
        $this->seedAdminImprovingStudents();
        $this->seedAdminTrendData();
        $this->seedFacultyCoursesCache($faculty->employee_id);
        $this->seedFacultyStudentsCache($faculty->employee_id);
        $this->seedOracleStudentsCache();
        $this->seedRegisteredStudents();
        $this->seedStudentPlayHours($student->uuid);
        $this->seedQuizContent($student->uuid);
        $this->seedStudentMonthlyRecommendation($student->uuid);

        $this->command->info('Demo data seeded. Login with demo_admin / demo_faculty / demo_student (password: '.self::PASSWORD.').');
    }

    private function seedRolePivots(int $adminId, int $facultyId, int $studentId): void
    {
        $roleIds = DB::table('roles')->pluck('id', 'name');
        if ($roleIds->isEmpty()) {
            return; // RolesAndPermissionsSeeder hasn't been run; skip silently.
        }

        $assignments = array_filter([
            isset($roleIds['admin']) ? ['user_id' => $adminId, 'role_id' => $roleIds['admin']] : null,
            isset($roleIds['faculty']) ? ['user_id' => $facultyId, 'role_id' => $roleIds['faculty']] : null,
            isset($roleIds['student']) ? ['user_id' => $studentId, 'role_id' => $roleIds['student']] : null,
        ]);
        foreach ($assignments as $a) {
            DB::table('role_user')->updateOrInsert(
                ['user_id' => $a['user_id'], 'role_id' => $a['role_id']],
                ['assigned_at' => now()]
            );
        }
    }

    private function seedDailyVisits(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::today()->subDays($i);
            $count = match (true) {
                $date->isWeekend() => random_int(8, 30),
                default            => random_int(40, 140),
            };
            DB::table('daily_visits')->updateOrInsert(
                ['visit_date' => $date->toDateString()],
                ['visits_count' => $count, 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }

    private function seedAdminFacultyCaches(): void
    {
        $sampleFaculty = [
            ['E10001', 'د. خالد بن سعد', 'demo_faculty@demo.qspark.test', 'PROF', 'أستاذ'],
            ['E10002', 'د. منى محمد',  'mona@demo.qspark.test',         'ASSOC', 'أستاذ مشارك'],
            ['E10003', 'د. عبدالله',     'shamri@demo.qspark.test',       'ASST',  'أستاذ مساعد'],
            ['E10004', 'أ. سارة',       'sara@demo.qspark.test',         'LECT',  'محاضر'],
            ['E10005', 'د. فهد',          'fahad@demo.qspark.test',        'PROF',  'أستاذ'],
            ['E10006', 'د. ريم',           'reem@demo.qspark.test',         'ASSOC', 'أستاذ مشارك'],
            ['E10007', 'أ. ناصر',         'nasser@demo.qspark.test',       'LECT',  'محاضر'],
            ['E10008', 'د. هدى',          'huda@demo.qspark.test',         'ASST',  'أستاذ مساعد'],
        ];
        foreach ($sampleFaculty as [$id, $name, $email, $rank, $rankName]) {
            DB::table('admin_faculty_caches')->updateOrInsert(
                ['instructor_id' => $id],
                [
                    'name_ar' => $name,
                    'email' => $email,
                    'faculty_no' => self::FACULTY_NO,
                    'faculty_name' => self::FACULTY_NAME,
                    'dept_no' => self::DEPT_NO,
                    'dept_name' => self::DEPT_NAME,
                    'rank_code' => $rank,
                    'rank_name' => $rankName,
                    'last_synced_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function seedAdminStudentsCache(): void
    {
        $students = $this->fictionalStudents();
        $courseRotation = [
            ['ACCT201', 'Financial Accounting'],
            ['ACCT305', 'Managerial Accounting'],
            ['FIN201',  'Principles of Finance'],
            ['ECON101', 'Microeconomics'],
            ['MGMT220', 'Organisational Behaviour'],
        ];
        foreach ($students as $i => [$studentId, $name]) {
            $course = $courseRotation[$i % count($courseRotation)];
            DB::table('admin_students_cache')->updateOrInsert(
                ['student_id' => $studentId, 'semester' => self::SEMESTER],
                [
                    'student_name' => $name,
                    'last_recorded_gpa' => round(mt_rand(280, 495) / 100, 2),
                    'attendance_percent' => mt_rand(70, 99),
                    'absence_percent' => mt_rand(0, 25),
                    'course_code' => $course[0],
                    'course_name' => $course[1],
                    'faculty_no' => self::FACULTY_NO,
                    'faculty_name' => self::FACULTY_NAME,
                    'major_no' => self::MAJOR_NO,
                    'major_name' => self::MAJOR_NAME,
                    'dept_no' => self::DEPT_NO,
                    'dept_name' => self::DEPT_NAME,
                    'last_synced_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function seedAdminEngagementMetrics(): void
    {
        $students = $this->fictionalStudents();
        $engagedCount = (int) (count($students) * 0.78);
        DB::table('admin_engagement_metrics')->updateOrInsert(
            ['semester' => self::SEMESTER],
            [
                'total_students' => count($students),
                'engaged_students' => $engagedCount,
                'overall_engagement_rate' => round(($engagedCount / max(1, count($students))) * 100, 2),
                'total_faculty' => 8,
                'faculty_with_students' => 6,
                'faculty_participation_rate' => 75.0,
                'engagement_by_college' => json_encode([
                    ['college' => self::FACULTY_NAME, 'rate' => 78.0],
                    ['college' => 'College of Computer Sciences',   'rate' => 84.0],
                    ['college' => 'College of Engineering',         'rate' => 71.0],
                ]),
                'engagement_by_specialization' => json_encode([
                    ['major' => self::MAJOR_NAME, 'rate' => 80.5],
                    ['major' => 'Marketing',     'rate' => 74.0],
                    ['major' => 'Finance',       'rate' => 82.0],
                ]),
                'last_calculated_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    private function seedAdminImprovingStudents(): void
    {
        $top = array_slice($this->fictionalStudents(), 0, 6);
        foreach ($top as $i => [$id, $name]) {
            DB::table('admin_improving_students')->updateOrInsert(
                ['semester' => self::SEMESTER, 'student_id' => $id],
                [
                    'student_name' => $name,
                    'student_name_s' => $name,
                    'faculty_no' => self::FACULTY_NO,
                    'faculty_name' => self::FACULTY_NAME,
                    'faculty_name_s' => self::FACULTY_NAME,
                    'major_no' => self::MAJOR_NO,
                    'major_name' => self::MAJOR_NAME,
                    'major_name_s' => self::MAJOR_NAME,
                    'major_code' => self::MAJOR_NO,
                    'gpa_improvement' => round(mt_rand(40, 120) / 100, 2),
                    'attendance_improvement' => mt_rand(5, 25),
                    'current_gpa' => round(mt_rand(400, 495) / 100, 2),
                    'previous_gpa' => round(mt_rand(300, 399) / 100, 2),
                    'current_attendance' => mt_rand(85, 99),
                    'previous_attendance' => mt_rand(60, 84),
                    'rank_in_faculty' => $i + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function seedAdminTrendData(): void
    {
        $semesters = [460, 461, 462];
        foreach ($semesters as $sem) {
            DB::table('admin_trend_data')->updateOrInsert(
                ['semester' => $sem, 'data_type' => 'avg_gpa'],
                ['value' => round(mt_rand(380, 460) / 100, 2), 'student_count' => 1200, 'created_at' => now(), 'updated_at' => now()]
            );
            DB::table('admin_trend_data')->updateOrInsert(
                ['semester' => $sem, 'data_type' => 'attendance_rate'],
                ['value' => mt_rand(82, 94), 'student_count' => 1200, 'created_at' => now(), 'updated_at' => now()]
            );
            DB::table('admin_trend_data')->updateOrInsert(
                ['semester' => $sem, 'data_type' => 'engagement_rate'],
                ['value' => mt_rand(70, 85), 'student_count' => 1200, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function seedFacultyCoursesCache(?string $instructorId): void
    {
        if (! $instructorId) {
            return;
        }
        // Student count per course is derived from the roster so the course
        // cards always sum to the dashboard's "Total Students".
        $countsByCourse = array_fill(0, count($this->facultyCourseCatalog()), 0);
        foreach ($this->fictionalStudents() as [, , $courseIndex]) {
            $countsByCourse[$courseIndex]++;
        }

        // Reset first so reruns can't leave stale rows from an older catalog.
        DB::table('faculty_courses_cache')
            ->where('instructor_id', $instructorId)
            ->where('semester', self::SEMESTER)
            ->delete();

        foreach ($this->facultyCourseCatalog() as $index => [$no, $code, $name, $section, $actCode, $actName]) {
            DB::table('faculty_courses_cache')->insert([
                'instructor_id' => $instructorId,
                'course_no' => $no,
                'semester' => self::SEMESTER,
                'course_code' => $code,
                'course_name' => $name,
                'section' => $section,
                'activity_code' => $actCode,
                'activity_name' => $actName,
                'student_count' => $countsByCourse[$index],
                'last_synced_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedFacultyStudentsCache(?string $instructorId): void
    {
        if (! $instructorId) {
            return;
        }
        $catalog = $this->facultyCourseCatalog();

        // Reset first so a student who moved courses between runs can't end up
        // counted twice (the unique key includes course_no).
        DB::table('faculty_students_cache')
            ->where('instructor_id', $instructorId)
            ->where('semester', self::SEMESTER)
            ->delete();

        foreach ($this->fictionalStudents() as [$studentId, $name, $courseIndex, $gpa, $attendance]) {
            [$no, $code, $courseName, $section, $actCode] = $catalog[$courseIndex];
            DB::table('faculty_students_cache')->insert([
                'instructor_id' => $instructorId,
                'student_id' => $studentId,
                'course_no' => $no,
                'semester' => self::SEMESTER,
                'student_name' => $name,
                'course_code' => $code,
                'course_name' => $courseName,
                'section' => $section,
                'activity_code' => $actCode,
                'last_recorded_gpa' => $gpa,
                'attendance_percent' => $attendance,
                'absence_percent' => 100 - $attendance,
                'last_synced_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedOracleStudentsCache(): void
    {
        $students = $this->fictionalStudents();
        foreach ($students as [$studentId, $name]) {
            DB::table('oracle_students_cache')->updateOrInsert(
                ['student_id' => $studentId, 'semester' => self::SEMESTER],
                [
                    'student_name' => $name,
                    'gpa' => round(mt_rand(280, 495) / 100, 2),
                    'attendance_percent' => mt_rand(70, 99),
                    'absence_percent' => mt_rand(0, 25),
                    'total_absences' => mt_rand(0, 6),
                    'course_code' => 'ACCT201',
                    'course_name' => 'Financial Accounting',
                    'faculty_no' => self::FACULTY_NO,
                    'faculty_name' => self::FACULTY_NAME,
                    'major_no' => self::MAJOR_NO,
                    'major_name' => self::MAJOR_NAME,
                    'last_synced_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function seedRegisteredStudents(): void
    {
        // registered_students_cache schema is best-effort; bail if it doesn't exist.
        if (! \Illuminate\Support\Facades\Schema::hasTable('registered_students_cache')) {
            return;
        }
        $columns = \Illuminate\Support\Facades\Schema::getColumnListing('registered_students_cache');
        $students = $this->fictionalStudents();
        foreach ($students as [$studentId, $name]) {
            $row = array_intersect_key([
                'student_id' => $studentId,
                'student_name' => $name,
                'name' => $name,
                'semester' => self::SEMESTER,
                'faculty_no' => self::FACULTY_NO,
                'faculty_name' => self::FACULTY_NAME,
                'major_no' => self::MAJOR_NO,
                'major_name' => self::MAJOR_NAME,
                'created_at' => now(),
                'updated_at' => now(),
                'last_synced_at' => now(),
            ], array_flip($columns));

            DB::table('registered_students_cache')->updateOrInsert(
                array_intersect_key($row, array_flip(['student_id', 'semester'])),
                $row
            );
        }
    }

    private function seedStudentPlayHours(string $studentId): void
    {
        for ($i = 0; $i < 21; $i++) {
            $date = Carbon::today()->subDays($i);
            $mins = $date->isWeekend() ? mt_rand(5, 25) : mt_rand(15, 75);
            DB::table('student_play_hours')->updateOrInsert(
                ['student_id' => $studentId, 'play_date' => $date->toDateString()],
                ['minutes_played' => $mins, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function seedQuizContent(string $studentId): void
    {
        $attachmentKey = 'demo-attachment-acct201-ch1';

        // 15 AI-generated questions per faculty course (5 easy, 5 medium, 5 hard),
        // each written for that course's own subject matter.
        $courseBanks = [
            'ACCT201' => [
                'course_id' => 'CRS-101',
                'attachment_key' => $attachmentKey,
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

        // Clear any prior demo questions for these courses so reruns stay at
        // exactly 5 per course (older seeds used a different question_hash scheme).
        DB::table('quiz_questions')
            ->whereIn('course_code', array_keys($courseBanks))
            ->delete();

        foreach ($courseBanks as $courseCode => $bank) {
            foreach ($bank['questions'] as [$q, $opts, $correct, $diff]) {
                DB::table('quiz_questions')->updateOrInsert(
                    ['attachment_key' => $bank['attachment_key'], 'question_hash' => md5("{$courseCode}|{$q}")],
                    [
                        'course_code' => $courseCode,
                        'course_id' => $bank['course_id'],
                        'question' => $q,
                        'options' => json_encode($opts),
                        'correct_index' => $correct,
                        'difficulty' => $diff,
                        'type' => 'enemy',
                        'language' => 'en',
                        'student_id' => $studentId,
                        'topic' => $bank['topic'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        DB::table('student_quiz_performance')->insertOrIgnore([
            [
                'student_id' => $studentId,
                'course_code' => 'ACCT201',
                'attachment_key' => $attachmentKey,
                'session_id' => 'demo-session-1',
                'total_questions' => 5,
                'correct_answers' => 4,
                'wrong_answers' => 1,
                'lives_remaining' => 2,
                'total_time' => 92,
                'avg_answer_time' => 18.4,
                'fastest_answer' => 6,
                'slowest_answer' => 28,
                'starting_difficulty' => 'medium',
                'ending_difficulty' => 'hard',
                'difficulty_changes' => json_encode([['from' => 'medium', 'to' => 'hard', 'at_question' => 3]]),
                'questions_answered' => json_encode([]),
                'performance_score' => 82.0,
                'recommended_difficulty' => 'hard',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'student_id' => $studentId,
                'course_code' => 'ACCT201',
                'attachment_key' => $attachmentKey,
                'session_id' => 'demo-session-2',
                'total_questions' => 5,
                'correct_answers' => 3,
                'wrong_answers' => 2,
                'lives_remaining' => 1,
                'total_time' => 130,
                'avg_answer_time' => 26.0,
                'fastest_answer' => 12,
                'slowest_answer' => 41,
                'starting_difficulty' => 'medium',
                'ending_difficulty' => 'medium',
                'difficulty_changes' => json_encode([]),
                'questions_answered' => json_encode([]),
                'performance_score' => 64.0,
                'recommended_difficulty' => 'medium',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
        ]);
    }

    private function seedStudentMonthlyRecommendation(string $studentId): void
    {
        $monthKey = Carbon::now('Asia/Riyadh')->year.'-'.match (true) {
            Carbon::now('Asia/Riyadh')->month >= 9 => 'fall',
            Carbon::now('Asia/Riyadh')->month >= 6 => 'summer',
            default => 'spring',
        };
        DB::table('student_monthly_recommendations')->updateOrInsert(
            ['student_id' => $studentId, 'month' => $monthKey],
            [
                'recommendations' => json_encode([
                    'Review accounting equation drills daily for 15 minutes',
                    'Switch to active recall on managerial accounting flashcards',
                    'Pair-study with a classmate on weekly chapter quizzes',
                ]),
                'tips' => json_encode([
                    'Use the Pomodoro technique (25/5) during heavy reading blocks',
                    'Replay the in-app quiz game on hard difficulty before exams',
                ]),
                'strengths' => json_encode(['Strong attendance', 'Consistent quiz participation']),
                'weaknesses' => json_encode(['Slower on adjusting entries', 'Lower retention on IFRS terms']),
                'improvement_areas' => json_encode(['Practice problem speed', 'IFRS vocabulary recall']),
                'goals' => json_encode([
                    ['title' => 'Raise ACCT201 quiz avg to 85%', 'target' => 85, 'current' => 73],
                    ['title' => 'Hit 90% attendance this semester', 'target' => 90, 'current' => 86],
                ]),
                'predicted_gpa' => 4.65,
                'completion_percentage' => 42,
                'generated_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * The four faculty courses, indexed 0–3. Single source of truth for both
     * the courses cache and the per-student course assignment below.
     * Each row: [course_no, course_code, course_name, section, activity_code, activity_name].
     */
    private function facultyCourseCatalog(): array
    {
        return [
            ['CRS-101', 'ACCT201', 'Financial Accounting',  '01', 'LEC', 'Lecture'],
            ['CRS-102', 'ACCT305', 'Managerial Accounting', '01', 'LEC', 'Lecture'],
            ['CRS-103', 'ACCT410', 'Auditing Principles',   '02', 'LEC', 'Lecture'],
            ['CRS-104', 'ACCT420', 'Taxation',              '01', 'LAB', 'Lab'],
        ];
    }

    /**
     * Fictional student roster — 25 students, the single source of truth for
     * every faculty figure (dashboard total, GPA/attendance distributions,
     * reports, course-card counts). Values are deterministic so the numbers
     * always reconcile: each student belongs to exactly one course, so the
     * course counts sum to 25, and each distribution also sums to 25.
     *
     * Each row: [student_id, name_ar, course_index (0–3), gpa (of 5.0), attendance_percent].
     */
    private function fictionalStudents(): array
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
}
