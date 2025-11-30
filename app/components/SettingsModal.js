'use client';
import React from 'react';
import { useGame } from '../context/GameContext';

export default function SettingsModal({
  onClose,
  onOpenPermanentShop,
  onOpenShop,
}) {
  const { gameState, setGrade } = useGame();

  const grades = [
    { label: 'Random', value: 0 },
    { label: '1st', value: 1 },
    { label: '2nd', value: 2 },
    { label: '3rd', value: 3 },
    { label: '4th', value: 4 },
    { label: '5th', value: 5 },
    { label: '6th', value: 6 },
    { label: '7th', value: 7 },
    { label: '8th', value: 8 },
    { label: '9th', value: 9 },
    { label: '10th', value: 10 },
    { label: '11th', value: 11 },
    { label: '12th', value: 12 },
  ];

  const handleGradeChange = (newGrade) => {
    setGrade(newGrade);
    onClose(); // Close menu after selecting
  };

  const openPermanentShop = () => {
    onClose();
    if (onOpenPermanentShop) onOpenPermanentShop();
  };

  const openUpgradeShop = () => {
    onClose();
    if (onOpenShop) onOpenShop();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-cyber-dark border-4 border-cyber-neonGreen p-8 rounded-lg shadow-neon w-full max-w-2xl relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-cyber-neonGreen mb-6 text-center tracking-widest">
          SYSTEM SETTINGS
        </h2>

        {/* SHOP ACCESS BUTTONS */}
        <div className="grid grid-cols-1 gap-3 mb-6 border-b border-gray-700 pb-6">
          <button
            onClick={openUpgradeShop}
            className="w-full py-3 bg-cyan-800/80 text-white font-bold rounded border border-cyan-600 hover:bg-cyan-700 transition-all"
          >
            ACCESS STAT UPGRADES (HP/ATK)
          </button>
          <button
            onClick={openPermanentShop}
            className="w-full py-3 bg-red-800/80 text-white font-bold rounded border border-red-600 hover:bg-red-700 transition-all shadow-neonPurple"
          >
            ACCESS PERMANENT GEAR SHOP
          </button>
        </div>

        <h3 className="text-xl text-cyber-text mb-4 text-center">
          SELECT GRADE LEVEL:
        </h3>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {grades.map((g) => (
            <button
              key={g.value}
              onClick={() => handleGradeChange(g.value)}
              className={`p-3 border text-sm font-bold rounded transition-colors ${
                gameState.grade === g.value
                  ? 'bg-cyber-neonGreen text-black shadow-neon scale-105'
                  : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 border border-gray-500"
        >
          CLOSE MENU
        </button>
      </div>
    </div>
  );
}
