import React from 'react';
import { motion } from 'motion/react';
import { MaterialProperties, cn } from '../types';

interface VestFrontViewProps {
  material: MaterialProperties;
  strain: number;
  isBroken: boolean;
  compact?: boolean;
}

export const VestFrontView = ({ material, strain, isBroken, compact = false }: VestFrontViewProps) => {
  const impactScale = 1 + (strain / 100) * 0.2;
  const rippleCount = Math.floor(strain / 10);

  return (
    <div className={cn(
      "w-full h-full relative rounded-3xl overflow-hidden bg-[#020617] flex flex-col items-center justify-center transition-all",
      compact ? "p-4 min-h-[300px]" : "p-8 min-h-[500px]"
    )}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className={cn(
        "relative w-full glass rounded-2xl overflow-hidden border-white/5 shadow-2xl flex items-center justify-center transition-all",
        compact ? "aspect-square" : "max-w-2xl aspect-[3/4] p-12"
      )}>
        <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <defs>
            <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4400" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
            </radialGradient>
            
            <pattern id="fiberTexture" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 5 L 10 5 M 5 0 L 5 10" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
            </pattern>

            <filter id="displacementFilter">
              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turb" />
              <feDisplacementMap in2="turb" in="SourceGraphic" scale={strain * 0.5} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Vest Body Shape */}
          <g filter={isBroken ? "url(#displacementFilter)" : "none"}>
            {/* Main Plate Carrier */}
            <path 
              d="M 100 80 L 300 80 L 340 150 L 340 400 Q 340 450 200 450 Q 60 450 60 400 L 60 150 Z" 
              fill={material.color}
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
            
            {/* Texture Overlay */}
            <path 
              d="M 100 80 L 300 80 L 340 150 L 340 400 Q 340 450 200 450 Q 60 450 60 400 L 60 150 Z" 
              fill="url(#fiberTexture)"
            />

            {/* Shoulder Straps */}
            <path d="M 100 80 L 80 20 L 140 20 L 150 80" fill={material.color} strokeOpacity="0.2" stroke="white" />
            <path d="M 300 80 L 320 20 L 260 20 L 250 80" fill={material.color} strokeOpacity="0.2" stroke="white" />

            {/* Neck Scoop */}
            <path d="M 150 80 Q 200 120 250 80" fill="#020617" />

            {/* Detail Lines / Molle */}
            <g opacity="0.2" stroke="white" strokeWidth="1">
              {[180, 220, 260, 300, 340].map(y => (
                <g key={y}>
                  <line x1="80" y1={y} x2="320" y2={y} />
                  {/* Molle vertical stitches */}
                  {[100, 140, 180, 220, 260, 300].map(x => (
                    <line key={x} x1={x} y1={y-5} x2={x} y2={y+5} />
                  ))}
                </g>
              ))}
            </g>

            {/* Side Straps */}
            <path d="M 60 250 L 20 260 L 20 300 L 60 310" fill="black" fillOpacity="0.3" />
            <path d="M 340 250 L 380 260 L 380 300 L 340 310" fill="black" fillOpacity="0.3" />

            {/* Center Plate Outline */}
            <path d="M 120 150 L 280 150 L 300 380 L 100 380 Z" fill="white" fillOpacity="0.03" stroke="white" strokeOpacity="0.1" />
          </g>

          {/* Impact Visualization */}
          {strain > 0 && (
            <g transform="translate(200, 250)">
              {/* Impact Point */}
              <motion.circle
                r={10 + strain * 0.5}
                fill="url(#impactGlow)"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              />

              {/* Shock Ripples */}
              {[...Array(rippleCount)].map((_, i) => (
                <motion.circle
                  key={i}
                  r={20 + i * 30}
                  fill="none"
                  stroke="#ff4400"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.2, 1.5]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Cracks (if broken) */}
              {isBroken && (
                <g stroke="#ff4400" strokeWidth="3" strokeLinecap="round">
                  <path d="M -20 -20 L -50 -60" />
                  <path d="M 20 -20 L 60 -50" />
                  <path d="M -20 20 L -40 70" />
                  <path d="M 20 20 L 70 40" />
                  <path d="M 0 -30 L 0 -80" />
                  <path d="M 0 30 L 0 90" />
                </g>
              )}
            </g>
          )}

          {/* Bullet (Front View - showing the tip flattening) */}
          {strain > 0 && !isBroken && (
            <motion.circle
              cx="200"
              cy="250"
              r={15 + strain * 0.2}
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
              animate={{
                scale: [1, 1.05, 1],
              }}
            />
          )}
        </svg>

        {/* HUD Overlay */}
        <div className={cn(
          "absolute inset-0 pointer-events-none flex flex-col justify-between transition-all",
          compact ? "p-3" : "p-8"
        )}>
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className={cn(
                "font-mono text-purple-400 uppercase tracking-[0.3em]",
                compact ? "text-[7px]" : "text-[10px]"
              )}>Frontal Impact Analysis</span>
              <h3 className={cn(
                "font-black text-white italic uppercase leading-tight",
                compact ? "text-sm" : "text-2xl"
              )}>{material.name}</h3>
            </div>
            <div className={cn(
              "glass border-white/10",
              compact ? "px-1.5 py-0.5 rounded-md" : "px-3 py-1 rounded-lg"
            )}>
              <span className={cn(
                "font-mono text-slate-400",
                compact ? "text-[6px]" : "text-[10px]"
              )}>NIJ LEVEL IV</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className={cn(
                "font-mono text-slate-500 uppercase tracking-widest",
                compact ? "text-[6px]" : "text-[10px]"
              )}>Surface Tension</p>
              <div className={cn(
                "bg-white/10 rounded-full overflow-hidden",
                compact ? "w-16 h-0.5" : "w-32 h-1"
              )}>
                <motion.div 
                  className="h-full bg-purple-500"
                  animate={{ width: `${Math.min(100, strain * 2)}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-mono text-slate-500 uppercase tracking-widest",
                compact ? "text-[6px]" : "text-[10px]"
              )}>Kinetic Load</p>
              <p className={cn(
                "font-black text-white italic",
                compact ? "text-sm" : "text-xl"
              )}>{(strain * 12.5).toFixed(0)} N/cm²</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Product Info */}
      {!compact && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="p-4 glass rounded-2xl border-white/5">
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">Chassis Material</p>
            <p className="text-sm text-white font-bold">{material.id === 'silk_vest' ? 'Bio-Engineered Protein' : 'Aramid Fiber'}</p>
          </div>
          <div className="p-4 glass rounded-2xl border-white/5">
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">Weave Pattern</p>
            <p className="text-sm text-white font-bold">Hexagonal Lattice</p>
          </div>
          <div className="p-4 glass rounded-2xl border-white/5">
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">Impact Rating</p>
            <p className="text-sm text-white font-bold">{material.ballisticResistance} B.R.U.</p>
          </div>
        </div>
      )}
    </div>
  );
};
