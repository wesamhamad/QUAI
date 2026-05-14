import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { WeeklyProgress, RecoveryStudent } from '../types';

interface Props {
  progress: WeeklyProgress[];
  student: RecoveryStudent;
}

export default function ProgressTracker({ progress, student }: Props) {
  const { t } = useLanguage();

  const gpaData = progress.map(w => ({
    name: t(w.labelAr, w.labelEn),
    gpa: w.gpa,
    target: student.targetGPA,
  }));

  const attendanceData = progress.map(w => ({
    name: t(w.labelAr, w.labelEn),
    attendance: w.attendance,
  }));

  const assignmentData = progress.map(w => ({
    name: t(w.labelAr, w.labelEn),
    completed: w.assignmentsCompleted,
    total: w.assignmentsTotal,
    rate: Math.round((w.assignmentsCompleted / w.assignmentsTotal) * 100),
  }));

  const latestGPA = progress[progress.length - 1]?.gpa || student.currentGPA;
  const gpaImproved = latestGPA > progress[0]?.gpa;
  const latestAttendance = progress[progress.length - 1]?.attendance || 0;
  const avgAssignmentRate = Math.round(
    progress.reduce((sum, w) => sum + (w.assignmentsCompleted / w.assignmentsTotal) * 100, 0) / progress.length
  );

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('اتجاه المعدل', 'GPA Trend')}</p>
          <p className={`text-xl font-bold mt-1 ${gpaImproved ? 'text-sa-600 dark:text-sa-400' : 'text-red-600 dark:text-red-400'}`}>
            {gpaImproved ? '↑' : '↓'} {latestGPA.toFixed(2)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('آخر حضور', 'Latest Attendance')}</p>
          <p className={`text-xl font-bold mt-1 ${latestAttendance >= 80 ? 'text-sa-600 dark:text-sa-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {latestAttendance}%
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('إنجاز الواجبات', 'Assignment Rate')}</p>
          <p className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">{avgAssignmentRate}%</p>
        </Card>
      </div>

      {/* GPA Trend Chart */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('اتجاه المعدل التراكمي', 'GPA Trend During Recovery')}
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis domain={[1.0, 3.0]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <ReferenceLine y={student.targetGPA} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: t('الهدف', 'Target'), fill: '#f59e0b', fontSize: 11 }} />
              <Line type="monotone" dataKey="gpa" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name={t('المعدل', 'GPA')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attendance Chart */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('تحسن الحضور', 'Attendance Improvement')}
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('الحضور %', 'Attendance %')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Assignment Completion */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('معدل إنجاز الواجبات', 'Assignment Completion Rate')}
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assignmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} name={t('الإنجاز %', 'Completion %')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
