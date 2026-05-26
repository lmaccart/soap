/**
 * QuickSOAP — MCI Triage
 * START triage: tag each patient before individual assessments.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment, createEmptyPatient } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TRIAGE_CATEGORIES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';

export default function TriageScreen() {
  const router = useRouter();
  const { state, dispatch } = useAssessment();

  const numPatients = state.incident?.scene.numPatients ?? 1;
  const patientIds = Object.keys(state.patients);

  // Ensure we have the right number of patient slots
  React.useEffect(() => {
    const current = patientIds.length;
    if (current < numPatients) {
      for (let i = current; i < numPatients; i++) {
        dispatch({ type: 'ADD_PATIENT' });
      }
    }
  }, [numPatients]);

  const setTriage = (patientId: string, category: string) => {
    dispatch({
      type: 'UPDATE_PATIENT',
      payload: { patientId, data: { triageCategory: category } },
    });
  };

  const handleNext = () => {
    // Set current patient to first and go to AVPU
    const firstId = patientIds[0];
    if (firstId) dispatch({ type: 'SET_CURRENT_PATIENT', payload: firstId });
    dispatch({ type: 'SET_STEP', payload: 3 });
    router.push('/assessment/avpu');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    router.back();
  };

  const counts = TRIAGE_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.value] = patientIds.filter(
      (id) => state.patients[id]?.triageCategory === cat.value
    ).length;
    return acc;
  }, {});

  const tagged = patientIds.filter((id) => state.patients[id]?.triageCategory !== '').length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={2}
          title="MCI Triage"
          reminder="START triage — 30 seconds per patient. Respirations → Perfusion → Mental Status."
        />

        {/* Triage summary */}
        <View style={styles.summaryRow}>
          {TRIAGE_CATEGORIES.map((cat) => (
            <View key={cat.value} style={[styles.summaryCell, { backgroundColor: cat.bgColor }]}>
              <Text style={styles.summaryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.summaryCount, { color: cat.color }]}>{counts[cat.value] ?? 0}</Text>
              <Text style={[styles.summaryLabel, { color: cat.color }]}>{cat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.progressText}>{tagged}/{numPatients} patients tagged</Text>

        {/* Patient cards */}
        {patientIds.map((id, index) => {
          const patient = state.patients[id];
          const selected = patient?.triageCategory ?? '';
          return (
            <View key={id} style={styles.patientCard}>
              <Text style={styles.patientLabel}>Patient {index + 1}</Text>
              <View style={styles.triageRow}>
                {TRIAGE_CATEGORIES.map((cat) => {
                  const isSelected = selected === cat.value;
                  return (
                    <Pressable
                      key={cat.value}
                      style={[
                        styles.triageBtn,
                        { borderColor: cat.color },
                        isSelected && { backgroundColor: cat.bgColor },
                      ]}
                      onPress={() => setTriage(id, cat.value)}
                    >
                      <Text style={styles.triageBtnEmoji}>{cat.emoji}</Text>
                      <Text style={[styles.triageBtnLabel, { color: cat.color }]}>
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* START guide */}
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>START Algorithm</Text>
          <Text style={styles.guideLine}>
            <Text style={styles.guideStep}>1. Respirations: </Text>
            Absent → Open airway → still absent = 🔴, &lt;30/min = continue, &gt;30 = 🔴
          </Text>
          <Text style={styles.guideLine}>
            <Text style={styles.guideStep}>2. Perfusion: </Text>
            Cap refill &gt;2 sec or no radial pulse = 🔴, otherwise continue
          </Text>
          <Text style={styles.guideLine}>
            <Text style={styles.guideStep}>3. Mental Status: </Text>
            Can't follow commands = 🔴, can = 🟡, walking wounded = 🟢
          </Text>
        </View>
      </ScrollView>

      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  summaryRow: {
    flexDirection: 'row', marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryCell: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  summaryEmoji: { fontSize: 20 },
  summaryCount: { ...Typography.h2, marginTop: 2 },
  summaryLabel: { ...Typography.caption, fontWeight: '600' },

  progressText: {
    ...Typography.caption, color: Colors.textHint,
    textAlign: 'center', marginTop: Spacing.sm,
  },

  patientCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  patientLabel: { ...Typography.h3, color: Colors.textPrimary },
  triageRow: { flexDirection: 'row', gap: Spacing.sm },
  triageBtn: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 2,
    backgroundColor: Colors.background,
  },
  triageBtnEmoji: { fontSize: 18 },
  triageBtnLabel: { ...Typography.caption, fontWeight: '600', marginTop: 2 },

  guideBox: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.clinicalBlueBg, padding: Spacing.base,
    borderRadius: Radius.md, gap: Spacing.sm,
  },
  guideTitle: { ...Typography.label, color: Colors.clinicalBlue, textTransform: 'uppercase' },
  guideLine: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  guideStep: { fontWeight: '700', color: Colors.textPrimary },
});
