'use client';

import { useContext } from 'react';
import { LoadingContext } from '@/components/loading/LoadingProvider';
import type { LoadingContextValue } from '@/types/loading';

export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    // Return safe no-op fallback if used outside LoadingProvider
    return {
      loadingState: 'COMPLETE',
      progress: 100,
      isComplete: true,
      registerResource: () => {},
      reportReady: () => {},
      skipLoading: () => {},
    };
  }
  return context;
}

