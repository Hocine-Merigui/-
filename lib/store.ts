"use client";
import { demoCustomers, demoOrders, demoServices } from "./demo-data";
import type { Customer, Order, Service } from "./types";
const KEYS={customers:"hct_customers",orders:"hct_orders",services:"hct_services"};
function read<T>(key:string,fallback:T):T { if(typeof window==="undefined") return fallback; try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }catch{return fallback;} }
function write<T>(key:string,v:T){ localStorage.setItem(key,JSON.stringify(v)); }
export const store={
 customers:()=>read<Customer[]>(KEYS.customers,demoCustomers),
 orders:()=>read<Order[]>(KEYS.orders,demoOrders),
 services:()=>read<Service[]>(KEYS.services,demoServices),
 saveCustomers:(v:Customer[])=>write(KEYS.customers,v),
 saveOrders:(v:Order[])=>write(KEYS.orders,v),
 saveServices:(v:Service[])=>write(KEYS.services,v),
 reset:()=>Object.values(KEYS).forEach(k=>localStorage.removeItem(k))
};
