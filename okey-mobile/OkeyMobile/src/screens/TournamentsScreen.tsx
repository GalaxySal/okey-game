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
import { useTranslation } from 'react-i18next';
import type { Tournament, TournamentParticipant } from '../types';

export const TournamentsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userStats, setUserStats] = useState({
    totalTournaments: 0,
    tournamentsWon: 0,
    bestPlacement: 0,
    totalPrizeMoney: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    type: 'single_elimination' as const,
    maxPlayers: 16,
    entryFee: 0,
    startDate: new Date()
  });

  useEffect(() => {
    loadTournamentsData();
  }, []);

  const loadTournamentsData = async () => {
    try {
      setLoading(true);
      // Şimdilik mock data, gerçek API entegrasyonu için backend gerekli
      const mockTournaments: Tournament[] = [
        {
          id: 'tournament_1',
          name: 'Haftalık Şampiyona',
          description: 'Haftanın en iyi oyuncularının mücadelesi',
          type: 'single_elimination',
          maxPlayers: 32,
          currentPlayers: 28,
          entryFee: 100,
          prizePool: 5000,
          status: 'registration_open',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          participants: [],
          rounds: [],
          currentRound: 0
        },
        {
          id: 'tournament_2',
          name: 'Yeni Başlayanlar Kupası',
          description: 'Seviye 1-5 oyuncular için turnuva',
          type: 'round_robin',
          maxPlayers: 16,
          currentPlayers: 12,
          entryFee: 50,
          prizePool: 2000,
          status: 'in_progress',
          startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          participants: [],
          rounds: [],
          currentRound: 2
        }
      ];

      setTournaments(mockTournaments);
      setUserStats({
        totalTournaments: 5,
        tournamentsWon: 2,
        bestPlacement: 1,
        totalPrizeMoney: 1500
      });
    } catch (error) {
      Alert.alert('Hata', 'Turnuva verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTournament = (tournamentId: string) => {
    Alert.alert(
      'Turnuvaya Katıl',
      'Bu turnuvaya katılmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Katıl', onPress: () => {
          // Turnuvaya katılma işlemi
          Alert.alert('Başarılı', 'Turnuvaya başarıyla katıldınız!');
        }}
      ]
    );
  };

  const handleCreateTournament = () => {
    if (!newTournament.name.trim()) {
      Alert.alert('Hata', 'Turnuva adı gereklidir');
      return;
    }

    Alert.alert(
      'Turnuva Oluştur',
      'Bu turnuvayı oluşturmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Oluştur', onPress: () => {
          // Turnuva oluşturma işlemi
          Alert.alert('Başarılı', 'Turnuva başarıyla oluşturuldu!');
          setShowCreateForm(false);
          setNewTournament({
            name: '',
            description: '',
            type: 'single_elimination',
            maxPlayers: 16,
            entryFee: 0,
            startDate: new Date()
          });
        }}
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return '#fbbf24';
      case 'registration_open': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'Yakında';
      case 'registration_open': return 'Kayıt Açık';
      case 'in_progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Turnuvalar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Başlık ve İstatistikler */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Turnuvalar</Text>

          {/* Kullanıcı İstatistikleri */}
          <View style={styles.userStats}>
            <Text style={styles.statsTitle}>Senin İstatistiklerin</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.totalTournaments}</Text>
                <Text style={styles.statLabel}>Katıldığın Turnuva</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.tournamentsWon}</Text>
                <Text style={styles.statLabel}>Kazandığın</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.bestPlacement}</Text>
                <Text style={styles.statLabel}>En İyi Sıralama</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₺{userStats.totalPrizeMoney}</Text>
                <Text style={styles.statLabel}>Toplam Ödül</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Turnuva Oluştur Butonu */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={styles.createButtonText}>➕ Yeni Turnuva Oluştur</Text>
        </TouchableOpacity>

        {/* Turnuva Oluştur Formu */}
        {showCreateForm && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>Yeni Turnuva Oluştur</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Turnuva Adı"
              placeholderTextColor="#9ca3af"
              value={newTournament.name}
              onChangeText={(text) => setNewTournament(prev => ({ ...prev, name: text }))}
            />

            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Açıklama"
              placeholderTextColor="#9ca3af"
              value={newTournament.description}
              onChangeText={(text) => setNewTournament(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.formRow}>
              <TouchableOpacity style={styles.formButton} onPress={handleCreateTournament}>
                <Text style={styles.formButtonText}>Oluştur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowCreateForm(false)}
              >
                <Text style={styles.formButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Turnuva Listesi */}
        <View style={styles.tournamentsContainer}>
          <Text style={styles.sectionTitle}>Mevcut Turnuvalar</Text>

          {tournaments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Şu anda aktif turnuva bulunmuyor.
              </Text>
            </View>
          ) : (
            <View style={styles.tournamentsList}>
              {tournaments.map((tournament) => (
                <View key={tournament.id} style={styles.tournamentItem}>
                  <View style={styles.tournamentHeader}>
                    <View style={styles.tournamentInfo}>
                      <Text style={styles.tournamentName}>{tournament.name}</Text>
                      <Text style={styles.tournamentDescription} numberOfLines={2}>
                        {tournament.description}
                      </Text>
                      <View style={styles.tournamentMeta}>
                        <Text style={[styles.tournamentStatus, { color: getStatusColor(tournament.status) }]}>
                          {getStatusText(tournament.status)}
                        </Text>
                        <Text style={styles.tournamentPlayers}>
                          {tournament.currentPlayers}/{tournament.maxPlayers} Oyuncu
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tournamentPrize}>
                      <Text style={styles.prizeAmount}>₺{tournament.prizePool}</Text>
                      <Text style={styles.prizeLabel}>Ödül Havuzu</Text>
                    </View>
                  </View>

                  <View style={styles.tournamentFooter}>
                    <Text style={styles.tournamentDate}>
                      Başlangıç: {formatDate(tournament.startDate)}
                    </Text>
                    {tournament.entryFee && tournament.entryFee > 0 && (
                      <Text style={styles.entryFee}>
                        Giriş Ücreti: ₺{tournament.entryFee}
                      </Text>
                    )}
                  </View>

                  {tournament.status === 'registration_open' && (
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinTournament(tournament.id)}
                    >
                      <Text style={styles.joinButtonText}>Turnuvaya Katıl</Text>
                    </TouchableOpacity>
                  )}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  userStats: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#4b5563',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#d1d5db',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createForm: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  formInput: {
    backgroundColor: '#4b5563',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  formButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tournamentsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
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
  tournamentsList: {
    gap: 16,
  },
  tournamentItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tournamentInfo: {
    flex: 1,
    marginRight: 16,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  tournamentDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  tournamentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tournamentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  tournamentPlayers: {
    fontSize: 12,
    color: '#9ca3af',
  },
  tournamentPrize: {
    alignItems: 'center',
  },
  prizeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  prizeLabel: {
    fontSize: 10,
    color: '#d1d5db',
  },
  tournamentFooter: {
    marginBottom: 12,
  },
  tournamentDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  entryFee: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
