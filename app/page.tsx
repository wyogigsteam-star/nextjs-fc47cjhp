'use client';
import React, { useState } from 'react';
import { usePavingGame } from './context/PavingGameContext';
import {
  formatMoney,
  getEquipmentCost,
  EQUIPMENT_TIERS,
  WORKER_UPGRADES,
  JOB_TYPES,
} from './engines/PavingLogic';

// Intro Modal Component
const IntroModal = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full border-4 border-orange-500 bg-gray-900 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-black mb-4 text-orange-500 text-center uppercase tracking-wider">
          🚧 Asphalt Empire 🚧
        </h1>
        <div className="space-y-4 text-lg text-gray-300 mb-6">
          <p>
            Welcome to <span className="text-orange-400 font-bold">Asphalt Empire</span>!
          </p>
          <p>
            Build your paving business from the ground up. Start with a simple shovel
            and work your way to owning a massive paving operation.
          </p>
          <p className="text-yellow-400 font-semibold">
            💰 Earn money automatically while you're away!
          </p>
          <p className="text-sm text-gray-500">
            Tap equipment to buy more. Hire workers to boost your income!
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full py-4 bg-orange-600 text-white text-xl font-bold uppercase tracking-wider hover:bg-orange-500 transition-all rounded-lg shadow-lg"
        >
          Start Paving!
        </button>
      </div>
    </div>
  );
};

