/**
 * QuickSOAP — Assessment wizard layout
 * Wraps all assessment screens with progress bar and timer.
 */
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';
import { useAssessment } from '@/store/assessmentContext';
import { useStopwatch } from '@/hooks/useStopwatch';
import { ProgressBar } from '@/components/ui';
import IncidentTimer from '@/components/IncidentTimer';
import { WIZARD_STEPS } from '@/constants/clinicalData';
import { useEffect } from 'react';

export default function AssessmentLayout() {
  const { state } = useAssessment();
  const stopwatch = useStopwatch();

  // Restore timer from incident
  useEffect(() => {
    if (state.incident?.timerStart && !stopwatch.isRunning) {
      stopwatch.restoreFrom(state.incident.timerStart);
    }
  }, [state.incident?.timerStart]);

  const stepLabels = WIZARD_STEPS.map(s => s.shortLabel);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerRow}>
          <IncidentTimer formattedTime={stopwatch.formattedTime} isRunning={stopwatch.isRunning} />
        </View>
        <ProgressBar
          currentStep={state.currentStep}
          totalSteps={WIZARD_STEPS.length}
          stepLabels={stepLabels}
        />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.md, paddingBottom: Spacing.md,
    gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  timerRow: { flexDirection: 'row', justifyContent: 'flex-end' },
});
