import { useContext } from 'react';
import { BrowserContext } from '@/contexts/BrowserContext';

export function useBrowser() {
  const context = useContext(BrowserContext);
  if (!context) throw new Error('useBrowser must be used within BrowserProvider');
  return context;
}
