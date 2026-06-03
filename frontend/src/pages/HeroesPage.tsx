import { useGameStore } from '../store/useGameStore';

export default function HeroesPage() {
  const { playerHeroes } = useGameStore();
  const safeHeroes = playerHeroes ?? [];

  if (safeHeroes.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 48 }}>⚔️</div>
        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>
          لا يوجد أبطال بعد
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
          اذهب للاستدعاء للحصول على أبطال
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>
        أبطالي ({safeHeroes.length})
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {safeHeroes.map((hero) => (
          <div key={hero.id} style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: 14,
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ fontSize: 36, textAlign: "center" }}>⚔️</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", marginTop: 8 }}>
              {hero.hero.name ?? "بطل مجهول"}
            </div>
            <div style={{
              background: "#7C3AED",
              color: "#fff",
              fontSize: 10,
              fontWeight: 900,
              padding: "2px 8px",
              borderRadius: 10,
              textAlign: "center",
              marginTop: 6
            }}>
              {hero.hero.rarity ?? "R"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
