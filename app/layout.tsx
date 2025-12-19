import './globals.css';
import React from 'react';
import { DocsGameProvider } from './context/DocsGameContext';

export const metadata = {
  title: 'Untitled Document - Google Docs',
  description: 'A productivity tool for students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-sans h-screen w-screen overflow-hidden">
        <DocsGameProvider>{children}</DocsGameProvider>
      </body>
    </html>
  );
}
