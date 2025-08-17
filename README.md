# YAPI Medan Frontend

Frontend untuk platform donasi dan sosial YAPI Medan yang dibangun dengan React + TypeScript.

## Fitur

- 🏠 **Beranda** - Landing page dengan informasi utama
- 👥 **Anak-anak** - Daftar anak yang membutuhkan bantuan
- 💰 **Donasi** - Form donasi dengan berbagai metode pembayaran
- 📞 **Kontak** - Form kontak dan informasi
- 🔐 **Autentikasi** - Login dan register user
- 📊 **Dashboard Admin** - Panel admin untuk mengelola data

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

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

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License
