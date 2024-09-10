# Aileet — CRM Trading

Trading kurslari uchun mijozlar murojaatlarini boshqarish tizimi. Mijoz saytdagi forma orqali murojaat qoldiradi, admin esa panelda murojaatlarni ko'radi, holatini o'zgartiradi, izoh yozadi, qayta bog'lanish vaqtini belgilaydi va tadbirlar kalendarini yuritadi.

## Imkoniyatlar

- **Ommaviy forma** (`/#/welcome`) — ism, familiya, telefon (`+998 __ ___ __ __` maskasi bilan) va xabar
- **Statistika** — jami/bugungi/haftalik/oylik murojaatlar, kechikkanlar, kunlik grafik, holatlar bo'yicha taqsimot, oxirgi murojaatlar va yaqin tadbirlar
- **Murojaatlar** — sahifalash, ism/familiya/telefon bo'yicha qidiruv, holat va sana oralig'i bo'yicha filtr, CSV (Excel) ga yuklab olish
- **Izohlar** — har bir murojaatga admin izohlari (kim va qachon yozgani bilan)
- **Kutilayotgan murojaatlar** — qayta ko'rish vaqti o'tib ketganlar, qancha vaqt o'tgani bilan
- **Kalendar** — tadbir qo'shish, tahrirlash, o'chirish; faol tadbirlar haqida ovozli bildirishnoma
- **Korzinka** — o'chirilgan murojaatlarni tiklash yoki butunlay o'chirish
- **Profil** — ma'lumotlarni tahrirlash, rasm yuklash, parolni almashtirish
- Login uchun brute-force himoyasi, ommaviy forma uchun spam limiti, `/health` tekshiruvi

## Texnologiyalar

| Qism | Texnologiya |
|---|---|
| Frontend | Vue 3.4, Vite 5, Pinia 2, Vue Router 4, Naive UI 2, Tailwind CSS 3 |
| Backend | Node.js 20, Express 4, express-session + connect-pg-simple, Joi, Multer, bcrypt, node-cron |
| Baza | PostgreSQL 16 |
| Deploy | Docker, Docker Compose, Nginx 1.27 |

## Loyiha tuzilishi

```
CRM-Trading/
├── backend/
│   ├── Routers/          Admin, Apeal, Calendar, Notification, Stats
│   ├── functions/        baza, bcrypt, auth, migratsiya va seed
│   ├── static/           frontend build + yuklangan profil rasmlari
│   ├── database.sql      baza sxemasi
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/              Vue sahifalar va komponentlar
│   ├── Pages/            router
│   ├── Pinia/            store
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── .env                  docker compose sozlamalari
```

---

## 1-usul: Docker orqali ishga tushirish (tavsiya etiladi)

Kerak bo'ladi: **Docker** va **Docker Compose**.

```bash
git clone <repo-manzil>
cd CRM-Trading
docker compose up -d --build
```

Bir-ikki daqiqadan keyin:

| Nima | Manzil |
|---|---|
| Admin panel | http://localhost:8080/#/login |
| Mijozlar formasi | http://localhost:8080/#/welcome |
| Backend API | http://localhost:4100 |
| Health check | http://localhost:8080/health |
| PostgreSQL | `localhost:5433` (user `postgres`, parol `1234`, baza `crm_trading`) |

**Kirish ma'lumotlari:** login `admin`, parol `Admin@2024`

Admin birinchi ishga tushishda `.env` dagi `ADMIN_LOGIN` / `ADMIN_PASSWORD` asosida avtomatik yaratiladi. Kirgandan keyin parolni **Tizim → Parolni almashtirish** bo'limidan o'zgartiring.

### Foydali buyruqlar

```bash
docker compose ps                   # holatni ko'rish
docker compose logs -f backend      # backend loglari
docker compose restart backend      # backendni qayta ishga tushirish
docker compose down                 # to'xtatish (ma'lumotlar saqlanadi)
docker compose down -v              # to'xtatish va bazani butunlay o'chirish
docker compose up -d --build        # kod o'zgarganidan keyin qayta yig'ish
```

### Portlarni o'zgartirish

Root papkadagi `.env` faylida:

```env
DB_PORT=5433
BACKEND_PORT=4100
FRONTEND_PORT=8080
```

---

## 2-usul: Dockersiz (lokal) ishga tushirish

Kerak bo'ladi: **Node.js 20**, **PostgreSQL 14+**.

### 1. Baza

```bash
psql -U postgres -c "CREATE DATABASE crm_trading;"
```

Jadvallarni qo'lda yaratish shart emas — backend ishga tushganda `database.sql` ni o'zi qo'llaydi.

### 2. Backend

```bash
cd backend
npm install
```

`backend/.env` faylida baza ma'lumotlarini tekshiring:

