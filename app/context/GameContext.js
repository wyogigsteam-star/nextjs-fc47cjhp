'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Hardcoded loot data to prevent import errors
const PERMANENT_LOOT_DATA = [
  { id: 'binary_heart', perm_bonus: { maxPlayerHp: 5 } },
  { id: 'zero_ring', perm_bonus: { critChance: 0.001 } },
  { id: 'crypto_key', perm_bonus: { attackPower: 1 } },
  { id: 'synth_eye', perm_bonus: { maxShield: 10 } },
];

const GameContext = createContext();

const INITIAL_STATE = {
  gold: 0,
  quantumKeys: 0,
  floor: 1,
  grade: null,
  currentShield: 25,
  maxShield: 25,
  playerHp: 100,
  maxPlayerHp: 100,
  attackPower: 10,
  critChance: 0.05,
  isHighStakes: false,
  upgradeLevels: {
    attackPower: 0,
    maxPlayerHp: 0,
    maxShield: 0,
    critChance: 0,
  },
  isGaming: false,
  hasSeenIntro: false,
  permanentGear: { weaponBonus: 0, armorBonus: 0, ringBonus: 0 },
  tempInventory: [],
  permanentAchievements: [],
  activeBuffs: [],
};

const getFullStats = (state) => {
  let bonus = { maxPlayerHp: 0, maxShield: 0, attackPower: 0, critChance: 0 };

  state.permanentAchievements.forEach((achieved) => {
    const item = PERMANENT_LOOT_DATA.find((i) => i.id === achieved.id);
    if (item) {
      bonus.maxPlayerHp += item.perm_bonus.maxPlayerHp || 0;
      bonus.maxShield += item.perm_bonus.maxShield || 0;
      bonus.attackPower += item.perm_bonus.attackPower || 0;
      bonus.critChance += item.perm_bonus.critChance || 0;
    }
  });

  const upgradeAttack = state.upgradeLevels.attackPower * 5;
  const upgradeMaxHp = state.upgradeLevels.maxPlayerHp * 25;
  const upgradeMaxShield = state.upgradeLevels.maxShield * 15;
  const upgradeCrit = state.upgradeLevels.critChance * 0.005;
  const permArmorBonus = state.permanentGear.armorBonus;

  return {
    attackPower:
      10 + state.permanentGear.weaponBonus + bonus.attackPower + upgradeAttack,
    maxPlayerHp: 100 + permArmorBonus + bonus.maxPlayerHp + upgradeMaxHp,
    maxShield: 25 + permArmorBonus + bonus.maxShield + upgradeMaxShield,
    critChance:
      0.05 + state.permanentGear.ringBonus + bonus.critChance + upgradeCrit,
  };
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem('infinite-scholar-save');
    if (savedData) {
      try {
        const loadedState = JSON.parse(savedData);
        const stats = getFullStats({ ...INITIAL_STATE, ...loadedState });
        setGameState((prev) => ({
          ...INITIAL_STATE,
          ...loadedState,
          ...stats,
          isGaming: false,
          tempInventory: [],
          currentShield:
            loadedState.currentShield !== undefined
              ? loadedState.currentShield
              : stats.maxShield,
          playerHp:
            loadedState.playerHp !== undefined
              ? loadedState.playerHp
              : stats.maxPlayerHp,
        }));
      } catch (e) {
        console.error('Save error', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded)
      localStorage.setItem('infinite-scholar-save', JSON.stringify(gameState));
  }, [gameState, isLoaded]);

  // --- CORE ACTIONS ---

  function startRun() {
    setGameState((prev) => ({
      ...prev,
      isGaming: true,
      floor: 1,
      playerHp: prev.maxPlayerHp,
      currentShield: prev.maxShield,
    }));
  }

  function returnToHub() {
    setGameState((prev) => ({ ...prev, isGaming: false }));
  }

  function takeDamage(amount) {
    setGameState((prev) => {
      let dmg = Number(amount);
      let shield = Number(prev.currentShield);
      let hp = Number(prev.playerHp);

      if (shield > 0) {
        const absorb = Math.min(shield, dmg);
        shield -= absorb;
        dmg -= absorb;
      }
      if (dmg > 0) hp -= dmg;
      return { ...prev, currentShield: shield, playerHp: hp };
    });
  }

  // --- UPGRADE STAT DEFINITION (THE FIX FOR LINE 142) ---
  function upgradeStat(stat, amt, cost) {
    if (gameState.gold >= cost) {
      setGameState((prev) => {
        const newLevels = {
          ...prev.upgradeLevels,
          [stat]: prev.upgradeLevels[stat] + 1,
        };
        const newStats = getFullStats({ ...prev, upgradeLevels: newLevels });
        return {
          ...prev,
          gold: prev.gold - cost,
          upgradeLevels: newLevels,
          ...newStats,
          currentShield: newStats.maxShield,
          playerHp: newStats.maxPlayerHp,
        };
      });
      return true;
    }
    return false;
  }

  // --- REST OF ACTIONS ---

  const setGrade = (g) => setGameState((p) => ({ ...p, grade: g }));
  const completeIntro = () =>
    setGameState((p) => ({ ...p, hasSeenIntro: true }));
  const updateResource = (t, a) =>
    setGameState((p) => ({ ...p, [t]: Math.max(0, p[t] + a) }));
  const advanceFloor = () =>
    setGameState((p) => ({ ...p, floor: p.floor + 1 }));
  const toggleStakes = () =>
    setGameState((p) => ({ ...p, isHighStakes: !p.isHighStakes }));
  const useKey = (c) => {
    if (gameState.quantumKeys >= c) {
      setGameState((p) => ({ ...p, quantumKeys: p.quantumKeys - c }));
      return true;
    }
    return false;
  };

  const addLoot = (lootItem) => {
    if (lootItem.permanent) {
      if (!gameState.permanentAchievements.some((i) => i.id === lootItem.id)) {
        setGameState((prev) => {
          const newAchievements = [...prev.permanentAchievements, lootItem];
          const newStats = getFullStats({
            ...prev,
            permanentAchievements: newAchievements,
          });
          return {
            ...prev,
            permanentAchievements: newAchievements,
            ...newStats,
          };
        });
        return 'PERMANENT';
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        tempInventory: [...prev.tempInventory, lootItem],
      }));
      return 'TEMPORARY';
    }
    return 'NONE';
  };

  const useItem = (itemId) => {
    const idx = gameState.tempInventory.findIndex((i) => i.id === itemId);
    if (idx === -1) return false;
    const item = gameState.tempInventory[idx];
    let update = {};
    if (item.type === 'heal')
      update = {
        playerHp: Math.min(gameState.maxPlayerHp, gameState.playerHp + 50),
        currentShield: Math.min(
          gameState.maxShield,
          gameState.currentShield + 50
        ),
      };
    if (item.type === 'shield_recharge')
      update = { currentShield: gameState.maxShield };
    if (item.type === 'buff')
      update = {
        activeBuffs: [
          ...gameState.activeBuffs,
          {
            id: item.id,
            name: item.name,
            icon: item.icon,
            duration: 3,
            effect: item.effect,
          },
        ],
      };
    setGameState((p) => ({
      ...p,
      ...update,
      tempInventory: p.tempInventory.filter((_, i) => i !== idx),
    }));
    return true;
  };

  const decrementBuffsAndApplyEffects = (atk) => {
    let bonus = 0;
    let newBuffs = [];
    (gameState.activeBuffs || []).forEach((buff) => {
      if (buff.duration > 1) {
        if (buff.effect === 'damage') bonus += 5;
        newBuffs.push({ ...buff, duration: buff.duration - 1 });
      }
    });
    if (newBuffs.length !== (gameState.activeBuffs || []).length || bonus > 0)
      setGameState((p) => ({ ...p, activeBuffs: newBuffs }));
    return (Number(atk) || 10) + bonus;
  };

  const buyPermanentGear = (item) => {
    if (gameState.gold >= item.cost) {
      setGameState((p) => {
        const newGear = { ...p.permanentGear, [item.slot]: item };
        const newStats = getFullStats({ ...p, permanentGear: newGear });
        return {
          ...p,
          gold: p.gold - item.cost,
          permanentGear: newGear,
          ...newStats,
          currentShield: newStats.maxShield,
          playerHp: newStats.maxPlayerHp,
        };
      });
      return true;
    }
    return false;
  };

  const triggerDeath = () => {
    setGameState((prev) => {
      const baseState = {
        ...prev,
        gold: 0,
        floor: 1,
        isGaming: false,
        tempInventory: [],
        activeBuffs: [],
        upgradeLevels: {
          attackPower: 0,
          maxPlayerHp: 0,
          maxShield: 0,
          critChance: 0,
        },
      };
      const stats = getFullStats(baseState);
      return {
        ...baseState,
        ...stats,
        playerHp: stats.maxPlayerHp,
        currentShield: stats.maxShield,
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateResource,
        advanceFloor,
        takeDamage,
        upgradeStat,
        toggleStakes,
        useKey,
        setGrade,
        startRun,
        returnToHub,
        buyPermanentGear,
        addLoot,
        useItem,
        decrementBuffsAndApplyEffects,
        completeIntro,
        triggerDeath,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
