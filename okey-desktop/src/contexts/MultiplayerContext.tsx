import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

interface MultiplayerContextType {
  socket: Socket | null;
  isConnected: boolean;
  players: string[];
  currentRoom: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
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

    newSocket.on('room_joined', (data: { roomId: string; players: string[] }) => {
      setCurrentRoom(data.roomId);
      setPlayers(data.players);
      console.log(t('multiplayer.roomJoined', 'Odaya katılınıdı:'), data.roomId);
    });

    newSocket.on('player_joined', (playerName: string) => {
      setPlayers(prev => [...prev, playerName]);
      console.log(t('multiplayer.playerJoined', 'Oyuncu katıldı:'), playerName);
    });

    newSocket.on('player_left', (playerName: string) => {
      setPlayers(prev => prev.filter(p => p !== playerName));
      console.log(t('multiplayer.playerLeft', 'Oyuncu ayrıldı:'), playerName);
    });

    newSocket.on('game_state_update', (gameState: Record<string, unknown>) => {
      console.log(t('multiplayer.gameStateUpdate', 'Oyun durumu güncellendi:'), gameState);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [t]);

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
    joinRoom,
    leaveRoom,
    sendGameMove,
    onGameStateUpdate
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};
