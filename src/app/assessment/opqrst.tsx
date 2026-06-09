/**
 * QuickSOAP — Step 7: OPQRST
 * One letter at a time, no scrolling.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Chip } from '@/components/ui';
import { PAIN_QUALITIES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const STEPS = [
  { key: 'O', label: 'Onset', prompt: 'When did it start? What were you doing?' },
  { key: 'P', label: 'Provocation / Palliation', prompt: 'What makes it better or worse?' },
  { key: 'Q', label: 'Quality', prompt: 'What does it feel like?' },
  { key: 'R', label: 'Region / Radiation', prompt: 'Where is it? Does it move?' },
  { key: 'S', label: 'Severity', prompt: 'Rate your pain 0–10.' },
  { key: 'T', label: 'Time', prompt: 'How long? Constant or comes and goes?' },
] as const;

export default function OPQRSTScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [step, setStep] = useState(0);
  const opqrst = currentPatient?.opqrst;

  const update = (fields: Partial<NonNullable<typeof opqrst>>) => {
    dispatch({ type: 'UPDATE_OPQRST', payload: fields as any });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 7 });
      router.push(state.isAmsDetected ? '/assessment/stop-eats' : '/assessment/vitals');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 5 });
      router.back();
    }
  };

  const current = STEPS[step];

  const renderInput = () => {
    if (current.key === 'Q') {
      return (
        <View style={styles.chipGrid}>
          {PAIN_QUALITIES.map((q) => (
            <Chip
              key={q} label={q}
              selected={opqrst?.quality === q}
              onPress={() => update({ quality: opqrst?.quality === q ? '' : q })}
            />
          ))}
        </View>
      );
    }

    if (current.key === 'S') {
      const severity = opqrst?.severity ?? 0;
      const color = severity >= 7 ? Colors.clinicalRed : severity >= 4 ? Colors.clinicalYellow : Colors.clinicalGreen;
      return (
        <View style={styles.severityBlock}>
          <View style={[styles.severityDisplay, { backgroundColor: color + '20', borderColor: color }]}>
            <Text style={[styles.severityNum, { color }]}>{severity}</Text>
            <Text style={[styles.severityOf, { color }]}>/10</Text>
          </View>
          <View style={styles.severityBtns}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <Pressable
                key={n}
                style={[styles.severityBtn, { borderColor: n >= 7 ? Colors.clinicalRed : n >= 4 ? Colors.clinicalYellow : Colors.clinicalGreen }, n === severity && { backgroundColor: (n >= 7 ? Colors.clinicalRed : n >= 4 ? Colors.clinicalYellow : Colors.clinicalGreen) }]}
                onPress={() => { Haptics.selectionAsync(); update({ severity: n }); }}
              >
                <Text style={[styles.severityBtnText, n === severity && styles.severityBtnTextSelected]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    const fieldMap: Record<string, keyof NonNullable<typeof opqrst>> = {
      O: 'onset', P: 'provocation', R: 'region', T: 'timeDuration',
    };
    const field = fieldMap[current.key];
    const value = field ? ((opqrst?.[field] ?? '') as string) : '';

    return (
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={(v) => field && update({ [field]: v })}
        placeholder="Type here..."
        placeholderTextColor={Colors.textHint}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        autoFocus
      />
    );
  };

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={6} title="OPQRST" />

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
        {renderInput()}
      </View>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={step < STEPS.length - 1 ? STEPS[step + 1].key : 'Done'}
        onSkip={handleNext}
        skipLabel="Skip"
      />
    </View>
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
  input: {
    ...Typography.body, color: Colors.textPrimary,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.md, flex: 1,
  },

  severityBlock: { gap: Spacing.lg, alignItems: 'center' },
  severityDisplay: {
    flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs,
    paddingHorizontal: Spacing.xxxl, paddingVertical: Spacing.lg,
    borderRadius: Radius.xl, borderWidth: 3,
  },
  severityNum: { fontSize: 64, fontWeight: '700', lineHeight: 72 },
  severityOf: { ...Typography.h2 },
  severityBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  severityBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  severityBtnText: { ...Typography.label, color: Colors.textPrimary },
  severityBtnTextSelected: { color: Colors.textOnPrimary, fontWeight: '700' },
});
