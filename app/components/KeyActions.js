'use client';
import React from 'react';
import { useGame } from '../context/GameContext';

export default function KeyActions({ onSkip, onRevive }) {
  const { gameState, useKey } = useGame();

  const handleSkip = () => {
    if (useKey(3)) {
      onSkip();
      alert('DATA SKIP successful. Advancing question.');
    } else {
      alert('INSUFFICIENT QUANTUM KEYS (Cost: 3)');
    }
  };

  const handleRevive = () => {
    if (gameState.playerHp > 0) {
      alert('SYSTEM RESTORE can only be used when HP is at zero.');
      return;
    }
    if (useKey(5)) {
      onRevive();
      alert('SYSTEM RESTORE successful. HP replenished!');
    } else {
      alert('INSUFFICIENT QUANTUM KEYS (Cost: 5)');
    }
  };

  return (
    <div className="flex justify-center gap-4 w-full">
      <button
        onClick={handleSkip}
        disabled={gameState.quantumKeys < 3}
        className="px-3 py-1 bg-gray-800 text-yellow-400 text-xs font-bold rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-30 transition-all uppercase tracking-wider"
      >
        Skip (3 Keys)
      </button>

      <button
        onClick={handleRevive}
        disabled={gameState.quantumKeys < 5 || gameState.playerHp > 0}
        className="px-3 py-1 bg-red-900/50 text-red-200 text-xs font-bold rounded border border-red-800 hover:bg-red-800 disabled:opacity-30 transition-all uppercase tracking-wider"
      >
        Restore (5 Keys)
      </button>
    </div>
  );
}
