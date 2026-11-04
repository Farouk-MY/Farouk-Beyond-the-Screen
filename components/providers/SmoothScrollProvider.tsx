'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SmoothScrollContextValue {
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  getLenis: () => null,
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Register ScrollTrigger within client boundary
    gsap.registerPlugin(ScrollTrigger);

    // Instantiate Lenis with autoRaf disabled to enable unified GSAP ticker synchronization
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Direct scroll events into ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    // Synchronize Lenis RAF with GSAP Ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Cleanup strictly scoped to this provider instance
    return () => {
      gsap.ticker.remove(tickerCallback);
      gsap.ticker.lagSmoothing(500, 33); // Restore GSAP default lag smoothing
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const getLenis = useCallback(() => lenisRef.current, []);

  return (
    <SmoothScrollContext.Provider value={{ getLenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
