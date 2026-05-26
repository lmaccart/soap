/**
 * QuickSOAP — Step 4: ABCDE Assessment
 * Accordion-style sections for Airway, Breathing, Circulation, Disability, Expose.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { RadioGroup, Checkbox, TextInput } from '@/components/ui';
import { Chip } from '@/components/ui';
import { AIRWAY_STATUS, AIRWAY_INTERVENTIONS, CIRCULATION_INTERVENTIONS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const;
const SECTION_LABELS: Record<string, { title: string; subtitle: string }> = {
  A: { title: 'Airway', subtitle: 'Is the airway open and clear?' },
  B: { title: 'Breathing', subtitle: 'Is the patient breathing?' },
  C: { title: 'Circulation', subtitle: 'Run gloved hands over entire body' },
  D: { title: 'Disability', subtitle: 'Spinal injury suspected?' },
  E: { title: 'Expose / Environment', subtitle: 'Protect from elements' },
};

export default function ABCDEScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const abcde = currentPatient?.abcde;
  const [activeSection, setActiveSection] = useState<string>('A');

  const update = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_ABCDE', payload: { [field]: value } });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
    router.push('/assessment/physical-exam');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
    router.back();
  };

  const renderSection = (section: string) => {
    if (section !== activeSection) return null;

    switch (section) {
      case 'A':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.reminder}>💡 If the patient is talking, the airway is patent.</Text>
            <RadioGroup
              options={AIRWAY_STATUS.map(s => ({ value: s.value, label: s.label, description: s.description }))}
              value={abcde?.airwayStatus ?? ''}
              onChange={(v) => update('airwayStatus', v)}
            />
            {(abcde?.airwayStatus === 'compromised' || abcde?.airwayStatus === 'obstructed') && (
              <>
                <Text style={styles.fieldLabel}>Intervention Applied</Text>
                <View style={styles.chipRow}>
                  {AIRWAY_INTERVENTIONS.map((i) => (
                    <Chip
                      key={i.key}
                      label={i.label}
                      selected={abcde?.airwayIntervention === i.key}
                      onPress={() => update('airwayIntervention', i.key)}
                    />
                  ))}
                </View>
              </>
            )}
            <TextInput label="Notes" value={abcde?.airwayNotes ?? ''} onChangeText={(v) => update('airwayNotes', v)} multiline placeholder="Observations..." />
          </View>
        );
      case 'B':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.reminder}>💡 Expose chest. If breathing, move on. Rate is recorded in Vitals.</Text>
            <Text style={styles.fieldLabel}>Breathing Present?</Text>
            <RadioGroup
              options={[
                { value: 'yes', label: 'Yes', description: 'Patient is breathing' },
                { value: 'no', label: 'No', description: 'Not breathing — begin rescue breathing', color: Colors.clinicalRed },
              ]}
              value={abcde?.breathingPresent === true ? 'yes' : abcde?.breathingPresent === false ? 'no' : ''}
              onChange={(v) => update('breathingPresent', v === 'yes')}
              direction="horizontal"
            />
            {abcde?.breathingPresent === true && (
              <>
                <Text style={styles.fieldLabel}>Adequate?</Text>
                <RadioGroup
                  options={[
                    { value: 'yes', label: 'Adequate' },
                    { value: 'no', label: 'Inadequate', color: Colors.clinicalYellow },
                  ]}
                  value={abcde?.breathingAdequate === true ? 'yes' : abcde?.breathingAdequate === false ? 'no' : ''}
                  onChange={(v) => update('breathingAdequate', v === 'yes')}
                  direction="horizontal"
                />
              </>
            )}
            <TextInput label="Chest Exam Notes" value={abcde?.breathingNotes ?? ''} onChangeText={(v) => update('breathingNotes', v)} multiline placeholder="Chest wounds, uneven movement, flail..." />
          </View>
        );
      case 'C':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.reminder}>💡 Hands in armpits, behind neck, small of back, groin. Check gloves for blood.</Text>
            <Text style={styles.fieldLabel}>Pulse Present?</Text>
            <RadioGroup
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No — Begin CPR', color: Colors.clinicalRed },
              ]}
              value={abcde?.circulationPulse === true ? 'yes' : abcde?.circulationPulse === false ? 'no' : ''}
              onChange={(v) => update('circulationPulse', v === 'yes')}
              direction="horizontal"
            />
            <Text style={styles.fieldLabel}>Blood Sweep — Found Blood?</Text>
            <RadioGroup
              options={[
                { value: 'no', label: 'No blood found', color: Colors.clinicalGreen },
                { value: 'yes', label: 'Blood found', color: Colors.clinicalRed },
              ]}
              value={abcde?.bloodSweepFound === true ? 'yes' : abcde?.bloodSweepFound === false ? 'no' : ''}
              onChange={(v) => update('bloodSweepFound', v === 'yes')}
              direction="horizontal"
            />
            {abcde?.bloodSweepFound && (
              <>
                <TextInput label="Bleeding Location" value={abcde?.bleedingLocation ?? ''} onChangeText={(v) => update('bleedingLocation', v)} placeholder="Where is the bleeding?" />
                <Text style={styles.fieldLabel}>Intervention</Text>
                <View style={styles.chipRow}>
                  {CIRCULATION_INTERVENTIONS.map((i) => (
                    <Chip key={i.key} label={i.label} selected={abcde?.circulationIntervention === i.key} onPress={() => update('circulationIntervention', i.key)} />
                  ))}
                </View>
              </>
            )}
          </View>
        );
      case 'D':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.reminder}>💡 Consider MOI: fall &gt;3× height, axial loading, high-speed impact, diving, AMS with trauma.</Text>
            <Text style={styles.fieldLabel}>Spinal Injury Suspected?</Text>
            <RadioGroup
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes — Apply spinal motion restriction', color: Colors.clinicalYellow },
              ]}
              value={abcde?.spineSuspected === true ? 'yes' : abcde?.spineSuspected === false ? 'no' : ''}
              onChange={(v) => update('spineSuspected', v === 'yes')}
            />
            <TextInput label="Notes" value={abcde?.disabilityNotes ?? ''} onChangeText={(v) => update('disabilityNotes', v)} multiline placeholder="Gross motor/sensory findings..." />
          </View>
        );
      case 'E':
        return (
          <View style={styles.sectionContent}>
            <Checkbox label="Insulated from ground" checked={abcde?.exposeNotes?.includes('insulated') ?? false} onChange={() => update('exposeNotes', (abcde?.exposeNotes ?? '') + ' insulated')} />
            <Checkbox label="Protected from wind/rain" checked={abcde?.exposeNotes?.includes('wind') ?? false} onChange={() => update('exposeNotes', (abcde?.exposeNotes ?? '') + ' wind')} />
            <Checkbox label="Temperature managed" checked={abcde?.exposeNotes?.includes('temp') ?? false} onChange={() => update('exposeNotes', (abcde?.exposeNotes ?? '') + ' temp')} />
            <TextInput label="Environment Notes" value={abcde?.exposeNotes ?? ''} onChangeText={(v) => update('exposeNotes', v)} multiline placeholder="Environmental protections applied..." />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={4}
          title="ABCDE"
          reminder="Stop and fix life threats as you find them. Do not move on until each is addressed."
        />

        {SECTIONS.map((section) => {
          const isActive = section === activeSection;
          const info = SECTION_LABELS[section];
          return (
            <View key={section}>
              <Pressable
                onPress={() => setActiveSection(section)}
                style={[styles.accordion, isActive && styles.accordionActive]}
              >
                <View style={[styles.letterBadge, isActive && styles.letterBadgeActive]}>
                  <Text style={[styles.letter, isActive && styles.letterActive]}>{section}</Text>
                </View>
                <View style={styles.accordionText}>
                  <Text style={[styles.accordionTitle, isActive && styles.accordionTitleActive]}>{info.title}</Text>
                  <Text style={styles.accordionSubtitle}>{info.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>{isActive ? '▼' : '▶'}</Text>
              </Pressable>
              {renderSection(section)}
            </View>
          );
        })}
      </ScrollView>

      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  accordion: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  accordionActive: { backgroundColor: Colors.primaryLight },
  letterBadge: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  letterBadgeActive: { backgroundColor: Colors.primary },
  letter: { ...Typography.h2, color: Colors.textSecondary, fontSize: 18 },
  letterActive: { color: Colors.textOnPrimary },
  accordionText: { flex: 1 },
  accordionTitle: { ...Typography.h3, color: Colors.textPrimary },
  accordionTitleActive: { color: Colors.primaryDark },
  accordionSubtitle: { ...Typography.caption, color: Colors.textSecondary },
  chevron: { fontSize: 12, color: Colors.textHint },
  sectionContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.base, backgroundColor: Colors.surface },
  reminder: {
    ...Typography.bodySmall, color: Colors.clinicalBlue, backgroundColor: Colors.clinicalBlueBg,
    padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.base,
  },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
