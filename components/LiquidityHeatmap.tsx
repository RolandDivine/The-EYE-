
import React, { useMemo } from 'react';

interface LOBEntry {
  price: number;
  size: number;
  isAnomalous?: boolean;
}

interface LiquidityHeatmapProps {
  bids: LOBEntry[];
  asks: LOBEntry[];
}

const LiquidityHeatmap: React.FC<LiquidityHeatmapProps> = ({ bids, asks }) => {
  const maxVol = Math.max(...bids.map(b => b.size), ...asks.map(a => a.size), 1);
  
  // Calculate cumulative depth
  const bidsWithDepth = useMemo(() => {
      let cum = 0;
      return bids.map(b => { cum += b.size; return { ...b, cum }; });
  }, [bids]);
  
  const asksWithDepth = useMemo(() => {
      let cum = 0;
      return asks.map(a => { cum += a.size; return { ...a, cum }; });
  }, [asks]);

  const maxCum = Math.max(
      bidsWithDepth[bidsWithDepth.length - 1]?.cum || 0,
      asksWithDepth[asksWithDepth.length - 1]?.cum || 0,
      1
  );

  const midPrice = (bids.length > 0 && asks.length > 0) ? ((bids[0].price + asks[0].price) / 2) : 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] p-4 rounded-lg border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          L3 Liquidity Heatmap
        </h3>
        <span className="bg-red-900/20 text-red-500 px-2 py-0.5 rounded text-[10px] mono">
          LIVE: CO-LOCATED LD4
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-0.5">
        {/* ASKS (Sellers) - Stacked from top */}
        {[...asksWithDepth].reverse().map((ask, idx) => (
          <div key={`ask-${idx}`} className="flex items-center group relative h-6 hover:bg-white/5 transition-colors">
             {/* Depth Background */}
             <div 
               className="absolute right-0 top-0 bottom-0 bg-red-900/10 transition-all duration-500"
               style={{ width: `${(ask.cum / maxCum) * 100}%` }}
             />
             
             {/* Price */}
             <div className="w-16 text-[10px] text-red-400 mono z-10 pl-2">{(ask.price || 0).toFixed(2)}</div>
             
             {/* Vol Bar */}
             <div className="flex-1 h-full mx-2 flex items-center justify-end">
                <div 
                  className={`h-1.5 rounded-sm transition-all duration-300 ${ask.isAnomalous ? 'bg-orange-500 animate-pulse' : 'bg-red-500/40 group-hover:bg-red-500/60'}`} 
                  style={{ width: `${Math.max(1, (ask.size / maxVol) * 100)}%` }}
                />
             </div>

             {/* Size */}
             <div className="w-12 text-right text-[10px] text-gray-400 mono z-10 pr-1">{(ask.size || 0).toFixed(1)}</div>
          </div>
        ))}

        <div className="py-2 border-y border-white/10 text-center text-[10px] text-gray-500 mono font-bold bg-white/5 my-1">
          MID PRICE: {midPrice.toFixed(2)}
        </div>

        {/* BIDS (Buyers) */}
        {bidsWithDepth.map((bid, idx) => (
          <div key={`bid-${idx}`} className="flex items-center group relative h-6 hover:bg-white/5 transition-colors">
             {/* Depth Background */}
             <div 
               className="absolute right-0 top-0 bottom-0 bg-green-900/10 transition-all duration-500"
               style={{ width: `${(bid.cum / maxCum) * 100}%` }}
             />

             {/* Price */}
             <div className="w-16 text-[10px] text-green-400 mono z-10 pl-2">{(bid.price || 0).toFixed(2)}</div>
             
             {/* Vol Bar */}
             <div className="flex-1 h-full mx-2 flex items-center justify-end">
                <div 
                  className={`h-1.5 rounded-sm transition-all duration-300 ${bid.isAnomalous ? 'bg-blue-500 animate-pulse' : 'bg-green-500/40 group-hover:bg-green-500/60'}`} 
                  style={{ width: `${Math.max(1, (bid.size / maxVol) * 100)}%` }}
                />
             </div>

             {/* Size */}
             <div className="w-12 text-right text-[10px] text-gray-400 mono z-10 pr-1">{(bid.size || 0).toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiquidityHeatmap;
