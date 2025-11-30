const BASE_DROP_CHANCE = 0.2;
const PERMANENT_DROP_CHANCE = 0.005;

export const TEMPORARY_LOOT = [
  {
    id: 'heal_injector',
    name: 'Health Injector',
    icon: '💉',
    type: 'heal',
    description: 'Restores 50 HP and 50 Shield.',
  },
  {
    id: 'damage_scroll',
    name: 'Data Overload Scroll',
    icon: '⚡',
    type: 'buff',
    effect: 'damage',
    description: 'Grants +5 ATK for 3 successful answers.',
  },
];

export const PERMANENT_LOOT = [
  {
    id: 'binary_heart',
    name: 'Binary Heart',
    icon: '❤',
    description: 'Permanent status symbol. Grants +5 Base HP.',
    perm_bonus: { maxPlayerHp: 5 },
  },
  {
    id: 'zero_ring',
    name: 'Zero Ring',
    icon: '⭕',
    description: 'Permanent status symbol. Grants +0.1% Crit Chance.',
    perm_bonus: { critChance: 0.001 },
  },
  {
    id: 'crypto_key',
    name: 'Master Crypto Key',
    icon: '🔑',
    description: 'Permanent status symbol. Grants +1 Base ATK.',
    perm_bonus: { attackPower: 1 },
  },
  {
    id: 'synth_eye',
    name: 'Synth Eye',
    icon: '👁️',
    description: 'Permanent status symbol. Grants +10 Base Shield.',
    perm_bonus: { maxShield: 10 },
  },
];

const getRandomTemporaryLoot = () => {
  const index = Math.floor(Math.random() * TEMPORARY_LOOT.length);
  return TEMPORARY_LOOT[index];
};

const getRandomPermanentLoot = () => {
  const index = Math.floor(Math.random() * PERMANENT_LOOT.length);
  return { ...PERMANENT_LOOT[index], permanent: true };
};

export const generateLoot = (isBoss = false) => {
  // If Boss, GUARANTEED drop. If Normal, use base chance.
  if (!isBoss && Math.random() > BASE_DROP_CHANCE) {
    return null;
  }

  // Boss has 10% chance for Permanent Loot (vs normal 0.5%)
  const permChance = isBoss ? 0.1 : PERMANENT_DROP_CHANCE;

  if (Math.random() < permChance) {
    return getRandomPermanentLoot();
  }
  return getRandomTemporaryLoot();
};
