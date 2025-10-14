import './i18n';
import { useState, useEffect } from 'react';
import { useAppUpdater } from './hooks/useAppUpdater';
import { TileComponent } from './components/Tile';
import { UpdateDialog } from './components/UpdateDialog';
import type { Tile } from './components/Tile';
import GameOverDialog from './components/GameOverDialog';
import { nextPlayerTurn, drawTile, discardTile, checkForWinningHand, type GameState, processAITurns, checkForWinner, initializeScoreSystem } from './utils/gameLogic';
import { useTranslation } from 'react-i18next';
import { BeginMenu } from './components/BeginMenu';
import { MultiplayerProvider } from './contexts/MultiplayerContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { RoomSelection } from './components/RoomSelection';
import { FPSCounter } from './components/FPSCounter';

// İçerik komponenti - ThemeProvider içinde useTheme kullanacak
function App() {
  return (
    <MultiplayerProvider>
      <ThemeProvider>
        <GameContent />
      </ThemeProvider>
    </MultiplayerProvider>
  );
}

const GameContent: React.FC = () => {
  const { t } = useTranslation();
  const { updateInfo, updateStatus, performUpdate, dismissUpdate, showUpdateDialog, setShowUpdateDialog, checkUpdates } = useAppUpdater();
  const { isDark } = useTheme();

  const [showMenu, setShowMenu] = useState(true);
  const [showRoomSelection, setShowRoomSelection] = useState(false);

  // Single player için
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
    ...initializeScoreSystem()
  });

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  // Oyunu başlat
  useEffect(() => {
    // Artık başlangıç menüsü var, otomatik başlatma yok
  }, []);

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile);
  };

  const handleDrawTile = () => {
    if (gameState.currentPlayer !== 1) return;

    console.log('handleDrawTile: Before draw', { ...gameState });
    let newGameState = drawTile(gameState);
    newGameState = checkForWinner(newGameState);
    console.log('handleDrawTile: After draw and winner check', { ...newGameState });
    setGameState(newGameState);

    if (checkForWinningHand(newGameState.playerTiles)) {
      console.log('handleDrawTile: Winning hand detected, setting game phase to finished.');
      setGameState({ ...newGameState, gamePhase: 'finished' });
      return;
    }

    // AI hamlelerini doğru işle ve currentPlayer'ı 1 yap
    setTimeout(() => {
      const aiResult = processAITurns(newGameState);
      // AI'lar oynadıktan sonra currentPlayer'ı 1 yap
      const finalState = { ...aiResult, currentPlayer: 1 };
      console.log('handleDrawTile: After AI turns', { ...finalState });
      setGameState(finalState);
    }, 500);
  };

  const handleDiscardTile = () => {
    if (gameState.currentPlayer !== 1 || !selectedTile) return;

    console.log('handleDiscardTile: Before discard', { ...gameState });
    let newGameState = discardTile(gameState, selectedTile.id);
    newGameState = checkForWinner(newGameState);
    console.log('handleDiscardTile: After discard and winner check', { ...newGameState });
    setGameState(newGameState);
    setSelectedTile(null);

    if (checkForWinningHand(newGameState.playerTiles)) {
      console.log('handleDiscardTile: Winning hand detected, setting game phase to finished.');
      setGameState({ ...newGameState, gamePhase: 'finished' });
      return;
    }

    // AI hamlelerini doğru işle ve currentPlayer'ı 1 yap
    setTimeout(() => {
      const aiResult = processAITurns(newGameState);
      // AI'lar oynadıktan sonra currentPlayer'ı 1 yap
      const finalState = { ...aiResult, currentPlayer: 1 };
      console.log('handleDiscardTile: After AI turns', { ...finalState });
      setGameState(finalState);
    }, 500);
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
      case 1: return t('game.players', 'Sen');
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
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-green-900 via-green-800 to-green-900'
    }`}>
      {/* FPS Göstergesi - Production ortamında görünür */}
      {import.meta.env.PROD && <FPSCounter position="bottom-right" />}

          {/* Güncelleme Bildirimi */}
        {updateInfo.available && !showUpdateDialog && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg animate-bounce max-w-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div className="flex-1">
                <div className="font-bold text-sm">Yeni Güncelleme!</div>
                <div className="text-xs opacity-90">v{updateInfo.latestVersion} mevcut</div>
              </div>
              <button
                onClick={() => setShowUpdateDialog(true)}
                className="bg-white text-green-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Güncelle
              </button>
            </div>
          </div>
        )}

        {/* Manuel Güncelleme Kontrolü Butonu - Debug için */}
        {import.meta.env.DEV && (
          <div className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg">
            <button
              onClick={checkUpdates}
              className="text-xs font-bold hover:bg-blue-700 px-2 py-1 rounded transition-colors"
            >
              🔍 Güncelleme Kontrolü
            </button>
          </div>
        )}
        {showMenu && (
          <BeginMenu
            setShowMenu={setShowMenu}
            setGameState={setGameState}
            onExit={() => window.close()}
            onMultiplayer={() => setShowRoomSelection(true)}
            onShowSettings={() => {
              // TODO: Settings component eklenecek
              console.log('Settings açılacak');
            }}
          />
        )}

        {/* Oda Seçimi */}
        {showRoomSelection && (
          <RoomSelection
            onBackToMenu={() => setShowRoomSelection(false)}
            onJoinRoom={(roomId) => {
              setShowRoomSelection(false);
              // TODO: Multiplayer oyun başlatma
              console.log('Odaya katılınıyor:', roomId);
            }}
          />
        )}

      {/* Ana Oyun */}
      {!showMenu && (
        <div className={`min-h-screen p-4 transition-colors duration-300 ${
          isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-green-900 via-green-800 to-green-900'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-6">
              <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-white'}`}>OKEY OYUNU</h1>
              <p className={`text-lg ${isDark ? 'text-gray-200' : 'text-green-200'}`}>Türkçe Klasik Okey Oyunu</p>

              {/* Güncelleme Bilgileri - DAHA BELİRGİN */}
              {updateInfo.available && updateStatus.status === 'idle' && (
                <div className="mt-4 p-6 bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg text-white border-2 border-yellow-400 shadow-lg animate-pulse">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚀</div>
                      <div className="text-sm font-semibold">YENİ GÜNCELLEME!</div>
                      <div className="text-xs opacity-90">v{updateInfo.latestVersion} mevcut</div>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={performUpdate}
                        disabled={updateStatus.status !== 'idle'}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateStatus.status !== 'idle' ? 'Güncelleme...' : 'Şimdi Güncelle'}
                      </button>
                      <button
                        onClick={dismissUpdate}
                        className="ml-3 text-xs text-gray-300 hover:text-white underline"
                      >
                        Sonra
                      </button>
                    </div>
                  </div>
                  {updateInfo.releaseNotes && (
                    <div className="mt-4 pt-4 border-t border-blue-600">
                      <p className="text-sm text-center">{updateInfo.releaseNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Güncelleme Kontrol Ediliyor */}
              {updateStatus.status === 'checking' && (
                <div className="mt-4 p-4 bg-blue-800 rounded-lg text-white">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Güncelleme kontrol ediliyor...</span>
                  </div>
                </div>
              )}

              {/* Güncelleme İndiriliyor */}
              {updateStatus.status === 'downloading' && (
                <div className="mt-4 p-4 bg-blue-800 rounded-lg text-white">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Güncelleme indiriliyor...</span>
                  </div>
                </div>
              )}

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

            {/* Ana Oyun Alanı ve Skor Paneli */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Skor Tablosu */}
              <div className="xl:col-span-1">
                <div className={`rounded-lg p-4 border-2 shadow-lg ${
                  isDark ? 'bg-gray-800 border-yellow-500' : 'bg-gray-800 border-yellow-500'
                }`}>
                  <h3 className="text-white text-lg font-bold mb-4 text-center">🏆 SKOR TABLOSU</h3>

                  {/* Geçerli Skorlar */}
                  <div className="mb-6">
                    <h4 className="text-yellow-400 text-sm font-bold mb-3">Bu Oyun</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-white">
                        <span>Sen:</span>
                        <span className="bg-purple-600 px-2 py-1 rounded text-sm font-bold">{gameState.scores.player1}</span>
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <span>Oyuncu 2:</span>
                        <span className="bg-blue-600 px-2 py-1 rounded text-sm font-bold">{gameState.scores.player2}</span>
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <span>Oyuncu 3:</span>
                        <span className="bg-red-600 px-2 py-1 rounded text-sm font-bold">{gameState.scores.player3}</span>
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <span>Oyuncu 4:</span>
                        <span className="bg-green-600 px-2 py-1 rounded text-sm font-bold">{gameState.scores.player4}</span>
                      </div>
                    </div>
                  </div>

                  {/* Genel İstatistikler */}
                  <div>
                    <h4 className="text-green-400 text-sm font-bold mb-3">Genel İstatistikler</h4>
                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Toplam Oyun:</span>
                        <span className="text-white font-bold">{gameState.gameStats.totalGames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Senin Galibiyet:</span>
                        <span className="text-purple-400 font-bold">{gameState.gameStats.player1Wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Galibiyetleri:</span>
                        <span className="text-blue-400 font-bold">
                          {gameState.gameStats.player2Wins + gameState.gameStats.player3Wins + gameState.gameStats.player4Wins}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ortalama Süre:</span>
                        <span className="text-white font-bold">
                          {gameState.gameStats.averageGameDuration > 0
                            ? `${Math.round(gameState.gameStats.averageGameDuration)}sn`
                            : '-'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Okey Masası Düzeni */}
              <div className="xl:col-span-3 relative w-full max-w-4xl mx-auto aspect-square bg-green-800 rounded-full shadow-2xl border-8 border-yellow-600 transition-all duration-500 hover:shadow-3xl">
                {/* Merkez - Yer Taşları */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-700 rounded-lg p-4 border-2 border-yellow-500 transform transition-transform duration-300 hover:scale-105">
                    <div className="text-white text-center mb-2 font-bold animate-pulse">YER TAŞLARI</div>
                    <div className="grid grid-cols-4 gap-1">
                      {gameState.centerTiles.slice(0, 8).map((tile, index) => (
                        <div key={tile.id || index} className="w-8 h-10 bg-yellow-600 rounded border border-yellow-400 flex items-center justify-center text-xs text-white font-bold transform transition-transform duration-200 hover:scale-110 hover:shadow-lg">
                          {tile.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 2 - Üst */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 hover:scale-105">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-blue-400 shadow-lg">
                    <h3 className="text-white text-sm font-bold mb-2 text-center transition-colors duration-200">
                      {getPlayerName(2)}
                    </h3>
                    <div className="flex gap-1 justify-center">
                      {gameState.otherPlayers.player2.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-blue-600 rounded border transform transition-transform duration-200 hover:scale-110"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 3 - Sol */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-105">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-red-400 shadow-lg">
                    <h3 className="text-white text-sm font-bold mb-2 text-center transition-colors duration-200">
                      {getPlayerName(3)}
                    </h3>
                    <div className="flex flex-col gap-1 items-center">
                      {gameState.otherPlayers.player3.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-red-600 rounded border transform transition-transform duration-200 hover:scale-110"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Oyuncu 4 - Sağ */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-105">
                  <div className="bg-gray-800 rounded-lg p-3 border-2 border-green-400 shadow-lg">
                    <h3 className="text-white text-sm font-bold mb-2 text-center transition-colors duration-200">
                      {getPlayerName(4)}
                    </h3>
                    <div className="flex flex-col gap-1 items-center">
                      {gameState.otherPlayers.player4.slice(0, 7).map((tile) => (
                        <div key={tile.id} className="w-6 h-8 bg-green-600 rounded border transform transition-transform duration-200 hover:scale-110"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* İnsan Oyuncusu - Alt */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 hover:scale-105">
                  <div className={`bg-gray-800 rounded-lg p-4 border-2 shadow-lg transition-all duration-300 ${
                    gameState.currentPlayer === 1 ? 'border-purple-400 shadow-purple-500/50' : 'border-gray-600'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 text-center transition-colors duration-300 ${
                      gameState.currentPlayer === 1 ? 'text-purple-400' : 'text-white'
                    }`}>
                      {getPlayerName(1)} (Senin Taşların)
                    </h3>

                    {/* Seçili taş bilgisi */}
                    {selectedTile && (
                      <div className="mb-4 p-3 bg-blue-600 rounded-lg text-white text-sm transform transition-all duration-300 animate-fadeIn">
                        <div className="font-bold">Seçili Taş:</div>
                        <div>{getTileDisplayName(selectedTile)}</div>
                      </div>
                    )}

                    {/* Taşlar */}
                    <div className="flex gap-2 justify-center mb-4 overflow-x-auto">
                      {gameState.playerTiles.map((tile, index) => (
                        <div
                          key={tile.id}
                          className="transform transition-all duration-300"
                          style={{
                            animationDelay: `${index * 50}ms`
                          }}
                        >
                          <TileComponent
                            tile={tile}
                            isSelected={selectedTile?.id === tile.id}
                            onClick={handleTileClick}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Oyun Kontrolleri */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleDrawTile}
                        disabled={gameState.currentPlayer !== 1 || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 transform ${
                          gameState.currentPlayer === 1 && gameState.gamePhase === 'playing'
                            ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 hover:shadow-lg active:scale-95'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Çek ({gameState.drawPile.length})
                      </button>
                      <button
                        onClick={handleDiscardTile}
                        disabled={gameState.currentPlayer !== 1 || !selectedTile || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 transform ${
                          gameState.currentPlayer === 1 && selectedTile && gameState.gamePhase === 'playing'
                            ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 hover:shadow-lg active:scale-95'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        At
                      </button>
                      <button
                        onClick={handlePassTurn}
                        disabled={gameState.currentPlayer !== 1 || gameState.gamePhase !== 'playing'}
                        className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 transform ${
                          gameState.currentPlayer === 1 && gameState.gamePhase === 'playing'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-105 hover:shadow-lg active:scale-95'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Pas
                      </button>
                    </div>

                    {/* Oyun Bilgileri */}
                    <div className="mt-4 text-xs text-gray-300 space-y-1">
                      <div className="transition-colors duration-300">Durum: {gameState.gamePhase === 'playing' ? 'Oynanıyor' : 'Bekleniyor'}</div>
                      <div className={`font-bold transition-colors duration-300 ${
                        gameState.currentPlayer === 1 ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        Sıradaki: {getPlayerName(gameState.currentPlayer)} {gameState.currentPlayer === 1 ? '🎯 (SENİN SIRAN)' : ''}
                      </div>
                      <div className="transition-all duration-300">Çekme Havuzu: {gameState.drawPile.length} taş</div>
                      <div className="transition-all duration-300">Elindeki Taş: {gameState.playerTiles.length}</div>
                      <div className={`transition-all duration-300 ${
                        checkForWinningHand(gameState.playerTiles) ? 'text-green-400 font-bold' : ''
                      }`}>
                        El Kontrolü: {checkForWinningHand(gameState.playerTiles) ? '✅ BİTEBİLİR' : '❌ Henüz değil'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Yeni Oyun Butonu */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMenu(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-bold transition-colors"
              >
                Ana Menü
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Güncelleme Dialog'u */}
      {showUpdateDialog && (
        <UpdateDialog
          updateInfo={updateInfo}
          updateStatus={updateStatus}
          onUpdate={performUpdate}
          onDismiss={dismissUpdate}
        />
      )}
      {gameState.gamePhase === 'finished' && (
        <GameOverDialog onRestart={() => setShowMenu(true)} />
      )}
    </div>
  );
}

export default App;
