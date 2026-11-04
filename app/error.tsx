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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0C0A] text-[#FAF8F5] p-6 text-center">
      <div className="max-w-md p-8 rounded-2xl border border-[#BA5227]/30 bg-[#1C1512]/90 backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
          SYSTEM NOTICE
        </span>
        <h1 className="text-2xl font-heading font-bold text-[#FAF8F5] mb-2">Experience Interruption</h1>
        <p className="text-xs sm:text-sm text-[#D6CEC2] leading-relaxed mb-6 font-body">
          An unexpected interruption occurred during timeline execution. You can reset the experience state.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer"
        >
          Reset Experience
        </button>
      </div>
    </div>
  );
}
