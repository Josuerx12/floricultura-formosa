import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import WppBtn from "@/components/buttons/wpp-btn";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ReactQueryProvider from "@/lib/react-query-provider";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Floricultura Formosa",
  description: "Floricultura formosa a floricultura de confiança.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-P82PQR7');
      `,
          }}
        />
      </head>

      <body
        className={`${poppins.className} antialiased flex flex-col min-h-screen h-full`}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P82PQR7"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <Suspense>
          <SessionProvider>
            <ReactQueryProvider>
              <Navbar />
              {children}
              <Toaster />
              <WppBtn />
              <Footer />
            </ReactQueryProvider>
          </SessionProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
