import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavbarDesktop from "@/components/navbar/navbar-desktop";
import NavbarMobile from "@/components/navbar/navbar-mobile";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Floricultura Formosa",
  description: "Floricultura formosa a floricultura de confiança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${poppins.className} antialiased bg-neutral-50`}>
        <SessionProvider>
          <NavbarDesktop />
          <NavbarMobile />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
