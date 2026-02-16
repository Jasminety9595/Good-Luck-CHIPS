import React from 'react';

interface PhasePlaceholderProps {
  title: string;
  description: string;
  onNext: () => void;
}

export const PhasePlaceholder: React.FC<PhasePlaceholderProps> = ({ title, description, onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center w-full animate-pulse">
      <div className="h-32 w-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-dashed border-white/30">
        <span className="text-4xl">🔮</span>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl text-gold-accent font-bold">{title}</h2>
        <p className="text-paper-yellow/70">{description}</p>
      </div>

      <button
        onClick={onNext}
        className="mt-8 px-6 py-2 border border-white/30 text-white rounded hover:bg-white/10 transition-colors"
      >
        Next Phase (Dev)
      </button>
    </div>
  );
};