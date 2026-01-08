/**
 * useVoteAnimation Hook - Manages vote token animations
 * Delegates to animationUtils for calculation logic
 */

import { useRef, useCallback, useState } from 'react';
import {
  VoteToken,
  TargetPosition,
  AnimationConfig,
  getTargetPosition,
  generateTokenId,
} from '@/lib/utils/animationUtils';

export type { VoteToken };

interface BarRefs {
  item1: React.RefObject<HTMLDivElement> | null;
  item2: React.RefObject<HTMLDivElement> | null;
}

export function useVoteAnimation(config: Partial<AnimationConfig> = {}) {
  const {
    duration = 800,
    originX = 20,
    originY = 20,
  } = config;

  const [activeTokens, setActiveTokens] = useState<VoteToken[]>([]);

  const barRefs = useRef<BarRefs>({
    item1: null,
    item2: null,
  });

  /**
   * Register a vote bar ref by item ID
   */
  const registerBarRef = useCallback(
    (itemId: 'item1' | 'item2', ref: React.RefObject<HTMLDivElement>) => {
      barRefs.current[itemId] = ref;
    },
    []
  );

  /**
   * Get the bounding box of a target vote bar
   */
  const getBarPosition = useCallback(
    (itemId: 'item1' | 'item2'): TargetPosition | null => {
      return getTargetPosition(barRefs.current[itemId]);
    },
    []
  );

  /**
   * Spawn an animated vote token
   */
  const animateVoteToTarget = useCallback(
    (itemId: 'item1' | 'item2') => {
      const tokenId = generateTokenId('vote');
      const now = Date.now();
      const targetPos = getTargetPosition(barRefs.current[itemId]);

      const newToken: VoteToken = {
        id: tokenId,
        itemId,
        startTime: now,
      };

      setActiveTokens((prev) => [...prev, newToken]);

      const timeoutId = setTimeout(() => {
        setActiveTokens((prev) =>
          prev.filter((token) => token.id !== tokenId)
        );
      }, duration + 800);

      return {
        tokenId,
        targetPosition: targetPos,
        duration,
        cleanup: () => clearTimeout(timeoutId),
      };
    },
    [duration]
  );

  /**
   * Get animation token data
   */
  const getTokenAnimation = useCallback(
    (tokenId: string) => {
      const token = activeTokens.find((t) => t.id === tokenId);
      if (!token) return null;

      const elapsed = Date.now() - token.startTime;
      const progress = Math.min(elapsed / duration, 1);

      return {
        token,
        elapsed,
        progress,
        isComplete: progress >= 1,
      };
    },
    [activeTokens, duration]
  );

  /**
   * Clear all active animations
   */
  const clearAnimations = useCallback(() => {
    setActiveTokens([]);
  }, []);

  return {
    activeTokens,
    registerBarRef,
    getBarPosition,
    animateVoteToTarget,
    getTokenAnimation,
    clearAnimations,
    animationConfig: { duration, originX, originY },
  };
}
