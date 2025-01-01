import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PasswordProtection from '@/components/PasswordProtection';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gigi's Games",
  description: "A collection of fun games made with love 💝",
  openGraph: {
    title: "Gigi's Games",
    description: "A collection of fun games made with love 💝",
    url: 'https://gigi-games.vercel.app',
    siteName: "Gigi's Games",
    images: [
      {
        url: '/games/memory/images/image3.png',
        width: 1200,
        height: 630,
        alt: "Gigi's Games Preview"
      }
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gigi's Games",
    description: "A collection of fun games made with love 💝",
    images: ['/games/memory/images/image3.png'],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PasswordProtection>
          {children}
        </PasswordProtection>
      </body>
    </html>
  );
}
