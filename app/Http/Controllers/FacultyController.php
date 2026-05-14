<?php

namespace App\Http\Controllers;

use App\Support\DemoData;
use Illuminate\Http\Request;

/**
 * Faculty view — list of students and a single-student page with three tabs:
 * QMentor, +QSpark and Digital Record. The tabbed page iframes the same routes
 * a student would see, but each iframe URL carries an impersonation parameter
 * (?as=<id> for QMentor/QSpark, ?student_id=<id> for Digital Record) so the
 * underlying controllers serve that student's dummy data.
 */
class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $needle   = trim((string) $request->query('q', ''));
        $students = DemoData::students();

        if ($needle !== '') {
            $needleLower = mb_strtolower($needle);
            $students = array_values(array_filter($students, fn ($s) =>
                mb_strpos(mb_strtolower($s['name']), $needleLower) !== false
                || mb_strpos((string) $s['student_id'], $needle) !== false
                || mb_strpos(mb_strtolower($s['major']), $needleLower) !== false));
        }

        return view('faculty.index', [
            'students' => $students,
            'query'    => $needle,
        ]);
    }

    public function show(Request $request, string $studentId)
    {
        $student = DemoData::findStudent($studentId);
        abort_if($student === null, 404, 'Student not found');

        $tab = (string) $request->query('tab', 'qmentor');
        if (!in_array($tab, ['qmentor', 'qspark', 'record'], true)) {
            $tab = 'qmentor';
        }

        return view('faculty.show', [
            'student' => $student,
            'tab'     => $tab,
            'tabs'    => [
                'qmentor' => [
                    'label' => 'QMentor',
                    'url'   => '/qmentor?as=' . urlencode($studentId),
                ],
                'qspark'  => [
                    'label' => '+QSpark',
                    'url'   => '/qspark-plus?as=' . urlencode($studentId),
                ],
                'record'  => [
                    'label' => 'سجلك الرقمي',
                    'url'   => route('digital-record.index', ['student_id' => $studentId]),
                ],
            ],
        ]);
    }
}
