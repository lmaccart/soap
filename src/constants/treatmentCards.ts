/**
 * QuickSOAP — Treatment reference card data
 * Step-by-step procedure guides for field treatment.
 */

export interface TreatmentStep {
  text: string;
  important?: boolean;
}

export interface TreatmentCard {
  id: string;
  title: string;
  icon: string;
  indication: string;
  contraindications?: string[];
  steps: TreatmentStep[];
  reminders: string[];
  media?: string[];
}

export const TREATMENT_CARDS: TreatmentCard[] = [
  {
    id: 'traction-splint',
    title: 'Traction Splint',
    icon: '🦴',
    indication: 'Isolated mid-shaft femur fracture',
    contraindications: [
      'Proximal femur (hip) fracture',
      'Distal femur (near knee) fracture',
      'Pelvic injury',
      'Knee or lower leg injury on same limb',
    ],
    steps: [
      { text: 'Apply manual inline traction immediately to stabilize', important: true },
      { text: 'Check distal CSMs (pedal pulse, sensation, toe wiggle)' },
      { text: 'Apply ankle hitch securely' },
      { text: 'Apply commercial device (Sager, KTD) or improvise with long pole/branch' },
      { text: 'Apply gentle traction — 10–15% of body weight, or until limb length matches uninjured leg and patient reports pain relief', important: true },
      { text: 'Secure splint to leg with straps/cravats' },
      { text: 'Recheck distal CSMs immediately after application', important: true },
      { text: 'Monitor continuously — recheck CSMs every 15–30 minutes' },
    ],
    reminders: [
      'May be used with open femur fractures after wound irrigation',
      'Prevents bone ends from retracting and reduces hemorrhage',
      'Never release traction once applied',
      'Check CSMs BEFORE and AFTER, then every 15–30 min',
    ],
  },
  {
    id: 'sam-splint',
    title: 'SAM Splint',
    icon: '🩹',
    indication: 'Suspected fractures of wrist, forearm, ankle, or fingers',
    steps: [
      { text: 'Check distal CSMs before splinting' },
      { text: 'Create structural bend (C-curve, reverse C-curve, or T-bend) to increase rigidity BEFORE applying', important: true },
      { text: 'Mold to appropriate shape for the injury' },
      { text: 'Pad between splint and skin — fill all voids' },
      { text: 'Immobilize the joint ABOVE and BELOW the fracture', important: true },
      { text: 'Secure with elastic wraps, tape, cravats, or cloth strips' },
      { text: 'Snug but NOT tight enough to compromise circulation' },
      { text: 'Recheck distal CSMs after application', important: true },
      { text: 'Recheck CSMs every 15–30 minutes' },
    ],
    reminders: [
      'Flat SAM splint has NO structural strength — always bend first',
      'Splint in position found unless no distal CSMs',
      'If no CSMs, gently realign with traction-in-line before splinting',
      'Common uses: wrist, forearm, ankle, finger splints',
    ],
  },
  {
    id: 'sling-swathe',
    title: 'Sling & Swathe',
    icon: '🤕',
    indication: 'Shoulder dislocation, clavicle fracture, humerus fracture, upper arm/shoulder injuries',
    steps: [
      { text: 'Check distal CSMs (radial pulse, hand sensation, finger wiggle)' },
      { text: 'Apply triangular bandage as SLING — support forearm weight' },
      { text: 'Position hand slightly HIGHER than elbow', important: true },
      { text: 'Tie sling behind neck — pad the knot' },
      { text: 'Apply SWATHE — wide bandage wrapped around torso + injured arm' },
      { text: 'Swathe prevents arm from swinging away from body' },
      { text: 'Do NOT place swathe directly over fracture site', important: true },
      { text: 'Recheck distal CSMs after application', important: true },
    ],
    reminders: [
      'Uses the torso as a natural stabilizer',
      'Ensure comfort but adequate immobilization',
      'Check that fingers remain visible for CSM monitoring',
      'Patient may be more comfortable with slight elevation of hand',
    ],
  },
  {
    id: 'chest-seal',
    title: 'Chest Seal',
    icon: '🫁',
    indication: 'Penetrating chest trauma (between chin and belly button) with respiratory distress',
    steps: [
      { text: 'Immediately seal wound with gloved hand', important: true },
      { text: 'Recognize signs: labored breathing, sucking/bubbling sounds, bulging neck veins, tracheal deviation' },
      { text: 'Apply occlusive dressing: commercial chest seal (preferred)' },
      { text: 'If improvising: use plastic wrap, foil, or petroleum gauze' },
      { text: 'THREE-SIDED SEAL (improvised): tape on THREE sides, leave one side open as one-way valve', important: true },
      { text: 'Commercial vented seals have built-in one-way valves' },
      { text: 'Monitor continuously for tension pneumothorax' },
      { text: 'If respiratory status WORSENS: "burp" the seal — briefly lift to release trapped air, then reseal', important: true },
      { text: 'Rapid evacuation required', important: true },
    ],
    reminders: [
      'Air IN = bad. Air OUT = good. The seal acts as a one-way valve.',
      'Check for EXIT wound on the back — seal both entry and exit',
      'Signs of tension pneumothorax: worsening distress, absent breath sounds on one side, JVD, tracheal deviation',
      'This is a rapid evacuation situation',
    ],
  },
  {
    id: 'burns',
    title: 'Burns Treatment',
    icon: '🔥',
    indication: 'Thermal, chemical, or electrical burns',
    steps: [
      { text: 'Scene safety — remove patient from heat source. Protect yourself.', important: true },
      { text: 'Assess AIRWAY: singed nasal hairs, soot in mouth/nose, hoarse voice, facial burns, stridor', important: true },
      { text: 'Cool burn with clean, COOL (not cold/ice) water for up to 20 minutes' },
      { text: 'Avoid prolonged cooling — hypothermia risk' },
      { text: 'Remove jewelry and constricting clothing BEFORE swelling' },
      { text: 'Do NOT remove clothing stuck to burn', important: true },
      { text: 'Leave blisters intact' },
      { text: 'Cover with clean, dry, sterile dressing' },
      { text: 'Use moist dressing for small burns; dry dressing for large burns' },
      { text: 'Do NOT apply butter, oils, toothpaste, or home remedies', important: true },
    ],
    reminders: [
      'Inhalation burns are life-threatening — monitor airway closely',
      'Evacuate for: full-thickness (3rd degree), face/hands/feet/genitals/joints, >10% TBSA, circumferential, inhalation injury, electrical/chemical',
      'Rule of 9s for TBSA: each arm 9%, each leg 18%, chest 18%, back 18%, head 9%, groin 1%',
      'Keep patient warm — burned skin loses thermoregulation',
    ],
  },
];
