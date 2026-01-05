
import React, { useRef, useEffect, useState } from 'react';

interface MonteCarloPathsProps {
  paths: number[][];
  width: number;
  height: number;
}

const MonteCarloPaths: React.FC<MonteCarloPathsProps> = ({ paths, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let animationFrame: number;
    const start = Date.now();
    const duration = 3000; // 3 seconds of "computing" animation

    const animate = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [paths]);

  useEffect(() => {
    if (!canvasRef.current || paths.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    const allPrices = paths.flat();
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const range = (maxPrice - minPrice) || 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    paths.forEach((path, i) => {
      const visibleSteps = Math.floor(path.length * progress);
      if (visibleSteps < 2) return;

      ctx.beginPath();
      const isUp = path[path.length - 1] > path[0];
      ctx.strokeStyle = isUp 
        ? `rgba(34, 197, 94, ${0.05 + (i / paths.length) * 0.15})`
        : `rgba(239, 68, 68, ${0.05 + (i / paths.length) * 0.15})`;
      ctx.lineWidth = 1;
      
      for (let step = 0; step < visibleSteps; step++) {
        const x = (step / (path.length - 1)) * width;
        const y = height - ((path[step] - minPrice) / range) * height;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Final result highlight
    if (progress === 1) {
      const lastPrices = paths.map(p => p[p.length - 1]);
      const avgLast = lastPrices.reduce((a, b) => a + b, 0) / lastPrices.length;
      const avgY = height - ((avgLast - minPrice) / range) * height;

      ctx.beginPath();
      ctx.strokeStyle = '#4ade80';
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, avgY);
      ctx.lineTo(width, avgY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [paths, progress, width, height]);

  return (
    <div className="relative group bg-[#050505] rounded-3xl border border-white/5 p-1 overflow-hidden">
      <div className="absolute top-4 left-6 z-10">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mono">
             Simulating 50k Cycles: {Math.floor(progress * 100)}%
           </span>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="w-full h-auto cursor-crosshair opacity-90 transition-opacity hover:opacity-100"
      />
    </div>
  );
};

export default MonteCarloPaths;
