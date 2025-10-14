export type TileColor = 'red' | 'black' | 'yellow' | 'blue';
export type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Tile {
  id: string;
  value: TileValue;
  color: TileColor;
  isJoker?: boolean;
  isOkey?: boolean;
}

export interface GameState {
  playerTiles: Tile[];
  otherPlayers: {
    player2: Tile[];
    player3: Tile[];
    player4: Tile[];
  };
  centerTiles: Tile[];
  drawPile: Tile[];
  okeyInfo: {
    indicatorTile: Tile;
    okeyTile: Tile;
  } | null;
  currentPlayer: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  selectedTile: Tile | null;
  scores: {
    player1: number;
    player2: number;
    player3: number;
    player4: number;
  };
  gameStats: {
    totalGames: number;
    player1Wins: number;
    player2Wins: number;
    player3Wins: number;
    player4Wins: number;
    averageGameDuration: number;
  };
  gameStartTime: number | null;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface GameState {
  playerTiles: Tile[];
  otherPlayers: {
    player2: Tile[];
    player3: Tile[];
    player4: Tile[];
  };
  centerTiles: Tile[];
  drawPile: Tile[];
  okeyInfo: {
    indicatorTile: Tile;
    okeyTile: Tile;
  } | null;
  currentPlayer: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  selectedTile: Tile | null;
  scores: {
    player1: number;
    player2: number;
    player3: number;
    player4: number;
  };
  gameStats: {
    totalGames: number;
    player1Wins: number;
    player2Wins: number;
    player3Wins: number;
    player4Wins: number;
    averageGameDuration: number;
  };
  gameStartTime: number | null;
}

export interface SyncData {
  gameSettings: {
    language: string;
    soundEnabled: boolean;
    musicEnabled: boolean;
    volume: number;
  };
  gameStats: {
    totalGames: number;
    wins: number;
    losses: number;
    averageScore: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    autoSave: boolean;
    showTips: boolean;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  level: number;
  experience: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  favoriteColor: TileColor;
  achievements: Achievement[];
  friends: string[];
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface FriendRequest {
  id: string;
  fromUser: UserProfile;
  toUser: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  fromUser: UserProfile;
  toUser: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'single_elimination' | 'round_robin' | 'swiss';
  maxPlayers: number;
  currentPlayers: number;
  entryFee?: number;
  prizePool: number;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdBy: string;
  participants: TournamentParticipant[];
  rounds: TournamentRound[];
  currentRound?: number;
}

export interface TournamentParticipant {
  userId: string;
  username: string;
  avatar?: string;
  seed?: number;
  currentRound: number;
  isEliminated: boolean;
  wins: number;
  losses: number;
  points: number;
  joinedAt: Date;
}

export interface TournamentRound {
  id: string;
  roundNumber: number;
  matches: TournamentMatch[];
  status: 'pending' | 'in_progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface TournamentMatch {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'bye';
  startTime?: Date;
  endTime?: Date;
  gameRoomId?: string;
}

export interface TournamentBracket {
  rounds: TournamentRound[];
  currentRound: number;
  totalRounds: number;
  winner?: string;
}

export interface TournamentStats {
  totalTournaments: number;
  tournamentsWon: number;
  bestPlacement: number;
  averagePlacement: number;
  totalPrizeMoney: number;
  favoriteTournamentType: string;
}
