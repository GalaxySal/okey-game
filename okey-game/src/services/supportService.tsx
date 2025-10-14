import React, { useState } from 'react';

export class SupportService {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.okey-game.com';

  // Discord invite link
  static readonly DISCORD_INVITE_URL = 'https://discord.gg/okey-game';

  // Email support
  static readonly SUPPORT_EMAIL = 'support@okey-game.com';

  // Destek bileti oluşturma
  static async createSupportTicket(ticket: {
    subject: string;
    message: string;
    category: 'bug' | 'feature' | 'account' | 'payment' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    platform: string;
    userId?: string;
  }): Promise<{ ticketId: string; estimatedResponseTime: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/api/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });

      if (!response.ok) throw new Error('Destek bileti oluşturulamadı');
      return await response.json();
    } catch (error) {
      console.error('Support ticket creation error:', error);
      throw error;
    }
  }

  // Destek biletlerini listele
  static async getSupportTickets(userId?: string): Promise<any[]> {
    try {
      const url = userId
        ? `${this.API_BASE}/api/support/tickets?userId=${userId}`
        : `${this.API_BASE}/api/support/tickets`;

      const response = await fetch(url);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Support tickets fetch error:', error);
      return [];
    }
  }

  // Destek bileti yanıtı ekle
  static async addTicketResponse(ticketId: string, message: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/api/support/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Yanıt eklenemedi');
    } catch (error) {
      console.error('Ticket response error:', error);
      throw error;
    }
  }

  // Beta tester kayıt
  static async registerBetaTester(email: string, platform: string): Promise<{ testerId: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/api/beta/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, platform }),
      });

      if (!response.ok) throw new Error('Beta tester kaydı başarısız');
      return await response.json();
    } catch (error) {
      console.error('Beta registration error:', error);
      throw error;
    }
  }

  // Discord'a katılma
  static openDiscordInvite(): void {
    if (typeof window !== 'undefined') {
      window.open(this.DISCORD_INVITE_URL, '_blank');
    }
  }

  // Email desteği için mailto linki oluştur
  static createSupportEmailLink(subject?: string, body?: string): string {
    const encodedSubject = encodeURIComponent(subject || 'Okey Oyunu Destek Talebi');
    const encodedBody = encodeURIComponent(
      body || `Merhaba,\n\nOkey oyunu hakkında destek talebim var.\n\nPlatform: ${this.detectPlatform()}\nSürüm: ${process.env.REACT_APP_VERSION || '1.0.0'}\n\n`
    );

    return `mailto:${this.SUPPORT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  // Platform tespiti
  static detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('electron')) return 'Desktop';
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) return 'Mobile';
    return 'Web';
  }
}

// Destek formu component'i
export const SupportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'other' as const,
    priority: 'medium' as const,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await SupportService.createSupportTicket({
        ...formData,
        platform: SupportService.detectPlatform(),
        userId: 'current_user', // Gerçek user ID gelecek
      });

      setSubmitted(true);
      alert(`Destek biletiniz oluşturuldu. Bilet numarası: ${result.ticketId}\nTahmini yanıt süresi: ${result.estimatedResponseTime}`);
    } catch (error) {
      alert('Destek bileti oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-4">Destek Talebiniz Alındı</h2>
        <p className="text-green-200 mb-6">
          Destek ekibimiz en kısa sürede sizinle iletişime geçecek.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setSubmitted(false)}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold"
          >
            Yeni Destek Talebi Oluştur
          </button>
          <button
            onClick={SupportService.openDiscordInvite}
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-bold"
          >
            Discord Topluluğuna Katıl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🆘 Destek ve Yardım</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="bug">Hata/Bug</option>
            <option value="feature">Özellik İsteği</option>
            <option value="account">Hesap Sorunu</option>
            <option value="payment">Ödeme Sorunu</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        {/* Öncelik */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Öncelik
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
            <option value="urgent">Acil</option>
          </select>
        </div>

        {/* Konu */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Konu
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Sorun veya talebinizin başlığı"
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Mesaj */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Detaylı Açıklama
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Sorun veya talebinizi detaylı olarak açıklayın..."
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
            {isSubmitting ? 'Gönderiliyor...' : 'Destek Talebi Gönder'}
          </button>
        </div>
      </form>

      {/* Diğer Destek Kanalları */}
      <div className="mt-8 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-4">Diğer Destek Kanalları</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={SupportService.openDiscordInvite}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            💬 Discord Topluluğu
          </button>

          <a
            href={SupportService.createSupportEmailLink()}
            className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg font-bold text-center block"
          >
            📧 Email Destek
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Premium kullanıcılar için öncelikli destek hizmetimiz mevcuttur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportService;
