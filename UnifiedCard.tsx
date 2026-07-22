import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqPageProps {
  onNavigate: (path: string) => void;
  washingFaq: FaqEntry[];
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate, washingFaq }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — soft rose accent */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#FFF0F4] border-b border-rose-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#8C2346] font-sans block">
            QUESTIONS
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#5C1A32] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Everything you need to know about caring for and ordering your Wonder Pads.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-1 sm:px-4 space-y-3">
        {washingFaq.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-500 font-medium">
            No questions listed yet.
          </div>
        ) : (
          washingFaq.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="bg-white border border-zinc-150/85 rounded-2xl overflow-hidden shadow-3xs">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span className="font-serif font-black text-zinc-900 text-sm sm:text-base leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-medium animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
