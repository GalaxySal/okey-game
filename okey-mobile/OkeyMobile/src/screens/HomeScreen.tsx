import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const startSinglePlayerGame = () => {
    navigation.navigate('Game');
  };

  const startMultiplayerGame = () => {
    Alert.alert('Yakında', 'Çoklu oyun yakında gelecek!');
  };

  const openSettings = () => {
    Alert.alert('Yakında', 'Ayarlar yakında gelecek!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OKEY OYUNU</Text>
        <Text style={styles.subtitle}>Türkçe Klasik Okey</Text>

        <TouchableOpacity style={styles.button} onPress={startSinglePlayerGame}>
          <Text style={styles.buttonText}>🎯 Tek Kişilik Oyun</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={startMultiplayerGame}>
          <Text style={styles.buttonText}>🌐 Çoklu Oyuncu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#166534',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#bbf7d0',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
