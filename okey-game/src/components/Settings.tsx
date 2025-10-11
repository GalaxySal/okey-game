import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncService } from '../services/syncService';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    language: 'tr',
    soundEnabled: true,
    musicEnabled: false,
    volume: 0.7,
    theme: 'auto' as 'light' | 'dark' | 'auto',
    autoSave: true,
    showTips: true
  });

  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    averageScore: 0
  });

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await syncService.loadData();
      setSettings({
        language: data.gameSettings.language,
        soundEnabled: data.gameSettings.soundEnabled,
        musicEnabled: data.gameSettings.musicEnabled,
        volume: data.gameSettings.volume,
        theme: data.preferences.theme,
        autoSave: data.preferences.autoSave,
        showTips: data.preferences.showTips
      });
      i18n.changeLanguage(data.gameSettings.language);
    } catch (error) {
      console.error('Settings load error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await syncService.loadData();
      setStats(data.gameStats);
    } catch (error) {
      console.error('Stats load error:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await syncService.saveData({
        gameSettings: {
          language: settings.language,
          soundEnabled: settings.soundEnabled,
          musicEnabled: settings.musicEnabled,
          volume: settings.volume
        },
        preferences: {
          theme: settings.theme,
          autoSave: settings.autoSave,
          showTips: settings.showTips
        }
      });
      i18n.changeLanguage(settings.language);
    } catch (error) {
      console.error('Settings save error:', error);
    }
  };

  const exportData = async () => {
    try {
      const data = await syncService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'okey-game-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await syncService.importData(text);
      await loadSettings();
      await loadStats();
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t('settings.title', 'Ayarlar')}</h1>
          <p className="text-gray-300">{t('settings.subtitle', 'Oyun ayarlarını ve istatistikleri yönetin')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('settings.gameSettings', 'Oyun Ayarları')}</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">{t('settings.language', 'Dil')}</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-white">{t('settings.soundEffects', 'Ses Efektleri')}</label>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-white mb-2">{t('settings.volume', 'Ses Seviyesi')}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-gray-400 text-sm mt-1">{Math.round(settings.volume * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('settings.gameStats', 'Oyun İstatistikleri')}</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-white">
                <span>{t('settings.totalGames', 'Toplam Oyun')}:</span>
                <span className="font-bold">{stats.totalGames}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>{t('settings.wins', 'Kazanmalar')}:</span>
                <span className="font-bold text-green-400">{stats.wins}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>{t('settings.losses', 'Kaybetmeler')}:</span>
                <span className="font-bold text-red-400">{stats.losses}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>{t('settings.averageScore', 'Ortalama Skor')}:</span>
                <span className="font-bold">{Math.round(stats.averageScore)}</span>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">{t('settings.dataManagement', 'Veri Yönetimi')}</h2>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={saveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
              >
                {t('settings.saveSettings', 'Ayarları Kaydet')}
              </button>

              <button
                onClick={exportData}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
              >
                {t('settings.exportData', 'Veriyi Dışa Aktar')}
              </button>

              <label className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-bold transition-colors cursor-pointer">
                {t('settings.importData', 'Veriyi İçe Aktar')}
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              {t('settings.syncInfo', 'Cross-platform senkronizasyon aktif. Tüm cihazlarınızda aynı ayarları kullanabilirsiniz.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
