import { useLanguage } from '../../../contexts/LanguageContext';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import type { SemesterSnapshot } from '../types';
import { semesters } from '../data/mockBenchmarkData';

interface Props {
  snapshots: SemesterSnapshot[];
}

const SPARKLINE_COLOR = '#25935F';

interface KPI {
  labelAr: string;
  labelEn: string;
  value: string;
  sparkData: number[];
  delta: string;
  positive: boolean;
}

export default function UniversityOverview({ snapshots }: Props) {
  const { t } = useLanguage();
  const current = snapshots[snapshots.length - 1].university;
  const prev = snapshots[snapshots.length - 2].university;

  function delta(cur: number, prv: number, suffix = ''): { text: string; positive: boolean } {
    const d = cur - prv;
    const sign = d >= 0 ? '+' : '';
    return { text: `${sign}${d.toFixed(1)}${suffix}`, positive: d >= 0 };
  }

  const kpis: KPI[] = [
    {
      labelAr: 'إجمالي القيد', labelEn: 'Total Enrollment',
      value: current.totalEnrollment.toLocaleString(),
      sparkData: snapshots.map(s => s.university.totalEnrollment),
      ...(() => { const d = delta(current.totalEnrollment, prev.totalEnrollment); return { delta: d.text, positive: d.positive }; })(),
    },
    {
      labelAr: 'المعدل التراكمي', labelEn: 'Overall GPA',
      value: current.overallGpa.toFixed(2),
      sparkData: snapshots.map(s => s.university.overallGpa),
      ...(() => { const d = delta(current.overallGpa, prev.overallGpa); return { delta: d.text, positive: d.positive }; })(),
    },
    {
      labelAr: 'معدل الاستبقاء', labelEn: 'Retention Rate',
      value: `${current.retentionRate}%`,
      sparkData: snapshots.map(s => s.university.retentionRate),
      ...(() => { const d = delta(current.retentionRate, prev.retentionRate, '%'); return { delta: d.text, positive: d.positive }; })(),
    },
    {
      labelAr: 'معدل التخرج', labelEn: 'Graduation Rate',
      value: `${current.graduationRate}%`,
      sparkData: snapshots.map(s => s.university.graduationRate),
      ...(() => { const d = delta(current.graduationRate, prev.graduationRate, '%'); return { delta: d.text, positive: d.positive }; })(),
    },
    {
      labelAr: 'نسبة المعرضين للخطر', labelEn: 'At-Risk %',
      value: `${current.atRiskPercent}%`,
      sparkData: snapshots.map(s => s.university.atRiskPercent),
      ...(() => { const d = delta(current.atRiskPercent, prev.atRiskPercent, '%'); return { delta: d.text, positive: d.positive <= 0 }; })(),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('نظرة عامة على الجامعة', 'University Overview')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t(kpi.labelAr, kpi.labelEn)}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <span className={`text-xs font-medium ${kpi.positive ? 'text-success-500' : 'text-error-500'}`}>
                  {kpi.delta} {t('عن الفصل السابق', 'vs prev semester')}
                </span>
              </div>
              <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.sparkData.map((v, idx) => ({ v, s: semesters[idx]?.labelEn }))}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="v" stroke={SPARKLINE_COLOR} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
