
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, Zap, Search, Cpu, RefreshCw, 
  TrendingUp, Map as MapIcon, Share2, BarChart3, 
  Waves, Briefcase, User, Info, AlertCircle, ShoppingCart, 
  Binary, Grid, Layers, Rocket, Target, ChevronRight, X,
  Network, ArrowRightLeft, MousePointer2, Globe, Database, ListFilter,
  ArrowUpRight, ArrowDownRight, Eye, Hash, Server, Clock, ShieldCheck,
  Languages, Lock, Key, CheckCircle
} from 'lucide-react';
import { ViewState, UserMode, TokenData, IntelligenceMetric, EntityTransfer, Language } from './types';
import { translations } from './translations';
import { generateMempoolData, generateWalletGraph, generateTechnicalData } from './utils/math';
import { getMEVAnalysis } from './services/geminiService';
import { fetchTokenByAddress, fetchTopMarkets, EnhancedTokenData } from './services/coingeckoService';
import ProfitSimulator from './components/ProfitSimulator';
import RetinaDisplay from './components/RetinaDisplay';
import WalletGraph from './components/WalletGraph';
import LiquidityHeatmap from './components/LiquidityHeatmap';
import ExecutionModal from './components/ExecutionModal';

const INSTITUTIONS = [
  'Wintermute', 'Jump Crypto', 'Amber Group', 'Cumberland', 
  'FalconX', 'Genesis Trading', 'Galaxy Digital', 'Paradigm', 
  'Dragonfly Capital', 'Flow Traders'
];

const TRANSFER_TYPES = [
  'Liquidity Injection', 'Treasury Rebalance', 'OTC Settlement', 
  'LP Extraction', 'Staking Deposit', 'Governance Voting'
];

const RETAIL_ALPHA_SOURCES = [
  'X (Twitter) Trending', 'Telegram Whale Pulse', 'DexTools Hot #1', 
  'Sentiment Spike', 'New LP Added', 'Social Volume Hub'
];

