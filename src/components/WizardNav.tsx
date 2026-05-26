/**
 * QuickSOAP — WizardNav component
 * Bottom navigation bar for assessment wizard steps.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface WizardNavProps {
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
}

export default function WizardNav({
  onBack, onNext, onSkip,
  nextLabel = 'Next', backLabel = 'Back', skipLabel = 'Skip',
  canGoBack = true, canGoNext = true, isLastStep = false,
}: WizardNavProps) {
  return (
    <View style={styles.container}>
      {canGoBack && onBack ? (
        <Pressable onPress={() => { Haptics.selectionAsync(); onBack(); }} style={styles.backBtn}>
          <Text style={styles.backText}>← {backLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}

      <View style={styles.rightGroup}>
        {onSkip && (
          <Pressable onPress={() => { Haptics.selectionAsync(); onSkip(); }} style={styles.skipBtn}>
            <Text style={styles.skipText}>{skipLabel}</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onNext(); }}
          style={[styles.nextBtn, !canGoNext && styles.nextBtnDisabled, isLastStep && styles.nextBtnComplete]}
          disabled={!canGoNext}
        >
          <Text style={[styles.nextText, !canGoNext && styles.nextTextDisabled]}>
            {isLastStep ? '✓ Complete' : `${nextLabel} →`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  spacer: { width: 80 },
  backBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.base },
  backText: { ...Typography.button, color: Colors.textSecondary },
  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  skipBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  skipText: { ...Typography.bodySmall, color: Colors.textHint },
  nextBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl, borderRadius: Radius.lg,
  },
  nextBtnDisabled: { backgroundColor: Colors.disabled },
  nextBtnComplete: { backgroundColor: Colors.clinicalGreen },
  nextText: { ...Typography.button, color: Colors.textOnPrimary },
  nextTextDisabled: { color: Colors.disabledText },
});
