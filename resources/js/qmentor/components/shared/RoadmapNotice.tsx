import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// Empty since 2026-09-16: peer tutoring and the mobile app left the bundle. Add the next roadmap screen here.
const LABELS: Record<string, { ar: string; en: string; whyAr: string; whyEn: string }> = {};

/** What a roadmap screen shows instead of its sample UI. */
export default function RoadmapNotice({ path }: { path: string }) {
  const { t } = useLanguage();
  const l = LABELS[path] ?? { ar: path, en: path, whyAr: '', whyEn: '' };

  return (
    <div className="max-w-xl mx-auto mt-16 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-950">
      <div className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">{t('خارطة الطريق', 'Roadmap')}</div>
      <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{t(l.ar, l.en)}</h1>
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{t(l.whyAr, l.whyEn)}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('مذكورة في ملف الرد كمرحلة لاحقة، لا كميزة منجزة.', 'Listed in the response file as a later phase, not a delivered feature.')}</p>
      <div className="mt-6 flex justify-center gap-3 text-sm">
        <Link to="/" className="rounded-lg bg-sa-600 px-4 py-2 font-semibold text-white hover:bg-sa-700">{t('الرئيسية', 'Home')}</Link>
        <Link to={`${path}?preview=1`} className="rounded-lg border border-amber-300 px-4 py-2 font-semibold text-amber-800 dark:text-amber-200">{t('معاينة النموذج', 'Preview the model')}</Link>
      </div>
    </div>
  );
}
