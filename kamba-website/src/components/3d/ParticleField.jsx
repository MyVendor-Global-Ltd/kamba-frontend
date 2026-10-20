import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import * as THREE from 'three';
import vertexShader from '../../shaders/particle.vert?raw';
import fragmentShader from '../../shaders/particle.frag?raw';
import gridFragmentShader from '../../shaders/grid.frag?raw';

const gridVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function BackgroundGrid() {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  }), []);
  const { size } = useThree();

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh position={[0, 0, -0.4]} renderOrder={-1}>
      <planeGeometry args={[18, 14]} />
      <shaderMaterial
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Particles() {
  const pointsRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector2(1000, 1000));
  const fpsRef = useRef({ frames: 0, started: 0, lowered: false });
  const { size } = useThree();
  const [grid, setGrid] = useState(80);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(1000, 1000) },
    uRadius: { value: 1.4 },
    uScroll: { value: 0 },
    uPointSize: { value: 1.8 },
  }), []);
  const geometry = useMemo(() => {
    const positions = new Float32Array(grid * grid * 3);
    let cursor = 0;
    for (let row = 0; row < grid; row += 1) {
      for (let col = 0; col < grid; col += 1) {
        positions[cursor++] = (col / (grid - 1) - 0.5) * 12;
        positions[cursor++] = (row / (grid - 1) - 0.5) * 7.2;
        positions[cursor++] = 0;
      }
    }
    const value = new THREE.BufferGeometry();
    value.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return value;
  }, [grid]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => {
    const pointerMove = (event) => {
      const worldX = ((event.clientX / window.innerWidth) - 0.5) * 12;
      const worldY = (0.5 - (event.clientY / window.innerHeight)) * 7.2;
      pointerRef.current.set(worldX, worldY);
    };
    const pointerLeave = () => pointerRef.current.set(1000, 1000);
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('blur', pointerLeave);
    return () => {
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('blur', pointerLeave);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uPointer.value.copy(pointerRef.current);
    uniforms.uRadius.value = 200 / Math.max(110, size.width / 12);
    const range = document.documentElement.scrollHeight - window.innerHeight;
    uniforms.uScroll.value = range > 0 ? Math.min(1, window.scrollY / range) : 0;

    const now = performance.now();
    const sample = fpsRef.current;
    if (!sample.started) sample.started = now;
    sample.frames += 1;
    if (now - sample.started > 1800) {
      const fps = (sample.frames * 1000) / (now - sample.started);
      sample.frames = 0;
      sample.started = now;
      if (fps < 50 && !sample.lowered) {
        sample.lowered = true;
        setGrid(60);
      }
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BloomPass() {
  const { camera, gl, scene, size } = useThree();
  const composer = useMemo(() => {
    const effectComposer = new EffectComposer(gl, { multisampling: 0 });
    effectComposer.addPass(new RenderPass(scene, camera));
    effectComposer.addPass(new EffectPass(camera, new BloomEffect({
      luminanceThreshold: 0.78,
      luminanceSmoothing: 0.25,
      intensity: 0.22,
      mipmapBlur: true,
    })));
    return effectComposer;
  }, [camera, gl, scene]);

  useEffect(() => () => composer.dispose(), [composer]);
  useEffect(() => { composer.setSize(size.width, size.height); }, [composer, size.height, size.width]);
  useFrame((_, delta) => composer.render(delta), 1);
  return null;
}

export default function ParticleField() {
  return (
    <Canvas
      className="particle-canvas"
      dpr={[1, 1.35]}
      orthographic
      camera={{ position: [0, 0, 8], zoom: 70 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      frameloop="always"
    >
      <BackgroundGrid />
      <Particles />
      <BloomPass />
    </Canvas>
  );
}
