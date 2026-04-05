// ============================================================
// CORE TYPE DEFINITIONS FOR ELECTROSIM PRO
// These types describe every object on the canvas
// ============================================================

export type ComponentCategory = 'electrical' | 'electronics';
export type WiringType = 'residential' | 'commercial' | 'industrial';

// Every draggable item on the canvas is a CanvasComponent
export interface CanvasComponent {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: ComponentProperties;
  isOn: boolean;        // toggle state (for switches etc.)
  hasFault: boolean;    // true = short circuit / overload detected
  category: ComponentCategory;
}

// All possible component types
export type ComponentType =
  // Electrical
  | 'switch'
  | 'socket'
  | 'mcb'
  | 'rccb'
  | 'db'
  | 'wire'
  | 'fan'
  | 'light'
  | 'ac'
  | 'motor'
  | 'voltageSource'
  | 'earth'
  // Electronics
  | 'resistor'
  | 'capacitor'
  | 'diode'
  | 'transistor'
  | 'led'
  | 'battery';

// Dynamic key-value properties for each component
export interface ComponentProperties {
  voltage?: number;      // Volts
  current?: number;      // Amps
  power?: number;        // Watts
  resistance?: number;   // Ohms
  capacitance?: number;  // Farads
  rating?: number;       // MCB/RCCB rating in Amps
  wireRating?: number;   // Max current the wire can carry
  phase?: 'single' | 'three';
  description?: string;
  [key: string]: number | string | undefined;
}

// A wire connection between two component ports
export interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPort: string;      // 'top' | 'bottom' | 'left' | 'right'
  toComponentId: string;
  toPort: string;
  isAnimated: boolean;   // true = electricity is flowing
  isFault: boolean;      // true = fault detected on this wire
  color: string;         // visual color: 'red','blue','green','yellow'
}

// Results from the calculation engine
export interface CalculationResult {
  totalLoadKW: number;
  totalCurrentA: number;
  recommendedWireSize: string;   // e.g. "2.5 sq mm"
  recommendedMCBRating: number;  // e.g. 16
  warnings: string[];            // human-readable warnings
  phaseBalance?: string;         // for 3-phase systems
}

// A saved design (for load/save feature)
export interface Design {
  id: string;
  name: string;
  type: WiringType;
  components: CanvasComponent[];
  wires: WireConnection[];
  createdAt: string;
  updatedAt: string;
}

// Sidebar palette item (not yet on canvas)
export interface PaletteItem {
  type: ComponentType;
  label: string;
  icon: string;         // emoji icon for sidebar
  category: ComponentCategory;
  defaultProperties: ComponentProperties;
  tooltip: string;      // educational tooltip
}
