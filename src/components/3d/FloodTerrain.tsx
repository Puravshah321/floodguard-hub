import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface FloodTerrainProps {
  waterLevel?: number; // 0-100
  riskZones?: Array<{
    position: [number, number];
    radius: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  }>;
}

// Generate terrain mesh
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 64, 64);
    const positions = geo.attributes.position;
    
    // Create hills and valleys
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Generate terrain height using multiple noise layers
      const height = 
        Math.sin(x * 0.3) * Math.cos(y * 0.3) * 1.5 +
        Math.sin(x * 0.7 + 1) * Math.cos(y * 0.5) * 0.5 +
        Math.sin(x * 1.5) * Math.sin(y * 1.5) * 0.2;
      
      positions.setZ(i, height);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#4ade80"
        roughness={0.8}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

// Animated water layer
function WaterLayer({ level = 50 }: { level: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = (level / 100) * 2 - 0.5; // Map 0-100 to -0.5 to 1.5
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth water level transition
      meshRef.current.position.y += (targetHeight - meshRef.current.position.y) * 0.02;
      
      // Animate water surface
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 0.5 + state.clock.elapsedTime) * 0.1 +
                     Math.sin(y * 0.3 + state.clock.elapsedTime * 0.7) * 0.05;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial
        color="#0ea5e9"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  );
}

// Risk zone markers
function RiskZone({ 
  position, 
  radius, 
  riskLevel 
}: { 
  position: [number, number]; 
  radius: number; 
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colors = {
    low: '#22c55e',
    moderate: '#eab308',
    high: '#f97316',
    severe: '#ef4444',
  };
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group position={[position[0], 2, position[1]]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, 0.1, 32]} />
        <meshStandardMaterial
          color={colors[riskLevel]}
          transparent
          opacity={0.5}
          emissive={colors[riskLevel]}
          emissiveIntensity={0.3}
        />
      </mesh>
      <Html center distanceFactor={10}>
        <div className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded text-xs font-medium border border-border whitespace-nowrap">
          {riskLevel.toUpperCase()} RISK
        </div>
      </Html>
    </group>
  );
}

// Buildings affected by flood
function Buildings() {
  const buildings = useMemo(() => [
    { position: [-5, 0, -3] as [number, number, number], height: 2, width: 1 },
    { position: [-3, 0, -5] as [number, number, number], height: 3, width: 1.2 },
    { position: [4, 0, -2] as [number, number, number], height: 1.5, width: 0.8 },
    { position: [6, 0, 3] as [number, number, number], height: 2.5, width: 1 },
    { position: [-2, 0, 4] as [number, number, number], height: 1.8, width: 0.9 },
    { position: [2, 0, 5] as [number, number, number], height: 2.2, width: 1.1 },
  ], []);

  return (
    <>
      {buildings.map((building, i) => (
        <mesh
          key={i}
          position={[building.position[0], building.height / 2, building.position[2]]}
          castShadow
        >
          <boxGeometry args={[building.width, building.height, building.width]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
      ))}
    </>
  );
}

// Main terrain component
export default function FloodTerrain({ waterLevel = 30, riskZones = [] }: FloodTerrainProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading 3D terrain...</div>
      </div>
    );
  }

  const defaultRiskZones = riskZones.length > 0 ? riskZones : [
    { position: [-4, -4] as [number, number], radius: 2, riskLevel: 'high' as const },
    { position: [5, 2] as [number, number], radius: 1.5, riskLevel: 'moderate' as const },
    { position: [0, -6] as [number, number], radius: 2.5, riskLevel: 'severe' as const },
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['hsl(220, 30%, 8%)']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#38bdf8" />
        
        {/* Scene elements */}
        <Terrain />
        <WaterLayer level={waterLevel} />
        <Buildings />
        
        {/* Risk zones */}
        {defaultRiskZones.map((zone, i) => (
          <RiskZone key={i} {...zone} />
        ))}
        
        {/* Water level indicator */}
        <Html position={[-9, 3, 0]} center>
          <div className="px-3 py-2 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg">
            <p className="text-xs text-muted-foreground">Water Level</p>
            <p className="text-lg font-bold text-neer-sky">{waterLevel}%</p>
          </div>
        </Html>
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
