import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useState, useEffect } from 'react';

export default function Home() {
  const { gems, tickets, userName } = useGameStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const menuItems = [
    { to: '/tower', icon: '🗼', title: 'برج التحدي', desc: 'تسلق البرج وواجه الأعداء', color: 'from-yellow-900/40 to-slate-900', border: 'border-yellow-700/50', glow: 'card-glow-gold', arrow: 'text-yellow-500' },
    { to: '/summon', icon: '✨', title: 'استدعاء الأبطال', desc: 'استدع أبطالاً أسطوريين', color: 'from-purple-900/40 to-slate-900', border: 'border-purple-700/50', glow: 'card-glow-purple', arrow: 'text-purple-400' },
    { to: '/party', icon: '⚔️', title: 'تطوير الأبطال', desc: 'طوّر وجهّز فرقتك', color: 'from-blue-900/40 to-slate-900', border: 'border-blue-700/50', glow: '', arrow: 'text-blue-400' },
    { to: '/profile', icon: '👤', title: 'الملف الشخصي', desc: 'إحصائياتك وإنجازاتك', color: 'from-slate-800/50 to-slate-900', border: 'border-slate-600/50', glow: '', arrow: 'text-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-dark-pattern text-white overflow-hidden" dir="rtl">

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-purple-900/10 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 right-8 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-8 left-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay:'1s'}} />
        </div>

        <div className={`relative p-6 pt-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-yellow-500/80 text-xs tracking-widest uppercase font-bold">⚔️ عالم الظلال</p>
              <h1 className="text-5xl font-black mt-1 text-gradient-gold leading-tight">Pick<br/>Me Up</h1>
              <p className="text-slate-400 text-sm mt-2">
                أهلاً، <span className="text-yellow-400 font-bold">{userName}</span> 👋
              </p>
            </div>
            <div className="animate-float">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-900/60 to-purple-900/60 rounded-2xl border border-yellow-700/30 flex items-center justify-center text-4xl card-glow-gold">
                🌑
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 bg-slate-900/80 border border-yellow-900/40 rounded-2xl p-3 text-center animate-glow">
              <p className="text-2xl font-black text-gradient-gold">💎 {gems}</p>
              <p className="text-slate-500 text-xs mt-0.5">جواهر</p>
            </div>
            <div className="flex-1 bg-slate-900/80 border border-purple-900/40 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-purple-300">🎫 {tickets}</p>
              <p className="text-slate-500 text-xs mt-0.5">تذاكر</p>
            </div>
            <div className="flex-1 bg-slate-900/80 border border-red-900/40 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-red-300">🏆 1</p>
              <p className="text-slate-500 text-xs mt-0.5">المرتبة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quest Banner */}
      <div className={`mx-4 mb-4 bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/40 rounded-2xl p-3 flex items-center gap-3 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <div className="w-10 h-10 bg-red-900/50 rounded-xl flex items-center justify-center text-xl animate-pulse">🔥</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">مهمة يومية متاحة!</p>
          <p className="text-slate-400 text-xs">اهزم 5 أعداء واحصل على 200 جوهرة</p>
        </div>
        <span className="text-red-400 text-lg">←</span>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-3 pb-6">
        <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">القائمة</p>
        {menuItems.map((item, i) => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-4 bg-gradient-to-r ${item.color} border ${item.border} rounded-2xl p-4 ${item.glow} transition-all duration-300 active:scale-95 animate-slide-up`}
            style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-12 h-12 bg-slate-900/60 rounded-xl flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">{item.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
            </div>
            <span className={`text-xl ${item.arrow}`}>←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
