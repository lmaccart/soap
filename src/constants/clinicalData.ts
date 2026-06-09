/**
 * QuickSOAP — Clinical reference data constants
 * All static clinical content for the WFR assessment workflow.
 */

import { Colors } from '@/constants/colors';

// ── AVPU Scale ─────────────────────────────────────────────
export const AVPU_LEVELS = [
  { value: 'A', label: 'Alert', description: 'Patient is awake, aware, and responsive', color: Colors.clinicalGreen },
  { value: 'V', label: 'Verbal', description: 'Responds only to voice — moaning, grunting, moving, eyes opening', color: Colors.clinicalYellow },
  { value: 'P', label: 'Pain', description: 'Responds only to painful stimulus — sternal rub or trapezius pinch', color: Colors.clinicalRed },
  { value: 'U', label: 'Unresponsive', description: 'No response to voice or pain — manage airway immediately', color: Colors.clinicalRed },
] as const;

export const ORIENTATION_CHECKS = [
  { key: 'person', label: 'Person', question: 'What is your name?' },
  { key: 'place', label: 'Place', question: 'Where are you?' },
  { key: 'time', label: 'Time', question: 'What day/date is it?' },
  { key: 'event', label: 'Event', question: 'What happened?' },
] as const;

// ── Scene Size-Up ──────────────────────────────────────────
export const SCENE_HAZARDS = [
  { key: 'terrain', label: 'Unstable Terrain', icon: '⛰️' },
  { key: 'weather', label: 'Weather/Lightning', icon: '⛈️' },
  { key: 'wildlife', label: 'Wildlife', icon: '🐻' },
  { key: 'traffic', label: 'Traffic/Vehicles', icon: '🚗' },
  { key: 'water', label: 'Swift Water', icon: '🌊' },
  { key: 'electrical', label: 'Electrical', icon: '⚡' },
  { key: 'avalanche', label: 'Avalanche', icon: '🏔️' },
  { key: 'fire', label: 'Fire/Smoke', icon: '🔥' },
  { key: 'hazmat', label: 'Hazardous Materials', icon: '☣️' },
  { key: 'other', label: 'Other', icon: '⚠️' },
] as const;

export const BSI_ITEMS = [
  { key: 'gloves', label: 'Nitrile Gloves', required: true },
  { key: 'eye_protection', label: 'Eye Protection', required: false },
  { key: 'mask', label: 'Mask / Respiratory Protection', required: false },
  { key: 'cpr_barrier', label: 'CPR Barrier Device', required: false },
  { key: 'hand_hygiene', label: 'Hand Hygiene Supplies', required: false },
] as const;

export const RESOURCES = [
  { key: 'first_aid_kit', label: 'First Aid Kit' },
  { key: 'sam_splint', label: 'SAM Splint' },
  { key: 'c_collar', label: 'C-Collar' },
  { key: 'comm_device', label: 'Communication Device' },
  { key: 'additional_responders', label: 'Additional Responders' },
] as const;

// ── ABCDE ──────────────────────────────────────────────────
export const AIRWAY_STATUS = [
  { value: 'patent', label: 'Patent', description: 'Open and clear' },
  { value: 'compromised', label: 'Compromised', description: 'Partially blocked' },
  { value: 'obstructed', label: 'Obstructed', description: 'Fully blocked' },
] as const;

export const AIRWAY_INTERVENTIONS = [
  { key: 'head_tilt_chin_lift', label: 'Head-tilt / Chin-lift' },
  { key: 'jaw_thrust', label: 'Jaw-thrust Maneuver' },
  { key: 'manual_clearing', label: 'Manual Clearing' },
  { key: 'suction', label: 'Suction' },
  { key: 'opa', label: 'OPA' },
  { key: 'npa', label: 'NPA' },
] as const;

export const CIRCULATION_INTERVENTIONS = [
  { key: 'direct_pressure', label: 'Direct Pressure' },
  { key: 'wound_packing', label: 'Wound Packing' },
  { key: 'tourniquet', label: 'Tourniquet' },
  { key: 'pressure_bandage', label: 'Pressure Bandage' },
] as const;

// ── Physical Exam ──────────────────────────────────────────
export const DCAP_BTLS = [
  { key: 'deformity', label: 'Deformity', abbrev: 'D' },
  { key: 'contusion', label: 'Contusion', abbrev: 'C' },
  { key: 'abrasion', label: 'Abrasion', abbrev: 'A' },
  { key: 'puncture', label: 'Puncture/Penetration', abbrev: 'P' },
  { key: 'burn', label: 'Burn', abbrev: 'B' },
  { key: 'tenderness', label: 'Tenderness', abbrev: 'T' },
  { key: 'laceration', label: 'Laceration', abbrev: 'L' },
  { key: 'swelling', label: 'Swelling', abbrev: 'S' },
] as const;

export interface BodyRegion {
  id: string;
  label: string;
  view: 'front' | 'back';
  clinicalNote: string;
}

