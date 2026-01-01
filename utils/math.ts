
/**
 * Generates synthetic technical analysis data with volume delta and orderbook imbalance
 */
export const generateTechnicalData = (price: number): any => {
  const rsi = 30 + Math.random() * 40;
  const ema20 = price * (1 + (Math.random() - 0.5) * 0.02);
  const ema50 = price * (1 + (Math.random() - 0.5) * 0.05);
  
  // Simulated Volume Delta (Buy Vol - Sell Vol)
  const volDelta = (Math.random() - 0.45) * 1000000; // Slanted towards buy side
  const obImbalance = (Math.random() - 0.4) * 0.5; // Orderbook imbalance (-0.5 to 0.5)
  
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
    oracleVerified: Math.random() > 0.1 // 90% chance to be oracle verified
  };
};

/**
 * Generates synthetic mempool data for gas heatmap visualization
 */
export const generateMempoolData = (baseGas: number): any[] => {
  const txs = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    const isSandwich = i > 40; // Simulate a sandwich attack cluster
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
 * Generates topographical liquidity data (Uniswap V3 style)
 */
export const generateTopographyData = (midPrice: number): any[] => {
  const ticks = [];
  for (let i = -20; i < 20; i++) {
    const price = midPrice * (1 + (i * 0.001));
    const isPeak = Math.abs(i) === 5 || Math.abs(i) === 15;
    ticks.push({
      price,
      depth: isPeak ? 80 + Math.random() * 20 : 10 + Math.random() * 30,
      isPeak
    });
  }
  return ticks;
};

/**
 * Generates wallet interaction graph data with enhanced node info
 */
export const generateWalletGraph = () => {
  const nodes = [{ id: 'Funder', group: 1, val: 50, type: 'CORE' }];
  const links = [];
  for (let i = 0; i < 12; i++) {
    const isSuspicious = i < 4; // Increased sniper count for "math bot" identification
    nodes.push({ id: `Wallet-${i}`, group: 2, val: 10, type: isSuspicious ? 'SNIPER' : 'RETAIL' });
    links.push({ source: 'Funder', target: `Wallet-${i}` });
  }
  return { nodes, links };
};

/**
 * Generates sparkline data for market cap and volume
 */
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
