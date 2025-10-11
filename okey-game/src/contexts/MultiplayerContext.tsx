import { useContext, createContext } from 'react';

interface MultiplayerContextType {
  socket: unknown;
  isConnected: boolean;
  players: string[];
  currentRoom: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendGameMove: (move: Record<string, unknown>) => void;
  onGameStateUpdate: (callback: (gameState: Record<string, unknown>) => void) => void;
}

const MultiplayerContextTemp = createContext<MultiplayerContextType | undefined>(undefined);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContextTemp);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};
