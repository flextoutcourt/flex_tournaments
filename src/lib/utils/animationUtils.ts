/**
 * Animation Utilities - Reusable animation helpers
 */

export interface VoteToken {
  id: string;
  itemId: 'item1' | 'item2';
  startTime: number;
}

export interface TargetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationConfig {
  duration: number;
  originX: number;
  originY: number;
}

/**
 * Get target element position for animation
 */
export function getTargetPosition(
  ref: React.RefObject<HTMLDivElement>
): TargetPosition | null {
  if (!ref?.current) return null;

  const rect = ref.current.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Generate unique token ID
 */
export function generateTokenId(prefix: string = 'token'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Interpolate between two values
 */
export function interpolate(
  from: number,
  to: number,
  progress: number
): number {
  return from + (to - from) * progress;
}

/**
 * Easing functions
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
};

/**
 * Request animation frame wrapper
 */
export function requestAnimationLoop(
  callback: (elapsed: number) => boolean,
  duration: number
): () => void {
  const startTime = Date.now();
  let animationId: number;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const shouldContinue = callback(elapsed);

    if (progress < 1 && shouldContinue) {
      animationId = requestAnimationFrame(animate);
    }
  };

  animationId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationId);
}
