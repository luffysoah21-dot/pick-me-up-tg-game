export const floor1Monsters = [
      {
            id: "shadow_wolf",
                name: "ذئب الظلام",
                    emoji: "🐺",
                        hp: 2400,
                            maxHp: 2400,
                                atk: 380,
                                    def: 120,
                                        speed: 85,
                                            skills: [
                                                      { name: "عواء الظلام", damage: 450, cooldown: 2, effect: "يخفض دفاع الفريق 20%" },
                                                            { name: "قضمة مميتة", damage: 600, cooldown: 3, effect: "نزيف لمدة 2 دور" }
                                            ],
                                                rewards: { exp: 800, gold: 150 },
                                                    lore: "ذئب ولد من ظلام البرج، لا يرحم ضعفاء"
      },
        {
                id: "iron_golem",
                    name: "غولم الحديد",
                        emoji: "🗿",
                            hp: 5000,
                                maxHp: 5000,
                                    atk: 520,
                                        def: 350,
                                            speed: 40,
                                                skills: [
                                                          { name: "قبضة الحديد", damage: 700, cooldown: 2, effect: "يصعق ويوقف بطل واحد دوراً" },
                                                                { name: "درع فولاذي", damage: 0, cooldown: 4, effect: "يرفع دفاعه 50% لدورين" }
                                                ],
                                                    rewards: { exp: 1200, gold: 250 },
                                                        lore: "آلة قتل صنعها ساحر مجنون"
        },
          {
                id: "blood_witch",
                    name: "ساحرة الدماء",
                        emoji: "🧙‍♀️",
                            hp: 3200,
                                maxHp: 3200,
                                    atk: 680,
                                        def: 80,
                                            speed: 95,
                                                skills: [
                                                          { name: "نار الدماء", damage: 850, cooldown: 2, effect: "حرق لمدة 3 أدوار" },
                                                                { name: "امتصاص الروح", damage: 400, cooldown: 3, effect: "تسترجع HP بقدر الضرر" }
                                                ],
                                                    rewards: { exp: 1000, gold: 200 },
                                                        lore: "ساحرة تغذت على دماء المقاتلين لقرون"
          },
            {
                    id: "floor1_boss",
                        name: "حارس البرج الأول",
                            emoji: "👹",
                                hp: 12000,
                                    maxHp: 12000,
                                        atk: 950,
                                            def: 400,
                                                speed: 70,
                                                    isBoss: true,
                                                        skills: [
                                                                  { name: "غضب الحارس", damage: 1200, cooldown: 2, effect: "يضرب الفريق بالكامل" },
                                                                        { name: "طاقة الظلام", damage: 800, cooldown: 3, effect: "يستعيد 2000 HP" },
                                                                              { name: "ضربة الفناء", damage: 2000, cooldown: 5, effect: "تقتل بطلاً فورياً إذا HP أقل 30%" }
                                                        ],
                                                            rewards: { exp: 5000, gold: 1000, gem: 10 },
                                                                lore: "خُلق ليحمي البرج إلى الأبد"
            }
];

export const floor1Stages = [
      { id: 1, name: "مدخل الظلام", monsters: ["shadow_wolf"], background: "dark-forest" },
        { id: 2, name: "ساحة الحديد", monsters: ["iron_golem"], background: "iron-dungeon" },
          { id: 3, name: "كهف الدماء", monsters: ["blood_witch", "shadow_wolf"], background: "blood-cave" },
            { id: 4, name: "عرش الحارس", monsters: ["floor1_boss"], background: "boss-throne", isBoss: true }
];