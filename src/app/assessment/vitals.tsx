/**
 * QuickSOAP — Step 9: Vitals
 * Paginated — one vital at a time, no scrolling.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment, VitalsEntry, generateId } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { Card } from '@/components/ui';
import { VITAL_OPTIONS, VITAL_NORMALS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

function createEmptyVitals(): VitalsEntry {
  return {
    id: generateId(), recordedAt: new Date().toISOString(),
    loc: '', pulseRate: null, pulseQuality: '', pulseRegularity: '',
    respRate: null, respQuality: '', skinColor: '', skinTemp: '', skinMoisture: '',
    pupils: '', bpSystolic: null, bpDiastolic: null, spo2: null,
    capRefill: '', temperatureF: null, notes: '',
  };
}

function rangeColor(key: keyof typeof VITAL_NORMALS, value: number | null): string {
  if (value === null) return Colors.textHint;
  const n = VITAL_NORMALS[key];
  return (value < n.min || value > n.max) ? Colors.clinicalRed : Colors.clinicalGreen;
}

const VITAL_STEPS = ['pulse', 'resp', 'skin', 'pupils', 'other'] as const;
type VitalStep = typeof VITAL_STEPS[number];
const VITAL_STEP_LABELS: Record<VitalStep, string> = {
  pulse: 'Pulse', resp: 'Respirations', skin: 'Skin', pupils: 'Pupils', other: 'BP / SpO2',
};

function NumInput({ label, value, onChange, placeholder, rangeKey }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  placeholder: string; rangeKey?: keyof typeof VITAL_NORMALS;
}) {
  const color = rangeKey ? rangeColor(rangeKey, value) : Colors.textPrimary;
  return (
    <View style={ni.wrap}>
      <Text style={ni.label}>{label}</Text>
      <View style={[ni.box, value !== null && { borderColor: color }]}>
        <RNTextInput
          style={[ni.input, { color: value !== null ? color : Colors.textPrimary }]}
          value={value?.toString() ?? ''}
          onChangeText={(t) => onChange(t === '' ? null : parseInt(t) || null)}
          placeholder={placeholder}
          placeholderTextColor={Colors.textHint}
          keyboardType="number-pad"
        />
      </View>
      {rangeKey && value !== null && (
        <Text style={[ni.range, { color }]}>
          {VITAL_NORMALS[rangeKey].min}–{(VITAL_NORMALS[rangeKey] as any).max ?? VITAL_NORMALS[rangeKey].min}
          {' '}{VITAL_NORMALS[rangeKey].unit}
        </Text>
      )}
    </View>
  );
}

const ni = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  label: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase' },
  box: { borderWidth: 2, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  input: { ...Typography.h2, textAlign: 'center' },
  range: { ...Typography.caption, textAlign: 'center' },
});

function VitalGroup({ label, options, value, onChange }: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={vg.wrap}>
      <Text style={vg.label}>{label}</Text>
      <View style={vg.pills}>
        {options.map((opt) => {
          const sel = value === opt;
          return (
            <Pressable
              key={opt}
              style={[vg.pill, sel && vg.pillSelected]}
              onPress={() => { Haptics.selectionAsync(); onChange(opt); }}
            >
              <Text style={[vg.pillText, sel && vg.pillTextSelected]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const vg = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: Spacing.sm,
  },
  label: { ...Typography.label, color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  pill: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  pillSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  pillText: { ...Typography.body, color: Colors.textPrimary },
  pillTextSelected: { color: Colors.primary, fontWeight: '700' },
});

export default function VitalsScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [vitalStep, setVitalStep] = useState<VitalStep>('pulse');
  const [draft, setDraft] = useState<VitalsEntry>(createEmptyVitals);
  const [recording, setRecording] = useState(false);

  const vitalsLog = currentPatient?.vitals ?? [];
  const set = (fields: Partial<VitalsEntry>) => setDraft(prev => ({ ...prev, ...fields }));

  const saveVitals = () => {
    dispatch({ type: 'ADD_VITALS', payload: { ...draft, recordedAt: new Date().toISOString() } });
    setDraft(createEmptyVitals());
    setVitalStep('pulse');
    setRecording(false);
  };

  const handleNext = () => {
    if (recording) {
      const stepIdx = VITAL_STEPS.indexOf(vitalStep);
      if (stepIdx < VITAL_STEPS.length - 1) {
        setVitalStep(VITAL_STEPS[stepIdx + 1]);
      } else {
        saveVitals();
      }
      return;
    }
    dispatch({ type: 'SET_STEP', payload: 9 });
    router.push('/assessment/soap-summary');
  };

  const handleBack = () => {
    if (recording) {
      const stepIdx = VITAL_STEPS.indexOf(vitalStep);
      if (stepIdx > 0) { setVitalStep(VITAL_STEPS[stepIdx - 1]); return; }
      setRecording(false);
      return;
    }
    const prevStep = state.isAmsDetected ? 7 : 6;
    dispatch({ type: 'SET_STEP', payload: prevStep });
    router.back();
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderVitalStep = () => {
    switch (vitalStep) {
      case 'pulse':
        return (
          <View style={styles.stepContent}>
            <NumInput label="Heart Rate (bpm)" value={draft.pulseRate} onChange={(v) => set({ pulseRate: v })} placeholder="72" rangeKey="pulseRate" />
            <VitalGroup label="Quality" options={VITAL_OPTIONS.pulseQuality} value={draft.pulseQuality} onChange={(v) => set({ pulseQuality: v })} />
            <VitalGroup label="Regularity" options={VITAL_OPTIONS.pulseRegularity} value={draft.pulseRegularity} onChange={(v) => set({ pulseRegularity: v })} />
          </View>
        );
      case 'resp':
        return (
          <View style={styles.stepContent}>
            <NumInput label="Respiratory Rate (breaths/min)" value={draft.respRate} onChange={(v) => set({ respRate: v })} placeholder="16" rangeKey="respRate" />
            <VitalGroup label="Quality" options={VITAL_OPTIONS.respQuality} value={draft.respQuality} onChange={(v) => set({ respQuality: v })} />
          </View>
        );
      case 'skin':
        return (
          <View style={styles.stepContent}>
            <VitalGroup label="Color" options={VITAL_OPTIONS.skinColor} value={draft.skinColor} onChange={(v) => set({ skinColor: v })} />
            <VitalGroup label="Temperature" options={VITAL_OPTIONS.skinTemp} value={draft.skinTemp} onChange={(v) => set({ skinTemp: v })} />
            <VitalGroup label="Moisture" options={VITAL_OPTIONS.skinMoisture} value={draft.skinMoisture} onChange={(v) => set({ skinMoisture: v })} />
            <VitalGroup label="Cap Refill" options={VITAL_OPTIONS.capRefill} value={draft.capRefill} onChange={(v) => set({ capRefill: v })} />
          </View>
        );
      case 'pupils':
        return (
          <View style={styles.stepContent}>
            <VitalGroup label="Pupils" options={VITAL_OPTIONS.pupils} value={draft.pupils} onChange={(v) => set({ pupils: v })} />
          </View>
        );
      case 'other':
        return (
          <View style={styles.stepContent}>
            <View style={styles.bpRow}>
              <View style={{ flex: 1 }}>
                <NumInput label="Systolic" value={draft.bpSystolic} onChange={(v) => set({ bpSystolic: v })} placeholder="120" rangeKey="bpSystolic" />
              </View>
              <Text style={styles.slash}>/</Text>
              <View style={{ flex: 1 }}>
                <NumInput label="Diastolic" value={draft.bpDiastolic} onChange={(v) => set({ bpDiastolic: v })} placeholder="80" />
              </View>
            </View>
            <NumInput label="SpO2 (%)" value={draft.spo2} onChange={(v) => set({ spo2: v })} placeholder="98" rangeKey="spo2" />
          </View>
        );
    }
  };

  if (!recording) {
    return (
      <View style={styles.container}>
        <StepHeader stepNumber={8} title="Vitals" reminder="Baseline now. Repeat every 5 min (critical) or 15 min (stable)." />

        <View style={styles.logSection}>
          {vitalsLog.map((v, i) => (
            <Card key={v.id} variant="outlined" style={styles.vitalRow}>
              <Text style={styles.vitalSetLabel}>Set {i + 1} · {formatTime(v.recordedAt)}</Text>
              <View style={styles.vitalCells}>
                {v.pulseRate !== null && <Text style={[styles.cell, { color: rangeColor('pulseRate', v.pulseRate) }]}>HR {v.pulseRate}</Text>}
                {v.respRate !== null && <Text style={[styles.cell, { color: rangeColor('respRate', v.respRate) }]}>RR {v.respRate}</Text>}
                {v.spo2 !== null && <Text style={[styles.cell, { color: rangeColor('spo2', v.spo2) }]}>SpO2 {v.spo2}%</Text>}
                {v.skinColor !== '' && <Text style={styles.cell}>{v.skinColor}</Text>}
                {v.pupils !== '' && <Text style={styles.cell}>{v.pupils}</Text>}
              </View>
            </Card>
          ))}
        </View>

        <Pressable style={styles.recordBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setRecording(true); }}>
          <Text style={styles.recordBtnText}>+ Record Vitals</Text>
        </Pressable>

        <WizardNav onBack={handleBack} onNext={handleNext} />
      </View>
    );
  }

  const stepIdx = VITAL_STEPS.indexOf(vitalStep);
  const isLastVitalStep = stepIdx === VITAL_STEPS.length - 1;

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={8} title="Vitals" />

      <View style={styles.vitalStepRow}>
        {VITAL_STEPS.map((s, i) => (
          <Pressable key={s} onPress={() => setVitalStep(s)} style={[styles.vitalStepDot, i === stepIdx && styles.vitalStepDotActive, i < stepIdx && styles.vitalStepDotDone]}>
            <Text style={[styles.vitalStepDotText, (i === stepIdx || i < stepIdx) && styles.vitalStepDotTextActive]}>{VITAL_STEP_LABELS[s].slice(0, 4)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.vitalStepTitle}>{VITAL_STEP_LABELS[vitalStep]}</Text>

      <View style={styles.content}>{renderVitalStep()}</View>

      <WizardNav
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={isLastVitalStep ? 'Save' : VITAL_STEP_LABELS[VITAL_STEPS[stepIdx + 1]]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },

  logSection: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },
  vitalRow: { padding: Spacing.md },
  vitalSetLabel: { ...Typography.label, color: Colors.primary, textTransform: 'uppercase', marginBottom: Spacing.xs },
  vitalCells: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  cell: { ...Typography.bodySmall, color: Colors.textPrimary },

  recordBtn: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    paddingVertical: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed', alignItems: 'center',
  },
  recordBtnText: { ...Typography.button, color: Colors.primary },

  vitalStepRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingTop: Spacing.md },
  vitalStepDot: {
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
    borderRadius: Radius.md, backgroundColor: Colors.background,
    borderWidth: 2, borderColor: Colors.borderLight, alignItems: 'center', minWidth: 52,
  },
  vitalStepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  vitalStepDotDone: { backgroundColor: Colors.clinicalGreen, borderColor: Colors.clinicalGreen },
  vitalStepDotText: { ...Typography.caption, color: Colors.textHint },
  vitalStepDotTextActive: { color: Colors.textOnPrimary },
  vitalStepTitle: { ...Typography.h2, color: Colors.textPrimary, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },

  stepContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md, flex: 1, justifyContent: 'center' },

  bpRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  slash: { ...Typography.h2, color: Colors.textSecondary, paddingTop: Spacing.lg },
});
