// App.js - FIRST LINES (replace the polyfill block)
if (typeof global.EventEmitter === 'undefined') {
  // Minimal EventEmitter implementation (no native deps)
  global.EventEmitter = class EventEmitter {
    constructor() {
      this._events = {};
    }
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
    removeAllListeners(eventName) {
      if (eventName) delete this._events[eventName];
      else this._events = {};
    }
    listenerCount(eventName) {
      return this._events[eventName]?.length || 0;
    }
  };
}


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  SpaceGrotesk_700Bold,
  SpaceGrotesk_800ExtraBold,
} from '@expo-google-fonts/space-grotesk';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AppNavigator } from './src/navigation';

// Keep the native splash visible until fonts are ready (spec requirement)
SplashScreen.preventAutoHideAsync().catch(() => {});

const fontMap = {
  'SpaceGrotesk_700Bold': SpaceGrotesk_700Bold,
  'SpaceGrotesk_800ExtraBold': SpaceGrotesk_800ExtraBold,
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
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" translucent={false} />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
});