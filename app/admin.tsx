import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput, Switch, Modal, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useAdmin } from '@/hooks/useAdmin';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';
import { useAlert } from '@/template';
import type { HubItem } from '@/contexts/AdminContext';

const COLOR_PRESETS = [
  '#00B87A','#E8003C','#C89600','#0090D0','#8030A0','#CC5500',
  '#007799','#3A8800','#AA0020','#0055AA','#005A20','#7A0040',
  '#4A0080','#003A7A','#882200','#6A4400','#1A0080','#7A1800',
];
const BG_PRESETS = [
  '#D0F5E8','#FFE0EA','#FFF8D0','#D0EEFF','#F0D8FF','#FFF3EC',
  '#EAF8FC','#EFFFEC','#FFF0F4','#EAF0FF','#C8EDD8','#F5C8D8',
];

// Large icon list from @expo/vector-icons Ionicons
const ICON_LIST = [
  'globe','book','library','bookmarks','heart','star','people','person','time','map',
  'newspaper','radio','megaphone','flash','flag','cloud','sunny','partly-sunny',
  'moon','sparkles','diamond','planet','search','code','infinite','image','color-palette',
  'happy','eye','school','ribbon','play','language','laptop','flask','mic','archive',
  'calculator','briefcase','cart','cash','lock-closed','shield-checkmark','ban','key',
  'mail','phone','camera','videocam','musical-notes','headset','volume-high',
  'document-text','folder','cloud-upload','cloud-download','share','settings',
  'grid','apps','storefront','restaurant','car','airplane','train','bicycle',
  'home','business','medical','fitness','trophy','football','basketball',
  'logo-youtube','logo-whatsapp','logo-facebook','logo-twitter','logo-instagram',
  'logo-tiktok','logo-linkedin','logo-github','logo-google','logo-apple',
  'chatbubble','chatbubbles','paper-plane','send','notifications','alarm',
  'compass','navigate','location','pin','layers','cube','shapes',
  'bar-chart','pie-chart','stats-chart','trending-up','pulse',
  'leaf','flower','earth','water','fire','snow','thunderstorm',
  'add-circle','remove-circle','close-circle','checkmark-circle','information-circle',
];

