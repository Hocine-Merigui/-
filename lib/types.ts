export type Customer = { id:string; firstName:string; lastName:string; phone:string; wilaya?:string; commune?:string; notes?:string; createdAt:string };
export type OrderStatus = "طلب جديد"|"في انتظار الوثائق"|"جاهز للمعالجة"|"قيد الإنجاز"|"في انتظار الرد"|"مكتمل"|"ملغى";
export type Service = { id:string; title:string; category:string; price:number; enabled:boolean };
export type Order = { id:string; orderNumber:string; customerId:string; customerName:string; phone:string; serviceId:string; serviceTitle:string; status:OrderStatus; price:number; paid:number; notes?:string; createdAt:string; documents?:{name:string;required:boolean;received:boolean}[] };
