import React, { useState } from 'react';
import AnimatedTab from '../../components/shared/AnimatedTab';
import { BarChart3, ClipboardList, TrendingUp, ShieldCheck, Bot, CalendarDays, User, ArrowRight, BookOpen, Printer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StudentHeader from './components/StudentHeader';
import AcademicPerformance from './components/AcademicPerformance';
import CurrentCourses from './components/CurrentCourses';
import StudyPlanOverview from './components/StudyPlanOverview';
import BehavioralAnalytics from './components/BehavioralAnalytics';
import RiskAssessment from './components/RiskAssessment';
import AIRecommendations from './components/AIRecommendations';
import QuEvents from './components/QuEvents';
import ActivityTimeline from './components/ActivityTimeline';
import StudentSelector from './components/StudentSelector';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import { mockStudent } from './data/mockStudent';
import type { StudentListItem } from './data/mockStudentList';
import { useStudentProfile, useCurrentCourses, useAcademicTransactions, useAbsences } from '../../hooks/useStudentData';
import type { StudentProfile, SemesterGPA, Course } from './types';

type TabKey = 'academic' | 'courses' | 'studyplan' | 'behavioral' | 'risk' | 'recommendations' | 'timeline';

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'academic', label: 'الأداء الأكاديمي', icon: BarChart3 },
  { key: 'courses', label: 'المقررات', icon: BookOpen },
  { key: 'studyplan', label: 'الخطة الدراسية', icon: ClipboardList },
  { key: 'behavioral', label: 'التحليلات السلوكية', icon: TrendingUp },
  { key: 'risk', label: 'تقييم المخاطر', icon: ShieldCheck },
  { key: 'recommendations', label: 'التوصيات', icon: Bot },
  { key: 'timeline', label: 'السجل الزمني', icon: CalendarDays },
];

// API profile response: { profile: { id, name, name_en, student_id, academic: { cumulative_gpa, last_recorded_gpa, total_plan_hours, total_earned_hours, current_registered_hours, remaining_hours_to_graduate, academic_status }, major: { name, name_en }, faculty: { name, name_en } } }
function mapApiProfile(apiData: unknown): StudentProfile {
  const raw = apiData as Record<string, unknown>;
  const profileWrapper = (raw.profile ?? raw) as Record<string, unknown>;
  const academic = (profileWrapper.academic ?? {}) as Record<string, unknown>;
  const major = (profileWrapper.major ?? {}) as Record<string, unknown>;
  const faculty = (profileWrapper.faculty ?? {}) as Record<string, unknown>;

  const gpaStr = String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '');
  const gpa = parseFloat(gpaStr) || mockStudent.profile.gpa;

  const statusMap: Record<string, StudentProfile['academicStanding']> = {
    'ممتاز': 'excellent', 'excellent': 'excellent',
    'جيد جداً': 'very-good', 'very good': 'very-good', 'very-good': 'very-good',
    'جيد': 'good', 'good': 'good',
    'مقبول': 'fair', 'fair': 'fair',
    'إنذار': 'warning', 'warning': 'warning',
  };
  const rawStatus = String(academic.academic_status ?? '').toLowerCase();
  const standing = statusMap[rawStatus] ?? (gpa >= 4.5 ? 'excellent' : gpa >= 3.75 ? 'very-good' : gpa >= 2.75 ? 'good' : 'fair');

  return {
    id: String(profileWrapper.student_id ?? profileWrapper.id ?? ''),
    name: String(profileWrapper.name ?? mockStudent.profile.name),
    nameEn: String(profileWrapper.name_en ?? mockStudent.profile.nameEn),
    studentId: String(profileWrapper.student_id ?? profileWrapper.id ?? mockStudent.profile.studentId),
    department: String(major.name ?? mockStudent.profile.department),
    departmentEn: String(major.name_en ?? mockStudent.profile.departmentEn),
    college: String(faculty.name ?? mockStudent.profile.college),
    collegeEn: String(faculty.name_en ?? mockStudent.profile.collegeEn),
    gpa,
    gpaScale: 5.0,
    creditHoursCompleted: Number(academic.total_earned_hours ?? mockStudent.profile.creditHoursCompleted),
    creditHoursRequired: Number(academic.total_plan_hours ?? mockStudent.profile.creditHoursRequired),
    expectedGraduation: mockStudent.profile.expectedGraduation,
    enrollmentStatus: 'active',
    lastActive: new Date().toISOString().split('T')[0],
    riskLevel: 'low',
    academicStanding: standing,
    level: Math.ceil(Number(academic.total_earned_hours ?? 0) / 15) || mockStudent.profile.level,
  };
}

