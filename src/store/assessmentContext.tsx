/**
 * QuickSOAP — Assessment Context
 * React Context + useReducer for managing active assessment state in-memory.
 * All UI reads from this context (never directly from SQLite).
 * Writes are enqueued to the background write queue.
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// ── ID Generator ───────────────────────────────────────────
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// ── Types ──────────────────────────────────────────────────

export interface OrientationData {
  person: boolean;
  place: boolean;
  time: boolean;
  event: boolean;
}

export interface ABCDEData {
  airwayStatus: string;
  airwayNotes: string;
  airwayIntervention: string;
  breathingPresent: boolean | null;
  breathingAdequate: boolean | null;
  breathingNotes: string;
  circulationPulse: boolean | null;
  bloodSweepFound: boolean | null;
  bleedingLocation: string;
  bleedingSeverity: string;
  circulationIntervention: string;
  disabilityNotes: string;
  spineSuspected: boolean | null;
  exposeNotes: string;
}

export interface InjuryData {
  id: string;
  bodyRegion: string;
  bodyX: number;
  bodyY: number;
  type: string; // DCAP-BTLS
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
}

export interface SampleData {
  signsSymptoms: string;
  allergies: string;
  medications: string;
  pastMedical: string;
  lastIntake: string;
  lastOutput: string;
  events: string;
}

export interface OpqrstData {
  onset: string;
  provocation: string;
  palliation: string;
  quality: string;
  region: string;
  radiation: string;
  severity: number;
  timeDuration: string;
}

export interface StopEatsData {
  sugar: string;
  temperature: string;
  oxygen: string;
  pressure: string;
  electricity: string;
  altitude: string;
  toxins: string;
  salts: string;
  suspectedCause: string;
}

export interface VitalsEntry {
  id: string;
  recordedAt: string;
  loc: string;
  pulseRate: number | null;
  pulseQuality: string;
  pulseRegularity: string;
  respRate: number | null;
  respQuality: string;
  skinColor: string;
  skinTemp: string;
  skinMoisture: string;
  pupils: string;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  spo2: number | null;
  capRefill: string;
  temperatureF: number | null;
  notes: string;
}

export interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface PatientData {
  id: string;
  name: string;
  age: string;
  sex: string;
  triageCategory: string;
  chiefComplaint: string;
  avpu: string;
  orientation: OrientationData;
  abcde: ABCDEData;
  physicalExam: {
    examType: string;
    findings: Record<string, string[]>; // region -> DCAP-BTLS keys
  };
  injuries: InjuryData[];
  sample: SampleData;
  opqrst: OpqrstData;
  stopEats: StopEatsData;
  vitals: VitalsEntry[];
  soap: SOAPData;
}

export interface SceneData {
  hazards: Record<string, boolean>;
  hazardNotes: string;
  moiNoi: string;
  moiType: 'trauma' | 'medical' | '';
  numPatients: number;
  resources: Record<string, boolean>;
  resourceNotes: string;
  location: string;
}

export interface IncidentData {
  id: string;
  createdAt: string;
  timerStart: string;
  status: 'active' | 'completed' | 'exported';
  scene: SceneData;
  bsiCompleted: boolean;
  bsiItems: Record<string, boolean>;
}

export interface AssessmentState {
  incident: IncidentData | null;
  currentPatientId: string | null;
  patients: Record<string, PatientData>;
  currentStep: number;
  isAmsDetected: boolean;
  isMci: boolean;
}

// ── Initial State ──────────────────────────────────────────

const EMPTY_ORIENTATION: OrientationData = { person: false, place: false, time: false, event: false };

const EMPTY_ABCDE: ABCDEData = {
  airwayStatus: '', airwayNotes: '', airwayIntervention: '',
  breathingPresent: null, breathingAdequate: null, breathingNotes: '',
  circulationPulse: null, bloodSweepFound: null, bleedingLocation: '', bleedingSeverity: '', circulationIntervention: '',
  disabilityNotes: '', spineSuspected: null, exposeNotes: '',
};

const EMPTY_SAMPLE: SampleData = {
  signsSymptoms: '', allergies: '', medications: '', pastMedical: '', lastIntake: '', lastOutput: '', events: '',
};

const EMPTY_OPQRST: OpqrstData = {
  onset: '', provocation: '', palliation: '', quality: '', region: '', radiation: '', severity: 0, timeDuration: '',
};

const EMPTY_STOP_EATS: StopEatsData = {
  sugar: '', temperature: '', oxygen: '', pressure: '', electricity: '', altitude: '', toxins: '', salts: '', suspectedCause: '',
};

const EMPTY_SOAP: SOAPData = { subjective: '', objective: '', assessment: '', plan: '' };

export function createEmptyPatient(id?: string): PatientData {
  return {
    id: id ?? generateId(),
    name: '', age: '', sex: '', triageCategory: '', chiefComplaint: '',
    avpu: '', orientation: { ...EMPTY_ORIENTATION },
    abcde: { ...EMPTY_ABCDE },
    physicalExam: { examType: '', findings: {} },
    injuries: [],
    sample: { ...EMPTY_SAMPLE },
    opqrst: { ...EMPTY_OPQRST },
    stopEats: { ...EMPTY_STOP_EATS },
    vitals: [],
    soap: { ...EMPTY_SOAP },
  };
}

const initialState: AssessmentState = {
  incident: null,
  currentPatientId: null,
  patients: {},
  currentStep: 0,
  isAmsDetected: false,
  isMci: false,
};

// ── Actions ────────────────────────────────────────────────

type AssessmentAction =
  | { type: 'START_INCIDENT' }
  | { type: 'ADD_PATIENT'; payload?: { name?: string; triageCategory?: string } }
  | { type: 'SET_CURRENT_PATIENT'; payload: string }
  | { type: 'UPDATE_SCENE'; payload: Partial<SceneData> }
  | { type: 'UPDATE_BSI'; payload: { completed: boolean; items: Record<string, boolean> } }
  | { type: 'UPDATE_PATIENT'; payload: { patientId: string; data: Partial<PatientData> } }
  | { type: 'UPDATE_AVPU'; payload: { avpu: string; orientation?: Partial<OrientationData> } }
  | { type: 'UPDATE_ABCDE'; payload: Partial<ABCDEData> }
  | { type: 'UPDATE_PHYSICAL_EXAM'; payload: { examType?: string; findings?: Record<string, string[]> } }
  | { type: 'ADD_INJURY'; payload: InjuryData }
  | { type: 'REMOVE_INJURY'; payload: string }
  | { type: 'UPDATE_SAMPLE'; payload: Partial<SampleData> }
  | { type: 'UPDATE_OPQRST'; payload: Partial<OpqrstData> }
  | { type: 'UPDATE_STOP_EATS'; payload: Partial<StopEatsData> }
  | { type: 'ADD_VITALS'; payload: VitalsEntry }
  | { type: 'UPDATE_SOAP'; payload: Partial<SOAPData> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'COMPLETE_INCIDENT' }
  | { type: 'LOAD_STATE'; payload: AssessmentState }
  | { type: 'RESET' };

// ── Reducer ────────────────────────────────────────────────

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  const currentPatient = state.currentPatientId ? state.patients[state.currentPatientId] : null;

  function updateCurrentPatient(updates: Partial<PatientData>): Record<string, PatientData> {
    if (!state.currentPatientId || !currentPatient) return state.patients;
    return {
      ...state.patients,
      [state.currentPatientId]: { ...currentPatient, ...updates },
    };
  }

  switch (action.type) {
    case 'START_INCIDENT': {
      const now = new Date().toISOString();
      const incidentId = generateId();
      const patientId = generateId();
      const patient = createEmptyPatient(patientId);
      return {
        ...initialState,
        incident: {
          id: incidentId,
          createdAt: now,
          timerStart: now,
          status: 'active',
          scene: {
            hazards: {}, hazardNotes: '', moiNoi: '', moiType: '',
            numPatients: 1, resources: {}, resourceNotes: '', location: '',
          },
          bsiCompleted: false,
          bsiItems: {},
        },
        currentPatientId: patientId,
        patients: { [patientId]: patient },
        currentStep: 1,
      };
    }

    case 'ADD_PATIENT': {
      const id = generateId();
      const newPatient = createEmptyPatient(id);
      if (action.payload?.name) newPatient.name = action.payload.name;
      if (action.payload?.triageCategory) newPatient.triageCategory = action.payload.triageCategory;
      return {
        ...state,
        patients: { ...state.patients, [id]: newPatient },
        isMci: Object.keys(state.patients).length + 1 > 1,
      };
    }

    case 'SET_CURRENT_PATIENT':
      return { ...state, currentPatientId: action.payload };

    case 'UPDATE_SCENE':
      if (!state.incident) return state;
      return {
        ...state,
        incident: {
          ...state.incident,
          scene: { ...state.incident.scene, ...action.payload },
        },
        isMci: (action.payload.numPatients ?? state.incident.scene.numPatients) > 1,
      };

    case 'UPDATE_BSI':
      if (!state.incident) return state;
      return {
        ...state,
        incident: {
          ...state.incident,
          bsiCompleted: action.payload.completed,
          bsiItems: action.payload.items,
        },
      };

    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patientId]: {
            ...state.patients[action.payload.patientId],
            ...action.payload.data,
          },
        },
      };

    case 'UPDATE_AVPU': {
      const isAms = ['V', 'P', 'U'].includes(action.payload.avpu);
      const updatedOrientation = action.payload.orientation
        ? { ...currentPatient?.orientation, ...action.payload.orientation }
        : currentPatient?.orientation ?? { ...EMPTY_ORIENTATION };
      return {
        ...state,
        patients: updateCurrentPatient({
          avpu: action.payload.avpu,
          orientation: updatedOrientation as OrientationData,
        }),
        isAmsDetected: isAms,
      };
    }

    case 'UPDATE_ABCDE':
      return { ...state, patients: updateCurrentPatient({ abcde: { ...currentPatient!.abcde, ...action.payload } }) };

    case 'UPDATE_PHYSICAL_EXAM':
      return {
        ...state,
        patients: updateCurrentPatient({
          physicalExam: { ...currentPatient!.physicalExam, ...action.payload },
        }),
      };

    case 'ADD_INJURY':
      return {
        ...state,
        patients: updateCurrentPatient({
          injuries: [...(currentPatient?.injuries ?? []), action.payload],
        }),
      };

    case 'REMOVE_INJURY':
      return {
        ...state,
        patients: updateCurrentPatient({
          injuries: (currentPatient?.injuries ?? []).filter(i => i.id !== action.payload),
        }),
      };

    case 'UPDATE_SAMPLE':
      return { ...state, patients: updateCurrentPatient({ sample: { ...currentPatient!.sample, ...action.payload } }) };

    case 'UPDATE_OPQRST':
      return { ...state, patients: updateCurrentPatient({ opqrst: { ...currentPatient!.opqrst, ...action.payload } }) };

    case 'UPDATE_STOP_EATS':
      return { ...state, patients: updateCurrentPatient({ stopEats: { ...currentPatient!.stopEats, ...action.payload } }) };

    case 'ADD_VITALS':
      return {
        ...state,
        patients: updateCurrentPatient({
          vitals: [...(currentPatient?.vitals ?? []), action.payload],
        }),
      };

    case 'UPDATE_SOAP':
      return { ...state, patients: updateCurrentPatient({ soap: { ...currentPatient!.soap, ...action.payload } }) };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'COMPLETE_INCIDENT':
      if (!state.incident) return state;
      return { ...state, incident: { ...state.incident, status: 'completed' } };

    case 'LOAD_STATE':
      return action.payload;

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────

interface AssessmentContextValue {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  /** Convenience: get current patient data */
  currentPatient: PatientData | null;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

/** Provider component — wrap the app root */
export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  const currentPatient = state.currentPatientId
    ? state.patients[state.currentPatientId] ?? null
    : null;

  return (
    <AssessmentContext.Provider value={{ state, dispatch, currentPatient }}>
      {children}
    </AssessmentContext.Provider>
  );
}

/** Hook to access assessment state and dispatch */
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
