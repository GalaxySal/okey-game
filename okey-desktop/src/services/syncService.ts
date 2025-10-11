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

export interface SyncService {
  saveData: (data: Partial<SyncData>) => Promise<void>;
  loadData: () => Promise<SyncData>;
  syncWithCloud: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
}

class CrossPlatformSync implements SyncService {
  private readonly STORAGE_KEY = 'okey-game-sync';
  private readonly BACKUP_KEY = 'okey-game-backup';

  async saveData(data: Partial<SyncData>): Promise<void> {
    try {
      const existing = await this.loadData();
      const updated: SyncData = {
        ...existing,
        ...data,
        gameSettings: { ...existing.gameSettings, ...data.gameSettings },
        gameStats: { ...existing.gameStats, ...data.gameStats },
        preferences: { ...existing.preferences, ...data.preferences }
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(updated));

      // Cloud sync (şimdilik sadece local)
      await this.syncWithCloud();
    } catch (error) {
      console.error('Sync save error:', error);
    }
  }

  async loadData(): Promise<SyncData> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Backup'tan yükle
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        const data = JSON.parse(backup);
        localStorage.setItem(this.STORAGE_KEY, backup);
        return data;
      }

      // Varsayılan değerleri döndür
      return this.getDefaultData();
    } catch (error) {
      console.error('Sync load error:', error);
      return this.getDefaultData();
    }
  }

  async syncWithCloud(): Promise<void> {
    // Şimdilik sadece localStorage kullanıyoruz
    // Gerçek cloud sync için Firebase, Supabase vb. eklenebilir
    console.log('Cloud sync completed (localStorage)');
  }

  async exportData(): Promise<string> {
    const data = await this.loadData();
    return JSON.stringify(data, null, 2);
  }

  async importData(dataString: string): Promise<void> {
    try {
      const data: SyncData = JSON.parse(dataString);
      await this.saveData(data);
    } catch (error) {
      console.error('Sync import error:', error);
      throw new Error('Invalid data format');
    }
  }

  private getDefaultData(): SyncData {
    return {
      gameSettings: {
        language: 'tr',
        soundEnabled: true,
        musicEnabled: false,
        volume: 0.7
      },
      gameStats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        averageScore: 0
      },
      preferences: {
        theme: 'auto',
        autoSave: true,
        showTips: true
      }
    };
  }
}

export const syncService = new CrossPlatformSync();
