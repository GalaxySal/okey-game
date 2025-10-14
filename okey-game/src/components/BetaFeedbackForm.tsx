import React, { useState } from 'react';
import BetaTestService, { type BetaFeedback } from '../services/betaTestService';

export const BetaFeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState<Omit<BetaFeedback, 'id' | 'testerId' | 'status' | 'createdAt' | 'updatedAt'>>({
    type: 'general',
    severity: 'medium',
    platform: 'web',
    version: '1.0.0',
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.title || !feedback.description) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      await BetaTestService.submitFeedback(feedback as Omit<BetaFeedback, 'id' | 'createdAt' | 'updatedAt'>);
      setSubmitted(true);
      setFeedback({
        type: 'general',
        severity: 'medium',
        platform: 'web',
        version: '1.0.0',
        title: '',
        description: ''
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Geri bildirim gönderilirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-4">Teşekkürler!</h2>
        <p className="text-green-200 mb-6">
          Geri bildiriminiz başarıyla gönderildi. Beta test sürecimize katkınız için teşekkür ederiz!
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Başka Geri Bildirim Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🐛 Beta Geri Bildirim Formu</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Geri Bildirim Türü */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Geri Bildirim Türü
          </label>
          <select
            value={feedback.type}
            onChange={(e) => setFeedback(prev => ({ ...prev, type: e.target.value as BetaFeedback['type'] }))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="bug">Hata/Bug</option>
            <option value="feature">Özellik İsteği</option>
            <option value="improvement">İyileştirme Önerisi</option>
            <option value="general">Genel Geri Bildirim</option>
          </select>
        </div>

        {/* Önem Derecesi */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Önem Derecesi
          </label>
          <select
            value={feedback.severity}
            onChange={(e) => setFeedback(prev => ({ ...prev, severity: e.target.value as BetaFeedback['severity'] }))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
            <option value="critical">Kritik</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Platform
          </label>
          <select
            value={feedback.platform}
            onChange={(e) => setFeedback(prev => ({ ...prev, platform: e.target.value as BetaFeedback['platform'] }))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="web">Web</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Başlık
          </label>
          <input
            type="text"
            value={feedback.title || ''}
            onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Geri bildiriminizin kısa başlığı"
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Detaylı Açıklama
          </label>
          <textarea
            value={feedback.description || ''}
            onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Geri bildiriminizi detaylı olarak açıklayın..."
            rows={6}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Gönder Butonu */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${
              isSubmitting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
          </button>
        </div>
      </form>

      {/* Beta Bilgilendirme */}
      <div className="mt-8 p-4 bg-yellow-800 rounded-lg border border-yellow-600">
        <h3 className="text-yellow-200 font-bold mb-2">🐛 Beta Test Hakkında</h3>
        <p className="text-yellow-100 text-sm">
          Bu beta sürümde hatalar ve eksiklikler normaldir. Geri bildirimleriniz geliştirme sürecimiz için çok değerlidir.
          Tüm geri bildirimler incelenip önceliklendirilecektir.
        </p>
      </div>
    </div>
  );
};
