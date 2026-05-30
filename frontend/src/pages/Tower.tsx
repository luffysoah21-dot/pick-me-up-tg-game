import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const enemies = [
  { name: 'وحش الظلام', hp: 100, attack: 15, defense: 5, emoji: '👹', reward: 50 },
  { name: 'تنين النار', hp: 150, attack: 20, defense: 8, emoji: '🐉', reward: 75 },
  { name: 'عفريت الرياح', hp: 120, attack: 18, defense: 6, emoji: '💨', reward: 60 },
  { name: 'شبح الجليد', hp: 130, attack: 22, defense: 4, emoji: '👻', reward: 80 },
  { name: 'أسطورة الظلال', hp: 200, attack: 25, defense: 10, emoji: '🌑', reward: 100 },
];

const skills = [
  { name: 'ضربة قوية', damage: 40, cost: 20, emoji: '⚔️', desc: 'ضربة قوية تسبب ضرراً كبيراً' },
  { name: 'درع الظلام', damage: 0, cost: 15, emoji: '🛡️', desc: 'يزيد دفاعك مؤقتاً', heal: 20 },
  { name: 'لهيب النار', damage: 55, cost: 30, emoji: '🔥', desc: 'هجوم ناري يحرق العدو' },
  { name: 'ضربة خاطفة', damage: 25, cost: 10, emoji: '⚡', desc: 'هجوم سريع ومتكرر' },
];

type BattleLog = { text: string; type: 'player' | 'enemy' | 'system' };

