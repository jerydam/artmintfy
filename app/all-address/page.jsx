'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Users, ExternalLink, RefreshCw, ImageIcon, Hash } from 'lucide-react';

// 1. YOUR FACTORY ADDRESS
const factoryAddress = '0x3B89f439D32936A8dcB22aD8971ecd0FcAE5834d'; 
const rpcUrl = "https://forno.celo.org";

// 2. THE FACTORY ABI (From your last message)
const factoryABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_symbol", "type": "string" },
      { "internalType": "string", "name": "_uri", "type": "string" }
    ],
    "name": "deployNFT",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeployedNFTs",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// 3. THE INDIVIDUAL NFT ABI (To get name/URI from each CA)
const nftAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256) view returns (string)"
];

function AddressRow({ addr, index }) {
  const [nftData, setNftData] = useState({ name: '', symbol: '', image: '', loading: true });

  useEffect(() => {
    const fetchNftDetails = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(addr, nftAbi, provider);

        const [name, symbol, rawUri] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.tokenURI(1).catch(() => "") // Assuming token ID 1
        ]);

        // Convert IPFS URI to HTTP Gateway
        let imageUrl = rawUri;
        if (rawUri.startsWith('ipfs://')) {
          imageUrl = rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        } else if (!rawUri.startsWith('http')) {
          imageUrl = `https://ipfs.io/ipfs/${rawUri}`;
        }

        setNftData({ name, symbol, image: imageUrl, loading: false });
      } catch (e) {
        console.error("Row Error:", e);
        setNftData({ name: 'Untitled NFT', symbol: 'NFT', image: null, loading: false });
      }
    };
    fetchNftDetails();
  }, [addr]);

  return (
    <div className="group p-5 bg-slate-900/50 border border-white/5 rounded-[2rem] hover:border-yellow-500/30 transition-all flex flex-col md:flex-row items-center gap-6">
      {/* NFT Image Preview */}
      <div className="w-28 h-28 bg-black rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
        {nftData.image ? (
          <img src={nftData.image} alt={nftData.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="text-slate-800" size={32} />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-hidden text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
          <h4 className="text-xl font-bold text-white tracking-tight truncate max-w-[200px]">
            {nftData.loading ? "Loading..." : nftData.name}
          </h4>
          {!nftData.loading && (
            <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
              {nftData.symbol}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Contract Address</p>
          <code className="text-[11px] text-slate-400 font-mono truncate bg-black/30 p-2 rounded-lg border border-white/5">
            {addr}
          </code>
        </div>
      </div>

      <a 
        href={`https://celoscan.io/address/${addr}`} 
        target="_blank" 
        className="p-4 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-2xl transition-all group-hover:shadow-lg group-hover:shadow-yellow-500/10"
      >
        <ExternalLink size={20} />
      </a>
    </div>
  );
}

export default function AddressList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const list = await factory.getDeployedNFTs();
      setContracts([...list].reverse());
    } catch (err) {
      console.error("Factory fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase">
            Art<span className="text-yellow-500">Explorer</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Discover unique NFT contracts deployed on Celo</p>
        </div>
        <button onClick={loadData} className="p-4 bg-slate-800 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all">
          <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-bounce bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
            <div className="inline-block animate-bounce bg-yellow-500 w-3 h-3 rounded-full mr-2 [animation-delay:0.2s]"></div>
            <div className="inline-block animate-bounce bg-yellow-500 w-3 h-3 rounded-full [animation-delay:0.4s]"></div>
            <p className="mt-4 text-xs font-bold text-slate-600 tracking-[0.3em]">READING BLOCKCHAIN</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No Contracts Found</p>
          </div>
        ) : (
          contracts.map((addr, i) => (
            <AddressRow key={addr} addr={addr} index={contracts.length - i} />
          ))
        )}
      </div>
    </div>
  );
}