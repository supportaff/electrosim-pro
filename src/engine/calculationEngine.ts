// ============================================================
// CALCULATION ENGINE
// Core electrical formulas:
//   Ohm's Law:   V = I × R
//   Power:       P = V × I  or  P = I² × R
//   Current:     I = P / V
// ============================================================
import type { CanvasComponent, CalculationResult } from '../types';

// Load component types that consume power
const LOAD_TYPES = ['fan', 'light', 'ac', 'motor', 'socket', 'led'];

export function calculateLoad(
  components: CanvasComponent[],
  supplyVoltage: number,
  supplyPhase: 'single' | 'three'
): CalculationResult {
  const warnings: string[] = [];

  // 1. Sum up all load power (only components that are ON)
  const totalWatts = components
    .filter(c => LOAD_TYPES.includes(c.type) && c.isOn)
    .reduce((sum, c) => sum + (c.properties.power ?? 0), 0);

  const totalLoadKW = totalWatts / 1000;

  // 2. Calculate total current: I = P / V
  // For 3-phase: I = P / (√3 × V × pf),  using pf=0.8
  let totalCurrentA: number;
  if (supplyPhase === 'three') {
    totalCurrentA = totalWatts / (Math.sqrt(3) * supplyVoltage * 0.8);
  } else {
    totalCurrentA = totalWatts / supplyVoltage;
  }
  totalCurrentA = parseFloat(totalCurrentA.toFixed(2));

  // 3. Recommend wire size based on current (Indian standard IS:694)
  //    Derate wire at 80% capacity for safety
  const recommendedWireSize = getWireSize(totalCurrentA);

  // 4. Recommend MCB rating (next standard size above current)
  const recommendedMCBRating = getMCBRating(totalCurrentA);

  // 5. Safety warnings
  if (totalLoadKW > 10 && supplyPhase === 'single') {
    warnings.push('⚠️ Load exceeds 10kW on single phase. Consider 3-phase supply.');
  }
  if (totalCurrentA > 32) {
    warnings.push('⚠️ Total current exceeds 32A. Use higher rated MCB and thicker wire.');
  }
  if (totalCurrentA > 100) {
    warnings.push('🚨 DANGER: Current exceeds 100A. Risk of fire. Review design immediately.');
  }
  if (components.filter(c => c.type === 'mcb').length === 0 && components.length > 2) {
    warnings.push('⚠️ No MCB detected. Add circuit protection.');
  }
  if (components.filter(c => c.type === 'earth').length === 0 && components.length > 2) {
    warnings.push('⚠️ No earth connection found. This is a safety hazard.');
  }

  // 6. Phase balance info for 3-phase
  const phaseBalance = supplyPhase === 'three'
    ? `Load: ${(totalLoadKW / 3).toFixed(2)} kW per phase`
    : undefined;

  return {
    totalLoadKW: parseFloat(totalLoadKW.toFixed(3)),
    totalCurrentA,
    recommendedWireSize,
    recommendedMCBRating,
    warnings,
    phaseBalance,
  };
}

// Wire size table per IS:694 (copper conductor)
// Format: [max current, wire size label]
const WIRE_TABLE: [number, string][] = [
  [6,   '1.0 sq mm'],
  [10,  '1.5 sq mm'],
  [16,  '2.5 sq mm'],
  [25,  '4.0 sq mm'],
  [32,  '6.0 sq mm'],
  [50,  '10 sq mm'],
  [80,  '16 sq mm'],
  [100, '25 sq mm'],
];

function getWireSize(currentA: number): string {
  for (const [maxI, size] of WIRE_TABLE) {
    if (currentA <= maxI) return size;
  }
  return '35 sq mm or higher';
}

// Standard MCB ratings available in market
const MCB_RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100];

function getMCBRating(currentA: number): number {
  // Pick the smallest MCB rating that covers the current with 20% safety margin
  const requiredRating = currentA * 1.2;
  return MCB_RATINGS.find(r => r >= requiredRating) ?? 100;
}

// Ohm's Law calculator (utility)
export function ohmsLaw(params: { V?: number; I?: number; R?: number }) {
  const { V, I, R } = params;
  if (V !== undefined && I !== undefined) return { R: V / I, P: V * I };
  if (V !== undefined && R !== undefined) return { I: V / R, P: (V * V) / R };
  if (I !== undefined && R !== undefined) return { V: I * R, P: I * I * R };
  return null;
}
