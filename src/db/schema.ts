/**
 * QuickSOAP — Drizzle ORM SQLite Schema
 * All tables for the WFR SOAP note database.
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ── Incidents ──────────────────────────────────────────────
export const incidents = sqliteTable('incidents', {
  id: text('id').primaryKey(),
  createdAt: text('created_at').notNull(),
  sceneSafety: text('scene_safety'), // JSON
  moiNoi: text('moi_noi'),
  moiType: text('moi_type'), // 'trauma' | 'medical'
  numPatients: integer('num_patients').default(1),
  resources: text('resources'), // JSON
  bsiCompleted: integer('bsi_completed', { mode: 'boolean' }).default(false),
  bsiItems: text('bsi_items'), // JSON
  location: text('location'),
  status: text('status').notNull().default('active'), // 'active' | 'completed' | 'exported'
  timerStart: text('timer_start'),
});

// ── Patients ───────────────────────────────────────────────
export const patients = sqliteTable('patients', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').notNull().references(() => incidents.id),
  name: text('name'),
  age: text('age'),
  sex: text('sex'), // 'M' | 'F' | 'Other' | 'Unknown'
  triageCategory: text('triage_category'), // 'immediate' | 'delayed' | 'minor' | 'expectant'
  chiefComplaint: text('chief_complaint'),
  avpu: text('avpu'), // 'A+Ox4' | 'A+Ox3' | ... | 'V' | 'P' | 'U'
  orientation: text('orientation'), // JSON { person, place, time, event }
  createdAt: text('created_at').notNull(),
});

// ── ABCDE Assessment ───────────────────────────────────────
export const abcde = sqliteTable('abcde', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  airwayStatus: text('airway_status'),
  airwayNotes: text('airway_notes'),
  airwayIntervention: text('airway_intervention'),
  breathingPresent: integer('breathing_present', { mode: 'boolean' }),
  breathingAdequate: integer('breathing_adequate', { mode: 'boolean' }),
  breathingNotes: text('breathing_notes'),
  circulationPulse: integer('circulation_pulse', { mode: 'boolean' }),
  bloodSweepFound: integer('blood_sweep_found', { mode: 'boolean' }),
  bleedingLocation: text('bleeding_location'),
  bleedingSeverity: text('bleeding_severity'),
  circulationIntervention: text('circulation_intervention'),
  disabilityNotes: text('disability_notes'),
  spineSuspected: integer('spine_suspected', { mode: 'boolean' }),
  exposeNotes: text('expose_notes'),
});

// ── Physical Exam ──────────────────────────────────────────
export const physicalExam = sqliteTable('physical_exam', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  examType: text('exam_type'), // 'rapid_trauma' | 'full' | 'focused'
  findings: text('findings'), // JSON — DCAP-BTLS per region
});

// ── Injuries ───────────────────────────────────────────────
export const injuries = sqliteTable('injuries', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  bodyRegion: text('body_region'),
  bodyX: real('body_x'),
  bodyY: real('body_y'),
  type: text('type'), // DCAP-BTLS category
  description: text('description'),
  severity: text('severity'), // 'minor' | 'moderate' | 'severe'
});

// ── SAMPLE History ─────────────────────────────────────────
export const sampleHistory = sqliteTable('sample_history', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  signsSymptoms: text('signs_symptoms'),
  allergies: text('allergies'),
  medications: text('medications'),
  pastMedical: text('past_medical'),
  lastIntake: text('last_intake'),
  lastOutput: text('last_output'),
  events: text('events'),
});

// ── OPQRST ─────────────────────────────────────────────────
export const opqrst = sqliteTable('opqrst', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  onset: text('onset'),
  provocation: text('provocation'),
  palliation: text('palliation'),
  quality: text('quality'),
  region: text('region'),
  radiation: text('radiation'),
  severity: integer('severity'),
  timeDuration: text('time_duration'),
});

// ── STOP EATS ──────────────────────────────────────────────
export const stopEats = sqliteTable('stop_eats', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  sugar: text('sugar'),
  temperature: text('temperature'),
  oxygen: text('oxygen'),
  pressure: text('pressure'),
  electricity: text('electricity'),
  altitude: text('altitude'),
  toxins: text('toxins'),
  salts: text('salts'),
  suspectedCause: text('suspected_cause'),
});

// ── Vitals ─────────────────────────────────────────────────
export const vitals = sqliteTable('vitals', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  recordedAt: text('recorded_at').notNull(),
  loc: text('loc'),
  pulseRate: integer('pulse_rate'),
  pulseQuality: text('pulse_quality'),
  pulseRegularity: text('pulse_regularity'),
  respRate: integer('resp_rate'),
  respQuality: text('resp_quality'),
  skinColor: text('skin_color'),
  skinTemp: text('skin_temp'),
  skinMoisture: text('skin_moisture'),
  pupils: text('pupils'),
  bpSystolic: integer('bp_systolic'),
  bpDiastolic: integer('bp_diastolic'),
  spo2: integer('spo2'),
  capRefill: text('cap_refill'),
  temperatureF: real('temperature_f'),
  notes: text('notes'),
});

// ── SOAP Notes ─────────────────────────────────────────────
export const soapNotes = sqliteTable('soap_notes', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id),
  subjective: text('subjective'),
  objective: text('objective'),
  assessment: text('assessment'),
  plan: text('plan'),
  compiledAt: text('compiled_at'),
  exported: integer('exported', { mode: 'boolean' }).default(false),
});

// ── Type Exports ───────────────────────────────────────────
export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type ABCDE = typeof abcde.$inferSelect;
export type NewABCDE = typeof abcde.$inferInsert;
export type PhysicalExam = typeof physicalExam.$inferSelect;
export type Injury = typeof injuries.$inferSelect;
export type NewInjury = typeof injuries.$inferInsert;
export type SampleHistory = typeof sampleHistory.$inferSelect;
export type OPQRST = typeof opqrst.$inferSelect;
export type StopEats = typeof stopEats.$inferSelect;
export type Vitals = typeof vitals.$inferSelect;
export type NewVitals = typeof vitals.$inferInsert;
export type SOAPNote = typeof soapNotes.$inferSelect;
