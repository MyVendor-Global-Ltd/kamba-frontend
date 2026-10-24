import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { storage } from '../utils/storage';
import { Home, Search, Package, Bell, User } from 'lucide-react-native';

import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { UsernameScreen } from '../screens/auth/UsernameScreen';
import { PhoneVerifyScreen } from '../screens/auth/PhoneVerifyScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.ink },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: {
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.sizes.lg,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerShadowVisible: false,
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: { opacity: current.progress },
  }),
  transitionSpec: {
    open: {
      animation: 'spring',
      config: { damping: 22, stiffness: 200 },
    },
    close: {
      animation: 'spring',
      config: { damping: 26, stiffness: 200 },
    },
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: typography.fontFamilies.display,
          fontSize: typography.sizes.lg,
          letterSpacing: typography.letterSpacing.tight,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopColor: colors.inkBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamilies.bodyMedium,
          fontSize: typography.sizes.xs,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerTitle: 'Create account',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Username"
        component={UsernameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhoneVerify"
        component={PhoneVerifyScreen}
        options={{
          headerShown: true,
          headerTitle: 'Add your number',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{
          headerShown: true,
          headerTitle: 'Enter the code',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          headerTitle: 'Welcome back',
          headerBackTitle: 'Onboarding',
        }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getToken();
      const username = await storage.getUsername();
      if (token && username) {
        setInitialRoute('Main');
      } else if (token && !username) {
        setInitialRoute('Username');
      } else {
        setInitialRoute('Auth');
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false, animationType: 'fade' }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false, animationType: 'fade' }}
      />
      <Stack.Screen
        name="Username"
        component={UsernameScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;