import React from 'react';

export const PremiumBanner: React.FC = () => {
  const handlePremiumClick = () => {
    // For now, show an alert. In the future, this could navigate to premium settings
    alert('Premium özellikler yakında gelecek! Şimdilik ücretsiz olarak tüm özellikler kullanılabilir.');
  };

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-lg mb-6 border-2 border-yellow-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">💎</div>
          <div>
            <h3 className="font-bold text-lg">Premium Olmanın Avantajları</h3>
            <p className="text-sm opacity-90">Özel temalar, turnuvalar ve çok daha fazlası</p>
          </div>
        </div>
        <button
          onClick={handlePremiumClick}
          className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Premium Bilgi
        </button>
      </div>
    </div>
  );
};
