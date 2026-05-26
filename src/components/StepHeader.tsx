/**
 * QuickSOAP — StepHeader component
 * Step title with number, label, and clinical reminder text.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  reminder?: string;
}

export default function StepHeader({ stepNumber, title, reminder }: StepHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {reminder && (
        <View style={styles.reminderBox}>
          <Text style={styles.reminderIcon}>💡</Text>
          <Text style={styles.reminderText}>{reminder}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.base, paddingBottom: Spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumber: { ...Typography.button, color: Colors.textOnPrimary, fontSize: 14 },
  title: { ...Typography.h1, color: Colors.textPrimary, flex: 1 },
  reminderBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginTop: Spacing.md,
    backgroundColor: Colors.clinicalBlueBg, paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md, borderRadius: Radius.md, borderLeftWidth: 3,
    borderLeftColor: Colors.clinicalBlue,
  },
  reminderIcon: { fontSize: 14, marginTop: 1 },
  reminderText: { ...Typography.bodySmall, color: Colors.clinicalBlue, flex: 1 },
});
