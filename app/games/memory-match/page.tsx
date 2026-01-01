'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatch() {
  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].emoji === cards[second].emoji) {
        setCards((prev) =>
          prev.map((card, index) =>
            index === first || index === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedIndices([]);

        if (matches + 1 === emojis.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, index) =>
              index === first || index === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, matches, emojis.length]);

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices((prev) => [...prev, index]);

    if (flippedIndices.length === 1) {
      setMoves((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-emerald-900 text-white flex flex-col items-center justify-center p-4">
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
        <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
          🎴 Memory Match 🎴
        </h1>
        {gameWon ? (
          <p className="text-2xl text-yellow-400 font-bold">
            🎉 You Won in {moves} moves! 🎉
          </p>
        ) : (
          <div className="text-xl text-gray-300">
            <p>Moves: {moves} | Matches: {matches}/{emojis.length}</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-4 mb-8 max-w-md"
      >
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
            className={`w-20 h-20 text-4xl font-bold rounded-xl border-4 transition-all ${
              card.isMatched
                ? 'bg-green-600 border-green-400'
                : card.isFlipped
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-800 border-gray-600 hover:border-gray-400'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '❓'}
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={initializeGame}
        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all"
      >
        🔄 New Game
      </motion.button>

      <div className="mt-8 text-center text-gray-400">
        <p>Match all the pairs to win!</p>
        <p className="text-sm mt-2">Click cards to flip and find matching pairs</p>
      </div>
    </div>
  );
}
