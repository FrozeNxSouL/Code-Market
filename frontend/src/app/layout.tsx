import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Code Market", template: "%s | Code Market" },
  description: "Discover, run, and deploy production-ready code — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center px-6 max-w-7xl mx-auto w-full gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg shrink-0">
              <span className="bg-gradient-to-br from-indigo-400 to-purple-400 text-black w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black">CM</span>
              <span className="text-white">Code<span className="text-indigo-400">Market</span></span>
            </Link>
            <nav className="flex-1 flex items-center gap-1 text-sm font-medium text-zinc-400">
              <Link href="/market" className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-all">Market</Link>
              <Link href="/deploy" className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-all">Deploy</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/history" className="text-sm text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">History</Link>
              <Link href="/profile" className="text-sm text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">Profile</Link>
              <Link href="/login" className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">Sign In</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <span>© 2026 CodeMarket. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/market" className="hover:text-zinc-400 transition-colors">Market</Link>
              <Link href="/deploy" className="hover:text-zinc-400 transition-colors">Deploy</Link>
              <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign In</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
