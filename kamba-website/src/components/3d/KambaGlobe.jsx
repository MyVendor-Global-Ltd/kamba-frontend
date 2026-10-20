import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const origin = { lat: 5.5, lon: 5.5 };
const cityCoordinates = [
  { name: 'Umuahia', lat: 5.532, lon: 7.486 },
  { name: 'Aba', lat: 5.116, lon: 7.367 },
  { name: 'Lagos', lat: 6.524, lon: 3.379 },
  { name: 'Port Harcourt', lat: 4.815, lon: 7.05 },
];

function projectOnGlobe({ lat, lon }) {
  const x = (lon - origin.lon) * 0.14;
  const y = (lat - origin.lat) * 0.14;
  const z = Math.sqrt(Math.max(0.1, 1 - x * x - y * y));
  return [x, y, z * 1.015];
}

const cities = cityCoordinates.map((city) => ({ ...city, position: projectOnGlobe(city) }));

function Arc({ from, to }) {
  const start = new THREE.Vector3(...from).normalize().multiplyScalar(1.04);
  const end = new THREE.Vector3(...to).normalize().multiplyScalar(1.04);
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.34);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return <Line points={curve.getPoints(40)} color="#2db845" transparent opacity={0.55} lineWidth={1.2} />;
}

function CityPin({ city }) {
  const pinRef = useRef(null);
  useFrame(({ clock }) => {
    if (pinRef.current) pinRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.4 + city.name.length) * 0.18);
  });
  return (
    <group position={city.position}>
      <mesh ref={pinRef}>
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshBasicMaterial color="#2db845" />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#2db845" transparent opacity={0.13} />
      </mesh>
      <Html distanceFactor={6} position={[0.06, 0.04, 0]} center transform={false}>
        <span className="globe-pin-label">{city.name}</span>
      </Html>
    </group>
  );
}

function Globe() {
  const group = useRef(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.16) * 0.09 - 0.78;
  });
  return (
    <group ref={group} rotation={[0, -0.78, -0.04]}>
      <Sphere args={[1, 48, 48]}>
        <meshBasicMaterial color="#2db845" wireframe transparent opacity={0.1} />
      </Sphere>
      {cities.map((city) => <CityPin key={city.name} city={city} />)}
      <Arc from={cities[0].position} to={cities[2].position} />
      <Arc from={cities[0].position} to={cities[3].position} />
      <Arc from={cities[1].position} to={cities[2].position} />
    </group>
  );
}

export default function KambaGlobe() {
  return (
    <Canvas
      className="globe-r3f-canvas"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 4.3], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      frameloop="always"
    >
      <Globe />
    </Canvas>
  );
}
