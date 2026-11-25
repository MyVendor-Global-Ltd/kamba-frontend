import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';
import { storage } from './storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerNativePushDevice() {
  if (Platform.OS !== 'android') {
    throw new Error('Kamba native FCM registration is currently configured for Android. iOS FCM token support will be added with the iOS Firebase app credentials.');
  }

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Kamba updates',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#E85D4A',
  });

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') {
    throw new Error('Notification permission was not granted. Enable notifications for Kamba in Android settings and try again.');
  }

  let token;
  try {
    const result = await Notifications.getDevicePushTokenAsync();
    token = String(result.data || '').trim();
  } catch {
    throw new Error('Firebase could not create a device token. Confirm google-services.json is configured and install a development build of Kamba.');
  }
  if (!token) throw new Error('Firebase returned an empty device token.');

  await api.post('/notifications/devices', {
    token,
    platform: 'android',
    device_label: 'Kamba Android',
  });
  await storage.setPushToken(token);
  return token;
}

export async function unregisterNativePushDevice() {
  const token = await storage.getPushToken();
  if (!token) return { revoked: false };

  await api.delete('/notifications/devices', { data: { token } });
  await storage.clearPushToken();
  return { revoked: true };
}

export function addNativeNotificationListeners(onResponse) {
  const received = Notifications.addNotificationReceivedListener((notification) => {
    // The configured notification handler displays foreground notifications.
    onResponse?.(notification);
  });
  const response = Notifications.addNotificationResponseReceivedListener((response) => {
    onResponse?.(response.notification);
  });
  return () => {
    received.remove();
    response.remove();
  };
}
