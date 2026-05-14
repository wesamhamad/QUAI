interface Props {
  title: string;
  description: string;
  icon?: 'chart' | 'list' | 'shield' | 'bot' | 'calendar' | 'book' | 'courses';
}

function EmptyIllustration({ icon }: { icon: string }) {
  return (
    <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="20" width="60" height="45" rx="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      {icon === 'chart' && (
        <>
          <polyline points="20,50 30,40 40,45 50,30 60,35" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="30" cy="40" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="40" cy="45" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="50" cy="30" r="2" fill="currentColor" opacity="0.5" />
        </>
      )}
      {icon === 'list' && (
        <>
          <line x1="22" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="22" y1="40" x2="50" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <line x1="22" y1="48" x2="55" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
          <line x1="22" y1="56" x2="42" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
        </>
      )}
      {(icon === 'shield' || icon === 'bot') && (
        <path d="M40 28 L52 34 V46 C52 52 46 58 40 60 C34 58 28 52 28 46 V34 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
      )}
      {icon === 'calendar' && (
        <>
          <line x1="20" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          {[28, 36, 44, 52].map(x => [40, 48, 56].map(y => (
            <rect key={`${x}-${y}`} x={x} y={y} width="6" height="5" rx="1" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          )))}
        </>
      )}
      {(icon === 'book' || icon === 'courses') && (
        <>
          <rect x="24" y="28" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <rect x="42" y="28" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
          <rect x="33" y="34" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        </>
      )}
    </svg>
  );
}

export default function EmptyState({ title, description, icon = 'chart' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <EmptyIllustration icon={icon} />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-3">{title}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{description}</p>
    </div>
  );
}
