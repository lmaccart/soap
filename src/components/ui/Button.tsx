/**
 * QuickSOAP UI — Button component
 * Pressable button with primary, secondary, outline, ghost, and danger variants.
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`textSize_${size}`],
    styles[`textVariant_${variant}`],
    isDisabled && styles.textDisabled,
  ].filter(Boolean) as TextStyle[];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.textOnPrimary : Colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={textStyles}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon: { marginRight: 2 },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },

  // Sizes
  size_sm: { paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.base },
  size_md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  size_lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl },

  // Variants
  variant_primary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryLight },
  variant_outline: { backgroundColor: 'transparent', borderColor: Colors.border },
  variant_ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  variant_danger: { backgroundColor: Colors.clinicalRed, borderColor: Colors.clinicalRed },

  // Text
  text: { ...Typography.button },
  textSize_sm: { fontSize: 14 },
  textSize_md: {},
  textSize_lg: { fontSize: 18 },
  textVariant_primary: { color: Colors.textOnPrimary },
  textVariant_secondary: { color: Colors.primary },
  textVariant_outline: { color: Colors.textPrimary },
  textVariant_ghost: { color: Colors.primary },
  textVariant_danger: { color: Colors.textOnPrimary },
  textDisabled: { color: Colors.disabledText },
});
