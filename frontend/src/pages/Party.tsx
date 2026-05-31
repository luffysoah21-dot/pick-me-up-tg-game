import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rarityColors } from '../data/heroes';
import { useGameStore } from '../store/useGameStore';

export default function Party() {
  const navigate = useNavigate();
  const { gems, playerHeroes, loadPlayerHeroes, party, activeHeroId, setActiveHero, isLoading } = useGameStore();
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);

  useEffect(() => {
    if (playerHeroes.length === 0) {
      loadPlayerHeroes();
    }
  }, [playerHeroes.length, loadPlayerHeroes]);

  const heroCards = useMemo(
    () => playerHeroes.map((entry) => ({
      ...entry.hero,
      playerHeroId: entry.id,
      heroId: entry.hero_id,
      level: entry.level,
      stars: entry.stars,
    })),
    [playerHeroes]
  );

  const selectedHero = useMemo(
    () => heroCards.find((hero) => hero.playerHeroId === selectedHeroId) ?? null,
    [heroCards, selectedHeroId]
  );

  const openDetails = (heroId: string) => setSelectedHeroId(heroId);
  const closeDetails = () => setSelectedHeroId(null);

  if (isLoading && playerHeroes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
        <div className="space-y-4">
          <div className="h-28 rounded-[2rem] bg-slate-900/80 animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 rounded-[2rem] bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (heroCards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 flex items-center justify-center" dir="rtl">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-5xl mb-4">🛡️</p>
          <p className="text-xl font-black text-white">لا يوجد أبطال - اذهب للاستدعاء</p>
          <p className="mt-2 text-slate-400">ابدأ مغامرتك واستدعِ بطلًا جديدًا الآن.</p>
          <button onClick={() => navigate('/summon')} className="mt-6 w-full rounded-[2rem] bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-bold text-slate-950">
            استدعاء الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
      <div className="bg-gradient-to-b from-blue-900/30 to-slate-900 border border-blue-800/40 rounded-2xl p-4 text-center mb-4 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
        <p className="text-blue-300 text-xs uppercase tracking-[0.3em]">فرقتي</p>
        <h1 className="text-3xl font-black mt-2">عرض الأبطال</h1>
        <p className="mt-2 text-sm text-slate-400">اختر بطلًا، عيّنه رئيسيًا، واستعد للمعركة.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {heroCards.map((hero) => {
          const isActive = activeHeroId === hero.playerHeroId;
          return (
            <button
              key={hero.playerHeroId}
              type="button"
              onClick={() => openDetails(hero.playerHeroId)}
              className={`rounded-[2rem] border p-4 text-right transition active:scale-95 ${isActive ? 'border-amber-300 bg-amber-400/10 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 'border-slate-800 bg-slate-900/90 hover:border-slate-600'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-4xl leading-none">{hero.image}</span>
                <div className="text-left">
                  <p className="font-black text-white">{hero.name}</p>
                  <p className="text-xs text-slate-400">Lv.{hero.level} • {hero.rarity}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={`text-sm ${idx < hero.stars ? 'text-amber-300' : 'text-slate-700'}`}>★</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">حصيلة الفرقة</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">عدد الأبطال</p>
            <p className="mt-2 text-2xl font-black text-white">{heroCards.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">الذهب</p>
            <p className="mt-2 text-2xl font-black text-amber-300">{gems}</p>
          </div>
        </div>
      </div>

      {selectedHero && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">تفاصيل البطل</p>
                <h2 className="text-2xl font-black text-white mt-2">{selectedHero.name}</h2>
                <p className="text-xs text-slate-500">{selectedHero.role} • {selectedHero.element}</p>
              </div>
              <span className="text-5xl">{selectedHero.image}</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-white/80">
              <div className="rounded-2xl bg-white/5 px-2 py-2">⚔️ {selectedHero.attack}</div>
              <div className="rounded-2xl bg-white/5 px-2 py-2">🛡️ {selectedHero.defense}</div>
              <div className="rounded-2xl bg-white/5 px-2 py-2">❤️ {selectedHero.hp}</div>
            </div>

            <p className="mt-4 text-sm text-slate-400">{selectedHero.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveHero(selectedHero.playerHeroId)}
                className="flex-1 rounded-[1.5rem] bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-3 text-sm font-bold text-slate-950 transition active:scale-95"
              >
                تعيين كبطل رئيسي
              </button>
              <button
                type="button"
                onClick={closeDetails}
                className="flex-1 rounded-[1.5rem] border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white transition active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
