'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, PlusCircle, Menu, X, Rocket } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link href="/mint" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-3 text-sm font-medium hover:text-yellow-400 transition-colors md:p-0">
        <PlusCircle size={18} /> Create
      </Link>
      <Link href="/all-address" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-3 text-sm font-medium hover:text-yellow-400 transition-colors md:p-0">
        <LayoutDashboard size={18} /> Explorer
      </Link>
    </>
  );

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-slate-200 min-h-screen flex flex-col`}>
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Rocket className="text-black" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">ArtMintfy</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavLinks />
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="md:hidden bg-[#0a0a0a] border-b border-white/5 px-4 pb-6 pt-2 flex flex-col gap-2">
              <NavLinks />
            </div>
          )}
        </nav>

        <main className="flex-grow">{children}</main>

        <footer className="border-t border-white/5 bg-black py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <p className="text-white font-bold text-lg">ArtMintfy</p>
              <p className="text-slate-500 text-sm">Omni-chain NFT Deployer</p>
            </div>
            <p className="text-slate-600 text-xs italic">Built by Jerydam © 2025</p>
          </div>
        </footer>
      </body>
    </html>
  );
}