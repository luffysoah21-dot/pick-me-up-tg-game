import { Link } from 'react-router-dom';

export default function Tower() {
  return (
    <section className="space-y-6 text-right">
      <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/90 p-6 shadow-xl shadow-cyan-500/10">
        <h2 className="text-3xl font-black text-cyan-200">برج التحدي</h2>
        <p className="mt-3 text-slate-400 leading-7">
          تسلّق طبقات البرج وواجه التحديات القاتلة. كل مستوى يمنحك فرصة جديدة لاستدعاء مكافآت ومهارات.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">المستوى الحالي</p>
          <p className="mt-3 text-3xl font-black text-white">الطابق 12</p>
          <p className="mt-2 text-slate-400">التهديد: أسطورة الظلال</p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">أقرب مكافأة</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-300">سيف القمر المظلم</p>
          <p className="mt-2 text-slate-400">زد قوة هجومك وتغلب على أعداء الظلال.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/30">
        <div className="flex items-center justify-between gap-3 text-right sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-slate-500">نسبة الإنجاز</p>
            <p className="mt-2 text-3xl font-black text-white">72%</p>
          </div>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button className="rounded-3xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
            بدء المعركة
          </button>
          <Link to="/profile" className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:bg-slate-900">
            فتح الملف الشخصي
          </Link>
        </div>
      </div>
    </section>
  );
}
