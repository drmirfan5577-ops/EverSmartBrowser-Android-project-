import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onMenu: () => void;
};

function NavBtn({
  icon, onPress, color, disabled, size = 22,
}: {
  icon: any; onPress: () => void; color?: string; disabled?: boolean; size?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.5 : disabled ? 0.3 : 1 }]}
    >
      <Ionicons name={icon} size={size} color={color || Colors.textPrimary} />
    </Pressable>
  );
}

export function NavigationControls({
  canGoBack, canGoForward, isLoading,
  onBack, onForward, onRefresh, onHome, onBookmark, onShare, onMenu,
}: Props) {
  return (
    <View style={styles.container}>
      <NavBtn icon="chevron-back" onPress={onBack} disabled={!canGoBack} />
      <NavBtn icon="chevron-forward" onPress={onForward} disabled={!canGoForward} />
      <NavBtn icon={isLoading ? 'close' : 'refresh'} onPress={onRefresh} color={isLoading ? Colors.crimson : Colors.textPrimary} />
      <NavBtn icon="home" onPress={onHome} color={Colors.gold} />
      <NavBtn icon="bookmark-outline" onPress={onBookmark} color={Colors.emerald} />
      <NavBtn icon="share-outline" onPress={onShare} />
      <NavBtn icon="ellipsis-vertical" onPress={onMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,229,160,0.1)',
    gap: 6,
    justifyContent: 'space-between',
  },
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
