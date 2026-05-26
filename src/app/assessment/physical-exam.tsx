/**
 * QuickSOAP — Step 5: Physical Exam (placeholder with body region list)
 * Full SVG body diagram will be enhanced later.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment, generateId } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { RadioGroup, Checkbox, TextInput, Card, Badge } from '@/components/ui';
import { Modal } from '@/components/ui';
import { BODY_REGIONS, DCAP_BTLS, EXAM_TYPES } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function PhysicalExamScreen() {
  const router = useRouter();
  const { state, dispatch, currentPatient } = useAssessment();
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [dcapFindings, setDcapFindings] = useState<Record<string, boolean>>({});
  const [injuryDesc, setInjuryDesc] = useState('');
  const [injurySeverity, setInjurySeverity] = useState('');

  const regions = BODY_REGIONS.filter(r => r.view === activeView);
  const selectedRegionData = BODY_REGIONS.find(r => r.id === selectedRegion);
  const injuries = currentPatient?.injuries ?? [];

  const getRegionInjuries = (regionId: string) =>
    injuries.filter(i => i.bodyRegion === regionId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return Colors.injurySevere;
      case 'moderate': return Colors.injuryModerate;
      case 'minor': return Colors.injuryMinor;
      default: return Colors.bodyDefault;
    }
  };

  const handleRegionPress = (regionId: string) => {
    setSelectedRegion(regionId);
    setDcapFindings({});
    setInjuryDesc('');
    setInjurySeverity('');
  };

  const handleAddInjury = () => {
    if (!selectedRegion || !injurySeverity) return;
    const findings = Object.entries(dcapFindings).filter(([, v]) => v).map(([k]) => k).join(', ');
    dispatch({
      type: 'ADD_INJURY',
      payload: {
        id: generateId(),
        bodyRegion: selectedRegion,
        bodyX: 0.5,
        bodyY: 0.5,
        type: findings,
        description: injuryDesc,
        severity: injurySeverity as 'minor' | 'moderate' | 'severe',
      },
    });
    setSelectedRegion(null);
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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={5}
          title="Physical Exam"
          reminder="Look, listen, feel, smell at each area. Compare left to right."
        />

        {/* Exam Type */}
        <View style={styles.section}>
          <RadioGroup
            options={EXAM_TYPES.map(e => ({ value: e.value, label: e.label, description: e.description }))}
            value={currentPatient?.physicalExam.examType ?? ''}
            onChange={(v) => dispatch({ type: 'UPDATE_PHYSICAL_EXAM', payload: { examType: v } })}
          />
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <Pressable onPress={() => setActiveView('front')} style={[styles.viewBtn, activeView === 'front' && styles.viewBtnActive]}>
            <Text style={[styles.viewBtnText, activeView === 'front' && styles.viewBtnTextActive]}>Front</Text>
          </Pressable>
          <Pressable onPress={() => setActiveView('back')} style={[styles.viewBtn, activeView === 'back' && styles.viewBtnActive]}>
            <Text style={[styles.viewBtnText, activeView === 'back' && styles.viewBtnTextActive]}>Back</Text>
          </Pressable>
        </View>

        {/* Body Region List */}
        <View style={styles.section}>
          {regions.map((region) => {
            const regionInjuries = getRegionInjuries(region.id);
            const hasInjury = regionInjuries.length > 0;
            const worstSeverity = regionInjuries.reduce((worst, i) => {
              if (i.severity === 'severe') return 'severe';
              if (i.severity === 'moderate' && worst !== 'severe') return 'moderate';
              return worst || i.severity;
            }, '' as string);

            return (
              <Card
                key={region.id}
                variant="outlined"
                onPress={() => handleRegionPress(region.id)}
                style={[styles.regionCard, hasInjury && { borderColor: getSeverityColor(worstSeverity), borderWidth: 2 }]}
              >
                <View style={styles.regionRow}>
                  <View style={[styles.regionDot, { backgroundColor: hasInjury ? getSeverityColor(worstSeverity) : Colors.bodyDefault }]} />
                  <View style={styles.regionInfo}>
                    <Text style={styles.regionLabel}>{region.label}</Text>
                    <Text style={styles.regionNote}>{region.clinicalNote}</Text>
                  </View>
                  {hasInjury && (
                    <Badge text={`${regionInjuries.length}`} variant="error" size="sm" />
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Injury Detail Modal */}
      <Modal
        visible={selectedRegion !== null}
        onClose={() => setSelectedRegion(null)}
        title={selectedRegionData?.label ?? 'Body Region'}
      >
        {selectedRegionData && (
          <View>
            <Text style={styles.modalReminder}>📋 {selectedRegionData.clinicalNote}</Text>

            <Text style={styles.fieldLabel}>DCAP-BTLS Findings</Text>
            {DCAP_BTLS.map((item) => (
              <Checkbox
                key={item.key}
                label={`${item.abbrev} — ${item.label}`}
                checked={dcapFindings[item.key] ?? false}
                onChange={(checked) => setDcapFindings(prev => ({ ...prev, [item.key]: checked }))}
              />
            ))}

            <TextInput label="Description" value={injuryDesc} onChangeText={setInjuryDesc} multiline placeholder="Describe the finding..." />

            <Text style={styles.fieldLabel}>Severity</Text>
            <RadioGroup
              options={[
                { value: 'minor', label: 'Minor', color: Colors.clinicalYellow },
                { value: 'moderate', label: 'Moderate', color: Colors.warning },
                { value: 'severe', label: 'Severe', color: Colors.clinicalRed },
              ]}
              value={injurySeverity}
              onChange={setInjurySeverity}
              direction="horizontal"
            />

            <Pressable onPress={handleAddInjury} style={styles.addBtn}>
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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },

  viewToggle: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginTop: Spacing.md, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  viewBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', backgroundColor: Colors.surface },
  viewBtnActive: { backgroundColor: Colors.primary },
  viewBtnText: { ...Typography.button, color: Colors.textSecondary },
  viewBtnTextActive: { color: Colors.textOnPrimary },

  regionCard: { padding: Spacing.md },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  regionDot: { width: 12, height: 12, borderRadius: 6 },
  regionInfo: { flex: 1 },
  regionLabel: { ...Typography.h3, color: Colors.textPrimary },
  regionNote: { ...Typography.caption, color: Colors.textHint, marginTop: 2 },

  modalReminder: { ...Typography.bodySmall, color: Colors.clinicalBlue, backgroundColor: Colors.clinicalBlueBg, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.md },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  addBtn: { backgroundColor: Colors.primary, padding: Spacing.base, borderRadius: Radius.lg, alignItems: 'center', marginTop: Spacing.lg },
  addBtnText: { ...Typography.button, color: Colors.textOnPrimary },
});
