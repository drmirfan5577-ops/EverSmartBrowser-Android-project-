import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RunningStrip } from '@/components/ui/RunningStrip';
import { useAdmin } from '@/hooks/useAdmin';

export function BottomStrips() {
  const { bottomStrips } = useAdmin();

  return (
    <View style={styles.container}>
      {bottomStrips.filter(s => s.enabled).map((strip) => (
        <RunningStrip
          key={strip.id}
          texts={strip.texts}
          color={strip.color}
          backgroundColor={strip.bgColor}
          textColor={strip.textColor}
          height={19}
          speed={strip.speed}
          rtl={strip.direction === 'rtl'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
