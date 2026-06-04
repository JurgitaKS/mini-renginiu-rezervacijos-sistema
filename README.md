# Mini renginių rezervacijos sistema

## Apie projektą

**Mini renginių rezervacijos sistema** — tai **mokymosi projektas**, sukurtas renginių peržiūrai, rezervavimui ir paprastai statistikai vieningoje vietoje. Svetainė leidžia vartotojams užsiregistruoti, prisijungti, naršyti renginius, rezervuoti vietas ir valdyti savo rezervacijas.

> Šis projektas skirtas mokymuisi ir demonstracijai. Jis nėra pritaikytas didelio apkrovimo komerciniam naudojimui be papildomo saugumo ir infrastruktūros planavimo.

## Kokias problemas sprendžia

- **Renginių informacijos surinkimas** — visi renginiai vienoje vietoje su data, vieta, kaina ir laisvų vietų skaičiumi.
- **Paprastas rezervavimas** — nereikia skambinti ar rašyti el. laiškų; užtenka pasirinkti renginį ir vietų skaičių.
- **Rezervacijų valdymas** — vartotojas mato savo rezervacijas, gali dalinai ar visiškai atšaukti, kopijuoti informaciją.
- **Apžvalga** — Dashboard rodo suvestinę statistiką ir renginių pasiskirstymą pagal kategorijas.
- **Patogus naudojimas** — šviesus ir tamsus režimas, lietuviška sąsaja.

## Pagrindinės funkcijos

| Funkcija | Aprašymas |
|----------|-----------|
| **Registracija** | Naujo vartotojo paskyros sukūrimas el. paštu ir slaptažodžiu (`/register`). |
| **Prisijungimas** | Prisijungimas prie esamos paskyros (`/login`). |
| **Renginių peržiūra** | Renginių sąrašas su paieška, filtru pagal kategoriją ir rūšiavimu pagal datą (`/events`). |
| **Rezervavimas 1–11 vietų** | Prisijungus galima rezervuoti nuo 1 iki 11 vietų viename renginyje (laikantis laisvų vietų skaičiaus). |
| **Mano rezervacijos** | Asmeninis rezervacijų sąrašas su renginio informacija (`/my-reservations`). |
| **Vienos vietos atšaukimas** | Galima atšaukti vieną vietą, jei rezervuota daugiau nei 1 vieta. |
| **Visos rezervacijos atšaukimas** | Galima visiškai atšaukti rezervaciją; laisvos vietos grąžinamos į renginį. |
| **Kopijavimo funkcija** | Vienos rezervacijos ar visų rezervacijų teksto kopijavimas į iškarpinę. |
| **Dashboard statistika** | Rezervacijų ir vietų suvestinė, grafikas pagal renginių kategorijas (`/dashboard`). |
| **Šviesus / tamsus režimas** | Temos perjungimas antraštėje; pasirinkimas išsaugomas naršyklėje. |

## Naudotos technologijos

