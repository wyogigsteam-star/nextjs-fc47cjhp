'use client';
import React from 'react';
import { useGame } from '../context/GameContext';

export default function ShopModal({ onClose }) {
  const { gameState, upgradeStat } = useGame();

  // Base costs for upgrades
  const BASE_COSTS = {
    attackPower: 50,
    maxPlayerHp: 75,
    maxShield: 60,
    critChance: 100,
  };

  // Cost function: Base Cost + (Level * 5 Gold)
  const calculateCost = (statId) => {
    const level = gameState.upgradeLevels[statId] || 0;
    const base = BASE_COSTS[statId];
    return base + level * 5;
  };

  const upgrades = [
    {
      id: 'attackPower',
      name: 'Cyber Blade Upgrade (+5 ATK)',
      amount: 5,
      currentCost: calculateCost('attackPower'),
      currentLevel: gameState.upgradeLevels.attackPower,
      currentStat: gameState.attackPower,
      statName: 'Attack Power',
    },
    {
      id: 'maxPlayerHp',
      name: 'Vitality Boost (+25 MAX HP)',
      amount: 25,
      currentCost: calculateCost('maxPlayerHp'),
      currentLevel: gameState.upgradeLevels.maxPlayerHp,
      currentStat: gameState.maxPlayerHp,
      statName: 'Max Health',
    },
    {
      id: 'maxShield',
      name: 'Kinetic Barrier (+15 MAX Shield)',
      amount: 15,
      currentCost: calculateCost('maxShield'),
      currentLevel: gameState.upgradeLevels.maxShield,
      currentStat: gameState.maxShield,
      statName: 'Max Shield',
    },
    {
      id: 'critChance',
      name: 'Neural Synapse Amplifier (+0.5% Crit)',
      amount: 0.005,
      currentCost: calculateCost('critChance'),
      currentLevel: gameState.upgradeLevels.critChance,
      currentStat: (gameState.critChance * 100).toFixed(1) + '%',
      statName: 'Critical Hit Chance',
    },
  ];

  const handleBuy = (item) => {
    const success = upgradeStat(item.id, item.amount, item.currentCost);
    if (success) {
      alert(
        `UPGRADED! New Level: ${item.currentLevel + 1}. Cost will increase.`
      );
    } else {
      alert('ERROR: INSUFFICIENT GOLD.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-cyber-dark border-4 border-cyber-neonPurple p-8 rounded-lg shadow-neonPurple w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-cyber-neonPurple mb-6 text-center tracking-widest">
          THE UPGRADE MARKET (RUN-BASED)
        </h2>
        <div className="text-xl text-yellow-400 mb-6 text-center">
          Available Gold: {gameState.gold} G
        </div>

        <div className="grid grid-cols-2 gap-4">
          {upgrades.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-cyber-gray bg-cyber-black rounded flex flex-col justify-between"
            >
              <div>
                <p className="text-cyber-text font-bold">{item.name}</p>
                <p className="text-sm text-gray-400">
                  Level: {item.currentLevel} | Current Stat: {item.currentStat}
                </p>
              </div>
              <button
                onClick={() => handleBuy(item)}
                className="mt-3 py-2 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400 disabled:opacity-50"
                disabled={gameState.gold < item.currentCost}
              >
                Buy ({item.currentCost} G)
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-red-700 text-white font-bold rounded hover:bg-red-500"
        >
          EXIT
        </button>
      </div>
    </div>
  );
}
