import type { Tile } from '../types';

// Okey taş setini oluştur
export const createOkeyTileSet = (): Tile[] => {
  const tiles: Tile[] = [];
  const colors: Tile['color'][] = ['red', 'black', 'yellow', 'blue'];

  // Her renk için 1-13 arası taşlar (2'şer adet)
  colors.forEach(color => {
    for (let value = 1; value <= 13; value++) {
      for (let i = 0; i < 2; i++) {
        tiles.push({
          id: `${color}_${value}_${i}`,
          value,
          color,
        });
      }
    }
  });

  return tiles;
};

// Taşları karıştır
export const shuffleTiles = (tiles: Tile[]): Tile[] => {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Taşları dağıt
export const distributeTiles = (tiles: Tile[]) => {
  const player1Tiles = tiles.slice(0, 14);
  const player2Tiles = tiles.slice(14, 28);
  const player3Tiles = tiles.slice(28, 42);
  const player4Tiles = tiles.slice(42, 56);
  const centerTiles = tiles.slice(56, 64);
  const drawPile = tiles.slice(64);

  return {
    player1Tiles,
    player2Tiles,
    player3Tiles,
    player4Tiles,
    centerTiles,
    drawPile,
  };
};

// Okey taşını belirle
export const determineOkeyTile = (centerTiles: Tile[]) => {
  if (centerTiles.length === 0) return null;

  const indicatorTile = centerTiles[0];
  let okeyValue = indicatorTile.value;

  if (okeyValue === 13) {
    okeyValue = 1;
  } else {
    okeyValue += 1;
  }

  const okeyTile = centerTiles.find(tile =>
    tile.value === okeyValue && tile.color === indicatorTile.color
  ) || indicatorTile;

  return {
    indicatorTile,
    okeyTile: { ...okeyTile, isOkey: true },
  };
};

// El kontrolü - Basit versiyon
export const checkForWinningHand = (tiles: Tile[]): boolean => {
  if (tiles.length !== 14) return false;

  // Basit kontrol: Aynı değerdeki taşlar
  const values = tiles.map(t => t.value);
  const valueCounts: { [key: number]: number } = {};

  values.forEach(value => {
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });

  // 7'lik set kontrolü (7 aynı sayı)
  const hasSevenOfAKind = Object.values(valueCounts).some(count => count >= 7);

  // Çift kontrolü (7 çift)
  const pairs = Object.values(valueCounts).filter(count => count >= 2).length;

  return hasSevenOfAKind || pairs >= 7;
};
