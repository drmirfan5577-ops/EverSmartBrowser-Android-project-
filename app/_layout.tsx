import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { BrowserProvider } from '@/contexts/BrowserContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AdminProvider>
          <BrowserProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="about" options={{ headerShown: false }} />
              <Stack.Screen name="admin" options={{ headerShown: false }} />
            </Stack>
          </BrowserProvider>
        </AdminProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
