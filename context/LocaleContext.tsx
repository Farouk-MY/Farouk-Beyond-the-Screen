'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Locale, TranslationDictionary } from '@/config/translations/types';
import { enDictionary } from '@/config/translations/en';
import { arDictionary } from '@/config/translations/ar';
import { soundEngine } from '@/lib/audio/SoundEngine';

interface LocaleContextValue {
  locale: Locale;
  isRtl: boolean;
  t: TranslationDictionary;
  setLocale: (newLocale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'farouk_portfolio_locale_v1';

export function LocaleProvider({
  initialLocale = 'en',
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/ar')) return 'ar';
      if (path.startsWith('/en')) return 'en';
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (stored === 'en' || stored === 'ar') return stored;
        if (navigator.language?.startsWith('ar')) return 'ar';
      } catch {}
    }
    return initialLocale;
  });

  // Track prop changes if route changes from /en to /ar or vice versa
  const [prevInitialLocale, setPrevInitialLocale] = useState(initialLocale);
  if (initialLocale !== prevInitialLocale) {
    setPrevInitialLocale(initialLocale);
    setLocaleState(initialLocale);
  }

  // Derive dictionary and RTL flag
  const t = locale === 'ar' ? arDictionary : enDictionary;
  const isRtl = locale === 'ar';

  // Synchronize document dir and lang attributes
  const syncDocumentAttributes = useCallback((loc: Locale) => {
    if (typeof document === 'undefined') return;
    const isAr = loc === 'ar';
    document.documentElement.lang = loc;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    if (isAr) {
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.documentElement.classList.remove('rtl-layout');
    }
  }, []);

  // Synchronize document attributes whenever locale changes
  useEffect(() => {
    syncDocumentAttributes(locale);
  }, [locale, syncDocumentAttributes]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;

      setLocaleState(newLocale);
      syncDocumentAttributes(newLocale);

      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
      } catch {}

      // Play soft tactile click
      soundEngine.playMechanicalClick('light');

      // Update URL without triggering a full page reload or resetting scroll progress
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        let newPath = `/${newLocale}`;
        if (currentPath.startsWith('/en') || currentPath.startsWith('/ar')) {
          newPath = currentPath.replace(/^\/(en|ar)/, `/${newLocale}`);
        }
        window.history.pushState(null, '', newPath);
      }
    },
    [locale, syncDocumentAttributes]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        isRtl,
        t,
        setLocale,
        toggleLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    // Return safe default fallback
    return {
      locale: 'en' as Locale,
      isRtl: false,
      t: enDictionary,
      setLocale: () => {},
      toggleLocale: () => {},
    };
  }
  return context;
}
