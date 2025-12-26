'use client';

import { useState } from 'react';
import { Upload as UploadIcon, Loader2, Image as ImageIcon, Check } from 'lucide-react';

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState('');
  const apikey = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY?.trim();

  const handleUpload = async () => {
    if (!file || !apikey) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apikey}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const newCid = data.IpfsHash;
        setCid(newCid);
        onUploadSuccess(newCid);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (e) {
      alert("IPFS Upload Failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${cid ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-black/40'}`}>
        <input
          type="file"
          id="art-file"
          className="hidden"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {!file ? (
          <label htmlFor="art-file" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="p-6 bg-white/5 rounded-full">
              <ImageIcon className="text-slate-400" size={36} />
            </div>
            <span className="text-sm font-medium text-slate-400">Select NFT Media</span>
            <span className="text-xs text-slate-500">PNG, JPG, GIF, SVG • Max 50MB</span>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${cid ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
              {cid ? <Check className="text-green-500 w-12 h-12" /> : <UploadIcon className="text-yellow-500 w-12 h-12" />}
            </div>
            <span className="text-sm font-mono text-slate-300 truncate max-w-[250px]">{file.name}</span>
            {!cid && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-2 text-sm bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Upload to IPFS"}
              </button>
            )}
            {cid && <p className="text-xs text-green-400 font-mono">uploaded to IPFS</p>}
          </div>
        )}
      </div>
    </div>
  );
}