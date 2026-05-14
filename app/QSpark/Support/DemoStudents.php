<?php

namespace App\QSpark\Support;

/**
 * Demo student personas for the "switch student" feature.
 *
 * Each persona supplies a profile-shaped override that StudentFixture
 * deep-merges onto the base student_demo.json bundle, so the student
 * dashboard can be viewed as any of these students. Courses / timetable /
 * grades stay shared from the base fixture — only the identity and the
 * headline academic numbers change.
 *
 * IDs and names mirror the fictional roster seeded by DemoDataSeeder so the
 * same students also appear in the faculty / admin dashboards.
 */
class DemoStudents
{
    public const SESSION_KEY = 'demo_student_id';

    /**
     * @return array<string,array{label:string,profile:array}>
     */
    public static function all(): array
    {
        $business = ['name' => 'الأعمال والاقتصاد', 'name_en' => 'College of Business and Economics', 'faculty_id' => '5'];
        $accounting = ['name' => ' محاسبة', 'name_en' => 'Accounting', 'major_id' => null];
        $cs = ['name' => 'علوم الحاسب وتقنية المعلومات', 'name_en' => 'College of Computer', 'faculty_id' => '7'];
        $infoSystems = ['name' => 'نظم المعلومات', 'name_en' => 'Information Systems', 'major_id' => null];

        return [
            '444000001' => self::persona('444000001', 'نورة عبدالله سعد', 'Noura Abdullah S', '2', '1100000001', '2004-06-04', [
                'academic_level' => '5', 'last_recorded_gpa' => '4.83', 'total_plan_hours' => '129',
                'total_earned_hours' => '67', 'current_registered_hours' => '15', 'remaining_hours_to_graduate' => '62',
            ], 0, $business, $accounting),

            '444000002' => self::persona('444000002', 'ريم خالد', 'Reem Khalid', '2', '1100000002', '2003-11-22', [
                'academic_level' => '6', 'last_recorded_gpa' => '3.12', 'total_plan_hours' => '129',
                'total_earned_hours' => '84', 'current_registered_hours' => '15', 'remaining_hours_to_graduate' => '45',
            ], 6, $business, $accounting),

            '444000003' => self::persona('444000003', 'لينا فهد', 'Lina Fahd', '2', '1100000003', '2005-02-10', [
                'academic_level' => '4', 'last_recorded_gpa' => '4.51', 'total_plan_hours' => '129',
                'total_earned_hours' => '52', 'current_registered_hours' => '16', 'remaining_hours_to_graduate' => '77',
            ], 2, $business, $accounting),

            '444000008' => self::persona('444000008', 'جوان عبدالعزيز', 'Jana Abdulaziz', '2', '1100000008', '2002-08-30', [
                'academic_level' => '7', 'last_recorded_gpa' => '2.41', 'total_plan_hours' => '132',
                'total_earned_hours' => '98', 'current_registered_hours' => '12', 'remaining_hours_to_graduate' => '34',
            ], 14, $cs, $infoSystems),

            '444000011' => self::persona('444000011', 'لمى أحمد', 'Lama Ahmed', '2', '1100000011', '2005-05-18', [
                'academic_level' => '3', 'last_recorded_gpa' => '3.76', 'total_plan_hours' => '132',
                'total_earned_hours' => '38', 'current_registered_hours' => '15', 'remaining_hours_to_graduate' => '94',
            ], 4, $cs, $infoSystems),

            '444000015' => self::persona('444000015', 'أسماء بدر', 'Asma Bader', '2', '1100000015', '2001-12-01', [
                'academic_level' => '8', 'last_recorded_gpa' => '4.96', 'total_plan_hours' => '129',
                'total_earned_hours' => '120', 'current_registered_hours' => '9', 'remaining_hours_to_graduate' => '9',
            ], 0, $business, $accounting),
        ];
    }

    /** Build one persona's profile-shaped override. */
    private static function persona(
        string $id, string $name, string $nameEn, string $gender,
        string $nationalId, string $dob, array $academic, int $absenceHours,
        array $faculty, array $major
    ): array {
        return [
            'label' => $name,
            'profile' => [
                'id' => $id,
                'name' => $name,
                'name_en' => $nameEn,
                'gender' => $gender,
                'student_id' => $id,
                'national_id' => $nationalId,
                'email' => $id.'@qu.edu.sa',
                'phone_number' => '05'.substr($id, -8),
                'total_absence_hours' => $absenceHours,
                'dob' => $dob.' 00:00:00',
                'academic' => array_merge([
                    'preregistration_level' => $academic['academic_level'] ?? '5',
                    'cumulative_gpa' => '',
                    'semester_gpa' => '',
                    'current_passed_hours' => '0',
                    'academic_status' => 'فعال',
                    'expected_graduation_semester' => '',
                ], $academic),
                'major' => $major,
                'faculty' => $faculty,
            ],
        ];
    }

    /** Currently selected persona id (defaults to the first roster entry). */
    public static function currentId(): string
    {
        $id = (string) session(self::SESSION_KEY, '');
        return self::has($id) ? $id : array_key_first(self::all());
    }

    public static function has(string $id): bool
    {
        return $id !== '' && array_key_exists($id, self::all());
    }

    /** Profile-shaped override for the active persona. */
    public static function currentProfileOverride(): array
    {
        return self::all()[self::currentId()]['profile'] ?? [];
    }
}
