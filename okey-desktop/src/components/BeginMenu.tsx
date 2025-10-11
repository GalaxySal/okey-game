import React, { useState } from 'react';
import { createOkeyTileSet, distributeTiles, determineOkeyTile, shuffleTiles, initializeScoreSystem, type GameState } from '../utils/gameLogic';
import { Dispatch, SetStateAction } from 'react';

interface BeginMenuProps {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  setGameState: Dispatch<SetStateAction<GameState>>;
  onExit?: () => void;
  onMultiplayer?: () => void;
  onShowSettings?: () => void;
}

export const BeginMenu: React.FC<BeginMenuProps> = ({
  setShowMenu,
  setGameState,
  onExit,
  onMultiplayer,
  onShowSettings
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleStartGame = async () => {
    setIsVisible(false);

    const tiles = createOkeyTileSet();
    const shuffledTiles = shuffleTiles(tiles);
    const distributed = distributeTiles(shuffledTiles);
    const okeyInfo = determineOkeyTile(shuffledTiles);

    setGameState({
      playerTiles: distributed.player1Tiles,
      otherPlayers: {
        player2: distributed.player2Tiles,
        player3: distributed.player3Tiles,
        player4: distributed.player4Tiles
      },
      centerTiles: distributed.centerTiles,
      drawPile: distributed.drawPile,
      okeyInfo,
      currentPlayer: 1,
      gamePhase: 'playing',
      selectedTile: null,
      ...initializeScoreSystem()
    });

    // Hide the menu to show the game
    setShowMenu(false);
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-yellow-500 shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">🃏</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            OKEY OYUNU
          </h1>
          <p className="text-green-200 text-lg">Türkçe Klasik Okey</p>
          <p className="text-gray-400 text-sm mt-2">v0.3.0 - Desktop Edition</p>
        </div>

        {/* Oyun Bilgileri */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-bold mb-3 text-center">🎮 Oyun Özellikleri</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Akıllı AI Rakipler</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Gerçek Okey Kuralları</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Canlı Skor Takibi</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Animasyonlar & Efektler</span>
            </div>
          </div>
        </div>

        {/* Ana Butonlar */}
        <div className="space-y-4">
          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            🎯 Tek Kişilik Oyun
          </button>

          {onMultiplayer && (
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  onMultiplayer();
                }, 300);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              🌐 Çoklu Oyuncu
            </button>
          )}

          {onShowSettings && (
            <button
              onClick={onShowSettings}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              ⚙️ Ayarlar
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Uygulamadan çıkmak istediğinize emin misiniz?')) {
                onExit?.();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🚪 Çıkış
          </button>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Oyun masaüstü uygulaması olarak geliştirilmiştir</p>
          <p className="mt-1">© 2025 Nazım Pala</p>
        </div>
      </div>
    </div>
  );
};
