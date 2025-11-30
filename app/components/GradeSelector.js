'use client';
import React from 'react';
import { useGame } from '../context/GameContext';

export default function GradeSelector() {
  const { setGrade } = useGame();

  // Grades K (0) through 12 (12)
  const grades = [
    { label: 'K', value: 0 },
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

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-cyber-dark border-4 border-cyber-neonGreen p-8 rounded-lg shadow-neon w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-cyber-neonGreen mb-6 text-center tracking-widest">
          SYSTEM INITIATION: SELECT PROFILE
        </h2>
        <p className="text-center text-sm mb-8 text-gray-400">
          Select your current Grade Level (K-12) to calibrate the Math Engine
          difficulty.
        </p>

        <div className="grid grid-cols-4 gap-3">
          {grades.map((g) => (
            <button
              key={g.value}
              onClick={() => setGrade(g.value)}
              className="p-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold rounded transition-colors"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
