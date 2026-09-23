<?php

namespace App\Filament\Pages;

use App\Services\Advising\AdvisingBoardData;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\SubNavigationPosition;
use Livewire\Attributes\Url;

/**
 * الإرشاد الأكاديمي الاستباقي — the board for advising the university starts.
 *
 * Every other advising screen counts what students asked for. This one reports
 * on the meetings nobody asked for: a step fires on a student's record, their
 * timetable is compared with their advisor's, and the first shared gap inside
 * working hours becomes a booking. Two decisions are served by it — whether the
 * detection is finding the right students, and whether the automation can be
 * defended to the advisor who has to sit in the meeting.
 *
 * Three things it refuses to do, each because the opposite reads as good news:
 * a step whose source is not live shows معطّلة rather than 0, a ratio with a
 * zero denominator shows «لا تتوفر بيانات بعد» rather than 0٪, and الأثر stays
 * empty until a meeting has actually been held and re-measured. A board that
 * reports effort as impact is worse than one that reports nothing.
 *
 * ── النطاق ────────────────────────────────────────────────────────────────
 * The grade data behind these signals is fetched with an origin token that
 * authenticates the system rather than the person, so the upstream will answer
 * for any student id it is given. This page's scope is the only thing standing
 * between an advisor and a record that is not theirs — which is why it is
 * applied to the rows in AdvisingBoardData and not to the tab list here.
 */
class ProactiveAdvisingDashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    protected static ?string $navigationLabel = 'الإرشاد الاستباقي';

    protected static ?string $title = 'Qmentor — الإرشاد الاستباقي';

    public static function getNavigationGroup(): ?string
    {
        return __('messages.nav_group_dashboards');
    }

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.proactive-advising-dashboard';

    protected static ?string $slug = 'proactive-advising';

    /**
     * Validated against on mount, and deliberately a plain list rather than a
     * read of tabs(): validating the URL must not cost the counts query that
     * builds the badges.
     */
    private const TAB_KEYS = ['overview', 'triggers', 'students', 'appointments', 'scheduling', 'impact'];

    /**
     * The open tab, kept in the URL so a finding can be sent to whoever has to
     * act on it. It carries no authority: every tab reads the same scoped
     * queries, so typing another tab's name changes what is drawn and never
     * whose rows are drawn.
     */
    #[Url(as: 'tab', keep: true)]
    public string $tab = 'overview';

    /** SIS semester key. Empty means config('advising.semesters.current'). */
    #[Url(as: 'semester', keep: true)]
    public string $semester = '';

    /**
     * Filters, for a viewer entitled to the whole university. A scoped advisor
     * may set them in the URL and they will narrow — never widen; see
     * effectiveAdvisor().
     */
    #[Url(as: 'advisor', keep: true)]
    public string $advisorFilter = '';

    #[Url(as: 'faculty', keep: true)]
    public string $facultyFilter = '';

    /** The student whose week the scheduling grid explains. */
    #[Url(as: 'student', keep: true)]
    public string $student = '';

    /**
     * A trigger code narrowing the students tab — set by clicking a bar on the
     * trigger chart. In the URL so a finding («طلاب T5») can be sent as a link.
     * Like every filter it narrows an already-scoped query; it cannot widen.
     */
    #[Url(as: 'trigger', keep: true)]
    public string $trigger = '';

    /**
     * Paging for the two long lists (students, appointments). One pair of
     * values serves both tabs: the page resets whenever the tab or any filter
     * changes, so a page number never outlives the list it was counted on.
     */
    #[Url(as: 'page', keep: true)]
    public int $page = 1;

    #[Url(as: 'per', keep: true)]
    public int $perPage = AdvisingBoardData::DEFAULT_PER_PAGE;

    /**
     * The student whose dossier slide-over is open. NOT a URL property: the id
     * arrives through openDossier() and is authorized in the data layer either
     * way, but a deep link that opens a modal over whatever tab loads reads as
     * a broken page rather than a shared finding.
     */
    public ?string $dossierStudent = null;

    /**
     * The appointment whose minutes/recommendations window is open. Same
     * reasoning as $dossierStudent: not a URL property, authorized in the data
     * layer on every read.
     */
    public ?int $openAppointmentId = null;

    /**
     * Per-render memos. Protected properties, not Livewire ones: the tab bar and
     * the panel both ask for these, and they must not survive the request — a
     * cached count on the component is a count that outlives the sweep.
     *
     * @var array<int, array<string, mixed>>|null
     */
    protected ?array $strip = null;

    /** @var array<int, array<string, mixed>>|null */
    protected ?array $triggerRows = null;

    /** @var array<string, mixed>|null */
    protected ?array $countRow = null;

    /** @var array<string, mixed>|null */
    protected ?array $gapRow = null;

    /** Demo build: the admin reads the university, a faculty member their own caseload. */
    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user !== null && ($user->isAdmin() || $user->hasRole('Faculty'));
    }

    public function mount(): void
    {
        // An unknown ?tab= renders an empty panel, which reads as a broken page
        // rather than a mistyped URL. It is not a security control — the data
        // layer is — only a courtesy.
        if (! in_array($this->tab, self::TAB_KEYS, true)) {
            $this->tab = 'overview';
        }

        // Semesters are whitelisted because everything downstream keys on them;
        // an arbitrary string is a query that can only ever return nothing.
        if ($this->semester !== '' && ! in_array($this->semester, $this->data()->semesterCodes(), true)) {
            $this->semester = '';
        }

        // An unknown trigger code is a filter that matches nothing — the page
        // would render empty with no visible cause, so it is dropped instead.
        if ($this->trigger !== '' && ! array_key_exists($this->trigger, (array) config('advising.triggers', []))) {
            $this->trigger = '';
        }

        // ?per=1000 would be a way to ask for the whole list in one page and
        // ?page=0 a way to draw nothing; both fall back rather than fail.
        if (! in_array($this->perPage, AdvisingBoardData::PER_PAGE_OPTIONS, true)) {
            $this->perPage = AdvisingBoardData::DEFAULT_PER_PAGE;
        }

        $this->page = max(1, $this->page);
    }

    // ── الترقيم ───────────────────────────────────────────────────────────

    /**
     * Livewire hooks: any change to what the list is a list OF sends the
     * reader back to page 1. Staying on page 4 of a filter that now has one
     * page reads as «no students», which is the wrong answer to a filter.
     */
    public function updatedTab(): void
    {
        $this->page = 1;
        $this->openAppointmentId = null;
    }

    public function updatedSemester(): void
    {
        $this->page = 1;
        $this->openAppointmentId = null;
    }

    public function updatedTrigger(): void
    {
        $this->page = 1;
    }

    public function updatedAdvisorFilter(): void
    {
        $this->page = 1;
    }

    public function updatedFacultyFilter(): void
    {
        $this->page = 1;
    }

    public function updatedPerPage(): void
    {
        if (! in_array($this->perPage, AdvisingBoardData::PER_PAGE_OPTIONS, true)) {
            $this->perPage = AdvisingBoardData::DEFAULT_PER_PAGE;
        }

        $this->page = 1;
    }

    public function updatedPage(): void
    {
        $this->page = max(1, $this->page);
    }

    public function nextPage(): void
    {
        $this->page++;
    }

    public function previousPage(): void
    {
        $this->page = max(1, $this->page - 1);
    }

    public function gotoPage(int $page): void
    {
        $this->page = max(1, $page);
    }

    /**
     * The `<option>`s of the per-page select — read from the data layer so the
     * whitelist in mount() and the choices offered can never disagree.
     *
     * @return array<int, int>
     */
    public function perPageOptions(): array
    {
        return AdvisingBoardData::PER_PAGE_OPTIONS;
    }

    // ── النطاق ────────────────────────────────────────────────────────────

    /**
     * True when the viewer may see only their own caseload.
     *
     * `view_all_dashboards` is the single grant that opens the university. A
     * page permission opens the board, not the population — so a deanship
     * account issued view_advising_proactive_dashboard alone still sees exactly
     * the students assigned to it, which for most such accounts is none.
     */
    public function scopedToOwnCaseload(): bool
    {
        return ! (auth()->user()?->isAdmin() ?? false);
    }

    /**
     * The viewer's own advisor id, or null when they hold the university-wide
     * permission.
     *
     * Returns '' — scoped to nobody — for a scoped viewer who is not a faculty
     * member or carries no employee id. That is the safe direction to fail in:
     * an unresolvable caseload becomes an empty board, never the whole
     * university. SIS keys an advisor by employee id and SAML puts the same
     * value on the account, so anyone without one matches no caseload row.
     */
    public function ownAdvisorId(): ?string
    {
        if (! $this->scopedToOwnCaseload()) {
            return null;
        }

        $user = auth()->user();

        if ($user === null || ! $user->hasRole('Faculty')) {
            return '';
        }

        // The demo faculty account advises as the synthetic cohort's first advisor.
        return (string) ($user->employee_id ?: \App\Support\DemoCohort::DEMO_INSTRUCTOR_ID);
    }

    /**
     * The advisor every query is narrowed to.
     *
     * A scoped viewer's own id wins outright: the `?advisor=` filter is read
     * only for someone already entitled to the whole university, so the filter
     * can narrow a wide view but can never widen a narrow one.
     */
    public function effectiveAdvisor(): ?string
    {
        $own = $this->ownAdvisorId();

        if ($own !== null) {
            return $own;
        }

        return $this->advisorFilter !== '' ? $this->advisorFilter : null;
    }

    public function effectiveFaculty(): ?string
    {
        return $this->facultyFilter !== '' ? $this->facultyFilter : null;
    }

    public function currentSemester(): string
    {
        return $this->semester !== ''
            ? $this->semester
            : (string) config('advising.semesters.current', \App\Support\DemoCohort::SEMESTER);
    }

    public function data(): AdvisingBoardData
    {
        return app(AdvisingBoardData::class);
    }

    // ── التبويبات ─────────────────────────────────────────────────────────

    /**
     * The six tabs, each stating what it is for.
     *
     * Every tab is offered to every viewer, scoped or not. Hiding tabs would
     * suggest a boundary that is not there — the boundary is on the rows, and a
     * scoped advisor opening المواعيد sees their own bookings rather than an
     * error.
     *
     * @return array<int, array{key: string, label: string, badge: int|null, unit: string, goal: string}>
     */
    public function tabs(): array
    {
        $counts = $this->getCounts();

        return [
            [
                'key' => 'overview',
                'label' => 'نظرة عامة',
                'badge' => null,
                'unit' => '',
                'goal' => 'الهدف: حجم الحاجة عبر الفصول المرصودة، ونسبة ما بادر به النظام منها.'
                    .' كل مؤشر مكتوبة بجانبه معادلته، لأن نسبةً بلا قاسم معلن ليست قياساً.',
            ],
            [
                'key' => 'triggers',
                'label' => 'الخطوات الاستباقية',
                'badge' => count((array) config('advising.triggers', [])),
                'unit' => 'خطوة',
                'goal' => 'الهدف: أي خطوة تعمل وأيها بانتظار مصدرها. الخطوة المعطّلة تُكتب معطّلة'
                    .' لا صفراً — «لم يُرصد أحد» و«لم نسأل قط» يبدوان متطابقين ويعنيان النقيض.',
            ],
            [
                'key' => 'students',
                'label' => $this->studentsHeading(),
                'badge' => $counts['signal_students'],
                'unit' => 'طالب',
                'goal' => 'الهدف: من ظهرت له إشارة، ولماذا بالضبط. الأشد أولاً — ومن جمع خطوتين'
                    .' فأكثر قبل الجميع، لأن التعثّر المركّب لا يُقرأ من خطوة واحدة.',
            ],
            [
                'key' => 'appointments',
                'label' => 'المواعيد',
                // The badge answers "how many cards will I see", and the hero
                // tiles count the same rows through countable() — demo rows
                // included in both, so the number above never disagrees with
                // the cards below it.
                'badge' => $this->listedAppointments(),
                'unit' => 'موعد',
                'goal' => 'الهدف: ما حُجز فعلاً، ومتى وكيف ولماذا في ذلك الوقت — ويفصل بوضوح بين'
                    .' موعدٍ حُسب وموعدٍ أُرسل إلى تقويم الطالب ومرشده.',
            ],
            [
                'key' => 'scheduling',
                'label' => 'الجدولة الذكية',
                'badge' => null,
                'unit' => '',
                'goal' => 'الهدف: شبكة الأسبوع التي أنتجت الموعد — انشغال الطالب وانشغال المرشد'
                    .' والفراغ المختار وبدائله. قرارٌ آليّ لا يمكن استجوابه لن يثق به أحد.',
            ],
            [
                'key' => 'impact',
                'label' => 'الأثر',
                'badge' => null,
                'unit' => '',
                'goal' => 'الهدف: ما الذي تغيّر بعد اللقاءات المنعقدة. يبقى فارغاً حتى تُقاس أول'
                    .' نتيجة، لأن كل ما عداه يقيس الجهد لا الأثر.',
            ],
        ];
    }

    /** «طلابي» for an advisor, «الطلاب» for whoever sees the university. */
    public function studentsHeading(): string
    {
        return $this->scopedToOwnCaseload() ? 'طلابي' : 'الطلاب';
    }

    // ── البيانات ──────────────────────────────────────────────────────────

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getStrip(): array
    {
        return $this->strip ??= $this->data()->semesterStrip(
            $this->effectiveAdvisor(),
            $this->effectiveFaculty(),
        );
    }

    /** Appointments the tab will actually list, in the current scope. */
    private function listedAppointments(): int
    {
        return (int) ($this->data()->appointmentsPage(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            1,
            AdvisingBoardData::DEFAULT_PER_PAGE,
        )['total'] ?? 0);
    }

    /**
     * @return array<string, mixed>
     */
    public function getCounts(): array
    {
        return $this->countRow ??= $this->data()->counts(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            // The headline follows the trigger chip: filtered to one step, the
            // hero row counts that step's students, so «طالباً برصد» is the
            // same population the الطلاب tab lists rather than the whole term.
            $this->trigger !== '' ? $this->trigger : null,
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getKpis(): array
    {
        return $this->data()->kpis(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getTriggers(): array
    {
        return $this->triggerRows ??= $this->data()->triggers(
            $this->effectiveAdvisor(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getStudents(): array
    {
        return $this->getStudentsPage()['items'];
    }

    /**
     * The current page of the queue with its scoped total. The page number
     * the data layer clamped to is written back so the pager and the URL
     * agree with what was drawn.
     *
     * @return array{items: array<int, array<string, mixed>>, total: int, page: int, per_page: int, last_page: int}
     */
    public function getStudentsPage(): array
    {
        $result = $this->data()->studentsPage(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            $this->page,
            $this->perPage,
            $this->trigger !== '' ? $this->trigger : null,
        );

        $this->page = $result['page'];

        return $result;
    }

    /** The Arabic label of the active trigger filter, for the chip that clears it. */
    public function triggerFilterLabel(): ?string
    {
        if ($this->trigger === '') {
            return null;
        }

        return (string) config("advising.triggers.{$this->trigger}.label", $this->trigger);
    }

    // ── رسوم النظرة العامة ────────────────────────────────────────────────

    /**
     * @return array<string, mixed>
     */
    public function getFunnel(): array
    {
        return $this->data()->funnel(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getSeveritySplit(): array
    {
        return $this->data()->severitySplit(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            $this->trigger !== '' ? $this->trigger : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getTrend(): array
    {
        return $this->data()->weeklyTrend(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * Bars for the trigger chart: distinct students per available step in the
     * viewed semester, largest first. Derived from getTriggers() rather than a
     * query of its own so the chart and the table can never disagree.
     *
     * Disabled steps are counted, not drawn as zero-length bars: a bar of zero
     * reads as «مُسحت ولم يظهر أحد», which is the opposite of معطّلة.
     *
     * @return array{rows: array<int, array{code: string, label: string, students: int}>, max: int, disabled: int}
     */
    public function getTriggerChart(): array
    {
        $codes = $this->data()->semesterCodes();
        $index = array_search($this->currentSemester(), $codes, true);
        $index = $index === false ? 0 : $index;

        $rows = [];
        $disabled = 0;

        foreach ($this->getTriggers() as $trigger) {
            if (! $trigger['available']) {
                $disabled++;

                continue;
            }

            $rows[] = [
                'code' => $trigger['code'],
                'label' => $trigger['label'],
                'students' => (int) ($trigger['semesters'][$index] ?? 0),
            ];
        }

        usort($rows, fn (array $a, array $b) => [$b['students'], $a['code']] <=> [$a['students'], $b['code']]);

        return [
            'rows' => $rows,
            'max' => $rows === [] ? 0 : max(array_column($rows, 'students')),
            'disabled' => $disabled,
        ];
    }

    // ── ملف الطالب ────────────────────────────────────────────────────────

    /** @var array<string, mixed>|null */
    protected ?array $sisRow = null;

    /**
     * أعداد الفصل من SIS — one request, memoised per render.
     *
     * @return array<string, mixed>
     */
    public function getSisSummary(): array
    {
        return $this->sisRow ??= $this->data()->sisSummary(
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getDossier(): ?array
    {
        if ($this->dossierStudent === null || $this->dossierStudent === '') {
            return null;
        }

        // The scope travels with the request: a scoped advisor asking for a
        // foreign id gets the refusal shape back from the data layer — the
        // page adds nothing to that decision and cannot subtract from it.
        return $this->data()->dossier(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->dossierStudent,
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getAppointments(): array
    {
        return $this->getAppointmentsPage()['items'];
    }

    /**
     * @return array{items: array<int, array<string, mixed>>, total: int, page: int, per_page: int, last_page: int}
     */
    public function getAppointmentsPage(): array
    {
        $result = $this->data()->appointmentsPage(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            $this->page,
            $this->perPage,
        );

        $this->page = $result['page'];

        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    public function getSchedule(): array
    {
        return $this->data()->schedule(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            // The student id is a URL parameter and is deliberately passed as a
            // filter on an already-narrowed query rather than as a lookup key.
            // Naming somebody else's student here narrows the scope to nothing
            // and draws no grid; it cannot reach across it.
            $this->student !== '' ? $this->student : null,
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<int, array{student_id: string, advisor_employee_id: string, label: string}>
     */
    public function getPairs(): array
    {
        return $this->data()->schedulablePairs(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getImpact(): array
    {
        return $this->data()->impact(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /**
     * @return array{advisors: array<int, array{id: string, students: int}>, faculties: array<int, array{name: string, students: int}>}
     */
    public function getFilterOptions(): array
    {
        // Only a viewer entitled to the whole university is offered the lists;
        // for anyone else they would be a directory of colleagues and their
        // caseload sizes, which is not this board's business to publish.
        if ($this->scopedToOwnCaseload()) {
            return ['advisors' => [], 'faculties' => []];
        }

        return $this->data()->filterOptions($this->currentSemester());
    }

    /**
     * How much of the board is visible but not schedulable.
     *
     * The student-side sweep reaches every advisor in the university, including
     * those who have never signed in — but it reaches them by work email, and an
     * advisor with no employee number can be issued no instructor JWT, so their
     * timetable cannot be read and no meeting can be matched for their students.
     * Printed on the board because otherwise it presents as المطابقة failing:
     * matched counts trailing detected ones with no stated reason.
     *
     * @return array<string, mixed>
     */
    public function getSchedulableGap(): array
    {
        return $this->gapRow ??= $this->data()->schedulableGap(
            $this->currentSemester(),
            $this->effectiveAdvisor(),
            $this->effectiveFaculty(),
        );
    }

    public function getCaseloadSize(): int
    {
        return $this->data()->caseloadSize(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
        );
    }

    /** True when the advising tables have not been created yet. */
    public function isReady(): bool
    {
        return $this->data()->ready();
    }

    // ── نطاق المرشّحات (للرأس) ────────────────────────────────────────────

    /** True when any narrowing filter is applied on top of the viewer's scope. */
    public function isFiltered(): bool
    {
        return $this->advisorFilter !== '' || $this->facultyFilter !== '' || $this->trigger !== '';
    }

    /**
     * The same counts with no advisor/faculty filter — the baseline the header
     * compares against, so a filter visibly does something («9 من 594»).
     * Null when nothing is filtered, so no second query is paid for.
     *
     * @return array<string, mixed>|null
     */
    public function getBaselineCounts(): ?array
    {
        if (! $this->isFiltered()) {
            return null;
        }

        // No advisor, no faculty, no trigger: the whole term, so a filtered
        // hero can say «24 من 2,355 في الجامعة» and the reader sees what the
        // filter did rather than two unrelated numbers on one screen.
        return $this->data()->counts(
            $this->ownAdvisorId(),
            $this->currentSemester(),
            null,
            null,
        );
    }

    /**
     * The chosen advisor's display label, for the scope line in the header
     * («المرشد: ماجد القسومي») — the id alone is not a name anyone reads.
     */
    public function advisorFilterLabel(): ?string
    {
        if ($this->advisorFilter === '') {
            return null;
        }

        foreach ($this->getFilterOptions()['advisors'] as $a) {
            if ((string) $a['id'] === $this->advisorFilter) {
                return (string) ($a['label'] ?? $a['name'] ?? $a['id']);
            }
        }

        return $this->advisorFilter;
    }

    /**
     * The handful of students who need a human first — the top of the queue
     * in the current scope, for the «أولويات الآن» rail on the overview.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPriorityStudents(int $limit = 5): array
    {
        if (! $this->isReady()) {
            return [];
        }

        return $this->data()->studentsPage(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->effectiveFaculty(),
            1,
            $limit,
            $this->trigger !== '' ? $this->trigger : null,
        )['items'] ?? [];
    }

    public function setSemester(string $code): void
    {
        if (! in_array($code, $this->data()->semesterCodes(), true)) {
            return;
        }

        $this->semester = $code;
        $this->page = 1;
        $this->openAppointmentId = null;
    }

    // ── إجراءات ───────────────────────────────────────────────────────────

    public function clearFilters(): void
    {
        $this->advisorFilter = '';
        $this->facultyFilter = '';
        $this->student = '';
        $this->trigger = '';
        $this->page = 1;
    }

    /**
     * The trigger-bar drill-through: clicking «T1» opens the students tab
     * narrowed to that step. Unknown codes are ignored rather than stored — a
     * stored one would survive into the URL and render an unexplained empty
     * board.
     */
    public function filterByTrigger(string $code): void
    {
        if (! array_key_exists($code, (array) config('advising.triggers', []))) {
            return;
        }

        $this->trigger = $code;
        $this->tab = 'students';
        $this->page = 1;
    }

    public function clearTriggerFilter(): void
    {
        $this->trigger = '';
        $this->page = 1;
    }

    /**
     * Opens the drill-down window. Deliberately no authorization here: the id
     * is a raw string from the browser, and the refusal lives in
     * AdvisingBoardData::dossier() where it cannot be bypassed by calling this
     * action directly. Hiding a button is not a boundary.
     */
    public function openDossier(string $studentId): void
    {
        $studentId = trim($studentId);

        $this->dossierStudent = $studentId !== '' ? $studentId : null;
    }

    public function closeDossier(): void
    {
        $this->dossierStudent = null;
    }

    public function openAppointment(int $id): void
    {
        $this->openAppointmentId = $id > 0 ? $id : null;
    }

    public function closeAppointment(): void
    {
        $this->openAppointmentId = null;
    }

    /**
     * From the appointment window straight to the student's file — the window
     * closes first so the two never stack.
     */
    public function openDossierFromAppointment(string $studentId): void
    {
        $this->openAppointmentId = null;
        $this->openDossier($studentId);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getAppointment(): ?array
    {
        if ($this->openAppointmentId === null) {
            return null;
        }

        return $this->data()->appointment(
            $this->effectiveAdvisor(),
            $this->currentSemester(),
            $this->openAppointmentId,
            $this->effectiveFaculty(),
        );
    }

    public function refreshData(): void
    {
        $this->data()->forget();

        $this->strip = null;
        $this->triggerRows = null;
        $this->sisRow = null;
        $this->countRow = null;
        $this->gapRow = null;

        Notification::make()
            ->title('أُسقطت النسخة المخزّنة')
            ->body('ستُقرأ الأرقام من جداول الإرشاد مباشرة. الرصد نفسه يعمل ليلاً ولا يُستدعى من صفحة.')
            ->success()
            ->send();
    }
}
