'use client';

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, ArrowRight, Wallet } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium mb-6">
          <Sparkles size={14} />
          <span>Powered by Celo Network</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          ArtMintify
        </h1>
        <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed px-4">
          The most seamless way to create, deploy, and manage your digital art on the Celo blockchain. Fast, green, and secure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
          <Link
            href="/mint"
            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 text-base"
          >
            Start Minting <ArrowRight size={20} />
          </Link>
          <Link
            href="/all-address"
            className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all text-base"
          >
            <Users size={20} /> View Community
          </Link>
        </div>
      </div>

      {/* Featured Artwork Preview */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <div className="rounded-3xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm p-4 shadow-2xl">
          <Image
            src="/art.jpg"
            alt="ArtMintify Hero"
            width={1200}
            height={600}
            className="rounded-2xl object-cover w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            priority
          />
        </div>

        {/* Floating Stats Card - hidden on mobile */}
        <div className="absolute -bottom-6 -right-2 md:right-12 bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl hidden sm:block">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Wallet className="text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Network Status</p>
              <p className="text-sm font-mono text-green-400">Celo Alfajores Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <h3 className="text-xl font-bold mb-3">Instant Upload</h3>
            <p className="text-gray-500 text-sm">Upload your artwork to IPFS automatically with permanent storage resolution.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <h3 className="text-xl font-bold mb-3">Low Gas Fees</h3>
            <p className="text-gray-500 text-sm">Enjoy Celo&apos;s ultra-low transaction costs, making NFT creation accessible to everyone.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <h3 className="text-xl font-bold mb-3">Smart Verification</h3>
            <p className="text-gray-500 text-sm">Automatically track successful minters and build your on-chain reputation.</p>
          </div>
        </div>
      </section>
    </main>
  );
}