import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';

// Simulated model performance metrics
const modelMetrics = {
  accuracy: 87.3,
  precision: 84.1,
  recall: 91.2,
  f1Score: 87.5,
  auc: 0.923,
  lastTrained: '2026-04-01',
  dataPoints: 142580,
  truePositives: 1842,
  falsePositives: 348,
  trueNegatives: 65340,
  falseNegatives: 178,
};

const weeklyAccuracy = [
  { weekAr: 'أسبوع 1', weekEn: 'Week 1', accuracy: 82.1, precision: 79.3, recall: 88.5 },
  { weekAr: 'أسبوع 2', weekEn: 'Week 2', accuracy: 83.8, precision: 80.7, recall: 89.1 },
  { weekAr: 'أسبوع 3', weekEn: 'Week 3', accuracy: 85.2, precision: 81.9, recall: 89.8 },
  { weekAr: 'أسبوع 4', weekEn: 'Week 4', accuracy: 84.9, precision: 82.5, recall: 90.3 },
  { weekAr: 'أسبوع 5', weekEn: 'Week 5', accuracy: 86.1, precision: 83.2, recall: 90.7 },
  { weekAr: 'أسبوع 6', weekEn: 'Week 6', accuracy: 86.7, precision: 83.8, recall: 91.0 },
  { weekAr: 'أسبوع 7', weekEn: 'Week 7', accuracy: 87.0, precision: 84.0, recall: 91.1 },
  { weekAr: 'أسبوع 8', weekEn: 'Week 8', accuracy: 87.3, precision: 84.1, recall: 91.2 },
];

export default function PredictionAccuracy() {
  const { t } = useLanguage();

  const chartData = weeklyAccuracy.map(w => ({
    week: t(w.weekAr, w.weekEn),
    [t('الدقة', 'Accuracy')]: w.accuracy,
    [t('الضبط', 'Precision')]: w.precision,
    [t('الاستدعاء', 'Recall')]: w.recall,
  }));

  const MetricCard = ({ labelAr, labelEn, value, unit = '%', color }: { labelAr: string; labelEn: string; value: number | string; unit?: string; color: string }) => (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t(labelAr, labelEn)}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-sm font-normal text-gray-400 ms-0.5">{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('أداء النموذج التنبؤي', 'Prediction Model Performance')}
      </h2>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard labelAr="الدقة الكلية" labelEn="Accuracy" value={modelMetrics.accuracy} color="text-sa-600 dark:text-sa-400" />
        <MetricCard labelAr="الضبط" labelEn="Precision" value={modelMetrics.precision} color="text-info-600 dark:text-info-400" />
        <MetricCard labelAr="الاستدعاء" labelEn="Recall" value={modelMetrics.recall} color="text-lavender-600 dark:text-lavender-400" />
        <MetricCard labelAr="درجة F1" labelEn="F1 Score" value={modelMetrics.f1Score} color="text-warning-600 dark:text-warning-400" />
        <MetricCard labelAr="مساحة AUC" labelEn="AUC" value={modelMetrics.auc} unit="" color="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Accuracy trend chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('اتجاه أداء النموذج (8 أسابيع)', 'Model Performance Trend (8 Weeks)')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey={t('الدقة', 'Accuracy')} stroke="#25935F" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey={t('الضبط', 'Precision')} stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey={t('الاستدعاء', 'Recall')} stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('مصفوفة الارتباك', 'Confusion Matrix')}
          </h3>
          <div className="flex items-center justify-center h-64">
            <div className="grid grid-cols-2 gap-2 w-64">
              {/* Headers */}
              <div className="col-span-2 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('القيم المتوقعة', 'Predicted Values')}
              </div>
              {/* TP */}
              <div className="bg-success-100 dark:bg-success-900/30 rounded-xl p-4 text-center">
                <p className="text-xs text-success-600 dark:text-success-400 mb-1">
                  {t('إيجابي صحيح', 'True Positive')}
                </p>
                <p className="text-xl font-bold text-success-700 dark:text-success-300">
                  {modelMetrics.truePositives.toLocaleString()}
                </p>
              </div>
              {/* FP */}
              <div className="bg-error-50 dark:bg-error-900/20 rounded-xl p-4 text-center">
                <p className="text-xs text-error-500 dark:text-error-400 mb-1">
                  {t('إيجابي خاطئ', 'False Positive')}
                </p>
                <p className="text-xl font-bold text-error-600 dark:text-error-400">
                  {modelMetrics.falsePositives.toLocaleString()}
                </p>
              </div>
              {/* FN */}
              <div className="bg-warning-50 dark:bg-warning-900/20 rounded-xl p-4 text-center">
                <p className="text-xs text-warning-600 dark:text-warning-400 mb-1">
                  {t('سلبي خاطئ', 'False Negative')}
                </p>
                <p className="text-xl font-bold text-warning-700 dark:text-warning-400">
                  {modelMetrics.falseNegatives.toLocaleString()}
                </p>
              </div>
              {/* TN */}
              <div className="bg-info-50 dark:bg-info-900/20 rounded-xl p-4 text-center">
                <p className="text-xs text-info-600 dark:text-info-400 mb-1">
                  {t('سلبي صحيح', 'True Negative')}
                </p>
                <p className="text-xl font-bold text-info-700 dark:text-info-400">
                  {modelMetrics.trueNegatives.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            {t(`آخر تدريب: ${modelMetrics.lastTrained} · ${modelMetrics.dataPoints.toLocaleString()} نقطة بيانات`, `Last trained: ${modelMetrics.lastTrained} · ${modelMetrics.dataPoints.toLocaleString()} data points`)}
          </div>
        </div>
      </div>
    </div>
  );
}
