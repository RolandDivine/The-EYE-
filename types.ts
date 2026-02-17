
export enum ViewState {
  MEMPOOL = 'MEMPOOL',
  TOPOGRAPHY = 'TOPOGRAPHY',
  GRAPH = 'GRAPH',
  TECHNICAL = 'TECHNICAL',
  MARKET_SURFACE = 'MARKET_SURFACE'
}

export enum UserMode {
  INSTITUTIONAL = 'INSTITUTIONAL',
  RETAIL = 'RETAIL'
}

export enum Language {
  EN = 'EN',
  ZH = 'ZH',
  RU = 'RU'
}

export type ExecutionVenue = 'NQ_SWAP' | 'ASTER_DEX' | 'BINANCE' | 'BYBIT' | 'UNISWAP_V4';

export interface IntelligenceMetric {
  label: string;
  value: string | number;
  change?: number;
  source: 'MESSARI' | 'ARKHAM' | 'WINTERMUTE';
}

export interface EntityTransfer {
  id: string;
  from: string;
  to: string;
  amount: number;
  symbol: string;
  time: string;
  entity: string;
  type?: string;
  hash?: string;
  gas?: string;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; // For retail alpha
}

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image?: string;
  rank?: number;
  // Intelligence Additions
  sector?: string;
  volatility?: number;
  dominance?: number;
  mktMakerActivity?: 'HIGH' | 'MEDIUM' | 'LOW';
  isContract?: boolean; // True if loaded via raw contract address
}
