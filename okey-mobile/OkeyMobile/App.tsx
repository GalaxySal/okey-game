/**
 * Okey Mobile App
 * React Native uygulaması için ana component
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { TournamentsScreen } from './src/screens/TournamentsScreen';
import { PerformanceMonitor } from './src/hooks/usePerformanceMonitor';
import './src/i18n';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#166534" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#166534',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Okey Oyunu' }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{ title: 'Oyun' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profil' }}
          />
          <Stack.Screen
            name="Friends"
            component={FriendsScreen}
            options={{ title: 'Arkadaşlar' }}
          />
          <Stack.Screen
            name="Tournaments"
            component={TournamentsScreen}
            options={{ title: 'Turnuvalar' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Performans Monitoring - Development Only */}
      <PerformanceMonitor />
    </SafeAreaProvider>
  );
}

export default App;
