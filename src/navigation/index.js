import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing, radius } from '../theme/tokens';
import { storage } from '../utils/storage';
import { authAPI } from '../utils/api';
import { Home as HomeIcon, ShoppingBag, User, GridFour as Grid } from '../utils/phosphorIcons';

import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { PhoneUsernameScreen } from '../screens/auth/PhoneUsernameScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { StoreDetailScreen } from '../screens/StoreDetailScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { ProfileDetailScreen } from '../screens/ProfileDetailScreen';
import { SecurityScreen } from '../screens/SecurityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { VendorHubScreen } from '../screens/VendorHubScreen';
import { VendorPaymentScreen } from '../screens/VendorPaymentScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { VendorOnboardingScreen } from '../screens/VendorOnboardingScreen';
import { UnavailableFeatureScreen } from '../screens/UnavailableFeatureScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.light.background },
  headerTintColor: colors.light.textPrimary,
  headerTitleStyle: {
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
    letterSpacing: typography.scale.headlineMedium.letterSpacing,
  },
  headerShadowVisible: false,
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: { opacity: current.progress },
  }),
  transitionSpec: {
    open: { animation: 'spring', config: { damping: 22, stiffness: 200 } },
    close: { animation: 'spring', config: { damping: 26, stiffness: 200 } },
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.light.background },
        headerTintColor: colors.light.textPrimary,
        headerTitleStyle: {
          fontFamily: typography.fontFamilies.headline,
          fontSize: typography.scale.headlineMedium.fontSize,
          letterSpacing: typography.scale.headlineMedium.letterSpacing,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.light.accent,
        tabBarInactiveTintColor: colors.light.textMuted,
        tabBarStyle: {
          backgroundColor: colors.light.surface,
          borderTopColor: colors.light.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamilies.chip,
          fontSize: typography.scale.labelSmall.fontSize,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} weight="bold" />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => <Grid size={size} color={color} weight="bold" />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} weight="bold" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} weight="bold" />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ ...screenOptions, headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, headerTitle: 'Create account', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true, headerTitle: 'Welcome back', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{ headerShown: true, headerTitle: 'Verify phone number', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="PhoneUsername"
        component={PhoneUsernameScreen}
        options={{ headerShown: true, headerTitle: 'Complete account', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: true, headerTitle: 'Reset password', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let active = true;
    const checkAuth = async () => {
      try {
        const response = await authAPI.getDashboard();
        const user = response.data?.result;
        if (!response.data?.success || !user?.id) {
          throw new Error('No authenticated session');
        }
        await storage.setUsername(user.username || '');
        await storage.setUserData(user);
        if (active) setInitialRoute('Main');
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await storage.clearAll();
          if (active) setInitialRoute('Auth');
          return;
        }
        const savedUser = await storage.getUserData();
        if (active) setInitialRoute(savedUser?.id ? 'Main' : 'Auth');
      }
    };
    checkAuth();
    return () => { active = false; };
  }, []);

  if (!initialRoute) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ ...screenOptions, headerShown: false }}
    >
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
        name="Search"
        component={SearchScreen}
        options={{ headerShown: true, headerTitle: 'Search', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={{ headerShown: true, headerTitle: 'Store', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="VendorHub"
        component={VendorHubScreen}
        options={{ headerShown: true, headerTitle: 'Sell on Kamba', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="VendorPayments"
        component={VendorPaymentScreen}
        options={{ headerShown: true, headerTitle: 'Vendor Payments', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: true, headerTitle: 'Notifications', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ headerShown: true, headerTitle: 'My Orders', headerBackTitle: 'Back' }}
      />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ headerShown: true, headerTitle: 'Order Details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: true, headerTitle: 'Product', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: true, headerTitle: 'Checkout', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="VendorOnboarding"
        component={VendorOnboardingScreen}
        options={{ headerShown: true, headerTitle: 'Become a Vendor', headerBackTitle: 'Back' }}
      />
      {[
        'Addresses',
        'AddCard',
        'EditProfile',
        'Language',
        'ClearCache',
        'ContactSupport',
        'EmailSupport',
        'CallSupport',
        'DataPrivacy',
        'BlockedUsers',
        'SecurityLog',
        'ActiveSessions',
      ].map((name) => (
        <Stack.Screen
          key={name}
          name={name}
          component={UnavailableFeatureScreen}
        />
      ))}
    </Stack.Navigator>
  );
}

export const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
