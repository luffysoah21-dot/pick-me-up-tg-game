import Battle from './Battle';
import { useState } from "react";
import FLOORS from "../data/floors";
import type { Floor } from "../data/floors";

const Tower = () => {
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  if (selectedFloor && selectedStage !== null) {
    const stage = selectedFloor.stages[selectedStage];
    const enemies = (stage.enemies ?? []).map((e: any) => ({
      name: e, icon: "👹",
      hp: 500 + selectedStage * 300,
      attack: 80 + selectedStage * 50,
      defense: 20 + selectedStage * 10,
      maxHp: 500 + selectedStage * 300,
    }));
    return <Battle
      floor={selectedStage + 1}
      onBack={(won) => {
        setSelectedStage(null);
        if (won) setSelectedFloor(null);
      }}
    />;
  }

  if (selectedFloor) {
    return (
      <div style={{ padding: 16, color: "#fff" }}>
        <h2 style={{ textAlign: "center" }}>{selectedFloor.name}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedFloor.stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(index)}
              style={{
                padding: 16,
                background: "rgba(124,58,237,0.3)",
                border: "1px solid #7C3AED",
                borderRadius: 12,
                color: "#fff",
                textAlign: "right",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700 }}>المرحلة {stage.id}: {stage.name}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{stage.description}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedFloor(null)}
          style={{
            marginTop: 16,
            padding: "12px 24px",
            background: "#374151",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          ← رجوع للبرج
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, color: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 900 }}>🏰 البرج</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FLOORS.map((floor) => (
          <button
            key={floor.id}
            onClick={() => setSelectedFloor(floor)}
            style={{
              padding: 16,
              background: "rgba(124,58,237,0.2)",
              border: "1px solid #7C3AED",
              borderRadius: 12,
              color: "#fff",
              textAlign: "right",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              طابق {floor.id}: {floor.name}
            </div>
            <div style={{ fontSize: 12, color: "#aaa" }}>
              {floor.stages.length} مراحل | {floor.unlockCondition}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tower;
