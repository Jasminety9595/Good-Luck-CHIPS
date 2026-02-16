import React, { useState, useRef } from 'react';

interface CollectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  collectedFortunes: string[];
}

export const CollectionPanel: React.FC<CollectionPanelProps> = ({ isOpen, onClose, collectedFortunes }) => {
  const [selectedFortune, setSelectedFortune] = useState<string | null>(null);
  const [note, setNote] = useState(''); // Local state for the input on the card
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Helper to parse fortune string
  const parseFortune = (text: string) => {
    const parts = text.split('：');
    return {
      title: parts[0] || '未知',
      body: parts[1] || text
    };
  };

  const handleSelect = (fortune: string) => {
    setSelectedFortune(fortune);
    setNote(''); // Reset note when opening a new card
  };

  const handleBack = () => {
    setSelectedFortune(null);
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // @ts-ignore - html2canvas is loaded via CDN
      if (typeof window.html2canvas === 'undefined') {
         console.error('html2canvas not loaded');
         return;
      }

      // @ts-ignore
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null, // Allow transparency
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `薯门上上签_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Container */}
      <div className={`
        relative w-full max-w-sm h-[80vh] bg-gradient-to-b from-[#8E0000] to-[#500000] 
        rounded-2xl border-4 border-gold-accent shadow-[0_0_40px_rgba(255,215,0,0.3)] 
        overflow-hidden flex flex-col transition-all duration-300
        ${selectedFortune ? 'bg-[#500000]' : ''}
      `}>
        
        {/* Header */}
        <div className="p-4 text-center border-b-2 border-gold-accent/30 bg-[#3a0000]/50 relative shrink-0">
          {selectedFortune && (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 handleBack();
               }}
               className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-accent hover:scale-110 transition-transform z-20 p-2 cursor-pointer"
               aria-label="返回列表"
             >
               ◀ 返回
             </button>
          )}
          <h2 className="text-2xl font-artistic text-gold-accent font-bold tracking-widest drop-shadow-md relative z-10 pointer-events-none">
            {selectedFortune ? '签文详情' : '薯门图鉴'}
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-accent/50 hover:text-gold-accent text-2xl transition-colors z-20 p-2"
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* VIEW 1: LIST */}
          {!selectedFortune && (
            <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {collectedFortunes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                  <div className="text-4xl">🔒</div>
                  <p>暂无收集，快去求签吧</p>
                </div>
              ) : (
                collectedFortunes.map((fortune, idx) => {
                  const { title, body } = parseFortune(fortune);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(fortune)}
                      className="w-full text-left bg-black/20 hover:bg-black/40 border border-gold-accent/20 hover:border-gold-accent/60 rounded-lg p-4 transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <span className="text-gold-accent font-bold font-artistic text-lg mr-3">
                            [{title}]
                          </span>
                          <span className="text-white/80 text-sm line-clamp-1">
                            {body}
                          </span>
                        </div>
                        <span className="text-white/20 group-hover:text-gold-accent transition-colors">
                          ▶
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW 2: DETAIL CARD */}
          {selectedFortune && (
             <div className="h-full overflow-y-auto p-4 flex flex-col items-center animate-fade-in">
                {(() => {
                  const { title, body } = parseFortune(selectedFortune);
                  return (
                    <div 
                      ref={cardRef} 
                      className="relative w-full bg-gradient-to-b from-[#D32F2F] to-[#8E0000] rounded-xl shadow-2xl border-2 border-white/5 p-3 shrink-0"
                    >
                        {/* Card Inner Frame */}
                        <div className="w-full h-full border-[3px] border-gold-accent rounded-lg p-4 flex flex-col items-center relative box-border bg-gradient-to-b from-transparent to-black/10">
                           
                           {/* Ornaments */}
                           <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-gold-accent rounded-tl-lg"></div>
                           <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-gold-accent rounded-tr-lg"></div>
                           <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-gold-accent rounded-bl-lg"></div>
                           <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-gold-accent rounded-br-lg"></div>

                           {/* 1. Input Area (Top) */}
                           <div className="w-full relative mb-4 z-20">
                              <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="在此写下感悟..."
                                className="w-full h-24 bg-paper-yellow/90 text-traditional-red placeholder-traditional-red/30
                                           border-2 border-dashed border-traditional-red/30 rounded p-2 text-sm
                                           outline-none focus:border-gold-accent resize-none font-serif text-center leading-relaxed"
                              />
                              <div className="text-center mt-1">
                                <span className="text-gold-accent/70 text-[10px] tracking-widest border-b border-gold-accent/30 pb-0.5">
                                  随心记录
                                </span>
                              </div>
                           </div>

                           {/* 2. Luck Title */}
                           <h2 className="text-3xl font-bold text-gold-accent font-artistic mb-4 relative z-10 tracking-[0.2em] whitespace-nowrap drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
                             {title}
                           </h2>

                           {/* 3. Fortune Body */}
                           <p className="text-lg text-white font-serif font-bold leading-relaxed tracking-wide text-center drop-shadow-md mb-8">
                             {body}
                           </p>

                           {/* 4. Seal (Bottom) */}
                           <div className="relative transform rotate-[-5deg] mt-auto pb-2">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C49102] shadow-lg flex items-center justify-center p-1 border border-[#FFF8E1]/40">
                                  <div className="w-full h-full rounded-full border border-[#8E0000]/10 flex flex-col items-center justify-center relative bg-gradient-to-br from-[#FFD700] to-[#FDB931]">
                                      <div className="absolute inset-1.5 rounded-full border-2 border-[#8E0000]/10"></div>
                                      <span className="text-[#8E0000] font-serif text-2xl font-black tracking-widest leading-none block border-b-2 border-[#8E0000]/20 pb-1 mb-1">薯门</span>
                                      <span className="text-[#8E0000] font-serif text-2xl font-black tracking-widest leading-none block">保佑</span>
                                  </div>
                              </div>
                           </div>

                        </div>
                    </div>
                  );
                })()}

                {/* Save/Share Button */}
                <button
                  onClick={handleSaveImage}
                  disabled={isGenerating}
                  className={`
                    mt-6 w-full py-3 rounded-full text-lg font-bold tracking-widest font-artistic
                    border border-gold-accent/50 shadow-lg transition-all duration-300
                    bg-gradient-to-r from-gold-accent to-[#FDB931] text-traditional-red
                    hover:scale-105 active:scale-95 flex items-center justify-center gap-2
                    ${isGenerating ? 'opacity-70 cursor-wait' : ''}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin text-xl">⏳</span> 生成中...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📸</span> 保存圣签
                    </>
                  )}
                </button>
                
                <p className="text-white/30 text-xs mt-3 mb-8">
                   每一支签，都是薯神给你的回应。
                </p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};