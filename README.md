# 🩺 QuickSOAP

**QuickSOAP** is a mobile application designed for Wilderness First Responders (WFR) and emergency medical personnel. It provides a guided, intuitive interface for completing patient assessments and generating SOAP (Subjective, Objective, Assessment, Plan) notes in austere environments.

## Features

- **Guided Assessment Workflows:** Step-by-step guidance through standard WFR protocols (Scene Size-Up, BSI, AVPU, ABCDE, Physical Exam, SAMPLE, OPQRST, STOP EATS, Vitals).
- **Multi-Patient Support (MCI):** Easily handle multiple patients during mass casualty incidents, including an integrated START Triage tool.
- **Incident Timer:** Built-in stopwatch to track the duration of the incident and log timestamps for critical interventions.
- **Offline First:** Fully functional without an internet connection, storing data locally using SQLite.

## Architecture

QuickSOAP is built with a modern React Native stack, optimized for reliability and offline use:
- **Framework:** [Expo](https://expo.dev/) (React Native) with [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation.
- **Database:** Local offline storage using `expo-sqlite` and [Drizzle ORM](https://orm.drizzle.team/) for type-safe database interactions.
- **State Management:** React Context (`assessmentContext`) for managing complex, multi-step assessment data and incident state.
- **Styling:** Custom UI components utilizing strict design tokens (colors, typography, spacing) defined in the `src/constants` directory.

## Get Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npx expo start
   ```

3. **Run on a device or emulator:**
   In the Expo CLI output, press `a` to open in an Android Emulator, `i` to open in an iOS Simulator, or scan the QR code with the Expo Go app on your physical device.

## Testing

QuickSOAP uses **Maestro** for end-to-end (E2E) testing. Maestro allows us to write simple, readable YAML files to simulate user journeys.

### Running Maestro Tests Locally

1. Install Maestro CLI:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```
2. Start your emulator or simulator and ensure the QuickSOAP app is built and running (`npx expo start`).
3. Run the test flows:
   ```bash
   maestro test .maestro/
   ```
