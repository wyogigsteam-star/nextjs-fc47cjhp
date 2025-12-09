'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  calculateRevenuePerSecond,
  checkAchievements,
  getEquipmentCost,
  EQUIPMENT_TIERS,
  WORKER_UPGRADES,
} from '../engines/PavingLogic';

const PavingGameContext = createContext();

const INITIAL_STATE = {
  money: 0,
  totalMoneyEarned: 0,
  equipment: [
    { id: 'shovel', count: 1 }, // Start with basic shovel
  ],
  workers: [
    { id: 'worker_1', owned: false },
    { id: 'worker_2', owned: false },
    { id: 'foreman', owned: false },
    { id: 'engineer', owned: false },
  ],
  achievements: [],
  currentJobType: 'pothole',
  lastSaveTime: Date.now(),
  totalPavingTime: 0, // In seconds
  hasSeenIntro: false,
};

export const PavingGameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastTickRef = useRef(Date.now());

  // Load game state
  useEffect(() => {
    const savedData = localStorage.getItem('asphalt-empire-save');
    if (savedData) {
      try {
        const loadedState = JSON.parse(savedData);
        
        // Calculate offline earnings
        const MAX_OFFLINE_EARNING_SECONDS = 3600; // 1 hour max
        const timeDiff = (Date.now() - loadedState.lastSaveTime) / 1000; // seconds
        const offlineRevenue = calculateRevenuePerSecond(
          loadedState.equipment || [],
          loadedState.workers || [],
          loadedState.achievements || []
        ) * Math.min(timeDiff, MAX_OFFLINE_EARNING_SECONDS);
        
        setGameState({
          ...INITIAL_STATE,
          ...loadedState,
          money: (loadedState.money || 0) + offlineRevenue,
          totalMoneyEarned: (loadedState.totalMoneyEarned || 0) + offlineRevenue,
          lastSaveTime: Date.now(),
        });
      } catch (e) {
        console.error('Save load error', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save game state
  useEffect(() => {
    if (isLoaded) {
      const saveData = {
        ...gameState,
        lastSaveTime: Date.now(),
      };
      localStorage.setItem('asphalt-empire-save', JSON.stringify(saveData));
    }
  }, [gameState, isLoaded]);

  // Game loop - idle revenue generation
  useEffect(() => {
    const UPDATE_INTERVAL_MS = 500; // Update twice per second for battery efficiency
    
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000; // seconds
      lastTickRef.current = now;

      const revenue = calculateRevenuePerSecond(
        gameState.equipment,
        gameState.workers,
        gameState.achievements
      );

      if (revenue > 0) {
        setGameState(prev => {
          const newMoney = prev.money + revenue * deltaTime;
          const newTotal = prev.totalMoneyEarned + revenue * deltaTime;
          
          // Check for new achievements
          const newAchievements = checkAchievements(
            { ...prev, money: newMoney, totalMoneyEarned: newTotal },
            prev.achievements
          );
          
          return {
            ...prev,
            money: newMoney,
            totalMoneyEarned: newTotal,
            totalPavingTime: prev.totalPavingTime + deltaTime,
            achievements: newAchievements.length > 0 
              ? [...prev.achievements, ...newAchievements]
              : prev.achievements,
          };
        });
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [gameState.equipment, gameState.workers, gameState.achievements]);

  // Actions
  const buyEquipment = (equipmentId) => {
    const existing = gameState.equipment.find(e => e.id === equipmentId);
    const currentCount = existing ? existing.count : 0;
    const cost = getEquipmentCost({ id: equipmentId }, currentCount);

    if (gameState.money >= cost) {
      setGameState(prev => {
        const newEquipment = existing
          ? prev.equipment.map(e => 
              e.id === equipmentId ? { ...e, count: e.count + 1 } : e
            )
          : [...prev.equipment, { id: equipmentId, count: 1 }];

        return {
          ...prev,
          money: prev.money - cost,
          equipment: newEquipment,
        };
      });
      return true;
    }
    return false;
  };

  const buyWorker = (workerId) => {
    const workerData = WORKER_UPGRADES.find(w => w.id === workerId);
    if (!workerData) return false;

    const worker = gameState.workers.find(w => w.id === workerId);
    if (worker && worker.owned) return false;

    if (gameState.money >= workerData.cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - workerData.cost,
        workers: prev.workers.map(w =>
          w.id === workerId ? { ...w, owned: true } : w
        ),
      }));
      return true;
    }
    return false;
  };

  const completeIntro = () => {
    setGameState(prev => ({ ...prev, hasSeenIntro: true }));
  };

  const resetGame = () => {
    if (confirm('Are you sure? This will reset ALL progress!')) {
      localStorage.removeItem('asphalt-empire-save');
      setGameState(INITIAL_STATE);
    }
  };

  const getRevenuePerSecond = () => {
    return calculateRevenuePerSecond(
      gameState.equipment,
      gameState.workers,
      gameState.achievements
    );
  };

  return (
    <PavingGameContext.Provider
      value={{
        gameState,
        buyEquipment,
        buyWorker,
        completeIntro,
        resetGame,
        getRevenuePerSecond,
      }}
    >
      {children}
    </PavingGameContext.Provider>
  );
};

export const usePavingGame = () => useContext(PavingGameContext);
