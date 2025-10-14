import type { SubscriptionPlan, UserSubscription } from '../types/subscription';

export class SubscriptionService {
  private static readonly API_BASE = 'https://api.okey-game.com';

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
      throw new Error('Abonelik oluşturulurken bir hata oluştu');
    }
  }

  // Premium özellik kontrolü
  static hasFeature(userSubscription: UserSubscription | null, feature: string): boolean {
    if (!userSubscription || userSubscription.status !== 'active') return false;

    // For now, premium users have access to all features
    // In the future, this can be expanded to check specific features
    console.log(`Checking feature access for: ${feature}`);
    return true; // Premium kullanıcılar tüm özelliklere sahip
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
    ];
  }
}

export default SubscriptionService;
