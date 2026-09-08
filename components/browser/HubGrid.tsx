import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { HubItem } from '@/contexts/BrowserContext';
import { useBrowser } from '@/hooks/useBrowser';

type Props = {
  items: HubItem[];
  hubType: string;
  onNavigate?: (url: string) => void;
  editable?: boolean;
};

export function HubGrid({ items, hubType, onNavigate, editable = false }: Props) {
  const { toggleHubItem, deleteHubItem } = useBrowser();
  const [editMode, setEditMode] = useState(false);

  const handleLongPress = () => {
    if (editable) setEditMode(e => !e);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remove App',
      `Remove "${name}" from this hub?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteHubItem(hubType, id) },
      ]
    );
  };

  return (
    <View>
      {editable ? (
        <View style={styles.editHeader}>
          <Text style={styles.hint}>Long-press any icon to edit</Text>
          <Pressable
            onPress={() => setEditMode(e => !e)}
            style={[styles.editBtn, editMode && styles.editBtnActive]}
          >
            <Ionicons name={editMode ? 'checkmark' : 'pencil'} size={14} color={editMode ? Colors.emerald : Colors.textSecond} />
            <Text style={[styles.editBtnText, editMode && { color: Colors.emerald }]}>
              {editMode ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.grid}>
        {items.map(item => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.item,
              !item.enabled && styles.itemDisabled,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              if (editMode) return;
              if (!item.enabled) return;
              onNavigate && onNavigate(item.url);
            }}
            onLongPress={handleLongPress}
          >
            {/* Delete badge in edit mode */}
            {editMode ? (
              <Pressable
                style={styles.deleteBadge}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Ionicons name="close" size={10} color="#fff" />
              </Pressable>
            ) : null}

            <View style={[
              styles.iconBg,
              { backgroundColor: item.color + (item.enabled ? '22' : '11'), borderColor: item.color + (item.enabled ? '55' : '22') }
            ]}>
              <Ionicons name={item.icon as any} size={24} color={item.enabled ? item.color : Colors.textMuted} />
            </View>
            <Text style={[styles.label, !item.enabled && styles.labelDisabled]} numberOfLines={1}>
              {item.name}
            </Text>

            {/* Toggle in edit mode */}
            {editMode ? (
              <Switch
                value={item.enabled}
                onValueChange={() => toggleHubItem(hubType, item.id)}
                trackColor={{ false: Colors.textMuted, true: Colors.emerald }}
                thumbColor={item.enabled ? Colors.emerald : '#888'}
                style={styles.toggle}
              />
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  editBtnActive: {
    borderColor: Colors.emerald,
  },
  editBtnText: {
    fontSize: FontSize.xs,
    color: Colors.textSecond,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  item: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 5,
    position: 'relative',
  },
  itemDisabled: {
    opacity: 0.45,
  },
  iconBg: {
    width: 54,
    height: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    color: Colors.textSecond,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 60,
  },
  labelDisabled: {
    color: Colors.textMuted,
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  toggle: {
    transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }],
  },
});
