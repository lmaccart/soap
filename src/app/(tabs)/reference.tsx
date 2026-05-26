/**
 * QuickSOAP — Treatment Reference tab
 */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui';
import { TREATMENT_CARDS } from '@/constants/treatmentCards';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadows } from '@/constants/typography';

export default function ReferenceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Quick reference cards for field treatment procedures</Text>
        <View style={styles.grid}>
          {TREATMENT_CARDS.map((card) => (
            <Card
              key={card.id}
              variant="elevated"
              onPress={() => router.push(`/reference/${card.id}` as any)}
              style={styles.card}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardIndication} numberOfLines={2}>{card.indication}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSteps}>{card.steps.length} steps</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },
  grid: { gap: Spacing.md },
  card: { padding: Spacing.lg },
  cardIcon: { fontSize: 32, marginBottom: Spacing.md },
  cardTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.xs },
  cardIndication: { ...Typography.bodySmall, color: Colors.textSecondary },
  cardFooter: { marginTop: Spacing.md, flexDirection: 'row' },
  cardSteps: { ...Typography.caption, color: Colors.primary },
});
