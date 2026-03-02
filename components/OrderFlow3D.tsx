
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Target, Layers, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface OrderFlow3DProps {
  price: number;
  symbol: string;
}

// Helper to create a 3D Candle
const createCandle = (x: number, open: number, close: number, high: number, low: number, volume: number) => {
    const isGreen = close >= open;
    const color = isGreen ? 0x10b981 : 0xef4444;
    const height = Math.max(Math.abs(close - open), 0.1);
    const yPos = (open + close) / 2;
    
    // Body
    const geometry = new THREE.BoxGeometry(0.8, height, volume * 0.5); // Depth represents volume
    const material = new THREE.MeshStandardMaterial({ 
        color: color, 
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, yPos, 0);

    // Wick
    const wickHeight = Math.max(high - low, height + 0.1);
    const wickGeo = new THREE.CylinderGeometry(0.05, 0.05, wickHeight, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.set(x, (high + low) / 2, 0);

    const group = new THREE.Group();
    group.add(wick);
    group.add(mesh);
    return group;
};

const OrderFlow3D: React.FC<OrderFlow3DProps> = ({ price, symbol }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const candlesRef = useRef<THREE.Group[]>([]);
    const [showGlossary, setShowGlossary] = useState(false);
    
    // Data State
    const [lastPrice, setLastPrice] = useState(price);
    const [currentOpen, setCurrentOpen] = useState(price);
    const [currentHigh, setCurrentHigh] = useState(price);
    const [currentLow, setCurrentLow] = useState(price);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [candleTimer, setCandleTimer] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Three.js Setup ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03);

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(20, 20, 30); // Isometric-ish view
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x0a0a0a, 1);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // Grid / Floor representing Order Book Depth
        const gridHelper = new THREE.GridHelper(100, 50, 0x333333, 0x111111);
        gridHelper.position.y = -10;
        scene.add(gridHelper);

        // Initial Candles
        const candleGroup = new THREE.Group();
        scene.add(candleGroup);
        
        // Generate some history
        let simPrice = price;
        for(let i = -20; i < 0; i++) {
            const open = simPrice;
            const close = open + (Math.random() - 0.5) * 4;
            const high = Math.max(open, close) + Math.random();
            const low = Math.min(open, close) - Math.random();
            const vol = 1 + Math.random() * 3;
            
            const candle = createCandle(i * 1.5, open - price, close - price, high - price, low - price, vol); // Normalize to 0 y-axis for view
            candleGroup.add(candle);
            candlesRef.current.push(candle);
            simPrice = close;
        }

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Subtle rotation for 3D effect
            if(sceneRef.current) {
                // sceneRef.current.rotation.y += 0.001;
            }

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
             if(containerRef.current && cameraRef.current && rendererRef.current) {
                 cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
                 cameraRef.current.updateProjectionMatrix();
                 rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, []);

    // Logic to update live candle
    useEffect(() => {
        // Mocking the live chart movement logic
        // In a real app, this would manipulate the Three.js mesh geometry directly
        const timer = setInterval(() => {
            setCandleTimer(prev => prev + 1);
            
            // Random price movement simulation
            const delta = (Math.random() - 0.5) * 0.8;
            const newPrice = lastPrice + delta;
            
            setCurrentHigh(h => Math.max(h, newPrice));
            setCurrentLow(l => Math.min(l, newPrice));
            setCurrentVolume(v => v + Math.random() * 0.5);
            setLastPrice(newPrice);

            // Shift Logic (Every 10 ticks for demo speed)
            if (candleTimer > 10) {
                 // Add new candle to 3D scene
                 if(sceneRef.current) {
                     // 1. Shift everything left
                     candlesRef.current.forEach(c => {
                         c.position.x -= 1.5;
                         // Fade out old candles
                         if (c.position.x < -30) {
                             c.visible = false;
                         }
                     });

                     // 2. Create new completed candle
                     const normalizedOpen = currentOpen - price;
                     const normalizedClose = lastPrice - price;
                     const normalizedHigh = currentHigh - price;
                     const normalizedLow = currentLow - price;
                     
                     const newCandle = createCandle(0, normalizedOpen, normalizedClose, normalizedHigh, normalizedLow, Math.min(currentVolume, 5));
                     sceneRef.current.add(newCandle);
                     candlesRef.current.push(newCandle);

                     // 3. Reset for next candle
                     setCurrentOpen(lastPrice);
                     setCurrentHigh(lastPrice);
                     setCurrentLow(lastPrice);
                     setCurrentVolume(1);
                     setCandleTimer(0);
                 }
            }

        }, 200);

        return () => clearInterval(timer);
    }, [candleTimer, lastPrice, price, currentOpen, currentHigh, currentLow, currentVolume]);


    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-20" />
            
            {/* Overlay UI */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                    <Target size={14}/> 3D Mempool Profiler
                </h3>
                <div className="flex items-center gap-4">
                    <div>
                        <span className="text-[8px] text-gray-500 uppercase block">Whale Flow</span>
                        <span className="text-white font-mono text-xs font-bold">{(currentVolume * 124).toFixed(0)} ETH</span>
                    </div>
                    <div>
                        <span className="text-[8px] text-gray-500 uppercase block">Mempool Bias</span>
                        <span className="text-emerald-400 font-mono text-xs font-bold uppercase animate-pulse">Front-run Shield Active</span>
                    </div>
                </div>
            </div>

            <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
                <button 
                    onClick={() => setShowGlossary(!showGlossary)}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 transition-all pointer-events-auto"
                >
                     <Info size={12} className="text-blue-400"/>
                     <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Benefits</span>
                </button>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none">
                     <Layers size={12} className="text-gray-500"/>
                     <span className="text-[9px] text-gray-300 mono">Depth: 100</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none">
                     {lastPrice >= currentOpen ? <ArrowUpRight size={12} className="text-emerald-500"/> : <ArrowDownRight size={12} className="text-red-500"/>}
                     <span className={`text-[9px] mono font-black ${lastPrice >= currentOpen ? 'text-emerald-500' : 'text-red-500'}`}>
                        {lastPrice.toFixed(2)}
                     </span>
                </div>
            </div>

            {/* Benefits Modal/Overlay */}
            {showGlossary && (
                <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-8 flex flex-col gap-6 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Mempool Profiler Benefits</h4>
                        <button onClick={() => setShowGlossary(false)} className="text-gray-500 hover:text-white">
                            <ArrowDownRight className="rotate-45" size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-blue-400 uppercase block mb-1">1. Front-run Detection</span>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Monitor pending transactions in the mempool to identify potential sandwich attacks or front-running attempts before they hit the chain.
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-emerald-400 uppercase block mb-1">2. Whale Tracking</span>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Visualize large buy/sell orders (Whales) entering the queue. Depth spikes often precede significant price movements.
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-orange-400 uppercase block mb-1">3. Liquidity Gaps</span>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Identify "thin" areas in the order book where price can slip rapidly. Use this to set better entry and exit points.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowGlossary(false)}
                        className="mt-auto w-full py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl text-xs"
                    >
                        Got it, take me back
                    </button>
                </div>
            )}

            {/* 3D Canvas Container */}
            <div ref={containerRef} className="w-full h-full" />
            
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                <div className="flex justify-between text-[8px] text-gray-600 font-black uppercase tracking-widest">
                    <span>-5m</span>
                    <span>-4m</span>
                    <span>-3m</span>
                    <span>-2m</span>
                    <span>-1m</span>
                    <span className="text-blue-500">Live</span>
                </div>
            </div>
        </div>
    );
};

export default OrderFlow3D;
