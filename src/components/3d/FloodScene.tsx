import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Animated water surface component
function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[15, 15, 64, 64]} />
      <MeshDistortMaterial
        color="#0ea5e9"
        transparent
        opacity={0.7}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

// Floating water droplets
function WaterDroplets() {
  const count = 50;
  
  const droplets = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 5 - 1,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: 0.05 + Math.random() * 0.1,
      speed: 0.5 + Math.random() * 1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {droplets.map((droplet, i) => (
        <Float
          key={i}
          position={droplet.position}
          speed={droplet.speed}
          rotationIntensity={0.5}
          floatIntensity={2}
        >
          <Sphere args={[droplet.scale, 16, 16]}>
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.9}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

// Rising water wave effect
function WaterWaves() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const waveX = Math.sin(x * 2 + state.clock.elapsedTime) * 0.1;
        const waveY = Math.sin(y * 2 + state.clock.elapsedTime * 0.8) * 0.1;
        positions.setZ(i, waveX + waveY);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
      <planeGeometry args={[12, 8, 32, 32]} />
      <meshStandardMaterial
        color="#0284c7"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}

// Main 3D scene component
export default function FloodScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#38bdf8" />
        
        {/* 3D Elements */}
        <WaterSurface />
        <WaterDroplets />
        <WaterWaves />
        
        {/* Environment for reflections */}
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
