import {
  UsersIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  FireIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StatCard } from '../../../components/ui/Card';
import type { UniversityRiskOverview } from '../types';

interface Props {
  data: UniversityRiskOverview;
}

export default function RiskOverview({ data }: Props) {
  const { t } = useLanguage();

  const trendIcon = data.trend === 'improving' ? (
    <ArrowTrendingDownIcon className="w-4 h-4 text-sa-600" />
  ) : data.trend === 'declining' ? (
    <ArrowTrendingUpIcon className="w-4 h-4 text-error-500" />
  ) : null;

  const overallColor =
    data.overallScore <= 25 ? 'text-sa-600' :
    data.overallScore <= 50 ? 'text-yellow-500' :
    data.overallScore <= 75 ? 'text-error-500' :
    'text-error-600';

  return (
    <div className="space-y-4">
      {/* Overall Score Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sa-500 to-sa-700 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('مؤشر المخاطر العام', 'Overall Risk Score')}
              </p>
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-bold ${overallColor}`}>{data.overallScore}</span>
                <span className="text-sm text-gray-400">/100</span>
                <div className="flex items-center gap-1 text-sm">
                  {trendIcon}
                  <span className={data.trend === 'improving' ? 'text-sa-600' : data.trend === 'declining' ? 'text-error-500' : 'text-gray-500'}>
                    {data.trendDelta > 0 ? '+' : ''}{data.trendDelta}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            <span>{t('إجمالي الطلاب المراقبين', 'Total Students Monitored')}: </span>
            <span className="font-bold text-gray-900 dark:text-white">{data.totalStudents.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Risk Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('خطر منخفض', 'Low Risk')}
          value={data.lowRisk.toLocaleString()}
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          trend={{ value: `${((data.lowRisk / data.totalStudents) * 100).toFixed(1)}%`, positive: true }}
          className="border-s-4 border-s-sa-500"
        />
        <StatCard
          title={t('خطر متوسط', 'Medium Risk')}
          value={data.mediumRisk.toLocaleString()}
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          trend={{ value: `${((data.mediumRisk / data.totalStudents) * 100).toFixed(1)}%`, positive: false }}
          className="border-s-4 border-s-yellow-500"
        />
        <StatCard
          title={t('خطر مرتفع', 'High Risk')}
          value={data.highRisk.toLocaleString()}
          icon={<FireIcon className="w-5 h-5" />}
          trend={{ value: `${((data.highRisk / data.totalStudents) * 100).toFixed(1)}%`, positive: false }}
          className="border-s-4 border-s-error-500"
        />
        <StatCard
          title={t('خطر حرج', 'Critical Risk')}
          value={data.criticalRisk.toLocaleString()}
          icon={<FireIcon className="w-5 h-5" />}
          trend={{ value: `${((data.criticalRisk / data.totalStudents) * 100).toFixed(1)}%`, positive: false }}
          className="border-s-4 border-s-error-600"
        />
      </div>
    </div>
  );
}
