<?php

use App\QSpark\Http\Controllers\UsageController;
use App\QSpark\Http\Controllers\QuizController;
use App\QSpark\Http\Controllers\CoursesController;
use App\QSpark\Http\Controllers\CalendarController;
use App\QSpark\Http\Controllers\BlackboardCoursesController;
use App\QSpark\Http\Controllers\TokenController;
use App\QSpark\Http\Controllers\StudentDashboardController;
use App\QSpark\Http\Controllers\AdminDashboardController;
use App\QSpark\Http\Controllers\FacultyDashboardController;
use App\QSpark\Http\Controllers\LocalLoginController;
use App\QSpark\Http\Controllers\CacheStatusController;
use App\QSpark\Http\Controllers\Api\GameApiController;
use App\QSpark\Http\Controllers\Api\BlackboardLearnController;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\QSpark\Http\Controllers\PlayTimeController;

Route::get('/', function () {
    if (auth()->check()) {
        return dashboardRedirectFor(auth()->user()->role);
    }
    return view('qspark::landing');
})->middleware('qspark.cache.views:60');

Route::get('/login', function () {
    if (auth()->check()) {
        return dashboardRedirectFor(auth()->user()->role);
    }
    if (config('app.demo_mode')) {
        return view('qspark::demo-login');
    }
    return redirect()->route('qspark.saml2_login', ['idpName' => samlIdpForCurrentEnv()]);
})->name('login');

Route::post('/login', [LocalLoginController::class, 'demoLogin'])
    ->middleware('throttle:30,1')
    ->name('login.attempt');

// Dev escape hatch — works in APP_ENV=local OR DEMO_MODE=true.
Route::get('/dev/{role?}', [LocalLoginController::class, 'quickLogin'])
    ->where('role', 'student|faculty|admin')
    ->name('dev.login');

// Demo only: switch which student persona the student dashboard is viewed as.
Route::get('/demo/switch-student/{id}', [LocalLoginController::class, 'switchStudent'])
    ->where('id', '[0-9]+')
    ->middleware('auth')
    ->name('demo.switch-student');

