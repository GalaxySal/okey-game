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
  scores: {
    player1: number;
    player2: number;
    player3: number;
    player4: number;
  };
  gameStats: {
    totalGames: number;
    player1Wins: number;
    player2Wins: number;
    player3Wins: number;
    player4Wins: number;
    averageGameDuration: number;
  };
  gameStartTime: number | null;
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
  if (tiles.length !== 14) {
    // console.log(`checkForWinningHand: Incorrect tile count (${tiles.length}), returning false`);
    return false;
  }

  // Basit kontrol: tüm taşlar aynı sayıda mı? (per kontrolü için temel)
  const sortedTiles = [...tiles].sort((a, b) => a.value - b.value);

  // Aynı sayıdan 4 taş var mı kontrolü
  for (let i = 0; i <= 10; i++) {
    const count = sortedTiles.filter(tile => tile.value === i + 1).length;
    if (count >= 4) {
      console.log(`checkForWinningHand: [DEBUG] Found 4 of the same number (${i + 1}), returning true`);
      return true;
    }
  }

  // Aynı renkten ardışık 7 taş var mı kontrolü
  const colors: TileColor[] = ['red', 'black', 'yellow', 'blue'];
  for (const color of colors) {
    const colorTiles = sortedTiles.filter(tile => tile.color === color);
    let consecutiveCount = 1;

    for (let i = 1; i < colorTiles.length; i++) {
      if (colorTiles[i].value === colorTiles[i - 1].value + 1) {
        consecutiveCount++;
        if (consecutiveCount >= 7) {
          console.log(`checkForWinningHand: [DEBUG] Found 7 consecutive tiles (color: ${color}), returning true`);
          return true;
        }
      } else {
        consecutiveCount = 1;
      }
    }
  }

  // console.log('checkForWinningHand: [DEBUG] No winning hand found, returning false');
  return false;
};

/**
 * El analizi - oyuncunun taşlarını analiz eder
 */
export const analyzeHand = (tiles: Tile[]) => {
  const sortedTiles = [...tiles].sort((a, b) => a.value - b.value);
  const analysis = {
    pairs: [] as number[][], // Aynı sayıdan taşlar
    sequences: [] as number[][], // Ardışık taşlar
    colors: {} as Record<TileColor, Tile[]>,
    okeyCount: 0,
    totalTiles: tiles.length,
    canFinish: false,
    finishScore: 0 // Ne kadar bitmeye yakın (0-100)
  };

  // Renklere göre grupla
  const colors: TileColor[] = ['red', 'black', 'yellow', 'blue'];
  colors.forEach(color => {
    analysis.colors[color] = sortedTiles.filter(tile => tile.color === color);
  });

  // Okey taşlarını say
  analysis.okeyCount = tiles.filter(tile => tile.isOkey || tile.isJoker).length;

  // Aynı sayıları bul (per için)
  for (let value = 1; value <= 13; value++) {
    const sameValueTiles = sortedTiles.filter(tile => tile.value === value);
    if (sameValueTiles.length >= 2) {
      analysis.pairs.push([value, sameValueTiles.length]);
    }
  }

  // Ardışık taşları bul (el için)
  colors.forEach(color => {
    const colorTiles = analysis.colors[color];
    let consecutiveCount = 1;
    let sequenceStart = colorTiles[0]?.value || 0;

    for (let i = 1; i < colorTiles.length; i++) {
      if (colorTiles[i].value === colorTiles[i - 1].value + 1) {
        consecutiveCount++;
      } else {
        if (consecutiveCount >= 3) {
          analysis.sequences.push([sequenceStart, consecutiveCount]);
        }
        consecutiveCount = 1;
        sequenceStart = colorTiles[i].value;
      }
    }

    // Son sequence'i kontrol et
    if (consecutiveCount >= 3) {
      analysis.sequences.push([sequenceStart, consecutiveCount]);
    }
  });

  // Bitirme potansiyelini hesapla
  const maxPair = Math.max(...analysis.pairs.map(pair => pair[1]), 0);
  const maxSequence = Math.max(...analysis.sequences.map(seq => seq[1]), 0);

  // Bitirme skoru hesapla (basit algoritma)
  const pairScore = Math.min(maxPair * 20, 60); // Max 4 taş için %60
  const sequenceScore = Math.min(maxSequence * 10, 40); // Max 7 taş için %40
  analysis.finishScore = pairScore + sequenceScore;

  // Okey taşları varsa bonus puan
  if (analysis.okeyCount > 0) {
    analysis.finishScore += analysis.okeyCount * 5;
  }

  analysis.canFinish = analysis.finishScore >= 70; // %70'den fazla potansiyel varsa

  return analysis;
};

