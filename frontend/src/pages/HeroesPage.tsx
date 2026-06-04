import { useState, useEffect } from "react";

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("my_heroes");
    setHeroes(stored ? JSON.parse(stored) : []);
  }, []);

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
            <div 
              key={i} 
              onClick={() => setSelectedHero(hero)}
              style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 40 }}>{hero.icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginTop: 8 }}>{hero.name}</div>
              <div style={{ display: "inline-block", marginTop: 6, background: hero.rarity === "SSR" ? "#FFD700" : hero.rarity === "SR" ? "#C084FC" : hero.rarity === "R" ? "#60A5FA" : "#6B7280", color: "#000", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 900 }}>{hero.rarity}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{"⭐".repeat(hero.stars)}</div>
            </div>
          ))}
        </div>
      )}

      {selectedHero && (
        <div 
          onClick={() => setSelectedHero(null)} 
          style={{
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0.8)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            zIndex: 100, 
            direction: "rtl",
          }}>
          <div 
            onClick={e => e.stopPropagation()} 
            style={{
              background: "#1E1B4B", 
              borderRadius: 20, 
              padding: 28,
              width: "80%", 
              maxWidth: 320, 
              textAlign: "center",
              border: "1px solid rgba(139,92,246,0.4)",
            }}>
            <div style={{ fontSize: 72 }}>{selectedHero.icon}</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 12 }}>
              {selectedHero.name}
            </div>
            <div style={{ 
              display: "inline-block", 
              marginTop: 8,
              background: selectedHero.rarity === "SSR" ? "#FFD700" : selectedHero.rarity === "SR" ? "#C084FC" : selectedHero.rarity === "R" ? "#60A5FA" : "#6B7280",
              color: "#000", 
              padding: "3px 18px", 
              borderRadius: 20, 
              fontWeight: 900, 
              fontSize: 14,
            }}>
              {selectedHero.rarity}
            </div>
            <div style={{ fontSize: 20, marginTop: 8 }}>{"⭐".repeat(selectedHero.stars)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 10 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>قوة الهجوم</div>
                <div style={{ color: "#F87171", fontWeight: 900, fontSize: 18 }}>
                  {selectedHero.attack ?? Math.floor(Math.random() * 500) + 300}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 10 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>نقاط الحياة</div>
                <div style={{ color: "#34D399", fontWeight: 900, fontSize: 18 }}>
                  {selectedHero.hp ?? Math.floor(Math.random() * 1000) + 1000}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedHero(null)} 
              style={{
                marginTop: 20, 
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                border: "none", 
                borderRadius: 12, 
                padding: "10px 32px",
                color: "#fff", 
                fontWeight: 700, 
                cursor: "pointer", 
                fontSize: 15,
              }}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
