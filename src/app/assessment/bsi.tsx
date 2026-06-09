/**
 * QuickSOAP — Step 2: BSI / PPE
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { BSI_ITEMS } from '@/constants/clinicalData';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function BSIScreen() {
  const router = useRouter();
  const { state, dispatch } = useAssessment();
  const bsiItems = state.incident?.bsiItems ?? {};
  const glovesOn = bsiItems['gloves'] ?? false;

  const toggle = (key: string) => {
    const updated = { ...bsiItems, [key]: !bsiItems[key] };
    dispatch({ type: 'UPDATE_BSI', payload: { completed: updated['gloves'] ?? false, items: updated } });
  };

  const goNext = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
    if ((state.incident?.scene.numPatients ?? 1) > 1) {
      router.push('/assessment/triage');
    } else {
      router.push('/assessment/avpu');
    }
  };

  // Auto-advance when gloves are checked
  useEffect(() => {
    if (glovesOn) {
      const t = setTimeout(goNext, 400);
      return () => clearTimeout(t);
    }
  }, [glovesOn]);

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepHeader
        stepNumber={2}
        title="BSI / PPE"
        reminder="Don PPE before patient contact."
      />

      <View style={styles.content}>
        {BSI_ITEMS.map((item) => {
          const checked = bsiItems[item.key] ?? false;
          return (
            <Pressable
              key={item.key}
              style={[styles.item, checked && styles.itemChecked]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggle(item.key); }}
            >
              <View style={[styles.check, checked && styles.checkChecked]}>
                {checked && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={styles.itemText}>
                <Text style={[styles.itemLabel, checked && styles.itemLabelChecked]}>{item.label}</Text>
                {item.required && <Text style={styles.requiredTag}>Required</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      <WizardNav onBack={handleBack} onNext={goNext} nextLabel={glovesOn ? 'Next' : 'Skip'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.borderLight,
  },
  itemChecked: { borderColor: Colors.clinicalGreen, backgroundColor: Colors.clinicalGreenBg },

  check: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkChecked: { backgroundColor: Colors.clinicalGreen, borderColor: Colors.clinicalGreen },
  checkMark: { color: Colors.textOnPrimary, fontSize: 16, fontWeight: '700' },

  itemText: { flex: 1 },
  itemLabel: { ...Typography.h3, color: Colors.textPrimary },
  itemLabelChecked: { color: Colors.clinicalGreen },
  requiredTag: { ...Typography.caption, color: Colors.primary, marginTop: 2 },
});
