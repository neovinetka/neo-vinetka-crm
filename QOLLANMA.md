# Neo Vinetka CRM — Loyiha Pasporti va Foydalanuvchi Qo'llanmasi

Ushbu hujjat **Neo Vinetka CRM** tizimidan foydalanish, tizim ulangan manzillar, login-parollar va muammo yuzaga kelganda nima qilish kerakligini juda sodda tilda tushuntiradi.

---

## 1. Loyiha haqida qisqacha (Oddiy tilda)

**Neo Vinetka CRM** — bitiruv albomlari (vinetka) tayyorlovchi kompaniyaning barcha ish jarayoni va moliyasini boshqaradigan onlayn tizimdir. Telefon va kompyuter orqali bir vaqtda ishlaydi.

Tizimda **6 ta bo'lim** (**Rahbar**, **Buxgalter**, **Sotuvchi**, **Fotograf**, **Dizayner**, **Albomchi**) o'z sahifasiga kirib ishlaydi. Buyurtma qabul qilinganidan boshlab mijozga topshirilguncha va puli kassaga tushguncha barcha hisob-kitob avtomatik yuritiladi.

---

## 2. Qayerga nimalar ulandi? (Barcha manzillar va hisoblar)

Loyiha eski tizimlardan to'liq uzilgan va faqat **Neo Vinetka** kompaniyasining rasmiy hisobiga ulangan:

