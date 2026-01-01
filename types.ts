
export enum ViewState {
  MEMPOOL = 'MEMPOOL',
  TOPOGRAPHY = 'TOPOGRAPHY',
  GRAPH = 'GRAPH',
  TECHNICAL = 'TECHNICAL'
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
}

export interface Technicals {
  rsi: number;
  ema20: number;
  ema50: number;
  volatility: number;
  marketStructure: 'BULLISH' | 'BEARISH' | 'RANGING';
  oracleVerified: boolean;
}

export interface MempoolTx {
  id: string;
  gasPrice: number;
  value: number;
  time: number;
  type: 'transfer' | 'swap' | 'contract';
  isMEV?: boolean;
}

export interface LiquidityTick {
  price: number;
  depth: number;
  isPeak: boolean;
}

export interface GraphNode {
  id: string;
  group: number;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}
