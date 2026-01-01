'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const choices: { name: Choice; emoji: string; color: string }[] = [
    { name: 'rock', emoji: '✊', color: 'from-gray-600 to-gray-800' },
    { name: 'paper', emoji: '✋', color: 'from-blue-600 to-blue-800' },
    { name: 'scissors', emoji: '✌️', color: 'from-red-600 to-red-800' },
  ];

  const getComputerChoice = (): Choice => {
    const options: Choice[] = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPlayerChoice(choice);
    setResult(null);

    // Animate computer choice
    setTimeout(() => {
      const computer = getComputerChoice();
      setComputerChoice(computer);
      const gameResult = determineWinner(choice, computer);
      setResult(gameResult);

      setStats((prev) => ({
        ...prev,
        wins: gameResult === 'win' ? prev.wins + 1 : prev.wins,
        losses: gameResult === 'lose' ? prev.losses + 1 : prev.losses,
        draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws,
      }));

      setIsAnimating(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetStats = () => {
    setStats({ wins: 0, losses: 0, draws: 0 });
    resetGame();
  };

  const getResultMessage = () => {
    if (result === 'win') return '🎉 You Win! 🎉';
    if (result === 'lose') return '😢 You Lose! 😢';
    if (result === 'draw') return '🤝 Draw! 🤝';
    return 'Choose your weapon!';
  };

  const getChoiceEmoji = (choice: Choice | null) => {
    return choices.find((c) => c.name === choice)?.emoji || '❓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-black to-red-900 text-white flex flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        ← Back to Hub
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
          ✊ Rock Paper Scissors ✌️
        </h1>
        <p className="text-2xl text-gray-300 mb-4">{getResultMessage()}</p>
        <div className="flex gap-8 justify-center text-lg">
          <div className="text-green-400">
            Wins: <span className="font-bold">{stats.wins}</span>
          </div>
          <div className="text-red-400">
            Losses: <span className="font-bold">{stats.losses}</span>
          </div>
          <div className="text-yellow-400">
            Draws: <span className="font-bold">{stats.draws}</span>
          </div>
        </div>
      </motion.div>

      {(playerChoice || computerChoice) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-16 mb-8 items-center"
        >
          <div className="text-center">
            <p className="text-xl mb-2 text-blue-400 font-bold">You</p>
            <div className="text-8xl">{getChoiceEmoji(playerChoice)}</div>
          </div>
          <div className="text-4xl text-gray-500">VS</div>
          <div className="text-center">
            <p className="text-xl mb-2 text-red-400 font-bold">Computer</p>
            <motion.div
              animate={isAnimating ? { rotate: 360 } : {}}
              transition={{ duration: 0.5 }}
              className="text-8xl"
            >
              {getChoiceEmoji(computerChoice)}
            </motion.div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-6 mb-8"
      >
        {choices.map((choice) => (
          <motion.button
            key={choice.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(choice.name)}
            disabled={isAnimating}
            className={`w-32 h-32 text-6xl font-bold rounded-2xl bg-gradient-to-br ${choice.color} border-4 border-gray-600 hover:border-gray-400 transition-all disabled:opacity-50 shadow-xl`}
          >
            {choice.emoji}
          </motion.button>
        ))}
      </motion.div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-lg hover:from-orange-500 hover:to-red-500 transition-all"
        >
          🔄 Play Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetStats}
          className="px-6 py-3 bg-gray-700 text-white font-bold text-lg rounded-lg hover:bg-gray-600 transition-all"
        >
          🔃 Reset Stats
        </motion.button>
      </div>

      <div className="mt-8 text-center text-gray-400">
        <p>Rock beats Scissors</p>
        <p>Paper beats Rock</p>
        <p>Scissors beats Paper</p>
      </div>
    </div>
  );
}
