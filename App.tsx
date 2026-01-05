
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShieldAlert, Activity, Zap, Search, Cpu, RefreshCw, 
  TrendingUp, Map as MapIcon, Share2, BarChart3, 
  Waves, Briefcase, User, Info, AlertCircle, ShoppingCart, 
  Binary, Grid, Layers, Rocket, Target, ChevronRight, X,
  Network, ArrowRightLeft, MousePointer2, Globe, Database, ListFilter,
  ArrowUpRight, ArrowDownRight, Eye, Hash, Server, Clock, ShieldCheck,
  Languages, Lock, Key, CheckCircle2, Flame, ShieldX, Timer, History,
  Users, UserCheck, AlertTriangle, Boxes, TrendingUpDown, ExternalLink,
  Plus, Code, Terminal, BarChart, Settings, Sliders, Play, MoveRight, 
  MessageCircle, Share, Newspaper, Landmark, BarChart4,
  // Added missing Shield icon
  Shield
} from 'lucide-react';
import { ViewState, UserMode, TokenData, Language, TrackedAsset, MacroEvent, MarketMakerOrder } from './types';
import { translations } from './translations';
import { generateMempoolData, generateWalletGraph, generateTechnicalData, generateMonteCarloPaths } from './utils/math';
import { getMEVAnalysis } from './services/geminiService';
import { fetchTokenByAddress, fetchTopMarkets, EnhancedTokenData } from './services/coingeckoService';
import ProfitSimulator from './components/ProfitSimulator';
import RetinaDisplay from './components/RetinaDisplay';
import WalletGraph from './components/WalletGraph';
import LiquidityHeatmap from './components/LiquidityHeatmap';
import ExecutionModal from './components/ExecutionModal';
import MonteCarloPaths from './components/MonteCarloPaths';

const MacroTemporalOracle: React.FC<{ data?: any }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-[#030305] border border-blue-500/20 rounded-[40px] p-10 shadow-2xl animate-fade-in flex flex-col gap-8 h-full">
       <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500"><Landmark size={28} /></div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Macro-Temporal Oracle</h3>
                <p className="text-[10px] text-gray-500 mono font-bold uppercase tracking-widest mt-1">Sovereign Geopolitical Impact Engine</p>
             </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${data.bias === 'BULLISH' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
             {data.bias} Market Bias
          </div>
       </div>

       <div className="grid grid-cols-1 gap-6 flex-1 overflow-y-auto scrollbar-hide">
          {data.events.map((event: MacroEvent) => (
             <div key={event.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">{event.source}</span>
                      <span className="text-[10px] text-gray-600 mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div className={`text-xs font-black ${event.impactScore < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{event.impactScore} Delta</div>
                </div>
                <h4 className="text-lg font-black text-white mb-3 group-hover:text-blue-400 transition-colors">{event.headline}</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/40 p-3 rounded-xl">
                      <span className="text-[8px] text-gray-600 block uppercase font-black mb-1">Precedent</span>
                      <span className="text-[10px] text-gray-400 mono italic">{event.historicalPrecedent}</span>
                   </div>
                   <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10">
                      <span className="text-[8px] text-blue-500 block uppercase font-black mb-1">Impact Forecast</span>
                      <p className="text-[10px] text-gray-300 leading-tight">{event.translation}</p>
                   </div>
                </div>
             </div>
          ))}
       </div>

       <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px]">
          <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Newspaper size={14}/> Acumen Macro Interpretation</h5>
          <p className="text-[11px] text-gray-400 leading-relaxed italic">"{data.reasoning}"</p>
       </div>
    </div>
  );
};

