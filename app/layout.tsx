'use client';

import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import { Navbar } from "../components/navbar";
import { AuthProvider } from "@/contexts/authContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/cadastro';

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          {!hideNavbar && <Navbar />}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );

}
