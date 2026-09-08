import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glowColor?: string;
  borderColor?: string;
};

export function GlassCard({ children, style, onPress, glowColor, borderColor }: Props) {
  const shadowStyle = glowColor ? {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  } : Shadow.card;

  const content = (
    <View style={[
      styles.card,
      shadowStyle,
      borderColor ? { borderColor, borderWidth: 1 } : {},
      style,
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
});
