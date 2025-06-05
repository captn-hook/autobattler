import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/nav/nav";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { UserProvider } from "@/context/user/userContext";
import { SelectionProvider } from "@/context/selection/selectionContext";
import { ResultProvider } from "@/context/result/resultContext";
import { MonsterProvider } from "@/context/monsters/monsterContext";
import ResultPopup from "@/components/result/restultPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autobattler",
  description: "AI Monsters Battle Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <UserProvider>
            <MonsterProvider>
              <SelectionProvider>
                <ResultProvider>
                  <Nav />
                  <ResultPopup />
                  {children}
                </ResultProvider>
              </SelectionProvider>
            </MonsterProvider>
          </UserProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
