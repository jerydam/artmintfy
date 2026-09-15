'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Upload from '@/component/ipfs';
import { NETWORKS, DEFAULT_CHAIN } from '@/lib/networks';
import {
  Rocket, Loader2, Layers, CheckCircle,
  Wallet, LogOut, Globe, AlertCircle, X, ExternalLink
} from 'lucide-react';

const FACTORY_ADDRESS = '0xE66Ac37142f2e15e96E604BF5B861a304C4fedC4';
const FACTORY_ABI = [
  'function deployDeterministic(string _name, string _symbol, string _uri, bytes32 salt) public returns (address)',
];

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ results, collectionName, onClose, onMintAnother }) {
  const successChains = results.filter((r) => r.status === 'success');
  const failedChains  = results.filter((r) => r.status === 'error');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={18} />
        </button>

        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <Rocket size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-white">Deployed!</h2>
          <p className="text-sm text-slate-400">
            <span className="text-white font-semibold">{collectionName}</span> is live
            on {successChains.length} chain{successChains.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Chain results */}
        <div className="space-y-2">
          {successChains.map((r) => (
            <div
              key={r.chainKey}
              className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/15 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                <span className="text-xs font-bold uppercase text-green-400">{r.chainKey}</span>
              </div>
              <div className="flex items-center gap-2">
                {r.address && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {r.address.slice(0, 6)}…{r.address.slice(-4)}
                  </span>
                )}
                {r.explorerUrl && (
                  <a
                    href={r.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}

          {failedChains.map((r) => (
            <div
              key={r.chainKey}
              className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/15 rounded-xl"
            >
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-xs font-bold uppercase text-red-400">{r.chainKey}</span>
              <span className="text-[10px] text-slate-500 ml-auto">failed</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onMintAnother}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all active:scale-[0.99] text-sm"
          >
            Deploy Another
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl transition-all text-sm border border-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline wallet widget ─────────────────────────────────────────────────────
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

// ─── Deploy button ────────────────────────────────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function MultiChainMint() {
  const [form, setForm]               = useState({ name: '', symbol: '' });
  const [uri, setUri]                 = useState('');
  const [selectedChains, setSelectedChains] = useState(['botchain']);
  const [deploymentStatus, setStatus] = useState({});
  const [loading, setLoading]         = useState(false);
  const [account, setAccount]         = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [modalResults, setModalResults] = useState([]);

  // ── Wallet ────────────────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    try {
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts) => setAccount(accounts[0] ?? null);
    window.ethereum.on('accountsChanged', onAccountsChanged);
    return () => window.ethereum.removeListener('accountsChanged', onAccountsChanged);
  }, []);

  // ── Chain switch helper ───────────────────────────────────────────────────
  const switchToChain = async (network) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchErr) {
      if (switchErr.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } else {
        throw switchErr;
      }
    }

    // Poll until chain actually switched
    const targetChainId = parseInt(network.chainId, 16);
    for (let i = 0; i < 20; i++) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await p.getNetwork();
      if (chainId === targetChainId) return p.getSigner();
      await new Promise((r) => setTimeout(r, 300));
    }
    throw new Error(`Timed out switching to chain ${network.chainId}`);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const blockingReason = (() => {
    if (!account)               return 'Connect your wallet first';
    if (!uri)                   return 'Upload artwork to IPFS first';
    if (!form.name.trim())      return 'Enter a collection name';
    if (!form.symbol.trim())    return 'Enter a token symbol';
    if (!selectedChains.length) return 'Select at least one chain';
    return null;
  })();

  const toggleChain = (key) =>
    setSelectedChains((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // ── Deploy ────────────────────────────────────────────────────────────────
  const handleMultiDeploy = async () => {
    if (blockingReason) return;
    setLoading(true);
    setShowModal(false);

    const results = [];

    try {
      const initProvider = new ethers.providers.Web3Provider(window.ethereum);
      const initSigner   = initProvider.getSigner();
      const salt = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(await initSigner.getAddress())
      );

      for (const chainKey of selectedChains) {
        if (deploymentStatus[chainKey] === 'success') {
          results.push({ chainKey, status: 'success' });
          continue;
        }

        setStatus((prev) => ({ ...prev, [chainKey]: 'pending' }));

        try {
          const network = NETWORKS[chainKey];
          const signer  = await switchToChain(network);
          const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

          const tx = await factory.deployDeterministic(
            form.name, form.symbol, uri, salt
          );
          const receipt = await tx.wait();

          // Pull deployed address from receipt if available
          const deployedAddress = receipt?.contractAddress ?? receipt?.logs?.[0]?.address ?? null;

          // Build explorer URL from NETWORKS config if it has blockExplorerUrls
          const explorerBase = network.blockExplorerUrls?.[0];
          const explorerUrl  = explorerBase && deployedAddress
            ? `${explorerBase}/address/${deployedAddress}`
            : null;

          setStatus((prev) => ({ ...prev, [chainKey]: 'success' }));
          results.push({ chainKey, status: 'success', address: deployedAddress, explorerUrl });

        } catch (e) {
          console.error(`Deploy failed on ${chainKey}:`, e);
          setStatus((prev) => ({ ...prev, [chainKey]: 'error' }));
          results.push({ chainKey, status: 'error' });
        }
      }
    } finally {
      setLoading(false);
      // Show modal if at least one chain succeeded
      if (results.some((r) => r.status === 'success')) {
        setModalResults(results);
        setShowModal(true);
      }
    }
  };

  const handleMintAnother = () => {
    setShowModal(false);
    setForm({ name: '', symbol: '' });
    setUri('');
    setSelectedChains(['botchain']);
    setStatus({});
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Success modal */}
      {showModal && (
        <SuccessModal
          results={modalResults}
          collectionName={form.name}
          onClose={() => setShowModal(false)}
          onMintAnother={handleMintAnother}
        />
      )}

      <div className="max-w-3xl mx-auto py-8 md:py-16 px-4">
        <div className="bg-slate-900 border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-12 space-y-6">

          <h1 className="text-2xl md:text-4xl font-black flex items-center gap-3">
            <Layers className="text-yellow-500" /> OMNI-DEPLOY
          </h1>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">1 · Wallet</p>
            <WalletSection account={account} onConnect={connectWallet} onDisconnect={disconnectWallet} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">2 · Artwork</p>
            <Upload onUploadSuccess={(cid) => setUri(cid)} />
          </div>

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

          <DeployButton
            loading={loading}
            onClick={handleMultiDeploy}
            blockingReason={blockingReason}
          />

        </div>
      </div>
    </>
  );
}