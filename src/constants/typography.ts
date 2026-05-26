/**
 * QuickSOAP Design System — Typography, Spacing, Radius, Shadows
 */

import { TextStyle, Platform } from 'react-native';

export const Typography = {
  displayLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  } as TextStyle,

  h1: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,

  h2: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,

  h3: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.1,
  } as TextStyle,

  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.15,
  } as TextStyle,

  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.3,
  } as TextStyle,

  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,

  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.2,
  } as TextStyle,

  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  } as TextStyle,

  timerLarge: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -1,
  } as TextStyle,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
