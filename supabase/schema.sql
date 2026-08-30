-- HOCINE TECH+ — Supabase schema
create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','staff');
create type public.order_status as enum (
  'طلب جديد','في انتظار الوثائق','جاهز للمعالجة','قيد الإنجاز','في انتظار الرد','مكتمل','ملغى'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  phone text not null,
  wilaya text,
  commune text,
  email text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index customers_phone_idx on public.customers(phone);
create index customers_name_idx on public.customers(first_name,last_name);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  external_url text,
  default_price numeric(12,2) not null default 0 check (default_price >= 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  status public.order_status not null default 'طلب جديد',
  price numeric(12,2) not null default 0 check (price >= 0),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_customer_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);

create sequence if not exists public.hct_order_seq start 1;
create or replace function public.set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null or btrim(new.order_number) = '' then
    new.order_number := 'HCT-' || extract(year from now())::int || '-' || lpad(nextval('public.hct_order_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;
create trigger trg_set_order_number before insert on public.orders
for each row execute function public.set_order_number();

create table public.order_documents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  name text not null,
  required boolean not null default true,
  received boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index payments_order_idx on public.payments(order_id);

create table public.activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff'));
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin');
$$;

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_documents enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;

create policy "profile read own or admin" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "admin updates profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "staff read customers" on public.customers for select to authenticated using (public.is_staff());
create policy "staff insert customers" on public.customers for insert to authenticated with check (public.is_staff());
create policy "staff update customers" on public.customers for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "admin delete customers" on public.customers for delete to authenticated using (public.is_admin());

create policy "authenticated read services" on public.services for select to authenticated using (public.is_staff());
create policy "admin manage services insert" on public.services for insert to authenticated with check (public.is_admin());
create policy "admin manage services update" on public.services for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manage services delete" on public.services for delete to authenticated using (public.is_admin());

create policy "staff read orders" on public.orders for select to authenticated using (public.is_staff());
create policy "staff insert orders" on public.orders for insert to authenticated with check (public.is_staff());
create policy "staff update orders" on public.orders for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "admin delete orders" on public.orders for delete to authenticated using (public.is_admin());

create policy "staff manage docs" on public.order_documents for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff read payments" on public.payments for select to authenticated using (public.is_staff());
create policy "staff insert payments" on public.payments for insert to authenticated with check (public.is_staff());
create policy "admin update payments" on public.payments for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete payments" on public.payments for delete to authenticated using (public.is_admin());
create policy "staff read logs" on public.activity_logs for select to authenticated using (public.is_staff());
create policy "staff insert logs" on public.activity_logs for insert to authenticated with check (public.is_staff());

insert into public.services (title,category,default_price) values
('التسجيلات الأولية','التسجيلات الجامعية',800),
('المنحة الجامعية','التسجيلات الجامعية',800),
('فضاء الأولياء','التربية والتعليم',500),
('فضاء الأساتذة','التربية والتعليم',500),
('منحة التمدرس','التربية والتعليم',500),
('تسجيلات المراسلة','التعليم عن بعد والتكوين المهني',600),
('التكوين المهني','التعليم عن بعد والتكوين المهني',700),
('التكوين المهني عن بعد','التعليم عن بعد والتكوين المهني',700),
('منحة البطالة','البطالة',500),
('تسجيلات نفطال','خدمات مختلفة',600),
('الدفتر العقاري','خدمات مختلفة',1000)
on conflict do nothing;
