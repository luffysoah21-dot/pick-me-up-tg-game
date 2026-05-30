import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const heroData = [
  { id: 'h1', name: 'كايرو المظلم', rank: 'SSS', emoji: '🌑', element: 'ظلام', baseAtk: 95, baseDef: 70, baseSpd: 85, skill: 'ضربة الفناء' },
  { id: 'h2', name: 'سيرا النارية', rank: 'SS', emoji: '🔥', element: 'نار', baseAtk: 88, baseDef: 60, baseSpd: 90, skill: 'عاصفة اللهب' },
  { id: 'h3', name: 'ثالوس الجليدي', rank: 'SS', emoji: '❄️', element: 'جليد', baseAtk: 82, baseDef: 78, baseSpd: 72, skill: 'درع الثلج' },
  { id: 'h4', name: 'زيفر الريح', rank: 'S', emoji: '💨', element: 'ريح', baseAtk: 75, baseDef: 65, baseSpd: 98, skill: 'شفرة الهواء' },
  { id: 'h5', name: 'أورا الذهبية', rank: 'S', emoji: '⚡', element: 'برق', baseAtk: 78, baseDef: 68, baseSpd: 92, skill: 'صاعقة السماء' },
  { id: 'h6', name: 'نيكس الظل', rank: 'A', emoji: '🗡️', element: 'ظل', baseAtk: 70, baseDef: 72, baseSpd: 80, skill: 'طعنة الظلام' },
  { id: 'h7', name: 'ليرا الطبيبة', rank: 'A', emoji: '💚', element: 'طبيعة', baseAtk: 55, baseDef: 85, baseSpd: 70, skill: 'شفاء مقدس' },
  { id: 'h8', name: 'ركس المحارب', rank: 'B', emoji: '⚔️', element: 'أرض', baseAtk: 65, baseDef: 80, baseSpd: 60, skill: 'ضربة الأرض' },
];

const rankColors: Record<string, string> = {
  SSS: 'text-purple-300 border-purple-500 bg-purple-900/30',
  SS: 'text-red-300 border-red-500 bg-red-900/30',
  S: 'text-yellow-300 border-yellow-500 bg-yellow-900/30',
  A: 'text-blue-300 border-blue-500 bg-blue-900/30',
  B: 'text-slate-300 border-slate-500 bg-slate-800/30',
};

const UPGRADE_COST = 50;
const ASCEND_COST = 300;
const EQUIP_COST = 150;

const equipments = [
  { id: 'e1', name: 'سيف الظلام', emoji: '🗡️', bonus: '+20 هجوم', stat: 'atk', value: 20 },
  { id: 'e2', name: 'درع الفولاذ', emoji: '🛡️', bonus: '+20 دفاع', stat: 'def', value: 20 },
  { id: 'e3', name: 'حذاء الريح', emoji: '👟', bonus: '+20 سرعة', stat: 'spd', value: 20 },
  { id: 'e4', name: 'خاتم النار', emoji: '💍', bonus: '+15 كل الإحصاءات', stat: 'all', value: 15 },
];

