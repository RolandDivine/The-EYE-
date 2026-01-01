
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, Zap, Globe, Search, Cpu, RefreshCw, Target, 
  AlertCircle, TrendingUp, Map as MapIcon, Share2, Box, BarChart3, 
  Waves, Filter, Wallet, ArrowUpRight, ArrowDownRight, Menu, X, Rocket,
  Link as LinkIcon, Gauge, Layers, Info, ShieldCheck, EyeOff, WifiOff, Wifi, 
  ShoppingCart, Shield, ChevronRight, Binary
} from 'lucide-react';
import { ViewState, TokenData, Technicals } from './types';
import { generateMempoolData, generateTopographyData, generateWalletGraph, generateMetricChartData, generateTechnicalData } from './utils/math';
import { getMEVAnalysis } from './services/geminiService';
import { fetchTokenByAddress, EnhancedTokenData } from './services/coingeckoService';
import ProfitSimulator from './components/ProfitSimulator';
import RetinaDisplay from './components/RetinaDisplay';
import WalletGraph from './components/WalletGraph';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.MEMPOOL);
  const [strategy, setStrategy] = useState<'SCALP' | 'SWING' | 'AGGRESSIVE'>('SCALP');
  const [mempool, setMempool] = useState<any[]>([]);
  const [topoData, setTopoData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [techData, setTechData] = useState<any>(null);
  const [mcChart, setMcChart] = useState<number[]>([]);
  const [volChart, setVolChart] = useState<number[]>([]);
  const [currentToken, setCurrentToken] = useState<EnhancedTokenData | null>(null);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [tradingCapital, setTradingCapital] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const updateCounter = useRef(0);

  /**
   * HIGH-PRECISION PRICE FORMATTER
   * - 10 decimal places for prices < 1
   * - 2-3 decimal places for prices >= 1
   */
  const formatPrice = (price: number) => {
    if (price === 0) return "0.0000";
    if (price < 1) {
      return price.toFixed(10);
    }
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 3 
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const baseGas = 30 + Math.random() * 20;
      setMempool(generateMempoolData(baseGas));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeAddress || !currentToken) return;

    const syncMarketData = async () => {
      const updatedData = await fetchTokenByAddress(activeAddress);
      if (updatedData) {
        setCurrentToken(updatedData);
        setTopoData(generateTopographyData(updatedData.priceUsd));
        if (!isAnalyzing) {
          setTechData(generateTechnicalData(updatedData.priceUsd));
        }

        updateCounter.current += 1;
        if (updateCounter.current >= 3) {
          setMcChart(prev => [...prev.slice(-19), updatedData.marketCap]);
          setVolChart(prev => [...prev.slice(-19), updatedData.volume24h]);
          updateCounter.current = 0;
        }
      }
    };

    const interval = setInterval(syncMarketData, 10000);
    return () => clearInterval(interval);
  }, [activeAddress, currentToken, isAnalyzing]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setError(null);
    
    try {
      const data = await fetchTokenByAddress(searchQuery);
      if (data) {
        setCurrentToken(data);
        setActiveAddress(searchQuery);
        setGraphData(generateWalletGraph());
        setTopoData(generateTopographyData(data.priceUsd));
        setTechData(generateTechnicalData(data.priceUsd));
        setMcChart(generateMetricChartData(data.marketCap));
        setVolChart(generateMetricChartData(data.volume24h));
        setReport(null);
        updateCounter.current = 0;
      } else {
        setError("Network Protocol mismatch. Input address integrity failure.");
      }
    } catch (err) {
      setError("Critical Link Interruption. Switching to local simulation.");
    } finally {
      setIsSearching(false);
    }
  };

  const runDeFiScan = async () => {
    if (!currentToken || !techData) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const visualContext = activeView === ViewState.MEMPOOL 
        ? `Retina Scan [${strategy}]: Detecting galactic mempool clusters for institutional intent.`
        : activeView === ViewState.TOPOGRAPHY
        ? "Topology Scan: Mapping liquidity bid/ask depth for structural imbalances."
        : activeView === ViewState.GRAPH
        ? "Graph Scan: Tracing sniper wallet clusters to primary MEV controllers."
        : `Technical Scan: Cross-referencing RSI ${techData?.rsi?.toFixed(2) || 'N/A'} with strategy constraints.`;

      const res = await getMEVAnalysis(visualContext, {
        mode: activeView,
        token: `${currentToken.name} (${currentToken.symbol})`,
        gas: 35,
        price: currentToken.priceUsd,
        marketCap: currentToken.marketCap,
        volume: currentToken.volume24h,
        strategy: strategy,
        technicals: techData
      });
      setReport(res);
    } catch (err) {
      setError("Fusion Core Interrupted. Signal lost due to high volatility.");
    }
    setIsAnalyzing(false);
  };

  /**
   * NQ SWAP INTEGRATION
   * Redirects to NQ Swap DEX with pre-filled contract address
   */
  const executeOnNQSwap = () => {
    if (!activeAddress) return;
    const url = `https://www.nq-swap.xyz/nq-swap?token=${activeAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d1d1d1] flex flex-col lg:flex-row font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* SIDEBAR NAVIGATION */}
      <nav className="w-full lg:w-20 lg:min-h-screen border-b lg:border-r border-white/5 flex lg:flex-col items-center justify-between lg:justify-start p-4 lg:py-10 gap-10 bg-[#080808] z-50">
        <div className="p-3 bg-red-600 rounded-2xl text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
          <ShieldAlert size={28} />
        </div>
        
        <div className="flex lg:flex-col gap-4 lg:gap-10">
          {[
            { id: ViewState.MEMPOOL, icon: Activity, label: 'Retina' },
            { id: ViewState.TOPOGRAPHY, icon: MapIcon, label: 'Topo' },
            { id: ViewState.GRAPH, icon: Share2, label: 'Graph' },
            { id: ViewState.TECHNICAL, icon: TrendingUp, label: 'Tech' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`group p-4 rounded-2xl transition-all duration-500 flex flex-col items-center gap-1 ${activeView === item.id ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] scale-110' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={24} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[7px] font-black uppercase lg:hidden mt-2 tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN COMMAND CENTER */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* COMMAND HEADER */}
        <header className="h-auto lg:h-24 border-b border-white/5 flex flex-col lg:flex-row items-center px-6 lg:px-10 py-4 lg:py-0 justify-between bg-[#080808] gap-6 relative">
          <div className="absolute bottom-0 left-0 h-[2px] bg-red-600/20 w-full overflow-hidden">
             <div className="h-full bg-red-600 w-24 animate-[slide_3s_infinite_linear]" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:w-auto">
            <form onSubmit={handleSearch} className="relative w-full lg:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Institutional Asset Discovery (Contract)..."
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-[13px] mono focus:border-red-600 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              />
              {isSearching && <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-spin" size={18} />}
            </form>
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 w-full lg:w-auto hover:border-red-600/30 transition-colors cursor-pointer group">
              <Filter size={18} className="text-gray-500 group-hover:text-red-500 transition-colors" />
              <select 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as any)}
                className="bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 outline-none w-full cursor-pointer appearance-none"
              >
                <option value="SCALP">Scalp Vector [ &lt;24h ]</option>
                <option value="SWING">Swing Momentum [ 48-72h ]</option>
                <option value="AGGRESSIVE">Degen Indigenous [ &lt;1h ]</option>
              </select>
            </div>
          </div>
          
          {currentToken && (
            <div className="flex items-center gap-6 bg-gradient-to-r from-red-600/10 to-transparent px-8 py-3 rounded-[24px] border border-red-600/20 w-full lg:w-auto animate-fade-in shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={currentToken.image} className="w-10 h-10 rounded-full border-2 border-white/10 shadow-xl" alt={currentToken.name} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">{currentToken.name}</span>
                   <div className="flex items-center gap-2">
                     {techData?.oracleVerified && (
                       <div className="flex items-center gap-1.5 text-blue-400 text-[8px] mono font-black bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                         <LinkIcon size={10}/> ORACLE_SYNC
                       </div>
                     )}
                     {currentToken.isSimulated && (
                       <div className="flex items-center gap-1.5 text-amber-400 text-[8px] mono font-black bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 animate-pulse">
                         <WifiOff size={10}/> SIMULATED_STREAM
                       </div>
                     )}
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-white">{currentToken.symbol}</span>
                  <span className="text-xl font-black text-green-400 mono tracking-tighter transition-all duration-1000">
                    ${formatPrice(currentToken.priceUsd)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* FUSION VIEWPORT */}
        <div className="flex-1 p-6 lg:p-10 grid grid-cols-12 gap-8 lg:gap-10 overflow-y-auto lg:overflow-hidden bg-[radial-gradient(circle_at_top,_#0e0e0e_0%,_#050505_100%)]">
          
          {/* VISUAL ANALYTICS COLUMN */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <section className="flex-1 min-h-[550px] bg-black/80 rounded-[48px] border border-white/5 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl group transition-all duration-700 hover:border-white/10">
              <div className="absolute top-10 left-10 z-30 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/10 rounded-xl text-red-600"><Cpu size={20}/></div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                    {activeView === ViewState.MEMPOOL ? 'Energy Retina' : 
                     activeView === ViewState.TOPOGRAPHY ? 'Liquidity Topology' : 
                     activeView === ViewState.GRAPH ? 'Wallet Topology' : 'Radar Spectrogram'}
                  </h1>
                </div>
                <div className="flex items-center gap-3 ml-12">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shadow-[0_0_15px_rgba(239,68,68,1)]" />
                  <span className="text-[11px] mono text-gray-500 tracking-[0.5em] uppercase font-bold">FUSION_LINK // {activeView}</span>
                </div>
              </div>

              {/* RETINA INTERPRETATION OVERLAY */}
              {report?.retina_interpretation && activeView === ViewState.MEMPOOL && (
                <div className="absolute bottom-10 left-10 right-10 z-30 bg-black/60 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-2">
                    <Binary size={16} className="text-red-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Retina Interpretation</span>
                  </div>
                  <p className="text-sm text-white/80 font-medium leading-relaxed italic">"{report.retina_interpretation}"</p>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center p-12">
                {activeView === ViewState.MEMPOOL && (
                  <div className="scale-110"><RetinaDisplay data={mempool.map(tx => tx.gasPrice)} type="GAF" /></div>
                )}

                {activeView === ViewState.TOPOGRAPHY && (
                  <div className="w-full flex flex-col items-center gap-12 animate-fade-in">
                    <div className="w-full flex items-end justify-center gap-4 h-96 px-16 relative">
                      {topoData.map((tick, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-[20px] transition-all duration-[1.5s] relative group/bar ${tick.isPeak ? 'bg-gradient-to-t from-blue-700 to-cyan-500 shadow-[0_0_50px_rgba(37,99,235,0.4)]' : 'bg-white/5'}`}
                          style={{ height: `${tick.depth}%` }}
                        >
                           {tick.isPeak && <div className="absolute inset-0 bg-white/30 animate-pulse rounded-t-[20px]" />}
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-xs mono text-blue-400 font-black translate-y-2 group-hover/bar:translate-y-0">
                             {tick.depth.toFixed(0)}%
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeView === ViewState.GRAPH && (
                  <div className="scale-110 w-full h-full"><WalletGraph data={graphData} /></div>
                )}

                {activeView === ViewState.TECHNICAL && techData && (
                  <div className="w-full max-w-4xl flex flex-col gap-12 animate-fade-in">
                     {/* Execution Vector Visualizer */}
                     {report && (
                       <div className="bg-white/5 p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
                         <div className="flex justify-between items-center mb-10">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Execution Vector Alignment</span>
                            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] font-black text-green-500 mono">P_SUCCESS: {((report.probability_success || 0) * 100).toFixed(0)}%</div>
                         </div>
                         <div className="relative h-24 flex items-center">
                            <div className="absolute inset-x-0 h-px bg-white/10" />
                            {/* Stop Loss */}
                            <div className="absolute flex flex-col items-center gap-2" style={{ left: '10%' }}>
                              <div className="h-4 w-px bg-red-600" />
                              <span className="text-[8px] mono text-red-600 font-bold uppercase">STOP: ${formatPrice(report.stop_loss || currentToken?.priceUsd * 0.9)}</span>
                            </div>
                            {/* Entry */}
                            <div className="absolute flex flex-col items-center gap-2" style={{ left: '30%' }}>
                              <div className="h-8 w-px bg-blue-500" />
                              <span className="text-[8px] mono text-blue-500 font-bold uppercase">ENTRY: ${formatPrice(report.entry_price)}</span>
                            </div>
                            {/* Current */}
                            <div className="absolute flex flex-col items-center gap-2 z-10" style={{ left: '45%' }}>
                              <div className="w-4 h-4 rounded-full bg-white animate-ping" />
                              <span className="text-[8px] mono text-white font-black uppercase">CURRENT: ${formatPrice(currentToken?.priceUsd || 0)}</span>
                            </div>
                            {/* Target */}
                            <div className="absolute flex flex-col items-center gap-2" style={{ left: '85%' }}>
                              <div className="h-8 w-px bg-green-500" />
                              <span className="text-[8px] mono text-green-500 font-black uppercase">TARGET: ${formatPrice(report.target_exit)}</span>
                            </div>
                         </div>
                         <p className="mt-8 text-xs text-gray-500 leading-relaxed font-medium italic">"Execution rationale: {report.retail_reasoning}"</p>
                       </div>
                     )}

                     <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                           <div className="flex justify-between items-center mb-6">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Momentum (RSI)</span>
                              <span className={`text-xl font-black mono ${techData.rsi > 70 ? 'text-red-500' : techData.rsi < 30 ? 'text-green-500' : 'text-blue-400'}`}>{techData.rsi.toFixed(2)}</span>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full relative">
                              <div className="absolute top-0 bottom-0 bg-red-600 shadow-[0_0_10px_red] transition-all duration-1000" style={{ width: `${techData.rsi}%` }} />
                           </div>
                        </div>
                        <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                           <div className="flex justify-between items-center mb-6">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Orderbook Delta</span>
                              <Layers size={18} className="text-gray-500" />
                           </div>
                           <div className="flex items-end gap-3">
                             <div className={`text-3xl font-black uppercase tracking-tighter ${techData.obImbalance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {(techData.obImbalance * 100).toFixed(1)}%
                             </div>
                             <div className="text-[9px] text-gray-600 mb-1 mono font-black">IMBALANCE</div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-40">
              <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-2xl">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block mb-2">Institutional MCAP</span>
                    <span className="text-3xl font-black text-white mono tracking-tighter">${currentToken ? (currentToken.marketCap / 1e6).toFixed(2) + 'M' : '---'}</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><BarChart3 size={24} /></div>
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 relative overflow-hidden group hover:border-green-500/40 transition-all shadow-2xl">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block mb-2">Liquidity Absorption (24H)</span>
                    <span className="text-3xl font-black text-white mono tracking-tighter">${currentToken ? (currentToken.volume24h / 1e6).toFixed(2) + 'M' : '---'}</span>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><Waves size={24} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-gradient-to-br from-[#121212] to-[#080808] rounded-[56px] border border-white/10 p-10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] flex flex-col min-h-[650px] relative overflow-hidden group/action">
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/15 blur-[120px] rounded-full group-hover/action:bg-red-600/20 transition-all duration-1000" />
               <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />
               
               <div className="flex justify-between items-center mb-8 z-10">
                 <h2 className="text-[12px] font-black uppercase text-gray-500 tracking-[0.5em] flex items-center gap-3">
                   <Cpu size={18} className="text-red-600" /> Neural Directive
                 </h2>
                 {isAnalyzing && <RefreshCw size={24} className="animate-spin text-red-600" />}
               </div>

               {report ? (
                 <div className="animate-fade-in flex flex-col flex-1 z-10">
                    <div className="flex items-center justify-between mb-6">
                       <div className={`px-6 py-2.5 rounded-[20px] text-[12px] font-black border-2 shadow-2xl transition-all ${
                         report?.directive?.includes('BUY') ? 'bg-green-600/10 border-green-600/30 text-green-400 shadow-green-600/20' :
                         report?.directive?.includes('SELL') ? 'bg-red-600/10 border-red-600/30 text-red-400 shadow-red-600/20' :
                         'bg-yellow-600/10 border-yellow-600/30 text-yellow-400 shadow-yellow-600/20'
                       }`}>
                         {report?.directive?.replace('_', ' ') || 'UNDEFINED'}
                       </div>
                       <div className="flex flex-col items-end">
                          <div className="text-[11px] font-black text-white tracking-widest uppercase">CONF: {report.confidence_score}%</div>
                          <div className="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                             <div className="h-full bg-red-600" style={{ width: `${report.confidence_score}%` }} />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <span className="text-[9px] text-gray-500 font-black uppercase block mb-1">Buy Range Min</span>
                            <div className="text-xs font-black text-blue-400 mono">${formatPrice(report.suggested_buy_range?.min || currentToken?.priceUsd * 0.98)}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <span className="text-[9px] text-gray-500 font-black uppercase block mb-1">Buy Range Max</span>
                            <div className="text-xs font-black text-blue-400 mono">${formatPrice(report.suggested_buy_range?.max || currentToken?.priceUsd * 1.02)}</div>
                        </div>
                    </div>

                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                      {report.action_title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8 pl-6 border-l-2 border-red-600/60 italic">
                      {report.retail_reasoning}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                       <div className="bg-white/5 p-5 rounded-3xl border border-white/10 group/stat">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider block mb-1">Entry Vector</span>
                          <span className="text-sm font-black text-white mono">${formatPrice(report.entry_price)}</span>
                       </div>
                       <div className="bg-white/5 p-5 rounded-3xl border border-white/10 group/stat">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider block mb-1">Target Exit</span>
                          <span className="text-sm font-black text-green-400 mono">${formatPrice(report.target_exit)}</span>
                       </div>
                    </div>

                    {/* NQ SWAP DEEP LINK */}
                    <button 
                        onClick={executeOnNQSwap}
                        className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[28px] hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(220,38,38,0.3)] group/btn mb-4 active:scale-95"
                    >
                        <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                        Execute on NQ Swap
                    </button>
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Partnered with NQ Swap</span>
                    </div>
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-30 z-10 animate-pulse">
                    <Rocket size={80} className="mb-8 text-gray-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-[200px] text-gray-400 leading-loose">Initialize Directive for Execution Matrix</p>
                 </div>
               )}

               <button 
                onClick={runDeFiScan}
                disabled={!currentToken || isAnalyzing}
                className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[12px] rounded-[36px] hover:bg-red-600 hover:text-white transition-all duration-500 disabled:opacity-20 shadow-[0_20px_50px_rgba(255,255,255,0.15)] mt-auto active:scale-95 z-10"
               >
                 {currentToken ? `Generate High-Fidelity Signal` : 'Input Target Link'}
               </button>
            </div>

            <div className="scale-105 origin-top">
              <ProfitSimulator 
                capital={tradingCapital} 
                onCapitalChange={setTradingCapital} 
                report={report}
                currentPrice={currentToken?.priceUsd || 0}
                strategy={strategy}
              />
            </div>
          </div>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-12 py-6 rounded-[40px] shadow-[0_40px_80px_rgba(220,38,38,0.6)] flex items-center gap-8 z-[200] animate-bounce-slow border-2 border-white/20">
          <div className="p-3 bg-white/20 rounded-2xl"><Zap size={40} /></div>
          <div>
            <h4 className="font-black uppercase text-base tracking-[0.2em] mb-1">Signal Protocol Exception</h4>
            <p className="text-xs font-bold opacity-90 mono tracking-wider">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-6 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
        </div>
      )}

      <style>{`
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(400%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -15px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default App;
