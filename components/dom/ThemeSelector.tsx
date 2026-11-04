'use client';

import React, { useEffect } from 'react';
import { useThemeStore, ThemeMode } from '@/stores/useThemeStore';

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: string }[] = [
  { id: 'auto', label: 'AUTO', icon: '◎' },
  { id: 'day', label: 'DAY', icon: '☼' },
  { id: 'sunset', label: 'SUNSET', icon: '◑' },
  { id: 'night', label: 'NIGHT', icon: '☾' },
];

export function ThemeSelector() {
  const { themeMode, resolvedTheme, setThemeMode, syncDOM } = useThemeStore();

  useEffect(() => {
    syncDOM();

    if (typeof window !== 'undefined') {
      (window as unknown as { __SET_THEME_MODE?: (m: ThemeMode) => void }).__SET_THEME_MODE = setThemeMode;
    }

    // Re-evaluate auto theme every minute
    const interval = setInterval(() => {
      if (useThemeStore.getState().themeMode === 'auto') {
        useThemeStore.getState().setThemeMode('auto');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [syncDOM, setThemeMode]);

  return (
    <div
      role="group"
      aria-label="Atmospheric Theme Selector"
      className="inline-flex items-center p-1 rounded-full editorial-glass transition-all duration-300 select-none"
      style={{
        borderColor: 'var(--theme-border)',
      }}
    >
      {THEME_OPTIONS.map((opt) => {
        const isSelected = themeMode === opt.id;
        const isAutoActive = opt.id === 'auto' && isSelected;

        return (
          <button
            key={opt.id}
            data-theme-option={opt.id}
            type="button"
            onClick={() => setThemeMode(opt.id)}
            className="relative px-3 py-1 text-xs font-mono tracking-wider transition-all duration-200 rounded-full flex items-center gap-1.5 focus:outline-none"
            style={{
              background: isSelected ? 'var(--theme-pill-active)' : 'transparent',
              color: isSelected ? 'var(--theme-pill-active-fg)' : 'var(--theme-fg-muted)',
              fontWeight: isSelected ? 600 : 400,
            }}
            title={opt.id === 'auto' ? `Auto (Active: ${resolvedTheme.toUpperCase()})` : opt.label}
          >
            <span className="text-[11px] opacity-85">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
            {isAutoActive && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    resolvedTheme === 'day'
                      ? '#E67E22'
                      : resolvedTheme === 'sunset'
                      ? '#EA7E4B'
                      : '#38BDF8',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

