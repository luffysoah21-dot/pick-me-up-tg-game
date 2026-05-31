export default function Home() {
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

      <div className="relative z-10 mx-auto flex w-full flex-col gap-5 px-0">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle,_rgba(255,255,255,0.15),transparent_70%)] opacity-40" />
          <div className="hero-sword" />
          <div className="relative space-y-3">
            <p className="text-[13px] uppercase tracking-[0.3em] text-white/50">عالم الظلال</p>
            <h1 className="text-[32px] font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c084fc] to-[#ffd700] text-glow">
              Pick Me Up
            </h1>
            <p className="max-w-[92%] text-sm leading-6 text-white/70">
              انطلق في رحلة مظلمة، استدعِ أبطالك الأسطوريين، واصعد أعلى برج التحدي في تجربة عربية خيالية.
            </p>
          </div>
        </div>

        <div className="glass-card overflow-hidden rounded-[2.5rem] border border-white/10 p-5 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/80 shadow-[0_0_35px_rgba(126,63,255,0.25)]">
              <span className="ring-spinner" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 via-violet-500 to-indigo-900 shadow-[0_0_25px_rgba(126,63,255,0.35)]">
                <span className="text-xl font-black text-white/90">⚔️</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[18px] font-extrabold text-white">اللاجئ الظلال</p>
                  <p className="mt-1 text-sm text-white/60">المستوى الأسطوري</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-[#f6d365] to-[#fda085] px-3 py-2 text-[12px] font-bold uppercase text-slate-950 shadow-[0_0_18px_rgba(246,211,101,0.24)]">
                  مستوى 27
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[12px] uppercase tracking-[0.18em] text-white/60">
                  <span>خبرة 65%</span>
                  <span>5120 / 8000</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
              🎟️ التذاكر 12
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
              💎 الجواهر 5
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#7f1d1d,#2d0509)] px-4 py-5 text-right text-white shadow-[0_0_35px_rgba(239,68,68,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(239,68,68,0.3)] animate-float-soft">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">🏯</span>
              <span className="rounded-full bg-[#ffebe5]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">خطير</span>
            </div>
            <p className="text-[18px] font-bold">برج التحدي</p>
            <p className="mt-2 text-xs text-white/60">اكتشف مستويات جديدة وانهِ التحدي المتوهج</p>
          </button>

          <button className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#4f46e5,#6d28d9)] px-4 py-5 text-right text-white shadow-[0_0_35px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(124,58,237,0.3)] animate-pulse-slow">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">✨</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">سريع</span>
            </div>
            <p className="text-[18px] font-bold">استدعاء</p>
            <p className="mt-2 text-xs text-white/60">احصل على بطل جديد مع وميض أسطوري</p>
          </button>

          <button className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-5 text-right text-white shadow-[0_0_35px_rgba(59,130,246,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(59,130,246,0.3)] animate-float-soft">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">⚔️</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">إستعداد</span>
            </div>
            <p className="text-[18px] font-bold">فرقتي</p>
            <p className="mt-2 text-xs text-white/60">تشكيل تشكيلتك القتالية واعادة بناء الفريق</p>
          </button>

          <button className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#374151,#111827)] px-4 py-5 text-right text-white shadow-[0_0_35px_rgba(148,163,184,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(148,163,184,0.3)] animate-pulse-slow">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">👤</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">سريع</span>
            </div>
            <p className="text-[18px] font-bold">الملف</p>
            <p className="mt-2 text-xs text-white/60">تحكم في سماتك ومكافآتك الخاصة</p>
          </button>
        </div>

        <button className="mt-1 rounded-[2rem] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-5 py-4 text-base font-bold uppercase text-slate-950 shadow-[0_0_35px_rgba(79,172,254,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(79,172,254,0.45)]">
          مكافأة يومية
        </button>
      </div>
    </section>
  );
}