// ── Icon Picker Modal ─────────────────────────────────────────────────────────
function IconPickerModal({ visible, selected, onSelect, onClose }: {
  visible: boolean; selected: string;
  onSelect: (icon: string) => void; onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = ICON_LIST.filter(ic => !search || ic.includes(search.toLowerCase()));
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={ipSt.overlay}>
        <Pressable style={ipSt.backdrop} onPress={onClose} />
        <View style={ipSt.sheet}>
          <View style={ipSt.header}>
            <Text style={ipSt.title}>Choose Icon</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.textMuted} />
            </Pressable>
          </View>
          <TextInput
            style={ipSt.search} placeholder="Search icons..."
            placeholderTextColor={Colors.textMuted}
            value={search} onChangeText={setSearch}
          />
          <FlatList
            data={filtered}
            numColumns={6}
            keyExtractor={item => item}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                style={[ipSt.iconBtn, selected === item && ipSt.iconBtnActive]}
                onPress={() => { onSelect(item); onClose(); setSearch(''); }}
              >
                <Ionicons name={item as any} size={22} color={selected === item ? Colors.emerald : Colors.textSecond} />
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

// ── Strip Editor ──────────────────────────────────────────────────────────────
function StripEditor({ stripId, onClose }: { stripId: string; onClose: () => void }) {
  const { bottomStrips, updateStrip, addTextToStrip, removeTextFromStrip, updateTextInStrip } = useAdmin();
  const { showAlert } = useAlert();
  const strip = bottomStrips.find(s => s.id === stripId);
  const [newText, setNewText] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  if (!strip) return null;

  return (
    <View style={st.editorRoot}>
      <View style={st.editorHeader}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={Colors.emerald} />
        </Pressable>
        <Text style={[st.editorTitle, { color: strip.color }]}>Edit Strip {stripId.slice(-1).toUpperCase()}</Text>
        <Switch value={strip.enabled} onValueChange={v => updateStrip(stripId, { enabled: v })}
          trackColor={{ false: Colors.textMuted, true: strip.color }} thumbColor={strip.enabled ? strip.color : '#ccc'} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md, paddingBottom: 40 }}>

        <View style={st.fieldBlock}>
          <Text style={st.fieldLabel}>Speed: {strip.speed} px/s</Text>
          <View style={st.speedRow}>
            {[20, 35, 50, 65, 80].map(s => (
              <Pressable key={s} style={[st.speedBtn, strip.speed === s && { backgroundColor: strip.color }]}
                onPress={() => updateStrip(stripId, { speed: s })}>
                <Text style={[st.speedBtnText, strip.speed === s && { color: '#fff' }]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={st.fieldBlock}>
          <Text style={st.fieldLabel}>Direction</Text>
          <View style={st.speedRow}>
            {(['ltr', 'rtl'] as const).map(d => (
              <Pressable key={d} style={[st.speedBtn, strip.direction === d && { backgroundColor: strip.color }]}
                onPress={() => updateStrip(stripId, { direction: d })}>
                <Text style={[st.speedBtnText, strip.direction === d && { color: '#fff' }]}>{d === 'ltr' ? 'LTR' : 'RTL'}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={st.fieldBlock}>
          <Text style={st.fieldLabel}>Text Color</Text>
          <View style={st.colorRow}>
            {COLOR_PRESETS.map(c => (
              <Pressable key={c} style={[st.colorDot, { backgroundColor: c }, strip.textColor === c && st.colorDotActive]}
                onPress={() => updateStrip(stripId, { textColor: c, color: c })} />
            ))}
          </View>
        </View>

        <View style={st.fieldBlock}>
          <Text style={st.fieldLabel}>Background</Text>
          <View style={st.colorRow}>
            {BG_PRESETS.map(c => (
              <Pressable key={c} style={[st.colorDot, { backgroundColor: c }, strip.bgColor === c && st.colorDotActive]}
                onPress={() => updateStrip(stripId, { bgColor: c })} />
            ))}
          </View>
        </View>

        <View style={[st.previewBar, { backgroundColor: strip.bgColor, borderColor: strip.color }]}>
          <Text style={[st.previewText, { color: strip.textColor }]} numberOfLines={1}>
            {strip.texts.join('  ✦  ')}
          </Text>
        </View>

        <Text style={st.fieldLabel}>Running Texts ({strip.texts.length})</Text>
        {strip.texts.map((t, i) => (
          <View key={i} style={[st.textItemRow, { borderColor: strip.color + '44' }]}>
            {editIdx === i ? (
              <View style={{ gap: 6 }}>
                <TextInput style={[st.editInput, { borderColor: strip.color }]} value={editText} onChangeText={setEditText} multiline />
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable style={[st.actionBtn, { backgroundColor: strip.color }]}
                    onPress={() => { if (editText.trim()) { updateTextInStrip(stripId, i, editText.trim()); setEditIdx(null); setEditText(''); } }}>
                    <Ionicons name="checkmark" size={13} color="#fff" />
                    <Text style={[st.actionBtnText, { color: '#fff' }]}>Save</Text>
                  </Pressable>
                  <Pressable style={[st.actionBtn, { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: Colors.cardBorder }]}
                    onPress={() => { setEditIdx(null); setEditText(''); }}>
                    <Text style={[st.actionBtnText, { color: Colors.textMuted }]}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={[st.textItem, { color: strip.textColor || Colors.textPrimary }]} numberOfLines={2}>{t}</Text>
                <View style={st.textActions}>
                  <Pressable style={st.iconBtn} onPress={() => { setEditIdx(i); setEditText(t); }}>
                    <Ionicons name="create-outline" size={13} color={strip.color} />
                    <Text style={[st.iconBtnText, { color: strip.color }]}>Edit</Text>
                  </Pressable>
                  <Pressable style={st.iconBtn}
                    onPress={() => showAlert('Delete?', t.slice(0, 60), [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => removeTextFromStrip(stripId, i) },
                    ])}>
                    <Ionicons name="trash-outline" size={13} color={Colors.crimson} />
                    <Text style={[st.iconBtnText, { color: Colors.crimson }]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}

        <Text style={st.fieldLabel}>Add New Text</Text>
        <TextInput
          style={[st.editInput, { borderColor: strip.color }]}
          placeholder="Type new scrolling text..."
          placeholderTextColor={Colors.textMuted}
          value={newText} onChangeText={setNewText} multiline />
        <Pressable style={[st.addBtn, { backgroundColor: strip.color }]}
          onPress={() => { if (newText.trim()) { addTextToStrip(stripId, newText.trim()); setNewText(''); } }}>
          <Ionicons name="add" size={17} color="#fff" />
          <Text style={[st.addBtnText, { color: '#fff' }]}>Publish to Strip</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ── Add Hub App Form ──────────────────────────────────────────────────────────
function AddHubAppForm({ hubKey, hubColor, onAdd }: {
  hubKey: string; hubColor: string; onAdd: (item: HubItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [name,     setName]     = useState('');
  const [url,      setUrl]      = useState('');
  const [icon,     setIcon]     = useState('globe');
  const [color,    setColor]    = useState(hubColor);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const { showAlert } = useAlert();

  const handleAdd = () => {
    if (!name.trim() || !url.trim()) { showAlert('Required', 'Name and URL are required.'); return; }
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    onAdd({
      id: `custom_${hubKey}_${Date.now()}`,
      name: name.trim(),
      url: finalUrl,
      icon,
      color,
      enabled: true,
    });
    setName(''); setUrl(''); setIcon('globe'); setColor(hubColor);
    setExpanded(false);
    showAlert('Added!', `"${name.trim()}" added to hub.`);
  };

  if (!expanded) {
    return (
      <Pressable style={[st.addAppTrigger, { borderColor: hubColor + '55' }]} onPress={() => setExpanded(true)}>
        <Ionicons name="add-circle" size={20} color={hubColor} />
        <Text style={[st.addAppTriggerText, { color: hubColor }]}>Add New App to this Hub</Text>
      </Pressable>
    );
  }

  return (
    <View style={[st.addAppForm, { borderColor: hubColor + '66' }]}>
      <View style={st.addAppFormHeader}>
        <Ionicons name="add-circle" size={18} color={hubColor} />
        <Text style={[st.addAppFormTitle, { color: hubColor }]}>Add New App</Text>
        <Pressable onPress={() => setExpanded(false)} hitSlop={10}>
          <Ionicons name="close" size={18} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* Name */}
      <TextInput
        style={[st.addAppInput, { borderColor: hubColor + '55' }]}
        placeholder="App Name *"
        placeholderTextColor={Colors.textMuted}
        value={name} onChangeText={setName}
      />

      {/* URL */}
      <TextInput
        style={[st.addAppInput, { borderColor: hubColor + '55' }]}
        placeholder="URL  e.g. example.com *"
        placeholderTextColor={Colors.textMuted}
        value={url} onChangeText={setUrl}
        autoCapitalize="none" keyboardType="url"
      />

      {/* Icon picker row */}
      <View style={st.addAppRow}>
        <Text style={st.addAppRowLabel}>Icon</Text>
        <Pressable
          style={[st.iconPickerBtn, { borderColor: hubColor + '55', backgroundColor: hubColor + '12' }]}
          onPress={() => setShowIconPicker(true)}
        >
          <Ionicons name={icon as any} size={22} color={hubColor} />
          <Text style={[st.iconPickerLabel, { color: hubColor }]}>{icon}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* Color picker row */}
      <View style={st.addAppRow}>
        <Text style={st.addAppRowLabel}>Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 7, paddingVertical: 3 }}>
          {COLOR_PRESETS.map(c => (
            <Pressable
              key={c}
              style={[st.colorDot, { backgroundColor: c }, color === c && st.colorDotActive]}
              onPress={() => setColor(c)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Preview */}
      <View style={[st.addAppPreview, { borderColor: color + '55', backgroundColor: color + '10' }]}>
        <View style={[st.hubItemIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <Text style={[st.hubItemName, { color }]}>{name || 'App Name'}</Text>
        <Text style={st.hubItemUrl} numberOfLines={1}>{url || 'URL'}</Text>
      </View>

      <Pressable style={[st.addAppSaveBtn, { backgroundColor: hubColor }]} onPress={handleAdd}>
        <Ionicons name="checkmark-circle" size={18} color="#fff" />
        <Text style={st.addAppSaveBtnText}>Add to Hub</Text>
      </Pressable>

      <IconPickerModal
        visible={showIconPicker}
        selected={icon}
        onSelect={setIcon}
        onClose={() => setShowIconPicker(false)}
      />
    </View>
  );
}

// ── Hub Manager ───────────────────────────────────────────────────────────────
function HubManager() {
  const {
    islamicHubItems, newsHubItems, aiHubItems, socialHubItems,
    generalHubItems, smartSeriesItems, eduHubItems,
    updateHubItem, removeHubItem, addHubItem,
  } = useAdmin();
  const { showAlert } = useAlert();
  const [selectedHub, setSelectedHub] = useState('islamic');

  const ALL_HUBS = [
    { key: 'islamic', label: 'Islamic',  color: '#007A3D' },
    { key: 'news',    label: 'News',     color: Colors.crimson },
    { key: 'ai',      label: 'A.I',      color: '#1A5FCC' },
    { key: 'social',  label: 'Social',   color: '#AA1A5A' },
    { key: 'general', label: 'General',  color: Colors.gold },
    { key: 'smart',   label: 'SMART',    color: Colors.emerald },
    { key: 'edu',     label: 'Edu',      color: '#007A5A' },
  ];

  const getItems = (key: string) => {
    switch (key) {
      case 'islamic': return islamicHubItems;
      case 'news':    return newsHubItems;
      case 'ai':      return aiHubItems;
      case 'social':  return socialHubItems;
      case 'general': return generalHubItems;
      case 'smart':   return smartSeriesItems;
      case 'edu':     return eduHubItems;
      default:        return [];
    }
  };

  const hub   = ALL_HUBS.find(h => h.key === selectedHub)!;
  const items = getItems(selectedHub);

  return (
    <View style={{ flex: 1 }}>
      {/* Hub Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderBottomColor: Colors.cardBorder, backgroundColor: '#FAFFFE' }}
        contentContainerStyle={{ flexDirection: 'row', padding: 6, gap: 6 }}>
        {ALL_HUBS.map(h => (
          <Pressable key={h.key}
            style={[st.hubChip, selectedHub === h.key && { backgroundColor: h.color + '18', borderColor: h.color }]}
            onPress={() => setSelectedHub(h.key)}>
            <Text style={[st.hubChipText, selectedHub === h.key && { color: h.color }]}>{h.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: Spacing.sm, gap: 8, paddingBottom: 30 }}>
        <Text style={[st.sectionTitle, { color: hub.color }]}>{hub.label} Hub — {items.length} apps</Text>

        {/* Existing items */}
        {items.map(item => (
          <View key={item.id} style={[st.hubItemRow, { borderColor: item.enabled ? item.color + '55' : Colors.cardBorder }]}>
            <View style={[st.hubItemIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[st.hubItemName, { color: item.enabled ? item.color : Colors.textMuted }]}>{item.name}</Text>
              <Text style={st.hubItemUrl} numberOfLines={1}>{item.url}</Text>
            </View>
            <Switch value={item.enabled} onValueChange={v => updateHubItem(selectedHub, item.id, { enabled: v })}
              trackColor={{ false: Colors.textMuted, true: item.color }} thumbColor={item.enabled ? item.color : '#ccc'} />
            <Pressable hitSlop={8} onPress={() => showAlert('Delete App?', item.name, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => removeHubItem(selectedHub, item.id) },
            ])}>
              <Ionicons name="trash-outline" size={14} color={Colors.crimson} />
            </Pressable>
          </View>
        ))}

        {/* ── Add New App Form ── */}
        <View style={{ marginTop: Spacing.sm }}>
          <AddHubAppForm
            hubKey={selectedHub}
            hubColor={hub.color}
            onAdd={(item) => addHubItem(selectedHub, item)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ── Custom Slots Manager ──────────────────────────────────────────────────────
function CustomSlotsManager() {
  const { customSlots, updateCustomSlot } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [url,  setUrl]  = useState('');

  const startEdit = (id: string) => {
    const slot = customSlots.find(s => s.id === id);
    setName(slot?.name || '');
    setUrl(slot?.url   || '');
    setEditingId(id);
  };

  const save = () => {
    if (!editingId) return;
    let finalUrl = url.trim();
    if (finalUrl && !finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    updateCustomSlot(editingId, {
      name: name.trim(), url: finalUrl,
      icon: finalUrl ? 'globe' : 'add-circle-outline',
      color: finalUrl ? Colors.emerald : '#6A9080',
    });
    setEditingId(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: Spacing.sm, gap: 8, paddingBottom: 30 }}>
      <Text style={st.sectionTitle}>Custom App Slots (Rows 3 &amp; 4)</Text>
      {customSlots.map((slot, i) => (
        <View key={slot.id}>
          {editingId === slot.id ? (
            <View style={[st.hubItemRow, { flexDirection: 'column', gap: 8, borderColor: Colors.emerald + '66' }]}>
              <Text style={[st.hubItemName, { color: Colors.emerald }]}>Row {slot.row} · Slot {(i % 5) + 1}</Text>
              <TextInput style={st.editInput} placeholder="App Name" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />
              <TextInput style={st.editInput} placeholder="URL (e.g. google.com)" placeholderTextColor={Colors.textMuted} value={url} onChangeText={setUrl} autoCapitalize="none" keyboardType="url" />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable style={[st.actionBtn, { backgroundColor: Colors.emerald, flex: 1 }]} onPress={save}>
                  <Text style={[st.actionBtnText, { color: '#fff' }]}>Save</Text>
                </Pressable>
                <Pressable style={[st.actionBtn, { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: Colors.cardBorder, flex: 1 }]} onPress={() => setEditingId(null)}>
                  <Text style={[st.actionBtnText, { color: Colors.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={[st.hubItemRow, { borderColor: slot.url ? Colors.emerald + '55' : Colors.cardBorder }]} onPress={() => startEdit(slot.id)}>
              <View style={[st.hubItemIcon, { backgroundColor: slot.url ? Colors.emeraldDeep : '#F5F5F5', borderStyle: slot.url ? 'solid' : 'dashed', borderWidth: 1, borderColor: Colors.cardBorder }]}>
                <Ionicons name={slot.url ? 'globe' : 'add-circle-outline'} size={16} color={slot.url ? Colors.emerald : Colors.textMuted} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[st.hubItemName, { color: slot.url ? Colors.textPrimary : Colors.textMuted }]}>
                  {slot.name || `Row ${slot.row} · Slot ${(i % 5) + 1}`}
                </Text>
                <Text style={st.hubItemUrl}>{slot.url || 'Tap to add app'}</Text>
              </View>
              <Ionicons name="pencil" size={14} color={Colors.textMuted} />
              {slot.url ? (
                <Pressable hitSlop={8} onPress={() => updateCustomSlot(slot.id, { name: '', url: '', icon: 'add-circle-outline', color: '#6A9080' })}>
                  <Ionicons name="close" size={14} color={Colors.crimson} />
                </Pressable>
              ) : null}
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// ── Admin Screen ──────────────────────────────────────────────────────────────
export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const {
    isAdminUnlocked, unlockAdmin, lockAdmin, changePassword,
    bottomStrips, topStrip1Texts, topStrip2Texts,
    setTopStrip1Texts, setTopStrip2Texts,
  } = useAdmin();
  const [editingStrip, setEditingStrip] = useState<string | null>(null);
  const [pw, setPw]           = useState('');
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState<'strips' | 'hubs' | 'slots' | 'top' | 'password'>('strips');
  const [oldPw, setOldPw]     = useState('');
  const [newPw, setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (!isAdminUnlocked) {
    return (
      <View style={[st.root, { paddingTop: insets.top }]}>
        <TopBar />
        <View style={st.gateWrapper}>
          <View style={st.gateBox}>
            <Ionicons name="lock-closed" size={44} color={Colors.gold} />
            <Text style={st.gateTitle}>Admin Panel</Text>
            <Text style={st.gateSub}>Enter admin password to access all customizable features</Text>
            <TextInput
              style={st.gateInput}
              placeholder="Admin Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={pw}
              onChangeText={setPw}
              onSubmitEditing={() => {
                if (unlockAdmin(pw)) { setError(''); setPw(''); }
                else { setError('Incorrect. Default: Daood5577'); setPw(''); }
              }}
            />
            {error ? <Text style={st.gateError}>{error}</Text> : null}
            <Pressable style={st.gateBtn}
              onPress={() => {
                if (unlockAdmin(pw)) { setError(''); setPw(''); }
                else { setError('Incorrect. Default: Daood5577'); setPw(''); }
              }}>
              <Ionicons name="unlock" size={17} color="#fff" />
              <Text style={st.gateBtnText}>Unlock Admin</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={{ marginTop: 8 }}>
              <Text style={st.backText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
        <BottomStrips />
      </View>
    );
  }

  if (editingStrip) {
    return (
      <View style={[st.root, { paddingTop: insets.top }]}>
        <StripEditor stripId={editingStrip} onClose={() => setEditingStrip(null)} />
        <BottomStrips />
      </View>
    );
  }

  const TABS = [
    { key: 'strips'   as const, label: '5 Strips' },
    { key: 'hubs'     as const, label: 'Hubs' },
    { key: 'slots'    as const, label: 'My Apps' },
    { key: 'top'      as const, label: 'Top Bar' },
    { key: 'password' as const, label: 'Password' },
  ];

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <TopBar />
      <View style={st.adminHeader}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color={Colors.emerald} />
        </Pressable>
        <Text style={st.adminHeaderTitle}>Admin Panel</Text>
        <Pressable style={st.lockBtn} onPress={() => { lockAdmin(); router.back(); }}>
          <Ionicons name="lock-closed" size={13} color={Colors.crimson} />
          <Text style={st.lockBtnText}>Lock</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder, backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ flexDirection: 'row' }}>
        {TABS.map(t => (
          <Pressable key={t.key} style={[st.tabBtn, tab === t.key && st.tabBtnActive]} onPress={() => setTab(t.key)}>
            <Text style={[st.tabBtnText, tab === t.key && { color: Colors.emerald }]}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ flex: 1, backgroundColor: Colors.bg }}>
        {/* Strips */}
        {tab === 'strips' ? (
          <ScrollView contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm, paddingBottom: 40 }}>
            <Text style={st.sectionTitle}>Bottom Running Strips (5)</Text>
            <Text style={st.sectionDesc}>Tap a strip to edit texts, colors, speed, and direction.</Text>
            {bottomStrips.map((strip, i) => (
              <Pressable key={strip.id}
                style={[st.stripRow, { borderColor: strip.enabled ? strip.color + '66' : Colors.cardBorder }]}
                onPress={() => setEditingStrip(strip.id)}>
                <View style={[st.stripDot, { backgroundColor: strip.bgColor, borderColor: strip.color }]}>
                  <Text style={[st.stripNum, { color: strip.textColor }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[st.stripLabel, { color: strip.enabled ? strip.color : Colors.textMuted }]}>
                    Strip {i + 1} · {strip.direction.toUpperCase()} · {strip.speed}px/s
                  </Text>
                  <Text style={st.stripPreview} numberOfLines={1}>{strip.texts[0]}</Text>
                  <Text style={st.stripCount}>{strip.texts.length} text(s)</Text>
                </View>
                <Switch value={strip.enabled}
                  onValueChange={v => {}}
                  trackColor={{ false: Colors.textMuted, true: strip.color }}
                  thumbColor={strip.enabled ? strip.color : '#ccc'} />
                <Ionicons name="chevron-forward" size={15} color={Colors.textMuted} />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        {tab === 'hubs'  ? <HubManager />         : null}
        {tab === 'slots' ? <CustomSlotsManager />  : null}

        {/* Top Bar */}
        {tab === 'top' ? (
          <ScrollView contentContainerStyle={{ padding: Spacing.md, gap: 8, paddingBottom: 40 }}>
            <Text style={st.sectionTitle}>Top Strip 1 — Weather/Currency</Text>
            {topStrip1Texts.map((t, i) => (
              <View key={i} style={st.topTextRow}>
                <Text style={st.topTextPreview} numberOfLines={2}>{t}</Text>
                <Pressable onPress={() => setTopStrip1Texts(topStrip1Texts.filter((_, idx) => idx !== i))}>
                  <Ionicons name="trash-outline" size={15} color={Colors.crimson} />
                </Pressable>
              </View>
            ))}
            <Text style={[st.sectionTitle, { marginTop: Spacing.sm }]}>Top Strip 2 — SMART WORLD ORDER</Text>
            {topStrip2Texts.map((t, i) => (
              <View key={i} style={st.topTextRow}>
                <Text style={st.topTextPreview} numberOfLines={2}>{t}</Text>
                <Pressable onPress={() => setTopStrip2Texts(topStrip2Texts.filter((_, idx) => idx !== i))}>
                  <Ionicons name="trash-outline" size={15} color={Colors.crimson} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        ) : null}

        {/* Password */}
        {tab === 'password' ? (
          <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, alignItems: 'center' }}>
            <Ionicons name="key" size={40} color={Colors.gold} />
            <Text style={st.pwTitle}>Change Admin Password</Text>
            <TextInput style={st.pwInput} placeholder="Current Password" placeholderTextColor={Colors.textMuted} secureTextEntry value={oldPw} onChangeText={setOldPw} />
            <TextInput style={st.pwInput} placeholder="New Password (min 4 chars)" placeholderTextColor={Colors.textMuted} secureTextEntry value={newPw} onChangeText={setNewPw} />
            <TextInput style={st.pwInput} placeholder="Confirm New Password" placeholderTextColor={Colors.textMuted} secureTextEntry value={confirmPw} onChangeText={setConfirmPw} />
            <Pressable style={st.pwBtn} onPress={() => {
              if (newPw !== confirmPw) { showAlert('Error', 'Passwords do not match.'); return; }
              if (changePassword(oldPw, newPw)) { showAlert('Success', 'Password changed!'); setOldPw(''); setNewPw(''); setConfirmPw(''); }
              else showAlert('Error', 'Current password incorrect or new password too short.');
            }}>
              <Ionicons name="save" size={17} color="#fff" />
              <Text style={st.pwBtnText}>Save New Password</Text>
            </Pressable>
          </ScrollView>
        ) : null}
      </View>

      <BottomStrips />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  gateWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  gateBox: {
    width: '90%', backgroundColor: '#FFFFFF', borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.gold + '55',
    shadowColor: Colors.gold, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  gateTitle:   { fontSize: FontSize.xl, fontWeight: '900', color: Colors.gold, textAlign: 'center' },
  gateSub:     { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  gateInput: {
    width: '100%', borderWidth: 1.5, borderColor: Colors.gold + '66',
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12,
    color: Colors.textPrimary, fontSize: FontSize.base, backgroundColor: '#FFFBF0',
    textAlign: 'center', letterSpacing: 2,
  },
  gateError:   { color: Colors.crimson, fontSize: FontSize.xs },
  gateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.emerald, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 13, width: '100%', justifyContent: 'center',
  },
  gateBtnText: { fontSize: FontSize.base, fontWeight: '800', color: '#fff' },
  backText:    { color: Colors.textMuted, fontSize: FontSize.sm },

  adminHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder,
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  adminHeaderTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800', color: Colors.emerald },
  lockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full,
    backgroundColor: Colors.crimsonDeep, borderWidth: 1, borderColor: Colors.crimson + '55',
  },
  lockBtnText: { fontSize: 10, fontWeight: '800', color: Colors.crimson },

  tabBtn:       { paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.emerald },
  tabBtnText:   { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary, marginTop: Spacing.xs, marginBottom: 3 },
  sectionDesc:  { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },

  stripRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: '#FFFFFF', borderRadius: Radius.md, borderWidth: 1.5, padding: Spacing.sm, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  stripDot:    { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  stripNum:    { fontSize: FontSize.base, fontWeight: '900' },
  stripLabel:  { fontSize: FontSize.sm, fontWeight: '700' },
  stripPreview:{ fontSize: FontSize.xs, color: Colors.textMuted },
  stripCount:  { fontSize: 9, color: Colors.textMuted },

  hubChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full,
    backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: Colors.cardBorder,
  },
  hubChipText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },
  hubItemRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: '#FAFFFE', borderRadius: Radius.md, borderWidth: 1.5, padding: Spacing.sm,
  },
  hubItemIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  hubItemName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  hubItemUrl:  { fontSize: 9, color: Colors.textMuted },

  // Add Hub App Form
  addAppTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: Radius.md,
    padding: Spacing.sm, justifyContent: 'center',
    backgroundColor: '#FAFFFE',
  },
  addAppTriggerText: { fontSize: FontSize.sm, fontWeight: '700' },
  addAppForm: {
    borderWidth: 1.5, borderRadius: Radius.lg, padding: Spacing.md,
    backgroundColor: '#FAFFFE', gap: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  addAppFormHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addAppFormTitle: { flex: 1, fontSize: FontSize.base, fontWeight: '800' },
  addAppInput: {
    borderWidth: 1.5, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: 10,
    color: Colors.textPrimary, fontSize: FontSize.sm,
    backgroundColor: '#FFFFFF',
  },
  addAppRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  addAppRowLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecond, width: 42 },
  iconPickerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: 8,
  },
  iconPickerLabel: { flex: 1, fontSize: FontSize.xs, fontWeight: '600' },
  addAppPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderRadius: Radius.md, padding: Spacing.sm,
  },
  addAppSaveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: Radius.md, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  addAppSaveBtnText: { fontSize: FontSize.base, fontWeight: '800', color: '#FFFFFF' },

  topTextRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: '#FAFFFE', borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.cardBorder, padding: Spacing.sm,
  },
  topTextPreview: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecond },

  pwTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.gold },
  pwInput: {
    width: '100%', borderWidth: 1.5, borderColor: Colors.gold + '66',
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12,
    color: Colors.textPrimary, fontSize: FontSize.base, backgroundColor: '#FFFBF0',
  },
  pwBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.emerald, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 14, width: '100%', justifyContent: 'center',
  },
  pwBtnText: { fontSize: FontSize.base, fontWeight: '800', color: '#fff' },

  editorRoot: { flex: 1, backgroundColor: Colors.bg },
  editorHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder,
  },
  editorTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800' },

  fieldBlock:  { gap: 7 },
  fieldLabel:  { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecond },
  speedRow:    { flexDirection: 'row', gap: 7 },
  speedBtn: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full,
    backgroundColor: '#F0F0F0', borderWidth: 1.5, borderColor: Colors.cardBorder,
  },
  speedBtnText:{ fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
  colorRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  colorDot:    { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: Colors.emerald, borderWidth: 3 },
  previewBar:  { borderRadius: Radius.md, borderWidth: 1.5, padding: 7, overflow: 'hidden' },
  previewText: { fontSize: FontSize.xs, fontWeight: '700' },
  textItemRow: {
    backgroundColor: '#FAFFFE', borderRadius: Radius.md,
    borderWidth: 1.5, padding: Spacing.sm, gap: 5,
  },
  textItem:    { fontSize: FontSize.xs, color: Colors.textPrimary },
  textActions: { flexDirection: 'row', gap: 12 },
  iconBtn:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  iconBtnText: { fontSize: 10, fontWeight: '700' },
  editInput: {
    borderWidth: 1.5, borderRadius: Radius.md, padding: 9,
    color: Colors.textPrimary, fontSize: FontSize.sm, backgroundColor: '#F5FFFA',
    minHeight: 50, textAlignVertical: 'top', borderColor: Colors.cardBorder,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 11, paddingVertical: 7, borderRadius: Radius.full,
  },
  actionBtnText: { fontSize: 11, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderRadius: Radius.md, paddingVertical: 12, justifyContent: 'center',
  },
  addBtnText: { fontSize: FontSize.base, fontWeight: '800' },
});

// Icon Picker Modal Styles
const ipSt = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: Colors.emerald + '44', maxHeight: '75%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 18,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  title: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  search: {
    margin: Spacing.sm, borderWidth: 1.5, borderColor: Colors.cardBorder,
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 8,
    color: Colors.textPrimary, fontSize: FontSize.sm, backgroundColor: '#F5FFFA',
  },
  iconBtn: {
    flex: 1, margin: 3, aspectRatio: 1,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.cardBorder,
    backgroundColor: '#F8FFF8', minHeight: 44,
  },
  iconBtnActive: {
    borderColor: Colors.emerald, backgroundColor: Colors.emeraldDeep,
  },
});
