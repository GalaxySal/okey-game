import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { UserProfile, Achievement } from '../types';

export const ProfileScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // Şimdilik mock data, gerçek API entegrasyonu için backend gerekli
      const mockProfile: UserProfile = {
        id: 'user_1',
        username: 'OkeyŞampiyonu',
        email: 'okey@example.com',
        avatar: undefined,
        level: 15,
        experience: 2450,
        gamesPlayed: 127,
        gamesWon: 89,
        winRate: 70.1,
        favoriteColor: 'red',
        achievements: [
          {
            id: 'first_win',
            name: 'İlk Zafer',
            description: 'İlk oyununuzu kazanın',
            icon: '🏆',
            unlockedAt: new Date('2024-01-15'),
            rarity: 'common'
          },
          {
            id: 'win_streak',
            name: 'Kazanma Serisi',
            description: '5 oyun üst üste kazanın',
            icon: '🔥',
            unlockedAt: new Date('2024-02-20'),
            rarity: 'rare'
          }
        ],
        friends: ['friend_1', 'friend_2'],
        isOnline: false,
        lastSeen: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01')
      };

      setUserProfile(mockProfile);
    } catch (error) {
      Alert.alert('Hata', 'Profil yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    const currentLevelExp = userProfile ? userProfile.experience % 1000 : 0;
    const nextLevelExp = 1000;
    return (currentLevelExp / nextLevelExp) * 100;
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Profil yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Profil bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profil Başlığı */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.avatarText}>
                  {userProfile.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={[styles.onlineIndicator, { backgroundColor: userProfile.isOnline ? '#10b981' : '#6b7280' }]} />
          </View>

          <Text style={styles.username}>{userProfile.username}</Text>
          <Text style={styles.levelText}>Seviye {userProfile.level}</Text>

          {/* XP Progress Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${getLevelProgress()}%` }
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {userProfile.experience % 1000}/1000 XP
            </Text>
          </View>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Oyun Sayısı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.gamesWon}</Text>
              <Text style={styles.statLabel}>Galibiyet</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.winRate.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Kazanma Oranı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.friends.length}</Text>
              <Text style={styles.statLabel}>Arkadaş</Text>
            </View>
          </View>
        </View>

        {/* Başarımlar */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>🏆 Başarımlar</Text>
          <View style={styles.achievementsList}>
            {userProfile.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={[styles.achievementRarity, { color: getRarityColor(achievement.rarity) }]}>
                    {achievement.rarity.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Ayarlar Butonları */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️ Ayarları Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>👥 Arkadaşları Yönet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>📊 İstatistikleri Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fbbf24',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    color: '#fbbf24',
    marginBottom: 16,
  },
  xpContainer: {
    width: '100%',
    maxWidth: 200,
  },
  xpBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: 32,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 4,
  },
  achievementRarity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsContainer: {
    gap: 12,
  },
  settingsButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
