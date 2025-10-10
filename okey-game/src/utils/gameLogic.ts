import type { Tile, TileColor, TileValue } from '../components/Tile';

export interface GameState {
  playerTiles: Tile[];
  otherPlayers: {
    player2: Tile[];
    player3: Tile[];
    player4: Tile[];
  };
  centerTiles: Tile[];
  drawPile: Tile[];
  okeyInfo: {
    indicatorTile: Tile;
    okeyTile: Tile;
  } | null;
  currentPlayer: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  selectedTile: Tile | null;
}

/**
 * Gerçek okey oyunu için taş setini oluşturur
 * 4 renk × 13 değer × 2 deste + 2 joker = 106 taş
 */
export const createOkeyTileSet = (): Tile[] => {
  const colors: TileColor[] = ['red', 'black', 'yellow', 'blue'];
  const values: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const tiles: Tile[] = [];

  // Her renk için iki deste oluştur
  colors.forEach(color => {
    // İlk deste
    values.forEach(value => {
      tiles.push({
        id: `${color}-${value}-1`,
        value,
        color
      });
    });

    // İkinci deste
    values.forEach(value => {
      tiles.push({
        id: `${color}-${value}-2`,
        value,
        color
      });
    });
  });

  // İki joker ekle
  tiles.push(
    {
      id: 'joker-1',
      value: 1,
      color: 'red',
      isJoker: true
    },
    {
      id: 'joker-2',
      value: 1,
      color: 'black',
      isJoker: true
    }
  );

  return tiles;
};
/**
 * Taşları karıştırır
 */
