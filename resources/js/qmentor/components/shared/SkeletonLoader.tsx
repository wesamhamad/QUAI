import type { CSSProperties } from 'react';

interface SkeletonBaseProps {
  className?: string;
}

function Pulse({ className = '', style }: SkeletonBaseProps & { style?: CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard({ className = '' }: SkeletonBaseProps) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Pulse className="h-4 w-24 mb-2" />
          <Pulse className="h-7 w-16" />
          <Pulse className="h-3 w-20 mt-2" />
        </div>
        <Pulse className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }: SkeletonBaseProps & { rows?: number; cols?: number }) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden ${className}`}>
      <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Pulse key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Pulse key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = '' }: SkeletonBaseProps) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 ${className}`}>
      <Pulse className="h-5 w-32 mb-4" />
      <div className="flex items-end gap-2 h-40">
        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75].map((h, i) => (
          <Pulse key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonBaseProps & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }: SkeletonBaseProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return <Pulse className={`rounded-full ${sizes[size]} ${className}`} />;
}
