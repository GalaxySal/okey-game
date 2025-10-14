import { useEffect, useState } from 'react';

interface UpdateStatus {
  status: 'idle' | 'checking' | 'downloading' | 'ready' | 'error';
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
    currentVersion: '1.0.2',
    latestVersion: '1.0.2'
  });

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    status: 'idle'
  });

  const checkUpdates = async () => {
    try {
      setUpdateStatus({ status: 'checking' });

      // Mevcut sürümü package.json'dan al
      const currentVersionResponse = await fetch('/package.json');
      const packageJson = await currentVersionResponse.json();
      const currentVersion = packageJson.version || '1.0.0';

      // Tauri updater'ı kullanarak güncelleme kontrolü yap
      const { check } = await import('@tauri-apps/plugin-updater');

      try {
        const update = await check();

        if (update?.available) {
          console.log(`Güncelleme mevcut`);

          setUpdateInfo({
            available: true,
            currentVersion,
            latestVersion: '1.0.1', // Tauri updater doesn't provide version info directly
            releaseNotes: 'Yeni sürüm mevcut! Gelişmiş özellikler ve hata düzeltmeleri içeriyor.',
            downloadSize: 'Bilinmiyor'
          });

          setUpdateStatus({ status: 'idle' });
          return;
        }
      } catch (tauriError) {
        console.warn('Tauri updater kontrolü başarısız, GitHub API fallback kullanılıyor:', tauriError);
      }

      // Fallback: GitHub Releases API kontrolü
      console.log('GitHub API fallback kullanılıyor...');
      const response = await fetch('https://api.github.com/repos/GalaxySal/okey-game/releases/latest');

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', '');

      console.log(`Current: ${currentVersion}, Latest: ${latestVersion}`);

      // Sürüm karşılaştırması için semver benzeri karşılaştırma
      const compareVersions = (v1: string, v2: string): number => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
          const part1 = parts1[i] || 0;
          const part2 = parts2[i] || 0;

          if (part1 > part2) return 1;
          if (part1 < part2) return -1;
        }

        return 0;
      };

      const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;

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
        currentVersion: '1.0.2',
        latestVersion: '1.0.2'
      });
    }
  };

  const performUpdate = async () => {
    try {
      setUpdateStatus({ status: 'downloading' });

      // Tauri updater kullanarak gerçek güncelleme
      const { check } = await import('@tauri-apps/plugin-updater');

      // Güncelleme kontrolü ve yükleme
      const update = await check();

      if (update?.available) {
        console.log(`Güncelleme indiriliyor`);

        // İndirme ve yükleme - progress callback'i düzeltildi
        await update.downloadAndInstall();

        // Güncelleme tamamlandı bilgisi
        console.log('Güncelleme başarıyla yüklendi!');
        setUpdateStatus({ status: 'ready' });

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
    // Güncelleme dialog'u artık otomatik gösterilmiyor, sadece bilgi amaçlı
    console.log('Güncelleme bilgisi kapatıldı');
  };

  useEffect(() => {
    // Uygulama başladığında güncelleme kontrolü yap
    checkUpdates();
  }, []);

  return {
    updateInfo,
    updateStatus,
    checkUpdates,
    performUpdate,
    dismissUpdate
  };
};
