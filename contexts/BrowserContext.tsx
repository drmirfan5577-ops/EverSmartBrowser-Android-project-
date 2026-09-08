import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { DEFAULT_BOOKMARKS } from '@/constants/config';

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

export type Tab = {
  id: string;
  url: string;
  title: string;
};

type BrowserContextType = {
  // Navigation
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  tabs: Tab[];
  activeTabId: string;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  switchTab: (id: string) => void;

  // Features
  vpnEnabled: boolean;
  toggleVpn: () => void;
  adBlockEnabled: boolean;
  toggleAdBlock: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;

  // History
  history: string[];
  addToHistory: (url: string) => void;
  clearHistory: () => void;

  // Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
};

export const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const [currentUrl, setCurrentUrlState] = useState('home');
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', url: 'home', title: 'Home' }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [adBlockEnabled, setAdBlockEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);
  const [history, setHistory] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const setCurrentUrl = useCallback((url: string) => {
    setCurrentUrlState(url);
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url, title: url } : t));
  }, [activeTabId]);

  const addTab = useCallback((url = 'home') => {
    const id = Date.now().toString();
    setTabs(prev => [...prev, { id, url, title: url === 'home' ? 'New Tab' : url }]);
    setActiveTabId(id);
    setCurrentUrlState(url);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) {
        const newId = Date.now().toString();
        setActiveTabId(newId);
        setCurrentUrlState('home');
        return [{ id: newId, url: 'home', title: 'New Tab' }];
      }
      if (id === activeTabId) {
        setActiveTabId(next[next.length - 1].id);
        setCurrentUrlState(next[next.length - 1].url);
      }
      return next;
    });
  }, [activeTabId]);

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
    const tab = tabs.find(t => t.id === id);
    if (tab) setCurrentUrlState(tab.url);
  }, [tabs]);

  const toggleVpn = () => setVpnEnabled(p => !p);
  const toggleAdBlock = () => setAdBlockEnabled(p => !p);
  const toggleDarkMode = () => setDarkMode(p => !p);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks(prev => [...prev, bookmark]);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const addToHistory = useCallback((url: string) => {
    setHistory(prev => [url, ...prev.slice(0, 49)]);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <BrowserContext.Provider value={{
      currentUrl, setCurrentUrl,
      tabs, activeTabId, addTab, closeTab, switchTab,
      vpnEnabled, toggleVpn,
      adBlockEnabled, toggleAdBlock,
      darkMode, toggleDarkMode,
      bookmarks, addBookmark, removeBookmark,
      history, addToHistory, clearHistory,
      activeModal, setActiveModal,
    }}>
      {children}
    </BrowserContext.Provider>
  );
}
