import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  ADMIN_PASSWORD, BOTTOM_STRIP_DEFAULTS, ISLAMIC_HUB, NEWS_HUB, AI_HUB,
  SOCIAL_HUB, GENERAL_HUB, SMART_SERIES_HUB, EDU_HUB, THEME_PRESETS, ThemePreset,
} from '@/constants/config';

export type StripConfig = {
  id: string;
  enabled: boolean;
  speed: number;
  color: string;
  bgColor: string;
  textColor: string;
  direction: 'ltr' | 'rtl';
  language: string;
  texts: string[];
};

export type HubItem = {
  id: string;
  name: string;
  label?: string;
  url: string;
  icon: string;
  color: string;
  enabled: boolean;
};

export type CustomAppSlot = {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  enabled: boolean;
  row: number; // 3 or 4
};

export type LogoConfig = {
  position: 'left' | 'right';
  size: number;
  primaryColor: string;
  accentColor: string;
  text: string;
  rotating: boolean;
};

type AdminContextType = {
  // Auth
  isAdminUnlocked: boolean;
  adminPassword: string;
  unlockAdmin: (pw: string) => boolean;
  lockAdmin: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;

  // Strips
  bottomStrips: StripConfig[];
  updateStrip: (id: string, updates: Partial<StripConfig>) => void;
  addTextToStrip: (id: string, text: string) => void;
  removeTextFromStrip: (id: string, index: number) => void;
  updateTextInStrip: (id: string, index: number, text: string) => void;

  // Top strips
  topStrip1Texts: string[];
  topStrip2Texts: string[];
  setTopStrip1Texts: (texts: string[]) => void;
  setTopStrip2Texts: (texts: string[]) => void;

  // Bismillah font
  bismillahFont: number;
  setBismillahFont: (idx: number) => void;

  // Hubs management
  islamicHubItems: HubItem[];
  newsHubItems: HubItem[];
  aiHubItems: HubItem[];
  socialHubItems: HubItem[];
  generalHubItems: HubItem[];
  smartSeriesItems: HubItem[];
  eduHubItems: HubItem[];
  updateHubItem: (hub: string, id: string, updates: Partial<HubItem>) => void;
  addHubItem: (hub: string, item: HubItem) => void;
  removeHubItem: (hub: string, id: string) => void;
  reorderHubItem: (hub: string, fromIdx: number, toIdx: number) => void;

  // Custom app slots (rows 3 & 4 — 10 slots)
  customSlots: CustomAppSlot[];
  updateCustomSlot: (id: string, updates: Partial<CustomAppSlot>) => void;

  // Logo
  logoConfig: LogoConfig;
  setLogoConfig: (cfg: Partial<LogoConfig>) => void;

  // Theme
  activeTheme: ThemePreset;
  setActiveTheme: (theme: ThemePreset) => void;

  // VPN/AdsBlock display flags (admin can force-hide from main UI)
  showVpnInSidebar: boolean;
  setShowVpnInSidebar: (v: boolean) => void;
  showAdsBlockInSidebar: boolean;
  setShowAdsBlockInSidebar: (v: boolean) => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const DEFAULT_CUSTOM_SLOTS: CustomAppSlot[] = Array.from({ length: 10 }, (_, i) => ({
  id: `cs${i + 1}`,
  name: '',
  url: '',
  icon: 'add-circle-outline',
  color: '#445565',
  enabled: true,
  row: i < 5 ? 3 : 4,
}));

const DEFAULT_LOGO: LogoConfig = {
  position: 'left',
  size: 62,
  primaryColor: '#FF2D55',
  accentColor: '#FFFFFF',
  text: 'ESB',
  rotating: true,
};

function getHubUpdater(hub: string, setState: Record<string, React.Dispatch<React.SetStateAction<HubItem[]>>>) {
  return setState[hub] ?? setState['general'];
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState(ADMIN_PASSWORD);
  const [bottomStrips, setBottomStrips] = useState<StripConfig[]>(BOTTOM_STRIP_DEFAULTS);
  const [bismillahFont, setBismillahFont] = useState(0);
  const [topStrip1Texts, setTopStrip1Texts] = useState([
    '🌤️ Weather & Currency Updates — Auto-refreshing every 2 hours',
    '💱 USD · EUR · GBP · SAR · AED · CNY — Live Rates',
    '⛅ Smart Weather Forecast · Real-time data 24/7',
  ]);
  const [topStrip2Texts, setTopStrip2Texts] = useState([
    '🌐 SMART WORLD ORDER Forum: A Global Family Platform Vision.',
    '👁️ Truth through the Lens.',
    '📡 We bring what they hide.',
    '🔎 Both eyes on what\'s really going on.',
    '📰 Realities and Facts at your doorstep.',
    '🕵️ Dark realities, Hidden facts, Deeper insights.',
    '🌍 No Global Village — It\'s Global Family Vision.',
    '⚖️ A fight against Injustice and Double Standards In-sha-Allah.',
  ]);

  // Hub states
  const [islamicHubItems, setIslamicHubItems] = useState<HubItem[]>(ISLAMIC_HUB);
  const [newsHubItems, setNewsHubItems] = useState<HubItem[]>(NEWS_HUB);
  const [aiHubItems, setAiHubItems] = useState<HubItem[]>(AI_HUB);
  const [socialHubItems, setSocialHubItems] = useState<HubItem[]>(SOCIAL_HUB);
  const [generalHubItems, setGeneralHubItems] = useState<HubItem[]>(GENERAL_HUB);
  const [smartSeriesItems, setSmartSeriesItems] = useState<HubItem[]>(SMART_SERIES_HUB);
  const [eduHubItems, setEduHubItems] = useState<HubItem[]>(EDU_HUB);

  // Custom slots
  const [customSlots, setCustomSlots] = useState<CustomAppSlot[]>(DEFAULT_CUSTOM_SLOTS);

  // Logo
  const [logoConfig, setLogoConfigState] = useState<LogoConfig>(DEFAULT_LOGO);

  // Theme
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(THEME_PRESETS[0]);

  // Sidebar display flags
  const [showVpnInSidebar, setShowVpnInSidebar] = useState(true);
  const [showAdsBlockInSidebar, setShowAdsBlockInSidebar] = useState(true);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const unlockAdmin = useCallback((pw: string) => {
    if (pw === adminPassword) { setIsAdminUnlocked(true); return true; }
    return false;
  }, [adminPassword]);

  const lockAdmin = useCallback(() => setIsAdminUnlocked(false), []);

  const changePassword = useCallback((oldPw: string, newPw: string) => {
    if (oldPw === adminPassword && newPw.length >= 4) {
      setAdminPassword(newPw);
      return true;
    }
    return false;
  }, [adminPassword]);

  // ── Strips ──────────────────────────────────────────────────────────────────
  const updateStrip = useCallback((id: string, updates: Partial<StripConfig>) => {
    setBottomStrips(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const addTextToStrip = useCallback((id: string, text: string) => {
    setBottomStrips(prev => prev.map(s => s.id === id ? { ...s, texts: [...s.texts, text] } : s));
  }, []);

  const removeTextFromStrip = useCallback((id: string, index: number) => {
    setBottomStrips(prev => prev.map(s =>
      s.id === id ? { ...s, texts: s.texts.filter((_, i) => i !== index) } : s
    ));
  }, []);

  const updateTextInStrip = useCallback((id: string, index: number, text: string) => {
    setBottomStrips(prev => prev.map(s =>
      s.id === id ? { ...s, texts: s.texts.map((t, i) => i === index ? text : t) } : s
    ));
  }, []);

  // ── Hub management ──────────────────────────────────────────────────────────
  const getHubSetter = (hub: string): React.Dispatch<React.SetStateAction<HubItem[]>> => {
    switch (hub) {
      case 'islamic':    return setIslamicHubItems;
      case 'news':       return setNewsHubItems;
      case 'ai':         return setAiHubItems;
      case 'social':     return setSocialHubItems;
      case 'general':    return setGeneralHubItems;
      case 'smart':      return setSmartSeriesItems;
      case 'edu':        return setEduHubItems;
      default:           return setGeneralHubItems;
    }
  };

  const updateHubItem = useCallback((hub: string, id: string, updates: Partial<HubItem>) => {
    getHubSetter(hub)(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const addHubItem = useCallback((hub: string, item: HubItem) => {
    getHubSetter(hub)(prev => [...prev, item]);
  }, []);

  const removeHubItem = useCallback((hub: string, id: string) => {
    getHubSetter(hub)(prev => prev.filter(item => item.id !== id));
  }, []);

  const reorderHubItem = useCallback((hub: string, fromIdx: number, toIdx: number) => {
    getHubSetter(hub)(prev => {
      const arr = [...prev];
      const [removed] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, removed);
      return arr;
    });
  }, []);

  // ── Custom slots ────────────────────────────────────────────────────────────
  const updateCustomSlot = useCallback((id: string, updates: Partial<CustomAppSlot>) => {
    setCustomSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  // ── Logo ────────────────────────────────────────────────────────────────────
  const setLogoConfig = useCallback((cfg: Partial<LogoConfig>) => {
    setLogoConfigState(prev => ({ ...prev, ...cfg }));
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdminUnlocked, adminPassword, unlockAdmin, lockAdmin, changePassword,
      bottomStrips, updateStrip, addTextToStrip, removeTextFromStrip, updateTextInStrip,
      topStrip1Texts, topStrip2Texts, setTopStrip1Texts, setTopStrip2Texts,
      bismillahFont, setBismillahFont,
      islamicHubItems, newsHubItems, aiHubItems, socialHubItems,
      generalHubItems, smartSeriesItems, eduHubItems,
      updateHubItem, addHubItem, removeHubItem, reorderHubItem,
      customSlots, updateCustomSlot,
      logoConfig, setLogoConfig,
      activeTheme, setActiveTheme,
      showVpnInSidebar, setShowVpnInSidebar,
      showAdsBlockInSidebar, setShowAdsBlockInSidebar,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
