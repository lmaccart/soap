/**
 * QuickSOAP UI — Card component
 */
import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Radius, Shadows, Spacing } from '@/constants/typography';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export default function Card({ children, variant = 'elevated', onPress, style, padding }: CardProps) {
  const cardStyles = [
    styles.base,
    variant === 'elevated' && [styles.elevated, Shadows.card],
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    padding !== undefined && { padding },
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...cardStyles, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }
  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: Radius.lg, padding: Spacing.base, overflow: 'hidden' },
  elevated: { backgroundColor: Colors.surface },
  outlined: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filled: { backgroundColor: Colors.background },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
