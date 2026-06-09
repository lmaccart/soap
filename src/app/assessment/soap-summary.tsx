/**
 * QuickSOAP — Step 10: SOAP Summary
 * Compiles the full assessment into a SOAP note with share/export.
 */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import { Card, Divider, Badge } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';
import { TRIAGE_CATEGORIES } from '@/constants/clinicalData';

// ── Compiler ───────────────────────────────────────────────

function buildSOAPText(state: ReturnType<typeof useAssessment>['state']): string {
  const { incident, patients, currentPatientId } = state;
  const patient = currentPatientId ? patients[currentPatientId] : null;
  if (!patient || !incident) return '';

  const lines: string[] = [];
  const ts = (iso: string) => new Date(iso).toLocaleString();

  lines.push('=== QUICKSOAP — WFR PATIENT ASSESSMENT ===');
  lines.push(`Incident: ${incident.id}  |  Started: ${ts(incident.createdAt)}`);
  lines.push(`Location: ${incident.scene.location || 'Not recorded'}`);
  lines.push('');

  // ── Subjective ────────────────────────────────────────────
  lines.push('── SUBJECTIVE ──────────────────────────────');
  lines.push(`Chief Complaint: ${patient.chiefComplaint || 'Not recorded'}`);
  lines.push(`Patient: ${patient.name || 'Unknown'}, ${patient.age || '?'} y/o ${patient.sex || ''}`);
  lines.push('');
  lines.push('SAMPLE History:');
  lines.push(`  S: ${patient.sample.signsSymptoms || 'None'}`);
  lines.push(`  A: ${patient.sample.allergies || 'NKDA'}`);
  lines.push(`  M: ${patient.sample.medications || 'None'}`);
  lines.push(`  P: ${patient.sample.pastMedical || 'None'}`);
  lines.push(`  L: ${patient.sample.lastIntake || 'Unknown'}`);
  lines.push(`  O: ${patient.sample.lastOutput || 'Unknown'}`);
  lines.push(`  E: ${patient.sample.events || 'See MOI/NOI'}`);
  if (patient.opqrst.onset) {
    lines.push('');
    lines.push('OPQRST:');
    lines.push(`  Onset: ${patient.opqrst.onset}`);
    if (patient.opqrst.provocation) lines.push(`  Provocation: ${patient.opqrst.provocation}`);
    if (patient.opqrst.palliation) lines.push(`  Palliation: ${patient.opqrst.palliation}`);
    if (patient.opqrst.quality) lines.push(`  Quality: ${patient.opqrst.quality}`);
    if (patient.opqrst.region) lines.push(`  Region: ${patient.opqrst.region}`);
    if (patient.opqrst.radiation) lines.push(`  Radiation: ${patient.opqrst.radiation}`);
    lines.push(`  Severity: ${patient.opqrst.severity}/10`);
    if (patient.opqrst.timeDuration) lines.push(`  Time: ${patient.opqrst.timeDuration}`);
  }
  lines.push('');

  // ── Objective ─────────────────────────────────────────────
  lines.push('── OBJECTIVE ───────────────────────────────');
  lines.push(`Scene: ${incident.scene.moiType?.toUpperCase() || '?'} — ${incident.scene.moiNoi || 'Not described'}`);
  lines.push(`AVPU: ${patient.avpu || 'Not assessed'}`);
  if (patient.avpu === 'A') {
    const o = patient.orientation;
    const ox = [o.person && 'Person', o.place && 'Place', o.time && 'Time', o.event && 'Event'].filter(Boolean);
    lines.push(`Orientation: A+Ox${ox.length} (${ox.join(', ') || 'disoriented'})`);
  }
  lines.push('');
  lines.push('ABCDE:');
  lines.push(`  A: ${patient.abcde.airwayStatus || 'Not assessed'}${patient.abcde.airwayNotes ? ' — ' + patient.abcde.airwayNotes : ''}`);
  lines.push(`  B: ${patient.abcde.breathingPresent ? 'Present' : 'Absent'}${patient.abcde.breathingAdequate !== null ? ', ' + (patient.abcde.breathingAdequate ? 'adequate' : 'inadequate') : ''}${patient.abcde.breathingNotes ? ' — ' + patient.abcde.breathingNotes : ''}`);
  lines.push(`  C: Pulse ${patient.abcde.circulationPulse ? 'present' : 'absent'}${patient.abcde.bleedingLocation ? ', bleeding at ' + patient.abcde.bleedingLocation : ''}`);
  lines.push(`  D: ${patient.abcde.disabilityNotes || 'No deficits noted'}${patient.abcde.spineSuspected ? ' | ⚠️ Spine precautions' : ''}`);
  lines.push(`  E: ${patient.abcde.exposeNotes || 'Exposed, no additional findings'}`);

  if (patient.injuries.length > 0) {
    lines.push('');
    lines.push(`Physical Findings (${patient.injuries.length} injuries):`);
    for (const inj of patient.injuries) {
      lines.push(`  - ${inj.bodyRegion}: ${inj.type} [${inj.severity}]${inj.description ? ' — ' + inj.description : ''}`);
    }
  }

  if (patient.vitals.length > 0) {
    lines.push('');
    lines.push(`Vitals (${patient.vitals.length} set${patient.vitals.length > 1 ? 's' : ''}):`);
    for (const [i, v] of patient.vitals.entries()) {
      const t = new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const parts = [`T+${i === 0 ? '0' : '?'} (${t})`];
      if (v.pulseRate) parts.push(`HR ${v.pulseRate} ${v.pulseQuality} ${v.pulseRegularity}`.trim());
      if (v.respRate) parts.push(`RR ${v.respRate} ${v.respQuality}`.trim());
      if (v.spo2) parts.push(`SpO2 ${v.spo2}%`);
      if (v.bpSystolic) parts.push(`BP ${v.bpSystolic}/${v.bpDiastolic}`);
      if (v.skinColor) parts.push(`Skin: ${v.skinColor}/${v.skinTemp}/${v.skinMoisture}`.replace(/\//g, s => s));
      if (v.pupils) parts.push(`Pupils: ${v.pupils}`);
      lines.push('  ' + parts.join(' | '));
    }
  }

  if (state.isAmsDetected && patient.stopEats.suspectedCause) {
    lines.push('');
    lines.push(`STOP EATS — Suspected: ${patient.stopEats.suspectedCause}`);
  }
  lines.push('');

  // ── Assessment ────────────────────────────────────────────
  lines.push('── ASSESSMENT ──────────────────────────────');
  const triage = TRIAGE_CATEGORIES.find(t => t.value === patient.triageCategory);
  if (triage) lines.push(`Triage: ${triage.emoji} ${triage.label} — ${triage.description}`);
  lines.push(patient.soap.assessment || '[Assessment to be completed]');
  lines.push('');

  // ── Plan ──────────────────────────────────────────────────
  lines.push('── PLAN ────────────────────────────────────');
  lines.push(patient.soap.plan || '[Plan to be completed]');
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('===========================================');

  return lines.join('\n');
}

// ── Screen ────────────────────────────────────────────────

export default function SOAPSummaryScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [copied, setCopied] = useState(false);

  const soapText = useMemo(() => buildSOAPText(state), [state]);

  const updateSOAP = (fields: Partial<NonNullable<typeof currentPatient>['soap']>) => {
    dispatch({ type: 'UPDATE_SOAP', payload: fields });
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(soapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Sharing unavailable', 'Use Copy to clipboard instead.');
      return;
    }
    // Write to a temp file via expo-print then share
    try {
      const { uri } = await Print.printToFileAsync({ html: `<pre>${soapText}</pre>` });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share SOAP Note' });
    } catch {
      Alert.alert('Error', 'Could not generate PDF.');
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_INCIDENT' });
    router.dismissAll();
    router.replace('/(tabs)/history');
  };

  const triage = TRIAGE_CATEGORIES.find(t => t.value === currentPatient?.triageCategory);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={9}
          title="SOAP Summary"
          reminder="Review, complete your assessment and plan, then export or hand off."
        />

        {/* Patient header */}
        {currentPatient && (
          <Card variant="elevated" style={styles.patientCard}>
            <View style={styles.patientRow}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                  {currentPatient.name || 'Unknown Patient'}
                </Text>
                <Text style={styles.patientMeta}>
                  {[currentPatient.age && `${currentPatient.age} y/o`, currentPatient.sex].filter(Boolean).join(' ')}
                </Text>
              </View>
              {triage && (
                <View style={[styles.triagePill, { backgroundColor: triage.bgColor }]}>
                  <Text style={styles.triageEmoji}>{triage.emoji}</Text>
                  <Text style={[styles.triageLabel, { color: triage.color }]}>{triage.label}</Text>
                </View>
              )}
            </View>
            {currentPatient.chiefComplaint !== '' && (
              <Text style={styles.chiefComplaint}>
                CC: {currentPatient.chiefComplaint}
              </Text>
            )}
          </Card>
        )}

        {/* Assessment field */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A — Assessment</Text>
          <Text style={styles.sectionHint}>Your clinical impression and working diagnosis</Text>
          <AssessmentField
            value={currentPatient?.soap.assessment ?? ''}
            onChange={(t) => updateSOAP({ assessment: t })}
          />
        </View>

        {/* Plan field */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>P — Plan</Text>
          <Text style={styles.sectionHint}>Interventions, monitoring, evacuation decision</Text>
          <AssessmentField
            value={currentPatient?.soap.plan ?? ''}
            onChange={(t) => updateSOAP({ plan: t })}
            placeholder="Treatments applied, monitoring frequency, evacuation plan..."
          />
        </View>

        <Divider spacing={Spacing.xl} />

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note Preview</Text>
          <Card variant="outlined" style={styles.previewCard}>
            <Text style={styles.previewText} selectable>{soapText}</Text>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={handleCopy}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>{copied ? 'Copied!' : 'Copy'}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handleShare}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Share PDF</Text>
          </Pressable>
        </View>

        <Pressable style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Complete & Save</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function AssessmentField({
  value,
  onChange,
  placeholder = 'Enter clinical assessment...',
}: {
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
}) {
  return (
    <RNTextInput
      style={fieldStyles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={Colors.textHint}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  );
}

const fieldStyles = StyleSheet.create({
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 100,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxxl * 2 },

  patientCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg, padding: Spacing.base },
  patientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  patientInfo: { flex: 1 },
  patientName: { ...Typography.h2, color: Colors.textPrimary },
  patientMeta: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  triagePill: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  triageEmoji: { fontSize: 16 },
  triageLabel: { ...Typography.label, fontWeight: '700' },
  chiefComplaint: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.sm },

  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.sm },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  sectionHint: { ...Typography.caption, color: Colors.textHint },

  previewCard: { padding: Spacing.md },
  previewText: {
    ...Typography.mono,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  actions: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
  },
  actionBtn: {
    flex: 1, paddingVertical: Spacing.base, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { ...Typography.label, color: Colors.textSecondary },

  completeBtn: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    paddingVertical: Spacing.base + 2, borderRadius: Radius.lg,
    backgroundColor: Colors.primary, alignItems: 'center',
    ...Shadows.card,
  },
  completeBtnText: { ...Typography.button, color: Colors.textOnPrimary },
});
