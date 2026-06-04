import React, { useState, useEffect, useRef } from 'react';
import { floor1Monsters, floor1Stages } from '../data/floor1';
import { useGameStore } from '../store/useGameStore';

interface BattleHero {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  stars: number;
  skillCooldown: number;
  isAlive: boolean;
  statusEffect: 'none' | 'burn' | 'bleed' | 'stunned' | 'def_down';
  statusDuration: number;
}

interface BattleMonster {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  skillCooldown: number;
  isBoss: boolean;
  isEnraged: boolean;
  skills: Array<{ name: string; damage: number; cooldown: number; effect: string }>;
}

interface BattleLogEntry {
  text: string;
  type: 'hero' | 'monster' | 'system' | 'danger';
}

type MasterInterventionType = 'boost' | 'heal' | 'taunt';

interface Floor1BattleProps {
  onBack?: () => void;
}

const Floor1Battle: React.FC<Floor1BattleProps> = ({ onBack }) => {
  const gameStore = useGameStore();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [heroes, setHeroes] = useState<BattleHero[]>([]);
  const [monster, setMonster] = useState<BattleMonster | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [phase, setPhase] = useState<'battle' | 'victory' | 'defeat' | 'stage_clear' | 'floor_clear'>('battle');
  const [turn, setTurn] = useState(0);
  const [masterPoints, setMasterPoints] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedHeroForTaunt, setSelectedHeroForTaunt] = useState<string | null>(null);
  const [monsterShaking, setMonsterShaking] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ value: number; type: 'damage' | 'heal'; x: number; y: number } | null>(null);
  const [hitHeroId, setHitHeroId] = useState<string | null>(null);
  const [usedMasterPoints, setUsedMasterPoints] = useState(0);
  const [stageClearFlash, setStageClearFlash] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup animation timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const createTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    animationTimeoutsRef.current.push(timeout);
    return timeout;
  };

  // Initialize battle on mount
  useEffect(() => {
    initializeBattle();
  }, []);

  // Scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLog]);

  const addLog = (text: string, type: BattleLogEntry['type'] = 'system') => {
    setBattleLog((prev) => [...prev.slice(-3), { text, type }]);
  };

  const initializeBattle = () => {
    // Load selected team from localStorage
    const selectedTeamStr = localStorage.getItem('selectedTeam');
    const selectedTeam = selectedTeamStr ? JSON.parse(selectedTeamStr) : [];
    const deadHeroesStr = localStorage.getItem('deadHeroes');
    const deadHeroes = deadHeroesStr ? JSON.parse(deadHeroesStr) : [];

    // Filter out dead heroes
    const aliveHeroes = selectedTeam.filter((h: any) => !deadHeroes.includes(h.id));

    if (aliveHeroes.length === 0) {
      setPhase('defeat');
      addLog('💀 لا يوجد أبطال أحياء متبقيين!', 'danger');
      return;
    }

    // Convert heroes to battle format
    const battleHeroes: BattleHero[] = aliveHeroes.map((h: any) => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      hp: h.maxHp,
      maxHp: h.maxHp,
      atk: h.atk,
      def: h.def,
      speed: h.speed,
      stars: h.stars,
      skillCooldown: 0,
      isAlive: true,
      statusEffect: 'none' as const,
      statusDuration: 0,
    }));

    setHeroes(battleHeroes);

    // Initialize first stage
    const stage = floor1Stages[0];
    const monsterIds = stage.monsters;
    const firstMonster = monsterIds[0];
    const monsterData = floor1Monsters.find((m) => m.id === firstMonster);

    if (!monsterData) {
      addLog('خطأ: لم يتم العثور على الوحش', 'danger');
      return;
    }

    const battleMonster: BattleMonster = {
      id: monsterData.id,
      name: monsterData.name,
      emoji: monsterData.emoji,
      hp: monsterData.hp,
      maxHp: monsterData.maxHp,
      atk: monsterData.atk,
      def: monsterData.def,
      speed: monsterData.speed,
      skillCooldown: 0,
      isBoss: monsterData.isBoss || false,
      isEnraged: false,
      skills: monsterData.skills,
    };

    setMonster(battleMonster);
    setCurrentStageIndex(0);
    setTurn(0);
    setPhase('battle');
    addLog(`🎬 بدء المرحلة 1: ${stage.name}`, 'system');
    addLog(`ظهر عدو: ${monsterData.name} ${monsterData.emoji}`, 'monster');
  };

  const calculateDamage = (attacker: { atk: number }, defender: { def: number }, statusDefDown: boolean = false): number => {
    const defMultiplier = statusDefDown ? 0.5 : 1;
    const baseDamage = attacker.atk * (0.9 + Math.random() * 0.3);
    const defenseReduction = defender.def * defMultiplier * 0.3;
    const finalDamage = Math.max(50, baseDamage - defenseReduction);
    return Math.round(finalDamage);
  };

  const applyStatusEffect = (hero: BattleHero): BattleHero => {
    const updated = { ...hero };
    if (hero.statusEffect !== 'none' && hero.statusDuration > 0) {
      switch (hero.statusEffect) {
        case 'burn':
          updated.hp = Math.max(0, updated.hp - 150);
          addLog(`🔥 ${hero.name} يحترق: -150 HP`, 'hero');
          break;
        case 'bleed':
          updated.hp = Math.max(0, updated.hp - 100);
          addLog(`🩸 ${hero.name} ينزف: -100 HP`, 'hero');
          break;
        case 'stunned':
          addLog(`⚡ ${hero.name} مصعوق ولا يستطيع الحركة!`, 'hero');
          break;
        case 'def_down':
          addLog(`📉 ${hero.name} دفاعه منخفض هذا الدور`, 'system');
          break;
      }
      updated.statusDuration--;
      if (updated.statusDuration === 0) {
        updated.statusEffect = 'none';
      }
    }
    return updated;
  };

  const checkEnrage = (mon: BattleMonster): BattleMonster => {
    const updated = { ...mon };
    const hpPercentage = (mon.hp / mon.maxHp) * 100;
    if (hpPercentage < 30 && !mon.isEnraged) {
      updated.isEnraged = true;
      updated.atk = Math.round(mon.atk * 1.3);
      addLog(`🔥 ${mon.name} في حالة هياج!`, 'danger');
    }
    return updated;
  };

  const executeTurn = async () => {
    if (isAnimating || phase !== 'battle') return;
    setIsAnimating(true);

    let updatedHeroes = [...heroes].map(applyStatusEffect);
    let updatedMonster = monster ? checkEnrage({ ...monster }) : null;

    // Boss gets free attack at start
    if (updatedMonster?.isBoss) {
      const aliveHeroes = updatedHeroes.filter((h) => h.isAlive && h.statusEffect !== 'stunned');
      if (aliveHeroes.length > 0) {
        const targetHero = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
        const damage = calculateDamage(updatedMonster, targetHero, targetHero.statusEffect === 'def_down');
        const heroIdx = updatedHeroes.findIndex((h) => h.id === targetHero.id);
        updatedHeroes[heroIdx].hp = Math.max(0, updatedHeroes[heroIdx].hp - damage);
        setHitHeroId(targetHero.id);
        createTimeout(() => setHitHeroId(null), 300);
        addLog(`💢 ${updatedMonster.name} يهاجم ${targetHero.name}: -${damage} HP`, 'monster');
      }
    }

    // All alive heroes attack (except stunned)
    for (const hero of updatedHeroes) {
      if (!hero.isAlive || hero.statusEffect === 'stunned') continue;

      const damage = calculateDamage(hero, updatedMonster!, hero.statusEffect === 'def_down');
      updatedMonster!.hp = Math.max(0, updatedMonster!.hp - damage);

      // Trigger monster shake animation
      setMonsterShaking(true);
      createTimeout(() => setMonsterShaking(false), 400);

      // Show floating damage number
      setFloatingDamage({ value: damage, type: 'damage', x: Math.random() * 60 - 30, y: 0 });
      createTimeout(() => setFloatingDamage(null), 800);

      // Check for skill cooldown reset
      if (hero.skillCooldown > 0) {
        hero.skillCooldown--;
      }

      addLog(`⚔️ ${hero.name} يهاجم: -${damage} HP`, 'hero');

      // Monster dies?
      if (updatedMonster!.hp === 0) {
        addLog(`💀 ${updatedMonster!.name} قد هُزِم!`, 'system');
        setHeroes(updatedHeroes);
        setMonster(updatedMonster);
        await new Promise((r) => setTimeout(r, 1000));
        handleStageComplete(updatedHeroes);
        setIsAnimating(false);
        return;
      }
    }

    // Monster attacks random alive hero
    const aliveHeroes = updatedHeroes.filter((h) => h.isAlive);
    if (aliveHeroes.length > 0) {
      const targetHero = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
      const damage = calculateDamage(updatedMonster!, targetHero, targetHero.statusEffect === 'def_down');
      const heroIdx = updatedHeroes.findIndex((h) => h.id === targetHero.id);
      updatedHeroes[heroIdx].hp = Math.max(0, updatedHeroes[heroIdx].hp - damage);

      setHitHeroId(targetHero.id);
      createTimeout(() => setHitHeroId(null), 300);

      addLog(`💥 ${updatedMonster!.name} يهاجم ${targetHero.name}: -${damage} HP`, 'monster');

      // Check for hero death
      if (updatedHeroes[heroIdx].hp === 0) {
        updatedHeroes[heroIdx].isAlive = false;
        addLog(`💀 ${targetHero.name} قد مات! [دائم]`, 'danger');

        // Add to deadHeroes
        const deadHeroesStr = localStorage.getItem('deadHeroes');
        const deadHeroes = deadHeroesStr ? JSON.parse(deadHeroesStr) : [];
        deadHeroes.push(targetHero.id);
        localStorage.setItem('deadHeroes', JSON.stringify(deadHeroes));

        // Check if team collapse warning needed
        const aliveCount = updatedHeroes.filter((h) => h.isAlive).length;
        if (aliveCount < 3) {
          addLog(`⚠️ تحذير: فريقك ينهار! (${aliveCount}/${updatedHeroes.length})`, 'danger');
        }
      }
    }

    // Check for total defeat
    if (updatedHeroes.every((h) => !h.isAlive)) {
      addLog('💀 فريقك انهزم...', 'danger');
      setPhase('defeat');
      setHeroes(updatedHeroes);
      setMonster(updatedMonster);
      setIsAnimating(false);
      return;
    }

    setHeroes(updatedHeroes);
    setMonster(updatedMonster);
    setTurn((t) => t + 1);
    await new Promise((r) => setTimeout(r, 800));
    setIsAnimating(false);
  };

  const handleMasterIntervention = (type: MasterInterventionType, targetHeroId?: string) => {
    if (masterPoints === 0 || isAnimating) return;

    let actionTaken = false;

    switch (type) {
      case 'boost':
        // All heroes ATK +20% for 2 turns
        setHeroes((prev) =>
          prev.map((h) => ({
            ...h,
            atk: Math.round(h.atk * 1.2),
          }))
        );
        addLog('✨ تعزيز: قوة الأبطال +20% لدورين!', 'system');
        actionTaken = true;
        break;

      case 'heal':
        // Heal lowest HP hero 20%
        setHeroes((prev) => {
          const lowest = prev.reduce((min, h) => (h.hp < min.hp && h.isAlive ? h : min));
          return prev.map((h) =>
            h.id === lowest.id ? { ...h, hp: Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.2)) } : h
          );
        });
        addLog('💚 علاج طارئ: تم علاج أضعف بطل!', 'system');
        actionTaken = true;
        break;

      case 'taunt':
        // Monster targets specific hero next turn
        if (targetHeroId) {
          addLog(`🎯 استفزاز: الوحش سيركز على ${heroes.find((h) => h.id === targetHeroId)?.name}!`, 'system');
          actionTaken = true;
        }
        break;
    }

    if (actionTaken) {
      setMasterPoints((p) => p - 1);
      setUsedMasterPoints((u) => u + 1);
    }
  };

  const handleStageComplete = (currentHeroes: BattleHero[]) => {
    if (currentStageIndex === floor1Stages.length - 1) {
      // Floor complete
      setStageClearFlash(true);
      createTimeout(() => setStageClearFlash(false), 500);
      createTimeout(() => setPhase('floor_clear'), 500);
      addLog('🎉 البرج الأول مكتمل!', 'system');
    } else {
      // Stage complete
      setStageClearFlash(true);
      createTimeout(() => setStageClearFlash(false), 500);
      createTimeout(() => setPhase('stage_clear'), 500);
      addLog(`✅ المرحلة ${currentStageIndex + 1} مكتملة!`, 'system');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleNextStage = () => {
    const nextStageIndex = currentStageIndex + 1;
    if (nextStageIndex >= floor1Stages.length) {
      setPhase('floor_clear');
      return;
    }

    const stage = floor1Stages[nextStageIndex];
    const monsterIds = stage.monsters;
    const firstMonster = monsterIds[0];
    const monsterData = floor1Monsters.find((m) => m.id === firstMonster);

    if (!monsterData) return;

    const battleMonster: BattleMonster = {
      id: monsterData.id,
      name: monsterData.name,
      emoji: monsterData.emoji,
      hp: monsterData.hp,
      maxHp: monsterData.maxHp,
      atk: monsterData.atk,
      def: monsterData.def,
      speed: monsterData.speed,
      skillCooldown: 0,
      isBoss: monsterData.isBoss || false,
      isEnraged: false,
      skills: monsterData.skills,
    };

    setMonster(battleMonster);
    setCurrentStageIndex(nextStageIndex);
    setPhase('battle');
    setTurn(0);
    setBattleLog([]);
    addLog(`🎬 بدء المرحلة ${nextStageIndex + 1}: ${stage.name}`, 'system');
    addLog(`ظهر عدو: ${monsterData.name} ${monsterData.emoji}`, 'monster');
  };

  // Render functions
  const renderPhaseScreen = () => {
    if (phase === 'stage_clear') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-green-500 p-8 rounded-lg text-center max-w-sm">
            <h2 className="text-3xl font-bold text-green-400 mb-4">✅ المرحلة {currentStageIndex + 1} مكتملة!</h2>
            <p className="text-gray-300 mb-6">فريقك في الطريق الصحيح!</p>
            <button
              onClick={handleNextStage}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
            >
              المرحلة التالية
            </button>
          </div>
        </div>
      );
    }

    if (phase === 'floor_clear') {
      const totalExp = 5000;
      const totalGold = 1000;
      return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-yellow-500 p-8 rounded-lg text-center max-w-sm">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">🎉 البرج الأول مكتمل!</h2>
            <div className="bg-gray-900 p-4 rounded-lg mb-6 space-y-2">
              <p className="text-xl text-green-300">+ {totalExp} خبرة</p>
              <p className="text-xl text-yellow-300">+ {totalGold} ذهب</p>
              <p className="text-xl text-purple-300">+ 10 جواهر</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold transition"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }

    if (phase === 'defeat') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-red-500 p-8 rounded-lg text-center max-w-sm">
            <h2 className="text-4xl font-bold text-red-500 mb-4">💀 فريقك انهزم...</h2>
            <p className="text-gray-300 mb-6">حاول مرة أخرى مع فريق أقوى</p>
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }
  };

  if (!monster) {
    return <div className="text-center text-white p-8">جاري تحميل المعركة...</div>;
  }

  const aliveHeroes = heroes.filter((h) => h.isAlive);
  const hpPercentage = (monster.hp / monster.maxHp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4 flex flex-col">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-4 relative">
        {phase !== 'battle' && (
          <button
            onClick={onBack}
            className="text-lg font-bold hover:text-blue-300 transition"
          >
            ← العودة للبرج
          </button>
        )}
        <div className="text-lg font-bold flex-1 text-center">
          البرج الأول | المرحلة {currentStageIndex + 1}/4
        </div>
        <div className="flex gap-1 items-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              style={{
                animation:
                  i >= masterPoints
                    ? 'sparkle 0.6s ease-out'
                    : 'none',
              }}
              className={`text-xl ${
                i < masterPoints ? 'opacity-100' : 'opacity-40'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Stage Clear Flash */}
      {stageClearFlash && (
        <div className="fixed inset-0 bg-yellow-400 opacity-30 z-40 animate-pulse"></div>
      )}

      {/* Monster Section */}
      <div
        style={{
          transform: monsterShaking ? `translateX(${Math.sin(Date.now() / 100) * 10}px)` : 'translateX(0)',
          transition: monsterShaking ? 'none' : 'transform 0.1s',
        }}
        className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 mb-4 text-center relative ${
          monster.isEnraged ? 'border-2 border-red-500 animate-pulse' : 'border-2 border-red-600'
        }`}
      >
        {/* Floating Damage Number */}
        {floatingDamage && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${floatingDamage.x}px), -50%)`,
              animation: 'floatUp 0.8s ease-out forwards',
              pointerEvents: 'none',
            }}
            className={`font-bold text-2xl ${
              floatingDamage.type === 'damage' ? 'text-red-500' : 'text-green-400'
            }`}
          >
            {floatingDamage.type === 'damage' ? '-' : '+'}{floatingDamage.value}
          </div>
        )}

        {monster.isEnraged && (
          <div className="text-xl font-bold text-red-500 mb-2">⚠️ الوحش في حالة هياج! الضرر +30%</div>
        )}
        <div className={`text-6xl mb-3 ${monster.isEnraged ? 'animate-bounce' : ''}`}>
          {monster.emoji}
        </div>
        <h2 className="text-2xl font-bold mb-2">{monster.name}</h2>
        <div className="bg-gray-900 rounded-lg p-2 mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>الحياة</span>
            <span>
              {Math.max(0, Math.round(monster.hp))} / {monster.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`transition-all ${
                hpPercentage > 60
                  ? 'bg-green-500'
                  : hpPercentage > 30
                  ? 'bg-yellow-500'
                  : 'bg-red-600'
              }`}
              style={{
                width: `${hpPercentage}%`,
                boxShadow:
                  hpPercentage <= 30
                    ? '0 0 10px rgba(220, 38, 38, 0.8)'
                    : 'none',
              }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-400">الدور: {turn}</p>
      </div>

      {/* Battle Log */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 h-32 overflow-y-auto space-y-2">
        {battleLog.map((log, idx) => {
          let colorClass = 'text-gray-300';
          if (log.type === 'hero') colorClass = 'text-blue-300';
          if (log.type === 'monster') colorClass = 'text-red-400';
          if (log.type === 'danger') colorClass = 'text-red-600 font-bold';
          if (log.type === 'system') colorClass = 'text-yellow-300';

          return (
            <div key={idx} className={colorClass}>
              {log.text}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      {/* Heroes Section */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {heroes.map((hero) => {
          const heroHpPercent = (hero.hp / hero.maxHp) * 100;
          const isFlashing = hitHeroId === hero.id;

          return (
            <div
              key={hero.id}
              style={{
                backgroundColor: isFlashing ? 'rgba(220, 38, 38, 0.5)' : undefined,
                transition: 'background-color 0.3s ease',
              }}
              className={`border rounded-lg p-3 relative ${
                hero.isAlive ? 'bg-gray-800 border-blue-500' : 'bg-gray-700 border-gray-600 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${!hero.isAlive ? 'grayscale' : ''}`}>
                  {hero.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{hero.name}</p>
                  {hero.statusEffect !== 'none' && (
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          hero.statusEffect === 'burn'
                            ? 'bg-red-900 text-red-300'
                            : hero.statusEffect === 'bleed'
                            ? 'bg-red-800 text-red-200'
                            : hero.statusEffect === 'stunned'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {hero.statusEffect === 'burn' && '🔥'}
                        {hero.statusEffect === 'bleed' && '🩸'}
                        {hero.statusEffect === 'stunned' && '⚡'}
                        {hero.statusEffect === 'def_down' && '🛡️'}
                      </span>
                    </div>
                  )}
                </div>
                {!hero.isAlive && <span className="text-xl">☠️</span>}
              </div>
              <div className="bg-gray-900 rounded p-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>{Math.max(0, Math.round(hero.hp))}</span>
                  <span>{hero.maxHp}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`transition-all ${
                      heroHpPercent > 60
                        ? 'bg-green-500'
                        : heroHpPercent > 30
                        ? 'bg-yellow-500'
                        : 'bg-red-600'
                    }`}
                    style={{
                      width: `${heroHpPercent}%`,
                      boxShadow:
                        heroHpPercent <= 30
                          ? '0 0 8px rgba(220, 38, 38, 0.6)'
                          : 'none',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {phase === 'battle' && (
        <div className="space-y-3">
          <button
            onClick={executeTurn}
            disabled={isAnimating || aliveHeroes.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold transition text-lg"
          >
            ⚔️ هجوم
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMasterIntervention('boost')}
              disabled={masterPoints === 0 || isAnimating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-bold transition text-sm"
            >
              ✨ تعزيز
            </button>
            <button
              onClick={() => handleMasterIntervention('heal')}
              disabled={masterPoints === 0 || isAnimating}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-bold transition text-sm"
            >
              💚 علاج
            </button>
            <button
              onClick={() => handleMasterIntervention('taunt')}
              disabled={masterPoints === 0 || isAnimating}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-bold transition text-sm"
            >
              🎯 استفزاز
            </button>
          </div>
        </div>
      )}

      {renderPhaseScreen()}

      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-60px);
          }
        }

        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Floor1Battle;
