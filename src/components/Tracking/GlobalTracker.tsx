// components/Tracking/GlobalTracker.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { setupGlobalClickTracking, trackPageChange, trackEvent } from '@/lib/tracking';

/**
 * Global tracker component that must be placed in root layout
 * Initializes all click/interaction tracking
 */
export function GlobalTracker() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | undefined>(undefined);

  // Setup global click tracking on mount
  useEffect(() => {
    setupGlobalClickTracking();
    
    // Track when component mounts
    trackEvent({
      event: 'app_initialized',
    });
  }, []);

  // Track page/route changes
  useEffect(() => {
    if (previousPathnameRef.current && previousPathnameRef.current !== pathname) {
      trackPageChange(pathname, previousPathnameRef.current);
    }
    previousPathnameRef.current = pathname;
  }, [pathname]);

  return null; // Invisible component
}
