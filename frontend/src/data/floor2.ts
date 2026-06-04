export const floor2Monsters = [
  {
    id: "trap_spider",
    name: "عنكبوت الفخ",
    emoji: "🕷️",
    hp: 1800, maxHp: 1800, atk: 280, def: 60, speed: 120,
    skills: [
      { name: "شبكة السم", damage: 350, cooldown: 2, effect: "يبطئ الفريق، speed -30%" },
      { name: "لدغة مميتة", damage: 500, cooldown: 3, effect: "سم لمدة 3 أدوار" }
    ],
    rewards: { exp: 600, gold: 120 }
  },
  {
    id: "shadow_assassin",
    name: "قاتل الظلال",
    emoji: "🥷",
    hp: 2200, maxHp: 2200, atk: 520, def: 40, speed: 150,
    skills: [
      { name: "ضربة خفية", damage: 800, cooldown: 2, effect: "يتجاهل 50% من الدفاع" },
      { name: "اختفاء", damage: 0, cooldown: 4, effect: "يتجنب الهجوم التالي" }
    ],
    rewards: { exp: 900, gold: 180 }
  },
  {
    id: "stone_guardian",
    name: "حارس الحجر",
    emoji: "🗽",
    hp: 6000, maxHp: 6000, atk: 450, def: 500, speed: 30,
    skills: [
      { name: "جدار الحجر", damage: 0, cooldown: 3, effect: "يمتص الضرر التالي بالكامل" },
      { name: "سحق الأرض", damage: 900, cooldown: 2, effect: "يضرب الفريق كله" }
    ],
    rewards: { exp: 1100, gold: 220 }
  },
  {
    id: "floor2_boss",
    name: "سيد المتاهة",
    emoji: "👺",
    hp: 15000, maxHp: 15000, atk: 1100, def: 350, speed: 90,
    isBoss: true,
    skills: [
      { name: "متاهة الجحيم", damage: 0, cooldown: 3, effect: "يصعق بطلاً عشوائياً لدورين" },
      { name: "موجة الظلام", damage: 1400, cooldown: 2, effect: "يضرب الفريق كله" },
      { name: "بوابة الفناء", damage: 2500, cooldown: 5, effect: "يقتل بطلاً فورياً بنسبة 40%" }
    ],
    rewards: { exp: 6000, gold: 1200, gem: 15 }
  }
];

export const floor2Stages = [
  { id: 1, name: "نفق العناكب", monsters: ["trap_spider", "trap_spider"], background: "spider-tunnel" },
  { id: 2, name: "ظلام القاتلين", monsters: ["shadow_assassin"], background: "shadow-alley" },
  { id: 3, name: "قاعة الحراس", monsters: ["stone_guardian", "trap_spider"], background: "stone-hall" },
  { id: 4, name: "متاهة السيد", monsters: ["floor2_boss"], background: "maze-throne", isBoss: true }
];
