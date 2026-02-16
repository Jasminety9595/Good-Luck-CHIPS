import React, { useState, useRef, useEffect } from 'react';

interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hook MUST be called before any early return
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Auto close after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setText('');
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content - Dynamic Height */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#8E0000] to-[#500000] rounded-2xl border-4 border-gold-accent shadow-[0_0_40px_rgba(255,215,0,0.3)] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header */}
        <div className="p-4 text-center border-b-2 border-gold-accent/30 bg-[#3a0000]/50 relative z-10 shrink-0">
          <h2 className="text-2xl font-artistic text-gold-accent font-bold tracking-widest drop-shadow-md">
            薯门信箱
          </h2>
        </div>

        {/* Content Area */}
        <div className="relative p-6 flex flex-col items-center min-h-[260px]">
           
           {/* Success State - Text Floating in Center */}
           {showSuccess && (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-fade-in">
                {/* 
                   Centered Text Container
                   - Removed manual padding hacks (pl-[...]) to ensure true centering via flexbox.
                */}
                <p className="text-gold-accent text-3xl font-bold font-artistic tracking-[0.2em] whitespace-nowrap mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce-in z-10 text-center">
                  投递成功！
                </p>
                <p className="text-white/60 text-sm tracking-widest font-serif animate-fade-in delay-100 z-10 text-center">
                  愿薯神保佑你
                </p>
             </div>
           )}

           {/* Form Content - Hidden when success */}
           {!showSuccess && (
             <div className="w-full flex flex-col items-center animate-fade-in flex-1">
               <p className="text-paper-yellow/80 text-sm mb-4 text-center leading-relaxed">
                 告诉薯神你的愿望。
               </p>
               
               <div className="w-full relative group flex-1">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="写下你的建议..."
                    rows={1}
                    className="w-full bg-black/20 text-paper-yellow placeholder-white/30 
                               border-2 border-gold-accent/30 rounded-lg p-3 text-base
                               outline-none focus:border-gold-accent/80 transition-all resize-none 
                               font-serif tracking-wide min-h-[120px] overflow-hidden"
                  />
               </div>

               <button
                 onClick={handleSubmit}
                 disabled={isSubmitting || !text.trim()}
                 className={`
                   mt-5 w-full py-3 rounded-full text-lg font-bold tracking-widest font-artistic
                   border border-gold-accent/30 shadow-lg transition-all duration-300 shrink-0
                   ${text.trim() && !isSubmitting
                     ? 'bg-gold-accent text-[#8E0000] hover:bg-[#FFC107] hover:scale-105' 
                     : 'bg-stone-700 text-stone-500 cursor-not-allowed border-transparent'}
                 `}
               >
                 {isSubmitting ? (
                   <span className="flex items-center justify-center gap-2">
                     <span className="animate-spin">⏳</span> 投递中...
                   </span>
                 ) : '投递信件'}
               </button>
             </div>
           )}
        </div>

        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-3 text-gold-accent/50 hover:text-gold-accent text-2xl transition-colors z-20 p-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};