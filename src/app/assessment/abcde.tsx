/**
 * QuickSOAP — Step 4: ABCDE
 * Purely informational reference cards — no data collection.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const;
type Section = typeof SECTIONS[number];

const SECTION_META: Record<Section, { title: string; subtitle: string; prompt: string }> = {
  A: {
    title: 'Airway',
    subtitle: 'Open and clear?',
    prompt:
      'Is the airway open and clear? If the patient is talking, the airway is patent. Reposition jaw thrust / chin lift if needed. Look for secretions, vomitus, or foreign body.',
  },
  B: {
    title: 'Breathing',
    subtitle: 'Is the patient breathing?',
    prompt:
      'Is the patient breathing? Is it adequate? Expose the chest, watch for rise and fall. Rate will be recorded in Vitals. Assist ventilations if absent or inadequate.',
  },
  C: {
    title: 'Circulation',
    subtitle: 'Blood sweep + pulse',
    prompt:
      'Perform a blood sweep (hands in armpits, groin, back of neck — check gloves for blood). Assess pulse: rate, quality, regularity. Control any major bleeding now.',
  },
  D: {
    title: 'Disability',
    subtitle: 'Spinal injury suspected?',
    prompt:
      'Spinal injury suspected? Consider: fall >3× height, axial load, high-speed impact, diving, AMS + trauma. Apply spinal motion restriction if in doubt.',
  },
  E: {
    title: 'Expose',
    subtitle: 'Protect from environment',
    prompt:
      'Expose injuries while protecting from environment. Insulate from ground. Shield from wind and rain. Maintain body temperature. Protect dignity.',
  },
};

export default function ABCDEScreen() {
  const router = useRouter();
  const { dispatch } = useAssessment();
  const [section, setSection] = useState<Section>('A');

  const goToSection = (s: Section) => { Haptics.selectionAsync(); setSection(s); };

  const handleNext = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx < SECTIONS.length - 1) {
      goToSection(SECTIONS[idx + 1]);
    } else {
      dispatch({ type: 'SET_STEP', payload: 4 });
      router.push('/assessment/physical-exam');
    }
  };

  const handleBack = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx > 0) {
      goToSection(SECTIONS[idx - 1]);
    } else {
      dispatch({ type: 'SET_STEP', payload: 2 });
      router.back();
    }
  };

  const isLastSection = section === 'E';
  const meta = SECTION_META[section];

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={3} title="ABCDE" reminder="Stop and fix life threats as you find them." />

      {/* Section tabs */}
      <View style={styles.tabs}>
        {SECTIONS.map((s) => (
          <Pressable key={s} style={[styles.tab, s === section && styles.tabActive]} onPress={() => goToSection(s)}>
            <Text style={[styles.tabText, s === section && styles.tabTextActive]}>{s}</Text>
            <Text style={styles.tabSub}>{SECTION_META[s].subtitle.split(' ')[0]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{meta.title}</Text>
        <Text style={styles.sectionSubtitle}>{meta.subtitle}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionBody}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardText}>{meta.prompt}</Text>
          </View>
        </View>
      </View>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={isLastSection ? 'Next Step' : SECTION_META[SECTIONS[SECTIONS.indexOf(section) + 1]].title}
        isLastStep={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: Radius.md, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { ...Typography.h3, color: Colors.textSecondary, fontSize: 18 },
  tabTextActive: { color: Colors.textOnPrimary },
  tabSub: { ...Typography.caption, color: Colors.textHint, fontSize: 9 },

  sectionHeader: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xs },
  sectionTitle: { ...Typography.h2, color: Colors.textPrimary },
  sectionSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary },

  content: { flex: 1 },
  sectionBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, flex: 1, justifyContent: 'center' },

  infoCard: {
    backgroundColor: Colors.clinicalBlueBg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  infoCardText: {
    ...Typography.body,
    color: Colors.clinicalBlue,
    lineHeight: 26,
  },
});
