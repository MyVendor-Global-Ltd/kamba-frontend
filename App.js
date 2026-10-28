// App.js - Kamba Marketplace
if (typeof global.EventEmitter === 'undefined') {
  global.EventEmitter = class EventEmitter {
    constructor() { this._events = {}; }
    addListener(eventName, listener) {
      if (!this._events[eventName]) this._events[eventName] = [];
      this._events[eventName].push(listener);
      return () => this.removeListener(eventName, listener);
    }
    on(eventName, listener) { return this.addListener(eventName, listener); }
    removeListener(eventName, listener) {
      if (!this._events[eventName]) return;
      this._events[eventName] = this._events[eventName].filter(l => l !== listener);
    }
    off(eventName, listener) { return this.removeListener(eventName, listener); }
    emit(eventName, ...args) {
      if (!this._events[eventName]) return false;
      this._events[eventName].forEach(l => l(...args));
      return true;
    }
    removeAllListeners(eventName) { if (eventName) delete this._events[eventName]; else this._events = {}; }
    listenerCount(eventName) { return this._events[eventName]?.length || 0; }
  };
}

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AppNavigator } from './src/navigation';

SplashScreen.preventAutoHideAsync().catch(() => {});

const fontMap = {
  'Geist_400Regular': Geist_400Regular,
  'Geist_500Medium': Geist_500Medium,
  'Geist_600SemiBold': Geist_600SemiBold,
  'Geist_700Bold': Geist_700Bold,
  // Geist does not ship a separate mono family; keep the existing token names
  // backed by the closest available weights so font loading remains complete.
  'GeistMono_400Regular': Geist_400Regular,
  'GeistMono_500Medium': Geist_500Medium,
  'PlusJakartaSans_400Regular': PlusJakartaSans_400Regular,
  'PlusJakartaSans_500Medium': PlusJakartaSans_500Medium,
  'PlusJakartaSans_600SemiBold': PlusJakartaSans_600SemiBold,
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fontMap);
      } catch (err) {
        console.warn('Font load error:', err);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDFC" translucent={false} />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFC' },
});