export default function Tower() {
  const { gems, tickets, addGems, useTicket } = useGameStore();
  const [floor, setFloor] = useState(1);
  const [inBattle, setInBattle] = useState(false);
  const [playerHP, setPlayerHP] = useState(200);
  const [playerMP, setPlayerMP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(0);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [shaking, setShaking] = useState(false);

  const enemy = enemies[(floor - 1) % enemies.length];

  const addLog = (text: string, type: BattleLog['type']) => {
    setLogs(prev => [...prev.slice(-4), { text, type }]);
  };

  const startBattle = () => {
    if (tickets <= 0) { alert('لا تذاكر!'); return; }
    useTicket();
    setPlayerHP(200);
    setPlayerMP(100);
    setEnemyHP(enemy.hp);
    setLogs([{ text: `⚔️ بدأت المعركة ضد ${enemy.emoji} ${enemy.name}!`, type: 'system' }]);
    setResult(null);
    setInBattle(true);
  };

  const enemyAttack = (currentPlayerHP: number) => {
    const dmg = Math.max(5, enemy.attack - 5 + Math.floor(Math.random() * 10));
    const newHP = Math.max(0, currentPlayerHP - dmg);
    setPlayerHP(newHP);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    addLog(`${enemy.emoji} ${enemy.name} يهاجمك بـ ${dmg} ضرر!`, 'enemy');
    if (newHP <= 0) {
      setResult('lose');
      setInBattle(false);
    }
    return newHP;
  };

  const useSkill = (skill: typeof skills[0]) => {
    if (result) return;
    if (playerMP < skill.cost) { addLog('⚠️ نقاط مانا غير كافية!', 'system'); return; }

    setPlayerMP(mp => mp - skill.cost);

    if (skill.heal) {
      const healed = Math.min(200, playerHP + skill.heal);
      setPlayerHP(healed);
      addLog(`${skill.emoji} استخدمت ${skill.name} وشفيت ${skill.heal} نقطة!`, 'player');
    } else {
      const dmg = skill.damage + Math.floor(Math.random() * 10);
      const newEnemyHP = Math.max(0, enemyHP - dmg);
      setEnemyHP(newEnemyHP);
      addLog(`${skill.emoji} استخدمت ${skill.name} وأحدثت ${dmg} ضرر!`, 'player');

      if (newEnemyHP <= 0) {
        addLog(`🏆 انتصرت! حصلت على 💎 ${enemy.reward}`, 'system');
        addGems(enemy.reward);
        setResult('win');
        setInBattle(false);
        return;
      }
    }

    setTimeout(() => enemyAttack(playerHP), 800);
  };

  const nextFloor = () => {
    setFloor(f => f + 1);
    setResult(null);
    setInBattle(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4" dir="rtl">
      {!inBattle && !result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-yellow-900/30 to-slate-900 border border-yellow-800/40 rounded-2xl p-5 text-center">
            <p className="text-yellow-500 text-xs tracking-widest">🗼 برج التحدي</p>
            <p className="text-5xl font-black mt-2 text-white">الطابق {floor}</p>
            <p className="text-slate-400 mt-1">التهديد: {enemy.emoji} {enemy.name}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between">
            <div className="text-center">
              <p className="text-yellow-400 font-bold">💎 {gems}</p>
              <p className="text-slate-500 text-xs">جواهر</p>
            </div>
            <div className="text-center">
              <p className="text-blue-400 font-bold">🎫 {tickets}</p>
              <p className="text-slate-500 text-xs">تذاكر</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 font-bold">❤️ 200</p>
              <p className="text-slate-500 text-xs">صحة</p>
            </div>
          </div>

          <button onClick={startBattle} disabled={tickets <= 0}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-4 rounded-2xl font-black text-lg disabled:opacity-40">
            ⚔️ ابدأ المعركة
          </button>
        </div>
      )}

      {(inBattle || result) && (
        <div className="space-y-3">
          {/* Enemy */}
          <div className="bg-gradient-to-b from-red-950/50 to-slate-900 border border-red-900/40 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-red-300">{enemy.emoji} {enemy.name}</p>
              <p className="text-red-400 text-sm">{enemyHP}/{enemy.hp} ❤️</p>
            </div>
            <div className="mt-2 bg-slate-800 rounded-full h-3">
              <div className="bg-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(enemyHP / enemy.hp) * 100}%` }} />
            </div>
          </div>

          {/* Player */}
          <div className={`bg-gradient-to-b from-blue-950/50 to-slate-900 border border-blue-900/40 rounded-2xl p-4 ${shaking ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between items-center">
              <p className="font-bold text-blue-300">🧙 بطلك</p>
              <p className="text-blue-400 text-sm">{playerHP}/200 ❤️</p>
            </div>
            <div className="mt-1 bg-slate-800 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(playerHP / 200) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-purple-400 text-sm">{playerMP}/100 🔮</p>
            </div>
            <div className="bg-slate-800 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${playerMP}%` }} />
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1 min-h-16">
            {logs.map((log, i) => (
              <p key={i} className={`text-xs ${log.type === 'player' ? 'text-green-400' : log.type === 'enemy' ? 'text-red-400' : 'text-yellow-400'}`}>
                {log.text}
              </p>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-2xl p-4 text-center font-bold ${result === 'win' ? 'bg-yellow-900/40 border border-yellow-600 text-yellow-300' : 'bg-red-900/40 border border-red-600 text-red-300'}`}>
              {result === 'win' ? `🏆 انتصرت! الطابق ${floor} مكتمل!` : '💀 هُزمت! حاول مرة أخرى'}
              <div className="flex gap-2 mt-3">
                {result === 'win' && (
                  <button onClick={nextFloor} className="flex-1 bg-yellow-600 text-white py-2 rounded-xl font-bold">
                    الطابق التالي →
                  </button>
                )}
                <button onClick={() => { setResult(null); setInBattle(false); }}
                  className="flex-1 bg-slate-700 text-white py-2 rounded-xl font-bold">
                  {result === 'win' ? 'ارجع للقائمة' : 'حاول مجدداً'}
                </button>
              </div>
            </div>
          )}

          {/* Skills */}
          {inBattle && !result && (
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill, i) => (
                <button key={i} onClick={() => useSkill(skill)}
                  disabled={playerMP < skill.cost}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-right disabled:opacity-40 hover:border-yellow-700 transition">
                  <p className="text-lg">{skill.emoji}</p>
                  <p className="font-bold text-sm text-white">{skill.name}</p>
                  <p className="text-purple-400 text-xs">🔮 {skill.cost}</p>
                  <p className="text-slate-500 text-xs mt-1">{skill.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
