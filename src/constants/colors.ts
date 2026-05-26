/**
 * QuickSOAP Design System — Color Tokens
 * Clean medical/clinical palette optimized for field readability.
 */

export const Colors = {
  // ── Primary ──────────────────────────────────────────────
  primary: '#1A73E8',
  primaryDark: '#0D47A1',
  primaryLight: '#E8F0FE',

  // ── Surfaces ─────────────────────────────────────────────
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#DADCE0',
  borderLight: '#E8EAED',

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#1A1C1E',
  textSecondary: '#5F6368',
  textHint: '#9AA0A6',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // ── Clinical Status ──────────────────────────────────────
  clinicalGreen: '#0D652D',
  clinicalGreenBg: '#E6F4EA',
  clinicalYellow: '#E37400',
  clinicalYellowBg: '#FEF7E0',
  clinicalRed: '#C5221F',
  clinicalRedBg: '#FCE8E6',
  clinicalBlue: '#1967D2',
  clinicalBlueBg: '#E8F0FE',

  // ── Triage (START) ───────────────────────────────────────
  triageImmediate: '#D32F2F',
  triageImmediateBg: '#FFEBEE',
  triageDelayed: '#F9A825',
  triageDelayedBg: '#FFF8E1',
  triageMinor: '#2E7D32',
  triageMinorBg: '#E8F5E9',
  triageExpectant: '#424242',
  triageExpectantBg: '#F5F5F5',

  // ── Body Diagram ─────────────────────────────────────────
  bodyDefault: '#E8EAF6',
  bodyHover: '#C5CAE9',
  injuryMinor: '#FFF3E0',
  injuryMinorBorder: '#FFB74D',
  injuryModerate: '#FFE0B2',
  injuryModerateBorder: '#FF9800',
  injurySevere: '#FFCCBC',
  injurySevereBorder: '#E53935',

  // ── Misc ─────────────────────────────────────────────────
  success: '#0D652D',
  warning: '#E37400',
  error: '#C5221F',
  info: '#1967D2',
  disabled: '#DADCE0',
  disabledText: '#9AA0A6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.12)',

  // ── Timer ────────────────────────────────────────────────
  timerBackground: '#1A1C1E',
  timerText: '#FFFFFF',
  timerAccent: '#1A73E8',
} as const;

export type ColorKey = keyof typeof Colors;
