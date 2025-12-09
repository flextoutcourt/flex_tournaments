import { useRef, useCallback, useState } from 'react';

export interface VoteToken {
  id: string;
  itemId: 'item1' | 'item2';
  startTime: number;
}

interface BarRefs {
  item1: React.RefObject<HTMLDivElement> | null;
  item2: React.RefObject<HTMLDivElement> | null;
}

interface AnimationConfig {
  duration: number; // Total animation duration in ms
  originX: number;  // Starting X position (pixel)
  originY: number;  // Starting Y position (pixel)
}

export function useVoteAnimation(config: Partial<AnimationConfig> = {}) {
  const {
    duration = 800,
    originX = 20,
    originY = 20,
  } = config;

  // Track active animation tokens
  const [activeTokens, setActiveTokens] = useState<VoteToken[]>([]);
  
  // Store refs to the vote bars
  const barRefs = useRef<BarRefs>({
    item1: null,
    item2: null,
  });

  // Unique ID counter for animation tokens
  const tokenIdRef = useRef(0);

  /**
   * Register a vote bar ref by item ID
   * Call this from your vote bar components
   */
  const registerBarRef = useCallback((itemId: 'item1' | 'item2', ref: React.RefObject<HTMLDivElement>) => {
    barRefs.current[itemId] = ref;
  }, []);

  /**
   * Get the bounding box of a target vote bar
   * Returns null if ref is not registered or element not in DOM
   */
  const getTargetPosition = useCallback((itemId: 'item1' | 'item2') => {
    const ref = barRefs.current[itemId];
    if (!ref?.current) {
      console.log(`[ANIMATION] Vote bar ref not found for ${itemId}`);
      return null;
    }
    
    const rect = ref.current.getBoundingClientRect();
    const targetPos = {
      x: rect.left + rect.width / 2,  // Center of the bar
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
    
    console.log(`[ANIMATION] Target for ${itemId}:`, targetPos);
    return targetPos;
  }, []);

  /**
   * Spawn an animated vote token
   * Called whenever a vote is received
   */
  const animateVoteToTarget = useCallback((itemId: 'item1' | 'item2') => {
    const tokenId = `token-${tokenIdRef.current++}`;
    const now = Date.now();
    const targetPos = getTargetPosition(itemId);
    
    console.log(`[ANIMATION] Spawning token for ${itemId}:`, tokenId, 'Target:', targetPos);
    
    const newToken: VoteToken = {
      id: tokenId,
      itemId,
      startTime: now,
    };

    // Add token to active list
    setActiveTokens((prev) => [...prev, newToken]);

    // Remove token after animation completes PLUS enough time for particles to finish (0.6s particles + 0.2s delay)
    const timeoutId = setTimeout(() => {
      setActiveTokens((prev) => prev.filter((token) => token.id !== tokenId));
    }, duration + 800); // Wait for particles to complete

    return {
      tokenId,
      targetPosition: targetPos,
      duration,
      cleanup: () => clearTimeout(timeoutId),
    };
  }, [duration, getTargetPosition]);

  /**
   * Clear all active animations
   */
  const clearAnimations = useCallback(() => {
    setActiveTokens([]);
  }, []);

  return {
    activeTokens,
    registerBarRef,
    getTargetPosition,
    animateVoteToTarget,
    clearAnimations,
    animationConfig: { duration, originX, originY },
  };
}
