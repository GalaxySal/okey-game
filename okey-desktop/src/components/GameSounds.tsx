import React from 'react';
import type { Tile } from './Tile';

interface GameSoundsProps {
  selectedTile: Tile | null;
}

export const GameSounds: React.FC<GameSoundsProps> = ({
  selectedTile: _selectedTile,
}) => {
  // TODO: Ses efektleri eklenecek
  // Web Audio API şu anda çalışmıyor
  return null;
};
