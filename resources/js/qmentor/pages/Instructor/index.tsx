import { useMemo } from 'react';
import { UsersIcon, ExclamationTriangleIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import Card, { StatCard } from '../../components/ui/Card';
import EmptyState from '../DigitalTwin/components/EmptyState';
import StudentTable from '../AdvisorDashboard/components/StudentTable';
import type { Student } from '../AdvisorDashboard/types';
import { useTaughtStudents, type TaughtStudent } from '../../hooks/useInstructorData';

const LEVEL_KEY: Record<number, Student['riskLevel']> = { 0: 'low', 1: 'medium', 2: 'high', 3: 'critical' };

/**
 * Map a taught-roster row onto the advisor table's Student shape. The risk
 * level is the engine's verdict when the student has been scored; GPA alone
 * otherwise — the same rule the advisor desk applies.
 */
function toStudent(r: TaughtStudent): Student {
  const gpa = Number(r.last_recorded_gpa) || 0;
  let riskLevel: Student['riskLevel'] = 'low';
  if (r.risk_level != null) riskLevel = LEVEL_KEY[r.risk_level] ?? 'low';
  else if (gpa > 0 && gpa < 2) riskLevel = 'critical';
  else if (gpa > 0 && gpa < 2.5) riskLevel = 'high';
  else if (gpa > 0 && gpa < 3) riskLevel = 'medium';

  const section = [r.course_code, r.section ? `(${r.section})` : ''].filter(Boolean).join(' ');
  return {
    id: String(r.student_id),
    name: r.student_name ?? r.student_id,
    nameEn: r.student_name_en ?? r.student_name ?? r.student_id,
    department: r.major_name ?? r.dept_name ?? section,
    departmentEn: r.major_name_en ?? r.major_name ?? section,
    gpa,
    riskLevel,
    lastContact: '',
    status: gpa > 0 && gpa < 2 ? 'probation' : 'active',
    statusAr: gpa > 0 && gpa < 2 ? 'إنذار أكاديمي' : 'نشط',
    email: r.email ?? '',
  };
}

/**
 * «طلاب مقرراتي» — the instructor's list: only the students enrolled in the
 * sections this faculty member teaches this term. The server decides the set
 * (TaughtRoster); a row opens the student's twin.
 */
export default function InstructorPage() {
  const { t } = useLanguage();
  const roster = useTaughtStudents();
  const live = roster.source === 'api';
  const rows = useMemo(() => (live && Array.isArray(roster.data) ? roster.data : []), [live, roster.data]);
  const students = useMemo(() => rows.map(toStudent), [rows]);

  const sections = useMemo(() => new Set(rows.map(r => `${r.course_code ?? ''}|${r.section ?? ''}`).filter(k => k !== '|')).size, [rows]);
  const atRisk = students.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const gpaStudents = students.filter(s => s.gpa > 0);
  const averageGpa = gpaStudents.length ? +(gpaStudents.reduce((sum, s) => sum + s.gpa, 0) / gpaStudents.length).toFixed(2) : '—';

  return (
    <div>
      <PageHeader
        title={t('طلاب مقرراتي', 'My Course Students')}
        subtitle={t('الطلاب المسجّلون في الشُّعب التي تدرّسها هذا الفصل', 'Students enrolled in the sections you teach this term')}
        breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('طلاب مقرراتي', 'My Course Students') }]}
        actions={live ? <DataSourceBadge source="api" /> : undefined}
        accentColor="bg-sa-500"
      />

      {!roster.isLoading && !live && (
        <div className="mb-6 rounded-xl border border-dashed border-gold-300 dark:border-gold-500/40 bg-gold-50/70 dark:bg-gold-500/10 px-4 py-3">
          <p className="text-sm text-gold-800 dark:text-gold-300">
            {roster.source === 'forbidden'
              ? t('هذه القائمة لأعضاء هيئة التدريس.', 'This list is for faculty members.')
              : t('تعذّر جلب قائمة طلاب مقرراتك من النظام الأكاديمي. حاول لاحقاً.', 'Could not load your course students from the academic system. Please try again later.')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard title={t('إجمالي الطلاب', 'Total Students')} value={students.length} icon={<UsersIcon className="w-5 h-5" />} />
        <StatCard title={t('الشُّعب', 'Sections')} value={sections || '—'} icon={<BookOpenIcon className="w-5 h-5" />} />
        <StatCard title={t('معرضون للخطر', 'At-Risk')} value={atRisk} icon={<ExclamationTriangleIcon className="w-5 h-5" />} className="border-s-4 border-s-error-500" />
        <StatCard title={t('المعدل المتوسط', 'Avg GPA')} value={averageGpa} icon={<AcademicCapIcon className="w-5 h-5" />} />
      </div>

      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('قائمة الطلاب', 'Student List')}</h3>
        {roster.isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">{t('جارٍ تحميل القائمة…', 'Loading…')}</p>
        ) : students.length === 0 ? (
          <EmptyState
            title={t('لا طلاب في مقرراتك هذا الفصل', 'No students in your courses this term')}
            description={t('تظهر هنا قائمة الطلاب المسجّلين في الشُّعب التي تدرّسها، من النظام الأكاديمي.', 'Students enrolled in the sections you teach appear here, from the academic system.')}
            icon="list"
          />
        ) : (
          <StudentTable students={students} />
        )}
      </Card>
    </div>
  );
}
