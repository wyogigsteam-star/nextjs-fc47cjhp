// --- ENEMY STATS ---
export const calculateEnemyStats = (floor, isBoss = false) => {
  const baseHP = 20;
  const scalingFactor = 1.15;
  let hp = Math.floor(baseHP * Math.pow(scalingFactor, floor));

  // BOSS SCALING: 5x Health
  if (isBoss) {
    hp = hp * 5;
  }

  return { maxHp: hp, currentHp: hp };
};

// --- QUESTION GENERATION (UNCHANGED) ---
export const generateMathQuestion = (grade) => {
  const gradeLevel = parseInt(grade) || 5;
  let num1, num2;
  let operator;
  let allowedOperators;

  if (gradeLevel <= 2) {
    allowedOperators = ['+', '-'];
    if (gradeLevel <= 1) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10);
    } else {
      num1 = Math.floor(Math.random() * 80) + 10;
      num2 = Math.floor(Math.random() * 50) + 5;
    }
    if (num1 < num2) [num1, num2] = [num2, num1];
  } else {
    allowedOperators = ['+', '-', '*', '/'];
    if (gradeLevel <= 5) {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
    } else if (gradeLevel <= 8) {
      num1 = Math.floor(Math.random() * 100) + 10;
      num2 = Math.floor(Math.random() * 20) + 2;
    } else {
      num1 = Math.floor(Math.random() * 500) + 50;
      num2 = Math.floor(Math.random() * 25) + 5;
    }
  }

  operator =
    allowedOperators[Math.floor(Math.random() * allowedOperators.length)];
  if (operator === '/') {
    num1 = num1 * num2;
  }

  let answer;
  try {
    answer = Math.round(eval(`${num1} ${operator} ${num2}`));
  } catch (e) {
    answer = 0;
  }

  const options = new Set([answer]);
  while (options.size < 4) {
    let fake =
      answer +
      (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
    options.add(fake);
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};
