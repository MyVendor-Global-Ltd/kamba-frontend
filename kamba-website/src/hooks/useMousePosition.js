import { useEffect, useState } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame = 0;
    let latest = { x: 0, y: 0 };
    const onMove = (event) => {
      latest = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setPosition(latest);
        frame = 0;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return position;
}
