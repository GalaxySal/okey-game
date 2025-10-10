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

      // GitHub Releases API'sini kullan
      const response = await fetch('https://api.github.com/repos/GalaxySal/okey-game/releases/latest');

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();

      // Mevcut sürümü package.json'dan al
      const currentVersionResponse = await fetch('/package.json');
      const packageJson = await currentVersionResponse.json();
      const currentVersion = packageJson.version || '0.2.0';

      const latestVersion = release.tag_name.replace('v', ''); // 'v1.0.0' -> '1.0.0'

      console.log(`Current: ${currentVersion}, Latest: ${latestVersion}`);

      // Sürüm karşılaştırması (basit string karşılaştırma)
      const hasUpdate = latestVersion > currentVersion;

      if (hasUpdate) {
        // Assets içinden .exe dosyasını bul
        const exeAsset = release.assets.find((asset: any) =>
          asset.name.endsWith('.exe') || asset.name.includes('okey-game')
        );

        setUpdateInfo({
          available: true,
          currentVersion,
          latestVersion,
          releaseNotes: release.body || 'Yeni sürüm mevcut! Gelişmiş özellikler ve hata düzeltmeleri içeriyor.',
          downloadSize: exeAsset ? `~${Math.round(exeAsset.size / (1024 * 1024))} MB` : 'Bilinmiyor',
          downloadUrl: exeAsset ? exeAsset.browser_download_url : release.html_url
        });

        setUpdateStatus({ status: 'idle' });
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

      // Hata durumunda varsayılan değerleri kullan
      setUpdateInfo({
        available: false,
        currentVersion: '0.2.0',
        latestVersion: '0.2.0'
      });
    }
  };

  const performUpdate = async () => {
    try {
      setUpdateStatus({ status: 'downloading', progress: 0 });

      // Tauri updater kullanarak gerçek güncelleme
      const { check } = await import('@tauri-apps/plugin-updater');

      // Güncelleme kontrolü ve yükleme
      const update = await check();

      if (update?.available) {
        // İndirme ve yükleme
        await update.downloadAndInstall();

        // Güncelleme tamamlandı bilgisi
        console.log('Güncelleme başarıyla yüklendi!');

        // Uygulamayı yeniden başlatmak için kullanıcıya bilgi ver
        if (confirm('Güncelleme yüklendi. Uygulama yeniden başlatılacak. Devam etmek istiyor musunuz?')) {
          const { relaunch } = await import('@tauri-apps/plugin-process');
          await relaunch();
        }
      } else {
        console.log('Güncelleme bulunamadı veya zaten güncel');
        setUpdateStatus({ status: 'idle' });
      }

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
