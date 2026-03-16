import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kantar-logistics.ru"),

  title: {
    default: "Kantar Logistics — международные грузоперевозки",
    template: "%s | Kantar Logistics",
  },

  description:
    "Логистическая компания Kantar — международные грузоперевозки и доставка грузов по России, Европе, Азии и миру.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://kantar-logistics.ru",
    siteName: "Kantar Logistics",
    title: "Kantar Logistics — международные грузоперевозки",
    description:
      "Надёжная доставка грузов по России, Европе, Азии и миру.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kantar Logistics",
    description:
      "Международные грузоперевозки и логистика",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kantar Logistics",
              url: "https://kantar-logistics.ru",
              logo: "https://kantar-logistics.ru/logo.png",
              description:
                "Международные грузоперевозки и логистика по России, Европе и Азии.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+7-910-105-64-23",
                email: "kantarlog@mail.ru",
                contactType: "customer service",
              },
              sameAs: [
                "https://t.me/kantar",
                "https://vk.com/kantar",
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}