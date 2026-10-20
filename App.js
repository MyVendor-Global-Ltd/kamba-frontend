import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from './src/screens/auth/SplashScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import CongratulationsScreen from './src/screens/auth/CongratulationsScreen';
import UsernameScreen from './src/screens/auth/UsernameScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/main/SearchScreen';
import OrdersScreen from './src/screens/main/OrdersScreen';
import NotificationsScreen from './src/screens/main/NotificationsScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import StoreScreen from './src/screens/StoreScreen';
import ProductScreen from './src/screens/ProductScreen';
import { COLORS as C, FONTS as F, SIZES as S } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: C.forest, background: C.cream, card: C.paper, text: C.ink, border: C.line, notification: C.jade },
};

const TAB_ICONS = {
  Home: { active: 'home', idle: 'home-outline' },
  Search: { active: 'search', idle: 'search-outline' },
  Orders: { active: 'receipt', idle: 'receipt-outline' },
  Notifications: { active: 'notifications', idle: 'notifications-outline' },
  Profile: { active: 'person-circle', idle: 'person-circle-outline' },
};

function MainTabs({ route }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: C.forest,
      tabBarInactiveTintColor: C.muted,
      tabBarLabelStyle: { fontFamily: F.medium, fontSize: S.xxs, marginTop: 2, marginBottom: 2 },
      tabBarStyle: { height: 68, paddingTop: 7, paddingBottom: 7, backgroundColor: C.paper, borderTopColor: C.line, borderTopWidth: 1, elevation: 0, shadowColor: C.forestDeep, shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: -4 } },
      tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? TAB_ICONS[route.name].active : TAB_ICONS[route.name].idle} size={21} color={color} />,
    })}>
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ isGuest: Boolean(route?.params?.isGuest) }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.cream }, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={AuthScreen} />
        <Stack.Screen name="Register" component={AuthScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
        <Stack.Screen name="Username" component={UsernameScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    Montserrat_600SemiBold: require('@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf'),
    Montserrat_700Bold: require('@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf'),
  });
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />
      {fontsLoaded ? <RootNavigator /> : <View style={styles.loading}><ActivityIndicator size="small" color={C.goldPale} /></View>}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, backgroundColor: C.forest, alignItems: 'center', justifyContent: 'center' } });
