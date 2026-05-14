import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { SemesterSnapshot, MetricKey } from '../types';
import { semesters, metricOptions } from '../data/mockBenchmarkData';

interface Props {
  snapshots: SemesterSnapshot[];
}

const COLORS = ['#25935F', '#2E90FA', '#F5BD02', '#F04438', '#7A5AF8'];

type ViewLevel = 'college' | 'department';

export default function TrendAnalysis({ snapshots }: Props) {
  const { t } = useLanguage();
  const [metric, setMetric] = useState<MetricKey>('avgGpa');
  const [viewLevel, setViewLevel] = useState<ViewLevel>('college');
  const [selectedCollege, setSelectedCollege] = useState<string>('');

  const colleges = snapshots[0].colleges;
  const trendMetrics = metricOptions.filter(m => ['avgGpa', 'retentionRate', 'graduationRate', 'enrollment'].includes(m.key));

  const chartData = semesters.map((sem, si) => {
    const snap = snapshots[si];
    const point: Record<string, string | number> = { semester: t(sem.labelAr, sem.labelEn) };

    if (viewLevel === 'college') {
      for (const c of snap.colleges) {
        const key = t(c.nameAr, c.nameEn);
        point[key] = metric === 'enrollment' ? c.enrollment : (c as Record<string, number | string>)[metric] as number;
      }
    } else {
      const college = snap.colleges.find(c => c.id === selectedCollege) ?? snap.colleges[0];
      for (const d of college.departments) {
        const key = t(d.nameAr, d.nameEn);
        point[key] = (d as Record<string, number | string>)[metric] as number;
      }
    }
    return point;
  });

  const lineKeys = viewLevel === 'college'
    ? colleges.map(c => t(c.nameAr, c.nameEn))
    : (colleges.find(c => c.id === selectedCollege) ?? colleges[0]).departments.map(d => t(d.nameAr, d.nameEn));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('تحليل الاتجاهات', 'Trend Analysis')}
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={metric}
            onChange={e => setMetric(e.target.value as MetricKey)}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5"
          >
            {trendMetrics.map(m => (
              <option key={m.key} value={m.key}>{t(m.labelAr, m.labelEn)}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(['college', 'department'] as ViewLevel[]).map(lv => (
              <button
                key={lv}
                onClick={() => { setViewLevel(lv); if (lv === 'department' && !selectedCollege) setSelectedCollege(colleges[0].id); }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewLevel === lv
                    ? 'bg-sa-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {lv === 'college' ? t('كليات', 'Colleges') : t('أقسام', 'Departments')}
              </button>
            ))}
          </div>
          {viewLevel === 'department' && (
            <select
              value={selectedCollege || colleges[0].id}
              onChange={e => setSelectedCollege(e.target.value)}
              className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5"
            >
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{t(c.nameAr, c.nameEn)}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {lineKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
