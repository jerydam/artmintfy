'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, LogOut, ChevronDown, Globe } from 'lucide-react';
import { DEFAULT_CHAIN } from '@/lib/networks';

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  const connect = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request network switch
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [DEFAULT_CHAIN],
        });
      } catch (e) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DEFAULT_CHAIN.chainId }],
        });
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const net = await provider.getNetwork();
      setNetwork(net);
    } catch (err) {
      console.error(err);
    }
  };

  if (account) {
    return (
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 pr-4 rounded-2xl">
        <div className="bg-yellow-500/10 p-2 rounded-xl text-yellow-500">
          <Globe size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Connected</span>
          <span className="text-sm font-mono leading-none">{account.slice(0,6)}...{account.slice(-4)}</span>
        </div>
        <button onClick={() => setAccount(null)} className="ml-2 text-slate-500 hover:text-red-500 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} className="bg-white text-black px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-white/5">
      <Wallet size={18} /> Connect Wallet
    </button>
  );
}