export default function Party() {
  const { gems, collection, addGems } = useGameStore();
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [stars, setStars] = useState<Record<string, number>>({});
  const [equips, setEquips] = useState<Record<string, string[]>>({});
  const [tab, setTab] = useState<'upgrade' | 'ascend' | 'equip'>('upgrade');

  const ownedHeroes = heroData.filter(h => collection.includes(h.id));
  const hero = heroData.find(h => h.id === selectedHero);
  const level = levels[selectedHero || ''] || 1;
  const star = stars[selectedHero || ''] || 1;
  const heroEquips = equips[selectedHero || ''] || [];

  const getStats = () => {
    if (!hero) return { atk: 0, def: 0, spd: 0 };
    const lvlBonus = (level - 1) * 3;
    const starBonus = (star - 1) * 10;
    let atk = hero.baseAtk + lvlBonus + starBonus;
    let def = hero.baseDef + lvlBonus + starBonus;
    let spd = hero.baseSpd + lvlBonus + starBonus;
    heroEquips.forEach(eid => {
      const eq = equipments.find(e => e.id === eid);
      if (eq) {
        if (eq.stat === 'atk') atk += eq.value;
        if (eq.stat === 'def') def += eq.value;
        if (eq.stat === 'spd') spd += eq.value;
        if (eq.stat === 'all') { atk += eq.value; def += eq.value; spd += eq.value; }
      }
    });
    return { atk, def, spd };
  };

  const upgrade = () => {
    if (gems < UPGRADE_COST) { alert('تحتاج 50 جوهرة!'); return; }
    if (level >= 100) { alert('وصلت الحد الأقصى!'); return; }
    addGems(-UPGRADE_COST);
    setLevels(prev => ({ ...prev, [selectedHero!]: level + 1 }));
  };

  const ascend = () => {
    if (gems < ASCEND_COST) { alert('تحتاج 300 جوهرة!'); return; }
    if (star >= 6) { alert('وصلت الحد الأقصى!'); return; }
    addGems(-ASCEND_COST);
    setStars(prev => ({ ...prev, [selectedHero!]: star + 1 }));
  };

  const equip = (eid: string) => {
    if (heroEquips.includes(eid)) {
      setEquips(prev => ({ ...prev, [selectedHero!]: heroEquips.filter(e => e !== eid) }));
    } else {
      if (gems < EQUIP_COST) { alert('تحتاج 150 جوهرة!'); return; }
      addGems(-EQUIP_COST);
      setEquips(prev => ({ ...prev, [selectedHero!]: [...heroEquips, eid] }));
    }
  };

  const stats = getStats();

  if (ownedHeroes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <p className="text-6xl mb-4">🎭</p>
          <p className="text-xl font-bold text-slate-300">لا تملك أبطالاً بعد</p>
          <p className="text-slate-500 mt-2">اذهب لبوابة الاستدعاء أولاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
      <div className="bg-gradient-to-b from-blue-900/30 to-slate-900 border border-blue-800/40 rounded-2xl p-4 text-center mb-4">
        <p className="text-blue-400 text-xs tracking-widest">⚔️ إدارة الفرقة</p>
        <h1 className="text-3xl font-black mt-1 text-white">تطوير الأبطال</h1>
        <p className="text-yellow-400 font-bold mt-1">💎 {gems} جوهرة</p>
      </div>

      {/* Hero List */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {ownedHeroes.map(h => (
          <button key={h.id} onClick={() => setSelectedHero(h.id)}
            className={`rounded-xl p-2 border text-center transition ${selectedHero === h.id ? rankColors[h.rank] : 'bg-slate-900 border-slate-700'}`}>
            <p className="text-2xl">{h.emoji}</p>
            <p className="text-xs text-white font-bold truncate">{h.name.split(' ')[0]}</p>
            <p className={`text-xs font-black ${rankColors[h.rank].split(' ')[0]}`}>{h.rank}</p>
          </button>
        ))}
      </div>

      {hero && (
        <div className="space-y-3">
          {/* Hero Card */}
          <div className={`border rounded-2xl p-4 ${rankColors[hero.rank]}`}>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{hero.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-white text-lg">{hero.name}</p>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rankColors[hero.rank]}`}>{hero.rank}</span>
                </div>
                <p className="text-slate-400 text-xs">{hero.element} • {hero.skill}</p>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={i} className={`text-sm ${i < star ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xl">Lv.{level}</p>
                <p className="text-slate-400 text-xs">/100</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-slate-900/50 rounded-xl p-2 text-center">
                <p className="text-red-400 font-black">⚔️ {stats.atk}</p>
                <p className="text-slate-500 text-xs">هجوم</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-2 text-center">
                <p className="text-blue-400 font-black">🛡️ {stats.def}</p>
                <p className="text-slate-500 text-xs">دفاع</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-2 text-center">
                <p className="text-green-400 font-black">💨 {stats.spd}</p>
                <p className="text-slate-500 text-xs">سرعة</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900 rounded-xl p-1">
            {[['upgrade', '⬆️ رفع المستوى'], ['ascend', '⭐ الصعود'], ['equip', '🗡️ التجهيز']].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t as any)}
                className={`py-2 rounded-lg text-xs font-bold transition ${tab === t ? 'bg-yellow-700 text-white' : 'text-slate-400'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Upgrade Tab */}
          {tab === 'upgrade' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="font-bold text-white">⬆️ رفع المستوى</p>
              <div className="bg-slate-800 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full transition-all" style={{ width: `${level}%` }} />
              </div>
              <p className="text-slate-400 text-sm">المستوى الحالي: <span className="text-white font-bold">{level}/100</span></p>
              <p className="text-slate-400 text-sm">كل مستوى يضيف: <span className="text-green-400">+3 لكل الإحصاءات</span></p>
              <button onClick={upgrade} disabled={level >= 100}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-3 rounded-xl font-bold disabled:opacity-40">
                ⬆️ رفع المستوى — 💎 {UPGRADE_COST}
              </button>
            </div>
          )}

          {/* Ascend Tab */}
          {tab === 'ascend' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="font-bold text-white">⭐ الصعود</p>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className={`text-3xl ${i < star ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
                ))}
              </div>
              <p className="text-slate-400 text-sm text-center">النجوم الحالية: <span className="text-yellow-400 font-bold">{star}/6</span></p>
              <p className="text-slate-400 text-sm text-center">كل نجمة تضيف: <span className="text-green-400">+10 لكل الإحصاءات</span></p>
              <button onClick={ascend} disabled={star >= 6}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-xl font-bold disabled:opacity-40">
                ⭐ صعود — 💎 {ASCEND_COST}
              </button>
            </div>
          )}

          {/* Equip Tab */}
          {tab === 'equip' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="font-bold text-white">🗡️ التجهيز</p>
              <div className="space-y-2">
                {equipments.map(eq => {
                  const equipped = heroEquips.includes(eq.id);
                  return (
                    <button key={eq.id} onClick={() => equip(eq.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${equipped ? 'bg-yellow-900/30 border-yellow-600' : 'bg-slate-800 border-slate-700'}`}>
                      <span className="text-2xl">{eq.emoji}</span>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-white text-sm">{eq.name}</p>
                        <p className="text-green-400 text-xs">{eq.bonus}</p>
                      </div>
                      <span className={`text-xs font-bold ${equipped ? 'text-yellow-400' : 'text-slate-400'}`}>
                        {equipped ? '✅ مجهز' : `💎 ${EQUIP_COST}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
