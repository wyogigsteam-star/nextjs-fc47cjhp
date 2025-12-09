// Asphalt Paving Idle Game Logic

// Equipment Tiers
export const EQUIPMENT_TIERS = [
  {
    id: 'shovel',
    name: 'Hand Shovel',
    icon: '🔨',
    cost: 0,
    revenuePerSecond: 1,
    description: 'Basic hand tool for small repairs',
  },
  {
    id: 'wheelbarrow',
    name: 'Wheelbarrow',
    icon: '🛒',
    cost: 50,
    revenuePerSecond: 5,
    description: 'Move more material efficiently',
  },
  {
    id: 'mini_paver',
    name: 'Mini Paver',
    icon: '🚜',
    cost: 250,
    revenuePerSecond: 25,
    description: 'Small paving machine for driveways',
  },
  {
    id: 'asphalt_truck',
    name: 'Asphalt Truck',
    icon: '🚚',
    cost: 1000,
    revenuePerSecond: 100,
    description: 'Haul hot asphalt to job sites',
  },
  {
    id: 'paver_machine',
    name: 'Paver Machine',
    icon: '🏗️',
    cost: 5000,
    revenuePerSecond: 500,
    description: 'Professional paving equipment',
  },
  {
    id: 'roller',
    name: 'Road Roller',
    icon: '🚧',
    cost: 15000,
    revenuePerSecond: 1500,
    description: 'Compact and smooth large surfaces',
  },
  {
    id: 'plant',
    name: 'Asphalt Plant',
    icon: '🏭',
    cost: 50000,
    revenuePerSecond: 5000,
    description: 'Produce your own asphalt mix',
  },
  {
    id: 'highway_crew',
    name: 'Highway Crew',
    icon: '👷',
    cost: 150000,
    revenuePerSecond: 15000,
    description: 'Elite team for major projects',
  },
];

// Worker Upgrades
export const WORKER_UPGRADES = [
  {
    id: 'worker_1',
    name: 'First Worker',
    icon: '👤',
    cost: 100,
    multiplier: 1.5,
    description: 'Hire your first helper',
  },
  {
    id: 'worker_2',
    name: 'Second Worker',
    icon: '👥',
    cost: 500,
    multiplier: 2,
    description: 'Expand your crew',
  },
  {
    id: 'foreman',
    name: 'Foreman',
    icon: '👨‍💼',
    cost: 2500,
    multiplier: 3,
    description: 'Expert supervisor boosts efficiency',
  },
  {
    id: 'engineer',
    name: 'Civil Engineer',
    icon: '👨‍🔬',
    cost: 10000,
    multiplier: 5,
    description: 'Optimize operations',
  },
];

// Job Types (Prestige/Milestone System)
export const JOB_TYPES = [
  {
    id: 'pothole',
    name: 'Pothole Repair',
    icon: '🕳️',
    unlock: 0,
    description: 'Small repair jobs',
  },
  {
    id: 'driveway',
    name: 'Driveway Paving',
    icon: '🏠',
    unlock: 500,
    description: 'Residential projects',
  },
  {
    id: 'parking_lot',
    name: 'Parking Lot',
    icon: '🅿️',
    unlock: 5000,
    description: 'Commercial contracts',
  },
  {
    id: 'road',
    name: 'City Road',
    icon: '🛣️',
    unlock: 25000,
    description: 'Municipal infrastructure',
  },
  {
    id: 'highway',
    name: 'Highway Project',
    icon: '🛤️',
    unlock: 100000,
    description: 'State contracts',
  },
];

// Achievements
export const ACHIEVEMENTS = [
  {
    id: 'first_dollar',
    name: 'First Dollar',
    icon: '💵',
    requirement: { money: 1 },
    reward: { multiplier: 1.1 },
  },
  {
    id: 'hundred_k',
    name: 'Six Figures',
    icon: '💰',
    requirement: { money: 100000 },
    reward: { multiplier: 1.25 },
  },
  {
    id: 'equipment_master',
    name: 'Equipment Master',
    icon: '🏆',
    requirement: { equipmentOwned: 5 },
    reward: { multiplier: 1.5 },
  },
  {
    id: 'full_crew',
    name: 'Full Crew',
    icon: '👥',
    requirement: { workers: 4 },
    reward: { multiplier: 2 },
  },
];

// Calculate total revenue per second
export function calculateRevenuePerSecond(equipment, workers, achievements) {
  let baseRevenue = 0;
  
  // Sum up equipment revenue
  equipment.forEach(eq => {
    const equipmentData = EQUIPMENT_TIERS.find(e => e.id === eq.id);
    if (equipmentData) {
      baseRevenue += equipmentData.revenuePerSecond * (eq.count || 1);
    }
  });
  
  // Apply worker multipliers
  let workerMultiplier = 1;
  workers.forEach(worker => {
    const workerData = WORKER_UPGRADES.find(w => w.id === worker.id);
    if (workerData && worker.owned) {
      workerMultiplier *= workerData.multiplier;
    }
  });
  
  // Apply achievement multipliers
  let achievementMultiplier = 1;
  achievements.forEach(ach => {
    const achData = ACHIEVEMENTS.find(a => a.id === ach.id);
    if (achData && ach.unlocked) {
      achievementMultiplier *= achData.reward.multiplier;
    }
  });
  
  return baseRevenue * workerMultiplier * achievementMultiplier;
}

// Check if achievement is unlocked
export function checkAchievements(gameState, achievements) {
  const newUnlocks = [];
  
  ACHIEVEMENTS.forEach(ach => {
    const current = achievements.find(a => a.id === ach.id);
    if (!current || !current.unlocked) {
      let unlocked = false;
      
      if (ach.requirement.money && gameState.totalMoneyEarned >= ach.requirement.money) {
        unlocked = true;
      }
      if (ach.requirement.equipmentOwned && gameState.equipment.length >= ach.requirement.equipmentOwned) {
        unlocked = true;
      }
      if (ach.requirement.workers && gameState.workers.filter(w => w.owned).length >= ach.requirement.workers) {
        unlocked = true;
      }
      
      if (unlocked) {
        newUnlocks.push({ id: ach.id, unlocked: true, ...ach });
      }
    }
  });
  
  return newUnlocks;
}

// Format large numbers
export function formatMoney(amount) {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(2) + 'M';
  } else if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(1) + 'K';
  } else {
    return '$' + amount.toFixed(2);
  }
}

// Calculate equipment cost with scaling
export function getEquipmentCost(baseEquipment, currentCount) {
  const base = EQUIPMENT_TIERS.find(e => e.id === baseEquipment.id);
  if (!base) return 0;
  
  // Cost increases by 15% for each purchase
  return Math.floor(base.cost * Math.pow(1.15, currentCount));
}
