import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const floors = Array.from({ length: 20 }, (_, i) => ({
  floor: i + 1,
  enemy: ['وحش الظلام', 'تنين النار', 'عفريت الرياح', 'شبح الجليد', 'أسطورة الظلال'][i % 5],
  reward: [50, 75, 100, 150, 200][i % 5],
  progress: Math.min(100, (i + 1) * 5),
}));

export default function Tower() {
  const { gems, tickets, addGems, useTicket } = useGameStore();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [battleResult, setBattleResult] = useState<null | 'win' | 'lose'>(null);
  const [isBattling, setIsBattling] = useState(false);

  const floor = floors[currentFloor - 1];

  const startBattle = () => {
    if (tickets <= 0) {
      alert('لا تملك تذاكر كافية!');
      return;
    }
    setIsBattling(true);
    setBattleResult(null);
    useTicket();
    setTimeout(() => {
      const win = Math.random() > 0.4;
      setBattleResult(win ? 'win' : 'lose');
      if (win) {
        addGems(floor.reward);
        if (currentFloor < 20) setCurrentFloor(f => f + 1);
      }
      setIsBattling(false);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl p-4 text-center">
        <p className="text-slate-400 text-sm">عالم الظلال</p>
        <h1 className="text-3xl font-black text-white mt-1">برج التحدي</h1>
        <div className="flex justify-center gap-4 mt-3">
          <span className="text-emerald-400">💎 {gems}</span>
          <span className="text-amber-400">🎫 {tickets} تذكرة</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4">
        <p className="text-slate-400 text-sm text-center">الطابق الحالي</p>
        <p className="text-4xl font-black text-white text-center mt-1">الطابق {currentFloor}</p>
        <p className="text-slate-300 text-center mt-1">التهديد: {floor.enemy}</p>
        <div className="mt-3 bg-slate-700 rounded-full h-2">
          <div className="bg-emerald-400 h-2 rounded-full transition-all" style={{ width: `${floor.progress}%` }} />
        </div>
        <p className="text-slate-400 text-xs text-center mt-1">{floor.progress}%</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 text-center">
        <p className="text-slate-400 text-sm">المكافأة عند الفوز</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">💎 {floor.reward} جوهرة</p>
      </div>

      {battleResult && (
        <div className={`rounded-2xl p-4 text-center font-bold text-lg ${battleResult === 'win' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
          {battleResult === 'win' ? `🏆 انتصرت! حصلت على ${floor.reward} جوهرة` : '💀 خسرت المعركة! حاول مرة أخرى'}
        </div>
      )}

      <button
        onClick={startBattle}
        disabled={isBattling || tickets <= 0}
        className="w-full bg-emerald-400 text-slate-950 py-4 rounded-2xl font-bold text-lg transition hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBattling ? '⚔️ جاري القتال...' : tickets <= 0 ? '❌ لا تذاكر متاحة' : '⚔️ بدء المعركة'}
      </button>
    </div>
  );
}
