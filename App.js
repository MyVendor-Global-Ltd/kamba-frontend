import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS, SIZES } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';

const Tab = createBottomTabNavigator();
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: COLORS.canvas } };
function Placeholder({ route }) {
  return <View style={{ flex: 1, backgroundColor: COLORS.canvas, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.ink, fontSize: 20, fontWeight: '700' }}>{route.name}</Text><Text style={{ color: COLORS.muted, marginTop: 8 }}>Your Kamba experience, coming together.</Text></View>;
}
const icons = { Home: 'home', Search: 'search', Orders: 'receipt-outline', Saved: 'heart-outline', Profile: 'person-outline' };
export default function App() {
  return <SafeAreaProvider><StatusBar barStyle="dark-content" backgroundColor={COLORS.canvas}/><NavigationContainer theme={theme}><Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: COLORS.forest, tabBarInactiveTintColor: COLORS.muted, tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 5 }, tabBarStyle: { height: 66, paddingTop: 8, borderTopColor: COLORS.line, backgroundColor: COLORS.white, elevation: 0 }, tabBarIcon: ({ color, size, focused }) => <Ionicons name={route.name === 'Home' && focused ? 'home' : icons[route.name]} size={size} color={color}/> })}><Tab.Screen name="Home" component={HomeScreen}/><Tab.Screen name="Search" component={Placeholder}/><Tab.Screen name="Orders" component={Placeholder}/><Tab.Screen name="Saved" component={Placeholder}/><Tab.Screen name="Profile" component={Placeholder}/></Tab.Navigator></NavigationContainer></SafeAreaProvider>;
}
