import './globals.css';
import React from 'react';
// FIX: Using explicit relative path to avoid alias failure (The Path Fix)
import { GameProvider } from './context/GameContext';

export const metadata = {
  title: 'The Infinite Scholar',
  description: 'An Educational RPG',
};

// FIX: Applying explicit type annotation to the children prop (The TypeScript Fix)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cyber-black text-cyber-text font-mono h-screen w-screen overflow-hidden selection:bg-cyber-neonGreen selection:text-black">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
