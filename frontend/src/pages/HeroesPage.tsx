export default function HeroesPage() {
  const stored = localStorage.getItem("my_heroes");
  const heroes = stored ? JSON.parse(stored) : [];

  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>
        أبطالي ⚔️ ({heroes.length})
      </div>

      {heroes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48 }}>⚔️</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginTop: 12 }}>لا يوجد أبطال بعد</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>اذهب للاستدعاء للحصول على أبطال</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {heroes.map((hero: any, i: number) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>{hero.icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginTop: 8 }}>{hero.name}</div>
              <div style={{ display: "inline-block", marginTop: 6, background: hero.rarity === "SSR" ? "#FFD700" : hero.rarity === "SR" ? "#C084FC" : hero.rarity === "R" ? "#60A5FA" : "#6B7280", color: "#000", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 900 }}>{hero.rarity}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{"⭐".repeat(hero.stars)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