Route::get('/logs', function () {
    abort_unless(auth()->user()?->username === 'w.aljuraysh', 403);

    $path = storage_path('logs/laravel.log');
    abort_unless(file_exists($path), 404, 'laravel.log not found');

    $maxBytes = 2 * 1024 * 1024;

    return response()->stream(function () use ($path, $maxBytes) {
        $fp = fopen($path, 'rb');
        if ($fp === false) {
            echo "fopen failed (check permissions)";
            return;
        }
        $size = filesize($path);
        if ($size > $maxBytes) {
            fseek($fp, $size - $maxBytes);
            echo "...[truncated to last 2MB]...\n";
        }
        while (!feof($fp)) {
            echo fread($fp, 8192);
        }
        fclose($fp);
    }, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
})->middleware('auth')->name('logs.view');

// ============================================
// ADMIN ROUTES (Dashboard, Users, Roles, Permissions only)
// ============================================
Route::middleware(['auth', 'qspark.role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/export', [AdminDashboardController::class, 'export'])->name('dashboard.export');

    // Users Management
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users');
    Route::get('/users/{id}/edit', [AdminDashboardController::class, 'editUser'])->name('users.edit');
    Route::put('/users/{id}', [AdminDashboardController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{id}', [AdminDashboardController::class, 'deleteUser'])->name('users.delete');

    // Roles Management
    Route::get('/roles', [AdminDashboardController::class, 'roles'])->name('roles');
    Route::get('/roles/{id}/edit', [AdminDashboardController::class, 'editRole'])->name('roles.edit');
    Route::put('/roles/{id}', [AdminDashboardController::class, 'updateRole'])->name('roles.update');

    // Permissions Management
    Route::get('/permissions', [AdminDashboardController::class, 'permissions'])->name('permissions');
    Route::get('/permissions/{role}', [AdminDashboardController::class, 'editPermissions'])->name('permissions.edit');
    Route::put('/permissions/{role}', [AdminDashboardController::class, 'updatePermissions'])->name('permissions.update');
});

// ============================================
// FACULTY ROUTES
// ============================================
Route::middleware(['auth', 'qspark.role:faculty'])->prefix('faculty')->name('faculty.')->group(function () {
    Route::get('/dashboard', [FacultyDashboardController::class, 'index'])->name('dashboard');
    Route::get('/courses', [FacultyDashboardController::class, 'courses'])->name('courses');
    Route::get('/courses/json', [FacultyDashboardController::class, 'getCoursesJson'])->name('courses.json');
    Route::get('/courses/{courseCode}', [FacultyDashboardController::class, 'viewCourse'])->name('courses.view');

    // Question management routes
    Route::get('/courses/{courseCode}/questions', [FacultyDashboardController::class, 'getCourseQuestions'])->name('courses.questions');
    Route::get('/courses/{courseCode}/questions/export', [FacultyDashboardController::class, 'exportQuestions'])->name('courses.questions.export');
    Route::get('/questions/{questionId}', [FacultyDashboardController::class, 'getQuestion'])->name('questions.show');
    Route::get('/questions/{questionId}/edit', [FacultyDashboardController::class, 'editQuestion'])->name('questions.edit');
    Route::put('/questions/{questionId}', [FacultyDashboardController::class, 'updateQuestion'])->name('questions.update');
    Route::delete('/questions/{questionId}', [FacultyDashboardController::class, 'deleteQuestion'])->name('questions.delete');

    // AI Question generation from PDF content
    Route::post('/generate-questions', [FacultyDashboardController::class, 'generateQuestionsFromContent'])->name('generate-questions');

    Route::get('/students', [FacultyDashboardController::class, 'students'])->name('students');
    Route::get('/students/{id}', [FacultyDashboardController::class, 'viewStudent'])->name('students.view');
    Route::get('/reports', [FacultyDashboardController::class, 'reports'])->name('reports');
    Route::post('/ai-suggestions', [FacultyDashboardController::class, 'getAISuggestions'])->name('ai-suggestions');
});

// ============================================
// STUDENT ROUTES
// Note: Faculty users are NOT allowed to access student dashboard
// They should use their own faculty dashboard
// ============================================
Route::get('/dashboard-student', [StudentDashboardController::class, 'show'])
    ->middleware(['auth', 'qspark.role:student,admin', 'qspark.cache.views:60'])
    ->name('dashboard.student');

Route::get('/dashboard-student/grades', [StudentDashboardController::class, 'showGrades'])
    ->middleware(['auth', 'qspark.role:student,admin', 'qspark.cache.views:60'])
    ->name('dashboard.student.grades');

Route::get('/dashboard-student/blackboard-grades', [StudentDashboardController::class, 'showBlackboardGrades'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.blackboard.grades');

Route::get('/dashboard-student/courses', [BlackboardCoursesController::class, 'showStaticCourses'])
    ->name('dashboard.student.courses')
    ->middleware(['auth', 'qspark.role:student,admin', 'qspark.cache.views:60']);

Route::get('/api/student/courses', [BlackboardCoursesController::class, 'getCoursesJson'])
    ->name('api.student.courses')
    ->middleware(['auth', 'qspark.role:student,admin']);

Route::get('/dashboard-student/recommendations', [StudentDashboardController::class, 'showRecommendations'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.recommendations');

Route::post('/dashboard-student/recommendations/regenerate', [StudentDashboardController::class, 'regenerateRecommendations'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.recommendations.regenerate');

// AI Chat routes
Route::get('/dashboard-student/chat', [StudentDashboardController::class, 'chatPage'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.chat');

Route::post('/dashboard-student/chat/send', [StudentDashboardController::class, 'sendChatMessage'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.chat.send');

Route::post('/dashboard-student/chat/result', [StudentDashboardController::class, 'getChatResult'])
    ->middleware(['auth', 'qspark.role:student,admin'])
    ->name('dashboard.student.chat.result');

Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index')->middleware('qspark.cache.views:60');

// Route::get('/courses/{code}', [CoursesController::class, 'show'])->name('courses.show')->middleware('auth');
Route::get('/courses/{id}', [CoursesController::class, 'show'])->name('courses.show')->where('id', '[0-9]+')->middleware('qspark.cache.views:60');
Route::get('/api/courses/{id}/files', [CoursesController::class, 'getCourseFilesJson'])->name('api.course.files')->where('id', '[0-9]+')->middleware('auth');
Route::get('/courses/{id}/download-all', [CoursesController::class, 'downloadAll'])->name('courses.downloadAll')->middleware('qspark.cache.views:60');
//Route::get('/courses/{id}/quiz', [CoursesController::class, 'quiz'])->name('courses.quiz')->middleware('qspark.cache.views:60');
Route::get('/courses/{code}/quiz', [CoursesController::class, 'quiz'])->name('courses.quiz');
Route::get('/courses/{code}/download/{fileName}', [CoursesController::class, 'download'])->name('courses.download')->middleware('qspark.cache.views:60');
Route::get('/courses/{code}/quiz/{fileName}', [CoursesController::class, 'quizFile'])->name('courses.quiz.file')->middleware('qspark.cache.views:60');

// =========================================
// Game API Routes (RESTful)
// Defined here in web.php for session-based authentication
// =========================================
Route::prefix('api/game')->middleware(['auth', 'throttle:60,1'])->group(function () {
    // Start a new game session
    Route::post('/start', [GameApiController::class, 'start'])->name('api.game.start');

    // Read-only: today's accumulated play minutes for the current student
    Route::get('/today-minutes', [GameApiController::class, 'todayMinutes'])->name('api.game.today-minutes');

    // Get current game state
    Route::get('/{sessionId}/state', [GameApiController::class, 'getState'])
        ->name('api.game.state')
        ->where('sessionId', '[a-zA-Z0-9_-]+');

    // Get next question
    Route::get('/{sessionId}/question', [GameApiController::class, 'getQuestion'])
        ->name('api.game.question')
        ->where('sessionId', '[a-zA-Z0-9_-]+');

    // Submit an answer
    Route::post('/{sessionId}/answer', [GameApiController::class, 'submitAnswer'])
        ->name('api.game.answer')
        ->where('sessionId', '[a-zA-Z0-9_-]+');

    // Handle question timeout
    Route::post('/{sessionId}/timeout', [GameApiController::class, 'handleTimeout'])
        ->name('api.game.timeout')
        ->where('sessionId', '[a-zA-Z0-9_-]+');

    // End game and get final results
    Route::post('/{sessionId}/end', [GameApiController::class, 'endGame'])
        ->name('api.game.end')
        ->where('sessionId', '[a-zA-Z0-9_-]+');

    // Validate game action (anti-cheat)
    Route::post('/{sessionId}/validate-action', [GameApiController::class, 'validateAction'])
        ->name('api.game.validate')
        ->where('sessionId', '[a-zA-Z0-9_-]+');
});

// =========================================
// Blackboard Learn API Routes (Session-based auth)
// Direct integration with Blackboard Learn REST API
// =========================================
Route::prefix('api/blackboard-learn')->middleware(['auth', 'throttle:60,1'])->group(function () {
    // Courses
    Route::get('/courses', [BlackboardLearnController::class, 'getCourses'])
        ->name('api.blackboard.courses');
    Route::get('/courses/{courseId}', [BlackboardLearnController::class, 'getCourse'])
        ->name('api.blackboard.course');

    // Course content
    Route::get('/courses/{courseId}/contents', [BlackboardLearnController::class, 'getCourseContents'])
        ->name('api.blackboard.contents');
    Route::get('/courses/{courseId}/announcements', [BlackboardLearnController::class, 'getCourseAnnouncements'])
        ->name('api.blackboard.announcements');
    Route::get('/courses/{courseId}/assessments', [BlackboardLearnController::class, 'getCourseAssessments'])
        ->name('api.blackboard.assessments');

    // Gradebook
    Route::get('/courses/{courseId}/gradebook', [BlackboardLearnController::class, 'getGradebook'])
        ->name('api.blackboard.gradebook');
    Route::get('/courses/{courseId}/grades', [BlackboardLearnController::class, 'getUserGrades'])
        ->name('api.blackboard.grades');

    // Course memberships (for faculty)
    Route::get('/courses/{courseId}/members', [BlackboardLearnController::class, 'getCourseMemberships'])
        ->name('api.blackboard.members');

    // Quiz game integration
    Route::get('/courses/{courseId}/quiz-data', [BlackboardLearnController::class, 'getCourseQuizData'])
        ->name('api.blackboard.quiz-data');

    // Cache management
    Route::post('/courses/{courseId}/clear-cache', [BlackboardLearnController::class, 'clearCourseCache'])
        ->name('api.blackboard.clear-cache');
});

// Blackboard status endpoints (no auth required)
Route::get('/api/blackboard-learn/status', [BlackboardLearnController::class, 'status'])
    ->name('api.blackboard.status');

// Removed duplicate route and trailing slash redirect
// Route::get('/courses/{code}/', function($code) {
//     return redirect("/courses/$code", 301);
// });
// Route::get('/courses/{code}', [CoursesController::class, 'show'])->name('courses.show');

// Route::get('/quiz/{code}/start', [QuizController::class, 'start'])->name('quiz.start');

// Route::get('/receive-token', [TokenController::class, 'storeToken'])->name('token.receive');


Route::get('/receive-token', function (Request $request) {
    if ($request->has('token')) {
        $token = $request->get('token');
        session(['qspark_token' => $token]);
        // Redirect to home which will handle role-based redirection
        return redirect('/qspark');
    }

    return '❌ التوكن غير موجود';
})->name('token.receive');


Route::get('/test', function () {
    return 'test';
})->middleware('qspark.cache.views:60');

Route::get('/test-quiz-api', function () {
    return view('qspark::test-quiz-api');
});

// 🎮 راوت تجريبي للعبة - للاختبار والتطوير (النسخة القديمة)
Route::get('/game-test', function () {
    // أسئلة تجريبية - 6 أسئلة لتغطية جميع كتل الأسئلة في الخريطة
    $questions = [
        ['question' => 'ما نتيجة ٥ + ٥ ؟', 'options' => ['١٠', '١٥', '٥', '١'], 'correctIndex' => 0],
        ['question' => 'ماهي عاصمة المملكة العربية السعودية؟', 'options' => ['جدة', 'الرياض', 'مكة', 'الدمام'], 'correctIndex' => 1],
        ['question' => 'أكبر كوكب في المجموعة الشمسية هو؟', 'options' => ['الأرض', 'المريخ', 'المشتري', 'زحل'], 'correctIndex' => 2],
        ['question' => 'كم عدد أيام السنة؟', 'options' => ['360', '365', '366', '370'], 'correctIndex' => 1],
        ['question' => 'ما هي عاصمة فرنسا؟', 'options' => ['لندن', 'باريس', 'روما', 'برلين'], 'correctIndex' => 1],
        ['question' => 'كم عدد قارات العالم؟', 'options' => ['٥', '٦', '٧', '٨'], 'correctIndex' => 2],
    ];

    return view('qspark::quiz.index', [
        'questions' => $questions,
        'courseCode' => 'TEST',
        'threadId' => null,
        'code' => 'TEST',
        'courseName' => 'لعبة تجريبية',
        'studentId' => null,
        'pdfs' => [],
    ]);
});

// 🚀 راوت اللعبة الجديدة بـ React - احترافية ومتطورة
// Accounting-themed MCQ exam for Faisal's demo bundle, split into
// سهل / متوسط / صعب so the React game's adaptive difficulty engine
// (groupedQuestions in public/game-react) can pull from each bucket.
Route::get('/react-game-test', function () {
    $groupedQuestions = [
        'easy' => [
            ['id' => 'acct-e1', 'difficulty' => 'easy', 'q' => 'ما هي المعادلة المحاسبية الأساسية؟', 'qEn' => 'What is the basic accounting equation?',
                'options' => ['الأصول = الخصوم + حقوق الملكية', 'الأصول = الإيرادات − المصروفات', 'الأصول = النقدية + المخزون', 'الأصول = الخصوم − حقوق الملكية'], 'correct' => 0],
            ['id' => 'acct-e2', 'difficulty' => 'easy', 'q' => 'أي مما يلي يُعد أصلاً متداولاً؟', 'qEn' => 'Which of the following is a current asset?',
                'options' => ['المباني', 'الأراضي', 'المخزون', 'براءات الاختراع'], 'correct' => 2],
            ['id' => 'acct-e3', 'difficulty' => 'easy', 'q' => 'الإيرادات في قائمة الدخل تظهر كـ:', 'qEn' => 'Revenues in the income statement appear as:',
                'options' => ['مدين', 'دائن', 'أصل', 'خصم'], 'correct' => 1],
            ['id' => 'acct-e4', 'difficulty' => 'easy', 'q' => 'الفرق بين الإيرادات والمصروفات يُسمى:', 'qEn' => 'The difference between revenues and expenses is called:',
                'options' => ['رأس المال', 'صافي الدخل', 'الأصول', 'النقدية'], 'correct' => 1],
        ],
        'medium' => [
            ['id' => 'acct-m1', 'difficulty' => 'medium', 'q' => 'وفقاً لمعايير IFRS، تُقاس الأصول الثابتة مبدئياً بـ:', 'qEn' => 'Under IFRS, PP&E is initially measured at:',
                'options' => ['القيمة العادلة', 'التكلفة التاريخية', 'صافي القيمة الممكن تحقيقها', 'القيمة الحالية'], 'correct' => 1],
            ['id' => 'acct-m2', 'difficulty' => 'medium', 'q' => 'قيد إثبات مبيعات آجلة بقيمة 5,000 ريال يكون:', 'qEn' => 'The entry to record a credit sale of SAR 5,000 is:',
                'options' => ['من ح/ النقدية إلى ح/ المبيعات', 'من ح/ المدينين إلى ح/ المبيعات', 'من ح/ المبيعات إلى ح/ المدينين', 'من ح/ المخزون إلى ح/ المبيعات'], 'correct' => 1],
            ['id' => 'acct-m3', 'difficulty' => 'medium', 'q' => 'طريقة القسط الثابت لاحتساب الإهلاك تعتمد على:', 'qEn' => 'Straight-line depreciation is based on:',
                'options' => ['ساعات التشغيل الفعلية', 'الإنتاج السنوي', 'العمر الإنتاجي المقدّر', 'قيمة السوق الحالية'], 'correct' => 2],
            ['id' => 'acct-m4', 'difficulty' => 'medium', 'q' => 'نسبة التداول = الأصول المتداولة ÷ ......', 'qEn' => 'Current ratio = Current Assets ÷ ......',
                'options' => ['إجمالي الخصوم', 'الخصوم المتداولة', 'حقوق الملكية', 'صافي المبيعات'], 'correct' => 1],
        ],
        'hard' => [
            ['id' => 'acct-h1', 'difficulty' => 'hard', 'q' => 'عند تطبيق IFRS 15، يتم الاعتراف بالإيراد عند:', 'qEn' => 'Under IFRS 15, revenue is recognised when:',
                'options' => ['استلام النقدية', 'إصدار الفاتورة', 'انتقال السيطرة على البضاعة أو الخدمة', 'توقيع العقد'], 'correct' => 2],
            ['id' => 'acct-h2', 'difficulty' => 'hard', 'q' => 'صافي القيمة الحالية (NPV) لمشروع موجبة تعني:', 'qEn' => 'A positive NPV for a project means:',
                'options' => ['رفض المشروع', 'قبول المشروع', 'عدم كفاية البيانات', 'تأجيل القرار'], 'correct' => 1],
            ['id' => 'acct-h3', 'difficulty' => 'hard', 'q' => 'في تسوية البنك، الشيكات المعلّقة:', 'qEn' => 'In a bank reconciliation, outstanding checks are:',
                'options' => ['تُضاف إلى رصيد البنك', 'تُطرح من رصيد البنك', 'تُضاف إلى رصيد الدفاتر', 'تُطرح من رصيد الدفاتر'], 'correct' => 1],
            ['id' => 'acct-h4', 'difficulty' => 'hard', 'q' => 'وفق طريقة FIFO في تقييم المخزون، تكلفة البضاعة المباعة تُحتسب بأسعار:', 'qEn' => 'Under FIFO, COGS is valued at:',
                'options' => ['أحدث المشتريات', 'أقدم المشتريات', 'متوسط الفترة', 'سعر السوق'], 'correct' => 1],
        ],
    ];

    return view('qspark::quiz.react-game', [
        'groupedQuestions' => $groupedQuestions,
        'questions' => [],
        'courseCode' => 'ACCT350',
        'courseName' => 'مبادئ المحاسبة (تجريبي) — فيصل خالد',
        'studentId' => '443211517',
    ]);
});

Route::get('/test-quiz-generation', function () {
    // Test the quiz generation with fallback for ACCT241
    $controller = new \App\QSpark\Http\Controllers\QuizController();

    // Create a mock request
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'quiz_url' => 'https://api-test.qu.edu.sa/api/v2/courses/_478328_1/contents/_3633790_1/attachments/_5188254_1/generate-quiz',
        'course_code' => 'ACCT241'
    ]);

    // Set a test token in session
    session(['qspark_token' => 'test_token_for_debugging']);

    return $controller->generateQuizFromFile($request);
})->middleware('auth');

Route::get('/debug-quiz/{code}', function ($code) {
    $controller = new \App\QSpark\Http\Controllers\CoursesController();

    try {
        // Use reflection to access private method
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('findCourseByIdOrCode');
        $method->setAccessible(true);

        $course = $method->invoke($controller, $code);

        if (!$course) {
            return response()->json(['error' => 'Course not found', 'code' => $code], 404);
        }

        $courseCode = $course['code'] ?? $course['course_code'] ?? 'Unknown';
        $folderPath = public_path('courses/'.$courseCode.'/');

        return response()->json([
            'course_found' => true,
            'course_data' => $course,
            'course_code' => $courseCode,
            'folder_path' => $folderPath,
            'folder_exists' => file_exists($folderPath),
            'files_in_folder' => file_exists($folderPath) ? scandir($folderPath) : []
        ]);

    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::get('/debug-after-saml', function () {
    return [
        'authenticated' => auth()->check(),
        'user' => auth()->user()?->username,
        'session_id' => session()->getId(),
        'saml_processed' => session('saml_login_processed'),
        'login_timestamp' => session('login_timestamp'),
        'all_session' => session()->all(),
    ];
})->middleware(['web']);


// TODO:Add auth middleware for security

Route::get('/logs', function (Request $request) {
    $logFile = storage_path('logs/laravel.log');
    
    if (!file_exists($logFile)) {
        return response('Log file not found', 404);
    }
    
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $limit = $request->get('limit', 100);
    $filter = $request->get('filter');
    
    if ($filter) {
        $lines = array_filter($lines, fn($line) => stripos($line, $filter) !== false);
    }
    
    $recentLines = array_slice($lines, -$limit);
    
    return response('<pre>' . implode("\n", array_reverse($recentLines)) . '</pre>')
        ->header('Content-Type', 'text/html');
});

Route::get('/debug-cookies', function () {
    return [
        'session_id' => session()->getId(),
        'session_name' => config('session.cookie'),
        'cookies' => request()->cookies->all(),
        'headers' => request()->headers->all(),
        'authenticated' => auth()->check(),
        'user' => auth()->user()?->username,
    ];
});

Route::get('/test-cookie', function () {
    cookie()->queue('test_cookie', 'test_value', 60, '/', '.qu.edu.sa', true, true);
    return 'Test cookie set. Check your browser cookies.';
});

Route::get('/test-session', function () {
    session(['test_key' => 'test_value_' . time()]);
    return [
        'session_id' => session()->getId(),
        'test_value' => session('test_key'),
        'all_session' => session()->all()
    ];
});

Route::get('/check-session', function () {
    return [
        'session_id' => session()->getId(),
        'test_value' => session('test_key'),
        'authenticated' => auth()->check(),
        'user' => auth()->user()
    ];
});

Route::post('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'ar'])) {
        session(['locale' => $locale]);
        app()->setLocale($locale);
        
        // Return immediately without heavy operations
        return response()->json([
            'success' => true,
            'locale' => $locale,
            'dir' => $locale === 'ar' ? 'rtl' : 'ltr'
        ]);
    }
    return response()->json(['success' => false, 'message' => 'Invalid locale'], 400);
})->name('lang.switch')->middleware('throttle:10,1');


Route::get('/usage', [UsageController::class, 'index'])->name('usage.dashboard')->middleware(['auth', 'qspark.role:admin', 'qspark.timeout:90']);

// Debug route to check current user
Route::get('/debug-user', function(\Illuminate\Http\Request $request) {
    $user = auth()->user();
    if (!$user) {
        return 'Not logged in';
    }

    $startDate = $request->start_date ?? '2025-09-20';
    $endDate = $request->end_date ?? '2025-11-18';

    $student = \App\QSpark\Models\Student::where('student_id', $user->uuid)->first();

    // Get play hours with detailed stats
    $playHoursData = \App\QSpark\Models\StudentPlayHour::where('student_id', $user->uuid)
        ->whereBetween('play_date', [$startDate, $endDate])
        ->selectRaw('COUNT(*) as sessions, SUM(minutes_played) as total_minutes')
        ->first();

    $playHours = \App\QSpark\Models\StudentPlayHour::where('student_id', $user->uuid)
        ->whereBetween('play_date', [$startDate, $endDate])
        ->get();

    return [
        'date_range' => [
            'start' => $startDate,
            'end' => $endDate,
        ],
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'uuid' => $user->uuid,
        ],
        'student' => $student ? [
            'game_points' => $student->game_points,
            'total_study_hours' => $student->total_study_hours,
            'game_attempts' => $student->game_attempts,
        ] : 'No student record',
        'play_hours_count' => $playHours->count(),
        'total_sessions' => $playHoursData->sessions,
        'total_minutes' => $playHoursData->total_minutes,
        'calculated_points' => $playHoursData->total_minutes * 15,
        'play_hours' => $playHours->map(function($p) {
            return [
                'date' => $p->play_date,
                'minutes' => $p->minutes_played,
            ];
        }),
    ];
})->middleware('auth');

Route::post('/quiz/generate', [QuizController::class, 'generateQuiz'])->name('quiz.generate')->middleware(['auth', 'throttle:5,1']);
Route::post('/quiz/generate-from-file', [QuizController::class, 'generateQuizFromFile'])->name('quiz.generate.file')->middleware(['auth', 'throttle:3,1']);
Route::post('/quiz/record-performance', [QuizController::class, 'recordPerformance'])->name('quiz.record.performance')->middleware('auth');
Route::post('/quiz/next-question', [QuizController::class, 'getNextQuestion'])->name('quiz.next.question')->middleware('auth');
Route::post('/quiz/export-for-student', [QuizController::class, 'exportQuestionsForStudent'])->name('quiz.export.student')->middleware('auth');
Route::post('/quiz/check-export-status', [QuizController::class, 'checkExportStatus'])->name('quiz.check.export')->middleware('auth');

Route::post('/api/record-play-time', [PlayTimeController::class, 'recordPlayTime']);

Route::get('/fetch-token', function () {
    if (!auth()->check()) {
        return redirect('/qspark');
    }
    
    $redirectUrl = urlencode(route('qspark.token.receive'));
    $baseUrl = match(config('app.env')) {
        'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
        'production' => 'https://api.qu.edu.sa',
        default => 'https://api-test.qu.edu.sa',
    };
    return redirect("{$baseUrl}/web/login?redirect={$redirectUrl}");
})->name('fetch.token');

Route::match(['get', 'post'], '/logout', function () {
    if (!auth()->check()) {
        return redirect('/qspark');
    }
    Log::info('User initiated logout', [
        'username' => auth()->user()->username,
        'method' => request()->method(),
    ]);
    if (config('app.demo_mode')) {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/qspark');
    }
    return redirect()->route('qspark.saml2_logout', ['idpName' => samlIdpForCurrentEnv()]);
})->name('logout');


// Cache management routes (for development/admin use)
Route::get('/cache/status', [CacheStatusController::class, 'index'])->name('cache.status')->middleware('qspark.cache.views:60');
Route::post('/cache/clear', [CacheStatusController::class, 'clear'])->name('cache.clear');

// Performance monitoring
Route::get('/performance/status', [\App\QSpark\Http\Controllers\PerformanceController::class, 'status'])->name('performance.status')->middleware('qspark.cache.views:60');

Route::post('/courses/{id}/download-file/{fileName}', [CoursesController::class, 'downloadFile'])->name('courses.download.file')->middleware('auth');
Route::get('/courses/{id}/download-all-api', [CoursesController::class, 'downloadAllFiles'])->name('courses.download.all.api')->middleware('auth');
Route::get('/courses/{id}/debug', [CoursesController::class, 'debugCourseData'])->name('courses.debug');
// New route for downloading Blackboard attachments
Route::get('/courses/blackboard/{externalId}/contents/{contentId}/attachments/{attachmentId}/download', [CoursesController::class, 'downloadBlackboardAttachment'])->name('courses.blackboard.download')->middleware('auth');
