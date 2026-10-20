import { useState } from 'react';

export function BlurImage({ src, alt, className = '', loading = 'lazy', ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`blur-image${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}>
      <span className="blur-image-placeholder" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        {...props}
      />
    </span>
  );
}
