import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  accentColor?: string;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions, accentColor }: PageHeaderProps) {
  const { dir } = useLanguage();
  const Chevron = dir === 'rtl' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <Chevron className="w-3 h-3" />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-sa-600 dark:hover:text-sa-400 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 dark:text-gray-300 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {accentColor && (
              <div className={`w-1 h-7 rounded-full ${accentColor}`} />
            )}
            <h1 className="text-h1 text-gray-900 dark:text-white">{title}</h1>
          </div>
          {subtitle && (
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
