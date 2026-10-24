import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import { UserCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows, animation } from '../../theme';
import { ScreenShell } from '../../components/ScreenShell';
import { KambaButton } from '../../components/KambaButton';
import { UsernameAvailability } from '../../components/UsernameAvailability';
import { validateUsername, suggestFromEmail, formatUsername } from '../../utils/username';
import { storage } from '../../utils/storage';

export const UsernameScreen = ({ navigation, route }) => {
  const emailParam = route?.params?.email || 'kamba.user@edu.ng';
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'taken'
  const [suggestions, setSuggestions] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceTimer = useRef(null);
  const pillAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Taken usernames mock list for simulation
  const mockTaken = ['kamba', 'admin', 'chidi', 'chisom', 'ada', 'tariq', 'campus', 'market'];

  useEffect(() => {
    // Generate suggestions based on incoming email
    const generated = suggestFromEmail(emailParam);
    setSuggestions(generated);
  }, [emailParam]);

  const triggerPillAnimation = () => {
    pillAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      80,
      pillAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          ...animation.springBouncy,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const handleTextChange = (text) => {
    // Enforce spec filter: letters, numbers, -, !, _, *, # (max 24)
    const cleaned = formatUsername(text).slice(0, 24);
    setUsername(cleaned);
    setCharCount(cleaned.length);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (cleaned.length < 3) {
      setStatus('idle');
      return;
    }

    setStatus('checking');

    // Debounced check per spec: 1200ms
    debounceTimer.current = setTimeout(() => {
      const validation = validateUsername(cleaned);
      if (!validation.valid) {
        setStatus('idle');
        return;
      }

      if (mockTaken.includes(cleaned)) {
        setStatus('taken');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        triggerPillAnimation();
      } else {
        setStatus('available');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, 1200);
  };

  const applySuggestion = (sug) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleTextChange(sug);
  };

  const handleContinue = async () => {
    if (status !== 'available' || username.length < 3) return;

    Keyboard.dismiss();
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await storage.setUsername(username);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigate to Step 2: PhoneVerify
      navigation.navigate('PhoneVerify', { username });
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenShell scrollable={false} padded bg={colors.ink}>
      <View style={styles.content}>
        {/* Top: Progress Step 1 of 3 */}
        <View style={styles.topProgress}>
          <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
          <View style={styles.stepDots}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>
        </View>

        {/* Center content: ritual feel */}
        <View style={styles.centerSection}>
          <View style={styles.iconCircle}>
            <UserCircle size={48} color={colors.coral} strokeWidth={1.8} />
          </View>

          <Text style={styles.headline}>Choose your identity</Text>
          <Text style={styles.subtext}>
            This is how buyers and sellers will know you on Kamba.
          </Text>

          {/* Character counter (visible when typing) */}
          <View style={styles.counterRow}>
            {charCount > 0 && (
              <Text style={styles.charCounter}>{charCount}/24</Text>
            )}
          </View>

          {/* Unified [@][ input ] bar */}
          <View style={styles.unifiedInputBar}>
            <View style={styles.atPrefix}>
              <Text style={styles.atText}>@</Text>
            </View>
            <View style={styles.inputFieldWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="your_username"
                placeholderTextColor={colors.textTertiary}
                value={username}
                onChangeText={handleTextChange}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                maxLength={24}
                selectionColor={colors.coral}
              />
            </View>
          </View>

          {/* Availability Status */}
          <View style={styles.statusWrapper}>
            <UsernameAvailability status={status} username={username} />
          </View>

          {/* Suggestions row if taken */}
          {status === 'taken' && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionTitle}>Try one of these:</Text>
              <View style={styles.pillsRow}>
                {suggestions.map((sug, idx) => {
                  const scale = pillAnims[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  });
                  const opacity = pillAnims[idx];

                  return (
                    <Animated.View
                      key={sug}
                      style={{ transform: [{ scale }], opacity }}
                    >
                      <TouchableOpacity
                        onPress={() => applySuggestion(sug)}
                        style={styles.pill}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.pillText}>@{sug}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <KambaButton
            label="This is me →"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={status !== 'available' || username.length < 3}
            onPress={handleContinue}
          />
          <Text style={styles.footerNote}>
            You can change this later in settings.
          </Text>
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.base,
  },
  topProgress: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stepLabel: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 2,
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inkBorder,
  },
  stepDotActive: {
    backgroundColor: colors.coral,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 20,
    height: 1.5,
    backgroundColor: colors.inkBorder,
  },
  centerSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.coralDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  headline: {
    fontFamily: typography.fontFamilies.displayHeavy,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  subtext: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: spacing.md,
  },
  counterRow: {
    width: '100%',
    height: 18,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
    marginBottom: 4,
  },
  charCounter: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 12,
    color: colors.textTertiary,
  },
  unifiedInputBar: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
  },
  atPrefix: {
    width: 48,
    height: 56,
    backgroundColor: colors.coralDim,
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,71,0.4)',
    borderRightWidth: 0,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atText: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 20,
    color: colors.coral,
  },
  inputFieldWrapper: {
    flex: 1,
    height: 56,
    backgroundColor: colors.inkRaised,
    borderWidth: 1.5,
    borderColor: colors.inkBorder,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 17,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  statusWrapper: {
    width: '100%',
    paddingLeft: spacing.xs,
    minHeight: 26,
    marginTop: 6,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: spacing.md,
  },
  suggestionTitle: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.coral,
    backgroundColor: colors.coralDim,
  },
  pillText: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 12,
    color: colors.coral,
  },
  bottomSection: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  footerNote: {
    fontFamily: typography.fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
});

export default UsernameScreen;