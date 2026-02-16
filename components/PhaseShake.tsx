import React from 'react';

interface PhaseShakeProps {
  onNext: () => void;
  onThrow: () => void;
  disabled?: boolean;
  isHidden?: boolean;
}

export const PhaseShake: React.FC<PhaseShakeProps> = ({ onNext, onThrow, disabled, isHidden }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in duration-200 pointer-events-auto">
      {/* 
        Throw Button 
        - Position: Fixed at bottom-[8%]
        - Disabled state applied when animation is playing
        - Hidden state applied during success transition
      */}
      <button 
        onClick={onThrow}
        disabled={disabled || isHidden}
        className={`
          fixed bottom-[8%] left-1/2 -translate-x-1/2
          px-8 py-3 rounded-full text-xl font-artistic tracking-[0.3em] 
          shadow-[0_4px_15px_rgba(0,0,0,0.4)]
          transition-all duration-300 z-50 group whitespace-nowrap
          ${disabled 
            ? 'bg-stone-600 text-stone-400 border-2 border-stone-500' 
            : 'bg-cinnabar text-paper-yellow border-2 border-gold-accent hover:scale-105 active:scale-95 hover:bg-red-600'}
          ${isHidden 
            ? 'opacity-0 translate-y-10 pointer-events-none' 
            : disabled 
              ? 'opacity-80 cursor-wait' 
              : 'opacity-100 cursor-pointer'}
        `}
      >
        <span className="relative z-10 drop-shadow-sm">
          {disabled ? '请愿中...' : '投掷薯饼'}
        </span>
        {/* Inner shine effect */}
        {!disabled && (
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
        )}
      </button>

      {/* Temporary Dev Button */}
      <button 
        onClick={onNext}
        className="absolute top-0 right-0 m-4 text-[10px] text-white/10 border border-white/10 px-2 py-1 rounded hover:bg-white/10 z-50 cursor-pointer"
      >
        [测试: 下一步]
      </button>
    </div>
  );
};