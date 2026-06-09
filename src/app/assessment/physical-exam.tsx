/**
 * QuickSOAP — Step 5: Physical Exam
 * Body region grid. Tap a region to log findings via modal.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment, generateId } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { RadioGroup, Checkbox, Modal, Badge } from '@/components/ui';
import { BODY_REGIONS, DCAP_BTLS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function PhysicalExamScreen() {
  const router = useRouter();
  const { dispatch, currentPatient } = useAssessment();
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [dcapFindings, setDcapFindings] = useState<Record<string, boolean>>({});
  const [severity, setSeverity] = useState('');

  const regions = BODY_REGIONS.filter(r => r.view === activeView);
  const injuries = currentPatient?.injuries ?? [];
  const selectedRegionData = BODY_REGIONS.find(r => r.id === selectedRegion);

  const getRegionInjuries = (id: string) => injuries.filter(i => i.bodyRegion === id);

  const severityColor = (s: string) =>
    s === 'severe' ? Colors.clinicalRed : s === 'moderate' ? Colors.clinicalYellow : s === 'minor' ? Colors.clinicalGreen : Colors.bodyDefault;

  const handleAddInjury = () => {
    if (!selectedRegion || !severity) return;
    const type = Object.entries(dcapFindings).filter(([, v]) => v).map(([k]) => k).join(', ');
    dispatch({
      type: 'ADD_INJURY',
      payload: { id: generateId(), bodyRegion: selectedRegion, bodyX: 0.5, bodyY: 0.5, type, description: '', severity: severity as 'minor' | 'moderate' | 'severe' },
    });
    setSelectedRegion(null);
    setDcapFindings({});
    setSeverity('');
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
    router.push('/assessment/sample');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={5} title="Physical Exam" reminder="Look, feel, smell. Compare left to right." />

      {/* Front / Back toggle */}
      <View style={styles.toggle}>
        <Pressable style={[styles.toggleBtn, activeView === 'front' && styles.toggleBtnActive]} onPress={() => setActiveView('front')}>
          <Text style={[styles.toggleText, activeView === 'front' && styles.toggleTextActive]}>Front</Text>
        </Pressable>
        <Pressable style={[styles.toggleBtn, activeView === 'back' && styles.toggleBtnActive]} onPress={() => setActiveView('back')}>
          <Text style={[styles.toggleText, activeView === 'back' && styles.toggleTextActive]}>Back</Text>
        </Pressable>
      </View>

      {/* Region grid — this list is inherently long, bounded scroll */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <View style={styles.grid}>
          {regions.map((region) => {
            const ri = getRegionInjuries(region.id);
            const worst = ri.reduce((w, i) => i.severity === 'severe' ? 'severe' : i.severity === 'moderate' && w !== 'severe' ? 'moderate' : w || i.severity, '');
            return (
              <Pressable
                key={region.id}
                style={[styles.regionBtn, ri.length > 0 && { borderColor: severityColor(worst), borderWidth: 2 }]}
                onPress={() => { setSelectedRegion(region.id); setDcapFindings({}); setSeverity(''); }}
              >
                <View style={[styles.regionDot, { backgroundColor: ri.length > 0 ? severityColor(worst) : Colors.bodyDefault }]} />
                <Text style={styles.regionLabel} numberOfLines={2}>{region.label}</Text>
                {ri.length > 0 && <Badge text={`${ri.length}`} variant="error" size="sm" />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selectedRegion !== null} onClose={() => setSelectedRegion(null)} title={selectedRegionData?.label ?? ''}>
        {selectedRegionData && (
          <View style={styles.modal}>
            <Text style={styles.modalNote}>📋 {selectedRegionData.clinicalNote}</Text>
            <Text style={styles.modalSection}>DCAP-BTLS</Text>
            {DCAP_BTLS.map(item => (
              <Checkbox key={item.key} label={`${item.abbrev} — ${item.label}`}
                checked={dcapFindings[item.key] ?? false}
                onChange={(checked) => setDcapFindings(p => ({ ...p, [item.key]: checked }))} />
            ))}
            <Text style={styles.modalSection}>Severity</Text>
            <RadioGroup
              options={[
                { value: 'minor', label: 'Minor', color: Colors.clinicalGreen },
                { value: 'moderate', label: 'Moderate', color: Colors.clinicalYellow },
                { value: 'severe', label: 'Severe', color: Colors.clinicalRed },
              ]}
              value={severity} onChange={setSeverity} direction="horizontal"
            />
            <Pressable style={[styles.addBtn, !severity && styles.addBtnDisabled]} onPress={handleAddInjury} disabled={!severity}>
              <Text style={styles.addBtnText}>+ Add Finding</Text>
            </Pressable>
          </View>
        )}
      </Modal>

      <WizardNav onBack={handleBack} onNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  toggle: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginTop: Spacing.md, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  toggleBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', backgroundColor: Colors.surface },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { ...Typography.button, color: Colors.textSecondary },
  toggleTextActive: { color: Colors.textOnPrimary },

  list: { flex: 1, marginTop: Spacing.md },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  regionBtn: {
    width: '31%', aspectRatio: 1, padding: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
  },
  regionDot: { width: 10, height: 10, borderRadius: 5 },
  regionLabel: { ...Typography.caption, color: Colors.textPrimary, textAlign: 'center' },

  modal: { gap: Spacing.sm },
  modalNote: { ...Typography.bodySmall, color: Colors.clinicalBlue, backgroundColor: Colors.clinicalBlueBg, padding: Spacing.md, borderRadius: Radius.md },
  modalSection: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase', marginTop: Spacing.md },
  addBtn: { backgroundColor: Colors.primary, padding: Spacing.base, borderRadius: Radius.lg, alignItems: 'center', marginTop: Spacing.md },
  addBtnDisabled: { backgroundColor: Colors.disabled },
  addBtnText: { ...Typography.button, color: Colors.textOnPrimary },
});
