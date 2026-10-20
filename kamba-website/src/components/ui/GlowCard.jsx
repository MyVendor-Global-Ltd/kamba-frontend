import { animated, useSpring } from '@react-spring/web';

export function GlowCard({ children, className = '', as = 'article', ...props }) {
  const [style, api] = useSpring(() => ({ y: 0, scale: 1, config: { tension: 180, friction: 20 } }));
  const Component = animated[as] ?? animated.article;
  const pressIn = () => api.start({ y: -4, scale: 1.015 });
  const pressOut = () => api.start({ y: 0, scale: 1 });
  return (
    <Component
      className={`glow-card${className ? ` ${className}` : ''}`}
      style={style}
      onPointerEnter={pressIn}
      onPointerLeave={pressOut}
      onFocus={pressIn}
      onBlur={pressOut}
      {...props}
    >
      {children}
    </Component>
  );
}
