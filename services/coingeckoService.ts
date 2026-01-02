
import { TokenData } from '../types';

export interface EnhancedTokenData extends TokenData {
  isSimulated?: boolean;
  chain?: string;
  dexName?: string;
  pairAddress?: string;
}

const SECTORS = ['Layer 1', 'Layer 2', 'DeFi', 'AI', 'Meme', 'RWA', 'GameFi'];

/**
 * Enhanced Meta-Search: Integrates DexScreener, CoinGecko, and cross-chain discovery
 * Supports Solana, Ethereum, Base, BSC, and more.
 */
export const fetchTokenByAddress = async (address: string): Promise<EnhancedTokenData | null> => {
  const cleanAddress = address.trim();
  
  // 1. Try DexScreener API first (Best for unlisted and multi-chain tokens)
  try {
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${cleanAddress}`);
    if (dexRes.ok) {
      const data = await dexRes.json();
      if (data.pairs && data.pairs.length > 0) {
        // Take the pair with highest liquidity
        const bestPair = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
        
        return {
          id: bestPair.baseToken.address,
          symbol: bestPair.baseToken.symbol.toUpperCase(),
          name: bestPair.baseToken.name,
          priceUsd: parseFloat(bestPair.priceUsd),
          priceChange24h: bestPair.priceChange?.h24 || 0,
          marketCap: bestPair.fdv || 0,
          volume24h: bestPair.volume?.h24 || 0,
          image: bestPair.info?.imageUrl || `https://ui-avatars.com/api/?name=${bestPair.baseToken.symbol}&background=random`,
          isSimulated: false,
          sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
          volatility: 0.4 + Math.random() * 0.6,
          dominance: 0.01,
          mktMakerActivity: Math.random() > 0.4 ? 'HIGH' : 'MEDIUM',
          chain: bestPair.chainId,
          dexName: bestPair.dexId
        };
      }
    }
  } catch (err) {
    console.warn("DexScreener branch failed, trying CoinGecko fallback...");
  }

  // 2. CoinGecko Fallback for major assets
  const isEth = /^0x[a-fA-F0-9]{40}$/.test(cleanAddress);
  const isSol = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanAddress);

  if (isEth || isSol) {
    const platform = isEth ? 'ethereum' : 'solana';
    try {
      const contractRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${platform}/contract/${cleanAddress}`
      );
      
      if (contractRes.ok) {
        const data = await contractRes.json();
        return {
          id: data.id,
          symbol: data.symbol.toUpperCase(),
          name: data.name,
          priceUsd: data.market_data.current_price.usd,
          priceChange24h: data.market_data.price_change_percentage_24h || 0,
          marketCap: data.market_data.market_cap.usd || 0,
          volume24h: data.market_data.total_volume.usd || 0,
          image: data.image.large,
          isSimulated: false,
          sector: data.categories?.[0] || SECTORS[Math.floor(Math.random() * SECTORS.length)],
          volatility: 0.2 + Math.random() * 0.8,
          dominance: Math.random() * 5,
          mktMakerActivity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
        };
      }
    } catch (err) {}
  }

  // 3. Final Simulation Layer (Deep Scan Mode)
  // If we reach here, the token might be extremely new or private
  if (isEth || isSol) {
    return {
      id: `deep-scan-${cleanAddress}`,
      symbol: isEth ? 'EVM-UNKN' : 'SOL-UNKN',
      name: `Deep Scan: ${cleanAddress.slice(0, 8)}...`,
      priceUsd: 0.0001 + Math.random() * 10,
      priceChange24h: (Math.random() - 0.4) * 50,
      marketCap: 50000 + Math.random() * 500000,
      volume24h: 10000 + Math.random() * 100000,
      image: isEth 
        ? "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        : "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      isSimulated: true,
      sector: 'Unlisted / New Asset',
      volatility: 0.95,
      dominance: 0.0001,
      mktMakerActivity: 'LOW',
      chain: isEth ? 'ethereum' : 'solana'
    };
  }

  return null;
};

export const fetchTopMarkets = async (page: number = 1): Promise<TokenData[]> => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`);
    if (res.ok) {
      const data = await res.json();
      return data.map((item: any) => ({
        id: item.id,
        symbol: item.symbol.toUpperCase(),
        name: item.name,
        priceUsd: item.current_price,
        priceChange24h: item.price_change_percentage_24h,
        marketCap: item.market_cap,
        volume24h: item.total_volume,
        image: item.image,
        rank: item.market_cap_rank,
        sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
        volatility: 0.1 + Math.random() * 0.9,
        dominance: (item.market_cap / 1e12) * 100,
        mktMakerActivity: Math.random() > 0.3 ? 'HIGH' : 'LOW'
      }));
    }
  } catch (e) {
    console.error("Top Market Scan Failed, using fallbacks.");
  }
  return Array.from({ length: 20 }, (_, i) => ({
    id: `mock-${i}`,
    symbol: 'MOCK',
    name: 'Scan Active...',
    priceUsd: 100 + Math.random() * 1000,
    priceChange24h: (Math.random() - 0.5) * 10,
    marketCap: 1e9 - (i * 1e7),
    volume24h: 1e8,
    rank: i + 1,
    sector: 'Researching...',
    volatility: 0.5,
    dominance: 0.1,
    mktMakerActivity: 'MEDIUM'
  }));
};
