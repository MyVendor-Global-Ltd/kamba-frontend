import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const supported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supported || reduced) return undefined;
    document.body.classList.add('cursor-active');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;
    let clickTimer;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const tick = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1
        ? window.requestAnimationFrame(tick)
        : 0;
    };
    const hover = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-cursor]') : null;
      const mode = target?.getAttribute('data-cursor') ?? '';
      if (ringRef.current) ringRef.current.dataset.mode = mode;
    };
    const click = () => {
      if (!ringRef.current) return;
      ringRef.current.classList.remove('cursor-click');
      void ringRef.current.offsetWidth;
      ringRef.current.classList.add('cursor-click');
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => ringRef.current?.classList.remove('cursor-click'), 320);
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', hover, { passive: true });
    document.addEventListener('click', click, { passive: true });
    return () => {
      document.body.classList.remove('cursor-active');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', hover);
      document.removeEventListener('click', click);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(clickTimer);
    };
  }, [reduced]);

  return (
    <>
      <span ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <span ref={ringRef} className="cursor-ring" aria-hidden="true"><span>READ</span></span>
    </>
  );
}
