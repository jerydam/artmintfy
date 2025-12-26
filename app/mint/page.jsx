'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import Upload from '@/component/ipfs';
import { NETWORKS } from '@/lib/networks';
import { Rocket, ShieldCheck, Loader2, Layers, CheckCircle, Globe } from 'lucide-react';

export default function MultiChainMint() {
  const [form, setForm] = useState({ name: '', symbol: '' });
  const [uri, setUri] = useState('');
  const [selectedChains, setSelectedChains] = useState(['celo']);
  const [deploymentStatus, setStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleChain = (key) => {
    setSelectedChains(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleMultiDeploy = async () => {
    if (!uri || !form.name || !form.symbol) return alert("Fill all fields");
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const ownerAddress = await signer.getAddress();
      const salt = ethers.utils.keccak256(ownerAddress);

      for (const chainKey of selectedChains) {
        try {
          // Network switching logic...
          const activeProvider = new ethers.providers.Web3Provider(window.ethereum);
          const factory = new ethers.Contract(
            "0xd4be7508211967E45538F23D304E8B8789A1C62d", 
            ["function deployDeterministic(string _name, string _symbol, string _uri, bytes32 salt) public returns (address)"], 
            activeProvider.getSigner()
          );

          const tx = await factory.deployDeterministic(form.name, form.symbol, uri, salt);
          await tx.wait();
          setStatus(prev => ({ ...prev, [chainKey]: 'success' }));
        } catch (e) { break; }
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-16 px-4">
      <div className="bg-slate-900 border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-12">
        <h1 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-3">
          <Layers className="text-yellow-500" /> OMNI-DEPLOY
        </h1>

        <div className="space-y-6">
          <Upload onUploadSuccess={(cid) => setUri(cid)} />

          <div className="flex flex-col md:flex-row gap-4">
            <input placeholder="NFT Name" className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-yellow-500" onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Symbol" className="md:w-32 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-yellow-500 uppercase" onChange={e => setForm({...form, symbol: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.keys(NETWORKS).map((key) => (
              <button
                key={key}
                onClick={() => toggleChain(key)}
                className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center justify-between ${
                  selectedChains.includes(key) ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/5 bg-black/20 text-slate-500'
                }`}
              >
                {key} {deploymentStatus[key] === 'success' && <CheckCircle size={12} className="text-green-500" />}
              </button>
            ))}
          </div>

          <button onClick={handleMultiDeploy} disabled={loading || !uri} className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
            {loading ? "Processing..." : "Deploy Omni-Chain"}
          </button>
        </div>
      </div>
    </div>
  );
}