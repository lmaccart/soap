/**
 * QuickSOAP — Assessment wizard layout
 * Wraps all assessment screens with timer.
 */
import { Stack } from 'expo-router';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';
import { useAssessment } from '@/store/assessmentContext';
import { useStopwatch } from '@/hooks/useStopwatch';
import IncidentTimer from '@/components/IncidentTimer';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerRow}>
          <IncidentTimer formattedTime={stopwatch.formattedTime} isRunning={stopwatch.isRunning} />
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.md, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  timerRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  kav: { flex: 1 },
});
