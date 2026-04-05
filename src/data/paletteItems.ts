// ============================================================
// PALETTE ITEMS
// These appear in the left sidebar as draggable components.
// Each item has an educational tooltip for students.
// ============================================================
import type { PaletteItem } from '../types';

export const PALETTE_ITEMS: PaletteItem[] = [
  // ---- ELECTRICAL COMPONENTS ----
  {
    type: 'voltageSource',
    label: 'AC Supply',
    icon: '⚡',
    category: 'electrical',
    defaultProperties: { voltage: 230, phase: 'single' },
    tooltip: 'AC mains supply. India standard: 230V, 50Hz single phase.',
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: '🔌',
    category: 'electrical',
    defaultProperties: {},
    tooltip: 'Opens or closes a circuit. Single pole switch used for lights/fans.',
  },
  {
    type: 'socket',
    label: 'Socket',
    icon: '🔋',
    category: 'electrical',
    defaultProperties: { voltage: 230, current: 6 },
    tooltip: '5A socket for small loads. 15A socket for AC, geyser etc.',
  },
  {
    type: 'mcb',
    label: 'MCB',
    icon: '🛡️',
    category: 'electrical',
    defaultProperties: { rating: 16 },
    tooltip: 'Miniature Circuit Breaker. Trips when current exceeds rated value. Protects wires from overload.',
  },
  {
    type: 'rccb',
    label: 'RCCB',
    icon: '⚠️',
    category: 'electrical',
    defaultProperties: { rating: 30 },
    tooltip: 'Residual Current Circuit Breaker. Detects earth leakage as low as 30mA. Prevents electric shock.',
  },
  {
    type: 'db',
    label: 'DB Panel',
    icon: '🏭',
    category: 'electrical',
    defaultProperties: {},
    tooltip: 'Distribution Board. Central panel where all circuit breakers are mounted.',
  },
  {
    type: 'earth',
    label: 'Earth',
    icon: '🌍',
    category: 'electrical',
    defaultProperties: {},
    tooltip: 'Safety earth connection. All metal enclosures must be earthed to prevent shock.',
  },
  {
    type: 'light',
    label: 'LED Light',
    icon: '💡',
    category: 'electrical',
    defaultProperties: { power: 10, voltage: 230 },
    tooltip: 'LED lamp. Typical 10W replaces a 60W incandescent. Very energy efficient.',
  },
  {
    type: 'fan',
    label: 'Ceiling Fan',
    icon: '🌀',
    category: 'electrical',
    defaultProperties: { power: 75, voltage: 230 },
    tooltip: 'Ceiling fan. Consumes ~75W. Uses single phase induction motor.',
  },
  {
    type: 'ac',
    label: 'Air Conditioner',
    icon: '❄️',
    category: 'electrical',
    defaultProperties: { power: 1500, voltage: 230 },
    tooltip: '1.5 ton split AC. Draws ~6.5A. Needs dedicated 16A circuit.',
  },
  {
    type: 'motor',
    label: 'Motor',
    icon: '⚙️',
    category: 'electrical',
    defaultProperties: { power: 750, voltage: 230 },
    tooltip: 'Single phase motor 0.75kW (1HP). Used for pumps, compressors.',
  },
  // ---- ELECTRONICS COMPONENTS ----
  {
    type: 'resistor',
    label: 'Resistor',
    icon: '〰️',
    category: 'electronics',
    defaultProperties: { resistance: 1000 },
    tooltip: 'Limits current flow. Value in Ohms (Ω). V = I × R (Ohm\'s Law).',
  },
  {
    type: 'capacitor',
    label: 'Capacitor',
    icon: '⊣⊢',
    category: 'electronics',
    defaultProperties: { capacitance: 0.000001, voltage: 50 },
    tooltip: 'Stores charge like a small battery. Blocks DC, passes AC.',
  },
  {
    type: 'diode',
    label: 'Diode',
    icon: '▷|',
    category: 'electronics',
    defaultProperties: {},
    tooltip: 'One-way valve for current. Used in rectifier circuits to convert AC to DC.',
  },
  {
    type: 'transistor',
    label: 'Transistor',
    icon: '🔀',
    category: 'electronics',
    defaultProperties: {},
    tooltip: 'Electronic switch or amplifier. Foundation of all modern electronics.',
  },
  {
    type: 'led',
    label: 'LED',
    icon: '🔆',
    category: 'electronics',
    defaultProperties: { power: 0.02, voltage: 2 },
    tooltip: 'Light Emitting Diode. Needs ~2V and current limiting resistor.',
  },
  {
    type: 'battery',
    label: 'Battery',
    icon: '🔋',
    category: 'electronics',
    defaultProperties: { voltage: 9 },
    tooltip: 'DC voltage source. 9V battery for circuits, 12V for automotive.',
  },
];

export const ELECTRICAL_ITEMS = PALETTE_ITEMS.filter(i => i.category === 'electrical');
export const ELECTRONICS_ITEMS = PALETTE_ITEMS.filter(i => i.category === 'electronics');
