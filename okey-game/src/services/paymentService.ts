// Payment service for subscription management

export class PaymentService {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.okey-game.com';

  // Stripe ile ödeme başlatma
  static async createPaymentIntent(amount: number, currency: string = 'TRY'): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Stripe cent kullanır
          currency,
          metadata: {
            service: 'okey_game_subscription'
          }
        }),
      });

      if (!response.ok) throw new Error('Payment intent oluşturulamadı');
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Payment intent error:', error);
      throw error;
    }
  }

  // Stripe ile ödeme tamamlama
  static async confirmPayment(clientSecret: string, paymentMethodId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSecret,
          paymentMethodId
        }),
      });

      if (!response.ok) throw new Error('Ödeme onaylanamadı');
      return true;
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return false;
    }
  }

  // Ödeme geçmişini al
  static async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/api/payments/history/${userId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Payment history error:', error);
      return [];
    }
  }

  // Abonelik iptal etme
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Abonelik iptal edilemedi');
      return true;
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return false;
    }
  }

  // Webhook signature doğrulama (backend için)
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Stripe webhook signature doğrulama
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    return signature === `sha256=${expectedSignature}`;
  }
}

export default PaymentService;
