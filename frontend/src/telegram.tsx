import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { init, mainButton, retrieveLaunchParams, retrieveRawLaunchParams } from '@telegram-apps/sdk';
import { useLaunchParams, useRawInitData } from '@telegram-apps/sdk-react';
import type { ThemeParams, User } from '@telegram-apps/sdk';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand?: () => void;
      };
    };
  }
}

interface TelegramState {
  isLoading: boolean;
  isTelegram: boolean;
  error: string | null;
  userName: string;
  themeParams: Partial<ThemeParams>;
  rawInitData?: string;
  openFullExperience: () => void;
}

const TelegramContext = createContext<TelegramState | undefined>(undefined);

function formatUserName(user?: User) {
  if (!user) {
    return 'ضيف';
  }

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || 'ضيف';
}

function applyTelegramTheme(themeParams: Partial<ThemeParams>) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const darkMode = themeParams.theme === 'light' ? 'light' : 'dark';

  root.dataset.theme = darkMode;
  root.style.setProperty('--app-bg', themeParams.backgroundColor ?? '#020617');
  root.style.setProperty('--app-surface', themeParams.secondaryBackgroundColor ?? 'rgba(15, 23, 42, 0.95)');
  root.style.setProperty('--app-border', themeParams.linkColor ?? 'rgba(148, 163, 184, 0.12)');
  root.style.setProperty('--app-text', themeParams.textColor ?? '#e2e8f0');
  root.style.setProperty('--app-muted', themeParams.hintColor ?? '#94a3b8');
  root.style.setProperty('--app-primary', themeParams.buttonColor ?? '#22c55e');
  root.style.setProperty('--app-primary-text', themeParams.buttonTextColor ?? '#0f172a');
}

function isTelegramAvailable() {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp);
}

export function TelegramProvider({ children }: PropsWithChildren<{}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('ضيف');
  const [themeParams, setThemeParams] = useState<Partial<ThemeParams>>({});
  const [rawInitData, setRawInitData] = useState<string | undefined>(undefined);
  let launchParams = null;
  let rawInitFromHook: string | undefined = undefined;

  try {
    launchParams = useLaunchParams(true);
  } catch {
    launchParams = null;
  }

  try {
    rawInitFromHook = useRawInitData();
  } catch {
    rawInitFromHook = undefined;
  }

  const openFullExperience = () => {
    if (!isTelegram || typeof window === 'undefined') {
      return;
    }

    window.Telegram?.WebApp?.expand?.();
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      setError('لا يمكن تشغيل التطبيق في بيئة غير المتصفح.');
      setIsLoading(false);
      return;
    }

    if (!isTelegramAvailable()) {
      setError('Telegram WebApp غير متاح. افتح التطبيق من داخل Telegram.');
      setIsLoading(false);
      return;
    }

    setIsTelegram(true);

    let unmountClick = () => undefined;
    let cleanupInit = () => undefined;

    try {
      cleanupInit = init({ acceptCustomStyles: true });
      mainButton.mount();
      mainButton.setParams({ text: 'ابدأ اللعب', isVisible: true, isEnabled: true });

      unmountClick = mainButton.onClick(() => {
        window.Telegram?.WebApp?.expand?.();
      });

      const params = launchParams ?? retrieveLaunchParams(true);
      setUserName(formatUserName(params?.user));
      setThemeParams(params?.themeParams ?? {});
      setRawInitData(rawInitFromHook ?? retrieveRawLaunchParams());
    } catch (err) {
      console.error('Telegram initialization failed:', err);
      setError('فشل تهيئة Telegram WebApp. افتح التطبيق داخل Telegram وتحقق من صلاحية initData.');
    } finally {
      setIsLoading(false);
    }

    return () => {
      unmountClick();
      mainButton.unmount();
      cleanupInit();
    };
  }, []);

  useEffect(() => {
    applyTelegramTheme(themeParams);
  }, [themeParams]);

  return (
    <TelegramContext.Provider
      value={{
        isLoading,
        isTelegram,
        error,
        userName,
        themeParams,
        rawInitData,
        openFullExperience,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used inside TelegramProvider');
  }
  return context;
}
