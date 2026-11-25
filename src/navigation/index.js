import React, { useState, useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
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
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { PaymentCheckoutScreen } from '../screens/PaymentCheckoutScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { ProfileDetailScreen } from '../screens/ProfileDetailScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SecurityScreen } from '../screens/SecurityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { VendorHubScreen } from '../screens/VendorHubScreen';
import { DeliveryProviderScreen } from '../screens/DeliveryProviderScreen';
import { VendorPaymentScreen } from '../screens/VendorPaymentScreen';
import { VendorPayoutAccountScreen } from '../screens/VendorPayoutAccountScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { LocationPickerScreen } from '../screens/LocationPickerScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { ServiceRequestsScreen } from '../screens/ServiceRequestsScreen';
import { VendorOnboardingScreen } from '../screens/VendorOnboardingScreen';
import { VendorProductsScreen } from '../screens/VendorProductsScreen';
import { UnavailableFeatureScreen } from '../screens/UnavailableFeatureScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

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
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => <Grid size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
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
    const responseListener = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) navigationRef.navigate('Notifications');
    });
    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse && navigationRef.isReady()) {
      navigationRef.navigate('Notifications');
      Notifications.clearLastNotificationResponse();
    }
    return () => responseListener.remove();
  }, []);

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
        // Cached profile data is never proof of an active server session.
        // Keep private screens behind a successful authenticated API check.
        if (active) setInitialRoute('Auth');
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
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ headerShown: true, headerTitle: 'Your location', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerShown: true, headerTitle: 'Local services', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ headerShown: true, headerTitle: 'Service details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="ServiceRequests"
        component={ServiceRequestsScreen}
        options={{ headerShown: true, headerTitle: 'Service requests', headerBackTitle: 'Back' }}
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
        name="VendorPayoutAccount"
        component={VendorPayoutAccountScreen}
        options={{ headerShown: true, headerTitle: 'Payout Bank Account', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="DeliveryProvider"
        component={DeliveryProviderScreen}
        options={{ headerShown: true, headerTitle: 'Delivery Provider', headerBackTitle: 'Back' }}
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
        name="PaymentCheckout"
        component={PaymentCheckoutScreen}
        options={{ headerShown: true, headerTitle: 'Secure Checkout', headerBackTitle: 'Back' }}
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
        options={{ headerShown: true, headerTitle: 'Vendor onboarding', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="VendorProducts"
        component={VendorProductsScreen}
        options={{ headerShown: true, headerTitle: 'Vendor products', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: true, headerTitle: 'Edit Profile', headerBackTitle: 'Back' }}
      />
      {[
        'Addresses',
        'AddCard',
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
  <NavigationContainer ref={navigationRef}>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
