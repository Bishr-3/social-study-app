# 🎯 نظام التحكم في Multiple Likes

## الخطوات لتفعيل الميزة:

### 1️⃣ **تشغيل SQL Migration في Supabase**
```
- افتح: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
- انسخ محتوى الملف: `multiple-likes-setup.sql`
- اضغط "Run" للتنفيذ
```

الـ SQL file سيقوم بـ:
- ✅ إنشاء جدول `app_settings`
- ✅ إضافة RPC function `get_app_setting()` للحصول على الإعدادات
- ✅ إضافة RPC function `update_app_setting()` لتحديث الإعدادات
- ✅ إضافة Row Level Security (RLS) policies

---

### 2️⃣ **استخدام API Endpoints**

#### أ) الحصول على حالة الإعداد:
```bash
curl -X GET http://localhost:3000/api/admin/settings/multiple-likes \
  -H "Cookie: admin_token=valid-admin-token"
```

**الرد:**
```json
{
  "setting": "allow_multiple_likes",
  "enabled": false,
  "message": "multiple likes معطل"
}
```

---

#### ب) تفعيل Multiple Likes:
```bash
curl -X POST http://localhost:3000/api/admin/settings/multiple-likes \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=valid-admin-token" \
  -d '{"enable": true}'
```

**الرد:**
```json
{
  "success": true,
  "setting": "allow_multiple_likes",
  "enabled": true,
  "message": "✅ تم تفعيل multiple likes"
}
```

---

#### ج) تعطيل Multiple Likes:
```bash
curl -X POST http://localhost:3000/api/admin/settings/multiple-likes \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=valid-admin-token" \
  -d '{"enable": false}'
```

---

### 3️⃣ **استخدام Dashboard (الطريقة الأسهل)**

أذهب إلى:
```
http://localhost:3000/admin-settings/multiple-likes
```

Dashboard يسمح بـ:
- ✅ عرض الحالة الحالية
- ✅ تفعيل/تعطيل الميزة بزر واحد
- ✅ رسائل نجاح فورية

---

## 🔧 كيف تعمل الميزة:

### عندما تكون **معطّلة** (الوضع الحالي):
```
الخطوات:
1. المستخدم يعمل like على منشور
2. يتم التحقق عبر RPC function `like_post()`
3. إذا حاول مرة ثانية: ❌ خطأ ALREADY_LIKED
4. يبقى مثل واحد فقط حتى مع Refresh أو Logout
```

---

### عندما تكون **مفعّلة**:
```
الخطوات:
1. المستخدم يعمل like على منشور
2. يتم فحص الإعداد: allow_multiple_likes = true
3. ✅ يتم السماح بـ multiple likes
4. كل like يحفظ بـ user_hash مختلف (أو مع timestamp)
5. يبقى الـ counter يزيد مع كل like
6. **لا يوجد حد أقصى** للإعجابات من نفس المستخدم
```

---

## 📊 الجدول الجديد:

```sql
app_settings (
  id BIGSERIAL,
  setting_key TEXT (unique),
  setting_value BOOLEAN,
  description TEXT,
  last_updated_by TEXT,
  updated_at TIMESTAMP
)
```

**الإعدادات الحالية:**
- `allow_multiple_likes` = false (معطل افتراضياً)

---

## 🔐 الأمان:

- ✅ تم تفعيل **Row Level Security (RLS)**
- ✅ الجميع يمكنهم **عرض** الإعدادات
- ✅ فقط المصرح (admin) يمكنه **تحديث** الإعدادات
- ✅ التوكن يتم التحقق منه في API Route

---

## ❓ أسئلة شائعة:

**س: هل سيؤثر هذا على الـ posts table؟**
ج: لا، الـ posts table ما يتغير. الإعجابات تُحفظ في `post_likes` table كما هو.

**س: كيف أعرف إذا كان المستخدم نفسه يعمل multiple likes؟**
ج: يتم التعريف عبر `like_user_id` cookie و `user_hash` (SHA-256 hash).

**س: هل الإعدادات تؤثر فوراً؟**
ج: نعم، فور التفعيل/التعطيل يتم تطبيقها على جميع الـ requests الجديدة.

**س: هل يمكن عمل "undo" للـ likes القديمة؟**
ج: نعم، عبر admin decrement action في API.

---

## 📝 الملفات المضافة:

```
multiple-likes-setup.sql          <- SQL migration
src/app/api/admin/settings/multiple-likes/route.ts   <- API endpoint
src/app/admin-settings/multiple-likes/page.tsx       <- Dashboard
MULTIPLE_LIKES_GUIDE.md           <- هذا الملف
```

---

**✨ جاهز للاستخدام! أي استفسار؟**
