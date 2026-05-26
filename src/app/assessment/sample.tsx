/**
 * QuickSOAP — Step 6: SAMPLE History
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TextInput, Chip } from '@/components/ui';
import { COMMON_ALLERGIES, COMMON_CONDITIONS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

export default function SAMPLEScreen() {
  const router = useRouter();
  const { dispatch, currentPatient } = useAssessment();
  const sample = currentPatient?.sample;

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_SAMPLE', payload: { [field]: value } });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 7 });
    router.push('/assessment/opqrst');
  };
  const handleBack = () => { dispatch({ type: 'SET_STEP', payload: 5 }); router.back(); };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader stepNumber={6} title="SAMPLE History" reminder="Gather patient history. Keep it conversational." />

        <View style={styles.section}>
          <Text style={styles.letterHeader}>S — Signs & Symptoms</Text>
          <Text style={styles.prompt}>Ask: "What's bothering you the most?"</Text>
          <TextInput value={sample?.signsSymptoms ?? ''} onChangeText={(v) => update('signsSymptoms', v)} multiline numberOfLines={3} placeholder="Chief complaint and current symptoms..." />

          <Text style={styles.letterHeader}>A — Allergies</Text>
          <Text style={styles.prompt}>Ask: "Do you have any allergies?"</Text>
          <View style={styles.chipRow}>
            {COMMON_ALLERGIES.map((a) => (
              <Chip key={a} label={a} selected={(sample?.allergies ?? '').includes(a)} onPress={() => update('allergies', sample?.allergies ? `${sample.allergies}, ${a}` : a)} />
            ))}
          </View>
          <TextInput value={sample?.allergies ?? ''} onChangeText={(v) => update('allergies', v)} placeholder="List all allergies..." />

          <Text style={styles.letterHeader}>M — Medications</Text>
          <Text style={styles.prompt}>Ask: "Are you taking any medications? Prescription, OTC, supplements?"</Text>
          <TextInput value={sample?.medications ?? ''} onChangeText={(v) => update('medications', v)} multiline placeholder="Medications, dosage, frequency..." />

          <Text style={styles.letterHeader}>P — Past Medical History</Text>
          <Text style={styles.prompt}>Ask: "Do you have any medical conditions?"</Text>
          <View style={styles.chipRow}>
            {COMMON_CONDITIONS.map((c) => (
              <Chip key={c} label={c} selected={(sample?.pastMedical ?? '').includes(c)} onPress={() => update('pastMedical', sample?.pastMedical ? `${sample.pastMedical}, ${c}` : c)} />
            ))}
          </View>
          <TextInput value={sample?.pastMedical ?? ''} onChangeText={(v) => update('pastMedical', v)} multiline placeholder="Past injuries, surgeries, chronic conditions..." />

          <Text style={styles.letterHeader}>L — Last Intake / Output</Text>
          <Text style={styles.prompt}>Ask: "When did you last eat/drink? Last urination?"</Text>
          <TextInput label="Last Food/Drink" value={sample?.lastIntake ?? ''} onChangeText={(v) => update('lastIntake', v)} placeholder="What and when..." />
          <TextInput label="Last Output" value={sample?.lastOutput ?? ''} onChangeText={(v) => update('lastOutput', v)} placeholder="Last urination/BM..." />

          <Text style={styles.letterHeader}>E — Events</Text>
          <Text style={styles.prompt}>Ask: "What were you doing? What happened leading up to this?"</Text>
          <TextInput value={sample?.events ?? ''} onChangeText={(v) => update('events', v)} multiline numberOfLines={4} placeholder="Describe the events..." />
        </View>
      </ScrollView>
      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  letterHeader: { ...Typography.h2, color: Colors.primary, marginTop: Spacing.xl, marginBottom: Spacing.xs },
  prompt: { ...Typography.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: Spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
});
