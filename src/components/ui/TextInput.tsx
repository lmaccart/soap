/**
 * QuickSOAP UI — TextInput component
 */
import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/typography';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  hint?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
}

export default function TextInput({
  label, placeholder, value, onChangeText, multiline = false,
  numberOfLines = 1, error, hint, keyboardType, maxLength, editable = true,
}: TextInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && [styles.multiline, { minHeight: Math.max(80, numberOfLines * 24) }],
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textHint}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      <View style={styles.footer}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hint}>{hint}</Text>
        ) : null}
        {maxLength && (
          <Text style={styles.counter}>{value.length}/{maxLength}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.base },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.xs, textTransform: 'uppercase' },
  input: {
    ...Typography.body, color: Colors.textPrimary, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  multiline: { textAlignVertical: 'top', paddingTop: Spacing.md },
  inputError: { borderColor: Colors.clinicalRed },
  inputDisabled: { backgroundColor: Colors.background, color: Colors.textHint },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  error: { ...Typography.caption, color: Colors.clinicalRed },
  hint: { ...Typography.caption, color: Colors.textHint },
  counter: { ...Typography.caption, color: Colors.textHint },
});
