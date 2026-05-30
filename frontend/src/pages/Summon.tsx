import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const heroes = [
  { id: 'h1', name: 'كايرو المظلم', rank: 'SSS', emoji: '🌑', element: 'ظلام', attack: 95, defense: 70, speed: 85, skill: 'ضربة الفناء', color: 'from-purple-900 to-slate-900', border: 'border-purple-500' },
  { id: 'h2', name: 'سيرا النارية', rank: 'SS', emoji: '🔥', element: 'نار', attack: 88, defense: 60, speed: 90, skill: 'عاصفة اللهب', color: 'from-red-900 to-slate-900', border: 'border-red-500' },
  { id: 'h3', name: 'ثالوس الجليدي', rank: 'SS', emoji: '❄️', element: 'جليد', attack: 82, defense: 78, speed: 72, skill: 'درع الثلج', color: 'from-blue-900 to-slate-900', border: 'border-blue-500' },
  { id: 'h4', name: 'زيفر الريح', rank: 'S', emoji: '💨', element: 'ريح', attack: 75, defense: 65, speed: 98, skill: 'شفرة الهواء', color: 'from-cyan-900 to-slate-900', border: 'border-cyan-500' },
  { id: 'h5', name: 'أورا الذهبية', rank: 'S', emoji: '⚡', element: 'برق', attack: 78, defense: 68, speed: 92, skill: 'صاعقة السماء', color: 'from-yellow-900 to-slate-900', border: 'border-yellow-500' },
  { id: 'h6', name: 'نيكس الظل', rank: 'A', emoji: '🗡️', element: 'ظل', attack: 70, defense: 72, speed: 80, skill: 'طعنة الظلام', color: 'from-slate-800 to-slate-900', border: 'border-slate-500' },
  { id: 'h7', name: 'ليرا الطبيبة', rank: 'A', emoji: '💚', element: 'طبيعة', attack: 55, defense: 85, speed: 70, skill: 'شفاء مقدس', color: 'from-green-900 to-slate-900', border: 'border-green-500' },
  { id: 'h8', name: 'ركس المحارب', rank: 'B', emoji: '⚔️', element: 'أرض', attack: 65, defense: 80, speed: 60, skill: 'ضربة الأرض', color: 'from-amber-900 to-slate-900', border: 'border-amber-600' },
];

const rankColors: Record<string, string> = {
  SSS: 'text-purple-300 bg-purple-900/50 border-purple-500',
  SS: 'text-red-300 bg-red-900/50 border-red-500',
  S: 'text-yellow-300 bg-yellow-900/50 border-yellow-500',
  A: 'text-blue-300 bg-blue-900/50 border-blue-500',
  B: 'text-slate-300 bg-slate-800/50 border-slate-500',
};

const SINGLE_COST = 100;
const MULTI_COST = 900;

export default function Summon() {
  const { gems, collection, addGems, togglePartyMember } = useGameStore();
  const [pulled, setPulled] = useState<typeof heroes>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const getRandom = () => {
    const rand = Math.random();
    if (rand < 0.02) return heroes.filter(h => h.rank === 'SSS');
    if (rand < 0.08) return heroes.filter(h => h.rank === 'SS');
    if (rand < 0.25) return heroes.filter(h => h.rank === 'S');
    if (rand < 0.55) return heroes.filter(h => h.rank === 'A');
    return heroes.filter(h => h.rank === 'B');
  };

  const summon = (count: number) => {
    const cost = count === 1 ? SINGLE_COST : MULTI_COST;
    if (gems < cost) { alert(`تحتاج ${cost} جوهرة!`); return; }
    addGems(-cost);
    setIsAnimating(true);
    setShowResult(false);
    setTimeout(() => {
      const results = Array.from({ length: count }, () => {
        const pool = getRandom();
        return pool[Math.floor(Math.random() * pool.length)];
      });
      setPulled(results);
      setIsAnimating(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-slate-900 border border-purple-800/40 rounded-2xl p-5 text-center mb-4">
        <p className="text-purple-400 text-xs tracking-widest">✨ بوابة الاستدعاء</p>
        <h1 className="text-3xl font-black mt-1 bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">استدعاء الأبطال</h1>
        <p className="text-yellow-400 font-bold mt-2">💎 {gems} جوهرة</p>
      </div>

      {/* Animation */}
      {isAnimating && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-8xl animate-bounce">✨</div>
            <p className="text-white text-xl font-bold mt-4 animate-pulse">جاري الاستدعاء...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {showResult && (
        <div className="mb-4">
          <p className="text-center text-yellow-400 font-bold mb-3">🎉 نتائج الاستدعاء</p>
          <div className="grid grid-cols-2 gap-2">
            {pulled.map((hero, i) => (
              <div key={i} className={`bg-gradient-to-b ${hero.color} border ${hero.border} rounded-2xl p-3`}>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{hero.emoji}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rankColors[hero.rank]}`}>{hero.rank}</span>
                </div>
                <p className="font-bold text-white mt-2 text-sm">{hero.name}</p>
                <p className="text-slate-400 text-xs">{hero.element}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">⚔️ {hero.attack}</span>
                    <span className="text-blue-400">🛡️ {hero.defense}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowResult(false)} className="w-full mt-3 bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-bold">
            إغلاق
          </button>
        </div>
      )}

      {/* Summon Buttons */}
      {!showResult && (
        <div className="space-y-3 mb-4">
          <button onClick={() => summon(1)} className="w-full bg-gradient-to-r from-purple-700 to-purple-900 border border-purple-600 text-white py-4 rounded-2xl font-black text-lg">
            ✨ استدعاء واحد — 💎 {SINGLE_COST}
          </button>
          <button onClick={() => summon(10)} className="w-full bg-gradient-to-r from-yellow-700 to-yellow-900 border border-yellow-600 text-white py-4 rounded-2xl font-black text-lg">
            🌟 استدعاء ×10 — 💎 {MULTI_COST}
          </button>
        </div>
      )}

      {/* Rates */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <p className="text-slate-400 text-xs font-bold mb-2">📊 نسب الاستدعاء</p>
        <div className="space-y-1">
          {[['SSS', '2%'], ['SS', '6%'], ['S', '17%'], ['A', '30%'], ['B', '45%']].map(([rank, rate]) => (
            <div key={rank} className="flex justify-between text-xs">
              <span className={`font-black ${rankColors[rank].split(' ')[0]}`}>{rank}</span>
              <span className="text-slate-400">{rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collection */}
      <div>
        <p className="text-slate-400 text-xs font-bold mb-2">📚 جميع الأبطال ({heroes.length})</p>
        <div className="grid grid-cols-2 gap-2">
          {heroes.map(hero => {
            const owned = collection.includes(hero.id);
            return (
              <div key={hero.id} className={`bg-gradient-to-b ${hero.color} border ${hero.border} rounded-2xl p-3 ${!owned ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{hero.emoji}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rankColors[hero.rank]}`}>{hero.rank}</span>
                </div>
                <p className="font-bold text-white mt-1 text-sm">{hero.name}</p>
                <p className="text-slate-400 text-xs">{hero.skill}</p>
                {owned && (
                  <button onClick={() => togglePartyMember(hero.id)}
                    className="mt-2 w-full text-xs bg-slate-800/50 border border-slate-600 text-slate-300 py-1 rounded-lg">
                    + إضافة للفرقة
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
