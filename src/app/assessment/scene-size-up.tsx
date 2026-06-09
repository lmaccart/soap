/**
 * QuickSOAP — Step 1: Scene Size-Up
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '@/store/assessmentContext';
import StepHeader from '@/components/StepHeader';
import WizardNav from '@/components/WizardNav';
import { TextInput, NumericStepper } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

const MOI_OPTIONS = [
  { value: 'fall',         emoji: '🧗', label: 'Fall' },
  { value: 'mvc',          emoji: '🚗', label: 'MVC / Crash' },
  { value: 'struck',       emoji: '💢', label: 'Struck' },
  { value: 'crush',        emoji: '🪨', label: 'Crush' },
  { value: 'blast',        emoji: '💥', label: 'Blast' },
  { value: 'other_trauma', emoji: '⚠️', label: 'Other' },
];

const NOI_OPTIONS = [
  { value: 'cardiac',       emoji: '❤️',  label: 'Cardiac' },
  { value: 'respiratory',   emoji: '🫁',  label: 'Respiratory' },
  { value: 'diabetic',      emoji: '🍬',  label: 'Diabetic' },
  { value: 'allergic',      emoji: '🐝',  label: 'Allergic' },
  { value: 'neuro',         emoji: '🧠',  label: 'Neurological' },
  { value: 'other_medical', emoji: '❓',  label: 'Other' },
];

function TileGrid({ options, value, onChange }: {
  options: { value: string; emoji: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={grid.row}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[grid.tile, selected && grid.tileSelected]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(opt.value); }}
          >
            <Text style={grid.emoji}>{opt.emoji}</Text>
            <Text style={[grid.label, selected && grid.labelSelected]} numberOfLines={2}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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

        {/* Trauma / Medical */}
        <View style={styles.section}>
          <Text style={styles.label}>MOI / NOI</Text>
          <View style={typeRow.row}>
            {([
              { value: 'trauma',  emoji: '🩹', label: 'Trauma',  sub: 'Physical force' },
              { value: 'medical', emoji: '💊', label: 'Medical', sub: 'Illness / condition' },
            ] as const).map((opt) => {
              const sel = scene?.moiType === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[typeRow.card, sel && typeRow.cardSelected]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); updateScene({ moiType: opt.value, moiNoi: '' }); }}
                >
                  <Text style={typeRow.emoji}>{opt.emoji}</Text>
                  <Text style={[typeRow.cardLabel, sel && typeRow.cardLabelSelected]}>{opt.label}</Text>
                  <Text style={typeRow.cardSub}>{opt.sub}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* MOI tiles */}
        {scene?.moiType === 'trauma' && (
          <View style={styles.section}>
            <Text style={styles.label}>Mechanism</Text>
            <TileGrid options={MOI_OPTIONS} value={scene?.moiNoi ?? ''} onChange={(v) => updateScene({ moiNoi: v })} />
          </View>
        )}

        {/* NOI tiles */}
        {scene?.moiType === 'medical' && (
          <View style={styles.section}>
            <Text style={styles.label}>Nature of Illness</Text>
            <TileGrid options={NOI_OPTIONS} value={scene?.moiNoi ?? ''} onChange={(v) => updateScene({ moiNoi: v })} />
          </View>
        )}

        {/* Patients */}
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

        {/* Location */}
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

const typeRow = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  card: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.lg,
    borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.borderLight,
    backgroundColor: Colors.surface, gap: Spacing.xs,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  emoji: { fontSize: 32 },
  cardLabel: { ...Typography.h3, color: Colors.textPrimary },
  cardLabelSelected: { color: Colors.primary },
  cardSub: { ...Typography.caption, color: Colors.textHint, textAlign: 'center' },
});

const grid = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tile: {
    width: '30%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.borderLight,
    backgroundColor: Colors.surface, gap: 4, padding: Spacing.xs,
  },
  tileSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  emoji: { fontSize: 28 },
  label: { ...Typography.caption, color: Colors.textPrimary, textAlign: 'center' },
  labelSelected: { color: Colors.primary, fontWeight: '700' },
});
