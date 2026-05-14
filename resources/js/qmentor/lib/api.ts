const BASE_URL = '/api/qmentor';

export interface ApiResponse<T = unknown> {
  data: T | null;
  source: 'api' | 'unavailable';
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
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

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  // Student endpoints
  getStudentProfile() {
    return this.get<ApiResponse>('/student/profile');
  }

  getCurrentCourses() {
    return this.get<ApiResponse>('/student/courses');
  }

  getAcademicTransactions() {
    return this.get<ApiResponse>('/student/transactions');
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

  getAbsences() {
    return this.get<ApiResponse>('/student/absences');
  }

  getAllCourseGrades() {
    return this.get<ApiResponse>('/student/grades');
  }

  getAdvisorInfo() {
    return this.get<ApiResponse>('/student/advisor');
  }

  async getAcademicAdvisor(): Promise<ApiResponse> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    const res = await fetch('/api/v2/academic-advisor', {
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
