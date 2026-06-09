/**
 * QuickSOAP — Step 3b: Orientation
 * Only shown when patient is Alert. Tap each area they're oriented to.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { ORIENTATION_CHECKS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function OrientationScreen() {
  const router = useRouter();
  const { dispatch, currentPatient } = useAssessment();
  const orientation = currentPatient?.orientation ?? { person: false, place: false, time: false, event: false };

  const toggle = (key: string) => {
    Haptics.selectionAsync();
    dispatch({
      type: 'UPDATE_AVPU',
      payload: { avpu: 'A', orientation: { [key]: !orientation[key as keyof typeof orientation] } },
    });
  };

  const orientedCount = Object.values(orientation).filter(Boolean).length;

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
    router.push('/assessment/abcde');
  };

  useEffect(() => {
    if (orientedCount === 4) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const t = setTimeout(handleNext, 500);
      return () => clearTimeout(t);
    }
  }, [orientedCount]);

  const handleBack = () => router.back();

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={2} title="Orientation" reminder="Tap each area the patient correctly answers." />

      <View style={styles.result}>
        <Text style={styles.resultValue}>A+Ox{orientedCount}</Text>
        <Text style={styles.resultLabel}>
          {orientedCount === 4 ? 'Fully oriented' : orientedCount === 0 ? 'Not oriented' : 'Partially oriented'}
        </Text>
      </View>

      <View style={styles.buttons}>
        {ORIENTATION_CHECKS.map((check) => {
          const checked = orientation[check.key as keyof typeof orientation];
          return (
            <Pressable
              key={check.key}
              style={[styles.btn, checked && styles.btnChecked]}
              onPress={() => toggle(check.key)}
            >
              <View style={[styles.check, checked && styles.checkChecked]}>
                {checked && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={styles.btnText}>
                <Text style={[styles.btnLabel, checked && styles.btnLabelChecked]}>{check.label}</Text>
                <Text style={styles.btnQuestion}>{check.question}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  result: {
    alignItems: 'center', paddingVertical: Spacing.lg,
    backgroundColor: Colors.clinicalGreenBg, marginHorizontal: Spacing.lg,
    marginTop: Spacing.md, borderRadius: Radius.lg,
  },
  resultValue: { ...Typography.displayLarge, color: Colors.clinicalGreen },
  resultLabel: { ...Typography.bodySmall, color: Colors.clinicalGreen, marginTop: 2 },

  buttons: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md, justifyContent: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, borderRadius: Radius.xl, borderWidth: 2,
    borderColor: Colors.borderLight, backgroundColor: Colors.surface,
  },
  btnChecked: { borderColor: Colors.clinicalGreen, backgroundColor: Colors.clinicalGreenBg },

  check: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkChecked: { backgroundColor: Colors.clinicalGreen, borderColor: Colors.clinicalGreen },
  checkMark: { color: Colors.textOnPrimary, fontSize: 16, fontWeight: '700' },

  btnText: { flex: 1 },
  btnLabel: { ...Typography.h3, color: Colors.textPrimary },
  btnLabelChecked: { color: Colors.clinicalGreen },
  btnQuestion: { ...Typography.caption, color: Colors.textHint, marginTop: 2, fontStyle: 'italic' },
});
