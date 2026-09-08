import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';
import { useBrowser } from '@/hooks/useBrowser';

type HubConfig = {
  key: string; label: string; emoji: string; color: string;
};

const HUB_CONFIGS: HubConfig[] = [
  { key: 'islamic', label: 'Islamic Hub',      emoji: '☪️',  color: '#00AA55' },
  { key: 'news',    label: 'News Channels Hub', emoji: '📡',  color: Colors.crimson },
  { key: 'ai',      label: 'A.I Models Hub',    emoji: '🤖',  color: '#4285F4' },
  { key: 'social',  label: 'Social Media Hub',  emoji: '📱',  color: '#E1306C' },
  { key: 'general', label: 'General Hub',        emoji: '🌐',  color: Colors.gold },
  { key: 'smart',   label: 'SMART Series Hub',   emoji: '⚡',  color: Colors.emerald },
  { key: 'edu',     label: 'Educational Hub',    emoji: '📚',  color: '#14BF96' },
];

export default function HubsScreen() {
  const insets = useSafeAreaInsets();
  const { islamicHubItems, newsHubItems, aiHubItems, socialHubItems, generalHubItems, smartSeriesItems, eduHubItems } = useAdmin();
  const [openHub, setOpenHub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // We need navigate — open URLs via useBrowser's setCurrentUrl
  const { setCurrentUrl } = useBrowser();
  const navigate = (url: string) => setCurrentUrl(url);

  const getItems = (key: string) => {
    const map: Record<string, any[]> = {
      islamic: islamicHubItems, news: newsHubItems, ai: aiHubItems,
      social: socialHubItems, general: generalHubItems, smart: smartSeriesItems, edu: eduHubItems,
    };
    const items = map[key] || [];
    if (!searchQuery) return items;
    return items.filter((it: any) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const getHubConfig = (key: string) => HUB_CONFIGS.find(h => h.key === key)!;
  const currentHub = openHub ? getHubConfig(openHub) : null;
  const currentItems = openHub ? getItems(openHub) : [];

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <TopBar />
      <View style={st.header}>
        <Ionicons name="grid" size={20} color={Colors.emerald} />
        <Text style={st.headerTitle}>App Hubs</Text>
        <Text style={st.headerSub}>Tap any hub to explore</Text>
      </View>

      {!openHub ? (
        <ScrollView contentContainerStyle={st.hubGrid} showsVerticalScrollIndicator={false}>
          {HUB_CONFIGS.map(hub => {
            const items = getItems(hub.key);
            const enabled = items.filter((it: any) => it.enabled).length;
            return (
              <Pressable
                key={hub.key}
                style={({ pressed }) => [st.hubCard, { borderColor: hub.color + '55', opacity: pressed ? 0.8 : 1 }]}
                onPress={() => { setOpenHub(hub.key); setSearchQuery(''); }}
              >
                <View style={[st.hubCardIcon, { backgroundColor: hub.color + '18' }]}>
                  <Text style={st.hubEmoji}>{hub.emoji}</Text>
                </View>
                <Text style={[st.hubCardLabel, { color: hub.color }]}>{hub.label}</Text>
                <Text style={st.hubCardCount}>{enabled}/{items.length} active</Text>
                <View style={[st.hubCardBadge, { backgroundColor: hub.color + '20', borderColor: hub.color + '44' }]}>
                  <Text style={[st.hubCardBadgeText, { color: hub.color }]}>Open Hub →</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Sub-header */}
          <View style={[st.subHeader, { borderColor: currentHub!.color + '44' }]}>
            <Pressable onPress={() => setOpenHub(null)} hitSlop={10}>
              <Ionicons name="arrow-back" size={20} color={currentHub!.color} />
            </Pressable>
            <Text style={[st.subTitle, { color: currentHub!.color }]}>
              {currentHub!.emoji} {currentHub!.label}
            </Text>
            <Text style={st.subCount}>{currentItems.filter((it: any) => it.enabled).length} active</Text>
          </View>
          {/* Search */}
          <View style={st.searchRow}>
            <Ionicons name="search" size={15} color={Colors.textMuted} />
            <TextInput
              style={st.searchInput}
              placeholder={`Search ${currentHub!.label}...`}
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? <Pressable onPress={() => setSearchQuery('')}><Ionicons name="close" size={15} color={Colors.textMuted} /></Pressable> : null}
          </View>
          {/* Items grid */}
          <ScrollView contentContainerStyle={st.itemsGrid} showsVerticalScrollIndicator={false}>
            {currentItems.filter((it: any) => it.enabled).map((item: any) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [st.appTile, { borderColor: item.color + '44', opacity: pressed ? 0.7 : 1 }]}
                onPress={() => navigate(item.url)}
              >
                <View style={[st.appTileIcon, { backgroundColor: item.color + '1A' }]}>
                  <Ionicons name={item.icon as any} size={26} color={item.color} />
                </View>
                <Text style={[st.appTileName, { color: item.color }]} numberOfLines={2}>
                  {item.label || item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      <BottomStrips />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(0,229,160,0.12)', backgroundColor: Colors.surface },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  headerSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  hubGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: 12, justifyContent: 'space-between', paddingBottom: 30 },
  hubCard: {
    width: '47%', backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.md, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  hubCardIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  hubEmoji: { fontSize: 28 },
  hubCardLabel: { fontSize: FontSize.sm, fontWeight: '800', textAlign: 'center' },
  hubCardCount: { fontSize: 9, color: Colors.textMuted },
  hubCardBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  hubCardBadgeText: { fontSize: 9, fontWeight: '700' },
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1 },
  subTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800' },
  subCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.md, paddingVertical: 8, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.sm },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: 10, paddingBottom: 30 },
  appTile: {
    width: '18%', alignItems: 'center', backgroundColor: Colors.card,
    borderRadius: Radius.md, borderWidth: 1, paddingVertical: 10, gap: 6,
    minWidth: 58,
  },
  appTileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  appTileName: { fontSize: 8, fontWeight: '700', textAlign: 'center' },
});
