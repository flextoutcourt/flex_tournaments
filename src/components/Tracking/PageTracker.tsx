// components/Tracking/PageTracker.tsx
'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

interface PageTrackerProps {
  eventName: string;
  context?: Record<string, any>;
}

/**
 * Component to track page views and route changes
 * Place at the top of page components
 */
export function PageTracker({ eventName, context }: PageTrackerProps) {
  useEffect(() => {
    trackEvent({
      event: eventName,
      context,
    });
  }, [eventName, context]);

  return null;
}
