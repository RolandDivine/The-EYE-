
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Activity, Waves, Zap } from 'lucide-react';

interface EntropyChartsProps {
  symbol: string;
  price: number;
}

const EntropyCharts: React.FC<EntropyChartsProps> = ({ symbol, price }) => {
  // Generate synthetic entropy/flow data
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    entropy: 0.4 + Math.random() * 0.4,
    flow: 1000 + Math.random() * 5000,
    impact: Math.random() * 0.1
  }));

  const distributionData = [
    { name: 'Institutional', value: 65, color: '#6366f1' },
    { name: 'Retail', value: 25, color: '#ef4444' },
    { name: 'Smart Money', value: 10, color: '#10b981' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 h-[300px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flow Entropy Manifold</span>
          </div>
          <span className="text-[9px] mono text-blue-500">REAL-TIME</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                itemStyle={{ color: '#6366f1' }}
              />
              <Area type="monotone" dataKey="entropy" stroke="#6366f1" fillOpacity={1} fill="url(#colorEntropy)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 h-[300px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Liquidity Concentration</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 h-[300px] flex flex-col md:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cross-Asset Price Impact (λ)</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
              />
              <Area type="stepAfter" dataKey="impact" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default EntropyCharts;
