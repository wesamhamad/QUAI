<?php

namespace App\Support;

use Illuminate\Support\Carbon;

/**
 * A synthetic cohort for the demo build of the QMentor / +QSpark boards.
 *
 * The live platform pre-loads ~56k students from SIS into the qmentor_*
 * tables and scores them nightly with the 31-indicator engine. This build
 * has no SIS behind it, so the same screens read from this class instead:
 * a deterministic, fully invented cohort (fixed seed — the numbers never
 * move between reloads) with the eight featured demo students on top.
 *
 * Nothing here describes a real person. Names are drawn from a small pool
 * of common given names; ids are made up; every figure is generated.
 *
 * Shapes follow the live API contracts (see the SPA hooks in
 * resources/js/qmentor/hooks) so the pages render exactly as they would on
 * the production build.
 */
final class DemoCohort
{
    /** The running term and the last fully graded one (demo term codes). */
    public const SEMESTER = '481';
    public const GRADED_SEMESTER = '472';
    public const TERM_STARTS = '2026-08-23';
    public const TERM_ENDS = '2026-12-17';
    public const MODEL_VERSION = '2026-09-16.1';

    /** Employee id the demo faculty account advises / teaches as. */
    public const DEMO_INSTRUCTOR_ID = 'F-1001';

    private const SEED = 20260923;

    /** @var array<string, array<string, mixed>>|null id → student */
    private static ?array $students = null;

    /** @var array<int, array<string, mixed>>|null */
    private static ?array $syncRuns = null;

    // ── Catalogue ─────────────────────────────────────────────────────────

    /** @return array<string, array{name: string, name_en: string, majors: array<string, array{0: string, 1: string}>, size: int, depts: array<string, string>}> */
    public static function faculties(): array
    {
        return [
            '01' => ['name' => 'كلية إدارة الأعمال', 'name_en' => 'College of Business Administration', 'size' => 48,
                'majors' => ['0102' => ['محاسبة', 'Accounting'], '0101' => ['إدارة أعمال', 'Business Administration'], '0103' => ['تمويل', 'Finance']],
                'depts' => ['0102' => 'قسم المحاسبة', '0101' => 'قسم إدارة الأعمال', '0103' => 'قسم التمويل']],
            '02' => ['name' => 'كلية الحاسب', 'name_en' => 'College of Computer', 'size' => 44,
                'majors' => ['0201' => ['علوم الحاسب', 'Computer Science'], '0202' => ['هندسة البرمجيات', 'Software Engineering'], '0203' => ['نظم المعلومات', 'Information Systems']],
                'depts' => ['0201' => 'قسم علوم الحاسب', '0202' => 'قسم هندسة البرمجيات', '0203' => 'قسم نظم المعلومات']],
            '03' => ['name' => 'كلية الهندسة', 'name_en' => 'College of Engineering', 'size' => 40,
                'majors' => ['0301' => ['هندسة كهربائية', 'Electrical Engineering'], '0302' => ['هندسة مدنية', 'Civil Engineering'], '0303' => ['هندسة ميكانيكية', 'Mechanical Engineering']],
                'depts' => ['0301' => 'قسم الهندسة الكهربائية', '0302' => 'قسم الهندسة المدنية', '0303' => 'قسم الهندسة الميكانيكية']],
            '04' => ['name' => 'كلية اللغات والترجمة', 'name_en' => 'College of Languages and Translation', 'size' => 22,
                'majors' => ['0401' => ['لغة إنجليزية', 'English Language'], '0402' => ['ترجمة', 'Translation']],
                'depts' => ['0401' => 'قسم اللغة الإنجليزية', '0402' => 'قسم الترجمة']],
            '05' => ['name' => 'كلية الصيدلة', 'name_en' => 'College of Pharmacy', 'size' => 18,
                'majors' => ['0501' => ['صيدلة', 'Pharmacy']],
                'depts' => ['0501' => 'قسم الصيدلة الإكلينيكية']],
            '06' => ['name' => 'كلية التربية', 'name_en' => 'College of Education', 'size' => 20,
                'majors' => ['0601' => ['تربية خاصة', 'Special Education'], '0602' => ['رياض أطفال', 'Early Childhood']],
                'depts' => ['0601' => 'قسم التربية الخاصة', '0602' => 'قسم رياض الأطفال']],
            '07' => ['name' => 'كلية الإعلام', 'name_en' => 'College of Media', 'size' => 14,
                'majors' => ['0701' => ['إعلام رقمي', 'Digital Media'], '0702' => ['علاقات عامة', 'Public Relations']],
                'depts' => ['0701' => 'قسم الإعلام الرقمي', '0702' => 'قسم العلاقات العامة']],
            '08' => ['name' => 'كلية التمريض', 'name_en' => 'College of Nursing', 'size' => 16,
                'majors' => ['0801' => ['تمريض', 'Nursing']],
                'depts' => ['0801' => 'قسم التمريض']],
        ];
    }

