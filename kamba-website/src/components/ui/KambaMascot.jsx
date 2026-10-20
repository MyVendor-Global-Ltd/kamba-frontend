import { useEffect, useRef } from 'react';

export function KambaMascot({ mood = 'idle', label = 'Kamba mascot' }) {
  const svgRef = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let frame = 0;
    let current = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    const move = (event) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      target = {
        x: Math.max(-2.4, Math.min(2.4, ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 6)),
        y: Math.max(-1.7, Math.min(1.7, ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 5)),
      };
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      const transform = `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)})`;
      leftPupil.current?.setAttribute('transform', transform);
      rightPupil.current?.setAttribute('transform', transform);
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.02
        ? window.requestAnimationFrame(tick)
        : 0;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={svgRef} className={`kamba-mascot kamba-mascot--${mood}`} viewBox="0 0 230 250" role="img" aria-label={label}>
      <defs>
        <linearGradient id="mascot-bag" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4be267" />
          <stop offset=".48" stopColor="#25a83f" />
          <stop offset="1" stopColor="#126326" />
        </linearGradient>
        <filter id="mascot-shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="11" floodColor="#000" floodOpacity=".38" />
        </filter>
      </defs>
      <ellipse className="mascot-ground-shadow" cx="115" cy="224" rx="64" ry="12" fill="#000" opacity=".42" />
      <g className="mascot-arms" fill="none" stroke="#52e76b" strokeWidth="13" strokeLinecap="round">
        <path className="mascot-arm mascot-arm--left" d="M54 135Q24 145 32 171" />
        <path className="mascot-arm mascot-arm--right" d="M176 135Q207 143 199 168" />
      </g>
      <g className="mascot-body" filter="url(#mascot-shadow)">
        <path d="M69 78Q73 47 115 47q42 0 46 31l11 116q1 13-12 13H69q-13 0-12-13Z" fill="url(#mascot-bag)" stroke="#9bffad" strokeOpacity=".62" strokeWidth="2" />
        <path d="M91 79q0-25 24-25t24 25" fill="none" stroke="#61e97a" strokeWidth="12" strokeLinecap="round" />
        <path d="M76 89q39 9 79 0" fill="none" stroke="#a9ffb4" strokeOpacity=".34" strokeWidth="2" />
        <path d="M69 191q43 13 94 0" fill="none" stroke="#0b4a1b" strokeOpacity=".35" strokeWidth="3" />
        <g className="mascot-face">
          <ellipse cx="98" cy="126" rx="10" ry="13" fill="#f5fff6" />
          <ellipse cx="136" cy="126" rx="10" ry="13" fill="#f5fff6" />
          <circle ref={leftPupil} cx="100" cy="128" r="4.7" fill="#08220d" />
          <circle ref={rightPupil} cx="138" cy="128" r="4.7" fill="#08220d" />
          <path className="mascot-mouth" d="M103 151q12 11 24 0" fill="none" stroke="#073615" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <path d="M80 101q10-6 20-1M136 100q9-5 17 1" fill="none" stroke="#126326" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path className="mascot-wave-hand" d="M195 116q13-26 22-18m-8 25q11-31 20-23m-12 32q12-28 20-19" fill="none" stroke="#f5a623" strokeWidth="7" strokeLinecap="round" />
      <g className="mascot-cover">
        <path d="M82 117q14 5 27-1M123 116q14 5 27-1" fill="none" stroke="#126326" strokeWidth="17" strokeLinecap="round" />
      </g>
    </svg>
  );
}
