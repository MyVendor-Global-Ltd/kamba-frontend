uniform float uTime;
varying float vGlow;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float circle = 1.0 - smoothstep(0.34, 0.5, length(centered));
  float pulse = 0.78 + 0.22 * sin(uTime * 0.65 + gl_FragCoord.x * 0.005);
  vec3 color = mix(vec3(1.0), vec3(0.176, 0.722, 0.271), clamp(vGlow, 0.0, 1.0));
  float alpha = mix(0.12, 0.6, clamp(vGlow, 0.0, 1.0)) * pulse * circle;
  gl_FragColor = vec4(color, alpha);
}
