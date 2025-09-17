import type { Metadata } from "next";
import { Poppins, Lato, Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kaçkar Mountains & Rize | Nature, Culture and Discovery",
  description: "Discover the Kaçkar Mountains and Rize, where nature, culture, and history meet. Explore trails, highlands, local flavours, and traditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${lato.variable} ${openSans.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {children}
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="8a6ec7d0-e3da-41fd-b821-c0cce38770a7";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="ef07e5be-6cf8-4748-a2bb-6dfab9dc1d72"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}