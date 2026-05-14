<?php

namespace App\Support;

/**
 * Single source of dummy data for the demo build. Every endpoint in
 * QMentorApiController + DigitalRecordController + QSparkController reads
 * from here, so the demo runs with zero outbound traffic. Data is dispatched
 * per-major (Accounting / Computer Science / Electrical Engineering) so a
 * student in Accounting sees Accounting courses, plan, schedule, finals, etc.
 *
 * Response shapes are matched to the live api.qu.edu.sa / Blackboard contracts
 * that the QMentor SPA's mappers expect (e.g. timetable: { time-table: [...] },
 * exams: { courses: [{ exam: {...} }] }, plan: { courses: [{ group_type, ... }] }).
 */
class DemoData
{
    /** Roster of demo students faculty can browse. */
    public static function students(): array
    {
        return [
            ['student_id' => '443211517', 'name' => 'فيصل خالد محمد',     'name_en' => 'Faisal Khalid Mohammed',   'major' => 'محاسبة',         'major_en' => 'Accounting',             'major_no' => '0102', 'faculty' => 'كلية إدارة الأعمال', 'faculty_en' => 'College of Business Administration', 'faculty_no' => '01', 'gpa' => 4.32, 'level' => 6, 'enrolled_hours' => 15],
            ['student_id' => '443100021', 'name' => 'نوره عبدالله سعد',    'name_en' => 'Noura Abdullah Saad',      'major' => 'علوم الحاسب',    'major_en' => 'Computer Science',       'major_no' => '0201', 'faculty' => 'كلية الحاسب',        'faculty_en' => 'College of Computer',                 'faculty_no' => '02', 'gpa' => 4.61, 'level' => 5, 'enrolled_hours' => 18],
            ['student_id' => '443100022', 'name' => 'محمد عبدالعزيز فهد',  'name_en' => 'Mohammed Abdulaziz Fahad', 'major' => 'هندسة كهربائية', 'major_en' => 'Electrical Engineering', 'major_no' => '0301', 'faculty' => 'كلية الهندسة',       'faculty_en' => 'College of Engineering',              'faculty_no' => '03', 'gpa' => 3.94, 'level' => 7, 'enrolled_hours' => 12],
            ['student_id' => '443100023', 'name' => 'لمياء فهد عبدالرحمن', 'name_en' => 'Lamia Fahad Abdulrahman',  'major' => 'لغة إنجليزية',   'major_en' => 'English Language',       'major_no' => '0401', 'faculty' => 'كلية اللغات والترجمة','faculty_en' => 'College of Languages and Translation','faculty_no' => '04', 'gpa' => 4.78, 'level' => 4, 'enrolled_hours' => 16],
            ['student_id' => '443100024', 'name' => 'أحمد ناصر إبراهيم',   'name_en' => 'Ahmed Nasser Ibrahim',     'major' => 'صيدلة',          'major_en' => 'Pharmacy',               'major_no' => '0501', 'faculty' => 'كلية الصيدلة',       'faculty_en' => 'College of Pharmacy',                  'faculty_no' => '05', 'gpa' => 4.05, 'level' => 8, 'enrolled_hours' => 21],
            ['student_id' => '443100025', 'name' => 'ريم سلطان أحمد',     'name_en' => 'Reem Sultan Ahmed',         'major' => 'تربية خاصة',     'major_en' => 'Special Education',      'major_no' => '0601', 'faculty' => 'كلية التربية',       'faculty_en' => 'College of Education',                 'faculty_no' => '06', 'gpa' => 4.49, 'level' => 6, 'enrolled_hours' => 15],
            ['student_id' => '443100026', 'name' => 'سعد تركي بدر',       'name_en' => 'Saad Turki Badr',           'major' => 'إعلام رقمي',     'major_en' => 'Digital Media',          'major_no' => '0701', 'faculty' => 'كلية الإعلام',       'faculty_en' => 'College of Media',                     'faculty_no' => '07', 'gpa' => 3.72, 'level' => 5, 'enrolled_hours' => 14],
            ['student_id' => '443100027', 'name' => 'دانة وليد ماجد',     'name_en' => 'Danah Walid Majed',         'major' => 'تمريض',          'major_en' => 'Nursing',                'major_no' => '0801', 'faculty' => 'كلية التمريض',       'faculty_en' => 'College of Nursing',                   'faculty_no' => '08', 'gpa' => 4.21, 'level' => 7, 'enrolled_hours' => 17],
        ];
    }

    public static function findStudent(?string $studentId): ?array
    {
        if (!$studentId) {
            return null;
        }
        foreach (self::students() as $s) {
            if ((string) $s['student_id'] === (string) $studentId) {
                return $s;
            }
        }
        return null;
    }

