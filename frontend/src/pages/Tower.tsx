import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

const enemies = [
  { name: 'وحش الظلام', hp: 100, attack: 15, defense: 5, emoji: '👹', reward: 50, bg: 'from-red-950', border: 'border-red-800' },
  { name: 'تنين النار', hp: 150, attack: 20, defense: 8, emoji: '🐉', reward: 75, bg: 'from-orange-950', border: 'border-orange-800' },
  { name: 'عفريت الرياح', hp: 120, attack: 18, defense: 6, emoji: '💨', reward: 60, bg: 'from-cyan-950', border: 'border-cyan-800' },
  { name: 'شبح الجليد', hp: 130, attack: 22, defense: 4, emoji: '👻', reward: 80, bg: 'from-blue-950', border: 'border-blue-800' },
  { name: 'أسطورة الظلال', hp: 200, attack: 25, defense: 10, emoji: '🌑', reward: 150, bg: 'from-purple-950', border: 'border-purple-800' },
];

const skills = [
  { name: 'ضربة قوية', damage: 45, cost: 20, emoji: '⚔️', color: 'from-red-800 to-red-900', border: 'border-red-600' },
  { name: 'درع الظلام', damage: 0, cost: 15, emoji: '🛡️', heal: 25, color: 'from-blue-800 to-blue-900', border: 'border-blue-600' },
  { name: 'لهيب النار', damage: 60, cost: 30, emoji: '🔥', color: 'from-orange-800 to-orange-900', border: 'border-orange-600' },
  { name: 'ضربة خاطفة', damage: 30, cost: 10, emoji: '⚡', color: 'from-yellow-800 to-yellow-900', border: 'border-yellow-600' },
];

type Log = { text: string; type: 'player' | 'enemy' | 'system' };
type DamageNumber = { id: number; value: number; x: number; isPlayer: boolean };

