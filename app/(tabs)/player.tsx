import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  Modal, StatusBar, Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';

const { width: W, height: H } = Dimensions.get('window');

type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  color: string;
  isVideo?: boolean;
  uri?: string;
};

const SAMPLE_TRACKS: Track[] = [
  { id: '1', title: 'Digital Horizons',     artist: 'SmArT Beat',       duration: '3:24', genre: 'Electronic',   color: Colors.emerald },
  { id: '2', title: 'Noor of the Universe', artist: 'Islamic Melodies',  duration: '4:12', genre: 'Nasheeds',     color: '#00A872' },
  { id: '3', title: 'Global Vision',        artist: 'World Orchestra',   duration: '5:01', genre: 'Classical',    color: Colors.gold },
  { id: '4', title: 'Crystal Dreams',       artist: 'Ambient Studio',    duration: '3:48', genre: 'Ambient',      color: '#29B6F6' },
  { id: '5', title: 'One Man Army',         artist: 'Dr M I Q Thaheem',  duration: '2:55', genre: 'Motivational', color: Colors.crimson },
  { id: '6', title: 'Smart World',          artist: 'Digital Ensemble',  duration: '4:30', genre: 'Fusion',       color: '#BF40BF' },
  { id: '7', title: 'Crimson Sunrise',      artist: 'Aurora Beats',      duration: '3:15', genre: 'Chill',        color: '#FF7043' },
  { id: '8', title: 'Emerald Night',        artist: 'Forest Sounds',     duration: '6:00', genre: 'Nature',       color: Colors.emerald },
];

