
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

export interface SocialMetrics {
  sentimentScore: number; // 0-100
  mentions24h: number;
  viralVelocity: number; // 0-10
  topPlatforms: string[];
  trendingStatus: 'EXPLODING' | 'STABLE' | 'COOLING';
}

export interface MacroEvent {
  id: string;
  source: string;
  headline: string;
  impactScore: number; // -10 to 10
  historicalPrecedent: string;
  translation: string;
  timestamp: number;
}

export interface MarketMakerOrder {
  id: string;
  mm: 'WINTERMUTE' | 'ACUMEN' | 'GSR' | 'JUMP';
  pair: string;
  side: 'BUY' | 'SELL';
  size: number;
  intensity: number;
}

export interface InstitutionalAnalytics {
  mevRank: number;
  mevOpportunities: ArbOpportunity[];
  poolExpansionScore: number;
  poolSuggestions: PoolSuggestion[];
  exploitProbability: number;
  vulnerabilityReport: string;
  mmFlow: MarketMakerOrder[];
  macroOutlook: {
    bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    reasoning: string;
    cpiImpact: string;
    events: MacroEvent[];
  };
}

export interface SecurityAudit {
  isLiquidityLocked: boolean;
  lockDuration?: string;
  rugProbability: 'LOW' | 'MEDIUM' | 'HIGH';
  honeypotCheck: 'PASSED' | 'FAILED';
  topHoldersPercent: number;
  mintAuthorityRevoked: boolean;
  creator?: {
    address: string;
    associatedAccounts: number;
    pastProjectsCount: number;
    trustIndex: 'ELITE' | 'STABLE' | 'DEGEN' | 'DANGER';
  };
}

export interface ArbOpportunity {
  venue: string;
  spread: number;
  liquidity: number;
  status: 'ACTIVE' | 'SIGNAL_LOST';
}

export interface PoolSuggestion {
  dex: string;
  range: string;
  suggestedAmount: number;
  projectedApr: number;
}

export interface TrackedAsset extends TokenData {
  discoveryPrice: number;
  discoveryTimestamp: number;
  currentROI: number;
  chain?: string;
  security?: SecurityAudit;
  instAnalytics?: InstitutionalAnalytics;
  socialMetrics?: SocialMetrics;
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
  sector?: string;
  volatility?: number;
  dominance?: number;
  mktMakerActivity?: 'HIGH' | 'MEDIUM' | 'LOW';
}
