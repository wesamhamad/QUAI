import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  source: 'api' | 'mock';
  /** ISO timestamp of the last sync behind the figures, when the page knows it. */
  syncedAt?: string | null;
}

/**
 * «مباشر» when the page is reading the platform's own tables or SIS, «بيانات
 * توضيحية» when it fell back to the bundled sample — so a screenshot can
 * never pass a sample off as a measurement.
 */
export default function DataSourceBadge({ source, syncedAt }: Props) {
  const { t, lang } = useLanguage();
  const live = source === 'api';
  const when = syncedAt ? new Date(syncedAt) : null;
  const ago = when && !Number.isNaN(when.getTime())
    ? new Intl.RelativeTimeFormat(lang === 'ar' ? 'ar' : 'en', { numeric: 'auto' }).format(Math.round((when.getTime() - Date.now()) / 3600000), 'hour')
    : null;

  return (
    <span
      title={live ? t('يقرأ من قاعدة المنصة ونظام SIS', 'Read from the platform tables and SIS') : t('عرض توضيحي حتى تُحمَّل البيانات', 'Sample data until the feed is loaded')}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        live
          ? 'bg-sa-50 text-sa-700 border border-sa-200 dark:bg-sa-950 dark:text-sa-300 dark:border-sa-800'
          : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-sa-500' : 'bg-amber-500'}`} aria-hidden />
      {live ? t('مباشر', 'Live') : t('بيانات توضيحية', 'Sample data')}
      {live && ago && <span className="font-normal opacity-75">· {t('آخر مزامنة', 'synced')} {ago}</span>}
    </span>
  );
}
