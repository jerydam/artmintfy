export const NETWORKS = {
  celo: {
    chainId: '0xa4ec',
    chainName: 'Celo',
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://celoscan.io/'],
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  },
  base: {
    chainId: '0x2105',
    chainName: 'Base',
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org/'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  arbitrum: {
    chainId: '0xa4b1',
    chainName: 'Arbitrum',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  polygon: {
    chainId: '0x89',
    chainName: 'Polygon',
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  avalanche: {
    chainId: '0xa86a',
    chainName: 'Avalanche',
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  bnb: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  optimism: {
    chainId: '0xa',
    chainName: 'Optimism',
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  lisk: {
    chainId: '0x46f',
    chainName: 'Lisk',
    rpcUrls: ['https://rpc.api.lisk.com'],
    blockExplorerUrls: ['https://blockscout.lisk.com/'],
    nativeCurrency: { name: 'LSK', symbol: 'LSK', decimals: 18 },
  }
};