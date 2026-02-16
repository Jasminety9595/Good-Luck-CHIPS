import React, { useState } from 'react';

interface PhaseInputProps {
  onSubmit: (text: string) => void;
}

export const PhaseInput: React.FC<PhaseInputProps> = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
    } else {
      console.warn("Please enter a petition");
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in transition-opacity duration-200">
      
      {/* Title / Prompt Area */}
      <div className="text-center mb-8 space-y-1 mt-2">
        <h2 className="text-3xl text-gold-accent font-bold tracking-wider font-artistic">
          所愿皆是上上签
        </h2>
      </div>

      {/* Vintage Text Box Container */}
      <div className="w-full relative mb-8 group">
        {/* Decorative Glow - Added pointer-events-none to prevent blocking clicks */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gold-accent/20 to-transparent rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
        
        {/* Textarea - Added relative z-10 to ensure it sits above the decorative elements */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入好运"
          className="w-full h-40 bg-paper-yellow text-traditional-red placeholder-traditional-red/40 
                     border-4 border-double border-cinnabar rounded-lg p-5 text-xl leading-relaxed
                     outline-none focus:border-gold-accent/50 transition-colors resize-none 
                     shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] font-artistic tracking-wide relative z-10"
        />
        {/* 'Everything is suitable' Label - PRD Requirement */}
        <div className="mt-3 text-center relative z-10">
          <span className="text-gold-accent/80 text-sm font-artistic tracking-[0.5em] border-t border-b border-gold-accent/30 py-1 px-4 inline-block">
            诸事皆宜
          </span>
        </div>
      </div>

      {/* Start Petition Button */}
      <button
        onClick={handleSubmit}
        disabled={!inputText.trim()}
        className={`
          relative overflow-hidden py-3 px-12 rounded-full text-xl font-bold tracking-widest font-artistic
          border-2 border-gold-accent/30 shadow-lg transition-all duration-300 transform z-10
          ${inputText.trim() 
            ? 'bg-cinnabar text-paper-yellow hover:bg-red-600 hover:scale-105 hover:shadow-gold-accent/20 cursor-pointer' 
            : 'bg-stone-700 text-stone-500 cursor-not-allowed border-transparent'}
        `}
      >
        <span className="relative z-10">接收好运</span>
        {inputText.trim() && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        )}
      </button>
    </div>
  );
};