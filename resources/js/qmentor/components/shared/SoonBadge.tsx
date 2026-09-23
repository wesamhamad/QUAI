import { useLanguage } from '../../contexts/LanguageContext';
import type { ReactNode } from 'react';

/**
 * A feature we have designed but cannot yet fill with data.
 *
 * Used inline next to a heading, and by SoonPanel below for a whole block.
 * The point is to be honest at the exact place the number would appear —
 * an empty chart with no explanation reads as a bug, and a fabricated one
 * reads as a fact.
 */
export function SoonBadge({ className = '' }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold
        bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400 ${className}`}
    >
      {t('قريباً', 'Soon')}
    </span>
  );
}

interface SoonPanelProps {
  title: string;
  /** Why it is not here yet — always a real reason, never "under development". */
  reason: string;
  icon?: ReactNode;
}

export function SoonPanel({ title, reason, icon }: SoonPanelProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/40 p-6 text-center">
      {icon && (
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">{title}</h4>
        <SoonBadge />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
        {reason}
      </p>
    </div>
  );
}

export default SoonBadge;
