import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SubscriptionService from '../services/subscriptionService';
import type { SubscriptionPlan, UserSubscription } from '../types/subscription';

export const PremiumSettingsScreen: React.FC = () => {
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
        SubscriptionService.getUserSubscription('current_user')
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
      await loadSubscriptionData();
      setSelectedPlan(null);
      Alert.alert('Başarılı', 'Premium aboneliğiniz aktifleştirildi!');
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Hata', 'Abonelik oluşturulurken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Premium ayarları yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💎 Premium Özellikler</Text>
        <Text style={styles.subtitle}>Okey deneyimini premium özelliklerle zenginleştirin</Text>
      </View>

      {userSubscription && userSubscription.status === 'active' && (
        <View style={styles.activeSubscription}>
          <Text style={styles.activeTitle}>🎉 Premium Üye</Text>
          <Text style={styles.activeText}>
            Aboneliğiniz aktif: {new Date(userSubscription.endDate).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      )}

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.isPopular && styles.popularPlan
            ]}
          >
            {plan.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>EN POPÜLER</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              ₺{plan.price}
              <Text style={styles.planInterval}>/{plan.interval === 'monthly' ? 'ay' : 'yıl'}</Text>
            </Text>

            <View style={styles.featuresContainer}>
              <Text style={styles.featureText}>✓ Özel temalar ve grafikler</Text>
              <Text style={styles.featureText}>✓ Premium turnuva erişimi</Text>
              <Text style={styles.featureText}>✓ VIP profil rozetleri</Text>
              <Text style={styles.featureText}>✓ Reklamsız deneyim</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                selectedPlan === plan.id && styles.disabledButton
              ]}
              onPress={() => handleSubscribe(plan.id)}
              disabled={selectedPlan === plan.id}
            >
              <Text style={styles.subscribeButtonText}>
                {selectedPlan === plan.id ? 'İşleniyor...' : 'Şimdi Abone Ol'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.freeFeatures}>
        <Text style={styles.freeTitle}>🎮 Ücretsiz Özellikler</Text>
        <View style={styles.freeGrid}>
          <View style={styles.freeItem}>
            <Text style={styles.freeIcon}>🎯</Text>
            <Text style={styles.freeItemTitle}>Temel Oyun</Text>
            <Text style={styles.freeItemDesc}>Standart okey oyunu</Text>
          </View>
          <View style={styles.freeItem}>
            <Text style={styles.freeIcon}>🤖</Text>
            <Text style={styles.freeItemTitle}>AI Rakipler</Text>
            <Text style={styles.freeItemDesc}>Akıllı rakip sistemi</Text>
          </View>
          <View style={styles.freeItem}>
            <Text style={styles.freeIcon}>📊</Text>
            <Text style={styles.freeItemTitle}>Temel İstatistikler</Text>
            <Text style={styles.freeItemDesc}>Oyun geçmişi takibi</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#581c87',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e879f9',
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  activeSubscription: {
    backgroundColor: '#166534',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  activeText: {
    color: '#86efac',
    textAlign: 'center',
    fontSize: 16,
  },
  plansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#374151',
  },
  popularPlan: {
    borderColor: '#eab308',
    backgroundColor: '#1f2937',
  },
  popularBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  popularText: {
    color: '#1f2937',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
  },
  planInterval: {
    fontSize: 16,
    color: '#9ca3af',
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureText: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  subscribeButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  freeFeatures: {
    backgroundColor: '#1f2937',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  freeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  freeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  freeItem: {
    alignItems: 'center',
    flex: 1,
  },
  freeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  freeItemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  freeItemDesc: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
});
