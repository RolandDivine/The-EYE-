
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Activity, Target, ArrowRight, Globe, Binary, Cpu, Layers } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 md:px-16">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-[0.3em]">DeFi Scope</span>
        </div>
        <button 
          onClick={onEnter}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Launch Terminal
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-8 md:px-16 pt-20 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Institutional Visual Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter">
              The <span className="text-blue-500">Sovereign</span> <br />
              Layer of Alpha.
            </h1>
            <p className="text-lg text-zinc-400 font-medium max-w-xl mb-10 leading-relaxed">
              DeFi Scope bridges the gap between raw blockchain data and institutional-grade intelligence. 
              Real-time entity topology, quantitative sentiment analysis, and predictive MEV modeling for the next generation of capital.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onEnter}
                className="px-8 py-4 bg-blue-600 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              >
                Enter Terminal <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                View Documentation
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] bg-gradient-to-br from-blue-600/20 to-transparent border border-white/10 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/800/800')] opacity-40 mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                    <Activity size={24} className="text-blue-500 mb-2" />
                    <div className="text-[10px] font-black text-zinc-500 uppercase">Real-time TPS</div>
                    <div className="text-xl font-black mono">4,281.4</div>
                  </div>
                  <div className="p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                    <Target size={24} className="text-red-500 mb-2" />
                    <div className="text-[10px] font-black text-zinc-500 uppercase">Alpha Signals</div>
                    <div className="text-xl font-black mono">128+</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="px-8 md:px-16 py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Engineered for Precision</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Quantifying the Decentralized Economy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Binary className="text-blue-500" />,
                title: "Entity Topology",
                desc: "Visualize wallet relationships and institutional flow with our proprietary graph engine. Track 'Smart Money' in real-time."
              },
              {
                icon: <Cpu className="text-red-500" />,
                title: "Alpha Forge",
                desc: "Generate and backtest custom alpha factors using machine learning models trained on high-frequency DeFi data."
              },
              {
                icon: <Layers className="text-emerald-500" />,
                title: "Market Intelligence",
                desc: "Deep-dive into market regimes, Kyle's Lambda, and order flow imbalance to understand the true state of liquidity."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[32px] hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-blue-500" />
            <span className="text-sm font-black uppercase tracking-widest">DeFi Scope © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Discord</a>
            <a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
