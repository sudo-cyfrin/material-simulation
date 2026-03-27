import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MaterialProperties {
  id: string;
  name: string;
  icon: string;
  tensileStrength: number; // MPa
  youngsModulus: number; // GPa
  toughness: number; // MJ/m^3
  density: number; // kg/m^3
  ballisticResistance: number; // Impact energy absorption (arbitrary units)
  color: string;
  description: string;
}

export const MATERIALS: MaterialProperties[] = [
  {
    id: 'silk_vest',
    name: 'Spider Silk Vest',
    icon: '🕸️',
    tensileStrength: 1100,
    youngsModulus: 10,
    toughness: 160,
    density: 1310,
    ballisticResistance: 95,
    color: '#1a202c', // Tactical Black/Dark Slate
    description: 'Next-gen bio-engineered fiber vest. Exceptional energy dissipation through molecular elasticity.'
  },
  {
    id: 'kevlar_vest',
    name: 'Conventional Vest',
    icon: '🛡️',
    tensileStrength: 3600,
    youngsModulus: 120,
    toughness: 40,
    density: 1440,
    ballisticResistance: 70,
    color: '#556b2f', // Olive Drab (Military Green)
    description: 'Standard NIJ-certified Kevlar plate carrier. High rigid resistance with localized deformation.'
  }
];

export type AppPage = 'tensile' | 'cement';

export interface CementProperties {
  id: string;
  name: string;
  compressiveStrength: number; // MPa
  co2Emissions: number; // kg/tonne
  healingRate: number; // % per cycle
  porosity: number; // %
  durabilityScore: number; // 0-100
  color: string;
  description: string;
}

export const CEMENT_MATERIALS: CementProperties[] = [
  {
    id: 'normal',
    name: 'Normal Cement',
    compressiveStrength: 45,
    co2Emissions: 800,
    healingRate: 5,
    porosity: 15,
    durabilityScore: 40,
    color: '#94A3B8',
    description: 'Standard Portland cement. High strength but brittle and high carbon footprint.'
  },
  {
    id: 'bio',
    name: 'Bio-Cement',
    compressiveStrength: 30,
    co2Emissions: 150,
    healingRate: 85,
    porosity: 8,
    durabilityScore: 95,
    color: '#86EFAC',
    description: 'Bacterial-infused cement. Self-heals cracks and traps CO2 during production.'
  }
];

export interface SimState {
  force: number; // Newtons (Impact Velocity)
  stress: number; // MPa
  strain: number; // % (Penetration Depth)
  status: 'Elastic' | 'Yielding' | 'Broken';
  isBroken: boolean;
}
