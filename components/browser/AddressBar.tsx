import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';

type Props = {
  onNavigate: (url: string) => void;
};

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed === 'home' || trimmed === '') return 'home';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.includes('.') && !trimmed.includes(' ')) return 'https://' + trimmed;
  return 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
}

// ── Animated VPN Shield Indicator ────────────────────────────────────────────
function VpnShieldIndicator({ enabled }: { enabled: boolean }) {
  const glow  = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (enabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow,  { toValue: 1, duration: 900,  easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(glow,  { toValue: 0, duration: 900,  easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.18, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,    duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else {
      glow.stopAnimation();
      pulse.stopAnimation();
      glow.setValue(0);
      pulse.setValue(1);
    }
  }, [enabled]);

  const glowColor = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(0,160,100,0.15)', 'rgba(0,200,130,0.45)'],
  });
  const iconColor = enabled ? Colors.emerald : Colors.textMuted;

  return (
    <Animated.View style={[styles.vpnBubble, { backgroundColor: glowColor }]}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Ionicons
          name={enabled ? 'shield-checkmark' : 'shield-outline'}
          size={16}
          color={iconColor}
        />
      </Animated.View>
      <Text style={[styles.vpnLabel, { color: iconColor }]}>
        {enabled ? 'VPN' : 'OFF'}
      </Text>
    </Animated.View>
  );
}

// ── Address Bar ───────────────────────────────────────────────────────────────
export function AddressBar({ onNavigate }: Props) {
  const { currentUrl, vpnEnabled, adBlockEnabled } = useBrowser();
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused]       = useState(false);

  const displayUrl = currentUrl === 'home' ? '' : currentUrl;
  const isSecure   = currentUrl.startsWith('https://') || currentUrl === 'home';

  const handleSubmit = () => {
    const url = normalizeUrl(inputValue || currentUrl);
    onNavigate(url);
    setInputValue('');
  };

  return (
    <View style={styles.row}>
      {/* VPN Animated Shield */}
      <VpnShieldIndicator enabled={vpnEnabled} />

      {/* Main input pill */}
      <View style={[styles.container, focused && styles.containerFocused]}>
        {/* Lock icon */}
        <Pressable style={styles.lockBtn}>
          <Ionicons
            name={isSecure ? 'lock-closed' : 'lock-open'}
            size={13}
            color={isSecure ? Colors.emerald : Colors.crimson}
          />
        </Pressable>

        {/* Input */}
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          value={focused ? inputValue : displayUrl}
          onChangeText={setInputValue}
          onFocus={() => { setFocused(true); setInputValue(displayUrl); }}
          onBlur={() => setFocused(false)}
          onSubmitEditing={handleSubmit}
          placeholder="Search or enter URL..."
          placeholderTextColor={Colors.textMuted}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          selectTextOnFocus
        />

        {/* Ad-Block badge */}
        {adBlockEnabled ? (
          <View style={styles.adBadge}>
            <Ionicons name="ban" size={10} color={Colors.crimson} />
            <Text style={styles.adBadgeText}>AD✗</Text>
          </View>
        ) : null}

        {/* Go button */}
        <Pressable
          style={({ pressed }) => [styles.goBtn, pressed && { opacity: 0.7 }]}
          onPress={handleSubmit}
          hitSlop={6}
        >
          <Ionicons name="arrow-forward-circle" size={28} color={Colors.emerald} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 6,
  },

  // VPN indicator
  vpnBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(0,184,122,0.30)',
    minWidth: 46,
    justifyContent: 'center',
  },
  vpnLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Address pill
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(0,160,100,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 7 : 3,
    gap: 5,
    shadowColor: '#00B87A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  containerFocused: {
    borderColor: 'rgba(0,160,100,0.60)',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  lockBtn: {
    padding: 2,
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  inputFocused: {
    color: Colors.emerald,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FFE0EA',
    borderWidth: 1,
    borderColor: 'rgba(232,0,60,0.3)',
  },
  adBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: Colors.crimson,
  },
  goBtn: {
    padding: 1,
  },
});
