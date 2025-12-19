'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  level: number;
  unlocked: boolean;
}

interface SecretFeature {
  id: string;
  menuName: string;
  name: string;
  description: string;
  unlockCost: number;
  unlocked: boolean;
  effect: string;
  multiplier?: number;
}

interface GameState {
  // Core resources
  words: number;
  wordsPerSecond: number;
  totalWordsTyped: number;
  
  // Upgrades
  upgrades: { [key: string]: Upgrade };
  
  // Secret features
  secretFeatures: { [key: string]: SecretFeature };
  
  // Document state
  documentTitle: string;
  documentContent: string;
  currentPrompt: string;
  promptsCompleted: number;
  
  // UI state
  selectedFont: string;
  fontSize: number;
  
  // Meta
  lastTick: number;
}

const INITIAL_UPGRADES: { [key: string]: Upgrade } = {
  autoTyper: {
    id: 'autoTyper',
    name: 'Auto-Type',
    description: 'Automatically types 1 word per second',
    baseCost: 10,
    costMultiplier: 1.15,
    effect: 1,
    level: 0,
    unlocked: true,
  },
  fasterTyping: {
    id: 'fasterTyping',
    name: 'Faster Typing',
    description: 'Each click generates 1 more word',
    baseCost: 25,
    costMultiplier: 1.2,
    effect: 1,
    level: 0,
    unlocked: true,
  },
  spellCheck: {
    id: 'spellCheck',
    name: 'Spell Check',
    description: 'Auto-types 5 words per second',
    baseCost: 100,
    costMultiplier: 1.25,
    effect: 5,
    level: 0,
    unlocked: true,
  },
  grammar: {
    id: 'grammar',
    name: 'Grammar Assistant',
    description: 'Auto-types 20 words per second',
    baseCost: 500,
    costMultiplier: 1.3,
    effect: 20,
    level: 0,
    unlocked: true,
  },
  thesaurus: {
    id: 'thesaurus',
    name: 'Thesaurus Pro',
    description: 'Auto-types 100 words per second',
    baseCost: 2500,
    costMultiplier: 1.35,
    effect: 100,
    level: 0,
    unlocked: true,
  },
};

const INITIAL_SECRETS: { [key: string]: SecretFeature } = {
  findReplace: {
    id: 'findReplace',
    menuName: 'Edit',
    name: 'Find & Replace',
    description: 'Doubles all word production',
    unlockCost: 50,
    unlocked: false,
    effect: 'multiplier',
    multiplier: 2,
  },
  wordCount: {
    id: 'wordCount',
    menuName: 'Tools',
    name: 'Word Count Stats',
    description: 'See detailed statistics (x1.5 multiplier)',
    unlockCost: 200,
    unlocked: false,
    effect: 'multiplier',
    multiplier: 1.5,
  },
  voiceTyping: {
    id: 'voiceTyping',
    menuName: 'Tools',
    name: 'Voice Typing',
    description: 'Auto-generate 50 words/sec',
    unlockCost: 1000,
    unlocked: false,
    effect: 'production',
    multiplier: 50,
  },
  darkMode: {
    id: 'darkMode',
    menuName: 'View',
    name: 'Dark Mode',
    description: 'Increases all production by 2x',
    unlockCost: 500,
    unlocked: false,
    effect: 'multiplier',
    multiplier: 2,
  },
  formatting: {
    id: 'formatting',
    menuName: 'Format',
    name: 'Advanced Formatting',
    description: 'Each word is worth 3x more',
    unlockCost: 800,
    unlocked: false,
    effect: 'multiplier',
    multiplier: 3,
  },
  export: {
    id: 'export',
    menuName: 'File',
    name: 'Export Feature',
    description: 'Gain bonus words equal to 10% of total',
    unlockCost: 1500,
    unlocked: false,
    effect: 'bonus',
  },
  pageSetup: {
    id: 'pageSetup',
    menuName: 'File',
    name: 'Page Setup Pro',
    description: 'x2 word multiplier',
    unlockCost: 3000,
    unlocked: false,
    effect: 'multiplier',
    multiplier: 2,
  },
};

const ESSAY_PROMPTS = [
  "Write an essay about your summer vacation...",
  "Describe the water cycle in detail...",
  "Write a report on the American Revolution...",
  "Explain how photosynthesis works...",
  "Write about your favorite book...",
  "Describe the solar system...",
  "Write a story about a hero...",
  "Explain the importance of recycling...",
];

const INITIAL_STATE: GameState = {
  words: 0,
  wordsPerSecond: 0,
  totalWordsTyped: 0,
  upgrades: INITIAL_UPGRADES,
  secretFeatures: INITIAL_SECRETS,
  documentTitle: 'Untitled Document',
  documentContent: '',
  currentPrompt: ESSAY_PROMPTS[0],
  promptsCompleted: 0,
  selectedFont: 'Arial',
  fontSize: 11,
  lastTick: Date.now(),
};