    /** Five current-term courses per major (code, Arabic name, English name). */
    private static function coursesForMajor(string $majorNo): array
    {
        $bundles = [
            '0102' => [['ACCT401', 'محاسبة مالية متقدمة', 'Advanced Financial Accounting'], ['ACCT421', 'المراجعة والتدقيق', 'Auditing'], ['FIN401', 'الإدارة المالية المتقدمة', 'Advanced Financial Management'], ['TAX410', 'المحاسبة الضريبية', 'Tax Accounting'], ['BUSN320', 'نظم معلومات إدارية', 'Management Information Systems']],
            '0101' => [['MGT301', 'مبادئ الإدارة', 'Principles of Management'], ['MGT340', 'السلوك التنظيمي', 'Organizational Behavior'], ['MKT301', 'مبادئ التسويق', 'Principles of Marketing'], ['BUSN320', 'نظم معلومات إدارية', 'Management Information Systems'], ['ECON201', 'الاقتصاد الجزئي', 'Microeconomics']],
            '0103' => [['FIN301', 'الإدارة المالية', 'Financial Management'], ['FIN320', 'الأسواق المالية', 'Financial Markets'], ['ACCT301', 'محاسبة مالية متوسطة', 'Intermediate Accounting'], ['STAT302', 'إحصاء تطبيقي للأعمال', 'Applied Business Statistics'], ['ECON201', 'الاقتصاد الجزئي', 'Microeconomics']],
            '0201' => [['CS401', 'هندسة البرمجيات', 'Software Engineering'], ['CS421', 'الذكاء الاصطناعي', 'Artificial Intelligence'], ['CS433', 'شبكات الحاسب', 'Computer Networks'], ['CS311', 'نظرية الحوسبة', 'Theory of Computation'], ['MATH301', 'الجبر الخطي', 'Linear Algebra']],
            '0202' => [['SWE311', 'تحليل المتطلبات', 'Requirements Engineering'], ['SWE321', 'تصميم البرمجيات', 'Software Design'], ['CS302', 'قواعد البيانات', 'Databases'], ['SWE401', 'اختبار البرمجيات', 'Software Testing'], ['CS433', 'شبكات الحاسب', 'Computer Networks']],
            '0203' => [['IS301', 'تحليل النظم', 'Systems Analysis'], ['IS321', 'إدارة المشاريع التقنية', 'IT Project Management'], ['CS302', 'قواعد البيانات', 'Databases'], ['IS401', 'أمن المعلومات', 'Information Security'], ['BUSN320', 'نظم معلومات إدارية', 'Management Information Systems']],
            '0301' => [['EE301', 'الدوائر الكهربائية', 'Electric Circuits'], ['EE321', 'الإلكترونيات', 'Electronics'], ['EE341', 'الإشارات والنظم', 'Signals and Systems'], ['EE361', 'الآلات الكهربائية', 'Electrical Machines'], ['MATH302', 'المعادلات التفاضلية', 'Differential Equations']],
            '0302' => [['CE301', 'مقاومة المواد', 'Mechanics of Materials'], ['CE321', 'ميكانيكا التربة', 'Soil Mechanics'], ['CE341', 'الهيدروليكا', 'Hydraulics'], ['CE361', 'الخرسانة المسلحة', 'Reinforced Concrete'], ['MATH302', 'المعادلات التفاضلية', 'Differential Equations']],
            '0303' => [['ME301', 'الديناميكا الحرارية', 'Thermodynamics'], ['ME321', 'ميكانيكا الموائع', 'Fluid Mechanics'], ['ME341', 'تصميم الآلات', 'Machine Design'], ['ME361', 'انتقال الحرارة', 'Heat Transfer'], ['MATH302', 'المعادلات التفاضلية', 'Differential Equations']],
            '0401' => [['ENGL301', 'الأدب الإنجليزي', 'English Literature'], ['ENGL321', 'اللسانيات', 'Linguistics'], ['ENGL341', 'الكتابة الأكاديمية', 'Academic Writing'], ['ENGL361', 'الصوتيات', 'Phonetics'], ['ARAB201', 'التحرير العربي', 'Arabic Composition']],
            '0402' => [['TRAN301', 'نظريات الترجمة', 'Translation Theory'], ['TRAN321', 'الترجمة القانونية', 'Legal Translation'], ['TRAN341', 'الترجمة الفورية', 'Interpreting'], ['ENGL341', 'الكتابة الأكاديمية', 'Academic Writing'], ['ARAB201', 'التحرير العربي', 'Arabic Composition']],
            '0501' => [['PHAR301', 'علم الأدوية', 'Pharmacology'], ['PHAR321', 'الكيمياء الصيدلانية', 'Medicinal Chemistry'], ['PHAR341', 'الصيدلانيات', 'Pharmaceutics'], ['PHAR361', 'الصيدلة الإكلينيكية', 'Clinical Pharmacy'], ['BIO301', 'الأحياء الدقيقة', 'Microbiology']],
            '0601' => [['SPED301', 'مقدمة في التربية الخاصة', 'Intro to Special Education'], ['SPED321', 'صعوبات التعلم', 'Learning Disabilities'], ['SPED341', 'تعديل السلوك', 'Behavior Modification'], ['EDU301', 'علم نفس النمو', 'Developmental Psychology'], ['EDU321', 'طرق التدريس', 'Teaching Methods']],
            '0602' => [['ECE301', 'نمو الطفل', 'Child Development'], ['ECE321', 'المناهج في رياض الأطفال', 'Early Childhood Curriculum'], ['ECE341', 'اللعب والتعلم', 'Play and Learning'], ['EDU301', 'علم نفس النمو', 'Developmental Psychology'], ['EDU321', 'طرق التدريس', 'Teaching Methods']],
            '0701' => [['MEDIA301', 'الإنتاج الرقمي', 'Digital Production'], ['MEDIA321', 'صحافة البيانات', 'Data Journalism'], ['MEDIA341', 'الإعلام الاجتماعي', 'Social Media'], ['MEDIA361', 'التصوير والمونتاج', 'Video and Editing'], ['ARAB201', 'التحرير العربي', 'Arabic Composition']],
            '0702' => [['PR301', 'مبادئ العلاقات العامة', 'Principles of PR'], ['PR321', 'إدارة السمعة', 'Reputation Management'], ['PR341', 'الاتصال المؤسسي', 'Corporate Communication'], ['MEDIA341', 'الإعلام الاجتماعي', 'Social Media'], ['ARAB201', 'التحرير العربي', 'Arabic Composition']],
            '0801' => [['NURS301', 'أساسيات التمريض', 'Fundamentals of Nursing'], ['NURS321', 'تمريض البالغين', 'Adult Nursing'], ['NURS341', 'تمريض الأطفال', 'Pediatric Nursing'], ['NURS361', 'تمريض الصحة النفسية', 'Mental Health Nursing'], ['BIO301', 'الأحياء الدقيقة', 'Microbiology']],
        ];

        return $bundles[$majorNo] ?? $bundles['0102'];
    }

    /** @return array<int, array{id: string, name: string, name_en: string, email: string, faculty_no: string, dept_no: string}> */
    public static function advisors(): array
    {
        return [
            ['id' => self::DEMO_INSTRUCTOR_ID, 'name' => 'د. عبدالعزيز محمد', 'name_en' => 'Dr. Abdulaziz Mohammed', 'email' => 'a.mohammed@example.edu', 'faculty_no' => '01', 'dept_no' => '0102'],
            ['id' => 'F-1002', 'name' => 'د. سارة عبدالله', 'name_en' => 'Dr. Sarah Abdullah', 'email' => 's.abdullah@example.edu', 'faculty_no' => '02', 'dept_no' => '0201'],
            ['id' => 'F-1003', 'name' => 'د. عمر عبدالله', 'name_en' => 'Dr. Omar Abdullah', 'email' => 'o.abdullah@example.edu', 'faculty_no' => '03', 'dept_no' => '0301'],
            ['id' => 'F-1004', 'name' => 'د. هند سعد', 'name_en' => 'Dr. Hind Saad', 'email' => 'h.saad@example.edu', 'faculty_no' => '04', 'dept_no' => '0401'],
            ['id' => 'F-1005', 'name' => 'د. خالد إبراهيم', 'name_en' => 'Dr. Khalid Ibrahim', 'email' => 'k.ibrahim@example.edu', 'faculty_no' => '05', 'dept_no' => '0501'],
            ['id' => 'F-1006', 'name' => 'د. منيرة فهد', 'name_en' => 'Dr. Munira Fahad', 'email' => 'm.fahad@example.edu', 'faculty_no' => '06', 'dept_no' => '0601'],
            ['id' => 'F-1007', 'name' => 'د. تركي ناصر', 'name_en' => 'Dr. Turki Nasser', 'email' => 't.nasser@example.edu', 'faculty_no' => '07', 'dept_no' => '0701'],
            ['id' => 'F-1008', 'name' => 'د. لطيفة يوسف', 'name_en' => 'Dr. Latifa Yousef', 'email' => 'l.yousef@example.edu', 'faculty_no' => '08', 'dept_no' => '0801'],
        ];
    }

    public static function advisor(string $id): ?array
    {
        foreach (self::advisors() as $a) {
            if ($a['id'] === $id) {
                return $a;
            }
        }

        return null;
    }

    // ── The cohort ────────────────────────────────────────────────────────

