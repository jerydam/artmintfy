export const NETWORKS = {
 
  Botchain: {
    chainId: "0x3C8",
    chainName: 'Botchain',
    rpcUrls: ['https://rpc.bohr.life'],
    blockExplorerUrls: ['https://scan.bohr.life/'],
    nativeCurrency: { name: 'bitchain', symbol: 'BOT', decimals: 18 },
  },
  
};
export const DEFAULT_CHAIN = NETWORKS.botchain;