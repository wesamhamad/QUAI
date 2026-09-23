const BASE_URL = '/api/qmentor';

export interface ApiResponse<T = unknown> {
  data: T | null;
  source: 'api' | 'unavailable';
}

/**
 * Resolve the active student-impersonation id. The TopBar switcher puts it in
 * the URL (?as=<id>) and does a full reload; we mirror it into sessionStorage
 * so it survives client-side navigation, where react-router <Link>s drop the
 * query string. Every API request then re-appends it.
 */
function getImpersonationId(): string | null {
  if (typeof window === 'undefined') return null;
  const fromUrl = new URLSearchParams(window.location.search).get('as');
  if (fromUrl) {
    try { sessionStorage.setItem('qmentor:as', fromUrl); } catch { /* ignore */ }
    return fromUrl;
  }
  try { return sessionStorage.getItem('qmentor:as'); } catch { return null; }
}

/**
 * Append ?as=<id> (or &as=) to a path when a student is being impersonated.
 * An explicit `studentId` (e.g. the student picked in the Digital Twin list)
 * takes precedence over the page-level impersonation id.
 */
function withImpersonation(path: string, studentId?: string | null): string {
  const as = studentId ?? getImpersonationId();
  if (!as) return path;
  return `${path}${path.includes('?') ? '&' : '?'}as=${encodeURIComponent(as)}`;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit, studentId?: string | null): Promise<T> {
    const url = `${this.baseUrl}${withImpersonation(path, studentId)}`;
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  }

  get<T>(path: string, studentId?: string | null) {
    return this.request<T>(path, { method: 'GET' }, studentId);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  // Student endpoints — an optional studentId overrides the page-level ?as= id.
  getStudentProfile(studentId?: string | null) {
    return this.get<ApiResponse>('/student/profile', studentId);
  }

  getCurrentCourses(studentId?: string | null) {
    return this.get<ApiResponse>('/student/courses', studentId);
  }

  getAcademicTransactions(studentId?: string | null) {
    return this.get<ApiResponse>('/student/transactions', studentId);
  }

  getStudentPlan() {
    return this.get<ApiResponse>('/student/plan');
  }

  getTimetable() {
    return this.get<ApiResponse>('/student/timetable');
  }

  getFinalExams() {
    return this.get<ApiResponse>('/student/exams');
  }

  getAbsences(studentId?: string | null) {
    return this.get<ApiResponse>('/student/absences', studentId);
  }

  getAllCourseGrades() {
    return this.get<ApiResponse>('/student/grades');
  }

  getAdvisorInfo() {
    return this.get<ApiResponse>('/student/advisor');
  }

  async getAcademicAdvisor(): Promise<ApiResponse> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    const res = await fetch(withImpersonation('/api/v2/academic-advisor'), {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json', ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}) },
    });
    return res.json();
  }

  getRewards() {
    return this.get<ApiResponse>('/student/rewards');
  }

  getStudentSkills() {
    return this.get<ApiResponse>('/student/skills');
  }

  // Academic endpoints
  getAcademicCalendar() {
    return this.get<ApiResponse>('/academic/calendar');
  }

  getDepartments() {
    return this.get<ApiResponse>('/academic/departments');
  }

  getAvailableCourses() {
    return this.get<ApiResponse>('/academic/available-courses');
  }

  getAnnouncements() {
    return this.get<ApiResponse>('/blackboard/announcements');
  }

  getCourseContent(courseId: string) {
    return this.get<ApiResponse>(`/blackboard/courses/${courseId}/contents`);
  }

  getCourseGrades(courseId: string) {
    return this.get<ApiResponse>(`/blackboard/courses/${courseId}/grades`);
  }

  searchStudents(name: string) {
    return this.get<ApiResponse>(`/students/search/${encodeURIComponent(name)}`);
  }

  // Standing & risk
  getWarnings() {
    return this.get<ApiResponse>('/student/warnings');
  }

  getMajorChanges() {
    return this.get<ApiResponse>('/student/major-changes');
  }

  getHaltReasons() {
    return this.get<ApiResponse>('/student/halt-reasons');
  }

  getPenalties() {
    return this.get<ApiResponse>('/student/penalties');
  }

  // Academic plan (v1)
  getAcademicPlanForMe() {
    return this.get<ApiResponse>('/academic-plan/me');
  }

  getAcademicPlanByMajor(majorNo: string) {
    return this.get<ApiResponse>(`/academic-plan/major/${encodeURIComponent(majorNo)}`);
  }

  getAcademicPlanSummary(majorNo: string) {
    return this.get<ApiResponse>(`/academic-plan/major/${encodeURIComponent(majorNo)}/summary`);
  }

  // Major-change planner
  getMajorsInMyFaculty() {
    return this.get<ApiResponse>('/majors/my-faculty');
  }

  compareMajor(targetMajorNo: string) {
    return this.get<ApiResponse>(`/majors/compare/${encodeURIComponent(targetMajorNo)}`);
  }

  // ── Ported from the live build: risk engine, advisor caseload, cohort, admin ──
  // Risk engine — 31 indicators (SRS §5.B/§5.C), computed nightly on the server
  getRiskMe() {
    return this.get<ApiResponse>('/risk/me');
  }

  getRiskStudent(studentId: string) {
    return this.get<ApiResponse>(`/risk/students/${encodeURIComponent(studentId)}`);
  }

  getRiskCaseload(ids: string[], all = false) {
    return this.get<ApiResponse>(all ? '/risk/caseload?all=1' : `/risk/caseload?ids=${encodeURIComponent(ids.join(','))}`);
  }

  getMyInterventions() {
    return this.get<ApiResponse>('/interventions');
  }

  logIntervention(body: { student_id: string; type: string; note: string; outcome?: string; follow_up?: string }) {
    return this.post<ApiResponse>('/interventions', body);
  }

  getApprovals() {
    return this.get<ApiResponse>('/approvals');
  }

  decideApproval(id: number, decision: 'approve' | 'reject', note?: string) {
    return this.post<ApiResponse>(`/approvals/${id}/decide`, { decision, note });
  }

  overrideRisk(studentId: string, level: number, reason: string) {
    return this.post<ApiResponse>(`/risk/students/${encodeURIComponent(studentId)}/override`, { level, reason });
  }

  getAutonomy() {
    return this.get<ApiResponse>('/autonomy');
  }

  getFacultyOverview(faculty?: string) {
    return this.get<ApiResponse>(`/faculty/overview${faculty ? `?faculty=${encodeURIComponent(faculty)}` : ''}`);
  }

  getRiskBacktest() {
    return this.get<ApiResponse>('/risk/backtest');
  }

  getRiskCohort(faculty?: string) {
    return this.get<ApiResponse>(`/risk/cohort${faculty ? `?faculty=${encodeURIComponent(faculty)}` : ''}`);
  }

  /** Own Blackboard from the cohort snapshots: {grades, activity, submissions} — `unavailable` until the sweep stored them. */
  getMyBlackboard() {
    return this.get<ApiResponse>('/student/blackboard');
  }

  // المرشد الذكي — the systems the agent reads, the steps it runs, this term's counts
  getAgentCore(qsparkStudent?: string | null) {
    const query = qsparkStudent ? `?qspark_student=${encodeURIComponent(qsparkStudent)}` : '';
    return this.get<ApiResponse>(`/agent-core${query}`);
  }

  getAdvisorIdentity() {
    return this.advisorGet('/me');
  }

  getAdvisees(semester?: string, all = false, q?: string, atRisk = false, filters: { level?: number; facultyName?: string } = {}) {
    const params = new URLSearchParams();
    if (semester) params.set('semester', semester);
    if (all) params.set('all', '1');
    if (atRisk) params.set('at_risk', '1');
    if (q) params.set('q', q);
    if (filters.level !== undefined) params.set('level', String(filters.level));
    if (filters.facultyName) params.set('faculty_name', filters.facultyName);
    const query = params.toString();
    return this.advisorGet(`/advisees${query ? `?${query}` : ''}`);
  }

  getAdviseePlan(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/plan`);
  }

  /** Twin slices of a student who is not the signed-in user, from the pre-loaded cohort tables. */
  getAdviseeCourses(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/courses`);
  }

  getAdviseeTransactions(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/transactions`);
  }

  getAdviseeAbsences(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/absences`);
  }

  getAdviseeRecommendations(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/recommendations`);
  }

  getAdviseeTimeline(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/timeline`);
  }

  /** Final-exam sittings and the weekly timetable, from the cohort snapshots (kinds `finals` / `timetable`). */
  getAdviseeFinals(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/finals`);
  }

  getAdviseeTimetable(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/timetable`);
  }

  /** Blackboard per course — grade columns, LMS activity and submissions; `unavailable` until the sweep stored them. */
  getAdviseeBlackboard(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/blackboard`);
  }

  /** Stored AI recommendations / real-event timeline for the signed-in student. */
  getMyRecommendations() {
    return this.get<ApiResponse>('/student/recommendations');
  }

  getMyTimeline() {
    return this.get<ApiResponse>('/student/timeline');
  }

  /** لوحة النظام — super admin only. */
  getAdminUsage(period: string | number = 30) {
    const q = typeof period === 'number' ? `days=${period}` : `period=${encodeURIComponent(period)}`;
    return this.get<ApiResponse>(`/admin/usage?${q}`);
  }

  getAdviseeProfile(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/profile`);
  }

  getAdviseePredictions(studentId: string) {
    return this.advisorGet(`/students/${encodeURIComponent(studentId)}/predictions`);
  }

  private async advisorGet(path: string): Promise<ApiResponse> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    const res = await fetch(`/api/advisor${path}`, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  }
}

export const apiClient = new ApiClient(BASE_URL);

/**
 * Fetch from API with fallback to mock data.
 * Returns { data, source } where source is 'api' or 'mock'.
 */
export async function fetchWithFallback<T>(
  apiFn: () => Promise<ApiResponse>,
  mockData: T
): Promise<{ data: T; source: 'api' | 'mock' }> {
  try {
    const response = await apiFn();
    if (response.source === 'api' && response.data != null) {
      return { data: response.data as T, source: 'api' };
    }
    return { data: mockData, source: 'mock' };
  } catch {
    return { data: mockData, source: 'mock' };
  }
}
