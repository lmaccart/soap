/**
 * QuickSOAP — Tab navigation layout
 */
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index: '🏠',
    history: '📋',
    reference: '📖',
  };
  return (
    <View style={[tabStyles.iconContainer, focused && tabStyles.iconFocused]}>
      <Text style={tabStyles.icon}>{icons[name] ?? '📄'}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textHint,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          paddingTop: 6,
          height: 88,
        },
        tabBarLabelStyle: { ...Typography.label, fontSize: 11 },
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { ...Typography.h2, color: Colors.textPrimary },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'QuickSOAP',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon name="history" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reference"
        options={{
          title: 'Reference',
          tabBarIcon: ({ focused }) => <TabIcon name="reference" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  iconFocused: { backgroundColor: Colors.primaryLight },
  icon: { fontSize: 20 },
});
