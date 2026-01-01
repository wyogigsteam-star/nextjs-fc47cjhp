'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player>(null);

  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winningPlayer = calculateWinner(newBoard);
    if (winningPlayer) {
      setWinner(winningPlayer);
      setGameOver(true);
    } else if (!newBoard.includes(null)) {
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 text-white flex flex-col items-center justify-center p-4">
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
        <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          ❌ Tic-Tac-Toe ⭕
        </h1>
        <p className="text-xl text-gray-300">
          {gameOver
            ? winner
              ? `🎉 Player ${winner} Wins! 🎉`
              : "🤝 It's a Draw! 🤝"
            : `Current Player: ${isXNext ? 'X' : 'O'}`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {board.map((cell, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: cell ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(index)}
            className={`w-24 h-24 text-5xl font-bold rounded-xl border-4 transition-all ${
              cell === 'X'
                ? 'bg-blue-600 border-blue-400 text-white'
                : cell === 'O'
                ? 'bg-cyan-600 border-cyan-400 text-white'
                : 'bg-gray-800 border-gray-600 hover:border-gray-400 hover:bg-gray-700'
            }`}
            disabled={!!cell || gameOver}
          >
            {cell}
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetGame}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all"
      >
        🔄 New Game
      </motion.button>

      <div className="mt-8 text-center text-gray-400">
        <p>Classic two-player game</p>
        <p className="text-sm mt-2">Get three in a row to win!</p>
      </div>
    </div>
  );
}
