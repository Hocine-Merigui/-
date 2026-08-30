import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Building2, GraduationCap, Monitor, School, ShieldCheck, Sparkles, UserRoundSearch, WalletCards } from "lucide-react";
const groups=[
 {title:"التسجيلات الجامعية",desc:"التسجيلات الأولية والمنحة الجامعية",icon:GraduationCap},
 {title:"التربية والتعليم",desc:"فضاء الأولياء والأساتذة ومنحة التمدرس",icon:School},
 {title:"التعليم والتكوين",desc:"المراسلة والتكوين المهني وعن بعد",icon:Monitor},
 {title:"منحة البطالة",desc:"متابعة التسجيلات الخاصة بمنحة البطالة",icon:UserRoundSearch},
 {title:"خدمات مختلفة",desc:"نفطال والدفتر العقاري وخدمات إضافية",icon:Building2},
];
export default function Home(){return <main dir="rtl" className="mesh-bg min-h-screen overflow-hidden">
 <div className="soft-grid min-h-screen">
  <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
   <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 font-black text-white">H+</div><div><div className="font-black text-slate-950">HOCINE TECH+</div><div className="text-[11px] font-semibold text-slate-400">بوابة الخدمات الإلكترونية</div></div></div>
   <Link href="/login" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-600">الدخول</Link>
  </header>
  <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-14 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-20">
   <div className="animate-enter">
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm"><Sparkles size={14}/> خدماتك الإلكترونية في مكان واحد</div>
    <h1 className="max-w-3xl text-4xl font-black leading-[1.2] tracking-tight text-slate-950 md:text-6xl">بوابة حديثة لإنجاز ومتابعة <span className="text-blue-600">التسجيلات الإلكترونية</span></h1>
    <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-500 md:text-lg">HOCINE TECH+ تجمع الخدمات الأكثر طلبًا في واجهة واضحة وسريعة، مع نظام إدارة داخلي للزبائن والطلبات والمدفوعات.</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1"><span>استعرض لوحة التحكم</span><ArrowLeft size={18}/></Link><a href="#services" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-700 shadow-sm">استعرض الخدمات</a></div>
    <div className="mt-8 flex flex-wrap gap-5 text-xs font-bold text-slate-500"><span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-600"/> واجهة عربية RTL</span><span className="flex items-center gap-1.5"><WalletCards size={16} className="text-blue-600"/> متابعة المدفوعات</span><span className="flex items-center gap-1.5"><BriefcaseBusiness size={16} className="text-violet-600"/> إدارة الطلبات</span></div>
   </div>
   <div className="relative animate-enter">
    <div className="absolute -inset-10 -z-10 rounded-full bg-blue-200/40 blur-3xl"/>
    <div className="glass rounded-[30px] border border-white p-4 shadow-2xl shadow-slate-300/50 md:p-6">
      <div className="rounded-[24px] bg-slate-950 p-6 text-white"><p className="text-xs font-bold text-slate-400">ملخص سريع</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/8 p-4"><p className="text-2xl font-black">17</p><p className="mt-1 text-xs text-slate-400">طلبات اليوم</p></div><div className="rounded-2xl bg-white/8 p-4"><p className="text-2xl font-black">12,500 دج</p><p className="mt-1 text-xs text-slate-400">مداخيل اليوم</p></div></div></div>
      <div className="mt-4 space-y-3">{["محمد أمين — المنحة الجامعية","سميرة — منحة البطالة","أحمد ياسين — المراسلة"].map((x,i)=><div key={x} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4"><div><p className="text-sm font-black text-slate-800">{x}</p><p className="mt-1 text-xs text-slate-400">HCT-2026-00{21+i}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700">متابعة</span></div>)}</div>
    </div>
   </div>
  </section>
  <section id="services" className="mx-auto max-w-7xl px-4 pb-20 md:px-8"><div className="mb-7"><p className="text-sm font-black text-blue-600">الخدمات</p><h2 className="mt-2 text-3xl font-black text-slate-950">كل الأقسام في واجهة واحدة</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{groups.map(({title,desc,icon:Icon})=><article key={title} className="card-hover rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={22}/></div><h3 className="font-black text-slate-900">{title}</h3><p className="mt-2 text-xs font-medium leading-6 text-slate-400">{desc}</p></article>)}</div></section>
 </div>
 </main>}
