// Refund calculation: 50% of the base cost
const REFUND_RATE = 0.5;

export const PERMANENT_ITEMS = [
  // --- WEAPONS (Attack Power Focus) ---
  {
    id: 'W01',
    slot: 'weapon',
    name: 'Neural Injector',
    icon: '💉',
    cost: 200,
    attack_bonus: 5,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0,
    description: '+5 Permanent ATK.',
  },
  {
    id: 'W02',
    slot: 'weapon',
    name: 'Quantum Blade',
    icon: '⚔️',
    cost: 500,
    attack_bonus: 12,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0,
    description: '+12 Permanent ATK.',
  },

  // --- ARMOR (Defense/HP/Shield Focus) ---
  {
    id: 'A01',
    slot: 'armor',
    name: 'Kevlar Vest',
    icon: '🛡️',
    cost: 150,
    attack_bonus: 0,
    hp_bonus: 15,
    shield_bonus: 15,
    description: '+15 Max HP/Shield.',
  },
  {
    id: 'A02',
    slot: 'armor',
    name: 'Titanium Shell',
    icon: '🪖',
    cost: 400,
    attack_bonus: 0,
    hp_bonus: 30,
    shield_bonus: 30,
    description: '+30 Max HP/Shield.',
  },

  // --- RING (Crit/Utility Focus) ---
  {
    id: 'R01',
    slot: 'ring',
    name: 'Zero Ring',
    icon: '⭕',
    cost: 100,
    attack_bonus: 0,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0.005,
    description: '+0.5% Permanent Crit.',
  },
  {
    id: 'R02',
    slot: 'ring',
    name: 'Data Compass',
    icon: '🧭',
    cost: 300,
    attack_bonus: 0,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0.015,
    description: '+1.5% Permanent Crit.',
  },
];

export const REFUND_RATE_PERCENT = REFUND_RATE * 100;
