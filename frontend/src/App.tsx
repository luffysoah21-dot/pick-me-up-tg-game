import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Summon from './pages/Summon';
import Party from './pages/Party';
import Tower from './pages/Tower';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import TelegramLoader from './components/TelegramLoader';
import { TelegramProvider, useTelegram } from './telegram';

const navItems = [
  { path: '/', label: 'الصفحة الرئيسية' },
  { path: '/summon', label: 'استدعاء الأبطال' },
  { path: '/party', label: 'فرقتي' },
  { path: '/tower', label: 'برج التحدي' },
  { path: '/profile', label: 'الملف الشخصي' },
];

function AppContent() {
  const { isLoading, error } = useTelegram();

  if (false) {
    return <TelegramLoader loading={isLoading} error={error} />;
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(13,0,32,0.95),_rgba(0,5,16,1))] text-slate-100" dir="rtl">
        <div className="mx-auto flex min-h-screen max-w-[375px] flex-col px-4 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summon" element={<Summon />} />
            <Route path="/party" element={<Party />} />
            <Route path="/tower" element={<Tower />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  );
}
