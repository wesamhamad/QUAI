import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { ApiResponse } from '../lib/api';

interface UseStudentDataResult<T> {
  data: T;
  source: 'api' | 'mock';
  isLoading: boolean;
}

function useApiWithFallback<T>(
  queryKey: string[],
  apiFn: () => Promise<ApiResponse>,
  mockData: T
): UseStudentDataResult<T> {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiFn();
        if (response.source === 'api' && response.data != null) {
          return { data: response.data as T, source: 'api' as const };
        }
        return { data: mockData, source: 'mock' as const };
      } catch {
        return { data: mockData, source: 'mock' as const };
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data?.data ?? mockData,
    source: query.data?.source ?? 'mock',
    isLoading: query.isLoading,
  };
}

export function useStudentProfile<T>(mockData: T, studentId?: string | null) {
  return useApiWithFallback(['qmentor', 'profile', studentId ?? 'self'], () => apiClient.getStudentProfile(studentId), mockData);
}

export function useCurrentCourses<T>(mockData: T, studentId?: string | null) {
  return useApiWithFallback(['qmentor', 'courses', studentId ?? 'self'], () => apiClient.getCurrentCourses(studentId), mockData);
}

export function useAcademicTransactions<T>(mockData: T, studentId?: string | null) {
  return useApiWithFallback(['qmentor', 'transactions', studentId ?? 'self'], () => apiClient.getAcademicTransactions(studentId), mockData);
}

export function useStudentPlan<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'plan'], () => apiClient.getStudentPlan(), mockData);
}

export function useTimetable<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'timetable'], () => apiClient.getTimetable(), mockData);
}

export function useAbsences<T>(mockData: T, studentId?: string | null) {
  return useApiWithFallback(['qmentor', 'absences', studentId ?? 'self'], () => apiClient.getAbsences(studentId), mockData);
}

export function useAllCourseGrades<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'grades'], () => apiClient.getAllCourseGrades(), mockData);
}

export function useAdvisorInfo<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'academic-advisor'], () => apiClient.getAcademicAdvisor(), mockData);
}

export function useFinalExams<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'exams'], () => apiClient.getFinalExams(), mockData);
}

export function useRewards<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'rewards'], () => apiClient.getRewards(), mockData);
}

export function useStudentSkills<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'skills'], () => apiClient.getStudentSkills(), mockData);
}

export function useAcademicCalendar<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'calendar'], () => apiClient.getAcademicCalendar(), mockData);
}

export function useDepartments<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'departments'], () => apiClient.getDepartments(), mockData);
}

export function useAvailableCourses<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'available-courses'], () => apiClient.getAvailableCourses(), mockData);
}

export function useAnnouncements<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'announcements'], () => apiClient.getAnnouncements(), mockData);
}

export function useCourseContent<T>(courseId: string, mockData: T) {
  return useApiWithFallback(['qmentor', 'course-content', courseId], () => apiClient.getCourseContent(courseId), mockData);
}

export function useCourseGrades<T>(courseId: string, mockData: T) {
  return useApiWithFallback(['qmentor', 'course-grades', courseId], () => apiClient.getCourseGrades(courseId), mockData);
}

export function useSearchStudents<T>(name: string, mockData: T) {
  return useApiWithFallback(['qmentor', 'search-students', name], () => apiClient.searchStudents(name), mockData);
}

export function useQuEvents() {
  return useApiWithFallback<unknown[]>(
    ['qu-events'],
    () => apiClient.get('/qu/events'),
    []
  );
}

// ── Standing & risk ────────────────────────────────────────────────────

export function useWarnings<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'warnings'], () => apiClient.getWarnings(), mockData);
}

export function useMajorChanges<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'major-changes'], () => apiClient.getMajorChanges(), mockData);
}

export function useHaltReasons<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'halt-reasons'], () => apiClient.getHaltReasons(), mockData);
}

export function usePenalties<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'penalties'], () => apiClient.getPenalties(), mockData);
}

// ── Academic plan (v1) ────────────────────────────────────────────────

export function useAcademicPlanForMe<T>(mockData: T) {
  return useApiWithFallback(['qmentor', 'academic-plan-me'], () => apiClient.getAcademicPlanForMe(), mockData);
}

export function useAcademicPlanByMajor<T>(majorNo: string, mockData: T) {
  return useApiWithFallback(
    ['qmentor', 'academic-plan-major', majorNo],
    () => apiClient.getAcademicPlanByMajor(majorNo),
    mockData
  );
}

export function useAcademicPlanSummary<T>(majorNo: string, mockData: T) {
  return useApiWithFallback(
    ['qmentor', 'academic-plan-summary', majorNo],
    () => apiClient.getAcademicPlanSummary(majorNo),
    mockData
  );
}

// ── Major-change planner ──────────────────────────────────────────────

export function useMajorsInMyFaculty<T>(mockData: T) {
  return useApiWithFallback(
    ['qmentor', 'majors-my-faculty'],
    () => apiClient.getMajorsInMyFaculty(),
    mockData
  );
}

export function useMajorComparison<T>(targetMajorNo: string, mockData: T) {
  return useApiWithFallback(
    ['qmentor', 'major-comparison', targetMajorNo],
    () => apiClient.compareMajor(targetMajorNo),
    mockData
  );
}
