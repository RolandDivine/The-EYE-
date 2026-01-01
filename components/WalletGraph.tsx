
import React, { useEffect, useRef } from 'react';
import { Share2, Zap, AlertTriangle, Target, Box } from 'lucide-react';

interface WalletNode {
  id: string;
  type: 'CORE' | 'SNIPER' | 'RETAIL';
  val: number;
}

interface WalletGraphProps {
  data: {
    nodes: WalletNode[];
    links: { source: string; target: string }[];
  } | null;
}

const WalletGraph: React.FC<WalletGraphProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!data) return (
    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-12">
      <Share2 size={48} className="mb-4 text-gray-500" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Scan Required to Initialize Topology</p>
    </div>
  );

  return (
    <div className="h-full w-full relative overflow-hidden p-8 flex flex-col" ref={containerRef}>
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Wallet Constellation</h3>
          <p className="text-[9px] text-red-400 mono">DETECTING MATH_BOT_CLUSTERS...</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full flex items-center gap-2">
          <Zap size={12} className="text-red-500" />
          <span className="text-[9px] font-black text-red-500 uppercase">High Risk Linked</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {/* The Central Malicious Hub */}
        <div className="relative z-20 group">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_60px_rgba(220,38,38,0.6)] animate-pulse cursor-pointer transition-transform group-hover:scale-110">
            <Target className="text-white" size={32} />
          </div>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-red-500/50 px-3 py-1 rounded-lg text-[9px] mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            FUNDER: 0x71C...4f9 (MEV_CONTROLLER)
          </div>
        </div>

        {/* The Satellite Snipers */}
        {data.nodes.slice(1).map((node, i) => {
          const angle = (i * (360 / (data.nodes.length - 1))) * (Math.PI / 180);
          const radius = 160;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isSniper = node.type === 'SNIPER';

          return (
            <React.Fragment key={node.id}>
              {/* Animated Connecting Line */}
              <div 
                className={`absolute h-px origin-left z-10 transition-all duration-1000 ${isSniper ? 'bg-gradient-to-r from-red-600 to-transparent' : 'bg-gradient-to-r from-white/20 to-transparent'}`}
                style={{ 
                  width: `${radius}px`,
                  transform: `rotate(${angle * (180/Math.PI)}deg)`,
                  left: '50%',
                  top: '50%'
                }}
              >
                {/* Transaction Flow Particle */}
                <div className={`absolute w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white] animate-flow-right`} 
                     style={{ animationDelay: `${i * 0.2}s` }} />
              </div>

              {/* Satellite Node with Pulsing and Hover Scaling */}
              <div 
                className={`absolute w-10 h-10 rounded-xl border-2 border-black z-20 flex items-center justify-center transition-all cursor-help group/node animate-pulse hover:animate-none hover:scale-125 ${
                  isSniper ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-gray-800'
                }`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {isSniper ? <Zap size={14} className="text-white group-hover/node:scale-110 transition-transform" /> : <Box size={14} className="text-gray-400 group-hover/node:scale-110 transition-transform" />}
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] mono text-gray-300 opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-30">
                  {node.id} ({node.type})
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="h-12 border-t border-white/5 mt-auto flex items-center justify-between text-[9px] mono text-gray-600 uppercase tracking-widest px-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/> SNIPER_BOT</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"/> RETAIL_WALLET</span>
        </div>
        <span>Network Integrity: COMPROMISED</span>
      </div>

      <style>{`
        @keyframes flow-right {
          0% { left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-flow-right {
          animation: flow-right 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default WalletGraph;
