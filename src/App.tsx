/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, RotateCcw, Activity, Shield, Zap, Info, Download, Construction, Video, ShieldCheck } from 'lucide-react';
import { MATERIALS, CEMENT_MATERIALS, MaterialProperties, CementProperties, SimState, AppPage, cn } from './types';
import { MaterialCard } from './components/MaterialCard';
import { SimulationView2D } from './components/SimulationView2D';
import { VestFrontView } from './components/VestFrontView';
import { CementSimulationView } from './components/CementSimulationView';
import { VideoGenerationView } from './components/VideoGenerationView';
import { ProteinVestShowcase } from './components/ProteinVestShowcase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('tensile');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialProperties>(MATERIALS[0]);
  const [selectedCement, setSelectedCement] = useState<CementProperties>(CEMENT_MATERIALS[0]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [viewMode, setViewMode] = useState<'cross' | 'front'>('cross');
  const [isCementComparisonMode, setIsCementComparisonMode] = useState(false);
  const [showVideoGen, setShowVideoGen] = useState(false);
  const [showProteinShowcase, setShowProteinShowcase] = useState(false);
  
  // Tensile Lab State
  const [force, setForce] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [diameter, setDiameter] = useState(10);
  
  // Cement Lab State
  const [cementStress, setCementStress] = useState(0);
  const [healingCycles, setHealingCycles] = useState(0);
  const [isHealing, setIsHealing] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);

  // State for each material in comparison mode
  const [simStates, setSimStates] = useState<Record<string, SimState>>(
    MATERIALS.reduce((acc, m) => ({
      ...acc,
      [m.id]: { force: 0, stress: 0, strain: 0, status: 'Elastic', isBroken: false }
    }), {})
  );

  const calculatePhysics = useCallback((currentForce: number, material: MaterialProperties, temp: number, diam: number) => {
    // In Ballistics Lab:
    // currentForce = Impact Velocity (m/s)
    // diam = Bullet Caliber (mm)
    
    // Penetration depth calculation (simplified)
    // Depth is proportional to kinetic energy (v^2) and inversely proportional to resistance
    const velocity = currentForce;
    const massFactor = diam / 10; // Normalized mass factor
    const kineticEnergy = 0.5 * massFactor * Math.pow(velocity / 100, 2);
    
    let penetrationPercent = (kineticEnergy / material.ballisticResistance) * 100;
    let status: SimState['status'] = 'Elastic';
    let isBroken = false;

    if (penetrationPercent > 100) {
      penetrationPercent = 100;
      isBroken = true;
      status = 'Broken';
    } else if (penetrationPercent > 70) {
      status = 'Yielding';
    }

    // Stress and Strain are repurposed for Ballistics
    const stressMPa = kineticEnergy * 10; // Impact Energy
    const strainPercent = penetrationPercent; // Penetration Depth %

    return { stress: stressMPa, strain: strainPercent, status, isBroken };
  }, []);

  useEffect(() => {
    const newSimStates: Record<string, SimState> = {};
    MATERIALS.forEach(m => {
      const { stress, strain, status, isBroken } = calculatePhysics(force, m, temperature, diameter);
      newSimStates[m.id] = { force, stress, strain, status, isBroken };
    });
    setSimStates(newSimStates);
  }, [force, temperature, diameter, calculatePhysics]);

  // Healing animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHealing && (selectedCement.id === 'bio' || isCementComparisonMode)) {
      interval = setInterval(() => {
        setHealingProgress(prev => {
          if (prev >= 1) {
            setIsHealing(false);
            setHealingCycles(c => c + 1);
            return 1;
          }
          return prev + 0.02;
        });
      }, 50);
    } else if (isHealing) {
      // Normal cement doesn't heal
      setIsHealing(false);
    }
    return () => clearInterval(interval);
  }, [isHealing, selectedCement.id, isCementComparisonMode]);

  const handleReset = () => {
    setForce(0);
    setTemperature(25);
    setDiameter(10);
    setCementStress(0);
    setHealingCycles(0);
    setHealingProgress(0);
    setIsHealing(false);
    setSimStates(
      MATERIALS.reduce((acc, m) => ({
        ...acc,
        [m.id]: { force: 0, stress: 0, strain: 0, status: 'Elastic', isBroken: false }
      }), {})
    );
  };

  const activeSimState = simStates[selectedMaterial.id];

  return (
    <div className="min-h-screen bg-[#0d071f] text-slate-50 p-4 md:p-8 lg:p-12 selection:bg-purple-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg glass">
                <Beaker className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-[0.3em]">Scientific Lab v4.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              PhysiLab<span className="text-purple-500">.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-4"
          >
              <nav className="flex bg-white/5 p-1 rounded-2xl glass">
                <button 
                  onClick={() => { setCurrentPage('tensile'); handleReset(); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    currentPage === 'tensile' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  Ballistics Lab
                </button>
                <button 
                  onClick={() => { setCurrentPage('cement'); handleReset(); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    currentPage === 'cement' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  Cement Lab
                </button>
                <button 
                  onClick={() => setShowProteinShowcase(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-white transition-all"
                >
                  Product Detail
                </button>
              </nav>

            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass glass-hover text-sm font-bold uppercase tracking-wider text-purple-400"
              onClick={() => setShowVideoGen(true)}
            >
              <Video className="w-4 h-4" /> Cinematic Capture
            </button>

            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass glass-hover text-sm font-bold uppercase tracking-wider text-emerald-400"
              onClick={() => setShowProteinShowcase(true)}
            >
              <ShieldCheck className="w-4 h-4" /> View Prototype
            </button>
            
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass glass-hover text-sm font-bold uppercase tracking-wider text-slate-400"
              onClick={() => window.open('#', '_blank')}
            >
              <Download className="w-4 h-4" /> PPT
            </button>
            
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass glass-hover text-sm font-bold uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </motion.div>
        </header>

        {currentPage === 'tensile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <h2 className="text-xs font-bold text-purple-500 uppercase tracking-widest">Select Specimen</h2>
                </div>
                <button 
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className="text-[10px] font-bold uppercase text-slate-500 hover:text-purple-400 transition-colors"
                >
                  {isComparisonMode ? "[ Single View ]" : "[ Compare Mode ]"}
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {MATERIALS.map((m) => (
                  <MaterialCard 
                    key={m.id}
                    material={m}
                    isSelected={selectedMaterial.id === m.id}
                    onClick={() => {
                      setSelectedMaterial(m);
                      handleReset();
                    }}
                  />
                ))}
              </div>

              <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Telemetry</h2>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    activeSimState.status === 'Elastic' ? "bg-emerald-500/20 text-emerald-400" :
                    activeSimState.status === 'Yielding' ? "bg-amber-500/20 text-amber-400" :
                    "bg-purple-500/20 text-purple-400"
                  )}>
                    {activeSimState.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Impact Energy</p>
                    <p className="text-2xl font-mono font-bold">{activeSimState.stress.toFixed(1)} <span className="text-xs text-slate-500">kJ</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Penetration Depth</p>
                    <p className="text-2xl font-mono font-bold">{activeSimState.strain.toFixed(2)} <span className="text-xs text-slate-500">%</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex bg-white/5 p-1 rounded-xl glass">
                  <button 
                    onClick={() => setViewMode('cross')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      viewMode === 'cross' ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Cross-Section
                  </button>
                  <button 
                    onClick={() => setViewMode('front')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      viewMode === 'front' ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Front View
                  </button>
                </div>
                <button 
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className="text-[10px] font-bold uppercase text-slate-500 hover:text-purple-400 transition-colors"
                >
                  {isComparisonMode ? "[ Single View ]" : "[ Compare Mode ]"}
                </button>
              </div>

              <div className={cn(
                "grid gap-4",
                isComparisonMode ? `grid-cols-1 md:grid-cols-${MATERIALS.length}` : "grid-cols-1"
              )}>
                {isComparisonMode ? (
                  MATERIALS.map(m => (
                    viewMode === 'cross' ? (
                      <SimulationView2D 
                        key={m.id}
                        material={m} 
                        strain={simStates[m.id].strain} 
                        isBroken={simStates[m.id].isBroken} 
                        compact={true}
                      />
                    ) : (
                      <VestFrontView 
                        key={m.id}
                        material={m} 
                        strain={simStates[m.id].strain} 
                        isBroken={simStates[m.id].isBroken} 
                        compact={true}
                      />
                    )
                  ))
                ) : (
                  viewMode === 'cross' ? (
                    <SimulationView2D 
                      material={selectedMaterial} 
                      strain={activeSimState.strain} 
                      isBroken={activeSimState.isBroken} 
                    />
                  ) : (
                    <VestFrontView 
                      material={selectedMaterial} 
                      strain={activeSimState.strain} 
                      isBroken={activeSimState.isBroken} 
                    />
                  )
                )}
              </div>
              
              <div className="glass p-8 rounded-3xl space-y-8">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Environmental Control</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Velocity</span>
                      <span className="text-sm font-mono text-purple-400">{force} m/s</span>
                    </div>
                    <input type="range" min="0" max="1200" step="10" value={force} onChange={(e) => setForce(Number(e.target.value))} className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambient Temp</span>
                      <span className="text-sm font-mono text-purple-400">{temperature}°C</span>
                    </div>
                    <input type="range" min="-50" max="100" step="1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bullet Caliber</span>
                      <span className="text-sm font-mono text-indigo-400">{diameter} mm</span>
                    </div>
                    <input type="range" min="4.5" max="12.7" step="0.1" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cement Lab Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Construction className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Cement Comparison</h2>
                </div>
                <button 
                  onClick={() => { setIsCementComparisonMode(!isCementComparisonMode); handleReset(); }}
                  className="text-[10px] font-bold uppercase text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {isCementComparisonMode ? "[ Single View ]" : "[ Compare Mode ]"}
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {CEMENT_MATERIALS.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => { setSelectedCement(m); handleReset(); }}
                    className={cn(
                      "glass glass-hover p-6 rounded-3xl cursor-pointer transition-all",
                      selectedCement.id === m.id && !isCementComparisonMode ? "ring-2 ring-emerald-500/50 bg-emerald-500/5" : ""
                    )}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: m.color + '20' }}>
                        🏗️
                      </div>
                      <h3 className="font-bold text-white">{m.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{m.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="text-slate-500">Strength: <span className="text-white">{m.compressiveStrength} MPa</span></div>
                      <div className="text-slate-500">CO2: <span className="text-white">{m.co2Emissions} kg/t</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cement Stats */}
              <div className="glass p-6 rounded-3xl space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Environmental Impact</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">Carbon Footprint</span>
                      <span className="text-white">{selectedCement.co2Emissions} kg CO2/tonne</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${(selectedCement.co2Emissions / 800) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">Self-Healing Potential</span>
                      <span className="text-white">{selectedCement.healingRate}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedCement.healingRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">Durability Score</span>
                      <span className="text-white">{selectedCement.durabilityScore}/100</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${selectedCement.durabilityScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cement Lab Main */}
            <div className="lg:col-span-8 space-y-8">
              <div className={cn(
                "grid gap-4",
                isCementComparisonMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              )}>
                {isCementComparisonMode ? (
                  CEMENT_MATERIALS.map(m => (
                    <CementSimulationView 
                      key={m.id}
                      material={m} 
                      crackLevel={cementStress >= m.compressiveStrength ? Math.min(1, (cementStress - m.compressiveStrength) / 10 + 0.3) : 0}
                      healingProgress={m.id === 'bio' ? healingProgress : 0}
                    />
                  ))
                ) : (
                  <CementSimulationView 
                    material={selectedCement} 
                    crackLevel={cementStress >= selectedCement.compressiveStrength ? Math.min(1, (cementStress - selectedCement.compressiveStrength) / 10 + 0.3) : 0}
                    healingProgress={healingProgress}
                  />
                )}
              </div>

              <div className="glass p-8 rounded-3xl flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Simulation Controls</h3>
                  <p className="text-[10px] text-slate-500">Apply load to induce cracking, then trigger healing.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compressive Load</span>
                      <span className="text-sm font-mono text-emerald-400">{cementStress.toFixed(1)} MPa</span>
                    </div>
                    <input 
                      type="range" min="0" max="60" step="0.5" 
                      value={cementStress} 
                      onChange={(e) => setCementStress(Number(e.target.value))} 
                      className="w-full h-2 bg-emerald-900/50 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                    />
                  </div>

                  <button 
                    onClick={() => { setIsHealing(true); setHealingProgress(0); }}
                    disabled={isHealing || cementStress === 0 || (!isCementComparisonMode && selectedCement.id === 'normal')}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all",
                      isHealing ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    )}
                  >
                    {isHealing ? "Healing in Progress..." : (selectedCement.id === 'normal' && !isCementComparisonMode) ? "Normal Cement Cannot Heal" : "Trigger Self-Healing"}
                  </button>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Healing Cycles</p>
                      <p className="text-2xl font-mono font-bold text-white">{healingCycles}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Durability Score</p>
                      <p className="text-2xl font-mono font-bold text-emerald-400">
                        {Math.min(100, (selectedCement.healingRate * (healingCycles + 1) / 10) + (100 - selectedCement.porosity)).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Lifecycle Assessment (LCA)</h3>
                <div className="grid grid-cols-3 gap-4 text-[10px] font-mono uppercase tracking-wider text-slate-500 border-b border-white/5 pb-2 mb-4">
                  <div>Parameter</div>
                  <div className="text-center">Normal Cement</div>
                  <div className="text-center">Bio-Cement</div>
                </div>
                {[
                  { label: 'CO2 Footprint', normal: '800 kg/t', bio: '150 kg/t', better: 'bio' },
                  { label: 'Healing Capacity', normal: 'None', bio: 'Bacterial', better: 'bio' },
                  { label: 'Porosity', normal: '15%', bio: '8%', better: 'bio' },
                  { label: 'Durability', normal: 'Prone to cracking', bio: 'High resistance', better: 'bio' },
                  { label: 'Production Cost', normal: 'Low', bio: 'Medium-High', better: 'normal' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 last:border-0">
                    <div className="text-slate-300">{row.label}</div>
                    <div className={cn("text-center", row.better === 'normal' ? "text-emerald-400" : "text-slate-500")}>{row.normal}</div>
                    <div className={cn("text-center", row.better === 'bio' ? "text-emerald-400" : "text-slate-500")}>{row.bio}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 relative z-10">
        <p className="text-xs font-mono">© 2026 PhysiLab Materials Engineering. All rights reserved.</p>
        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-purple-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-purple-400 transition-colors">API Specs</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
        </div>
      </footer>

      <AnimatePresence>
        {showVideoGen && (
          <VideoGenerationView onClose={() => setShowVideoGen(false)} />
        )}
        {showProteinShowcase && (
          <ProteinVestShowcase onClose={() => setShowProteinShowcase(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
