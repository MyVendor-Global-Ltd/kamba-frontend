uniform float uTime;
uniform vec2 uPointer;
uniform float uRadius;
uniform float uScroll;
uniform float uPointSize;
varying float vGlow;

void main() {
  vec3 displaced = position;
  vec2 delta = displaced.xy - uPointer;
  float distanceToPointer = length(delta);
  float influence = 1.0 - smoothstep(0.0, uRadius, distanceToPointer);
  vec2 safeDirection = normalize(delta + vec2(0.0001));
  displaced.xy += safeDirection * influence * 0.34;
  displaced.y *= 1.0 - clamp(uScroll, 0.0, 1.0) * 0.22;
  displaced.z += sin(position.x * 0.9 + uTime * 0.22) * cos(position.y * 0.72 + uTime * 0.19) * 0.025;
  vGlow = influence;
  vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uPointSize * (1.0 + influence * 1.6);
}
