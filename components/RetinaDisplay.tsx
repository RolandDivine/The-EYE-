
import React, { useRef, useEffect } from 'react';
import { calculateGAF, calculateMTF } from '../utils/math';

interface RetinaDisplayProps {
  data: number[];
  type: 'GAF' | 'MTF' | 'Recurrence';
}

const RetinaDisplay: React.FC<RetinaDisplayProps> = ({ data, type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const starsRef = useRef<{x: number, y: number, size: number, speed: number}[]>([]);

  useEffect(() => {
    // Initialize "Galactic" background stars
    starsRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
      size: Math.random() * 2,
      speed: 0.1 + Math.random() * 0.5
    }));
  }, []);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const matrix = type === 'GAF' ? calculateGAF(data) : calculateMTF(data);
    const size = matrix.length;
    const canvasSize = 400;
    const cellSize = canvasSize / size;

    canvasRef.current.width = canvasSize;
    canvasRef.current.height = canvasSize;

    let offset = 0;
    const animate = () => {
      offset += 0.05;
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // 1. Draw Galactic Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > canvasSize) star.y = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(offset + star.x) * 0.3})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // 2. Draw the Heatmap Matrix with "Glow"
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const val = matrix[i][j];
          const intensity = Math.floor(((val + 1) / 2) * 255);
          
          if (type === 'GAF') {
            const r = intensity;
            const g = Math.floor(intensity / 4);
            const b = 255 - intensity;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
          } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${val * 0.8})`;
          }
          
          ctx.fillRect(i * cellSize, j * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }

      // 3. Galactic Overlay: Scanning "Nebula" Pulse
      const gradient = ctx.createRadialGradient(
        canvasSize/2, canvasSize/2, 50,
        canvasSize/2, canvasSize/2, 200 + Math.sin(offset) * 50
      );
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 4. Scanning Line
      const scanY = (offset * 50) % canvasSize;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvasSize, scanY);
      ctx.stroke();

      // 5. Detection Boxes (Logic similar but with animated opacity)
      const patternOpacity = 0.5 + Math.sin(offset * 2) * 0.5;
      ctx.strokeStyle = `rgba(34, 197, 94, ${patternOpacity})`;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(100, 100, 200, 200);
      ctx.setLineDash([]);

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(requestRef.current);
  }, [data, type]);

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-3xl border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 mono">
        {type} ENERGY SPECTROGRAM
      </h3>
      <div className="relative group p-1 bg-white/5 rounded-2xl">
        <canvas ref={canvasRef} className="rounded-xl cursor-none shadow-[0_0_50px_rgba(239,68,68,0.1)]" />
        <div className="absolute inset-0 pointer-events-none rounded-xl border border-white/5"></div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] mono text-gray-500 uppercase">Detecting MEV Signatures...</span>
        </div>
      </div>
    </div>
  );
};

export default RetinaDisplay;
