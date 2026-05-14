import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextValue {
  lang: Language;
  dir: Direction;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('qmentor-lang') as Language) || 'ar';
    }
    return 'ar';
  });

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('qmentor-lang', lang);
  }, [lang, dir]);

  const toggleLanguage = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
