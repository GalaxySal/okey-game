import React from 'react';
import { useFPS } from '../hooks/useFPS';

interface FPSCounterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const FPSCounter: React.FC<FPSCounterProps> = ({ position = 'top-right' }) => {
  const fps = useFPS();

  // FPS değerine göre renk belirle
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400'; // Mükemmel (60 FPS'e yakın)
    if (fps >= 45) return 'text-yellow-400'; // İyi (45-55 FPS)
    if (fps >= 30) return 'text-orange-400'; // Orta (30-45 FPS)
    return 'text-red-400'; // Düşük (30 FPS altı)
  };

  // Pozisyon CSS class'ı
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClass()} z-50 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg border border-gray-700`}>
      <div className="flex items-center gap-2 text-sm font-mono">
        <span className="text-gray-400">FPS:</span>
        <span className={`font-bold ${getFPSColor(fps)}`}>{fps}</span>
      </div>
    </div>
  );
};
