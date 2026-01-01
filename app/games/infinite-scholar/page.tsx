'use client';
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  generateMathQuestion,
  calculateEnemyStats,
} from '../../engines/MathLogic.js';
import { getRandomMonster } from '../../engines/MonsterRoster.js';
import { generateLoot } from '../../engines/LootSystem.js';
import {
  sfxButton,
  sfxAttack,
  sfxDamage,
  sfxWin,
  sfxCrit,
  sfxBuy,
} from '../../engines/SoundLogic.js';

// ==========================================
// 1. INTERNAL DATA (To prevent import errors)
// ==========================================
const PERMANENT_ITEMS = [
  {
    id: 'W01',
    slot: 'weapon',
    name: 'Neural Injector',
    icon: '💉',
    cost: 200,
    attack_bonus: 5,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0,
    description: '+5 Permanent ATK.',
  },
  {
    id: 'W02',
    slot: 'weapon',
    name: 'Quantum Blade',
    icon: '⚔️',
    cost: 500,
    attack_bonus: 12,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0,
    description: '+12 Permanent ATK.',
  },
  {
    id: 'A01',
    slot: 'armor',
    name: 'Kevlar Vest',
    icon: '🛡️',
    cost: 150,
    attack_bonus: 0,
    hp_bonus: 15,
    shield_bonus: 15,
    crit_bonus: 0,
    description: '+15 Max HP/Shield.',
  },
  {
    id: 'A02',
    slot: 'armor',
    name: 'Titanium Shell',
    icon: '🪖',
    cost: 400,
    attack_bonus: 0,
    hp_bonus: 30,
    shield_bonus: 30,
    crit_bonus: 0,
    description: '+30 Max HP/Shield.',
  },
  {
    id: 'R01',
    slot: 'ring',
    name: 'Zero Ring',
    icon: '⭕',
    cost: 100,
    attack_bonus: 0,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0.005,
    description: '+0.5% Permanent Crit.',
  },
  {
    id: 'R02',
    slot: 'ring',
    name: 'Data Compass',
    icon: '🧭',
    cost: 300,
    attack_bonus: 0,
    hp_bonus: 0,
    shield_bonus: 0,
    crit_bonus: 0.015,
    description: '+1.5% Permanent Crit.',
  },
];

// ==========================================
// 2. INTERNAL COMPONENT DEFINITIONS
// ==========================================

