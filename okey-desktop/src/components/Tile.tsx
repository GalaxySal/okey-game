import React from 'react';

export type TileColor = 'red' | 'black' | 'yellow' | 'blue';
export type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Tile {
  id: string;
  value: TileValue;
  color: TileColor;
  isJoker?: boolean;
  isOkey?: boolean;
}

interface TileProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: (tile: Tile) => void;
  className?: string;
}

const colorStyles = {
  red: 'bg-red-500 border-red-600',
  black: 'bg-gray-800 border-gray-900',
  yellow: 'bg-yellow-400 border-yellow-500 text-black',
  blue: 'bg-blue-500 border-blue-600'
};

const colorSymbols = {
  red: '♦',
  black: '♠',
  yellow: '◊',
  blue: '♣'
};

export const TileComponent: React.FC<TileProps> = ({
  tile,
  isSelected = false,
  onClick,
  className = ""
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tile);
    }
  };

  const displayValue = tile.isJoker ? '★' : tile.isOkey ? 'OKEY' : tile.value;

  return (
    <div
      className={`
        w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-white font-bold text-sm relative transform
        ${colorStyles[tile.color]}
        ${isSelected ? 'ring-4 ring-white scale-110 shadow-2xl z-10' : 'hover:scale-105 hover:shadow-lg hover:-translate-y-1'}
        ${onClick ? 'hover:shadow-lg active:scale-95' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Sol üst köşe - renk sembolü */}
      <div className="absolute top-1 left-1 text-xs opacity-75 transition-opacity duration-200">
        {colorSymbols[tile.color]}
      </div>

      {/* Merkez - sayı/değer */}
      <div className="text-center leading-none transition-transform duration-200">
        {displayValue}
      </div>

      {/* Sağ alt köşe - ters renk sembolü */}
      <div className="absolute bottom-1 right-1 text-xs opacity-75 transform rotate-180 transition-transform duration-200">
        {colorSymbols[tile.color]}
      </div>

      {/* Parlama efekti seçili taş için */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg bg-white opacity-20 animate-pulse"></div>
      )}
    </div>
  );
};
