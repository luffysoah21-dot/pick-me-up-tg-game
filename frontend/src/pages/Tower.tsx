import { useState } from "react";

const floors = [
  { floor: 50, name: "الطابق المظلم",  difficulty: "أسطوري", color: "#EF4444", locked: true },
  { floor: 30, name: "قلعة الظلام",    difficulty: "صعب",    color: "#F59E0B", locked: true },
  { floor: 20, name: "غرفة الامتحان",  difficulty: "متوسط",  color: "#60A5FA", locked: false },
  { floor: 10, name: "البداية",         difficulty: "سهل",   color: "#34D399", locked: false },
];

export default function Tower() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>🏯 برج التحدي</div>
      {floors.map(f => (
        <div key={f.floor} style={{ background: f.locked ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, border: `1px solid ${f.locked ? "rgba(255,255,255,0.05)" : f.color + "44"}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: f.locked ? 0.5 : 1 }}>
          <button disabled={f.locked} onClick={() => setSelected(f.floor)} style={{ background: f.locked ? "rgba(107,114,128,0.3)" : `${f.color}22`, color: f.locked ? "#9CA3AF" : f.color, border: `1px solid ${f.locked ? "#374151" : f.color + "55"}`, borderRadius: 10, padding: "8px 14px", cursor: f.locked ? "default" : "pointer", fontWeight: 700 }}>
            {f.locked ? "🔒 مغلق" : selected === f.floor ? "✅ تم" : "▶ ابدأ"}
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontWeight: 700 }}>الطابق {f.floor} — {f.name}</div>
            <div style={{ color: f.color, fontSize: 12 }}>صعوبة: {f.difficulty}</div>
          </div>
        </div>
      ))}
      {selected && <div style={{ background: "rgba(52,211,153,0.1)", borderRadius: 14, padding: 16, border: "1px solid rgba(52,211,153,0.3)", textAlign: "center", color: "#34D399", fontWeight: 700 }}>⚔️ جاهز للقتال في الطابق {selected}!</div>}
    </div>
  );
}
