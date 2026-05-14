import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Student, CaseloadEntry } from '../types';

interface CaseloadManagementProps {
  students: Student[];
  caseload: CaseloadEntry[];
}

export default function CaseloadManagement({ students, caseload }: CaseloadManagementProps) {
  const { t } = useLanguage();

  // Priority queue: sorted by risk (critical first), then lowest GPA
  const priorityQueue = [...students]
    .filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high')
    .sort((a, b) => {
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      return a.gpa - b.gpa;
    })
    .slice(0, 10);

  const chartData = caseload.map(c => ({
    name: t(c.advisorName, c.advisorNameEn),
    [t('حرج', 'Critical')]: c.critical,
    [t('مرتفع', 'High')]: c.high,
    [t('متوسط', 'Medium')]: c.medium,
    [t('منخفض', 'Low')]: c.low,
  }));

  const riskBadge = (level: Student['riskLevel']) => {
    const colors = {
      critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
      high: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
      medium: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
      low: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    };
    const labels = {
      critical: t('حرج', 'Critical'),
      high: t('مرتفع', 'High'),
      medium: t('متوسط', 'Medium'),
      low: t('منخفض', 'Low'),
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[level]}`}>
        {labels[level]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Workload Balance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {t('توزيع أعباء العمل', 'Workload Distribution')}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey={t('حرج', 'Critical')} stackId="a" fill="#D92D20" />
              <Bar dataKey={t('مرتفع', 'High')} stackId="a" fill="#F04438" />
              <Bar dataKey={t('متوسط', 'Medium')} stackId="a" fill="#F5BD02" />
              <Bar dataKey={t('منخفض', 'Low')} stackId="a" fill="#25935F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Case Priority Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {t('قائمة الأولويات', 'Priority Queue')}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('الطلاب الأكثر حاجة للتدخل — مرتبين حسب المخاطر والمعدل', 'Students most in need — sorted by risk level and GPA')}
        </p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {priorityQueue.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-xs font-bold text-gray-600 dark:text-gray-300">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {t(s.name, s.nameEn)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.id} · {t(s.department, s.departmentEn)} · GPA {s.gpa.toFixed(2)}
                </p>
              </div>
              {riskBadge(s.riskLevel)}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">
                {t('آخر تواصل', 'Last contact')}: {s.lastContact.slice(5)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
