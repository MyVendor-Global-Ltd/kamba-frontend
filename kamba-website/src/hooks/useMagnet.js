import { useCallback, useRef } from 'react';
import { useSpring } from '@react-spring/web';

export function useMagnet(maxDisplacement = 30, strength = 0.4) {
  const elementRef = useRef(null);
  const [spring, api] = useSpring(() => ({ x: 0, y: 0, config: { tension: 150, friction: 15 } }));

  const onPointerMove = useCallback((event) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const element = elementRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const x = Math.max(-maxDisplacement, Math.min(maxDisplacement, dx * strength));
    const y = Math.max(-maxDisplacement, Math.min(maxDisplacement, dy * strength));
    api.start({ x, y });
  }, [api, maxDisplacement, strength]);

  const onPointerLeave = useCallback(() => api.start({ x: 0, y: 0 }), [api]);
  return { elementRef, spring, onPointerMove, onPointerLeave };
}
