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

  if (isLoading) {
    return <TelegramLoader loading={isLoading} error={error} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col items-stretch justify-between gap-4 rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:flex-row sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/75">عالم الظلال</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-emerald-200 sm:text-4xl">Pick Me Up</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                عبور إلى عالم فانتازي مظلم، استدعِ أبطالك، وارتقِ في البرج مع واجهة عربية كاملة وRTL.
              </p>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <nav className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-slate-500">القائمة</p>
              <div className="space-y-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `block rounded-3xl border px-4 py-3 text-base transition ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-400/10 text-emerald-200'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <main className="space-y-6 pb-24 lg:pb-0">
              <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40">
                <p className="text-sm text-slate-500">Telegram Mini App</p>
                <p className="mt-2 text-base text-slate-200">التطبيق جاهز داخل Telegram. استخدم القائمة للتنقل بين الشاشات.</p>
              </div>

              <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 px-4 py-5 shadow-2xl shadow-slate-950/40 sm:p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/summon" element={<Summon />} />
                  <Route path="/party" element={<Party />} />
                  <Route path="/tower" element={<Tower />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </main>
          </div>
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