    /**
     * Resolve a major bundle key from a student id. Unknown / non-featured
     * students fall back to the Accounting bundle (the primary demo case).
     */
    private static function bundleKey(string $studentId): string
    {
        $s = self::findStudent($studentId);
        return match ($s['major_en'] ?? '') {
            'Computer Science'       => 'cs',
            'Electrical Engineering' => 'ee',
            default                  => 'acct',
        };
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/me */
    public static function studentProfile(string $studentId): array
    {
        $s = self::findStudent($studentId) ?? self::students()[0];
        // Derive earned hours from semester history so the profile, grades page,
        // and study plan all agree on the same numbers.
        $earnedHours = 0;
        foreach (self::transactions($studentId) as $sem) {
            $earnedHours += (int) ($sem['total_credit_hours'] ?? 0);
        }
        $planHours = 136;
        return [
            'profile' => [
                'student_id' => $s['student_id'],
                'name'       => $s['name'],
                'name_en'    => $s['name_en'] ?? 'Demo Student',
                'major'      => ['major_id' => $s['major_no'], 'major_no' => $s['major_no'], 'name' => $s['major'], 'name_en' => $s['major_en'] ?? $s['major'], 'main_major' => $s['faculty_no']],
                'faculty'    => ['faculty_id' => $s['faculty_no'], 'faculty_no' => $s['faculty_no'], 'name' => $s['faculty'], 'name_en' => $s['faculty_en'] ?? $s['faculty']],
                'gpa'        => $s['gpa'],
                'level'      => $s['level'],
                'status'     => 'active',
                'enrolled_hours' => $s['enrolled_hours'],
                'academic'   => [
                    'cumulative_gpa'     => (string) $s['gpa'],
                    'last_recorded_gpa'  => (string) $s['gpa'],
                    'total_earned_hours' => $earnedHours,
                    'total_plan_hours'   => $planHours,
                    'gpa_scale'          => '5.00',
                    'expected_graduation'=> '1447/1448',
                ],
            ],
        ];
    }

    // ─── Per-major: current courses ──────────────────────────────────────

    /** Current-semester courses keyed by major. */
    private static function currentCoursesByBundle(): array
    {
        return [
            'acct' => [
                ['course_code' => 'ACCT401', 'course_name' => 'محاسبة مالية متقدمة',  'course_name_s' => 'Advanced Financial Accounting', 'instructor' => 'د. عبدالله سعد القحطاني', 'credit_hours' => 3, 'section' => '20451'],
                ['course_code' => 'ACCT421', 'course_name' => 'المراجعة والتدقيق',    'course_name_s' => 'Auditing',                       'instructor' => 'د. خالد عبدالله العتيبي', 'credit_hours' => 3, 'section' => '20452'],
                ['course_code' => 'FIN401',  'course_name' => 'الإدارة المالية المتقدمة','course_name_s' => 'Advanced Financial Management','instructor' => 'د. منى عبدالعزيز السهلي', 'credit_hours' => 3, 'section' => '20453'],
                ['course_code' => 'TAX410',  'course_name' => 'المحاسبة الضريبية',    'course_name_s' => 'Tax Accounting',                 'instructor' => 'د. فهد عبدالرحمن البراك', 'credit_hours' => 3, 'section' => '20454'],
                ['course_code' => 'BUSN320', 'course_name' => 'نظم معلومات إدارية',    'course_name_s' => 'Management Information Systems', 'instructor' => 'د. ريم محمد العبدالكريم', 'credit_hours' => 3, 'section' => '20455'],
            ],
            'cs' => [
                ['course_code' => 'CS401',  'course_name' => 'هندسة البرمجيات',       'course_name_s' => 'Software Engineering',      'instructor' => 'د. سارة عبدالله القحطاني', 'credit_hours' => 3, 'section' => '30451'],
                ['course_code' => 'CS421',  'course_name' => 'الذكاء الاصطناعي',      'course_name_s' => 'Artificial Intelligence',   'instructor' => 'د. عبدالله ناصر العتيبي',  'credit_hours' => 3, 'section' => '30452'],
                ['course_code' => 'CS433',  'course_name' => 'شبكات الحاسب',         'course_name_s' => 'Computer Networks',          'instructor' => 'د. فهد عبدالعزيز العنزي',  'credit_hours' => 3, 'section' => '30453'],
                ['course_code' => 'CS311',  'course_name' => 'نظرية الحوسبة',         'course_name_s' => 'Theory of Computation',     'instructor' => 'د. خالد عبدالله الشمري',    'credit_hours' => 3, 'section' => '30454'],
                ['course_code' => 'ARAB301','course_name' => 'الكتابة والتعبير',      'course_name_s' => 'Arabic Writing',             'instructor' => 'د. هند عبدالرحمن الزهراني', 'credit_hours' => 2, 'section' => '30455'],
            ],
            'ee' => [
                ['course_code' => 'EE320', 'course_name' => 'أنظمة القوى الكهربائية', 'course_name_s' => 'Electric Power Systems',     'instructor' => 'د. عمر عبدالله القحطاني',  'credit_hours' => 3, 'section' => '40451'],
                ['course_code' => 'EE340', 'course_name' => 'الإلكترونيات الرقمية',    'course_name_s' => 'Digital Electronics',        'instructor' => 'د. فهد عبدالعزيز السهلي',  'credit_hours' => 3, 'section' => '40452'],
                ['course_code' => 'EE360', 'course_name' => 'نظرية التحكم',           'course_name_s' => 'Control Theory',             'instructor' => 'د. خالد عبدالله العنزي',   'credit_hours' => 3, 'section' => '40453'],
                ['course_code' => 'EE380', 'course_name' => 'الاتصالات التماثلية',     'course_name_s' => 'Analog Communications',      'instructor' => 'د. ريم محمد البراك',         'credit_hours' => 3, 'section' => '40454'],
            ],
        ];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/courses */
    public static function currentCourses(string $studentId): array
    {
        return self::currentCoursesByBundle()[self::bundleKey($studentId)];
    }

    // ─── Per-major: weekly timetable (QU-API shape) ──────────────────────

    /**
     * Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/timetable
     * Returns the upstream shape the SPA's mapApiTimetable expects:
     *   { time-table: [{ course_code, course_name, course_name_s, times: [
     *       { day: { number, name }, room, time_slot: { formatted: { start, end } } }
     *   ]}] }
     * Days are 1..7 (1 = Sunday) to match the QU API.
     */
    public static function timetable(string $studentId): array
    {
        $slots = self::timetableSlots($studentId);
        $courses = self::currentCourses($studentId);
        $byCode = [];
        foreach ($courses as $c) {
            $byCode[$c['course_code']] = $c;
        }

        $grouped = [];
        foreach ($slots as $s) {
            $code = $s['code'];
            $c = $byCode[$code] ?? null;
            if (!isset($grouped[$code])) {
                $grouped[$code] = [
                    'course_code'    => $code,
                    'course_name'    => $c['course_name']    ?? $code,
                    'course_name_s'  => $c['course_name_s']  ?? $code,
                    'section'        => $c['section']        ?? '',
                    'campus_desc'    => 'المبنى الرئيسي',
                    'times'          => [],
                ];
            }
            $grouped[$code]['times'][] = [
                'day'  => ['number' => $s['day'], 'name' => self::dayName($s['day'])],
                'room' => $s['room'],
                'time_slot' => [
                    'formatted' => ['start' => $s['start'], 'end' => $s['end']],
                    'original'  => ['start' => $s['start'], 'end' => $s['end']],
                ],
            ];
        }

        return ['time-table' => array_values($grouped)];
    }

    private static function dayName(int $n): string
    {
        return [1 => 'الأحد', 2 => 'الاثنين', 3 => 'الثلاثاء', 4 => 'الأربعاء', 5 => 'الخميس', 6 => 'الجمعة', 7 => 'السبت'][$n] ?? '';
    }

    /** Weekly slots used to build both the timetable and the finals dummy data. */
    private static function timetableSlots(string $studentId): array
    {
        return [
            'acct' => [
                ['code' => 'ACCT401', 'day' => 1, 'start' => '08:00', 'end' => '09:30', 'room' => 'C2-105'],
                ['code' => 'ACCT401', 'day' => 3, 'start' => '08:00', 'end' => '09:30', 'room' => 'C2-105'],
                ['code' => 'ACCT421', 'day' => 1, 'start' => '10:00', 'end' => '11:30', 'room' => 'C2-204'],
                ['code' => 'ACCT421', 'day' => 3, 'start' => '10:00', 'end' => '11:30', 'room' => 'C2-204'],
                ['code' => 'FIN401',  'day' => 2, 'start' => '09:00', 'end' => '10:30', 'room' => 'C1-310'],
                ['code' => 'FIN401',  'day' => 4, 'start' => '09:00', 'end' => '10:30', 'room' => 'C1-310'],
                ['code' => 'TAX410',  'day' => 2, 'start' => '11:00', 'end' => '12:30', 'room' => 'C2-118'],
                ['code' => 'TAX410',  'day' => 4, 'start' => '11:00', 'end' => '12:30', 'room' => 'C2-118'],
                ['code' => 'BUSN320', 'day' => 5, 'start' => '09:00', 'end' => '11:00', 'room' => 'C3-401'],
            ],
            'cs' => [
                ['code' => 'CS401',   'day' => 1, 'start' => '08:00', 'end' => '09:30', 'room' => 'B6-201'],
                ['code' => 'CS401',   'day' => 3, 'start' => '08:00', 'end' => '09:30', 'room' => 'B6-201'],
                ['code' => 'CS421',   'day' => 1, 'start' => '10:00', 'end' => '11:30', 'room' => 'B6-304'],
                ['code' => 'CS421',   'day' => 3, 'start' => '10:00', 'end' => '11:30', 'room' => 'B6-304'],
                ['code' => 'CS433',   'day' => 2, 'start' => '09:00', 'end' => '10:30', 'room' => 'B6-220'],
                ['code' => 'CS433',   'day' => 4, 'start' => '09:00', 'end' => '10:30', 'room' => 'B6-220'],
                ['code' => 'CS311',   'day' => 2, 'start' => '11:00', 'end' => '12:30', 'room' => 'B6-118'],
                ['code' => 'CS311',   'day' => 4, 'start' => '11:00', 'end' => '12:30', 'room' => 'B6-118'],
                ['code' => 'ARAB301', 'day' => 5, 'start' => '09:00', 'end' => '11:00', 'room' => 'B2-110'],
            ],
            'ee' => [
                ['code' => 'EE320', 'day' => 1, 'start' => '08:00', 'end' => '09:30', 'room' => 'E4-201'],
                ['code' => 'EE320', 'day' => 3, 'start' => '08:00', 'end' => '09:30', 'room' => 'E4-201'],
                ['code' => 'EE340', 'day' => 1, 'start' => '10:00', 'end' => '11:30', 'room' => 'E4-Lab-3'],
                ['code' => 'EE340', 'day' => 3, 'start' => '10:00', 'end' => '11:30', 'room' => 'E4-Lab-3'],
                ['code' => 'EE360', 'day' => 2, 'start' => '09:00', 'end' => '10:30', 'room' => 'E4-220'],
                ['code' => 'EE360', 'day' => 4, 'start' => '09:00', 'end' => '10:30', 'room' => 'E4-220'],
                ['code' => 'EE380', 'day' => 5, 'start' => '09:00', 'end' => '11:00', 'room' => 'E4-310'],
            ],
        ][self::bundleKey($studentId)];
    }

    /**
     * Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/exams
     * Returns the upstream shape: { courses: [{ course_code, course_name, exam: {...} }] }
     */
    public static function finalExams(string $studentId): array
    {
        $finals = self::finalsList($studentId);
        $currentByCode = [];
        foreach (self::currentCourses($studentId) as $c) {
            $currentByCode[$c['course_code']] = $c;
        }

        $rows = [];
        foreach ($finals as $e) {
            $c = $currentByCode[$e['code']] ?? null;
            $rows[] = [
                'course_code'   => $e['code'],
                'course_name'   => $c['course_name']   ?? $e['code'],
                'course_name_s' => $c['course_name_s'] ?? $e['code'],
                'exam' => [
                    'exam_date'  => $e['date'],
                    'start_time' => $e['time'],
                    'end_time'   => self::addHours($e['time'], 2),
                    'hall_no'    => $e['hall'],
                    'campus_name'=> 'الحرم الرئيسي',
                ],
            ];
        }
        return ['courses' => $rows];
    }

    private static function addHours(string $hhmm, int $hours): string
    {
        [$h, $m] = array_pad(explode(':', $hhmm), 2, '00');
        $end = (int) $h + $hours;
        return sprintf('%02d:%02d', $end, (int) $m);
    }

    private static function finalsList(string $studentId): array
    {
        return [
            'acct' => [
                ['code' => 'ACCT401', 'date' => '2026-05-25', 'time' => '08:00', 'hall' => 'C2-Hall'],
                ['code' => 'ACCT421', 'date' => '2026-05-27', 'time' => '10:00', 'hall' => 'C2-Hall'],
                ['code' => 'FIN401',  'date' => '2026-05-29', 'time' => '08:00', 'hall' => 'C1-Hall'],
                ['code' => 'TAX410',  'date' => '2026-06-01', 'time' => '13:00', 'hall' => 'C2-Hall'],
                ['code' => 'BUSN320', 'date' => '2026-06-03', 'time' => '10:00', 'hall' => 'C3-Hall'],
            ],
            'cs' => [
                ['code' => 'CS401',   'date' => '2026-05-25', 'time' => '08:00', 'hall' => 'B6-Hall'],
                ['code' => 'CS421',   'date' => '2026-05-27', 'time' => '10:00', 'hall' => 'B6-Hall'],
                ['code' => 'CS433',   'date' => '2026-05-29', 'time' => '08:00', 'hall' => 'B6-Hall'],
                ['code' => 'CS311',   'date' => '2026-06-01', 'time' => '13:00', 'hall' => 'B6-Hall'],
                ['code' => 'ARAB301', 'date' => '2026-06-03', 'time' => '10:00', 'hall' => 'B2-Hall'],
            ],
            'ee' => [
                ['code' => 'EE320', 'date' => '2026-05-25', 'time' => '08:00', 'hall' => 'E4-Hall'],
                ['code' => 'EE340', 'date' => '2026-05-27', 'time' => '10:00', 'hall' => 'E4-Lab'],
                ['code' => 'EE360', 'date' => '2026-05-29', 'time' => '08:00', 'hall' => 'E4-Hall'],
                ['code' => 'EE380', 'date' => '2026-06-01', 'time' => '13:00', 'hall' => 'E4-Hall'],
            ],
        ][self::bundleKey($studentId)];
    }

    // ─── Per-major: grades (snapshot for previous semester) ──────────────

    public static function grades(string $studentId): array
    {
        return [
            'acct' => [
                ['course_code' => 'ACCT301', 'course_name' => 'محاسبة مالية متوسطة (1)', 'letter_grade' => 'A+', 'numeric_grade' => 96, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'ACCT311', 'course_name' => 'محاسبة التكاليف',         'letter_grade' => 'A',  'numeric_grade' => 92, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'BUSN330', 'course_name' => 'قانون تجاري',             'letter_grade' => 'A-', 'numeric_grade' => 89, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'STAT302', 'course_name' => 'إحصاء تطبيقي للأعمال',    'letter_grade' => 'A',  'numeric_grade' => 91, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'ISLM301', 'course_name' => 'أخلاقيات المهنة',         'letter_grade' => 'A',  'numeric_grade' => 94, 'semester' => '465', 'credit_hours' => 3],
            ],
            'cs' => [
                ['course_code' => 'CS202', 'course_name' => 'تصميم وتحليل الخوارزميات', 'letter_grade' => 'A',  'numeric_grade' => 93, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'CS301', 'course_name' => 'نظم التشغيل',             'letter_grade' => 'B+', 'numeric_grade' => 86, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'CS302', 'course_name' => 'قواعد البيانات',           'letter_grade' => 'A',  'numeric_grade' => 94, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'MATH301','course_name' => 'الجبر الخطي',             'letter_grade' => 'B',  'numeric_grade' => 81, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'ISLM301','course_name' => 'الثقافة الإسلامية ٣',     'letter_grade' => 'A',  'numeric_grade' => 95, 'semester' => '465', 'credit_hours' => 2],
            ],
            'ee' => [
                ['course_code' => 'EE220', 'course_name' => 'الدوائر الكهربائية (2)',  'letter_grade' => 'B+', 'numeric_grade' => 86, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'EE240', 'course_name' => 'الإلكترونيات (1)',         'letter_grade' => 'A',  'numeric_grade' => 93, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'EE260', 'course_name' => 'الإشارات والنظم',         'letter_grade' => 'B',  'numeric_grade' => 82, 'semester' => '465', 'credit_hours' => 3],
                ['course_code' => 'MATH301','course_name' => 'المعادلات التفاضلية',     'letter_grade' => 'A-', 'numeric_grade' => 89, 'semester' => '465', 'credit_hours' => 3],
            ],
        ][self::bundleKey($studentId)];
    }

    // ─── Per-major: absences (SPA AbsenceCourse shape) ───────────────────

    public static function absences(string $studentId): array
    {
        $rows = [];
        foreach (self::currentCourses($studentId) as $c) {
            $rows[] = self::absenceFor($c);
        }
        return $rows;
    }

    private static function absenceFor(array $c): array
    {
        // Deterministic absences per course so the same course always shows the
        // same numbers across reloads.
        $h = abs(crc32($c['course_code'])) % 100;
        $count = (int) floor($h / 30); // 0..3
        $allowed = 6;
        $percent = round($count / $allowed * 100, 1);
        $dates = [];
        $base = strtotime('2026-04-01');
        for ($i = 0; $i < $count; $i++) {
            $dates[] = [
                'absence_date'    => date('Y-m-d', $base + $i * 86400 * 6),
                'absence_excused' => $i === 0 ? 1 : 0,
            ];
        }
        return [
            'course_code'           => $c['course_code'],
            'cource_code'           => $c['course_code'],
            'course_name'           => $c['course_name'],
            'cource_name'           => $c['course_name'],
            'absence_count'         => $count,
            'allowed'               => $allowed,
            'absence_all_percent'   => $percent,
            'last_absence'          => $dates[$count - 1]['absence_date'] ?? null,
            'absences'              => $dates,
        ];
    }

    // ─── Per-major: semester history ─────────────────────────────────────

    public static function transactions(string $studentId): array
    {
        return [
            'acct' => self::txAccounting(),
            'cs'   => self::txComputerScience(),
            'ee'   => self::txElectricalEngineering(),
        ][self::bundleKey($studentId)];
    }

    private static function txAccounting(): array
    {
        return [
            ['semester' => '461', 'semester_gpa' => '4.45', 'total_credit_hours' => 15, 'courses' => [
                ['course_no' => 'ARAB101', 'course_code' => 'ARAB101', 'course_name' => 'المهارات اللغوية',    'course_name_s' => 'Arabic Language Skills', 'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ENGL101', 'course_code' => 'ENGL101', 'course_name' => 'اللغة الإنجليزية 1',  'course_name_s' => 'English I',              'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH101', 'course_code' => 'MATH101', 'course_name' => 'تفاضل وتكامل (1)',     'course_name_s' => 'Calculus I',             'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'BUSN101', 'course_code' => 'BUSN101', 'course_name' => 'مدخل إلى إدارة الأعمال','course_name_s' => 'Intro to Business',    'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM101', 'course_code' => 'ISLM101', 'course_name' => 'الثقافة الإسلامية',     'course_name_s' => 'Islamic Culture',        'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
            ]],
            ['semester' => '462', 'semester_gpa' => '4.21', 'total_credit_hours' => 16, 'courses' => [
                ['course_no' => 'STAT201', 'course_code' => 'STAT201', 'course_name' => 'مقدمة في الإحصاء',      'course_name_s' => 'Intro to Statistics',     'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ACCT201', 'course_code' => 'ACCT201', 'course_name' => 'مبادئ المحاسبة (1)',     'course_name_s' => 'Principles of Accounting I','crd_hrs'=> '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'MGMT220', 'course_code' => 'MGMT220', 'course_name' => 'مبادئ الإدارة',          'course_name_s' => 'Principles of Management','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ENGL102', 'course_code' => 'ENGL102', 'course_name' => 'اللغة الإنجليزية 2',     'course_name_s' => 'English II',              'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ARAB201', 'course_code' => 'ARAB201', 'course_name' => 'مهارات الكتابة',         'course_name_s' => 'Writing Skills',          'crd_hrs' => '4', 'letter_grade' => 'A-', 'quality_points' => '18.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '463', 'semester_gpa' => '4.50', 'total_credit_hours' => 18, 'courses' => [
                ['course_no' => 'ACCT202', 'course_code' => 'ACCT202', 'course_name' => 'مبادئ المحاسبة (2)',     'course_name_s' => 'Principles of Accounting II','crd_hrs'=> '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ECON201', 'course_code' => 'ECON201', 'course_name' => 'الاقتصاد الجزئي',         'course_name_s' => 'Microeconomics',           'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'BUSN221', 'course_code' => 'BUSN221', 'course_name' => 'الرياضيات المالية',       'course_name_s' => 'Financial Mathematics',    'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'MIS210',  'course_code' => 'MIS210',  'course_name' => 'تطبيقات الأعمال',         'course_name_s' => 'Business Applications',    'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ISLM201', 'course_code' => 'ISLM201', 'course_name' => 'النظام الاقتصادي الإسلامي','course_name_s' => 'Islamic Economics',        'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'COMM230', 'course_code' => 'COMM230', 'course_name' => 'مهارات الاتصال الفعّال',  'course_name_s' => 'Effective Communication',  'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '464', 'semester_gpa' => '4.30', 'total_credit_hours' => 18, 'courses' => [
                ['course_no' => 'ACCT220', 'course_code' => 'ACCT220', 'course_name' => 'المحاسبة الحكومية',       'course_name_s' => 'Governmental Accounting',  'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ECON202', 'course_code' => 'ECON202', 'course_name' => 'الاقتصاد الكلي',           'course_name_s' => 'Macroeconomics',           'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'FIN301',  'course_code' => 'FIN301',  'course_name' => 'الإدارة المالية',          'course_name_s' => 'Financial Management',     'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'MGMT301', 'course_code' => 'MGMT301', 'course_name' => 'إدارة الموارد البشرية',     'course_name_s' => 'Human Resource Management','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MKT301',  'course_code' => 'MKT301',  'course_name' => 'مبادئ التسويق',             'course_name_s' => 'Principles of Marketing',  'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ENGL201', 'course_code' => 'ENGL201', 'course_name' => 'إنجليزية مهنية',            'course_name_s' => 'Professional English',     'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
            ]],
            ['semester' => '465', 'semester_gpa' => '4.55', 'total_credit_hours' => 18, 'courses' => [
                ['course_no' => 'ACCT301', 'course_code' => 'ACCT301', 'course_name' => 'محاسبة مالية متوسطة (1)',  'course_name_s' => 'Intermediate Accounting I','crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ACCT311', 'course_code' => 'ACCT311', 'course_name' => 'محاسبة التكاليف',          'course_name_s' => 'Cost Accounting',          'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'BUSN330', 'course_code' => 'BUSN330', 'course_name' => 'قانون تجاري',              'course_name_s' => 'Business Law',             'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'STAT302', 'course_code' => 'STAT302', 'course_name' => 'إحصاء تطبيقي للأعمال',     'course_name_s' => 'Applied Business Statistics','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'BUSN320', 'course_code' => 'BUSN320', 'course_name' => 'نظم معلومات إدارية',        'course_name_s' => 'Management Information Systems','crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM301', 'course_code' => 'ISLM301', 'course_name' => 'أخلاقيات المهنة',          'course_name_s' => 'Professional Ethics',      'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
            ]],
        ];
    }

    private static function txComputerScience(): array
    {
        return [
            ['semester' => '461', 'semester_gpa' => '4.55', 'total_credit_hours' => 15, 'courses' => [
                ['course_no' => 'ARAB101', 'course_code' => 'ARAB101', 'course_name' => 'المهارات اللغوية',    'course_name_s' => 'Arabic Skills', 'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ENGL101', 'course_code' => 'ENGL101', 'course_name' => 'اللغة الإنجليزية 1',  'course_name_s' => 'English I',     'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH101', 'course_code' => 'MATH101', 'course_name' => 'تفاضل وتكامل (1)',     'course_name_s' => 'Calculus I',    'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'CS101',   'course_code' => 'CS101',   'course_name' => 'مقدمة في الحاسب',     'course_name_s' => 'Intro to CS',   'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'PHYS101', 'course_code' => 'PHYS101', 'course_name' => 'فيزياء عامة 1',        'course_name_s' => 'Physics I',     'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
            ]],
            ['semester' => '462', 'semester_gpa' => '4.60', 'total_credit_hours' => 16, 'courses' => [
                ['course_no' => 'CS111',   'course_code' => 'CS111',   'course_name' => 'برمجة (1)',           'course_name_s' => 'Programming I',  'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH102', 'course_code' => 'MATH102', 'course_name' => 'تفاضل وتكامل (2)',     'course_name_s' => 'Calculus II',    'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'STAT201', 'course_code' => 'STAT201', 'course_name' => 'الاحتمالات والإحصاء',  'course_name_s' => 'Probability & Stats','crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ENGL102', 'course_code' => 'ENGL102', 'course_name' => 'اللغة الإنجليزية 2',   'course_name_s' => 'English II',     'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM101', 'course_code' => 'ISLM101', 'course_name' => 'الثقافة الإسلامية',     'course_name_s' => 'Islamic Culture','crd_hrs' => '4', 'letter_grade' => 'A',  'quality_points' => '20.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '463', 'semester_gpa' => '4.65', 'total_credit_hours' => 17, 'courses' => [
                ['course_no' => 'CS201',   'course_code' => 'CS201',   'course_name' => 'هياكل البيانات',       'course_name_s' => 'Data Structures','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'CS211',   'course_code' => 'CS211',   'course_name' => 'برمجة (2)',           'course_name_s' => 'Programming II', 'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'MATH201', 'course_code' => 'MATH201', 'course_name' => 'رياضيات متقطعة',       'course_name_s' => 'Discrete Math',  'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'CS221',   'course_code' => 'CS221',   'course_name' => 'تنظيم الحاسب',         'course_name_s' => 'Computer Organization','crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'PHYS102', 'course_code' => 'PHYS102', 'course_name' => 'فيزياء عامة 2',         'course_name_s' => 'Physics II',     'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM201', 'course_code' => 'ISLM201', 'course_name' => 'الثقافة الإسلامية 2',   'course_name_s' => 'Islamic Culture II','crd_hrs' => '2', 'letter_grade' => 'A',  'quality_points' => '10.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '464', 'semester_gpa' => '4.45', 'total_credit_hours' => 16, 'courses' => [
                ['course_no' => 'CS202',   'course_code' => 'CS202',   'course_name' => 'تصميم وتحليل الخوارزميات','course_name_s' => 'Algorithms','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'CS301',   'course_code' => 'CS301',   'course_name' => 'نظم التشغيل',          'course_name_s' => 'Operating Systems','crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'CS302',   'course_code' => 'CS302',   'course_name' => 'قواعد البيانات',        'course_name_s' => 'Databases','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH301', 'course_code' => 'MATH301', 'course_name' => 'الجبر الخطي',          'course_name_s' => 'Linear Algebra','crd_hrs' => '3', 'letter_grade' => 'B',  'quality_points' => '12.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM301', 'course_code' => 'ISLM301', 'course_name' => 'الثقافة الإسلامية 3',   'course_name_s' => 'Islamic Culture III','crd_hrs' => '4', 'letter_grade' => 'A',  'quality_points' => '20.00', 'status_code' => 'passed'],
            ]],
        ];
    }

    private static function txElectricalEngineering(): array
    {
        return [
            ['semester' => '461', 'semester_gpa' => '4.10', 'total_credit_hours' => 15, 'courses' => [
                ['course_no' => 'MATH101', 'course_code' => 'MATH101', 'course_name' => 'تفاضل وتكامل (1)', 'course_name_s' => 'Calculus I',   'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'PHYS101', 'course_code' => 'PHYS101', 'course_name' => 'فيزياء عامة 1',     'course_name_s' => 'Physics I',    'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'CHEM101', 'course_code' => 'CHEM101', 'course_name' => 'كيمياء عامة',       'course_name_s' => 'General Chemistry','crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ENGL101', 'course_code' => 'ENGL101', 'course_name' => 'اللغة الإنجليزية 1', 'course_name_s' => 'English I',    'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ARAB101', 'course_code' => 'ARAB101', 'course_name' => 'المهارات اللغوية',   'course_name_s' => 'Arabic Skills', 'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '462', 'semester_gpa' => '3.85', 'total_credit_hours' => 16, 'courses' => [
                ['course_no' => 'MATH102', 'course_code' => 'MATH102', 'course_name' => 'تفاضل وتكامل (2)',  'course_name_s' => 'Calculus II',  'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'PHYS102', 'course_code' => 'PHYS102', 'course_name' => 'فيزياء عامة 2',      'course_name_s' => 'Physics II',   'crd_hrs' => '4', 'letter_grade' => 'B',  'quality_points' => '16.00', 'status_code' => 'passed'],
                ['course_no' => 'EE110',   'course_code' => 'EE110',   'course_name' => 'مدخل إلى الهندسة',  'course_name_s' => 'Intro to Engineering','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ENGL102', 'course_code' => 'ENGL102', 'course_name' => 'اللغة الإنجليزية 2', 'course_name_s' => 'English II',   'crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ISLM101', 'course_code' => 'ISLM101', 'course_name' => 'الثقافة الإسلامية',  'course_name_s' => 'Islamic Culture','crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '463', 'semester_gpa' => '4.05', 'total_credit_hours' => 17, 'courses' => [
                ['course_no' => 'EE210', 'course_code' => 'EE210', 'course_name' => 'الدوائر الكهربائية (1)', 'course_name_s' => 'Circuits I',     'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'CS101', 'course_code' => 'CS101', 'course_name' => 'مقدمة في الحاسب',       'course_name_s' => 'Intro to CS',    'crd_hrs' => '3', 'letter_grade' => 'A+', 'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH201', 'course_code' => 'MATH201', 'course_name' => 'تفاضل وتكامل (3)',  'course_name_s' => 'Calculus III',   'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'STAT201','course_code' => 'STAT201','course_name' => 'الاحتمالات والإحصاء', 'course_name_s' => 'Probability & Stats','crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ARAB201','course_code' => 'ARAB201','course_name' => 'مهارات الكتابة',      'course_name_s' => 'Writing Skills', 'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'ISLM201','course_code' => 'ISLM201','course_name' => 'الثقافة الإسلامية 2', 'course_name_s' => 'Islamic Culture II','crd_hrs' => '2', 'letter_grade' => 'A',  'quality_points' => '10.00', 'status_code' => 'passed'],
            ]],
            ['semester' => '464', 'semester_gpa' => '3.90', 'total_credit_hours' => 16, 'courses' => [
                ['course_no' => 'EE220', 'course_code' => 'EE220', 'course_name' => 'الدوائر الكهربائية (2)', 'course_name_s' => 'Circuits II',    'crd_hrs' => '3', 'letter_grade' => 'B+', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'EE240', 'course_code' => 'EE240', 'course_name' => 'الإلكترونيات (1)',       'course_name_s' => 'Electronics I',  'crd_hrs' => '3', 'letter_grade' => 'A',  'quality_points' => '15.00', 'status_code' => 'passed'],
                ['course_no' => 'EE260', 'course_code' => 'EE260', 'course_name' => 'الإشارات والنظم',        'course_name_s' => 'Signals & Systems','crd_hrs' => '3', 'letter_grade' => 'B',  'quality_points' => '12.00', 'status_code' => 'passed'],
                ['course_no' => 'MATH301','course_code' => 'MATH301','course_name' => 'المعادلات التفاضلية',  'course_name_s' => 'Differential Equations','crd_hrs' => '3', 'letter_grade' => 'A-', 'quality_points' => '13.50', 'status_code' => 'passed'],
                ['course_no' => 'ISLM301','course_code' => 'ISLM301','course_name' => 'الثقافة الإسلامية 3',  'course_name_s' => 'Islamic Culture III','crd_hrs' => '4', 'letter_grade' => 'A',  'quality_points' => '20.00', 'status_code' => 'passed'],
            ]],
        ];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/advisor */
    public static function advisor(string $studentId): array
    {
        return [
            'acct' => [
                'instructor_name' => 'د. عبدالعزيز محمد القحطاني',
                'work_email'      => 'a.qahtani@qu.edu.sa',
                'phone'           => '0163800123',
                'office'          => 'مبنى C2 - مكتب 142',
                'office_hours'    => 'الأحد والثلاثاء 10:00-12:00',
            ],
            'cs' => [
                'instructor_name' => 'د. سارة عبدالله القحطاني',
                'work_email'      => 's.qahtani@qu.edu.sa',
                'phone'           => '0163800234',
                'office'          => 'مبنى B6 - مكتب 318',
                'office_hours'    => 'الاثنين والأربعاء 11:00-13:00',
            ],
            'ee' => [
                'instructor_name' => 'د. عمر عبدالله السهلي',
                'work_email'      => 'o.alsuhli@qu.edu.sa',
                'phone'           => '0163800345',
                'office'          => 'مبنى E4 - مكتب 207',
                'office_hours'    => 'الأحد والأربعاء 9:00-11:00',
            ],
        ][self::bundleKey($studentId)];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/rewards */
    public static function rewards(string $studentId): array
    {
        $s = self::findStudent($studentId) ?? self::students()[0];
        $first = explode(' ', trim($s['name']))[0] ?? 'الطالب';
        return [
            ['title' => 'قائمة الشرف للفصل 461', 'points' => 100, 'awarded_at' => '2024-06-15'],
            ['title' => 'شارة المشاركة الطلابية',  'points' =>  50, 'awarded_at' => '2024-11-23'],
            ['title' => 'متفوق أكاديميًا — ' . $first, 'points' => 75, 'awarded_at' => '2025-02-10'],
        ];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/academic/calendar */
    public static function academicCalendar(): array
    {
        return [
            ['title' => 'بداية الفصل الدراسي 471', 'date' => '2026-08-23'],
            ['title' => 'فترة الحذف والإضافة',     'date' => '2026-08-30'],
            ['title' => 'بداية اختبارات منتصف الفصل','date' => '2026-10-12'],
            ['title' => 'إجازة منتصف الفصل',        'date' => '2026-11-09'],
            ['title' => 'بداية اختبارات نهاية الفصل','date' => '2026-12-14'],
        ];
    }

    /** Mimics: GET https://skill.qu.edu.sa/api/students/{id}/skills */
    public static function skills(string $studentId): array
    {
        $bundle = self::bundleKey($studentId);
        $tracks = [
            'acct' => [
                ['name' => 'معرض اليوم العالمي للمحاسبة',           'cat' => 'الأنشطة اللاصفية', 'hours' => 3],
                ['name' => 'ورشة تحليل البيانات بـ Power BI',       'cat' => 'التدريب والتطوير', 'hours' => 8],
                ['name' => 'التحول الرقمي في الخدمات المالية',     'cat' => 'التدريب والتطوير', 'hours' => 6],
                ['name' => 'إدارة القوائم المالية ومراجعي الحسابات','cat' => 'الأنشطة اللاصفية', 'hours' => 3],
            ],
            'cs' => [
                ['name' => 'هاكاثون QU للذكاء الاصطناعي',           'cat' => 'الأنشطة اللاصفية', 'hours' => 12],
                ['name' => 'ورشة تطوير الواجهات بـ React',          'cat' => 'التدريب والتطوير', 'hours' => 8],
                ['name' => 'دورة AWS Cloud Practitioner',          'cat' => 'التدريب والتطوير', 'hours' => 10],
                ['name' => 'منتدى ريادة الأعمال التقني',            'cat' => 'الأنشطة اللاصفية', 'hours' => 4],
            ],
            'ee' => [
                ['name' => 'ورشة تصميم لوحات PCB',                  'cat' => 'التدريب والتطوير', 'hours' => 8],
                ['name' => 'مسابقة الروبوتات السنوية',              'cat' => 'الأنشطة اللاصفية', 'hours' => 6],
                ['name' => 'مختبر ESP32 والإنترنت الأشياء',          'cat' => 'التدريب والتطوير', 'hours' => 10],
            ],
        ][$bundle];

        $latest = []; $mid = []; $old = [];
        $now = strtotime('2025-12-01');
        foreach ($tracks as $i => $t) {
            $row = [
                'skill_name'    => $t['name'],
                'category_name' => $t['cat'],
                'skill_type'    => 'حكومية',
                'source'        => 'عمادة شؤون الطلاب',
                'approved_at'   => date('Y-m-d', $now - $i * 86400 * 30),
                'hours'         => $t['hours'],
                'status'        => 'accepted',
            ];
            if ($i < 2) $latest[] = $row;
            elseif ($i < 4) $mid[] = $row;
            else $old[] = $row;
        }
        return ['data' => ['data' => ['semesters' => array_values(array_filter([
            ['semester_name' => 'الفصل الدراسي 471', 'skills' => $latest],
            ['semester_name' => 'الفصل الدراسي 463', 'skills' => $mid],
            ['semester_name' => 'الفصل الدراسي 462', 'skills' => $old],
        ], fn ($g) => !empty($g['skills']))) ]]];
    }

    /** Mimics: pre-computed labor-market alignment that OpenAI used to generate. */
    public static function marketAnalysis(string $studentId): array
    {
        return [
            'acct' => self::marketAnalysisAcct(),
            'cs'   => self::marketAnalysisCS(),
            'ee'   => self::marketAnalysisEE(),
        ][self::bundleKey($studentId)];
    }

    private static function marketAnalysisAcct(): array
    {
        return [
            'market_skills' => [
                ['skill' => 'تحليل البيانات المالية',  'weight' => 95, 'matched' => true],
                ['skill' => 'إعداد التقارير المالية',  'weight' => 92, 'matched' => true],
                ['skill' => 'Excel متقدم',              'weight' => 90, 'matched' => true],
                ['skill' => 'Power BI',                 'weight' => 85, 'matched' => false],
                ['skill' => 'SAP / ERP',                'weight' => 82, 'matched' => false],
                ['skill' => 'IFRS',                     'weight' => 78, 'matched' => true],
                ['skill' => 'لغة إنجليزية مهنية',       'weight' => 75, 'matched' => true],
                ['skill' => 'مراجعة داخلية',            'weight' => 70, 'matched' => false],
                ['skill' => 'Python للمحللين',         'weight' => 68, 'matched' => false],
                ['skill' => 'إدارة المشاريع',           'weight' => 60, 'matched' => true],
            ],
            'gap_skills' => [
                ['skill' => 'Power BI',        'weight' => 85],
                ['skill' => 'SAP / ERP',        'weight' => 82],
                ['skill' => 'مراجعة داخلية',    'weight' => 70],
                ['skill' => 'Python للمحللين', 'weight' => 68],
                ['skill' => 'حوكمة البيانات',  'weight' => 55],
            ],
            'recommendations' => [
                'سجّل دورة Power BI في QSpark خلال الفصل القادم.',
                'تطوع بمشروع تحليل بيانات صغير في الجامعة لتوثيق الخبرة.',
                'احصل على شهادة مهنية في IFRS لدعم سيرتك الذاتية.',
            ],
            'live_data' => ['jobs_count' => 312, 'courses_count' => 84, 'sources' => ['LinkedIn', 'Bayt', 'Coursera'], 'last_synced' => '2026-05-12 03:14'],
            'summary' => 'سجلّك يُظهر توافقاً جيداً مع متطلبات سوق العمل في تخصص المحاسبة (60%)، مع فجوات في Power BI و SAP/ERP و Python.',
            'courses' => [
                ['title' => 'Microsoft Power BI for Business', 'platform' => 'Coursera', 'why' => 'يسدّ أعلى فجوة (Power BI · وزن 85).', 'url' => 'https://www.coursera.org/search?query=power+bi', 'live' => true],
                ['title' => 'SAP S/4HANA Financial Accounting', 'platform' => 'Udemy', 'why' => 'مهارة ERP مطلوبة بقوة (وزن 82).',       'url' => 'https://www.udemy.com/topic/sap/', 'live' => true],
                ['title' => 'Python for Financial Analysts',    'platform' => 'edX', 'why' => 'يدعم التحليل الكمي وأتمتة التقارير.',     'url' => 'https://www.edx.org/search?q=python+finance', 'live' => true],
            ],
        ];
    }

    private static function marketAnalysisCS(): array
    {
        return [
            'market_skills' => [
                ['skill' => 'Python',               'weight' => 95, 'matched' => true],
                ['skill' => 'الذكاء الاصطناعي',     'weight' => 92, 'matched' => true],
                ['skill' => 'تطوير الويب — React',   'weight' => 90, 'matched' => true],
                ['skill' => 'AWS / السحابة',         'weight' => 88, 'matched' => false],
                ['skill' => 'هياكل البيانات',        'weight' => 85, 'matched' => true],
                ['skill' => 'DevOps / CI/CD',        'weight' => 78, 'matched' => false],
                ['skill' => 'تحليل البيانات',        'weight' => 76, 'matched' => true],
                ['skill' => 'Kubernetes',            'weight' => 68, 'matched' => false],
                ['skill' => 'الأمن السيبراني',      'weight' => 65, 'matched' => false],
                ['skill' => 'SQL',                   'weight' => 60, 'matched' => true],
            ],
            'gap_skills' => [
                ['skill' => 'AWS / السحابة',  'weight' => 88],
                ['skill' => 'DevOps / CI/CD', 'weight' => 78],
                ['skill' => 'Kubernetes',     'weight' => 68],
                ['skill' => 'الأمن السيبراني', 'weight' => 65],
                ['skill' => 'GraphQL',        'weight' => 50],
            ],
            'recommendations' => [
                'احصل على شهادة AWS Cloud Practitioner.',
                'ساهم في مشروع مفتوح المصدر على GitHub.',
                'أكمل مسار DevOps في QSpark.',
            ],
            'live_data' => ['jobs_count' => 528, 'courses_count' => 142, 'sources' => ['LinkedIn', 'Stack Overflow', 'Coursera'], 'last_synced' => '2026-05-12 03:14'],
            'summary' => 'سجلّك متين في علوم الحاسب (65%)، مع فجوات في السحابة و DevOps والأمن السيبراني — مهارات مطلوبة جداً في السوق السعودي.',
            'courses' => [
                ['title' => 'AWS Certified Cloud Practitioner', 'platform' => 'AWS Training', 'why' => 'أقوى فجوة مهارية في السوق.', 'url' => 'https://aws.amazon.com/training/', 'live' => true],
                ['title' => 'Docker & Kubernetes — DevOps Path','platform' => 'Coursera',     'why' => 'يفتح أبواب وظائف SRE/DevOps.','url' => 'https://www.coursera.org/search?query=kubernetes', 'live' => true],
                ['title' => 'Cybersecurity Fundamentals',       'platform' => 'edX',          'why' => 'متطلب توظيف نامٍ بسرعة في القطاعين العام والخاص.', 'url' => 'https://www.edx.org/search?q=cybersecurity', 'live' => true],
            ],
        ];
    }

    private static function marketAnalysisEE(): array
    {
        return [
            'market_skills' => [
                ['skill' => 'MATLAB / Simulink',     'weight' => 92, 'matched' => true],
                ['skill' => 'أنظمة القوى',           'weight' => 88, 'matched' => true],
                ['skill' => 'إنترنت الأشياء IoT',     'weight' => 85, 'matched' => true],
                ['skill' => 'PLC والأتمتة الصناعية',  'weight' => 82, 'matched' => false],
                ['skill' => 'الإلكترونيات الرقمية',    'weight' => 80, 'matched' => true],
                ['skill' => 'مصادر الطاقة المتجددة',  'weight' => 75, 'matched' => false],
                ['skill' => 'Python للهندسة',         'weight' => 68, 'matched' => false],
                ['skill' => 'تصميم PCB',              'weight' => 65, 'matched' => true],
                ['skill' => 'الذكاء الاصطناعي للأنظمة','weight' => 60, 'matched' => false],
            ],
            'gap_skills' => [
                ['skill' => 'PLC والأتمتة الصناعية', 'weight' => 82],
                ['skill' => 'مصادر الطاقة المتجددة', 'weight' => 75],
                ['skill' => 'Python للهندسة',        'weight' => 68],
                ['skill' => 'الذكاء الاصطناعي للأنظمة','weight' => 60],
            ],
            'recommendations' => [
                'أكمل مسار PLC في QSpark.',
                'سجل في دورة الطاقة المتجددة المتقدمة.',
                'تعلم Python لتطبيقات الهندسة.',
            ],
            'live_data' => ['jobs_count' => 240, 'courses_count' => 72, 'sources' => ['LinkedIn', 'Bayt', 'Coursera'], 'last_synced' => '2026-05-12 03:14'],
            'summary' => 'سجلّك متوازن في الهندسة الكهربائية (62%)، مع فجوات في الأتمتة الصناعية ومصادر الطاقة المتجددة — مجالات متنامية في رؤية 2030.',
            'courses' => [
                ['title' => 'PLC Programming Fundamentals',  'platform' => 'Udemy',   'why' => 'يسدّ أعلى فجوة (وزن 82).',                'url' => 'https://www.udemy.com/topic/plc/', 'live' => true],
                ['title' => 'Renewable Energy Systems',      'platform' => 'Coursera','why' => 'مجال نامٍ بسرعة في السعودية.',           'url' => 'https://www.coursera.org/search?query=renewable+energy', 'live' => true],
                ['title' => 'Python for Engineers',          'platform' => 'edX',     'why' => 'يدعم أتمتة الحسابات وتحليل البيانات.', 'url' => 'https://www.edx.org/search?q=python+engineers', 'live' => true],
            ],
        ];
    }

    /** Top courses ranked by labor-market relevance — used by Digital Record. */
    public static function topCourses(string $studentId): array
    {
        return [
            'acct' => [
                ['course_code' => 'ACCT301', 'course_name' => 'محاسبة مالية متوسطة (1)', 'letter_grade' => 'A+','relevance' => 95],
                ['course_code' => 'ACCT311', 'course_name' => 'محاسبة التكاليف',         'letter_grade' => 'A', 'relevance' => 88],
                ['course_code' => 'BUSN320', 'course_name' => 'نظم معلومات إدارية',      'letter_grade' => 'A+','relevance' => 80],
                ['course_code' => 'STAT302', 'course_name' => 'إحصاء تطبيقي للأعمال',    'letter_grade' => 'A', 'relevance' => 75],
                ['course_code' => 'FIN301',  'course_name' => 'الإدارة المالية',         'letter_grade' => 'A-','relevance' => 65],
                ['course_code' => 'ECON201', 'course_name' => 'الاقتصاد الجزئي',         'letter_grade' => 'A+','relevance' => 40],
            ],
            'cs' => [
                ['course_code' => 'CS302', 'course_name' => 'قواعد البيانات',            'letter_grade' => 'A', 'relevance' => 95],
                ['course_code' => 'CS202', 'course_name' => 'تصميم وتحليل الخوارزميات',  'letter_grade' => 'A', 'relevance' => 90],
                ['course_code' => 'CS301', 'course_name' => 'نظم التشغيل',              'letter_grade' => 'B+','relevance' => 80],
                ['course_code' => 'CS221', 'course_name' => 'تنظيم الحاسب',              'letter_grade' => 'B+','relevance' => 72],
                ['course_code' => 'STAT201','course_name' => 'الاحتمالات والإحصاء',      'letter_grade' => 'A-','relevance' => 65],
                ['course_code' => 'MATH301','course_name' => 'الجبر الخطي',              'letter_grade' => 'B', 'relevance' => 55],
            ],
            'ee' => [
                ['course_code' => 'EE240', 'course_name' => 'الإلكترونيات (1)',          'letter_grade' => 'A', 'relevance' => 95],
                ['course_code' => 'EE220', 'course_name' => 'الدوائر الكهربائية (2)',    'letter_grade' => 'B+','relevance' => 88],
                ['course_code' => 'EE260', 'course_name' => 'الإشارات والنظم',           'letter_grade' => 'B', 'relevance' => 78],
                ['course_code' => 'MATH301','course_name' => 'المعادلات التفاضلية',      'letter_grade' => 'A-','relevance' => 60],
                ['course_code' => 'PHYS102','course_name' => 'فيزياء عامة 2',            'letter_grade' => 'B', 'relevance' => 50],
            ],
        ][self::bundleKey($studentId)];
    }

    /** Aggregate count for Digital Record's totals chip. */
    public static function skillsCount(string $studentId): array
    {
        $semesters = self::skills($studentId)['data']['data']['semesters'] ?? [];
        $hours = 0; $count = 0;
        foreach ($semesters as $sem) {
            foreach (($sem['skills'] ?? []) as $sk) {
                $hours += (int) ($sk['hours'] ?? 0);
                $count++;
            }
        }
        return ['data' => ['data' => ['total_hours' => $hours, 'total_skills' => $count]]];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/academic/announcements */
    public static function announcements(string $studentId): array
    {
        $courses = self::currentCourses($studentId);
        $sample = $courses[1]['course_code'] ?? 'COURSE';
        return [
            ['title' => 'تأجيل اختبار ' . $sample . ' إلى الأسبوع القادم', 'date' => '2026-04-30', 'source' => 'البلاك بورد'],
            ['title' => 'فتح باب التسجيل للفصل القادم',                     'date' => '2026-04-28', 'source' => 'البلاك بورد'],
            ['title' => 'محاضرة عن مهارات السيرة الذاتية',                  'date' => '2026-04-25', 'source' => 'البلاك بورد'],
        ];
    }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/students/{id}/warnings */
    public static function warnings(string $studentId): array
    {
        return [];
    }

    // ─── Academic plan (per-major; SPA mapApiToCourses/mapPlanToElectives shape)

    /**
     * Per-major academic plan in the QU api v1 shape. Each row carries:
     *   course_code, course_name, course_name_s, crd_hrs, category_code,
     *   category_code_desc, group_type ('1' = required, otherwise elective),
     *   status ('passed' | 'student_schedule' | 'remaining'),
     *   level (1..8) so mapApiToCourses produces { planSemester: level }.
     */
    public static function academicPlanCourses(string $studentId): array
    {
        return self::planCoursesByBundle()[self::bundleKey($studentId)];
    }

    private static function planCoursesByBundle(): array
    {
        // category_code_desc keys are matched verbatim in the SPA's categoryMap.
        $uni = 'متطلبات جامعة';
        $col = 'متطلبات كلية';
        $maj = 'متطلبات تخصص';
        $eMaj = 'اختيارية تخصص';
        $eFr  = 'اختيارية حرة';

        return [
            'acct' => array_merge(
                self::planRow('ARAB101', 'المهارات اللغوية', 'Arabic Language Skills', 3, $uni, '1', 'passed', 1),
                self::planRow('ENGL101', 'اللغة الإنجليزية 1', 'English I', 3, $uni, '1', 'passed', 1),
                self::planRow('ISLM101', 'الثقافة الإسلامية', 'Islamic Culture', 3, $uni, '1', 'passed', 1),
                self::planRow('MATH101', 'تفاضل وتكامل (1)', 'Calculus I', 3, $col, '1', 'passed', 1),
                self::planRow('BUSN101', 'مدخل إلى إدارة الأعمال', 'Intro to Business', 3, $col, '1', 'passed', 1),

                self::planRow('STAT201', 'مقدمة في الإحصاء', 'Intro to Statistics', 3, $col, '1', 'passed', 2),
                self::planRow('ACCT201', 'مبادئ المحاسبة (1)', 'Principles of Accounting I', 3, $maj, '1', 'passed', 2),
                self::planRow('MGMT220', 'مبادئ الإدارة', 'Principles of Management', 3, $col, '1', 'passed', 2),
                self::planRow('ENGL102', 'اللغة الإنجليزية 2', 'English II', 3, $uni, '1', 'passed', 2),
                self::planRow('ARAB201', 'مهارات الكتابة', 'Writing Skills', 4, $uni, '1', 'passed', 2),

                self::planRow('ACCT202', 'مبادئ المحاسبة (2)', 'Principles of Accounting II', 3, $maj, '1', 'passed', 3),
                self::planRow('ECON201', 'الاقتصاد الجزئي', 'Microeconomics', 3, $col, '1', 'passed', 3),
                self::planRow('BUSN221', 'الرياضيات المالية', 'Financial Mathematics', 3, $col, '1', 'passed', 3),
                self::planRow('MIS210',  'تطبيقات الأعمال', 'Business Applications', 3, $col, '1', 'passed', 3),
                self::planRow('ISLM201', 'النظام الاقتصادي الإسلامي', 'Islamic Economics', 3, $uni, '1', 'passed', 3),
                self::planRow('COMM230', 'مهارات الاتصال', 'Communication Skills', 3, $uni, '1', 'passed', 3),

                self::planRow('ACCT220', 'المحاسبة الحكومية', 'Governmental Accounting', 3, $maj, '1', 'passed', 4),
                self::planRow('ECON202', 'الاقتصاد الكلي', 'Macroeconomics', 3, $col, '1', 'passed', 4),
                self::planRow('FIN301',  'الإدارة المالية', 'Financial Management', 3, $col, '1', 'passed', 4),
                self::planRow('MGMT301', 'إدارة الموارد البشرية', 'HR Management', 3, $col, '1', 'passed', 4),
                self::planRow('MKT301',  'مبادئ التسويق', 'Principles of Marketing', 3, $col, '1', 'passed', 4),
                self::planRow('ENGL201', 'إنجليزية مهنية', 'Professional English', 3, $uni, '1', 'passed', 4),

                self::planRow('ACCT301', 'محاسبة مالية متوسطة (1)', 'Intermediate Accounting I', 3, $maj, '1', 'passed', 5),
                self::planRow('ACCT311', 'محاسبة التكاليف', 'Cost Accounting', 3, $maj, '1', 'passed', 5),
                self::planRow('BUSN330', 'قانون تجاري', 'Business Law', 3, $col, '1', 'passed', 5),
                self::planRow('STAT302', 'إحصاء تطبيقي للأعمال', 'Applied Business Statistics', 3, $col, '1', 'passed', 5),
                self::planRow('BUSN320', 'نظم معلومات إدارية', 'Management Information Systems', 3, $col, '1', 'passed', 5),
                self::planRow('ISLM301', 'أخلاقيات المهنة', 'Professional Ethics', 3, $uni, '1', 'passed', 5),

                self::planRow('ACCT401', 'محاسبة مالية متقدمة', 'Advanced Financial Accounting', 3, $maj, '1', 'student_schedule', 6),
                self::planRow('ACCT421', 'المراجعة والتدقيق', 'Auditing', 3, $maj, '1', 'student_schedule', 6),
                self::planRow('FIN401',  'الإدارة المالية المتقدمة', 'Advanced Financial Management', 3, $col, '1', 'student_schedule', 6),
                self::planRow('TAX410',  'المحاسبة الضريبية', 'Tax Accounting', 3, $maj, '1', 'student_schedule', 6),
                self::planRow('BUSN320', 'نظم معلومات إدارية', 'Management Information Systems', 3, $col, '1', 'student_schedule', 6),

                self::planRow('ACCT431', 'محاسبة دولية', 'International Accounting', 3, $maj, '1', 'remaining', 7),
                self::planRow('ACCT499', 'التدريب التعاوني', 'Co-op Training', 6, $maj, '1', 'remaining', 7),
                self::planRow('ACCT451', 'محاسبة الشركات', 'Corporate Accounting', 3, $eMaj, '2', 'remaining', 7),
                self::planRow('ACCT460', 'تحليل القوائم المالية', 'Financial Statement Analysis', 3, $eMaj, '2', 'remaining', 7),

                self::planRow('ACCT490', 'موضوعات مختارة في المحاسبة', 'Selected Topics in Accounting', 3, $eMaj, '2', 'remaining', 8),
                self::planRow('MIS401',  'تحليل البيانات بـ Power BI', 'Data Analytics with Power BI', 3, $eMaj, '2', 'remaining', 8),
                self::planRow('ENT320',  'ريادة الأعمال', 'Entrepreneurship', 2, $eFr,  '3', 'remaining', 8),
                self::planRow('FIN410',  'إدارة الاستثمار', 'Investment Management', 3, $eFr,  '3', 'remaining', 8),
            ),
            'cs' => array_merge(
                self::planRow('ARAB101', 'المهارات اللغوية', 'Arabic Skills', 3, $uni, '1', 'passed', 1),
                self::planRow('ENGL101', 'اللغة الإنجليزية 1', 'English I', 3, $uni, '1', 'passed', 1),
                self::planRow('MATH101', 'تفاضل وتكامل (1)', 'Calculus I', 3, $col, '1', 'passed', 1),
                self::planRow('CS101',   'مقدمة في الحاسب', 'Intro to Computing', 3, $maj, '1', 'passed', 1),
                self::planRow('PHYS101', 'فيزياء عامة', 'General Physics', 3, $col, '1', 'passed', 1),

                self::planRow('ISLM101', 'الثقافة الإسلامية', 'Islamic Culture', 2, $uni, '1', 'passed', 2),
                self::planRow('ENGL102', 'اللغة الإنجليزية 2', 'English II', 3, $uni, '1', 'passed', 2),
                self::planRow('MATH102', 'تفاضل وتكامل (2)', 'Calculus II', 3, $col, '1', 'passed', 2),
                self::planRow('CS111',   'برمجة (1)', 'Programming I', 3, $maj, '1', 'passed', 2),
                self::planRow('STAT201', 'الاحتمالات والإحصاء', 'Probability & Statistics', 3, $col, '1', 'passed', 2),

                self::planRow('ISLM201', 'الثقافة الإسلامية 2', 'Islamic Culture II', 2, $uni, '1', 'passed', 3),
                self::planRow('CS211',   'برمجة (2)', 'Programming II', 3, $maj, '1', 'passed', 3),
                self::planRow('CS201',   'هياكل البيانات', 'Data Structures', 3, $maj, '1', 'passed', 3),
                self::planRow('MATH201', 'رياضيات متقطعة', 'Discrete Math', 3, $col, '1', 'passed', 3),
                self::planRow('CS221',   'تنظيم الحاسب', 'Computer Organization', 3, $maj, '1', 'passed', 3),

                self::planRow('ISLM301', 'الثقافة الإسلامية 3', 'Islamic Culture III', 2, $uni, '1', 'passed', 4),
                self::planRow('CS202',   'تصميم وتحليل الخوارزميات', 'Algorithms', 3, $maj, '1', 'passed', 4),
                self::planRow('CS301',   'نظم التشغيل', 'Operating Systems', 3, $maj, '1', 'passed', 4),
                self::planRow('CS302',   'قواعد البيانات', 'Databases', 3, $maj, '1', 'passed', 4),
                self::planRow('MATH301', 'الجبر الخطي', 'Linear Algebra', 3, $col, '1', 'passed', 4),

                self::planRow('CS401',   'هندسة البرمجيات', 'Software Engineering', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('CS421',   'الذكاء الاصطناعي', 'Artificial Intelligence', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('CS433',   'شبكات الحاسب', 'Computer Networks', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('CS311',   'نظرية الحوسبة', 'Theory of Computation', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('ARAB301', 'الكتابة والتعبير', 'Arabic Writing', 2, $uni, '1', 'student_schedule', 5),

                self::planRow('CS450',   'مشروع التخرج (1)', 'Senior Project I', 3, $maj, '1', 'remaining', 6),
                self::planRow('CS461',   'أمن المعلومات', 'Information Security', 3, $maj, '1', 'remaining', 6),
                self::planRow('CS442',   'الحوسبة السحابية', 'Cloud Computing', 3, $eMaj, '2', 'remaining', 6),
                self::planRow('CS472',   'تعلم الآلة', 'Machine Learning', 3, $eMaj, '2', 'remaining', 6),
                self::planRow('ISLM401', 'الثقافة الإسلامية 4', 'Islamic Culture IV', 2, $uni, '1', 'remaining', 6),

                self::planRow('CS451',   'مشروع التخرج (2)', 'Senior Project II', 3, $maj, '1', 'remaining', 7),
                self::planRow('CS481',   'التدريب التعاوني', 'Co-op Training', 6, $maj, '1', 'remaining', 7),
                self::planRow('CS473',   'التعلم العميق', 'Deep Learning', 3, $eMaj, '2', 'remaining', 7),

                self::planRow('CS490',   'موضوعات مختارة', 'Selected Topics in CS', 3, $eMaj, '2', 'remaining', 8),
                self::planRow('CS482',   'ريادة الأعمال التقنية', 'Tech Entrepreneurship', 2, $eFr, '3', 'remaining', 8),
                self::planRow('CS443',   'إنترنت الأشياء', 'Internet of Things', 3, $eMaj, '2', 'remaining', 8),
                self::planRow('MGT301',  'مبادئ الإدارة', 'Principles of Management', 3, $eFr, '3', 'remaining', 8),
            ),
            'ee' => array_merge(
                self::planRow('MATH101', 'تفاضل وتكامل (1)', 'Calculus I', 3, $col, '1', 'passed', 1),
                self::planRow('PHYS101', 'فيزياء عامة 1', 'Physics I', 3, $col, '1', 'passed', 1),
                self::planRow('CHEM101', 'كيمياء عامة', 'General Chemistry', 3, $col, '1', 'passed', 1),
                self::planRow('ENGL101', 'اللغة الإنجليزية 1', 'English I', 3, $uni, '1', 'passed', 1),
                self::planRow('ARAB101', 'المهارات اللغوية', 'Arabic Skills', 3, $uni, '1', 'passed', 1),

                self::planRow('MATH102', 'تفاضل وتكامل (2)', 'Calculus II', 3, $col, '1', 'passed', 2),
                self::planRow('PHYS102', 'فيزياء عامة 2', 'Physics II', 4, $col, '1', 'passed', 2),
                self::planRow('EE110',   'مدخل إلى الهندسة', 'Intro to Engineering', 3, $maj, '1', 'passed', 2),
                self::planRow('ENGL102', 'اللغة الإنجليزية 2', 'English II', 3, $uni, '1', 'passed', 2),
                self::planRow('ISLM101', 'الثقافة الإسلامية', 'Islamic Culture', 3, $uni, '1', 'passed', 2),

                self::planRow('EE210',   'الدوائر الكهربائية (1)', 'Circuits I', 3, $maj, '1', 'passed', 3),
                self::planRow('CS101',   'مقدمة في الحاسب', 'Intro to CS', 3, $col, '1', 'passed', 3),
                self::planRow('MATH201', 'تفاضل وتكامل (3)', 'Calculus III', 3, $col, '1', 'passed', 3),
                self::planRow('STAT201', 'الاحتمالات والإحصاء', 'Probability & Statistics', 3, $col, '1', 'passed', 3),
                self::planRow('ARAB201', 'مهارات الكتابة', 'Writing Skills', 3, $uni, '1', 'passed', 3),
                self::planRow('ISLM201', 'الثقافة الإسلامية 2', 'Islamic Culture II', 2, $uni, '1', 'passed', 3),

                self::planRow('EE220',   'الدوائر الكهربائية (2)', 'Circuits II', 3, $maj, '1', 'passed', 4),
                self::planRow('EE240',   'الإلكترونيات (1)', 'Electronics I', 3, $maj, '1', 'passed', 4),
                self::planRow('EE260',   'الإشارات والنظم', 'Signals & Systems', 3, $maj, '1', 'passed', 4),
                self::planRow('MATH301', 'المعادلات التفاضلية', 'Differential Equations', 3, $col, '1', 'passed', 4),
                self::planRow('ISLM301', 'الثقافة الإسلامية 3', 'Islamic Culture III', 4, $uni, '1', 'passed', 4),

                self::planRow('EE320',   'أنظمة القوى الكهربائية', 'Power Systems', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('EE340',   'الإلكترونيات الرقمية', 'Digital Electronics', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('EE360',   'نظرية التحكم', 'Control Theory', 3, $maj, '1', 'student_schedule', 5),
                self::planRow('EE380',   'الاتصالات التماثلية', 'Analog Communications', 3, $maj, '1', 'student_schedule', 5),

                self::planRow('EE420',   'أنظمة القوى المتقدمة', 'Advanced Power Systems', 3, $maj, '1', 'remaining', 6),
                self::planRow('EE450',   'مشروع التخرج', 'Senior Project', 3, $maj, '1', 'remaining', 6),
                self::planRow('EE470',   'الطاقة المتجددة', 'Renewable Energy', 3, $eMaj, '2', 'remaining', 6),
                self::planRow('EE480',   'PLC والأتمتة الصناعية', 'PLC & Industrial Automation', 3, $eMaj, '2', 'remaining', 6),
                self::planRow('ISLM401', 'الثقافة الإسلامية 4', 'Islamic Culture IV', 2, $uni, '1', 'remaining', 6),

                self::planRow('EE499',   'التدريب التعاوني', 'Co-op Training', 6, $maj, '1', 'remaining', 7),
                self::planRow('EE475',   'إنترنت الأشياء', 'IoT', 3, $eMaj, '2', 'remaining', 7),
                self::planRow('EE490',   'موضوعات مختارة', 'Selected Topics in EE', 3, $eMaj, '2', 'remaining', 8),
                self::planRow('ENT320',  'ريادة الأعمال', 'Entrepreneurship', 2, $eFr, '3', 'remaining', 8),
            ),
        ];
    }

    private static function planRow(string $code, string $nameAr, string $nameEn, int $hours, string $cat, string $group, string $status, int $level): array
    {
        return [[
            'course_no'          => $code,
            'course_code'        => $code,
            'course_name'        => $nameAr,
            'course_name_s'      => $nameEn,
            'crd_hrs'            => (string) $hours,
            'category_code'      => $cat === 'متطلبات جامعة' ? '01' : ($cat === 'متطلبات كلية' ? '02' : ($cat === 'متطلبات تخصص' ? '03' : ($cat === 'اختيارية تخصص' ? '04' : '05'))),
            'category_code_desc' => $cat,
            'group_type'         => $group,
            'group_type_desc'    => $group === '1' ? 'إلزامي' : 'اختياري',
            'status'             => $status,
            'level'              => $level,
        ]];
    }

    /** Build the QU v2-style `{ levels: [{ id, title, details: [...] }] }` shape. */
    public static function academicPlanLevels(string $studentId): array
    {
        $rows = self::academicPlanCourses($studentId);
        $byLevel = [];
        foreach ($rows as $r) {
            $lvl = (int) ($r['level'] ?? 0);
            if (!isset($byLevel[$lvl])) {
                $byLevel[$lvl] = ['id' => $lvl, 'title' => 'المستوى ' . $lvl, 'details' => []];
            }
            $byLevel[$lvl]['details'][] = [
                'code'     => $r['course_code'],
                'title'    => $r['course_name'],
                'title_s'  => $r['course_name_s'],
                'hours'    => (int) $r['crd_hrs'],
                'status'   => $r['status'],
                'category' => $r['category_code_desc'],
                'group'    => $r['group_type'],
            ];
        }
        ksort($byLevel);
        return ['levels' => array_values($byLevel)];
    }

    /** Build the `summary` block the StudyPlan banner consumes. */
    public static function academicPlanSummary(string $studentId): array
    {
        $rows = self::academicPlanCourses($studentId);
        $totalHours = 0;
        $required = 0; $electives = 0;
        $byCategory = ['متطلبات جامعة' => 0, 'متطلبات كلية' => 0, 'متطلبات تخصص' => 0];
        foreach ($rows as $r) {
            $h = (int) $r['crd_hrs'];
            $totalHours += $h;
            if ($r['group_type'] === '1') $required += $h; else $electives += $h;
            if (isset($byCategory[$r['category_code_desc']])) {
                $byCategory[$r['category_code_desc']] += $h;
            }
        }
        return [
            'total_hours'                     => $totalHours,
            'required_hours'                  => $required,
            'elective_hours'                  => $electives,
            'university_requirements_hours'   => $byCategory['متطلبات جامعة'],
            'department_required_hours'       => $byCategory['متطلبات كلية'],
            'major_required_hours'            => $byCategory['متطلبات تخصص'],
        ];
    }

    /** Build a per-major "available next semester" list in the SPA's AvailableCourse shape. */
    public static function availableCoursesForRegistration(string $studentId): array
    {
        $bundle = self::bundleKey($studentId);
        // Pick the next available rows from the plan (status === 'remaining').
        $rows = array_values(array_filter(self::academicPlanCourses($studentId), fn ($r) => $r['status'] === 'remaining'));
        $rows = array_slice($rows, 0, 7);

        $defaults = [
            'acct' => [
                'instructors' => ['د. عبدالله سعد القحطاني', 'د. خالد عبدالله العتيبي', 'د. منى عبدالعزيز السهلي'],
                'rooms'       => ['C2-105', 'C2-204', 'C1-310', 'C2-118', 'C3-401'],
            ],
            'cs' => [
                'instructors' => ['د. سارة عبدالله القحطاني', 'د. عبدالله ناصر العتيبي', 'د. فهد عبدالعزيز العنزي'],
                'rooms'       => ['B6-201', 'B6-304', 'B6-220', 'B6-118', 'B2-110'],
            ],
            'ee' => [
                'instructors' => ['د. عمر عبدالله السهلي', 'د. فهد عبدالعزيز السهلي', 'د. خالد عبدالله العنزي'],
                'rooms'       => ['E4-201', 'E4-Lab-3', 'E4-220', 'E4-310'],
            ],
        ][$bundle];

        $out = [];
        $schedules = ['أحد-ثلاثاء ٨:٠٠-٩:٣٠', 'اثنين-أربعاء ١٠:٠٠-١١:٣٠', 'اثنين-أربعاء ١٢:٠٠-١:٣٠', 'أحد-ثلاثاء ٢:٠٠-٣:٣٠', 'أربعاء ١٠:٠٠-١٢:٠٠'];
        $schedulesEn = ['Sun-Tue 8:00-9:30', 'Mon-Wed 10:00-11:30', 'Mon-Wed 12:00-1:30', 'Sun-Tue 2:00-3:30', 'Wed 10:00-12:00'];
        $i = 0;
        foreach ($rows as $r) {
            $idx = $i % count($defaults['instructors']);
            $rIdx = $i % count($defaults['rooms']);
            $sIdx = $i % count($schedules);
            $out[] = [
                'course_code'    => $r['course_code'],
                'course_name'    => $r['course_name'],
                'course_name_en' => $r['course_name_s'],
                'credit_hours'   => (int) $r['crd_hrs'],
                'instructor'     => $defaults['instructors'][$idx],
                'instructor_en'  => 'Faculty Member',
                'schedule'       => $schedules[$sIdx],
                'schedule_en'    => $schedulesEn[$sIdx],
                'room'           => $defaults['rooms'][$rIdx],
                'room_en'        => $defaults['rooms'][$rIdx],
                'seats'          => 28 + ($i % 4) * 4,
                'enrolled'       => 18 + ($i % 5) * 2,
                'section'        => (string) (1 + ($i % 2)),
            ];
            $i++;
        }
        return $out;
    }

    /**
     * Per-student QSpark packs.
     *
     * Three featured demo cases (Accounting/Faisal, CS/Noura, EE/Mohammed)
     * each get a fully tailored bundle. Any other student falls back to the
     * Accounting pack so the page never renders empty.
     */
    private static function qsparkPack(string $studentId): array
    {
        $packs = [
            // ── Faisal — كلية إدارة الأعمال / محاسبة ─────────────────
            '443211517' => [
                'stats' => [
                    ['label' => 'مقررات نشطة',     'value' => 4,  'icon' => 'book'],
                    ['label' => 'مختبرات مكتملة',  'value' => 18, 'icon' => 'lab'],
                    ['label' => 'ساعات تعلم',       'value' => 96, 'icon' => 'clock'],
                    ['label' => 'شهادات مكتسبة',   'value' => 6,  'icon' => 'medal'],
                ],
                'courses' => [
                    ['code' => 'QS-PBI-101',   'title' => 'مقدمة في Power BI للمحللين',           'category' => 'تحليل البيانات',  'level' => 'مبتدئ', 'hours' => 12, 'progress' => 80, 'rating' => 4.8, 'enrolled' => 1240, 'tone' => 'green'],
                    ['code' => 'QS-IFRS-201',  'title' => 'المعايير الدولية للتقارير المالية IFRS','category' => 'محاسبة',         'level' => 'متوسط', 'hours' => 18, 'progress' => 45, 'rating' => 4.7, 'enrolled' => 860,  'tone' => 'purple'],
                    ['code' => 'QS-PY-110',    'title' => 'Python لتحليل البيانات المالية',       'category' => 'برمجة',          'level' => 'متوسط', 'hours' => 24, 'progress' => 20, 'rating' => 4.9, 'enrolled' => 1980, 'tone' => 'amber'],
                    ['code' => 'QS-EXCEL-301', 'title' => 'Excel المتقدم وأتمتة التقارير',        'category' => 'مهارات مكتبية',   'level' => 'متقدم', 'hours' => 10, 'progress' => 100,'rating' => 4.6, 'enrolled' => 2450, 'tone' => 'green'],
                    ['code' => 'QS-SAP-220',   'title' => 'أساسيات SAP S/4HANA المالية',          'category' => 'ERP',            'level' => 'متوسط', 'hours' => 22, 'progress' => 0,  'rating' => 4.5, 'enrolled' => 540,  'tone' => 'purple'],
                    ['code' => 'QS-EN-150',    'title' => 'الإنجليزية المهنية للمحاسبين',        'category' => 'لغات',           'level' => 'مبتدئ', 'hours' => 16, 'progress' => 60, 'rating' => 4.4, 'enrolled' => 1100, 'tone' => 'amber'],
                ],
                'paths' => [
                    ['title' => 'محلل بيانات مالية',          'desc' => 'Power BI + Python + SQL لمحلل بيانات جاهز للسوق.',          'courses' => 5, 'hours' => 64, 'progress' => 55, 'students' => 312],
                    ['title' => 'محاسب IFRS معتمد',            'desc' => 'معايير IFRS مع تطبيقات على القوائم المالية.',                'courses' => 4, 'hours' => 48, 'progress' => 30, 'students' => 184],
                    ['title' => 'أتمتة التقارير المكتبية',     'desc' => 'Excel متقدم + Power Query + Power Automate.',                'courses' => 3, 'hours' => 30, 'progress' => 90, 'students' => 426],
                    ['title' => 'مهارات سوق العمل الأساسية',  'desc' => 'إنجليزية مهنية، تواصل، وإدارة وقت للخريجين.',                'courses' => 4, 'hours' => 28, 'progress' => 15, 'students' => 612],
                ],
                'projects' => [
                    ['title' => 'لوحة مؤشرات مبيعات شركة وهمية',     'tech' => 'Power BI',       'status' => 'مكتمل',       'due' => '2026-03-12', 'score' => 95,   'tone' => 'green'],
                    ['title' => 'تحليل القوائم المالية لشركة محلية',  'tech' => 'Excel + IFRS',   'status' => 'قيد التنفيذ', 'due' => '2026-05-28', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'نموذج تنبؤ بإيرادات بسيط',          'tech' => 'Python',         'status' => 'قيد التنفيذ', 'due' => '2026-06-04', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'أتمتة تقرير شهري لقسم المحاسبة',    'tech' => 'Power Automate', 'status' => 'مكتمل',       'due' => '2026-02-20', 'score' => 92,   'tone' => 'green'],
                    ['title' => 'تطبيق SAP لإدارة الموردين',         'tech' => 'SAP',            'status' => 'لم يبدأ',     'due' => '2026-07-15', 'score' => null, 'tone' => 'gray'],
                ],
                'achievements' => [
                    ['title' => 'أول مختبر',           'desc' => 'أنجزت أول مختبر تفاعلي على QSpark.', 'awarded' => '2025-10-04', 'icon' => 'star'],
                    ['title' => 'محلل صاعد',           'desc' => 'أكملت 5 مختبرات في تحليل البيانات.', 'awarded' => '2025-12-18', 'icon' => 'trend'],
                    ['title' => 'متعلم نشط',           'desc' => 'سجّلت 50+ ساعة تعلّم نشط.',          'awarded' => '2026-02-22', 'icon' => 'fire'],
                    ['title' => 'مشروع ممتاز',         'desc' => 'حصلت على 95 في مشروع Power BI.',     'awarded' => '2026-03-15', 'icon' => 'trophy'],
                    ['title' => 'مشاركة مجتمعية',      'desc' => 'ساعدت 10 زملاء في منتدى QSpark.',    'awarded' => '2026-04-09', 'icon' => 'users'],
                    ['title' => 'شهادة Excel متقدم',   'desc' => 'اجتزت تقييم Excel المتقدم.',         'awarded' => '2026-04-28', 'icon' => 'medal'],
                ],
                'sessions' => [
                    ['title' => 'ورشة: لوحة مؤشرات Power BI',           'speaker' => 'م. ريم عبدالرحمن سعد',  'date' => '2026-05-18', 'time' => '19:00', 'seats' => 38, 'duration' => '90 د'],
                    ['title' => 'جلسة Q&A: شهادات IFRS — من أين تبدأ؟', 'speaker' => 'د. خالد عبدالله محمد',  'date' => '2026-05-21', 'time' => '17:00', 'seats' => 64, 'duration' => '60 د'],
                    ['title' => 'مختبر مباشر: Python للمالية',           'speaker' => 'أ. لمى عبدالعزيز محمد', 'date' => '2026-05-25', 'time' => '20:00', 'seats' => 24, 'duration' => '120 د'],
                ],
            ],

            // ── Noura — كلية الحاسب / علوم الحاسب ─────────────────────
            '443100021' => [
                'stats' => [
                    ['label' => 'مقررات نشطة',     'value' => 5,   'icon' => 'book'],
                    ['label' => 'مختبرات مكتملة',  'value' => 27,  'icon' => 'lab'],
                    ['label' => 'ساعات تعلم',       'value' => 142, 'icon' => 'clock'],
                    ['label' => 'شهادات مكتسبة',   'value' => 9,   'icon' => 'medal'],
                ],
                'courses' => [
                    ['code' => 'QS-AI-201',  'title' => 'تعلّم الآلة العملي',                  'category' => 'ذكاء اصطناعي', 'level' => 'متوسط', 'hours' => 28, 'progress' => 70, 'rating' => 4.9, 'enrolled' => 2240, 'tone' => 'purple'],
                    ['code' => 'QS-WEB-310', 'title' => 'تطوير الواجهات بـ React',             'category' => 'تطوير ويب',   'level' => 'متوسط', 'hours' => 22, 'progress' => 90, 'rating' => 4.8, 'enrolled' => 3120, 'tone' => 'green'],
                    ['code' => 'QS-DS-401',  'title' => 'هياكل البيانات والخوارزميات',         'category' => 'علوم حاسب',    'level' => 'متقدم', 'hours' => 30, 'progress' => 55, 'rating' => 4.7, 'enrolled' => 1640, 'tone' => 'amber'],
                    ['code' => 'QS-CLD-220', 'title' => 'الحوسبة السحابية على AWS',            'category' => 'سحابة',       'level' => 'متوسط', 'hours' => 20, 'progress' => 40, 'rating' => 4.6, 'enrolled' => 980,  'tone' => 'purple'],
                    ['code' => 'QS-DB-130',  'title' => 'قواعد البيانات و SQL',                'category' => 'بيانات',      'level' => 'مبتدئ', 'hours' => 14, 'progress' => 100,'rating' => 4.7, 'enrolled' => 2640, 'tone' => 'green'],
                    ['code' => 'QS-SEC-310', 'title' => 'أساسيات الأمن السيبراني',             'category' => 'أمن',         'level' => 'متوسط', 'hours' => 18, 'progress' => 25, 'rating' => 4.5, 'enrolled' => 1180, 'tone' => 'amber'],
                ],
                'paths' => [
                    ['title' => 'مهندس ذكاء اصطناعي',     'desc' => 'Python + ML + Deep Learning + مشروع تطبيقي.',    'courses' => 6, 'hours' => 96, 'progress' => 65, 'students' => 540],
                    ['title' => 'مطوّر Full-Stack',         'desc' => 'React + Node + قواعد بيانات + Cloud.',           'courses' => 5, 'hours' => 80, 'progress' => 50, 'students' => 870],
                    ['title' => 'محلل بيانات',              'desc' => 'SQL + Python + Power BI + تحليلات إحصائية.',     'courses' => 4, 'hours' => 56, 'progress' => 80, 'students' => 612],
                    ['title' => 'متخصص في الأمن السيبراني','desc' => 'شبكات + Pen testing + إدارة المخاطر.',            'courses' => 5, 'hours' => 72, 'progress' => 20, 'students' => 286],
                ],
                'projects' => [
                    ['title' => 'نموذج تصنيف صور بـ CNN',           'tech' => 'PyTorch',        'status' => 'مكتمل',       'due' => '2026-02-28', 'score' => 96,   'tone' => 'green'],
                    ['title' => 'تطبيق Todo بـ React + Node',        'tech' => 'React + Node',   'status' => 'مكتمل',       'due' => '2026-03-22', 'score' => 94,   'tone' => 'green'],
                    ['title' => 'محرك بحث على وثائق محلية',          'tech' => 'Python + ES',    'status' => 'قيد التنفيذ', 'due' => '2026-05-30', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'لوحة مراقبة Cloud على AWS',         'tech' => 'AWS + Grafana',  'status' => 'قيد التنفيذ', 'due' => '2026-06-12', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'تحليل ثغرات تطبيق ويب',             'tech' => 'OWASP ZAP',      'status' => 'لم يبدأ',     'due' => '2026-07-20', 'score' => null, 'tone' => 'gray'],
                ],
                'achievements' => [
                    ['title' => 'أول كود يعمل',         'desc' => 'نشرت أول تطبيق React.',               'awarded' => '2025-09-12', 'icon' => 'star'],
                    ['title' => 'بطلة الخوارزميات',    'desc' => 'حللت 100 سؤال LeetCode.',              'awarded' => '2025-11-30', 'icon' => 'trend'],
                    ['title' => 'هاكاثون',             'desc' => 'فزت بالمركز الأول في هاكاثون QU.',    'awarded' => '2026-01-18', 'icon' => 'trophy'],
                    ['title' => 'مدمنة تعلّم',          'desc' => 'سجّلت 100+ ساعة تعلّم نشط.',          'awarded' => '2026-02-22', 'icon' => 'fire'],
                    ['title' => 'مشاركة مجتمعية',      'desc' => 'ساهمت في 5 مشاريع مفتوحة المصدر.',    'awarded' => '2026-04-02', 'icon' => 'users'],
                    ['title' => 'شهادة AWS Cloud',     'desc' => 'اجتزت Cloud Practitioner.',           'awarded' => '2026-04-25', 'icon' => 'medal'],
                ],
                'sessions' => [
                    ['title' => 'ورشة: نشر نموذج ML على السحابة',  'speaker' => 'د. سارة عبدالله سعد',   'date' => '2026-05-19', 'time' => '20:00', 'seats' => 42, 'duration' => '120 د'],
                    ['title' => 'Q&A: مسار وظيفي في AI',            'speaker' => 'أ. عبدالله محمد سعد',   'date' => '2026-05-22', 'time' => '18:00', 'seats' => 80, 'duration' => '60 د'],
                    ['title' => 'مختبر مباشر: React 19 الجديد',     'speaker' => 'م. هيا عبدالرحمن خالد', 'date' => '2026-05-27', 'time' => '19:00', 'seats' => 30, 'duration' => '90 د'],
                ],
            ],

            // ── Mohammed — كلية الهندسة / كهربائية ────────────────────
            '443100022' => [
                'stats' => [
                    ['label' => 'مقررات نشطة',     'value' => 3,   'icon' => 'book'],
                    ['label' => 'مختبرات مكتملة',  'value' => 22,  'icon' => 'lab'],
                    ['label' => 'ساعات تعلم',       'value' => 78,  'icon' => 'clock'],
                    ['label' => 'شهادات مكتسبة',   'value' => 4,   'icon' => 'medal'],
                ],
                'courses' => [
                    ['code' => 'QS-EE-210',  'title' => 'دوائر كهربائية بـ MATLAB',         'category' => 'هندسة كهربائية', 'level' => 'متوسط', 'hours' => 18, 'progress' => 65, 'rating' => 4.7, 'enrolled' => 720,  'tone' => 'purple'],
                    ['code' => 'QS-EMB-220', 'title' => 'برمجة المتحكمات الدقيقة Arduino',  'category' => 'أنظمة مدمجة',   'level' => 'متوسط', 'hours' => 20, 'progress' => 85, 'rating' => 4.8, 'enrolled' => 1140, 'tone' => 'green'],
                    ['code' => 'QS-PWR-310', 'title' => 'أنظمة القوى الكهربائية',           'category' => 'قوى',           'level' => 'متقدم', 'hours' => 24, 'progress' => 30, 'rating' => 4.6, 'enrolled' => 460,  'tone' => 'amber'],
                    ['code' => 'QS-IOT-150', 'title' => 'إنترنت الأشياء IoT',               'category' => 'IoT',           'level' => 'مبتدئ', 'hours' => 14, 'progress' => 100,'rating' => 4.7, 'enrolled' => 1380, 'tone' => 'green'],
                    ['code' => 'QS-PLC-260', 'title' => 'برمجة المتحكمات الصناعية PLC',     'category' => 'أتمتة',         'level' => 'متوسط', 'hours' => 16, 'progress' => 0,  'rating' => 4.5, 'enrolled' => 380,  'tone' => 'purple'],
                    ['code' => 'QS-EN-150',  'title' => 'الإنجليزية المهنية للمهندسين',     'category' => 'لغات',          'level' => 'مبتدئ', 'hours' => 12, 'progress' => 70, 'rating' => 4.4, 'enrolled' => 1620, 'tone' => 'amber'],
                ],
                'paths' => [
                    ['title' => 'مهندس أنظمة مدمجة',     'desc' => 'Arduino + STM32 + RTOS + مشروع نهائي.',        'courses' => 4, 'hours' => 64, 'progress' => 60, 'students' => 240],
                    ['title' => 'متخصص أنظمة القوى',     'desc' => 'تحليل شبكات + حماية + مصادر متجددة.',           'courses' => 5, 'hours' => 80, 'progress' => 25, 'students' => 156],
                    ['title' => 'IoT وأتمتة صناعية',      'desc' => 'حساسات + PLC + سحابة + مراقبة عن بعد.',         'courses' => 4, 'hours' => 52, 'progress' => 75, 'students' => 308],
                    ['title' => 'مهارات سوق العمل',      'desc' => 'إنجليزية تقنية + سيرة + مقابلات هندسية.',       'courses' => 3, 'hours' => 24, 'progress' => 40, 'students' => 540],
                ],
                'projects' => [
                    ['title' => 'مستشعر جودة هواء IoT',             'tech' => 'Arduino + MQTT', 'status' => 'مكتمل',       'due' => '2026-02-05', 'score' => 94,   'tone' => 'green'],
                    ['title' => 'محاكاة شبكة كهرباء صغيرة',         'tech' => 'MATLAB',         'status' => 'قيد التنفيذ', 'due' => '2026-05-20', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'منظومة تحكم بإضاءة ذكية',          'tech' => 'ESP32 + IoT',    'status' => 'قيد التنفيذ', 'due' => '2026-06-10', 'score' => null, 'tone' => 'amber'],
                    ['title' => 'محرك خطّاء PLC لخط تعبئة',         'tech' => 'PLC Ladder',     'status' => 'لم يبدأ',     'due' => '2026-07-25', 'score' => null, 'tone' => 'gray'],
                    ['title' => 'لوحة مراقبة استهلاك كهرباء منزلية', 'tech' => 'Power BI + IoT', 'status' => 'مكتمل',       'due' => '2026-03-30', 'score' => 90,   'tone' => 'green'],
                ],
                'achievements' => [
                    ['title' => 'أول دائرة',           'desc' => 'صمّمت أول دائرة كهربائية تعمل.',     'awarded' => '2025-10-22', 'icon' => 'star'],
                    ['title' => 'مهندس صاعد',         'desc' => 'أنجزت 10 مختبرات مدمجة.',              'awarded' => '2026-01-04', 'icon' => 'trend'],
                    ['title' => 'متعلم نشط',          'desc' => 'سجّلت 60+ ساعة تعلم نشط.',             'awarded' => '2026-02-22', 'icon' => 'fire'],
                    ['title' => 'مشاركة مجتمعية',     'desc' => 'أرشدت 6 زملاء في مختبر IoT.',         'awarded' => '2026-04-09', 'icon' => 'users'],
                    ['title' => 'شهادة IoT',          'desc' => 'اجتزت تقييم IoT الأساسي.',             'awarded' => '2026-04-28', 'icon' => 'medal'],
                ],
                'sessions' => [
                    ['title' => 'ورشة: تصميم لوحة PCB',          'speaker' => 'م. فهد عبدالله محمد',   'date' => '2026-05-20', 'time' => '18:00', 'seats' => 26, 'duration' => '120 د'],
                    ['title' => 'Q&A: المهن في أنظمة القوى',     'speaker' => 'د. عمر سعد عبدالعزيز',  'date' => '2026-05-23', 'time' => '19:00', 'seats' => 48, 'duration' => '60 د'],
                    ['title' => 'مختبر مباشر: ESP32 على السحابة', 'speaker' => 'أ. خالد عبدالله محمد',  'date' => '2026-05-28', 'time' => '20:00', 'seats' => 22, 'duration' => '90 د'],
                ],
            ],
        ];
        return $packs[$studentId] ?? $packs['443211517'];
    }

    /** Snapshot stats for the QSpark landing — drives the top KPI row. */
    public static function qsparkStats(string $studentId): array        { return self::qsparkPack($studentId)['stats']; }
    /** Featured QSpark courses — interactive cards on the landing. */
    public static function qsparkCourses(string $studentId): array      { return self::qsparkPack($studentId)['courses']; }
    /** Multi-course learning paths with overall progress. */
    public static function qsparkPaths(string $studentId): array        { return self::qsparkPack($studentId)['paths']; }
    /** Hands-on projects in the QSpark workspace. */
    public static function qsparkProjects(string $studentId): array     { return self::qsparkPack($studentId)['projects']; }
    /** Achievements/badges earned in QSpark. */
    public static function qsparkAchievements(string $studentId): array { return self::qsparkPack($studentId)['achievements']; }
    /** Upcoming live sessions / workshops in QSpark. */
    public static function qsparkLiveSessions(string $studentId): array { return self::qsparkPack($studentId)['sessions']; }

    /** Mimics: GET https://api.qu.edu.sa/api/v3/academic/departments */
    public static function departments(): array
    {
        $list = [];
        foreach (self::students() as $s) {
            $key = $s['faculty'];
            if (!isset($list[$key])) {
                $list[$key] = ['faculty' => $key, 'majors' => []];
            }
            if (!in_array($s['major'], $list[$key]['majors'], true)) {
                $list[$key]['majors'][] = $s['major'];
            }
        }
        return array_values($list);
    }

    // ── Chatbot (Smart Advisor) demo data ────────────────────────────────

    /** Conversation list for the QMentor chatbot sidebar. */
    public static function chatbotConversations(string $studentId): array
    {
        $s = self::findStudent($studentId) ?? self::students()[0];
        $first = explode(' ', trim($s['name']))[0] ?? 'الطالب';
        return [
            ['id' => 'conv-' . $studentId . '-1', 'title' => 'استفسار عن خطة ' . $s['major'],         'last_message' => 'شكراً، الخطة واضحة الآن.',           'updated_at' => '2026-05-10T18:42:00+03:00', 'status' => 'active'],
            ['id' => 'conv-' . $studentId . '-2', 'title' => 'نصائح للاستعداد للاختبارات النهائية',   'last_message' => 'جرّب أسلوب بومودورو لمدة أسبوع.',     'updated_at' => '2026-05-08T11:15:00+03:00', 'status' => 'active'],
            ['id' => 'conv-' . $studentId . '-3', 'title' => 'حذف وإضافة مقررات الفصل القادم',        'last_message' => 'تم تجهيز قائمة بالبدائل المناسبة.',  'updated_at' => '2026-05-05T20:03:00+03:00', 'status' => 'active'],
            ['id' => 'conv-' . $studentId . '-4', 'title' => 'متطلبات التخرج والساعات المتبقية',     'last_message' => 'تبقّى لك 51 ساعة لإنهاء البرنامج.',   'updated_at' => '2026-04-28T09:20:00+03:00', 'status' => 'active'],
            ['id' => 'conv-' . $studentId . '-5', 'title' => 'كيف أرفع معدلي التراكمي؟',              'last_message' => 'إليك ' . $first . ' خطة من ثلاث خطوات.', 'updated_at' => '2026-04-21T14:50:00+03:00', 'status' => 'active'],
        ];
    }

    /** Canned message history for a single conversation. */
    public static function chatbotHistory(string $conversationId, string $studentId): array
    {
        $s = self::findStudent($studentId) ?? self::students()[0];
        $first = explode(' ', trim($s['name']))[0] ?? 'الطالب';
        $bucket = (int) substr($conversationId, -1);
        $scripts = [
            1 => [
                ['user' => 'مرحباً، أريد أن أفهم خطة ' . $s['major'] . ' وعدد الساعات المتبقية لي.'],
                ['bot'  => 'أهلاً ' . $first . '! بناءً على سجلك في كلية ' . $s['faculty'] . ' أنجزت 85 ساعة من أصل 136. تبقّى لك 51 ساعة موزّعة على متطلبات التخصص (33 ساعة) والاختياري (12 ساعة) والكلية (6 ساعات). هل تريد جدول مقترح للفصلين القادمين؟'],
                ['user' => 'نعم من فضلك.'],
                ['bot'  => "الفصل القادم: 15 ساعة موزّعة على مقررات تخصصك في {$s['major']}، وسأقترح أسماء المقررات بناءً على آخر سجل لك."],
                ['user' => 'شكراً، الخطة واضحة الآن.'],
                ['bot'  => 'موفّق ' . $first . '. سأذكّرك عند فتح التسجيل.'],
            ],
            2 => [
                ['user' => 'الاختبارات النهائية بعد أسبوعين، ما أفضل خطة استذكار؟'],
                ['bot'  => "خطة 14 يوم لــ {$first}: الأسبوع الأول تلخيص + اختبار سابق واحد لكل مقرر، الأسبوع الثاني اختباران سابقان لكل مقرر ومراجعة الأخطاء. 90 دقيقة دراسة + 10 استراحة."],
                ['user' => 'أيها أبدأ أولاً؟'],
                ['bot'  => 'ابدأ بالمقرر الأقل من المتوقع. الأصعب أولاً والذهن أنشط.'],
                ['user' => 'تمام، جرّب أسلوب بومودورو لمدة أسبوع.'],
                ['bot'  => 'ممتاز — أرسل تقدمك يوم الخميس ونعدّل الخطة لو احتجت.'],
            ],
            3 => [
                ['user' => 'أفكر في حذف أحد المقررات هذا الفصل، هل يؤثر على تخرجي؟'],
                ['bot'  => 'يعتمد على نوع المقرر — لو إجباري قد يؤخر التخرج فصلاً. اقترح بدائل من خطتك إن أردت.'],
                ['user' => 'هل هناك بدائل أخرى؟'],
                ['bot'  => 'نعم، هناك بدائل ضمن متطلبات الكلية يمكن أخذها لاحقاً.'],
                ['user' => 'تم تجهيز قائمة بالبدائل المناسبة.'],
                ['bot'  => 'أضفت البدائل إلى ملاحظاتك. راجعها مع المرشد قبل التأكيد.'],
            ],
            4 => [
                ['user' => 'كم ساعة باقية لي للتخرج وما المقررات الإجبارية المتبقية؟'],
                ['bot'  => 'تبقّى لك 51 ساعة، منها 33 ساعة إجباري في تخصص ' . $s['major'] . '.'],
                ['user' => 'هل يمكنني تقديم تدريب صيفي بدل أحدها؟'],
                ['bot'  => 'نعم، التدريب الصيفي يعادل 3 ساعات اختياري تخصص بشرط 240 ساعة عمل ميداني وتقرير معتمد.'],
                ['user' => 'متى أبدأ الإجراءات؟'],
                ['bot'  => 'قبل 30 يوماً من بداية الصيف. ابدأ في الأسبوع 11 من هذا الفصل.'],
            ],
            5 => [
                ['user' => 'معدّلي ' . $s['gpa'] . ' وأريد رفعه. هل ممكن؟'],
                ['bot'  => 'ممكن جداً ' . $first . '. (1) ركّز على المقررات ذات الـ4 ساعات. (2) أعد مقرّرين بدرجة B+ ليرتفعا إلى A. (3) سجّل دورة QSpark لرفع مهاراتك التطبيقية.'],
                ['user' => 'كم سيستغرق؟'],
                ['bot'  => 'فصلان دراسيان عادةً كافيان إذا حافظت على معدّل فصلي 4.7 وحدّ أدنى 15 ساعة.'],
                ['user' => 'إليك ' . $first . ' خطة من ثلاث خطوات.'],
                ['bot'  => 'بالتوفيق! سأذكّرك بنقاط التحقق نهاية كل شهر.'],
            ],
        ];
        $chosen = $scripts[$bucket] ?? $scripts[1];
        $out = [];
        $id = 1;
        $base = strtotime('2026-05-' . max(1, 12 - $bucket) . ' 09:00:00');
        foreach ($chosen as $turn) {
            $role = isset($turn['user']) ? 'user' : 'assistant';
            $content = $turn['user'] ?? $turn['bot'];
            $out[] = [
                'id' => $id,
                'role' => $role,
                'content' => $content,
                'created_at' => date('c', $base + $id * 90),
            ];
            $id++;
        }
        return $out;
    }

    /** Keyword-based canned answer used by the streaming endpoint. */
    public static function chatbotAnswer(string $message, string $studentId): string
    {
        $s = self::findStudent($studentId) ?? self::students()[0];
        $first = explode(' ', trim($s['name']))[0] ?? 'الطالب';
        $msg = mb_strtolower($message);
        $bank = [
            'gpa|معدل|تراكمي'                  => "معدّلك التراكمي حالياً {$s['gpa']} / 5.00 على {$s['enrolled_hours']} ساعة هذا الفصل. لرفعه: (1) ركّز على المقررات ذات 4 ساعات. (2) أعد مقرر بدرجة B+ لتحويلها إلى A. (3) خصّص 90 دقيقة دراسة يومية موزّعة بأسلوب بومودورو.",
            'تخرج|تخرّج|graduation'            => "بناءً على سجلك أنهيت 85 من 136 ساعة (≈ 63%). المتبقي 51 ساعة، ويمكنك التخرج نهاية 1447/1448 إذا سجّلت 15 ساعة على الأقل كل فصل.",
            'حذف|اضافة|إضافة|drop|add'         => "نافذة الحذف والإضافة مفتوحة لمدة أسبوعين من بداية الفصل. تجنّب الحذف إن كانت ساعاتك ستنزل تحت 12 لأن ذلك يؤثر على المكافأة. أرسل اسم المقرر وأقترح بديلاً.",
            'اختبار|نهائي|exam'                => "خطّة 14 يوم: أسبوع تلخيص + اختبار سابق واحد لكل مقرر، ثم أسبوع حل اختبارين سابقين ومراجعة الأخطاء. ابدأ بالأصعب صباحاً.",
            'دراسة|study|مذاكرة'               => "أسلوب فعّال 50/10: 50 دقيقة دراسة عميقة + 10 دقائق استراحة. كرّر 4 دورات ثم 30 دقيقة راحة طويلة.",
            'qspark|كيوسبارك|كورس|دورة'        => "في QSpark أنصحك بمسار مرتبط بتخصصك (5 مقررات/64 ساعة) — ابدأ بالأقرب لمهاراتك الحالية.",
            'مرشد|advisor|إرشاد'               => "مرشدك الأكاديمي متاح أيام الأحد والثلاثاء 10–12. يمكنك حجز موعد من تبويب «تواصل مع المرشد».",
            'مكتبة|library'                    => "مكتبة الجامعة تفتح 8 ص – 10 م، وتوفّر قاعات دراسة جماعية يمكن حجزها مسبقاً.",
            'سلام|مرحبا|أهلا|hi|hello'         => "أهلاً " . $first . "! أنا المرشد الذكي. كيف أقدر أساعدك اليوم — خطة دراسية، توقّع درجة، أو خيارات مقررات؟",
            'شكر|thank'                        => "العفو " . $first . "، موفّق دائماً.",
        ];
        foreach ($bank as $pattern => $answer) {
            $tokens = explode('|', $pattern);
            foreach ($tokens as $t) {
                if ($t !== '' && mb_strpos($msg, $t) !== false) {
                    return $answer;
                }
            }
        }
        return "سؤال جيد " . $first . ". هذا ملخّص حسب بياناتك:\n"
            . "• التخصص: {$s['major']} — {$s['faculty']}\n"
            . "• المعدّل: {$s['gpa']} / 5.00 — المستوى {$s['level']}\n"
            . "• الساعات المسجّلة هذا الفصل: {$s['enrolled_hours']}\n\n"
            . "لو سؤالك حول الخطة، الدرجات، الاختبارات، أو QSpark — اذكر الكلمة المفتاحية وسأقدّم خطوات عملية مباشرة.";
    }
}
