/**
 * QuickSOAP — Step 4: ABCDE
 * One section at a time, no scrolling. Big binary buttons per question.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Chip } from '@/components/ui';
import { AIRWAY_STATUS, AIRWAY_INTERVENTIONS, CIRCULATION_INTERVENTIONS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const;
type Section = typeof SECTIONS[number];

const SECTION_META: Record<Section, { title: string; subtitle: string }> = {
  A: { title: 'Airway', subtitle: 'Open and clear?' },
  B: { title: 'Breathing', subtitle: 'Is the patient breathing?' },
  C: { title: 'Circulation', subtitle: 'Blood sweep + pulse' },
  D: { title: 'Disability', subtitle: 'Spinal injury suspected?' },
  E: { title: 'Expose', subtitle: 'Protect from environment' },
};

function BigButton({ label, sublabel, selected, color, onPress }: {
  label: string; sublabel?: string; selected: boolean; color?: string; onPress: () => void;
}) {
  const c = color ?? Colors.primary;
  return (
    <Pressable
      style={[styles.bigBtn, { borderColor: c }, selected && { backgroundColor: c + '15' }]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
    >
      <View style={[styles.bigBtnRadio, { borderColor: c }, selected && { backgroundColor: c }]}>
        {selected && <View style={styles.bigBtnDot} />}
      </View>
      <View style={styles.bigBtnText}>
        <Text style={[styles.bigBtnLabel, { color: selected ? c : Colors.textPrimary }]}>{label}</Text>
        {sublabel && <Text style={styles.bigBtnSublabel}>{sublabel}</Text>}
      </View>
    </Pressable>
  );
}

export default function ABCDEScreen() {
  const router = useRouter();
  const { dispatch, currentPatient } = useAssessment();
  const abcde = currentPatient?.abcde;
  const [section, setSection] = useState<Section>('A');

  const update = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_ABCDE', payload: { [field]: value } });
  };

  const goToSection = (s: Section) => { Haptics.selectionAsync(); setSection(s); };

  const handleNext = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx < SECTIONS.length - 1) {
      goToSection(SECTIONS[idx + 1]);
    } else {
      dispatch({ type: 'SET_STEP', payload: 5 });
      router.push('/assessment/physical-exam');
    }
  };

  const handleBack = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx > 0) {
      goToSection(SECTIONS[idx - 1]);
    } else {
      dispatch({ type: 'SET_STEP', payload: 3 });
      router.back();
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'A':
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.hint}>💡 If talking, airway is patent.</Text>
            {AIRWAY_STATUS.map(s => (
              <BigButton
                key={s.value} label={s.label} sublabel={s.description}
                selected={abcde?.airwayStatus === s.value}
                color={s.value === 'obstructed' ? Colors.clinicalRed : s.value === 'compromised' ? Colors.clinicalYellow : Colors.clinicalGreen}
                onPress={() => update('airwayStatus', s.value)}
              />
            ))}
            {(abcde?.airwayStatus === 'compromised' || abcde?.airwayStatus === 'obstructed') && (
              <View style={styles.chipRow}>
                {AIRWAY_INTERVENTIONS.map(i => (
                  <Chip key={i.key} label={i.label} selected={abcde?.airwayIntervention === i.key} onPress={() => update('airwayIntervention', i.key)} />
                ))}
              </View>
            )}
          </View>
        );
      case 'B':
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.hint}>💡 Expose chest. Rate recorded in Vitals.</Text>
            <BigButton label="Breathing" sublabel="Present and adequate" selected={abcde?.breathingPresent === true && abcde?.breathingAdequate === true} color={Colors.clinicalGreen} onPress={() => { update('breathingPresent', true); update('breathingAdequate', true); }} />
            <BigButton label="Breathing — Inadequate" sublabel="Present but insufficient" selected={abcde?.breathingPresent === true && abcde?.breathingAdequate === false} color={Colors.clinicalYellow} onPress={() => { update('breathingPresent', true); update('breathingAdequate', false); }} />
            <BigButton label="Not Breathing" sublabel="Begin rescue breathing" selected={abcde?.breathingPresent === false} color={Colors.clinicalRed} onPress={() => update('breathingPresent', false)} />
          </View>
        );
      case 'C':
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.hint}>💡 Hands in armpits, groin, back of neck. Check gloves for blood.</Text>
            <BigButton label="Pulse Present" selected={abcde?.circulationPulse === true} color={Colors.clinicalGreen} onPress={() => update('circulationPulse', true)} />
            <BigButton label="No Pulse — Begin CPR" selected={abcde?.circulationPulse === false} color={Colors.clinicalRed} onPress={() => update('circulationPulse', false)} />
            <BigButton label="Blood Found" selected={abcde?.bloodSweepFound === true} color={Colors.clinicalRed} onPress={() => update('bloodSweepFound', true)} />
            <BigButton label="No Blood Found" selected={abcde?.bloodSweepFound === false} color={Colors.clinicalGreen} onPress={() => update('bloodSweepFound', false)} />
            {abcde?.bloodSweepFound && (
              <View style={styles.chipRow}>
                {CIRCULATION_INTERVENTIONS.map(i => (
                  <Chip key={i.key} label={i.label} selected={abcde?.circulationIntervention === i.key} onPress={() => update('circulationIntervention', i.key)} />
                ))}
              </View>
            )}
          </View>
        );
      case 'D':
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.hint}>💡 Fall &gt;3× height, axial load, high-speed impact, diving, AMS + trauma → suspect spine.</Text>
            <BigButton label="No Spinal Concern" selected={abcde?.spineSuspected === false} color={Colors.clinicalGreen} onPress={() => update('spineSuspected', false)} />
            <BigButton label="Spinal Precautions" sublabel="Apply spinal motion restriction" selected={abcde?.spineSuspected === true} color={Colors.clinicalYellow} onPress={() => update('spineSuspected', true)} />
          </View>
        );
      case 'E':
        return (
          <View style={styles.sectionBody}>
            <BigButton label="Insulated from ground" selected={abcde?.exposeNotes?.includes('insulated') ?? false} onPress={() => update('exposeNotes', abcde?.exposeNotes?.includes('insulated') ? (abcde.exposeNotes.replace('insulated', '').trim()) : ((abcde?.exposeNotes ?? '') + ' insulated').trim())} />
            <BigButton label="Protected from wind/rain" selected={abcde?.exposeNotes?.includes('wind') ?? false} onPress={() => update('exposeNotes', abcde?.exposeNotes?.includes('wind') ? (abcde.exposeNotes.replace('wind', '').trim()) : ((abcde?.exposeNotes ?? '') + ' wind').trim())} />
            <BigButton label="Temperature managed" selected={abcde?.exposeNotes?.includes('temp') ?? false} onPress={() => update('exposeNotes', abcde?.exposeNotes?.includes('temp') ? (abcde.exposeNotes.replace('temp', '').trim()) : ((abcde?.exposeNotes ?? '') + ' temp').trim())} />
          </View>
        );
    }
  };

  const isLastSection = section === 'E';

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={4} title="ABCDE" reminder="Stop and fix life threats as you find them." />

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
        <Text style={styles.sectionTitle}>{SECTION_META[section].title}</Text>
        <Text style={styles.sectionSubtitle}>{SECTION_META[section].subtitle}</Text>
      </View>

      <View style={styles.content}>{renderContent()}</View>

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
  sectionBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, gap: Spacing.md, justifyContent: 'center', flex: 1 },

  hint: {
    ...Typography.bodySmall, color: Colors.clinicalBlue, backgroundColor: Colors.clinicalBlueBg,
    padding: Spacing.md, borderRadius: Radius.md,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },

  bigBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  bigBtnRadio: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  bigBtnDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.textOnPrimary },
  bigBtnText: { flex: 1 },
  bigBtnLabel: { ...Typography.h3, color: Colors.textPrimary },
  bigBtnSublabel: { ...Typography.caption, color: Colors.textHint, marginTop: 2 },
});
