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
    currentVersion: '1.0.3',
    latestVersion: '1.0.3'
  });

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    status: 'idle'
  });

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

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
        console.log('Tauri updater kontrolü başarılı:', update);
        console.log('Update objesi detayları:', {
          available: update?.available,
          // latestVersion mevcut değil - Tauri Update tipinde yok
          // downloadUrl mevcut değil - Tauri Update tipinde yok
          // signature mevcut değil - Tauri Update tipinde yok
          date: update?.date || 'Bilinmiyor',
          body: update?.body || 'Açıklama mevcut değil'
        });

        if (update?.available) {
          console.log(`Güncelleme mevcut`);
          console.log('Güncelleme detayları:', {
            version: '1.0.2', // Tauri updater doesn't provide version info directly
            date: update.date || 'Bilinmiyor',
            body: update.body || 'Açıklama mevcut değil'
          });

          setUpdateInfo({
            available: true,
            currentVersion,
            latestVersion: '1.0.2', // Tauri updater doesn't provide version info directly
            releaseNotes: 'Yeni sürüm mevcut! Gelişmiş özellikler ve hata düzeltmeleri içeriyor.',
            downloadSize: 'Bilinmiyor'
          });

          setUpdateStatus({ status: 'idle' });
          setShowUpdateDialog(true);
          return;
        } else {
          console.log('Tauri updater: Güncelleme bulunamadı');
        }
      } catch (tauriError: any) {
        console.error('Tauri updater detaylı hata:', {
          message: tauriError.message,
          stack: tauriError.stack,
          name: tauriError.name,
          cause: tauriError.cause
        });
        console.warn('Tauri updater kontrolü başarısız, GitHub API fallback kullanılıyor:', tauriError.message);
      }

      // Fallback: GitHub Releases API kontrolü
      console.log('GitHub API fallback kullanılıyor...');
      const response = await fetch('https://api.github.com/repos/GalaxySal/okey-game/releases/latest');

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();
      let latestVersion = release.tag_name.replace('v', '');

      // Eğer tag "main-desktop" gibi bir branch adıysa, asset dosya adlarından sürüm numarasını al
      if (latestVersion === 'main-desktop' || latestVersion.includes('main') || !latestVersion.match(/^\d+\.\d+\.\d+$/)) {
        console.log('GitHub Release tag sürüm numarası içermiyor, asset dosya adlarından tespit ediliyor...');
        
        // Asset dosya adlarından sürüm numaralarını çıkar
        const versionRegex = /(\d+\.\d+\.\d+)/;
        const versions: string[] = [];
        
        release.assets.forEach((asset: any) => {
          const match = asset.name.match(versionRegex);
          if (match) {
            versions.push(match[1]);
          }
        });

        if (versions.length > 0) {
          // En yüksek sürüm numarasını bul
          latestVersion = versions.sort((a, b) => {
            const aParts = a.split('.').map(Number);
            const bParts = b.split('.').map(Number);
            
            for (let i = 0; i < 3; i++) {
              if (aParts[i] > bParts[i]) return -1;
              if (aParts[i] < bParts[i]) return 1;
            }
            return 0;
          })[0];
          
          console.log(`Asset dosya adlarından tespit edilen sürüm: ${latestVersion}`);
        } else {
          console.warn('Asset dosya adlarından sürüm numarası bulunamadı, varsayılan 1.0.2 kullanılıyor');
          latestVersion = '1.0.2';
        }
      }

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
        setShowUpdateDialog(true); // Güncelleme bulunduğunda otomatik göster
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
        currentVersion: '1.0.3',
        latestVersion: '1.0.3'
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
    setShowUpdateDialog(false);
  };

  useEffect(() => {
    // Development ortamında auto-update'i devre dışı bırak (GitHub API rate limit)
    const ENABLE_AUTO_UPDATE = import.meta.env.VITE_ENABLE_AUTO_UPDATE !== 'false';
    
    if (!ENABLE_AUTO_UPDATE) {
      console.log('🔍 Auto-Update devre dışı (Development ortamı)');
      return;
    }

    // Uygulama başladığında güncelleme kontrolü yap
    console.log('🔍 Uygulama başlatıldı, güncelleme kontrolü başlıyor...');
    checkUpdates();
  }, []);

  return {
    updateInfo,
    updateStatus,
    showUpdateDialog,
    setShowUpdateDialog,
    checkUpdates,
    performUpdate,
    dismissUpdate
  };
};
