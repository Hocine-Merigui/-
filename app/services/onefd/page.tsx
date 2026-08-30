"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  IdCard,
  LockKeyhole,
  Mail,
  Phone,
  Printer,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { store } from "@/lib/store";
import type { Customer, Order, OrderStatus } from "@/lib/types";

const wilayas = [
  "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة",
  "تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة",
  "سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة",
  "وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة",
  "سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار",
  "أولاد جلال","بني عباس","عين صالح","عين قزام","تقرت","جانت","المغير","المنيعة",
];

const levels = [
  "الأولى متوسط",
  "الثانية متوسط",
  "الثالثة متوسط",
  "الرابعة متوسط",
  "الأولى ثانوي",
  "الثانية ثانوي",
  "الثالثة ثانوي",
  "أخرى",
];

const initialDocuments = [
  { name: "بطاقة التعريف / وثيقة الهوية", required: true, received: false },
  { name: "شهادة مدرسية أو وثيقة المستوى", required: true, received: false },
  { name: "كشف النقاط عند الحاجة", required: false, received: false },
  { name: "صورة شمسية", required: false, received: false },
  { name: "وصل أو إثبات الدفع عند توفره", required: false, received: false },
];

function nextOrderNumber(orders: Order[]) {
  const year = new Date().getFullYear();
  const max = orders.reduce((highest, order) => {
    const n = Number(order.orderNumber.match(/(\d+)$/)?.[1] || 0);
    return Math.max(highest, n);
  }, 0);
  return `HCT-${year}-${String(max + 1).padStart(4, "0")}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-sm font-black text-slate-700">{children}</span>;
}

export default function OnefdRegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [registrationType, setRegistrationType] = useState<"جديد" | "تجديد">("جديد");
  const [level, setLevel] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [previousRegistration, setPreviousRegistration] = useState("");
  const [email, setEmail] = useState("");
  const [onefdUsername, setOnefdUsername] = useState("");
  const [onefdPassword, setOnefdPassword] = useState("");
  const [price, setPrice] = useState("600");
  const [paid, setPaid] = useState("0");
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState(initialDocuments);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const remaining = useMemo(
    () => Math.max(Number(price || 0) - Number(paid || 0), 0),
    [price, paid]
  );

  const missingRequired = documents.filter((doc) => doc.required && !doc.received).length;

  const toggleDocument = (index: number) => {
    setDocuments((current) =>
      current.map((doc, i) => (i === index ? { ...doc, received: !doc.received } : doc))
    );
  };

  const submitRegistration = () => {
    setError("");

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !birthDate || !wilaya || !level) {
      setError("يرجى إكمال الاسم واللقب والهاتف وتاريخ الميلاد والولاية والمستوى الدراسي.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (registrationType === "تجديد" && !previousRegistration.trim()) {
      setError("في حالة التجديد، أدخل رقم التسجيل السابق إن كان متوفرًا لديك.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const customers = store.customers();
    const orders = store.orders();
    const services = store.services();
    const normalizedPhone = phone.replace(/\s+/g, "");
    const existing = customers.find((customer) => customer.phone.replace(/\s+/g, "") === normalizedPhone);

    const customerId = existing?.id || `c-${Date.now()}`;
    const customer: Customer = existing || {
      id: customerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizedPhone,
      wilaya,
      commune: commune.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!existing) store.saveCustomers([customer, ...customers]);

    const service = services.find((item) => item.title.includes("المراسلة"));
    const status: OrderStatus = missingRequired > 0 ? "في انتظار الوثائق" : "جاهز للمعالجة";

    const details = [
      "[ONEFD]",
      `نوع التسجيل: ${registrationType}`,
      `تاريخ الميلاد: ${birthDate}`,
      `المستوى: ${level}`,
      specialty.trim() ? `الشعبة/التخصص: ${specialty.trim()}` : "",
      previousRegistration.trim() ? `رقم التسجيل السابق: ${previousRegistration.trim()}` : "",
      email.trim() ? `البريد الإلكتروني: ${email.trim()}` : "",
      onefdUsername.trim() ? `اسم مستخدم ONEFD: ${onefdUsername.trim()}` : "",
      notes.trim() ? `ملاحظات: ${notes.trim()}` : "",
      "كلمة المرور غير محفوظة لأسباب أمنية.",
    ].filter(Boolean).join("\n");

    const order: Order = {
      id: `o-${Date.now()}`,
      orderNumber: nextOrderNumber(orders),
      customerId,
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      phone: normalizedPhone,
      serviceId: service?.id || "s6",
      serviceTitle: service?.title || "تسجيلات المراسلة",
      status,
      price: Number(price || 0),
      paid: Math.min(Number(paid || 0), Number(price || 0)),
      notes: details,
      createdAt: new Date().toISOString(),
      documents,
    };

    store.saveOrders([order, ...orders]);
    setCreatedOrder(order);
    setOnefdPassword("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (createdOrder) {
    return (
      <main dir="rtl" className="mesh-bg min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="no-print mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600">
              <ArrowRight size={18} /> الرئيسية
            </Link>
            <span className="text-sm font-black text-slate-900">HOCINE TECH+</span>
          </div>

          <section className="print-receipt overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-2xl shadow-slate-200/70">
            <div className="bg-emerald-600 px-6 py-8 text-center text-white">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15">
                <CheckCircle2 size={34} />
              </div>
              <h1 className="mt-4 text-3xl font-black">تم إنشاء طلب ONEFD</h1>
              <p className="mt-2 text-sm font-bold text-emerald-100">تمت إضافة الطلب إلى لوحة HOCINE TECH+</p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">رقم الطلب</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{createdOrder.orderNumber}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">حالة الطلب</p>
                  <p className="mt-2 text-base font-black text-blue-700">{createdOrder.status}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">الزبون</p>
                  <p className="mt-2 font-black text-slate-900">{createdOrder.customerName}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">الخدمة</p>
                  <p className="mt-2 font-black text-slate-900">{createdOrder.serviceTitle}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                <div className="flex justify-between text-sm"><span className="text-slate-500">السعر</span><strong>{createdOrder.price.toLocaleString()} دج</strong></div>
                <div className="mt-3 flex justify-between text-sm"><span className="text-slate-500">المدفوع</span><strong className="text-emerald-600">{createdOrder.paid.toLocaleString()} دج</strong></div>
                <div className="mt-3 flex justify-between border-t border-slate-100 pt-3"><span className="font-black text-slate-700">المتبقي</span><strong className="text-lg text-red-600">{Math.max(createdOrder.price-createdOrder.paid,0).toLocaleString()} دج</strong></div>
              </div>

              <p className="mt-6 text-center text-xs font-bold leading-6 text-slate-400">HOCINE TECH+ — احتفظ برقم الطلب للمتابعة. بيانات الدخول السرية لا تظهر في هذا الإيصال.</p>
            </div>
          </section>

          <div className="no-print mt-5 grid gap-3 sm:grid-cols-3">
            <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
              <Printer size={18} /> طباعة الإيصال
            </button>
            <Link href="/dashboard/orders" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-blue-600">
              <ReceiptText size={18} /> عرض الطلبات
            </Link>
            <button onClick={() => setCreatedOrder(null)} className="rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-700">طلب ONEFD جديد</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mesh-bg min-h-screen">
      <div className="soft-grid min-h-screen px-4 py-6 md:px-8 md:py-9">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
              <ArrowRight size={17} /> العودة
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-left"><p className="font-black text-slate-950">HOCINE TECH+</p><p className="text-[10px] font-bold text-slate-400">بوابة التسجيلات الإلكترونية</p></div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 font-black text-white">H+</div>
            </div>
          </header>

          <section className="mb-6 overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1.5 text-xs font-black text-blue-300">
                  <GraduationCap size={15}/> التعليم عن بعد
                </div>
                <h1 className="text-3xl font-black md:text-4xl">تسجيلات المراسلة ONEFD</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-400">استمارة داخلية سريعة لتسجيل معلومات الزبون، متابعة الوثائق، الدفع، وإنشاء الطلب مباشرة في لوحة التحكم.</p>
              </div>
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/10 text-blue-300"><BookOpenCheck size={34}/></div>
            </div>
          </section>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>
          )}

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-6 text-amber-800">
            <ShieldCheck className="mt-0.5 shrink-0" size={18}/>
            <p>النسخة الحالية تحفظ الطلبات محليًا في المتصفح إلى أن نربط Supabase. لا تُدخل بيانات زبائن حقيقية أو حساسة على جهاز مشترك حاليًا. كلمة مرور ONEFD لا يتم حفظها نهائيًا في الطلب.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600"><UserRound size={21}/></div>
                  <div><h2 className="font-black text-slate-950">1. معلومات الزبون</h2><p className="mt-1 text-xs font-bold text-slate-400">البيانات الأساسية لصاحب التسجيل</p></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label><FieldLabel>الاسم *</FieldLabel><input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="الاسم" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                  <label><FieldLabel>اللقب *</FieldLabel><input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="اللقب" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                  <label><FieldLabel>رقم الهاتف *</FieldLabel><div className="relative"><Phone size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/><input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="05 / 06 / 07..." className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div></label>
                  <label><FieldLabel>تاريخ الميلاد *</FieldLabel><input type="date" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                  <label><FieldLabel>الولاية *</FieldLabel><div className="relative"><select value={wilaya} onChange={(e)=>setWilaya(e.target.value)} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"><option value="">اختر الولاية</option>{wilayas.map((item)=><option key={item} value={item}>{item}</option>)}</select><ChevronDown size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/></div></label>
                  <label><FieldLabel>البلدية</FieldLabel><input value={commune} onChange={(e)=>setCommune(e.target.value)} placeholder="البلدية" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                </div>
              </section>

              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><GraduationCap size={21}/></div>
                  <div><h2 className="font-black text-slate-950">2. معلومات التسجيل ONEFD</h2><p className="mt-1 text-xs font-bold text-slate-400">بيانات تساعدك أثناء إنجاز التسجيل</p></div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-2">
                  {(["جديد","تجديد"] as const).map((type)=><button key={type} type="button" onClick={()=>setRegistrationType(type)} className={`rounded-xl px-4 py-3 text-sm font-black transition ${registrationType===type?"bg-white text-blue-700 shadow-sm":"text-slate-400"}`}>{type === "جديد" ? "تسجيل جديد" : "تجديد التسجيل"}</button>)}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label><FieldLabel>المستوى الدراسي *</FieldLabel><div className="relative"><select value={level} onChange={(e)=>setLevel(e.target.value)} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"><option value="">اختر المستوى</option>{levels.map((item)=><option key={item}>{item}</option>)}</select><ChevronDown size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/></div></label>
                  <label><FieldLabel>الشعبة / التخصص</FieldLabel><input value={specialty} onChange={(e)=>setSpecialty(e.target.value)} placeholder="مثال: علوم تجريبية" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                  {registrationType === "تجديد" && <label><FieldLabel>رقم التسجيل السابق *</FieldLabel><div className="relative"><IdCard size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/><input value={previousRegistration} onChange={(e)=>setPreviousRegistration(e.target.value)} placeholder="رقم التسجيل" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div></label>}
                  <label><FieldLabel>البريد الإلكتروني</FieldLabel><div className="relative"><Mail size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="example@email.com" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></div></label>
                  <label><FieldLabel>اسم مستخدم ONEFD إن وجد</FieldLabel><input value={onefdUsername} onChange={(e)=>setOnefdUsername(e.target.value)} placeholder="Username" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
                  <label><FieldLabel>كلمة المرور أثناء العمل فقط</FieldLabel><div className="relative"><LockKeyhole size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"/><input type="password" value={onefdPassword} onChange={(e)=>setOnefdPassword(e.target.value)} placeholder="لا يتم حفظها" autoComplete="off" className="h-12 w-full rounded-xl border border-emerald-200 bg-emerald-50/50 pr-11 pl-4 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"/></div><span className="mt-2 block text-[11px] font-bold text-emerald-600">لن تُحفظ مع الطلب أو في LocalStorage.</span></label>
                </div>
              </section>

              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600"><FileCheck2 size={21}/></div>
                  <div><h2 className="font-black text-slate-950">3. الوثائق والمتابعة</h2><p className="mt-1 text-xs font-bold text-slate-400">القائمة قابلة للتعديل لاحقًا من النظام</p></div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  {documents.map((doc,index)=><button type="button" onClick={()=>toggleDocument(index)} key={doc.name} className="flex w-full items-center justify-between gap-4 border-b border-slate-100 bg-white p-4 text-right transition last:border-0 hover:bg-slate-50"><div><p className="text-sm font-black text-slate-700">{doc.name}</p><p className="mt-1 text-[11px] font-bold text-slate-400">{doc.required?"مطلوبة للملف":"عند الحاجة"}</p></div><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition ${doc.received?"border-emerald-500 bg-emerald-500 text-white":"border-slate-200 bg-slate-50 text-transparent"}`}><Check size={16}/></div></button>)}
                </div>

                <label className="mt-5 block"><FieldLabel>ملاحظات إضافية</FieldLabel><textarea rows={4} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="أي معلومة مفيدة أثناء معالجة التسجيل..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/></label>
              </section>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><WalletCards size={21}/></div><div><h2 className="font-black text-slate-950">الدفع</h2><p className="text-xs font-bold text-slate-400">يُحسب الباقي تلقائيًا</p></div></div>
                <div className="space-y-4">
                  <label><FieldLabel>سعر الخدمة</FieldLabel><div className="relative"><input type="number" min="0" value={price} onChange={(e)=>setPrice(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-14 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">دج</span></div></label>
                  <label><FieldLabel>المبلغ المدفوع</FieldLabel><div className="relative"><input type="number" min="0" value={paid} onChange={(e)=>setPaid(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-14 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"/><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">دج</span></div></label>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-xs font-bold text-slate-400">المتبقي</p><p className="mt-2 text-3xl font-black">{remaining.toLocaleString()} <span className="text-sm text-slate-400">دج</span></p></div>
              </section>

              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-black text-slate-950">ملخص الملف</h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-slate-400">نوع التسجيل</span><strong>{registrationType}</strong></div>
                  <div className="flex justify-between gap-3"><span className="text-slate-400">المستوى</span><strong className="text-left">{level || "—"}</strong></div>
                  <div className="flex justify-between gap-3"><span className="text-slate-400">وثائق ناقصة</span><strong className={missingRequired?"text-amber-600":"text-emerald-600"}>{missingRequired}</strong></div>
                </div>
              </section>

              <button type="button" onClick={submitRegistration} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"><CheckCircle2 size={19}/> إنشاء طلب ONEFD</button>
              <Link href="/dashboard/orders" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"><ReceiptText size={18}/> قائمة الطلبات</Link>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