```env
PORT = 4100
host = localhost
user = postgres
password = 1234
database = crm_trading
databaseport = 5432
```

So'ng:

```bash
node index.js
# yoki o'zgarishlarni kuzatib:
npx nodemon index.js
```

Backend http://localhost:4100 da ishlaydi va `backend/static` dagi tayyor frontend buildni ham beradi, ya'ni http://localhost:4100/#/login ochiladi.

### 3. Frontend (ishlab chiqish rejimi)

```bash
cd frontend
npm install
npm run dev
```

http://localhost:5173 ochiladi. Vite API so'rovlarini `VITE_PROXY_TARGET` (standart `http://localhost:4100`) ga proksi qiladi, shuning uchun cookie/session muammosiz ishlaydi.

### 4. Frontendni backendga build qilish

```bash
cd frontend
npm run build:backend
```

Build `backend/static` ga yoziladi va backend o'zi frontendni beradi.

---

## Muhit o'zgaruvchilari

### `backend/.env`

| O'zgaruvchi | Tavsif |
|---|---|
| `PORT` | Backend porti |
| `host`, `user`, `password`, `database`, `databaseport` | PostgreSQL ulanishi |
| `JWT` | Token kaliti |
| `session` | Session kaliti |
| `COOKIE_SECURE` | HTTPS orqali ishlasa `true` |
| `CORS_ORIGIN` | Ruxsat berilgan manbalar (vergul bilan) |
| `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` | Birinchi admin |
| `LOGIN_LIMIT` | 10 daqiqada login urinishlari soni |
| `APEAL_LIMIT` | Bir IP dan soatiga murojaatlar soni |
| `TZ` | Vaqt mintaqasi (standart tizimniki) |

### `frontend/.env`

| O'zgaruvchi | Tavsif |
|---|---|
| `VITE_API_URL` | API manzili (`/` — shu domen) |
| `VITE_PROXY_TARGET` | Dev rejimda backend manzili |

> **Eslatma:** `.env` fayllar repozitoriyga qo'shilgan. Serverga (production) chiqarishdan oldin `JWT`, `session`, `ADMIN_PASSWORD` va baza parolini albatta o'zgartiring.

---

## API qisqacha

| Metod | Yo'l | Tavsif |
|---|---|---|
| POST | `/addApeal` | Yangi murojaat (ommaviy) |
| POST | `/admin/login` | Kirish |
| POST | `/admin/logout` | Chiqish |
| GET | `/admin/getprofile` | Profil |
| POST | `/admin/changeProfil` | Profilni tahrirlash |
| POST | `/admin/changePhoto` | Profil rasmi (`image`, maks 2MB) |
| POST | `/admin/changepassword` | Parolni almashtirish |
| GET | `/stats?days=14` | Statistika |
| GET | `/apeal/getapeal/all?page=1&size=10&search=&status=&from=&to=` | Murojaatlar |
| GET | `/apeal/getapeal/export?...` | CSV eksport |
| GET | `/apeal/getapeal/corzinca?page=1&size=10` | Korzinka |
| POST | `/apeal/edit/byid/:id` | Holatni o'zgartirish |
| DELETE | `/apeal/edit/byid/:id` | Korzinkaga o'tkazish |
| DELETE | `/apeal/edit/recover/:id` | Tiklash |
| DELETE | `/apeal/edit/alldelete/:id` | Butunlay o'chirish |
| GET/POST | `/apeal/comment/:apealId` | Izohlar |
| DELETE | `/apeal/comment/byid/:id` | Izohni o'chirish |
| GET | `/calendar/getcalendar` | Tadbirlar |
| POST | `/calendar/addcalendar` | Tadbir qo'shish |
| POST | `/calendar/edit/:id` | Tadbirni tahrirlash |
| POST | `/calendar/active` | Faol/faol emas |
| DELETE | `/calendar/delete/:id` | Tadbirni o'chirish |
| GET | `/notification` | Hozirgi tadbirlar |
| GET | `/notification/getapel/all` | Kechikkan murojaatlar |
| GET | `/health` | Server va baza holati |

## Muammolar

- **`port is already allocated`** — root `.env` da `DB_PORT`, `BACKEND_PORT` yoki `FRONTEND_PORT` ni bo'sh portga almashtiring.
- **Login qilgandan keyin yana login sahifasiga qaytaradi** — HTTP orqali ishlayotgan bo'lsangiz `COOKIE_SECURE=false` bo'lishi kerak.
- **Vaqtlar noto'g'ri ko'rinadi** — `.env` dagi `TZ` ni tekshiring (standart `Asia/Tashkent`).
- **Bazani noldan boshlash** — `docker compose down -v && docker compose up -d --build`.
