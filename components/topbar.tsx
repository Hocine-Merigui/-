"use client";
import { Bell, Menu, Search } from "lucide-react";
export default function Topbar({onMenu}:{onMenu:()=>void}){
 return <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl md:px-7">
  <div className="flex items-center gap-3"><button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"><Menu size={20}/></button><div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-slate-400 md:flex"><Search size={17}/><span className="text-xs font-semibold">بحث سريع من داخل الصفحات</span></div></div>
  <div className="flex items-center gap-2"><button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"><Bell size={18}/><span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"/></button><div className="mr-1 hidden text-left sm:block"><p className="text-xs font-black text-slate-800">الإدارة</p><p className="text-[10px] text-slate-400">متصل الآن</p></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-black text-white">H</div></div>
 </header>
}
