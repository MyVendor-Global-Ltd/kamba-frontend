import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const available = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
