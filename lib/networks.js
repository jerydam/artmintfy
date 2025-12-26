export const NETWORKS = {
  celo: {
    chainId: '0xa4ec', // 42220
    chainName: 'Celo Mainnet',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://celoscan.io/'],
  },
  alfajores: {
    chainId: '0xef3d', // 61165
    chainName: 'Celo Alfajores',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    blockExplorerUrls: ['https://alfajores.celoscan.io/'],
  },
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_KEY'],
    blockExplorerUrls: ['https://etherscan.io/'],
  }
};

export const DEFAULT_CHAIN = NETWORKS.celo;