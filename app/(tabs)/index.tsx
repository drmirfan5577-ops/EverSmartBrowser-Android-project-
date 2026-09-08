import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useBrowser } from '@/hooks/useBrowser';
import { AddressBar } from '@/components/browser/AddressBar';
import { TabBar } from '@/components/browser/TabBar';
import { NavigationControls } from '@/components/browser/NavigationControls';
import { HomeScreen } from '@/components/browser/HomeScreen';
import { TopBar } from '@/components/browser/TopBar';
import { BottomStrips } from '@/components/browser/BottomStrips';
import { SidePanel } from '@/components/browser/SidePanel';
import { useAlert } from '@/template';

export default function BrowserScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUrl, setCurrentUrl, addBookmark, addToHistory } = useBrowser();
  const { showAlert } = useAlert();

  const webRef = useRef<any>(null);
  const [canGoBack, setCanGoBack]       = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [pageTitle, setPageTitle]       = useState('');

  const isHome = currentUrl === 'home' || currentUrl === '';

  const navigate = useCallback((url: string) => {
    if (url === 'home') { setCurrentUrl('home'); return; }
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setCurrentUrl(finalUrl);
    addToHistory(finalUrl);
  }, [setCurrentUrl, addToHistory]);

  const handleNavState = useCallback((navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    if (navState.url && navState.url !== 'about:blank') setCurrentUrl(navState.url);
    if (navState.title) setPageTitle(navState.title);
  }, [setCurrentUrl]);

  const handleBookmark = () => {
    if (isHome) return;
    addBookmark({ id: Date.now().toString(), title: pageTitle || currentUrl, url: currentUrl, icon: 'bookmark' });
    showAlert('Bookmarked', `"${pageTitle || currentUrl}" saved.`);
  };

  const handleMenu = () => {
    showAlert('Browser Menu', 'Options', [
      { text: 'Home',             onPress: () => navigate('home') },
      { text: 'Bookmark Page',    onPress: handleBookmark },
      { text: 'Admin Panel',      onPress: () => router.push('/admin') },
      { text: 'Clear History',    style: 'destructive', onPress: () => showAlert('Done', 'History cleared.') },
      { text: 'Cancel',           style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />
      <TabBar />
      <View style={styles.addressRow}>
        <AddressBar onNavigate={navigate} />
      </View>
      <View style={styles.webContainer}>
        {isHome ? (
          <HomeScreen onNavigate={navigate} />
        ) : (
          <>
            <WebView
              ref={webRef}
              source={{ uri: currentUrl }}
              style={styles.webView}
              onNavigationStateChange={handleNavState}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              javaScriptEnabled
              domStorageEnabled
              allowsBackForwardNavigationGestures
              sharedCookiesEnabled
              allowsFullscreenVideo
              userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36"
            />
            {isLoading ? (
              <View style={styles.loadingBar}>
                <View style={styles.loadingProgress} />
              </View>
            ) : null}
          </>
        )}
        <SidePanel side="left" onOpenPlayer={() => router.push('/(tabs)/player')} />
        <SidePanel side="right" onOpenPlayer={() => router.push('/(tabs)/player')} />
      </View>
      <NavigationControls
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isLoading={isLoading}
        onBack={() => webRef.current?.goBack()}
        onForward={() => webRef.current?.goForward()}
        onRefresh={() => isLoading ? webRef.current?.stopLoading() : webRef.current?.reload()}
        onHome={() => navigate('home')}
        onBookmark={handleBookmark}
        onShare={() => showAlert('Share', `URL: ${currentUrl}`)}
        onMenu={handleMenu}
      />
      <BottomStrips />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  webView: { flex: 1 },
  addressRow: { backgroundColor: '#FFFFFF', paddingVertical: 5, borderBottomWidth: 1.5, borderBottomColor: Colors.cardBorder, shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  webContainer: { flex: 1, position: 'relative' },
  webView: { flex: 1, backgroundColor: Colors.bg },
  loadingBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.emeraldDeep, overflow: 'hidden' },
  loadingProgress: { height: '100%', width: '60%', backgroundColor: Colors.emerald, borderRadius: 2 },
});
