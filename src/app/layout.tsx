import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

// Заменяем TildaSans на близкий Google Font (или подключай свой .woff2)
const inter = Inter({ subsets: ['latin', 'cyrillic'], weight: ['400', '700', '800'] });

export const metadata: Metadata = {
  title: 'Кантар — доставка грузов по России и миру',
  description: 'Логистическая компания Kantar — надёжная доставка грузов по России и всему миру',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="page">{children}</body>
    </html>
  );
}
