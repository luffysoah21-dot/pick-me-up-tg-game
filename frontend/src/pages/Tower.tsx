import { useState } from "react";
import TeamFormation from "./TeamFormation";
import Floor1Battle from "../components/Floor1Battle";

const floors = [
  { floor: 1, name: "الطابق الأول", difficulty: "بداية", color: "#8B5CF6", locked: false },
];

export default function Tower() {
  const [showTeam, setShowTeam] = useState(false);
  const [battleFloor, setBattleFloor] = useState<number | null>(null);

  const selectedTeamStr = localStorage.getItem('my_team');
  const selectedTeam = selectedTeamStr ? JSON.parse(selectedTeamStr) : [];
  const hasTeam = Array.isArray(selectedTeam) && selectedTeam.length > 0;

  if (showTeam) return <TeamFormation onBack={() => setShowTeam(false)} />;
  if (battleFloor === 1) return <Floor1Battle floor={1} onBack={(won) => { setBattleFloor(null); }} />;

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>🏯 برج التحدي</div>

      <button
        onClick={() => setShowTeam(true)}
        style={{
          background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
          border: "none", borderRadius: 14, padding: 16, width: "100%",
          color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        ⚔️ تكوين الفريق قبل المعركة
      </button>

      {floors.map(f => (
        <div key={f.floor} style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 14,
          padding: 16, border: `1px solid ${f.color}44`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700 }}>الطابق {f.floor} — {f.name}</div>
            <div style={{ color: f.color, fontSize: 12 }}>صعوبة: {f.difficulty}</div>
          </div>
          <button
            disabled={!hasTeam}
            onClick={() => setBattleFloor(f.floor)}
            style={{
              background: hasTeam ? f.color : "rgba(107,114,128,0.3)",
              color: hasTeam ? "#fff" : "#9CA3AF",
              border: "none", borderRadius: 10, padding: "8px 14px",
              cursor: hasTeam ? "pointer" : "default", fontWeight: 700,
            }}
          >
            {hasTeam ? "▶ ابدأ" : "⚠️ لا فريق"}
          </button>
        </div>
      ))}
    </div>
  );
}
