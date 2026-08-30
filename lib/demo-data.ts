import type { Customer, Order, Service } from "./types";
export const demoCustomers: Customer[] = [
 {id:"c1",firstName:"محمد",lastName:"أمين",phone:"0550000001",wilaya:"الجزائر",commune:"باب الزوار",createdAt:"2026-08-30T08:30:00"},
 {id:"c2",firstName:"أحمد",lastName:"ياسين",phone:"0661000002",wilaya:"البليدة",commune:"البليدة",createdAt:"2026-08-29T11:20:00"},
 {id:"c3",firstName:"سميرة",lastName:"بن يوسف",phone:"0772000003",wilaya:"الجزائر",commune:"الحراش",createdAt:"2026-08-28T14:10:00"}
];
export const demoServices: Service[] = [
 {id:"s1",title:"التسجيلات الأولية",category:"التسجيلات الجامعية",price:800,enabled:true},
 {id:"s2",title:"المنحة الجامعية",category:"التسجيلات الجامعية",price:800,enabled:true},
 {id:"s3",title:"فضاء الأولياء",category:"التربية والتعليم",price:500,enabled:true},
 {id:"s4",title:"فضاء الأساتذة",category:"التربية والتعليم",price:500,enabled:true},
 {id:"s5",title:"منحة التمدرس",category:"التربية والتعليم",price:500,enabled:true},
 {id:"s6",title:"تسجيلات المراسلة",category:"التعليم عن بعد والتكوين المهني",price:600,enabled:true},
 {id:"s7",title:"التكوين المهني",category:"التعليم عن بعد والتكوين المهني",price:700,enabled:true},
 {id:"s8",title:"التكوين المهني عن بعد",category:"التعليم عن بعد والتكوين المهني",price:700,enabled:true},
 {id:"s9",title:"منحة البطالة",category:"البطالة",price:500,enabled:true},
 {id:"s10",title:"تسجيلات نفطال",category:"خدمات مختلفة",price:600,enabled:true},
 {id:"s11",title:"الدفتر العقاري",category:"خدمات مختلفة",price:1000,enabled:true}
];
export const demoOrders: Order[] = [
 {id:"o1",orderNumber:"HCT-2026-0021",customerId:"c1",customerName:"محمد أمين",phone:"0550000001",serviceId:"s2",serviceTitle:"المنحة الجامعية",status:"قيد الإنجاز",price:800,paid:500,createdAt:"2026-08-30T09:15:00"},
 {id:"o2",orderNumber:"HCT-2026-0022",customerId:"c2",customerName:"أحمد ياسين",phone:"0661000002",serviceId:"s6",serviceTitle:"تسجيلات المراسلة",status:"في انتظار الوثائق",price:600,paid:600,createdAt:"2026-08-30T10:20:00"},
 {id:"o3",orderNumber:"HCT-2026-0023",customerId:"c3",customerName:"سميرة بن يوسف",phone:"0772000003",serviceId:"s9",serviceTitle:"منحة البطالة",status:"في انتظار الرد",price:500,paid:500,createdAt:"2026-08-30T11:05:00"}
];