function mapApiTransactions(apiData: unknown): SemesterGPA[] {
  const arr = Array.isArray(apiData) ? apiData : [];
  if (arr.length === 0) return mockStudent.semesterGPAs;
  return arr
    .filter((t: Record<string, unknown>) => t.semester_gpa != null)
    .map((t: Record<string, unknown>) => ({
      semester: String(t.semester ?? ''),
      semesterEn: String(t.semester ?? ''),
      gpa: parseFloat(String(t.semester_gpa ?? '0')) || 0,
      creditHours: Number(t.total_credit_hours ?? 0),
    }));
}

function extractLastGradedSemester(apiData: unknown): { semester: string; courses: Course[] } | null {
  const arr = Array.isArray(apiData) ? apiData : [];
  const graded = arr.filter((t: Record<string, unknown>) => t.semester_gpa != null);
  if (graded.length === 0) return null;
  const last = graded[graded.length - 1] as Record<string, unknown>;
  const courses = Array.isArray(last.courses) ? last.courses : [];
  return {
    semester: String(last.semester ?? ''),
    courses: courses.map((c: Record<string, unknown>) => ({
      code: String(c.course_code ?? ''),
      name: String(c.course_name ?? ''),
      nameEn: String(c.course_name ?? ''),
      creditHours: Number(c.crd_hrs ?? c.credit_hours ?? 3),
      grade: c.letter_grade ? String(c.letter_grade) : undefined,
      gradePoints: c.quality_points ? parseFloat(String(c.quality_points)) : undefined,
      status: 'completed' as const,
    })),
  };
}

function mapApiCourses(apiData: unknown): Course[] {
  const arr = Array.isArray(apiData) ? apiData : [];
  if (arr.length === 0) return mockStudent.currentCourses;
  return arr.map((c: Record<string, unknown>) => ({
    code: String(c.course_code ?? ''),
    name: String(c.course_name ?? ''),
    nameEn: String(c.course_name ?? ''),
    creditHours: Number(c.crd_hrs ?? c.credit_hours ?? 3),
    status: 'in-progress' as const,
  }));
}

export default function DigitalTwinPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  const handleSelectStudent = (student: StudentListItem) => {
    setSelectedStudent(student);
    setShowListOnMobile(false);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setShowListOnMobile(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6 print:mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sa-500 to-sa-700 flex items-center justify-center text-white text-lg print:hidden">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">التوأم الرقمي للطالب</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:hidden">عرض شامل لملف الطالب الأكاديمي والسلوكي</p>
            </div>
          </div>
          {selectedStudent && (
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة
            </button>
          )}
        </div>

        {/* Two-panel layout */}
        <div className="flex gap-6">
          {/* Left Panel - Student List (hidden on mobile when viewing twin) */}
          <div className={`w-full lg:w-80 lg:shrink-0 print:hidden ${!showListOnMobile && selectedStudent ? 'hidden lg:block' : ''}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 lg:sticky lg:top-6 overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <StudentSelector
                selectedStudentId={selectedStudent?.profile.studentId ?? null}
                onSelectStudent={handleSelectStudent}
              />
            </div>
          </div>

          {/* Right Panel - Digital Twin */}
          <div className={`flex-1 min-w-0 ${showListOnMobile && !selectedStudent ? 'hidden lg:block' : ''}`}>
            {selectedStudent ? (
              <>
                {/* Mobile back button */}
                <button
                  onClick={handleBackToList}
                  className="lg:hidden flex items-center gap-2 text-sm text-sa-600 dark:text-sa-400 font-medium mb-4 hover:text-sa-700 dark:hover:text-sa-300 transition-colors print:hidden"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لقائمة الطلاب
                </button>
                {selectedStudent.isLive ? (
                  <LiveDigitalTwin key={selectedStudent.profile.studentId} student={selectedStudent} />
                ) : (
                  <MockDigitalTwin studentProfile={selectedStudent.profile} />
                )}
              </>
            ) : (
              <div className="hidden lg:flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">اختر طالباً من القائمة لعرض التوأم الرقمي</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
        }
      `}</style>
    </div>
  );
}

