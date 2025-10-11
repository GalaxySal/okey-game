import React, { useEffect, useCallback } from 'react';
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
  const handleDrawSound = useCallback(() => {
    playTileDrawSound();
  }, []);

  // Atma işlemi için ses
  const handleDiscardSound = useCallback(() => {
    playTileDiscardSound();
  }, []);

  // Pas geçme için ses
  const handlePassSound = useCallback(() => {
    playButtonClickSound();
  }, []);

  // Kazanma için ses
  const handleWinSound = useCallback(() => {
    playGameWinSound();
  }, []);

  // Ses efektlerini oyun fonksiyonlarına bağlama
  useEffect(() => {
    // Bu fonksiyonları global olarak erişilebilir hale getirebiliriz
    const gameSoundsObj = {
      handleDrawSound,
      handleDiscardSound,
      handlePassSound,
      handleWinSound
    };

    (window as unknown as { gameSounds?: typeof gameSoundsObj }).gameSounds = gameSoundsObj;
  }, [handleDrawSound, handleDiscardSound, handlePassSound, handleWinSound]);

  return null; // Bu component sadece ses efektlerini yönetir, görünür bir şey render etmez
};
