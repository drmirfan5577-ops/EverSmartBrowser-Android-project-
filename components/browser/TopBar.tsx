import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Easing, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RunningStrip } from '@/components/ui/RunningStrip';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';

const BISMILLAH_TEXT = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';

const FONT_STYLES = [
  { fontSize: 22, fontWeight: '400' as const, letterSpacing: 2,   fontStyle: 'normal' as const, label: 'Arabic Classic' },
  { fontSize: 24, fontWeight: '900' as const, letterSpacing: 1,   fontStyle: 'normal' as const, label: 'Bold Display' },
  { fontSize: 20, fontWeight: '300' as const, letterSpacing: 3,   fontStyle: 'italic' as const, label: 'Serif Elegant' },
  { fontSize: 18, fontWeight: '500' as const, letterSpacing: 1.5, fontStyle: 'normal' as const, label: 'Light Script' },
  { fontSize: 23, fontWeight: '700' as const, letterSpacing: 0.5, fontStyle: 'normal' as const, label: 'Digital Crystal' },
];

function BismillahBanner() {
  const { bismillahFont, setBismillahFont } = useAdmin();
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Glow uses useNativeDriver: false (color animations)
  const glow  = useRef(new Animated.Value(0)).current;
  // Pulse uses useNativeDriver: true (transform only)
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Glow: JS-driven (color interpolation)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    ).start();
    // Pulse: native-driven (scale transform only — separate Animated.Value)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // JS-driven color animations (useNativeDriver: false)
  const bgGlow = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(0,220,140,0.08)', 'rgba(0,220,140,0.22)'],
  });
  const textGlow = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(0,130,80,0.85)', 'rgba(0,180,110,1)'],
  });
  const borderGlow = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(0,180,120,0.20)', 'rgba(0,220,140,0.55)'],
  });

  const fs = FONT_STYLES[bismillahFont];

  return (
    <Animated.View style={[styles.bismillahContainer, { backgroundColor: bgGlow, borderBottomColor: borderGlow }]}>
      {/* Crystal shimmer accents */}
      <View style={styles.shimmerTop} />
      <View style={styles.shimmerBottom} />
      <View style={[styles.gem, styles.gemTL]} />
      <View style={[styles.gem, styles.gemTR]} />
      <View style={[styles.gem, styles.gemBL]} />
      <View style={[styles.gem, styles.gemBR]} />

      {/* Scale pulse wraps text (native driver) */}
      <Animated.View style={{ transform: [{ scale: pulse }], alignItems: 'center', gap: 2 }}>
        {/* Text color animation (JS driver) — separate from scale */}
        <Animated.Text
          style={[
            styles.bismillahText,
            {
              fontSize:      fs.fontSize,
              fontWeight:    fs.fontWeight,
              letterSpacing: fs.letterSpacing,
              fontStyle:     fs.fontStyle,
              color:         textGlow,
            },
          ]}
        >
          {BISMILLAH_TEXT}
        </Animated.Text>
      </Animated.View>

      <Text style={styles.bismillahTranslit}>Bismillāhir-Raḥmānir-Raḥīm</Text>
      <Text style={styles.bismillahMeaning}>In the name of Allah, the Most Gracious, the Most Merciful</Text>

      {/* Font picker trigger */}
      <Pressable style={styles.fontPickerBtn} onPress={() => setShowFontPicker(true)}>
        <Ionicons name="text" size={12} color={Colors.emerald} />
        <Text style={styles.fontPickerText}>{FONT_STYLES[bismillahFont].label}</Text>
        <Ionicons name="chevron-down" size={10} color={Colors.emerald} />
      </Pressable>

      {/* Font picker modal */}
      <Modal visible={showFontPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFontPicker(false)}>
          <View style={styles.fontModal}>
            <Text style={styles.fontModalTitle}>Choose Font Style</Text>
            {FONT_STYLES.map((f, i) => (
              <Pressable
                key={i}
                style={[styles.fontOption, bismillahFont === i && styles.fontOptionActive]}
                onPress={() => { setBismillahFont(i); setShowFontPicker(false); }}
              >
                <Text style={[styles.fontOptionText, bismillahFont === i && { color: Colors.emerald }]}>
                  {BISMILLAH_TEXT}
                </Text>
                <Text style={styles.fontOptionLabel}>{f.label}</Text>
                {bismillahFont === i ? <Ionicons name="checkmark" size={16} color={Colors.emerald} /> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Animated.View>
  );
}

export function TopBar() {
  const { topStrip1Texts, topStrip2Texts } = useAdmin();

  return (
    <View style={styles.container}>
      <BismillahBanner />

      {/* Strip 1 — Weather & Currency (bright emerald) */}
      <RunningStrip
        texts={topStrip1Texts}
        color={Colors.stripTop1}
        backgroundColor="#D0F5E8"
        textColor="#004D28"
        height={22}
        speed={55}
      />

      {/* Strip 2 — SMART WORLD ORDER narratives (bright crimson) */}
      <RunningStrip
        texts={topStrip2Texts}
        color={Colors.stripTop2}
        backgroundColor="#FFE0EA"
        textColor="#800020"
        height={22}
        speed={45}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },

  bismillahContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
    gap: 3,
  },

  shimmerTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(0,180,120,0.35)',
  },
  shimmerBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(0,180,120,0.18)',
  },
  gem: {
    position: 'absolute',
    width: 7, height: 7, borderRadius: 2,
    backgroundColor: '#00B87A',
    opacity: 0.65,
  },
  gemTL: { top: 4,  left:  10 },
  gemTR: { top: 4,  right: 10 },
  gemBL: { bottom: 4, left:  10 },
  gemBR: { bottom: 4, right: 10 },

  bismillahText: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,180,120,0.5)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
    writingDirection: 'rtl',
  },
  bismillahTranslit: {
    fontSize: 10,
    color: 'rgba(0,120,70,0.75)',
    textAlign: 'center',
    letterSpacing: 0.8,
    fontStyle: 'italic',
  },
  bismillahMeaning: {
    fontSize: 9,
    color: 'rgba(0,100,55,0.60)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  fontPickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,180,122,0.12)',
    borderWidth: 1, borderColor: 'rgba(0,180,122,0.30)',
  },
  fontPickerText: { fontSize: 9, color: Colors.emerald, fontWeight: '700' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  fontModal: {
    width: '85%', backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl, padding: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.emerald + '55', gap: Spacing.xs,
    shadowColor: '#00B87A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20, shadowRadius: 16, elevation: 10,
  },
  fontModalTitle: {
    fontSize: FontSize.base, fontWeight: '800', color: Colors.emerald,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
  fontOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: '#F5FFF8', borderWidth: 1, borderColor: Colors.cardBorder,
  },
  fontOptionActive: { borderColor: Colors.emerald + '77', backgroundColor: '#D0F5E8' },
  fontOptionText: {
    flex: 1, fontSize: 15, color: Colors.textSecond,
    writingDirection: 'rtl', textAlign: 'right',
  },
  fontOptionLabel: { fontSize: 9, color: Colors.textMuted },
});
