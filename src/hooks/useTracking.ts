// hooks/useTracking.ts
'use client';

import { useCallback } from 'react';
import { trackEvent } from '@/lib/tracking';

/**
 * Hook for tracking user interactions in components
 */
export function useTracking() {
  const track = useCallback((eventName: string, context?: Record<string, any>) => {
    trackEvent({
      event: eventName,
      context,
    });
  }, []);

  return { track };
}
