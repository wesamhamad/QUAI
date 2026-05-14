import type { ReactNode } from 'react';

type Variant = 'no-data' | 'no-results' | 'error' | 'coming-soon';

interface EmptyStateProps {
  variant?: Variant;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const illustrations: Record<Variant, ReactNode> = {
  'no-data': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300 dark:text-gray-600">
      <rect x="16" y="20" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="32" x2="64" y2="32" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="50" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  ),
  'no-results': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-300 dark:text-gray-600">
      <circle cx="36" cy="36" r="16" stroke="currentColor" strokeWidth="2" />
      <line x1="48" y1="48" x2="60" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="36" x2="42" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'error': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-error-500/60">
      <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="50" r="1.5" fill="currentColor" />
    </svg>
  ),
  'coming-soon': (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-sa-400 dark:text-sa-600">
      <path d="M40 16L44 28H56L46 36L50 48L40 40L30 48L34 36L24 28H36L40 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="56" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="48" cy="58" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="58" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  ),
};

export default function EmptyState({
  variant = 'no-data',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">{illustrations[variant]}</div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
