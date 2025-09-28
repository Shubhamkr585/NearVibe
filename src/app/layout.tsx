import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProvider from "@/components/providers/SessionProvider";
import { MapboxProvider } from "@/components/providers/MapboxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NearVibe - Discover Local Micro-Adventures",
  description: "Find and plan short, local adventures based on your location, time, and interests.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <MapboxProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </MapboxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
