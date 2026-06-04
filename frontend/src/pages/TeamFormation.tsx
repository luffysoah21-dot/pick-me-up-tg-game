import { useState, useEffect } from "react";

const RARITY_COLOR: Record<string, string> = {
  SSR: "#FFD700",
  SR: "#C084FC",
  R: "#60A5FA",
  B: "#6B7280",
};

interface Hero {
  name: string;
  icon: string;
  rarity: string;
  stars: number;
  attack?: number;
  hp?: number;
}

export default function TeamFormation({ onBack }: { onBack: () => void }) {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [team, setTeam] = useState<Hero[]>([]);

  useEffect(() => {
    const storedHeroes = localStorage.getItem("my_heroes");
    const storedTeam = localStorage.getItem("my_team");
    setAllHeroes(storedHeroes ? JSON.parse(storedHeroes) : []);
    setTeam(storedTeam ? JSON.parse(storedTeam) : []);
  }, []);

  const saveTeam = (updated: Hero[]) => {
    localStorage.setItem("my_team", JSON.stringify(updated));
    setTeam(updated);
  };

  const toggleHero = (hero: Hero) => {
    const exists = team.some(h => h.name === hero.name);
    if (exists) {
      saveTeam(team.filter(h => h.name !== hero.name));
    } else if (team.length < 5) {
      saveTeam([...team, hero]);
    } else {
      alert("الحد الأقصى 5 أبطال في الفريق");
    }
  };

  const isInTeam = (hero: Hero) => team.some(h => h.name === hero.name);

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 14, color: "#fff" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 14 }}>
          ← رجوع
        </button>
        <div style={{ fontSize: 20, fontWeight: 900 }}>⚔️ تكوين الفريق</div>
      </div>

      {/* Team Slots */}
      <div style={{ background: "rgba(124,58,237,0.12)", borderRadius: 16, padding: 16, border: "1px solid rgba(139,92,246,0.25)" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 12 }}>
          الفريق الحالي ({team.length}/5)
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} onClick={() => team[i] && saveTeam(team.filter((_,idx) => idx !== i))} style={{
              width: 52, height: 52, borderRadius: 12, cursor: team[i] ? "pointer" : "default",
              background: team[i] ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${team[i] ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: team[i] ? 26 : 18, color: "rgba(255,255,255,0.2)",
              position: "relative",
            }}>
              {team[i] ? team[i].icon : "＋"}
              {team[i] && (
                <div style={{ position: "absolute", top: -6, left: -6, background: "#EF4444", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 900 }}>✕</div>
              )}
            </div>
          ))}
        </div>
        {team.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 10, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            اضغط على البطل لإزالته من الفريق
          </div>
        )}
      </div>

      {/* Hero List */}
      {allHeroes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48 }}>✨</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>لا يوجد أبطال بعد</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 6 }}>اذهب لصفحة الاستدعاء أولاً</div>
        </div>
      ) : (
        <>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            اختر من مجموعتك ({allHeroes.length} بطل)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {allHeroes.map((hero, i) => {
              const selected = isInTeam(hero);
              return (
                <div key={i} onClick={() => toggleHero(hero)} style={{
                  background: selected ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
                  borderRadius: 14, padding: 14, textAlign: "center",
                  border: `1px solid ${selected ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.07)"}`,
                  cursor: "pointer", position: "relative",
                  transform: selected ? "scale(0.97)" : "scale(1)",
                  transition: "all 0.15s ease",
                }}>
                  {selected && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: "#34D399", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#000" }}>✓</div>
                  )}
                  <div style={{ fontSize: 38 }}>{hero.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginTop: 8 }}>{hero.name}</div>
                  <div style={{ display: "inline-block", marginTop: 6, background: RARITY_COLOR[hero.rarity] ?? "#6B7280", color: "#000", padding: "2px 10px", borderRadius: 10, fontSize: 10, fontWeight: 900 }}>
                    {hero.rarity}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>
                    {"⭐".repeat(hero.stars)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
