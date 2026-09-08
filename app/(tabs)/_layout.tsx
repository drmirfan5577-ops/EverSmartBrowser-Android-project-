import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';
import { BottomStrips } from '@/components/browser/BottomStrips';

function TabBarWithStrips() {
  return null; // custom, handled inline
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({
      ios: insets.bottom + 58,
      android: insets.bottom + 58,
      default: 64,
    }),
    paddingTop: 6,
    paddingBottom: Platform.select({
      ios: insets.bottom + 6,
      android: insets.bottom + 6,
      default: 8,
    }),
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: Colors.cardBorder,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.emerald,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browser',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hubs"
        options={{
          title: 'Hubs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