export default function Tower() {
  const { gems, tickets, addGems, useTicket } = useGameStore();
  const [floor, setFloor] = useState(1);
  const [inBattle, setInBattle] = useState(false);
  const [playerHP, setPlayerHP] = useState(200);
  const [playerMP, setPlayerMP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [enemyShake, setEnemyShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [damageNums, setDamageNums] = useState<DamageNumber[]>([]);
  const [skillAnim, setSkillAnim] = useState<string | null>(null);

  const enemy = enemies[(floor - 1) % enemies.length];

  const addDamageNum = (value: number, isPlayer: boolean) => {
    const id = Date.now();
    setDamageNums(prev => [...prev, { id, value, x: 40 + Math.random() * 20, isPlayer }]);
    setTimeout(() => setDamageNums(prev => prev.filter(d => d.id !== id)), 1000);
  };

  const addLog = (text: string, type: Log['type']) =>
    setLogs(prev => [...prev.slice(-3), { text, type }]);

  const startBattle = () => {
    if (tickets <= 0) { alert('لا تذاكر!'); return; }
    useTicket();
    setPlayerHP(200); setPlayerMP(100);
    setEnemyHP(enemy.hp);
    setLogs([{ text: `⚔️ المعركة بدأت! ${enemy.emoji} ${enemy.name}`, type: 'system' }]);
    setResult(null);
    setInBattle(true);
  };

  const doEnemyAttack = (curHP: number) => {
    const dmg = Math.max(5, enemy.attack - 3 + Math.floor(Math.random() * 8));
    const newHP = Math.max(0, curHP - dmg);
    setPlayerHP(newHP);
    setPlayerShake(true);
    addDamageNum(dmg, false);
    setTimeout(() => setPlayerShake(false), 400);
    addLog(`${enemy.emoji} يهاجم بـ ${dmg} ضرر!`, 'enemy');
    if (newHP <= 0) { setResult('lose'); setInBattle(false); }
    return newHP;
  };

  const useSkill = (skill: typeof skills[0]) => {
    if (result || !inBattle) return;
    if (playerMP < skill.cost) { addLog('⚠️ مانا غير كافية!', 'system'); return; }
    setPlayerMP(mp => mp - skill.cost);
    setSkillAnim(skill.emoji);
    setTimeout(() => setSkillAnim(null), 600);

    if (skill.heal) {
      const healed = Math.min(200, playerHP + skill.heal);
      setPlayerHP(healed);
      addLog(`${skill.emoji} ${skill.name} — شفاء +${skill.heal}`, 'player');
      setTimeout(() => doEnemyAttack(playerHP), 800);
    } else {
      const dmg = skill.damage + Math.floor(Math.random() * 15);
      setEnemyShake(true);
      addDamageNum(dmg, true);
      setTimeout(() => setEnemyShake(false), 400);
      const newEHP = Math.max(0, enemyHP - dmg);
      setEnemyHP(newEHP);
      addLog(`${skill.emoji} ${skill.name} — ${dmg} ضرر!`, 'player');
      if (newEHP <= 0) {
        setTimeout(() => {
          addLog(`🏆 انتصرت! +💎${enemy.reward}`, 'system');
          addGems(enemy.reward);
          setResult('win');
          setInBattle(false);
        }, 300);
      } else {
        setTimeout(() => doEnemyAttack(playerHP), 800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-dark-pattern text-white" dir="rtl">

      {/* Skill Animation Overlay */}
      {skillAnim && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl animate-pop-in">{skillAnim}</div>
        </div>
      )}

      {!inBattle && !result && (
        <div className="p-4 space-y-4 animate-slide-up">
          {/* Floor Header */}
          <div className={`relative overflow-hidden bg-gradient-to-b ${enemy.bg}/50 to-slate-900 border ${enemy.border}/40 rounded-3xl p-6 text-center`}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            <div className="relative">
              <p className="text-slate-400 text-xs tracking-widest uppercase">🗼 برج التحدي</p>
              <p className="text-7xl mt-2 animate-float">{enemy.emoji}</p>
              <h2 className="text-3xl font-black text-white mt-2">{enemy.name}</h2>
              <p className="text-slate-400 mt-1">الطابق <span className="text-yellow-400 font-black text-2xl">{floor}</span></p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[['💎', gems, 'جواهر', 'text-yellow-400'], ['🎫', tickets, 'تذاكر', 'text-purple-400'], ['❤️', 200, 'صحة', 'text-red-400']].map(([icon, val, label, color]) => (
              <div key={label as string} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <p className={`font-black text-lg ${color}`}>{icon} {val}</p>
                <p className="text-slate-500 text-xs">{label as string}</p>
              </div>
            ))}
          </div>

          {/* Enemy Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <p className="text-slate-400 text-xs font-bold">📊 إحصاءات العدو</p>
            {[['❤️ صحة', enemy.hp, 200, 'bg-red-600'], ['⚔️ هجوم', enemy.attack, 30, 'bg-orange-600'], ['🛡️ دفاع', enemy.defense, 15, 'bg-blue-600']].map(([label, val, max, color]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{label as string}</span>
                  <span className="text-white font-bold">{val as number}</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className={`${color} h-1.5 rounded-full`} style={{ width: `${((val as number) / (max as number)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={startBattle} disabled={tickets <= 0}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 border border-yellow-500/50 text-white py-5 rounded-2xl font-black text-xl card-glow-gold transition active:scale-95 disabled:opacity-40">
            ⚔️ ابدأ المعركة
          </button>
        </div>
      )}

      {(inBattle || result) && (
        <div className="p-4 space-y-3">
          {/* Enemy Area */}
          <div className={`relative bg-gradient-to-b ${enemy.bg}/30 to-slate-900 border ${enemy.border}/40 rounded-3xl p-4 ${enemyShake ? 'animate-battle-shake' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-black text-white">{enemy.emoji} {enemy.name}</p>
                <p className="text-red-400 text-xs">الطابق {floor}</p>
              </div>
              <p className="text-red-400 font-bold">{enemyHP}/{enemy.hp}</p>
            </div>
            <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all duration-500 relative"
                style={{ width: `${(enemyHP / enemy.hp) * 100}%` }}>
                <div className="absolute inset-0 animate-shimmer rounded-full" />
              </div>
            </div>
            {/* Damage Numbers */}
            {damageNums.filter(d => d.isPlayer).map(d => (
              <div key={d.id} className="absolute text-yellow-400 font-black text-2xl pointer-events-none animate-particles"
                style={{ top: '20%', left: `${d.x}%`, animation: 'particles 1s ease-out forwards' }}>
                -{d.value}
              </div>
            ))}
            <div className="flex justify-center mt-3">
              <span className={`text-6xl ${enemyShake ? 'animate-battle-shake' : 'animate-float'}`}>{enemy.emoji}</span>
            </div>
          </div>

          {/* Player Area */}
          <div className={`relative bg-gradient-to-b from-blue-950/30 to-slate-900 border border-blue-800/40 rounded-3xl p-4 ${playerShake ? 'animate-battle-shake' : ''}`}>
            <div className="flex justify-between items-center mb-1">
              <p className="font-black text-white">🧙 بطلك</p>
              <p className="text-blue-400 font-bold">{playerHP}/200</p>
            </div>
            <div className="bg-slate-800 rounded-full h-3 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(playerHP / 200) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-purple-400 text-xs">🔮 مانا {playerMP}/100</p>
            </div>
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${playerMP}%` }} />
            </div>
            {damageNums.filter(d => !d.isPlayer).map(d => (
              <div key={d.id} className="absolute text-red-400 font-black text-2xl pointer-events-none"
                style={{ top: '20%', left: `${d.x}%`, animation: 'particles 1s ease-out forwards' }}>
                -{d.value}
              </div>
            ))}
          </div>

          {/* Battle Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 min-h-14 space-y-1">
            {logs.map((log, i) => (
              <p key={i} className={`text-xs animate-slide-up ${log.type === 'player' ? 'text-green-400' : log.type === 'enemy' ? 'text-red-400' : 'text-yellow-400'}`}>
                {log.text}
              </p>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-3xl p-5 text-center animate-pop-in border ${result === 'win' ? 'bg-yellow-900/30 border-yellow-600 card-glow-gold' : 'bg-red-900/30 border-red-600'}`}>
              <p className="text-4xl mb-2">{result === 'win' ? '🏆' : '💀'}</p>
              <p className={`font-black text-xl ${result === 'win' ? 'text-yellow-300' : 'text-red-300'}`}>
                {result === 'win' ? `انتصرت! +💎${enemy.reward}` : 'هُزمت!'}
              </p>
              <div className="flex gap-2 mt-4">
                {result === 'win' && (
                  <button onClick={() => { setFloor(f => f + 1); setResult(null); setInBattle(false); }}
                    className="flex-1 bg-yellow-600 border border-yellow-500 text-white py-3 rounded-xl font-bold">
                    التالي →
                  </button>
                )}
                <button onClick={() => { setResult(null); setInBattle(false); }}
                  className="flex-1 bg-slate-700 border border-slate-600 text-white py-3 rounded-xl font-bold">
                  {result === 'win' ? 'القائمة' : 'إعادة'}
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
                  className={`bg-gradient-to-b ${skill.color} border ${skill.border} rounded-2xl p-3 text-right disabled:opacity-30 transition active:scale-95`}>
                  <p className="text-2xl">{skill.emoji}</p>
                  <p className="font-black text-white text-sm mt-1">{skill.name}</p>
                  <p className="text-purple-300 text-xs">🔮 {skill.cost}</p>
                  {skill.damage > 0 && <p className="text-red-300 text-xs">⚔️ {skill.damage}+</p>}
                  {skill.heal && <p className="text-green-300 text-xs">💚 +{skill.heal}</p>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