/** Twin view that fetches real API data for the selected live student. */
function LiveDigitalTwin({ student }: { student: StudentListItem }) {
  const [activeTab, setActiveTab] = useState<TabKey>('academic');
  const studentId = student.profile.studentId;

  // Fetch each dataset for the *selected* student (?as=<studentId>), falling
  // back to that student's list profile / shared demo data when the API is
  // unavailable — never to an unrelated student.
  const profileResult = useStudentProfile(student.profile, studentId);
  const coursesResult = useCurrentCourses(mockStudent.currentCourses, studentId);
  const transactionsResult = useAcademicTransactions(mockStudent.semesterGPAs, studentId);
  const absencesResult = useAbsences(mockStudent.behavioral, studentId);

  const sources = [profileResult.source, coursesResult.source, transactionsResult.source];
  const overallSource = sources.includes('api') ? 'api' as const : 'mock' as const;

  const profile = profileResult.source === 'api'
    ? mapApiProfile(profileResult.data as Record<string, unknown>)
    : student.profile;

  const semesterGPAs = transactionsResult.source === 'api'
    ? mapApiTransactions(transactionsResult.data as unknown[])
    : mockStudent.semesterGPAs;

  const currentCourses = coursesResult.source === 'api'
    ? mapApiCourses(coursesResult.data as unknown[])
    : mockStudent.currentCourses;

  const behavioral = absencesResult.source === 'api'
    ? {
        ...mockStudent.behavioral,
        attendanceRate: (() => {
          const absData = absencesResult.data;
          if (Array.isArray(absData) && absData.length > 0) {
            const avgAbsencePercent = absData.reduce((sum: number, a: Record<string, unknown>) =>
              sum + (parseFloat(String(a.absence_all_percent ?? '0')) || 0), 0) / absData.length;
            return Math.round(100 - avgAbsencePercent);
          }
          return mockStudent.behavioral.attendanceRate;
        })(),
      }
    : mockStudent.behavioral;

  const currentSemesterHasGrades = currentCourses.some(c => c.grade != null);
  const lastGradedSemester = transactionsResult.source === 'api'
    ? extractLastGradedSemester(transactionsResult.data)
    : null;

  const isLoading = profileResult.isLoading || coursesResult.isLoading || transactionsResult.isLoading;

  return (
    <TwinContent
      profile={profile}
      semesterGPAs={semesterGPAs}
      currentCourses={currentCourses}
      behavioral={behavioral}
      overallSource={overallSource}
      isLoading={isLoading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentSemesterHasGrades={currentSemesterHasGrades}
      lastGradedSemester={lastGradedSemester}
    />
  );
}

/** Twin view using mock data (for non-live students) */
function MockDigitalTwin({ studentProfile }: { studentProfile: StudentProfile }) {
  const [activeTab, setActiveTab] = useState<TabKey>('academic');

  return (
    <TwinContent
      profile={studentProfile}
      semesterGPAs={mockStudent.semesterGPAs}
      currentCourses={mockStudent.currentCourses}
      behavioral={mockStudent.behavioral}
      overallSource="mock"
      isLoading={false}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentSemesterHasGrades={false}
      lastGradedSemester={null}
    />
  );
}

/** Shared twin content renderer */
function TwinContent({
  profile,
  semesterGPAs,
  currentCourses,
  behavioral,
  overallSource,
  isLoading,
  activeTab,
  setActiveTab,
  currentSemesterHasGrades,
  lastGradedSemester,
}: {
  profile: StudentProfile;
  semesterGPAs: SemesterGPA[];
  currentCourses: Course[];
  behavioral: typeof mockStudent.behavioral;
  overallSource: 'api' | 'mock';
  isLoading: boolean;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  currentSemesterHasGrades: boolean;
  lastGradedSemester: { semester: string; courses: Course[] } | null;
}) {
  return (
    <div className="space-y-6">
      {/* Data source badge */}
      <div className="flex items-center gap-2 print:hidden">
        <DataSourceBadge source={overallSource} />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-4 print:hidden">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sa-500" />
        </div>
      )}

      {/* Student Header */}
      <StudentHeader profile={profile} />

      {/* Tab Navigation — icon + underline */}
      <div className="border-b border-gray-200 dark:border-gray-700 print:hidden">
        <div className="flex overflow-x-auto gap-5 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-active={activeTab === tab.key}
              className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
            >
              <tab.icon className="w-4 h-4" strokeWidth={activeTab === tab.key ? 2 : 1.5} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatedTab activeKey={activeTab}>
        {activeTab === 'academic' && (
          <AcademicPerformance
            semesterGPAs={semesterGPAs}
            currentCourses={currentCourses}
            creditHoursCompleted={profile.creditHoursCompleted}
            creditHoursRequired={profile.creditHoursRequired}
            academicStanding={profile.academicStanding}
            currentSemesterHasGrades={currentSemesterHasGrades}
            lastGradedSemesterCourses={lastGradedSemester?.courses}
            lastGradedSemesterName={lastGradedSemester?.semester}
          />
        )}
        {activeTab === 'courses' && (
          <CurrentCourses courses={currentCourses} source={overallSource} />
        )}
        {activeTab === 'studyplan' && (
          <StudyPlanOverview studyPlan={mockStudent.studyPlan} currentCourses={currentCourses} />
        )}
        {activeTab === 'behavioral' && (
          <BehavioralAnalytics behavioral={behavioral} />
        )}
        {activeTab === 'risk' && (
          <RiskAssessment risk={mockStudent.risk} />
        )}
        {activeTab === 'recommendations' && (
          <>
            <AIRecommendations recommendations={mockStudent.recommendations} />
            <div className="mt-6"><QuEvents /></div>
          </>
        )}
        {activeTab === 'timeline' && (
          <ActivityTimeline events={mockStudent.timeline} />
        )}
      </AnimatedTab>
    </div>
  );
}
