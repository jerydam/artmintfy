'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Wallet, LayoutDashboard, PlusCircle, Menu, X } from "lucide-react";
import WalletConnect from "@/component/WalletConnect";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-slate-200 min-h-screen flex flex-col`}>
        {/* Navigation Bar */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-black font-black text-xl">A</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-white group-hover:text-yellow-400 transition-colors">
                ArtMintfy
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                <Link href="/mint" className="text-sm font-medium hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <PlusCircle size={18} /> Create
                </Link>
                <Link href="/all-address" className="text-sm font-medium hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <LayoutDashboard size={18} /> Activity
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 -m-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl">
              <div className="px-6 py-6 flex flex-col gap-6">
                <Link
                  href="/mint"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium hover:text-yellow-400 transition-colors flex items-center gap-3"
                >
                  <PlusCircle size={22} /> Create
                </Link>
                <Link
                  href="/all-address"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium hover:text-yellow-400 transition-colors flex items-center gap-3"
                >
                  <LayoutDashboard size={22} /> Activity
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer */}
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