'use client';
import React from 'react';
import { useGame } from '../context/GameContext';
import {
  PERMANENT_ITEMS,
  REFUND_RATE_PERCENT,
} from '../engines/PermanentRoster.js';

export default function PermanentShop({ onClose }) {
  const { gameState, buyPermanentGear } = useGame();

  const slots = ['weapon', 'armor', 'ring'];

  const handleBuy = (item) => {
    const success = buyPermanentGear(item);
    if (success) {
      const equippedItem = gameState.permanentGear[item.slot];
      const refund = equippedItem ? Math.floor(equippedItem.cost * 0.5) : 0;
      alert(
        `ITEM ACQUIRED: ${item.name} equipped! ${
          refund > 0 ? `(Refunded ${refund} G)` : ''
        }`
      );
    } else {
      alert('ERROR: INSUFFICIENT GOLD.');
    }
  };

  const getStatDisplay = (item, type) => {
    if (item && item[type]) {
      const value = item[type];
      if (type === 'crit_bonus') return `+${(value * 100).toFixed(1)}% CRIT`;
      if (type === 'attack_bonus') return `+${value} ATK`;
      if (type === 'hp_bonus' || type === 'shield_bonus')
        return `+${value} HP/SHIELD`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-cyber-dark border-4 border-red-500 p-8 rounded-lg shadow-neonPurple w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-red-500 mb-6 text-center tracking-widest">
          PERMANENT GEAR MARKET
        </h2>
        <div className="flex justify-between items-center text-xl text-yellow-400 mb-6 border-b border-gray-700 pb-2">
          <span>Available Gold: {gameState.gold} G</span>
          <span className="text-sm text-gray-500">
            Refund Rate: {REFUND_RATE_PERCENT}%
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {slots.map((slot) => (
            <div
              key={slot}
              className="col-span-1 border border-gray-700 rounded-lg p-3 bg-gray-900/70"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-3 uppercase border-b border-gray-600 pb-1">
                {slot} Slot
              </h3>

              {/* CURRENTLY EQUIPPED ITEM */}
              {gameState.permanentGear[slot] ? (
                <div className="bg-green-900/30 p-2 rounded mb-3 border border-green-600">
                  <p className="text-white text-sm font-bold">
                    {gameState.permanentGear[slot].icon} EQUIPPED:{' '}
                    {gameState.permanentGear[slot].name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Cost: {gameState.permanentGear[slot].cost} G | Refund:{' '}
                    {Math.floor(gameState.permanentGear[slot].cost * 0.5)} G
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">Slot Empty.</p>
              )}

              {/* AVAILABLE ITEMS FOR SLOT */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {PERMANENT_ITEMS.filter((item) => item.slot === slot).map(
                  (item) => {
                    const isEquipped =
                      gameState.permanentGear[slot]?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-2 rounded flex flex-col border transition-all ${
                          isEquipped
                            ? 'bg-green-500/10 border-green-500'
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        <p className="text-sm font-bold text-white">
                          {item.icon} {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mb-1">
                          {item.description}
                        </p>

                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-cyan-300 flex gap-2">
                            {getStatDisplay(item, 'attack_bonus') && (
                              <span>
                                {getStatDisplay(item, 'attack_bonus')}
                              </span>
                            )}
                            {getStatDisplay(item, 'hp_bonus') && (
                              <span>{getStatDisplay(item, 'hp_bonus')}</span>
                            )}
                            {getStatDisplay(item, 'crit_bonus') && (
                              <span>{getStatDisplay(item, 'crit_bonus')}</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleBuy(item)}
                            disabled={gameState.gold < item.cost || isEquipped}
                            className="px-3 py-1 bg-yellow-600 text-black text-xs font-bold rounded disabled:opacity-50"
                          >
                            {isEquipped ? 'EQUIPPED' : `BUY (${item.cost} G)`}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-500"
        >
          CLOSE SHOP
        </button>
      </div>
    </div>
  );
}
