/**
 * QuickSOAP — Step 9: Vitals
 * Serial vital sign recording with normal range indicators.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment, VitalsEntry, generateId } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TextInput, RadioGroup, Card, Divider } from '@/components/ui';
import { VITAL_OPTIONS, VITAL_NORMALS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';

function createEmptyVitals(): VitalsEntry {
  return {
    id: generateId(),
    recordedAt: new Date().toISOString(),
    loc: '',
    pulseRate: null,
    pulseQuality: '',
    pulseRegularity: '',
    respRate: null,
    respQuality: '',
    skinColor: '',
    skinTemp: '',
    skinMoisture: '',
    pupils: '',
    bpSystolic: null,
    bpDiastolic: null,
    spo2: null,
    capRefill: '',
    temperatureF: null,
    notes: '',
  };
}

function rangeColor(key: keyof typeof VITAL_NORMALS, value: number | null): string {
  if (value === null) return Colors.textHint;
  const norm = VITAL_NORMALS[key];
  if (value < norm.min || value > norm.max) return Colors.clinicalRed;
  return Colors.clinicalGreen;
}

interface VitalsFormProps {
  vitals: VitalsEntry;
  onChange: (v: VitalsEntry) => void;
}

function VitalsForm({ vitals, onChange }: VitalsFormProps) {
  const set = (fields: Partial<VitalsEntry>) => onChange({ ...vitals, ...fields });

  return (
    <View style={form.container}>
      {/* LOC */}
      <View style={form.section}>
        <Text style={form.label}>Level of Consciousness</Text>
        <TextInput
          label="LOC"
          placeholder="A+Ox4, A+Ox3, V, P, U..."
          value={vitals.loc}
          onChangeText={(t) => set({ loc: t })}
        />
      </View>

      {/* Pulse */}
      <View style={form.section}>
        <Text style={form.label}>Pulse</Text>
        <View style={form.row}>
          <View style={form.numericField}>
            <TextInput
              label="Rate (bpm)"
              placeholder="72"
              value={vitals.pulseRate?.toString() ?? ''}
              onChangeText={(t) => set({ pulseRate: t === '' ? null : parseInt(t) || null })}
              keyboardType="number-pad"
            />
            {vitals.pulseRate !== null && (
              <Text style={[form.rangeNote, { color: rangeColor('pulseRate', vitals.pulseRate) }]}>
                Normal: {VITAL_NORMALS.pulseRate.min}–{VITAL_NORMALS.pulseRate.max} bpm
              </Text>
            )}
          </View>
        </View>
        <RadioGroup
          options={VITAL_OPTIONS.pulseQuality.map(v => ({ value: v, label: v }))}
          value={vitals.pulseQuality}
          onChange={(v) => set({ pulseQuality: v })}
          direction="horizontal"
        />
        <RadioGroup
          options={VITAL_OPTIONS.pulseRegularity.map(v => ({ value: v, label: v }))}
          value={vitals.pulseRegularity}
          onChange={(v) => set({ pulseRegularity: v })}
          direction="horizontal"
        />
      </View>

      {/* Respirations */}
      <View style={form.section}>
        <Text style={form.label}>Respirations</Text>
        <View style={form.numericField}>
          <TextInput
            label="Rate (breaths/min)"
            placeholder="16"
            value={vitals.respRate?.toString() ?? ''}
            onChangeText={(t) => set({ respRate: t === '' ? null : parseInt(t) || null })}
            keyboardType="number-pad"
          />
          {vitals.respRate !== null && (
            <Text style={[form.rangeNote, { color: rangeColor('respRate', vitals.respRate) }]}>
              Normal: {VITAL_NORMALS.respRate.min}–{VITAL_NORMALS.respRate.max} breaths/min
            </Text>
          )}
        </View>
        <RadioGroup
          options={VITAL_OPTIONS.respQuality.map(v => ({ value: v, label: v }))}
          value={vitals.respQuality}
          onChange={(v) => set({ respQuality: v })}
          direction="horizontal"
        />
      </View>

      {/* Skin */}
      <View style={form.section}>
        <Text style={form.label}>Skin</Text>
        <Text style={form.sublabel}>Color</Text>
        <RadioGroup
          options={VITAL_OPTIONS.skinColor.map(v => ({ value: v, label: v }))}
          value={vitals.skinColor}
          onChange={(v) => set({ skinColor: v })}
          direction="horizontal"
        />
        <Text style={form.sublabel}>Temperature</Text>
        <RadioGroup
          options={VITAL_OPTIONS.skinTemp.map(v => ({ value: v, label: v }))}
          value={vitals.skinTemp}
          onChange={(v) => set({ skinTemp: v })}
          direction="horizontal"
        />
        <Text style={form.sublabel}>Moisture</Text>
        <RadioGroup
          options={VITAL_OPTIONS.skinMoisture.map(v => ({ value: v, label: v }))}
          value={vitals.skinMoisture}
          onChange={(v) => set({ skinMoisture: v })}
          direction="horizontal"
        />
      </View>

      {/* Pupils */}
      <View style={form.section}>
        <Text style={form.label}>Pupils</Text>
        <RadioGroup
          options={VITAL_OPTIONS.pupils.map(v => ({ value: v, label: v }))}
          value={vitals.pupils}
          onChange={(v) => set({ pupils: v })}
          direction="horizontal"
        />
      </View>

      {/* Blood Pressure */}
      <View style={form.section}>
        <Text style={form.label}>Blood Pressure (optional)</Text>
        <View style={form.bpRow}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Systolic"
              placeholder="120"
              value={vitals.bpSystolic?.toString() ?? ''}
              onChangeText={(t) => set({ bpSystolic: t === '' ? null : parseInt(t) || null })}
              keyboardType="number-pad"
            />
          </View>
          <Text style={form.bpSlash}>/</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Diastolic"
              placeholder="80"
              value={vitals.bpDiastolic?.toString() ?? ''}
              onChangeText={(t) => set({ bpDiastolic: t === '' ? null : parseInt(t) || null })}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      {/* SpO2 */}
      <View style={form.section}>
        <View style={form.numericField}>
          <TextInput
            label="SpO2 (%)"
            placeholder="98"
            value={vitals.spo2?.toString() ?? ''}
            onChangeText={(t) => set({ spo2: t === '' ? null : parseInt(t) || null })}
            keyboardType="number-pad"
          />
          {vitals.spo2 !== null && (
            <Text style={[form.rangeNote, { color: rangeColor('spo2', vitals.spo2) }]}>
              Normal: ≥{VITAL_NORMALS.spo2.min}%
            </Text>
          )}
        </View>
      </View>

      {/* Cap Refill */}
      <View style={form.section}>
        <Text style={form.label}>Capillary Refill</Text>
        <RadioGroup
          options={VITAL_OPTIONS.capRefill.map(v => ({ value: v, label: v }))}
          value={vitals.capRefill}
          onChange={(v) => set({ capRefill: v })}
          direction="horizontal"
        />
      </View>

      {/* Temperature */}
      <View style={form.section}>
        <View style={form.numericField}>
          <TextInput
            label="Temperature (°F, optional)"
            placeholder="98.6"
            value={vitals.temperatureF?.toString() ?? ''}
            onChangeText={(t) => set({ temperatureF: t === '' ? null : parseFloat(t) || null })}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Notes */}
      <View style={form.section}>
        <TextInput
          label="Notes"
          placeholder="Any additional observations..."
          value={vitals.notes}
          onChangeText={(t) => set({ notes: t })}
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );
}

