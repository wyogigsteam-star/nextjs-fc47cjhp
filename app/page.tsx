'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GamesHub() {
  const games = [
    {
      id: 'infinite-scholar',
      name: 'The Infinite Scholar',
      description: 'An educational math RPG adventure',
      icon: '🎓',
      color: 'from-purple-600 to-pink-600',
      href: '/games/infinite-scholar',
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      description: 'Classic two-player strategy game',
      icon: '❌',
      color: 'from-blue-600 to-cyan-600',
      href: '/games/tic-tac-toe',
    },
    {
      id: 'memory-match',
      name: 'Memory Match',
      description: 'Test your memory with card matching',
      icon: '🎴',
      color: 'from-green-600 to-emerald-600',
      href: '/games/memory-match',
    },
    {
      id: 'rock-paper-scissors',
      name: 'Rock Paper Scissors',
      description: 'Play against the computer',
      icon: '✊',
      color: 'from-orange-600 to-red-600',
      href: '/games/rock-paper-scissors',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎮 GAME HUB 🎮
          </h1>
          <p className="text-xl text-gray-400">
            Choose your adventure and have fun!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={game.href}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border-2 border-gray-700 bg-gradient-to-br ${game.color} p-1 hover:scale-105 transition-transform duration-300 cursor-pointer`}
                >
                  <div className="bg-gray-900 rounded-xl p-8 h-full">
                    <div className="text-6xl mb-4 text-center">{game.icon}</div>
                    <h2 className="text-2xl font-bold mb-2 text-center">
                      {game.name}
                    </h2>
                    <p className="text-gray-400 text-center">
                      {game.description}
                    </p>
                    <div className="mt-6 text-center">
                      <span className="inline-block px-6 py-2 bg-white text-black font-bold rounded-lg group-hover:bg-opacity-90 transition-all">
                        Play Now →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 text-gray-500"
        >
          <p>More games coming soon! 🚀</p>
        </motion.div>
      </div>
    </div>
  );
}
