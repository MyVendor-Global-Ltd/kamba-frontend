export function AnimatedText({ children, className = '', delay = 0, as: Element = 'span' }) {
  const words = String(children).split(/\s+/).filter(Boolean);
  return (
    <Element className={`animated-text${className ? ` ${className}` : ''}`}>
      <span className="visually-hidden">{String(children)}</span>
      <span aria-hidden="true" className="animated-text-visual">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="animated-word" style={{ '--word-delay': `${delay + index * 0.12}s` }}>
            {word}{index < words.length - 1 ? '\u00a0' : ''}
          </span>
        ))}
      </span>
    </Element>
  );
}
