import { useState, useEffect } from 'react';
import { TileComponent } from './components/Tile';
import type { Tile } from './components/Tile';
import { createOkeyTileSet, distributeTiles, determineOkeyTile, shuffleTiles, nextPlayerTurn, drawTile, discardTile, checkForWinningHand, type GameState, processAITurns } from './utils/gameLogic';

function App() {
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
    selectedTile: null
  });

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

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
      selectedTile: null
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

    // El kontrolü yap
    if (checkForWinningHand(newGameState.playerTiles)) {
      setGameState({ ...newGameState, gamePhase: 'finished' });
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

    // El kontrolü yap
    if (checkForWinningHand(newGameState.playerTiles)) {
      setGameState({ ...newGameState, gamePhase: 'finished' });
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

    // AI oyuncularının hamle yapması için
    setTimeout(() => {
      newGameState = processAITurns(newGameState);
      setGameState(newGameState);
    }, 500); // Kısa bir gecikme için
  };

  const getPlayerName = (playerNumber: number) => {
    switch (playerNumber) {
      case 1: return 'Sen';
      case 2: return 'Oyuncu 2';
      case 3: return 'Oyuncu 3';
      case 4: return 'Oyuncu 4';
      default: return 'Bilinmiyor';
    }
  };

  const getTileDisplayName = (tile: Tile) => {
    if (tile.isJoker) return 'JOKER';
    if (tile.isOkey) return 'OKEY';

    const colorNames = {
      red: 'Kırmızı',
      black: 'Siyah',
      yellow: 'Sarı',
      blue: 'Mavi'
    };

    return `${tile.value} ${colorNames[tile.color]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">OKEY OYUNU</h1>
          <p className="text-green-200">Türkçe Klasik Okey Oyunu</p>

          {/* Oyun Bilgileri */}
          {gameState.okeyInfo && (
            <div className="mt-4 p-4 bg-yellow-800 rounded-lg text-white">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Gösterici:</strong> {getTileDisplayName(gameState.okeyInfo.indicatorTile)}
                </div>
                <div>
                  <strong>Okey:</strong> {getTileDisplayName(gameState.okeyInfo.okeyTile)}
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
              <div className="text-white text-center mb-2 font-bold">YER TAŞLARI</div>
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
                  Çek ({gameState.drawPile.length})
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
                  At
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
                  Pas
                </button>
              </div>

              {/* Oyun Bilgileri */}
              <div className="mt-4 text-xs text-gray-300 space-y-1">
                <div>Durum: {gameState.gamePhase === 'playing' ? 'Oynanıyor' : 'Bekleniyor'}</div>
                <div className={`font-bold ${gameState.currentPlayer === 1 ? 'text-green-400' : 'text-gray-400'}`}>
                  Sıradaki: {getPlayerName(gameState.currentPlayer)} {gameState.currentPlayer === 1 ? '🎯 (SENİN SIRAN)' : ''}
                </div>
                <div>Çekme Havuzu: {gameState.drawPile.length} taş</div>
                <div>Elindeki Taş: {gameState.playerTiles.length}</div>
                <div className={checkForWinningHand(gameState.playerTiles) ? 'text-green-400 font-bold' : ''}>
                  El Kontrolü: {checkForWinningHand(gameState.playerTiles) ? '✅ BİTEBİLİR' : '❌ Henüz değil'}
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
            Yeni Oyun
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
