// app/layout.tsx
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'], preload: true });

export const metadata = {
  title: 'NearVibe - Discover Local Adventures',
  description: 'Plan and explore micro-adventures near you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
        <Header />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
        <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
