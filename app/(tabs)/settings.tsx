import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Switch, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';
import { useAdmin } from '@/hooks/useAdmin';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';
import { APP_NAME, APP_VERSION, BRAND, DEVELOPER, EMAIL, THEME_PRESETS } from '@/constants/config';
import { useAlert } from '@/template';

function SettingRow({ icon, label, sub, color = Colors.emerald, onPress, toggle, value, onToggle }: {
  icon: string; label: string; sub?: string; color?: string;
  onPress?: () => void; toggle?: boolean; value?: boolean; onToggle?: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !toggle}
      style={({ pressed }) => [st.row, { opacity: pressed && onPress ? 0.7 : 1 }]}
    >
      <View style={[st.rowIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={17} color={color} />
      </View>
      <View style={st.rowContent}>
        <Text style={st.rowLabel}>{label}</Text>
        {sub ? <Text style={st.rowSub}>{sub}</Text> : null}
      </View>
      {toggle ? (
        <Switch value={value} onValueChange={onToggle} trackColor={{ false: Colors.textMuted, true: color }} thumbColor={value ? color : '#888'} />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={15} color={Colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

function AdminGate({ onUnlocked }: { onUnlocked: () => void }) {
  const { unlockAdmin, isAdminUnlocked } = useAdmin();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  if (isAdminUnlocked) return null;
  const attempt = () => {
    if (unlockAdmin(pw)) { setError(''); onUnlocked(); }
    else { setError('Incorrect password'); setPw(''); }
  };
  return (
    <View style={st.adminGate}>
      <Ionicons name="lock-closed" size={34} color={Colors.gold} />
      <Text style={st.adminGateTitle}>Admin Panel</Text>
      <Text style={st.adminGateSub}>Enter password to unlock all editing features</Text>
      <View style={st.adminInputRow}>
        <View style={{ flex: 1 }}>
          <Pressable style={[st.adminInput, { justifyContent: 'center' }]} onPress={() => {}}>
            <Text style={{ color: Colors.textMuted, textAlign: 'center', fontSize: FontSize.sm }}>Enter password above</Text>
          </Pressable>
        </View>
      </View>
      {error ? <Text style={st.adminError}>{error}</Text> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { vpnEnabled, toggleVpn, adBlockEnabled, toggleAdBlock, darkMode, toggleDarkMode, clearHistory } = useBrowser();
  const { isAdminUnlocked, lockAdmin, activeTheme, setActiveTheme } = useAdmin();
  const [notifications, setNotifications] = useState(true);
  const [safeSearch, setSafeSearch]       = useState(true);
  const [javascript, setJavascript]       = useState(true);
  const [dataComp, setDataComp]           = useState(false);
  const [autoplay, setAutoplay]           = useState(true);
  const [cookies, setCookies]             = useState(true);
  const [showTheme, setShowTheme]         = useState(false);

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <TopBar />
      <View style={st.header}>
        <Ionicons name="settings" size={20} color={Colors.emerald} />
        <Text style={st.headerTitle}>Settings</Text>
        <Text style={st.version}>v{APP_VERSION}</Text>
        <Pressable
          style={[st.adminBadge, isAdminUnlocked && { borderColor: Colors.gold, backgroundColor: Colors.gold + '15' }]}
          onPress={() => isAdminUnlocked ? lockAdmin() : router.push('/admin')}
        >
          <Ionicons name={isAdminUnlocked ? 'lock-open' : 'lock-closed'} size={12} color={isAdminUnlocked ? Colors.gold : Colors.textMuted} />
          <Text style={[st.adminBadgeText, isAdminUnlocked && { color: Colors.gold }]}>
            {isAdminUnlocked ? 'ADMIN' : 'LOCK'}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        {/* Privacy */}
        <Text style={st.sectionHeader}>🔒 Privacy & Security</Text>
        <View style={st.section}>
          <View style={[st.featureCard, { borderColor: vpnEnabled ? Colors.emerald + '66' : Colors.cardBorder }]}>
            <View style={[st.featureIcon, { backgroundColor: Colors.emeraldDeep }]}>
              <Ionicons name="shield-checkmark" size={26} color={Colors.emerald} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[st.featureTitle, { color: Colors.emerald }]}>EvEr SmArT VPN</Text>
              <Text style={st.featureSub}>Secured & Play Protected</Text>
              <View style={[st.badge, { backgroundColor: vpnEnabled ? Colors.emeraldDeep : Colors.surface, borderColor: vpnEnabled ? Colors.emerald : Colors.cardBorder }]}>
                <View style={[st.dot, { backgroundColor: vpnEnabled ? Colors.emerald : Colors.textMuted }]} />
                <Text style={[st.badgeText, { color: vpnEnabled ? Colors.emerald : Colors.textMuted }]}>{vpnEnabled ? 'CONNECTED' : 'DISCONNECTED'}</Text>
              </View>
            </View>
            <Switch value={vpnEnabled} onValueChange={toggleVpn} trackColor={{ false: Colors.textMuted, true: Colors.emerald }} thumbColor={vpnEnabled ? Colors.emerald : '#888'} />
          </View>

          <View style={[st.featureCard, { borderColor: adBlockEnabled ? Colors.crimson + '66' : Colors.cardBorder }]}>
            <View style={[st.featureIcon, { backgroundColor: Colors.crimsonDeep }]}>
              <Ionicons name="ban" size={26} color={Colors.crimson} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[st.featureTitle, { color: Colors.crimson }]}>SmArT AdS bLoCkEr</Text>
              <Text style={st.featureSub}>100% Block · Faster Browsing</Text>
              <View style={[st.badge, { backgroundColor: adBlockEnabled ? Colors.crimsonDeep : Colors.surface, borderColor: adBlockEnabled ? Colors.crimson : Colors.cardBorder }]}>
                <View style={[st.dot, { backgroundColor: adBlockEnabled ? Colors.crimson : Colors.textMuted }]} />
                <Text style={[st.badgeText, { color: adBlockEnabled ? Colors.crimson : Colors.textMuted }]}>{adBlockEnabled ? 'BLOCKING ALL ADS' : 'OFF'}</Text>
              </View>
            </View>
            <Switch value={adBlockEnabled} onValueChange={toggleAdBlock} trackColor={{ false: Colors.textMuted, true: Colors.crimson }} thumbColor={adBlockEnabled ? Colors.crimson : '#888'} />
          </View>

          <SettingRow icon="search" label="Safe Search" sub="Filter explicit content" color={Colors.gold} toggle value={safeSearch} onToggle={setSafeSearch} />
          <SettingRow icon="notifications" label="Notifications" toggle value={notifications} onToggle={setNotifications} />
        </View>

        {/* Browser */}
        <Text style={st.sectionHeader}>🌐 Browser</Text>
        <View style={st.section}>
          <SettingRow icon="moon" label="Dark Mode" toggle value={darkMode} onToggle={toggleDarkMode} />
          <SettingRow icon="color-palette" label="Background & Theme" sub={activeTheme.name} color={Colors.gold} onPress={() => setShowTheme(true)} />
          <SettingRow icon="code-slash" label="JavaScript" toggle value={javascript} onToggle={setJavascript} />
          <SettingRow icon="hardware-chip" label="Data Compression" toggle value={dataComp} onToggle={setDataComp} />
          <SettingRow icon="play" label="Autoplay Media" toggle value={autoplay} onToggle={setAutoplay} />
          <SettingRow icon="document" label="Cookies" toggle value={cookies} onToggle={setCookies} />
          <SettingRow icon="trash" label="Clear History" color={Colors.crimson}
            onPress={() => showAlert('Clear History?', 'Remove all browsing history?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => { clearHistory(); showAlert('Done', 'History cleared.'); } },
            ])} />
        </View>

        {/* Admin */}
        <Text style={st.sectionHeader}>{`🔐 Admin ${isAdminUnlocked ? '(UNLOCKED)' : '(Password Required)'}`}</Text>
        <View style={st.section}>
          {isAdminUnlocked ? (
            <>
              <SettingRow icon="grid" label="Manage Hubs & Apps" sub="Enable, disable, reorder hub items" color={Colors.emerald} onPress={() => router.push('/admin')} />
              <SettingRow icon="layers" label="Edit Running Strips" sub="5 bottom + 2 top strips" color={Colors.crimson} onPress={() => router.push('/admin')} />
              <SettingRow icon="apps" label="Custom App Slots" sub="Rows 3 & 4 — 10 custom slots" color={Colors.gold} onPress={() => router.push('/admin')} />
              <SettingRow icon="key" label="Change Password" sub="Replace admin password" color={Colors.gold} onPress={() => router.push('/admin')} />
              <SettingRow icon="lock-closed" label="Lock Admin Panel" color={Colors.crimson} onPress={() => { lockAdmin(); showAlert('Locked', 'Admin panel is now locked.'); }} />
            </>
          ) : (
            <SettingRow icon="lock-closed" label="Unlock Admin Panel" sub="Default: Daood5577" color={Colors.gold} onPress={() => router.push('/admin')} />
          )}
        </View>

        {/* About */}
        <Text style={st.sectionHeader}>📱 About</Text>
        <View style={st.section}>
          <SettingRow icon="information-circle" label="About Us" sub={`${BRAND} · ${DEVELOPER}`} color={Colors.gold} onPress={() => router.push('/about')} />
          <SettingRow icon="shield-checkmark" label="Legal & Copyright" sub="Copyright · Disclaimer · Privacy · Terms" color={Colors.emerald} onPress={() => router.push('/legal')} />
          <SettingRow icon="warning" label="Disclaimer" color={Colors.warning} onPress={() => showAlert('Disclaimer', 'EvEr SmArT BrOwSeR is for educational and family use. Users are responsible for accessed content.')} />
          <SettingRow icon="alert-circle" label="Warning" color={Colors.crimson} onPress={() => showAlert('Warning', `Supervise children while browsing.\nVPN may be restricted in some countries.\nContact: ${EMAIL}`)} />
          <SettingRow icon="mail" label="Contact" sub={EMAIL} color={Colors.info} onPress={() => showAlert('Contact', `Developer: ${DEVELOPER}\nEmail: ${EMAIL}\n"The One Man Army"`)} />
        </View>

        <View style={st.brandFooter}>
          <Text style={st.brandName}>{APP_NAME}</Text>
          <Text style={st.brandDev}>{DEVELOPER}</Text>
          <Text style={st.brandTagline}>The One Man Army</Text>
          <Text style={st.brandEmail}>{EMAIL}</Text>
          <Text style={st.brandVer}>Version {APP_VERSION} · {BRAND}</Text>
        </View>
      </ScrollView>

      {/* Theme picker modal */}
      <Modal visible={showTheme} transparent animationType="slide">
        <View style={st.themeOverlay}>
          <Pressable style={st.themeBackdrop} onPress={() => setShowTheme(false)} />
          <View style={st.themeSheet}>
            <View style={st.themeHeader}>
              <Text style={st.themeTitle}>🎨 Backgrounds & Themes</Text>
              <Pressable onPress={() => setShowTheme(false)} hitSlop={12}><Ionicons name="close" size={22} color={Colors.textMuted} /></Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: Spacing.sm, gap: 6, paddingBottom: 30 }}>
              {THEME_PRESETS.map(t => (
                <Pressable
                  key={t.id}
                  style={({ pressed }) => [st.themeRow, { borderColor: activeTheme.id === t.id ? t.primary : Colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
                  onPress={() => { setActiveTheme(t); setShowTheme(false); }}
                >
                  <View style={[st.themeSwatch, { backgroundColor: t.bg, borderColor: t.primary + '88' }]}>
                    <View style={[st.themeSwatchDot, { backgroundColor: t.primary }]} />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[st.themeRowName, { color: activeTheme.id === t.id ? t.primary : Colors.textPrimary }]}>{t.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      {[t.bg, t.surface, t.primary, t.accent].map((c, i) => (
                        <View key={i} style={[st.themeDot, { backgroundColor: c }]} />
                      ))}
                    </View>
                  </View>
                  {activeTheme.id === t.id ? <Ionicons name="checkmark-circle" size={20} color={t.primary} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomStrips />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder, backgroundColor: '#FFFFFF', shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  version: { fontSize: FontSize.xs, color: Colors.textMuted },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.cardBorder, backgroundColor: Colors.card },
  adminBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.textMuted },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  sectionHeader: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xs, letterSpacing: 0.5, textTransform: 'uppercase' },
  section: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.cardBorder },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  rowIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: '600' },
  rowSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  featureCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.lg, margin: Spacing.sm, padding: Spacing.sm, borderWidth: 1 },
  featureIcon: { width: 46, height: 46, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: FontSize.sm, fontWeight: '800' },
  featureSub: { fontSize: 9, color: Colors.textMuted },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  adminGate: { alignItems: 'center', gap: Spacing.sm },
  adminGateTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.gold, textAlign: 'center' },
  adminGateSub: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  adminInputRow: { flexDirection: 'row', gap: 8, width: '100%' },
  adminInput: { flex: 1, borderWidth: 1, borderColor: Colors.gold + '55', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, color: Colors.textPrimary, fontSize: FontSize.base, backgroundColor: Colors.card },
  adminError: { fontSize: FontSize.xs, color: Colors.crimson, textAlign: 'center' },
  brandFooter: { alignItems: 'center', marginTop: Spacing.xl, padding: Spacing.lg, gap: 4 },
  brandName: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.emerald, letterSpacing: 1, textAlign: 'center' },
  brandDev: { fontSize: FontSize.sm, color: Colors.gold, fontWeight: '700', textAlign: 'center' },
  brandTagline: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  brandEmail: { fontSize: FontSize.xs, color: Colors.info, textAlign: 'center' },
  brandVer: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  // Theme modal
  themeOverlay: { flex: 1, justifyContent: 'flex-end' },
  themeBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  themeSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: Colors.emerald + '33', maxHeight: '80%' },
  themeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  themeTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm },
  themeSwatch: { width: 38, height: 38, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  themeSwatchDot: { width: 14, height: 14, borderRadius: 7 },
  themeRowName: { fontSize: FontSize.sm, fontWeight: '700' },
  themeDot: { width: 10, height: 10, borderRadius: 5 },
});
