import type { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'subtle' | 'interactive' | 'flush';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
  elevated: 'bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/40',
  outlined: 'bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600',
  subtle: 'bg-gray-50 dark:bg-gray-800/60 rounded-xl',
  interactive: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
  flush: 'bg-white dark:bg-gray-800',
};

export default function Card({ children, className = '', padding = true, variant = 'default' }: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${
        padding ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  accentColor?: string;
}

export function StatCard({ title, value, icon, trend, className = '', size = 'md', accentColor }: StatCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };
  const valueClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-extrabold tracking-tight',
  };

  return (
    <Card className={`${sizeClasses[size]} ${className}`} padding={false} variant="default">
      {accentColor && (
        <div className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${accentColor}`} />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`mt-1.5 text-gray-900 dark:text-white ${valueClasses[size]}`}>{value}</p>
          {trend && (
            <p
              className={`mt-1.5 text-xs font-semibold ${
                trend.positive ? 'text-success-600' : 'text-error-500'
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-sa-50 dark:bg-sa-950 text-sa-600 dark:text-sa-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
