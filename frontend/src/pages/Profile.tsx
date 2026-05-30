export default function Profile() {
  return (
    <section className="space-y-6 text-right">
      <div className="rounded-[2rem] border border-fuchsia-400/15 bg-slate-950/90 p-6 shadow-xl shadow-fuchsia-500/10">
        <h2 className="text-3xl font-black text-fuchsia-200">الملف الشخصي</h2>
        <p className="mt-3 text-slate-400 leading-7">
          تتبع تقدمك في برج التحدي، نقاط الشرف، ونسبة الفوز. جهز نفسك لكل مواجهة جديدة.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">القوة الكلية</p>
          <p className="mt-3 text-4xl font-black text-white">89</p>
          <p className="mt-2 text-slate-400">درجة تمثل قوة فريقك الحالية في مواجهة الظلال.</p>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">المستوى</p>
          <p className="mt-3 text-4xl font-black text-emerald-300">15</p>
          <p className="mt-2 text-slate-400">التقدم في قصة اللعبة ومدى تأهلك للمهام الأعلى.</p>
        </article>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30">
        <dl className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">نسبة الفوز</dt>
            <dd className="mt-2 text-xl font-semibold text-white">78%</dd>
          </div>
          <div>
            <dt className="text-slate-500">الذهب</dt>
            <dd className="mt-2 text-xl font-semibold text-emerald-300">2,430</dd>
          </div>
          <div>
            <dt className="text-slate-500">الجوائز المجمعة</dt>
            <dd className="mt-2 text-xl font-semibold text-white">12</dd>
          </div>
          <div>
            <dt className="text-slate-500">الخبرة</dt>
            <dd className="mt-2 text-xl font-semibold text-cyan-300">4,520</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
