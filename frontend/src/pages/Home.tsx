import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

const orbStyles = [
  'left-[8%] top-[18%] h-24 w-24 bg-purple-500/10',
  'left-[72%] top-[12%] h-20 w-20 bg-cyan-400/10',
  'left-[50%] top-[32%] h-28 w-28 bg-violet-400/12',
  'left-[16%] top-[60%] h-16 w-16 bg-amber-400/10',
  'left-[80%] top-[58%] h-20 w-20 bg-fuchsia-400/10',
  'left-[45%] top-[80%] h-24 w-24 bg-sky-300/7',
  'left-[10%] top-[82%] h-14 w-14 bg-white/5',
  'left-[85%] top-[28%] h-12 w-12 bg-pink-400/10',
];

const quickActions = [
  { label: 'برج التحدي', icon: '🏯', color: 'from-red-900 to-slate-950', route: '/tower', description: 'تحديات عالية المخاطر' },
  { label: 'استدعاء', icon: '✨', color: 'from-purple-900 to-slate-950', route: '/summon', description: 'جرب حظك الآن' },
  { label: 'فرقتي', icon: '⚔️', color: 'from-blue-950 to-slate-950', route: '/party', description: 'تشكيل تشكيلتك' },
  { label: 'الملف', icon: '👤', color: 'from-slate-800 to-slate-950', route: '/profile', description: 'المعلومات الشخصية' },
];

export default function Home() {
  const navigate = useNavigate();
  const { playerHeroes, party, gems, tickets, loadPlayerHeroes } = useGameStore();

  const stats = useMemo(
    () => ({
      wins: 12 + playerHeroes.length * 2,
      losses: Math.max(0, playerHeroes.length - 2),
      rank: playerHeroes.length > 3 ? 'A+' : 'B',
    }),
    [playerHeroes.length]
  );

  const handleAction = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const heroCount = playerHeroes.length;
  const lastBattle = useMemo(
    () => (heroCount > 0 ? '🚀 فزت في معركة الظلال الأخيرة' : 'ابدأ من الاستدعاء لتجلب أول بطل'),
    [heroCount]
  );

  return (
    <section className="relative min-h-screen overflow-hidden pb-36 pt-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(107,33,168,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(255,215,0,0.10),_transparent_20%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0020_0%,#000510_45%,#05050f_100%)]" />

      {orbStyles.map((style, index) => (
        <span
          key={index}
          className={`particle-orb ${style} animate-particleRise`}
          style={{ animationDuration: `${10 + index * 1.8}s`, animationDelay: `${-index * 1.2}s` }}
        />
      ))}

      <div className="relative z-10 mx-auto flex w-full flex-col gap-4 px-0">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_40px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl max-h-[180px]">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle,_rgba(255,255,255,0.12),transparent_70%)] opacity-40" />
          <div className="hero-sword" />
          <div className="relative">
            <p className="text-[12px] uppercase tracking-[0.35em] text-white/50">عالم الظلال</p>
            <h1 className="mt-2 text-[30px] font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c084fc] to-[#ffd700] text-glow">
              Pick Me Up
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/70">هوية الظلال تنتظر. استدعِ، ارتقِ، وكن أسطورة في عالم قاتم.</p>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/10 p-4 shadow-2xl shadow-slate-950/40">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-3xl bg-slate-900/80 p-3">
              <p className="text-xs uppercase text-slate-400">الانتصارات</p>
              <p className="mt-2 text-2xl font-black text-emerald-300">{stats.wins}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-3">
              <p className="text-xs uppercase text-slate-400">الهزائم</p>
              <p className="mt-2 text-2xl font-black text-rose-300">{stats.losses}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-3">
              <p className="text-xs uppercase text-slate-400">الرتبة</p>
              <p className="mt-2 text-2xl font-black text-sky-300">{stats.rank}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/10 p-4 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">آخر نتيجة معركة</p>
              <p className="mt-2 font-bold text-white">{lastBattle}</p>
            </div>
            <span className="rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-2 text-xs font-bold text-slate-950">{heroCount} بطل</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleAction(item.route)}
              className={`glass-card rounded-[2rem] border border-white/10 p-4 text-right text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] transition active:scale-95 active:ring active:ring-white/10 ${item.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[18px] font-bold">{item.label}</p>
                  <p className="mt-1 text-xs text-white/60">{item.description}</p>
                </div>
                <span className="text-3xl leading-none">{item.icon}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-[2rem] border border-white/10 p-4 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">إحصائيات سريعة</p>
              <p className="text-white mt-2 text-lg font-bold">{gems} جوهرة · {tickets} تذكرة · {party.length} في الفرقة</p>
            </div>
            <button onClick={loadPlayerHeroes} className="rounded-3xl bg-gradient-to-r from-violet-600 to-blue-500 px-3 py-2 text-xs font-semibold text-white">
              تحديث الأبطال
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
