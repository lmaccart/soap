/**
 * QuickSOAP — Step 3: AVPU Assessment
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { RadioGroup, Checkbox } from '@/components/ui';
import { AVPU_LEVELS, ORIENTATION_CHECKS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function AVPUScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const avpu = currentPatient?.avpu ?? '';
  const orientation = currentPatient?.orientation ?? { person: false, place: false, time: false, event: false };

  const isAlert = avpu === 'A';
  const isAms = ['V', 'P', 'U'].includes(avpu);
  const orientedCount = Object.values(orientation).filter(Boolean).length;

  const handleAvpuChange = (value: string) => {
    dispatch({ type: 'UPDATE_AVPU', payload: { avpu: value } });
  };

  const handleOrientationChange = (key: string) => {
    dispatch({
      type: 'UPDATE_AVPU',
      payload: {
        avpu: 'A',
        orientation: { [key]: !orientation[key as keyof typeof orientation] },
      },
    });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
    router.push('/assessment/abcde');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    router.back();
  };

  // Build display string like "A+Ox3"
  const avpuDisplay = isAlert
    ? `A+Ox${orientedCount}`
    : avpu;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={3}
          title="AVPU"
          reminder="Assess level of consciousness. Introduce yourself and ask for consent."
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level of Consciousness</Text>
          <RadioGroup
            options={AVPU_LEVELS.map(level => ({
              value: level.value,
              label: `${level.value} — ${level.label}`,
              description: level.description,
              color: level.color,
            }))}
            value={avpu || (isAlert ? 'A' : '')}
            onChange={handleAvpuChange}
            size="lg"
          />
        </View>

        {/* Orientation checks for Alert patients */}
        {isAlert && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orientation (A+Ox{orientedCount})</Text>
            <Text style={styles.orientHint}>Check each area the patient is oriented to:</Text>
            {ORIENTATION_CHECKS.map((check) => (
              <Checkbox
                key={check.key}
                label={check.label}
                sublabel={`Ask: "${check.question}"`}
                checked={orientation[check.key as keyof typeof orientation]}
                onChange={() => handleOrientationChange(check.key)}
                color={Colors.clinicalGreen}
              />
            ))}
            <View style={styles.orientResult}>
              <Text style={styles.orientResultLabel}>Result:</Text>
              <Text style={styles.orientResultValue}>{avpuDisplay}</Text>
            </View>
          </View>
        )}

        {/* AMS Warning */}
        {isAms && (
          <View style={styles.section}>
            <View style={styles.amsWarning}>
              <Text style={styles.amsIcon}>🚨</Text>
              <View style={styles.amsContent}>
                <Text style={styles.amsTitle}>Altered Mental Status Detected</Text>
                <Text style={styles.amsText}>
                  STOP EATS differential will be added to assessment flow.
                  Any persistent AMS → evacuate.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={avpu !== ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
  orientHint: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: Spacing.md },
  orientResult: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.clinicalGreenBg, padding: Spacing.base,
    borderRadius: Radius.md, marginTop: Spacing.md,
  },
  orientResultLabel: { ...Typography.label, color: Colors.clinicalGreen },
  orientResultValue: { ...Typography.h2, color: Colors.clinicalGreen },
  amsWarning: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.clinicalRedBg, padding: Spacing.base,
    borderRadius: Radius.md, borderLeftWidth: 4, borderLeftColor: Colors.clinicalRed,
  },
  amsIcon: { fontSize: 24, marginTop: 2 },
  amsContent: { flex: 1 },
  amsTitle: { ...Typography.h3, color: Colors.clinicalRed, marginBottom: Spacing.xs },
  amsText: { ...Typography.bodySmall, color: Colors.clinicalRed },
});
