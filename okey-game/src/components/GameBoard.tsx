import React from 'react';

interface GameBoardProps {
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ className = "" }) => {
  return (
    <div className={`bg-green-800 rounded-lg p-4 shadow-lg ${className}`}>
      {/* Oyun Tahtası Başlığı */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">OKEY OYUN TAHTASI</h2>
        <div className="flex justify-center space-x-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-lg font-bold mb-2">
              P1
            </div>
            <span className="text-sm">Oyuncu 1</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold mb-2">
              P2
            </div>
            <span className="text-sm">Oyuncu 2</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-lg font-bold mb-2">
              P3
            </div>
            <span className="text-sm">Oyuncu 3</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-lg font-bold mb-2">
              P4
            </div>
            <span className="text-sm">Oyuncu 4</span>
          </div>
        </div>
      </div>

      {/* Oyun Alanı */}
      <div className="bg-green-700 rounded-lg p-6 min-h-[400px]">
        {/* Merkez - Açık Alan */}
        <div className="flex justify-center items-center h-full">
          <div className="text-center text-white">
            <div className="text-4xl mb-4">🎲</div>
            <p className="text-lg">Oyun Başlamak İçin Hazır</p>
            <p className="text-sm opacity-75">Taşlar karılıyor...</p>
          </div>
        </div>
      </div>

      {/* Oyun Bilgileri */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-white text-sm">
        <div className="bg-green-900 p-3 rounded">
          <div className="font-bold">Oyun Durumu</div>
          <div>Bekleniyor...</div>
        </div>
        <div className="bg-green-900 p-3 rounded">
          <div className="font-bold">Sıradaki Oyuncu</div>
          <div>Henüz belirlenmedi</div>
        </div>
      </div>
    </div>
  );
};