interface DocsGameContextType {
  gameState: GameState;
  typeWord: () => void;
  buyUpgrade: (upgradeId: string) => boolean;
  unlockSecret: (secretId: string) => boolean;
  calculateWordsPerSecond: () => number;
  getUpgradeCost: (upgradeId: string) => number;
  getTotalMultiplier: () => number;
  exportDocument: () => void;
  changeFont: (font: string) => void;
  updateDocumentContent: (content: string) => void;
}

const DocsGameContext = createContext<DocsGameContextType | undefined>(undefined);

export const DocsGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('docs-idle-game-save');
    if (saved) {
      try {
        const loadedState = JSON.parse(saved);
        setGameState({ ...INITIAL_STATE, ...loadedState, lastTick: Date.now() });
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('docs-idle-game-save', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  // Idle production tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const deltaTime = (now - prev.lastTick) / 1000;
        const wps = calculateWordsPerSecondInternal(prev);
        const wordsGained = wps * deltaTime;

        return {
          ...prev,
          words: prev.words + wordsGained,
          totalWordsTyped: prev.totalWordsTyped + wordsGained,
          wordsPerSecond: wps,
          lastTick: now,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const calculateWordsPerSecondInternal = (state: GameState): number => {
    let baseProduction = 0;

    // Calculate from upgrades
    Object.values(state.upgrades).forEach((upgrade) => {
      if (upgrade.level > 0) {
        baseProduction += upgrade.effect * upgrade.level;
      }
    });

    // Add voice typing if unlocked
    if (state.secretFeatures.voiceTyping?.unlocked) {
      baseProduction += state.secretFeatures.voiceTyping.multiplier || 0;
    }

    // Apply multipliers from secret features
    let multiplier = 1;
    Object.values(state.secretFeatures).forEach((secret) => {
      if (secret.unlocked && secret.effect === 'multiplier') {
        multiplier *= secret.multiplier || 1;
      }
    });

    return baseProduction * multiplier;
  };

  const calculateWordsPerSecond = useCallback(() => {
    return calculateWordsPerSecondInternal(gameState);
  }, [gameState]);

  const getTotalMultiplier = useCallback(() => {
    let multiplier = 1;
    Object.values(gameState.secretFeatures).forEach((secret) => {
      if (secret.unlocked && secret.effect === 'multiplier') {
        multiplier *= secret.multiplier || 1;
      }
    });
    return multiplier;
  }, [gameState]);

  const getUpgradeCost = useCallback((upgradeId: string) => {
    const upgrade = gameState.upgrades[upgradeId];
    if (!upgrade) return 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
  }, [gameState]);

  const typeWord = useCallback(() => {
    setGameState((prev) => {
      const clickPower = 1 + (prev.upgrades.fasterTyping?.level || 0);
      const multiplier = getTotalMultiplier();
      const wordsGained = clickPower * multiplier;

      return {
        ...prev,
        words: prev.words + wordsGained,
        totalWordsTyped: prev.totalWordsTyped + wordsGained,
      };
    });
  }, [getTotalMultiplier]);

  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = gameState.upgrades[upgradeId];
    if (!upgrade) return false;

    const cost = getUpgradeCost(upgradeId);
    if (gameState.words < cost) return false;

    setGameState((prev) => ({
      ...prev,
      words: prev.words - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeId]: {
          ...upgrade,
          level: upgrade.level + 1,
        },
      },
    }));

    return true;
  }, [gameState, getUpgradeCost]);

  const unlockSecret = useCallback((secretId: string) => {
    const secret = gameState.secretFeatures[secretId];
    if (!secret || secret.unlocked) return false;

    if (gameState.words < secret.unlockCost) return false;

    setGameState((prev) => ({
      ...prev,
      words: prev.words - secret.unlockCost,
      secretFeatures: {
        ...prev.secretFeatures,
        [secretId]: {
          ...secret,
          unlocked: true,
        },
      },
    }));

    return true;
  }, [gameState]);

  const exportDocument = useCallback(() => {
    if (!gameState.secretFeatures.export?.unlocked) return;

    const bonus = Math.floor(gameState.totalWordsTyped * 0.1);
    setGameState((prev) => ({
      ...prev,
      words: prev.words + bonus,
      totalWordsTyped: prev.totalWordsTyped + bonus,
    }));
  }, [gameState]);

  const changeFont = useCallback((font: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedFont: font,
    }));
  }, []);

  const updateDocumentContent = useCallback((content: string) => {
    setGameState((prev) => ({
      ...prev,
      documentContent: content,
    }));
  }, []);

  return (
    <DocsGameContext.Provider
      value={{
        gameState,
        typeWord,
        buyUpgrade,
        unlockSecret,
        calculateWordsPerSecond,
        getUpgradeCost,
        getTotalMultiplier,
        exportDocument,
        changeFont,
        updateDocumentContent,
      }}
    >
      {children}
    </DocsGameContext.Provider>
  );
};

export const useDocsGame = () => {
  const context = useContext(DocsGameContext);
  if (!context) {
    throw new Error('useDocsGame must be used within DocsGameProvider');
  }
  return context;
};
