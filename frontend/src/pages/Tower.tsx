import { useState } from "react";
import TeamFormation from "./TeamFormation";
import Battle from "./Battle";
import Floor1Battle from "../components/Floor1Battle";

const floors = [
  { floor: 50, name: "الطابق المظلم",  difficulty: "أسطوري", color: "#EF4444", locked: true },
  { floor: 30, name: "قلعة الظلام",    difficulty: "صعب",    color: "#F59E0B", locked: true },
  { floor: 20, name: "غرفة الامتحان",  difficulty: "متوسط",  color: "#60A5FA", locked: false },
  { floor: 10, name: "البداية",         difficulty: "سهل",   color: "#34D399", locked: false },
  { floor: 1,  name: "الطابق الأول",   difficulty: "بداية",  color: "#8B5CF6", locked: false },
];

export default function Tower() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showTeam, setShowTeam] = useState(false);
  const [battleFloor, setBattleFloor] = useState<number | null>(null);

  if (showTeam) return <TeamFormation onBack={() => setShowTeam(false)} />;
  if (battleFloor === 1) return <Floor1Battle onBack={() => { setBattleFloor(null); setSelected(1); }} />;
  if (battleFloor) return <Battle floor={battleFloor} onBack={(won) => { setBattleFloor(null); if(won) setSelected(battleFloor); }} />;

  const selectedTeamStr = localStorage.getItem('my_team');
  const selectedTeam = selectedTeamStr ? JSON.parse(selectedTeamStr) : [];
  const hasTeam = Array.isArray(selectedTeam) && selectedTeam.length > 0;

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>🏯 برج التحدي</div>
      <button onClick={() => setShowTeam(true)} style={{
        background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
        border: "none", borderRadius: 14, padding: 16, width: "100%",
        color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        ⚔️ تكوين الفريق قبل المعركة
      </button>
      {floors.map(f => {
        const isFloor1Disabled = !hasTeam;
        
        return (
        <div key={f.floor} style={{ background: (f.locked || isFloor1Disabled) ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, border: `1px solid ${(f.locked || isFloor1Disabled) ? "rgba(255,255,255,0.05)" : f.color + "44"}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: (f.locked || isFloor1Disabled) ? 0.5 : 1 }}>
          <button disabled={f.locked || isFloor1Disabled} onClick={() => setBattleFloor(f.floor)} style={{ background: (f.locked || isFloor1Disabled) ? "rgba(107,114,128,0.3)" : `${f.color}22`, color: (f.locked || isFloor1Disabled) ? "#9CA3AF" : f.color, border: `1px solid ${(f.locked || isFloor1Disabled) ? "#374151" : f.color + "55"}`, borderRadius: 10, padding: "8px 14px", cursor: (f.locked || isFloor1Disabled) ? "default" : "pointer", fontWeight: 700 }}>
            {f.locked ? "🔒 مغلق" : isFloor1Disabled ? "⚠️ لا فريق" : selected === f.floor ? "✅ تم" : "▶ ابدأ"}
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontWeight: 700 }}>الطابق {f.floor} — {f.name}</div>
            <div style={{ color: f.color, fontSize: 12 }}>صعوبة: {f.difficulty}</div>
          </div>
        </div>
        );
      })}
      {selected && <div style={{ background: "rgba(52,211,153,0.1)", borderRadius: 14, padding: 16, border: "1px solid rgba(52,211,153,0.3)", textAlign: "center", color: "#34D399", fontWeight: 700 }}>⚔️ جاهز للقتال في الطابق {selected}!</div>}
    </div>
  );
}
