import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Dimensions, ViewStyle } from 'react-native';
import { FontSize } from '@/constants/theme';

type Props = {
  texts: string[];
  color: string;
  backgroundColor: string;
  height?: number;
  speed?: number;
  style?: ViewStyle;
  textColor?: string;
  rtl?: boolean;
};

const SCREEN_W = Dimensions.get('window').width;

export function RunningStrip({
  texts,
  color,
  backgroundColor,
  height = 22,
  speed = 60,
  style,
  textColor = '#000',
  rtl = false,
}: Props) {
  const fullText = texts.join('   ✦   ');
  const estWidth = fullText.length * 7.8;
  const totalW = estWidth + SCREEN_W;
  const duration = (totalW / speed) * 1000;

  const anim = useRef(new Animated.Value(rtl ? -estWidth : SCREEN_W)).current;

  useEffect(() => {
    anim.setValue(rtl ? -estWidth : SCREEN_W);
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: rtl ? SCREEN_W : -estWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [fullText, rtl]);

  return (
    <View style={[styles.container, { height, backgroundColor, borderColor: color }, style]}>
      <Animated.Text
        style={[
          styles.text,
          {
            color: textColor,
            transform: [{ translateX: anim }],
            textShadowColor: textColor,
            textShadowRadius: 4,
            textShadowOffset: { width: 0, height: 0 },
            writingDirection: rtl ? 'rtl' : 'ltr',
          },
        ]}
        numberOfLines={1}
      >
        {fullText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    width: '100%',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
    position: 'absolute',
  } as any,
});
