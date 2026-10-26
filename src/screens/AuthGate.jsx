// screens/AuthGate.jsx — Splash → Auth Gate
// Check MMKV token → if valid → Home, else → AuthFlow
// No onboarding carousel

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { storage } from '../utils/storage';
import { SplashScreen } from './auth/SplashScreen';

export const AuthGate = ({ navigation }) => {
  const [initialRoute, setInitialRoute] = React.useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getToken();
        const username = await storage.getUsername();

        if (token && username) {
          setInitialRoute('Main');
        } else if (token && !username) {
          // This case shouldn't happen in new flow (username collected after first transaction)
          // But handle gracefully
          setInitialRoute('Auth');
        } else {
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
        setInitialRoute('Auth');
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return <SplashScreen navigation={navigation} />;
  }

  // Navigation handled by RootNavigator
  return <SplashScreen navigation={navigation} />;
};

const styles = StyleSheet.create({});

export default AuthGate;