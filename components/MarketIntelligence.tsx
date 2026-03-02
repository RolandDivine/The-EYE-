
import React from 'react';
import { motion } from 'motion/react';
import { Thermometer, Zap, Activity, Info } from 'lucide-react';

interface MarketIntelligenceProps {
  temperature: number;
  regime: string;
  lambda: number;
}

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ temperature, regime, lambda }) => {
  const getTempColor = (temp: number) => {
    if (temp > 70) return 'text-red-500';
    if (temp > 40) return 'text-orange-500';
    return 'text-emerald-500';
  };

  const getTempBg = (temp: number) => {
    if (temp > 70) return 'bg-red-500/20';
    if (temp > 40) return 'bg-orange-500/20';
    return 'bg-emerald-500/20';
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${getTempBg(temperature)} ${getTempColor(temperature)}`}>
            <Thermometer size={20} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Market Intelligence</h3>
        </div>
        <div className="p-1.5 bg-white/5 rounded-full text-gray-600 hover:text-white cursor-help transition-colors">
          <Info size={14} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Temperature Gauge */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Market Temperature</span>
            <span className={`text-xl font-black mono ${getTempColor(temperature)}`}>{temperature.toFixed(1)}°</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${temperature}%` }}
              className={`h-full transition-all duration-1000 ${
                temperature > 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                temperature > 40 ? 'bg-gradient-to-r from-emerald-500 to-orange-500' :
                'bg-emerald-500'
              }`}
            />
          </div>
          <p className="text-[8px] text-gray-600 uppercase font-bold text-center tracking-tighter">
            {temperature > 70 ? 'HIGH ENTROPY - EXTREME UNCERTAINTY' : 
             temperature > 40 ? 'STABLE VOLATILITY - MODERATE RISK' : 
             'LOW ENTROPY - PREDICTABLE FLOW'}
          </p>
        </div>

        {/* Kyle's Lambda */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Zap size={14} />
            </div>
            <div>
              <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Kyle's Lambda (λ)</p>
              <p className="text-xs font-black text-white mono">{lambda.toFixed(4)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-gray-600 font-bold uppercase">Price Impact</p>
            <p className={`text-[9px] font-black ${lambda > 0.05 ? 'text-red-400' : 'text-emerald-400'}`}>
              {lambda > 0.05 ? 'HIGH' : 'LOW'}
            </p>
          </div>
        </div>

        {/* Regime Badge */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Activity size={14} />
          </div>
          <div className="flex-1">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Active Regime</p>
            <p className="text-xs font-black text-white uppercase tracking-tight">{regime.replace('_', ' ')}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        </div>

        {/* Glossary / Benefits Section */}
        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Info size={12} className="text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Intelligence Glossary</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[8px] font-black text-white uppercase block">λ (Kyle's Lambda)</span>
              <p className="text-[8px] text-zinc-500 font-medium leading-tight">Measures how much the price moves per $1M of volume. High λ = Low Liquidity.</p>
            </div>
            <div>
              <span className="text-[8px] font-black text-white uppercase block">Active Regime</span>
              <p className="text-[8px] text-zinc-500 font-medium leading-tight">The current market "mood" (e.g., Trending vs. Ranging). Tells you which strategies work best.</p>
            </div>
            <div>
              <span className="text-[8px] font-black text-white uppercase block">COWs (Coincidence of Wants)</span>
              <p className="text-[8px] text-zinc-500 font-medium leading-tight">MEV-protected trade matching. Saves you money by avoiding sandwich attacks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