export const shuffleTiles = (tiles: Tile[]): Tile[] => {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Oyun taşlarını dağıtır
 */
export const distributeTiles = (tiles: Tile[]) => {
  const player1Tiles: Tile[] = [];
  const player2Tiles: Tile[] = [];
  const player3Tiles: Tile[] = [];
  const player4Tiles: Tile[] = [];
  const centerTiles: Tile[] = [];
  const drawPile: Tile[] = [];

  // Her oyuncuya 14 taş dağıt
  for (let i = 0; i < 14; i++) {
    player1Tiles.push(tiles.shift()!);
    player2Tiles.push(tiles.shift()!);
    player3Tiles.push(tiles.shift()!);
    player4Tiles.push(tiles.shift()!);
  }

  // Masaya 8 taş koy (açık alan)
  for (let i = 0; i < 8; i++) {
    centerTiles.push(tiles.shift()!);
  }

  // Kalan taşlar çekme havuzu
  drawPile.push(...tiles);

  return {
    player1Tiles,
    player2Tiles,
    player3Tiles,
    player4Tiles,
    centerTiles,
    drawPile,
    totalTiles: tiles.length + 56 + 8 // 56 dağıtılan + 8 merkez + kalan
  };
};

/**
 * Okey taşını belirler (gösterici taş)
 * @param centerTiles - Merkez taşları
 * @returns Okey taşı ve gösterici taş
 */
export const determineOkeyTile = (centerTiles: Tile[]): {
  indicatorTile: Tile;
  okeyTile: Tile;
} => {
  // İlk taşı gösterici olarak al (normalde ilk taş gösterici olur)
  const indicatorTile = centerTiles[0];

  // Okey taşı, gösterici taşın bir üstü olur (13'ten sonra 1 olur)
  const okeyValue = (indicatorTile.value % 13) + 1 as TileValue;
  const okeyColor = indicatorTile.color;

  return {
    indicatorTile,
    okeyTile: {
      id: `okey-${okeyColor}-${okeyValue}`,
      value: okeyValue,
      color: okeyColor,
      isOkey: true
    }
  };
};

/**
 * Oyuncunun taş çekme işlemi (tüm oyuncular için)
 */
export const drawTile = (gameState: GameState): GameState => {
  if (gameState.drawPile.length === 0) {
    return { ...gameState, gamePhase: 'finished' };
  }

  const newTile = gameState.drawPile[0];
  const newDrawPile = gameState.drawPile.slice(1);

  // İnsan oyuncusu için
  if (gameState.currentPlayer === 1) {
    return {
      ...gameState,
      playerTiles: [...gameState.playerTiles, newTile],
      drawPile: newDrawPile,
      gamePhase: 'playing',
      selectedTile: null
    };
  }

  // AI oyuncuları için
  const playerKey = `player${gameState.currentPlayer}` as keyof typeof gameState.otherPlayers;
  const currentPlayerTiles = gameState.otherPlayers[playerKey] || [];

  return {
    ...gameState,
    otherPlayers: {
      ...gameState.otherPlayers,
      [playerKey]: [...currentPlayerTiles, newTile]
    },
    drawPile: newDrawPile,
    gamePhase: 'playing',
    selectedTile: null
  };
};

/**
 * Oyuncunun taş atma işlemi (tüm oyuncular için)
 */
export const discardTile = (gameState: GameState, tileId: string): GameState => {
  // İnsan oyuncusu için
  if (gameState.currentPlayer === 1) {
    const tileIndex = gameState.playerTiles.findIndex((tile: Tile) => tile.id === tileId);
    if (tileIndex === -1) return gameState;

    const discardedTile = gameState.playerTiles[tileIndex];
    const newPlayerTiles = gameState.playerTiles.filter((tile: Tile) => tile.id !== tileId);

    return {
      ...gameState,
      playerTiles: newPlayerTiles,
      centerTiles: [...gameState.centerTiles, discardedTile],
      currentPlayer: (gameState.currentPlayer % 4) + 1,
      selectedTile: null
    };
  }

  // AI oyuncuları için
  const playerKey = `player${gameState.currentPlayer}` as keyof typeof gameState.otherPlayers;
  const playerTiles = gameState.otherPlayers[playerKey] || [];

  const tileIndex = playerTiles.findIndex((tile: Tile) => tile.id === tileId);
  if (tileIndex === -1) return gameState;

  const discardedTile = playerTiles[tileIndex];
  const newPlayerTiles = playerTiles.filter((tile: Tile) => tile.id !== tileId);

  return {
    ...gameState,
    otherPlayers: {
      ...gameState.otherPlayers,
      [playerKey]: newPlayerTiles
    },
    centerTiles: [...gameState.centerTiles, discardedTile],
    currentPlayer: (gameState.currentPlayer % 4) + 1,
    selectedTile: null
  };
};

/**
 * Sırayı sonraki oyuncuya geçirme
 */
export const nextPlayerTurn = (gameState: GameState): GameState => {
  return {
    ...gameState,
    currentPlayer: (gameState.currentPlayer % 4) + 1,
    selectedTile: null
  };
};

/**
 * Basit el kontrolü - taşları sıralayıp per olup olmadığını kontrol eder
 */
export const checkForWinningHand = (tiles: Tile[]): boolean => {
  if (tiles.length !== 14) return false;

  // Basit kontrol: tüm taşlar aynı sayıda mı? (per kontrolü için temel)
  const sortedTiles = [...tiles].sort((a, b) => a.value - b.value);

  // Aynı sayıdan 4 taş var mı kontrolü
  for (let i = 0; i <= 10; i++) {
    const count = sortedTiles.filter(tile => tile.value === i + 1).length;
    if (count >= 4) return true;
  }

  // Aynı renkten ardışık 7 taş var mı kontrolü
  const colors: TileColor[] = ['red', 'black', 'yellow', 'blue'];
  for (const color of colors) {
    const colorTiles = sortedTiles.filter(tile => tile.color === color);
    let consecutiveCount = 1;

    for (let i = 1; i < colorTiles.length; i++) {
      if (colorTiles[i].value === colorTiles[i - 1].value + 1) {
        consecutiveCount++;
        if (consecutiveCount >= 7) return true;
      } else {
        consecutiveCount = 1;
      }
    }
  }

  return false;
};

/**
 * Yapay zeka oyuncusu için hamle kararı verir (akıllı versiyon)
 */
export const makeAIMove = (gameState: GameState): GameState => {
  const currentPlayer = gameState.currentPlayer;

  // Eğer insan oyuncusuysa AI hamle yapma
  if (currentPlayer === 1) return gameState;

  // Önce mevcut oyuncunun taşlarını al
  const playerTiles = gameState.otherPlayers[`player${currentPlayer}` as keyof typeof gameState.otherPlayers] || [];

  // Eğer eli bitirebiliyorsa otomatik bitir
  if (checkForWinningHand(playerTiles)) {
    // Oyun bitirme mantığı eklenebilir
    return { ...gameState, gamePhase: 'finished' };
  }

  // AI oyuncusu için rastgele karar ver
  const shouldDrawTile = Math.random() > 0.6; // %40 taş çekme ihtimali

  if (shouldDrawTile) {
    // Taş çek
    return drawTile(gameState);
  } else {
    // Rastgele bir taş seç ve at
    if (playerTiles.length > 0) {
      const randomTile = playerTiles[Math.floor(Math.random() * playerTiles.length)];
      return discardTile(gameState, randomTile.id);
    } else {
      // Taş yoksa pas geç
      return nextPlayerTurn(gameState);
    }
  }
};

/**
 * Tüm AI oyuncularının sırayla hamle yapması için
 */
export const processAITurns = (gameState: GameState): GameState => {
  let newGameState = { ...gameState };

  // İnsan oyuncusu değilse ve oyun devam ediyorsa AI hamle yap
  while (newGameState.currentPlayer !== 1 && newGameState.gamePhase === 'playing') {
    newGameState = makeAIMove(newGameState);

    // Kısa bir gecikme simüle et (opsiyonel)
    // await new Promise(resolve => setTimeout(resolve, 100));
  }

  return newGameState;
};
