import React from 'react';

interface GameOverDialogProps {
  onRestart: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Oyun Bitti!</h2>
        <p className="mb-4">Çekilecek taş kalmadı.</p>
        <button
          onClick={onRestart}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
        >
          Ana Menüye Dön
        </button>
      </div>
    </div>
  );
};

export default GameOverDialog;