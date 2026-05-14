import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { SemesterTrend } from '../types';

interface Props {
  trends: SemesterTrend[];
}

export default function TrendAnalysis({ trends }: Props) {
  const { t } = useLanguage();

  const chartData = trends.map(tr => ({
    semester: t(tr.semester, tr.semesterEn),
    [t('المعدل التراكمي', 'GPA')]: tr.avgGPA,
    [t('نسبة النجاح', 'Pass Rate')]: tr.passRate,
    [t('نسبة DFW', 'DFW Rate')]: tr.dfwRate,
    [t('الاستبقاء', 'Retention')]: tr.retentionRate,
    [t('المسجلون', 'Enrollment')]: tr.enrollment,
    [t('معرضون للخطر', 'At-Risk')]: tr.atRiskCount,
  }));

  const first = trends[0];
  const last = trends[trends.length - 1];

  const deltas = [
    { labelAr: 'المعدل التراكمي', labelEn: 'GPA', from: first.avgGPA, to: last.avgGPA, format: (v: number) => v.toFixed(2), positive: last.avgGPA > first.avgGPA },
    { labelAr: 'نسبة النجاح', labelEn: 'Pass Rate', from: first.passRate, to: last.passRate, format: (v: number) => `${v}%`, positive: last.passRate > first.passRate },
    { labelAr: 'نسبة DFW', labelEn: 'DFW Rate', from: first.dfwRate, to: last.dfwRate, format: (v: number) => `${v}%`, positive: last.dfwRate < first.dfwRate },
    { labelAr: 'الاستبقاء', labelEn: 'Retention', from: first.retentionRate, to: last.retentionRate, format: (v: number) => `${v}%`, positive: last.retentionRate > first.retentionRate },
  ];

  return (
    <div className="space-y-4">
      {/* Delta Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {deltas.map(d => (
          <div key={d.labelEn} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t(d.labelAr, d.labelEn)}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{d.format(d.to)}</span>
              <span className={`text-xs font-medium pb-1 ${d.positive ? 'text-sa-600' : 'text-error-500'}`}>
                {d.positive ? '↑' : '↓'} {t('من', 'from')} {d.format(d.from)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* GPA & Pass Rate Line Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('اتجاه المعدل والنجاح', 'GPA & Pass Rate Trend')}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis yAxisId="gpa" domain={[2, 4]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis yAxisId="pct" orientation="right" domain={[70, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }} />
              <Legend />
              <Line yAxisId="gpa" type="monotone" dataKey={t('المعدل التراكمي', 'GPA')} stroke="#25935F" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="pct" type="monotone" dataKey={t('نسبة النجاح', 'Pass Rate')} stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Enrollment & At-Risk Bar Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('التسجيل والطلاب المعرضون للخطر', 'Enrollment & At-Risk Students')}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }} />
              <Legend />
              <Bar dataKey={t('المسجلون', 'Enrollment')} fill="#25935F" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('معرضون للخطر', 'At-Risk')} fill="#F04438" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
