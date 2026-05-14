import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SmartSuggestionsProps {
  suggestions: { label: string; labelEn: string }[];
  onSelect: (text: string) => void;
}

export default function SmartSuggestions({ suggestions, onSelect }: SmartSuggestionsProps) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  if (suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-thin">
      <LightBulbIcon className="w-4 h-4 text-amber-500 shrink-0" />
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(isAr ? s.label : s.labelEn)}
          className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sa-50 dark:hover:bg-sa-950 transition-colors shrink-0"
        >
          {isAr ? s.label : s.labelEn}
        </button>
      ))}
    </div>
  );
}
