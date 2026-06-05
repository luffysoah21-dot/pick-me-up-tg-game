import { useState } from "react";

interface Hero { name: string; icon: string; rarity: string; stars: number; attack?: number; hp?: number; }
interface Enemy { name: string; icon: string; attack: number; hp: number; maxHp: number; }

const ENEMIES: Record<number, Enemy> = {
  10: { name: "الحارس الضعيف", icon: "👹", attack: 80,  hp: 500,  maxHp: 500  },
  20: { name: "فارس الظلام",   icon: "🧟", attack: 150, hp: 1000, maxHp: 1000 },
  30: { name: "تنين الجحيم",   icon: "🐲", attack: 300, hp: 2000, maxHp: 2000 },
  50: { name: "إله الدمار",    icon: "💀", attack: 500, hp: 5000, maxHp: 5000 },
};

export default function Battle({ floor, onBack }: { floor: number; onBack: (won: boolean) => void }) {
  const savedTeam: Hero[] = JSON.parse(localStorage.getItem("my_team") ?? "[]");
  const RMULT: Record<string,number> = { SSR:4, SR:3, R:2, B:1 };
  const teamAtk = savedTeam.reduce((s,h) => s + ((h.attack ?? 200) + h.stars * 100) * (RMULT[h.rarity] ?? 1), 0) || 300;
  const teamHpMax = savedTeam.reduce((s,h) => s + ((h.hp ?? 500) + h.stars * 200) * (RMULT[h.rarity] ?? 1), 0) || 1000;
  const enemy = ENEMIES[floor] ?? { name: "عدو مجهول", icon: "👾", attack: 100, hp: 800, maxHp: 800 };

  const [eHp, setEHp] = useState(enemy.hp);
  const [tHp, setTHp] = useState(teamHpMax);
  const [log, setLog] = useState<string[]>(["⚔️ بدأت المعركة!"]);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [busy, setBusy] = useState(false);

  const addLog = (m: string) => setLog(p => [m, ...p.slice(0,4)]);
  const pct = (v: number, m: number) => Math.max(0, (v/m)*100);

  const attack = () => {
    if (over || busy) return;
    setBusy(true);
    const d1 = Math.floor(teamAtk * (0.8 + Math.random()*0.4));
    const e2 = Math.max(0, eHp - d1);
    setEHp(e2);
    addLog(`⚔️ فريقك هاجم بـ ${d1} ضرر!`);
    if (e2 <= 0) { setOver(true); setWon(true); addLog("🎉 انتصرت!"); setBusy(false); return; }
    setTimeout(() => {
      const d2 = Math.floor(enemy.attack * (0.8 + Math.random()*0.4));
      const t2 = Math.max(0, tHp - d2);
      setTHp(t2);
      addLog(`💥 ${enemy.name} هاجم بـ ${d2} ضرر!`);
      if (t2 <= 0) { setOver(true); setWon(false); addLog("💀 خسرت..."); }
      setBusy(false);
    }, 600);
  };

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12, color: "#fff" }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 18 }}>⚔️ الطابق {floor}</div>

      <div style={{ background: "rgba(239,68,68,0.1)", borderRadius: 16, padding: 16, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>{enemy.icon}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>{enemy.name}</div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 10, marginTop: 8, overflow: "hidden" }}>
          <div style={{ background: "#EF4444", height: "100%", width: `${pct(eHp, enemy.maxHp)}%`, transition: "width 0.4s", borderRadius: 20 }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{eHp} / {enemy.maxHp}</div>
      </div>

      <div style={{ background: "rgba(52,211,153,0.1)", borderRadius: 16, padding: 16, border: "1px solid rgba(52,211,153,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{tHp} / {teamHpMax}</div>
          <div style={{ fontWeight: 700 }}>فريقك ({savedTeam.length})</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 10, marginTop: 8, overflow: "hidden" }}>
          <div style={{ background: "#34D399", height: "100%", width: `${pct(tHp, teamHpMax)}%`, transition: "width 0.4s", borderRadius: 20 }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
          {savedTeam.length > 0 ? savedTeam.map((h,i) => <div key={i} style={{ fontSize: 24 }}>{h.icon}</div>) : <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>لا يوجد فريق!</div>}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 12, border: "1px solid rgba(255,255,255,0.06)", minHeight: 80 }}>
        {log.map((l,i) => <div key={i} style={{ color: i===0 ? "#fff" : "rgba(255,255,255,0.4)", fontSize: i===0 ? 14 : 12, marginBottom: 2 }}>{l}</div>)}
      </div>

      {!over ? (
        <button onClick={attack} disabled={busy} style={{ background: busy ? "rgba(239,68,68,0.4)" : "linear-gradient(135deg,#EF4444,#B91C1C)", border: "none", borderRadius: 14, padding: 18, color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer" }}>
          {busy ? "..." : "⚔️ هجوم!"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>{won ? "🎉" : "💀"}</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: won ? "#34D399" : "#EF4444" }}>{won ? "انتصرت!" : "خسرت..."}</div>
          <button onClick={() => onBack(won)} style={{ background: won ? "linear-gradient(135deg,#34D399,#059669)" : "linear-gradient(135deg,#6B7280,#374151)", border: "none", borderRadius: 14, padding: 16, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {won ? "🏆 العودة" : "↩ حاول مجدداً"}
          </button>
        </div>
      )}
    </div>
  );
}
