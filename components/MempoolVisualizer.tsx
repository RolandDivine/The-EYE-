
import React, { useMemo, useState, useEffect } from 'react';
import { Zap, AlertTriangle, Box, Layers, Activity, Filter, Check, Pause, Play, ExternalLink, X, FileText } from 'lucide-react';

interface MempoolTx {
  id: string;
  gasPrice: number;
  value: number;
  time: number;
  type: string;
  isMEV: boolean;
}

interface MempoolVisualizerProps {
  data: MempoolTx[];
}

const StatCard = ({ label, value, sub, icon, color }: any) => (
  <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl flex flex-col gap-1 group hover:border-white/10 transition-colors">
     <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
        <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>{icon}</div>
     </div>
     <div className="text-xl font-black text-white uppercase tracking-tight">{value}</div>
     <div className={`text-[9px] font-bold ${color} opacity-80`}>{sub}</div>
  </div>
);

const MempoolVisualizer: React.FC<MempoolVisualizerProps> = ({ data }) => {
  // Feed Control
  const [isPaused, setIsPaused] = useState(false);
  const [visibleData, setVisibleData] = useState<MempoolTx[]>(data);

  // Filters
  const [filterType, setFilterType] = useState<'ALL' | 'SWAP' | 'TRANSFER'>('ALL');
  const [filterMEV, setFilterMEV] = useState(false);
  const [minGas, setMinGas] = useState<string>('');
  const [maxVal, setMaxVal] = useState<string>('');

  // Modal
  const [selectedTx, setSelectedTx] = useState<MempoolTx | null>(null);

  // Sync data when not paused
  useEffect(() => {
    if (!isPaused) {
      setVisibleData(data);
    }
  }, [data, isPaused]);

  // Derived Stats based on VISIBLE data (snapshot)
  const avgGas = useMemo(() => visibleData.reduce((acc, tx) => acc + tx.gasPrice, 0) / (visibleData.length || 1), [visibleData]);
  const mevCount = useMemo(() => visibleData.filter(tx => tx.isMEV).length, [visibleData]);
  const totalValue = useMemo(() => visibleData.reduce((acc, tx) => acc + tx.value, 0), [visibleData]);

  const filteredData = useMemo(() => {
    return visibleData.filter(tx => {
      if (filterType !== 'ALL' && tx.type.toUpperCase() !== filterType) return false;
      if (filterMEV && !tx.isMEV) return false;
      if (minGas && tx.gasPrice < parseFloat(minGas)) return false;
      if (maxVal && tx.value > parseFloat(maxVal)) return false;
      return true;
    });
  }, [visibleData, filterType, filterMEV, minGas, maxVal]);

  const handleExternalLink = (e: React.MouseEvent, txId: string) => {
    e.stopPropagation();
    // Simulate real Etherscan link with a placeholder since IDs are synthetic
    window.open(`https://etherscan.io/tx/${txId}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Network Congestion" value={`${(avgGas).toFixed(1)} Gwei`} sub="Base Fee + Priority" icon={<Activity size={16}/>} color="text-yellow-400" />
        <StatCard label="MEV Threat Level" value={mevCount > 5 ? 'CRITICAL' : 'MODERATE'} sub={`${mevCount} Bot Tx Detected`} icon={<AlertTriangle size={16}/>} color={mevCount > 5 ? "text-red-500" : "text-orange-400"} />
        <StatCard label="Pending Liquidity" value={`$${(totalValue * 2800).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Est. Block Value" icon={<Box size={16}/>} color="text-blue-400" />
        <StatCard label="Block Utilization" value="84%" sub="Target: 50%" icon={<Layers size={16}/>} color="text-green-400" />
      </div>

      {/* Main Feed */}
      <div className="flex-1 bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden flex flex-col shadow-2xl relative h-[500px]">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent z-20" />
         
         {/* Control Bar */}
         <div className="p-6 border-b border-white/5 bg-black/40 flex flex-col gap-4 z-10">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-yellow-500">
                    <Zap size={16}/> Live Mempool Stream (Geth Node)
                    </h2>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold">
                        <span>Block #{18429100 + Math.floor(Date.now() / 12000)}</span>
                        <div className={`w-1 h-1 rounded-full bg-yellow-500 ${!isPaused ? 'animate-pulse' : ''}`} />
                    </div>
                </div>
                
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPaused ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                   {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                   {isPaused ? "Resume Feed" : "Pause Stream"}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
               <div className="bg-black/40 border border-white/10 rounded-lg p-1 flex items-center">
                  {(['ALL', 'SWAP', 'TRANSFER'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded text-[9px] font-black transition-all ${filterType === type ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                      >
                          {type}
                      </button>
                  ))}
               </div>
               
               <button 
                  onClick={() => setFilterMEV(!filterMEV)}
                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-black flex items-center gap-2 transition-all ${filterMEV ? 'bg-red-500/10 border-red-500/40 text-red-500' : 'bg-black/40 border-white/10 text-gray-600 hover:border-white/20'}`}
               >
                   <AlertTriangle size={10} />
                   MEV ONLY
                   {filterMEV && <Check size={10} />}
               </button>

               <div className="h-6 w-px bg-white/10 mx-1" />

               <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-[9px] text-gray-500 font-bold">MIN GAS</span>
                  <input 
                    type="number" 
                    value={minGas}
                    onChange={(e) => setMinGas(e.target.value)}
                    placeholder="0"
                    className="w-12 bg-transparent text-[9px] text-white font-mono focus:outline-none text-right"
                  />
               </div>

               <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-[9px] text-gray-500 font-bold">MAX ETH</span>
                  <input 
                    type="number" 
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    placeholder="∞"
                    className="w-12 bg-transparent text-[9px] text-white font-mono focus:outline-none text-right"
                  />
               </div>
            </div>
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <div className="grid grid-cols-12 px-4 py-2 text-[8px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-[#0a0a0a] z-10">
               <div className="col-span-2">Tx Hash</div>
               <div className="col-span-1">Method</div>
               <div className="col-span-2 text-right">Value (ETH)</div>
               <div className="col-span-2 text-right">Gas Price</div>
               <div className="col-span-3 text-center">Threat Assessment</div>
               <div className="col-span-2 text-right">Time</div>
            </div>
            {filteredData.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    No transactions match filters
                </div>
            ) : filteredData.map((tx, idx) => (
               <div 
                key={`${tx.id}-${tx.time}`} 
                onClick={() => setSelectedTx(tx)}
                className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl border border-transparent transition-all hover:bg-white/5 cursor-pointer animate-slide-in ${tx.isMEV ? 'bg-red-500/5 border-red-500/10' : ''}`}
                style={{ animationDelay: `${idx * 0.02}s` }}
               >
                  <div className="col-span-2 flex items-center gap-2 group/hash">
                     <div className={`w-1.5 h-1.5 rounded-full ${tx.isMEV ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                     <span className="text-[10px] mono text-gray-400 group-hover/hash:text-white transition-colors">0x{tx.id.split('-')[1].padStart(4, '0')}...</span>
                     <button 
                        onClick={(e) => handleExternalLink(e, tx.id)}
                        className="opacity-0 group-hover/hash:opacity-100 p-1 hover:bg-white/10 rounded text-blue-400 transition-all"
                     >
                        <ExternalLink size={10} />
                     </button>
                  </div>
                  <div className="col-span-1">
                     <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${tx.type === 'swap' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                        {tx.type}
                     </span>
                  </div>
                  <div className="col-span-2 text-right text-[10px] mono text-white">
                     {tx.value.toFixed(4)}
                  </div>
                  <div className="col-span-2 text-right text-[10px] mono text-yellow-500">
                     {tx.gasPrice.toFixed(1)} <span className="text-gray-600">gwei</span>
                  </div>
                  <div className="col-span-3 flex justify-center">
                     {tx.isMEV ? (
                        <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                           <AlertTriangle size={10} />
                           <span className="text-[8px] font-black uppercase">Sandwich</span>
                        </div>
                     ) : (
                        <span className="text-[8px] text-gray-700 font-bold uppercase">Safe</span>
                     )}
                  </div>
                  <div className="col-span-2 text-right text-[9px] mono text-gray-500">
                     -{idx * 100}ms
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative animate-slide-in">
                <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${selectedTx.isMEV ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Transaction Details</h3>
                        <p className="text-[10px] text-gray-500 mono">Hash: 0x{selectedTx.id}...</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-4 rounded-2xl">
                             <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">From</span>
                             <span className="text-[10px] mono text-white block truncate">0x{Math.random().toString(16).substr(2, 40)}</span>
                         </div>
                         <div className="bg-white/5 p-4 rounded-2xl">
                             <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">To</span>
                             <span className="text-[10px] mono text-white block truncate">0x{Math.random().toString(16).substr(2, 40)}</span>
                         </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                        <div>
                             <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Value</span>
                             <span className="text-lg font-black text-white">{selectedTx.value.toFixed(6)} ETH</span>
                        </div>
                         <div className="text-right">
                             <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Est. Gas Used</span>
                             <span className="text-xs font-bold text-yellow-500 mono">{(21000 + Math.random() * 50000).toFixed(0)}</span>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                         <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-2">Input Data (Truncated)</span>
                         <div className="font-mono text-[9px] text-gray-400 break-all leading-relaxed">
                            0xa9059cbb000000000000000000000000{Math.random().toString(16).substr(2, 20)}...
                         </div>
                    </div>
                    
                    <button 
                        onClick={(e) => handleExternalLink(e, selectedTx.id)}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white transition-all"
                    >
                        <ExternalLink size={12} />
                        View on Block Explorer
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MempoolVisualizer;
