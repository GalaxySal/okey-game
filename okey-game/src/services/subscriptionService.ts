import type { SubscriptionPlan, UserSubscription, PremiumFeatures } from '../types/subscription';

export class SubscriptionService {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || 'https://api.okey-game.com';

  // Abonelik planları
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.API_BASE}/api/subscription/plans`);
      if (!response.ok) throw new Error('Failed to fetch plans');
      return await response.json();
    } catch (error) {
      console.error('Subscription plans fetch error:', error);
      // Fallback to local plans
      return this.getLocalPlans();
    }
  }

  // Kullanıcı abonelik durumu
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`${this.API_BASE}/api/subscription/user/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('User subscription fetch error:', error);
      return null;
    }
  }

  // Premium özellik kontrolü
  static hasFeature(userSubscription: UserSubscription | null, feature: keyof PremiumFeatures): boolean {
    if (!userSubscription || userSubscription.status !== 'active') return false;

    // Şimdilik basit kontrol, gerçek API'de plan özelliklerine göre kontrol edilecek
    switch (feature) {
      case 'customThemes':
      case 'premiumTournaments':
      case 'vipProfileBadges':
      case 'adFreeExperience':
      case 'advancedStats':
      case 'prioritySupport':
        return true; // Premium kullanıcılar tüm özelliklere sahip
      default:
        return false;
    }
  }

  // Abonelik oluşturma
  static async createSubscription(userId: string, planId: string): Promise<UserSubscription> {
    try {
      const response = await fetch(`${this.API_BASE}/api/subscription/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, planId }),
      });

      if (!response.ok) throw new Error('Failed to create subscription');
      return await response.json();
    } catch (error) {
      console.error('Subscription creation error:', error);
      throw error;
    }
  }

  // Abonelik iptal etme
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      throw error;
    }
  }

  // Yerel abonelik planları (fallback için)
  private static getLocalPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'premium_monthly',
        name: 'Premium Aylık',
        price: 29.99,
        currency: 'TRY',
        interval: 'monthly',
        features: {
          customThemes: true,
          premiumTournaments: true,
          vipProfileBadges: true,
          adFreeExperience: true,
          advancedStats: true,
          prioritySupport: true,
        },
        isPopular: true,
      },
      {
        id: 'premium_yearly',
        name: 'Premium Yıllık',
        price: 299.99,
        currency: 'TRY',
        interval: 'yearly',
        features: {
          customThemes: true,
          premiumTournaments: true,
          vipProfileBadges: true,
          adFreeExperience: true,
          advancedStats: true,
          prioritySupport: true,
        },
      },
    ];
  }
}

export default SubscriptionService;
