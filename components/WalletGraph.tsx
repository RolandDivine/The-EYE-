
import React, { useEffect, useRef, useState } from 'react';
import { Share2, Zap, AlertTriangle, Target, Box, Info, ArrowRightLeft, MousePointer2, Globe, Shield, RefreshCw, Layers, ZapOff, Activity, Navigation } from 'lucide-react';
import * as d3 from 'd3';

interface WalletNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'CORE' | 'SNIPER' | 'RETAIL';
  val: number;
  label?: string;
  noteType?: string;
  behaviorNote?: string;
  x?: number;
  y?: number;
}

interface WalletLink extends d3.SimulationLinkDatum<WalletNode> {
  source: string | WalletNode;
  target: string | WalletNode;
  flowValue?: number;
  isRouting?: boolean;
  isProtected?: boolean;
}

interface WalletGraphProps {
  data: {
    nodes: WalletNode[];
    links: WalletLink[];
  } | null;
}

const WalletGraph: React.FC<WalletGraphProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<WalletNode[]>([]);
  const [links, setLinks] = useState<WalletLink[]>([]);
  const [hoveredNode, setHoveredNode] = useState<WalletNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<WalletNode | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.75 });

  useEffect(() => {
    if (!data || !containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const simulationNodes: WalletNode[] = data.nodes.map(d => {
        let noteType = 'Latent Wallet';
        let behaviorNote = 'Standard retail activity detected.';
        
        if (d.id.includes('NQ')) {
            noteType = 'Institutional House';
            behaviorNote = 'NQ Swap core engine. Protected liquidity routing.';
        } else if (d.id.includes('Binance') || d.id.includes('Coinbase')) {
            noteType = 'Global Liquidity Hub';
            behaviorNote = 'High-volume CEX marketplace endpoint.';
        } else if (d.type === 'SNIPER') {
            noteType = 'MEV Arbitrageur';
            behaviorNote = 'Atomic bot cluster scanning for mempool slippage.';
        } else if (d.id.includes('Uni') || d.id.includes('Sushi')) {
            noteType = 'Liquidity Pool Node';
            behaviorNote = 'Decentralized automated market maker.';
        }

        return { ...d, noteType, behaviorNote };
    });
    const simulationLinks: WalletLink[] = data.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<WalletNode>(simulationNodes)
      .force("link", d3.forceLink<WalletNode, WalletLink>(simulationLinks).id(d => d.id).distance(240))
      .force("charge", d3.forceManyBody().strength(-1800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as WalletNode).id.includes('NQ-SWAP') ? 85 : (d as WalletNode).val * 3.8));

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => setTransform(event.transform));

    d3.select(svgRef.current).call(zoom);

    simulation.on("tick", () => {
      setNodes([...simulationNodes]);
      setLinks([...simulationLinks]);
    });

    return () => simulation.stop();
  }, [data]);

  if (!data) return (
    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-12 bg-[#0a0a0a] rounded-[32px] border border-white/5">
      <Share2 size={48} className="mb-4 text-gray-500" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Scan Required to Initialize Topology</p>
    </div>
  );

  const getNodeStyles = (node: WalletNode) => {
    const id = node.id;
    const isSelected = selectedNode?.id === node.id;
    
    if (id.includes('NQ-SWAP')) return `bg-gradient-to-br from-indigo-600 to-blue-900 ${isSelected ? 'border-white' : 'border-indigo-400'} shadow-[0_0_60px_rgba(79,70,229,0.5)] ring-4 ring-indigo-500/20`;
    if (id.includes('Binance')) return `bg-yellow-500 ${isSelected ? 'border-white' : 'border-yellow-300'} shadow-[0_0_40px_rgba(234,179,8,0.3)]`;
    if (id.includes('Coinbase')) return `bg-blue-500 ${isSelected ? 'border-white' : 'border-blue-300'} shadow-[0_0_40px_rgba(59,130,246,0.3)]`;
    if (id.includes('Uni') || id.includes('Sushi')) return `bg-pink-600 ${isSelected ? 'border-white' : 'border-pink-400'} shadow-[0_0_35px_rgba(219,39,119,0.2)]`;
    
    switch (node.type) {
      case 'SNIPER': return `bg-red-600 ${isSelected ? 'border-white' : 'border-red-400'} shadow-[0_0_20px_rgba(220,38,38,0.4)]`;
      default: return `bg-[#151515] ${isSelected ? 'border-indigo-500' : 'border-white/10'} shadow-none`;
    }
  };

  const isLinkActive = (link: WalletLink) => {
    const focusNode = selectedNode || hoveredNode;
    if (!focusNode) return true;
    const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
    const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;
    return sourceId === focusNode.id || targetId === focusNode.id;
  };

  const handleNodeClick = (node: WalletNode) => {
    if (selectedNode?.id === node.id) setSelectedNode(null);
    else setSelectedNode(node);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#030303] rounded-[32px] border border-white/5 flex flex-col" ref={containerRef}>
      
      {/* SOR Header Overlay */}
      <div className="absolute top-8 left-10 z-30 pointer-events-none">
        <div className="flex items-center gap-4 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl border border-indigo-400/30">
                <Shield size={20} className="text-white animate-pulse" />
            </div>
            <div>
                <h3 className="text-[13px] font-black text-white uppercase tracking-[0.4em]">NQ SOR Infrastructure</h3>
                <p className="text-[10px] text-indigo-400 mono font-black uppercase flex items-center gap-2">
                   <Activity size={12} /> Institutional Traffic Verified
                </p>
            </div>
        </div>
      </div>

      {/* Dynamic Hierarchy Legend */}
      <div className="absolute left-10 bottom-24 z-30 flex flex-col gap-3 p-6 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-[32px] min-w-[180px]">
        <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 px-1 border-b border-white/5 pb-2">Network Hierarchy</h4>
        {[
            { color: 'bg-indigo-600', label: 'NQ SOR HOUSE', shadow: 'shadow-indigo-500/40' },
            { color: 'bg-yellow-500', label: 'CEX MARKET HUB' },
            { color: 'bg-pink-600', label: 'DECENTRALIZED LP' },
            { color: 'bg-red-600', label: 'MEV CLUSTER', shadow: 'shadow-red-500/40' },
            { color: 'bg-gray-800', label: 'PRIVATE WALLET' }
        ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-1 group cursor-default">
               <div className={`w-2.5 h-2.5 rounded-sm ${item.color} ${item.shadow ? `shadow-lg ${item.shadow}` : ''} transition-transform group-hover:scale-125`} />
               <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
            </div>
        ))}
      </div>

      <svg ref={svgRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10">
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          <defs>
            <marker id="arrow-institutional" markerWidth="10" markerHeight="8" refX="28" refY="4" orient="auto">
                <path d="M0,0 L0,8 L10,4 z" fill="rgba(99, 102, 241, 0.5)" />
            </marker>
            <linearGradient id="nqGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </linearGradient>
            
            {/* Symbol Paths for Icons */}
            <symbol id="icon-shield" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </symbol>
            <symbol id="icon-router" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <rect x="2" y="14" width="20" height="8" rx="2" />
              <path d="M6 14v-4M18 14v-4" />
              <path d="M12 14v-7" />
            </symbol>
          </defs>

          {/* Links */}
          {links.map((link, i) => {
            const s = link.source as WalletNode;
            const t = link.target as WalletNode;
            if (s.x === undefined || t.x === undefined) return null;
            const isActive = isLinkActive(link);
            const focusNode = selectedNode || hoveredNode;
            const dimmed = focusNode && !isActive;
            const isHighlighted = focusNode && isActive;

            return (
              <g key={`flow-${i}`} className={`transition-opacity duration-700 ${dimmed ? 'opacity-5' : 'opacity-100'}`}>
                <line
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={link.isProtected ? "url(#nqGrad)" : "rgba(255,255,255,0.05)"}
                  strokeWidth={isHighlighted ? (link.isProtected ? "3.5" : "2") : (link.isProtected ? "2.5" : "1")}
                  marker-end={link.isProtected ? "url(#arrow-institutional)" : ""}
                  className="transition-all duration-300"
                />
                
                {/* Flow Group with Animation */}
                <g className="animate-flow-group">
                  <animateMotion
                    dur={`${1.5 + (isActive ? -0.5 : 0.5) + Math.random() * 2}s`}
                    repeatCount="indefinite"
                    path={`M ${s.x},${s.y} L ${t.x},${t.y}`}
                  />
                  
                  {/* The Particle */}
                  <circle 
                    r={link.isProtected ? (isHighlighted ? "3" : "2.2") : (isHighlighted ? "2" : "1.2")} 
                    fill={link.isProtected ? "#818cf8" : "rgba(255,255,255,0.4)"}
                    className="shadow-lg"
                  />
                  
                  {/* Subtle Icon next to particle */}
                  {isHighlighted && (
                    <g transform="translate(6, -6)">
                      {link.isProtected ? (
                        <use href="#icon-shield" width="8" height="8" className="text-indigo-400 opacity-60" />
                      ) : (
                        <use href="#icon-router" width="8" height="8" className="text-blue-400 opacity-60" />
                      )}
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;
            const isNQ = node.id.includes('NQ-SWAP');
            const size = isNQ ? 130 : node.val * 2.5;
            const styles = getNodeStyles(node);
            
            return (
              <foreignObject
                key={node.id}
                x={(node.x ?? 0) - size / 2}
                y={(node.y ?? 0) - size / 2}
                width={size}
                height={size}
                className="overflow-visible pointer-events-auto"
              >
                <div
                  className={`w-full h-full rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${styles}`}
                  style={{
                    transform: (isHovered || isSelected) ? 'scale(1.15)' : 'scale(1)',
                    opacity: (hoveredNode || selectedNode) && !(selectedNode?.id === node.id || hoveredNode?.id === node.id) && !isLinkActive({source: (selectedNode || hoveredNode) as any, target: node} as any) ? 0.1 : 1,
                    zIndex: isHovered || isSelected || isNQ ? 100 : 20,
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                >
                  {isNQ ? (
                    <div className="flex flex-col items-center justify-center">
                        <Shield size={size / 3.5} className="text-white mb-1 drop-shadow-lg" />
                        <span className="text-[10px] font-black text-white text-center leading-tight tracking-widest">NQ SWAP</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                        {node.id.includes('Binance') ? <span className="text-[10px] font-black text-black">BN</span> :
                         node.id.includes('Coinbase') ? <span className="text-[10px] font-black text-white">CB</span> :
                         node.type === 'SNIPER' ? <Zap size={16} className="text-white" /> :
                         <div className="w-2 h-2 rounded-full bg-white/20" />}
                    </div>
                  )}
                </div>

                {(isHovered || isSelected) && (
                  <div className="absolute top-1/2 left-full ml-10 -translate-y-1/2 bg-[#0a0a0a]/95 border border-white/10 p-6 rounded-[32px] shadow-2xl backdrop-blur-3xl z-[300] min-w-[260px] pointer-events-none animate-pop-in">
                    <div className="flex items-center gap-4 mb-5 pb-3 border-b border-white/5">
                       <div className={`p-2 rounded-xl ${isNQ ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-gray-800'}`}>
                         {isNQ ? <Shield size={16} /> : node.type === 'SNIPER' ? <ZapOff size={16} /> : <Layers size={16} />}
                       </div>
                       <div>
                        <span className="text-[12px] font-black text-white uppercase tracking-widest block mb-0.5">{node.label}</span>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{node.noteType}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1.5">Behavior Insight</span>
                        <p className="text-[10px] text-gray-200 leading-relaxed mono">{node.behaviorNote}</p>
                      </div>
                      
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[9px] text-gray-600 font-black uppercase">Node Valuation</span>
                        <span className="text-[11px] font-black text-white mono">${(node.val * 450000).toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center px-2">
                        <span className="text-[9px] text-gray-600 font-black uppercase">Active Channels</span>
                        <span className="text-[11px] font-black text-emerald-500 mono">{links.filter(l => (typeof l.source === 'string' ? l.source : (l.source as any).id) === node.id || (typeof l.target === 'string' ? l.target : (l.target as any).id) === node.id).length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </foreignObject>
            );
          })}
        </g>
      </svg>

      {/* Institutional Legend Status Bar */}
      <div className="h-20 border-t border-white/5 mt-auto flex items-center justify-between text-[8px] mono text-gray-500 uppercase tracking-[0.3em] px-12 bg-black/80 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-lg bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-400/20" />
            <span className="text-white font-black">NQ Swap: Smart Routing Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Encrypted Institutional Tunnel</span>
          </div>
        </div>
        <div className="flex items-center gap-4 py-2.5 px-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
          <Target size={14} />
          <span className="font-black tracking-[0.2em]">Anti-MEV Shield: ACTIVE (Tier-1)</span>
        </div>
      </div>

      <style>{`
        .animate-pop-in {
          animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translate(20px, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(0, -50%) scale(1); }
        }
        .animate-flow-group {
          filter: drop-shadow(0 0 4px currentColor);
        }
      `}</style>
    </div>
  );
};

export default WalletGraph;
