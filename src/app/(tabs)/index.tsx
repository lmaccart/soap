/**
 * QuickSOAP — Home screen
 * Start new assessment or resume active incident.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAssessment } from '@/store/assessmentContext';
import { Button, Card } from '@/components/ui';
import IncidentTimer from '@/components/IncidentTimer';
import { useStopwatch } from '@/hooks/useStopwatch';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';
import { WIZARD_STEPS } from '@/constants/clinicalData';

export default function HomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useAssessment();
  const stopwatch = useStopwatch();
  const hasActive = state.incident?.status === 'active';
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!hasActive && !autoStarted.current) {
      autoStarted.current = true;
      dispatch({ type: 'START_INCIDENT' });
      stopwatch.start();
      router.push('/assessment/scene-size-up');
    }
  }, []);

  const handleNewAssessment = () => {
    dispatch({ type: 'START_INCIDENT' });
    stopwatch.start();
    router.push('/assessment/scene-size-up');
  };

  const handleResumeAssessment = () => {
    if (state.incident?.timerStart) {
      stopwatch.restoreFrom(state.incident.timerStart);
    }
    const currentStep = WIZARD_STEPS[state.currentStep - 1];
    if (currentStep) {
      router.push(`/assessment/${currentStep.key}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero / Start Button */}
        {!hasActive ? (
          <View style={styles.hero}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🩺</Text>
              <Text style={styles.logoTitle}>QuickSOAP</Text>
              <Text style={styles.logoSubtitle}>Wilderness First Responder</Text>
            </View>

            <Card variant="elevated" style={styles.startCard}>
              <Text style={styles.startTitle}>Patient Assessment</Text>
              <Text style={styles.startDescription}>
                Start a new SOAP note. You'll be guided through the complete WFR assessment workflow.
              </Text>
              <Button onPress={handleNewAssessment} size="lg" fullWidth>
                Start New Assessment
              </Button>
            </Card>

            <View style={styles.flowPreview}>
              <Text style={styles.flowTitle}>Assessment Flow</Text>
              {WIZARD_STEPS.map((step, index) => (
                <View key={step.key} style={styles.flowStep}>
                  <View style={styles.flowDot}>
                    <Text style={styles.flowDotText}>{step.number}</Text>
                  </View>
                  <Text style={styles.flowLabel}>{step.label}</Text>
                  {step.conditional && <Text style={styles.flowConditional}>if needed</Text>}
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* Active Incident */
          <View style={styles.activeSection}>
            <View style={styles.activeHeader}>
              <Text style={styles.activeTitle}>Active Incident</Text>
              <IncidentTimer formattedTime={stopwatch.formattedTime} isRunning={stopwatch.isRunning} />
            </View>

            <Card variant="elevated" style={styles.activeCard}>
              <View style={styles.activeInfo}>
                <Text style={styles.activeStep}>
                  Step {state.currentStep}: {WIZARD_STEPS[state.currentStep - 1]?.label ?? 'Unknown'}
                </Text>
                <Text style={styles.activePatients}>
                  {Object.keys(state.patients).length} patient{Object.keys(state.patients).length !== 1 ? 's' : ''}
                </Text>
              </View>
              <Button onPress={handleResumeAssessment} size="lg" fullWidth>
                Resume Assessment
              </Button>
            </Card>

            <Button onPress={handleNewAssessment} variant="outline" fullWidth style={{ marginTop: Spacing.md }}>
              Start New (Discard Current)
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  // Hero
  hero: { gap: Spacing.xl },
  logoContainer: { alignItems: 'center', paddingTop: Spacing.xxl, paddingBottom: Spacing.md },
  logoEmoji: { fontSize: 56, marginBottom: Spacing.md },
  logoTitle: { ...Typography.displayLarge, color: Colors.primary },
  logoSubtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs },

  // Start Card
  startCard: { padding: Spacing.xl },
  startTitle: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.sm },
  startDescription: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },

  // Flow Preview
  flowPreview: { paddingTop: Spacing.md },
  flowTitle: { ...Typography.h3, color: Colors.textSecondary, marginBottom: Spacing.md },
  flowStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  flowDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  flowDotText: { ...Typography.label, color: Colors.primary },
  flowLabel: { ...Typography.body, color: Colors.textPrimary, flex: 1 },
  flowConditional: { ...Typography.caption, color: Colors.textHint, fontStyle: 'italic' },

  // Active Incident
  activeSection: { gap: Spacing.md },
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  activeTitle: { ...Typography.h1, color: Colors.textPrimary },
  activeCard: { padding: Spacing.xl },
  activeInfo: { marginBottom: Spacing.lg },
  activeStep: { ...Typography.h3, color: Colors.primary, marginBottom: Spacing.xs },
  activePatients: { ...Typography.bodySmall, color: Colors.textSecondary },
});
