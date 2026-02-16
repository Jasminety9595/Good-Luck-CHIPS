import React, { useEffect, useState } from 'react';

interface PhaseSeasoningProps {
  onNext: () => void;
}

type AnimationStage = 'enter' | 'sprinkle' | 'idle';

export const PhaseSeasoning: React.FC<PhaseSeasoningProps> = ({ onNext }) => {
  const [stage, setStage] = useState<AnimationStage>('enter');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Sequence:
    // 0ms: Enter (Drop In)
    // 500ms: Sprinkle (Shake & Pour)
    // 1500ms: Idle (Float) & Show Button
    
    const sprinkleTimer = setTimeout(() => {
      setStage('sprinkle');
    }, 500);

    const idleTimer = setTimeout(() => {
      setStage('idle');
      setShowButton(true);
    }, 1500);

    return () => {
      clearTimeout(sprinkleTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  // Determine animation class based on stage
  const getAnimationClass = () => {
    switch(stage) {
      case 'enter': return 'animate-drop-in';
      case 'sprinkle': return 'animate-shake-pour origin-bottom-left';
      case 'idle': return 'animate-float origin-center';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full pointer-events-none">
       {/* 
         Packet Container
         - Position: FIXED at top-[15%] of viewport.
         - Sauce boxes are at 55% of viewport.
         - 15% top + ~200px height < 55% top, guaranteeing no overlap.
       */}
       <div className="fixed top-[15%] left-0 w-full flex justify-center z-50">
           <div 
             className={`
               w-36 h-52
               transition-all duration-500
               ${getAnimationClass()}
             `}
           >
              {/* --- 3D Depth Layer (Thickness/Shadow) --- */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#3a0000] rounded-sm translate-x-3 translate-y-3 skew-x-1 skew-y-1 opacity-80"></div>
              
              {/* --- Main Packet Body --- */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-cinnabar to-[#c03020] border-2 border-traditional-red shadow-2xl overflow-hidden"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 2% 98%, 0% 96%, 2% 94%, 0% 92%, 2% 90%, 0% 88%, 2% 86%, 0% 84%, 2% 82%, 0% 80%, 2% 78%, 0% 76%, 2% 74%, 0% 72%, 2% 70%, 0% 68%, 2% 66%, 0% 64%, 2% 62%, 0% 60%, 2% 58%, 0% 56%, 2% 54%, 0% 52%, 2% 50%, 0% 48%, 2% 46%, 0% 44%, 2% 42%, 0% 40%, 2% 38%, 0% 36%, 2% 34%, 0% 32%, 2% 30%, 0% 28%, 2% 26%, 0% 24%, 2% 22%, 0% 20%, 2% 18%, 0% 16%, 2% 14%, 0% 12%, 2% 10%, 0% 8%, 2% 6%, 0% 4%, 2% 2%)" 
                }}
              > 
                 {/* ZigZag Edges */}
                 <div className="absolute top-0 left-0 w-full h-5 bg-traditional-red" 
                      style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}>
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-5 bg-traditional-red"
                      style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)' }}>
                 </div>

                 {/* Background Pattern */}
                 <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FFD700 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                 </div>

                 {/* Volume Highlight */}
                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10 pointer-events-none"></div>

                 {/* Central Design */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-1">
                    
                    {/* Diamond Container */}
                    <div className="w-20 h-20 bg-paper-yellow rotate-45 border-4 border-gold-accent shadow-lg flex items-center justify-center mb-4">
                       <div className="w-16 h-16 border border-traditional-red/30 flex items-center justify-center">
                          <div className="-rotate-45 flex flex-col items-center">
                            <span className="text-2xl font-bold text-traditional-red font-artistic drop-shadow-sm">吉利</span>
                            <span className="text-[9px] text-traditional-red tracking-widest mt-0.5">SPICE</span>
                          </div>
                       </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="absolute bottom-6 w-full text-center">
                       <div className="inline-block px-3 py-0.5 bg-gold-accent text-deep-maroon text-[10px] font-bold rounded-full border-2 border-white/40 shadow-sm">
                          EXTRA LUCKY
                       </div>
                    </div>
                 </div>
                 
                 {/* Specular Highlight */}
                 <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent skew-x-12 pointer-events-none"></div>
              </div>
           </div>
       </div>

       {/* 
         Shake Button 
         - Position: FIXED at bottom-[10%] of viewport.
         - Sauce boxes end around 65% (55% top + height).
         - This ensures the button is strictly below the sauce boxes.
       */}
       <div className="fixed bottom-[10%] left-0 w-full flex justify-center z-50 pointer-events-auto">
          <button
            onClick={onNext}
            disabled={!showButton}
            className={`
              relative px-12 py-5 rounded-full text-3xl font-artistic font-bold tracking-[0.5em]
              transition-all duration-700 transform
              ${showButton 
                ? 'opacity-100 translate-y-0 bg-gold-accent text-traditional-red hover:bg-yellow-400 hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.5)] cursor-pointer' 
                : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}
            `}
          >
            <span className="relative z-10">摇!</span>
            {showButton && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-gold-accent animate-ping opacity-75"></span>
                <span className="absolute inset-0 rounded-full border border-white/50 animate-pulse delay-75"></span>
              </>
            )}
          </button>
       </div>
    </div>
  );
};