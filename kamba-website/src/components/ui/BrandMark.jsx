export function BrandMark({ size = 'normal', showWord = false, className = '' }) {
  return (
    <span className={`brand-lockup brand-lockup--${size} ${className}`.trim()}>
      <svg className="brand-mark" viewBox="0 0 44 44" role="img" aria-label={showWord ? undefined : 'Kamba mark'}>
        <path d="M7 4.5h30A2.5 2.5 0 0 1 39.5 7v30a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 37V7A2.5 2.5 0 0 1 7 4.5Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".38" />
        <path d="M14 12v20m15-20L15 21l15 11" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28.5 9.5c4.4 0 7.8 3.2 7.8 7.2 0 5.8-7.8 12.8-7.8 12.8s-7.8-7-7.8-12.8c0-4 3.4-7.2 7.8-7.2Z" fill="#2db845" fillOpacity=".9" stroke="#b9ffc2" strokeWidth="1.1" />
        <circle cx="28.5" cy="16.5" r="2.1" fill="#06120a" />
      </svg>
      {showWord && <span className="brand-word">Kamba</span>}
    </span>
  );
}
