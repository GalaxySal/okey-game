import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import QRCodeService from '../services/qrCodeService';
import { QRScannerScreen } from '../components/QRScanner';
import type { UserProfile, FriendRequest } from '../types';

export const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleQRCodeScanned = async (code: string) => {
    setShowQRScanner(false);

    try {
      const success = await QRCodeService.sendFriendRequest(code);
      if (success) {
        Alert.alert('Başarılı', 'Arkadaşlık isteği QR kod ile gönderildi!');
      } else {
        Alert.alert('Hata', 'Geçersiz QR kod veya arkadaşlık isteği gönderilemedi');
      }
    } catch (error) {
      Alert.alert('Hata', 'QR kod işlenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      setLoading(true);
      // Şimdilik mock data, gerçek API entegrasyonu için backend gerekli
      const mockFriends: UserProfile[] = [
        {
          id: 'friend_1',
          username: 'OkeyUstası',
          level: 12,
          experience: 1850,
          gamesPlayed: 95,
          gamesWon: 67,
          winRate: 70.5,
          favoriteColor: 'blue',
          achievements: [],
          friends: [],
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'friend_2',
          username: 'TaşŞampiyonu',
          level: 18,
          experience: 3200,
          gamesPlayed: 156,
          gamesWon: 124,
          winRate: 79.5,
          favoriteColor: 'red',
          achievements: [],
          friends: [],
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
          createdAt: new Date('2024-01-10')
        }
      ];

      const mockRequests: FriendRequest[] = [
        {
          id: 'request_1',
          fromUser: {
            id: 'user_123',
            username: 'YeniOyuncu',
            level: 3,
            experience: 150,
            gamesPlayed: 12,
            gamesWon: 5,
            winRate: 41.7,
            favoriteColor: 'yellow',
            achievements: [],
            friends: [],
            isOnline: true,
            lastSeen: new Date(),
            createdAt: new Date('2024-01-20')
          },
          toUser: 'current_user',
          status: 'pending',
          createdAt: new Date()
        }
      ];

      setFriends(mockFriends);
      setFriendRequests(mockRequests);
    } catch {
      Alert.alert('Hata', 'Arkadaş verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    Alert.alert('Başarılı', 'Arkadaşlık isteği kabul edildi!');
  };

  const handleDeclineRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    Alert.alert('Başarılı', 'Arkadaşlık isteği reddedildi.');
  };

  const handleSendFriendRequest = () => {
    if (searchQuery.trim()) {
      Alert.alert('Başarılı', `${searchQuery} kullanıcısına arkadaşlık isteği gönderildi!`);
      setSearchQuery('');
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Şimdi çevrimiçi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Arkadaşlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>👥 Arkadaşlar</Text>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setShowQRScanner(true)}
          >
            <Text style={styles.qrButtonText}>📷 QR Tara</Text>
          </TouchableOpacity>
        </View>

        {/* QR Kod Tarayıcı */}
        {showQRScanner && (
          <QRScannerScreen
            onCodeScanned={handleQRCodeScanned}
            onClose={() => setShowQRScanner(false)}
          />
        )}

        {/* Arkadaş Arama */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Kullanıcı ara..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSendFriendRequest}
          >
            <Text style={styles.searchButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Arkadaşlık İstekleri */}
        {friendRequests.length > 0 && (
          <View style={styles.requestsContainer}>
            <Text style={styles.sectionTitle}>📨 Arkadaşlık İstekleri</Text>
            {friendRequests.map((request) => (
              <View key={request.id} style={styles.requestItem}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestUsername}>
                    {request.fromUser.username}
                  </Text>
                  <Text style={styles.requestLevel}>
                    Seviye {request.fromUser.level}
                  </Text>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(request.id)}
                  >
                    <Text style={styles.acceptButtonText}>✓ Kabul Et</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDeclineRequest(request.id)}
                  >
                    <Text style={styles.declineButtonText}>✗ Reddet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Arkadaş Listesi */}
        <View style={styles.friendsContainer}>
          <Text style={styles.sectionTitle}>
            👥 Arkadaşların ({friends.length})
          </Text>

          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Henüz arkadaşın yok. Yeni arkadaşlar edin!
              </Text>
            </View>
          ) : (
            <View style={styles.friendsList}>
              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <View style={styles.friendInfo}>
                    <View style={styles.friendAvatar}>
                      <Text style={styles.friendAvatarText}>
                        {friend.username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendUsername}>
                        {friend.username}
                      </Text>
                      <Text style={styles.friendLevel}>
                        Seviye {friend.level} • {friend.winRate.toFixed(1)}% Kazanma Oranı
                      </Text>
                      <Text style={[
                        styles.friendStatus,
                        { color: friend.isOnline ? '#10b981' : '#6b7280' }
                      ]}>
                        {friend.isOnline ? '🟢 Çevrimiçi' : `🔴 ${formatLastSeen(friend.lastSeen)}`}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.messageButton}>
                    <Text style={styles.messageButtonText}>💬 Mesaj</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#374151',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  requestsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  requestItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  requestLevel: {
    fontSize: 14,
    color: '#d1d5db',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  declineButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  friendsContainer: {
    marginBottom: 32,
  },
  emptyState: {
    backgroundColor: '#374151',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
  },
  friendsList: {
    gap: 12,
  },
  friendItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  friendDetails: {
    flex: 1,
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  friendLevel: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
