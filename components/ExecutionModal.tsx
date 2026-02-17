
import React, { useState, useEffect } from 'react';
import { X, Shield, CreditCard, Wallet, ChevronRight, Zap, RefreshCw, ShoppingCart, Info, Globe, CheckCircle2, ExternalLink, Link as LinkIcon, Activity } from 'lucide-react';
import { ExecutionVenue, Language } from '../types';
import { translations } from '../translations';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: any;
  userMode: string;
  lang: Language;
}

const VENUE_URLS: Record<ExecutionVenue, string> = {
  NQ_SWAP: 'https://nqswap.com',
  ASTER_DEX: 'https://asterdex.io',
  BINANCE: 'https://binance.com/en/trade',
  BYBIT: 'https://bybit.com/en/trade',
  UNISWAP_V4: 'https://app.uniswap.org'
};

const VenueLogo = ({ id }: { id: ExecutionVenue }) => {
  switch (id) {
    case 'BINANCE':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#FCD535] w-full h-full p-2">
          <path d="M12 3l-2.5 2.5 2.5 2.5 2.5-2.5L12 3zm-5 5l-2.5 2.5 2.5 2.5 2.5-2.5L7 8zm10 0l-2.5 2.5 2.5 2.5 2.5-2.5L17 8zm-5 5l-2.5 2.5 2.5 2.5 2.5-2.5L12 13zm0 5l-2.5 2.5 2.5 2.5 2.5-2.5L12 18z" />
        </svg>
      );
    case 'UNISWAP_V4':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#FF007A] w-full h-full p-1.5">
          <path d="M19.5 5c-3 0-4 3-6 5 2-5 0-7-2-7s-3 .5-4 3c-1 2.5 1 4 2 6 0 0-4 2-5 6 0 0-1.5 3 0 5s4 1 8 0 4-5 4-5l1-6c0-4-3-7-3-7z" />
        </svg>
      );
    case 'NQ_SWAP':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 w-full h-full p-2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12l4 4 4-4" />
        </svg>
      );
    case 'BYBIT':
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-full h-full p-2">
                <path d="M19 4h-4L4 16h4l11-12zm-8 16h4l7-8h-4l-7 8z"/>
            </svg>
        );
    default:
      return <Activity className="text-gray-400 w-full h-full p-2" />;
  }
};

