'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import Upload from '@/component/ipfs';
import { Rocket, ShieldCheck, Loader2 } from 'lucide-react';

export default function FactoryMint() {
  const [form, setForm] = useState({ name: '', symbol: '' });
  const [uri, setUri] = useState(''); // CID from IPFS
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    if (!uri || !form.name || !form.symbol) return alert("Please complete all steps");
    
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // ABI for your Factory Contract
      const factory = new ethers.Contract(
        "0x3B89f439D32936A8dcB22aD8971ecd0FcAE5834d", 
        ["function deployNFT(string _name, string _symbol, string _uri) public returns (address)"], 
        signer
      );

      // We pass the URI (CID) directly here!
      const tx = await factory.deployNFT(form.name, form.symbol, uri);
      await tx.wait();
      
      alert("Success! Your NFT has its own Contract Address now.");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Rocket className="text-yellow-500" /> FACTORY MINT
        </h1>

        <div className="space-y-6">
          {/* Step 1: Upload and get URI */}
          <Upload onUploadSuccess={(cid) => setUri(cid)} />

          {/* Step 2: Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Name" 
              className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input 
              placeholder="Symbol" 
              className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={e => setForm({...form, symbol: e.target.value})}
            />
          </div>

          {/* Step 3: Deploy */}
          <button 
            onClick={handleDeploy}
            disabled={loading || !uri}
            className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black text-lg rounded-2xl disabled:opacity-20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            {loading ? "Deploying CA..." : "Deploy Contract & Mint"}
          </button>
        </div>
      </div>
    </div>
  );
}