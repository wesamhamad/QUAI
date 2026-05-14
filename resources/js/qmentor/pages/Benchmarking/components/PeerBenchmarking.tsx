import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { PeerUniversity } from '../types';

interface Props {
  peers: PeerUniversity[];
}

const PEER_COLORS = ['#25935F', '#2E90FA', '#F5BD02', '#7A5AF8'];

export default function PeerBenchmarking({ peers }: Props) {
  const { t } = useLanguage();

  const gpaData = peers.map(p => ({ name: t(p.nameAr, p.nameEn), [t('المعدل', 'GPA')]: p.avgGpa }));
  const retentionData = peers.map(p => ({ name: t(p.nameAr, p.nameEn), [t('الاستبقاء', 'Retention')]: p.retentionRate }));
  const graduationData = peers.map(p => ({ name: t(p.nameAr, p.nameEn), [t('التخرج', 'Graduation')]: p.graduationRate }));
  const riskData = peers.map(p => ({ name: t(p.nameAr, p.nameEn), [t('الخطر', 'At-Risk')]: p.atRiskPercent }));

  const charts: { titleAr: string; titleEn: string; data: Record<string, string | number>[]; dataKey: string; color: string }[] = [
    { titleAr: 'المعدل التراكمي', titleEn: 'GPA Comparison', data: gpaData, dataKey: t('المعدل', 'GPA'), color: '#25935F' },
    { titleAr: 'معدل الاستبقاء', titleEn: 'Retention Rate', data: retentionData, dataKey: t('الاستبقاء', 'Retention'), color: '#2E90FA' },
    { titleAr: 'معدل التخرج', titleEn: 'Graduation Rate', data: graduationData, dataKey: t('التخرج', 'Graduation'), color: '#F5BD02' },
    { titleAr: 'نسبة الطلاب المعرضين للخطر', titleEn: 'At-Risk Students %', data: riskData, dataKey: t('الخطر', 'At-Risk'), color: '#F04438' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('المقارنة مع الجامعات النظيرة', 'Peer University Benchmarking')}
      </h2>

      {/* Peer Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {peers.map((p, i) => (
          <div
            key={p.id}
            className={`rounded-xl border shadow-sm p-4 ${
              p.id === 'qu'
                ? 'bg-sa-50 dark:bg-sa-950/30 border-sa-200 dark:border-sa-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t(p.nameAr, p.nameEn)}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {p.enrollment.toLocaleString()} {t('طالب', 'students')}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
              <span>{t('المعدل', 'GPA')}: <strong className="text-gray-900 dark:text-white">{p.avgGpa}</strong></span>
              <span>{t('الاستبقاء', 'Ret.')}: <strong className="text-gray-900 dark:text-white">{p.retentionRate}%</strong></span>
              <span>{t('التخرج', 'Grad.')}: <strong className="text-gray-900 dark:text-white">{p.graduationRate}%</strong></span>
              <span>{t('الخطر', 'Risk')}: <strong className="text-gray-900 dark:text-white">{p.atRiskPercent}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map((chart, ci) => (
          <div key={ci} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              {t(chart.titleAr, chart.titleEn)}
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey={chart.dataKey} radius={[4, 4, 0, 0]}>
                    {chart.data.map((_, idx) => (
                      <Cell key={idx} fill={peers[idx]?.id === 'qu' ? '#25935F' : PEER_COLORS[idx % PEER_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
