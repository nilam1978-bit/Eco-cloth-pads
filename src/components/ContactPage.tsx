import React from 'react';
import { MessageCircle, Instagram, Mail } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  merchantPhone: string;
  merchantEmail: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, merchantPhone, merchantEmail }) => {
  // Same WhatsApp number formatting logic used elsewhere in the app (footer WhatsApp button)
  const waUrl = (() => {
    const destPhone = merchantPhone.trim() || '6583397556';
    let numericOnly = destPhone.replace(/\D/g, '');
    if (numericOnly.length === 8 && (numericOnly.startsWith('8') || numericOnly.startsWith('9') || numericOnly.startsWith('6'))) {
      numericOnly = '65' + numericOnly;
    } else if (!numericOnly.startsWith('65') && numericOnly.length === 8) {
      numericOnly = '65' + numericOnly;
    }
    const finalNumber = numericOnly || '6583397556';
    return `https://wa.me/${finalNumber}?text=${encodeURIComponent('Hello! I have a question about WonderPads.')}`;
  })();

  const cards = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      bg: 'bg-emerald-100', color: 'text-emerald-700',
      title: 'WhatsApp',
      text: 'The fastest way to reach us. We typically respond within a few hours.',
      linkText: 'Message us →',
      href: waUrl,
      external: true,
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      bg: 'bg-[#FCE5E8]', color: 'text-[#8C2346]',
      title: 'Instagram',
      text: 'Follow us for fabric updates, new collections, and behind-the-scenes peeks.',
      linkText: '@ecoclothpad →',
      href: 'https://instagram.com/ecoclothpad',
      external: true,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      bg: 'bg-sky-100', color: 'text-sky-700',
      title: 'Email',
      text: 'For detailed enquiries, send us an email and we will get back to you within 24 hours.',
      linkText: merchantEmail,
      href: `mailto:${merchantEmail}`,
      external: false,
    },
  ];

  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — sky blue accent */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#D9ECF7] border-b border-sky-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-sky-700 font-sans block">
            GET IN TOUCH
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight">
            We would love to hear from you
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Have a question about your order, a custom request, or just want to say hello? Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-1 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-zinc-150/85 rounded-3xl p-5 sm:p-6 shadow-3xs flex flex-col items-center text-center space-y-2.5"
            >
              <div className={`h-11 w-11 rounded-full ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
                {c.icon}
              </div>
              <h4 className="font-serif font-black text-zinc-900 text-base leading-snug">{c.title}</h4>
              <p className="font-sans text-xs text-zinc-600 leading-relaxed font-medium">{c.text}</p>
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="text-xs font-bold text-[#922B50] hover:text-[#8A1C44] hover:underline pt-1"
              >
                {c.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
