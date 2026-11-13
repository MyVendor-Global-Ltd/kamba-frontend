import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp, QuestionCircle } from '../utils/phosphorIcons';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';

const questions = [
  {
    question: 'Can I place an order in this preview?',
    answer: 'No. Product listings, checkout, and payment are not connected. No payment will be taken and no order will be placed.',
  },
  {
    question: 'What can I browse?',
    answer: 'You can browse shop listings and view the seller information currently provided by Kamba.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Support contact channels are not configured in this preview. No phone number or support email is provided here.',
  },
];

export const HelpScreen = ({ navigation }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & support</Text>
        </View>

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <QuestionCircle size={24} color={colors.light.accent}  />
          </View>
          <Text style={styles.title}>A few things to know</Text>
          <Text style={styles.description}>
            This preview focuses on discovering nearby shops. Some marketplace and support features are not connected yet.
          </Text>
        </View>

        <View style={styles.questions}>
          {questions.map((item, index) => {
            const expanded = expandedQuestion === index;
            const Chevron = expanded ? ChevronUp : ChevronDown;

            return (
              <View key={item.question} style={styles.questionCard}>
                <TouchableOpacity
                  style={styles.questionButton}
                  onPress={() => setExpandedQuestion(expanded ? null : index)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                >
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Chevron size={20} color={colors.light.textMuted} />
                </TouchableOpacity>
                {expanded ? (
                  <Text style={styles.answerText}>{item.answer}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.headline,
    fontSize: typography.scale.headlineMedium.fontSize,
  },
  intro: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  introIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.light.accentSoft,
  },
  title: {
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.displaySmall.fontSize,
    lineHeight: typography.scale.displaySmall.lineHeight,
    textAlign: 'center',
  },
  description: {
    maxWidth: 340,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
    textAlign: 'center',
  },
  questions: {
    gap: spacing.sm,
  },
  questionCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.lg,
    backgroundColor: colors.light.surface,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  questionText: {
    flex: 1,
    color: colors.light.textPrimary,
    fontFamily: typography.fontFamilies.title,
    fontSize: typography.scale.titleLarge.fontSize,
  },
  answerText: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: typography.scale.bodyMedium.lineHeight,
  },
});

export default HelpScreen;
