
import React from 'react';
import { DollarSign, TrendingUp, Wallet, Target, Activity } from 'lucide-react';

interface ProfitSimulatorProps {
  capital: number;
  onCapitalChange: (val: number) => void;
  report: any;
  currentPrice: number;
  strategy: string;
}

const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({ capital, onCapitalChange, report, currentPrice, strategy }) => {
  
  const entry = report?.entry_price || currentPrice;
  const target = report?.target_exit || (currentPrice * 1.05);
  const upsidePercent = entry > 0 ? ((target - entry) / entry) * 100 : 0;
  const projectedProfit = (capital * (upsidePercent / 100));
  
  const probability = report?.probability_success || 0.5;

  return (
    <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={80} />
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
            <Wallet size={20} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Profit Projection</h3>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <span className="text-[9px] font-black text-white mono uppercase">{strategy} MODE</span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
          <label className="text-[9px] text-gray-500 uppercase mono font-bold block mb-3 tracking-widest">Investment Allocation (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="number"
              value={capital}
              onChange={(e) => onCapitalChange(Number(e.target.value))}
              className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg mono font-bold focus:outline-none focus:border-red-600/50 transition-all text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Target Gain</span>
                <span className="text-sm font-black text-green-400 mono">+{upsidePercent.toFixed(2)}%</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Execution Probability</span>
                <span className="text-sm font-black text-blue-400 mono">{(probability * 100).toFixed(0)}%</span>
            </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Projected P&L</span>
              <span className={`text-3xl mono font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]`}>
                +${projectedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-gray-600 uppercase font-bold block">Estimated Return</span>
              <span className="text-xs text-gray-400 font-bold">${(capital + projectedProfit).toLocaleString()}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
             <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000" 
                style={{ width: `${probability * 100}%` }}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitSimulator;
