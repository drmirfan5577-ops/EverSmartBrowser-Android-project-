import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput, Modal, ScrollView,
  Switch, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';
import { useAdmin } from '@/hooks/useAdmin';
import { THEME_PRESETS, ThemePreset } from '@/constants/config';

// ── Scientific Calculator ─────────────────────────────────────────────────────
function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr] = useState('');
  const [mem, setMem] = useState(0);

  const BTN_GRID = [
    ['sin', 'cos', 'tan', 'log'],
    ['√', 'x²', 'π', 'e'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '−'],
    ['0', '.', 'C', '+'],
    ['(', ')', '=', '⌫'],
    ['M+', 'MR', 'MC', '%'],
  ];

  const handle = (val: string) => {
    if (val === 'C') { setDisplay('0'); setExpr(''); return; }
    if (val === '⌫') { const ne = expr.slice(0, -1); setExpr(ne); setDisplay(ne || '0'); return; }
    if (val === '=') {
      try {
        let e = expr
          .replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')
          .replace(/π/g, String(Math.PI)).replace(/e(?!\d)/g, String(Math.E))
          .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(').replace(/log\(/g, 'Math.log10(')
          .replace(/√\(/g, 'Math.sqrt(').replace(/x²/g, '**2');
        const result = String(eval(e));
        setDisplay(result); setExpr(result);
      } catch { setDisplay('Error'); }
      return;
    }
    if (['sin','cos','tan','log','√'].includes(val)) { const ne = expr + val + '('; setExpr(ne); setDisplay(ne); return; }
    if (val === 'x²') { const ne = expr + 'x²'; setExpr(ne); setDisplay(ne); return; }
    if (val === 'π') { const ne = expr + 'π'; setExpr(ne); setDisplay(ne); return; }
    if (val === 'e') { const ne = expr + 'e'; setExpr(ne); setDisplay(ne); return; }
    if (val === '%') { try { setDisplay(String(eval(expr) / 100)); } catch {} return; }
    if (val === 'M+') { try { setMem(m => m + eval(expr.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-'))); } catch {} return; }
    if (val === 'MR') { const ne = expr + String(mem); setExpr(ne); setDisplay(ne); return; }
    if (val === 'MC') { setMem(0); return; }
    const ne = expr === '' && display === '0' ? val : expr + val;
    setExpr(ne); setDisplay(ne);
  };

  const getColor = (v: string) => {
    if (v === '=') return Colors.emerald;
    if (['÷','×','+','−','%'].includes(v)) return Colors.crimson;
    if (['sin','cos','tan','log','√','x²','π','e'].includes(v)) return '#29B6F6';
    if (['M+','MR','MC'].includes(v)) return Colors.gold;
    if (v === 'C') return Colors.crimson;
    return Colors.textPrimary;
  };

  return (
    <View style={calcSt.calc}>
      <View style={calcSt.display}>
        <Text style={calcSt.exprText} numberOfLines={1}>{expr || '0'}</Text>
        <Text style={calcSt.displayText} numberOfLines={1}>{display}</Text>
        {mem !== 0 ? <Text style={calcSt.memText}>M: {mem}</Text> : null}
      </View>
      {BTN_GRID.map((row, ri) => (
        <View key={ri} style={calcSt.row}>
          {row.map(btn => (
            <Pressable
              key={btn}
              style={({ pressed }) => [calcSt.btn, btn === '=' && { backgroundColor: Colors.emeraldDeep }, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => handle(btn)}
            >
              <Text style={[calcSt.btnText, { color: getColor(btn) }]}>{btn}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

// ── Notebook ──────────────────────────────────────────────────────────────────
function Notebook() {
  const [notes, setNotes] = useState([{ id: '1', title: 'My First Note', body: 'Welcome to Smart Notebook...', date: 'Today' }]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const active = notes.find(n => n.id === activeNote);
  if (active) {
    return (
      <View style={noteSt.root}>
        <View style={noteSt.header}>
          <Pressable onPress={() => setActiveNote(null)} hitSlop={10}><Ionicons name="arrow-back" size={20} color={Colors.emerald} /></Pressable>
          <Text style={noteSt.title} numberOfLines={1}>{active.title}</Text>
          <Pressable onPress={() => { setNotes(prev => prev.map(n => n.id === activeNote ? { ...n, body: editBody } : n)); setActiveNote(null); }}>
            <Ionicons name="checkmark" size={22} color={Colors.emerald} />
          </Pressable>
        </View>
        <TextInput style={noteSt.editor} value={editBody || active.body} onChangeText={setEditBody} multiline placeholderTextColor={Colors.textMuted} placeholder="Write your note here..." textAlignVertical="top" />
      </View>
    );
  }
  return (
    <View style={noteSt.root}>
      <View style={noteSt.addRow}>
        <TextInput style={noteSt.addInput} placeholder="New note title..." placeholderTextColor={Colors.textMuted} value={newTitle} onChangeText={setNewTitle} />
        <Pressable style={noteSt.addBtn} onPress={() => { if (newTitle.trim()) { const id = Date.now().toString(); setNotes(prev => [...prev, { id, title: newTitle.trim(), body: '', date: 'Today' }]); setNewTitle(''); setActiveNote(id); setEditBody(''); } }}>
          <Ionicons name="add" size={18} color="#000" />
        </Pressable>
      </View>
      <ScrollView>
        {notes.map(n => (
          <Pressable key={n.id} style={noteSt.noteCard} onPress={() => { setActiveNote(n.id); setEditBody(n.body); }}>
            <View style={{ flex: 1 }}>
              <Text style={noteSt.noteTitle}>{n.title}</Text>
              <Text style={noteSt.notePreview} numberOfLines={1}>{n.body || 'Empty note...'}</Text>
            </View>
            <Pressable onPress={() => setNotes(prev => prev.filter(x => x.id !== n.id))}>
              <Ionicons name="trash-outline" size={16} color={Colors.crimson} />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Reminders ─────────────────────────────────────────────────────────────────
function Reminders() {
  const [reminders, setReminders] = useState([
    { id: '1', text: 'Prayer time - Fajr', time: '05:00', done: false, color: '#00A872' },
    { id: '2', text: 'Read Quran 15 mins', time: '08:00', done: false, color: Colors.gold },
  ]);
  const [newText, setNewText] = useState('');
  const [newTime, setNewTime] = useState('');

  return (
    <View style={remSt.root}>
      <View style={remSt.addRow}>
        <TextInput style={remSt.addInput} placeholder="Reminder text..." placeholderTextColor={Colors.textMuted} value={newText} onChangeText={setNewText} />
        <TextInput style={[remSt.addInput, { width: 70 }]} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} value={newTime} onChangeText={setNewTime} keyboardType="numbers-and-punctuation" />
        <Pressable style={remSt.addBtn} onPress={() => { if (newText.trim()) { setReminders(prev => [...prev, { id: Date.now().toString(), text: newText.trim(), time: newTime || '--:--', done: false, color: Colors.emerald }]); setNewText(''); setNewTime(''); } }}>
          <Ionicons name="alarm" size={16} color="#000" />
        </Pressable>
      </View>
      <ScrollView>
        {reminders.map(r => (
          <View key={r.id} style={[remSt.card, { borderColor: r.done ? Colors.textMuted : r.color + '55' }]}>
            <Pressable style={[remSt.check, { backgroundColor: r.done ? Colors.emeraldDeep : Colors.card }]} onPress={() => setReminders(prev => prev.map(x => x.id === r.id ? { ...x, done: !x.done } : x))}>
              {r.done ? <Ionicons name="checkmark" size={14} color={Colors.emerald} /> : null}
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[remSt.remText, r.done && { textDecorationLine: 'line-through', color: Colors.textMuted }]}>{r.text}</Text>
              <View style={[remSt.timeBadge, { backgroundColor: r.color + '20' }]}>
                <Ionicons name="alarm" size={10} color={r.color} />
                <Text style={[remSt.timeText, { color: r.color }]}>{r.time}</Text>
              </View>
            </View>
            <Pressable onPress={() => setReminders(prev => prev.filter(x => x.id !== r.id))}>
              <Ionicons name="close" size={16} color={Colors.crimson} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ── VPN/AdsBlock Panel ────────────────────────────────────────────────────────
function SecurityPanel() {
  const { vpnEnabled, toggleVpn, adBlockEnabled, toggleAdBlock } = useBrowser();
  return (
    <View style={secSt.root}>
      <View style={[secSt.card, { borderColor: vpnEnabled ? Colors.emerald + '66' : Colors.cardBorder }]}>
        <View style={[secSt.iconBox, { backgroundColor: Colors.emeraldDeep }]}>
          <Ionicons name="shield-checkmark" size={28} color={Colors.emerald} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[secSt.title, { color: Colors.emerald }]}>EvEr SmArT VPN</Text>
          <Text style={secSt.sub}>Secured & Play Protected</Text>
          <View style={[secSt.badge, { backgroundColor: vpnEnabled ? Colors.emeraldDeep : Colors.surface, borderColor: vpnEnabled ? Colors.emerald : Colors.cardBorder }]}>
            <View style={[secSt.dot, { backgroundColor: vpnEnabled ? Colors.emerald : Colors.textMuted }]} />
            <Text style={[secSt.badgeText, { color: vpnEnabled ? Colors.emerald : Colors.textMuted }]}>{vpnEnabled ? 'CONNECTED' : 'DISCONNECTED'}</Text>
          </View>
        </View>
        <Switch value={vpnEnabled} onValueChange={toggleVpn} trackColor={{ false: Colors.textMuted, true: Colors.emerald }} thumbColor={vpnEnabled ? Colors.emerald : '#888'} />
      </View>

      <View style={[secSt.card, { borderColor: adBlockEnabled ? Colors.crimson + '66' : Colors.cardBorder }]}>
        <View style={[secSt.iconBox, { backgroundColor: Colors.crimsonDeep }]}>
          <Ionicons name="ban" size={28} color={Colors.crimson} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[secSt.title, { color: Colors.crimson }]}>SmArT AdS bLoCkEr</Text>
          <Text style={secSt.sub}>100% Block · Faster Browsing</Text>
          <View style={[secSt.badge, { backgroundColor: adBlockEnabled ? Colors.crimsonDeep : Colors.surface, borderColor: adBlockEnabled ? Colors.crimson : Colors.cardBorder }]}>
            <View style={[secSt.dot, { backgroundColor: adBlockEnabled ? Colors.crimson : Colors.textMuted }]} />
            <Text style={[secSt.badgeText, { color: adBlockEnabled ? Colors.crimson : Colors.textMuted }]}>{adBlockEnabled ? 'BLOCKING ALL ADS' : 'OFF'}</Text>
          </View>
        </View>
        <Switch value={adBlockEnabled} onValueChange={toggleAdBlock} trackColor={{ false: Colors.textMuted, true: Colors.crimson }} thumbColor={adBlockEnabled ? Colors.crimson : '#888'} />
      </View>
    </View>
  );
}

// ── Theme Picker Panel ────────────────────────────────────────────────────────
function ThemePicker() {
  const { activeTheme, setActiveTheme } = useAdmin();
  return (
    <View style={themeSt.root}>
      <Text style={themeSt.heading}>🎨 Backgrounds & Themes (22+)</Text>
      <ScrollView>
        {THEME_PRESETS.map(t => (
          <Pressable
            key={t.id}
            style={({ pressed }) => [themeSt.row, { borderColor: activeTheme.id === t.id ? t.primary : Colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
            onPress={() => setActiveTheme(t)}
          >
            <View style={[themeSt.swatch, { backgroundColor: t.bg, borderColor: t.primary + '88' }]}>
              <View style={[themeSt.swatchInner, { backgroundColor: t.primary }]} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[themeSt.name, { color: activeTheme.id === t.id ? t.primary : Colors.textPrimary }]}>{t.name}</Text>
              <View style={themeSt.dotRow}>
                {[t.bg, t.surface, t.primary, t.accent].map((c, i) => (
                  <View key={i} style={[themeSt.dot, { backgroundColor: c }]} />
                ))}
              </View>
            </View>
            {activeTheme.id === t.id ? <Ionicons name="checkmark-circle" size={20} color={t.primary} /> : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Media Player Mini ─────────────────────────────────────────────────────────
function MediaMini({ onOpenPlayer }: { onOpenPlayer: () => void }) {
  return (
    <View style={mediaSt.root}>
      <Text style={mediaSt.heading}>🎵 SmArT Media Player</Text>
      <Pressable style={mediaSt.openBtn} onPress={onOpenPlayer}>
        <Ionicons name="musical-notes" size={28} color={Colors.emerald} />
        <Text style={mediaSt.openText}>Open Full Player</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
      </Pressable>
      <View style={mediaSt.formatGrid}>
        {['MP3','MP4','WAV','AAC','FLAC','MKV','AVI','MOV','M4A','OGG'].map(f => (
          <View key={f} style={mediaSt.fmtBadge}>
            <Text style={mediaSt.fmtText}>{f}</Text>
          </View>
        ))}
      </View>
      <Text style={mediaSt.tip}>Double-tap video: Full Screen → Pop-up → PiP → Normal</Text>
    </View>
  );
}

// ── Main SidePanel ────────────────────────────────────────────────────────────
type SidePanelProps = { side: 'left' | 'right'; onOpenPlayer?: () => void };

type LeftTab = 'calc' | 'security' | 'theme';
type RightTab = 'notes' | 'reminders' | 'media';

export function SidePanel({ side, onOpenPlayer }: SidePanelProps) {
  const [open, setOpen] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>('calc');
  const [rightTab, setRightTab] = useState<RightTab>('notes');

  const leftTabs: { key: LeftTab; icon: string; label: string; color: string }[] = [
    { key: 'calc',     icon: 'calculator',   label: 'Calc',    color: Colors.emerald },
    { key: 'security', icon: 'shield',        label: 'Security',color: Colors.crimson },
    { key: 'theme',    icon: 'color-palette', label: 'Theme',   color: Colors.gold },
  ];

  const rightTabs: { key: RightTab; icon: string; label: string; color: string }[] = [
    { key: 'notes',     icon: 'document-text', label: 'Notes',  color: Colors.gold },
    { key: 'reminders', icon: 'alarm',          label: 'Alerts', color: Colors.crimson },
    { key: 'media',     icon: 'musical-notes',  label: 'Media',  color: Colors.emerald },
  ];

  const tabs = side === 'left' ? leftTabs : rightTabs;
  const activeKey = side === 'left' ? leftTab : rightTab;

  return (
    <>
      {/* Slide-out trigger tab */}
      <Pressable
        style={[
          panelSt.trigger,
          side === 'left' ? panelSt.triggerLeft : panelSt.triggerRight,
          open && { backgroundColor: Colors.emeraldDeep },
        ]}
        onPress={() => setOpen(o => !o)}
      >
        <Ionicons name={side === 'left' ? 'menu' : 'create'} size={15} color={Colors.emerald} />
        <Ionicons name={open ? (side === 'left' ? 'chevron-back' : 'chevron-forward') : (side === 'left' ? 'chevron-forward' : 'chevron-back')} size={10} color={Colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View style={panelSt.modalWrap}>
          {side === 'right' ? <Pressable style={panelSt.backdrop} onPress={() => setOpen(false)} /> : null}
          <View style={[panelSt.panel, side === 'left' ? panelSt.panelLeft : panelSt.panelRight]}>
            {/* Header with close + minimize */}
            <View style={panelSt.panelHeader}>
              <Ionicons name="apps" size={16} color={Colors.emerald} />
              <Text style={panelSt.panelTitle}>{side === 'left' ? '◀ Tools' : 'Tools ▶'}</Text>
              <View style={panelSt.headerBtns}>
                <Pressable style={panelSt.headerBtn} onPress={() => setOpen(false)} hitSlop={10}>
                  <Ionicons name="remove" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={panelSt.headerBtn} onPress={() => setOpen(false)} hitSlop={10}>
                  <Ionicons name="close" size={16} color={Colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Tab bar */}
            <View style={panelSt.tabBar}>
              {tabs.map(t => (
                <Pressable
                  key={t.key}
                  style={[panelSt.tab, activeKey === t.key && { borderBottomColor: t.color, borderBottomWidth: 2 }]}
                  onPress={() => {
                    if (side === 'left') setLeftTab(t.key as LeftTab);
                    else setRightTab(t.key as RightTab);
                  }}
                >
                  <Ionicons name={t.icon as any} size={14} color={activeKey === t.key ? t.color : Colors.textMuted} />
                  <Text style={[panelSt.tabText, activeKey === t.key && { color: t.color }]}>{t.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Content */}
            <View style={panelSt.content}>
              {side === 'left' ? (
                <>
                  {leftTab === 'calc'     ? <ScientificCalculator /> : null}
                  {leftTab === 'security' ? <SecurityPanel /> : null}
                  {leftTab === 'theme'    ? <ThemePicker /> : null}
                </>
              ) : (
                <>
                  {rightTab === 'notes'     ? <Notebook /> : null}
                  {rightTab === 'reminders' ? <Reminders /> : null}
                  {rightTab === 'media'     ? <MediaMini onOpenPlayer={() => { setOpen(false); onOpenPlayer?.(); }} /> : null}
                </>
              )}
            </View>
          </View>
          {side === 'left' ? <Pressable style={panelSt.backdrop} onPress={() => setOpen(false)} /> : null}
        </View>
      </Modal>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const panelSt = StyleSheet.create({
  trigger: {
    position: 'absolute', top: '40%', zIndex: 50,
    backgroundColor: Colors.surface, width: 24, height: 52,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.emerald + '55', gap: 2,
  },
  triggerLeft: { left: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  triggerRight: { right: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  modalWrap: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  panel: {
    width: '82%', backgroundColor: Colors.bg,
    borderWidth: 1, borderColor: Colors.emerald + '33',
  },
  panelLeft: { borderRightWidth: 0 },
  panelRight: { borderLeftWidth: 0 },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.sm, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  panelTitle: { flex: 1, fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary },
  headerBtns: { flexDirection: 'row', gap: 4 },
  headerBtn: {
    width: 24, height: 24, borderRadius: 6, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.cardBorder,
  },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 },
  tabText: { fontSize: 9, fontWeight: '700', color: Colors.textMuted },
  content: { flex: 1 },
});

const calcSt = StyleSheet.create({
  calc: { flex: 1, backgroundColor: Colors.bg, padding: 6, gap: 3 },
  display: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 10, marginBottom: 4, minHeight: 58, justifyContent: 'flex-end', gap: 2 },
  exprText: { fontSize: 10, color: Colors.textMuted, textAlign: 'right' },
  displayText: { fontSize: 20, fontWeight: '700', color: Colors.emerald, textAlign: 'right' },
  memText: { fontSize: 9, color: Colors.gold, textAlign: 'right' },
  row: { flexDirection: 'row', gap: 3 },
  btn: { flex: 1, aspectRatio: 1.1, backgroundColor: Colors.card, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  btnText: { fontSize: 10, fontWeight: '700' },
});

const noteSt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  title: { flex: 1, fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  addRow: { flexDirection: 'row', gap: 6, padding: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  addInput: { flex: 1, borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 6, color: Colors.textPrimary, fontSize: FontSize.xs, backgroundColor: Colors.card },
  addBtn: { backgroundColor: Colors.emerald, borderRadius: Radius.sm, width: 34, alignItems: 'center', justifyContent: 'center' },
  noteCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card, margin: 5, borderRadius: Radius.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.cardBorder },
  noteTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  notePreview: { fontSize: FontSize.xs, color: Colors.textMuted },
  editor: { flex: 1, padding: Spacing.md, color: Colors.textPrimary, fontSize: FontSize.sm, lineHeight: 22 },
});

const remSt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  addRow: { flexDirection: 'row', gap: 5, padding: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  addInput: { flex: 1, borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: Radius.sm, paddingHorizontal: 7, paddingVertical: 6, color: Colors.textPrimary, fontSize: FontSize.xs, backgroundColor: Colors.card },
  addBtn: { backgroundColor: Colors.emerald, borderRadius: Radius.sm, width: 34, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: Colors.card, margin: 5, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: Colors.emerald + '55', alignItems: 'center', justifyContent: 'center' },
  remText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 3 },
  timeText: { fontSize: 9, fontWeight: '700' },
});

const secSt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.sm, gap: Spacing.sm },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSize.sm, fontWeight: '800' },
  sub: { fontSize: 9, color: Colors.textMuted },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
});

const themeSt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  heading: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary, padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder, borderWidth: 0, borderLeftWidth: 2, borderLeftColor: 'transparent' },
  swatch: { width: 36, height: 36, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  swatchInner: { width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: FontSize.xs, fontWeight: '700' },
  dotRow: { flexDirection: 'row', gap: 4, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

const mediaSt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.sm, gap: Spacing.sm },
  heading: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary },
  openBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.emerald + '44' },
  openText: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  fmtBadge: { backgroundColor: Colors.surface, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.cardBorder },
  fmtText: { fontSize: 9, color: Colors.textMuted, fontWeight: '700' },
  tip: { fontSize: 9, color: Colors.emerald, fontStyle: 'italic', lineHeight: 14 },
});
