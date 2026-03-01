
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Zap, Shield, BrainCircuit, Loader2, ChevronRight, Sparkles, Target } from 'lucide-react';
import { AlphaFactor, MarketRegime } from '../types';
import { generateAlphaFactor } from '../services/geminiService';

interface AlphaForgeProps {
  currentToken: any;
  onFactorGenerated: (factor: AlphaFactor) => void;
}

const AlphaForge: React.FC<AlphaForgeProps> = ({ currentToken, onFactorGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFactor, setGeneratedFactor] = useState<AlphaFactor | null>(null);

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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Alpha Forge</h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Logic Synthesis Engine</p>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your trading idea... (e.g. 'Buy when RSI is oversold and volume is 2x average, exit when momentum flips')"
          className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
        />
        <button
          onClick={handleForge}
          disabled={isGenerating || !prompt.trim()}
          className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              FORGE LOGIC
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {generatedFactor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  {generatedFactor.name}
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    generatedFactor.personality === 'AGGRESSIVE' ? 'bg-red-500/20 text-red-400' :
                    generatedFactor.personality === 'CONSERVATIVE' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {generatedFactor.personality}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold text-zinc-400">
                    SHARPE: {generatedFactor.expectedSharpe.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Synthesized Logic</p>
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
                <code className="text-xs text-emerald-300/90 leading-relaxed font-mono whitespace-pre-wrap">
                  {generatedFactor.logic}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Optimal Regimes</p>
                <div className="flex flex-wrap gap-1">
                  {generatedFactor.regimeSuitability.map((regime) => (
                    <span key={regime} className="px-2 py-1 bg-zinc-800/50 rounded text-[9px] text-zinc-300 border border-zinc-700/50">
                      {regime.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Risk Profile</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        generatedFactor.personality === 'AGGRESSIVE' ? 'bg-red-500 w-full' :
                        generatedFactor.personality === 'CONSERVATIVE' ? 'bg-blue-500 w-1/3' :
                        'bg-amber-500 w-2/3'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlphaForge;
