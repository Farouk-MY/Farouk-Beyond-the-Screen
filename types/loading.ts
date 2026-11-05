export type LoadingState =
  | 'INITIALIZING'
  | 'LOADING'
  | 'READY'
  | 'REVEALING'
  | 'COMPLETE'
  | 'ERROR_FALLBACK';

export interface TrackedResource {
  id: string;
  weight: number;
  ready: boolean;
}

export interface LoadingContextValue {
  loadingState: LoadingState;
  progress: number; // 0 - 100
  isComplete: boolean;
  registerResource: (id: string, weight: number) => void;
  reportReady: (id: string) => void;
  skipLoading: () => void;
}
