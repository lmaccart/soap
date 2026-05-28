/**
 * QuickSOAP — Database connection and provider
 * Initializes expo-sqlite with Drizzle ORM and creates tables.
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

const DB_NAME = 'quicksoap.db';

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const DatabaseContext = createContext<DrizzleDB | null>(null);

/** SQL statements to create all tables */
const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    scene_safety TEXT,
    moi_noi TEXT,
    moi_type TEXT,
    num_patients INTEGER DEFAULT 1,
    resources TEXT,
    bsi_completed INTEGER DEFAULT 0,
    bsi_items TEXT,
    location TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    timer_start TEXT
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    incident_id TEXT NOT NULL REFERENCES incidents(id),
    name TEXT,
    age TEXT,
    sex TEXT,
    triage_category TEXT,
    chief_complaint TEXT,
    avpu TEXT,
    orientation TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS abcde (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    airway_status TEXT,
    airway_notes TEXT,
    airway_intervention TEXT,
    breathing_present INTEGER,
    breathing_adequate INTEGER,
    breathing_notes TEXT,
    circulation_pulse INTEGER,
    blood_sweep_found INTEGER,
    bleeding_location TEXT,
    bleeding_severity TEXT,
    circulation_intervention TEXT,
    disability_notes TEXT,
    spine_suspected INTEGER,
    expose_notes TEXT
  );

  CREATE TABLE IF NOT EXISTS physical_exam (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    exam_type TEXT,
    findings TEXT
  );

  CREATE TABLE IF NOT EXISTS injuries (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    body_region TEXT,
    body_x REAL,
    body_y REAL,
    type TEXT,
    description TEXT,
    severity TEXT
  );

  CREATE TABLE IF NOT EXISTS sample_history (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    signs_symptoms TEXT,
    allergies TEXT,
    medications TEXT,
    past_medical TEXT,
    last_intake TEXT,
    last_output TEXT,
    events TEXT
  );

  CREATE TABLE IF NOT EXISTS opqrst (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    onset TEXT,
    provocation TEXT,
    palliation TEXT,
    quality TEXT,
    region TEXT,
    radiation TEXT,
    severity INTEGER,
    time_duration TEXT
  );

  CREATE TABLE IF NOT EXISTS stop_eats (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    sugar TEXT,
    temperature TEXT,
    oxygen TEXT,
    pressure TEXT,
    electricity TEXT,
    altitude TEXT,
    toxins TEXT,
    salts TEXT,
    suspected_cause TEXT
  );

  CREATE TABLE IF NOT EXISTS vitals (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    recorded_at TEXT NOT NULL,
    loc TEXT,
    pulse_rate INTEGER,
    pulse_quality TEXT,
    pulse_regularity TEXT,
    resp_rate INTEGER,
    resp_quality TEXT,
    skin_color TEXT,
    skin_temp TEXT,
    skin_moisture TEXT,
    pupils TEXT,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    spo2 INTEGER,
    cap_refill TEXT,
    temperature_f REAL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS soap_notes (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    compiled_at TEXT,
    exported INTEGER DEFAULT 0
  );
`;

/** Database provider component */
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DrizzleDB | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const sqlite = openDatabaseSync(DB_NAME);
      // Enable WAL mode for better concurrent read/write performance
      sqlite.execSync('PRAGMA journal_mode = WAL;');
      sqlite.execSync('PRAGMA foreign_keys = ON;');
      // Create tables
      const statements = CREATE_TABLES_SQL.split(';').filter(s => s.trim());
      for (const stmt of statements) {
        sqlite.execSync(stmt + ';');
      }
      const drizzleDb = drizzle(sqlite, { schema });
      setDb(drizzleDb);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }, []);

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}

/** Hook to access the Drizzle database instance */
export function useDatabase(): DrizzleDB | null {
  return useContext(DatabaseContext);
}
