import { Space_Grotesk, Dela_Gothic_One } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela-gothic",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FlipChecker | High-Speed Reseller Tools",
  description: "FlipChecker shows you what Facebook Marketplace items are worth on eBay, instantly. Chrome extension for resellers.",
  metadataBase: new URL('https://flipchecker.io'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${delaGothicOne.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
