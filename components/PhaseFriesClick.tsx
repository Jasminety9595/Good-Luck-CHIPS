import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PhaseFriesClickProps {
  onSuccess: () => void;
  onAchievementUnlock: () => void;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

export const PhaseFriesClick: React.FC<PhaseFriesClickProps> = ({ onSuccess, onAchievementUnlock }) => {
  const [shuPower, setShuPower] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCrit, setIsCrit] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  
  // Use Refs for logic to avoid state batching issues during high CPS
  const shuPowerRef = useRef(0);
  const clickTimestamps = useRef<number[]>([]);
  const critUnlocked = useRef(false);
  const particlesCounter = useRef(0);
  
  // Shake effect state
  const [shake, setShake] = useState(false);

  // Cleanup Timer for Crit Visuals
  useEffect(() => {
    let timer: number;
    if (isCrit) {
      timer = window.setTimeout(() => {
        setIsCrit(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isCrit]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isSuccess) return;

    // Prevent default to avoid double firing on touch devices if mixed
    // e.preventDefault(); 
    
    const now = Date.now();
    
    // 1. CPS Calculation
    clickTimestamps.current.push(now);
    // Remove clicks older than 1s
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t <= 1000);
    const cps = clickTimestamps.current.length;

    // 2. Crit / Achievement Check
    if (cps > 7 && !critUnlocked.current) {
      critUnlocked.current = true;
      setIsCrit(true);
      onAchievementUnlock(); // Signal parent to unlock CPS achievement
    }

    // 3. Update ShuPower (Using Ref for immediate logic, State for UI)
    const powerGain = 2;
    // Calculate new power strictly
    const newPower = Math.min(shuPowerRef.current + powerGain, 100);
    shuPowerRef.current = newPower;
    setShuPower(newPower); // Trigger re-render

    // 4. Probability Check for Success
    // "出签概率 P = shuPower / 100"
    const probability = newPower / 100;
    
    if (Math.random() < probability) {
      handleSuccess();
      return;
    }

    // 5. Visuals: Shake & Particle
    setShake(true);
    setTimeout(() => setShake(false), 50);

    let clientX, clientY;
    if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else {
       clientX = (e as React.MouseEvent).clientX;
       clientY = (e as React.MouseEvent).clientY;
    }
    
    // Relative to viewport is fine for these fixed/absolute particles
    spawnParticle(clientX, clientY);

  }, [isSuccess, onAchievementUnlock]);

  const spawnParticle = (x: number, y: number) => {
    const id = particlesCounter.current++;
    setParticles(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 500);
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    // Play Gold Burst then Next
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className={`
       fixed inset-0 w-full h-full z-40 flex flex-col items-center justify-end
       ${isCrit ? 'animate-flash-red' : ''}
    `}>
       {/* Instruction Text */}
       <div className={`
         absolute top-[15%] w-full text-center transition-opacity duration-300
         ${isSuccess ? 'opacity-0' : 'opacity-100'}
         pointer-events-none z-50
       `}>
          <h2 className="text-4xl text-gold-accent font-artistic font-bold animate-pulse drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {isCrit ? '疯狂暴击!!!' : '疯狂点击薯条盒'}
          </h2>
          <p className="text-white/60 text-sm mt-2 tracking-widest">
            当前薯力: {shuPower}%
          </p>
       </div>

       {/* Click Area Container */}
       <div 
         className="relative w-full h-[60%] flex justify-center items-end pb-12 cursor-pointer select-none touch-manipulation"
         onMouseDown={handleInteraction}
         onTouchStart={handleInteraction}
       >
          {/* Main Box Group with Animations */}
          <div className={`
             relative w-72 h-80
             transition-transform duration-75
             ${shake ? 'scale-95' : 'scale-100'}
             ${isCrit ? 'animate-shake-violent' : ''}
          `}>
             
             {/* 1. Back Wall (Inside of box - Extended Height) */}
             {/* Significantly widened to catch side fries. 110% width relative to container */}
             <div 
                className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[110%] h-[95%] bg-[#6a0000] rounded-t-[3rem] rounded-b-3xl z-0 border border-black/20 shadow-2xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}
             ></div>
             
             {/* Inner Depth Shadow on Back Wall */}
             <div 
                className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[100%] h-[90%] bg-[#500000] z-0 rounded-t-[2.5rem] opacity-60"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}
             ></div>

             {/* 2. Fries Layer (Middle) */}
             {/* Seated at bottom 15%. Reduced horizontal spread (spacing 7.5) and rotation (3.0) to keep them bundled. */}
             <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[70%] h-[65%] z-10 flex justify-center items-end perspective-500">
                {[...Array(13)].map((_, i) => {
                   const height = 130 + Math.random() * 60; // Taller fries
                   // Fan out: -6 to +6 index range
                   const centerOffset = i - 6; 
                   // Slightly wider fan for realism
                   // Reduced rotation multiplier from 3.5 to 3.0 to keep them tighter
                   const rotate = centerOffset * 3.0 + (Math.random() * 2 - 1);
                   const yOffset = Math.abs(centerOffset) * 2 + (shake ? 5 : 0);
                   const zIdx = Math.abs(centerOffset); 
                   
                   return (
                     <div 
                        key={i} 
                        className="absolute bottom-0 w-5 origin-bottom transition-transform duration-100"
                        style={{ 
                          height: `${height}px`, 
                          // Reduced spacing from 9 to 7.5 to bunch them closer
                          left: `calc(50% + ${centerOffset * 7.5}px)`, 
                          transform: `rotate(${rotate}deg) translateY(${yOffset}px) translateZ(${-zIdx * 2}px)`,
                          zIndex: 20 - zIdx // Render center ones last (on top)
                        }} 
                      >
                         {/* Front Face */}
                         <div className="absolute inset-0 bg-[#FFC107] border-r border-[#FFA000]/30 rounded-t-sm shadow-sm"></div>
                         
                         {/* Side Face (Thickness) */}
                         <div className="absolute top-[2px] right-[-4px] w-[4px] h-full bg-[#FFA000] origin-left skew-y-[-45deg] rounded-sm"></div>
                         
                         {/* Top Face */}
                         <div className="absolute top-[-4px] left-[2px] w-full h-[4px] bg-[#FFECB3] origin-bottom skew-x-[-45deg] rounded-sm"></div>
                      </div>
                   );
                })}
             </div>

             {/* 3. Front Wall (SVG Shape) - Enhanced Width and Height */}
             {/* Increased width to 120% to wrap around. */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[85%] z-20 pointer-events-none drop-shadow-2xl">
                 <svg viewBox="0 0 220 240" className="w-full h-full filter drop-shadow-lg">
                    <defs>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#E53935" />
                         <stop offset="50%" stopColor="#C62828" />
                         <stop offset="100%" stopColor="#8E0000" />
                      </linearGradient>
                      <filter id="innerShadow">
                         <feOffset dx="0" dy="0" />
                         <feGaussianBlur stdDeviation="5" result="offset-blur" />
                         <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                         <feFlood floodColor="black" floodOpacity="0.3" result="color" />
                         <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                         <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                      </filter>
                    </defs>
                    
                    {/* 
                       Refined Path:
                       - Bottom corners at y=235, x=5 to x=215 (Wide base)
                       - Top corners flair out to 0 and 220 at y=20
                       - Deeper Scoop curve Q 110,95
                    */}
                    <path 
                      d="M 5,235 L 215,235 L 220,20 Q 110,95 0,20 Z" 
                      fill="url(#redGradient)"
                      filter="url(#innerShadow)"
                      stroke="#8E0000"
                      strokeWidth="2"
                    />
                 </svg>

                 {/* Logo on Front - Changed M to W */}
                 <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gold-accent rounded-full flex items-center justify-center shadow-lg border-2 border-[#B8860B]">
                    <div className="text-traditional-red font-bold text-3xl font-serif mt-1.5">W</div>
                 </div>
                 
                 {/* Specular Highlight */}
                 <div className="absolute top-[20%] right-[10%] w-[30%] h-[50%] bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-xl pointer-events-none transform -rotate-12"></div>
             </div>

          </div>
       </div>

       {/* Click Particles */}
       {particles.map(p => (
         <div 
           key={p.id}
           className="absolute pointer-events-none text-2xl font-bold text-gold-accent animate-ping"
           style={{ left: p.x, top: p.y }}
         >
           +2
         </div>
       ))}

       {/* Success Gold Light Overlay */}
       {isSuccess && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="w-1 h-1 bg-gold-accent rounded-full shadow-[0_0_100px_50px_#FFD700] animate-gold-burst"></div>
            <div className="absolute inset-0 bg-white/50 animate-fade-in"></div>
         </div>
       )}
    </div>
  );
};