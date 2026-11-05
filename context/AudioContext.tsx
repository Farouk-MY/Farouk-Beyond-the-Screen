'use client';

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';
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
const SOUND_EVENT = 'farouk_sound_change';
const VOLUME_EVENT = 'farouk_volume_change';

function subscribeSound(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(SOUND_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SOUND_EVENT, callback);
  };
}

function getSoundSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getSoundServerSnapshot(): boolean {
  return false;
}

function subscribeVolume(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(VOLUME_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(VOLUME_EVENT, callback);
  };
}

function getVolumeSnapshot(): number {
  try {
    const storedVol = localStorage.getItem(VOLUME_KEY);
    if (storedVol !== null) {
      const parsed = parseFloat(storedVol);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {}
  return 0.5;
}

function getVolumeServerSnapshot(): number {
  return 0.5;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // useSyncExternalStore guarantees zero hydration mismatch and safe client state synchronization
  const rawSoundEnabled = useSyncExternalStore(subscribeSound, getSoundSnapshot, getSoundServerSnapshot);
  const volume = useSyncExternalStore(subscribeVolume, getVolumeSnapshot, getVolumeServerSnapshot);

  const effectiveSoundEnabled = rawSoundEnabled && !prefersReducedMotion;

  // Sync sound engine whenever state changes
  useEffect(() => {
    soundEngine.setEnabled(effectiveSoundEnabled);
    soundEngine.setVolume(volume);
  }, [effectiveSoundEnabled, volume]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEngine.setEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
      window.dispatchEvent(new Event(SOUND_EVENT));
    } catch {}

    if (enabled) {
      soundEngine.playMechanicalClick('deep');
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!rawSoundEnabled);
  }, [rawSoundEnabled, setSoundEnabled]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    soundEngine.setVolume(clamped);
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped));
      window.dispatchEvent(new Event(VOLUME_EVENT));
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
