import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '../contexts/MultiplayerContext';

interface Room {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  isPrivate: boolean;
  gameStarted: boolean;
}

interface RoomSelectionProps {
  onBackToMenu: () => void;
  onJoinRoom: (roomId: string) => void;
}

export const RoomSelection: React.FC<RoomSelectionProps> = ({
  onBackToMenu,
  onJoinRoom
}) => {
  const { socket, isConnected, joinRoom, rooms, createRoom, refreshRooms } = useMultiplayer();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socket && isConnected) {
      // Oda listesini al
      refreshRooms();

      // Oda listesi güncellemelerini dinle
      socket.on('rooms_list', (_roomsList: Room[]) => {
        // Rooms artık context'ten geliyor, burada bir şey yapmamıza gerek yok
      });

      // Yeni oda oluşturulduğunda
      socket.on('room_created', (_room: Room) => {
        // Rooms artık context'ten geliyor, burada bir şey yapmamıza gerek yok
      });

      return () => {
        socket.off('rooms_list');
        socket.off('room_created');
      };
    }
  }, [socket, isConnected, refreshRooms]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    setLoading(true);
    try {
      createRoom({
        name: newRoomName.trim(),
        isPrivate: isPrivateRoom,
        maxPlayers: 4
      });

      setNewRoomName('');
      setIsPrivateRoom(false);
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Oda oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (socket && isConnected) {
      joinRoom(roomId);
      onJoinRoom(roomId);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-red-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <h3 className="text-white text-xl mb-2">Bağlantı Bekleniyor</h3>
          <p className="text-gray-300">Sunucuya bağlanılıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌐 Çoklu Oyuncu Odaları</h1>
          <p className="text-blue-200 text-lg">Mevcut odalara katılın veya yeni oda oluşturun</p>
        </div>

        {/* Oda Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rooms.map((room: Room) => (
            <div
              key={room.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
                room.gameStarted
                  ? 'border-gray-600 opacity-60'
                  : 'border-blue-500 hover:border-blue-400 hover:shadow-lg cursor-pointer'
              }`}
              onClick={() => !room.gameStarted && handleJoinRoom(room.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-bold">{room.name}</h3>
                {room.isPrivate && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Özel</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Oyuncular:</span>
                  <span className="text-white">{room.players.length}/{room.maxPlayers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Durum:</span>
                  <span className={`font-semibold ${room.gameStarted ? 'text-red-400' : 'text-green-400'}`}>
                    {room.gameStarted ? 'Oyun Başladı' : 'Bekliyor'}
                  </span>
                </div>
              </div>

              {!room.gameStarted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRoom(room.id);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Katıl
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Oda Bulunamadı */}
        {rooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-white text-2xl mb-2">Henüz Oda Yok</h3>
            <p className="text-blue-200 mb-6">İlk odayı oluşturarak oyuna başlayın!</p>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowCreateRoom(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
          >
            ➕ Yeni Oda Oluştur
          </button>

          <button
            onClick={onBackToMenu}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-lg font-bold text-lg transition-all duration-200"
          >
            ← Ana Menü
          </button>
        </div>

        {/* Oda Oluşturma Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border-2 border-green-500">
              <h3 className="text-white text-2xl font-bold mb-6 text-center">Yeni Oda Oluştur</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Oda Adı
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Oda adını girin..."
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    maxLength={50}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privateRoom"
                    checked={isPrivateRoom}
                    onChange={(e) => setIsPrivateRoom(e.target.checked)}
                    className="mr-2 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="privateRoom" className="text-white text-sm">
                    Özel Oda (Şifre korumalı)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim() || loading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    newRoomName.trim() && !loading
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Oluşturuluyor...
                    </div>
                  ) : (
                    'Oluştur'
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowCreateRoom(false);
                    setNewRoomName('');
                    setIsPrivateRoom(false);
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