export const BODY_REGIONS: BodyRegion[] = [
  // Front view (15 regions)
  { id: 'head_anterior', label: 'Head', view: 'front', clinicalNote: 'Scalp, face, ears, pupils (PERRL). Check for fluid from ears/nose (CSF).' },
  { id: 'neck_anterior', label: 'Neck', view: 'front', clinicalNote: 'C-spine, trachea position, JVD. Palpate carefully.' },
  { id: 'r_shoulder', label: 'R Shoulder', view: 'front', clinicalNote: 'Clavicle, AC joint, range of motion.' },
  { id: 'l_shoulder', label: 'L Shoulder', view: 'front', clinicalNote: 'Clavicle, AC joint, range of motion.' },
  { id: 'chest', label: 'Chest', view: 'front', clinicalNote: 'Ribs, sternum, breath sounds. Check for uneven movement, flail segment.' },
  { id: 'r_upper_arm', label: 'R Upper Arm', view: 'front', clinicalNote: 'Humerus. Check CSMs distally.' },
  { id: 'l_upper_arm', label: 'L Upper Arm', view: 'front', clinicalNote: 'Humerus. Check CSMs distally.' },
  { id: 'abdomen', label: 'Abdomen', view: 'front', clinicalNote: 'All 4 quadrants: tenderness, rigidity, distension, guarding.' },
  { id: 'r_forearm_hand', label: 'R Forearm + Hand', view: 'front', clinicalNote: 'Radius/ulna, grip strength, CSMs (radial pulse, sensation, finger wiggle).' },
  { id: 'l_forearm_hand', label: 'L Forearm + Hand', view: 'front', clinicalNote: 'Radius/ulna, grip strength, CSMs (radial pulse, sensation, finger wiggle).' },
  { id: 'pelvis', label: 'Pelvis', view: 'front', clinicalNote: 'Compress iliac crests ONCE only. Check for instability and pain.' },
  { id: 'r_femur_thigh', label: 'R Femur/Thigh', view: 'front', clinicalNote: 'Mid-shaft femur — traction splint zone if isolated fracture.' },
  { id: 'l_femur_thigh', label: 'L Femur/Thigh', view: 'front', clinicalNote: 'Mid-shaft femur — traction splint zone if isolated fracture.' },
  { id: 'r_lower_leg_foot', label: 'R Lower Leg + Foot', view: 'front', clinicalNote: 'Tibia/fibula, pedal pulse, CSMs (dorsiflexion, toe wiggle).' },
  { id: 'l_lower_leg_foot', label: 'L Lower Leg + Foot', view: 'front', clinicalNote: 'Tibia/fibula, pedal pulse, CSMs (dorsiflexion, toe wiggle).' },
  // Back view (9 regions)
  { id: 'head_posterior', label: 'Head (Post)', view: 'back', clinicalNote: 'Occipital region, base of skull. Palpate for deformity, bleeding.' },
  { id: 'neck_posterior', label: 'Neck (Post)', view: 'back', clinicalNote: 'Cervical spine palpation — check each spinous process for tenderness, step-off.' },
  { id: 'upper_back', label: 'Upper Back', view: 'back', clinicalNote: 'Thoracic spine, scapulae. Palpate each vertebra.' },
  { id: 'lower_back', label: 'Lower Back', view: 'back', clinicalNote: 'Lumbar spine, kidney area. Check for costovertebral angle tenderness.' },
  { id: 'buttocks', label: 'Buttocks', view: 'back', clinicalNote: 'Sacrum, coccyx. Check for hidden bleeding.' },
  { id: 'r_posterior_thigh', label: 'R Post. Thigh', view: 'back', clinicalNote: 'Hamstring, posterior compartment.' },
  { id: 'l_posterior_thigh', label: 'L Post. Thigh', view: 'back', clinicalNote: 'Hamstring, posterior compartment.' },
  { id: 'r_posterior_lower_leg', label: 'R Post. Lower Leg', view: 'back', clinicalNote: 'Calves, Achilles tendon, soles of feet.' },
  { id: 'l_posterior_lower_leg', label: 'L Post. Lower Leg', view: 'back', clinicalNote: 'Calves, Achilles tendon, soles of feet.' },
];

export const EXAM_TYPES = [
  { value: 'rapid_trauma', label: 'Rapid Trauma Scan', description: 'Quick 30–90 second head-to-toe for major injuries' },
  { value: 'full', label: 'Full Head-to-Toe', description: 'Comprehensive exam after life threats stabilized' },
  { value: 'focused', label: 'Focused Exam', description: 'Target specific systems related to complaint' },
] as const;

// ── SAMPLE History ─────────────────────────────────────────
export const COMMON_ALLERGIES = ['None Known', 'Penicillin', 'Sulfa', 'NSAIDs', 'Latex', 'Bee Stings', 'Nuts', 'Shellfish'] as const;
export const COMMON_CONDITIONS = ['None', 'Diabetes', 'Asthma', 'Heart Disease', 'Seizures', 'Hypertension', 'COPD', 'Blood Thinners'] as const;

