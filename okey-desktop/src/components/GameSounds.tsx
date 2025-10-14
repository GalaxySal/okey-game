import React, { useEffect } from 'react';
import { playTileSelectSound } from '../utils/soundEffects';
import type { Tile } from './Tile';

interface GameSoundsProps {
  selectedTile: Tile | null;
}

export const GameSounds: React.FC<GameSoundsProps> = ({
  selectedTile,
}) => {
  // Taş seçildiğinde ses efekti
  useEffect(() => {
    if (selectedTile) {
      playTileSelectSound();
    }
  }, [selectedTile]);

  return null; // Bu component sadece ses efektlerini yönetir, görünür bir şey render etmez
};
