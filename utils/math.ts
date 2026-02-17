
/**
 * Generates synthetic technical analysis data with volume delta and orderbook imbalance
 */
export const generateTechnicalData = (price: number): any => {
  const rsi = 30 + Math.random() * 40;
  const ema20 = price * (1 + (Math.random() - 0.5) * 0.02);
  const ema50 = price * (1 + (Math.random() - 0.5) * 0.05);
  
  const volDelta = (Math.random() - 0.45) * 1000000; 
  const obImbalance = (Math.random() - 0.4) * 0.5; 
  
  const structures: ('BULLISH' | 'BEARISH' | 'RANGING')[] = ['BULLISH', 'BEARISH', 'RANGING'];
  const marketStructure = structures[Math.floor(Math.random() * structures.length)];

  return {
    rsi,
    ema20,
    ema50,
    volatility: 0.05 + Math.random() * 0.15,
    marketStructure,
    volDelta,
    obImbalance,
    oracleVerified: Math.random() > 0.1 
  };
};

export const generateMempoolData = (baseGas: number): any[] => {
  const txs = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    const isSandwich = i > 40;
    txs.push({
      id: `tx-${i}`,
      gasPrice: baseGas + (isSandwich ? 50 + Math.random() * 20 : Math.random() * 30),
      value: Math.random() * 5,
      time: now - (i * 100),
      type: isSandwich ? 'swap' : 'transfer',
      isMEV: isSandwich
    });
  }
  return txs;
};

/**
 * Generates token-specific global market topology with Arkham-style Entity Tagging
 */
export const generateWalletGraph = (symbol: string = 'ETH', mode: 'INSTITUTIONAL' | 'RETAIL' = 'INSTITUTIONAL') => {
  const isInst = mode === 'INSTITUTIONAL';
  
  const nodes = [
    // THE NQ SWAP INSTITUTIONAL HUB
    { id: `NQ-SWAP-SOR`, group: 5, val: 120, type: 'CORE', label: 'NQ Swap: Smart Order Router' },

    // INSTITUTIONAL MARKET MAKERS (Wintermute / Jump)
    { id: `WINTERMUTE-MM`, group: 4, val: 90, type: 'CORE', label: 'Wintermute: Market Maker', noteType: 'Institutional LP' },
    { id: `JUMP-CRYPTO`, group: 4, val: 85, type: 'CORE', label: 'Jump Crypto: High Frequency', noteType: 'Institutional MM' },

    // CEX HUBS
    { id: `Binance-${symbol}`, group: 3, val: 65, type: 'CORE', label: 'Binance (Arkham Tagged)' },
    { id: `Coinbase-${symbol}`, group: 3, val: 60, type: 'CORE', label: 'Coinbase (Arkham Tagged)' },
    
    // DEX HUBS
    { id: `Uniswap-V3-${symbol}`, group: 1, val: 70, type: 'CORE', label: `UniV3 Pool` },
  ];
  
  const links = [];

  // Routing flows
  const venues = [`Binance-${symbol}`, `Coinbase-${symbol}`, `Uniswap-V3-${symbol}`];
  venues.forEach(venue => {
    links.push({ source: `NQ-SWAP-SOR`, target: venue, flowValue: 1500, isRouting: true });
  });

  // Wintermute Aggregation
  links.push({ source: `WINTERMUTE-MM`, target: `Binance-${symbol}`, flowValue: 2000, isRouting: true });
  links.push({ source: `WINTERMUTE-MM`, target: `NQ-SWAP-SOR`, flowValue: 2500, isProtected: true });

  // Wallet population
  const walletCount = isInst ? 10 : 20;
  for (let i = 0; i < walletCount; i++) {
    const isWhale = isInst && Math.random() > 0.7;
    const type = isWhale ? 'SNIPER' : 'RETAIL';
    const val = isWhale ? 40 + Math.random() * 20 : 10 + Math.random() * 5;
    const id = `Wallet-${symbol}-${i}`;
    
    nodes.push({ 
        id, 
        group: 2, 
        val, 
        type, 
        label: isWhale ? `Arkham Whale ${i}` : `Private Wallet ${i}`,
        noteType: isWhale ? 'Smart Money' : 'Retail'
    });
    
    links.push({ source: id, target: `NQ-SWAP-SOR`, flowValue: val, isProtected: true });
  }

  return { nodes, links };
};

export const generateMetricChartData = (base: number, points: number = 20) => {
  const data = [];
  let current = base;
  for (let i = 0; i < points; i++) {
    current = current * (1 + (Math.random() - 0.48) * 0.05);
    data.push(current);
  }
  return data;
};

export const calculateGAF = (data: number[]): number[][] => {
  const n = data.length;
  if (n === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const scaled = data.map(x => (2 * (x - min) / range) - 1);
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      const xi = Math.max(-1, Math.min(1, scaled[i]));
      const xj = Math.max(-1, Math.min(1, scaled[j]));
      const val = xi * xj - Math.sqrt(1 - xi ** 2) * Math.sqrt(1 - xj ** 2);
      matrix[i][j] = val;
    }
  }
  return matrix;
};

export const calculateMTF = (data: number[]): number[][] => {
  const n = data.length;
  if (n === 0) return [];
  const numBins = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const bins = data.map(x => {
    const b = Math.floor(((x - min) / range) * numBins);
    return Math.min(b, numBins - 1);
  });
  const transitionMatrix = Array.from({ length: numBins }, () => new Array(numBins).fill(0));
  for (let i = 0; i < n - 1; i++) {
    transitionMatrix[bins[i]][bins[i + 1]]++;
  }
  for (let i = 0; i < numBins; i++) {
    const sum = transitionMatrix[i].reduce((a, b) => a + b, 0);
    if (sum > 0) {
      for (let j = 0; j < numBins; j++) {
        transitionMatrix[i][j] /= sum;
      }
    }
  }
  const mtf: number[][] = [];
  for (let i = 0; i < n; i++) {
    mtf[i] = [];
    for (let j = 0; j < n; j++) {
      mtf[i][j] = transitionMatrix[bins[i]][bins[j]];
    }
  }
  return mtf;
};
