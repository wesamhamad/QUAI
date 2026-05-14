<?php

namespace App\QSpark\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SISService
{
    private function quApiBaseUrl(): string
    {
        return match (config('app.env')) {
            'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
            'production' => 'https://api.qu.edu.sa',
            default => 'https://api-test.qu.edu.sa',
        };
    }

    /**
     * Call qu-api v3 instructor endpoint with the session JWT.
     * Returns the `data` array (rows cast to stdClass) or null on failure / missing token.
     */
    private function callInstructorApi(string $path, ?string $semester = null): ?array
    {
        // Demo mode: never call upstream qu-api — return null and let callers
        // fall back to the FacultyCourseCache / FacultyStudentCache demo seed data.
        if (config('app.demo_mode')) {
            return null;
        }

        $token = session('qspark_token');
        if (! $token) {
            Log::warning('SISService: instructor JWT missing from session', ['path' => $path]);

            return null;
        }

        $url = $this->quApiBaseUrl().'/api/v3/instructor'.$path;
        $query = $semester ? ['semester' => $semester] : [];

        try {
            $response = Http::withToken($token)->timeout(30)->get($url, $query);

            if (! $response->successful()) {
                Log::warning('qu-api instructor call failed', [
                    'path' => $path,
                    'status' => $response->status(),
                ]);

                return null;
            }

            $data = $response->json('data');
            if (! is_array($data)) {
                return null;
            }

            return array_map(
                fn ($row) => is_array($row) ? (object) $row : $row,
                $data
            );
        } catch (\Throwable $e) {
            Log::error('qu-api instructor call error', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get academic records for a student
     * This shows the student's performance across all semesters
     *
     * @param  string  $studentId
     * @param  int|null  $semester  Optional semester filter
     * @return array
     */
    public function getAcademicRecords($studentId, $semester = null)
    {
        // Demo mode: no Oracle connection — return an empty result set.
        if (config('app.demo_mode')) {
            return [];
        }

        try {
            $cacheKey = "sis_academic_records_{$studentId}".($semester ? "_{$semester}" : '');

            return Cache::remember($cacheKey, 3600, function () use ($studentId, $semester) {
                $query = '
                    SELECT
                        R.SEMESTER,
                        CASE
                            WHEN R.SEMESTER_GPA IS NULL THEN 0
                            ELSE R.SEMESTER_GPA
                        END AS semester_gpa,
                        CASE
                            WHEN R.CUM_GPA IS NULL THEN 0
                            ELSE R.CUM_GPA
                        END AS cumulative_gpa,
                        NVL(R.ATTEMPTED_HRS, 0) AS attempted_hours,
                        NVL(R.PASSED_HRS, 0) AS passed_hours,
                        R.STUDENT_LEVEL
                    FROM SIS_ACADEMIC_RECORDS R
                    WHERE R.STUDENT_ID = :student_id
                ';

                $params = ['student_id' => $studentId];

                // If semester is provided, get current and previous semester
                if ($semester) {
                    $previousSemester = $semester - 1;
                    $query .= ' AND R.SEMESTER IN (:current_semester, :previous_semester)';
                    $params['current_semester'] = $semester;
                    $params['previous_semester'] = $previousSemester;
                }

                $query .= ' ORDER BY R.SEMESTER ASC';

                $records = DB::connection('oracle')->select($query, $params);

                return $records;
            });
        } catch (\Exception $e) {
            Log::error('Failed to fetch academic records from SIS', [
                'student_id' => $studentId,
                'semester' => $semester,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Calculate academic improvement rate
     * Compares semester 461 (before) with 462 (after using platform)
     * Uses SEMESTER_GPA to compare performance between the two semesters
     *
     * @param  string  $studentId
     * @return array
     */
    public function calculateAcademicImprovement($studentId)
    {
        // Demo mode: synthesize a modest improvement so the widget renders.
        if (config('app.demo_mode')) {
            return [
                'improvement_rate' => 8.5,
                'before_gpa' => 4.20,
                'after_gpa' => 4.56,
                'current_semester' => 462,
                'status' => 'success',
            ];
        }

        try {
            // Cache academic improvement for 1 hour - Oracle query optimization
            $cacheKey = "sis_academic_improvement_{$studentId}";

            return Cache::remember($cacheKey, 3600, function () use ($studentId) {
                Log::info('SISService: calculateAcademicImprovement called', ['student_id' => $studentId]);

                // Query to get semester GPA for semesters 461 and 462
                $query = '
                    SELECT
                        R.SEMESTER,
                        NVL(R.SEMESTER_GPA, 0) AS semester_gpa
                    FROM SIS_ACADEMIC_RECORDS R
                    WHERE R.STUDENT_ID = :student_id
                      AND R.SEMESTER IN (461, 462)
                    ORDER BY R.SEMESTER DESC
                ';

                Log::info('SISService: Running Oracle query', ['query' => $query, 'student_id' => $studentId]);

                $records = DB::connection('oracle')->select($query, ['student_id' => $studentId]);

                Log::info('SISService: Oracle query result', ['records_count' => count($records), 'records' => $records]);

                if (empty($records)) {
                    return [
                        'improvement_rate' => 0,
                        'before_gpa' => 0,
                        'after_gpa' => 0,
                        'status' => 'insufficient_data',
                    ];
                }

                // Find semester 461 (before) and 462 (after) records
                $semester461Gpa = 0;
                $semester462Gpa = 0;
                $currentSemester = 0;

                foreach ($records as $record) {
                    $semester = (int) $record->semester;
                    $gpa = (float) $record->semester_gpa;

                    if ($semester === 461) {
                        $semester461Gpa = $gpa;
                    } elseif ($semester === 462) {
                        $semester462Gpa = $gpa;
                        $currentSemester = 462;
                    }
                }

                // If we only have one semester, return with partial data
                if ($semester461Gpa == 0 && $semester462Gpa == 0) {
                    return [
                        'improvement_rate' => 0,
                        'before_gpa' => 0,
                        'after_gpa' => 0,
                        'status' => 'insufficient_data',
                    ];
                }

                // Calculate improvement: compare semester 461 (before) with 462 (after)
                $improvementRate = 0;
                if ($semester461Gpa > 0) {
                    $improvementRate = (($semester462Gpa - $semester461Gpa) / $semester461Gpa) * 100;
                }

                return [
                    'improvement_rate' => round($improvementRate, 2),
                    'before_gpa' => $semester461Gpa,
                    'after_gpa' => $semester462Gpa,
                    'current_semester' => $currentSemester,
                    'status' => 'success',
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to calculate academic improvement', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'improvement_rate' => 0,
                'before_gpa' => 0,
                'after_gpa' => 0,
                'status' => 'error',
            ];
        }
    }

    /**
     * Get student courses with grades and course types
     * OPTIMIZED: Reduced function calls, added proper JOINs, and improved caching
     *
     * @param  string  $studentId
     * @param  bool  $includeLookups  Whether to include lookup data (names). Set false for faster queries.
     * @return array
     */
    public function getStudentCoursesWithGrades($studentId, $includeLookups = true)
    {
        // Demo mode: no Oracle. Return empty so the grades page renders the
        // "no grades available yet" branch instead of timing out.
        if (config('app.demo_mode')) {
            return [];
        }

        try {
            // Use longer cache (6 hours) since grades don't change frequently
            $cacheKey = "sis_student_courses_v3_{$studentId}";

            return Cache::remember($cacheKey, 21600, function () use ($studentId, $includeLookups) {
                // Set a statement timeout for Oracle (10 seconds)
                try {
                    DB::connection('oracle')->statement("BEGIN DBMS_SESSION.SET_CONTEXT('CLIENTCONTEXT', 'timeout', '10'); END;");
                } catch (\Exception $e) {
                    // Ignore if context setting fails
                }

                // First, get basic course data with minimal function calls
                $courses = DB::connection('oracle')->select('
                    SELECT
                        A.STUDENT_ID,
                        B.STUDENT_NAME,
                        B.FACULTY_NO,
                        B.CAMPUS_NO,
                        B.MAJOR_NO,
                        B.DEPT_NO,
                        B.EDITION,
                        B.PLAN_TYPE,
                        A.SEMESTER,
                        A.COURSE_NO,
                        A.CONFIRMED_MARK AS final_grade,
                        A.LETTER_GRADE AS letter_grade,
                        C.CATEGORY_CODE,
                        C.GROUP_TYPE
                    FROM SIS_STUDENT_COURSES A
                    INNER JOIN vSIS_STUDENTS B ON A.STUDENT_ID = B.STUDENT_ID
                    INNER JOIN SIS_PLAN_COURSES C ON B.MAJOR_NO = C.MAJOR_NO
                        AND B.EDITION = C.EDITION
                        AND B.PLAN_TYPE = C.PLAN_TYPE
                        AND A.COURSE_NO = C.COURSE_NO
                    WHERE A.STUDENT_ID = :student_id
                    ORDER BY A.SEMESTER DESC
                ', ['student_id' => $studentId]);

                if (empty($courses)) {
                    return [];
                }

                // Only fetch lookup data if requested (speeds up queries when names aren't needed)
                if ($includeLookups) {
                    // Batch fetch lookup data to reduce function calls
                    $lookupData = $this->batchFetchLookupData($courses);

                    // Enrich courses with lookup data
                    foreach ($courses as $course) {
                        $course->faculty_name = $lookupData['faculties'][$course->faculty_no] ?? '';
                        $course->campus_name = $lookupData['campuses'][$course->campus_no] ?? '';
                        $course->major_name = $lookupData['majors'][$course->major_no] ?? '';
                        $course->dept_name = $lookupData['depts']["{$course->faculty_no}_{$course->dept_no}"] ?? '';
                        $course->course_name = $lookupData['courses'][$course->course_no]['name'] ?? '';
                        $course->course_code = $lookupData['courses'][$course->course_no]['code'] ?? '';
                        $course->category_name = $lookupData['categories'][$course->category_code] ?? 'غير محدد';
                        $course->group_type_name = $lookupData['group_types']["{$course->major_no}_{$course->plan_type}_{$course->edition}_{$course->course_no}"] ?? 'غير محدد';
                    }
                } else {
                    // Set default empty values when lookups are skipped
                    foreach ($courses as $course) {
                        $course->faculty_name = '';
                        $course->campus_name = '';
                        $course->major_name = '';
                        $course->dept_name = '';
                        $course->course_name = '';
                        $course->course_code = '';
                        $course->category_name = 'غير محدد';
                        $course->group_type_name = 'غير محدد';
                    }
                }

                return $courses;
            });
        } catch (\Exception $e) {
            Log::error('Failed to fetch student courses from SIS', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Batch fetch lookup data to minimize database round trips
     * Uses a single query per lookup table instead of per-row function calls
     *
     * @param  array  $courses
     * @return array
     */
    private function batchFetchLookupData($courses)
    {
        $lookupData = [
            'faculties' => [],
            'campuses' => [],
            'majors' => [],
            'depts' => [],
            'courses' => [],
            'categories' => [],
            'group_types' => [],
        ];

        if (empty($courses)) {
            return $lookupData;
        }

        // Collect unique IDs from courses
        $facultyNos = [];
        $campusNos = [];
        $majorNos = [];
        $deptKeys = [];
        $courseNos = [];
        $categoryCodes = [];
        $groupTypeKeys = [];

        foreach ($courses as $course) {
            $facultyNos[$course->faculty_no] = true;
            $campusNos[$course->campus_no] = true;
            $majorNos[$course->major_no] = true;
            $deptKeys[$course->faculty_no.'_'.$course->dept_no] = ['faculty' => $course->faculty_no, 'dept' => $course->dept_no];
            $courseNos[$course->course_no] = true;
            $categoryCodes[$course->category_code] = true;
            $groupTypeKeys[$course->major_no.'_'.$course->plan_type.'_'.$course->edition.'_'.$course->course_no] = [
                'major' => $course->major_no,
                'plan_type' => $course->plan_type,
                'edition' => $course->edition,
                'course' => $course->course_no,
            ];
        }

        try {
            // Batch fetch faculty names (single query)
            foreach (array_keys($facultyNos) as $facultyNo) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_FACULTY(:faculty_no, 1) AS name FROM DUAL', ['faculty_no' => $facultyNo]);
                $lookupData['faculties'][$facultyNo] = $result->name ?? '';
            }

            // Batch fetch campus names
            foreach (array_keys($campusNos) as $campusNo) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_CAMPUS(:campus_no, 1) AS name FROM DUAL', ['campus_no' => $campusNo]);
                $lookupData['campuses'][$campusNo] = $result->name ?? '';
            }

            // Batch fetch major names
            foreach (array_keys($majorNos) as $majorNo) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_MAJOR(:major_no, 1) AS name FROM DUAL', ['major_no' => $majorNo]);
                $lookupData['majors'][$majorNo] = $result->name ?? '';
            }

            // Batch fetch dept names
            foreach ($deptKeys as $key => $data) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_DEPT(:faculty_no, :dept_no, 1) AS name FROM DUAL', ['faculty_no' => $data['faculty'], 'dept_no' => $data['dept']]);
                $lookupData['depts'][$key] = $result->name ?? '';
            }

            // Batch fetch course names and codes
            foreach (array_keys($courseNos) as $courseNo) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_COURSE(:course_no, 1) AS name, SIS_GETTERS.GET_COURSE_CODE(:course_no2, 1) AS code FROM DUAL', ['course_no' => $courseNo, 'course_no2' => $courseNo]);
                $lookupData['courses'][$courseNo] = [
                    'name' => $result->name ?? '',
                    'code' => $result->code ?? '',
                ];
            }

            // Batch fetch category names
            foreach (array_keys($categoryCodes) as $categoryCode) {
                $result = DB::connection('oracle')->selectOne('SELECT SIS_GETTERS.GET_COURSE_CATEGORY(:category_code, 1) AS name FROM DUAL', ['category_code' => $categoryCode]);
                $lookupData['categories'][$categoryCode] = $result->name ?? 'غير محدد';
            }

            // Batch fetch group type names
            foreach ($groupTypeKeys as $key => $data) {
                $result = DB::connection('oracle')->selectOne('SELECT EDUGATE_WEB_PKG.GET_GROUP_TYPE(:major_no, :plan_type, :edition, :course_no, 1) AS name FROM DUAL', [
                    'major_no' => $data['major'],
                    'plan_type' => $data['plan_type'],
                    'edition' => $data['edition'],
                    'course_no' => $data['course'],
                ]);
                $lookupData['group_types'][$key] = $result->name ?? 'غير محدد';
            }
        } catch (\Exception $e) {
            Log::warning('Failed to fetch some lookup data', ['error' => $e->getMessage()]);
        }

        return $lookupData;
    }

    /**
     * Get instructor teaching data via qu-api v3.
     * The qu-api endpoint derives instructor_id from the JWT, so the
     * $instructorId argument is retained only for backwards compatibility.
     */
    public function getFacultyInstructorData($instructorId, $semester = null)
    {
        return $this->callInstructorApi('/data', $semester) ?? [];
    }

    /**
     * Get students enrolled with an instructor for a specific course and section
     *
     * @param  string  $instructorId
     * @param  string  $semester
     * @param  string  $courseNo
     * @param  string  $activityCode
     * @param  string  $section
     * @param  string  $campusNo
     * @return array
     */
    public function getInstructorStudents($instructorId, $semester, $courseNo = null, $activityCode = null, $section = null, $campusNo = null)
    {
        try {
            $cacheKey = "sis_instructor_students_{$instructorId}_{$semester}_{$courseNo}_{$activityCode}_{$section}";

            return Cache::remember($cacheKey, 3600, function () use ($instructorId, $semester, $courseNo, $activityCode, $section, $campusNo) {
                $conditions = ['F.SEMESTER = :semester'];
                $bindings = ['semester' => $semester];

                if ($courseNo) {
                    $conditions[] = 'f.course_no = :course_no';
                    $bindings['course_no'] = $courseNo;
                }
                if ($activityCode) {
                    $conditions[] = 'f.ACTIVITY_CODE = :activity_code';
                    $bindings['activity_code'] = $activityCode;
                }
                if ($section) {
                    $conditions[] = 'F.SECTION = :section';
                    $bindings['section'] = $section;
                }
                if ($campusNo) {
                    $conditions[] = 'F.CAMPUS_NO = :campus_no';
                    $bindings['campus_no'] = $campusNo;
                }

                // Add instructor condition
                $conditions[] = 'ssi.instructor_id = :instructor_id';
                $bindings['instructor_id'] = $instructorId;

                $whereClause = implode(' AND ', $conditions);

                $students = DB::connection('oracle')->select("
                    SELECT F.STUDENT_ID,
                           SIS_GETTERS.GET_COURSE(f.course_no,1) as course_name,
                           SIS_GETTERS.GET_COURSE_CODE(f.course_no,1) as course_code,
                           SIS_GETTERS.GET_ACTIVITY(f.ACTIVITY_CODE,1) as activity_desc,
                           F.SECTION_SEQ,
                           HR_GETTERS.GET_EMPLOYEE(ssi.instructor_id,1) employee_name,
                           to_char(to_date(sfp.START_TIME ,'sssss'),'hh24:mi') start_time,
                           F.CAMPUS_NO,
                           F.SEMESTER,
                           F.COURSE_NO,
                           to_char(to_date(sfp.END_TIME,'sssss'),'hh24:mi') end_time,
                           sfp.EXAM_DATE,
                           SIS_GETTERS.get_room(sst.room_no, 1) room,
                           sst.day_code day,
                           F.activity_code,
                           F.section,
                           SIS_GETTERS.get_time(sst.time_code,1) time
                    FROM SIS_STUDENT_ACTIVITIES f
                    LEFT JOIN SIS_SECTION_INSTRUCTORS ssi
                              ON ssi.SEMESTER = F.SEMESTER
                                  AND ssi.CAMPUS_NO = F.CAMPUS_NO
                                  AND ssi.course_no = f.course_no
                                  AND ssi.ACTIVITY_CODE = f.ACTIVITY_CODE
                                  AND ssi.SECTION = F.SECTION
                    INNER JOIN SIS_STUDENTS s
                               on F.STUDENT_ID = S.STUDENT_ID
                    LEFT JOIN SIS_TIMETABLE st
                              ON st.CAMPUS_NO = F.CAMPUS_NO
                                  AND st.SEMESTER = F.SEMESTER
                                  AND st.COURSE_NO = F.COURSE_NO
                                  AND st.ACTIVITY_CODE = F.ACTIVITY_CODE
                                  AND st.SECTION = F.SECTION
                                  AND st.SECTION_SEQ = F.SECTION_SEQ
                    LEFT JOIN SIS_FINALEXAM_PRIODS sfp
                              on sfp.CAMPUS_NO = F.CAMPUS_NO
                                  AND sfp.SEMESTER = F.SEMESTER
                                  AND sfp.PERIOD_NO = st.EXAM_PERIOD
                    LEFT JOIN SIS_SECTION_TIMES sst
                              ON f.CAMPUS_NO = sst.CAMPUS_NO
                                  AND f.SEMESTER = sst.SEMESTER
                                  AND f.COURSE_NO = sst.COURSE_NO
                                  AND f.ACTIVITY_CODE = sst.ACTIVITY_CODE
                                  AND f.SECTION = sst.SECTION
                    WHERE {$whereClause}
                    ORDER BY F.STUDENT_ID
                ", $bindings);

                return $students;
            });
        } catch (\Exception $e) {
            Log::error('Failed to fetch instructor students from SIS', [
                'instructor_id' => $instructorId,
                'semester' => $semester,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Get current semester via qu-api v3.
     */
    public function getCurrentSemester()
    {
        // Demo mode: pin the active semester so dashboard queries find the seeded rows.
        if (config('app.demo_mode')) {
            return '462';
        }

        $token = session('qspark_token');
        if (! $token) {
            Log::warning('SISService: instructor JWT missing from session', ['path' => '/current-semester']);

            return null;
        }

        try {
            $response = Http::withToken($token)
                ->timeout(30)
                ->get($this->quApiBaseUrl().'/api/v3/instructor/current-semester');

            if (! $response->successful()) {
                Log::warning('qu-api current-semester call failed', ['status' => $response->status()]);

                return null;
            }

            return $response->json('data.current_semester');
        } catch (\Throwable $e) {
            Log::error('qu-api current-semester call error', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Get courses taught by the authenticated instructor via qu-api v3.
     */
    public function getFacultyCourses($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/courses', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            return $this->demoFacultyCourses($instructorId, $semester);
        }

        return [];
    }

    /**
     * Get courses taught by the authenticated instructor via qu-api v3,
     * enriched with the matched Blackboard course data per row.
     *
     * Each row exposes a `blackboard` property containing
     * `id`, `uuid`, `externalId`, `courseId`, `name` (or `null` when no match).
     */
    public function getFacultyCoursesWithBlackboard($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/courses/blackboard', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            return array_map(function ($row) {
                $row->blackboard = null;

                return $row;
            }, $this->demoFacultyCourses($instructorId, $semester));
        }

        return [];
    }

    /**
     * Get students related to the authenticated instructor via qu-api v3.
     */
    public function getFacultyStudents($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/students', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            return $this->demoFacultyStudents($instructorId, $semester);
        }

        return [];
    }

    /**
     * Get all students with GPA for the authenticated instructor via qu-api v3.
     */
    public function getAllStudentsWithGPA($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/students-gpa', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            return $this->demoFacultyStudents($instructorId, $semester, true);
        }

        return [];
    }

    /**
     * Get top 10 students by GPA for the authenticated instructor via qu-api v3.
     */
    public function getTopStudentsByFaculty($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/top-students', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            $rows = $this->demoFacultyStudents($instructorId, $semester, true);
            usort($rows, fn ($a, $b) => ($b->last_recorded_gpa ?? 0) <=> ($a->last_recorded_gpa ?? 0));

            return array_slice($rows, 0, 10);
        }

        return [];
    }

    /**
     * Get attendance data for the authenticated instructor's students via qu-api v3.
     */
    public function getFacultyStudentsAttendance($instructorId, $semester = null)
    {
        $data = $this->callInstructorApi('/students-attendance', $semester);
        if ($data !== null) {
            return $data;
        }

        if (config('app.demo_mode')) {
            return $this->demoFacultyStudents($instructorId, $semester);
        }

        return [];
    }

    /**
     * Demo-mode fallback: return faculty courses from the seeded cache
     * shaped as stdClass rows compatible with the qu-api response.
     */
    private function demoFacultyCourses($instructorId, $semester = null): array
    {
        $semester = $semester ?: '462';
        $rows = \App\QSpark\Models\FacultyCourseCache::getInstructorCourses($instructorId, $semester);

        return $rows->map(fn ($r) => (object) [
            'course_no' => $r->course_no,
            'course_code' => $r->course_code,
            'course_name' => $r->course_name,
            'section' => $r->section,
            'activity_code' => $r->activity_code,
            'activity_name' => $r->activity_name,
            'semester' => $r->semester,
            'student_count' => (int) $r->student_count,
        ])->all();
    }

    /**
     * Demo-mode fallback: return faculty students from the seeded cache
     * shaped as stdClass rows compatible with the qu-api response.
     */
    private function demoFacultyStudents($instructorId, $semester = null, bool $requireGpa = false): array
    {
        $semester = $semester ?: '462';
        $rows = $requireGpa
            ? \App\QSpark\Models\FacultyStudentCache::getAllWithGPA($instructorId, $semester)
            : \App\QSpark\Models\FacultyStudentCache::getInstructorStudents($instructorId, $semester);

        return $rows->map(fn ($r) => (object) [
            'student_id' => $r->student_id,
            'student_name' => $r->student_name,
            'course_no' => $r->course_no,
            'course_code' => $r->course_code,
            'course_name' => $r->course_name,
            'section' => $r->section,
            'activity_code' => $r->activity_code,
            'last_recorded_gpa' => $r->last_recorded_gpa !== null ? (float) $r->last_recorded_gpa : null,
            'attendance_percent' => $r->attendance_percent !== null ? (float) $r->attendance_percent : null,
            'absence_percent' => $r->absence_percent !== null ? (float) $r->absence_percent : null,
            'semester' => $r->semester,
        ])->all();
    }
}
