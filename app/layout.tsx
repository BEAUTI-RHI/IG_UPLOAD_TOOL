// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InstagramAccountsProvider } from "@/context/InstagramAccountsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Reel Manager",
  description: "Manage and upload Instagram reels across multiple accounts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InstagramAccountsProvider>{children}</InstagramAccountsProvider>
      </body>
    </html>
  );
}
