import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultiplayer } from '../contexts/MultiplayerContext';

interface MultiplayerLobbyProps {
  onStartGame: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onStartGame }) => {
  const { t } = useTranslation();
  const { isConnected, players, currentRoom, joinRoom, leaveRoom } = useMultiplayer();
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleCreateRoom = () => {
    if (playerName && isConnected) {
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      joinRoom(newRoomId);
      setRoomId(newRoomId);
    }
  };

  const handleJoinRoom = () => {
    if (roomId && playerName && isConnected) {
      joinRoom(roomId);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setRoomId('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-red-800 p-8 rounded-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{t('multiplayer.connectionError', 'Bağlantı Hatası')}</h2>
          <p>{t('multiplayer.reconnecting', 'Yeniden bağlanıyor...')}</p>
        </div>
      </div>
    );
  }

  if (currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg text-white max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('multiplayer.roomId', 'Oda Kodu')}: {currentRoom}
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {t('multiplayer.playersOnline', 'Çevrimiçi Oyuncular')} ({players.length})
            </h3>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={index} className="bg-green-700 p-3 rounded">
                  {player} {index === 0 ? '👑' : ''}
                </div>
              ))}
            </div>
          </div>

          {players.length >= 2 ? (
            <button
              onClick={onStartGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold transition-colors"
            >
              {t('multiplayer.gameStarted', 'Oyunu Başlat')}
            </button>
          ) : (
            <div className="text-center text-yellow-300">
              {t('multiplayer.waitingForPlayers', 'Oyuncular bekleniyor...')}
            </div>
          )}

          <button
            onClick={handleLeaveRoom}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {t('multiplayer.leaveRoom', 'Odadan Ayrıl')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg text-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t('multiplayer.title', 'Çoklu Oyuncu Lobisi')}
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t('multiplayer.playerName', 'Oyuncu Adı')}
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder={t('multiplayer.enterPlayerName', 'Oyuncu adınızı girin')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleCreateRoom}
            disabled={!playerName}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-bold transition-colors"
          >
            {t('multiplayer.createRoom', 'Oda Oluştur')}
          </button>

          <button
            onClick={handleJoinRoom}
            disabled={!roomId || !playerName}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-bold transition-colors"
          >
            {t('multiplayer.joinRoom', 'Odaya Katıl')}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t('multiplayer.roomId', 'Oda Kodu')}
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white uppercase"
            placeholder={t('multiplayer.enterRoomId', 'Oda kodunu girin')}
            maxLength={6}
          />
        </div>

        <div className="text-center text-sm text-gray-400">
          {t('multiplayer.lobbyInfo', 'Oda oluşturun veya mevcut bir odaya katılın')}
        </div>
      </div>
    </div>
  );
};