// ── OPQRST ─────────────────────────────────────────────────
export const PAIN_QUALITIES = ['Sharp', 'Dull', 'Crushing', 'Burning', 'Throbbing', 'Cramping', 'Aching', 'Stabbing', 'Tearing', 'Pressure'] as const;

// ── STOP EATS ──────────────────────────────────────────────
export const STOP_EATS_CAUSES = [
  { key: 'sugar', letter: 'S', label: 'Sugar', prompt: 'Could this be low blood sugar? Diabetic? When did they last eat?' },
  { key: 'temperature', letter: 'T', label: 'Temperature', prompt: 'Signs of hypothermia or hyperthermia?' },
  { key: 'oxygen', letter: 'O', label: 'Oxygen', prompt: 'Altitude? Drowning? Airway issue? Asthma?' },
  { key: 'pressure', letter: 'P', label: 'Pressure', prompt: 'Head injury? Signs of stroke? Increasing ICP?' },
  { key: 'electricity', letter: 'E', label: 'Electricity', prompt: 'Seizure history? Lightning strike?' },
  { key: 'altitude', letter: 'A', label: 'Altitude', prompt: 'High elevation? AMS/HACE symptoms?' },
  { key: 'toxins', letter: 'T', label: 'Toxins', prompt: 'Ingestion? Drugs/alcohol? Bites/stings? Poisoning?' },
  { key: 'salts', letter: 'S', label: 'Salts', prompt: 'Overhydration? Electrolyte imbalance? Hyponatremia?' },
] as const;

// ── Vitals ─────────────────────────────────────────────────
export const VITAL_OPTIONS = {
  pulseQuality: ['Strong', 'Weak', 'Thready', 'Bounding'],
  pulseRegularity: ['Regular', 'Irregular'],
  respQuality: ['Easy', 'Labored', 'Shallow', 'Noisy'],
  skinColor: ['Pink', 'Pale', 'Cyanotic', 'Flushed', 'Mottled', 'Jaundice'],
  skinTemp: ['Warm', 'Hot', 'Cool', 'Cold'],
  skinMoisture: ['Dry', 'Clammy', 'Diaphoretic'],
  pupils: ['PERRL', 'Unequal', 'Fixed', 'Dilated', 'Constricted'],
  capRefill: ['≤2 sec', '>2 sec'],
} as const;

export const VITAL_NORMALS = {
  pulseRate: { min: 60, max: 100, unit: 'bpm', label: 'Heart Rate' },
  respRate: { min: 12, max: 20, unit: 'breaths/min', label: 'Respiratory Rate' },
  spo2: { min: 94, max: 100, unit: '%', label: 'SpO2' },
  bpSystolic: { min: 90, max: 140, unit: 'mmHg', label: 'BP Systolic' },
  temperature: { min: 97.0, max: 99.5, unit: '°F', label: 'Temperature' },
} as const;

// ── Triage ─────────────────────────────────────────────────
export const TRIAGE_CATEGORIES = [
  { value: 'immediate', label: 'Immediate', emoji: '🔴', color: Colors.triageImmediate, bgColor: Colors.triageImmediateBg, description: 'Life-threatening, treatable' },
  { value: 'delayed', label: 'Delayed', emoji: '🟡', color: Colors.triageDelayed, bgColor: Colors.triageDelayedBg, description: 'Serious but can wait' },
  { value: 'minor', label: 'Minor', emoji: '🟢', color: Colors.triageMinor, bgColor: Colors.triageMinorBg, description: 'Walking wounded' },
  { value: 'expectant', label: 'Expectant', emoji: '⚫', color: Colors.triageExpectant, bgColor: Colors.triageExpectantBg, description: 'Unlikely to survive' },
] as const;

// ── Assessment Wizard Steps ────────────────────────────────
export const WIZARD_STEPS = [
  { key: 'scene-size-up', label: 'Scene Size-Up', shortLabel: 'Scene', number: 1 },
  { key: 'avpu', label: 'AVPU', shortLabel: 'AVPU', number: 2 },
  { key: 'abcde', label: 'ABCDE', shortLabel: 'ABCDE', number: 3 },
  { key: 'physical-exam', label: 'Physical Exam', shortLabel: 'Exam', number: 4 },
  { key: 'sample', label: 'SAMPLE History', shortLabel: 'SAMPLE', number: 5 },
  { key: 'opqrst', label: 'OPQRST', shortLabel: 'OPQRST', number: 6 },
  { key: 'stop-eats', label: 'STOP EATS', shortLabel: 'STOP', number: 7, conditional: true },
  { key: 'vitals', label: 'Vitals', shortLabel: 'Vitals', number: 8 },
  { key: 'soap-summary', label: 'SOAP Summary', shortLabel: 'SOAP', number: 9 },
] as const;
