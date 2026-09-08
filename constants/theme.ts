// EvEr SmArT BrOwSeR – Design Tokens
// ✨ Crystal Clear · Bright Luminous · Glassy 4D · Emerald & Crimson Accents

export const Colors = {
  // ── Core backgrounds (BRIGHT CRYSTAL GLASS) ──────────────────────────────
  bg:          '#F0F8F5',           // crystal-clear light mint
  bgDeep:      '#E8F4EF',           // deeper crystal
  surface:     'rgba(255,255,255,0.92)', // bright glassy white
  surfaceGlass:'rgba(240,252,248,0.88)', // semi-transparent crystal
  card:        'rgba(255,255,255,0.85)', // glassy card
  cardBorder:  'rgba(0,160,100,0.18)',   // soft emerald border

  // Brand – Emerald (vibrant, luminous)
  emerald:     '#00B87A',
  emeraldDim:  '#00956A',
  emeraldGlow: 'rgba(0,184,122,0.25)',
  emeraldDeep: '#D0F5E8',           // light emerald tint (not dark)

  // Brand – Crimson (vibrant, luminous)
  crimson:     '#E8003C',
  crimsonDim:  '#C0002E',
  crimsonGlow: 'rgba(232,0,60,0.2)',
  crimsonDeep: '#FFE0EA',           // light crimson tint

  // Accent – Gold
  gold:        '#C89600',
  goldDim:     '#A07A00',

  // Text (dark on light background for readability)
  textPrimary: '#0A2018',
  textSecond:  '#2A5040',
  textMuted:   '#6A9080',
  textOnDark:  '#FFFFFF',

  // Status
  success:     '#00A870',
  error:       '#E8003C',
  warning:     '#C87000',
  info:        '#0070C0',

  // Strip colors
  strip1:      '#00B87A',
  strip2:      '#E8003C',
  strip3:      '#C89600',
  strip4:      '#0090D0',
  strip5:      '#8030A0',
  stripTop1:   '#00B87A',
  stripTop2:   '#E8003C',

  // Gradients
  gradHero:    ['#E8F8F2', '#F5FFFB', '#E8F8F2'],
  gradEmerald: ['#00B87A', '#00956A'],
  gradCrimson: ['#E8003C', '#C0002E'],
  gradGold:    ['#C89600', '#A07A00'],
  gradCard:    ['rgba(0,184,122,0.08)', 'rgba(232,0,60,0.04)'],
  gradGlass:   ['rgba(255,255,255,0.95)', 'rgba(240,255,250,0.80)'],
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  full: 999,
};

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 16,
  lg:   18,
  xl:   20,
  xxl:  24,
  hero: 32,
};

export const Shadow = {
  emerald: {
    shadowColor: '#00B87A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 8,
  },
  crimson: {
    shadowColor: '#E8003C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#00B87A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
};
