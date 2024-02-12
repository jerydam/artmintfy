'use client'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const contractABI = [
  {
    "name": "getAllMintedSuccessfully",
    "inputs": [],
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "address", "name": "", "internalType": "address[]"}]
  }
];

const contractAddress = '0xEE672b0daCe1149Edfb775C49e7B16a5aEbE44d8'; // Replace with your contract address

export default function AddressList() {
  const [mintedAddresses, setMintedAddresses] = useState([]);

  useEffect(() => {
    const fetchMintedAddresses = async () => {
      try {
        // Get the provider from the browser window
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Connect to the contract using the provider
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Call the getAllMintedSuccessfully function
        const addresses = await contract.getAllMintedSuccessfully();

        // Ensure addresses is an array before updating state
        if (Array.isArray(addresses)) {
          setMintedAddresses(addresses);
        } else {
          console.error('Invalid response format:', addresses);
        }
      } catch (error) {
        console.error('Error fetching minted addresses:', error.message);
      }
    };

    fetchMintedAddresses();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="max-w-md mx-auto text-gray-700 bg-white p-8 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Minted Addresses</h2>

      {mintedAddresses.length > 0 ? (
        <ul>
          {mintedAddresses.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
      ) : (
        <p>No addresses have been minted successfully.</p>
      )}
    </div>
  );
}
