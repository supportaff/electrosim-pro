// ============================================================
// PRE-BUILT WIRING TEMPLATES
// Students can load these to see a ready-made design and
// study how different components are connected.
// ============================================================
import type { CanvasComponent, WireConnection } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface Template {
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial';
  supplyVoltage: number;
  supplyPhase: 'single' | 'three';
  components: CanvasComponent[];
  wires: WireConnection[];
}

// Helper to create a component quickly
const mkComp = (
  type: CanvasComponent['type'],
  label: string,
  x: number,
  y: number,
  props: Record<string, number | string | undefined> = {},
  category: 'electrical' | 'electronics' = 'electrical'
): CanvasComponent => ({
  id: uuidv4(),
  type,
  label,
  x, y,
  width: 70,
  height: 70,
  rotation: 0,
  properties: props,
  isOn: true,
  hasFault: false,
  category,
});

// ---- TEMPLATE 1: 1BHK House Wiring ----
export const template1BHK = (): Template => {
  const supply = mkComp('voltageSource', 'AC 230V', 80, 200, { voltage: 230 });
  const db     = mkComp('db',            'Main DB', 220, 200, {});
  const mcb1   = mkComp('mcb',           'MCB 16A', 360, 140, { rating: 16 });
  const mcb2   = mkComp('mcb',           'MCB 6A',  360, 260, { rating: 6 });
  const rccb   = mkComp('rccb',          'RCCB',    500, 200, { rating: 30 });
  const earth  = mkComp('earth',         'Earth',   220, 330, {});
  const light1 = mkComp('light',         'Bedroom', 640, 120, { power: 10 });
  const light2 = mkComp('light',         'Hall',    640, 200, { power: 10 });
  const fan1   = mkComp('fan',           'Fan',     640, 280, { power: 75 });
  const socket = mkComp('socket',        'Socket',  640, 360, { power: 0, current: 6 });
  const sw1    = mkComp('switch',        'Sw-Light',780, 120, {});
  const sw2    = mkComp('switch',        'Sw-Fan',  780, 280, {});

  const comps = [supply, db, mcb1, mcb2, rccb, earth, light1, light2, fan1, socket, sw1, sw2];

  // Wires connect components — from/to IDs reference actual components above
  const wires: WireConnection[] = [
    { id: uuidv4(), fromComponentId: supply.id, fromPort: 'right', toComponentId: db.id,     toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'right', toComponentId: mcb1.id,   toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'right', toComponentId: mcb2.id,   toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb1.id,   fromPort: 'right', toComponentId: rccb.id,   toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: rccb.id,   fromPort: 'right', toComponentId: light1.id, toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: rccb.id,   fromPort: 'right', toComponentId: light2.id, toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb2.id,   fromPort: 'right', toComponentId: fan1.id,   toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb2.id,   fromPort: 'right', toComponentId: socket.id, toPort: 'left',  isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'bottom',toComponentId: earth.id,  toPort: 'top',   isAnimated: false, isFault: false, color: '#22c55e' },
  ];

  return {
    name: '1BHK House Wiring',
    description: 'Standard single-bedroom house wiring with DB, MCBs, RCCB, lights, fan and sockets.',
    type: 'residential',
    supplyVoltage: 230,
    supplyPhase: 'single',
    components: comps,
    wires,
  };
};

// ---- TEMPLATE 2: Office Setup ----
export const templateOffice = (): Template => {
  const supply = mkComp('voltageSource', 'AC 230V',  80, 200, { voltage: 230 });
  const db     = mkComp('db',            'Office DB',220, 200, {});
  const mcb1   = mkComp('mcb',           'MCB 32A',  360, 120, { rating: 32 });
  const mcb2   = mkComp('mcb',           'MCB 16A',  360, 240, { rating: 16 });
  const rccb   = mkComp('rccb',          'RCCB 30mA',500, 160, { rating: 30 });
  const earth  = mkComp('earth',         'Earth',    220, 360, {});
  const ac1    = mkComp('ac',            'AC Unit',  650, 100, { power: 1500 });
  const lights = mkComp('light',         'Office Lights', 650, 200, { power: 60 });
  const sockets= mkComp('socket',        'Workstation Sockets', 650, 300, { power: 500, current: 16 });

  const comps = [supply, db, mcb1, mcb2, rccb, earth, ac1, lights, sockets];
  const wires: WireConnection[] = [
    { id: uuidv4(), fromComponentId: supply.id, fromPort: 'right', toComponentId: db.id,     toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'right', toComponentId: mcb1.id,   toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'right', toComponentId: mcb2.id,   toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb1.id,   fromPort: 'right', toComponentId: rccb.id,   toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: rccb.id,   fromPort: 'right', toComponentId: ac1.id,    toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb2.id,   fromPort: 'right', toComponentId: lights.id, toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: mcb2.id,   fromPort: 'right', toComponentId: sockets.id,toPort: 'left', isAnimated: false, isFault: false, color: '#94a3b8' },
    { id: uuidv4(), fromComponentId: db.id,     fromPort: 'bottom',toComponentId: earth.id,  toPort: 'top',  isAnimated: false, isFault: false, color: '#22c55e' },
  ];

  return {
    name: 'Office Setup',
    description: 'Commercial office wiring with dedicated AC circuit and workstation sockets.',
    type: 'commercial',
    supplyVoltage: 230,
    supplyPhase: 'single',
    components: comps,
    wires,
  };
};

export const ALL_TEMPLATES = [
  { key: '1bhk',   label: '🏠 1BHK House',   loader: template1BHK },
  { key: 'office', label: '🏢 Office Setup',  loader: templateOffice },
];
