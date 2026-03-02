
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, Zap, Search, Cpu, RefreshCw, 
  TrendingUp, Map as MapIcon, Share2, BarChart3, 
  Waves, Briefcase, User, Info, AlertCircle, ShoppingCart, 
  Binary, Grid, Layers, Rocket, Target, ChevronRight, X, Command,
  Network, ArrowRightLeft, MousePointer2, Globe, Database, ListFilter,
  ArrowUpRight, ArrowDownRight, Eye, Hash, Server, Clock, ShieldCheck,
  Languages, Lock, Key, CheckCircle, PieChart, Coins, CandlestickChart,
  BrainCircuit, Sun, Moon, MessageSquare, ChevronLeft, Menu
} from 'lucide-react';
import { ViewState, UserMode, TokenData, IntelligenceMetric, EntityTransfer, Language } from './types';
import { translations } from './translations';
import { 
  generateWalletGraph, 
  generateTechnicalData,
  calculateKylesLambda,
  detectMarketRegime,
  calculateMarketTemperature
} from './utils/math';
import { getMEVAnalysis } from './services/geminiService';
import { fetchTokenByAddress, fetchTopMarkets, EnhancedTokenData } from './services/coingeckoService';
import ProfitSimulator from './components/ProfitSimulator';
import RetinaDisplay from './components/RetinaDisplay';
import WalletGraph from './components/WalletGraph';
import OrderFlow3D from './components/OrderFlow3D';
import ExecutionModal from './components/ExecutionModal';
import AlphaForge from './components/AlphaForge';
import MarketIntelligence from './components/MarketIntelligence';
import EntropyCharts from './components/EntropyCharts';
import CommandBar from './components/CommandBar';
import FeedbackModal from './components/FeedbackModal';
import OnboardingTour from './components/OnboardingTour';
import LandingPage from './components/LandingPage';
import NewsTerminal from './components/NewsTerminal';
import { AnimatePresence, motion } from 'motion/react';
import debounce from 'lodash.debounce';

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
  const [activeView, setActiveView] = useState<ViewState>(ViewState.LANDING);
  const [marketSurface, setMarketSurface] = useState<TokenData[]>([]);
  const [currentToken, setCurrentToken] = useState<EnhancedTokenData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [techData, setTechData] = useState<any>(null);
  const [walletData, setWalletData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [transfers, setTransfers] = useState<EntityTransfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [capital, setCapital] = useState(5000);
  
  // Quantitative Intelligence State
  const [marketRegime, setMarketRegime] = useState<string>('MEAN_REVERSION');
  const [kylesLambda, setKylesLambda] = useState<number>(0);
  const [marketTemp, setMarketTemp] = useState<number>(0);
  
  // Retail Trading Mode
  const [retailTradingMode, setRetailTradingMode] = useState<'SPOT' | 'FUTURES'>('SPOT');
  
  useEffect(() => {
    setReport(null); // Clear report when switching modes
  }, [retailTradingMode]);
  
  // Gating State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isGated, setIsGated] = useState(false);

  // Execution State
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  
  // Command Bar & Gamification
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [alphaPoints, setAlphaPoints] = useState(1250);
  const [dailyStreak, setDailyStreak] = useState(5);

  // New UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const t = translations[lang];

  // Onboarding check
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('defi_scope_tour_seen');
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleTourFinish = () => {
    setRunTour(false);
    localStorage.setItem('defi_scope_tour_seen', 'true');
  };

  // Theme Sync
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Debounced Global Search
  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (query.length > 2) {
        handleSearch(undefined, query);
      }
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onGlobalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalSearch(val);
    debouncedSearch(val);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync capital to mode constraints
  useEffect(() => {
    if (userMode === UserMode.INSTITUTIONAL) {
      if (capital < 500000) setCapital(500000);
    } else {
      if (capital > 500000) setCapital(500000);
    }
  }, [userMode]);

  // Enforce Spot mode if a Contract is selected
  useEffect(() => {
    if (currentToken?.isContract) {
      setRetailTradingMode('SPOT');
    }
  }, [currentToken]);

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
          const sentimentValue = Math.random();
          const sentiment = sentimentValue > 0.7 ? 'BULLISH' : sentimentValue < 0.3 ? 'BEARISH' : 'NEUTRAL';
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
    const tech = generateTechnicalData(token.priceUsd);
    setTechData(tech);
    setReport(null);
    
    // Update Quantitative Metrics
    setMarketRegime(detectMarketRegime(tech.rsi, tech.volatility, token.priceChange24h));
    setKylesLambda(calculateKylesLambda(tech.volatility, token.volume24h));
    setMarketTemp(calculateMarketTemperature(tech.volatility, tech.obImbalance));

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
      const res = await getMEVAnalysis(userMode, retailTradingMode, {
        token: currentToken.name,
        price: currentToken.priceUsd,
        marketCap: currentToken.marketCap,
        sector: currentToken.sector,
        volatility: currentToken.volatility,
        dominance: currentToken.dominance,
        mktMakerActivity: currentToken.mktMakerActivity,
        strategy: 'QUANT',
        technicals: techData
      });
      setReport(res);
    } catch (e) {
      setError("Prediction Engine Timeout.");
    }
    setIsAnalyzing(false);
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const query = overrideQuery || searchQuery;
    if (!query) return;
    
    setIsSearching(true);
    setError(null);
    
    // Handle special commands
    if (query === 'gainers') {
      setActiveView(ViewState.MARKET_SURFACE);
      setGlobalSearch('');
      setIsSearching(false);
      return;
    }
    
    if (query === 'whales') {
      setActiveView(ViewState.GRAPH);
      setGlobalSearch('');
      setIsSearching(false);
      return;
    }

    if (query === 'mempool') {
      setActiveView(ViewState.GRAPH);
      setGlobalSearch('');
      setIsSearching(false);
      return;
    }

    if (query === 'audit') {
      setNotification("Security Audit: System scanning for re-entrancy vectors... PASSED");
      setGlobalSearch('');
      setIsSearching(false);
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    
    try {
      const data = await fetchTokenByAddress(query);
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

  if (activeView === ViewState.LANDING) {
    return <LandingPage onEnter={() => setActiveView(ViewState.MARKET_SURFACE)} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? (userMode === UserMode.INSTITUTIONAL ? 'bg-[#050505] scanline' : 'bg-[#080808]') : 'bg-[#f8f9fa]'} ${theme === 'light' ? 'text-zinc-900' : 'text-white'} flex flex-col lg:flex-row overflow-hidden font-sans transition-colors duration-1000 relative`}>
      
      <OnboardingTour run={runTour} onFinish={handleTourFinish} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />

      <CommandBar 
        isOpen={isCommandBarOpen} 
        onClose={() => setIsCommandBarOpen(false)} 
        onSearch={(q) => {
          setSearchQuery(q);
          handleSearch(undefined, q);
        }} 
      />
      {/* MODE CONTROLLER SIDEBAR */}
      <nav 
        id="mode-controller"
        className={`${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} fixed lg:relative bottom-0 lg:bottom-auto left-0 w-full lg:h-screen lg:border-r ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white/80'} backdrop-blur-xl flex lg:flex-col items-center py-4 lg:py-10 gap-4 lg:gap-8 z-50 transition-all duration-300 overflow-x-auto lg:overflow-x-visible`}
      >
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full border items-center justify-center z-[60] transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}
        >
          {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className={`p-2 lg:p-4 rounded-2xl ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]'} transition-all duration-700 shrink-0`}>
          <ShieldAlert size={isSidebarCollapsed ? 20 : 28} />
        </div>
        
        {!isSidebarCollapsed && (
          <div className="hidden lg:block px-6 w-full mb-4">
            <h1 className={`text-sm font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>DeFi Scope</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Visual Intelligence</p>
          </div>
        )}

        <div className="flex lg:flex-col gap-2 lg:gap-4 w-auto lg:w-full px-2 lg:px-4">
          <button 
            onClick={() => trySwitchMode(UserMode.INSTITUTIONAL)}
            className={`flex items-center gap-4 p-2 lg:p-4 rounded-xl transition-all relative group w-auto lg:w-full ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600/20 text-blue-500' : 'text-gray-600 hover:text-white'}`}
            title="Institutional"
          >
            <Briefcase size={20} />
            {!isSidebarCollapsed && <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Institutional</span>}
          </button>
          <button 
            onClick={() => trySwitchMode(UserMode.RETAIL)}
            className={`flex items-center gap-4 p-2 lg:p-4 rounded-xl transition-all relative group w-auto lg:w-full ${userMode === UserMode.RETAIL ? 'bg-red-600/20 text-red-500' : 'text-gray-600 hover:text-white'}`}
            title="Retail"
          >
            <User size={20} />
            {!isSidebarCollapsed && <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Retail</span>}
          </button>
        </div>

        <div className="h-8 w-px bg-white/5 lg:hidden" />

        <div className="flex lg:flex-col gap-2 w-auto lg:w-full px-2 lg:px-4">
           {[
             { id: ViewState.MARKET_SURFACE, icon: <Grid size={20}/>, label: t.nav_surface },
             { id: ViewState.TECHNICAL, icon: <Layers size={20}/>, label: "3D Mempool Profiler" },
             { id: ViewState.GRAPH, icon: <Network size={20}/>, label: t.nav_topology },
             { id: ViewState.ALPHA_FORGE, icon: <BrainCircuit size={20}/>, label: t.nav_forge }
           ].map(view => (
             <button 
                key={view.id}
                onClick={() => setActiveView(view.id as ViewState)} 
                className={`flex items-center gap-4 p-2 lg:p-4 rounded-xl transition-all w-auto lg:w-full ${activeView === view.id ? 'bg-white/5 text-blue-400' : 'text-gray-600 hover:text-white'}`}
                title={view.label}
              >
                {view.icon}
                {!isSidebarCollapsed && <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{view.label}</span>}
              </button>
           ))}
        </div>

        <div className="mt-auto flex lg:flex-col gap-4 w-full px-4">
           {!isSidebarCollapsed && <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 px-2">System</p>}
           <div className="flex lg:flex-col gap-2">
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
           <button 
             id="feedback-trigger"
             onClick={() => setIsFeedbackModalOpen(true)}
             className={`flex items-center gap-4 p-4 rounded-xl transition-all w-full text-gray-600 hover:text-white`}
             title="Feedback"
           >
             <MessageSquare size={22} />
             {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Feedback</span>}
           </button>
        </div>
      </nav>

      {/* DASHBOARD AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* NEWS TICKER */}
        <div className="h-8 bg-blue-600/10 border-b border-white/5 flex items-center px-4 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-2 mr-8 shrink-0">
            <Activity size={12} className="text-blue-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Live Alpha Stream:</span>
          </div>
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 text-[9px] font-bold text-zinc-500 uppercase tracking-widest"
          >
            <span>BTC/USD: +2.4% Volatility Spike Detected</span>
            <span>ETH/USD: Whale Accumulation at $2,450 Support</span>
            <span>SOL/USD: Network TPS hitting 4.5k - Bullish Momentum</span>
            <span>LINK/USD: Oracle Update Complete - Institutional Interest Rising</span>
            <span>US-Iran Conflict: Market Pricing in Geopolitical Risk - Flight to Quality</span>
          </motion.div>
        </div>

        {/* HEADER */}
        <header className={`h-20 border-b ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/80'} flex items-center px-4 lg:px-10 justify-between backdrop-blur-md z-40 sticky top-0`}>
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <div id="global-search" className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input 
                type="text"
                value={globalSearch}
                onChange={onGlobalSearchChange}
                placeholder="Search..."
                className={`w-full py-2 pl-10 pr-4 rounded-xl border transition-all text-[11px] font-bold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-blue-500/50' : 'bg-black/5 border-black/10 text-black focus:border-blue-500/50'}`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-black/40 rounded border border-white/10">
                <Command size={10} className="text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-600">K</span>
              </div>
            </div>
            
            <div className="hidden lg:block h-8 w-px bg-white/5" />
            
            <div className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-black/10 text-indigo-600 hover:bg-black/10'}`}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Network Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-black mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LD4_CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {userMode === UserMode.RETAIL && (
              <div className={`hidden md:flex items-center gap-4 px-4 py-2 border rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-emerald-500" />
                  <span className={`text-[10px] font-black mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{alphaPoints} AP</span>
                </div>
                <div className="w-px h-4 bg-emerald-500/20" />
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-orange-500" />
                  <span className={`text-[10px] font-black mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{dailyStreak}d</span>
                </div>
              </div>
            )}
            
            {currentToken && (
              <div className="flex items-center gap-3 lg:gap-6 animate-fade-in">
                <div className="text-right">
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                    {currentToken.symbol}
                    {currentToken.chain && <span className="hidden sm:inline ml-2 text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded uppercase">{currentToken.chain}</span>}
                  </div>
                  <div className={`text-sm lg:text-xl font-black mono flex items-center gap-2 justify-end ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    <div className="flex flex-col items-end">
                      <span className={`text-[7px] font-black px-1 py-0.5 rounded mb-0.5 ${
                        marketRegime === 'MOMENTUM' ? 'bg-orange-500/20 text-orange-400' :
                        marketRegime === 'MEAN_REVERSION' ? 'bg-emerald-500/20 text-emerald-400' :
                        marketRegime === 'VOLATILITY_CRUSH' ? 'bg-red-500/20 text-red-400' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {marketRegime.replace('_', ' ')}
                      </span>
                      <span>${formatPrice(currentToken.priceUsd)}</span>
                    </div>
                  </div>
                </div>
                <img src={currentToken.image} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/10" />
              </div>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className={`flex-1 p-4 lg:p-8 pb-24 lg:pb-8 grid grid-cols-12 gap-4 lg:gap-8 overflow-y-auto scrollbar-hide ${theme === 'light' ? 'bg-white/50' : ''}`}>
          
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* INTELLIGENCE BAR */}
            {currentToken && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                 {[
                   { label: 'Asset Sector', value: currentToken.sector || 'DeFi', icon: <Grid size={12}/>, source: 'MESSARI' },
                   { label: 'Volatility Index', value: `${(currentToken.volatility || 0.5).toFixed(2)}σ`, icon: <Activity size={12}/>, source: 'MESSARI' },
                   { label: 'Market Dominance', value: `${(currentToken.dominance || 0).toFixed(2)}%`, icon: <PieChart size={12}/>, source: 'MESSARI' },
                   { label: 'Price Impact (λ)', value: `${kylesLambda.toFixed(4)}`, icon: <Waves size={12}/>, source: 'KYLE_MODEL' },
                   { label: 'Market Temp', value: `${marketTemp.toFixed(1)}°`, icon: <Zap size={12}/>, source: 'FISHER_INFO' },
                   { label: 'MM Activity', value: currentToken.mktMakerActivity || 'HIGH', icon: <Database size={12}/>, source: 'WINTERMUTE' }
                 ].map((metric, i) => (
                   <div key={i} className="bg-[#0a0a0a] border border-white/5 p-3 lg:p-4 rounded-2xl flex flex-col gap-2 group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-center">
                         <div className="p-1.5 bg-white/5 rounded-lg text-gray-500 group-hover:text-indigo-400 transition-colors">
                            {metric.icon}
                         </div>
                         <span className="text-[6px] lg:text-[7px] font-black px-1.5 py-0.5 bg-white/5 text-gray-500 rounded uppercase tracking-widest">{metric.source}</span>
                      </div>
                      <div>
                         <span className="text-[8px] lg:text-[9px] font-black text-gray-600 uppercase tracking-widest">{metric.label}</span>
                         <div className="text-xs lg:text-sm font-black text-white uppercase tracking-tight truncate">{metric.value}</div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeView === ViewState.MARKET_SURFACE && (
              <div id="market-surface" className={`${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'} rounded-[32px] border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} overflow-hidden flex flex-col h-[500px] lg:h-[650px] shadow-2xl`}>
                 <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-black/5 bg-zinc-50'} flex justify-between items-center`}>
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
                    {/* Desktop Table */}
                    <table className="hidden lg:table w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#0a0a0a] z-10 text-[9px] uppercase text-gray-600 border-b border-white/5 font-black">
                        <tr>
                          <th className="p-5">Asset</th>
                          <th className="p-5">Sector</th>
                          <th className="p-5">Price</th>
                          <th className="p-5">24h Change</th>
                          <th className="p-5">{userMode === UserMode.INSTITUTIONAL ? "Smart Money Flow" : "Social Sentiment"}</th>
                          <th className="p-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs mono">
                        {marketSurface.map((token) => (
                          <tr 
                            key={token.id} 
                            onClick={() => handleTokenSelect(token)}
                            className={`border-b border-white/5 transition-all cursor-pointer group ${currentToken?.id === token.id ? 'bg-blue-600/10 border-blue-500/20' : 'hover:bg-white/5'}`}
                          >
                            <td className="p-5 flex items-center gap-4">
                              <div className="relative">
                                <img src={token.image} className="w-8 h-8 rounded-full border border-white/10 group-hover:border-blue-500/50 transition-all" />
                                {token.rank && token.rank <= 10 && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                                )}
                              </div>
                              <div>
                                <div className="font-black text-white group-hover:text-blue-400 transition-colors">{token.symbol}</div>
                                <div className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{token.name}</div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-gray-500 uppercase tracking-wider">{token.sector || 'DEFI'}</span>
                            </td>
                            <td className="p-5 font-bold text-zinc-300">${formatPrice(token.priceUsd)}</td>
                            <td className={`p-5 font-black ${(token.priceChange24h || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              <div className="flex items-center gap-1">
                                {(token.priceChange24h || 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {(token.priceChange24h || 0).toFixed(2)}%
                              </div>
                            </td>
                            <td className="p-5">
                              {userMode === UserMode.INSTITUTIONAL ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                                    <div className="h-full bg-blue-500" style={{ width: `${Math.random() * 100}%` }} />
                                  </div>
                                  <span className="text-[9px] font-black text-blue-500 uppercase">Accumulating</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${Math.random() > 0.5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                    {Math.random() > 0.5 ? 'Bullish' : 'Neutral'}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="p-5 text-right">
                              <button className="btn-xs btn-outline rounded-lg font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile List */}
                    <div className="lg:hidden flex flex-col divide-y divide-white/5">
                      {marketSurface.map((token) => (
                        <div 
                          key={token.id}
                          onClick={() => handleTokenSelect(token)}
                          className={`p-4 flex items-center justify-between transition-all cursor-pointer ${currentToken?.id === token.id ? 'bg-blue-600/10' : 'active:bg-white/5'}`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={token.image} className="w-10 h-10 rounded-full border border-white/10" />
                            <div>
                              <div className="font-black text-white text-sm">{token.symbol}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase">{token.sector || 'DEFI'}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className="font-black text-white text-sm">${formatPrice(token.priceUsd)}</div>
                              <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${(token.priceChange24h || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {(token.priceChange24h || 0) >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {(token.priceChange24h || 0).toFixed(2)}%
                              </div>
                            </div>
                            <button className="btn-xs btn-outline rounded-lg font-black uppercase tracking-widest">
                              Inspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            )}

            {activeView === ViewState.TECHNICAL && (
              <div className="flex flex-col gap-6 lg:gap-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[500px]">
                  <div className="h-[300px] lg:h-full">
                    <RetinaDisplay data={techData ? [techData.volatility, techData.rsi] : []} type="GAF" />
                  </div>
                  <div className="h-[300px] lg:h-full">
                    <OrderFlow3D price={currentToken?.priceUsd || 100} symbol={currentToken?.symbol || 'ETH'} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
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
              <div id="graph-view" className="flex flex-col gap-8 h-full overflow-y-auto scrollbar-hide">
                <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[32px] flex items-center gap-6">
                  <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg">
                    <Network size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-emerald-400">Entity Topology Benefits</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
                      Visualize the "Social Alpha" and "Whale Flow". 
                      <span className="text-white font-bold ml-1">Benefit:</span> Identify where the money is moving before it hits the price. Retail users can follow institutional footprints to avoid being exit liquidity.
                    </p>
                  </div>
                </div>
                <div className="h-[600px] bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col relative shrink-0">
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
                
                <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col shrink-0">
                  <div className="p-6 border-b border-white/5 bg-black/40">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-emerald-500">
                      <BarChart3 size={16}/> Entropy & Concentration Metrics
                    </h2>
                  </div>
                  <EntropyCharts 
                    symbol={currentToken?.symbol || 'ETH'} 
                    price={currentToken?.priceUsd || 0} 
                  />
                </div>
              </div>
            )}

            {activeView === ViewState.ALPHA_FORGE && (
              <div id="alpha-forge" className="flex flex-col gap-8">
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[32px] flex items-center gap-6">
                  <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg">
                    <BrainCircuit size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-blue-400">What is Alpha Forge?</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
                      Alpha Forge is our proprietary strategy engine. It allows you to combine high-frequency data factors into custom trading signals. 
                      <span className="text-white font-bold ml-1">Benefit:</span> Quantify your edge by backtesting strategies against historical liquidity gaps and order flow imbalances.
                    </p>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'} rounded-[32px] border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} overflow-hidden flex flex-col min-h-[500px] lg:min-h-[650px] shadow-2xl`}>
                  <AlphaForge 
                    currentToken={currentToken} 
                    onFactorGenerated={(factor) => {
                      console.log("Factor Generated:", factor);
                    }} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            
            {/* NEWS TERMINAL */}
            <div className="h-[500px]">
              <NewsTerminal userMode={userMode} />
            </div>

            {/* MODE-SPECIFIC FEED PANEL */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[440px]">
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
                              {userMode === UserMode.INSTITUTIONAL ? `$${(t_item.amount || 0).toLocaleString()} ${t_item.symbol}` : `HEAT: +${((t_item.amount || 0) / 100).toFixed(0)}%`}
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

            <MarketIntelligence 
              temperature={marketTemp} 
              regime={marketRegime} 
              lambda={kylesLambda} 
            />

            <div className={`rounded-[40px] lg:rounded-[56px] border ${userMode === UserMode.INSTITUTIONAL ? 'bg-[#0f0f0f] border-blue-900/20' : 'bg-[#120a0a] border-red-900/20'} p-6 lg:p-10 shadow-2xl flex flex-col min-h-[400px] lg:min-h-[500px] relative overflow-hidden group transition-all duration-700`}>
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full" />
               <div className="flex flex-col gap-6 mb-8 z-10">
                 <div className="flex justify-between items-center">
                   <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                     <Cpu size={18} className={userMode === UserMode.INSTITUTIONAL ? 'text-blue-500' : 'text-red-500'} /> 
                     {userMode === UserMode.INSTITUTIONAL ? t.prediction_24h : t.roi_signal}
                   </h2>
                   {isAnalyzing && <RefreshCw size={24} className="animate-spin text-blue-500" />}
                 </div>

                 {/* Retail Trading Mode Toggle */}
                 {userMode === UserMode.RETAIL && (
                   <div className="flex p-1 bg-black/40 border border-white/5 rounded-xl w-fit">
                      <button 
                        onClick={() => setRetailTradingMode('SPOT')}
                        className={`btn-xs rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-2 ${retailTradingMode === 'SPOT' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-white'}`}
                      >
                         <Coins size={12} /> Spot
                      </button>
                      <button 
                        onClick={() => setRetailTradingMode('FUTURES')}
                        disabled={currentToken?.isContract}
                        title={currentToken?.isContract ? "Futures unavailable for custom contracts" : "High Leverage"}
                        className={`btn-xs rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-2 ${retailTradingMode === 'FUTURES' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-white'} ${currentToken?.isContract ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                         <CandlestickChart size={12} /> Futures
                      </button>
                   </div>
                 )}
               </div>

               {report ? (
                 <div className="animate-fade-in flex flex-col flex-1 z-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className={`px-5 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                         report.directive?.match(/BUY|LONG/) ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
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
                    
                    <p className="text-sm text-gray-500 leading-relaxed font-medium mb-10 whitespace-pre-wrap">
                      {userMode === UserMode.INSTITUTIONAL ? report.retina_interpretation : report.retail_reasoning}
                    </p>

                    <button 
                      onClick={() => setIsExecutionModalOpen(true)}
                      className="btn-primary w-full py-6 text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 mt-auto"
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
                  className={`btn-primary w-full py-7 text-[12px] uppercase tracking-[0.5em] ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-600' : 'bg-red-600 hover:bg-red-700'}`}
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
              marketRegime={marketRegime}
              kylesLambda={kylesLambda}
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

      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-6 z-[100] animate-fade-in">
          <ShieldCheck size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{notification}</span>
          <button onClick={() => setNotification(null)}><X size={20}/></button>
        </div>
      )}
    </div>
  );
};

export default App;
