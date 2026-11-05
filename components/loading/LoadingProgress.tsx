'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LoadingProgressProps {
  targetProgress: number;
  statusMessage?: string;
  isRtl?: boolean;
}

export function LoadingProgress({
  targetProgress,
  statusMessage,
  isRtl = false,
}: LoadingProgressProps) {
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const currentRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Smooth lerp interpolation for the numeric counter & bar
  useEffect(() => {
    const target = targetProgress;

    const animate = () => {
      const diff = target - currentRef.current;
      if (Math.abs(diff) < 0.4) {
        currentRef.current = target;
        setDisplayProgress(target);
      } else {
        currentRef.current += diff * 0.18;
        setDisplayProgress(currentRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetProgress]);

  const rounded = Math.min(100, Math.max(0, Math.round(displayProgress)));
  const formattedPercent = String(rounded).padStart(2, '0');

  // Dynamic telemetry status if none provided
  const telemetryStatus =
    statusMessage ||
    (rounded < 30
      ? 'CALIBRATING CORE TYPOGRAPHY'
      : rounded < 60
      ? 'INITIALIZING STUDIO STREAM'
      : rounded < 90
      ? 'SYNCHRONIZING FRAME RUNWAY'
      : 'EXPERIENCE READY');

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs sm:max-w-sm select-none">
      {/* Numeric Percentage & Telemetry Label */}
      <div className="flex items-center justify-between w-full px-1 text-[11px] font-mono tracking-wider">
        <span className="text-[#A89D8F] uppercase text-[10px] tracking-[0.2em] drop-shadow-sm">
          {telemetryStatus}
        </span>
        <span className="font-bold text-[#D4AF37] tabular-nums drop-shadow-sm">
          {formattedPercent}%
        </span>
      </div>

      {/* Architectural Progress Hairline Bar */}
      <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-[#BA5227] via-[#D4AF37] to-[#E59368] transition-transform duration-75 ease-out ${
            isRtl ? 'origin-right' : 'origin-left'
          }`}
          style={{ transform: `scaleX(${rounded / 100})` }}
        />
        {/* Subtle glowing head */}
        <div
          className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none transition-transform duration-75 ease-out blur-[1px]"
          style={{
            transform: isRtl
              ? `translateX(${(1 - rounded / 100) * 100}%)`
              : `translateX(${(rounded / 100) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
