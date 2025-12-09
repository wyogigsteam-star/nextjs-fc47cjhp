import './globals.css';
import React from 'react';
import { PavingGameProvider } from './context/PavingGameContext';

export const metadata = {
  title: 'Asphalt Empire - Idle Paving Game',
  description: 'Build your paving empire from the ground up!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white font-sans h-screen w-screen overflow-auto">
        <PavingGameProvider>{children}</PavingGameProvider>
      </body>
    </html>
  );
}
