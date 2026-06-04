export interface FloorStage {
  id: number;
  name: string;
  type: 'combat' | 'escape' | 'survival' | 'puzzle' | 'boss';
  description: string;
  enemies?: string[];
  timeLimit?: number;
  puzzleHint?: string;
  reward: { exp: number; gold: number };
}

export interface Floor {
  id: number;
  name: string;
  type: 'combat' | 'escape' | 'survival' | 'puzzle' | 'boss';
  stages: FloorStage[];
  unlockCondition: string;
}

const FLOORS: Floor[] = [
  { id: 1, name: 'طابق القتال', type: 'combat', unlockCondition: 'متاح من البداية', stages: [
    { id: 1, name: 'المواجهة الأولى', type: 'combat', description: 'مواجهة حراس البرج', enemies: ['حارس ضعيف', 'حارس ضعيف'], reward: { exp: 50, gold: 30 } },
    { id: 2, name: 'الكمين', type: 'combat', description: 'قطاع طرق يهاجمون', enemies: ['قاطع طريق', 'قائد الكمين'], reward: { exp: 80, gold: 50 } },
    { id: 3, name: 'حارس الطابق', type: 'combat', description: 'هزم حارس الطابق الأول', enemies: ['حارس الطابق الأول'], reward: { exp: 150, gold: 100 } },
  ]},
  { id: 2, name: 'طابق الهروب', type: 'escape', unlockCondition: 'أكمل طابق القتال', stages: [
    { id: 1, name: 'الفرار من السجن', type: 'escape', description: 'اهرب قبل أن يصطادك الحراس', timeLimit: 60, reward: { exp: 60, gold: 40 } },
    { id: 2, name: 'المتاهة', type: 'escape', description: 'اجد مخرجاً من المتاهة', timeLimit: 90, reward: { exp: 90, gold: 60 } },
    { id: 3, name: 'العاصفة', type: 'escape', description: 'اهرب من العاصفة السحرية', timeLimit: 45, reward: { exp: 100, gold: 70 } },
    { id: 4, name: 'جسر الهاوية', type: 'escape', description: 'اعبر الجسر قبل أن يسقط', timeLimit: 30, reward: { exp: 200, gold: 120 } },
  ]},
  { id: 3, name: 'طابق النجاة', type: 'survival', unlockCondition: 'أكمل طابق الهروب', stages: [
    { id: 1, name: 'موجة الأعداء', type: 'survival', description: 'انجو من 3 موجات', timeLimit: 120, reward: { exp: 80, gold: 50 } },
    { id: 2, name: 'الحصار', type: 'survival', description: 'صمد في وجه الحصار', timeLimit: 180, reward: { exp: 100, gold: 70 } },
    { id: 3, name: 'الغزو', type: 'survival', description: 'احمِ القاعدة', enemies: ['غازي', 'قائد الغزاة'], timeLimit: 150, reward: { exp: 120, gold: 80 } },
    { id: 4, name: 'ليلة الوحوش', type: 'survival', description: 'انجو حتى الفجر', timeLimit: 200, reward: { exp: 150, gold: 100 } },
    { id: 5, name: 'آخر الصامدين', type: 'survival', description: 'أنت الأخير - انجو', timeLimit: 240, reward: { exp: 250, gold: 150 } },
  ]},
  { id: 4, name: 'طابق الألغاز', type: 'puzzle', unlockCondition: 'أكمل طابق النجاة', stages: [
    { id: 1, name: 'لغز المرايا', type: 'puzzle', description: 'اكتشف الانعكاس الصحيح', puzzleHint: 'ليس كل ما تراه حقيقياً', reward: { exp: 100, gold: 80 } },
    { id: 2, name: 'رموز القدماء', type: 'puzzle', description: 'افك شفرة الكتابة القديمة', puzzleHint: 'الأرقام تخفي الحروف', reward: { exp: 130, gold: 100 } },
    { id: 3, name: 'بوابة الحكماء', type: 'puzzle', description: 'أجب على أسئلة الحكماء', puzzleHint: 'الإجابة في السؤال نفسه', reward: { exp: 300, gold: 200 } },
  ]},
  { id: 5, name: 'القتال النهائي', type: 'boss', unlockCondition: 'أكمل طابق الألغاز', stages: [
    { id: 1, name: 'بوابة الظلام', type: 'boss', description: 'اختراق الحراسة الخارجية', enemies: ['حارس النخبة'], reward: { exp: 200, gold: 150 } },
    { id: 2, name: 'الجنرال الأول', type: 'boss', description: 'هزم الجنرال الأول', enemies: ['الجنرال إيرون'], reward: { exp: 300, gold: 200 } },
    { id: 3, name: 'الجنرال الثاني', type: 'boss', description: 'الجنرال الثاني أقوى', enemies: ['الجنرال شادو'], reward: { exp: 400, gold: 250 } },
    { id: 4, name: 'اختبار الإرادة', type: 'boss', description: 'واجه نسختك المظلمة', enemies: ['الذات المظلمة'], reward: { exp: 500, gold: 300 } },
    { id: 5, name: 'الحارس الأخير', type: 'boss', description: 'الحارس الشخصي للملك', enemies: ['الحارس الأزلي'], reward: { exp: 600, gold: 400 } },
    { id: 6, name: 'ملك الظلام', type: 'boss', description: 'المواجهة النهائية', enemies: ['ملك الظلام'], reward: { exp: 1000, gold: 1000 } },
  ]},
];

export default FLOORS;
