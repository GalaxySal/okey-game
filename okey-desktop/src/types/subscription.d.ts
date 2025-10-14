export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: {
    customThemes: boolean;
    premiumTournaments: boolean;
    vipProfileBadges: boolean;
    adFreeExperience: boolean;
    advancedStats: boolean;
    prioritySupport: boolean;
  };
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFeatures {
  customThemes: boolean;
  premiumTournaments: boolean;
  vipProfileBadges: boolean;
  adFreeExperience: boolean;
  advancedStats: boolean;
  prioritySupport: boolean;
}
