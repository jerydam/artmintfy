export const NETWORKS = {
  botchain: {                          // lowercase key
    chainId: '0x3C8',
    chainName: 'Botchain',
    rpcUrls: ['https://rpc.bohr.life'],
    blockExplorerUrls: ['https://scan.bohr.life/'],
    nativeCurrency: { name: 'Botchain', symbol: 'BOT', decimals: 18 },
  },
};

export const DEFAULT_CHAIN = NETWORKS.botchain;  // now resolves correctly