'use client'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Upload from '@/component/ipfs';

const contractABI = [
  {
    "name": "safeMint",
    "inputs": [
      {"type": "address", "name": "to", "internalType": "address"},
      {"type": "string", "name": "uri", "internalType": "string"},
      {"type": "string", "name": "name", "internalType": "string"},
      {"type": "string", "name": "symbol", "internalType": "string"}
    ],
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": []
  }
];

const contractAddress = '0xEE672b0daCe1149Edfb775C49e7B16a5aEbE44d8'; // Replace with your contract address

export default function Mint() {
  const [toAddress, setToAddress] = useState('');
  const [uri, setURI] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    const storedURI = localStorage.getItem("uri");
    if (storedURI) {
      setURI(storedURI);
    }
  }, []);

  // ...

const mintNFT = async () => {
  try {
    // Check if window.ethereum is available (MetaMask is installed)
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Ethereum wallet extension.');
    }

    // Connect to the Ethereum network via MetaMask
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
    // Create a provider connected to the Ethereum network
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.safeMint(toAddress, uri, name, symbol);
    await tx.wait();

    alert('NFT Minted Successfully!');
  } catch (error) {
    console.error('Error minting NFT:', error.message);
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-8 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">NFT Minting Page</h2>

      <form className="space-y-4 text-gray-800">
        <div>
          <label htmlFor="toAddress" className="block text-sm font-medium text-gray-600">Recipient Address</label>
          <input type="text" id="toAddress" name="toAddress" value={toAddress} onChange={(e) => setToAddress(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <Upload />
        <div>
          <label htmlFor="uri" className="block text-sm font-medium text-gray-600">URI</label>
          <input type="text" id="uri" name="uri" value={uri} onChange={(e) => setURI(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
        </div>

        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-600">Symbol</label>
          <input type="text" id="symbol" name="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
        </div>

        <button type="button" onClick={mintNFT} className="bg-blue-500 text-white p-2 rounded-md">Mint NFT</button>
      </form>
    </div>
  );
}
