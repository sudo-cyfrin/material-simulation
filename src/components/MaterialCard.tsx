import React from 'react';
import { motion } from 'motion/react';
import { MaterialProperties } from '../types';
import { cn } from '../types';

interface MaterialCardProps {
  material: MaterialProperties;
  isSelected: boolean;
  onClick: () => void;
}

export const MaterialCard = ({ material, isSelected, onClick }: MaterialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass glass-hover p-6 rounded-3xl cursor-pointer relative overflow-hidden group transition-all duration-500",
        isSelected ? "ring-2 ring-offset-2 ring-offset-[#020617] ring-white/50 bg-white/10" : ""
      )}
    >
      {/* Background Glow */}
      <div 
        className="absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: material.color }}
      />

      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{material.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{material.name}</h3>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Material Spec</p>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-6 line-clamp-2 h-10">
        {material.description}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Ballistic Resistance</p>
          <p className="text-sm font-mono text-white">{material.ballisticResistance} <span className="text-[10px] text-slate-400">Index</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Energy Absorption</p>
          <p className="text-sm font-mono text-white">{material.toughness} <span className="text-[10px] text-slate-400">MJ/m³</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Tensile Strength</p>
          <p className="text-sm font-mono text-white">{material.tensileStrength} <span className="text-[10px] text-slate-400">MPa</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Density</p>
          <p className="text-sm font-mono text-white">{material.density} <span className="text-[10px] text-slate-400">kg/m³</span></p>
        </div>
      </div>

      {isSelected && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      )}
    </motion.div>
  );
};
