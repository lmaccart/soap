/**
 * QuickSOAP UI — RadioGroup component
 */
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface RadioGroupProps {
  options: readonly RadioOption[] | RadioOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export default function RadioGroup({ options, value, onChange, direction = 'vertical', size = 'md' }: RadioGroupProps) {
  return (
    <View style={[styles.container, direction === 'horizontal' && styles.horizontal]}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const activeColor = option.color ?? Colors.primary;
        return (
          <Pressable
            key={option.value}
            onPress={() => { Haptics.selectionAsync(); onChange(option.value); }}
            style={[
              styles.option,
              size === 'lg' && styles.optionLg,
              isSelected && { borderColor: activeColor, backgroundColor: activeColor + '10' },
            ]}
          >
            <View style={[styles.radio, isSelected && { borderColor: activeColor }]}>
              {isSelected && <View style={[styles.radioDot, { backgroundColor: activeColor }]} />}
            </View>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, size === 'lg' && styles.labelLg, isSelected && { color: activeColor }]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[styles.description, size === 'lg' && styles.descriptionLg]}>
                  {option.description}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  horizontal: { flexDirection: 'row', flexWrap: 'wrap' },
  option: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.borderLight, gap: Spacing.md,
    backgroundColor: Colors.surface,
  },
  optionLg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.lg },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  labelContainer: { flex: 1 },
  label: { ...Typography.body, color: Colors.textPrimary },
  labelLg: { ...Typography.h3 },
  description: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  descriptionLg: { ...Typography.body, color: Colors.textSecondary },
});
