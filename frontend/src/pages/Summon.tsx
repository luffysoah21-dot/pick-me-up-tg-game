import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { availableHeroes, Hero, rarityColors } from '../data/heroes';
import { useGameStore } from '../store/useGameStore';

const rarityWeights: Record<Hero['rarity'], number> = {
  عادي: 56,
  نادر: 30,
  ملحمي: 12,
  أسطوري: 2,
};

function selectRarity(): Hero['rarity'] {
  const roll = Math.random() * 100;
  if (roll < 2) return 'أسطوري';
  if (roll < 14) return 'ملحمي';
  if (roll < 44) return 'نادر';
  return 'عادي';
}

function summonHero(): Hero {
  const rarity = selectRarity();
  const choices = availableHeroes.filter((hero) => hero.rarity === rarity);
  return choices[Math.floor(Math.random() * choices.length)];
}

export default function Summon() {
  const { gems, tickets, summonWithGems, summonWithTickets, collection } = useGameStore();
  const [isSummoning, setIsSummoning] = useState(false);
  const [lastHero, setLastHero] = useState<Hero | null>(null);
  const [message, setMessage] = useState('');

  const uniqueCount = useMemo(() => new Set(collection.map((hero) => hero.id)).size, [collection]);

  const doSummon = async (method: 'ticket' | 'gems') => {
    if (isSummoning) return;
    setIsSummoning(true);
    setMessage('يجري فتح البوابة...');
    const hero = summonHero();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = method === 'ticket' ? summonWithTickets(hero) : summonWithGems(hero);
    if (!success) {
      setMessage('لا توجد موارد كافية للاستدعاء. حاول لاحقاً.');
      setIsSummoning(false);
      return;
    }

    setLastHero(hero);
    setMessage(`لقد استدعيت ${hero.name} - ${hero.rarity}!`);
    setIsSummoning(false);
  };

  return (
    <section className="space-y-6 text-right">
      <div className="rounded-[2rem] border border-violet-400/15 bg-slate-950/90 p-6 shadow-xl shadow-violet-500/10">
        <h2 className="text-3xl font-black text-violet-200">بوابة الاستدعاء</h2>
        <p className="mt-3 text-slate-400 leading-7">
          استدعِ أبطالك باستخدام التذاكر أو الجواهر. كل استدعاء يحمل احتمالية للحصول على بطل نادر أو أسطوري.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">موارد الاستدعاء</p>
              <h3 className="mt-3 text-3xl font-black text-white">{tickets} تذكرة / {gems} جوهرة</h3>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
              أبطال فريدون: {uniqueCount}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
              <p className="text-sm text-slate-500">نادر</p>
              <p className="mt-2 text-xl font-semibold text-sky-200">30%</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
              <p className="text-sm text-slate-500">ملحمي</p>
              <p className="mt-2 text-xl font-semibold text-fuchsia-200">12%</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
              <p className="text-sm text-slate-500">أسطوري</p>
              <p className="mt-2 text-xl font-semibold text-amber-200">2%</p>
            </div>
          </div>

          <div className="space-y-3 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-500">سجل الاستدعاء</p>
            <p className="text-base text-slate-300">{message || 'اضغط على زر استدعاء لرؤية البطل الجديد.'}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => doSummon('ticket')}
              disabled={isSummoning || tickets < 10}
              className="rounded-3xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              استدعاء 10 تذاكر
            </button>
            <button
              type="button"
              onClick={() => doSummon('gems')}
              disabled={isSummoning || gems < 100}
              className="rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              استدعاء 100 جوهرة
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/95 p-6 shadow-2xl shadow-slate-950/70">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/50 bg-slate-950/90 p-5">
            <AnimatePresence mode="wait">
              {lastHero ? (
                <motion.div
                  key={lastHero.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75, y: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="space-y-4 text-center"
                >
                  <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br ${lastHero.accent} text-4xl shadow-2xl shadow-slate-950/30`}>
                    {lastHero.image}
                  </div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{lastHero.rarity}</p>
                  <h3 className="text-2xl font-black text-white">{lastHero.name}</h3>
                  <p className="text-slate-400">{lastHero.role} – {lastHero.element}</p>
                  <p className="mx-auto max-w-sm text-sm text-slate-300">{lastHero.description}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4 text-center"
                >
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-slate-900 text-4xl text-slate-400 shadow-2xl shadow-slate-950/20">
                    🔮
                  </div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">لا يوجد بطل بعد</p>
                  <h3 className="text-2xl font-black text-white">استدعِ لتكشف البطل</h3>
                  <p className="mx-auto max-w-sm text-sm text-slate-300">استخدم التذاكر أو الجواهر لفتح سجل الاستدعاء.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">نصيحة</p>
          <p className="mt-2 text-slate-400">الأبطال الأسطوريون نادرون جداً، لكن الاستمرار في الاستدعاء يزيد من فرصك لبناء فرقة فانتازية قوية.</p>
        </div>
        <Link
          to="/party"
          className="inline-flex rounded-3xl bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900"
        >
          انتقل إلى تشكيل الفريق
        </Link>
      </div>
    </section>
  );
}