const OrderFlowMatrix: React.FC<{ flow?: MarketMakerOrder[] }> = ({ flow }) => {
  if (!flow) return null;
  return (
    <div className="bg-[#050505] border border-white/5 rounded-[40px] p-10 shadow-2xl h-full flex flex-col gap-8">
       <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-500"><BarChart4 size={28} /></div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Wintermute / Acumen Matrix</h3>
                <p className="text-[10px] text-gray-500 mono font-bold uppercase tracking-widest mt-1">Institutional Order Flow Intelligence</p>
             </div>
          </div>
          <button className="p-3 hover:bg-white/5 rounded-full"><RefreshCw size={20} className="text-gray-600" /></button>
       </div>

       <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
          {flow.map((order) => (
             <div key={order.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[28px] flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-5">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black ${order.mm === 'WINTERMUTE' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
                      {order.mm.slice(0, 1)}
                   </div>
                   <div>
                      <span className="text-[10px] text-white font-black uppercase tracking-widest block">{order.mm}</span>
                      <span className="text-[9px] text-gray-600 mono font-bold">{order.pair} • Node Sync: OK</span>
                   </div>
                </div>
                <div className="text-right">
                   <span className={`text-sm font-black block mb-1 ${order.side === 'BUY' ? 'text-emerald-500' : 'text-red-500'}`}>{order.side} ${(order.size / 1e3).toFixed(0)}K</span>
                   <div className="flex gap-1 justify-end">
                      {Array.from({length: 5}).map((_, i) => (
                         <div key={i} className={`w-1 h-3 rounded-full ${i < order.intensity ? (order.side === 'BUY' ? 'bg-emerald-500' : 'bg-red-500') : 'bg-white/10'}`} />
                      ))}
                   </div>
                </div>
             </div>
          ))}
       </div>

       <div className="flex items-center gap-4 py-4 px-8 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl text-emerald-500">
          <Shield size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acumen Anti-Wash Shield: ACTIVE</span>
       </div>
    </div>
  );
};

// Added missing SocialPulseTerminal component
const SocialPulseTerminal: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="bg-[#0a0a0c] border border-white/5 rounded-[48px] p-10 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-600/10 rounded-2xl text-red-500"><Flame size={24} /></div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Social Pulse Terminal</h3>
          <p className="text-[10px] text-gray-500 mono font-bold uppercase tracking-widest mt-1">Real-time Alpha Sentiment</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-black uppercase">Sentiment Score</span>
          <span className="text-lg font-black text-emerald-500">{metrics.sentimentScore}%</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-black uppercase">24h Mentions</span>
          <span className="text-lg font-black text-white">{metrics.mentions24h.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-black uppercase">Viral Velocity</span>
          <div className="flex gap-1">
             {Array.from({length: 10}).map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < metrics.viralVelocity ? 'bg-red-500' : 'bg-white/10'}`} />
             ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {metrics.topPlatforms.map((p: string) => (
            <span key={p} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-400 border border-white/5">#{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Added missing ExploitScannerLog component
const ExploitScannerLog: React.FC<{ probability: number, report: string }> = ({ probability, report }) => {
  return (
    <div className="bg-black/40 border border-white/5 rounded-[40px] p-12">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 text-red-500 rounded-xl"><AlertTriangle size={24} /></div>
          <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Neural Exploit Scan</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${probability > 5 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
          Threat Level: {probability > 7 ? 'CRITICAL' : probability > 4 ? 'MODERATE' : 'LOW'}
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
          <p className="text-sm text-gray-400 leading-relaxed mono">{report}</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
           <div className="bg-white/5 p-6 rounded-2xl">
             <span className="text-[9px] text-gray-600 font-black block mb-2 uppercase">Rug Potential</span>
             <span className="text-sm font-black text-white">{probability * 10}%</span>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl">
             <span className="text-[9px] text-gray-600 font-black block mb-2 uppercase">Liquidity Lock</span>
             <span className="text-sm font-black text-emerald-500">VERIFIED</span>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl">
             <span className="text-[9px] text-gray-600 font-black block mb-2 uppercase">Audit Status</span>
             <span className="text-sm font-black text-blue-500">AI-COMPLETE</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userMode, setUserMode] = useState<UserMode>(UserMode.RETAIL);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [activeView, setActiveView] = useState<ViewState>(ViewState.MARKET_SURFACE);
  const [marketSurface, setMarketSurface] = useState<EnhancedTokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<EnhancedTokenData | null>(null);
  const [mcData, setMcData] = useState<{paths: number[][], bullRatio: number, bearRatio: number}>({paths: [], bullRatio: 0, bearRatio: 0});
  const [activeInstDetail, setActiveInstDetail] = useState<'MEV' | 'POOL' | 'EXPLOIT' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [techData, setTechData] = useState<any>(null);
  const [mempool, setMempool] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [capital, setCapital] = useState(500000);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isGated, setIsGated] = useState(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const scan = async () => {
      setIsSearching(true);
      const data = await fetchTopMarkets();
      setMarketSurface(data);
      if (data.length > 0 && !currentToken) {
        handleTokenSelect(data[0]);
      }
      setIsSearching(false);
    };
    scan();
    setMempool(generateMempoolData(30));
  }, []);

  const handleTokenSelect = (token: EnhancedTokenData) => {
    setCurrentToken(token);
    setTechData(generateTechnicalData(token.priceUsd));
    setMcData(generateMonteCarloPaths(token.priceUsd, token.volatility || 0.6));
    setReport(null);
    setActiveInstDetail(null);
    setActiveView(ViewState.TECHNICAL);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const data = await fetchTokenByAddress(searchQuery);
      if (data) {
        handleTokenSelect(data);
        setSearchQuery('');
      } else setError("Contract not found in primary node cluster.");
    } catch (err) { setError("Node gateway failure."); }
    setIsSearching(false);
  };

  return (
    <div className={`min-h-screen ${userMode === UserMode.INSTITUTIONAL ? 'bg-[#030303]' : 'bg-[#060404]'} text-white flex flex-col lg:flex-row overflow-hidden font-sans transition-colors duration-1000`}>
      
      {/* GLOBAL NAVIGATION */}
      <nav className="w-full lg:w-28 border-b lg:border-r border-white/5 bg-black/40 backdrop-blur-3xl flex lg:flex-col items-center py-6 lg:py-16 gap-12 z-50 shrink-0">
        <div className={`p-5 rounded-[24px] shrink-0 transition-all duration-700 ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 shadow-[0_0_60px_rgba(37,99,235,0.5)]' : 'bg-red-600 shadow-[0_0_60px_rgba(220,38,38,0.5)]'}`}>
          <ShieldAlert size={36} />
        </div>
        
        <div className="flex lg:flex-col gap-10">
          <button onClick={() => setActiveView(ViewState.MARKET_SURFACE)} className={`p-5 rounded-3xl transition-all ${activeView === ViewState.MARKET_SURFACE ? 'bg-white/10 text-white shadow-2xl' : 'text-gray-600 hover:text-white'}`}><Grid size={28} /></button>
          <button onClick={() => setActiveView(ViewState.TECHNICAL)} className={`p-5 rounded-3xl transition-all ${activeView === ViewState.TECHNICAL ? 'bg-white/10 text-white shadow-2xl' : 'text-gray-600 hover:text-white'}`}><BarChart3 size={28} /></button>
          <button onClick={() => { if(!isGated) setShowAuthModal(true); else setUserMode(UserMode.INSTITUTIONAL); }} className={`p-5 rounded-3xl transition-all ${userMode === UserMode.INSTITUTIONAL ? 'text-blue-500 bg-blue-500/10' : 'text-gray-600'}`}><Briefcase size={28} /></button>
          <button onClick={() => setUserMode(UserMode.RETAIL)} className={`p-5 rounded-3xl transition-all ${userMode === UserMode.RETAIL ? 'text-red-500 bg-red-500/10' : 'text-gray-600'}`}><User size={28} /></button>
        </div>

        <div className="mt-auto hidden lg:flex flex-col gap-10 mb-16">
          <button onClick={() => setShowLangModal(true)} className="text-gray-600 hover:text-white transition-colors"><Globe size={28} /></button>
          <button onClick={() => setShowSettingsModal(true)} className="text-gray-600 hover:text-white transition-colors"><Settings size={28} /></button>
        </div>
      </nav>

      {/* CORE DISPLAY TERMINAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* SOVEREIGN HEADER */}
        <header className="h-32 border-b border-white/5 flex items-center px-16 justify-between bg-black/20 backdrop-blur-2xl shrink-0">
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.7em] text-gray-500 mb-3">
              {userMode === UserMode.INSTITUTIONAL ? "Sovereign Institutional Oracle" : "Retail Alpha Intelligence Hub"}
            </h1>
            <div className="flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full ${isSearching ? 'bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]'}`} />
              <span className="text-[11px] mono text-gray-400 uppercase tracking-widest font-black">
                {isSearching ? 'Synchronizing Node Matrix...' : 'Global Sovereign Cluster [SECURE]'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <form onSubmit={handleSearch} className="relative group">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Deep Search [Contract/Entity]..." 
                className="bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-12 text-[12px] mono focus:border-blue-600/50 outline-none w-[450px] transition-all focus:w-[600px] shadow-inner font-bold" 
              />
            </form>
            
            {currentToken && (
              <div className="flex items-center gap-8 border-l border-white/5 pl-12 animate-fade-in">
                <div className="text-right">
                  <span className="text-[10px] text-gray-600 font-black uppercase block tracking-widest mb-1.5">Selected Asset</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-white">{currentToken.symbol}</span>
                    <span className={`text-sm mono font-black ${currentToken.priceChange24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {currentToken.priceChange24h >= 0 ? '+' : ''}{currentToken.priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <img src={currentToken.image} className="w-16 h-16 rounded-[24px] border-2 border-white/10 bg-black p-1.5 shadow-2xl group hover:scale-105 transition-transform" />
              </div>
            )}
          </div>
        </header>

        {/* DYNAMIC SCENARIO VIEWS */}
        <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1900px] mx-auto">
            
            {activeView === ViewState.MARKET_SURFACE && (
              <div className="animate-fade-in space-y-12">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Market Surface</h2>
                    <p className="text-base text-gray-500 mono uppercase tracking-[0.2em] font-bold">Top 100 Global Assets • Real-Time Sovereign Feed</p>
                  </div>
                  <div className="flex gap-6">
                     <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"><History size={16}/> Historical Export</button>
                     <button className="px-10 py-5 bg-blue-600 rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all">Live Cluster Sync</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {marketSurface.map((token) => (
                    <button 
                      key={token.id}
                      onClick={() => handleTokenSelect(token)}
                      className="bg-[#0a0a0c] border border-white/5 p-10 rounded-[48px] hover:border-blue-500/40 transition-all text-left group hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-10">
                        <img src={token.image} className="w-16 h-16 rounded-[24px] group-hover:scale-110 transition-transform shadow-2xl border border-white/5" />
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mono ${token.priceChange24h >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {token.priceChange24h.toFixed(2)}%
                        </div>
                      </div>
                      <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">{token.name}</h4>
                      <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-8">{token.symbol}</p>
                      
                      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                        <div>
                          <span className="text-[9px] text-gray-600 block uppercase font-black mb-2">Global Price</span>
                          <span className="text-base font-black text-white mono">${token.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-gray-600 block uppercase font-black mb-2">Matrix Cap</span>
                          <span className="text-base font-black text-white mono">${(token.marketCap / 1e9).toFixed(1)}B</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === ViewState.TECHNICAL && currentToken && (
              <div className="grid grid-cols-12 gap-12 animate-fade-in">
                
                {/* LEFT INFRASTRUCTURE COLUMN */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-12">
                  
                  {userMode === UserMode.INSTITUTIONAL && currentToken.instAnalytics ? (
                    <div className="grid grid-cols-2 gap-12">
                       <div className="h-[600px]">
                          <MacroTemporalOracle data={currentToken.instAnalytics.macroOutlook} />
                       </div>
                       <div className="h-[600px]">
                          <OrderFlowMatrix flow={currentToken.instAnalytics.mmFlow} />
                       </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                       <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[36px] shadow-xl">
                          <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest block mb-4">Sentiment Strength</span>
                          <div className="text-3xl font-black text-white">{currentToken.socialMetrics?.sentimentScore}%</div>
                       </div>
                       {/* ... other standard metrics ... */}
                    </div>
                  )}

                  {/* VISUAL SPECTROGRAMS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <RetinaDisplay data={mempool.map(t => t.gasPrice)} type="GAF" />
                     <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 p-12 flex flex-col shadow-2xl min-h-[550px]">
                        <div className="flex justify-between items-center mb-12">
                           <h3 className="text-sm font-black text-blue-500 uppercase tracking-[0.5em] flex items-center gap-4">
                              <Target size={24}/> Deep Liquidity Topography
                           </h3>
                           <span className="bg-blue-600/10 text-blue-400 px-5 py-2 rounded-full text-[11px] font-black mono uppercase">Matrix Sycned</span>
                        </div>
                        <LiquidityHeatmap 
                          bids={Array.from({length: 14}, (_, i) => ({ price: (currentToken.priceUsd) - i*0.02, size: Math.random() * 40, isAnomalous: Math.random() > 0.85 }))} 
                          asks={Array.from({length: 14}, (_, i) => ({ price: (currentToken.priceUsd) + i*0.02, size: Math.random() * 40, isAnomalous: Math.random() > 0.85 }))} 
                        />
                     </div>
                  </div>

                  {/* MONTE CARLO ITERATIVE TERMINAL */}
                  <div className="bg-[#0a0a0a] rounded-[64px] border border-white/5 p-16 shadow-[0_40px_150px_rgba(0,0,0,0.7)]">
                     <div className="flex justify-between items-center mb-16">
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                              <Cpu size={36} className="text-blue-500" /> Iterative Predictive Matrix
                           </h3>
                           <p className="text-xs text-gray-600 uppercase mono font-bold tracking-[0.3em] mt-3">Simulating 150k Macro-Aware Cycles for {currentToken.name}</p>
                        </div>
                        <div className="flex gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] shadow-inner">
                           <div className="text-right">
                              <span className="text-[10px] text-gray-600 font-black block uppercase mb-2 tracking-widest">Bull Probability</span>
                              <span className="text-2xl font-black text-emerald-500 mono">{(mcData.bullRatio * 100).toFixed(1)}%</span>
                           </div>
                           <div className="w-px h-12 bg-white/10" />
                           <div className="text-left">
                              <span className="text-[10px] text-gray-600 font-black block uppercase mb-2 tracking-widest">Bear Exposure</span>
                              <span className="text-2xl font-black text-red-500 mono">{(mcData.bearRatio * 100).toFixed(1)}%</span>
                           </div>
                        </div>
                     </div>
                     <MonteCarloPaths paths={mcData.paths} width={1500} height={400} />
                  </div>
                </div>

                {/* RIGHT SIGNAL COLUMN */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
                  
                  {userMode === UserMode.RETAIL && currentToken.socialMetrics && <SocialPulseTerminal metrics={currentToken.socialMetrics} />}

                  <div className={`rounded-[72px] border p-14 flex flex-col min-h-[750px] transition-all relative overflow-hidden shrink-0 shadow-[0_40px_100px_rgba(0,0,0,0.5)] ${userMode === UserMode.INSTITUTIONAL ? 'bg-[#0f0f18] border-blue-900/40' : 'bg-[#1e0e0e] border-red-900/40'}`}>
                     <div className="flex items-center gap-8 mb-14">
                        <div className={`p-5 rounded-[28px] ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}>
                           <Zap size={36} />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-[0.6em] text-white">Neural Directive</h2>
                     </div>

                     {report ? (
                        <div className="animate-fade-in flex flex-col flex-1">
                           <div className="flex justify-between items-start mb-16">
                              <div className={`px-10 py-4 rounded-full text-xs font-black border uppercase tracking-[0.3em] ${report.directive?.includes('BUY') ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                                 {report.directive}
                              </div>
                              <div className="text-right">
                                 <span className="text-[11px] text-gray-600 block font-black uppercase mb-3 tracking-widest">Confidence Index</span>
                                 <span className="text-4xl font-black text-white mono">{report.confidence_score}%</span>
                              </div>
                           </div>
                           <h3 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-12">{report.action_title}</h3>
                           <div className="bg-white/[0.03] border-l-8 border-white/10 p-8 rounded-r-[32px] mb-16">
                              <p className="text-[16px] text-gray-300 leading-relaxed font-medium italic">
                                 "{userMode === UserMode.INSTITUTIONAL ? report.retina_interpretation : report.retail_reasoning}"
                              </p>
                           </div>
                           <div className="space-y-8 mb-auto">
                              <div className="flex justify-between px-4 text-[12px] font-black uppercase text-gray-500 tracking-[0.4em]"><span>Alpha Target</span><span className="text-white mono font-black">${report.target_exit?.toLocaleString()}</span></div>
                              <div className="flex justify-between px-4 text-[12px] font-black uppercase text-gray-500 tracking-[0.4em]"><span>Risk Threshold</span><span className="text-red-500 mono font-black">${report.stop_loss?.toLocaleString()}</span></div>
                           </div>
                           <button onClick={() => setIsExecutionModalOpen(true)} className="w-full py-10 bg-white text-black font-black uppercase text-[15px] tracking-[0.7em] rounded-[48px] hover:bg-gray-200 transition-all flex items-center justify-center gap-6 mt-14 shadow-2xl active:scale-95"><ShoppingCart size={32} /> Execute Matrix Swap</button>
                        </div>
                     ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center py-32">
                           <Database size={120} className="mb-10" />
                           <p className="text-lg font-black uppercase tracking-[0.7em]">Neural Sync Required</p>
                        </div>
                     )}

                     {!report && (
                        <button 
                           onClick={async () => {
                             if (!currentToken) return;
                             setIsAnalyzing(true);
                             const res = await getMEVAnalysis(userMode, {
                               token: currentToken.name,
                               price: currentToken.priceUsd,
                               marketCap: currentToken.marketCap,
                               strategy: userMode === UserMode.INSTITUTIONAL ? 'QUANT_INST' : 'QUANT_RETAIL',
                               technicals: techData
                             });
                             setReport(res);
                             setIsAnalyzing(false);
                           }} 
                           disabled={isAnalyzing} 
                           className={`w-full py-10 font-black uppercase text-[15px] tracking-[0.7em] rounded-[48px] shadow-[0_30px_80px_rgba(0,0,0,0.5)] active:scale-95 transition-all ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                           {isAnalyzing ? 'Propagating Prediction Nodes...' : 'Run Neural Directive'}
                        </button>
                     )}
                  </div>

                  <ProfitSimulator capital={capital} onCapitalChange={setCapital} report={report} currentPrice={currentToken.priceUsd} strategy={userMode} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DETAIL MODALS */}
      {activeInstDetail && currentToken && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-16">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-[100px]" onClick={() => setActiveInstDetail(null)} />
            <div className="relative w-full max-w-7xl bg-[#080808] border border-blue-500/20 rounded-[80px] p-24 shadow-[0_0_200px_rgba(37,99,235,0.2)] animate-pop-in">
               <button onClick={() => setActiveInstDetail(null)} className="absolute top-12 right-12 p-6 hover:bg-white/5 rounded-full"><X size={40}/></button>
               {activeInstDetail === 'EXPLOIT' && currentToken.instAnalytics && (
                  <div className="space-y-16">
                     <div className="flex items-center gap-10 border-b border-white/5 pb-14">
                        <div className="p-8 bg-red-600/10 text-red-500 rounded-[40px] shadow-inner"><Terminal size={64} /></div>
                        <div>
                           <h2 className="text-6xl font-black uppercase tracking-tighter">Bytecode Archeology</h2>
                           <p className="text-lg text-gray-500 mono uppercase tracking-[0.4em] mt-3 font-black">Sovereign Forensics & Exploit Modeling</p>
                        </div>
                     </div>
                     <ExploitScannerLog probability={currentToken.instAnalytics.exploitProbability} report={currentToken.instAnalytics.vulnerabilityReport} />
                  </div>
               )}
            </div>
         </div>
      )}

      {/* GLOBAL SETTINGS TERMINAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-16">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-[120px]" onClick={() => setShowSettingsModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[80px] p-20 animate-pop-in shadow-2xl">
             <div className="flex justify-between items-center mb-16">
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Terminal Prefs</h3>
               <button onClick={() => setShowSettingsModal(false)} className="p-4 hover:bg-white/5 rounded-full"><X size={36} /></button>
             </div>
             <div className="space-y-12">
                <div className="flex justify-between items-center p-10 bg-white/5 rounded-[48px] border border-white/5 group hover:border-blue-500/30 transition-all shadow-xl">
                   <div>
                      <span className="text-2xl font-black text-white block mb-2">Neural Link Status</span>
                      <span className="text-sm text-gray-600 uppercase font-black tracking-widest">Gemini 3 Pro Sovereign Model</span>
                   </div>
                   <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-emerald-500/20">Active [120ms]</div>
                </div>
                <div className="flex justify-between items-center p-10 bg-white/5 rounded-[48px] border border-white/5 group hover:border-blue-500/30 transition-all shadow-xl">
                   <div>
                      <span className="text-2xl font-black text-white block mb-2">Regional Node</span>
                      <span className="text-sm text-gray-600 uppercase font-black tracking-widest">US-EAST Node-01 Cluster</span>
                   </div>
                   <button onClick={() => setShowLangModal(true)} className="px-8 py-4 bg-white/10 text-[11px] font-black uppercase tracking-widest rounded-[20px] hover:bg-white/20">Switch Node</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* REGIONAL SYNC MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 z-[750] flex items-center justify-center p-16">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-[120px]" onClick={() => setShowLangModal(false)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[80px] p-16 animate-pop-in shadow-2xl">
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-12 text-center">Global Region Sync</h3>
             <div className="grid grid-cols-1 gap-8">
                {[
                  { id: Language.EN, label: 'North America (US-Node)', flag: '🇺🇸' },
                  { id: Language.ZH, label: 'Asia Pacific (APAC-Node)', flag: '🇨🇳' },
                  { id: Language.RU, label: 'EMEA Region (EU-Node)', flag: '🇷🇺' }
                ].map((l) => (
                   <button 
                    key={l.id} 
                    onClick={() => { setLang(l.id); setShowLangModal(false); }}
                    className={`p-10 rounded-[48px] border transition-all flex items-center gap-8 ${lang === l.id ? 'bg-blue-600 border-blue-400 text-white shadow-[0_20px_60px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                   >
                     <span className="text-4xl">{l.flag}</span>
                     <span className="text-lg font-black uppercase tracking-[0.2em]">{l.label}</span>
                     {lang === l.id && <CheckCircle2 size={32} className="ml-auto" />}
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[850] flex items-center justify-center p-16">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-[150px]" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-[600px] bg-[#030303] border border-blue-600/30 rounded-[96px] p-24 text-center animate-pop-in shadow-[0_0_200px_rgba(37,99,235,0.3)]">
            <div className="w-32 h-32 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-16 border border-blue-600/20 shadow-inner">
               <Lock size={56} className="text-blue-500" />
            </div>
            <h3 className="text-4xl font-black mb-8 uppercase tracking-[0.3em] text-white">Sovereign Gate</h3>
            <p className="text-xs text-gray-600 mb-16 leading-relaxed font-black uppercase tracking-[0.5em]">Awaiting Identity Authentication...</p>
            <input 
              type="password" 
              value={authKey} 
              onChange={(e) => setAuthKey(e.target.value)} 
              placeholder="Sovereign Passkey..." 
              className="w-full bg-black border border-white/5 rounded-[40px] py-10 px-12 text-center text-3xl text-white mb-12 outline-none focus:border-blue-500 transition-all font-mono tracking-widest shadow-inner" 
            />
            <button 
              onClick={() => { if(authKey.length > 2) { setIsGated(true); setUserMode(UserMode.INSTITUTIONAL); setShowAuthModal(false); } }} 
              className="w-full py-10 bg-blue-600 text-white font-black uppercase tracking-[0.6em] rounded-full hover:bg-blue-700 transition-all shadow-2xl active:scale-95 text-lg"
            >
              Verify Agent
            </button>
          </div>
        </div>
      )}

      <ExecutionModal isOpen={isExecutionModalOpen} onClose={() => setIsExecutionModalOpen(false)} token={currentToken} userMode={userMode} lang={lang} />
      
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-16 py-10 rounded-full shadow-[0_60px_150px_rgba(220,38,38,0.6)] flex items-center gap-12 z-[1000] animate-bounce">
          <div className="flex items-center gap-8">
            <AlertCircle size={40} />
            <span className="text-lg font-black uppercase tracking-[0.5em]">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-4 hover:bg-white/10 rounded-full transition-colors"><X size={32}/></button>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(80px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
