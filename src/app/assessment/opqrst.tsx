/**
 * QuickSOAP — Step 7: OPQRST
 * Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Time
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TextInput, Chip } from '@/components/ui';
import { PAIN_QUALITIES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';
import { NumericStepper } from '@/components/ui';

export default function OPQRSTScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const opqrst = currentPatient?.opqrst;

  const update = (fields: Parameters<typeof dispatch>[0] extends { type: 'UPDATE_OPQRST'; payload: infer P } ? P : never) => {
    dispatch({ type: 'UPDATE_OPQRST', payload: fields });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 8 });
    if (state.isAmsDetected) {
      router.push('/assessment/stop-eats');
    } else {
      router.push('/assessment/vitals');
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
    router.back();
  };

  const severityColor = (opqrst?.severity ?? 0) >= 7
    ? Colors.clinicalRed
    : (opqrst?.severity ?? 0) >= 4
      ? Colors.clinicalYellow
      : Colors.clinicalGreen;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={7}
          title="OPQRST"
          reminder="Characterize the chief complaint in detail. Use open-ended questions first."
        />

        {/* Onset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O — Onset</Text>
          <TextInput
            label="When did it start? What were you doing?"
            placeholder="Sudden vs. gradual, activity at onset..."
            value={opqrst?.onset ?? ''}
            onChangeText={(text) => update({ onset: text })}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Provocation / Palliation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>P — Provocation / Palliation</Text>
          <TextInput
            label="What makes it worse?"
            placeholder="Movement, breathing, pressure, position..."
            value={opqrst?.provocation ?? ''}
            onChangeText={(text) => update({ provocation: text })}
            multiline
            numberOfLines={2}
          />
          <TextInput
            label="What makes it better?"
            placeholder="Rest, position change, medication..."
            value={opqrst?.palliation ?? ''}
            onChangeText={(text) => update({ palliation: text })}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Q — Quality</Text>
          <Text style={styles.hint}>Tap to select or describe in your own words</Text>
          <View style={styles.chipGrid}>
            {PAIN_QUALITIES.map((q) => (
              <Chip
                key={q}
                label={q}
                selected={opqrst?.quality === q}
                onPress={() => update({ quality: opqrst?.quality === q ? '' : q })}
              />
            ))}
          </View>
          <TextInput
            label="Describe in patient's own words"
            placeholder="Other description..."
            value={opqrst?.quality ?? ''}
            onChangeText={(text) => update({ quality: text })}
          />
        </View>

        {/* Region / Radiation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>R — Region / Radiation</Text>
          <TextInput
            label="Where is it? Does it radiate?"
            placeholder="Location, does it travel to shoulder, arm, jaw, back..."
            value={opqrst?.region ?? ''}
            onChangeText={(text) => update({ region: text })}
            multiline
            numberOfLines={2}
          />
          <TextInput
            label="Radiation"
            placeholder="Does the pain move anywhere else?"
            value={opqrst?.radiation ?? ''}
            onChangeText={(text) => update({ radiation: text })}
          />
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>S — Severity</Text>
          <Text style={styles.hint}>0 = no pain, 10 = worst imaginable</Text>
          <View style={styles.severityRow}>
            <NumericStepper
              value={opqrst?.severity ?? 0}
              onChange={(val) => update({ severity: val })}
              min={0}
              max={10}
            />
            <View style={[styles.severityBadge, { backgroundColor: severityColor + '22' }]}>
              <Text style={[styles.severityScore, { color: severityColor }]}>
                {opqrst?.severity ?? 0}/10
              </Text>
              <Text style={[styles.severityLabel, { color: severityColor }]}>
                {(opqrst?.severity ?? 0) >= 7 ? 'Severe' : (opqrst?.severity ?? 0) >= 4 ? 'Moderate' : 'Mild'}
              </Text>
            </View>
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>T — Time / Duration</Text>
          <TextInput
            label="How long? Constant or intermittent?"
            placeholder="Started 2 hours ago, comes and goes every 10 min..."
            value={opqrst?.timeDuration ?? ''}
            onChangeText={(text) => update({ timeDuration: text })}
            multiline
            numberOfLines={2}
          />
        </View>

        {state.isAmsDetected && (
          <View style={styles.amsNotice}>
            <Text style={styles.amsNoticeText}>
              ⚠️ AMS detected — STOP EATS differential will follow
            </Text>
          </View>
        )}
      </ScrollView>

      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  hint: { ...Typography.caption, color: Colors.textHint, marginTop: -Spacing.xs },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  severityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, paddingTop: Spacing.sm },
  severityBadge: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderRadius: Radius.lg, alignItems: 'center',
  },
  severityScore: { ...Typography.h1 },
  severityLabel: { ...Typography.caption, fontWeight: '600' },
  amsNotice: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.clinicalYellowBg, padding: Spacing.md,
    borderRadius: Radius.md,
  },
  amsNoticeText: { ...Typography.bodySmall, color: Colors.clinicalYellow },
});
