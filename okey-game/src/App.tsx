import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TileComponent } from './components/Tile';
import { GameSounds } from './components/GameSounds';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { MultiplayerProvider } from './contexts/MultiplayerContextInternal';
import type { Tile } from './components/Tile';
import { createOkeyTileSet, distributeTiles, determineOkeyTile, shuffleTiles, nextPlayerTurn, drawTile, discardTile, checkForWinningHand, type GameState, processAITurns } from './utils/gameLogic';
import './i18n';

// Global tip tanımları
declare global {
  interface Window {
    gameSounds?: {
      handleDrawSound: () => void;
      handleDiscardSound: () => void;
      handlePassSound: () => void;
      handleWinSound: () => void;
    };
  }
}

function App() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>({
    playerTiles: [],
    otherPlayers: {
      player2: [],
      player3: [],
      player4: []
    },
    centerTiles: [],
    drawPile: [],
    okeyInfo: null,
    currentPlayer: 1,
    gamePhase: 'waiting',
    selectedTile: null,
    scores: {
      player1: 0,
      player2: 0,
      player3: 0,
      player4: 0
    },
    gameStats: {
      totalGames: 0,
      player1Wins: 0,
      player2Wins: 0,
      player3Wins: 0,
      player4Wins: 0,
      averageGameDuration: 0
    },
    gameStartTime: null
  });

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false);

  // Oyunu başlat
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Taşları oluştur ve karıştır
    const tiles = shuffleTiles(createOkeyTileSet());

    // Taşları dağıt
    const distribution = distributeTiles([...tiles]);

    // Okey taşını belirle
    const okeyInfo = determineOkeyTile(distribution.centerTiles);

    const initialGameState: GameState = {
      playerTiles: distribution.player1Tiles,
      otherPlayers: {
        player2: distribution.player2Tiles,
        player3: distribution.player3Tiles,
        player4: distribution.player4Tiles
      },
      centerTiles: distribution.centerTiles,
      drawPile: distribution.drawPile,
      okeyInfo,
      currentPlayer: 1,
      gamePhase: 'playing',
      selectedTile: null,
      scores: {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0
      },
      gameStats: {
        totalGames: 0,
        player1Wins: 0,
        player2Wins: 0,
        player3Wins: 0,
        player4Wins: 0,
        averageGameDuration: 0
      },
      gameStartTime: Date.now()
    };

    setGameState(initialGameState);

    // Eğer başlangıçta AI oyuncusuysa otomatik hamle yap
    if (initialGameState.currentPlayer !== 1) {
      setTimeout(() => {
        const newGameState = processAITurns(initialGameState);
        setGameState(newGameState);
      }, 1000);
    }
  };

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile);
  };

  const handleDrawTile = () => {
    if (gameState.currentPlayer !== 1) return; // Sadece kendi sıramızda taş çekebiliriz

    let newGameState = drawTile(gameState);
    setGameState(newGameState);

    // Ses efekti çal
    if (window.gameSounds?.handleDrawSound) {
      window.gameSounds.handleDrawSound();
    }

    // El kontrolü yap
    if (checkForWinningHand(newGameState.playerTiles)) {
      setGameState({ ...newGameState, gamePhase: 'finished' });
      if (window.gameSounds?.handleWinSound) {
        window.gameSounds.handleWinSound();
      }
      alert('🎉 TEBRİKLER! Eli bitirdiniz!');
      return;
    }

    // AI oyuncularının hamle yapması için
    setTimeout(() => {
      newGameState = processAITurns(newGameState);
      setGameState(newGameState);
    }, 500); // Kısa bir gecikme için
  };

  const handleDiscardTile = () => {
    if (gameState.currentPlayer !== 1 || !selectedTile) return; // Sadece kendi sıramızda ve seçili taş varsa

    let newGameState = discardTile(gameState, selectedTile.id);
    setGameState(newGameState);
    setSelectedTile(null);

    // Ses efekti çal
    if (window.gameSounds?.handleDiscardSound) {
      window.gameSounds.handleDiscardSound();
    }

    // El kontrolü yap
    if (checkForWinningHand(newGameState.playerTiles)) {
      setGameState({ ...newGameState, gamePhase: 'finished' });
      if (window.gameSounds?.handleWinSound) {
        window.gameSounds.handleWinSound();
      }
      alert('🎉 TEBRİKLER! Eli bitirdiniz!');
      return;
    }

    // AI oyuncularının hamle yapması için
    setTimeout(() => {
      newGameState = processAITurns(newGameState);
      setGameState(newGameState);
    }, 500); // Kısa bir gecikme için
  };

  const handlePassTurn = () => {
    if (gameState.currentPlayer !== 1) return; // Sadece kendi sıramızda pas geçebiliriz

    let newGameState = nextPlayerTurn(gameState);
    setGameState(newGameState);

    // Ses efekti çal
    if (window.gameSounds?.handlePassSound) {
      window.gameSounds.handlePassSound();
    }

    // AI oyuncularının hamle yapması için
    setTimeout(() => {
      newGameState = processAITurns(newGameState);
      setGameState(newGameState);
    }, 500); // Kısa bir gecikme için
  };

  const getPlayerName = (playerNumber: number) => {
    switch (playerNumber) {
      case 1: return t('game.players');
      case 2: return t('game.player2', 'Oyuncu 2');
      case 3: return t('game.player3', 'Oyuncu 3');
      case 4: return t('game.player4', 'Oyuncu 4');
      default: return t('game.unknown', 'Bilinmiyor');
    }
  };

  const getTileDisplayName = (tile: Tile) => {
    if (tile.isJoker) return t('game.joker', 'JOKER');
    if (tile.isOkey) return t('game.okey', 'OKEY');

    const colorNames = {
      red: t('colors.red', 'Kırmızı'),
      black: t('colors.black', 'Siyah'),
      yellow: t('colors.yellow', 'Sarı'),
      blue: t('colors.blue', 'Mavi')
    };

    return `${tile.value} ${colorNames[tile.color]}`;
  };

  return (
    <MultiplayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
        {showMultiplayerLobby ? (
          <MultiplayerLobby onStartGame={() => setShowMultiplayerLobby(false)} />
        ) : (
          <>
            <GameSounds selectedTile={selectedTile} />
            <div className="max-w-7xl mx-auto">
              {/* Başlık */}
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">{t('game.title', 'OKEY OYUNU')}</h1>
                <p className="text-green-200">{t('game.subtitle', 'Türkçe Klasik Okey Oyunu')}</p>

                {/* Oyun Modu Seçimi */}
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameMode('single');
                      setShowMultiplayerLobby(false);
                      startNewGame();
                    }}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                      gameMode === 'single'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    Tekli Oyun
                  </button>
                  <button
                    onClick={() => setShowMultiplayerLobby(true)}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                      gameMode === 'multiplayer'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    Çoklu Oyun
                  </button>
                </div>

                {/* Oyun Bilgileri */}
                {gameState.okeyInfo && (
                  <div className="mt-4 p-4 bg-yellow-800 rounded-lg text-white">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>{t('game.indicator', 'Gösterici')}:</strong> {getTileDisplayName(gameState.okeyInfo.indicatorTile)}
                      </div>
                      <div>
                        <strong>{t('game.okeyTile', 'Okey')}:</strong> {getTileDisplayName(gameState.okeyInfo.okeyTile)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Okey Masası Düzeni */}
              <div className="relative w-full max-w-4xl mx-auto aspect-square bg-green-800 rounded-full shadow-2xl border-8 border-yellow-600">
                {/* Merkez - Yer Taşları */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-700 rounded-lg p-4 border-2 border-yellow-500">
                    <div className="text-white text-center mb-2 font-bold">{t('game.centerTiles', 'YER TAŞLARI')}</div>
                    <div className="grid grid-cols-4 gap-1">
                      {gameState.centerTiles.slice(0, 8).map((tile, index) => (
                        <div key={tile.id || index} className="w-8 h-10 bg-yellow-600 rounded border border-yellow-400 flex items-center justify-center text-xs text-white font-bold">
                          {tile.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 2 - Üst */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-blue-400">
                    <h3 className="text-white text-sm font-bold mb-2 text-center">
                      {getPlayerName(2)}
                    </h3>
                    <div className="flex gap-1 justify-center">
                      {gameState.otherPlayers.player2.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-blue-600 rounded border"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 3 - Sol */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-red-400">
                    <h3 className="text-white text-sm font-bold mb-2 text-center">
                      {getPlayerName(3)}
                    </h3>
                    <div className="flex flex-col gap-1 items-center">
                      {gameState.otherPlayers.player3.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-red-600 rounded border"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 4 - Sağ */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-green-400">
                    <h3 className="text-white text-sm font-bold mb-2 text-center">
                      {getPlayerName(4)}
                    </h3>
                    <div className="flex flex-col gap-1 items-center">
                      {gameState.otherPlayers.player4.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-green-600 rounded border"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* İnsan Oyuncusu - Alt */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-400">
                    <h3 className="text-white text-lg font-bold mb-4 text-center">
                      {getPlayerName(1)} (Senin Taşların)
                    </h3>

                    {/* Seçili taş bilgisi */}
                    {selectedTile && (
                      <div className="mb-4 p-3 bg-blue-600 rounded-lg text-white text-sm">
                        <div className="font-bold">Seçili Taş:</div>
                        <div>{getTileDisplayName(selectedTile)}</div>
                      </div>
                    )}

                    {/* Taşlar */}
                    <div className="flex gap-2 justify-center mb-4 overflow-x-auto">
                      {gameState.playerTiles.map((tile) => (
                        <TileComponent
                          key={tile.id}
                          tile={tile}
                          isSelected={selectedTile?.id === tile.id}
                          onClick={handleTileClick}
                        />
                      ))}
                    </div>

                    {/* Oyun Kontrolleri */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleDrawTile}
                        disabled={gameState.currentPlayer !== 1 || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-colors ${
                          gameState.currentPlayer === 1 && gameState.gamePhase === 'playing'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {t('game.drawTile', 'Çek')} ({gameState.drawPile.length})
                      </button>
                      <button
                        onClick={handleDiscardTile}
                        disabled={gameState.currentPlayer !== 1 || !selectedTile || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-colors ${
                          gameState.currentPlayer === 1 && selectedTile && gameState.gamePhase === 'playing'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {t('game.discard', 'At')}
                      </button>
                      <button
                        onClick={handlePassTurn}
                        disabled={gameState.currentPlayer !== 1 || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-colors ${
                          gameState.currentPlayer === 1 && gameState.gamePhase === 'playing'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {t('game.pass', 'Pas')}
                      </button>
                    </div>

                    {/* Oyun Bilgileri */}
                    <div className="mt-4 text-xs text-gray-300 space-y-1">
                      <div>{t('game.status', 'Durum')}: {gameState.gamePhase === 'playing' ? t('game.playing', 'Oynanıyor') : t('game.waiting', 'Bekleniyor')}</div>
                      <div className={`font-bold ${gameState.currentPlayer === 1 ? 'text-green-400' : 'text-gray-400'}`}>
                        {t('game.nextPlayer', 'Sıradaki')}: {getPlayerName(gameState.currentPlayer)} {gameState.currentPlayer === 1 ? '🎯 (SENİN SIRAN)' : ''}
                      </div>
                      <div>{t('game.drawPile', 'Çekme Havuzu')}: {gameState.drawPile.length} {t('game.tiles', 'taş')}</div>
                      <div>{t('game.handTiles', 'Elindeki Taş')}: {gameState.playerTiles.length}</div>
                      <div className={checkForWinningHand(gameState.playerTiles) ? 'text-green-400 font-bold' : ''}>
                        {t('game.handCheck', 'El Kontrolü')}: {checkForWinningHand(gameState.playerTiles) ? '✅ BİTEBİLİR' : '❌ Henüz değil'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yeni Oyun Butonu */}
              <div className="text-center mt-6">
                <button
                  onClick={startNewGame}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-bold transition-colors"
                >
                  {t('game.newGame', 'Yeni Oyun')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MultiplayerProvider>
  );
}

export default App;
