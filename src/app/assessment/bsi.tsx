/**
 * QuickSOAP — Step 2: BSI / PPE
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Checkbox } from '@/components/ui';
import { BSI_ITEMS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function BSIScreen() {
  const router = useRouter();
  const { state, dispatch } = useAssessment();
  const bsiItems = state.incident?.bsiItems ?? {};

  const toggleItem = (key: string) => {
    const updated = { ...bsiItems, [key]: !bsiItems[key] };
    const glovesChecked = updated['gloves'] ?? false;
    dispatch({ type: 'UPDATE_BSI', payload: { completed: glovesChecked, items: updated } });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
    if ((state.incident?.scene.numPatients ?? 1) > 1) {
      router.push('/assessment/triage');
    } else {
      router.push('/assessment/avpu');
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={2}
          title="BSI / PPE"
          reminder="Treat ALL body fluids as potentially infectious. Don PPE before patient contact."
        />

        <View style={styles.section}>
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>🧤</Text>
            <Text style={styles.warningText}>
              Universal precautions — every patient, every fluid is potentially infectious
            </Text>
          </View>

          {BSI_ITEMS.map((item) => (
            <Checkbox
              key={item.key}
              label={item.label}
              sublabel={item.required ? 'Required' : undefined}
              checked={bsiItems[item.key] ?? false}
              onChange={() => toggleItem(item.key)}
              color={item.required ? Colors.clinicalGreen : undefined}
            />
          ))}

          {!bsiItems['gloves'] && (
            <View style={styles.glovesWarning}>
              <Text style={styles.glovesWarningText}>⚠️ Gloves are required before patient contact</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={bsiItems['gloves'] ? 'Next' : 'Override & Continue'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  warningBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.clinicalYellowBg,
    padding: Spacing.base, borderRadius: Radius.md, marginBottom: Spacing.lg,
  },
  warningIcon: { fontSize: 28 },
  warningText: { ...Typography.body, color: Colors.clinicalYellow, flex: 1 },
  glovesWarning: {
    backgroundColor: Colors.clinicalRedBg, padding: Spacing.md,
    borderRadius: Radius.md, marginTop: Spacing.md,
  },
  glovesWarningText: { ...Typography.bodySmall, color: Colors.clinicalRed },
});
