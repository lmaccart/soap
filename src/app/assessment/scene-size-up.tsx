/**
 * QuickSOAP — Step 1: Scene Size-Up
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { RadioGroup, TextInput, NumericStepper } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

export default function SceneSizeUpScreen() {
  const router = useRouter();
  const { state, dispatch } = useAssessment();
  const scene = state.incident?.scene;

  const updateScene = (updates: Record<string, any>) => {
    dispatch({ type: 'UPDATE_SCENE', payload: updates });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    if ((state.incident?.scene.numPatients ?? 1) > 1) {
      router.push('/assessment/triage');
    } else {
      router.push('/assessment/avpu');
    }
  };

  return (
    <View style={styles.container}>
      <StepHeader stepNumber={1} title="Scene Size-Up" />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>MOI / NOI</Text>
          <RadioGroup
            options={[
              { value: 'trauma', label: '🩹 Trauma', description: 'Physical force' },
              { value: 'medical', label: '💊 Medical', description: 'Illness or condition' },
            ]}
            value={scene?.moiType ?? ''}
            onChange={(value) => updateScene({ moiType: value })}
            size="lg"
            direction="horizontal"
          />
          {scene?.moiType === 'trauma' && (
            <>
              <Text style={styles.label}>Mechanism</Text>
              <RadioGroup
                options={[
                  { value: 'fall', label: 'Fall' },
                  { value: 'mvc', label: 'MVC / Crash' },
                  { value: 'struck', label: 'Struck by object' },
                  { value: 'crush', label: 'Crush injury' },
                  { value: 'blast', label: 'Blast / Explosion' },
                  { value: 'other_trauma', label: 'Other Trauma' },
                ]}
                value={scene?.moiNoi ?? ''}
                onChange={(value) => updateScene({ moiNoi: value })}
                direction="horizontal"
              />
            </>
          )}
          {scene?.moiType === 'medical' && (
            <>
              <Text style={styles.label}>Nature of Illness</Text>
              <RadioGroup
                options={[
                  { value: 'cardiac', label: 'Cardiac / Chest pain' },
                  { value: 'respiratory', label: 'Respiratory distress' },
                  { value: 'diabetic', label: 'Diabetic emergency' },
                  { value: 'allergic', label: 'Allergic reaction' },
                  { value: 'neuro', label: 'Neurological' },
                  { value: 'other_medical', label: 'Other Medical' },
                ]}
                value={scene?.moiNoi ?? ''}
                onChange={(value) => updateScene({ moiNoi: value })}
                direction="horizontal"
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Patients</Text>
          <NumericStepper
            value={scene?.numPatients ?? 1}
            onChange={(val) => updateScene({ numPatients: val })}
            min={1}
            max={50}
          />
          {(scene?.numPatients ?? 1) > 1 && (
            <View style={styles.mciWarning}>
              <Text style={styles.mciWarningText}>⚠️ MCI — triage will be activated</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TextInput
            label="Location"
            placeholder="Trail, GPS, landmarks..."
            value={scene?.location ?? ''}
            onChangeText={(text) => updateScene({ location: text })}
          />
        </View>
      </View>

      <WizardNav onNext={handleNext} canGoBack={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, gap: Spacing.xs },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md },
  label: { ...Typography.h3, color: Colors.textPrimary },
  mciWarning: { backgroundColor: Colors.clinicalYellowBg, padding: Spacing.md, borderRadius: Radius.md },
  mciWarningText: { ...Typography.bodySmall, color: Colors.clinicalYellow },
});
