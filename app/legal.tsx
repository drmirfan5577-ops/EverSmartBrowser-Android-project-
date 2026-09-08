import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { APP_NAME, APP_VERSION, BRAND, DEVELOPER, EMAIL } from '@/constants/config';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';

type Section = {
  title: string;
  icon: string;
  color: string;
  content: string;
};

const SECTIONS: Section[] = [
  {
    title: 'About Us',
    icon: 'information-circle',
    color: Colors.emerald,
    content:
      `EvEr SmArT BrOwSeR is a comprehensive Global Family Platform Vision conceived and developed by Dr M Irfan Qadir Thaheem — The One Man Army.\n\nSMART WORLD ORDER is a vision to unify the global human family under values of Truth, Justice, Knowledge, and Islamic Ethics. This browser is not merely a web browser — it is a digital ecosystem for families, students, professionals, and seekers of truth.\n\nBuilt with passion, powered by vision, and dedicated to humanity.`,
  },
  {
    title: 'Copyright Notice',
    icon: 'shield-checkmark',
    color: Colors.emerald,
    content:
      `© 2025 SMART WORLD ORDER. All Rights Reserved.\n\nEvEr SmArT BrOwSeR™ is the intellectual property of Dr M Irfan Qadir Thaheem. All branding, design, content, code architecture, concept, and creative vision are exclusively owned by the author.\n\nVersion: ${APP_VERSION}\n\nUnauthorized reproduction, modification, distribution, or commercial exploitation of any part of this application is strictly prohibited without written consent from the copyright holder.\n\nFor licensing inquiries: ${EMAIL}`,
  },
  {
    title: 'Disclaimer',
    icon: 'warning',
    color: Colors.gold,
    content:
      `EvEr SmArT BrOwSeR provides access to third-party websites and content. The developer does not endorse, control, or take responsibility for the accuracy, completeness, or legality of external content accessed through this browser.\n\nUsers are solely responsible for their online activity, the websites they visit, and any content they share or download.\n\nThe VPN and Ad Blocker features are provided "as-is" and may not function in all geographic regions due to local regulations.\n\nParental supervision is strongly recommended when children are using this application.`,
  },
  {
    title: 'Legal Warning',
    icon: 'alert-circle',
    color: Colors.crimson,
    content:
      `⚠️ IMPORTANT LEGAL NOTICE ⚠️\n\n1. This application must not be used to access illegal, harmful, or prohibited content.\n\n2. VPN features may be restricted or illegal in certain countries. Users must comply with local laws and regulations.\n\n3. Any misuse of this application for unlawful purposes is strictly prohibited. The developer bears no responsibility for such misuse.\n\n4. Content accessed through this browser remains the responsibility of the accessing user.\n\n5. Violation of terms may result in restriction of access and legal action where applicable.`,
  },
  {
    title: 'Privacy Policy',
    icon: 'lock-closed',
    color: Colors.info,
    content:
      `EvEr SmArT BrOwSeR respects your privacy.\n\n• We do NOT collect or transmit your personal browsing data to external servers.\n• All browsing history, bookmarks, and settings are stored locally on your device.\n• No user data is sold, shared, or monetized.\n• The application may use anonymous crash/analytics reports solely to improve performance.\n\nFor questions about privacy: ${EMAIL}`,
  },
  {
    title: 'Terms of Use',
    icon: 'document-text',
    color: Colors.emerald,
    content:
      `By using EvEr SmArT BrOwSeR, you agree to:\n\n1. Use the application lawfully and ethically.\n2. Respect intellectual property rights of all third parties.\n3. Not attempt to reverse-engineer, decompile, or modify this application.\n4. Not use this application to harm, harass, or defraud others.\n5. Acknowledge that all features are provided "as-is" without warranty.\n\nThe developer reserves the right to update these terms at any time.`,
  },
  {
    title: 'Contact & Suggestions',
    icon: 'mail',
    color: Colors.gold,
    content:
      `We welcome your queries, suggestions, and feedback!\n\nDeveloper: Dr M Irfan Qadir Thaheem\nTitle: The One Man Army\n\n📧 Email: ${EMAIL}\n\n🌐 SMART WORLD ORDER\nA Global Family Platform Vision\n\n"Fire more queries and suggestions!"\n— Dr M Irfan Qadir Thaheem`,
  },
];

export default function LegalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={Colors.emerald} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Legal & Information</Text>
          <Text style={styles.headerSub}>{APP_NAME} · v{APP_VERSION}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: Colors.emeraldDeep, borderColor: Colors.emerald + '55' }]}>
          <Ionicons name="shield-checkmark" size={12} color={Colors.emerald} />
          <Text style={[styles.badgeText, { color: Colors.emerald }]}>PROTECTED</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand card */}
        <View style={styles.brandCard}>
          <Text style={styles.brandIcon}>⚖️</Text>
          <Text style={styles.brandName}>{APP_NAME}</Text>
          <Text style={styles.brandTag}>© 2025 {BRAND}</Text>
          <Text style={styles.brandDev}>{DEVELOPER}</Text>
          <Text style={styles.brandTagline}>The One Man Army</Text>
          <Text style={styles.brandEmail}>{EMAIL}</Text>
          <Text style={styles.brandVer}>Version {APP_VERSION}</Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((sec, idx) => (
          <View key={idx} style={[styles.sectionCard, { borderLeftColor: sec.color }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: sec.color + '18' }]}>
                <Ionicons name={sec.icon as any} size={20} color={sec.color} />
              </View>
              <Text style={[styles.sectionTitle, { color: sec.color }]}>{sec.title}</Text>
            </View>
            <Text style={styles.sectionBody}>{sec.content}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>EvEr SmArT BrOwSeR™</Text>
          <Text style={styles.footerLine2}>A SMART WORLD ORDER Product</Text>
          <Text style={styles.footerLine2}>All Rights Reserved · 2025</Text>
          <Text style={styles.footerLine2}>{EMAIL}</Text>
        </View>
      </ScrollView>

      <BottomStrips />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder,
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10, shadowRadius: 8, elevation: 3,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  headerSub:   { fontSize: FontSize.xs, color: Colors.textMuted },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: Radius.full, borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '800' },

  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 32 },

  brandCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.emerald + '44',
    padding: Spacing.lg, alignItems: 'center', gap: 4,
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 6,
  },
  brandIcon:    { fontSize: 36 },
  brandName:    { fontSize: FontSize.xl, fontWeight: '900', color: Colors.emerald, textAlign: 'center', letterSpacing: 0.5 },
  brandTag:     { fontSize: FontSize.sm, fontWeight: '700', color: Colors.gold, textAlign: 'center' },
  brandDev:     { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  brandTagline: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  brandEmail:   { fontSize: FontSize.xs, color: Colors.info, textAlign: 'center' },
  brandVer:     { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },

  sectionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderLeftWidth: 4, padding: Spacing.md, gap: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', flex: 1 },
  sectionBody:  { fontSize: FontSize.xs, color: Colors.textSecond, lineHeight: 20 },

  footer: {
    alignItems: 'center', marginTop: Spacing.lg, gap: 3,
    paddingBottom: Spacing.md,
  },
  footerLine:  { fontSize: FontSize.base, fontWeight: '900', color: Colors.emerald, letterSpacing: 0.5 },
  footerLine2: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});
