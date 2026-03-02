
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, X, TrendingUp, Activity, Zap, Shield } from 'lucide-react';

interface CommandBarProps {
  onSearch: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onSearch, isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle handled by parent
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      onClose();
      setQuery('');
    }
  };

  const suggestions = [
    { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, label: 'Top Gainers', cmd: 'gainers' },
    { icon: <Activity className="w-4 h-4 text-blue-400" />, label: 'Whale Activity', cmd: 'whales' },
    { icon: <Zap className="w-4 h-4 text-orange-400" />, label: 'Mempool Spikes', cmd: 'mempool' },
    { icon: <Shield className="w-4 h-4 text-indigo-400" />, label: 'Security Audit', cmd: 'audit' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex items-center p-6 border-b border-white/5">
              <Search className="w-6 h-6 text-zinc-500 mr-4" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets, addresses, or commands (⌘K)..."
                className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-zinc-700 font-medium"
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                <Command className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500">K</span>
              </div>
            </form>

            <div className="p-4">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-4">Quick Commands</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item.cmd}
                    onClick={() => {
                      onSearch(item.cmd);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group"
                  >
                    <div className="p-2 bg-black rounded-xl border border-white/5 group-hover:border-white/10 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-300">{item.label}</p>
                      <p className="text-[10px] text-zinc-600 mono uppercase">/{item.cmd}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9px] font-bold text-zinc-400">ESC</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">to close</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9px] font-bold text-zinc-400">↵</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">to search</span>
                </div>
              </div>
              <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">Vision Quant v2.5</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandBar;
