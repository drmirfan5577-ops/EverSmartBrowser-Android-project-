import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { APP_NAME, APP_VERSION, BRAND, DEVELOPER, EMAIL, TAGLINE } from '@/constants/config';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';

type Section = { icon: string; color: string; title: string; content: string };

const SECTIONS: Section[] = [
  {
    icon: 'information-circle',
    color: Colors.emerald,
    title: 'About Us',
    content: `${BRAND}\n${TAGLINE}\n\nBy ${DEVELOPER} — The One Man Army\n\nEvEr SmArT BrOwSeR is a next-generation, family-safe digital browser designed to bring the world closer while protecting users from harmful content. Built with love for humanity, it integrates AI, social media, news, and Islamic resources in one crystal-clear 4D platform.`,
  },
  {
    icon: 'shield',
    color: Colors.gold,
    title: 'Copyright Notice',
    content: `© 2025 ${BRAND}. All Rights Reserved.\n\nAll content, designs, concepts, and intellectual property contained within EvEr SmArT BrOwSeR are the exclusive property of ${DEVELOPER}.\n\nUnauthorized reproduction, copying, distribution, transmission, display, or modification of any part of this application is strictly prohibited without prior written consent from the copyright holder.\n\nRegistered under international intellectual property laws.`,
  },
  {
    icon: 'document-text',
    color: Colors.info,
    title: 'Disclaimer',
    content: 'EvEr SmArT BrOwSeR is provided on an "as-is" basis for educational, informational, and family use purposes.\n\nWhile every effort is made to ensure content safety and accuracy, the developers make no warranties regarding:\n\n• Completeness or accuracy of information\n• Uninterrupted or error-free operation\n• Third-party website content accessed via this browser\n\nUsers access content at their own risk. The developer is not responsible for any damages arising from use of this application.',
  },
  {
    icon: 'warning',
    color: Colors.warning,
    title: '⚠️ Important Warning',
    content: 'USERS ARE ADVISED:\n\n• This browser uses AI filtering but no system is 100% perfect\n• Always supervise children while they browse the internet\n• VPN usage may be legally restricted in some countries — check local laws\n• Do not use this browser for illegal activities\n• Report inappropriate content immediately to our team\n• Protect your personal information and passwords\n• Do not share sensitive financial information on unsecured sites\n\nViolation of terms may result in access restriction.',
  },
  {
    icon: 'people',
    color: Colors.crimson,
    title: 'Privacy Policy',
    content: 'Your privacy is our priority.\n\n• We do not sell your personal data to third parties\n• Browsing history is stored locally on your device only\n• VPN service encrypts your internet traffic\n• Ad blocker prevents tracking cookies\n• We collect minimal anonymized usage analytics to improve the app\n\nFor full privacy policy or data deletion requests, contact us at:\n' + EMAIL,
  },
  {
    icon: 'star',
    color: Colors.gold,
    title: 'Vision & Mission',
    content: `"${BRAND}" is not just an app — it is a movement.\n\nOur vision is to create a unified digital family platform that serves humanity across borders, cultures, and beliefs — bringing information, connection, faith, and knowledge to every home on Earth.\n\nMission: Deliver safe, smart, and soulful technology that empowers every individual — young and old — to navigate the digital world with confidence, wisdom, and purpose.\n\nBuilt by one man. Inspired by all humanity.`,
  },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<string | null>('About Us');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 4 }]}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.emerald} />
        </Pressable>
        <Text style={styles.headerTitle}>About EvEr SmArT BrOwSeR</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconBg}>
            <Ionicons name="globe" size={52} color={Colors.emerald} />
          </View>
          <Text style={styles.heroTitle}>{APP_NAME}</Text>
          <Text style={styles.heroSub}>{TAGLINE}</Text>
          <Text style={styles.heroBrand}>{BRAND}</Text>
          <Text style={styles.heroDev}>{DEVELOPER}</Text>
          <Text style={styles.heroTagline}>The One Man Army</Text>
          <View style={styles.heroVersionBadge}>
            <Text style={styles.heroVersion}>Version {APP_VERSION}</Text>
          </View>
        </View>

        {/* Accordion Sections */}
        {SECTIONS.map(sec => {
          const isOpen = expanded === sec.title;
          return (
            <View key={sec.title} style={[styles.accordion, { borderColor: isOpen ? sec.color + '55' : Colors.cardBorder }]}>
              <Pressable
                style={[styles.accordionHeader, isOpen && { backgroundColor: sec.color + '0D' }]}
                onPress={() => setExpanded(isOpen ? null : sec.title)}
              >
                <View style={[styles.accIcon, { backgroundColor: sec.color + '20' }]}>
                  <Ionicons name={sec.icon as any} size={18} color={sec.color} />
                </View>
                <Text style={[styles.accTitle, isOpen && { color: sec.color }]}>{sec.title}</Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={isOpen ? sec.color : Colors.textMuted}
                />
              </Pressable>
              {isOpen ? (
                <View style={styles.accordionBody}>
                  <Text style={styles.accordionText}>{sec.content}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {/* Contact */}
        <View style={styles.contactCard}>
          <Ionicons name="mail" size={22} color={Colors.info} />
          <View style={{ flex: 1 }}>
            <Text style={styles.contactLabel}>Contact & Support</Text>
            <Text style={styles.contactEmail}>{EMAIL}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {'☪️ In the name of Allah, the Most Gracious,\nthe Most Merciful'}
          </Text>
          <Text style={styles.footerCopy}>
            {`© 2025 ${BRAND} · All Rights Reserved`}
          </Text>
        </View>
      </ScrollView>

      <BottomStrips />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,160,0.12)',
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,160,0.1)',
    backgroundColor: Colors.surface,
  },
  heroIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.emeraldDeep,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.emerald + '55',
    ...Shadow.emerald,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.emerald,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: Colors.emerald,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  heroSub: { fontSize: FontSize.xs, color: Colors.textSecond, textAlign: 'center' },
  heroBrand: { fontSize: FontSize.base, fontWeight: '700', color: Colors.gold, textAlign: 'center' },
  heroDev: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  heroTagline: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  heroVersionBadge: {
    backgroundColor: Colors.emeraldDeep,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.emerald + '55',
    marginTop: 4,
  },
  heroVersion: { fontSize: FontSize.xs, color: Colors.emerald, fontWeight: '700' },

  accordion: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  accIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accordionBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  accordionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecond,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.info + '44',
  },
  contactLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  contactEmail: { fontSize: FontSize.xs, color: Colors.info, marginTop: 2 },

  footer: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: '#006400',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footerCopy: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