const App: React.FC = () => {
  const [userMode, setUserMode] = useState<UserMode>(UserMode.RETAIL);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [activeView, setActiveView] = useState<ViewState>(ViewState.MARKET_SURFACE);
  const [marketSurface, setMarketSurface] = useState<TokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<EnhancedTokenData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [techData, setTechData] = useState<any>(null);
  const [mempool, setMempool] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [transfers, setTransfers] = useState<EntityTransfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [capital, setCapital] = useState(5000);
  
  // Gating State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isGated, setIsGated] = useState(false);

  // Execution State
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);

  const t = translations[lang];

  // Sync capital to mode constraints
  useEffect(() => {
    if (userMode === UserMode.INSTITUTIONAL) {
      if (capital < 500000) setCapital(500000);
    } else {
      if (capital > 500000) setCapital(500000);
    }
  }, [userMode]);

  // Auto-scan Top 500
  useEffect(() => {
    const scan = async () => {
      const data = await fetchTopMarkets();
      setMarketSurface(data);
      if (userMode === UserMode.INSTITUTIONAL && !currentToken) {
        handleTokenSelect(data[0]);
      }
    };
    scan();
  }, [userMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMempool(generateMempoolData(35));
      
      if (currentToken) {
        if (userMode === UserMode.INSTITUTIONAL) {
          // Institutional Feed
          const entity = INSTITUTIONS[Math.floor(Math.random() * INSTITUTIONS.length)];
          const type = TRANSFER_TYPES[Math.floor(Math.random() * TRANSFER_TYPES.length)];
          const newTransfer: EntityTransfer = {
            id: Math.random().toString(),
            from: `${entity}: Institutional Node`,
            to: 'Binance: Hot Wallet 04',
            amount: Math.random() * 500000,
            symbol: currentToken.symbol,
            time: new Date().toLocaleTimeString(),
            entity: entity,
            type: type,
            hash: '0x' + Math.random().toString(16).slice(2, 42),
            gas: (Math.random() * 100).toFixed(2) + ' Gwei'
          };
          setTransfers(prev => [newTransfer, ...prev].slice(0, 8));
        } else {
          // Retail Alpha Feed
          const source = RETAIL_ALPHA_SOURCES[Math.floor(Math.random() * RETAIL_ALPHA_SOURCES.length)];
          const sentiment = Math.random() > 0.5 ? 'BULLISH' : 'NEUTRAL';
          const newTransfer: EntityTransfer = {
            id: Math.random().toString(),
            from: source,
            to: 'Retail Trend Monitor',
            amount: Math.random() * 20000,
            symbol: currentToken.symbol,
            time: new Date().toLocaleTimeString(),
            entity: source,
            type: 'Social Pulse',
            sentiment: sentiment as any,
            hash: 'N/A - Off-chain Signal',
            gas: 'N/A'
          };
          setTransfers(prev => [newTransfer, ...prev].slice(0, 8));
        }
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [currentToken, userMode]);

  useEffect(() => {
    if (currentToken) {
      setWalletData(generateWalletGraph(currentToken.symbol, userMode));
    }
  }, [currentToken, userMode]);

  const handleTokenSelect = (token: TokenData) => {
    setCurrentToken(token as EnhancedTokenData);
    setTechData(generateTechnicalData(token.priceUsd));
    setReport(null);
    if (userMode === UserMode.INSTITUTIONAL && activeView === ViewState.MARKET_SURFACE) {
      setActiveView(ViewState.TECHNICAL);
    }
  };

  const trySwitchMode = (mode: UserMode) => {
    if (mode === UserMode.INSTITUTIONAL && !isGated) {
      setShowAuthModal(true);
    } else {
      setUserMode(mode);
      setTransfers([]); // Clear feed to swap sources
    }
  };

  const handleVerify = () => {
    if (authKey.length >= 4) {
      setIsGated(true);
      setUserMode(UserMode.INSTITUTIONAL);
      setShowAuthModal(false);
      setTransfers([]);
    } else {
      setError("Invalid Access Token");
    }
  };

  const runAnalysis = async () => {
    if (!currentToken) return;
    setIsAnalyzing(true);
    try {
      const res = await getMEVAnalysis(userMode, {
        token: currentToken.name,
        price: currentToken.priceUsd,
        marketCap: currentToken.marketCap,
        strategy: 'QUANT',
        technicals: techData
      });
      setReport(res);
    } catch (e) {
      setError("Prediction Engine Timeout.");
    }
    setIsAnalyzing(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const data = await fetchTokenByAddress(searchQuery);
      if (data) {
        handleTokenSelect(data);
        setSearchQuery('');
      } else {
        setError("Meta-Search found no matches. Check address/chain.");
      }
    } catch (err) {
      setError("Deep search protocol failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (p: number | undefined | null) => {
    if (p === undefined || p === null || isNaN(p)) return '---';
    return p < 1 ? p.toFixed(8) : p.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className={`min-h-screen ${userMode === UserMode.INSTITUTIONAL ? 'bg-[#050505]' : 'bg-[#080808]'} text-white flex flex-col lg:flex-row overflow-hidden font-sans transition-colors duration-1000`}>
      
      {/* MODE CONTROLLER SIDEBAR */}
      <nav className="w-full lg:w-24 border-r border-white/5 bg-black/40 backdrop-blur-xl flex lg:flex-col items-center py-10 gap-8 z-50">
        <div className={`p-4 rounded-2xl ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]'} transition-all duration-700`}>
          <ShieldAlert size={32} />
        </div>
        
        <div className="flex lg:flex-col gap-6">
          <button 
            onClick={() => trySwitchMode(UserMode.INSTITUTIONAL)}
            className={`p-4 rounded-xl transition-all ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600/20 text-blue-500' : 'text-gray-600 hover:text-white'}`}
            title="Institutional"
          >
            <Briefcase size={24} />
          </button>
          <button 
            onClick={() => trySwitchMode(UserMode.RETAIL)}
            className={`p-4 rounded-xl transition-all ${userMode === UserMode.RETAIL ? 'bg-red-600/20 text-red-500' : 'text-gray-600 hover:text-white'}`}
            title="Retail"
          >
            <User size={24} />
          </button>
        </div>

        <div className="mt-8 lg:mt-12 flex lg:flex-col gap-4 border-t border-white/5 pt-8">
           {[Language.EN, Language.ZH, Language.RU].map(l => (
             <button 
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] font-black w-10 h-10 rounded-full flex items-center justify-center border transition-all ${lang === l ? 'bg-white/10 border-white/30 text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
             >
               {l}
             </button>
           ))}
        </div>

        <div className="mt-auto hidden lg:flex flex-col gap-6">
          <button 
            onClick={() => setActiveView(ViewState.MARKET_SURFACE)} 
            className={`p-4 transition-all ${activeView === ViewState.MARKET_SURFACE ? 'text-blue-400' : 'text-gray-600 hover:text-white'}`}
            title={t.nav_surface}
          >
            <Grid size={22}/>
          </button>
          <button 
            onClick={() => setActiveView(ViewState.TECHNICAL)} 
            className={`p-4 transition-all ${activeView === ViewState.TECHNICAL ? 'text-blue-400' : 'text-gray-600 hover:text-white'}`}
            title={t.nav_quant}
          >
            <Layers size={22}/>
          </button>
          <button 
            onClick={() => setActiveView(ViewState.GRAPH)} 
            className={`p-4 transition-all ${activeView === ViewState.GRAPH ? 'text-blue-400' : 'text-gray-600 hover:text-white'}`}
            title={t.nav_topology}
          >
            <Network size={22}/>
          </button>
        </div>
      </nav>

      {/* DASHBOARD AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">
              {userMode === UserMode.INSTITUTIONAL ? t.title_inst : t.title_retail}
            </h1>
            <div className="flex items-center gap-4 ml-6 border-l border-white/10 pl-6">
               <div className="flex items-center gap-2">
                  <Database size={14} className="text-gray-600" />
                  <span className="text-[10px] font-black uppercase text-gray-500">
                    {userMode === UserMode.INSTITUTIONAL ? t.network_inst : t.network_retail}
                  </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {isSearching ? <RefreshCw size={14} className="text-blue-500 animate-spin" /> : <Search size={14} className="text-gray-500 group-focus-within:text-blue-500" />}
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contract Discovery (Multi-Chain)..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[11px] mono focus:border-blue-600 outline-none w-80 transition-all"
                disabled={isSearching}
              />
            </form>

            {currentToken && (
              <div className="flex items-center gap-6 animate-fade-in">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {currentToken.symbol} / USD
                    {currentToken.chain && <span className="ml-2 text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded uppercase">{currentToken.chain}</span>}
                  </div>
                  <div className="text-xl font-black mono text-green-400">${formatPrice(currentToken.priceUsd)}</div>
                </div>
                <img src={currentToken.image} className="w-10 h-10 rounded-full border border-white/10" />
              </div>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-y-auto scrollbar-hide">
          
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* INTELLIGENCE BAR */}
            {currentToken && (
              <div className="grid grid-cols-4 gap-4">
                 {[
                   { label: 'Asset Sector', value: currentToken.sector || 'DeFi', icon: <Grid size={12}/>, source: 'MESSARI' },
                   { label: 'Volatility Index', value: `${(currentToken.volatility || 0.5).toFixed(2)}σ`, icon: <Activity size={12}/>, source: 'MESSARI' },
                   { label: 'Market Dominance', value: `${(currentToken.dominance || 0).toFixed(2)}%`, icon: <TrendingUp size={12}/>, source: 'MESSARI' },
                   { label: 'MM Activity', value: currentToken.mktMakerActivity || 'HIGH', icon: <Database size={12}/>, source: 'WINTERMUTE' }
                 ].map((metric, i) => (
                   <div key={i} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl flex flex-col gap-2 group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-center">
                         <div className="p-1.5 bg-white/5 rounded-lg text-gray-500 group-hover:text-indigo-400 transition-colors">
                            {metric.icon}
                         </div>
                         <span className="text-[7px] font-black px-1.5 py-0.5 bg-white/5 text-gray-500 rounded uppercase tracking-widest">{metric.source}</span>
                      </div>
                      <div>
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{metric.label}</span>
                         <div className="text-sm font-black text-white uppercase tracking-tight">{metric.value}</div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeView === ViewState.MARKET_SURFACE && (
              <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden flex flex-col h-[650px] shadow-2xl">
                 <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-blue-500">
                     <Binary size={16}/> {userMode === UserMode.INSTITUTIONAL ? "Institutional Liquidity Surface" : "Retail Market Pulse"}
                   </h2>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[9px] font-black text-gray-500 uppercase">REAL-TIME LD4 SCANNER</span>
                      </div>
                   </div>
                 </div>
                 <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#0a0a0a] z-10 text-[9px] uppercase text-gray-600 border-b border-white/5 font-black">
                        <tr>
                          <th className="p-5">Asset</th>
                          <th className="p-5">Price</th>
                          <th className="p-5">24h Change</th>
                          <th className="p-5">Market Cap</th>
                          <th className="p-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs mono">
                        {marketSurface.map((token) => (
                          <tr 
                            key={token.id} 
                            onClick={() => handleTokenSelect(token)}
                            className={`border-b border-white/5 transition-all cursor-pointer ${currentToken?.id === token.id ? 'bg-blue-600/10 border-blue-500/20' : 'hover:bg-white/5'}`}
                          >
                            <td className="p-5 flex items-center gap-4">
                              <img src={token.image} className="w-7 h-7 rounded-full" />
                              <div className="font-black text-white">{token.symbol}</div>
                            </td>
                            <td className="p-5 font-bold">${formatPrice(token.priceUsd)}</td>
                            <td className={`p-5 font-black ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {token.priceChange24h.toFixed(2)}%
                            </td>
                            <td className="p-5 text-gray-400">${(token.marketCap / 1e9).toFixed(2)}B</td>
                            <td className="p-5 text-right"><ChevronRight size={16} className="ml-auto text-gray-700" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
            )}

            {activeView === ViewState.TECHNICAL && (
              <div className="flex flex-col gap-8 h-full">
                <div className="grid grid-cols-2 gap-8 h-[500px]">
                  <RetinaDisplay data={mempool.map(t => t.gasPrice)} type="GAF" />
                  <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden flex flex-col p-6">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Target size={14}/> L3 Liquidity Depth
                    </h3>
                    <LiquidityHeatmap 
                      bids={Array.from({length: 10}, (_, i) => ({ price: (currentToken?.priceUsd || 100) - i*0.1, size: Math.random() * 10, isAnomalous: Math.random() > 0.8 }))} 
                      asks={Array.from({length: 10}, (_, i) => ({ price: (currentToken?.priceUsd || 100) + i*0.1, size: Math.random() * 10, isAnomalous: Math.random() > 0.8 }))} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#0a0a0a] rounded-[24px] border border-white/5 p-6 shadow-xl relative overflow-hidden group">
                     <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Wyckoff Phase</span>
                     <div className="text-xl font-black text-white">{techData?.marketStructure || 'SCANNING...'}</div>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-[24px] border border-white/5 p-6 shadow-xl relative overflow-hidden">
                     <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">OB Imbalance</span>
                     <div className="text-xl font-black text-white">{((techData?.obImbalance || 0) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-[24px] border border-white/5 p-6 shadow-xl relative overflow-hidden">
                     <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Institutional LPE</span>
                     <div className="text-xl font-black text-blue-500">{report?.lpe_rating || '---'}%</div>
                  </div>
                </div>
              </div>
            )}

            {activeView === ViewState.GRAPH && (
              <div className="h-[650px] bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col relative">
                 <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 z-20">
                   <div className="flex flex-col gap-1">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-blue-500">
                      <Network size={16}/> {userMode === UserMode.INSTITUTIONAL ? "Arkham Entity Topology" : "Social Alpha Graph"}
                    </h2>
                    <span className="text-[8px] text-gray-500 mono uppercase">Flow Data Aggregator</span>
                   </div>
                 </div>
                 <div className="flex-1">
                    <WalletGraph data={walletData} />
                 </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            
            {/* MODE-SPECIFIC FEED PANEL */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[440px]">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl ${userMode === UserMode.INSTITUTIONAL ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-500'}`}>
                        {userMode === UserMode.INSTITUTIONAL ? <ListFilter size={18} /> : <TrendingUp size={18} />}
                     </div>
                     <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                        {userMode === UserMode.INSTITUTIONAL ? t.feed_inst_title : t.feed_retail_title}
                     </h2>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${userMode === UserMode.INSTITUTIONAL ? 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20' : 'text-red-400 bg-red-400/10 border-red-500/20'}`}>
                    {userMode === UserMode.INSTITUTIONAL ? 'SOVEREIGN' : 'ALPHA_PULSE'}
                  </span>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {transfers.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic text-center py-10">
                      {userMode === UserMode.INSTITUTIONAL ? t.feed_inst_desc : t.feed_retail_desc}
                    </p>
                  ) : (
                    transfers.map(t_item => (
                      <div 
                        key={t_item.id} 
                        onClick={() => setSelectedTransfer(t_item)}
                        className={`p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer ${selectedTransfer?.id === t_item.id ? (userMode === UserMode.INSTITUTIONAL ? 'border-indigo-500 bg-indigo-500/5' : 'border-red-500 bg-red-500/5') : ''}`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${userMode === UserMode.INSTITUTIONAL ? 'text-indigo-400' : 'text-red-400'}`}>
                              {t_item.entity}
                            </span>
                            <span className="text-[8px] text-gray-600 mono">{t_item.time}</span>
                         </div>
                         <div className="flex items-center gap-3 mb-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${userMode === UserMode.INSTITUTIONAL ? 'bg-indigo-500' : 'bg-red-500'}`} />
                            <p className="text-[10px] text-gray-300 font-bold">
                              {userMode === UserMode.INSTITUTIONAL ? `Trace: ${t_item.from.split(':')[0]} → Wallet` : `Alert: ${t_item.from}`}
                            </p>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-white mono">
                              {userMode === UserMode.INSTITUTIONAL ? `$${(t_item.amount || 0).toLocaleString()} ${t_item.symbol}` : `HEAT: +${(t_item.amount / 100).toFixed(0)}%`}
                            </span>
                            <span className="text-[7px] font-black px-1.5 py-0.5 bg-white/5 text-gray-500 rounded uppercase tracking-tighter">
                              {userMode === UserMode.INSTITUTIONAL ? "DPI Available" : t_item.sentiment}
                            </span>
                         </div>
                      </div>
                    ))
                  )}
               </div>

               {selectedTransfer && (
                 <div className={`mt-4 p-5 rounded-3xl animate-pop-in relative border ${userMode === UserMode.INSTITUTIONAL ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-red-600/10 border-red-500/20'}`}>
                    <button onClick={() => setSelectedTransfer(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                      <X size={14} />
                    </button>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Hash size={12} className={userMode === UserMode.INSTITUTIONAL ? 'text-indigo-400' : 'text-red-400'} /> 
                      {userMode === UserMode.INSTITUTIONAL ? "Deep Packet Inspection" : "Social Alpha Breakdown"}
                    </h4>
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <span className="text-[8px] text-gray-500 font-black uppercase">Source</span>
                          <span className="text-[9px] text-white mono font-bold">{selectedTransfer.entity}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[8px] text-gray-500 font-black uppercase">Operation</span>
                          <span className={`text-[9px] mono font-bold ${userMode === UserMode.INSTITUTIONAL ? 'text-indigo-400' : 'text-red-400'}`}>
                            {selectedTransfer.type}
                          </span>
                       </div>
                       {userMode === UserMode.INSTITUTIONAL ? (
                          <>
                            <div className="flex justify-between">
                                <span className="text-[8px] text-gray-500 font-black uppercase">Gas Payload</span>
                                <span className="text-[9px] text-white mono">{selectedTransfer.gas}</span>
                            </div>
                            <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                <span className="text-[7px] text-gray-600 font-black block mb-1">TX HASH</span>
                                <span className="text-[8px] text-gray-400 mono break-all">{selectedTransfer.hash}</span>
                            </div>
                          </>
                       ) : (
                          <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                             <p className="text-[10px] text-gray-400 leading-relaxed italic">"Social volume spike detected on encrypted channels. High correlation with previous moonshot patterns."</p>
                          </div>
                       )}
                    </div>
                 </div>
               )}
            </div>

            <div className={`rounded-[56px] border ${userMode === UserMode.INSTITUTIONAL ? 'bg-[#0f0f0f] border-blue-900/20' : 'bg-[#120a0a] border-red-900/20'} p-10 shadow-2xl flex flex-col min-h-[500px] relative overflow-hidden group transition-all duration-700`}>
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full" />
               <div className="flex justify-between items-center mb-10 z-10">
                 <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                   <Cpu size={18} className={userMode === UserMode.INSTITUTIONAL ? 'text-blue-500' : 'text-red-500'} /> 
                   {userMode === UserMode.INSTITUTIONAL ? t.prediction_24h : t.roi_signal}
                 </h2>
                 {isAnalyzing && <RefreshCw size={24} className="animate-spin text-blue-500" />}
               </div>

               {report ? (
                 <div className="animate-fade-in flex flex-col flex-1 z-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className={`px-5 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                         report.directive?.includes('BUY') ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                       }`}>
                         {report.directive?.replace('_', ' ') || 'NEUTRAL'}
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-gray-600 uppercase">Confidence</span>
                          <span className="text-sm font-black text-white">{report.confidence_score}%</span>
                       </div>
                    </div>

                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                      {report.action_title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 leading-relaxed font-medium mb-10">
                      {userMode === UserMode.INSTITUTIONAL ? report.retina_interpretation : report.retail_reasoning}
                    </p>

                    <button 
                      onClick={() => setIsExecutionModalOpen(true)}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-[28px] hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl mt-auto"
                    >
                      <ShoppingCart size={18} /> {t.execute_button}
                    </button>
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-20 z-10">
                    <Rocket size={80} className="mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-[200px] leading-loose">Initialize Directive Terminal</p>
                 </div>
               )}

               {!report && (
                 <button 
                  onClick={runAnalysis}
                  disabled={!currentToken || isAnalyzing}
                  className={`w-full py-7 font-black uppercase tracking-[0.5em] text-[12px] rounded-[36px] transition-all duration-500 shadow-2xl mt-auto active:scale-95 z-10 ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                 >
                   {currentToken ? t.run_directive : t.scanning}
                 </button>
               )}
            </div>
            
            <ProfitSimulator 
              capital={capital} 
              onCapitalChange={setCapital} 
              report={report} 
              currentPrice={currentToken?.priceUsd || 0} 
              strategy={userMode} 
            />
          </div>
        </div>
      </main>

      {/* INSTITUTIONAL AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-[400px] bg-[#0a0a0a] border border-blue-500/30 rounded-[40px] p-10 shadow-2xl text-center animate-pop-in">
             <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                <Lock size={32} className="text-blue-500" />
             </div>
             <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">{t.auth_required}</h3>
             <p className="text-xs text-gray-500 leading-relaxed mb-8">{t.auth_desc}</p>
             
             <div className="relative mb-6">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  placeholder={t.auth_placeholder}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white mono font-bold focus:border-blue-500 outline-none transition-all"
                />
             </div>

             <button 
                onClick={handleVerify}
                className="w-full py-5 bg-blue-600 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-full hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3"
             >
               <CheckCircle size={18} /> {t.auth_button}
             </button>
          </div>
        </div>
      )}

      {/* Execution Matrix Modal */}
      <ExecutionModal 
        isOpen={isExecutionModalOpen} 
        onClose={() => setIsExecutionModalOpen(false)} 
        token={currentToken}
        userMode={userMode}
        lang={lang}
      />

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-6 z-[100] animate-bounce-slow">
          <AlertCircle size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)}><X size={20}/></button>
        </div>
      )}
    </div>
  );
};

export default App;
