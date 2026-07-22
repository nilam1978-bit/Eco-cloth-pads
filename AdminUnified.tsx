import React from 'react';
import { UnifiedCard } from './UnifiedCard';

interface BenefitsPageProps {
  onNavigate: (path: string) => void;
}

const BENEFITS = [
  { title: 'No harsh chemicals', text: 'Free from chlorine, dioxins, synthetic fragrances, and plastics that are common in disposables.' },
  { title: 'Breathable natural fibres', text: 'Cotton and bamboo fibres allow air circulation, reducing heat and irritation.' },
  { title: 'Customisable absorbency', text: 'Choose the right absorbency level for your flow — from light liners to heavy overnight pads.' },
  { title: 'Reduces landfill waste', text: 'Each reusable pad replaces hundreds of disposables over its lifetime.' },
  { title: 'Saves money long-term', text: 'An initial investment that pays for itself many times over compared to monthly disposable costs.' },
  { title: 'Lasts 5–10 years', text: 'With proper care, a well-made cloth pad will serve you for years, not months.' },
  { title: 'Soft and comfortable', text: 'Many users report significantly less irritation and discomfort after switching to cloth.' },
  { title: 'Beautiful and personal', text: 'Choose fabrics that make you feel good. Your period care can be something you actually enjoy.' },
];

export const BenefitsPage: React.FC<BenefitsPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — lavender accent, matching the Sizing Guide's pattern of a distinct accent color per subpage */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#e9e5f9] border-b border-indigo-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#6D28D9] font-sans block">
            THE BENEFITS
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#3B1F5C] leading-tight">
            Benefits of reusable pads
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Switching to cloth pads is one of the most impactful changes you can make for your health, your wallet, and the planet.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-1 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BENEFITS.map((b, i) => (
            <UnifiedCard
              key={b.title}
              badge={i + 1}
              badgeBgColor="bg-[#e9e5f9]"
              badgeTextColor="text-[#6D28D9]"
              title={b.title}
              titleColor="text-[#3B1F5C]"
            >
              {b.text}
            </UnifiedCard>
          ))}
        </div>
      </div>
    </div>
  );
};
