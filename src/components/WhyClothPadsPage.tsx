import React from 'react';

interface WhyClothPadsPageProps {
  onNavigate: (path: string) => void;
  onStartCustomizer: () => void;
}

const REASONS = [
  {
    emoji: '🌿',
    title: 'Better for the planet',
    text: 'The average person uses over 10,000 disposable pads in their lifetime. Each one takes 500–800 years to decompose. Switching to cloth eliminates that waste entirely.',
    bg: 'bg-emerald-100', color: 'text-emerald-700',
  },
  {
    emoji: '❤️',
    title: 'Gentler on your body',
    text: 'Disposable pads often contain synthetic fragrances, dioxins, and plastics that sit against your most sensitive skin. Cloth pads are made from natural fibres — soft, breathable, and free from harsh chemicals.',
    bg: 'bg-[#FCE5E8]', color: 'text-[#8C2346]',
  },
  {
    emoji: '💲',
    title: 'Saves money over time',
    text: 'A set of cloth pads can last 5–10 years. Compare that to the ongoing cost of disposables — most people save hundreds of dollars over the lifetime of their pads.',
    bg: 'bg-amber-100', color: 'text-amber-700',
  },
  {
    emoji: '⭕',
    title: 'Reliable and comfortable',
    text: 'Modern cloth pads are designed to be just as reliable as disposables, with absorbent cores and leakproof backings. Many people find them more comfortable because they breathe naturally.',
    bg: 'bg-[#e9e5f9]', color: 'text-[#6D28D9]',
  },
];

export const WhyClothPadsPage: React.FC<WhyClothPadsPageProps> = ({ onNavigate, onStartCustomizer }) => {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — green accent */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#DCEBDD] border-b border-emerald-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-emerald-700 font-sans block">
            THE CASE FOR CLOTH
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight">
            Why switch to cloth pads?
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Thousands of people have made the switch and never looked back. Here is what they discovered.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-1 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-white border border-zinc-150/85 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-2.5"
            >
              <div className={`h-11 w-11 rounded-full ${r.bg} ${r.color} flex items-center justify-center text-lg shrink-0`}>
                {r.emoji}
              </div>
              <h4 className="font-serif font-black text-zinc-900 text-base leading-snug">{r.title}</h4>
              <p className="font-sans text-xs text-zinc-600 leading-relaxed font-medium">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA band */}
      <div className="max-w-5xl mx-auto px-1 sm:px-4">
        <div className="bg-[#FADCE1] rounded-3xl px-6 py-10 sm:py-14 text-center space-y-4">
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#5C1A32]">Ready to make the switch?</h3>
          <p className="font-sans text-xs sm:text-sm text-[#5C1A32]/80 max-w-md mx-auto">
            Design your first set of custom cloth pads in our studio — no experience needed.
          </p>
          <button
            type="button"
            onClick={onStartCustomizer}
            className="bg-[#922B50] hover:bg-[#8A1C44] text-white font-serif font-extrabold text-sm sm:text-base py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-99 cursor-pointer"
          >
            Open the Custom Studio
          </button>
        </div>
      </div>
    </div>
  );
};
