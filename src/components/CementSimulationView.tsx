import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CementProperties, cn } from '../types';

interface CementSimulationViewProps {
  material: CementProperties;
  crackLevel: number; // 0 to 1
  healingProgress: number; // 0 to 1
}

const CementBlock = ({ material, crackLevel, healingProgress }: CementSimulationViewProps) => {
  // Generate crack particles
  const cracks = useMemo(() => {
    const count = 100; // Increased count
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        position: [
          (Math.random() - 0.5) * 1.4,
          (Math.random() - 0.5) * 2.4,
          0.505
        ] as [number, number, number],
        size: Math.random() * 0.2 + 0.1, // Larger size
        rotation: Math.random() * Math.PI,
        thickness: Math.random() * 0.04 + 0.02 // Thicker cracks
      });
    }
    return points;
  }, []);

  // Bacterial spores for bio-cement
  const spores = useMemo(() => {
    if (material.id !== 'bio') return [];
    const count = 120;
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        position: [
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 1.1
        ] as [number, number, number],
        size: Math.random() * 0.04 + 0.01
      });
    }
    return points;
  }, [material.id]);

  return (
    <group>
      {/* Main Block */}
      <mesh>
        <boxGeometry args={[1.5, 2.5, 1]} />
        <meshStandardMaterial 
          color={material.color} 
          roughness={0.9} 
          metalness={0.05} 
        />
      </mesh>

      {/* Cracks and Healing */}
      <group>
        {cracks.map((p, i) => {
          const isCracked = crackLevel > (i / cracks.length);
          const isHealed = material.id === 'bio' && healingProgress > (i / cracks.length);
          
          return (
            <group key={i}>
              {/* The Crack itself (Black) */}
              <mesh 
                position={p.position} 
                rotation={[0, 0, p.rotation]}
                visible={isCracked && !isHealed}
              >
                <planeGeometry args={[p.size, p.thickness]} />
                <meshBasicMaterial 
                  color="#000000" 
                  transparent
                  opacity={0.8}
                />
              </mesh>

              {/* The Healing Fill (White/Calcite) */}
              <mesh 
                position={[p.position[0], p.position[1], p.position[2] + 0.001]} 
                rotation={[0, 0, p.rotation]}
                visible={isCracked && isHealed}
              >
                <planeGeometry args={[p.size, p.thickness]} />
                <meshBasicMaterial 
                  color="#F8FAFC" // Bright white for calcite
                  transparent
                  opacity={1}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Bacterial Spores (Bio-Cement only) */}
      {material.id === 'bio' && (
        <group>
          {spores.map((s, i) => (
            <mesh key={i} position={s.position}>
              <sphereGeometry args={[s.size, 8, 8]} />
              <meshBasicMaterial color="#4ade80" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export const CementSimulationView = ({ material, crackLevel, healingProgress }: CementSimulationViewProps) => {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden glass bg-[#1a1a2e] flex flex-col">
      <div className="flex-1 relative">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
          <OrbitControls enableZoom={false} />
          
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-5, 5, 5]} intensity={1} />

          <CementBlock material={material} crackLevel={crackLevel} healingProgress={healingProgress} />

          <gridHelper args={[20, 20, 0x334155, 0x1e293b]} position={[0, -1.5, 0]} />
        </Canvas>
        
        <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none z-10">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Structural Analysis</span>
          <h3 className="text-xl font-bold text-white/90">{material.name}</h3>
        </div>
      </div>
      
      {/* Debug footer to ensure component is alive */}
      <div className="px-6 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] font-mono text-slate-500 uppercase">Engine: Three.js / Fiber</span>
        <div className="flex gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", crackLevel > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
          <span className="text-[8px] font-mono text-slate-500 uppercase">{crackLevel > 0 ? "Stress Detected" : "Stable"}</span>
        </div>
      </div>
    </div>
  );
};