// Equipment Shop Component
const EquipmentShop = ({ onClose }: { onClose: () => void }) => {
  const { gameState, buyEquipment } = usePavingGame();

  const handleBuy = (equipmentId: string) => {
    if (buyEquipment(equipmentId)) {
      // Success feedback could be added here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border-4 border-orange-500 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-orange-500 uppercase">Equipment Shop</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4 text-center text-yellow-400 text-xl font-bold">
          Balance: {formatMoney(gameState.money)}
        </div>

        <div className="space-y-3">
          {EQUIPMENT_TIERS.map((equipment) => {
            const owned = gameState.equipment.find((e: any) => e.id === equipment.id);
            const count = owned ? owned.count : 0;
            const cost = getEquipmentCost(equipment, count);
            const canAfford = gameState.money >= cost;

            return (
              <div
                key={equipment.id}
                className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{equipment.icon}</span>
                      <div>
                        <h3 className="font-bold text-white text-lg">{equipment.name}</h3>
                        <p className="text-sm text-gray-400">{equipment.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm mt-2">
                      <span className="text-green-400">
                        +{formatMoney(equipment.revenuePerSecond)}/s
                      </span>
                      {count > 0 && (
                        <span className="text-blue-400">Owned: {count}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(equipment.id)}
                    disabled={!canAfford}
                    className={`px-6 py-3 font-bold rounded-lg transition-all ${
                      canAfford
                        ? 'bg-orange-600 hover:bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {formatMoney(cost)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Workers Shop Component
const WorkersShop = ({ onClose }: { onClose: () => void }) => {
  const { gameState, buyWorker } = usePavingGame();

  const handleBuy = (workerId: string) => {
    if (buyWorker(workerId)) {
      // Success feedback
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-4 border-blue-500 rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-400 uppercase">Hire Workers</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4 text-center text-yellow-400 text-xl font-bold">
          Balance: {formatMoney(gameState.money)}
        </div>

        <div className="space-y-3">
          {WORKER_UPGRADES.map((worker) => {
            const owned = gameState.workers.find((w: any) => w.id === worker.id)?.owned || false;
            const canAfford = gameState.money >= worker.cost;

            return (
              <div
                key={worker.id}
                className={`bg-gray-800 border-2 rounded-lg p-4 ${
                  owned ? 'border-green-500' : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{worker.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{worker.name}</h3>
                        <p className="text-sm text-gray-400">{worker.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-purple-400 mt-1">
                      Multiplier: ×{worker.multiplier}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(worker.id)}
                    disabled={owned || !canAfford}
                    className={`px-6 py-3 font-bold rounded-lg transition-all ${
                      owned
                        ? 'bg-green-700 text-white cursor-default'
                        : canAfford
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {owned ? 'HIRED' : formatMoney(worker.cost)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Stats Display Component
const StatsModal = ({ onClose }: { onClose: () => void }) => {
  const { gameState, resetGame } = usePavingGame();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-4 border-purple-500 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-400 uppercase">Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-lg">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Total Earned:</span>
            <span className="text-green-400 font-bold">
              {formatMoney(gameState.totalMoneyEarned)}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Equipment Owned:</span>
            <span className="text-blue-400 font-bold">
              {gameState.equipment.reduce((sum: number, e: any) => sum + e.count, 0)}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Workers Hired:</span>
            <span className="text-blue-400 font-bold">
              {gameState.workers.filter((w: any) => w.owned).length} / {gameState.workers.length}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Time Paving:</span>
            <span className="text-yellow-400 font-bold">
              {formatTime(gameState.totalPavingTime)}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Achievements:</span>
            <span className="text-purple-400 font-bold">
              {gameState.achievements.length}
            </span>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full mt-6 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};

// Main Game Component
export default function PavingGame() {
  const { gameState, completeIntro, getRevenuePerSecond } = usePavingGame();
  const [showEquipmentShop, setShowEquipmentShop] = useState(false);
  const [showWorkersShop, setShowWorkersShop] = useState(false);
  const [showStats, setShowStats] = useState(false);

  if (!gameState.hasSeenIntro) {
    return <IntroModal onComplete={completeIntro} />;
  }

  const revenuePerSecond = getRevenuePerSecond();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4 select-none">
      {/* Header */}
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6 pt-4">
          <h1 className="text-4xl md:text-5xl font-black text-orange-500 mb-2 uppercase tracking-wider drop-shadow-lg">
            🚧 Asphalt Empire 🚧
          </h1>
          <p className="text-gray-400 text-sm">Build Your Paving Business</p>
        </div>

        {/* Money Display */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 mb-6 shadow-2xl">
          <div className="text-center">
            <div className="text-sm text-yellow-200 mb-1">Current Balance</div>
            <div className="text-5xl font-black text-white mb-2">
              {formatMoney(gameState.money)}
            </div>
            <div className="text-xl text-yellow-200">
              +{formatMoney(revenuePerSecond)}/sec
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center border-2 border-gray-700">
            <div className="text-2xl mb-1">🚜</div>
            <div className="text-sm text-gray-400">Equipment</div>
            <div className="text-xl font-bold text-orange-400">
              {gameState.equipment.reduce((sum: number, e: any) => sum + e.count, 0)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border-2 border-gray-700">
            <div className="text-2xl mb-1">👷</div>
            <div className="text-sm text-gray-400">Workers</div>
            <div className="text-xl font-bold text-blue-400">
              {gameState.workers.filter((w: any) => w.owned).length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border-2 border-gray-700">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-gray-400">Achievements</div>
            <div className="text-xl font-bold text-purple-400">
              {gameState.achievements.length}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setShowEquipmentShop(true)}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white text-xl font-bold rounded-lg transition-all shadow-lg uppercase tracking-wider"
          >
            🚜 Buy Equipment
          </button>
          <button
            onClick={() => setShowWorkersShop(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-lg transition-all shadow-lg uppercase tracking-wider"
          >
            👷 Hire Workers
          </button>
          <button
            onClick={() => setShowStats(true)}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all uppercase tracking-wider"
          >
            📊 View Stats
          </button>
        </div>

        {/* Current Equipment Display */}
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
          <h3 className="text-lg font-bold text-orange-400 mb-3 uppercase">Your Equipment</h3>
          {gameState.equipment.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No equipment yet!</p>
          ) : (
            <div className="space-y-2">
              {gameState.equipment.map((eq: any) => {
                const equipmentData = EQUIPMENT_TIERS.find((e: any) => e.id === eq.id);
                if (!equipmentData) return null;
                return (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between bg-gray-900 rounded p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{equipmentData.icon}</span>
                      <div>
                        <div className="font-bold text-white">{equipmentData.name}</div>
                        <div className="text-xs text-gray-400">
                          +{formatMoney(equipmentData.revenuePerSecond * eq.count)}/s
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-400">×{eq.count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements Display */}
        {gameState.achievements.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-600 mt-4">
            <h3 className="text-lg font-bold text-purple-400 mb-3 uppercase">
              🏆 Achievements Unlocked
            </h3>
            <div className="flex flex-wrap gap-2">
              {gameState.achievements.map((ach: any) => (
                <div
                  key={ach.id}
                  className="bg-purple-900/50 border border-purple-500 rounded-lg px-3 py-2 text-center"
                >
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-xs text-purple-200">{ach.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showEquipmentShop && <EquipmentShop onClose={() => setShowEquipmentShop(false)} />}
      {showWorkersShop && <WorkersShop onClose={() => setShowWorkersShop(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </main>
  );
}
