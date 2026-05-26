/**
 * QuickSOAP UI — Checkbox with haptic feedback
 */
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  color?: string;
}

export default function Checkbox({ checked, onChange, label, sublabel, disabled = false, color }: CheckboxProps) {
  const activeColor = color ?? Colors.primary;

  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync();
    onChange(!checked);
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={[styles.container, disabled && styles.disabled]}>
      <View style={[styles.box, checked && { backgroundColor: activeColor, borderColor: activeColor }]}>
        {checked && <Text style={styles.check}>✓</Text>}
      </View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  disabled: { opacity: 0.5 },
  box: {
    width: 24, height: 24, borderRadius: Radius.sm, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  check: { color: Colors.textOnPrimary, fontSize: 14, fontWeight: '700', marginTop: -1 },
  labelContainer: { flex: 1 },
  label: { ...Typography.body, color: Colors.textPrimary },
  sublabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  labelDisabled: { color: Colors.disabledText },
});
