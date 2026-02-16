import React, { useEffect, useState } from 'react';

interface PhaseResultProps {
  fortune: string;
  petition: string;
  onRestart: () => void;
}

export const PhaseResult: React.FC<PhaseResultProps> = ({ fortune, petition, onRestart }) => {
  const [showFortune, setShowFortune] = useState(false);

  useEffect(() => {
    // Simple delay for reveal effect
    const timer = setTimeout(() => setShowFortune(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Split fortune into Title and Body if a colon is present
  const parts = fortune.split('：');
  const title = parts[0];
  const body = parts.length > 1 ? parts[1] : '';

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in perspective-1000">
       {/* Fortune Stick / Card */}
       <div 
         className={`
           relative w-72 h-[450px] bg-gradient-to-b from-[#D32F2F] to-[#8E0000] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden
           flex flex-col items-center p-3 transform transition-all duration-1000 border-2 border-white/5
           ${showFortune ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-20 opacity-0 rotate-3'}
         `}
       >
          {/* Inner Frame - Gold Line */}
          <div className="w-full h-full border-[3px] border-gold-accent rounded-xl p-4 flex flex-col items-center relative box-border">
            
            {/* Corner Ornaments - Simplified Chinese/Premium Style */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-gold-accent rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-gold-accent rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-gold-accent rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-gold-accent rounded-br-xl"></div>
            
            {/* Header: Petition */}
            <div className="mt-4 mb-1 w-full text-center relative z-10">
                <div className="inline-block border-b border-gold-accent/50 pb-1 mb-1">
                    <span className="text-gold-accent/90 text-[10px] tracking-[0.4em] font-serif uppercase drop-shadow-sm">好运降临</span>
                </div>
                <div className="text-[#FFD700] font-serif text-base font-bold min-h-[1.5rem] px-2 break-words line-clamp-2 leading-tight drop-shadow-[0_2px_0_rgba(142,0,0,0.5)]">
                    {petition || "心想事成"}
                </div>
            </div>

            {/* Main Content: Result */}
            <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pb-6">
                {/* Glowing Title - Gold on Red */}
                <h2 
                    className="text-4xl font-bold text-gold-accent font-artistic mb-4 relative z-10 animate-pulse tracking-[0.2em] whitespace-nowrap"
                    style={{ 
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.7), 0 3px 0 rgba(100,0,0,0.6)'
                    }}
                >
                    {title}
                </h2>
                
                {body && (
                    <div className="relative w-full px-1">
                        <p className="text-lg text-white font-serif font-bold leading-relaxed tracking-wide text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
                            {body}
                        </p>
                    </div>
                )}
            </div>

            {/* Stamp Footer - Solid Gold Medallion Style */}
            <div className="mt-auto mb-1 relative z-20 transform rotate-[-8deg]">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C49102] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.4)] flex items-center justify-center p-1.5 border border-[#FFF8E1]/40">
                    <div className="w-full h-full rounded-full border border-[#8E0000]/10 flex flex-col items-center justify-center relative bg-gradient-to-br from-[#FFD700] to-[#FDB931]">
                         {/* Subtle Ring */}
                         <div className="absolute inset-2 rounded-full border-2 border-[#8E0000]/10"></div>
                         
                         {/* Text */}
                         <span className="text-[#8E0000] font-serif text-3xl font-black tracking-widest leading-none block border-b-2 border-[#8E0000]/20 pb-2 mb-2 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">薯门</span>
                         <span className="text-[#8E0000] font-serif text-3xl font-black tracking-widest leading-none block pt-1 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">保佑</span>
                    </div>
                </div>
            </div>
            
          </div>
       </div>

       {/* Restart Button */}
       <button
         onClick={onRestart}
         className={`
           mt-8 px-12 py-3 bg-gradient-to-r from-gold-accent to-[#FDB931] text-traditional-red font-bold rounded-full
           shadow-[0_4px_20px_rgba(255,215,0,0.4)] hover:shadow-[0_6px_25px_rgba(255,215,0,0.6)]
           hover:scale-105 active:scale-95 transition-all duration-500 delay-500
           border-2 border-[#FFF8E1]
           font-artistic tracking-widest text-xl
           ${showFortune ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
         `}
       >
         再次请愿
       </button>
    </div>
  );
};