    /** @return array<string, array<string, mixed>> id → student (featured first) */
    public static function all(): array
    {
        if (self::$students !== null) {
            return self::$students;
        }

        mt_srand(self::SEED);
        $rows = [];

        // The eight featured students keep their DemoData identity.
        foreach (DemoData::students() as $i => $s) {
            $rows[$s['student_id']] = self::build($s['student_id'], [
                'name' => $s['name'], 'name_en' => $s['name_en'], 'gender' => in_array($s['student_id'], ['443100021', '443100023', '443100025', '443100027'], true) ? 2 : 1,
                'faculty_no' => $s['faculty_no'], 'major_no' => $s['major_no'], 'level' => $s['level'], 'gpa' => $s['gpa'], 'registered_hours' => $s['enrolled_hours'],
                'profile' => match ($s['student_id']) { '443211517' => 'healthy', '443100021' => 'follow_up', '443100022' => 'critical', default => null },
            ]);
        }

        $male = ['محمد', 'أحمد', 'عبدالله', 'سعد', 'خالد', 'فهد', 'ناصر', 'إبراهيم', 'سلطان', 'بدر', 'تركي', 'ماجد', 'وليد', 'عبدالعزيز', 'عبدالرحمن', 'يوسف', 'عمر', 'سعود', 'راكان', 'نواف', 'فيصل', 'مشعل', 'زياد', 'طلال'];
        $maleEn = ['Mohammed', 'Ahmed', 'Abdullah', 'Saad', 'Khalid', 'Fahad', 'Nasser', 'Ibrahim', 'Sultan', 'Badr', 'Turki', 'Majed', 'Walid', 'Abdulaziz', 'Abdulrahman', 'Yousef', 'Omar', 'Saud', 'Rakan', 'Nawaf', 'Faisal', 'Mishal', 'Ziyad', 'Talal'];
        $female = ['نورة', 'ريم', 'لمياء', 'دانة', 'سارة', 'هند', 'منيرة', 'العنود', 'شهد', 'جواهر', 'أسماء', 'مها', 'لطيفة', 'غادة', 'أروى', 'رهف', 'بشاير', 'وجدان'];
        $femaleEn = ['Noura', 'Reem', 'Lamia', 'Danah', 'Sarah', 'Hind', 'Munira', 'Alanoud', 'Shahad', 'Jawaher', 'Asma', 'Maha', 'Latifa', 'Ghada', 'Arwa', 'Rahaf', 'Bashayer', 'Wijdan'];

        $n = 1000;
        foreach (self::faculties() as $facultyNo => $f) {
            $majorKeys = array_keys($f['majors']);
            for ($i = 0; $i < $f['size']; $i++) {
                $n++;
                $id = '4431'.str_pad((string) $n, 5, '0', STR_PAD_LEFT);
                $gender = mt_rand(1, 100) <= 55 ? 1 : 2;
                $first = $gender === 1 ? mt_rand(0, count($male) - 1) : mt_rand(0, count($female) - 1);
                // Given name and father's name only — no family or tribal name
                // anywhere in the demo, so no invented person can resemble a real one.
                $father = mt_rand(0, count($male) - 1);
                $name = ($gender === 1 ? $male[$first] : $female[$first]).' '.$male[$father];
                $nameEn = ($gender === 1 ? $maleEn[$first] : $femaleEn[$first]).' '.$maleEn[$father];
                $level = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8][mt_rand(0, 12)];
                $gpa = max(1.20, min(5.00, round(3.35 + self::gauss() * 0.75, 2)));
                $rows[$id] = self::build($id, [
                    'name' => $name, 'name_en' => $nameEn, 'gender' => $gender,
                    'faculty_no' => $facultyNo, 'major_no' => $majorKeys[mt_rand(0, count($majorKeys) - 1)],
                    'level' => $level, 'gpa' => $gpa, 'registered_hours' => [12, 15, 15, 16, 18][mt_rand(0, 4)], 'profile' => null,
                ]);
            }
        }

