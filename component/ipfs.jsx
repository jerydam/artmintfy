'use client';
import { useState } from 'react';
import { Upload as UploadIcon, Loader2, Image as ImageIcon, Check } from 'lucide-react';

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState('');
  const apikey = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apikey.trim()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const newCid = data.IpfsHash;
        setCid(newCid);
        // Important: Pass the URI back to the Mint page
        onUploadSuccess(newCid); 
      }
    } catch (e) {
      alert("IPFS Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${cid ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-black/40'}`}>
        <input type="file" id="art-file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        
        {!file ? (
          <label htmlFor="art-file" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="p-4 bg-white/5 rounded-full"><ImageIcon className="text-slate-400" /></div>
            <span className="text-sm font-medium text-slate-400">Select NFT Media</span>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {cid ? <Check className="text-green-500 w-10 h-10" /> : <UploadIcon className="text-yellow-500 w-10 h-10" />}
            <span className="text-xs font-mono text-slate-300 truncate max-w-[200px]">{file.name}</span>
            {!cid && (
              <button 
                onClick={handleUpload} 
                disabled={loading}
                className="mt-2 text-xs bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400"
              >
                {loading ? <Loader2 className="animate-spin h-3 w-3" /> : "Start Upload"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}