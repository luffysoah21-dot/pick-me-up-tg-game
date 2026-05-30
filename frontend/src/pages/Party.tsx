import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { availableHeroes, rarityColors } from '../data/heroes';

export default function Party() {
  const { collection, party, togglePartyMember } = useGameStore();

  const owned = useMemo(() => {
    const map = new Map<string, { hero: (typeof availableHeroes)[number]; count: number }>();
    collection.forEach((hero) => {
      const existing = map.get(hero.id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(hero.id, { hero, count: 1 });
      }
    });
    return Array.from(map.values());
  }, [collection]);

  const partyHeroes = party
    .map((id) => owned.find((entry) => entry.hero.id === id))
    .filter(Boolean) as { hero: (typeof availableHeroes)[number]; count: number }[];

  const stats = useMemo(
    () =>
      partyHeroes.reduce(
        (acc, entry) => {
          acc.attack += entry.hero.attack;
          acc.defense += entry.hero.defense;
          acc.hp += entry.hero.hp;
          return acc;
        },
        { attack: 0, defense: 0, hp: 0 }
      ),
    [partyHeroes]
  );

  return (
    <section className="space-y-6 text-right">
      <div className="rounded-[2rem] border border-violet-400/15 bg-slate-950/90 p-6 shadow-xl shadow-violet-500/10">
        <h2 className="text-3xl font-black text-violet-200">فرقتي</h2>
        <p className="mt-3 text-slate-400 leading-7">
          اختر حتى 5 أبطال من مجموعتك، ادمج الأدوار، وقم بتعديل الفريق قبل الصعود إلى برج التحدي.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">قوة الفريق</p>
                <h3 className="mt-2 text-3xl font-black text-white">{partyHeroes.length} / 5</h3>
              </div>
              <div className="grid gap-2 text-left text-slate-300 sm:grid-cols-3">
                <span className="rounded-3xl bg-slate-950/80 px-3 py-2 text-xs">هجوم {stats.attack}</span>
                <span className="rounded-3xl bg-slate-950/80 px-3 py-2 text-xs">دفاع {stats.defense}</span>
                <span className="rounded-3xl bg-slate-950/80 px-3 py-2 text-xs">صحة {stats.hp}</span>
              </div>
            </div>
          </div>

          {partyHeroes.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 text-slate-400 shadow-2xl shadow-slate-950/40">
              اختر أبطالاً من مجموعتك لتبدأ تشكيل فريق قوي.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {partyHeroes.map((entry) => (
                <div key={entry.hero.id} className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{entry.hero.rarity}</p>
                      <h3 className="mt-2 text-xl font-bold text-white">{entry.hero.name}</h3>
                    </div>
                    <span className={`rounded-3xl px-3 py-1 text-xs font-semibold ${rarityColors[entry.hero.rarity]}`}>
                      {entry.hero.role}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">{entry.hero.description}</p>
                  <div className="mt-4 grid gap-2 text-slate-300 sm:grid-cols-3">
                    <span className="rounded-3xl bg-slate-900/80 px-3 py-2 text-xs">هجوم {entry.hero.attack}</span>
                    <span className="rounded-3xl bg-slate-900/80 px-3 py-2 text-xs">دفاع {entry.hero.defense}</span>
                    <span className="rounded-3xl bg-slate-900/80 px-3 py-2 text-xs">صحة {entry.hero.hp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">مجموع الأبطال</p>
          <div className="mt-4 space-y-3">
            {owned.length === 0 ? (
              <p className="text-slate-400">لم تملك أي أبطال بعد. عد إلى الاستدعاء لفتح المزيد.</p>
            ) : (
              owned.map((entry) => {
                const isSelected = party.includes(entry.hero.id);
                return (
                  <div key={entry.hero.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">{entry.hero.name}</h4>
                        <p className="text-xs text-slate-500">{entry.hero.rarity} • {entry.hero.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePartyMember(entry.hero.id)}
                        className={`rounded-3xl px-4 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'إزالة' : party.length < 5 ? 'إضافة' : 'ممتلئ'}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">الكمية: {entry.count}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40">
        <p className="text-slate-400">الخطوة التالية</p>
        <Link
          to="/tower"
          className="mt-4 inline-flex rounded-3xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          الصعود إلى برج التحدي
        </Link>
      </div>
    </section>
  );
}