const form = StyleSheet.create({
  container: { gap: 0 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.sm },
  label: { ...Typography.h3, color: Colors.textPrimary },
  sublabel: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase' },
  row: { flexDirection: 'row', gap: Spacing.md },
  numericField: { gap: Spacing.xs },
  rangeNote: { ...Typography.caption },
  bpRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bpSlash: { ...Typography.h2, color: Colors.textSecondary, paddingTop: Spacing.lg },
});

export default function VitalsScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<VitalsEntry>(createEmptyVitals);

  const vitalsLog = currentPatient?.vitals ?? [];

  const handleSaveVitals = () => {
    dispatch({ type: 'ADD_VITALS', payload: { ...draft, recordedAt: new Date().toISOString() } });
    setDraft(createEmptyVitals());
    setDrafting(false);
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 10 });
    router.push('/assessment/soap-summary');
  };

  const handleBack = () => {
    const prevStep = state.isAmsDetected ? 8 : 7;
    dispatch({ type: 'SET_STEP', payload: prevStep });
    router.back();
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={9}
          title="Vitals"
          reminder="Record a baseline set now. Repeat every 5 min (critical) or 15 min (stable)."
        />

        {/* Recorded vitals */}
        {vitalsLog.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recorded Sets ({vitalsLog.length})</Text>
            {vitalsLog.map((v, i) => (
              <Card key={v.id} variant="outlined" style={styles.vitalCard}>
                <View style={styles.vitalHeader}>
                  <Text style={styles.vitalSet}>Set {i + 1}</Text>
                  <Text style={styles.vitalTime}>{formatTime(v.recordedAt)}</Text>
                </View>
                <View style={styles.vitalGrid}>
                  {v.pulseRate !== null && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>HR</Text>
                      <Text style={[styles.vitalCellValue, { color: rangeColor('pulseRate', v.pulseRate) }]}>
                        {v.pulseRate}
                      </Text>
                    </View>
                  )}
                  {v.respRate !== null && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>RR</Text>
                      <Text style={[styles.vitalCellValue, { color: rangeColor('respRate', v.respRate) }]}>
                        {v.respRate}
                      </Text>
                    </View>
                  )}
                  {v.spo2 !== null && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>SpO2</Text>
                      <Text style={[styles.vitalCellValue, { color: rangeColor('spo2', v.spo2) }]}>
                        {v.spo2}%
                      </Text>
                    </View>
                  )}
                  {v.bpSystolic !== null && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>BP</Text>
                      <Text style={styles.vitalCellValue}>
                        {v.bpSystolic}/{v.bpDiastolic}
                      </Text>
                    </View>
                  )}
                  {v.skinColor !== '' && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>Skin</Text>
                      <Text style={styles.vitalCellValue}>{v.skinColor}</Text>
                    </View>
                  )}
                  {v.pupils !== '' && (
                    <View style={styles.vitalCell}>
                      <Text style={styles.vitalCellLabel}>Pupils</Text>
                      <Text style={styles.vitalCellValue}>{v.pupils}</Text>
                    </View>
                  )}
                </View>
                {v.notes !== '' && (
                  <Text style={styles.vitalNotes}>{v.notes}</Text>
                )}
              </Card>
            ))}
          </View>
        )}

        {/* Draft form */}
        {drafting ? (
          <View style={styles.draftSection}>
            <Text style={styles.sectionTitle}>New Vitals Set</Text>
            <VitalsForm vitals={draft} onChange={setDraft} />
            <View style={styles.draftActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setDrafting(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSaveVitals}>
                <Text style={styles.saveBtnText}>Save Vitals</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Pressable style={styles.addBtn} onPress={() => setDrafting(true)}>
              <Text style={styles.addBtnText}>+ Record Vitals</Text>
            </Pressable>
            {vitalsLog.length === 0 && (
              <Text style={styles.emptyHint}>At least one set of vitals recommended before proceeding.</Text>
            )}
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

  vitalCard: { padding: Spacing.md },
  vitalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  vitalSet: { ...Typography.label, color: Colors.primary, textTransform: 'uppercase' },
  vitalTime: { ...Typography.caption, color: Colors.textHint },
  vitalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  vitalCell: { alignItems: 'center', minWidth: 56 },
  vitalCellLabel: { ...Typography.caption, color: Colors.textHint },
  vitalCellValue: { ...Typography.h3, color: Colors.textPrimary },
  vitalNotes: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },

  draftSection: { paddingTop: Spacing.lg },
  draftActions: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
  },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  cancelBtnText: { ...Typography.button, color: Colors.textSecondary },
  saveBtn: {
    flex: 2, paddingVertical: Spacing.md, borderRadius: Radius.lg,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  saveBtnText: { ...Typography.button, color: Colors.textOnPrimary },

  addBtn: {
    paddingVertical: Spacing.base, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed',
    alignItems: 'center',
  },
  addBtnText: { ...Typography.button, color: Colors.primary },
  emptyHint: { ...Typography.caption, color: Colors.textHint, textAlign: 'center' },
});
