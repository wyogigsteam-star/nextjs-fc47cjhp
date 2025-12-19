'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDocsGame } from './context/DocsGameContext';

export default function GoogleDocsIdleGame() {
  const {
    gameState,
    typeWord,
    buyUpgrade,
    unlockSecret,
    getUpgradeCost,
    getTotalMultiplier,
    exportDocument,
    changeFont,
    updateDocumentContent,
  } = useDocsGame();

  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showSecretMenu, setShowSecretMenu] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num).toString();
  };

  // Handle typing in the document
  const handleTyping = () => {
    typeWord();
  };

  // Get secrets for a specific menu
  const getSecretsForMenu = (menuName: string) => {
    return Object.values(gameState.secretFeatures).filter(
      (secret) => secret.menuName === menuName
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans">
      {/* Google Docs Header */}
      <div className="bg-[#f1f3f4] border-b border-gray-300">
        {/* Top Bar with Logo and Title */}
        <div className="flex items-center px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                D
              </div>
              <input
                type="text"
                value={gameState.documentTitle}
                onChange={(e) => {}}
                className="text-lg border-none bg-transparent outline-none"
                placeholder="Untitled Document"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Words: {formatNumber(gameState.words)}</span>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex items-center px-4 text-sm">
          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">File</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              <button
                onClick={() => setShowUpgradeMenu(true)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📄 New Assignment
              </button>
              {getSecretsForMenu('File').map((secret) => (
                <button
                  key={secret.id}
                  onClick={() => {
                    if (secret.unlocked) {
                      if (secret.id === 'export') exportDocument();
                    } else {
                      setShowSecretMenu(secret.id);
                    }
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    secret.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`}
                  disabled={!secret.unlocked && gameState.words < secret.unlockCost}
                >
                  {secret.unlocked ? '✓ ' : '🔒 '}{secret.name}
                  {!secret.unlocked && ` (${formatNumber(secret.unlockCost)} words)`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Edit</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              {getSecretsForMenu('Edit').map((secret) => (
                <button
                  key={secret.id}
                  onClick={() => {
                    if (!secret.unlocked) setShowSecretMenu(secret.id);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    secret.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`}
                  disabled={!secret.unlocked && gameState.words < secret.unlockCost}
                >
                  {secret.unlocked ? '✓ ' : '🔒 '}{secret.name}
                  {!secret.unlocked && ` (${formatNumber(secret.unlockCost)} words)`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">View</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              {getSecretsForMenu('View').map((secret) => (
                <button
                  key={secret.id}
                  onClick={() => {
                    if (!secret.unlocked) setShowSecretMenu(secret.id);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    secret.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`}
                  disabled={!secret.unlocked && gameState.words < secret.unlockCost}
                >
                  {secret.unlocked ? '✓ ' : '🔒 '}{secret.name}
                  {!secret.unlocked && ` (${formatNumber(secret.unlockCost)} words)`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Insert</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              <button className="w-full text-left px-4 py-2 text-gray-400">
                🔒 Coming Soon
              </button>
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Format</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              <select
                value={gameState.selectedFont}
                onChange={(e) => changeFont(e.target.value)}
                className="w-full px-4 py-2 border-b hover:bg-gray-100"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
              {getSecretsForMenu('Format').map((secret) => (
                <button
                  key={secret.id}
                  onClick={() => {
                    if (!secret.unlocked) setShowSecretMenu(secret.id);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    secret.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`}
                  disabled={!secret.unlocked && gameState.words < secret.unlockCost}
                >
                  {secret.unlocked ? '✓ ' : '🔒 '}{secret.name}
                  {!secret.unlocked && ` (${formatNumber(secret.unlockCost)} words)`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Tools</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              {getSecretsForMenu('Tools').map((secret) => (
                <button
                  key={secret.id}
                  onClick={() => {
                    if (!secret.unlocked) setShowSecretMenu(secret.id);
                    else if (secret.id === 'wordCount') setShowStats(!showStats);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    secret.unlocked ? 'text-green-600' : 'text-gray-400'
                  }`}
                  disabled={!secret.unlocked && gameState.words < secret.unlockCost}
                >
                  {secret.unlocked ? '✓ ' : '🔒 '}{secret.name}
                  {!secret.unlocked && ` (${formatNumber(secret.unlockCost)} words)`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Help</button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white shadow-lg border border-gray-300 w-56 z-50">
              <div className="px-4 py-2 text-xs text-gray-600">
                <p className="font-bold mb-2">How to Play:</p>
                <p>• Click in the document to type words</p>
                <p>• Buy upgrades from File → New Assignment</p>
                <p>• Unlock secret features in the menus</p>
                <p>• Each menu has hidden upgrades! 🔒</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-1 border-t border-gray-300">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-700">
            <span className="text-sm">↶</span>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-700">
            <span className="text-sm">↷</span>
          </button>
          <div className="border-l border-gray-300 h-4 mx-1"></div>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold">
            B
          </button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-700 italic">
            I
          </button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-700 underline">
            U
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-full p-16">
          {/* Document Prompt */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm">
            <p className="font-bold text-blue-900">Assignment Prompt:</p>
            <p className="text-gray-700">{gameState.currentPrompt}</p>
          </div>

          {/* Editable Document */}
          <textarea
            ref={textareaRef}
            onClick={handleTyping}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                handleTyping();
              }
            }}
            value={gameState.documentContent}
            onChange={(e) => updateDocumentContent(e.target.value)}
            className="w-full min-h-96 outline-none resize-none"
            style={{
              fontFamily: gameState.selectedFont,
              fontSize: `${gameState.fontSize}pt`,
              lineHeight: '1.5',
            }}
            placeholder="Start typing here to generate words... (Click or press Space/Enter)"
          />
        </div>
      </div>

      {/* Stats Panel (if unlocked) */}
      {showStats && gameState.secretFeatures.wordCount?.unlocked && (
        <div className="fixed right-4 top-20 bg-white shadow-xl border border-gray-300 p-4 w-64 z-40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Word Count Stats</h3>
            <button onClick={() => setShowStats(false)} className="text-gray-500">×</button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Words:</span>
              <span className="font-bold">{formatNumber(gameState.words)}</span>
            </div>
            <div className="flex justify-between">
              <span>Words/Second:</span>
              <span className="font-bold">{formatNumber(gameState.wordsPerSecond)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Typed:</span>
              <span className="font-bold">{formatNumber(gameState.totalWordsTyped)}</span>
            </div>
            <div className="flex justify-between">
              <span>Multiplier:</span>
              <span className="font-bold">×{getTotalMultiplier().toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Menu Modal */}
      {showUpgradeMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📚 Productivity Upgrades</h2>
              <button
                onClick={() => setShowUpgradeMenu(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Current Words: <span className="font-bold">{formatNumber(gameState.words)}</span> | 
              Words/Second: <span className="font-bold">{formatNumber(gameState.wordsPerSecond)}</span>
            </div>
            <div className="space-y-3">
              {Object.values(gameState.upgrades)
                .filter((u) => u.unlocked)
                .map((upgrade) => {
                  const cost = getUpgradeCost(upgrade.id);
                  const canAfford = gameState.words >= cost;
                  return (
                    <div
                      key={upgrade.id}
                      className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-lg">{upgrade.name}</div>
                        <div className="text-sm text-gray-600">{upgrade.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Level {upgrade.level} → {upgrade.level + 1}
                        </div>
                      </div>
                      <button
                        onClick={() => buyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`px-6 py-2 rounded font-bold ${
                          canAfford
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {formatNumber(cost)} words
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Secret Feature Unlock Modal */}
      {showSecretMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            {(() => {
              const secret = gameState.secretFeatures[showSecretMenu];
              if (!secret) return null;
              const canAfford = gameState.words >= secret.unlockCost;
              return (
                <>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🔓</div>
                    <h2 className="text-2xl font-bold mb-2">Unlock Secret Feature?</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      Found in <span className="font-bold">{secret.menuName}</span> menu
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <div className="font-bold text-lg mb-2">{secret.name}</div>
                    <div className="text-sm text-gray-700">{secret.description}</div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">
                      Cost: {formatNumber(secret.unlockCost)} words
                    </div>
                    <div className="text-sm text-gray-600">
                      You have: {formatNumber(gameState.words)} words
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSecretMenu(null)}
                      className="flex-1 px-4 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (unlockSecret(showSecretMenu)) {
                          setShowSecretMenu(null);
                        }
                      }}
                      disabled={!canAfford}
                      className={`flex-1 px-4 py-2 rounded font-bold ${
                        canAfford
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Unlock
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Floating Word Counter */}
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
        <div className="text-xs">Words</div>
        <div className="text-xl font-bold">{formatNumber(gameState.words)}</div>
        {gameState.wordsPerSecond > 0 && (
          <div className="text-xs">+{formatNumber(gameState.wordsPerSecond)}/s</div>
        )}
      </div>
    </div>
  );
}
