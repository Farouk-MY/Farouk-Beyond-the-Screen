'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07080B] text-[#F3F6FA] p-6 text-center">
      <div className="max-w-md p-8 rounded-2xl border border-red-500/30 bg-[#0E1117]/90 backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono border border-red-500/30 bg-red-500/10 text-red-400 mb-4">
          SYSTEM INTERRUPT
        </span>
        <h1 className="text-2xl font-extrabold text-[#F3F6FA] mb-2">Rendering Pipeline Exception</h1>
        <p className="text-xs sm:text-sm text-[#8E9CAE] leading-relaxed mb-6">
          An unexpected interruption occurred during scene graph execution. You can attempt to reset the runtime state.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-[#00F2FE] text-[#07080B] hover:bg-[#38F9D7] transition-all cursor-pointer"
        >
          Reset Environment
        </button>
      </div>
    </div>
  );
}

