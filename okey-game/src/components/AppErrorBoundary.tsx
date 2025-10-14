import React from 'react';
import { ErrorBoundary } from '../services/errorTrackingService';

// Tüm uygulamayı Error Boundary ile sarmalama
export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Bir Hata Oluştu</h2>
            <p className="text-gray-300 mb-6">
              Uygulamada beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya destek ekibimizle iletişime geçin.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={() => window.open('mailto:support@okey-game.com', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Destek Al
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
