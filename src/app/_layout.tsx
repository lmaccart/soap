import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AssessmentProvider } from '@/store/assessmentContext';
import { DatabaseProvider } from '@/db/database';
import { Colors } from '@/constants/colors';

/**
 * Root layout — wraps the app in providers and configures the navigation stack.
 */
export default function RootLayout() {
  return (
    <DatabaseProvider>
      <AssessmentProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="assessment"
            options={{ headerShown: false, presentation: 'fullScreenModal' }}
          />
          <Stack.Screen
            name="reference/[id]"
            options={{ headerShown: true, presentation: 'card' }}
          />
        </Stack>
      </AssessmentProvider>
    </DatabaseProvider>
  );
}
