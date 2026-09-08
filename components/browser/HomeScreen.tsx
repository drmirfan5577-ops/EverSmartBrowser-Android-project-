import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
  Animated, Easing, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';
import { useAdmin } from '@/hooks/useAdmin';
import { APP_NAME, DEVELOPER, BRAND } from '@/constants/config';

const W = Dimensions.get('window').width;

// ── Digital Clock ─────────────────────────────────────────────────────────────
function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1,   duration: 500, useNativeDriver: true }),
      ])
    ).start();
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const h = pad(time.getHours()), m = pad(time.getMinutes()), s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <View style={clockSt.container}>
      <View style={clockSt.timeRow}>
        <Text style={clockSt.digit}>{h}</Text>
        <Animated.Text style={[clockSt.colon, { opacity: blink }]}>:</Animated.Text>
        <Text style={clockSt.digit}>{m}</Text>
        <Animated.Text style={[clockSt.colon, { opacity: blink }]}>:</Animated.Text>
        <Text style={clockSt.seconds}>{s}</Text>
      </View>
      <Text style={clockSt.date}>{dateStr}</Text>
    </View>
  );
}

// ── Sphere Logo ───────────────────────────────────────────────────────────────
function SphereLogo({ size = 58, primaryColor = Colors.crimson, accentColor = '#FFFFFF', text = 'ESB', rotating = true }: {
  size?: number; primaryColor?: string; accentColor?: string; text?: string; rotating?: boolean;
}) {
  const spin  = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (rotating) {
      Animated.loop(
        Animated.timing(spin, { toValue: 1, duration: 4500, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [rotating]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <View style={[
        logoSt.sphere,
        {
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: primaryColor + '20',
          borderColor: primaryColor + '70',
          shadowColor: primaryColor,
          shadowOpacity: 0.45, shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        }
      ]}>
        {rotating ? (
          <Animated.View style={[
            logoSt.ring,
            { width: size * 0.84, height: size * 0.84, borderRadius: size, transform: [{ rotate }], borderColor: primaryColor + '30' }
          ]} />
        ) : null}
        <View style={[logoSt.ring2, { width: size * 0.65, height: size * 0.65, borderRadius: size, borderColor: primaryColor + '35' }]} />
        <View style={logoSt.sphereCenter}>
          <Text style={[logoSt.sphereText, { fontSize: size * 0.22, color: primaryColor }]}>{text}</Text>
          <Text style={[logoSt.sphereStar, { fontSize: size * 0.14, color: primaryColor + 'AA' }]}>★</Text>
        </View>
        <View style={[logoSt.gloss, { width: size * 0.42, height: size * 0.22, top: size * 0.08, left: size * 0.1, borderRadius: size * 0.15 }]} />
      </View>
    </Animated.View>
  );
}

// ── Hub Modal ─────────────────────────────────────────────────────────────────
type HubItem2 = { id: string; name: string; url: string; icon: string; color: string; enabled: boolean; label?: string };

function HubModal({ visible, title, items, onClose, onNavigate }: {
  visible: boolean; title: string; items: HubItem2[];
  onClose: () => void; onNavigate: (url: string) => void;
}) {
  const enabled = items.filter(it => it.enabled);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={hubSt.overlay}>
        <Pressable style={hubSt.backdrop} onPress={onClose} />
        <View style={hubSt.sheet}>
          <View style={hubSt.sheetHeader}>
            <Text style={hubSt.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.textMuted} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={hubSt.grid} showsVerticalScrollIndicator={false}>
            {enabled.map(item => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [hubSt.hubTile, { borderColor: item.color + '55', opacity: pressed ? 0.72 : 1 }]}
                onPress={() => { onNavigate(item.url); onClose(); }}
              >
                <View style={[hubSt.tileIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[hubSt.tileName, { color: item.color }]} numberOfLines={2}>
                  {item.label || item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Custom Slot Edit Modal ────────────────────────────────────────────────────
function AddAppModal({ visible, slotId, onClose }: { visible: boolean; slotId: string; onClose: () => void }) {
  const { customSlots, updateCustomSlot } = useAdmin();
  const slot = customSlots.find(s => s.id === slotId);
  const [name, setName] = useState(slot?.name || '');
  const [url,  setUrl]  = useState(slot?.url  || '');

  useEffect(() => {
    if (slot) { setName(slot.name); setUrl(slot.url); }
  }, [slotId, visible]);

  const save = () => {
    let finalUrl = url.trim();
    if (finalUrl && !finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    updateCustomSlot(slotId, {
      name: name.trim(),
      url: finalUrl,
      icon: finalUrl ? 'globe' : 'add-circle-outline',
      color: finalUrl ? Colors.emerald : '#6A9080',
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={addSt.overlay}>
        <View style={addSt.box}>
          <Ionicons name="add-circle" size={32} color={Colors.emerald} />
          <Text style={addSt.title}>Add Custom App</Text>
          <TextInput
            style={addSt.input} placeholder="App Name"
            placeholderTextColor={Colors.textMuted}
            value={name} onChangeText={setName}
          />
          <TextInput
            style={addSt.input} placeholder="URL (e.g. google.com)"
            placeholderTextColor={Colors.textMuted}
            value={url} onChangeText={setUrl}
            autoCapitalize="none" keyboardType="url"
          />
          <View style={addSt.btnRow}>
            <Pressable style={[addSt.btn, { backgroundColor: Colors.emerald }]} onPress={save}>
              <Text style={addSt.btnText}>Save</Text>
            </Pressable>
            <Pressable style={[addSt.btn, { backgroundColor: '#F0F5F2', borderWidth: 1, borderColor: Colors.cardBorder }]} onPress={onClose}>
              <Text style={[addSt.btnText, { color: Colors.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Main HomeScreen ───────────────────────────────────────────────────────────
const MAIN_HUBS_CONFIG = [
  { id: 'mh1', name: 'Islamic Hub',    hubKey: 'islamic', icon: 'moon',      color: '#007A3D' },
  { id: 'mh2', name: 'News Hub',       hubKey: 'news',    icon: 'newspaper', color: Colors.crimson },
  { id: 'mh3', name: 'A.I Hub',        hubKey: 'ai',      icon: 'sparkles',  color: '#1A5FCC' },
  { id: 'mh4', name: 'Social Media',   hubKey: 'social',  icon: 'share',     color: '#AA1A5A' },
  { id: 'mh5', name: 'General Hub',    hubKey: 'general', icon: 'grid',      color: Colors.gold },
];

const ROW2_APPS = [
  { id: 'r2_1', name: 'SMART News', url: 'https://news.google.com',  icon: 'newspaper',    color: Colors.emerald },
  { id: 'r2_2', name: 'YouTube',    url: 'https://youtube.com',       icon: 'logo-youtube', color: '#CC0000' },
  { id: 'r2_3', name: 'WhatsApp',   url: 'https://web.whatsapp.com',  icon: 'logo-whatsapp',color: '#1A8A44' },
  { id: 'r2_4', name: 'Facebook',   url: 'https://facebook.com',      icon: 'logo-facebook',color: '#0A5DB8' },
  { id: 'r2_5', name: 'Play Store', url: 'https://play.google.com',   icon: 'storefront',   color: '#007A44' },
];

type Props = { onNavigate: (url: string) => void };

export function HomeScreen({ onNavigate }: Props) {
  const { vpnEnabled, adBlockEnabled } = useBrowser();
  const {
    islamicHubItems, newsHubItems, aiHubItems, socialHubItems, generalHubItems,
    customSlots, logoConfig, activeTheme,
  } = useAdmin();

  const [openHub,    setOpenHub]    = useState<string | null>(null);
  const [addingSlot, setAddingSlot] = useState<string | null>(null);

  const getHubItems = (key: string): HubItem2[] => {
    const map: Record<string, HubItem2[]> = {
      islamic: islamicHubItems,
      news:    newsHubItems,
      ai:      aiHubItems,
      social:  socialHubItems,
      general: generalHubItems,
    };
    return map[key] || [];
  };

  const row3 = customSlots.filter(s => s.row === 3);
  const row4 = customSlots.filter(s => s.row === 4);

  return (
    <>
      <ScrollView
        style={[st.scroll, { backgroundColor: activeTheme.bg }]}
        contentContainerStyle={st.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Row ── */}
        <View style={[st.headerRow, { backgroundColor: activeTheme.surface }]}>
          {/* Left: Sphere Logo */}
          <View style={st.logoWrap}>
            <SphereLogo
              size={logoConfig.size}
              primaryColor={logoConfig.primaryColor}
              accentColor={logoConfig.accentColor}
              text={logoConfig.text}
              rotating={logoConfig.rotating}
            />
          </View>

          {/* Center: Title */}
          <View style={st.titleBlock}>
            <Text style={[st.mainTitle, { color: activeTheme.primary }]}>{APP_NAME}</Text>
            <Text style={st.devName}>{DEVELOPER}</Text>
            <Text style={st.tagline}>The One Man Army</Text>
            <View style={st.pillRow}>
              <View style={[st.pill, {
                backgroundColor: vpnEnabled ? Colors.emeraldDeep : '#F0F0F0',
                borderColor: vpnEnabled ? Colors.emerald + '66' : Colors.cardBorder,
              }]}>
                <Ionicons name="shield-checkmark" size={9} color={vpnEnabled ? Colors.emerald : Colors.textMuted} />
                <Text style={[st.pillText, { color: vpnEnabled ? Colors.emerald : Colors.textMuted }]}>
                  VPN {vpnEnabled ? 'ON' : 'OFF'}
                </Text>
              </View>
              <View style={[st.pill, {
                backgroundColor: adBlockEnabled ? '#FFE0EA' : '#F0F0F0',
                borderColor: adBlockEnabled ? Colors.crimson + '55' : Colors.cardBorder,
              }]}>
                <Ionicons name="ban" size={9} color={adBlockEnabled ? Colors.crimson : Colors.textMuted} />
                <Text style={[st.pillText, { color: adBlockEnabled ? Colors.crimson : Colors.textMuted }]}>
                  ADS {adBlockEnabled ? 'BLOCKED' : 'ON'}
                </Text>
              </View>
            </View>
          </View>

          {/* Right: Clock */}
          <View style={st.clockWrap}>
            <DigitalClock />
          </View>
        </View>

        {/* ── Row 1: 5 Main Hub Icons ── */}
        <Text style={[st.sectionLabel, { color: activeTheme.primary }]}>🌐 App Hubs</Text>
        <View style={st.iconRow}>
          {MAIN_HUBS_CONFIG.map(hub => (
            <Pressable
              key={hub.id}
              style={({ pressed }) => [st.iconTile, { borderColor: hub.color + '55', opacity: pressed ? 0.78 : 1, backgroundColor: Colors.surface }]}
              onPress={() => setOpenHub(hub.hubKey)}
            >
              <View style={[st.iconBg, { backgroundColor: hub.color + '18' }]}>
                <Ionicons name={hub.icon as any} size={24} color={hub.color} />
              </View>
              <Text style={[st.iconLabel, { color: hub.color }]} numberOfLines={2}>{hub.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Row 2: Quick Access ── */}
        <Text style={[st.sectionLabel, { color: activeTheme.primary }]}>📱 Quick Access</Text>
        <View style={st.iconRow}>
          {ROW2_APPS.map(app => (
            <Pressable
              key={app.id}
              style={({ pressed }) => [st.iconTile, { borderColor: app.color + '55', opacity: pressed ? 0.78 : 1, backgroundColor: Colors.surface }]}
              onPress={() => onNavigate(app.url)}
            >
              <View style={[st.iconBg, { backgroundColor: app.color + '18' }]}>
                <Ionicons name={app.icon as any} size={24} color={app.color} />
              </View>
              <Text style={[st.iconLabel, { color: app.color }]} numberOfLines={1}>{app.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Row 3: Custom Slots ── */}
        <Text style={[st.sectionLabel, { color: activeTheme.primary }]}>➕ My Apps — Row 1</Text>
        <View style={st.iconRow}>
          {row3.map((slot, i) => (
            <Pressable
              key={slot.id}
              style={({ pressed }) => [
                st.iconTile, st.blankTile,
                { opacity: pressed ? 0.73 : 1, borderColor: slot.url ? slot.color + '66' : Colors.cardBorder, backgroundColor: Colors.surface },
              ]}
              onPress={() => slot.url ? onNavigate(slot.url) : setAddingSlot(slot.id)}
              onLongPress={() => setAddingSlot(slot.id)}
            >
              <View style={[st.iconBg, { backgroundColor: slot.url ? slot.color + '15' : '#F5F5F5' }]}>
                <Ionicons name={slot.url ? 'globe' : 'add-circle-outline'} size={24} color={slot.url ? slot.color : Colors.textMuted} />
              </View>
              <Text style={[st.blankLabel, slot.url && { color: slot.color }]} numberOfLines={1}>
                {slot.name || `Slot ${i + 1}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Row 4: Custom Slots ── */}
        <Text style={[st.sectionLabel, { color: activeTheme.primary }]}>➕ My Apps — Row 2</Text>
        <View style={st.iconRow}>
          {row4.map((slot, i) => (
            <Pressable
              key={slot.id}
              style={({ pressed }) => [
                st.iconTile, st.blankTile,
                { opacity: pressed ? 0.73 : 1, borderColor: slot.url ? slot.color + '66' : Colors.cardBorder, backgroundColor: Colors.surface },
              ]}
              onPress={() => slot.url ? onNavigate(slot.url) : setAddingSlot(slot.id)}
              onLongPress={() => setAddingSlot(slot.id)}
            >
              <View style={[st.iconBg, { backgroundColor: slot.url ? slot.color + '15' : '#F5F5F5' }]}>
                <Ionicons name={slot.url ? 'globe' : 'add-circle-outline'} size={24} color={slot.url ? slot.color : Colors.textMuted} />
              </View>
              <Text style={[st.blankLabel, slot.url && { color: slot.color }]} numberOfLines={1}>
                {slot.name || `Slot ${i + 6}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View style={st.footer}>
          <Text style={st.footerText}>© 2025 {BRAND} · All Rights Reserved</Text>
          <Text style={st.footerSub}>{DEVELOPER} · The One Man Army</Text>
        </View>
      </ScrollView>

      {/* Hub modals */}
      {MAIN_HUBS_CONFIG.map(hub => (
        <HubModal
          key={hub.hubKey}
          visible={openHub === hub.hubKey}
          title={hub.name}
          items={getHubItems(hub.hubKey)}
          onClose={() => setOpenHub(null)}
          onNavigate={onNavigate}
        />
      ))}

      {/* Add App modal */}
      {addingSlot ? (
        <AddAppModal visible={true} slotId={addingSlot} onClose={() => setAddingSlot(null)} />
      ) : null}
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const TILE_W = (W - Spacing.md * 2 - 4 * 6) / 5;

const st = StyleSheet.create({
  scroll:  { flex: 1 },
  content: { paddingBottom: 32 },

  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder,
    gap: 8,
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10, shadowRadius: 8, elevation: 3,
  },
  logoWrap:  { alignItems: 'center', width: 68 },
  titleBlock:{ flex: 1, gap: 3 },
  mainTitle: {
    fontSize: 13, fontWeight: '900', letterSpacing: 0.8,
    textShadowRadius: 4, textShadowOffset: { width: 0, height: 0 },
  },
  devName:   { fontSize: 8,   color: Colors.gold,     fontWeight: '700' },
  tagline:   { fontSize: 7.5, color: Colors.textMuted, fontStyle: 'italic' },
  pillRow:   { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginTop: 2 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 2.5,
    borderRadius: 999, borderWidth: 1,
  },
  pillText:  { fontSize: 8, fontWeight: '700' },
  clockWrap: { alignItems: 'flex-end', width: 82 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700',
    paddingHorizontal: Spacing.md, marginTop: 10, marginBottom: 5,
    letterSpacing: 0.3,
  },
  iconRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 6 },
  iconTile: {
    width: TILE_W, alignItems: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 8, gap: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  iconBg: {
    width: 42, height: 42, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  iconLabel: { fontSize: 8.5, fontWeight: '700', textAlign: 'center' },
  blankTile: { borderStyle: 'dashed' },
  blankLabel:{ fontSize: 8, color: Colors.textMuted, textAlign: 'center' },

  footer:    { marginTop: 20, alignItems: 'center', gap: 3 },
  footerText:{ fontSize: 9,   color: Colors.textMuted, fontWeight: '600' },
  footerSub: { fontSize: 8.5, color: Colors.textMuted },
});

const clockSt = StyleSheet.create({
  container: { alignItems: 'flex-end', gap: 1 },
  timeRow:   { flexDirection: 'row', alignItems: 'baseline' },
  digit: {
    fontSize: 16, fontWeight: '900', color: Colors.emerald,
    textShadowColor: 'rgba(0,180,120,0.4)', textShadowRadius: 5, textShadowOffset: { width: 0, height: 0 },
  },
  colon:   { fontSize: 16, fontWeight: '900', color: Colors.emerald, marginHorizontal: 1 },
  seconds: { fontSize: 11, fontWeight: '700', color: Colors.emeraldDim,
    textShadowColor: 'rgba(0,150,100,0.3)', textShadowRadius: 3, textShadowOffset: { width: 0, height: 0 },
  },
  date: { fontSize: 8, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
});

const logoSt = StyleSheet.create({
  sphere: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, overflow: 'hidden',
  },
  ring:         { position: 'absolute', borderWidth: 1.5, borderStyle: 'dashed' },
  ring2:        { position: 'absolute', borderWidth: 1 },
  sphereCenter: { alignItems: 'center', zIndex: 2 },
  sphereText: {
    fontWeight: '900', letterSpacing: 0.5,
    textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 },
  },
  sphereStar: { textShadowRadius: 6, textShadowOffset: { width: 0, height: 0 } },
  gloss: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.28)', zIndex: 1 },
});

const hubSt = StyleSheet.create({
  overlay:  { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.50)' },
  sheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: Colors.emerald + '44',
    maxHeight: '78%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 16,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  sheetTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: 10 },
  hubTile: {
    width: (W - Spacing.md * 2 - 30) / 4,
    alignItems: 'center', backgroundColor: '#F8FFF8',
    borderRadius: Radius.md, borderWidth: 1.5, padding: 10, gap: 6,
  },
  tileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tileName: { fontSize: 8.5, fontWeight: '700', textAlign: 'center' },
});

const addSt = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  box: {
    width: '88%', backgroundColor: '#FFFFFF', borderRadius: Radius.xl,
    padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1.5, borderColor: Colors.emerald + '55',
    alignItems: 'center',
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20, shadowRadius: 20, elevation: 12,
  },
  title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.emerald, marginBottom: 4 },
  input: {
    width: '100%', borderWidth: 1.5, borderColor: Colors.cardBorder,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10,
    color: Colors.textPrimary, fontSize: FontSize.base, backgroundColor: '#F5FFF8',
  },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4, width: '100%' },
  btn:    { flex: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  btnText:{ fontSize: FontSize.base, fontWeight: '800', color: '#FFFFFF' },
});
