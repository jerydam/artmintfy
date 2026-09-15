'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react';
import WalletConnect from '@/component/WalletConnect';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
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
          <div className="hidden md:flex items-center gap-8">
            <Link href="/mint" className="text-sm font-medium hover:text-yellow-400 transition-colors flex items-center gap-2">
              <PlusCircle size={18} /> Create
            </Link>
            <Link href="/all-address" className="text-sm font-medium hover:text-yellow-400 transition-colors flex items-center gap-2">
              <LayoutDashboard size={18} /> Activity
            </Link>
            <WalletConnect />
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 -m-2" aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-6">
            <Link href="/mint" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-yellow-400 transition-colors flex items-center gap-3">
              <PlusCircle size={22} /> Create
            </Link>
            <Link href="/all-address" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-yellow-400 transition-colors flex items-center gap-3">
              <LayoutDashboard size={22} /> Activity
            </Link>
            <WalletConnect />
          </div>
        </div>
      )}
    </nav>
  );
}