| Xizmat nomi | Manzil / Havola | Vazifasi |
| :--- | :--- | :--- |
| **1. Asosiy Email** | `neovinetka@gmail.com` | Barcha xizmatlar (GitHub, Supabase, Hosting) shu pochtaga ulangan. |
| **2. CRM Ishchi Sayti** | https://neovinetka.github.io/neo-vinetka-crm/ | Xodimlar va rahbar har kuni telefon yoki kompyuterdan kiradigan asosiy sayt. |
| **3. GitHub (Kod va Server)** | Akkaunt: `neovinetka`<br>Manzil: https://github.com/neovinetka/neo-vinetka-crm | Dasturning barcha kodlari saqlanadigan va saytni ishlatib turadigan joy. |
| **4. Supabase (Ma'lumotlar bazasi)** | Boshqaruv: https://supabase.com/dashboard<br>Tashkilot: **Neo Vinetka** (`crsvxnharwslnopdvizg`)<br>Project ID: `hwjljzlemarzeejrgkoe`<br>URL: `https://hwjljzlemarzeejrgkoe.supabase.co` | Barcha buyurtmalar, xodimlar, kassa to'lovlari, xarajatlar va oyliklar saqlanadigan bulutli baza. |

---

## 3. CRM tizimga kirish (Login va Parollar)

Saytga kirganda har bir bo'limni bitta bosish bilan tekshirish uchun **"1-Click Demo Kirish"** tugmalari mavjud. Shuningdek, quyidagi login va parollar orqali kiriladi:

| Bo'lim (Lavozim) | Login | Parol | Tizimda nima ish qiladi? |
| :--- | :--- | :--- | :--- |
| **1. Rahbar (CEO)** | `admin` | `123` | Kompaniyaning to'liq egasi: sof foyda, kassa, xodimlar qo'shish va parol o'zgartirish, viloyatlar va albom narxlarini boshqarish. |
| **2. Buxgalter** | `accountant` | `123` | Sotuvchi va fotograf topshirgan pullarni tasdiqlab kassaga qabul qiladi, xarajatlarni tasdiqlaydi, xodimlarga oylik va avans beradi. |
| **3. Sotuvchi** | `seller` | `123` | Yangi universitet/guruh zakazini kiritadi, tayyor albomni mijozga topshiradi va olingan pulni buxgalterga o'tkazadi. |
| **4. Fotograf** | `photographer` | `123` | Navbatdagi guruhni rasmga olishga qabul qiladi, Google Drive rasm havolasini va real talaba sonini kiritadi, yo'l xarajatini yozadi. |
| **5. Dizayner (Editor)** | `editor` | `123` | Rasmga olingan guruhni montajga oladi, tayyor maket va pechat (bosmaxona) havolasini yuklab albomchiga o'tkazadi. |
| **6. Albomchi** | `maker` | `123` | Bosmaxonadan chiqqan albomlarni yig'adi, muqovalaydi va "Tayyor (Javonda)" holatiga o'tkazib sotuvchiga xabar beradi. |

> **Muhim:** Ishni boshlashdan oldin **Rahbar (`admin`)** o'z panelidagi **"Xodimlar"** bo'limiga kirib, o'zining va xodimlarning `123` parolini xavfsiz parolga o'zgartirib olishi mumkin.

---

## 4. Ish jarayoni qanday ketadi? (6 ta oddiy qadam)

1. **Zakaz olish (Sotuvchi):** Sotuvchi yangi guruh qo'shadi (Universitet, guruh, sardor telefoni, albom turi va fotosessiya sanasi). Zakaz avtomatik Fotograf navbatiga tushadi.
2. **Fotosessiya (Fotograf):** Fotograf guruhni "Ishga olish" qiladi. Rasmga olgach, Google Drive havolasini va nechta talaba tushganini kiritib topshiradi. (Agar mijoz fotografning o'ziga naqd pul bersa, fotograf shu yerda summani kiritib kassaga topshiradi).
3. **Dizayn va Montaj (Dizayner):** Dizayner suratlarni olib montaj qiladi. Mijoz tasdiqlagach, pechat fayl ssilkasini kiritib Albomchiga uzatadi.
4. **Albom yig'ish (Albomchi):** Albomchi albomlarni yig'ib bo'lgach "Tayyor bo'ldi" tugmasini bosadi. Zakaz **"Tayyor (Javonda)"** holatiga o'tadi.
5. **Mijozga topshirish (Sotuvchi):** Sotuvchi javondagi tayyor albomni guruh sardoriga topshiradi, to'lovni qabul qilib **"Buxgalterga pul topshirish"** tugmasini bosadi.
6. **Kassa va Oylik (Buxgalter va Rahbar):** Buxgalter tushgan pulni tasdiqlaydi. Tizim har bir xodimning gonorari, qarzdorligi va kompaniya sof foydasini avtomatik hisoblab beradi.

---

## 5. Muammo chiqsa qayerga yuzlanish va nima qilish kerak?

### 1-holat: Xodim login yoki parolini unutib qo'ydi / tizimga kira olmayapti
- **Qayerga yuzlaniladi:** Kompaniyaning **Rahbar (CEO)** paneliga.
- **Yechim:** Rahbar paneliga kiriladi → **"Xodimlar"** bo'limi ochiladi → kerakli xodimni tahrirlash tugmasi bosilib, uning paroli ko'riladi yoki yangi parol yozib saqlanadi.

### 2-holat: Yangi xodim ishga olindi yoki eski xodim ishdan bo'shadi
- **Yechim:** **Rahbar (CEO)** paneli → **"Xodimlar"** bo'limi → **"+ Yangi xodim"** tugmasi orqali unga ism, viloyat, oylik hisoblash turi va login-parol beriladi. Ishdan bo'shagan xodimni "Bloklash" yoki o'chirish mumkin.

### 3-holat: Albom narxlari o'zgardi yoki yangi viloyat/filial ochildi
- **Yechim:** **Rahbar (CEO)** paneli → **"Sozlamalar"** bo'limidan yangi albom turi qo'shish, sotuv narxi va albomchi haqini o'zgartirish, shuningdek yangi viloyat/shahar qo'shish mumkin.

### 4-holat: Xodim o'z ismini, rasmini yoki telefon raqamini o'zgartirmoqchi
- **Yechim:** Har bir xodim ekranning yuqori chap burchagidagi o'z ism-familiyasi ustiga bossa, **"Profilni tahrirlash"** oynasi ochiladi. U yerda o'zgartirilgan ism va telefon barcha buyurtmalarda ham avtomatik yangilanadi.

### 5-holat: Boshqa telefondan kiritilgan buyurtma ko'rinmay qolsa yoki baza javob bermasa
- **Yechim:**
  1. Telefon yoki kompyuterda internet borligini tekshiring va sahifani yangilang (kompyuterda `Ctrl + F5`, telefonda sahifani tepadan pastga torting).
  2. Agar tizim uzoq vaqt (7 kundan ortiq) umuman ishlatilmagani uchun bepul Supabase bazasi uyqu rejimiga (`Paused`) o'tgan bo'lsa: https://supabase.com/dashboard saytiga `neovinetka@gmail.com` orqali kirib, **"Restore project"** tugmasini bosing — baza 1 daqiqada ishga tushadi.

### 6-holat: Sayt kodiga o'zgartirish kiritish (masalan, "1-Click Demo Kirish" oynasini olib tashlash) kerak bo'lsa
- **Qayerga yuzlaniladi (Dasturchi uchun):** Barcha kodlar https://github.com/neovinetka/neo-vinetka-crm repozitoriysida joylashgan.
- Kirish oynasidagi demo tugmalar `js/views/login.js` faylining `101–213`-qatorlarida joylashgan. Mijoz tizimni to'liq o'rganib bo'lgach, shu blok olib tashlansa, kirish sahifasida faqat login va parol oynasi qoladi.

---

## 6. Loyiha fayllari tuzilishi (Texnik xarita)

- `index.html` — Asosiy sahifa, Neo Vinetka sarlavhasi va `#d64138` brend ranglari.
- `css/payno.css` — Dizayn ko'rinishi, kartalar va mobil moslashuvchanlik.
- `js/supabase.js` — `neovinetka@gmail.com` (`hwjljzlemarzeejrgkoe`) Supabase bazasiga ulanish va Real-time xizmati.
- `js/store.js` — Barcha moliya, kassa, oylik va buyurtma hisob-kitoblari.
- `js/views/login.js` — Login sahifasi va 1-Click Demo Kirish tugmalari.
- `js/views/ceo.js` — Rahbar (CEO) boshqaruv paneli.
- `js/views/accountant.js` — Buxgalteriya va kassa paneli.
- `js/views/seller.js` — Sotuvchi paneli.
- `js/views/photographer.js` — Fotograf paneli.
- `js/views/editor.js` — Dizayner (Montaj) paneli.
- `js/views/maker.js` — Albom yasovchi paneli.
- `supabase_schema.sql` — Ma'lumotlar bazasining to'liq SQL sxemasi (zaxira nusxasi).
