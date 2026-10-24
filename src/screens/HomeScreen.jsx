import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, ShieldCheck, Flame, ArrowRight, Bell, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { ScreenShell } from '../components/ScreenShell';
import { KambaLogo } from '../components/KambaLogo';
import { GlowCard } from '../components/GlowCard';
import { storage } from '../utils/storage';

export const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('student');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await storage.getUsername();
      if (u) setUsername(u);
    };
    fetchUser();
  }, []);

  return (
    <ScreenShell scrollable padded bg={colors.ink}>
      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.brandGroup}>
          <KambaLogo variant="full" size={26} />
          <View style={styles.campusBadge}>
            <MapPin size={12} color={colors.coral} strokeWidth={2.5} />
            <Text style={styles.campusText}>UNILAG Campus</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          activeOpacity={0.7}
        >
          <Bell size={20} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Greeting Ritual */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingSub}>WELCOME TO YOUR CAMPUS</Text>
        <Text style={styles.greetingTitle}>Hey, @{username}</Text>
        <Text style={styles.greetingBody}>
          47 campus verified stores are currently active near you.
        </Text>
      </View>

      {/* Hot campus drop card */}
      <GlowCard glowColor={colors.coral} style={styles.heroCard}>
        <View style={styles.dropTagRow}>
          <View style={styles.dropPill}>
            <Flame size={14} color={colors.gold} strokeWidth={2.5} />
            <Text style={styles.dropPillText}>HOT CAMPUS DROP</Text>
          </View>
          <Text style={styles.dropTimer}>Closes 8:00 PM</Text>
        </View>

        <Text style={styles.dropHeadline}>UNILAG Vintage Tee Collection</Text>
        <Text style={styles.dropSeller}>By @tariq_kicks • New Hall Dropoff</Text>

        <View style={styles.dropFooter}>
          <Text style={styles.dropPrice}>₦8,500</Text>
          <View style={styles.dropAction}>
            <Text style={styles.dropActionText}>Claim Drop</Text>
            <ArrowRight size={14} color={colors.coral} strokeWidth={2.5} />
          </View>
        </View>
      </GlowCard>

      {/* Verified Sellers Row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Verified Campus Sellers</Text>
        <Text style={styles.sectionLink}>View all</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sellerRow}>
        {[
          { name: "Ada's Kitchen", tag: 'Hot Jollof', rating: '4.95' },
          { name: 'Chisom Tech', tag: 'MacBooks', rating: '5.0' },
          { name: 'Tariq Kicks', tag: 'Sneakers', rating: '4.9' },
        ].map((s, idx) => (
          <View key={idx} style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>{s.name.charAt(0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.sellerName} numberOfLines={1}>{s.name}</Text>
              <ShieldCheck size={12} color={colors.gold} strokeWidth={2.5} />
            </View>
            <Text style={styles.sellerTag}>{s.tag}</Text>
            <Text style={styles.sellerRating}>★ {s.rating}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inkRaised,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.inkBorder,
  },
  campusText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.inkRaised,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    marginBottom: spacing.xl,
  },
  greetingSub: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  greetingTitle: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  greetingBody: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  heroCard: {
    marginBottom: spacing.xxl,
  },
  dropTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dropPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.goldDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dropPillText: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 1,
  },
  dropTimer: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 11,
    color: colors.textTertiary,
  },
  dropHeadline: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dropSeller: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  dropFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.inkBorder,
  },
  dropPrice: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 22,
    color: colors.coral,
  },
  dropAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropActionText: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.coral,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  sectionLink: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.coral,
  },
  sellerRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.base,
    paddingHorizontal: spacing.base,
  },
  sellerCard: {
    width: 140,
    backgroundColor: colors.inkRaised,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.inkBorder,
    padding: spacing.base,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.coralDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sellerInitial: {
    fontFamily: typography.fontFamilies.displayHeavy,
    color: colors.coral,
    fontSize: 18,
  },
  sellerName: {
    fontFamily: typography.fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  sellerTag: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sellerRating: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    marginTop: 4,
  },
});

export default HomeScreen;