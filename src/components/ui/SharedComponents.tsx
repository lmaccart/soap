/**
 * QuickSOAP UI — Badge, Chip, Divider, ProgressBar, Modal, NumericStepper
 */
import React from 'react';
import { View, Text, Pressable, Modal as RNModal, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';

// ── Badge ──────────────────────────────────────────────────
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const badgeColors = {
  default: { bg: Colors.background, text: Colors.textSecondary },
  success: { bg: Colors.clinicalGreenBg, text: Colors.clinicalGreen },
  warning: { bg: Colors.clinicalYellowBg, text: Colors.clinicalYellow },
  error: { bg: Colors.clinicalRedBg, text: Colors.clinicalRed },
  info: { bg: Colors.clinicalBlueBg, text: Colors.clinicalBlue },
};

export function Badge({ text, variant = 'default', size = 'md' }: BadgeProps) {
  const colors = badgeColors[variant];
  return (
    <View style={[badgeStyles.base, { backgroundColor: colors.bg }, size === 'sm' && badgeStyles.sm]}>
      <Text style={[badgeStyles.text, { color: colors.text }, size === 'sm' && badgeStyles.textSm]}>{text}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  base: { paddingHorizontal: Spacing.sm + 2, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  text: { ...Typography.label },
  textSm: { fontSize: 10 },
});

// ── Chip ───────────────────────────────────────────────────
interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
}

export function Chip({ label, selected, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
      style={[chipStyles.base, selected && chipStyles.selected]}
    >
      {icon && <Text style={chipStyles.icon}>{icon}</Text>}
      <Text style={[chipStyles.text, selected && chipStyles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  base: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.surface, gap: Spacing.xs,
  },
  selected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  icon: { fontSize: 14 },
  text: { ...Typography.bodySmall, color: Colors.textSecondary },
  textSelected: { color: Colors.primary, fontWeight: '600' },
});

// ── Divider ────────────────────────────────────────────────
interface DividerProps {
  spacing?: number;
  color?: string;
}

export function Divider({ spacing = Spacing.base, color }: DividerProps) {
  return <View style={[dividerStyles.base, { marginVertical: spacing, backgroundColor: color ?? Colors.borderLight }]} />;
}

const dividerStyles = StyleSheet.create({
  base: { height: 1, width: '100%' },
});

// ── ProgressBar ────────────────────────────────────────────
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = Math.min(currentStep / totalSteps, 1);
  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.barBg}>
        <View style={[progressStyles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={progressStyles.dotsRow}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <View key={i} style={progressStyles.dotWrapper}>
              <View style={[
                progressStyles.dot,
                isCompleted && progressStyles.dotCompleted,
                isCurrent && progressStyles.dotCurrent,
              ]}>
                {isCompleted && <Text style={progressStyles.dotCheck}>✓</Text>}
                {isCurrent && <Text style={progressStyles.dotNumber}>{stepNum}</Text>}
              </View>
              {stepLabels?.[i] && (
                <Text style={[progressStyles.dotLabel, (isCompleted || isCurrent) && progressStyles.dotLabelActive]}>
                  {stepLabels[i]}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xs },
  barBg: { height: 3, backgroundColor: Colors.borderLight, borderRadius: 2 },
  barFill: { height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  dotsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
  dotWrapper: { alignItems: 'center', width: 32 },
  dot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  dotCompleted: { backgroundColor: Colors.primary, width: 16, height: 16, borderRadius: 8 },
  dotCurrent: { backgroundColor: Colors.primary, width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: Colors.primaryLight },
  dotCheck: { color: Colors.textOnPrimary, fontSize: 9, fontWeight: '700' },
  dotNumber: { color: Colors.textOnPrimary, fontSize: 10, fontWeight: '700' },
  dotLabel: { ...Typography.caption, color: Colors.textHint, marginTop: 4, textAlign: 'center' },
  dotLabelActive: { color: Colors.primary },
});

// ── Modal ──────────────────────────────────────────────────
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} onRequestClose={onClose} animationType="slide" transparent presentationStyle="overFullScreen">
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable style={modalStyles.content} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyles.handle} />
          {title && <Text style={modalStyles.title}>{title}</Text>}
          <ScrollView style={modalStyles.body} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  content: {
    backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl, maxHeight: '85%',
    ...Shadows.modal,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.base,
  },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.base },
  body: { flexGrow: 1 },
});

// ── NumericStepper ─────────────────────────────────────────
interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function NumericStepper({ value, onChange, min = 1, max = 99, label }: NumericStepperProps) {
  const decrement = () => { if (value > min) { Haptics.selectionAsync(); onChange(value - 1); } };
  const increment = () => { if (value < max) { Haptics.selectionAsync(); onChange(value + 1); } };

  return (
    <View style={stepperStyles.container}>
      {label && <Text style={stepperStyles.label}>{label}</Text>}
      <View style={stepperStyles.row}>
        <Pressable onPress={decrement} style={[stepperStyles.btn, value <= min && stepperStyles.btnDisabled]}>
          <Text style={[stepperStyles.btnText, value <= min && stepperStyles.btnTextDisabled]}>−</Text>
        </Pressable>
        <View style={stepperStyles.valueBox}>
          <Text style={stepperStyles.value}>{value}</Text>
        </View>
        <Pressable onPress={increment} style={[stepperStyles.btn, value >= max && stepperStyles.btnDisabled]}>
          <Text style={[stepperStyles.btnText, value >= max && stepperStyles.btnTextDisabled]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  btn: {
    width: 44, height: 44, borderRadius: Radius.lg, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: Colors.background },
  btnText: { fontSize: 22, fontWeight: '600', color: Colors.primary },
  btnTextDisabled: { color: Colors.disabledText },
  valueBox: {
    minWidth: 56, height: 44, paddingHorizontal: Spacing.base,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  value: { ...Typography.h2, color: Colors.textPrimary },
});
