import React, { useState, useEffect } from 'react';
import SubscriptionService from '../services/subscriptionService';
import type { SubscriptionPlan, UserSubscription } from '../types/subscription';

export const PremiumSettings: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        SubscriptionService.getSubscriptionPlans(),
        SubscriptionService.getUserSubscription('current_user') // Gerçek user ID gelecek
      ]);

      setPlans(plansData);
      setUserSubscription(subscriptionData);
    } catch (error) {
      console.error('Subscription data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      await SubscriptionService.createSubscription('current_user', planId);
      await loadSubscriptionData(); // Yeniden yükle
      setSelectedPlan(null);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Abonelik oluşturulurken bir hata oluştu');
    }
  };

  const handleCancelSubscription = async () => {
    if (!userSubscription) return;

    if (confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz?')) {
      try {
        await SubscriptionService.cancelSubscription(userSubscription.id);
        await loadSubscriptionData();
      } catch (error) {
        console.error('Cancellation error:', error);
        alert('Abonelik iptal edilirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white text-xl">Premium ayarları yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💎 Premium Özellikler</h1>
          <p className="text-purple-200">Okey deneyimini premium özelliklerle zenginleştirin</p>
        </div>

        {/* Mevcut Abonelik Durumu */}
        {userSubscription && userSubscription.status === 'active' && (
          <div className="bg-green-800 rounded-lg p-6 mb-8 border-2 border-green-600">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">🎉 Premium Üye</h2>
              <p className="text-green-200 mb-4">
                Aboneliğiniz aktif: {new Date(userSubscription.endDate).toLocaleDateString('tr-TR')}
              </p>
              <button
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Aboneliği İptal Et
              </button>
            </div>
          </div>
        )}

        {/* Abonelik Planları */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 hover:scale-105 ${
                plan.isPopular ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' : 'border-gray-600'
              }`}
            >
              {plan.isPopular && (
                <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 text-center">
                  EN POPÜLER
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-green-400 mb-4">
                ₺{plan.price}
                <span className="text-sm text-gray-400">/{plan.interval === 'monthly' ? 'ay' : 'yıl'}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Özel temalar ve grafikler
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Premium turnuva erişimi
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  VIP profil rozetleri
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Reklamsız deneyim
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {selectedPlan === plan.id ? 'İşleniyor...' : 'Şimdi Abone Ol'}
              </button>
            </div>
          ))}
        </div>

        {/* Ücretsiz Özellikler */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4 text-center">🎮 Ücretsiz Özellikler</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="text-gray-300">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Temel Oyun</div>
              <div className="text-sm">Standart okey oyunu</div>
            </div>
            <div className="text-gray-300">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold">AI Rakipler</div>
              <div className="text-sm">Akıllı rakip sistemi</div>
            </div>
            <div className="text-gray-300">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Temel İstatistikler</div>
              <div className="text-sm">Oyun geçmişi takibi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSettings;
