import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';

export function TabBar() {
  const { tabs, activeTabId, switchTab, closeTab, addTab } = useBrowser();

  const getTabLabel = (url: string) => {
    if (url === 'home') return 'New Tab';
    try {
      const u = new URL(url);
      return u.hostname.replace('www.', '');
    } catch {
      return url.slice(0, 12) + (url.length > 12 ? '…' : '');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => switchTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]} numberOfLines={1}>
                {getTabLabel(tab.url)}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() => closeTab(tab.id)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={12} color={isActive ? Colors.emerald : Colors.textMuted} />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable style={styles.newTabBtn} onPress={() => addTab()}>
        <Ionicons name="add" size={18} color={Colors.emerald} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,160,0.12)',
    height: 36,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    maxWidth: 120,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.emeraldDeep,
    borderColor: Colors.emerald,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '500',
    flexShrink: 1,
  },
  tabTextActive: {
    color: Colors.emerald,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 1,
  },
  newTabBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.06)',
  },
});
