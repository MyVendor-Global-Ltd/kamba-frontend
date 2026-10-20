import { useId } from 'react';

export function ConnectionNodes() {
  const gradientId = useId().replaceAll(':', '');
  const strokeId = `connection-stroke-${gradientId}`;
  const glowId = `connection-glow-${gradientId}`;
  const nodes = [
    { x: 90, y: 224, label: 'UMUAHIA' },
    { x: 238, y: 124, label: 'LAGOS' },
    { x: 350, y: 252, label: 'ABA' },
    { x: 390, y: 72, label: 'PORT HARCOURT' },
  ];

  return (
    <svg className="connection-nodes" viewBox="0 0 480 360" role="img" aria-label="Four local communities connected by a soft emerald network">
      <defs>
        <linearGradient id={strokeId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#2db845" stopOpacity=".16" />
          <stop offset=".55" stopColor="#55ef78" stopOpacity=".8" />
          <stop offset="1" stopColor="#f5a623" stopOpacity=".2" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#2db845" stopOpacity=".8" />
          <stop offset="1" stopColor="#2db845" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" stroke={`url(#${strokeId})`} strokeWidth="1.2">
        <path d="M90 224C137 154 178 106 238 124S346 164 390 72" />
        <path d="M90 224C176 240 262 300 350 252S368 164 390 72" />
        <path d="M238 124C211 190 262 300 350 252" />
        <path d="M90 224C180 92 324 56 390 72" strokeDasharray="3 10" />
      </g>
      {nodes.map((node) => (
        <g key={node.label}>
          <circle cx={node.x} cy={node.y} r="22" fill={`url(#${glowId})`} opacity=".2" />
          <circle cx={node.x} cy={node.y} r="5" fill="#59ed79" />
          <circle cx={node.x} cy={node.y} r="9" fill="none" stroke="#59ed79" strokeOpacity=".55" />
          <text x={node.x + 14} y={node.y - 12} fill="#d5f7dc" fontSize="9" fontFamily="monospace" letterSpacing="1.2">{node.label}</text>
        </g>
      ))}
    </svg>
  );
}
