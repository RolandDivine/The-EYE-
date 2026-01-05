
import React from 'react';

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
  const maxVolume = Math.max(...bids.map(b => b.size || 0), ...asks.map(a => a.size || 0), 1);
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

      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {/* ASKS (Sellers) */}
        {[...asks].reverse().map((ask, idx) => (
          <div key={`ask-${idx}`} className="flex items-center group">
             <div className="w-16 text-[10px] text-red-400 mono">{(ask.price || 0).toFixed(2)}</div>
             <div className="flex-1 h-3 bg-red-900/10 relative overflow-hidden rounded">
                <div 
                  className={`h-full ${ask.isAnomalous ? 'bg-orange-500/80 animate-pulse' : 'bg-red-500/30'}`} 
                  style={{ width: `${((ask.size || 0) / maxVolume) * 100}%` }}
                />
                {ask.isAnomalous && (
                  <div className="absolute inset-0 flex items-center justify-end px-2 text-[8px] text-orange-200 mono">
                    ICEBERG_SUSPECTED
                  </div>
                )}
             </div>
             <div className="w-12 text-right text-[10px] text-gray-400 ml-2 mono">{(ask.size || 0).toFixed(1)}</div>
          </div>
        ))}

        <div className="py-2 border-y border-white/10 text-center text-[10px] text-gray-500 mono font-bold bg-white/5">
          MID: {midPrice.toFixed(2)}
        </div>

        {/* BIDS (Buyers) */}
        {bids.map((bid, idx) => (
          <div key={`bid-${idx}`} className="flex items-center group">
             <div className="w-16 text-[10px] text-green-400 mono">{(bid.price || 0).toFixed(2)}</div>
             <div className="flex-1 h-3 bg-green-900/10 relative overflow-hidden rounded">
                <div 
                  className={`h-full ${bid.isAnomalous ? 'bg-blue-500/80 animate-pulse' : 'bg-green-500/30'}`} 
                  style={{ width: `${((bid.size || 0) / maxVolume) * 100}%` }}
                />
                {bid.isAnomalous && (
                  <div className="absolute inset-0 flex items-center justify-end px-2 text-[8px] text-blue-200 mono">
                    SPOOFING_DETECTED
                  </div>
                )}
             </div>
             <div className="w-12 text-right text-[10px] text-gray-400 ml-2 mono">{(bid.size || 0).toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiquidityHeatmap;
