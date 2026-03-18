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
  color: string;
  description: string;
}

export const MATERIALS: MaterialProperties[] = [
  {
    id: 'silk',
    name: 'Spider Silk',
    icon: '🕸️',
    tensileStrength: 1100,
    youngsModulus: 10,
    toughness: 160,
    density: 1310,
    color: '#FFFFFF', // Pure White
    description: 'Incredible strength-to-weight ratio with extreme elasticity.'
  },
  {
    id: 'iron',
    name: 'Structural Iron',
    icon: '⚙️',
    tensileStrength: 400,
    youngsModulus: 200,
    toughness: 50,
    density: 7870,
    color: '#E2E8F0', // Bright Silver / Iron
    description: 'High stiffness and strength, prone to plastic deformation.'
  },
  {
    id: 'stone',
    name: 'Granite Stone',
    icon: '🪨',
    tensileStrength: 10,
    youngsModulus: 50,
    toughness: 0.1,
    density: 2700,
    color: '#94A3B8', // Medium Slate Gray / Stone
    description: 'High compressive strength but extremely brittle under tension.'
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
  force: number; // Newtons
  stress: number; // MPa
  strain: number; // %
  status: 'Elastic' | 'Yielding' | 'Broken';
  isBroken: boolean;
}