/**
 * Stratejik karar verme - AI için en iyi hamleyi seçer
 */
export const chooseBestAIMove = (gameState: GameState): 'draw' | 'discard' | 'pass' => {
  const currentPlayer = gameState.currentPlayer;
  if (currentPlayer === 1) return 'pass'; // İnsan oyuncusu değil

  const playerTiles = gameState.otherPlayers[`player${currentPlayer}` as keyof typeof gameState.otherPlayers] || [];
  const analysis = analyzeHand(playerTiles);

  // Eğer eli bitirebilecek durumdaysa taş çekmeyi tercih et
  if (analysis.canFinish && gameState.drawPile.length > 0) {
    return 'draw';
  }

  // Eğer çok az taşı varsa ve bitirme potansiyeli yüksekse çek
  if (playerTiles.length < 10 && analysis.finishScore > 50) {
    return gameState.drawPile.length > 0 ? 'draw' : 'pass';
  }

  // Eğer el doluysa ve iyi kombinasyonlar varsa at
  if (playerTiles.length >= 12 && analysis.finishScore < 30) {
    return 'discard';
  }

  // Genel strateji: %60 çekme, %40 atma
  return Math.random() > 0.4 ? 'draw' : 'discard';
};

/**
 * Atılacak en iyi taşı seçer (gelişmiş strateji)
 */
const selectBestTileToDiscard = (tiles: Tile[], analysis: any, okeyInfo: any): Tile | null => {
  if (tiles.length === 0) return null;

  // Öncelik sırası:
  // 1. Gereksiz taşları at (çok fazla olanlar)
  // 2. Sıralı olmayan taşları at
  // 3. Okey taşını en son at

  // Çok fazla olan taşları bul (3 veya daha fazla aynı sayıdan)
  const excessiveTiles = tiles.filter(tile => {
    if (tile.isJoker || (okeyInfo && tile.id === okeyInfo.okeyTile.id)) return false;
    return (analysis.pairs.find(([value, _count]: [number, number]) => value === tile.value)?.[1] || 0) > 2;
  });

  if (excessiveTiles.length > 0) {
    return excessiveTiles[Math.floor(Math.random() * excessiveTiles.length)];
  }

  // Sıralı olmayan taşları bul
  const colorTiles = new Map<TileColor, Tile[]>();
  tiles.forEach(tile => {
    if (!colorTiles.has(tile.color)) colorTiles.set(tile.color, []);
    colorTiles.get(tile.color)!.push(tile);
  });

  const nonSequentialTiles: Tile[] = [];
  colorTiles.forEach((colorGroup, _color) => {
    const sorted = [...colorGroup].sort((a, b) => a.value - b.value);
    sorted.forEach((tile, index) => {
      if (index > 0 && tile.value !== sorted[index - 1].value + 1) {
        // Sıralı olmayan taşları bul
        if (!tile.isJoker && (!okeyInfo || tile.id !== okeyInfo.okeyTile.id)) {
          nonSequentialTiles.push(tile);
        }
      }
    });
  });

  if (nonSequentialTiles.length > 0) {
    return nonSequentialTiles[Math.floor(Math.random() * nonSequentialTiles.length)];
  }

  // En düşük değerli taşı at (okey ve joker hariç)
  const discardableTiles = tiles.filter(tile =>
    !tile.isJoker && (!okeyInfo || tile.id !== okeyInfo.okeyTile.id)
  );

  if (discardableTiles.length > 0) {
    return discardableTiles.reduce((min, tile) =>
      tile.value < min.value ? tile : min
    );
  }

  // Son çare olarak rastgele taş at
  return tiles[Math.floor(Math.random() * tiles.length)];
};

/**
 * Daha akıllı AI hamle kararı
 */
