import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import { useRiskBacktest } from '../../../hooks/useStudentData';
import EmptyState from '../../DigitalTwin/components/EmptyState';

interface Backtest {
  generated_on: string | null; as_of: string | null; outcome_semester: string | null;
  students: number; tp: number; fp: number; tn: number; fn: number;
  precision: number; recall: number; f1: number; accuracy: number; base_rate: number;
  by_level: { level: number; n: number; failed: number; rate: number; ar: string; en: string; color: string }[];
  model_version: string; definition: { positive: string; predicted: string };
}

/**
 * أداء النموذج — the ground-truth backtest as the evidence command measured
 * it (engine run as-of a past term vs. the next term's posted results).
 * Every figure comes from the stored CSV; nothing here is a target.
 */
export default function PredictionAccuracy() {
  const { t } = useLanguage();
  const { data, source, isLoading } = useRiskBacktest<Backtest | null>(null);
  if (source !== 'api' || !data) {
    return <EmptyState title={isLoading ? t('يُحمَّل…', 'Loading…') : t('لم يُشغَّل الاختبار الرجعي بعد', 'Backtest not run yet')} description={t('يُحسب من qmentor:evidence backtest: المحرك على فصل سابق مقابل نتائج الفصل التالي.', 'Produced by qmentor:evidence backtest.')} icon="chart" />;
  }
  const n = (v: number) => v.toLocaleString('en');
  const Metric = ({ ar, en, value, unit = '%', color }: { ar: string; en: string; value: number | string; unit?: string; color: string }) => (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t(ar, en)}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}{unit}</p>
    </div>
  );
  const lift = data.base_rate > 0 ? data.by_level.map(l => ({ ...l, lift: Math.round((l.rate / data.base_rate) * 100) / 100 })) : data.by_level.map(l => ({ ...l, lift: 0 }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('اختبار رجعي على نتائج فعلية', 'Ground-truth backtest')}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t(`المحرك (${data.model_version}) شُغّل كما لو كان في فصل ${data.as_of} على ${n(data.students)} طالباً، ثم قورن بنتائج فصل ${data.outcome_semester} المعتمدة · أُنتج ${data.generated_on}`,
                 `Engine ${data.model_version} run as of term ${data.as_of} on ${n(data.students)} students, checked against term ${data.outcome_semester} · produced ${data.generated_on}`)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t(`التعثّر = ${data.definition.positive} · التنبؤ = ${data.definition.predicted}`, '')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Metric ar="الدقة (Precision)" en="Precision" value={data.precision} color="text-sa-600" />
          <Metric ar="الاستدعاء (Recall)" en="Recall" value={data.recall} color="text-sa-600" />
          <Metric ar="F1" en="F1" value={data.f1} color="text-sa-600" />
          <Metric ar="الصواب الكلي" en="Accuracy" value={data.accuracy} color="text-gray-800 dark:text-gray-100" />
          <Metric ar="نسبة التعثّر الأساسية" en="Base rate" value={data.base_rate} color="text-gray-800 dark:text-gray-100" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('مصفوفة الالتباس', 'Confusion matrix')}</h3>
          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-lg bg-sa-50 dark:bg-sa-950 p-3"><div className="text-xs text-gray-500">{t('تنبّأ وتعثّر (TP)', 'TP')}</div><div className="text-xl font-bold text-sa-700 dark:text-sa-300">{n(data.tp)}</div></div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3"><div className="text-xs text-gray-500">{t('تنبّأ ولم يتعثّر (FP)', 'FP')}</div><div className="text-xl font-bold text-amber-700 dark:text-amber-300">{n(data.fp)}</div></div>
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3"><div className="text-xs text-gray-500">{t('لم يتنبّأ وتعثّر (FN)', 'FN')}</div><div className="text-xl font-bold text-red-700 dark:text-red-300">{n(data.fn)}</div></div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 p-3"><div className="text-xs text-gray-500">{t('لم يتنبّأ ولم يتعثّر (TN)', 'TN')}</div><div className="text-xl font-bold text-gray-800 dark:text-gray-100">{n(data.tn)}</div></div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('التعثّر الفعلي بحسب مستوى التنبؤ', 'Observed failure by predicted level')}</h3>
          <p className="text-[11px] text-gray-400 mb-3">{t('الرفع = نسبة التعثّر في المستوى ÷ النسبة الأساسية', 'lift = level rate ÷ base rate')}</p>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-400 text-right"><th className="py-1">المستوى</th><th className="py-1">طلاب</th><th className="py-1">تعثّروا</th><th className="py-1">النسبة</th><th className="py-1">الرفع</th></tr></thead>
            <tbody>
              {lift.map(l => (
                <tr key={l.level} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-1.5 font-semibold text-gray-800 dark:text-gray-100">{t(l.ar, l.en)}</td>
                  <td className="py-1.5 tabular-nums">{n(l.n)}</td><td className="py-1.5 tabular-nums">{n(l.failed)}</td>
                  <td className="py-1.5 tabular-nums">{l.rate}%</td><td className="py-1.5 tabular-nums font-semibold">×{l.lift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
