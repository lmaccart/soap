/**
 * QuickSOAP — Step 6: SAMPLE History
 * One letter at a time, no scrolling.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Chip } from '@/components/ui';
import { COMMON_ALLERGIES, COMMON_CONDITIONS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const STEPS = [
  { key: 'S', label: 'Signs & Symptoms', prompt: 'What\'s bothering you most?', field: 'signsSymptoms', multiline: true },
  { key: 'A', label: 'Allergies', prompt: 'Any allergies?', field: 'allergies', chips: COMMON_ALLERGIES },
  { key: 'M', label: 'Medications', prompt: 'Any medications? Prescription, OTC, supplements?', field: 'medications', multiline: true },
  { key: 'P', label: 'Past Medical History', prompt: 'Any medical conditions?', field: 'pastMedical', chips: COMMON_CONDITIONS },
  { key: 'L', label: 'Last Intake / Output', prompt: 'When did you last eat or drink? Last urination?', field: 'lastIntake', multiline: true },
  { key: 'E', label: 'Events', prompt: 'What were you doing? What happened?', field: 'events', multiline: true },
] as const;

type StepField = typeof STEPS[number]['field'];

export default function SAMPLEScreen() {
  const router = useRouter();
  const { dispatch, currentPatient } = useAssessment();
  const [step, setStep] = useState(0);
  const sample = currentPatient?.sample;

  const current = STEPS[step];

  const update = (field: StepField, value: string) => {
    dispatch({ type: 'UPDATE_SAMPLE', payload: { [field]: value } });
  };

  const appendChip = (field: StepField, chip: string) => {
    const existing = (sample?.[field] ?? '') as string;
    if (existing.includes(chip)) {
      update(field, existing.replace(chip, '').replace(', ,', ',').replace(/^,\s*|,\s*$/g, '').trim());
    } else {
      update(field, existing ? `${existing}, ${chip}` : chip);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 6 });
      router.push('/assessment/opqrst');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 4 });
      router.back();
    }
  };

  const value = (sample?.[current.field] ?? '') as string;
  const chips = 'chips' in current ? current.chips : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StepHeader stepNumber={5} title="SAMPLE" />

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s.key} style={[styles.stepDot, i === step && styles.stepDotActive, i < step && styles.stepDotDone]}>
            <Text style={[styles.stepDotText, (i === step || i < step) && styles.stepDotTextActive]}>{s.key}</Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.letterLabel}>{current.key} — {current.label}</Text>
        <Text style={styles.prompt}>{current.prompt}</Text>

        {chips && (
          <View style={styles.chipGrid}>
            {chips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={value.includes(chip)}
                onPress={() => appendChip(current.field, chip)}
              />
            ))}
          </View>
        )}

        {current.key === 'L' && (
          <View style={styles.lSection}>
            <Text style={styles.lSubLabel}>Last Meal</Text>
            <View style={styles.lRow}>
              {(['🌅 Breakfast', '☀️ Lunch', '🌙 Dinner'] as const).map((meal) => {
                const sel = value.includes(meal);
                return (
                  <Pressable key={meal} style={[styles.lBtn, sel && styles.lBtnSelected]}
                    onPress={() => { Haptics.selectionAsync(); appendChip('lastIntake', meal); }}>
                    <Text style={[styles.lBtnText, sel && styles.lBtnTextSelected]}>{meal}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.lSubLabel}>Output</Text>
            <View style={styles.lRow}>
              {(['🚽 Regular bowel', '💧 Regular urine'] as const).map((item) => {
                const sel = value.includes(item);
                return (
                  <Pressable key={item} style={[styles.lBtn, sel && styles.lBtnSelected]}
                    onPress={() => { Haptics.selectionAsync(); appendChip('lastIntake', item); }}>
                    <Text style={[styles.lBtnText, sel && styles.lBtnTextSelected]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={(v) => update(current.field, v)}
          placeholder="Type here..."
          placeholderTextColor={Colors.textHint}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={step < STEPS.length - 1 ? STEPS[step + 1].key : 'Done'}
        onSkip={handleNext}
        skipLabel="Skip"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingTop: Spacing.md },
  stepDot: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.borderLight,
  },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepDotDone: { backgroundColor: Colors.clinicalGreen, borderColor: Colors.clinicalGreen },
  stepDotText: { ...Typography.label, color: Colors.textHint },
  stepDotTextActive: { color: Colors.textOnPrimary },

  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
  letterLabel: { ...Typography.h2, color: Colors.primary },
  prompt: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },

  lSection: { gap: Spacing.sm },
  lSubLabel: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase' },
  lRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  lBtn: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  lBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  lBtnText: { ...Typography.body, color: Colors.textPrimary },
  lBtnTextSelected: { color: Colors.primary, fontWeight: '700' },
  input: {
    ...Typography.body, color: Colors.textPrimary,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.md, flex: 1,
  },
});
