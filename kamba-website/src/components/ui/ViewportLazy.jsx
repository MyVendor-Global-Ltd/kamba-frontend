import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const ParticleField = lazy(() => import('../3d/ParticleField.jsx'));
const KambaGlobe = lazy(() => import('../3d/KambaGlobe.jsx'));

export function ViewportLazy({ scene, className = '' }) {
  const hostRef = useRef(null);
  const [isNear, setIsNear] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    setIsAllowed(!mobile && !reduced && Boolean(window.WebGLRenderingContext));
  }, [reduced]);

  useEffect(() => {
    if (!isAllowed || !hostRef.current) return undefined;
    const element = hostRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [isAllowed]);

  const Scene = scene === 'particles' ? ParticleField : KambaGlobe;
  return (
    <div ref={hostRef} className={`viewport-scene viewport-scene--${scene}${className ? ` ${className}` : ''}`} aria-hidden="true">
      {isAllowed && isNear
        ? <Suspense fallback={<div className="scene-fallback" />}><Scene /></Suspense>
        : <div className="scene-fallback" />}
    </div>
  );
}