type VideoMode = 'normal' | 'fullscreen' | 'popup' | 'pip';

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const [activeTrack, setActiveTrack] = useState<Track>(SAMPLE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [videoMode, setVideoMode] = useState<VideoMode>('normal');
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const timerRef = useRef<any>(null);
  const tapTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) { if (repeat) return 0; playNext(); return 0; }
          return p + 0.004;
        });
      }, 200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, repeat]);

  const playTrack = (track: Track) => {
    setActiveTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const playNext = () => {
    const idx = SAMPLE_TRACKS.findIndex(t => t.id === activeTrack.id);
    if (shuffle) playTrack(SAMPLE_TRACKS[Math.floor(Math.random() * SAMPLE_TRACKS.length)]);
    else playTrack(SAMPLE_TRACKS[(idx + 1) % SAMPLE_TRACKS.length]);
  };

  const playPrev = () => {
    const idx = SAMPLE_TRACKS.findIndex(t => t.id === activeTrack.id);
    playTrack(SAMPLE_TRACKS[(idx - 1 + SAMPLE_TRACKS.length) % SAMPLE_TRACKS.length]);
  };

  const formatTime = (p: number, duration: string) => {
    const parts = duration.split(':');
    const total = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    const current = Math.floor(p * total);
    return `${Math.floor(current / 60)}:${String(current % 60).padStart(2, '0')}`;
  };

  // Double-tap cycle: normal → fullscreen → popup → pip → normal
  const handleVideoTap = () => {
    setTapCount(c => c + 1);
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 400);
    if (tapCount >= 1) {
      setTapCount(0);
      setVideoMode(m => {
        const modes: VideoMode[] = ['normal', 'fullscreen', 'popup', 'pip'];
        const idx = modes.indexOf(m);
        return modes[(idx + 1) % modes.length];
      });
    }
  };

  const videoModeLabel: Record<VideoMode, string> = {
    normal: '🖥 Normal',
    fullscreen: '⛶ Full Screen',
    popup: '🗗 Pop-up',
    pip: '⧉ Picture-in-Picture',
  };

  const isFullscreen = videoMode === 'fullscreen';
  const isPopup = videoMode === 'popup';
  const isPip = videoMode === 'pip';

  // PiP overlay
  const PiPOverlay = isPip ? (
    <View style={styles.pipOverlay}>
      <View style={styles.pipContainer}>
        <Text style={styles.pipLabel}>⧉ PiP Mode</Text>
        <Pressable onPress={() => setVideoMode('normal')}>
          <Ionicons name="close" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  ) : null;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />

      {/* Video Section */}
      <View style={[
        styles.videoSection,
        isFullscreen && styles.videoFullscreen,
        isPopup && styles.videoPopup,
        isPip && styles.videoPip,
      ]}>
        <Pressable onPress={handleVideoTap} style={styles.videoPress}>
          <View style={[styles.videoPlaceholder, { borderColor: activeTrack.color + '55' }]}>
            <Ionicons name="film" size={36} color={activeTrack.color} />
            <Text style={[styles.videoHint, { color: activeTrack.color }]}>
              {videoModeLabel[videoMode]}
            </Text>
            <Text style={styles.videoTapHint}>Double-tap to cycle view mode</Text>
          </View>
        </Pressable>

        {/* Back button in fullscreen */}
        {(isFullscreen || isPopup || isPip) ? (
          <Pressable
            style={styles.videoBackBtn}
            onPress={() => setVideoMode('normal')}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.videoBackText}>Back</Text>
          </Pressable>
        ) : null}

        {/* Mode indicator */}
        <View style={styles.videoModeTag}>
          <Text style={[styles.videoModeText, { color: activeTrack.color }]}>
            {videoModeLabel[videoMode]}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Now Playing */}
        <View style={[styles.nowPlaying, { borderColor: activeTrack.color + '55' }]}>
          <View style={[styles.albumArt, { backgroundColor: activeTrack.color + '15', borderColor: activeTrack.color + '44' }]}>
            <Ionicons name="musical-notes" size={44} color={activeTrack.color} />
            {isPlaying ? (
              <View style={styles.playingIndicator}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={[styles.bar, { backgroundColor: activeTrack.color }]} />
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.trackInfo}>
            <Text style={[styles.trackTitle, { color: activeTrack.color }]}>{activeTrack.title}</Text>
            <Text style={styles.trackArtist}>{activeTrack.artist}</Text>
            <View style={[styles.genreBadge, { backgroundColor: activeTrack.color + '20', borderColor: activeTrack.color + '44' }]}>
              <Text style={[styles.genreText, { color: activeTrack.color }]}>{activeTrack.genre}</Text>
            </View>
          </View>

          {/* Format support info */}
          <View style={styles.formatsRow}>
            {['MP3', 'MP4', 'WAV', 'AAC', 'FLAC', 'MKV', 'AVI', 'MOV'].map(fmt => (
              <View key={fmt} style={styles.fmtBadge}>
                <Text style={styles.fmtText}>{fmt}</Text>
              </View>
            ))}
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: activeTrack.color }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(progress, activeTrack.duration)}</Text>
              <Text style={styles.timeText}>{activeTrack.duration}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Pressable hitSlop={8} onPress={() => setShuffle(s => !s)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Ionicons name="shuffle" size={22} color={shuffle ? Colors.emerald : Colors.textMuted} />
            </Pressable>
            <Pressable hitSlop={8} onPress={playPrev} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Ionicons name="play-skip-back" size={28} color={Colors.textPrimary} />
            </Pressable>
            <Pressable
              onPress={() => setIsPlaying(p => !p)}
              style={[styles.playBtn, { backgroundColor: activeTrack.color, ...Shadow.emerald }]}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#000" />
            </Pressable>
            <Pressable hitSlop={8} onPress={playNext} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Ionicons name="play-skip-forward" size={28} color={Colors.textPrimary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => setRepeat(r => !r)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Ionicons name="repeat" size={22} color={repeat ? Colors.emerald : Colors.textMuted} />
            </Pressable>
          </View>

          {/* Volume */}
          <View style={styles.volumeRow}>
            <Ionicons name="volume-low" size={16} color={Colors.textMuted} />
            <View style={styles.volumeSlider}>
              <View style={styles.volumeTrack}>
                <View style={[styles.volumeFill, { width: `${volume * 100}%`, backgroundColor: activeTrack.color }]} />
              </View>
            </View>
            <Ionicons name="volume-high" size={16} color={Colors.textMuted} />
          </View>

          {/* Recording buttons */}
          <View style={styles.recordRow}>
            <Pressable style={[styles.recordBtn, { borderColor: Colors.crimson + '55' }]}>
              <Ionicons name="mic" size={16} color={Colors.crimson} />
              <Text style={[styles.recordLabel, { color: Colors.crimson }]}>Audio Rec</Text>
            </Pressable>
            <Pressable style={[styles.recordBtn, { borderColor: '#29B6F6' + '55' }]}>
              <Ionicons name="videocam" size={16} color="#29B6F6" />
              <Text style={[styles.recordLabel, { color: '#29B6F6' }]}>Video Rec</Text>
            </Pressable>
            <Pressable
              style={[styles.recordBtn, { borderColor: activeTrack.color + '55' }]}
              onPress={() => setVideoMode(m => m === 'fullscreen' ? 'normal' : 'fullscreen')}
            >
              <Ionicons name={videoMode === 'fullscreen' ? 'contract' : 'expand'} size={16} color={activeTrack.color} />
              <Text style={[styles.recordLabel, { color: activeTrack.color }]}>
                {videoMode === 'fullscreen' ? 'Exit Full' : 'Full Scr'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.recordBtn, { borderColor: Colors.gold + '55' }]}
              onPress={() => setVideoMode('pip')}
            >
              <Ionicons name="albums" size={16} color={Colors.gold} />
              <Text style={[styles.recordLabel, { color: Colors.gold }]}>PiP</Text>
            </Pressable>
          </View>
        </View>

        {/* Playlist */}
        <Text style={styles.playlistTitle}>🎵 Playlist</Text>
        {SAMPLE_TRACKS.map((track) => {
          const isActive = track.id === activeTrack.id;
          return (
            <Pressable
              key={track.id}
              style={({ pressed }) => [
                styles.trackRow,
                isActive && { borderColor: track.color + '55', backgroundColor: track.color + '0A' },
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => playTrack(track)}
            >
              <View style={[styles.trackDot, { backgroundColor: track.color + (isActive ? 'FF' : '44') }]}>
                <Ionicons name={isActive && isPlaying ? 'pause' : 'play'} size={10} color={isActive ? '#000' : track.color} />
              </View>
              <View style={styles.trackMeta}>
                <Text style={[styles.rowTitle, isActive && { color: track.color }]}>{track.title}</Text>
                <Text style={styles.rowArtist}>{track.artist}</Text>
              </View>
              <View style={[styles.rowGenre, { backgroundColor: track.color + '15' }]}>
                <Text style={[styles.rowGenreText, { color: track.color }]}>{track.genre}</Text>
              </View>
              <Text style={styles.rowDuration}>{track.duration}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {PiPOverlay}
      <BottomStrips />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },

  // Video section
  videoSection: {
    height: 120,
    backgroundColor: '#050A10',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,229,160,0.15)',
    position: 'relative',
  },
  videoFullscreen: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    height: H,
  },
  videoPopup: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    height: 220,
    zIndex: 99,
    elevation: 20,
    ...Shadow.card,
  },
  videoPip: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.md,
    width: 160,
    height: 100,
    marginHorizontal: 0,
    marginVertical: 0,
    zIndex: 98,
    elevation: 20,
  },
  videoPress: { flex: 1 },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
  },
  videoHint: { fontSize: FontSize.sm, fontWeight: '700' },
  videoTapHint: { fontSize: 9, color: Colors.textMuted },
  videoBackBtn: {
    position: 'absolute',
    top: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 5,
  },
  videoBackText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  videoModeTag: {
    position: 'absolute',
    top: 8,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  videoModeText: { fontSize: 9, fontWeight: '700' },

  pipOverlay: {
    position: 'absolute',
    bottom: 120,
    right: Spacing.md,
    zIndex: 200,
  },
  pipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emerald + '44',
  },
  pipLabel: { color: Colors.emerald, fontSize: 11, fontWeight: '700' },

  // Now playing
  nowPlaying: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  albumArt: {
    height: 120,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    gap: 3,
    alignItems: 'flex-end',
  },
  bar: { width: 4, height: 16, borderRadius: 2, opacity: 0.9 },
  trackInfo: { alignItems: 'center', gap: 3 },
  trackTitle: { fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center' },
  trackArtist: { fontSize: FontSize.sm, color: Colors.textSecond, textAlign: 'center' },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginTop: 2,
  },
  genreText: { fontSize: FontSize.xs, fontWeight: '700' },

  formatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  fmtBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  fmtText: { fontSize: 8, color: Colors.textMuted, fontWeight: '700' },

  progressContainer: { gap: 4 },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: FontSize.xs, color: Colors.textMuted },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },

  volumeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  volumeSlider: { flex: 1, justifyContent: 'center' },
  volumeTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: { height: '100%', borderRadius: 2 },

  recordRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
  },
  recordLabel: { fontSize: 10, fontWeight: '700' },

  playlistTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0,229,160,0.3)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  trackDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackMeta: { flex: 1, gap: 2 },
  rowTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  rowArtist: { fontSize: FontSize.xs, color: Colors.textMuted },
  rowGenre: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rowGenreText: { fontSize: 9, fontWeight: '700' },
  rowDuration: { fontSize: FontSize.xs, color: Colors.textMuted },
});
