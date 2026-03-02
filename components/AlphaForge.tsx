
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Zap, Shield, BrainCircuit, Loader2, ChevronRight, Sparkles, Target, BarChart3, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { AlphaFactor, MarketRegime } from '../types';
import { generateAlphaFactor } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';

interface AlphaForgeProps {
  currentToken: any;
  onFactorGenerated: (factor: AlphaFactor) => void;
}

const AlphaForge: React.FC<AlphaForgeProps> = ({ currentToken, onFactorGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFactor, setGeneratedFactor] = useState<AlphaFactor | null>(null);

  // Synthetic backtest data
  const backtestData = Array.from({ length: 30 }, (_, i) => ({
    time: i,
    equity: 1000 + Math.sin(i / 2) * 100 + i * 15 + Math.random() * 50
  }));

  const handleForge = async () => {
    if (!prompt.trim() || !currentToken) return;
    setIsGenerating(true);
    try {
      const res = await generateAlphaFactor(prompt, {
        token: currentToken.name,
        price: currentToken.priceUsd
      });
      const factor: AlphaFactor = {
        id: Math.random().toString(36).substr(2, 9),
        ...res
      };
      setGeneratedFactor(factor);
      onFactorGenerated(factor);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <BrainCircuit className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Alpha Forge <span className="text-emerald-500/50">v2.0</span></h2>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">Neural Logic Synthesis Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Engine Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-white mono">SYNTH_READY</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[32px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[28px] p-6 shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your quantitative thesis... (e.g. 'Identify mean reversion opportunities when RSI < 30 and volume is 2.5x the 20-day moving average')"
                className="w-full h-32 bg-transparent border-none outline-none text-lg text-white placeholder:text-zinc-800 font-medium resize-none"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                    <Zap size={12} className="text-orange-500" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Low Latency</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                    <Shield size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Risk Guardrails</span>
                  </div>
                </div>
                <button
                  onClick={handleForge}
                  disabled={isGenerating || !prompt.trim()}
                  className="btn-primary bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-900 text-black text-xs flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SYNTHESIZING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      FORGE ALPHA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
                  <Rocket size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400">Direct Alpha Engine</h3>
              </div>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
                Don't have a thesis? Let the engine scan for <span className="text-white font-bold">High-Probability Wins</span> in the current Spot/Futures regime.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="text-[8px] font-black text-zinc-600 uppercase mb-1">Win Probability</div>
                  <div className="text-xl font-black text-emerald-500">82.4%</div>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="text-[8px] font-black text-zinc-600 uppercase mb-1">Expected ROI</div>
                  <div className="text-xl font-black text-blue-500">+12.5%</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setPrompt("Generate a high-probability win strategy for the current market regime focusing on Spot liquidity gaps.");
                handleForge();
              }}
              className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Generate Win Strategy <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {generatedFactor ? (
            <motion.div
              key={generatedFactor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-12 gap-8"
            >
              <div className="col-span-12 lg:col-span-7 space-y-8">
                <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BrainCircuit size={120} className="text-emerald-500" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                          <Target className="w-6 h-6 text-emerald-500" />
                          {generatedFactor.name}
                        </h3>
                        <div className="flex gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                            generatedFactor.personality === 'AGGRESSIVE' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                            generatedFactor.personality === 'CONSERVATIVE' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                            'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          }`}>
                            {generatedFactor.personality}
                          </span>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-400 mono">
                            SHARPE: {generatedFactor.expectedSharpe.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">Synthesized Logic</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 font-mono text-sm text-emerald-400/80 leading-relaxed shadow-inner">
                        {generatedFactor.logic}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-6">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Regime Suitability</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedFactor.regimeSuitability.map((regime) => (
                        <span key={regime} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold text-zinc-300 border border-white/10 hover:border-emerald-500/30 transition-colors">
                          {regime.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-6">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Risk Exposure</p>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-zinc-500">Drawdown Risk</span>
                        <span className="text-white">Low</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '35%' }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 space-y-8">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Backtest Simulation</h4>
                    </div>
                    <span className="text-[10px] font-black text-zinc-600 mono">30D LOOKBACK</span>
                  </div>
                  
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={backtestData}>
                        <defs>
                          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                          itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="equity" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorEquity)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1">Win Rate</span>
                      <span className="text-xl font-black text-white mono">68.4%</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1">Profit Factor</span>
                      <span className="text-xl font-black text-white mono">2.41</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <AlertCircle className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-lg font-black text-zinc-500 uppercase tracking-widest">No Active Factor</h3>
              <p className="text-sm text-zinc-700 max-w-xs mt-2">Enter your quantitative thesis above to synthesize a new alpha factor.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlphaForge;
