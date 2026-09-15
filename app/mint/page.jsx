'use client';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Upload from '@/component/ipfs';
import { NETWORKS, DEFAULT_CHAIN } from '@/lib/networks';
import {
  Rocket, Loader2, Layers, CheckCircle,
  Wallet, LogOut, Globe, AlertCircle
} from 'lucide-react';

const FACTORY_ADDRESS = '0xE66Ac37142f2e15e96E604BF5B861a304C4fedC4';
const FACTORY_ABI = [
  'function deployDeterministic(string _name, string _symbol, string _uri, bytes32 salt) public returns (address)',
];

// ─── Inline wallet widget ────────────────────────────────────────────────────
function WalletSection({ account, onConnect, onDisconnect }) {
  if (account) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-xl">
            <Globe size={16} className="text-green-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Wallet connected</p>
            <p className="text-sm font-mono text-white">
              {account.slice(0, 6)}…{account.slice(-4)}
            </p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} /> Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="w-full py-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/30 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all text-sm"
    >
      <Wallet size={18} className="text-yellow-500" />
      Connect Wallet to Continue
    </button>
  );
}

// ─── Deploy button with reason tooltip ──────────────────────────────────────
function DeployButton({ loading, onClick, blockingReason }) {
  const isBlocked = !!blockingReason;

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={loading || isBlocked}
        className={`w-full py-4 font-black rounded-2xl flex justify-center items-center gap-2 transition-all
          ${isBlocked || loading
            ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-[0.99]'
          }`}
      >
        {loading
          ? <><Loader2 size={20} className="animate-spin" /> Processing…</>
          : <><Rocket size={20} /> Deploy Omni-Chain</>
        }
      </button>
      {isBlocked && !loading && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500 justify-center">
          <AlertCircle size={12} /> {blockingReason}
        </p>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function MultiChainMint() {
  const [form, setForm]                   = useState({ name: '', symbol: '' });
  const [uri, setUri]                     = useState('');
  const [selectedChains, setSelectedChains] = useState(['celo']);
  const [deploymentStatus, setStatus]     = useState({});
  const [loading, setLoading]             = useState(false);
  const [account, setAccount]             = useState(null);

  // ── Wallet ────────────────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Add/switch to default chain
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [DEFAULT_CHAIN],
        });
      } catch {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DEFAULT_CHAIN.chainId }],
        });
      }

      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setStatus({});
  };

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts) => setAccount(accounts[0] ?? null);
    window.ethereum.on('accountsChanged', onAccountsChanged);
    return () => window.ethereum.removeListener('accountsChanged', onAccountsChanged);
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────
  const blockingReason = (() => {
    if (!account)               return 'Connect your wallet first';
    if (!uri)                   return 'Upload artwork to IPFS first';
    if (!form.name.trim())      return 'Enter a collection name';
    if (!form.symbol.trim())    return 'Enter a token symbol';
    if (!selectedChains.length) return 'Select at least one chain';
    return null;
  })();

  // ── Chain toggle ──────────────────────────────────────────────────────────
  const toggleChain = (key) => {
    setSelectedChains((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ── Deploy ────────────────────────────────────────────────────────────────
  const handleMultiDeploy = async () => {
    if (blockingReason) return;
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = provider.getSigner();
      const salt     = ethers.utils.keccak256(await signer.getAddress());

      for (const chainKey of selectedChains) {
        // Skip already-succeeded chains on retry
        if (deploymentStatus[chainKey] === 'success') continue;

        setStatus((prev) => ({ ...prev, [chainKey]: 'pending' }));

        try {
          const network = NETWORKS[chainKey];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });

          const activeProvider = new ethers.providers.Web3Provider(window.ethereum);
          const factory = new ethers.Contract(
            FACTORY_ADDRESS,
            FACTORY_ABI,
            activeProvider.getSigner()
          );

          const tx = await factory.deployDeterministic(
            form.name,
            form.symbol,
            uri,
            salt
          );
          await tx.wait();
          setStatus((prev) => ({ ...prev, [chainKey]: 'success' }));
        } catch (e) {
          console.error(`Deploy failed on ${chainKey}:`, e);
          setStatus((prev) => ({ ...prev, [chainKey]: 'error' }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-8 md:py-16 px-4">
      <div className="bg-slate-900 border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-12 space-y-6">

        {/* Header */}
        <h1 className="text-2xl md:text-4xl font-black flex items-center gap-3">
          <Layers className="text-yellow-500" /> OMNI-DEPLOY
        </h1>

        {/* Step 1 – Wallet */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">1 · Wallet</p>
          <WalletSection
            account={account}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>

        {/* Step 2 – Artwork */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">2 · Artwork</p>
          <Upload onUploadSuccess={(cid) => setUri(cid)} />
        </div>

        {/* Step 3 – Metadata */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">3 · Collection info</p>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Collection name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-600"
            />
            <input
              placeholder="Symbol"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              className="md:w-36 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-colors uppercase placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Step 4 – Chains */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">4 · Target chains</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.keys(NETWORKS).map((key) => {
              const status = deploymentStatus[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleChain(key)}
                  disabled={loading}
                  className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center justify-between
                    ${selectedChains.includes(key)
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/10'
                    }
                    ${loading ? 'cursor-not-allowed opacity-60' : ''}
                  `}
                >
                  {key}
                  {status === 'success' && <CheckCircle size={12} className="text-green-500" />}
                  {status === 'pending' && <Loader2 size={12} className="animate-spin text-yellow-400" />}
                  {status === 'error'   && <AlertCircle size={12} className="text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deploy */}
        <DeployButton
          loading={loading}
          onClick={handleMultiDeploy}
          blockingReason={blockingReason}
        />

      </div>
    </div>
  );
}