import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Three.js — the industry-standard WebGL engine (via React Three Fiber).
// A slow neural "∞ orbit": wireframe core + orbiting particles.
// Kept dependency-light (fiber + three only) so the bundle stays lean.

function Core() {
  const mesh = useRef();
  const knot = useRef();
  const group = useRef();
  useFrame((state, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * 0.25;
    if (knot.current) {
      knot.current.rotation.x += dt * 0.18;
      knot.current.rotation.y -= dt * 0.12;
    }
    // gentle float
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    }
  });
  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0e7490" emissiveIntensity={0.6} wireframe roughness={0.3} />
      </mesh>
      <mesh ref={knot} scale={0.5}>
        <torusKnotGeometry args={[1, 0.28, 120, 16]} />
        <meshStandardMaterial color="#7c3aed" emissive="#5b21b6" emissiveIntensity={0.5} metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Orbiters({ count = 240 }) {
  const points = useRef();
  const positions = useRef((() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 1.8;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.cos(p);
      arr[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
    }
    return arr;
  })());
  useFrame((_, dt) => { if (points.current) points.current.rotation.y += dt * 0.08; });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#22d3ee" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function ThreeScene({ height = 360, label = 'Three.js • WebGL scene' }) {
  return (
    <div className="fx-stage" style={{ height }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#070a14']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={40} color="#06b6d4" />
        <pointLight position={[-6, -4, -6]} intensity={30} color="#7c3aed" />
        <Suspense fallback={null}>
          <Core />
          <Orbiters />
        </Suspense>
      </Canvas>
      <span className="fx-stage__label">{label}</span>
      <span className="fx-stage__hint">React Three Fiber</span>
    </div>
  );
}
