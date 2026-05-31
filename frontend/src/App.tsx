import { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { TelegramProvider, useTelegram } from './telegram';
import { useGameStore } from './store/useGameStore';
import { queryClient } from './queryClient';

const Home = lazy(() => import('./pages/Home'));
const Summon = lazy(() => import('./pages/Summon'));
const Party = lazy(() => import('./pages/Party'));
const Tower = lazy(() => import('./pages/Tower'));
const Profile = lazy(() => import('./pages/Profile'));

function PageFallback() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-[2rem] bg-white/5" />
        <div className="grid gap-4">
          <div className="h-24 rounded-[2rem] bg-white/5" />
          <div className="h-24 rounded-[2rem] bg-white/5" />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isLoading, error } = useTelegram();
  const { toastMessage, toastType, clearToast } = useGameStore();
  const [routePositions, setRoutePositions] = useState<Record<string, number>>({});
  const location = useLocation();

  useEffect(() => {
    import('./pages/Summon');
    import('./pages/Party');
    import('./pages/Tower');
    import('./pages/Profile');
  }, []);

  useLayoutEffect(() => {
    const saved = routePositions[location.pathname] ?? 0;
    window.scrollTo({ top: saved, left: 0 });
  }, [location.pathname, routePositions]);

  useEffect(() => {
    return () => {
      setRoutePositions((current) => ({
        ...current,
        [location.pathname]: window.scrollY,
      }));
    };
  }, [location.pathname]);

  if (false) {
    return <div>{/* placeholder for Telegram loader */}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(13,0,32,0.95),_rgba(0,5,16,1))] text-slate-100" dir="rtl">
      <Toast message={toastMessage} type={toastType ?? 'success'} onClose={clearToast} />
      <div className="mx-auto flex min-h-screen max-w-[375px] flex-col px-4 pb-24">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summon" element={<Summon />} />
            <Route path="/party" element={<Party />} />
            <Route path="/tower" element={<Tower />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <TelegramProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TelegramProvider>
    </QueryClientProvider>
  );
}