const ShopModal = ({ onClose }: { onClose: () => void }) => {
  const { gameState, upgradeStat } = useGame();
  const BASE_COSTS = {
    attackPower: 50,
    maxPlayerHp: 75,
    maxShield: 60,
    critChance: 100,
  };
  const calculateCost = (statId: keyof typeof BASE_COSTS) => {
    const level = gameState.upgradeLevels[statId] || 0;
    return BASE_COSTS[statId] + level * 5;
  };

  const upgrades = [
    {
      id: 'attackPower',
      name: 'Cyber Blade Upgrade (+5 ATK)',
      amount: 5,
      currentCost: calculateCost('attackPower'),
      currentLevel: gameState.upgradeLevels.attackPower,
      currentStat: gameState.attackPower,
    },
    {
      id: 'maxPlayerHp',
      name: 'Vitality Boost (+25 MAX HP)',
      amount: 25,
      currentCost: calculateCost('maxPlayerHp'),
      currentLevel: gameState.upgradeLevels.maxPlayerHp,
      currentStat: gameState.maxPlayerHp,
    },
    {
      id: 'maxShield',
      name: 'Kinetic Barrier (+15 MAX Shield)',
      amount: 15,
      currentCost: calculateCost('maxShield'),
      currentLevel: gameState.upgradeLevels.maxShield,
      currentStat: gameState.maxShield,
    },
    {
      id: 'critChance',
      name: 'Neural Synapse (+0.5% Crit)',
      amount: 0.005,
      currentCost: calculateCost('critChance'),
      currentLevel: gameState.upgradeLevels.critChance,
      currentStat: (gameState.critChance * 100).toFixed(1) + '%',
    },
  ];

  const handleBuy = (item: any) => {
    if (upgradeStat(item.id, item.amount, item.currentCost)) alert(`UPGRADED!`);
    else alert('ERROR: INSUFFICIENT GOLD.');
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
          THE UPGRADE MARKET
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
                  Lvl: {item.currentLevel} | Cur: {item.currentStat}
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
};

const PermanentShop = ({ onClose }: { onClose: () => void }) => {
  const { gameState, buyPermanentGear } = useGame();
  const slots = ['weapon', 'armor', 'ring'];
  const handleBuy = (item: any) => {
    if (buyPermanentGear(item)) alert(`ITEM ACQUIRED: ${item.name}`);
    else alert('ERROR: INSUFFICIENT GOLD.');
  };
  const getStatDisplay = (item: any, type: string) => {
    if (item && item[type])
      return `+${
        type === 'crit_bonus' ? (item[type] * 100).toFixed(1) + '%' : item[type]
      }`;
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
          <span>Gold: {gameState.gold} G</span>
          <span className="text-sm text-gray-500">Refund: 50%</span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot}
              className="border border-gray-700 rounded-lg p-3 bg-gray-900/70"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-3 uppercase border-b border-gray-600 pb-1">
                {slot} Slot
              </h3>
              {gameState.permanentGear[slot] ? (
                <div className="bg-green-900/30 p-2 rounded mb-3 border border-green-600">
                  <p className="text-white text-sm font-bold">
                    {gameState.permanentGear[slot].icon}{' '}
                    {gameState.permanentGear[slot].name}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">Slot Empty.</p>
              )}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {PERMANENT_ITEMS.filter((item) => item.slot === slot).map(
                  (item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded flex flex-col border bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                      <p className="text-sm font-bold text-white">
                        {item.icon} {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-1">
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={
                          gameState.gold < item.cost ||
                          gameState.permanentGear[slot]?.id === item.id
                        }
                        className="px-3 py-1 bg-yellow-600 text-black text-xs font-bold rounded disabled:opacity-50"
                      >
                        {gameState.permanentGear[slot]?.id === item.id
                          ? 'EQUIPPED'
                          : `BUY (${item.cost} G)`}
                      </button>
                    </div>
                  )
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
};

const KeyActions = ({ onSkip, onRevive }: { onSkip: () => void; onRevive: () => void }) => {
  const { gameState, useKey } = useGame();
  const handleSkip = () => {
    if (useKey(3)) {
      onSkip();
      alert('SKIPPED');
    } else {
      alert('NEED 3 KEYS');
    }
  };
  const handleRevive = () => {
    if (gameState.playerHp > 0) {
      alert('HP MUST BE 0');
      return;
    }
    if (useKey(5)) {
      onRevive();
      alert('RESTORED');
    } else {
      alert('NEED 5 KEYS');
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
};

const IntroModal = ({ onComplete }: { onComplete: () => void }) => {
  const handleStart = () => {
    sfxBuy();
    onComplete();
  };
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full border-2 border-green-500 bg-black p-8 font-mono text-green-500 shadow-[0_0_20px_#00ff41]">
        <h1 className="text-3xl font-black mb-6 tracking-widest border-b border-green-500 pb-2 animate-pulse">
          SYSTEM BOOT...
        </h1>
        <div className="space-y-6 text-lg leading-relaxed mb-8">
          <p>
            <span className="text-white"> &gt; CONNECTING...</span>{' '}
            <span className="text-green-500 font-bold"> SUCCESS.</span>
          </p>
          <p>
            The <span className="text-white font-bold">Infinite Archive</span>{' '}
            has fallen. You are the{' '}
            <span className="text-purple-400 font-bold">SCHOLAR PROTOCOL</span>.
          </p>
          <p className="text-red-500 font-bold">
            WARNING: Permanent death is imminent.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="w-full py-4 bg-green-900 text-white text-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-all border border-green-500"
        >
          INITIALIZE
        </button>
      </div>
    </div>
  );
};

const SettingsModal = ({ onClose, onOpenPermanentShop, onOpenShop }: { onClose: () => void; onOpenPermanentShop?: () => void; onOpenShop?: () => void }) => {
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
  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8">
      <div className="bg-cyber-dark border-4 border-cyber-neonGreen p-8 rounded-lg shadow-neon w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white font-bold text-xl"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-cyber-neonGreen mb-4 text-center tracking-widest">
          SYSTEM SETTINGS
        </h2>
        <div className="space-y-3 mb-6 border border-gray-700 p-4 rounded">
          <button
            onClick={() => {
              onClose();
              if (onOpenShop) onOpenShop();
            }}
            className="w-full py-3 bg-cyan-700/80 text-white font-black rounded border border-cyan-500 hover:bg-cyan-600 transition-all"
          >
            ACCESS STAT UPGRADES
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenPermanentShop) onOpenPermanentShop();
            }}
            className="w-full py-3 bg-red-800/80 text-white font-black rounded border border-red-600 hover:bg-red-700 transition-all shadow-neonPurple"
          >
            ACCESS PERMANENT GEAR SHOP
          </button>
        </div>
        <h3 className="text-xl text-cyber-text mb-4">Select Difficulty:</h3>
        <div className="grid grid-cols-4 gap-3 border p-4 rounded border-cyber-gray">
          {grades.map((g) => (
            <button
              key={g.value}
              onClick={() => handleGradeChange(g.value)}
              className={`p-3 border text-sm font-bold rounded transition-colors ${
                gameState.grade === g.value
                  ? 'bg-cyber-neonGreen !text-white shadow-neon'
                  : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-red-700 text-white font-bold rounded hover:bg-red-500"
        >
          RETURN TO BATTLE
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT (MasterGame)
// ==========================================

export default function MasterGame() {
  const {
    gameState,
    updateResource,
    advanceFloor,
    takeDamage,
    toggleStakes,
    addLoot,
    useItem,
    decrementBuffsAndApplyEffects,
    startRun,
    returnToHub,
    completeIntro,
  } = useGame();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPermanentShopOpen, setIsPermanentShopOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState('');

  const [enemy, setEnemy] = useState({
    maxHp: 20,
    currentHp: 20,
    name: 'Enemy',
    icon: '❓',
    isBoss: false,
  });
  const [question, setQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState('');

  // --- HUB LOGIC ---
  const isReady = gameState.grade !== null;
  const handleStartAttempt = () => {
    if (!isReady) {
      alert('PLEASE SELECT A GRADE LEVEL FIRST.');
      return;
    }
    sfxBuy();
    startRun();
  };

  // --- BATTLE LOGIC ---
  useEffect(() => {
    if (gameState.isGaming && gameState.grade !== null) {
      const isBossFloor = gameState.floor % 10 === 0;
      const stats = calculateEnemyStats(gameState.floor, isBossFloor);
      const baseMonster = getRandomMonster();
      const monster = isBossFloor
        ? { name: 'THE ARCHITECT', icon: '👁️' }
        : baseMonster;
      setEnemy({ ...stats, ...monster, isBoss: isBossFloor });
      nextQuestion();
    }
  }, [gameState.floor, gameState.grade, gameState.isGaming]);

  const nextQuestion = () => {
    setQuestion(generateMathQuestion(gameState.grade));
    setFeedback('');
  };
  const handleReviveAction = () => {
    takeDamage(-gameState.maxPlayerHp);
    setFeedback('RESTORED.');
    sfxBuy();
  };
  const handleDeath = () => {
    sfxDamage();
    alert('RUN ENDED.');
    returnToHub();
  };

  const handleAnswer = (selectedOption: number) => {
    sfxButton();
    if (!question || gameState.playerHp <= 0) return;
    const isCorrect = Number(selectedOption) === Number(question.answer);
    const finalAttackPower = decrementBuffsAndApplyEffects(
      gameState.attackPower
    );
    const isCrit = Math.random() < gameState.critChance;
    const damageMultiplier = isCrit ? 2 : 1;
    const damageDealt = finalAttackPower * damageMultiplier;

    if (isCorrect) {
      if (isCrit) {
        sfxCrit();
        setFeedback('CRIT! x2 DMG');
      } else {
        sfxAttack();
        setFeedback('HIT!');
      }
      const newEnemyHp = enemy.currentHp - damageDealt;
      setEnemy((prev) => ({ ...prev, currentHp: newEnemyHp }));
      if (gameState.isHighStakes) updateResource('quantumKeys', 1);
      else updateResource('gold', 10);
      if (newEnemyHp <= 0) {
        sfxWin();
        setFeedback(enemy.isBoss ? 'BOSS DEFEATED!' : 'FLOOR CLEARED.');
        handleLootDrop(enemy.isBoss);
        setTimeout(() => advanceFloor(), 100);
      } else {
        setTimeout(nextQuestion, 100);
      }
    } else {
      sfxDamage();
      if (gameState.isHighStakes) {
        setFeedback('FATAL ERROR');
        setTimeout(handleDeath, 500);
      } else {
        setFeedback(
          gameState.currentShield > 0 ? 'SHIELD HIT! (-1G)' : 'HP HIT! (-1G)'
        );
        updateResource('gold', -1);
        takeDamage(10);
        setTimeout(nextQuestion, 100);
      }
    }
  };

  const handleLootDrop = (isBoss: boolean) => {
    const loot = generateLoot(isBoss);
    if (loot) {
      const result = addLoot(loot);
      if (result === 'PERMANENT') setFeedback(`RARE DROP: ${loot.name}!`);
      else if (result === 'TEMPORARY') setFeedback(`DROP: ${loot.name}`);
    }
  };
  const handleUseItem = (itemId: string) => {
    if (useItem(itemId)) {
      sfxBuy();
      setFeedback('USED ITEM');
    }
  };

  // --- RENDER HUB ---
  if (!gameState.hasSeenIntro) return <IntroModal onComplete={completeIntro} />;

  if (!gameState.isGaming) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-cyber-dark text-cyber-text p-8 relative overflow-hidden font-mono">
        <h1 className="text-6xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10 text-center">
          THE INFINITE
          <br />
          SCHOLAR
        </h1>
        <div className="flex gap-8 text-xl border border-cyber-gray p-6 rounded bg-cyber-black shadow-neonPurple/30 z-10">
          <span className="text-yellow-400">GOLD: {gameState.gold}</span>
          <span className="text-red-500">KEYS: {gameState.quantumKeys}</span>
          <span className="text-cyan-400">ATK: {gameState.attackPower}</span>
        </div>
        <div className="space-y-4 w-96 z-10">
          <button
            onClick={handleStartAttempt}
            className={`w-full py-4 text-2xl font-black rounded transition-all shadow-neon border-2 border-transparent ${
              isReady
                ? 'bg-white text-cyber-neonPurple hover:scale-[1.02]'
                : 'bg-gray-800 text-gray-500 border-gray-700'
            }`}
          >
            ENTER THE TOWER
          </button>
          <button
            onClick={() => setIsPermanentShopOpen(true)}
            className="w-full py-3 bg-red-800/80 text-white font-bold rounded border border-red-600 hover:bg-red-700 transition-all"
          >
            PERMANENT GEAR SHOP
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full py-3 bg-gray-600 text-white font-bold rounded border border-gray-600 hover:bg-gray-500 transition-all"
          >
            SYSTEM SETTINGS / GRADE
          </button>
        </div>
        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            onOpenPermanentShop={() => setIsPermanentShopOpen(true)}
            onOpenShop={() => {}}
          />
        )}
        {isPermanentShopOpen && (
          <PermanentShop onClose={() => setIsPermanentShopOpen(false)} />
        )}
      </div>
    );
  }

  // --- RENDER BATTLE ---
  if (gameState.grade === null)
    return (
      <SettingsModal
        onClose={() => {}}
        onOpenPermanentShop={() => setIsPermanentShopOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />
    );
  if (gameState.playerHp <= 0)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold text-3xl">
        FATAL ERROR{' '}
        <button
          onClick={handleDeath}
          className="ml-4 bg-gray-800 p-2 text-white text-sm"
        >
          RESET
        </button>
      </div>
    );
  if (!question)
    return <div className="text-white p-10 h-screen bg-black">Loading...</div>;

  return (
    <main className="flex h-screen flex-col items-center p-4 bg-cyber-black overflow-hidden font-mono select-none">
      <div className="w-full max-w-3xl flex justify-between items-end mb-4 border-b border-cyber-gray pb-2">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-neonGreen to-cyber-neonPurple tracking-widest">
          THE INFINITE SCHOLAR
        </h1>
        <button
          onClick={() => {
            sfxButton();
            setIsSettingsOpen(true);
          }}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          [ SYSTEM MENU ]
        </button>
      </div>
      <div className="flex flex-col w-full max-w-3xl flex-1 border border-cyber-gray bg-cyber-dark/80 shadow-neon rounded-xl p-4 gap-4 relative">
        <div className="flex justify-between items-center text-xs font-bold tracking-widest text-gray-400">
          <div className="flex gap-4">
            <span className="text-cyber-neonPurple">FLR {gameState.floor}</span>
            <span className="text-white">ATK {gameState.attackPower}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-yellow-400">G: {gameState.gold}</span>
            <span className="text-red-500">KEYS: {gameState.quantumKeys}</span>
          </div>
        </div>

        <div className="w-full flex gap-2 h-4">
          <div className="flex-1 bg-gray-900 rounded border border-cyan-900 relative">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{
                width: `${Math.max(
                  0,
                  (gameState.currentShield / gameState.maxShield) * 100
                )}%`,
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
              SHIELD
            </span>
          </div>
          <div className="flex-1 bg-gray-900 rounded border border-red-900 relative">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{
                width: `${Math.max(
                  0,
                  (gameState.playerHp / gameState.maxPlayerHp) * 100
                )}%`,
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
              HP
            </span>
          </div>
        </div>

        {/* INVENTORY */}
        {(gameState.activeBuffs.length > 0 ||
          gameState.permanentAchievements.length > 0) && (
          <div className="flex gap-4 justify-center h-8">
            {gameState.activeBuffs.map((b: any, i: number) => (
              <span
                key={i}
                className="text-lg animate-pulse cursor-help"
                onMouseEnter={() => setHoverInfo(`BUFF: ${b.name}`)}
                onMouseLeave={() => setHoverInfo('')}
              >
                {b.icon}
              </span>
            ))}
            {gameState.permanentAchievements.map((i: any) => (
              <span
                key={i.id}
                className="text-lg cursor-help text-yellow-400"
                onMouseEnter={() =>
                  setHoverInfo(`PERM: ${i.name} - ${i.description}`)
                }
                onMouseLeave={() => setHoverInfo('')}
              >
                {i.icon}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[150px]">
          <div
            className={`text-6xl mb-4 filter ${
              enemy.isBoss
                ? 'drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] scale-125'
                : 'drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]'
            } animate-pulse`}
          >
            {enemy.icon}
          </div>
          <h3
            className={`text-sm font-bold tracking-widest mb-2 ${
              enemy.isBoss ? 'text-yellow-400 text-lg' : 'text-cyber-neonRed'
            }`}
          >
            {enemy.isBoss ? `⚠️ ${enemy.name} ⚠️` : enemy.name}
          </h3>
          <div className="w-32 h-1 bg-gray-800 rounded">
            <div
              className="h-full bg-red-600 transition-all"
              style={{
                width: `${Math.max(0, (enemy.currentHp / enemy.maxHp) * 100)}%`,
              }}
            />
          </div>
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h2 className="text-3xl font-black text-white bg-black/80 px-6 py-2 border-y-2 border-white tracking-widest shadow-xl backdrop-blur-sm animate-bounce">
                {feedback}
              </h2>
            </div>
          )}
        </div>

        <div className="w-full text-center h-6">
          <p className="text-xs font-mono text-cyan-500 tracking-widest uppercase">
            {hoverInfo}
          </p>
        </div>

        <div className="flex justify-between items-center h-10 px-2 bg-gray-900/50 rounded border border-gray-800">
          <KeyActions onSkip={nextQuestion} onRevive={handleReviveAction} />
          <div className="flex gap-2">
            {gameState.tempInventory.map((item: any, i: number) => (
              <button
                key={i}
                onClick={() => handleUseItem(item.id)}
                onMouseEnter={() =>
                  setHoverInfo(`ITEM: ${item.name} - ${item.description}`)
                }
                onMouseLeave={() => setHoverInfo('')}
                className="bg-gray-800 text-white w-8 h-8 rounded border border-cyan-700 hover:bg-cyan-700 flex items-center justify-center text-sm transition-colors"
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-center w-full">
            <button
              onClick={() => {
                sfxButton();
                toggleStakes();
              }}
              className={`py-2 px-6 text-sm font-bold rounded border transition-colors flex items-center justify-center w-full max-w-sm ${
                gameState.isHighStakes
                  ? 'border-red-600 text-red-500 bg-red-900/20'
                  : 'border-gray-600 text-gray-400 bg-gray-900'
              }`}
            >
              {gameState.isHighStakes
                ? '⚠️ HIGH STAKES ACTIVE'
                : 'STANDARD MODE ACTIVATED'}
            </button>
          </div>
          <div className="flex justify-center w-full">
            <button
              onClick={() => {
                sfxButton();
                setIsPermanentShopOpen(true);
              }}
              className="py-2 bg-red-800/80 text-white font-bold text-xs uppercase rounded hover:bg-red-700 transition-colors flex items-center justify-center w-full max-w-sm"
            >
              PERMANENT GEAR
            </button>
          </div>
          <div className="flex justify-center w-full">
            <button
              onClick={() => {
                sfxButton();
                setIsShopOpen(true);
              }}
              className="py-2 bg-cyan-700/80 text-white font-bold text-xs uppercase rounded hover:bg-cyan-600 transition-colors flex items-center justify-center w-full max-w-sm"
            >
              STATS UPGRADES
            </button>
          </div>

          <div className="bg-black border-t-2 border-cyber-neonGreen p-4 rounded-b-lg">
            <h2 className="text-xl text-center mb-4 font-mono text-white tracking-wider">
              {question.question}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt: number, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-3 bg-gray-900 border border-cyber-neonGreen text-cyber-neonGreen hover:bg-cyber-neonGreen hover:text-black font-bold text-lg rounded transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onOpenPermanentShop={() => setIsPermanentShopOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
        />
      )}
      {isPermanentShopOpen && (
        <PermanentShop onClose={() => setIsPermanentShopOpen(false)} />
      )}
    </main>
  );
}
