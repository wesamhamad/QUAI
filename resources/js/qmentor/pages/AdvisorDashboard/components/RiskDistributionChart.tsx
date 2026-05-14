import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';

interface RiskDistributionChartProps {
  distribution: { critical: number; high: number; medium: number; low: number };
}

const COLORS = {
  critical: '#D92D20',
  high: '#F04438',
  medium: '#F5BD02',
  low: '#25935F',
};

export default function RiskDistributionChart({ distribution }: RiskDistributionChartProps) {
  const { t } = useLanguage();

  const data = [
    { name: t('حرج', 'Critical'), value: distribution.critical, color: COLORS.critical },
    { name: t('مرتفع', 'High'), value: distribution.high, color: COLORS.high },
    { name: t('متوسط', 'Medium'), value: distribution.medium, color: COLORS.medium },
    { name: t('منخفض', 'Low'), value: distribution.low, color: COLORS.low },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {t('توزيع المخاطر', 'Risk Distribution')}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-gray-800, #1F2A37)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend counts */}
      <div className="mt-3 space-y-2">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
