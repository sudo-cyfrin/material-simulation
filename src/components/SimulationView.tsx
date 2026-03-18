import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MaterialProperties } from '../types';

interface SimulationViewProps {
  material: MaterialProperties;
  strain: number;
  isBroken: boolean;
}

const BrokenPart = ({ position, rotation, color, materialId }: { position: [number, number, number], rotation: [number, number, number], color: string, materialId: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  return (
    <mesh position={position} rotation={rotation} ref={ref}>
      {materialId === 'stone' ? <boxGeometry args={[1, 1, 1]} /> : <cylinderGeometry args={[0.2, 0.2, 1, 32]} />}
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const MaterialObject = ({ material, strain, isBroken }: SimulationViewProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate scale based on strain
  const scaleY = 1 + (strain / 100);
  const scaleXZ = isBroken ? 1 : 1 / Math.sqrt(scaleY); 

  const geometry = useMemo(() => {
    if (material.id === 'stone') {
      return new THREE.BoxGeometry(1, 2, 1);
    }
    return new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  }, [material.id]);

  return (
    <group ref={groupRef}>
      {isBroken ? (
        // Broken state: show two halves with a gap
        <group>
          <group position={[0, 0.6, 0]} rotation={[0.2, 0, 0.1]}>
            <mesh>
              {material.id === 'stone' ? <boxGeometry args={[1, 1, 1]} /> : <cylinderGeometry args={[0.2, 0.2, 1, 32]} />}
              <meshStandardMaterial color={material.color} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
          <group position={[0, -0.6, 0]} rotation={[-0.2, 0, -0.1]}>
            <mesh>
              {material.id === 'stone' ? <boxGeometry args={[1, 1, 1]} /> : <cylinderGeometry args={[0.2, 0.2, 1, 32]} />}
              <meshStandardMaterial color={material.color} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
          
          {/* Fracture particles for stone */}
          {material.id === 'stone' && (
            <group>
              {[...Array(10)].map((_, i) => (
                <mesh key={i} position={[Math.random() - 0.5, 0, Math.random() - 0.5]} rotation={[Math.random(), Math.random(), Math.random()]}>
                  <boxGeometry args={[0.1, 0.1, 0.1]} />
                  <meshStandardMaterial color={material.color} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ) : (
        <mesh 
          scale={[scaleXZ, scaleY, scaleXZ]}
          position={[0, 0, 0]}
        >
          <primitive object={geometry} />
          <meshStandardMaterial 
            color={material.color} 
            metalness={material.id === 'iron' ? 0.9 : 0.3} 
            roughness={material.id === 'iron' ? 0.1 : 0.7}
            emissive={material.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
      
      {/* Base and Top plates - subtle indicators */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 1.15 * (isBroken ? 1 : scaleY), 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export const SimulationView = ({ material, strain, isBroken }: SimulationViewProps) => {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden glass">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
        <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <MaterialObject material={material} strain={strain} isBroken={isBroken} />
        </Float>

        <gridHelper args={[20, 20, 0x334155, 0x1e293b]} position={[0, -1.2, 0]} />
      </Canvas>
      
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Live Simulation</span>
        <h3 className="text-xl font-bold text-white">{material.name}</h3>
      </div>
    </div>
  );
};
