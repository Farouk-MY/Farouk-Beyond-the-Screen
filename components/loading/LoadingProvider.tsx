'use client';

import React, { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { LoadingState, TrackedResource, LoadingContextValue } from '@/types/loading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const LoadingContext = createContext<LoadingContextValue | null>(null);

const STORAGE_KEY = 'farouk_intro_viewed';
const MIN_DISPLAY_TIME_MS = 850;
const MAX_SAFETY_TIMEOUT_MS = 3800;

const DEFAULT_RESOURCES: Record<string, TrackedResource> = {
  fonts: { id: 'fonts', weight: 20, ready: false },
  poster: { id: 'poster', weight: 20, ready: false },
  idleVideo: { id: 'idleVideo', weight: 35, ready: false },
  scrubVideo: { id: 'scrubVideo', weight: 25, ready: false },
};

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [loadingState, setLoadingState] = useState<LoadingState>(() =>
    prefersReducedMotion ? 'COMPLETE' : 'LOADING'
  );
  const [resources, setResources] = useState<Record<string, TrackedResource>>(DEFAULT_RESOURCES);
  const [isSkipped, setIsSkipped] = useState<boolean>(() => prefersReducedMotion);

  const startTimeRef = useRef<number>(0);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Register a new resource dynamically
  const registerResource = useCallback((id: string, weight: number) => {
    setResources((prev) => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: { id, weight, ready: false },
      };
    });
  }, []);

  // Mark a resource as ready
  const reportReady = useCallback((id: string) => {
    setResources((prev) => {
      if (!prev[id] || prev[id].ready) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ready: true },
      };
    });
  }, []);

  // Compute weighted progress directly from resource state
  const progress = useMemo(() => {
    if (isSkipped) return 100;
    const list = Object.values(resources);
    const totalWeight = list.reduce((sum, r) => sum + r.weight, 0);
    const readyWeight = list.reduce((sum, r) => sum + (r.ready ? r.weight : 0), 0);
    return totalWeight > 0 ? Math.min(100, Math.round((readyWeight / totalWeight) * 100)) : 100;
  }, [resources, isSkipped]);

  // Skip or fast-track loading
  const skipLoading = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setIsSkipped(true);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    setLoadingState('REVEALING');
    completeTimeoutRef.current = setTimeout(() => {
      setLoadingState('COMPLETE');
    }, 400);
  }, []);

  // When all resources report ready, orchestrate the smooth reveal transition
  useEffect(() => {
    if (progress >= 100 && (loadingState === 'INITIALIZING' || loadingState === 'LOADING')) {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);

      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = setTimeout(() => {
        setLoadingState('READY');
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch {}

        revealTimeoutRef.current = setTimeout(() => {
          setLoadingState('REVEALING');

          if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
          completeTimeoutRef.current = setTimeout(() => {
            setLoadingState('COMPLETE');
          }, 500);
        }, 150);
      }, remainingTime);
    }
  }, [progress, loadingState]);

  // Initial mount verification & automatic listeners
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }

    // Check if user already completed intro during this browser session
    try {
      const alreadyViewed = sessionStorage.getItem(STORAGE_KEY);
      if (alreadyViewed === 'true') {
        const timer = setTimeout(() => {
          setLoadingState('COMPLETE');
          setIsSkipped(true);
        }, 50);
        return () => clearTimeout(timer);
      }
    } catch {}

    // 1. Font readiness check
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready
        .then(() => reportReady('fonts'))
        .catch(() => reportReady('fonts'));
    } else {
      setTimeout(() => reportReady('fonts'), 0);
    }

    // 2. Poster image preloading check
    if (typeof window !== 'undefined') {
      const posterImg = new Image();
      posterImg.onload = () => reportReady('poster');
      posterImg.onerror = () => reportReady('poster');
      posterImg.src = '/posters/act-01-poster.jpg';
    }

    // 3. Safety timeout: never leave the screen stuck on constrained network
    safetyTimeoutRef.current = setTimeout(() => {
      // Force all remaining items ready
      setResources((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((k) => {
          updated[k] = { ...updated[k], ready: true };
        });
        return updated;
      });
      setLoadingState('READY');
      revealTimeoutRef.current = setTimeout(() => {
        setLoadingState('REVEALING');
        completeTimeoutRef.current = setTimeout(() => setLoadingState('COMPLETE'), 500);
      }, 100);
    }, MAX_SAFETY_TIMEOUT_MS);

    return () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    };
  }, [prefersReducedMotion, reportReady]);

  const contextValue = useMemo<LoadingContextValue>(
    () => ({
      loadingState,
      progress,
      isComplete: loadingState === 'COMPLETE',
      registerResource,
      reportReady,
      skipLoading,
    }),
    [loadingState, progress, registerResource, reportReady, skipLoading]
  );

  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
}
