import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
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
  static hasFeature(userSubscription: UserSubscription | null, feature: string): boolean {
    if (!userSubscription || userSubscription.status !== 'active') return false;
    return true;
  }

  // Yerel abonelik planları
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
