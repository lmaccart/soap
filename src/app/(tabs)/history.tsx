/**
 * QuickSOAP — History tab (past SOAP notes)
 */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Card, Badge } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

export default function HistoryScreen() {
  // TODO: Load from SQLite
  const pastNotes: any[] = [];

  return (
    <SafeAreaView style={styles.container}>
      {pastNotes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Past Notes</Text>
          <Text style={styles.emptyText}>Completed SOAP notes will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={pastNotes}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card variant="elevated" onPress={() => {}} style={styles.noteCard}>
              <Text style={styles.noteDate}>{item.date}</Text>
              <Text style={styles.noteSummary}>{item.summary}</Text>
              <View style={styles.noteBadges}>
                <Badge text={item.moiType} variant="info" size="sm" />
                <Badge text={`${item.patientCount} patient(s)`} size="sm" />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.base },
  emptyTitle: { ...Typography.h2, color: Colors.textSecondary, marginBottom: Spacing.sm },
  emptyText: { ...Typography.body, color: Colors.textHint, textAlign: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  noteCard: { padding: Spacing.base },
  noteDate: { ...Typography.caption, color: Colors.textHint },
  noteSummary: { ...Typography.h3, color: Colors.textPrimary, marginTop: Spacing.xs },
  noteBadges: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
});
