import React, { useEffect } from 'react';
import { playTileSelectSound, playTileDrawSound, playTileDiscardSound, playButtonClickSound, playGameWinSound } from '../utils/soundEffects';
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

  // Çekme işlemi için ses
  const handleDrawSound = () => {
    playTileDrawSound();
  };

  // Atma işlemi için ses
  const handleDiscardSound = () => {
    playTileDiscardSound();
  };

  // Pas geçme için ses
  const handlePassSound = () => {
    playButtonClickSound();
  };

  // Kazanma için ses
  const handleWinSound = () => {
    playGameWinSound();
  };

  // Ses efektlerini oyun fonksiyonlarına bağlama
  useEffect(() => {
    // Bu fonksiyonları global olarak erişilebilir hale getirebiliriz
    (window as any).gameSounds = {
      handleDrawSound,
      handleDiscardSound,
      handlePassSound,
      handleWinSound
    };
  }, [handleDrawSound, handleDiscardSound, handlePassSound, handleWinSound]);

  return null; // Bu component sadece ses efektlerini yönetir, görünür bir şey render etmez
};
