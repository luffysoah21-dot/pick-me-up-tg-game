export type HeroRarity = 'عادي' | 'نادر' | 'ملحمي' | 'أسطوري';

export interface Hero {
  id: string;
  name: string;
  role: string;
  rarity: HeroRarity;
  element: string;
  power: string;
  attack: number;
  defense: number;
  hp: number;
  description: string;
  image: string;
  accent: string;
}

export const availableHeroes: Hero[] = [
  {
    id: 'serena',
    name: 'سيرينا الليلية',
    role: 'ساحرة ظل',
    rarity: 'أسطوري',
    element: 'قمرية',
    power: 'لهيب الليل',
    attack: 108,
    defense: 72,
    hp: 860,
    description: 'تسقط لعنات الظلال على الأعداء من مسافة بعيدة.',
    image: '🌙',
    accent: 'from-violet-500 via-fuchsia-500 to-rose-500',
  },
  {
    id: 'orion',
    name: 'أورين القاسي',
    role: 'محارب',
    rarity: 'ملحمي',
    element: 'أرضية',
    power: 'درع العاصفة',
    attack: 96,
    defense: 88,
    hp: 940,
    description: 'يحمي فريقه ويكسر خطوط العدو بسهام طاقة.',
    image: '🛡️',
    accent: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    id: 'maria',
    name: 'ماريا الظلية',
    role: 'رامية',
    rarity: 'نادر',
    element: 'عاصفة',
    power: 'قصبة العاصفة',
    attack: 84,
    defense: 56,
    hp: 720,
    description: 'تسدد سهاماً متوهجة تخترق الصفوف بسرعة.',
    image: '🏹',
    accent: 'from-sky-400 via-indigo-500 to-purple-500',
  },
  {
    id: 'kael',
    name: 'كايل الجمر',
    role: 'ساحر',
    rarity: 'نادر',
    element: 'ناري',
    power: 'نيران الجحيم',
    attack: 92,
    defense: 60,
    hp: 700,
    description: 'يطلق شعلات متفجرة تحرق الأرض أمامه.',
    image: '🔥',
    accent: 'from-orange-500 via-red-500 to-rose-500',
  },
  {
    id: 'lyra',
    name: 'لايرا الريح',
    role: 'سارقة',
    rarity: 'نادر',
    element: 'هوائي',
    power: 'خطى الظلال',
    attack: 78,
    defense: 50,
    hp: 660,
    description: 'تختفي بين النسيم وتهاجم من الخلف بسرعة خاطفة.',
    image: '🌪️',
    accent: 'from-cyan-400 via-sky-500 to-indigo-500',
  },
  {
    id: 'thar',
    name: 'ثار الحديد',
    role: 'دبابة',
    rarity: 'عادي',
    element: 'أرضية',
    power: 'صخرة الثبات',
    attack: 62,
    defense: 96,
    hp: 1080,
    description: 'يتدخل أولاً ويصد الهجمات بعزيمة لا تتزعزع.',
    image: '🪨',
    accent: 'from-stone-500 via-slate-500 to-zinc-500',
  },
  {
    id: 'nima',
    name: 'نيمة الفاتنة',
    role: 'كاهنة',
    rarity: 'ملحمي',
    element: 'روحي',
    power: 'نور الشفاء',
    attack: 74,
    defense: 64,
    hp: 780,
    description: 'تشفي الحلفاء وتمنحهم دروعاً روحية قوية.',
    image: '✨',
    accent: 'from-fuchsia-500 via-pink-500 to-amber-500',
  },
  {
    id: 'yara',
    name: 'يارا الغامضة',
    role: 'قناصة',
    rarity: 'عادي',
    element: 'ظل',
    power: 'طلقة القمر',
    attack: 80,
    defense: 48,
    hp: 640,
    description: 'تطلق طلقة واحدة دقيقة تخترق دروع العدو.',
    image: '🌌',
    accent: 'from-slate-700 via-purple-700 to-fuchsia-700',
  },
  {
    id: 'rafe',
    name: 'رافي الصاعقة',
    role: 'قائد',
    rarity: 'ملحمي',
    element: 'برق',
    power: 'صاعقة القوات',
    attack: 90,
    defense: 78,
    hp: 820,
    description: 'يرفع معنويات الفريق ويضرب الأعداء بصواعق.',
    image: '⚡',
    accent: 'from-yellow-400 via-amber-500 to-orange-500',
  },
  {
    id: 'ain',
    name: 'أين نسيم',
    role: 'ساحرة',
    rarity: 'أسطوري',
    element: 'ضباب',
    power: 'ضباب الأبدية',
    attack: 102,
    defense: 68,
    hp: 830,
    description: 'تسيطر على ساحة المعركة وتشتت الأعداء بمهارتها.',
    image: '🌫️',
    accent: 'from-slate-600 via-cyan-500 to-blue-500',
  },
];

export const rarityOrder: HeroRarity[] = ['عادي', 'نادر', 'ملحمي', 'أسطوري'];

export const rarityColors: Record<HeroRarity, string> = {
  عادي: 'text-slate-300 bg-slate-800',
  نادر: 'text-sky-200 bg-sky-900',
  ملحمي: 'text-fuchsia-200 bg-fuchsia-950',
  أسطوري: 'text-amber-200 bg-amber-950',
};
