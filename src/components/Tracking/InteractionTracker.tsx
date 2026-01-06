// components/Tracking/InteractionTracker.tsx
'use client';

import { useTracking } from '@/hooks/useTracking';
import React from 'react';

interface InteractionTrackerProps {
  eventName: string;
  context?: Record<string, any>;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  [key: string]: any;
}

/**
 * Wrapper component to track element interactions
 * Usage: <InteractionTracker eventName="item_clicked" context={{itemId: '123'}}>
 *          <button>Click me</button>
 *        </InteractionTracker>
 */
export function InteractionTracker({
  eventName,
  context,
  children,
  as: Component = 'div',
  ...props
}: InteractionTrackerProps) {
  const { track } = useTracking();

  const handleClick = (e: React.MouseEvent) => {
    track(eventName, context);
    props.onClick?.(e);
  };

  return (
    <Component {...props} onClick={handleClick}>
      {children}
    </Component>
  );
}
