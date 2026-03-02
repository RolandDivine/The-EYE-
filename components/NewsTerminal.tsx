
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, TrendingUp, TrendingDown, Globe, Zap, ArrowRight, MessageSquare, BrainCircuit, Activity } from 'lucide-react';
import { NewsItem, UserMode } from '../types';
import { getMEVAnalysis } from '../services/geminiService';

interface NewsTerminalProps {
  userMode: UserMode;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'US-Israel-Iran Conflict Escalates: Market Volatility Spikes',
    content: 'Recent geopolitical tensions in the Middle East have led to a sharp increase in oil prices and a flight to safety in traditional assets, while crypto markets show mixed reactions with high volatility.',
    source: 'CryptoPanic',
    time: '2m ago',
    url: '#',
    sentiment: 'BEARISH',
    practicalInsight: {
      institutional: 'Hedge with BTC/USD futures. Expect liquidity drain in altcoins.',
      retail: 'Avoid high leverage. Watch for "Flight to Quality" in stablecoins.'
    }
  },
  {
    id: '2',
    title: 'SEC Approves New Ethereum Staking Framework',
    content: 'The SEC has released a new guidance document for institutional staking, potentially opening the door for more regulated ETH products.',
    source: 'The Block',
    time: '15m ago',
    url: '#',
    sentiment: 'BULLISH',
    practicalInsight: {
      institutional: 'Long-term accumulation of LSTs. Monitor validator concentration.',
      retail: 'Staking yields may stabilize. Bullish for ETH ecosystem tokens.'
    }
  },
  {
    id: '3',
    title: 'Whale Alert: 50,000 BTC Moved from Dormant Wallet',
    content: 'A wallet inactive since 2012 has moved a significant amount of Bitcoin to an exchange, sparking sell-off fears.',
    source: 'Whale Alert',
    time: '45m ago',
    url: '#',
    sentiment: 'NEUTRAL',
    practicalInsight: {
      institutional: 'Monitor exchange inflow vs. outflow. Potential OTC deal.',
      retail: 'Watch for price suppression. Don\'t panic sell without volume confirmation.'
    }
  }
];

const NewsTerminal: React.FC<NewsTerminalProps> = ({ userMode }) => {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Newspaper size={18} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
            Global News Terminal
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Feed: CryptoPanic</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* News List */}
        <div className="w-full lg:w-1/2 border-r border-white/5 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {news.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedNews?.id === item.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[8px] font-black px-2 py-0.5 bg-white/5 text-gray-500 rounded uppercase tracking-widest">{item.source}</span>
                <span className="text-[8px] text-gray-600 mono">{item.time}</span>
              </div>
              <h3 className="text-sm font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{item.title}</h3>
              <div className="flex items-center gap-2">
                {item.sentiment === 'BULLISH' ? <TrendingUp size={12} className="text-emerald-500" /> : item.sentiment === 'BEARISH' ? <TrendingDown size={12} className="text-red-500" /> : <Activity size={12} className="text-gray-500" />}
                <span className={`text-[9px] font-black uppercase ${item.sentiment === 'BULLISH' ? 'text-emerald-500' : item.sentiment === 'BEARISH' ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Panel */}
        <div className="flex-1 bg-black/20 p-6 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {selectedNews ? (
              <motion.div 
                key={selectedNews.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-white mb-4 leading-tight">{selectedNews.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{selectedNews.content}</p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">DeFi Scope Intelligence</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-4 rounded-2xl border ${userMode === UserMode.INSTITUTIONAL ? 'bg-blue-500/5 border-blue-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className={userMode === UserMode.INSTITUTIONAL ? 'text-blue-500' : 'text-red-500'} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                          {userMode === UserMode.INSTITUTIONAL ? 'Institutional Impact' : 'Retail Alpha Strategy'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white leading-relaxed">
                        {userMode === UserMode.INSTITUTIONAL ? selectedNews.practicalInsight.institutional : selectedNews.practicalInsight.retail}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  View Full Report <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Newspaper size={48} className="text-zinc-700" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Select an article</p>
                  <p className="text-[10px] text-zinc-600 font-bold">To generate AI-driven practical insights</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NewsTerminal;
