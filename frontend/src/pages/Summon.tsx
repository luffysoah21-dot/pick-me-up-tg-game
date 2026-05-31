import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { availableHeroes, Hero } from '../data/heroes';
import { useGameStore } from '../store/useGameStore';

const rarityWeights: Record<string, number> = {
  أسطوري: 2,
  ملحمي: 6,
  نادر: 17,
  عادي: 45,
};

const rarityPalette: Record<string, string> = {
  أسطوري: 'border-amber-400/70',
  ملحمي: 'border-fuchsia-400/70',
  نادر: 'border-sky-400/70',
  عادي: 'border-slate-500/70',
};

const SINGLE_COST = 100;
const MULTI_COST = 900;

function getRarityPool(heroList: Hero[]) {
  const entries = heroList.flatMap((hero) => Array(Math.max(1, rarityWeights[hero.rarity] ?? 1)).fill(hero));
  return entries;
}

export default function Summon() {
  const navigate = useNavigate();
  const { gems, addGems, summonHero, setToast } = useGameStore();
  const [results, setResults] = useState<Hero[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const pool = useMemo(() => getRarityPool(availableHeroes), []);

  const chooseHero = useCallback(() => {
    return pool[Math.floor(Math.random() * pool.length)];
  }, [pool]);

  const summon = useCallback(
    async (count: number) => {
      const cost = count === 1 ? SINGLE_COST : MULTI_COST;
      if (gems < cost) {
        setToast(`تحتاج ${cost} جوهرة!`, 'error');
        return;
      }

      addGems(-cost);
      setIsRunning(true);
      setIsRevealed(false);
      setShowDetails(false);
      setResults([]);

      setTimeout(() => {
        const pulled = Array.from({ length: count }, () => chooseHero());
        setResults(pulled);
        setIsRunning(false);
        setTimeout(() => {
          setIsRevealed(true);
          setShowDetails(true);
        }, 500);
      }, 1200);
    },
    [gems, addGems, chooseHero, setToast]
  );

  const handleSaveHero = useCallback(
    async (hero: Hero) => {
      const saved = await summonHero(hero.id);
      if (!saved) return;
      setToast('تم استدعاء البطل بنجاح! تحقق من فرقتك', 'success');
      navigate('/party');
    },
    [navigate, setToast, summonHero]
  );

  const handleResummon = useCallback(() => {
    setResults([]);
    setIsRevealed(false);
    setShowDetails(false);
  }, []);

  const canSummonSingle = gems >= SINGLE_COST;
  const canSummonMulti = gems >= MULTI_COST;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
      <div className="bg-gradient-to-b from-purple-900/30 to-slate-900 border border-purple-800/40 rounded-3xl p-5 mb-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-purple-300 text-xs uppercase tracking-[0.25em]">✨ بوابة الاستدعاء</p>
            <h1 className="text-3xl font-black mt-2 text-white">استدعاء الأبطال</h1>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-right shadow-[inset_0_0_25px_rgba(255,255,255,0.05)]">
            <p className="text-[10px] uppercase text-slate-400">رصيدك</p>
            <p className="mt-1 text-xl font-black text-yellow-300">💎 {gems}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <button
          type="button"
          disabled={!canSummonSingle || isRunning}
          onClick={() => summon(1)}
          className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-700 to-purple-900 px-4 py-5 text-right text-white shadow-[0_0_30px_rgba(126,58,237,0.28)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-sm text-white/60">استدعاء سريع</p>
          <p className="mt-2 text-lg font-bold">✨ واحد — 💎 {SINGLE_COST}</p>
        </button>
        <button
          type="button"
          disabled={!canSummonMulti || isRunning}
          onClick={() => summon(10)}
          className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-amber-700 to-orange-900 px-4 py-5 text-right text-white shadow-[0_0_30px_rgba(245,158,11,0.28)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-sm text-white/60">مجموعة استدعاء</p>
          <p className="mt-2 text-lg font-bold">🌟 ×10 — 💎 {MULTI_COST}</p>
        </button>
      </div>

      {isRunning && (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-center shadow-xl shadow-slate-950/40">
          <p className="text-4xl mb-3 animate-bounce">✨</p>
          <p className="font-black text-white">جاري فتح البطاقات...</p>
        </div>
      )}

      {isRevealed && (
        <div className="space-y-4 mb-4">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/40">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">نتيجة الاستدعاء</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {results.map((hero, index) => (
                <article key={`${hero.id}-${index}`} className={`rounded-[1.75rem] border ${rarityPalette[hero.rarity]} bg-gradient-to-br from-slate-950/90 to-slate-900/95 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)]`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-4xl">{hero.image}</span>
                    <span className="text-xs font-black uppercase text-slate-300">{hero.rarity}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-black text-white">{hero.name}</h2>
                  <p className="mt-1 text-xs text-slate-400">{hero.role} · {hero.element}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-white/80">
                    <span className="rounded-2xl bg-white/5 px-2 py-1">⚔️ {hero.attack}</span>
                    <span className="rounded-2xl bg-white/5 px-2 py-1">🛡️ {hero.defense}</span>
                    <span className="rounded-2xl bg-white/5 px-2 py-1">❤️ {hero.hp}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{hero.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((hero, index) => (
              <button
                key={`add-${hero.id}-${index}`}
                type="button"
                onClick={() => handleSaveHero(hero)}
                className="rounded-[2rem] bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-4 text-white font-black transition active:scale-95"
              >
                أضف {hero.name} للفريق
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResummon}
            className="w-full rounded-[2rem] border border-white/10 bg-slate-900/90 px-4 py-4 text-white text-sm font-semibold transition active:scale-95"
          >
            استدعاء مرة أخرى
          </button>
        </div>
      )}

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/30">
        <p className="text-slate-400 text-xs font-bold mb-3">📊 نسب الاستدعاء</p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>أسطوري: 2%</li>
          <li>ملحمي: 6%</li>
          <li>نادر: 17%</li>
          <li>عادي: 45%</li>
        </ul>
      </div>
    </div>
  );
}
