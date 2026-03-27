import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialProperties, cn } from '../types';

interface SimulationView2DProps {
  material: MaterialProperties;
  strain: number;
  isBroken: boolean;
  compact?: boolean;
}

export const SimulationView2D = ({ material, strain, isBroken, compact = false }: SimulationView2DProps) => {
  const penetration = strain / 100;
  
  // Generate vest layers
  const layers = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 300 + i * 8,
      opacity: 1 - i * 0.05,
    }));
  }, []);

  // Calculate bullet position
  // Bullet starts at x=50, hits first layer at x=300
  // penetration 0-1 maps to x=300 to x=450 (if broken) or x=300 to x=380 (if not broken)
  const bulletX = isBroken 
    ? 300 + penetration * 300 
    : 50 + (300 - 50) * Math.min(1, penetration * 5) + (penetration > 0.2 ? (penetration - 0.2) * 100 : 0);

  // If strain is 0, bullet is at start
  const actualBulletX = strain === 0 ? 50 : bulletX;

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
        compact ? "aspect-[4/3]" : "aspect-video max-w-4xl"
      )}>
        <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
          {/* Mannequin Silhouette (Back) */}
          <path 
            d="M 450 50 Q 550 50 550 200 Q 550 350 450 350 L 450 50" 
            fill="#0f172a" 
            className="opacity-50"
          />

          {/* Vest Layers */}
          <g>
            {layers.map((layer, i) => {
              // Calculate deformation for this layer
              // Only layers that the bullet has reached or is pushing against deform
              const layerX = layer.x;
              const isHit = actualBulletX >= layerX;
              const layerDeformation = isHit && !isBroken
                ? Math.max(0, (actualBulletX - layerX) * (1 - i * 0.08))
                : 0;

              // If broken, layers snap
              const isSnapped = isBroken && actualBulletX > layerX + 20;

              return (
                <g key={layer.id}>
                  <motion.path
                    d={isSnapped 
                      ? `M ${layerX} 50 L ${layerX + 10} 180 M ${layerX - 10} 220 L ${layerX} 350`
                      : `M ${layerX} 50 Q ${layerX + layerDeformation * 2} 200 ${layerX} 350`
                    }
                    stroke={material.color}
                    strokeWidth={isProtein(material) ? 3 : 5}
                    fill="none"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      strokeOpacity: isSnapped ? 0.3 : layer.opacity,
                      strokeWidth: isSnapped ? 1 : (isProtein(material) ? 3 : 5),
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                  
                  {/* Stress Glow */}
                  {isHit && !isSnapped && (
                    <motion.path
                      d={`M ${layerX} 150 Q ${layerX + layerDeformation * 2.2} 200 ${layerX} 250`}
                      stroke="#ff4400"
                      strokeWidth={8}
                      strokeOpacity={0.4}
                      fill="none"
                      filter="blur(8px)"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Bullet */}
          <motion.g
            animate={{ x: actualBulletX, y: 200 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          >
            {/* Bullet Body */}
            <path 
              d="M -20 -8 L 0 -8 Q 15 0 0 8 L -20 8 Z" 
              fill="#fbbf24" 
              stroke="#d97706"
              strokeWidth="1"
            />
            {/* Bullet Tip (Flattening effect) */}
            <motion.path
              d="M 0 -8 Q 15 0 0 8"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              animate={{
                scaleX: strain > 10 ? 0.5 : 1,
                x: strain > 10 ? -2 : 0
              }}
            />
            {/* Motion Blur / Trail */}
            {strain > 0 && (
              <rect x="-100" y="-4" width="80" height="8" fill="url(#bulletTrail)" className="opacity-40" />
            )}
            
            {/* Impact Sparkles */}
            {strain > 0 && !isBroken && (
              <g>
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    r="2"
                    fill="#ffaa00"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 100, 
                      y: (Math.random() - 0.5) * 100,
                      opacity: 0 
                    }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </g>
            )}
          </motion.g>

          {/* Definitions */}
          <defs>
            <linearGradient id="bulletTrail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="#ff4400" />
            </linearGradient>
          </defs>
        </svg>

        {/* 2D HUD Overlays */}
        <div className={cn(
          "absolute inset-0 pointer-events-none flex flex-col justify-between transition-all",
          compact ? "p-3" : "p-6"
        )}>
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className={cn(
                  "font-mono text-slate-400 uppercase tracking-[0.3em]",
                  compact ? "text-[7px]" : "text-[10px]"
                )}>2D Ballistic Cross-Section</span>
              </div>
              <h3 className={cn(
                "font-black text-white italic uppercase leading-tight",
                compact ? "text-sm" : "text-2xl"
              )}>{material.name}</h3>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-mono text-slate-500 uppercase tracking-widest",
                compact ? "text-[7px]" : "text-[10px]"
              )}>Velocity</p>
              <p className={cn(
                "font-black text-white italic",
                compact ? "text-sm" : "text-xl"
              )}>850 m/s</p>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className={cn(
              "glass border-white/10 transition-all",
              compact ? "px-2 py-1 rounded-lg" : "px-4 py-2 rounded-xl"
            )}>
              <p className={cn(
                "font-mono text-purple-400 uppercase tracking-widest mb-0.5",
                compact ? "text-[6px]" : "text-[8px]"
              )}>Structural Integrity</p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "bg-white/10 rounded-full overflow-hidden",
                  compact ? "w-16 h-0.5" : "w-32 h-1"
                )}>
                  <motion.div 
                    className={cn("h-full", isBroken ? "bg-red-500" : "bg-emerald-500")}
                    initial={{ width: "100%" }}
                    animate={{ width: `${Math.max(0, 100 - strain * 1.5)}%` }}
                  />
                </div>
                <span className={cn(
                  "font-mono text-white",
                  compact ? "text-[7px]" : "text-[10px]"
                )}>{Math.max(0, 100 - strain * 1.5).toFixed(0)}%</span>
              </div>
            </div>

            <div className="text-right">
              <p className={cn(
                "font-mono text-slate-500 uppercase tracking-widest mb-0.5",
                compact ? "text-[7px]" : "text-[10px]"
              )}>Impact Status</p>
              <p className={cn(
                "font-black uppercase italic leading-none",
                compact ? "text-xs" : "text-xl",
                isBroken ? "text-red-500" : strain > 0 ? "text-amber-400" : "text-emerald-400"
              )}>
                {isBroken ? "PENETRATION" : strain > 0 ? "ABSORPTION" : "READY"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking Point Info */}
      <AnimatePresence>
        {isBroken && !compact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
          >
            <div className="p-6 glass border-red-500/30 rounded-2xl text-center">
              <h4 className="text-red-500 font-black uppercase italic tracking-widest mb-2">Breaking Point Reached</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                The kinetic energy of the projectile exceeded the material's <span className="text-white font-bold">Toughness ({material.toughness} MJ/m³)</span>. 
                Molecular chains have snapped, leading to complete structural failure.
              </p>
            </div>
            <div className="p-6 glass border-amber-500/30 rounded-2xl">
              <h4 className="text-amber-500 font-black uppercase italic tracking-widest mb-4 text-center">Failure Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500 uppercase">Energy Dissipated</span>
                  <span className="text-white">{(material.ballisticResistance * 0.8).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${material.ballisticResistance * 0.8}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500 uppercase">Layer Shear</span>
                  <span className="text-white">Critical</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function isProtein(material: MaterialProperties) {
  return material.id === 'silk_vest';
}
