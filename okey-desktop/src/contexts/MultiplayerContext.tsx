import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

interface Room {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  isPrivate: boolean;
  gameStarted: boolean;
}

interface MultiplayerContextType {
  socket: Socket | null;
  isConnected: boolean;
  players: string[];
  currentRoom: string | null;
  rooms: Room[];
  isLoading: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  createRoom: (roomData: { name: string; isPrivate?: boolean; maxPlayers?: number }) => void;
  refreshRooms: () => void;
  sendGameMove: (move: Record<string, unknown>) => void;
  onGameStateUpdate: (callback: (gameState: Record<string, unknown>) => void) => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

interface MultiplayerProviderProps {
  children: ReactNode;
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Socket.io bağlantısı
    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001');

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log(t('multiplayer.connected', 'Multiplayer bağlantısı kuruldu'));
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log(t('multiplayer.disconnected', 'Multiplayer bağlantısı kesildi'));
    });

    newSocket.on('room_created', (room: Room) => {
      setRooms((prev: Room[]) => [...prev, room]);
      console.log(t('multiplayer.roomCreated', 'Oda oluşturuldu:'), room.name);
    });

    newSocket.on('room_deleted', (roomId: string) => {
      setRooms((prev: Room[]) => prev.filter((room: Room) => room.id !== roomId));
      console.log(t('multiplayer.roomDeleted', 'Oda silindi:'), roomId);
    });

    newSocket.on('rooms_list', (roomsList: Room[]) => {
      setRooms(roomsList);
      console.log(t('multiplayer.roomsUpdated', 'Oda listesi güncellendi'));
    });

    newSocket.on('player_joined', (playerName: string) => {
      setPlayers((prev: string[]) => [...prev, playerName]);
      console.log(t('multiplayer.playerJoined', 'Oyuncu katıldı:'), playerName);
    });

    newSocket.on('player_left', (playerName: string) => {
      setPlayers((prev: string[]) => prev.filter((p: string) => p !== playerName));
      console.log(t('multiplayer.playerLeft', 'Oyuncu ayrıldı:'), playerName);
    });

    newSocket.on('game_state_update', (gameState: Record<string, unknown>) => {
      console.log(t('multiplayer.gameStateUpdate', 'Oyun durumu güncellendi:'), gameState);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', { roomId });
    }
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave_room', { roomId: currentRoom });
      setCurrentRoom(null);
      setPlayers([]);
    }
  };

  const sendGameMove = (move: Record<string, unknown>) => {
    if (socket && currentRoom) {
      socket.emit('game_move', { roomId: currentRoom, move });
    }
  };

  const createRoom = (roomData: { name: string; isPrivate?: boolean; maxPlayers?: number }) => {
    if (socket && isConnected) {
      setIsLoading(true);
      socket.emit('create_room', {
        name: roomData.name,
        isPrivate: roomData.isPrivate || false,
        maxPlayers: roomData.maxPlayers || 4
      });
    }
  };

  const refreshRooms = () => {
    if (socket && isConnected) {
      socket.emit('get_rooms');
    }
  };

  const onGameStateUpdate = (callback: (gameState: Record<string, unknown>) => void) => {
    if (socket) {
      socket.on('game_state_update', callback);
    }
  };

  const value: MultiplayerContextType = {
    socket,
    isConnected,
    players,
    currentRoom,
    rooms,
    isLoading,
    joinRoom,
    leaveRoom,
    createRoom,
    refreshRooms,
    sendGameMove,
    onGameStateUpdate
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};
