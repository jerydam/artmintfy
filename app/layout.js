// app/layout.jsx  — NO 'use client', NO useState
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/component/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: 'ArtMintfy' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <footer className="border-t border-white/5 bg-black py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <p className="text-white font-bold tracking-tighter text-lg">ArtMintfy</p>
              <p className="text-slate-500 text-sm mt-1">Built by Jerydam</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <a href="https://alfajores.celoscan.io/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Explorer</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
            </div>
            <p className="text-slate-600 text-xs">© 2024 ArtMintfy. No Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}