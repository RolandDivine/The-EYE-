
import React, { useEffect, useState } from 'react';
import { DollarSign, Wallet, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UserMode } from '../types';

interface ProfitSimulatorProps {
  capital: number;
  onCapitalChange: (val: number) => void;
  report: any;
  currentPrice: number;
  strategy: UserMode;
}

const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({ capital, onCapitalChange, report, currentPrice, strategy }) => {
  const [localVal, setLocalVal] = useState(capital.toString());
  const isInstitutional = strategy === UserMode.INSTITUTIONAL;
  
  const entry = report?.entry_price || currentPrice;
  const target = report?.target_exit || (currentPrice * 1.05);
  const upsidePercent = entry > 0 ? ((target - entry) / entry) * 100 : 0;
  const projectedProfit = (capital * (upsidePercent / 100));
  
  const probability = report?.probability_success || 0.5;

  // Keep local value in sync with prop for mode switches
  useEffect(() => {
    setLocalVal(capital.toString());
  }, [capital]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalVal(val);
    
    const num = Number(val);
    if (isNaN(num)) return;

    // Strict Enforcement of CQIO Bounds
    let corrected = num;
    if (isInstitutional) {
      if (num < 500000) corrected = 500000;
    } else {
      if (num > 500000) corrected = 500000;
      if (num < 0) corrected = 0;
    }

    // Delay update slightly to allow typing, but enforce bounds on blur or eventually
    onCapitalChange(corrected);
  };

  const handleBlur = () => {
    // Final snap to bounds on blur
    let num = Number(localVal);
    if (isNaN(num)) num = isInstitutional ? 500000 : 5000;

    if (isInstitutional) {
      if (num < 500000) num = 500000;
    } else {
      if (num > 500000) num = 500000;
      if (num < 0) num = 0;
    }
    setLocalVal(num.toString());
    onCapitalChange(num);
  };

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
        <div className={`px-3 py-1 border rounded-full ${isInstitutional ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
          <span className="text-[9px] font-black mono uppercase tracking-widest">{strategy}</span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
          <div className="flex justify-between items-center mb-3">
             <label className="text-[9px] text-gray-500 uppercase mono font-black tracking-widest">Allocation (USD)</label>
             <span className="text-[8px] text-gray-600 font-bold uppercase">
               {isInstitutional ? 'Limit: Min $500,000' : 'Limit: Max $500,000'}
             </span>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="number"
              value={localVal}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min={isInstitutional ? 500000 : 0}
              max={isInstitutional ? undefined : 500000}
              className={`w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg mono font-bold focus:outline-none transition-all text-white ${
                isInstitutional ? 'focus:border-blue-600/50' : 'focus:border-red-600/50'
              }`}
            />
            {((!isInstitutional && Number(localVal) >= 500000) || (isInstitutional && Number(localVal) <= 500000)) && (
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {isInstitutional ? <ShieldCheck size={14} className="text-blue-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
                 <span className="text-[8px] font-black text-gray-600 uppercase">Cap Reached</span>
               </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Target Gain</span>
                <span className="text-sm font-black text-green-400 mono">+{upsidePercent.toFixed(2)}%</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Execution Confidence</span>
                <span className="text-sm font-black text-blue-400 mono">{(probability * 100).toFixed(0)}%</span>
            </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Net Exposure Delta</span>
              <span className={`text-3xl mono font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]`}>
                +${projectedProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-gray-600 uppercase font-bold block">Terminal Return</span>
              <span className="text-xs text-gray-400 font-bold">${(capital + projectedProfit)?.toLocaleString() || '0'}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
             <div 
                className={`h-full shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000 ${
                   isInstitutional ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-red-600 to-red-400'
                }`} 
                style={{ width: `${probability * 100}%` }}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitSimulator;
