/**
 * QuickSOAP — Step 3: AVPU
 * Tap a level to immediately advance.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { AVPU_LEVELS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function AVPUScreen() {
  const router = useRouter();
  const { dispatch } = useAssessment();

  const handleSelect = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'UPDATE_AVPU', payload: { avpu: value } });
    if (value === 'A') {
      router.push('/assessment/orientation');
    } else {
      dispatch({ type: 'SET_STEP', payload: 4 });
      router.push('/assessment/abcde');
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={3} title="AVPU" reminder="Tap the patient's level of consciousness." />

      <View style={styles.buttons}>
        {AVPU_LEVELS.map((level) => (
          <Pressable
            key={level.value}
            style={[styles.btn, { borderColor: level.color, backgroundColor: level.color + '12' }]}
            onPress={() => handleSelect(level.value)}
          >
            <Text style={[styles.btnLetter, { color: level.color }]}>{level.value}</Text>
            <View style={styles.btnTextBlock}>
              <Text style={[styles.btnLabel, { color: level.color }]}>{level.label}</Text>
              <Text style={styles.btnDesc}>{level.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <WizardNav onBack={handleBack} onNext={() => {}} canGoNext={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  buttons: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.md, justifyContent: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    padding: Spacing.xl, borderRadius: Radius.xl, borderWidth: 2,
  },
  btnLetter: { ...Typography.displayLarge, width: 44, textAlign: 'center' },
  btnTextBlock: { flex: 1 },
  btnLabel: { ...Typography.h2 },
  btnDesc: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
});
