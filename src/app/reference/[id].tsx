import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TREATMENT_CARDS, TreatmentCard, TreatmentStep } from '@/constants/treatmentCards';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';
import { Card, Divider } from '@/components/ui';

export default function ReferenceDetailScreen() {
  const { id } = useLocalSearchParams();
  const card = TREATMENT_CARDS.find((c) => c.id === id);

  if (!card) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={styles.errorText}>Treatment card not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: card.title }} />
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.icon}>{card.icon}</Text>
          <Text style={styles.title}>{card.title}</Text>
        </View>

        <Card variant="outlined" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Indication</Text>
          <Text style={styles.largeText}>{card.indication}</Text>
        </Card>

        {card.contraindications && card.contraindications.length > 0 && (
          <Card variant="outlined" style={[styles.sectionCard, styles.contraCard]}>
            <Text style={[styles.sectionTitle, styles.contraTitle]}>Contraindications</Text>
            {card.contraindications.map((contra, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.largeText}>{contra}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleMain}>Steps</Text>
        </View>

        <View style={styles.stepsContainer}>
          {card.steps.map((step, idx) => (
            <View key={idx} style={[styles.stepItem, step.important && styles.stepImportant]}>
              <View style={styles.stepNumberContainer}>
                <Text style={[styles.stepNumber, step.important && styles.stepNumberImportant]}>
                  {idx + 1}
                </Text>
              </View>
              <Text style={[styles.stepText, step.important && styles.stepTextImportant]}>
                {step.text}
              </Text>
            </View>
          ))}
        </View>

        {card.reminders && card.reminders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleMain}>Reminders</Text>
            </View>
            <Card variant="filled" style={styles.remindersCard}>
              {card.reminders.map((reminder, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.reminderText}>{reminder}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  icon: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.textPrimary,
    flex: 1,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  contraCard: {
    borderColor: Colors.error,
    backgroundColor: Colors.clinicalRedBg,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  contraTitle: {
    color: Colors.error,
  },
  sectionTitleMain: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    marginTop: Spacing.lg,
  },
  largeText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  bullet: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
    lineHeight: 28,
  },
  stepsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'flex-start',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepImportant: {
    backgroundColor: Colors.clinicalYellowBg,
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  stepNumber: {
    ...Typography.h3,
    color: Colors.primaryDark,
  },
  stepNumberImportant: {
    backgroundColor: Colors.warning,
    color: Colors.textOnDark,
    borderRadius: 16,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    overflow: 'hidden',
  },
  stepText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    flex: 1,
  },
  stepTextImportant: {
    fontWeight: '700',
  },
  remindersCard: {
    padding: Spacing.lg,
  },
  reminderText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
});
