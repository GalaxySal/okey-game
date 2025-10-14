import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { TileComponent, type Tile } from '../components/Tile';
import {
  createOkeyTileSet,
  shuffleTiles,
  distributeTiles,
  determineOkeyTile,
  checkForWinningHand
} from '../utils/gameLogic';
import type { GameState } from '../types';

export const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const tiles = createOkeyTileSet();
    const shuffledTiles = shuffleTiles(tiles);
    const distribution = distributeTiles(shuffledTiles);
    const okeyInfo = determineOkeyTile(distribution.centerTiles);

    const newGameState: GameState = {
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

    setGameState(newGameState);
    setSelectedTile(null);
  };

  const handleTilePress = (tile: Tile) => {
    setSelectedTile(tile);
  };

  const handleDrawTile = () => {
    if (!gameState || gameState.currentPlayer !== 1) return;

    // Basit taş çekme simülasyonu
    if (gameState.drawPile.length > 0) {
      const drawnTile = gameState.drawPile[0];
      const newPlayerTiles = [...gameState.playerTiles, drawnTile];
      const newDrawPile = gameState.drawPile.slice(1);

      const newGameState = {
        ...gameState,
        playerTiles: newPlayerTiles,
        drawPile: newDrawPile
      };

      // El kontrolü
      if (checkForWinningHand(newPlayerTiles)) {
        Alert.alert('🎉 TEBRİKLER!', 'Eli bitirdiniz!');
        return;
      }

      setGameState(newGameState);
    }
  };

  const handleDiscardTile = () => {
    if (!gameState || gameState.currentPlayer !== 1 || !selectedTile) return;

    const newPlayerTiles = gameState.playerTiles.filter((tile: Tile) => tile.id !== selectedTile.id);
    setGameState({
      ...gameState,
      playerTiles: newPlayerTiles,
      selectedTile: null
    });
    setSelectedTile(null);
  };

  if (!gameState) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Oyun yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>OKEY OYUNU</Text>
          <Text style={styles.subtitle}>Türkçe Klasik Okey</Text>
        </View>

        {/* Okey Bilgileri */}
        {gameState.okeyInfo && (
          <View style={styles.okeyInfo}>
            <Text style={styles.okeyText}>
              Gösterici: {gameState.okeyInfo.indicatorTile.value} {gameState.okeyInfo.indicatorTile.color}
            </Text>
            <Text style={styles.okeyText}>
              Okey: {gameState.okeyInfo.okeyTile.value} {gameState.okeyInfo.okeyTile.color}
            </Text>
          </View>
        )}

        {/* Yer Taşları */}
        <View style={styles.centerTiles}>
          <Text style={styles.centerTitle}>YER TAŞLARI</Text>
          <View style={styles.centerTilesGrid}>
            {gameState.centerTiles.slice(0, 8).map((tile: Tile, index: number) => (
              <View key={tile.id || index} style={styles.centerTile}>
                <Text style={styles.centerTileText}>{tile.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Oyuncu Taşları */}
        <View style={styles.playerArea}>
          <Text style={styles.playerTitle}>Senin Taşların</Text>

          {/* Seçili taş bilgisi */}
          {selectedTile && (
            <View style={styles.selectedTileInfo}>
              <Text style={styles.selectedTileText}>
                Seçili: {selectedTile.value} {selectedTile.color}
              </Text>
            </View>
          )}

          {/* Taşlar */}
          <View style={styles.playerTiles}>
            {gameState.playerTiles.map((tile: Tile) => (
              <TileComponent
                key={tile.id}
                tile={tile}
                isSelected={selectedTile?.id === tile.id}
                onPress={handleTilePress}
              />
            ))}
          </View>

          {/* Oyun Kontrolleri */}
          <View style={styles.gameControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.drawButton]}
              onPress={handleDrawTile}
              disabled={gameState.currentPlayer !== 1 || gameState.gamePhase !== 'playing'}
            >
              <Text style={styles.controlButtonText}>
                Çek ({gameState.drawPile.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.discardButton,
                (!selectedTile || gameState.currentPlayer !== 1) && styles.disabledButton
              ]}
              onPress={handleDiscardTile}
              disabled={!selectedTile || gameState.currentPlayer !== 1}
            >
              <Text style={[
                styles.controlButtonText,
                (!selectedTile || gameState.currentPlayer !== 1) && styles.disabledText
              ]}>
                At
              </Text>
            </TouchableOpacity>
          </View>

          {/* Oyun Bilgileri */}
          <View style={styles.gameInfo}>
            <Text style={styles.gameInfoText}>
              Durum: {gameState.gamePhase === 'playing' ? 'Oynanıyor' : 'Bekleniyor'}
            </Text>
            <Text style={styles.gameInfoText}>
              Sıradaki: Oyuncu {gameState.currentPlayer}
            </Text>
            <Text style={styles.gameInfoText}>
              Çekme Havuzu: {gameState.drawPile.length} taş
            </Text>
            <Text style={styles.gameInfoText}>
              Elindeki Taş: {gameState.playerTiles.length}
            </Text>
          </View>
        </View>

        {/* Yeni Oyun Butonu */}
        <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
          <Text style={styles.newGameButtonText}>Yeni Oyun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#166534',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbf7d0',
  },
  okeyInfo: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  okeyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  centerTiles: {
    backgroundColor: '#15803d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  centerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  centerTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  centerTile: {
    width: 32,
    height: 40,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d97706',
  },
  centerTileText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerArea: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  playerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedTileInfo: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  selectedTileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  gameControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  drawButton: {
    backgroundColor: '#16a34a',
  },
  discardButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#d1d5db',
  },
  gameInfo: {
    gap: 4,
  },
  gameInfoText: {
    color: '#d1d5db',
    fontSize: 12,
    textAlign: 'center',
  },
  newGameButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
