/**
 * Mouse Interaction Utilities - Reusable mouse effect helpers
 */

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Create a mouse halo effect handler
 * Optimized with: dead zone detection, element caching, and conditional updates
 */
export function createMouseHaloHandler(
  element: HTMLElement | null,
  color: string = 'rgba(99, 102, 241, 0.3)'
) {
  if (!element) return null;

  const mousePos: MousePosition = { x: 0, y: 0 };
  let haloElement: HTMLElement | null = null;
  let rect: DOMRect | null = null;
  let rectUpdateTime = 0;
  let lastX = -1;
  let lastY = -1;

  // Cache halo element on first access
  const getHaloElement = () => {
    if (!haloElement) {
      haloElement = element!.querySelector('.halo-effect') as HTMLElement;
      // Enable GPU acceleration
      if (haloElement) {
        haloElement.style.willChange = 'background-image, background-position';
        haloElement.style.backfaceVisibility = 'hidden';
      }
    }
    return haloElement;
  };

  // Update rect every 300ms (less frequent to reduce overhead)
  const updateRect = () => {
    const now = Date.now();
    if (now - rectUpdateTime > 300) {
      rect = element!.getBoundingClientRect();
      rectUpdateTime = now;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!element!.parentElement || !rect) {
      updateRect();
      return;
    }

    const newX = e.clientX - rect!.left;
    const newY = e.clientY - rect!.top;

    // Skip update if position hasn't changed significantly (dead zone of 8px)
    if (Math.abs(newX - lastX) < 8 && Math.abs(newY - lastY) < 8) {
      return;
    }

    mousePos.x = newX;
    mousePos.y = newY;
    lastX = newX;
    lastY = newY;

    const halo = getHaloElement();
    if (halo) {
      // Use a slightly larger and softer gradient to reduce recalculation cost
      halo.style.backgroundImage = `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, ${color}, rgba(99, 102, 241, 0.05) 70%, transparent 100%)`;
    }
  };

  const handleMouseEnter = () => {
    // Initial rect calculation
    updateRect();
    const halo = getHaloElement();
    if (halo) {
      halo.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    const halo = getHaloElement();
    if (halo) {
      halo.style.opacity = '0';
      halo.style.backgroundImage = 'none';
    }
  };

  return {
    getPosition: () => ({ ...mousePos }),
    attach: () => {
      element!.addEventListener('mousemove', handleMouseMove, { passive: true });
      element!.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      element!.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    },
    detach: () => {
      element!.removeEventListener('mousemove', handleMouseMove);
      element!.removeEventListener('mouseenter', handleMouseEnter);
      element!.removeEventListener('mouseleave', handleMouseLeave);
      const halo = getHaloElement();
      if (halo) {
        halo.style.willChange = 'auto';
        halo.style.backgroundImage = 'none';
      }
      haloElement = null;
      rect = null;
    },
  };
}
