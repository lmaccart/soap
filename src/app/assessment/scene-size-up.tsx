/**
 * QuickSOAP — Step 1: Scene Size-Up
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
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

  // Breathing animation for "take a deep breath"
  const [showBreathing, setShowBreathing] = useState(true);
  const breathAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showBreathing) {
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => setShowBreathing(false), 500);
      });
    }
  }, []);

  const updateScene = (updates: Record<string, any>) => {
    dispatch({ type: 'UPDATE_SCENE', payload: updates });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    router.push('/assessment/bsi');
  };

  if (showBreathing) {
    return (
      <View style={styles.breathingContainer}>
        <Animated.View style={[styles.breathingCircle, {
          transform: [{ scale: breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.3] }) }],
          opacity: breathAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }),
        }]}>
          <Text style={styles.breathingEmoji}>🫁</Text>
        </Animated.View>
        <Text style={styles.breathingText}>Take a deep breath</Text>
        <Text style={styles.breathingSubtext}>Pause. Observe. Think before you act.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StepHeader
          stepNumber={1}
          title="Scene Size-Up"
          reminder="Look up, down, and all around. Ensure the scene is safe before approaching."
        />

        {/* MOI / NOI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mechanism of Injury / Nature of Illness</Text>
          <RadioGroup
            options={[
              { value: 'trauma', label: '🩹 Trauma', description: 'Physical force caused injury' },
              { value: 'medical', label: '💊 Medical', description: 'Illness or medical condition' },
            ]}
            value={scene?.moiType ?? ''}
            onChange={(value) => updateScene({ moiType: value })}
            size="lg"
          />
          <TextInput
            label="Details"
            placeholder="What happened? Describe the mechanism..."
            value={scene?.moiNoi ?? ''}
            onChangeText={(text) => updateScene({ moiNoi: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Number of Patients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Patients</Text>
          <NumericStepper
            value={scene?.numPatients ?? 1}
            onChange={(val) => updateScene({ numPatients: val })}
            min={1}
            max={50}
          />
          {(scene?.numPatients ?? 1) > 1 && (
            <View style={styles.mciWarning}>
              <Text style={styles.mciWarningText}>⚠️ Multiple patients — MCI triage will be activated</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <TextInput
            label="Scene Location"
            placeholder="Trail name, GPS, landmarks..."
            value={scene?.location ?? ''}
            onChangeText={(text) => updateScene({ location: text })}
          />
        </View>
      </ScrollView>

      <WizardNav onNext={handleNext} canGoBack={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },

  // Breathing animation
  breathingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  breathingCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl,
  },
  breathingEmoji: { fontSize: 56 },
  breathingText: { ...Typography.h1, color: Colors.primary },
  breathingSubtext: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.sm },

  // Sections
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },

  // MCI Warning
  mciWarning: {
    backgroundColor: Colors.clinicalYellowBg, padding: Spacing.md,
    borderRadius: Radius.md, marginTop: Spacing.md,
  },
  mciWarningText: { ...Typography.bodySmall, color: Colors.clinicalYellow },
});
