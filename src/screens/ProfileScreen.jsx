import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, ShieldCheck, LogOut } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../theme';
import { ScreenShell } from '../components/ScreenShell';
import { KambaButton } from '../components/KambaButton';
import { storage } from '../utils/storage';

export const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('student');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await storage.getUsername();
      if (u) setUsername(u);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await storage.clearAll();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <ScreenShell padded bg={colors.ink}>
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <User size={44} color={colors.coral} strokeWidth={2} />
        </View>

        <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.username}>@{username}</Text>
            <ShieldCheck size={16} color={colors.gold} strokeWidth={2.5} />
          </View>
          <Text style={styles.badge}>UNILAG Verified Student</Text>
        </View>

        <View style={styles.actions}>
          <KambaButton
            label="Log Out"
            variant="secondary"
            fullWidth
            icon={<LogOut size={16} color={colors.textPrimary} />}
            onPress={handleLogout}
          />
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    gap: spacing.lg,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.coralDim,
    borderWidth: 2,
    borderColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 24,
    color: colors.textPrimary,
  },
  badge: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.gold,
  },
  actions: {
    width: '100%',
    marginTop: spacing.xxl,
  },
});

export default ProfileScreen;