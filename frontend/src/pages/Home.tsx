import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

export default function Home() {
  const { gems, tickets, userName } = useGameStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-yellow-900/40 to-slate-950 p-6 pb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-800/20 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-yellow-500 text-xs tracking-widest uppercase font-bold">⚔️ عالم الظلال</p>
          <h1 className="text-4xl font-black mt-1 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Pick Me Up</h1>
          <p className="text-slate-400 text-sm mt-2">مرحباً، <span className="text-yellow-400 font-bold">{userName}</span></p>
        </div>
        {/* Stats */}
        <div className="relative flex gap-3 mt-4">
          <div className="flex-1 bg-slate-900/80 border border-yellow-900/50 rounded-2xl p-3 text-center">
            <p className="text-yellow-400 text-xl font-black">💎 {gems}</p>
            <p className="text-slate-500 text-xs mt-1">جواهر</p>
          </div>
          <div className="flex-1 bg-slate-900/80 border border-yellow-900/50 rounded-2xl p-3 text-center">
            <p className="text-yellow-400 text-xl font-black">🎫 {tickets}</p>
            <p className="text-slate-500 text-xs mt-1">تذاكر</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-3 -mt-4">
        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-4">القائمة الرئيسية</p>

        <Link to="/tower" className="flex items-center gap-4 bg-gradient-to-r from-yellow-900/30 to-slate-900 border border-yellow-800/40 rounded-2xl p-4 hover:border-yellow-600/60 transition">
          <div className="w-12 h-12 bg-yellow-900/50 rounded-xl flex items-center justify-center text-2xl">🗼</div>
          <div className="flex-1">
            <p className="font-bold text-white">برج التحدي</p>
            <p className="text-slate-400 text-xs mt-0.5">تسلق البرج وواجه الأعداء</p>
          </div>
          <span className="text-yellow-600">←</span>
        </Link>

        <Link to="/summon" className="flex items-center gap-4 bg-gradient-to-r from-purple-900/30 to-slate-900 border border-purple-800/40 rounded-2xl p-4 hover:border-purple-600/60 transition">
          <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl">✨</div>
          <div className="flex-1">
            <p className="font-bold text-white">استدعاء الأبطال</p>
            <p className="text-slate-400 text-xs mt-0.5">استدع أبطالاً أسطوريين</p>
          </div>
          <span className="text-purple-600">←</span>
        </Link>

        <Link to="/party" className="flex items-center gap-4 bg-gradient-to-r from-blue-900/30 to-slate-900 border border-blue-800/40 rounded-2xl p-4 hover:border-blue-600/60 transition">
          <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center text-2xl">⚔️</div>
          <div className="flex-1">
            <p className="font-bold text-white">فرقتي</p>
            <p className="text-slate-400 text-xs mt-0.5">أدر أبطالك وقوّي فرقتك</p>
          </div>
          <span className="text-blue-600">←</span>
        </Link>

        <Link to="/profile" className="flex items-center gap-4 bg-gradient-to-r from-slate-800/50 to-slate-900 border border-slate-700/40 rounded-2xl p-4 hover:border-slate-500/60 transition">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">👤</div>
          <div className="flex-1">
            <p className="font-bold text-white">الملف الشخصي</p>
            <p className="text-slate-400 text-xs mt-0.5">إحصائياتك وإنجازاتك</p>
          </div>
          <span className="text-slate-600">←</span>
        </Link>
      </div>
    </div>
  );
}
