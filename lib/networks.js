export const NETWORKS = {
  botchain: {                          // lowercase key
    chainId: '0x2A5', //0x2A5
    chainName: 'Botchain',
    rpcUrls: ['https://rpc.botchain.ai'],
    blockExplorerUrls: ['https://scan.botchain.ai/'],
    nativeCurrency: { name: 'Botchain', symbol: 'BOT', decimals: 18 },
  },
};

export const DEFAULT_CHAIN = NETWORKS.botchain;  // now resolves correctly