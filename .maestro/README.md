# End-to-End Tests with Maestro

This folder contains the End-to-End (E2E) testing flows for **QuickSOAP**, powered by [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1.  Ensure you have Maestro CLI installed. If not, run:
    ```bash
    curl -Ls "https://get.maestro.mobile.dev" | bash
    ```
2.  Have an Android Emulator or iOS Simulator running.
3.  Have the app built and running on the emulator/simulator via Expo:
    ```bash
    npx expo start
    ```
    *(Press `a` for Android or `i` for iOS to install and launch the Expo development client/app on the emulator)*

## Running the Tests

To run the full suite of tests locally:

```bash
maestro test .maestro/
```

To run a specific test flow, such as the MCI assessment flow:

```bash
maestro test .maestro/mci_assessment.yaml
```

## Available Flows

*   `mci_assessment.yaml`: Tests the core user journey of starting a new incident, declaring a Mass Casualty Incident (MCI) with 2 patients (one with suspected ICP, one unconscious diabetic), performing triage, and progressing through the entire assessment wizard (AVPU, ABCDE, Physical Exam, SAMPLE, OPQRST, STOP EATS, Vitals) up to the SOAP summary.
