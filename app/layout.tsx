import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard GIS Pemetaan PAM - AETRA Tangerang',
  description: 'Aplikasi Web Dashboard GIS untuk pemetaan minat pelanggan sambBerikut adalah contoh kode standar dan struktur untuk file **`layout.tsx`** di Next.js (App Router):

### Kode `app/layout.tsx` (Root Layout)

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // File CSS global Anda

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nama Aplikasi Anda',
  description: 'Deskripsi singkat aplikasi Anda',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Opsional: Header / Navbar Global */}
        <header className="p-4 bg-slate-900 text-white">
          <nav className="container mx-auto">
            <h1 className="font-bold">My Application</h1>
          </nav>
        </header>

        {/* Halaman utama (page.tsx) akan dirender di sini */}
        <main className="container mx-auto p-4">
          {children}
        </main>

        {/* Opsional: Footer Global */}
        <footer className="p-4 bg-slate-100 text-center text-sm border-t">
          <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
