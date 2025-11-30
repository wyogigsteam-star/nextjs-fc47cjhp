export const MONSTER_ROSTER = [
  { name: "Error 404 Sentinel", icon: "🤖" },
  { name: "Logic Glitch", icon: "🐛" },
  { name: "Data Kraken", icon: "🐙" },
  { name: "Syntax Hydra", icon: "🐍" },
  { name: "Spam Bot", icon: "📧" },
  { name: "Quantum Leech", icon: "🦠" },
  { name: "Firewall Hound", icon: "🐕" },
  { name: "Crypto Worm", icon: "💸" },
  { name: "The Null Byte", icon: "💀" },
  { name: "Rogue Compiler", icon: "🧠" },
  { name: "Binary Phantom", icon: "👻" },
  { name: "Memory Leak", icon: "💧" },
];

export const BOSS_ROSTER = [
  { name: "THE NULL KING", icon: "👑" },
  { name: "BINARY BEHEMOTH", icon: "🦾" },
  { name: "SYNTAX SERAPH", icon: "👼" },
  { name: "FATAL EXCEPTION", icon: "⛔" },
  { name: "THE ARCHITECT", icon: "👁️" },
];

export const getRandomMonster = () => {
  const index = Math.floor(Math.random() * MONSTER_ROSTER.length);
  return MONSTER_ROSTER[index];
};

export const getBossMonster = () => {
  const index = Math.floor(Math.random() * BOSS_ROSTER.length);
  return BOSS_ROSTER[index];
};