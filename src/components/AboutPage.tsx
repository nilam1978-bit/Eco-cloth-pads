import React from 'react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

const BELIEFS = [
  { emoji: '❤️', title: 'Made with love', text: 'Every pad is individually handcrafted with care and attention to detail.', bg: 'bg-[#FCE5E8]', color: 'text-[#8C2346]' },
  { emoji: '🌿', title: 'Sustainable', text: 'Reusable pads reduce waste and are kinder to the planet and your body.', bg: 'bg-emerald-100', color: 'text-emerald-700' },
  { emoji: '✂️', title: 'Truly custom', text: 'Choose your fabric, shape, and size. Nothing is off-the-shelf.', bg: 'bg-[#e9e5f9]', color: 'text-[#6D28D9]' },
  { emoji: '⭐', title: 'Quality first', text: 'We use only soft, breathable, skin-safe materials in every pad we make.', bg: 'bg-amber-100', color: 'text-amber-700' },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — pink accent */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#FADCE1] border-b border-rose-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#8C2346] font-sans block">
            OUR STORY
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#5C1A32] leading-tight">
            A little studio with a big heart
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Wonder Pads was born from a simple belief: period care should be comfortable, sustainable, and deeply personal.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-1 sm:px-4 space-y-5 font-sans text-sm text-zinc-700 leading-relaxed">
        <p>
          Every Wonder Pad is individually sewn to order, using carefully chosen fabrics and time-tested construction methods.
          We are not a factory — we are a small handmade studio, and every stitch reflects that.
        </p>
        <p>
          Our journey began when we discovered how transformative switching to cloth pads could be — not just for the environment,
          but for our own comfort and wellbeing. We wanted to share that experience with others, and to make it as beautiful and
          personal as possible.
        </p>
        <p>
          Each pad is made to your exact specifications: your chosen fabric, your preferred shape, your ideal size. Because your
          body is unique, and your period care should be too.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-1 sm:px-4 space-y-6">
        <h3 className="font-serif font-black text-xl sm:text-2xl text-zinc-900 text-center">What we believe in</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BELIEFS.map((b) => (
            <div
              key={b.title}
              className="bg-white border border-zinc-150/85 rounded-3xl p-5 sm:p-6 shadow-3xs flex flex-col items-center text-center space-y-2.5"
            >
              <div className={`h-11 w-11 rounded-full ${b.bg} ${b.color} flex items-center justify-center text-lg shrink-0`}>
                {b.emoji}
              </div>
              <h4 className="font-serif font-black text-zinc-900 text-base leading-snug">{b.title}</h4>
              <p className="font-sans text-xs text-zinc-600 leading-relaxed font-medium">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
