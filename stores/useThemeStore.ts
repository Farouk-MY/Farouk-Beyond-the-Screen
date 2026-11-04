'use client';

import { create } from 'zustand';

export type ThemeMode = 'auto' | 'day' | 'sunset' | 'night';
export type ResolvedTheme = 'day' | 'sunset' | 'night';

export function resolveTimeBasedTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'day';
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'night';
}

interface ThemeState {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  syncDOM: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'auto',
  resolvedTheme: 'day', // baseline initial

  setThemeMode: (mode: ThemeMode) => {
    let resolved: ResolvedTheme;
    if (mode === 'auto') {
      resolved = resolveTimeBasedTheme();
    } else {
      resolved = mode;
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('farouk_theme_mode', mode);
      } catch {}
      document.documentElement.setAttribute('data-theme', resolved);
    }

    set({ themeMode: mode, resolvedTheme: resolved });
  },

  syncDOM: () => {
    if (typeof window === 'undefined') return;

    let savedMode: ThemeMode = 'auto';
    try {
      const stored = localStorage.getItem('farouk_theme_mode') as ThemeMode;
      if (stored && ['auto', 'day', 'sunset', 'night'].includes(stored)) {
        savedMode = stored;
      }
    } catch {}

    const resolved = savedMode === 'auto' ? resolveTimeBasedTheme() : savedMode;
    document.documentElement.setAttribute('data-theme', resolved);
    set({ themeMode: savedMode, resolvedTheme: resolved });
  },
}));
