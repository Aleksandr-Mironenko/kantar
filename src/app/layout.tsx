import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';


const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  // preload: false,  ← это уже по умолчанию в новых версиях
});

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
