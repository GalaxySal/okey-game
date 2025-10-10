interface UpdateDialogProps {
  updateInfo: {
    available: boolean;
    currentVersion: string;
    latestVersion: string;
    releaseNotes?: string;
    downloadSize?: string;
  };
  updateStatus: {
    status: 'idle' | 'checking' | 'downloading' | 'ready' | 'error';
    progress?: number;
    error?: string;
  };
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  updateInfo,
  updateStatus,
  onUpdate,
  onDismiss
}) => {
  if (!updateInfo.available) return null;

  const getStatusMessage = () => {
    switch (updateStatus.status) {
      case 'checking':
        return 'Güncelleme kontrol ediliyor...';
      case 'downloading':
        return `Güncelleme indiriliyor... ${updateStatus.progress}%`;
      case 'ready':
        return 'Güncelleme hazır! Uygulama yeniden başlatılacak.';
      case 'error':
        return updateStatus.error || 'Güncelleme hatası oluştu';
      default:
        return 'Yeni güncelleme mevcut!';
    }
  };

  const getStatusColor = () => {
    switch (updateStatus.status) {
      case 'checking':
      case 'downloading':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'ready':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-green-600 hover:bg-green-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Yeni Güncelleme Mevcut!
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {getStatusMessage()}
            </p>
          </div>

          {/* Güncelleme Detayları */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Mevcut Sürüm:</span>
                <span className="text-white">{updateInfo.currentVersion}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Yeni Sürüm:</span>
                <span className="text-green-400 font-semibold">{updateInfo.latestVersion}</span>
              </div>
              {updateInfo.downloadSize && (
                <div className="flex justify-between text-gray-300">
                  <span>Boyut:</span>
                  <span className="text-white">{updateInfo.downloadSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sürüm Notları */}
          {updateInfo.releaseNotes && (
            <div className="bg-gray-700 rounded-lg p-3 mb-4 text-left">
              <h4 className="text-white font-semibold text-sm mb-2">Yenilikler:</h4>
              <p className="text-gray-300 text-sm">{updateInfo.releaseNotes}</p>
            </div>
          )}

          {/* İlerleme Çubuğu */}
          {updateStatus.status === 'downloading' && updateStatus.progress !== undefined && (
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${updateStatus.progress}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm mt-2">{updateStatus.progress}% tamamlandı</p>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-3">
            {updateStatus.status !== 'downloading' && updateStatus.status !== 'ready' && (
              <>
                <button
                  onClick={onDismiss}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Sonra
                </button>
                <button
                  onClick={onUpdate}
                  disabled={updateStatus.status === 'checking'}
                  className={`flex-1 ${getStatusColor()} text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50`}
                >
                  {updateStatus.status === 'checking' ? 'Kontrol Ediliyor...' : 'Güncelle'}
                </button>
              </>
            )}

            {updateStatus.status === 'ready' && (
              <div className="w-full text-center">
                <p className="text-green-400 font-semibold">Güncelleme tamamlandı!</p>
                <p className="text-gray-300 text-sm">Uygulama yeniden başlatılacak...</p>
              </div>
            )}

            {updateStatus.status === 'error' && (
              <button
                onClick={onDismiss}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Kapat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
