'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { GlobalTracker } from './Tracking/GlobalTracker';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <GlobalTracker />
      {children}
    </SessionProvider>
  );
}
