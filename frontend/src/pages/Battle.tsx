import { useState, useEffect } from "react";

interface Hero {
  name: string;
  icon: string;
  rarity: string;
  stars: number;
  attack?: number;
  hp?: number;
}

interface Enemy {
  name: string;
  icon: string;
  attack: number;
  hp: number;
  maxHp: number;
}

const FLOOR_ENEMIES: Record<number, Enemy> = {
  10: { name: "الحارس الضعيف", icon: "👹", attack: 80,  hp: 500,  maxHp: 500  },
  20: { name: "فارس الظلام",   icon: "🧟", attack: 150, hp: 1000, maxHp: 1000 },
  30: { name: "تنين الجحيم",   icon: "🐲", attack: 300, hp: 2000, maxHp: 2000 },
  50: { name: "إله الدمار",    icon: "💀", attack: 500, hp: 5000, maxHp: 5000 },
};

export default function Battle({ floor, onBack }: { floor: number; onBack: (won: boolean) => void }) {
  const savedTeam: Hero[] = JSON.parse(localStorage.getItem("my_team") ?? "[]");
  const teamAttack = savedTeam.reduce((sum, h) => sum + (h.attack ?? 300 + h.stars * 50), 0) || 300;
  const teamHpMax = savedTeam.reduce((sum, h) => sum + (h.hp ?? 1000 + h.stars * 100), 0) || 1000;

  const baseEnemy = FLOOR_ENEMIES[floor] ?? { name: "عدو مجهول", icon: "👾", attack: 100, hp: 800, maxHp: 800 };

  const [enemyHp, setEnemyHp] = useState(baseEnemy.hp);
  const [teamHp, setTeamHp]   = useState(teamHpMax);
  const [log, setLog]         = useState<string[]>(["⚔️ بدأت المعركة!"]);
  const [over, setOver]       = useState(false);
  const [won, setWon]         = useState(false);
  const [turn, setTurn]       = useState(0);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev.slice(0, 4)]);

  const attack = () => {
    if (over) return;

    // Player attacks
    const dmgToEnemy = Math.floor(teamAttack * (0.8 + Math.random() * 0.4));
    const newEnemyHp = Math.max(0, enemyHp - dmgToEnemy);
    setEnemyHp(newEnemyHp);
    addLog(`⚔️ فريقك هاجم بـ ${dmgToEnemy} ضرر!`);

    if (newEnemyHp <= 0) {
      setOver(true);
      setWon(true);
      addLog("🎉 انتصرت!");
      return;
    }

    // Enemy attacks back
    setTimeout(() => {
      const dmgToTeam = Math.floor(baseEnemy.attack * (0.8 + Math.random() * 0.4));
      const newTeamHp = Math.max(0, teamHp - dmgToTeam);
      setTeamHp(newTeamHp);
      addLog(`💥 ${baseEnemy.name} هاجم بـ ${dmgToTeam} ضرر!`);

      if (newTeamHp <= 0) {
        setOver(true);
        setWon(false);
        addLog("💀 خسرت المعركة...");
      }
      setTurn(t => t + 1);
    }, 600);

    setTurn(t => t + 1);
  };

  const hpPercent = (hp: number, max: number) => Math.max(0, (hp / max) * 100);

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12, color: "#fff" }}>

      <div style={{ color: "#fff", fontSize: 18, fontWeight: 900, textAlign: "center" }}>
        ⚔️ الطابق {floor} — {baseEnemy.name}
      </div>

      {/* Enemy */}
      <div style={{ background: "rgba(239,68,68,0.1)", borderRadius: 16, padding: 16, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>{baseEnemy.icon}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>{baseEnemy.name}</div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 10, marginTop: 8, overflow: "hidden" }}>
          <div style={{ background: "#EF4444", height: "100%", width: `${hpPercent(enemyHp, baseEnemy.maxHp)}%`, transition: "width 0.4s ease", borderRadius: 20 }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{enemyHp} / {baseEnemy.maxHp}</div>
      </div>

      {/* Team */}
      <div style={{ background: "rgba(52,211,153,0.1)", borderRadius: 16, padding: 16, border: "1px solid rgba(52,211,153,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{teamHp} / {teamHpMax}</div>
          <div style={{ fontWeight: 700 }}>فريقك ({savedTeam.length} أبطال)</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 10, marginTop: 8, overflow: "hidden" }}>
          <div style={{ background: "#34D399", height: "100%", width: `${hpPercent(teamHp, teamHpMax)}%`, transition: "width 0.4s ease", borderRadius: 20 }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
          {savedTeam.map((h, i) => <div key={i} style={{ fontSize: 24 }}>{h.icon}</div>)}
          {savedTeam.length === 0 && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>لا يوجد فريق — اذهب لتكوين الفريق أولاً</div>}
        </div>
      </div>

      {/* Battle Log */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 12, border: "1px solid rgba(255,255,255,0.06)", minHeight: 80 }}>
        {log.map((l, i) => <div key={i} style={{ color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)", fontSize: i === 0 ? 14 : 12, marginBottom: 2 }}>{l}</div>)}
      </div>

      {/* Buttons */}
      {!over ? (
        <button onClick={attack} style={{ background: "linear-gradient(135deg, #EF4444, #B91C1C)", border: "none", borderRadius: 14, padding: 18, color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer" }}>
          ⚔️ هجوم!
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ textAlign: "center", fontSize: 32 }}>{won ? "🎉" : "💀"}</div>
          <div style={{ textAlign: "center", fontWeight: 900, fontSize: 20, color: won ? "#34D399" : "#EF4444" }}>
            {won ? "انتصرت!" : "خسرت..."}
          </div>
          <button onClick={() => onBack(won)} style={{ background: won ? "linear-gradient(135deg, #34D399, #059669)" : "linear-gradient(135deg, #6B7280, #374151)", border: "none", borderRadius: 14, padding: 16, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {won ? "🏆 العودة للبرج" : "↩ حاول مجدداً"}
          </button>
        </div>
      )}
    </div>
  );
}
