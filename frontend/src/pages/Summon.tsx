import { useState } from "react";

const rarityPool = [
  { rarity: "SSR", weight: 3, icon: "🐉", color: "#FFD700" },
  { rarity: "SR", weight: 12, icon: "🌟", color: "#C084FC" },
  { rarity: "R", weight: 35, icon: "⚔️", color: "#60A5FA" },
  { rarity: "B", weight: 50, icon: "🗡️", color: "#6B7280" },
];

const heroNames: Record<string, string[]> = {
  SSR: ["المحارب الأزلي", "إلهة الدمار", "تنين الظلام"],
  SR: ["سيف الفجر", "ساحرة الصحراء", "القناص الأسود"],
  R: ["حارس الغابة", "المحارب الشجاع", "الراهب المقاتل"],
  B: ["مجند عادي", "جندي المشاة", "الحارس الصغير"],
};

export default function SummonPage() {
  const [crystals, setCrystals] = useState(300);
  const [result, setResult] = useState<{ name: string; rarity: string; stars: number; icon: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const doSummon = (cost: number) => {
    if (crystals < cost) {
      alert("كريستالك غير كافٍ!");
      return;
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const rand = Math.random() * 100;
      let cum = 0;
      let picked = rarityPool[3];
      for (const r of rarityPool) {
        cum += r.weight;
        if (rand < cum) {
          picked = r;
          break;
        }
      }
      const names = heroNames[picked.rarity];
      const name = names[Math.floor(Math.random() * names.length)];
      const stars = ({ SSR: 5, SR: 4, R: 3, B: 1 } as Record<string, number>)[picked.rarity] ?? 1;
      setCrystals((c) => c - cost);
      setResult({ name, rarity: picked.rarity, stars, icon: picked.icon });
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, direction: "rtl" }}>
      <style>{`@keyframes pop { from { opacity:0; transform:scale(0.8) } to { opacity:1; transform:scale(1) } }`}</style>

      {result && (
        <div
          style={{
            background: "rgba(124,58,237,0.2)",
            borderRadius: 16,
            padding: 24,
            textAlign: "center",
            border: "1px solid rgba(139,92,246,0.4)",
            animation: "pop 0.3s ease",
          }}
        >
          <div style={{ fontSize: 64 }}>{result.icon}</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 8 }}>{result.name}</div>
          <div style={{ fontSize: 18, marginTop: 4 }}>{"⭐".repeat(result.stars)}</div>
          <div
            style={{
              display: "inline-block",
              marginTop: 8,
              background: rarityPool.find((r) => r.rarity === result.rarity)?.color ?? "#6B7280",
              color: "#000",
              padding: "2px 16px",
              borderRadius: 20,
              fontWeight: 900,
            }}
          >
            {result.rarity}
          </div>
        </div>
      )}

      <div
        style={{
          background: "linear-gradient(135deg, #1E1B4B, #312E81)",
          borderRadius: 16,
          padding: 20,
          textAlign: "center",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <div style={{ fontSize: 48 }}>✨</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 8 }}>بوابة الاستدعاء</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>استدعِ أبطالاً أسطوريين</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: 14,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {rarityPool.map((r) => (
          <div key={r.rarity} style={{ textAlign: "center" }}>
            <div style={{ background: r.color, color: "#000", borderRadius: 6, fontSize: 11, fontWeight: 900, padding: "2px 0" }}>
              {r.rarity}
            </div>
            <div style={{ color: "#fff", fontWeight: 700, marginTop: 4 }}>{r.weight}%</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => doSummon(100)}
        disabled={loading || crystals < 100}
        style={{
          background: crystals < 100 ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7C3AED,#4F46E5)",
          border: "none",
          borderRadius: 14,
          padding: 18,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: crystals < 100 ? 0.5 : 1,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.7)" }}>💎 100</span>
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{loading ? "جارٍ الاستدعاء..." : "استدعاء ×1"}</span>
      </button>

      <button
        onClick={() => doSummon(900)}
        disabled={loading || crystals < 900}
        style={{
          background: crystals < 900 ? "rgba(245,158,11,0.2)" : "linear-gradient(135deg,#D97706,#92400E)",
          border: "2px solid rgba(251,191,36,0.3)",
          borderRadius: 14,
          padding: 18,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: crystals < 900 ? 0.5 : 1,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.7)" }}>💎 900</span>
        <span style={{ color: "#FCD34D", fontSize: 18, fontWeight: 800 }}>استدعاء ×10</span>
      </button>

      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        رصيدك: <span style={{ color: "#FCD34D", fontWeight: 700 }}>💎 {crystals}</span>
      </div>
    </div>
  );
}
