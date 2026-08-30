# HOCINE TECH+

منصة عربية RTL لإدارة محل خدمات وتسجيلات إلكترونية.

## الموجود حاليًا
- صفحة رئيسية عامة احترافية.
- صفحة دخول تجريبية.
- Dashboard Responsive للهاتف والحاسوب.
- إدارة الزبائن: إضافة + بحث.
- إدارة الطلبات: إنشاء + بحث + فلترة + تغيير الحالة.
- تحديد الوثائق المطلوبة والمستلمة.
- سعر/مدفوع/متبقي بحساب آلي.
- إنشاء إيصال وطباعة مباشرة.
- إدارة الخدمات: إضافة + سعر افتراضي + إظهار/إخفاء.
- صفحة المدفوعات وملخص مالي.
- بيانات تجريبية محفوظة في LocalStorage لكي تعمل النسخة فورًا.
- ملف Supabase SQL كامل مع Auth-ready schema وRLS.

## التشغيل
```bash
npm install
npm run dev
```
ثم افتح http://localhost:3000

## الدخول التجريبي
صفحة /login تقبل أي بيانات حاليًا وتدخل إلى Dashboard، لأن الهدف أن تعمل المعاينة دون مفاتيح خارجية.

## ربط Supabase
1. أنشئ مشروع Supabase.
2. افتح SQL Editor وشغّل الملف: `supabase/schema.sql`.
3. انسخ `.env.example` إلى `.env.local` وأضف URL وAnon Key.
4. أنشئ مستخدمًا من Supabase Auth.
5. اجعل أول مستخدم Admin من SQL:
```sql
update public.profiles set role='admin' where id='USER_UUID';
```

> ملاحظة: الواجهة الحالية تستخدم LocalStorage كي تشتغل فورًا. `lib/supabase.ts` و`schema.sql` جاهزان، والخطوة التالية هي تبديل Repository التخزين المحلي بعمليات Supabase بعد إدخال مفاتيح مشروعك.

## أهم الملفات
- `app/page.tsx`: الواجهة العامة.
- `app/dashboard/page.tsx`: لوحة التحكم.
- `app/dashboard/customers/page.tsx`: الزبائن.
- `app/dashboard/orders/page.tsx`: الطلبات.
- `app/dashboard/orders/new/page.tsx`: إضافة طلب والإيصال.
- `app/dashboard/services/page.tsx`: الخدمات.
- `app/dashboard/payments/page.tsx`: المدفوعات.
- `supabase/schema.sql`: قاعدة البيانات وسياسات الحماية.
