# YAPI Medan - Interactive Frontend Platform
> **Modern, Premium, and Fully Responsive React & TypeScript Client for Yayasan Advent Peduli Indonesia (YAPI) Medan.**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://natanaeldetamor.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-v18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Build Tool](https://img.shields.io/badge/Vite-Fast%20Build-purple?style=flat-square&logo=vite)](https://vitejs.dev/)

---

## 🔗 Live Demo
Check out the production platform here: **[https://natanaeldetamor.vercel.app/](https://natanaeldetamor.vercel.app/)**

---

## 📈 Key Frontend Highlights
- **Stunning UI/UX Aesthetics**: Curated visual layouts using custom Tailwind configs, Inter typography, glassmorphism elements, custom loaders, and smooth React Hot Toast notifications.
- **Robust State Management**: Powered by **TanStack Query (React Query)** for declarative data-fetching, optimistic updates, and cache synchronization with the backend REST API.
- **Strict TypeScript Typing**: Full schema compliance and compile-time type-safety across all components, hooks, services, and state contexts.
- **Dynamic Admin Dashboard**: Multi-role admin panels for managing children data, activities, sponsorships, testimonials, and audit reports.

---

## 🚀 Fitur Utama

- 🏠 **Beranda** - Landing page interaktif dengan info yayasan, program terbaru, dan galeri kegiatan.
- 👥 **Manajemen Anak Asuh** - Galeri profil anak asuh yang terperinci untuk kemudahan program donasi & sponsor.
- 💰 **Sistem Donasi Dinamis** - Form donasi dengan pilihan jumlah custom, kategori terfokus, dan gateway pembayaran Midtrans/Stripe.
- 🔐 **Autentikasi & Sesi Aman** - Sistem registrasi, login, dan logout dengan proteksi auto-login JWT token.
- 📊 **Dashboard Admin Multi-Modul** - Panel visual admin untuk mengelola kegiatan anak, testimoni, dan monitoring audit log.

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript (Strict Mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & Vanilla CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios dengan global error interceptors
- **Icons**: Heroicons & FontAwesome
- **Notifications**: React Hot Toast untuk feedback real-time

## Struktur Proyek

```
src/
├── components/          # Komponen React
│   ├── auth/           # Komponen autentikasi
│   ├── children/       # Komponen anak-anak
│   ├── contact/        # Komponen kontak
│   ├── donations/      # Komponen donasi
│   ├── layout/         # Layout utama
│   └── admin/          # Komponen admin
├── hooks/              # Custom hooks
├── pages/              # Halaman aplikasi
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Instalasi

1. Clone repository

```bash
git clone <repository-url>
cd yapi-medan-fe
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
```

4. Jalankan development server

```bash
npm run dev
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run type-check` - Type checking

## Environment Variables

### Google Maps Integration

Website menggunakan Google Maps iframe embed yang tidak memerlukan API key:

```env
VITE_API_URL=http://localhost:8000/api
```

**Koordinat YAPI Medan:**

- Latitude: 3.5590454
- Longitude: 98.7044167
- Alamat: Jl. Air Bersih Ujung No.98 A, Sudirejo II, Kec. Medan Kota, Kota Medan, Sumatera Utara 20216

## API Endpoints

- `POST /auth/login` - Login user
- `POST /auth/register` - Register user
- `POST /donations` - Buat donasi
- `POST /contact` - Kirim pesan kontak
- `GET /reports/dashboard` - Data dashboard admin

## Komponen Utama

### LoginForm

Form login dengan validasi dan error handling.

### DonationForm

Form donasi lengkap dengan pilihan jumlah, kategori, dan metode pembayaran.

### ChildCard

Card untuk menampilkan informasi anak dengan foto dan detail.

### DashboardStats

Statistik dashboard admin dengan loading states.

## Styling

Menggunakan Tailwind CSS dengan custom components:

- `.btn-primary` - Button primary
- `.btn-secondary` - Button secondary
- `.input-field` - Input field
- `.card` - Card container

## TypeScript

Semua komponen menggunakan TypeScript dengan interface yang lengkap untuk:

- User authentication
- Donation data
- Child information
- API responses

## 📝 Conventional Commits & Git Guidelines

Untuk menjaga kerapian riwayat commit, gunakan format **Conventional Commits**:
- `feat: ...` untuk fitur baru (contoh: `feat: add toast transitions`)
- `fix: ...` untuk perbaikan bug (contoh: `fix: typescript interface compliance for Donation`)
- `chore: ...` untuk update dependency atau konfigurasi build (contoh: `chore: config tailwind shades`)
- `docs: ...` untuk pembaharuan README (contoh: `docs: add vercel badge`)

## 📝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes menggunakan format conventional commit
4. Push ke branch (`git push origin feat/amazing-feature`)
5. Buat Pull Request

## 📄 License

MIT License - copyright (c) 2026.

