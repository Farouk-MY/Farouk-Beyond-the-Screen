'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { soundEngine } from '@/lib/audio/SoundEngine';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface AudioContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  playClick: (variant?: 'light' | 'deep') => void;
  playChime: (freq?: number) => void;
  playWhoosh: () => void;
  playFeedback: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

const STORAGE_KEY = 'farouk_sound_enabled_v1';
const VOLUME_KEY = 'farouk_sound_volume_v1';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Sound is OFF by default as required by specification; initialize lazily from storage
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0.5;
    try {
      const storedVol = localStorage.getItem(VOLUME_KEY);
      if (storedVol !== null) {
        const parsedVol = parseFloat(storedVol);
        if (!isNaN(parsedVol)) return parsedVol;
      }
    } catch {}
    return 0.5;
  });

  const effectiveSoundEnabled = soundEnabled && !prefersReducedMotion;

  // Sync sound engine whenever state changes
  useEffect(() => {
    soundEngine.setEnabled(effectiveSoundEnabled);
    soundEngine.setVolume(volume);
  }, [effectiveSoundEnabled, volume]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundEngine.setEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {}

    if (enabled) {
      soundEngine.playMechanicalClick('deep');
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, setSoundEnabled]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    soundEngine.setVolume(clamped);
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped));
    } catch {}
  }, []);

  const playClick = useCallback(
    (variant?: 'light' | 'deep') => {
      soundEngine.playMechanicalClick(variant);
    },
    []
  );

  const playChime = useCallback((freq?: number) => {
    soundEngine.playChime(freq);
  }, []);

  const playWhoosh = useCallback(() => {
    soundEngine.playTransitionWhoosh();
  }, []);

  const playFeedback = useCallback(() => {
    soundEngine.playFeedbackChime();
  }, []);

  return (
    <AudioContext.Provider
      value={{
        soundEnabled: effectiveSoundEnabled,
        toggleSound,
        setSoundEnabled,
        volume,
        setVolume,
        playClick,
        playChime,
        playWhoosh,
        playFeedback,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    // Return no-op safe fallback if used outside provider
    return {
      soundEnabled: false,
      toggleSound: () => {},
      setSoundEnabled: () => {},
      volume: 0.5,
      setVolume: () => {},
      playClick: () => {},
      playChime: () => {},
      playWhoosh: () => {},
      playFeedback: () => {},
    };
  }
  return context;
}