const ExecutionModal: React.FC<ExecutionModalProps> = ({ isOpen, onClose, token, userMode, lang }) => {
  const [view, setView] = useState<'TYPE_SELECT' | 'FIAT_FLOW' | 'CRYPTO_FLOW' | 'PENDING' | 'SUCCESS'>('TYPE_SELECT');
  const [isRouting, setIsRouting] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<ExecutionVenue | null>(null);

  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      setView('TYPE_SELECT');
      setSelectedVenue(null);
      setIsRouting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExternalRedirect = (venue: ExecutionVenue) => {
    setSelectedVenue(venue);
    setIsRouting(true);
    const url = VENUE_URLS[venue];
    window.open(url, '_blank');

    setTimeout(() => {
      setIsRouting(false);
      setView('PENDING');
      setTimeout(() => {
        setView('SUCCESS');
      }, 5000);
    }, 800);
  };

  const handleFiatRedirect = (provider: string) => {
    window.open('https://www.moonpay.com/', '_blank');
    onClose();
  };

  const RenderVenue = ({ id, name, type, badge, best }: { id: ExecutionVenue, name: string, type: string, badge?: string, best?: boolean }) => (
    <button 
      onClick={() => handleExternalRedirect(id)}
      className={`w-full group p-4 rounded-[24px] border transition-all flex items-center justify-between mb-3 ${
        best ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 ${best ? 'bg-indigo-900/20' : 'bg-black/40'}`}>
          <VenueLogo id={id} />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-widest">{name}</span>
            {badge && <span className="text-[7px] font-black px-1.5 py-0.5 bg-indigo-500 text-white rounded">{badge}</span>}
          </div>
          <span className="text-[9px] text-gray-500 mono uppercase">{type} • Node Bridge</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 sm:p-0">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-[#080808] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-pop-in">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg">
                <ShoppingCart size={16} />
             </div>
             <div>
               <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Execution Matrix</h2>
               <p className="text-[9px] text-gray-500 mono font-bold uppercase">{token?.symbol} Bridge</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </header>

        <div className="p-8 min-h-[440px] flex flex-col">
          {view === 'TYPE_SELECT' && (
            <div className="space-y-6 animate-fade-in flex-1">
              <div className="mb-8">
                <h3 className="text-lg font-black text-white tracking-tight mb-2">Non-Custodial Dispatch</h3>
                <p className="text-xs text-gray-500 leading-relaxed">DFI Scope routes institutional data. Settlement occurs externally on vetted venues.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setView('FIAT_FLOW')}
                  className="group relative p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-4">
                    <CreditCard size={20} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">On-Ramp Flow</h4>
                  <p className="text-[10px] text-gray-500 mono">Connect Fiat via vetted providers. Direct liquidity injection.</p>
                </button>

                <button 
                  onClick={() => setView('CRYPTO_FLOW')}
                  className="group relative p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 hover:border-indigo-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl w-fit mb-4">
                    <Wallet size={20} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Market Venue Bridge</h4>
                  <p className="text-[10px] text-gray-500 mono">Bridge to CEX or DEX nodes for atomic execution.</p>
                </button>
              </div>
            </div>
          )}

          {view === 'FIAT_FLOW' && (
            <div className="animate-fade-in">
              <button onClick={() => setView('TYPE_SELECT')} className="text-[9px] text-indigo-400 font-black uppercase mb-6 flex items-center gap-2 hover:translate-x-1 transition-transform">
                <ChevronRight size={10} className="rotate-180" /> Back
              </button>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">{t.fiat_gate}</h3>
              <div className="space-y-4">
                {['MoonPay Institutional', 'Banxa Global', 'Stripe Treasury'].map((p) => (
                  <button key={p} onClick={() => handleFiatRedirect(p)} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                       <CreditCard size={14} className="text-emerald-500" />
                       <span className="text-xs font-bold text-white mono">{p}</span>
                    </div>
                    <ExternalLink size={14} className="text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'CRYPTO_FLOW' && (
            <div className="animate-fade-in relative flex-1">
              {isRouting && (
                <div className="absolute inset-0 z-50 bg-[#080808]/95 flex flex-col items-center justify-center gap-6">
                  <RefreshCw size={48} className="text-indigo-500 animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-black text-white uppercase tracking-[0.4em]">Bridging...</p>
                  </div>
                </div>
              )}
              
              <button onClick={() => setView('TYPE_SELECT')} className="text-[9px] text-indigo-400 font-black uppercase mb-6 flex items-center gap-2 hover:translate-x-1 transition-transform">
                <ChevronRight size={10} className="rotate-180" /> Back
              </button>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">{t.node_select}</h3>
              
              <RenderVenue id="NQ_SWAP" name="NQ Swap House" type="Partner SOR" badge="Recommended" best />
              <RenderVenue id="ASTER_DEX" name="AsterDEX" type="Atomic Node" />
              <RenderVenue id="BINANCE" name="Binance Terminal" type="Global CEX" />
              <RenderVenue id="UNISWAP_V4" name="Uniswap V4" type="DeFi Core" />
              <RenderVenue id="BYBIT" name="Bybit Pro" type="Perpetual Node" />
            </div>
          )}

          {view === 'PENDING' && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-10 text-center flex-1">
               <div className="relative mb-10">
                  <Activity size={80} className="text-indigo-500 animate-pulse opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <RefreshCw size={40} className="text-indigo-400 animate-spin" />
                  </div>
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-4">Pending Node Session</h3>
               <p className="text-xs text-gray-500 max-w-[320px] leading-relaxed mb-4">
                 Synchronizing with <span className="text-white font-bold">{selectedVenue?.replace('_', ' ')}</span>.
               </p>
               <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl">
                 <p className="text-[9px] text-indigo-400 mono font-black uppercase animate-pulse">Awaiting cross-chain trade confirmation...</p>
               </div>
            </div>
          )}

          {view === 'SUCCESS' && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-10 text-center flex-1">
               <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30">
                  <CheckCircle2 size={48} className="text-emerald-500 drop-shadow-glow" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Confirmation Received</h3>
               <button 
                onClick={onClose}
                className="w-full py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
               >
                 Close Terminal
               </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .drop-shadow-glow { filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5)); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default ExecutionModal;
