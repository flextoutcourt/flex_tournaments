/**
 * useMouseHalo Hook - Creates interactive mouse halo effect
 * Delegates to mouseUtils for pure logic, manages lifecycle
 */

import { useRef, useEffect, useMemo } from 'react';
import { createMouseHaloHandler } from '@/lib/utils/mouseUtils';

export const useMouseHalo = (color: string = 'rgba(99, 102, 241, 0.3)') => {
  const elementRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<ReturnType<typeof createMouseHaloHandler>>(null);
  
  // Memoize color to prevent unnecessary re-creates
  const memoizedColor = useMemo(() => color, [color]);

  useEffect(() => {
    const handler = createMouseHaloHandler(elementRef.current, memoizedColor);
    handlerRef.current = handler;

    if (handler) {
      handler.attach();
    }

    return () => {
      if (handler) {
        handler.detach();
      }
    };
  }, [memoizedColor]);

  return elementRef;
};
