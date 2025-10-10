import { useEffect, useState } from 'react';

interface UpdateStatus {
  status: 'idle' | 'checking' | 'downloading' | 'ready' | 'error';
  progress?: number;
  error?: string;
}

interface UpdateInfo {
  available: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes?: string;
  downloadSize?: string;
  downloadUrl?: string;
}

export const useAppUpdater = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    available: false,
    currentVersion: '0.2.0',
    latestVersion: '0.2.0'
  });

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    status: 'idle'
  });

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const checkUpdates = async () => {
    try {
      setUpdateStatus({ status: 'checking' });

      // Şimdilik simüle edilmiş güncelleme kontrolü
      await new Promise(resolve => setTimeout(resolve, 1500));

      const currentVersion = '0.2.0';
      const latestVersion = '0.2.1'; // Test için daha yeni versiyon simüle ediyoruz

      // Test için her zaman güncelleme var gibi davran
      const hasUpdate = true; // Test için true

      if (hasUpdate) {
        setUpdateInfo({
          available: true,
          currentVersion,
          latestVersion,
          releaseNotes: '🎮 Yeni özellikler: Gelişmiş AI, yeni animasyonlar ve performans iyileştirmeleri!\n🐛 Hata düzeltmeleri: Oyun stabilitesi artırıldı.',
          downloadSize: '~12 MB',
          downloadUrl: 'https://github.com/nazimpala/okey-game/releases/download/v0.2.1/okey-game_0.2.1.exe'
        });

        setUpdateStatus({ status: 'idle' });
        // OTOMATİK GÖSTER - Güncelleme varsa hemen dialog göster
        setShowUpdateDialog(true);
      } else {
        setUpdateInfo({
          available: false,
          currentVersion,
          latestVersion: currentVersion,
          releaseNotes: 'Uygulama güncel'
        });
        setUpdateStatus({ status: 'idle' });
      }

    } catch (error) {
      console.error('Güncelleme kontrolü başarısız:', error);
      setUpdateStatus({
        status: 'error',
        error: 'Güncelleme kontrolü başarısız oldu'
      });
    }
  };

  const performUpdate = async () => {
    try {
      setUpdateStatus({ status: 'downloading', progress: 0 });

      // Simüle edilmiş indirme süreci
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setUpdateStatus({ status: 'downloading', progress: i });
      }

      setUpdateStatus({ status: 'ready' });
      setShowUpdateDialog(false);

      // Simülasyon tamamlandı bilgisi
      console.log('Güncelleme simülasyonu tamamlandı!');

      // Gerçek güncelleme sistemi için Tauri updater kullanılacak
      // const { downloadAndInstall } = await import('@tauri-apps/plugin-updater');
      // await downloadAndInstall();

    } catch (error) {
      console.error('Güncelleme yükleme başarısız:', error);
      setUpdateStatus({
        status: 'error',
        error: 'Güncelleme yükleme başarısız oldu'
      });
    }
  };

  const dismissUpdate = () => {
    setShowUpdateDialog(false);
  };

  useEffect(() => {
    // Uygulama başladığında güncelleme kontrolü yap
    checkUpdates();
  }, []);

  return {
    updateInfo,
    updateStatus,
    showUpdateDialog,
    checkUpdates,
    performUpdate,
    dismissUpdate
  };
};
