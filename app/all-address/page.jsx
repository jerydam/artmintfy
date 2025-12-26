'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Users, ExternalLink, RefreshCw, ImageIcon, Globe } from 'lucide-react';
import { NETWORKS } from '@/lib/networks'; // Your new networks config

const factoryAddress = '0xd4be7508211967E45538F23D304E8B8789A1C62d'; 

const factoryABI = [
  "function getDeployedNFTs() view returns (address[])",
  "function deployDeterministic(string _name, string _symbol, string _uri, bytes32 salt) public returns (address)"
];

const nftAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256) view returns (string)"
];

function AddressRow({ addr, index, currentRpc, activeNetwork }) {
  const [nftData, setNftData] = useState({ name: '', symbol: '', image: '', loading: true });
  const explorerUrl = NETWORKS[activeNetwork]?.blockExplorerUrls[0] || "https://celoscan.io";

  useEffect(() => {
    const fetchNftDetails = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(currentRpc);
        const contract = new ethers.Contract(addr, nftAbi, provider);

        const [name, symbol, rawUri] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.tokenURI(1).catch(() => "")
        ]);

        let imageUrl = rawUri.startsWith('ipfs://') 
          ? rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/') 
          : rawUri.startsWith('http') ? rawUri : `https://ipfs.io/ipfs/${rawUri}`;

        setNftData({ name, symbol, image: imageUrl, loading: false });
      } catch (e) {
        setNftData({ name: 'Unique Collection', symbol: 'NFT', image: null, loading: false });
      }
    };
    fetchNftDetails();
  }, [addr, currentRpc]);

  return (
    <div className="group p-5 bg-slate-900/50 border border-white/5 rounded-[2rem] hover:border-yellow-500/30 transition-all flex flex-col md:flex-row items-center gap-6">
      <div className="w-24 h-24 bg-black rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 relative">
        {nftData.image ? (
          <img src={nftData.image} alt={nftData.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <ImageIcon className="text-slate-600" size={24} />
          </div>
        )}
      </div>

      <div className="flex-grow text-center md:text-left overflow-hidden">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <h4 className="text-xl font-bold text-white truncate">{nftData.name}</h4>
          <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-mono">
            {nftData.symbol}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono uppercase">
            {activeNetwork}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-widest">Deterministic CA</p>
        <code className="text-[11px] text-slate-400 font-mono block truncate bg-black/40 p-2 rounded-lg">
          {addr}
        </code>
      </div>

      <div className="flex gap-2">
        <a 
          href={`${explorerUrl}/address/${addr}`} 
          target="_blank" 
          className="p-4 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-2xl transition-all"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
}

export default function AddressList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNetwork, setActiveNetwork] = useState('celo');
  const loadData = async () => {
  setLoading(true);
  try {
    const network = NETWORKS[activeNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);
    
    // Check if the Factory exists on this specific chain
    const code = await provider.getCode(factoryAddress);
    if (code === "0x" || code === "0x0") {
      console.warn(`Factory not found on ${activeNetwork} at ${factoryAddress}`);
      setContracts([]);
      setLoading(false);
      return;
    }

    const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
    const list = await factory.getDeployedNFTs();
    setContracts([...list].reverse());
  } catch (err) {
    console.error(`Error on ${activeNetwork}:`, err.message);
    setContracts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { loadData(); }, [activeNetwork]);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      {/* Header & Network Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase">
            Art<span className="text-yellow-500">Explorer</span>
          </h2>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar max-w-md">
            {['celo', 'base', 'arbitrum', 'polygon','optimism', 'lisk'].map((net) => (
              <button
                key={net}
                onClick={() => setActiveNetwork(net)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                  activeNetwork === net 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
        <button onClick={loadData} className="p-4 bg-slate-800 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all">
          <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center text-slate-600 uppercase text-xs font-bold tracking-[0.3em] animate-pulse">
            Syncing Ledger...
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No Deployed Contracts on {activeNetwork}</p>
          </div>
        ) : (
          contracts.map((addr, i) => (
           <AddressRow 
            key={`${activeNetwork}-${addr}`} 
            addr={addr} 
            index={contracts.length - i}
            currentRpc={NETWORKS[activeNetwork].rpcUrls[0]}
            activeNetwork={activeNetwork} // <--- ADD THIS LINE
          />
          ))
        )}
      </div>
    </div>
  );
}