// ============================================================
// ZUSTAND GLOBAL STATE STORE
// Zustand is a lightweight alternative to Redux.
// Think of this as the single source of truth for the app.
// ============================================================
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  CanvasComponent,
  WireConnection,
  ComponentType,
  ComponentProperties,
  WiringType,
  CalculationResult,
} from '../types';
import { calculateLoad } from '../engine/calculationEngine';

interface SimState {
  // Canvas data
  components: CanvasComponent[];
  wires: WireConnection[];
  selectedId: string | null;
  wiringType: WiringType;
  supplyVoltage: number;
  supplyPhase: 'single' | 'three';
  isSimulating: boolean;
  calcResult: CalculationResult | null;

  // Actions
  addComponent: (type: ComponentType, x: number, y: number, category: 'electrical' | 'electronics') => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  addWire: (wire: Omit<WireConnection, 'id'>) => void;
  removeWire: (id: string) => void;
  toggleComponent: (id: string) => void;
  setWiringType: (type: WiringType) => void;
  setSupplyVoltage: (v: number) => void;
  setSupplyPhase: (p: 'single' | 'three') => void;
  runSimulation: () => void;
  stopSimulation: () => void;
  clearCanvas: () => void;
  loadTemplate: (name: string) => void;
}

// Default properties for each component type
const defaultProps: Record<ComponentType, ComponentProperties> = {
  switch:        { description: 'Single-pole switch. Opens/closes circuit.' },
  socket:        { voltage: 230, current: 6, power: 0, description: '5A/15A power outlet.' },
  mcb:           { rating: 16, description: 'Miniature Circuit Breaker - protects from overcurrent.' },
  rccb:          { rating: 30, description: 'Residual Current Circuit Breaker - protects from earth leakage.' },
  db:            { description: 'Distribution Board - houses MCBs/RCCBs.' },
  wire:          { wireRating: 10, description: 'Copper conductor. Carries current between components.' },
  fan:           { power: 75,  current: 0.33, voltage: 230, description: 'Ceiling fan ~75W.' },
  light:         { power: 10,  current: 0.04, voltage: 230, description: 'LED light ~10W.' },
  ac:            { power: 1500,current: 6.5,  voltage: 230, description: '1.5 ton split AC ~1500W.' },
  motor:         { power: 750, current: 3.3,  voltage: 230, description: 'Single phase motor ~0.75kW.' },
  voltageSource: { voltage: 230, phase: 'single', description: 'AC mains supply.' },
  earth:         { description: 'Earth/Ground connection for safety.' },
  resistor:      { resistance: 1000, description: 'Limits current flow. Unit: Ohms (Ω).' },
  capacitor:     { capacitance: 0.000001, voltage: 50, description: 'Stores electric charge. Unit: Farads (F).' },
  diode:         { description: 'Allows current in one direction only.' },
  transistor:    { description: 'Acts as electronic switch or amplifier.' },
  led:           { power: 0.02, voltage: 2, description: 'Light Emitting Diode. Needs ~2V forward voltage.' },
  battery:       { voltage: 9, description: 'DC voltage source.' },
};

const COMPONENT_SIZE = 70; // Default canvas component size in pixels

export const useSimStore = create<SimState>((set, get) => ({
  components: [],
  wires: [],
  selectedId: null,
  wiringType: 'residential',
  supplyVoltage: 230,
  supplyPhase: 'single',
  isSimulating: false,
  calcResult: null,

  addComponent: (type, x, y, category) => {
    const newComp: CanvasComponent = {
      id: uuidv4(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      x,
      y,
      width: COMPONENT_SIZE,
      height: COMPONENT_SIZE,
      rotation: 0,
      properties: { ...defaultProps[type] },
      isOn: true,
      hasFault: false,
      category,
    };
    set(state => ({ components: [...state.components, newComp] }));
  },

  updateComponent: (id, updates) =>
    set(state => ({
      components: state.components.map(c => c.id === id ? { ...c, ...updates } : c),
    })),

  removeComponent: (id) =>
    set(state => ({
      components: state.components.filter(c => c.id !== id),
      // Also remove any wires connected to this component
      wires: state.wires.filter(w => w.fromComponentId !== id && w.toComponentId !== id),
    })),

  selectComponent: (id) => set({ selectedId: id }),

  addWire: (wire) =>
    set(state => ({ wires: [...state.wires, { ...wire, id: uuidv4() }] })),

  removeWire: (id) =>
    set(state => ({ wires: state.wires.filter(w => w.id !== id) })),

  // Toggle ON/OFF state (e.g., flip a switch)
  toggleComponent: (id) =>
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, isOn: !c.isOn } : c
      ),
    })),

  setWiringType: (type) => set({ wiringType: type }),
  setSupplyVoltage: (v) => set({ supplyVoltage: v }),
  setSupplyPhase: (p) => set({ supplyPhase: p }),

  // Run the simulation: calculate loads, detect faults, animate wires
  runSimulation: () => {
    const { components, wires, supplyVoltage, supplyPhase } = get();
    const result = calculateLoad(components, supplyVoltage, supplyPhase);

    // Mark wires as animated if simulation is running
    const animatedWires = wires.map(w => ({ ...w, isAnimated: true }));

    // Detect overloaded wires and mark as fault
    const faultWires = animatedWires.map(w => {
      const fromComp = components.find(c => c.id === w.fromComponentId);
      const wireRating = fromComp?.properties?.wireRating ?? 10;
      const isFault = result.totalCurrentA > wireRating;
      return { ...w, isFault, color: isFault ? '#ef4444' : '#22d3ee' };
    });

    // Mark components with fault if total current exceeds MCB rating
    const updatedComponents = components.map(c => {
      if (c.type === 'mcb') {
        const rating = c.properties.rating ?? 16;
        return { ...c, hasFault: result.totalCurrentA > rating };
      }
      return c;
    });

    set({
      isSimulating: true,
      calcResult: result,
      wires: faultWires,
      components: updatedComponents,
    });
  },

  stopSimulation: () =>
    set(state => ({
      isSimulating: false,
      wires: state.wires.map(w => ({ ...w, isAnimated: false, isFault: false, color: '#94a3b8' })),
      components: state.components.map(c => ({ ...c, hasFault: false })),
    })),

  clearCanvas: () => set({ components: [], wires: [], selectedId: null, calcResult: null, isSimulating: false }),

  // Load pre-built templates
  loadTemplate: (name) => {
    // Templates are defined in templateData.ts and imported here
    // This triggers the template loader
    set({ components: [], wires: [] }); // cleared before loading
    // actual template data loaded via TemplateLoader component
    console.log('Loading template:', name);
  },
}));