        return self::$students = $rows;
    }

    public static function find(?string $id): ?array
    {
        return $id ? (self::all()[$id] ?? null) : null;
    }

    /**
     * Every student id, as strings. PHP turns numeric-string array keys into
     * ints, so array_keys(all()) must never be compared to an id strictly.
     *
     * @return array<int, string>
     */
    public static function ids(): array
    {
        return array_map('strval', array_keys(self::all()));
    }

    /** Approximate normal deviate (Box–Muller on mt_rand). */
    private static function gauss(): float
    {
        $u = max(1e-9, mt_rand() / mt_getrandmax());
        $v = mt_rand() / mt_getrandmax();

        return sqrt(-2 * log($u)) * cos(2 * M_PI * $v);
    }

    /** @param array<string, mixed> $seed */
    private static function build(string $id, array $seed): array
    {
        $faculty = self::faculties()[$seed['faculty_no']];
        [$major, $majorEn] = $faculty['majors'][$seed['major_no']] ?? [$seed['major_no'], $seed['major_no']];
        $profile = $seed['profile'];
        $level = (int) $seed['level'];
        $gpa = (float) $seed['gpa'];

        // Per-course figures. The profile pins the three featured cases.
        $courses = [];
        foreach (self::coursesForMajor($seed['major_no']) as $k => [$code, $nameAr, $nameEn]) {
            $absence = match ($profile) {
                'healthy' => [0.0, 4.2, 0.0, 8.3, 0.0][$k],
                'follow_up' => [12.5, 8.3, 16.7, 4.2, 12.5][$k],
                'critical' => [22.0, 16.7, 25.0, 12.5, 20.8][$k],
                default => max(0.0, round(($gpa < 2.5 ? 12 : ($gpa < 3.5 ? 5 : 2)) + self::gauss() * 6, 1)),
            };
            $base = match ($profile) { 'healthy' => 88, 'follow_up' => 62, 'critical' => 44, default => (int) round(45 + ($gpa - 1.2) / 3.8 * 45 + self::gauss() * 8) };
            $midterm = max(15, min(100, $base + mt_rand(-8, 8)));
            $quizzes = array_map(fn ($i) => max(10, min(100, $base + mt_rand(-14, 12) - ($profile === 'critical' ? $i * 6 : 0))), range(0, 3));
            $assignments = array_map(fn ($i) => max(0, min(100, $base + mt_rand(-12, 10) - ($profile === 'critical' ? $i * 8 : 0))), range(0, 4));
            $missing = match ($profile) { 'healthy' => 0, 'follow_up' => 1, 'critical' => 3, default => ($gpa < 2.3 ? mt_rand(1, 3) : ($gpa < 3.2 ? mt_rand(0, 1) : 0)) };
            for ($m = 0; $m < $missing; $m++) {
                $assignments[4 - $m] = 0;
            }
            $courses[] = [
                'course_no' => $code, 'course_code' => $code, 'course_name' => $nameAr, 'course_name_en' => $nameEn,
                'section' => (string) (20000 + (int) substr($seed['faculty_no'], -1) * 1000 + $k * 10 + ($id[-1] % 3)),
                'credit_hours' => 3, 'absence_percent' => $absence, 'excused_percent' => round($absence * 0.3, 1),
                'absence_dates' => self::absenceDates($absence),
                'midterm' => $midterm, 'quizzes' => $quizzes, 'assignments' => $assignments,
                'submitted' => 5 - $missing, 'gradable' => 5,
            ];
        }

        // Term history: one row per completed term, ending at the graded term.
        $terms = [];
        $codes = ['452', '461', '462', '471', '472'];
        $count = max(1, min(5, $level - 1));
        $history = array_slice($codes, 5 - $count);
        $running = $gpa;
        foreach (array_reverse($history) as $j => $term) {
            $termGpa = max(1.0, min(5.0, round($running + ($profile === 'critical' ? 0.55 * $j : ($profile === 'follow_up' ? 0.3 * $j : self::gauss() * 0.25)), 2)));
            $terms[$term] = ['semester' => $term, 'semester_gpa' => $termGpa, 'cumulative_gpa' => round(max(1.0, min(5.0, $gpa + $j * 0.05)), 2), 'attempted_hours' => 15, 'passed_hours' => 15 - ($termGpa < 2.0 ? 6 : ($termGpa < 2.6 ? 3 : 0))];
            $running = $termGpa;
        }
        ksort($terms);
        $terms = array_values($terms);

        $failed = match ($profile) { 'healthy' => 0, 'follow_up' => 1, 'critical' => 3, default => ($gpa < 2.0 ? mt_rand(2, 4) : ($gpa < 2.8 ? mt_rand(0, 2) : 0)) };
        $warnings = match ($profile) { 'healthy' => 0, 'follow_up' => 1, 'critical' => 2, default => ($gpa < 2.0 ? mt_rand(1, 2) : 0) };
        $passedHours = max(0, ($level - 1) * 15 - $failed * 3 + mt_rand(0, 4));
        $planHours = 136;
        $advisorPool = array_values(array_filter(self::advisors(), fn ($a) => $a['faculty_no'] === $seed['faculty_no']));
        $advisor = $advisorPool[0] ?? self::advisors()[0];
        // Spread the business/computer caseloads so the demo faculty account advises some of each.
        if (in_array($seed['faculty_no'], ['01', '02'], true) && (crc32($id) % 3 !== 0)) {
            $advisor = self::advisors()[0];
        }

        $status = $warnings >= 2 ? 'إنذار أكاديمي ثانٍ' : ($warnings === 1 ? 'إنذار أكاديمي' : 'منتظم');
        $excuse = $profile === 'critical' ? ['course' => $courses[2]['course_code'], 'reason_code' => '1', 'reason' => 'مراجعة طبية', 'percent' => $courses[2]['absence_percent']] : null;

        $student = [
            'student_id' => $id,
            // Two tokens at most (given name + father's name): the boards never show a family name.
            'name' => implode(' ', array_slice(preg_split('/\s+/u', trim($seed['name'])), 0, 2)),
            'name_en' => implode(' ', array_slice(preg_split('/\s+/u', trim($seed['name_en'])), 0, 2)),
            'gender' => $seed['gender'],
            'email' => $id.'@example.edu', 'mobile' => '05'.substr(str_pad((string) crc32($id), 8, '0', STR_PAD_LEFT), 0, 8),
            'faculty_no' => $seed['faculty_no'], 'faculty_name' => $faculty['name'], 'faculty_name_en' => $faculty['name_en'],
            'dept_no' => $seed['major_no'], 'dept_name' => $faculty['depts'][$seed['major_no']] ?? $major,
            'major_no' => $seed['major_no'], 'major_name' => $major, 'major_name_en' => $majorEn,
            'roster_semester' => self::SEMESTER, 'academic_status' => $status,
            'student_level' => $level, 'cumulative_gpa' => $gpa, 'semester_gpa' => $terms[count($terms) - 1]['semester_gpa'] ?? $gpa,
            'attempted_hours' => $passedHours + $failed * 3, 'passed_hours' => $passedHours, 'registered_hours' => $seed['registered_hours'],
            'plan_hours' => $planHours, 'remaining_hours' => max(0, $planHours - $passedHours),
            'expected_graduation_semester' => (string) (481 + max(0, 8 - $level) * 5),
            'advisor_id' => $advisor['id'], 'advisor_name' => $advisor['name'], 'advisor_email' => $advisor['email'],
            'warnings' => $warnings, 'failed_courses' => $failed, 'plan_levels' => 8,
            'courses' => $courses, 'terms' => $terms, 'excuse' => $excuse, 'profile' => $profile,
            'synced_at' => Carbon::parse('2026-09-23 02:40:00')->subMinutes(crc32($id) % 90)->toDateTimeString(),
        ];
        $student['risk'] = self::evaluate($student);

        return $student;
    }

    /** @return array<int, string> ISO dates of the absences implied by a percentage (6 sessions = 25%). */
    private static function absenceDates(float $percent): array
    {
        $n = (int) round($percent / (100 / 24));
        $dates = [];
        $base = strtotime(self::TERM_STARTS.' +7 days');
        for ($i = 0; $i < $n; $i++) {
            $dates[] = date('Y-m-d', $base + $i * 86400 * ($i % 2 === 0 ? 5 : 2));
        }

        return $dates;
    }

    // ── The 31 indicators, evaluated on the synthetic figures ─────────────

    /** @return array<string, array{label: string, category: string, handler: string}> */
    public static function catalogue(): array
    {
        return [
            'A-01' => ['label' => 'نسبة الغياب لكل مقرر', 'category' => 'A', 'handler' => 'system'],
            'A-02' => ['label' => 'غيابات متتالية', 'category' => 'A', 'handler' => 'system'],
            'A-03' => ['label' => 'المسافة من حدّ الحرمان', 'category' => 'A', 'handler' => 'system'],
            'A-04' => ['label' => 'غياب متزامن عبر المقررات', 'category' => 'A', 'handler' => 'agent'],
            'G-01' => ['label' => 'درجة اختبار المنتصف', 'category' => 'G', 'handler' => 'system'],
            'G-02' => ['label' => 'متوسط الاختبارات القصيرة', 'category' => 'G', 'handler' => 'system'],
            'G-03' => ['label' => 'متوسط الواجبات', 'category' => 'G', 'handler' => 'system'],
            'G-04' => ['label' => 'المعدل التراكمي', 'category' => 'G', 'handler' => 'system'],
            'G-05' => ['label' => 'اتجاه المعدل الفصلي', 'category' => 'G', 'handler' => 'system'],
            'G-06' => ['label' => 'الفجوة عن متوسط الشعبة', 'category' => 'G', 'handler' => 'agent'],
            'G-07' => ['label' => 'مسار الأداء (كويز + منتصف)', 'category' => 'G', 'handler' => 'agent'],
            'G-08' => ['label' => 'عدد مرات الرسوب التاريخية', 'category' => 'G', 'handler' => 'system'],
            'G-09' => ['label' => 'الدرجة النهائية المتوقعة', 'category' => 'G', 'handler' => 'agent'],
            'S-01' => ['label' => 'نسبة الواجبات غير المسلَّمة', 'category' => 'S', 'handler' => 'system'],
            'S-02' => ['label' => 'اتجاه درجات الواجبات', 'category' => 'S', 'handler' => 'agent'],
            'E-01' => ['label' => 'نسبة الوصول للمحتوى', 'category' => 'E', 'handler' => 'system'],
            'E-02' => ['label' => 'أيام منذ آخر دخول', 'category' => 'E', 'handler' => 'system'],
            'AC-01' => ['label' => 'الإنذارات الأكاديمية', 'category' => 'AC', 'handler' => 'system'],
            'AC-02' => ['label' => 'متطلبات سابقة راسبة تعيق التقدم', 'category' => 'AC', 'handler' => 'system'],
            'R-01' => ['label' => 'سجل طلبات الانسحاب', 'category' => 'R', 'handler' => 'system'],
            'T-01' => ['label' => 'اختبار نهائي غائب (الفصل السابق)', 'category' => 'T', 'handler' => 'system'],
            'C-01' => ['label' => 'انسحاب صامت', 'category' => 'C', 'handler' => 'agent'],
            'C-02' => ['label' => 'غياب + تراجع درجات', 'category' => 'C', 'handler' => 'agent'],
            'C-03' => ['label' => 'انهيار بعد تفوّق', 'category' => 'C', 'handler' => 'agent'],
            'C-04' => ['label' => 'حضور جيد ودرجات ضعيفة', 'category' => 'C', 'handler' => 'agent'],
            'C-05' => ['label' => 'فشل التعافي بعد تدخّل', 'category' => 'C', 'handler' => 'agent'],
            'P-01' => ['label' => 'فصول متأخرة عن الخطة', 'category' => 'P', 'handler' => 'system'],
            'P-02' => ['label' => 'مقررات أساسية لم تُجتز', 'category' => 'P', 'handler' => 'system'],
            'P-03' => ['label' => 'الاقتراب من الحدّ الأقصى للمدة', 'category' => 'P', 'handler' => 'system'],
            'P-04' => ['label' => 'اختيارية مطلوبة غير مستوفاة', 'category' => 'P', 'handler' => 'system'],
            'P-05' => ['label' => 'الاعتماد على الفصل الصيفي', 'category' => 'P', 'handler' => 'system'],
        ];
    }

    /** @param array<string, mixed> $s */
    private static function evaluate(array $s): array
    {
        $courses = $s['courses'];
        $ind = [];
        $band = fn (string $id, float|int $value, string $evidence) => self::band($id, $value, $evidence);
        $ok = fn (int $level, mixed $value, string $evidence) => ['available' => true, 'level' => max(0, min(3, $level)), 'value' => $value, 'evidence' => $evidence];
        $na = fn (string $reason) => ['available' => false, 'level' => null, 'value' => null, 'evidence' => $reason];

        $worst = collect($courses)->sortByDesc('absence_percent')->first();
        $ind['A-01'] = $band('A-01', $worst['absence_percent'], "أعلى غياب {$worst['absence_percent']}% في {$worst['course_code']}");
        $longest = 0;
        $where = '';
        foreach ($courses as $c) {
            $run = 0;
            $prev = null;
            foreach ($c['absence_dates'] as $d) {
                $run = ($prev !== null && (strtotime($d) - strtotime($prev)) <= 7 * 86400) ? $run + 1 : 1;
                $prev = $d;
                if ($run > $longest) {
                    $longest = $run;
                    $where = $c['course_code'];
                }
            }
        }
        $ind['A-02'] = $band('A-02', $longest, $longest ? "{$longest} محاضرات متتالية في {$where}" : 'لا غيابات متتالية');
        $bar = (float) config('qmentor_risk.absence_bar', 25);
        $remaining = round($bar - $worst['absence_percent'], 1);
        $ind['A-03'] = $band('A-03', $remaining, "يتبقى {$remaining}% قبل الحرمان في {$worst['course_code']} (الحدّ {$bar}%)");
        $over = count(array_filter($courses, fn ($c) => $c['absence_percent'] > 10));
        $bands = config('qmentor_risk.thresholds.A-04.bands', [2, 3, 5]);
        $ind['A-04'] = $ok($over >= count($courses) ? 3 : ($over >= $bands[1] ? 2 : ($over >= $bands[0] ? 1 : 0)), $over, "{$over} من ".count($courses).' مقررات فوق 10% غياب');

        $avg = fn (array $vals) => round(array_sum($vals) / max(1, count($vals)), 1);
        $mid = $avg(array_column($courses, 'midterm'));
        $ind['G-01'] = $band('G-01', $mid, "متوسط {$mid}% على ".count($courses).' عمود');
        $quiz = $avg(array_merge(...array_column($courses, 'quizzes')));
        $ind['G-02'] = $band('G-02', $quiz, "متوسط {$quiz}% على ".(count($courses) * 4).' عمود');
        $assignAll = array_merge(...array_column($courses, 'assignments'));
        $graded = array_values(array_filter($assignAll, fn ($v) => $v > 0));
        $asg = $avg($graded ?: [0]);
        $ind['G-03'] = $band('G-03', $asg, "متوسط {$asg}% على ".count($graded).' عمود');
        $ind['G-04'] = $band('G-04', $s['cumulative_gpa'], "المعدل التراكمي {$s['cumulative_gpa']} من 5");
        $terms = $s['terms'];
        if (count($terms) >= 2) {
            $a = $terms[count($terms) - 2]['semester_gpa'];
            $b = $terms[count($terms) - 1]['semester_gpa'];
            $delta = round($b - $a, 2);
            $level = $delta > 0.2 ? 0 : ($delta >= -0.2 ? 1 : ($delta >= -0.5 ? 2 : 3));
            $ind['G-05'] = $ok($level, $delta, "من {$a} إلى {$b} (Δ {$delta})");
        } else {
            $ind['G-05'] = $na('أقل من فصلين مرصودين');
        }
        $ind['G-06'] = $na('لا إحصاء شعبة كافٍ');
        $trendCols = array_merge(...array_map(fn ($c) => array_merge($c['quizzes'], [$c['midterm']]), $courses));
        $ind['G-07'] = self::trend('G-07', $trendCols, $ok);
        $ind['G-08'] = $band('G-08', $s['failed_courses'], "{$s['failed_courses']} رسوب في السجل");
        $ind['G-09'] = $na('لا تنبؤ محفوظ (يتطلب رمز مرشد)');

        $missing = count(array_filter($assignAll, fn ($v) => $v == 0));
        $pct = round(100 * $missing / max(1, count($assignAll)), 1);
        $ind['S-01'] = $band('S-01', $pct, "{$missing} من ".count($assignAll).' واجباً بلا درجة (مستنتَج من عمود بلا درجة)');
        $ind['S-02'] = count($graded) >= 3 ? self::trend('S-02', $graded, $ok) : $na('أقل من ثلاثة واجبات مصحّحة');
        $ind['E-01'] = $na('قائمة المحتوى فقط بلا حالة وصول لكل طالب (فجوة §5.A)');
        $ind['E-02'] = $na('لا بيانات دخول في qu-api-v2 (فجوة §5.A)');
        $ind['AC-01'] = $band('AC-01', $s['warnings'], $s['warnings'] ? "{$s['warnings']} إنذار أكاديمي" : 'لا إنذارات');
        $blocking = min($s['failed_courses'], 2);
        $ind['AC-02'] = $band('AC-02', $blocking, "{$blocking} مقرراً راسباً ما زال متبقياً في الخطة");
        $ind['R-01'] = $na('لا استعلام تأجيل/اعتذار في qu-api-v2 (فجوة §5.A)');
        $ind['T-01'] = $band('T-01', $s['profile'] === 'critical' ? 1 : 0, ($s['profile'] === 'critical' ? 1 : 0).' مقرراً برمز غياب/غير مكتمل');

        // Compound
        $hit = $ind['S-01']['value'] > 50 && $ind['A-01']['value'] > 15;
        $ind['C-01'] = $ok($hit ? 3 : 0, $hit, $hit ? 'واجبات مفقودة >50% وغياب >15% (بديل عن الدخول)' : 'لا نمط انسحاب');
        $hit = $ind['A-01']['value'] > 10 && ($ind['G-07']['level'] ?? 0) >= 2;
        $ind['C-02'] = $ok($hit ? 2 : 0, $hit, $hit ? 'غياب >10% مع مسار أداء هابط' : 'لا اقتران');
        if (count($terms) >= 2) {
            $prev = $terms[count($terms) - 2]['semester_gpa'];
            $last = $terms[count($terms) - 1]['semester_gpa'];
            $hit = $prev >= 3.5 && ($prev - $last) > 0.5;
            $ind['C-03'] = $ok($hit ? 2 : 0, round($prev - $last, 2), $hit ? "هبوط من {$prev} إلى {$last} بعد تفوّق" : 'لا انهيار بعد تفوّق');
        } else {
            $ind['C-03'] = $na('أقل من فصلين رئيسيين');
        }
        $hit = $ind['A-01']['value'] < 5 && $ind['G-01']['value'] < 40;
        $ind['C-04'] = $ok($hit ? 1 : 0, $hit, $hit ? 'حضور منتظم ودرجة منتصف <40%' : 'لا انفصال');
        $ind['C-05'] = $na('يُقيَّم من سجل التدخلات بعد بنائه (WP3)');

        // Graduation path
        $expected = $s['plan_hours'] / $s['plan_levels'] * ($s['student_level'] - 1);
        $behind = max(0, (int) floor(($expected - $s['passed_hours']) / ($s['plan_hours'] / $s['plan_levels'])));
        $ind['P-01'] = $band('P-01', $behind, "المستوى {$s['student_level']} · {$s['passed_hours']} من {$s['plan_hours']} ساعة · متأخر {$behind} فصل");
        $ind['P-02'] = $band('P-02', $s['failed_courses'], "{$s['failed_courses']} مقرراً أساسياً متبقياً تحت مستوى الطالب");
        $ind['P-03'] = $na('لا تاريخ قبول في /me (فجوة §5.A)');
        $ind['P-04'] = $band('P-04', $behind > 1 ? 1 : 0, ($behind > 1 ? 1 : 0).' اختيارية متبقية تحت مستوى الطالب');
        $ind['P-05'] = $na('لا جدول طرح المقررات (فجوة §5.A)');

        $catalogue = self::catalogue();
        foreach ($ind as $id => &$row) {
            $row = $row + ['id' => $id] + $catalogue[$id];
        }
        unset($row);

        // §5.C — the hybrid score, as RiskEngine computes it.
        $weights = (array) config('qmentor_risk.weights');
        $fold = (array) config('qmentor_risk.fold');
        $buckets = [];
        foreach ($ind as $i) {
            if (! $i['available'] || $i['category'] === 'C') {
                continue;
            }
            $cat = $fold[$i['category']] ?? $i['category'];
            $buckets[$cat][] = $i['level'] / 3 * 100;
        }
        $categories = [];
        $sum = 0.0;
        $used = 0;
        foreach ($weights as $cat => $w) {
            if (empty($buckets[$cat])) {
                $categories[$cat] = ['score' => null, 'weight' => $w, 'used' => false, 'n' => 0];
                continue;
            }
            $score = array_sum($buckets[$cat]) / count($buckets[$cat]);
            $categories[$cat] = ['score' => round($score, 1), 'weight' => $w, 'used' => true, 'n' => count($buckets[$cat])];
            $sum += $score * $w;
            $used += $w;
        }
        $score = $used > 0 ? (int) round($sum / $used) : 0;
        $levelBefore = self::levelFor($score);
        $level = $levelBefore;
        $override = null;
        foreach ((array) config('qmentor_risk.overrides') as $id => $rule) {
            $i = $ind[$id] ?? null;
            if ($i && $i['available'] && $i['level'] >= $rule['at_level'] && $level < $rule['minimum']) {
                $level = $rule['minimum'];
                $override = $id;
            }
        }
        foreach ((array) config('qmentor_risk.composite_overrides') as $id => $rule) {
            $hit = true;
            foreach ((array) ($rule['when'] ?? []) as $ii => $cond) {
                $x = $ind[$ii] ?? null;
                if (! $x || ! $x['available'] || ! is_numeric($x['value'] ?? null)
                    || (isset($cond['min']) && (float) $x['value'] < (float) $cond['min'])
                    || (isset($cond['max']) && (float) $x['value'] > (float) $cond['max'])) {
                    $hit = false;
                    break;
                }
            }
            if ($hit && $level < (int) $rule['minimum']) {
                $level = (int) $rule['minimum'];
                $override = (string) $id;
            }
        }
        $highCount = count(array_filter($ind, fn ($i) => $i['available'] && $i['level'] >= 3));
        $excuse = $s['excuse'];
        if ($excuse !== null && $highCount >= (int) config('qmentor_risk.critical.min_high_indicators', 2)) {
            $level = 3;
            $override = 'E-EX';
            $note = " · مع طلب عذر «{$excuse['reason']}» في {$excuse['course']}";
            foreach ($ind as $id => $i) {
                if ($i['category'] === 'A' && $i['available'] && $i['level'] > 0 && ($id === 'A-01' || str_contains((string) $i['evidence'], $excuse['course']))) {
                    $ind[$id]['evidence'] .= $note;
                    $ind[$id]['excuse'] = $excuse;
                }
            }
        } elseif ($level >= 3) {
            $level = 2;
        }
        $bandCfg = config("qmentor_risk.levels.{$level}");
        $score = max($bandCfg['min'], min($bandCfg['max'], $score));

        $top = collect($ind)
            ->filter(fn ($i) => $i['available'] && $i['level'] > 0)
            ->sortByDesc(fn ($i) => [$i['level'], $i['category'] === 'C' ? 1 : 0])
            ->take(3)
            ->map(fn ($i) => ['id' => $i['id'], 'label' => $i['label'], 'level' => $i['level'], 'value' => $i['value'], 'evidence' => $i['evidence']])
            ->values()->all();

        // A history of nightly runs: the same picture with small drift.
        $computedAt = Carbon::parse('2026-09-23 03:15:00')->subSeconds(crc32($s['student_id']) % 1800);
        $history = [];
        for ($d = 9; $d >= 0; $d--) {
            $hs = max(0, min(100, $score + ($d === 0 ? 0 : (int) round(sin($d + crc32($s['student_id']) % 7) * 4))));
            $history[] = ['computed_at' => $computedAt->copy()->subDays($d)->toDateTimeString(), 'score' => $hs, 'level' => $d === 0 ? $level : self::levelFor($hs), 'override' => $d === 0 ? $override : null];
        }

        return [
            'student_id' => $s['student_id'], 'semester' => self::SEMESTER, 'computed_at' => $computedAt->toDateTimeString(),
            'score' => $score, 'level' => $level, 'level_before_rules' => $levelBefore, 'override' => $override,
            'top_factors' => $top, 'indicators' => array_values($ind), 'categories' => $categories,
            'available_count' => count(array_filter($ind, fn ($i) => $i['available'])), 'model_version' => self::MODEL_VERSION,
            'history' => $history,
        ];
    }

    /** @param callable $ok */
    private static function trend(string $id, array $pcts, callable $ok): array
    {
        $half = intdiv(count($pcts), 2);
        $first = array_sum(array_slice($pcts, 0, $half)) / max(1, $half);
        $second = array_sum(array_slice($pcts, $half)) / max(1, count($pcts) - $half);
        $delta = round($second - $first, 1);
        $level = $delta >= 5 ? 0 : ($delta > -5 ? 1 : ($delta > -15 ? 2 : 3));

        return $ok($level, $delta, "تغيّر {$delta} نقطة بين نصفي الأعمدة (بترتيب الأعمدة، لا بالتاريخ)");
    }

    private static function band(string $id, float|int $value, string $evidence): array
    {
        $t = config("qmentor_risk.thresholds.{$id}");
        if (! $t) {
            return ['available' => false, 'level' => null, 'value' => null, 'evidence' => 'لا عتبة مضبوطة'];
        }
        [$m, $h, $c] = $t['bands'];
        if ($t['dir'] === 'up') {
            $level = $value >= $c ? 3 : ($value >= $h ? 2 : ($value >= $m ? 1 : 0));
        } else {
            $level = $value <= $c ? 3 : ($value <= $h ? 2 : ($value < $m ? 1 : 0));
        }

        return ['available' => true, 'level' => max(0, min(3, $level)), 'value' => $value, 'evidence' => $evidence];
    }

    public static function levelFor(int $score): int
    {
        foreach ((array) config('qmentor_risk.levels') as $level => $band) {
            if ($score <= $band['max']) {
                return (int) $level;
            }
        }

        return 3;
    }

    /** @return array{key: string, ar: string, color: string, min: int, max: int} */
    public static function levelMeta(int $level): array
    {
        return (array) config("qmentor_risk.levels.{$level}", config('qmentor_risk.levels.0'));
    }

    /** @return array<int, array<string, mixed>> */
    public static function levels(): array
    {
        return collect(config('qmentor_risk.levels'))->map(fn ($b, $k) => ['level' => $k] + $b)->values()->all();
    }

    // ── Scopes ────────────────────────────────────────────────────────────

    /** @return array<int, string> the students an advisor id advises. */
    public static function adviseeIds(string $advisorId): array
    {
        return array_values(array_map(fn ($s) => (string) $s['student_id'], array_filter(self::all(), fn ($s) => $s['advisor_id'] === $advisorId)));
    }

    /**
     * The students in the sections the demo instructor teaches: two sections
     * of the accounting programme's first two courses and one of computer
     * science — a roster that overlaps but does not equal the caseload.
     *
     * @return array<string, array{course_code: string, course_name: string, section: string}> id → section
     */
    public static function taughtSections(string $instructorId): array
    {
        if ($instructorId !== self::DEMO_INSTRUCTOR_ID) {
            return [];
        }
        $out = [];
        foreach (self::all() as $s) {
            $id = (string) $s['student_id'];
            if ($s['major_no'] === '0102' && in_array((int) $id[-1], [0, 1, 2, 3, 4, 5], true)) {
                $c = $s['courses'][0];
                $out[$id] = ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'section' => $c['section']];
            } elseif ($s['major_no'] === '0201' && in_array((int) $id[-1], [6, 7, 8, 9], true)) {
                $c = $s['courses'][1];
                $out[$id] = ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'section' => $c['section']];
            }
        }

        return $out;
    }

    /** The advisee row shape of /api/advisor/advisees (SIS_ADVISORY_LISTS + roster figures). */
    public static function adviseeRow(array $s): array
    {
        return [
            'student_id' => $s['student_id'], 'student_name' => $s['name'], 'student_name_en' => $s['name_en'],
            'semester' => self::SEMESTER, 'email' => $s['email'], 'mobile_no' => $s['mobile'],
            'faculty_no' => $s['faculty_no'], 'faculty_name' => $s['faculty_name'],
            'dept_no' => $s['dept_no'], 'dept_name' => $s['dept_name'],
            'major_no' => $s['major_no'], 'major_name' => $s['major_name'], 'major_name_en' => $s['major_name_en'],
            'last_recorded_gpa' => $s['cumulative_gpa'], 'student_level' => $s['student_level'],
            'passed_hours' => $s['passed_hours'], 'plan_hours' => $s['plan_hours'],
            'expected_graduation_semester' => $s['expected_graduation_semester'], 'academic_status' => $s['academic_status'],
            'risk_level' => $s['risk']['level'], 'risk_score' => $s['risk']['score'],
            'data_stages' => ['roster' => true, 'academic' => true, 'profile' => true, 'blackboard' => true, 'score' => true],
            'last_error' => null,
        ];
    }

    // ── Alerts / approvals / interventions / runs ─────────────────────────

    /** @return array<int, array<string, mixed>> the platform alerts written for one student. */
    public static function alertsFor(string $studentId): array
    {
        $s = self::find($studentId);
        if (! $s) {
            return [];
        }
        $r = $s['risk'];
        $at = Carbon::parse($r['computed_at']);
        $base = (int) (crc32($studentId) % 100000) * 10;
        $alerts = [];
        $factors = array_map(fn ($f) => ['id' => $f['id'], 'label' => $f['label'], 'evidence' => $f['evidence']], $r['top_factors']);
        $alerts[] = ['id' => $base + 1, 'kind' => 'evaluation', 'level_from' => null, 'level_to' => $r['level'], 'score' => $r['score'], 'top_factors' => $factors, 'confidential' => false, 'created_at' => $at->toDateTimeString(), 'read_at' => null, 'response' => null];
        if ($r['level'] >= 1) {
            $alerts[] = ['id' => $base + 2, 'kind' => 'level_up', 'level_from' => max(0, $r['level'] - 1), 'level_to' => $r['level'], 'score' => $r['score'], 'top_factors' => $factors, 'confidential' => false, 'created_at' => $at->copy()->subDays(3)->toDateTimeString(), 'read_at' => $at->copy()->subDays(2)->toDateTimeString(), 'response' => 'acknowledged'];
        }
        $a03 = collect($r['indicators'])->firstWhere('id', 'A-03');
        if ($a03 && ($a03['level'] ?? 0) >= 2) {
            $alerts[] = ['id' => $base + 3, 'kind' => 'attendance_warning', 'level_from' => null, 'level_to' => $r['level'], 'score' => $r['score'], 'top_factors' => [['id' => 'A-03', 'label' => $a03['label'], 'evidence' => $a03['evidence']]], 'confidential' => false, 'created_at' => $at->copy()->subDays(1)->toDateTimeString(), 'read_at' => null, 'response' => null];
        }
        if ($r['override'] === 'E-EX') {
            $alerts[] = ['id' => $base + 4, 'kind' => 'counseling_referral', 'level_from' => 2, 'level_to' => 3, 'score' => $r['score'], 'top_factors' => $factors, 'confidential' => true, 'created_at' => $at->toDateTimeString(), 'read_at' => null, 'response' => null];
        }
        $alerts[] = ['id' => $base + 5, 'kind' => 'platform_nudge', 'level_from' => null, 'level_to' => $r['level'], 'score' => $r['score'], 'top_factors' => [], 'confidential' => false, 'created_at' => $at->copy()->subDays(6)->toDateTimeString(), 'read_at' => $at->copy()->subDays(5)->toDateTimeString(), 'response' => null];

        return $alerts;
    }

    /** @return array<int, array<string, mixed>> approvals across the cohort (the agent's L3 requests). */
    public static function approvals(): array
    {
        $tasks = config('qmentor_autonomy.tasks');
        $rows = [];
        $n = 0;
        $statuses = ['pending', 'pending', 'approved', 'pending', 'rejected', 'executed', 'pending', 'escalated', 'approved', 'pending', 'executed', 'pending'];
        $actions = [23 => 'approve_intervention_plan', 24 => 'send_intervention_message', 26 => 'approve_recovery_plan', 27 => 'escalate_dept_head'];
        foreach (self::all() as $s) {
            $id = (string) $s['student_id'];
            if ($s['risk']['level'] < 2 || $n >= 12) {
                continue;
            }
            $taskNo = [23, 24, 24, 26, 27][$n % 5];
            $status = $statuses[$n];
            $created = Carbon::parse('2026-09-22 08:00:00')->subHours($n * 7);
            $decided = in_array($status, ['approved', 'rejected', 'executed'], true) ? $created->copy()->addHours(5) : null;
            $rows[] = [
                'id' => 700 + $n, 'task_no' => $taskNo, 'task' => $tasks[$taskNo]['ar'], 'action' => $actions[$taskNo],
                'level' => $tasks[$taskNo]['level'], 'student_id' => $id, 'student_name' => $s['name'],
                'reason' => $s['risk']['top_factors'][0]['evidence'] ?? null,
                'payload' => ['risk_level' => $s['risk']['level'], 'score' => $s['risk']['score'], 'channel' => $taskNo === 24 ? 'email' : 'platform'],
                'status' => $status, 'sla_hours' => $tasks[$taskNo]['sla_hours'] ?? 48,
                'due_at' => $created->copy()->addHours($tasks[$taskNo]['sla_hours'] ?? 48)->toDateTimeString(),
                'created_at' => $created->toDateTimeString(), 'decided_by' => $decided ? $s['advisor_name'] : null,
                'decided_at' => $decided?->toDateTimeString(), 'decision_note' => $status === 'rejected' ? 'الطالب على تواصل مباشر — لا حاجة للرسالة' : null,
                'execution' => $status === 'executed' ? ['executed' => true, 'detail' => 'أُرسلت رسالة التدخل عبر البريد الجامعي'] : null,
                'assigned_to' => $s['advisor_id'],
            ];
            $n++;
        }

        return $rows;
    }

    /** @return array<int, array<string, mixed>> the interventions an advisor logged. */
    public static function interventions(string $advisorId): array
    {
        $labels = ['meeting' => 'لقاء إرشادي', 'call' => 'اتصال هاتفي', 'email' => 'رسالة بريد', 'referral' => 'إحالة', 'plan' => 'خطة معالجة'];
        $rows = [];
        $n = 0;
        foreach (self::adviseeIds($advisorId) as $id) {
            $s = self::all()[$id];
            if ($s['risk']['level'] < 1 || $n >= 8) {
                continue;
            }
            $type = array_keys($labels)[$n % 5];
            $rows[] = [
                'id' => 900 + $n, 'student_id' => $id, 'student_name' => $s['name'], 'type' => $type, 'label' => $labels[$type],
                'note' => match ($type) { 'meeting' => 'لقاء لمراجعة الغياب وخطة التسليم', 'call' => 'اتصال للاطمئنان والتذكير بموعد اللقاء', 'email' => 'رسالة بمواعيد الساعات المكتبية', 'referral' => 'إحالة لمركز الإرشاد الطلابي', default => 'خطة معالجة لرفع المعدل هذا الفصل' },
                'outcome' => $n % 3 === 0 ? 'استجاب الطالب' : ($n % 3 === 1 ? 'قيد المتابعة' : null),
                'follow_up' => $n % 2 === 0 ? Carbon::parse('2026-09-30')->addDays($n)->toDateString() : null,
                'performed_at' => Carbon::parse('2026-09-21 10:00:00')->subDays($n * 2)->toDateTimeString(),
            ];
            $n++;
        }

        return $rows;
    }

    /** @return array<int, array<string, mixed>> the sync-run log (most recent first). */
    public static function syncRuns(): array
    {
        if (self::$syncRuns !== null) {
            return self::$syncRuns;
        }
        $cohort = count(self::all());
        $rows = [];
        $id = 400;
        for ($day = 0; $day < 4; $day++) {
            $base = Carbon::parse('2026-09-23 01:00:00')->subDays($day);
            foreach ([['roster', 0, 4], ['academic', 4, 21], ['profile', 25, 18], ['blackboard', 43, 27], ['score', 70, 6], ['alerts', 76, 2], ['users', 78, 3], ['analyze', 81, 52]] as [$stage, $offset, $minutes]) {
                $failed = $stage === 'blackboard' ? 3 : ($stage === 'profile' ? 1 : 0);
                $rows[] = ['id' => $id++, 'stage' => $stage, 'trigger' => $day === 0 ? 'scheduled' : 'scheduled', 'started_at' => $base->copy()->addMinutes($offset)->toDateTimeString(), 'finished_at' => $base->copy()->addMinutes($offset + $minutes)->toDateTimeString(), 'pending' => 0, 'succeeded' => $stage === 'roster' ? 1 : $cohort - $failed, 'failed' => $failed, 'budget_hit' => false, 'note' => $stage === 'alerts' ? '14 تنبيهاً' : null];
            }
        }
        usort($rows, fn ($a, $b) => strcmp($b['started_at'], $a['started_at']));

        return self::$syncRuns = $rows;
    }

    // ── Term ──────────────────────────────────────────────────────────────

    /** @return array{code: string, starts_on: string, ends_on: string, weeks_elapsed: int, weeks_total: int} */
    public static function term(): array
    {
        $start = Carbon::parse(self::TERM_STARTS)->startOfDay();
        $end = Carbon::parse(self::TERM_ENDS)->startOfDay();
        $today = Carbon::now()->startOfDay();
        $elapsed = max(1, (int) floor($start->diffInDays($today, false) / 7) + 1);
        $total = max(1, (int) ceil($start->diffInDays($end) / 7));

        return ['code' => self::SEMESTER, 'starts_on' => $start->toDateString(), 'ends_on' => $end->toDateString(), 'weeks_elapsed' => min($elapsed, $total), 'weeks_total' => $total];
    }
}
