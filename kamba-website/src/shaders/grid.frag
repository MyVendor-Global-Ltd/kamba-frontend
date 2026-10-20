varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = vUv * uResolution / 70.0;
  vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
  float line = 1.0 - min(min(grid.x, grid.y), 1.0);
  float vignette = 1.0 - smoothstep(0.14, 1.25, length((vUv - 0.5) * vec2(1.45, 1.0)));
  float pulse = 0.72 + 0.28 * sin(uTime * 0.24 + vUv.x * 2.1);
  vec3 color = mix(vec3(0.03, 0.17, 0.07), vec3(0.18, 0.76, 0.29), line * 0.42);
  gl_FragColor = vec4(color, line * vignette * pulse * 0.16);
}