export const makeSmartAIMove = (gameState: GameState): GameState => {
  const currentPlayer = gameState.currentPlayer;

  // İnsan oyuncusu değilse devam et
  if (currentPlayer === 1) return gameState;

  console.log(`AI Oyuncu ${currentPlayer} için hamle kararı alınıyor...`);

  const playerTiles = gameState.otherPlayers[`player${currentPlayer}` as keyof typeof gameState.otherPlayers] || [];

  // Önce mevcut oyuncunun taşlarını al
  const strategy = chooseBestAIMove(gameState);
  console.log(`AI Oyuncu ${currentPlayer} stratejisi: ${strategy}`);

  switch (strategy) {
    case 'draw':
      console.log(`AI Oyuncu ${currentPlayer} taş çekiyor...`);
      const afterDraw = drawTile(gameState);
      console.log(`AI Oyuncu ${currentPlayer} taş çekti. Yeni currentPlayer: ${afterDraw.currentPlayer}`);

      return afterDraw;

    case 'discard':
      // Gelişmiş taş atma stratejisi
      if (playerTiles.length > 0) {
        const analysis = analyzeHand(playerTiles);
        const tileToDiscard = selectBestTileToDiscard(playerTiles, analysis, gameState.okeyInfo);

        if (tileToDiscard) {
          console.log(`AI Oyuncu ${currentPlayer} akıllı taşı atıyor: ${tileToDiscard.value} ${tileToDiscard.color}`);
          const afterDiscard = discardTile(gameState, tileToDiscard.id);
          console.log(`AI Oyuncu ${currentPlayer} taş attı. Yeni currentPlayer: ${afterDiscard.currentPlayer}`);
          return afterDiscard;
        }
      }
      console.log(`AI Oyuncu ${currentPlayer} taş atamıyor, pas geçiyor...`);
      const afterPass = nextPlayerTurn(gameState);
      console.log(`AI Oyuncu ${currentPlayer} pas geçti. Yeni currentPlayer: ${afterPass.currentPlayer}`);
      return afterPass;

    default:
      console.log(`AI Oyuncu ${currentPlayer} pas geçiyor...`);
      const afterDefaultPass = nextPlayerTurn(gameState);
      console.log(`AI Oyuncu ${currentPlayer} default pas geçti. Yeni currentPlayer: ${afterDefaultPass.currentPlayer}`);
      return afterDefaultPass;
  }
};

/**
 * Tüm AI oyuncularının sırayla hamle yapması için
 */
export const processAITurns = (gameState: GameState): GameState => {
  let newGameState = { ...gameState };
  let turnCount = 0;
  const maxTurns = 10; // Sonsuz döngüyü önlemek için

  // İnsan oyuncusu değilse ve oyun devam ediyorsa AI hamle yap
  while (newGameState.currentPlayer !== 1 && newGameState.gamePhase === 'playing' && turnCount < maxTurns) {
    console.log(`AI Oyuncu ${newGameState.currentPlayer} hamle yapıyor...`);
    newGameState = makeSmartAIMove(newGameState);
    turnCount++;

    // Eğer oyun bittiyse veya insan oyuncusu sırası geldiyse çık
    if (newGameState.gamePhase === 'finished' || newGameState.currentPlayer === 1) {
      break;
    }
  }

  console.log(`AI hamleleri tamamlandı. Şu anki oyuncu: ${newGameState.currentPlayer}`);
  return newGameState;
};

/**
 * Kazananı tespit eder ve skoru günceller
 */
export const checkForWinner = (gameState: GameState): GameState => {
  // İnsan oyuncusu kazandı mı kontrol et
  if (checkForWinningHand(gameState.playerTiles)) {
    const gameDuration = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : 0;

    return {
      ...gameState,
      gamePhase: 'finished',
      scores: {
        ...gameState.scores,
        player1: gameState.scores.player1 + 1
      },
      gameStats: {
        ...gameState.gameStats,
        totalGames: gameState.gameStats.totalGames + 1,
        player1Wins: gameState.gameStats.player1Wins + 1,
        averageGameDuration: (gameState.gameStats.averageGameDuration * gameState.gameStats.totalGames + gameDuration) / (gameState.gameStats.totalGames + 1)
      }
    };
  }

  // AI oyuncuları için kontrol et (tüm oyuncuları kontrol et)
  for (let player = 2; player <= 4; player++) {
    const playerKey = `player${player}` as keyof typeof gameState.otherPlayers;
    const playerTiles = gameState.otherPlayers[playerKey] || [];

    if (checkForWinningHand(playerTiles)) {
      const gameDuration = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : 0;

      return {
        ...gameState,
        gamePhase: 'finished',
        scores: {
          ...gameState.scores,
          [`player${player}`]: gameState.scores[`player${player}` as keyof typeof gameState.scores] + 1
        },
        gameStats: {
          ...gameState.gameStats,
          totalGames: gameState.gameStats.totalGames + 1,
          [`player${player}Wins`]: gameState.gameStats[`player${player}Wins` as keyof typeof gameState.gameStats] + 1,
          averageGameDuration: (gameState.gameStats.averageGameDuration * gameState.gameStats.totalGames + gameDuration) / (gameState.gameStats.totalGames + 1)
        }
      };
    }
  }

  return gameState;
};

/**
 * Yeni oyun için skor sistemini başlatır
 */
export const initializeScoreSystem = () => {
  return {
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
    gameStartTime: null as number | null
  };
};
