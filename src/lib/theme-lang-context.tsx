'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from './translations';

export type Language = 'en' | 'bn' | 'ar' | 'es' | 'fr' | 'de' | 'hi' | 'ur' | 'zh' | 'ja';
export type Theme = 'dark' | 'light';

interface ThemeLangContextType {
  theme: Theme;
  lang: Language;
  setTheme: (theme: Theme) => void;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const ThemeLangContext = createContext<ThemeLangContextType | undefined>(undefined);

export function ThemeLangProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize theme and language on client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('flowsuite-theme') as Theme;
    const savedLang = localStorage.getItem('flowsuite-lang') as Language;

    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }

    if (savedLang) {
      setLangState(savedLang);
    } else {
      // Auto-detect browser language if it is supported
      const browserLang = navigator.language.split('-')[0] as Language;
      const supportedLangs: Language[] = ['en', 'bn', 'ar', 'es', 'fr', 'de', 'hi', 'ur', 'zh', 'ja'];
      if (supportedLangs.includes(browserLang)) {
        setLangState(browserLang);
      }
    }

    setMounted(true);
  }, []);

  // Sync theme to document element class
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('flowsuite-theme', theme);
  }, [theme, mounted]);

  // Sync language to local storage
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('flowsuite-lang', newLang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Translation lookup function
  const t = (key: TranslationKey): string => {
    const translationGroup = translations[key];
    if (!translationGroup) return String(key);
    return translationGroup[lang] || translationGroup['en'] || String(key);
  };

  return (
    <ThemeLangContext.Provider value={{ theme, lang, setTheme, setLang, t }}>
      {children}
    </ThemeLangContext.Provider>
  );
}

export function useThemeLang() {
  const context = useContext(ThemeLangContext);
  if (!context) {
    throw new Error('useThemeLang must be used within a ThemeLangProvider');
  }
  return context;
}
