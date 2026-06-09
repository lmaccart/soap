/**
 * QuickSOAP — Step 8: STOP EATS (conditional — AMS differential)
 * One cause at a time, quick Ruled Out / Suspected / Confirmed.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { STOP_EATS_CAUSES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const STATUS_OPTIONS = [
  { value: 'ruled_out', label: 'Ruled Out', color: Colors.clinicalGreen },
  { value: 'possible', label: 'Possible', color: Colors.clinicalYellow },
  { value: 'suspected', label: 'Suspected', color: Colors.clinicalRed },
] as const;

type Status = typeof STATUS_OPTIONS[number]['value'];

function getStatus(value: string): Status | null {
  if (value === 'ruled_out' || value === 'possible' || value === 'suspected') return value;
  return null;
}

export default function StopEatsScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [step, setStep] = useState(0);
  const stopEats = currentPatient?.stopEats;

  const cause = STOP_EATS_CAUSES[step];

  const fieldMap: Record<string, keyof NonNullable<typeof stopEats>> = {
    sugar: 'sugar', temperature: 'temperature', oxygen: 'oxygen', pressure: 'pressure',
    electricity: 'electricity', altitude: 'altitude', toxins: 'toxins', salts: 'salts',
  };

  const currentValue = (stopEats?.[fieldMap[cause.key]] as string) ?? '';
  const currentStatus = getStatus(currentValue);

  const setStatus = (status: Status) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'UPDATE_STOP_EATS', payload: { [cause.key]: status } });
  };

  const handleNext = () => {
    if (step < STOP_EATS_CAUSES.length - 1) {
      setStep(step + 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 9 });
      router.push('/assessment/vitals');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      dispatch({ type: 'SET_STEP', payload: 7 });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={8} title="STOP EATS" reminder="Rule out each reversible cause of AMS." />

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {STOP_EATS_CAUSES.map((c, i) => {
          const val = (stopEats?.[fieldMap[c.key]] as string) ?? '';
          const status = getStatus(val);
          const dotColor = status === 'suspected' ? Colors.clinicalRed : status === 'possible' ? Colors.clinicalYellow : status === 'ruled_out' ? Colors.clinicalGreen : Colors.borderLight;
          return (
            <Pressable key={c.key} onPress={() => setStep(i)} style={[styles.dot, { backgroundColor: dotColor, borderColor: i === step ? Colors.primary : 'transparent', borderWidth: i === step ? 2 : 0 }]}>
              <Text style={styles.dotText}>{c.letter}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.content}>
        <View style={styles.causeHeader}>
          <View style={styles.letterCircle}>
            <Text style={styles.letterText}>{cause.letter}</Text>
          </View>
          <View>
            <Text style={styles.causeLabel}>{cause.label}</Text>
            <Text style={styles.causePrompt}>{cause.prompt}</Text>
          </View>
        </View>

        <View style={styles.statusBtns}>
          {STATUS_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.statusBtn, { borderColor: opt.color }, currentStatus === opt.value && { backgroundColor: opt.color + '20' }]}
              onPress={() => setStatus(opt.value)}
            >
              <View style={[styles.radio, { borderColor: opt.color }, currentStatus === opt.value && { backgroundColor: opt.color }]}>
                {currentStatus === opt.value && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.statusLabel, { color: opt.color }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={step < STOP_EATS_CAUSES.length - 1 ? STOP_EATS_CAUSES[step + 1].label : 'Done'}
        onSkip={handleNext}
        skipLabel="Skip"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingTop: Spacing.md },
  dot: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  dotText: { ...Typography.caption, color: Colors.textOnPrimary, fontWeight: '700' },

  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.xl, justifyContent: 'center' },

  causeHeader: { flexDirection: 'row', gap: Spacing.lg, alignItems: 'flex-start' },
  letterCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  letterText: { ...Typography.h1, color: Colors.primary },
  causeLabel: { ...Typography.h2, color: Colors.textPrimary },
  causePrompt: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs, flexShrink: 1 },

  statusBtns: { gap: Spacing.md },
  statusBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    padding: Spacing.xl, borderRadius: Radius.xl, borderWidth: 2,
  },
  radio: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.textOnPrimary },
  statusLabel: { ...Typography.h3 },
});
