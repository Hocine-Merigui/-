"use client";
import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
export default function DashboardShell({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false); return <div className="min-h-screen bg-[#f6f8fc]" dir="rtl"><Sidebar open={open} onClose={()=>setOpen(false)}/><div className="lg:mr-[275px]"><Topbar onMenu={()=>setOpen(true)}/><main className="p-4 md:p-7">{children}</main></div></div>}
