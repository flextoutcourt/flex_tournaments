// hooks/useMouseHalo.ts
import { useRef, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMouseHalo = (color: string = 'rgba(99, 102, 241, 0.3)') => {
  const elementRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element.parentElement) return;

      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement.getBoundingClientRect();

      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Update the halo position
      const halo = element.querySelector('.halo-effect') as HTMLElement;
      if (halo) {
        halo.style.background = `radial-gradient(circle 300px at ${mousePos.current.x}px ${mousePos.current.y}px, ${color}, transparent 80%)`;
      }
    };

    const handleMouseEnter = () => {
      const halo = element.querySelector('.halo-effect') as HTMLElement;
      if (halo) {
        halo.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      const halo = element.querySelector('.halo-effect') as HTMLElement;
      if (halo) {
        halo.style.opacity = '0';
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color]);

  return elementRef;
};