- **[Next.js](https://nextjs.org)** — React framework su App Router, serverio komponentais ir server actions.
- **[TypeScript](https://www.typescriptlang.org)** — tipų saugumas visame projekte.
- **[Tailwind CSS](https://tailwindcss.com)** — stiliai ir responsive dizainas.
- **[Supabase](https://supabase.com)** — PostgreSQL duomenų bazė, autentifikacija ir Row Level Security (RLS).
- **[Vercel](https://vercel.com)** — production diegimas (hosting).

Papildomai: **React**, **Recharts** (statistikos grafikas), **@supabase/ssr**.

## Kaip paleisti projektą lokaliai

### Reikalavimai

- Node.js 20 ar naujesnė versija
- Supabase projektas su sukurta schema (žr. skyrių „Duomenų bazė“)

### Žingsniai

```bash
# 1. Įdiegti priklausomybes
npm install

# 2. Sukurti aplinkos kintamųjų failą
cp .env.example .env.local
# Užpildyk reikšmes iš Supabase → Project Settings → API

# 3. Paleisti development serverį
npm run dev
```

Atidaryk naršyklėje: [http://localhost:3000](http://localhost:3000)

### Kitos komandos

| Komanda | Paskirtis |
|---------|-----------|
| `npm run build` | Production build |
| `npm run start` | Paleisti sukurtą build |
| `npm run lint` | ESLint patikra |

## Aplinkos kintamieji (`.env.local`)

Sukurk failą `.env.local` projekto šaknyje (jis **nėra** keliamas į Git):

| Kintamasis | Aprašymas |
|------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase projekto URL (pvz. `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` / publishable raktas (viešas, su RLS apsauga) |

Pavyzdį rasi faile `.env.example`.

> **Svarbu:** frontende naudok tik `anon` raktą. `service_role` raktą niekada nedėk į kliento kodą.

## Duomenų bazė

Supabase SQL skriptai yra aplanke `supabase/`. Naujam projektui paleisk **SQL Editor** eilės tvarka:

1. `supabase/schema.sql` — lentelės ir RLS politikos
2. `supabase/seed.sql` — pavyzdiniai renginiai (pasirenkama)
3. Jei reikia papildomų pataisymų: `supabase/fix-seats-count-on-cancel.sql`, `supabase/fix-events-rls.sql` ir kt.

### Lentelė `events`

Renginių katalogas.

| Stulpelis | Aprašymas |
|-----------|-----------|
| `id` | Unikalus renginio identifikatorius (UUID) |
| `title` | Pavadinimas |
| `description` | Aprašymas (nebūtinas) |
| `event_date`, `event_time` | Data ir laikas |
| `location` | Vieta |
| `category` | Kategorija (filtrams ir grafikui) |
| `price` | Kaina |
| `total_seats` | Viso vietų skaičius |
| `available_seats` | Likusios laisvos vietos |
| `created_at` | Įrašo sukūrimo laikas |

### Lentelė `reservations`

Vartotojo rezervacijos (susieta su `auth.users`).

| Stulpelis | Aprašymas |
|-----------|-----------|
| `id` | Rezervacijos identifikatorius (UUID) |
| `user_id` | Vartotojas (nuoroda į Supabase Auth) |
| `event_id` | Renginys (nuoroda į `events`) |
| `status` | `active` arba `cancelled` |
| `seats_count` | Aktyvių vietų skaičius (1–11, arba 0 visiškai atšaukus) |
| `cancelled_seats` | Kiek vietų buvo atšaukta per rezervacijos istoriją |
| `created_at` | Rezervacijos sukūrimo laikas |

Vienas vartotojas gali turėti **vieną** rezervacijos įrašą vienam renginiui (`unique (user_id, event_id)`). Po visiško atšaukimo galima rezervuoti tą patį renginį iš naujo.

## Puslapių struktūra

| Maršrutas | Prieiga | Paskirtis |
|-----------|---------|-----------|
| `/` | Visi | Pradžia |
| `/events` | Visi | Renginiai ir rezervavimas |
| `/register` | Visi | Registracija |
| `/login` | Visi | Prisijungimas |
| `/my-reservations` | Prisijungęs | Mano rezervacijos |
| `/dashboard` | Prisijungęs | Statistika |

## Diegimas į Vercel (pasirenkama)

1. Įkelk projektą į Git repozitoriją.
2. [vercel.com](https://vercel.com) → **Add New Project** → importuok repo.
3. Nustatyk **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Supabase → **Authentication** → **URL Configuration** → pridėk Vercel domeną į Redirect URLs.

## Troubleshooting (dažnos problemos)

### Projektas nepasileidžia lokaliai

| Problema | Sprendimas |
|----------|------------|
| `command not found: nlm` | Rašybos klaida — naudok **`npm run dev`**, ne `nlm`. |
| `command not found: npm` | Įdiek [Node.js](https://nodejs.org) (LTS, 20+). |
| Pakeitimai po `.env.local` redagavimo neveikia | Sustabdyk serverį (`Ctrl + C`) ir vėl paleisk `npm run dev`. |
| `npm install` klaidos | Ištrink `node_modules` ir `package-lock.json`, tada vėl `npm install`. |

### Supabase / `.env.local`

| Problema | Sprendimas |
|----------|------------|
| Puslapyje „Supabase dar neprijungtas“ | Sukurk `.env.local` iš `.env.example` ir įrašyk `NEXT_PUBLIC_SUPABASE_URL` bei `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| Raktai teisingi, bet vis tiek neveikia | Patikrink, ar URL ir raktas iš **to paties** Supabase projekto (Settings → API). |
| SQL failą paleidau terminale — nieko neįvyko | SQL vykdyk tik **Supabase Dashboard → SQL Editor**, ne terminale. |

### Renginiai (`/events`)

| Problema | Sprendimas |
|----------|------------|
| Renginių sąrašas tuščias (0 įrašų), nors Table Editor rodo duomenis | Dažniausiai **RLS**: paleisk `supabase/fix-events-rls.sql`. Patikrink, ar `.env.local` rodo tą patį projektą, kuriame yra renginiai. |
| „Klaida“ kraunant renginius | Supabase **Logs** → Postgres / API; patikrink RLS ir ar lentelė `events` egzistuoja (`schema.sql`). |
| Po rezervacijos laisvos vietos nesikeičia | Paleisk `supabase/fix-events-update-rls.sql` (policy `events_update_authenticated`). |

### Rezervavimas ir atšaukimas

| Problema | Sprendimas |
|----------|------------|
| „Norėdami rezervuoti, prisijungite“ | Prisijunk per `/login`; rezervacija reikalauja aktyvios sesijos. |
| „Šį renginį jau rezervavote“ (aktyvi rezervacija) | Vienam renginiui — viena aktyvi rezervacija. Atšauk visą rezervaciją arba naudok „Atšaukti 1 vietą“. |
| Visiško atšaukimo klaida dėl `seats_count` | Paleisk `supabase/fix-seats-count-on-cancel.sql` SQL Editor. |
| Atšaukimas nepavyksta (RLS / policy) | Paleisk `supabase/fix-cancel-reservation-rls.sql`. |
| Po atšaukimo negaliu rezervuoti to paties renginio | Atnaujink kodą (`reserve-event` tikrina tik `active`) ir perkrauk puslapį. DB constraint — žr. `fix-seats-count-on-cancel.sql`. |
| Trūksta stulpelio `seats_count` | Paleisk `supabase/add-seats-count.sql` ir `supabase/add-cancelled-seats.sql`. |

### Registracija ir prisijungimas

| Problema | Sprendimas |
|----------|------------|
| Registracija pavyko, bet negali prisijungti | Supabase → **Authentication** → patikrink, ar įjungtas **Email** provider; dev režime galima išjungti el. pašto patvirtinimą. |
| „Vartotojas su šiuo el. paštu jau užregistruotas“ | Naudok `/login` arba kitą el. paštą. |
| Po prisijungimo `/dashboard` meta į `/login` | Sesijos slapukai: bandyk iš naujo prisijungti, išvalyk svetainės slapukus; patikrink `middleware` / proxy konfigūraciją. |

### Dashboard, kopijavimas, tema

| Problema | Sprendimas |
|----------|------------|
| `/dashboard` rodo klaidą kraunant duomenis | Patikrink RLS ant `reservations` ir `events`; prisijunk tuo pačiu vartotoju, kuris turi rezervacijų. |
| „Nepavyko nukopijuoti“ | Naršyklėje reikia leidimo iškarpinei; localhost paprastai veikia. Production — naudok **HTTPS** (Vercel). |
| Tema neįsijungia / mirguliuoja | Išvalyk `localStorage` raktą `theme` arba perjunk temą antraštėje dar kartą. |

### Diegimas (Vercel)

| Problema | Sprendimas |
|----------|------------|
| Build sėkmingas, bet svetainėje tuščia DB | Vercel **Environment Variables** — tie patys `NEXT_PUBLIC_*` kaip lokaliai. |
| Prisijungimas production neveikia | Supabase → **URL Configuration** → pridėk Vercel domeną į **Redirect URLs** ir **Site URL**. |

Jei problemos lieka — patikrink naršyklės **Console** (F12) ir Supabase **Logs**, tada palygink su SQL failais aplanke `supabase/`.

## Licencija

Mokymosi projektas — laisvai naudok mokymuisi ir tobulinimui.
