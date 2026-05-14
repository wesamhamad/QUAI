import { useMemo, useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import {
  useStudentProfile,
  useAcademicTransactions,
  useCurrentCourses,
  useCourseContent,
  useCourseGrades,
} from '../../hooks/useStudentData';

// ── Types ─────────────────────────────────────────────────────────────

interface TransactionCourse {
  course_no?: string;
  course_code?: string;
  course_name?: string;
  course_name_s?: string | null;
  letter_grade?: string;
  letter_grade_s?: string;
  crd_hrs?: string;
  quality_points?: string;
  status_code?: string;
}

interface Semester {
  semester?: string;
  semester_gpa?: string | number;
  total_credit_hours?: number;
  courses?: TransactionCourse[];
}

interface CurrentCourse {
  course_code?: string;
  course_name?: string;
  external_id?: string;
  bb_course_id?: string;
  instructor_name?: string;
  section_seq?: string;
}

interface ContentItem {
  id?: string;
  title?: string;
  type?: string;
  body?: string | null;
  position?: number;
  contentHandler?: {
    id?: string;
    file?: { fileName?: string; mimeType?: string };
  };
  children?: ContentItem[] | null;
}

/** Per-assignment grade row from /blackboard/courses/{id}/grades.
 *  Field names vary across the upstream wrapper, so we accept multiple aliases
 *  (see SmartAdvisorService::formatCourseGrades for the same fallback chain). */
interface GradeItem {
  name?: string;
  columnName?: string;
  title?: string;
  score?: number | string;
  grade?: number | string;
  displayGrade?: number | string;
  possible?: number | string;
  pointsPossible?: number | string;
  max?: number | string;
}

interface ProfileShape {
  profile?: {
    name?: string;
    student_id?: string;
    academic?: {
      cumulative_gpa?: number | string;
      last_recorded_gpa?: number | string;
      total_earned_hours?: number;
      total_plan_hours?: number;
    };
  };
}

// ── Helpers ───────────────────────────────────────────────────────────

const letterGradeColor = (letter: string): string => {
  const l = (letter || '').toUpperCase();
  if (l.startsWith('A') || l.startsWith('أ')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (l.startsWith('B') || l.startsWith('ب')) return 'bg-sa-100 text-sa-700 dark:bg-sa-900/40 dark:text-sa-300';
  if (l.startsWith('C') || l.startsWith('ج')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  if (l.startsWith('D') || l.startsWith('د')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
  if (l.startsWith('F') || l.startsWith('هـ')) return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
};

/** Classify a Blackboard content item by title keywords. Best-effort heuristic
 *  since the upstream API doesn't tag items as "assignment" or "quiz" — they
 *  come through as files with descriptive Arabic/English titles. */
const classifyContent = (item: ContentItem): 'assignment' | 'quiz' | 'lecture' | 'other' => {
  const title = (item.title || '').toLowerCase();
  if (/(واجب|assignment|hw|homework)/i.test(title)) return 'assignment';
  if (/(اختبار|كويز|quiz|test|exam|نصفي|midterm)/i.test(title)) return 'quiz';
  if (/(محاضرة|lecture|chapter|الفصل|الباب)/i.test(title)) return 'lecture';
  return 'other';
};

const flattenContent = (items: ContentItem[] | null | undefined): ContentItem[] => {
  if (!items) return [];
  const out: ContentItem[] = [];
  for (const it of items) {
    out.push(it);
    if (it.children && it.children.length > 0) out.push(...flattenContent(it.children));
  }
  return out;
};

// ── Per-course content panel (lazy) ───────────────────────────────────

function CourseContentPanel({ courseId, t }: { courseId: string; t: (a: string, e: string) => string }) {
  const { source, data, isLoading } = useCourseContent<ContentItem[] | null>(courseId, null);
  const gradesResult = useCourseGrades<GradeItem[] | null>(courseId, null);

  const flattened = useMemo(() => flattenContent(Array.isArray(data) ? data : []), [data]);
  const grouped = useMemo(() => {
    const buckets = { assignment: [] as ContentItem[], quiz: [] as ContentItem[], lecture: [] as ContentItem[], other: [] as ContentItem[] };
    for (const item of flattened) {
      buckets[classifyContent(item)].push(item);
    }
    return buckets;
  }, [flattened]);

  const grades = useMemo<GradeItem[]>(() => {
    if (gradesResult.source !== 'api' || !Array.isArray(gradesResult.data)) return [];
    return gradesResult.data;
  }, [gradesResult.source, gradesResult.data]);

  if (isLoading) {
    return <p className="text-xs text-gray-400 dark:text-gray-500 py-2">{t('جاري التحميل...', 'Loading…')}</p>;
  }

  const hasContent = source === 'api' && flattened.length > 0;
  const hasGrades = grades.length > 0;

  if (!hasContent && !hasGrades) {
    return <p className="text-xs text-gray-400 dark:text-gray-500 py-2">{t('لا توجد بيانات لعرضها', 'No data available')}</p>;
  }

  const sections: Array<{ key: keyof typeof grouped; titleAr: string; titleEn: string; icon: typeof FileText }> = [
    { key: 'assignment', titleAr: 'الواجبات', titleEn: 'Assignments', icon: ClipboardList },
    { key: 'quiz',       titleAr: 'الاختبارات', titleEn: 'Quizzes',     icon: FileText },
    { key: 'lecture',    titleAr: 'المحاضرات', titleEn: 'Lectures',    icon: BookOpen },
    { key: 'other',      titleAr: 'مواد أخرى',  titleEn: 'Other',       icon: FileText },
  ];

  return (
    <div className="space-y-4 mt-3">
      {hasGrades && (
        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Award className="w-3.5 h-3.5" />
            {t('الدرجات', 'Grades')}
            <span className="text-gray-400 dark:text-gray-500 font-normal">· {grades.length}</span>
          </h4>
          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700/60">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-start px-3 py-1.5 font-medium">{t('التقييم', 'Item')}</th>
                  <th className="text-center px-3 py-1.5 font-medium">{t('الدرجة', 'Score')}</th>
                  <th className="text-center px-3 py-1.5 font-medium">{t('من', 'Out of')}</th>
                  <th className="text-center px-3 py-1.5 font-medium">{t('النسبة', 'Pct')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {grades.map((g, i) => {
                  const name = g.name ?? g.columnName ?? g.title ?? t('غير محدد', 'Untitled');
                  const score = g.score ?? g.grade ?? g.displayGrade ?? '—';
                  const possible = g.possible ?? g.pointsPossible ?? g.max ?? '—';
                  let pct = '—';
                  const sN = Number(score);
                  const pN = Number(possible);
                  if (Number.isFinite(sN) && Number.isFinite(pN) && pN > 0) {
                    pct = `${Math.round((sN / pN) * 100)}%`;
                  }
                  return (
                    <tr key={`${name}-${i}`} className="text-gray-700 dark:text-gray-300">
                      <td className="px-3 py-1.5 break-words">{name}</td>
                      <td className="px-3 py-1.5 text-center font-mono">{String(score)}</td>
                      <td className="px-3 py-1.5 text-center font-mono text-gray-500 dark:text-gray-400">{String(possible)}</td>
                      <td className="px-3 py-1.5 text-center font-semibold text-sa-700 dark:text-sa-400">{pct}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasGrades && hasContent && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t('لا توجد درجات منشورة بعد لهذا المقرر', 'No grades posted yet for this course')}
        </p>
      )}

      {sections.map(({ key, titleAr, titleEn, icon: Icon }) => {
        const items = grouped[key];
        if (items.length === 0) return null;
        return (
          <div key={key}>
            <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Icon className="w-3.5 h-3.5" />
              {t(titleAr, titleEn)}
              <span className="text-gray-400 dark:text-gray-500 font-normal">· {items.length}</span>
            </h4>
            <ul className="space-y-1.5 ms-5">
              {items.slice(0, 8).map((item, i) => (
                <li key={item.id ?? `${key}-${i}`} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-sa-400" />
                  <span className="break-words">{item.title || t('بدون عنوان', 'Untitled')}</span>
                </li>
              ))}
              {items.length > 8 && (
                <li className="text-xs text-gray-400 dark:text-gray-500 ms-3">
                  + {items.length - 8} {t('أخرى', 'more')}
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────

type TabKey = 'history' | 'current';

export default function Grades() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<TabKey>('history');
  const [openCourse, setOpenCourse] = useState<string | null>(null);

  const profileResult = useStudentProfile<ProfileShape | null>(null);
  const transactionsResult = useAcademicTransactions<Semester[] | null>(null);
  const coursesResult = useCurrentCourses<CurrentCourse[] | null>(null);

  const sources = [profileResult.source, transactionsResult.source, coursesResult.source];
  const overallSource = sources.includes('api') ? ('api' as const) : ('mock' as const);

  // Profile summary
  const academic = profileResult.data?.profile?.academic ?? null;
  const cumulativeGpa = academic
    ? parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'))
    : 0;
  const earnedHours = Number(academic?.total_earned_hours ?? 0);
  const planHours = Number(academic?.total_plan_hours ?? 0);

  // Historical semesters (most recent first)
  const semesters = useMemo<Semester[]>(() => {
    if (transactionsResult.source !== 'api' || !Array.isArray(transactionsResult.data)) return [];
    return [...transactionsResult.data].sort((a, b) =>
      String(b.semester ?? '').localeCompare(String(a.semester ?? ''))
    );
  }, [transactionsResult.source, transactionsResult.data]);

  const currentCourses = useMemo<CurrentCourse[]>(() => {
    if (coursesResult.source !== 'api' || !Array.isArray(coursesResult.data)) return [];
    return coursesResult.data;
  }, [coursesResult.source, coursesResult.data]);

  return (
    <div>
      <PageHeader
        title={t('الدرجات والتقييمات', 'Grades & Assessments')}
        subtitle={t(
          'سجل درجاتك التاريخي ومحتوى مقرراتك الحالية من Blackboard',
          'Your historical grades and current course content from Blackboard'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('الدرجات والتقييمات', 'Grades & Assessments') },
        ]}
        accentColor="bg-sa-500"
        actions={<DataSourceBadge source={overallSource} />}
      />

      {/* Profile summary card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('المعدل التراكمي', 'Cumulative GPA')}</p>
          <p className="text-2xl font-extrabold text-sa-600 dark:text-sa-400 mt-0.5">
            {cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : '—'}
            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal"> / 5.00</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('الساعات المكتسبة', 'Earned Hours')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
            {earnedHours || '—'}
            {planHours > 0 && <span className="text-sm text-gray-400 dark:text-gray-500 font-normal"> / {planHours}</span>}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('الفصول الدراسية', 'Semesters')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
            {semesters.length || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('المقررات الحالية', 'Current Courses')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
            {currentCourses.length || '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex gap-6">
          {([
            { key: 'history', labelAr: 'الدرجات السابقة', labelEn: 'Past Grades' },
            { key: 'current', labelAr: 'المقررات الحالية', labelEn: 'Current Courses' },
          ] as Array<{ key: TabKey; labelAr: string; labelEn: string }>).map(tabDef => (
            <button
              key={tabDef.key}
              onClick={() => setTab(tabDef.key)}
              className={`py-3 px-1 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === tabDef.key
                  ? 'border-sa-500 text-sa-700 dark:text-sa-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t(tabDef.labelAr, tabDef.labelEn)}
            </button>
          ))}
        </nav>
      </div>

      {/* History tab */}
      {tab === 'history' && (
        <div className="space-y-6">
          {transactionsResult.isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('جاري تحميل السجل الأكاديمي...', 'Loading academic history…')}</p>
          )}
          {!transactionsResult.isLoading && semesters.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('لا توجد فصول دراسية مسجلة بعد', 'No semesters on record yet')}</p>
          )}

          {semesters.map(sem => {
            const semGpa = parseFloat(String(sem.semester_gpa ?? '0'));
            return (
              <section key={String(sem.semester)} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-sa-600 dark:text-sa-400" />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {t(`الفصل ${sem.semester}`, `Semester ${sem.semester}`)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sem.total_credit_hours} {t('ساعة', 'credit hours')} · {sem.courses?.length ?? 0} {t('مقررات', 'courses')}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('معدل الفصل', 'Semester GPA')}</p>
                    <p className="text-lg font-extrabold text-sa-600 dark:text-sa-400">
                      {semGpa > 0 ? semGpa.toFixed(2) : '—'}
                    </p>
                  </div>
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30">
                      <tr>
                        <th className="text-start px-5 py-2 font-medium">{t('رمز المقرر', 'Code')}</th>
                        <th className="text-start px-5 py-2 font-medium">{t('اسم المقرر', 'Course')}</th>
                        <th className="text-center px-3 py-2 font-medium">{t('الساعات', 'Hrs')}</th>
                        <th className="text-center px-3 py-2 font-medium">{t('التقدير', 'Grade')}</th>
                        <th className="text-center px-3 py-2 font-medium">{t('النقاط', 'Points')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {(sem.courses ?? []).map(c => {
                        const letter = c.letter_grade_s || c.letter_grade || '—';
                        return (
                          <tr key={`${sem.semester}-${c.course_no ?? c.course_code}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-5 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-300">{c.course_code}</td>
                            <td className="px-5 py-2.5 text-gray-900 dark:text-white">{c.course_name || c.course_name_s}</td>
                            <td className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300">{c.crd_hrs}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md text-xs font-bold ${letterGradeColor(letter)}`}>
                                {letter}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300 font-mono text-xs">{c.quality_points ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Current tab */}
      {tab === 'current' && (
        <div className="space-y-4">
          {coursesResult.isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('جاري تحميل المقررات الحالية...', 'Loading current courses…')}</p>
          )}

          {!coursesResult.isLoading && currentCourses.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('لا توجد مقررات في الفصل الحالي', 'No courses in the current semester')}</p>
          )}

          {currentCourses.map(course => {
            const courseId = course.bb_course_id || course.external_id || '';
            const isOpen = openCourse === courseId;
            return (
              <article key={courseId || course.course_code} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setOpenCourse(isOpen ? null : courseId)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-sa-100 dark:bg-sa-900/40 text-sa-700 dark:text-sa-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {course.course_name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="font-mono">{course.course_code}</span>
                        {course.instructor_name && <> · {course.instructor_name}</>}
                        {course.section_seq && <> · {t('شعبة', 'Section')} {course.section_seq}</>}
                      </p>
                    </div>
                  </div>
                  {courseId
                    ? (isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)
                    : <ExternalLink className="w-4 h-4 text-gray-300" />}
                </button>

                {isOpen && courseId && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    <CourseContentPanel courseId={courseId} t={t} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
