import type { Metadata } from "next";
import { IM_Fell_English, Lato, Open_Sans } from "next/font/google";
import "./globals.css";

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell-english",
  subsets: ["latin"],
  weight: ["400"],
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
  title: "Discover Kaçkar - Doğa, Kültür ve Macera",
  description: "Kaçkar Dağları'nın doğa ve kültür hazinelerini keşfedin. Yürüyüş, trekking, kültürel deneyimler ve yerel lezzetlerle unutulmaz bir macera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${imFellEnglish.variable} ${lato.variable} ${openSans.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}