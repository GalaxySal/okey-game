export interface PremiumFeatures {
  customThemes: boolean;
  premiumTournaments: boolean;
  vipProfileBadges: boolean;
  adFreeExperience: boolean;
  advancedStats: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: PremiumFeatures;
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  autoRenew: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paidAt?: Date;
  description: string;
  invoiceUrl?: string;
}
