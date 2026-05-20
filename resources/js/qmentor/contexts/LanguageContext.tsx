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

declare global {
  interface Window {
    __qmentor_locale?: string;
    __qmentor_lang_url?: string;
    __qmentor_csrf?: string;
  }
}

// Seed from the Laravel session locale injected via qmentor/app.blade.php so
// the SPA opens in the same language the QUAI shell is currently using. Falls
// back to a previously-saved local choice, then Arabic.
function initialLang(): Language {
  if (typeof window === 'undefined') return 'ar';
  const server = window.__qmentor_locale === 'en' ? 'en' : window.__qmentor_locale === 'ar' ? 'ar' : null;
  if (server) return server;
  const stored = localStorage.getItem('qmentor-lang');
  return stored === 'en' || stored === 'ar' ? stored : 'ar';
}

// Push the SPA's choice back to the Laravel session so QUAI/Filament/QSpark
// pick it up on the next navigation. Best-effort: a failed request does not
// block the SPA-side toggle.
function persistLaravelLocale(lang: Language): void {
  if (typeof window === 'undefined') return;
  const base = window.__qmentor_lang_url;
  if (!base) return;
  try {
    fetch(`${base}/${lang}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(window.__qmentor_csrf ? { 'X-CSRF-TOKEN': window.__qmentor_csrf } : {}),
      },
    }).catch(() => undefined);
  } catch {
    /* noop */
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLang);

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('qmentor-lang', lang);
  }, [lang, dir]);

  const toggleLanguage = () => {
    setLang(prev => {
      const next: Language = prev === 'ar' ? 'en' : 'ar';
      persistLaravelLocale(next);
      return next;
    });
  };
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
