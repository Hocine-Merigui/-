"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, PlusCircle, LayoutGrid, WalletCards, Settings, LogOut, X } from "lucide-react";
const items=[
 {href:"/dashboard",label:"الرئيسية",icon:Home},
 {href:"/dashboard/customers",label:"الزبائن",icon:Users},
 {href:"/dashboard/orders",label:"الطلبات",icon:ClipboardList},
 {href:"/dashboard/orders/new",label:"طلب جديد",icon:PlusCircle},
 {href:"/dashboard/services",label:"الخدمات",icon:LayoutGrid},
 {href:"/dashboard/payments",label:"المدفوعات",icon:WalletCards},
 {href:"/dashboard/settings",label:"الإعدادات",icon:Settings},
];
export default function Sidebar({open,onClose}:{open:boolean;onClose:()=>void}){
 const pathname=usePathname();
 return <>
  {open&&<button aria-label="إغلاق القائمة" className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm lg:hidden" onClick={onClose}/>} 
  <aside className={`fixed right-0 top-0 z-50 flex h-screen w-[275px] flex-col border-l border-slate-200 bg-white p-4 transition-transform duration-300 lg:translate-x-0 ${open?"translate-x-0":"translate-x-full"}`}>
   <div className="mb-5 flex items-center justify-between px-2 py-2">
    <Link href="/" className="flex items-center gap-3" onClick={onClose}>
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 font-black text-white shadow-lg shadow-slate-200">H+</div>
      <div><div className="font-black tracking-tight text-slate-950">HOCINE TECH+</div><div className="text-[11px] font-semibold text-slate-400">إدارة الخدمات الإلكترونية</div></div>
    </Link>
    <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 lg:hidden" onClick={onClose}><X size={18}/></button>
   </div>
   <nav className="space-y-1.5">
    {items.map(({href,label,icon:Icon})=>{const active=pathname===href || (href!=="/dashboard"&&pathname.startsWith(href)); return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${active?"bg-blue-600 text-white shadow-lg shadow-blue-100":"text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}><Icon size={19}/><span>{label}</span></Link>})}
   </nav>
   <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
     <p className="text-xs font-bold text-slate-400">حساب الإدارة</p><p className="mt-1 font-black">HOCINE TECH+</p>
     <Link href="/login" className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold hover:bg-white/15"><LogOut size={17}/> تسجيل الخروج</Link>
   </div>
  </aside>
 </>
}
