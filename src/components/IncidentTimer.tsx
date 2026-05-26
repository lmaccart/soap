/**
 * QuickSOAP — IncidentTimer component
 * Persistent elapsed-time display for the wizard header.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface IncidentTimerProps {
  formattedTime: string;
  isRunning: boolean;
}

export default function IncidentTimer({ formattedTime, isRunning }: IncidentTimerProps) {
  return (
    <View style={[styles.container, !isRunning && styles.paused]}>
      <Text style={styles.icon}>⏱</Text>
      <Text style={styles.time}>{formattedTime}</Text>
      {isRunning && <View style={styles.pulse} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.timerBackground, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2, borderRadius: Radius.full,
  },
  paused: { opacity: 0.6 },
  icon: { fontSize: 14 },
  time: { ...Typography.mono, color: Colors.timerText, fontSize: 15, fontWeight: '600' },
  pulse: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.clinicalGreen, marginLeft: 2,
  },
});
