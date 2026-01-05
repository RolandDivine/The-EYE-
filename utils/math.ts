
/**
 * Generates path results for a Monte Carlo simulation
 */
export const generateMonteCarloPaths = (currentPrice: number, volatility: number, steps: number = 60) => {
  const paths = [];
  const dt = 1 / steps;
  let bullCount = 0;
  
  // Use price and volatility as a seed for more specific results
  const assetSeed = (currentPrice * 1000) % 1000;
  
  for (let i = 0; i < 80; i++) { // More visual paths
    const path = [currentPrice];
    let price = currentPrice;
    
    // Vary the drift and standard deviation based on volatility
    // Assets with high volatility will have much wilder paths
    const drift = (Math.random() - 0.45) * 0.2; 
    
    for (let j = 0; j < steps; j++) {
      const z = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 1; // Approx normal
      const priceChange = price * (drift * dt + volatility * z * Math.sqrt(dt));
      price += priceChange;
      path.push(Math.max(price, currentPrice * 0.05)); // Floor at 5% of start
    }
    paths.push(path);
    if (path[path.length - 1] > currentPrice) {
      bullCount++;
    }
  }

  const bullRatio = bullCount / paths.length;
  const bearRatio = 1 - bullRatio;

  return { paths, bullRatio, bearRatio };
};

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
    volatility: 0.15 + Math.random() * 0.85, // Higher baseline volatility
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

export const generateWalletGraph = (symbol: string = 'ETH', mode: 'INSTITUTIONAL' | 'RETAIL' = 'INSTITUTIONAL') => {
  const isInst = mode === 'INSTITUTIONAL';

  interface WalletNodeData {
    id: string;
    group: number;
    val: number;
    type: string;
    label: string;
    behaviorNote?: string;
  }

  interface WalletLinkData {
    source: string;
    target: string;
    flowValue: number;
    isRouting?: boolean;
    isProtected?: boolean;
  }

  const nodes: WalletNodeData[] = [
    { id: `HUB-CORE`, group: 5, val: 140, type: 'CORE', label: isInst ? 'Retail Sentiment Hub' : 'Institutional Shadow Node' },
    { id: `MM-1`, group: 4, val: 80, type: 'CORE', label: isInst ? 'Phantom/MetaMask Flow' : 'Market Maker Alpha' },
    { id: `MM-2`, group: 4, val: 75, type: 'CORE', label: isInst ? 'DEX Aggregator Flow' : 'Smart Money Cluster' },
  ];
  
  const links: WalletLinkData[] = [];
  nodes.forEach(n => links.push({ source: n.id, target: `HUB-CORE`, flowValue: 1000, isRouting: true }));

  const count = isInst ? 40 : 25; // More nodes for institutional retail scanning
  for (let i = 0; i < count; i++) {
    const id = `Node-${i}`;
    nodes.push({ 
      id, 
      group: 2, 
      val: 10 + Math.random() * 30, 
      type: isInst ? 'RETAIL' : 'INST', 
      label: isInst ? `Retail Wallet ${i}` : `Inst Liquidator ${i}`,
      behaviorNote: isInst ? 'Panic-buy signal detected.' : 'Accumulation proxy detected.'
    });
    links.push({ source: id, target: `HUB-CORE`, flowValue: 10, isProtected: !isInst });
  }

  return { nodes, links };
};

/**
 * Calculates Gramian Angular Field (GAF) matrix
 */
export const calculateGAF = (data: number[]): number[][] => {
  const n = data.length;
  if (n === 0) return [];
  
  // Rescale to [-1, 1]
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const normalized = data.map(x => (2 * (x - min) / range) - 1);
  
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      // GASF: cos(phi_i + phi_j) = x_i * x_j - sqrt(1 - x_i^2) * sqrt(1 - x_j^2)
      const xi = normalized[i];
      const xj = normalized[j];
      const val = xi * xj - Math.sqrt(Math.max(0, 1 - xi * xi)) * Math.sqrt(Math.max(0, 1 - xj * xj));
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
};

/**
 * Calculates Markov Transition Field (MTF) matrix
 */
export const calculateMTF = (data: number[]): number[][] => {
  const n = data.length;
  if (n === 0) return [];
  
  // Discretize into bins
  const q = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  
  const bins = data.map(x => Math.min(q - 1, Math.floor(((x - min) / range) * q)));
  
  // Transition matrix
  const W = Array.from({ length: q }, () => new Array(q).fill(0));
  for (let i = 0; i < n - 1; i++) {
    W[bins[i]][bins[i + 1]]++;
  }
  
  // Normalize transition matrix
  for (let i = 0; i < q; i++) {
    const rowSum = W[i].reduce((a, b) => a + b, 0) || 1;
    for (let j = 0; j < q; j++) {
      W[i][j] /= rowSum;
    }
  }
  
  // Build MTF matrix
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(W[bins[i]][bins[j]]);
    }
    matrix.push(row);
  }
  return matrix;
};
