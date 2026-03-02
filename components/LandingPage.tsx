
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Activity, Target, ArrowRight, Globe, Binary, Cpu, Layers, Sparkles } from 'lucide-react';

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
              Stop Trading Blind. <br />
              <span className="text-blue-500 text-7xl md:text-9xl">Own the Flow.</span>
            </h1>
            <p className="text-lg text-zinc-400 font-medium max-w-xl mb-10 leading-relaxed">
              Institutional-grade mempool profiling and whale tracking for traders who refuse to be exit liquidity.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onEnter}
                className="btn-primary px-10 py-5 text-sm uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.3)]"
              >
                Launch Terminal <ArrowRight size={18} />
              </button>
              <button className="btn-outline px-10 py-5 text-sm uppercase tracking-[0.2em]">
                View Docs
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

      {/* Social Proof Bar */}
      <div className="border-y border-white/5 bg-white/[0.01] py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">500+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pro Traders</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">$2.4B+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Volume Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">82.4%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Signal Win-Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">99.9%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Uptime</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="px-8 md:px-16 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Engineered for Precision</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Quantifying the Decentralized Economy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Binary className="text-blue-500" />,
                title: "Front-run the Bots",
                desc: "Detect sandwich attacks and MEV bots before they hit. Our 3D Mempool Profiler gives you the unfair advantage you deserve."
              },
              {
                icon: <Cpu className="text-red-500" />,
                title: "Whale-Watch Like a Pro",
                desc: "Stop guessing. Visualize massive institutional flows and wallet clusters in real-time. Follow the smart money, ignore the noise."
              },
              {
                icon: <Layers className="text-emerald-500" />,
                title: "Neural Alpha Synthesis",
                desc: "Forge custom trading factors with our AI-driven engine. Backtest quantitative theses in seconds, not weeks. Pure logic, zero emotion."
              }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-black/40 border border-white/5 rounded-[40px] hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   {f.icon}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-8 md:px-16 py-32 bg-blue-600/5 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 flex justify-center gap-1">
            {[1,2,3,4,5].map(s => <Sparkles key={s} size={16} className="text-blue-500" />)}
          </div>
          <blockquote className="text-2xl md:text-4xl font-black italic text-white mb-10 leading-tight">
            "DeFi Scope is the only tool that actually shows me what's happening in the mempool. It's saved me from three sandwich attacks this week alone."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10" />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Alex K.</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Professional Perp Trader</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 md:px-16 py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-widest mb-16 text-center">High-Intent Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { q: "Is this for retail or institutions?", a: "Both. We've democratized institutional-grade data so retail can stop being exit liquidity." },
              { q: "What chains do you support?", a: "Ethereum, Solana, and major L2s. We map the entire DeFi topology in real-time." },
              { q: "How does the Alpha Forge work?", a: "It uses LLMs trained on high-frequency data to synthesize and backtest quantitative trading factors." },
              { q: "Is my data private?", a: "Absolutely. We don't track your trades. We just provide the lens to see the market clearly." },
              { q: "Can I use this for Perps?", a: "Yes. Our order flow imbalance and Kyle's Lambda metrics are essential for high-leverage perp trading." },
              { q: "What is Kyle's Lambda?", a: "It's a measure of price impact. It tells you exactly how much liquidity is available before slippage kills your ROI." },
              { q: "Do I need an API key?", a: "No. Just launch the terminal and start profiling. We handle the heavy data lifting." },
              { q: "How do I get started?", a: "Click 'Launch Terminal'. No credit card, no fluff. Just pure, unadulterated alpha." }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">{faq.q}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-blue-500" />
              <span className="text-xl font-black uppercase tracking-[0.3em]">DeFi Scope</span>
            </div>
            <p className="text-xs text-zinc-600 font-medium max-w-xs leading-relaxed mb-8">
              The sovereign layer of visual intelligence for the decentralized economy. Built for traders who demand precision.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-all"><Globe size={18} /></a>
              <a href="#" className="p-3 bg-white/5 rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-all"><Binary size={18} /></a>
              <a href="#" className="p-3 bg-white/5 rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-all"><Activity size={18} /></a>
            </div>
          </div>
          
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Navigation</h5>
            <ul className="space-y-4">
              <li><a href="#" onClick={onEnter} className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Launch Terminal</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">API Access</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Legal</h5>
            <ul className="space-y-4">
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-blue-500 transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">DeFi Scope © 2026. All Rights Reserved.</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Visual Intelligence for the Next Gen.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
