/**
 * QuickSOAP — Step 8: STOP EATS (conditional — AMS differential)
 * Sugar, Temperature, Oxygen, Pressure, Electricity, Altitude, Toxins, Salts
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TextInput } from '@/components/ui';
import { STOP_EATS_CAUSES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function StopEatsScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const stopEats = currentPatient?.stopEats;

  const update = (fields: Partial<typeof stopEats>) => {
    dispatch({ type: 'UPDATE_STOP_EATS', payload: fields as any });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 9 });
    router.push('/assessment/vitals');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 7 });
    router.back();
  };

  const fieldKeys: Record<string, keyof NonNullable<typeof stopEats>> = {
    sugar: 'sugar',
    temperature: 'temperature',
    oxygen: 'oxygen',
    pressure: 'pressure',
    electricity: 'electricity',
    altitude: 'altitude',
    toxins: 'toxins',
    salts: 'salts',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={8}
          title="STOP EATS"
          reminder="AMS differential — systematically rule out reversible causes of altered mental status."
        />

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Altered Mental Status Detected</Text>
          <Text style={styles.warningText}>
            Work through each cause. Document findings even if ruled out.
          </Text>
        </View>

        {STOP_EATS_CAUSES.map((cause) => {
          const key = fieldKeys[cause.key];
          const value = (stopEats?.[key] as string) ?? '';
          return (
            <View key={cause.key} style={styles.causeCard}>
              <View style={styles.causeHeader}>
                <View style={styles.letterBadge}>
                  <Text style={styles.letterText}>{cause.letter}</Text>
                </View>
                <View style={styles.causeTitleBlock}>
                  <Text style={styles.causeTitle}>{cause.label}</Text>
                  <Text style={styles.causePrompt}>{cause.prompt}</Text>
                </View>
              </View>
              <TextInput
                label="Findings / Notes"
                placeholder="Ruled out / suspected / confirmed..."
                value={value}
                onChangeText={(text) => update({ [cause.key]: text })}
                multiline
                numberOfLines={2}
              />
            </View>
          );
        })}

        <View style={styles.section}>
          <TextInput
            label="Most Likely Cause"
            placeholder="Leading diagnosis or differential..."
            value={stopEats?.suspectedCause ?? ''}
            onChangeText={(text) => update({ suspectedCause: text })}
            multiline
            numberOfLines={2}
          />
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

  warningBox: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.clinicalYellowBg, padding: Spacing.base,
    borderRadius: Radius.md, borderLeftWidth: 4, borderLeftColor: Colors.clinicalYellow,
  },
  warningTitle: { ...Typography.h3, color: Colors.clinicalYellow, marginBottom: Spacing.xs },
  warningText: { ...Typography.bodySmall, color: Colors.clinicalYellow },

  causeCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.base, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  causeHeader: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  letterBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  letterText: { ...Typography.h3, color: Colors.primary },
  causeTitleBlock: { flex: 1 },
  causeTitle: { ...Typography.h3, color: Colors.textPrimary },
  causePrompt: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
});
