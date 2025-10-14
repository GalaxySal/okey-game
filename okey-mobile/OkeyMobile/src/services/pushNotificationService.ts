import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications, checkNotifications } from 'react-native-permissions';

export class PushNotificationService {
  private static initialized = false;

  // Push notification izinlerini iste
  static async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Push notification izni verildi');
          return true;
        }
      } else if (Platform.OS === 'android') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Push notification izni verildi');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Push notification izin hatası:', error);
      return false;
    }
  }

  // FCM token'ı al
  static async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('FCM token alma hatası:', error);
      return null;
    }
  }

  // Background message handler
  static setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
    });
  }

  // Foreground message handler
  static setupForegroundHandler() {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);

      Alert.alert(
        remoteMessage.notification?.title || 'Okey Oyunu',
        remoteMessage.notification?.body || 'Yeni bir bildirim aldınız',
        [
          { text: 'Tamam', style: 'default' }
        ]
      );
    });

    return unsubscribe;
  }

  // Bildirim tıklama handler'ı
  static setupNotificationOpenedHandler() {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened:', remoteMessage);
      // Uygulama açıldığında ilgili sayfaya yönlendir
    });
  }

  // İlk başlatma
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // İzin kontrolü
      const hasPermission = await this.requestPermission();

      if (hasPermission) {
        // Token al
        await this.getFCMToken();

        // Handler'ları kur
        this.setupBackgroundHandler();
        this.setupForegroundHandler();
        this.setupNotificationOpenedHandler();

        this.initialized = true;
        console.log('Push notification servisi başlatıldı');
      }
    } catch (error) {
      console.error('Push notification başlatma hatası:', error);
    }
  }
}

export default PushNotificationService;
