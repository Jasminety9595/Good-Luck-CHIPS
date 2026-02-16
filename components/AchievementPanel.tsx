import React from 'react';
import { ACHIEVEMENT_LIST } from '../types';

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ isOpen, onClose, unlockedIds }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#8E0000] to-[#500000] rounded-2xl border-4 border-gold-accent shadow-[0_0_40px_rgba(255,215,0,0.3)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 text-center border-b-2 border-gold-accent/30 bg-[#3a0000]/50">
          <h2 className="text-2xl font-artistic text-gold-accent font-bold tracking-widest drop-shadow-md">
            薯门功勋
          </h2>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {ACHIEVEMENT_LIST.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={`
                  relative flex items-center p-3 rounded-lg border-2 transition-all duration-300
                  ${isUnlocked 
                    ? 'bg-gradient-to-r from-gold-accent/20 to-transparent border-gold-accent/50' 
                    : 'bg-black/20 border-white/5 grayscale opacity-70'}
                `}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 shrink-0 mr-4
                  ${isUnlocked 
                    ? 'bg-gold-accent text-[#8E0000] border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)]' 
                    : 'bg-stone-800 text-stone-500 border-stone-600'}
                `}>
                  {ach.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className={`font-bold font-artistic text-lg ${isUnlocked ? 'text-gold-accent' : 'text-stone-400'}`}>
                    {ach.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-tight mt-0.5">
                    {ach.desc}
                  </p>
                </div>

                {/* Status Badge */}
                {isUnlocked && (
                   <div className="absolute top-2 right-2">
                      <span className="text-[10px] text-green-400 font-bold border border-green-400/50 px-1 rounded bg-green-900/30">
                        GET
                      </span>
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Close */}
        <div className="p-4 bg-[#3a0000]/50 border-t-2 border-gold-accent/30 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-gold-accent text-[#8E0000] font-bold rounded-full font-artistic hover:scale-105 active:scale-95 transition-transform"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};