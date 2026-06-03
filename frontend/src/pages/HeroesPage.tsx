export default function HeroesPage() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900, textAlign: "right", marginBottom: 16 }}>
        أبطالي ⚔️
      </div>
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>⚔️</div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginTop: 12 }}>
          لا يوجد أبطال بعد
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
          اذهب للاستدعاء للحصول على أبطال
        </div>
      </div>
    </div>
  );
}
