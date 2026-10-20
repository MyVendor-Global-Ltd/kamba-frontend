import { animated } from '@react-spring/web';
import { useMagnet } from '../../hooks/useMagnet.js';

export function MagneticButton({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  const { elementRef, spring, onPointerMove, onPointerLeave } = useMagnet();
  const Element = href ? animated.a : animated.button;
  return (
    <Element
      ref={elementRef}
      href={href}
      type={href ? undefined : type}
      disabled={disabled}
      className={`magnetic-button magnetic-button--${variant} magnetic${className ? ` ${className}` : ''}`}
      data-cursor="button"
      style={{ x: spring.x, y: spring.y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      {...props}
    >
      <span className="magnetic-button-inner">{children}</span>
      <span className="button-ripple" aria-hidden="true" />
    </Element>
  );
}
