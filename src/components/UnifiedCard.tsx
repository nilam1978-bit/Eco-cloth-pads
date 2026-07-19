import React from 'react';

export interface UnifiedCardProps {
  id?: string;
  badge?: React.ReactNode; // Can be a number (1, 2, 3), emoji, or custom element
  badgeBgColor?: string; // e.g. "bg-pink-100/80" or "bg-[#FFEFA6]"
  badgeTextColor?: string; // e.g. "text-[#7F611E]" or "text-pink-750"
  tagText?: string; // e.g. "YOUR CHOSEN COTTON PRINT"
  tagTextColor?: string; // e.g. "text-pink-600"
  title: string;
  titleColor?: string; // e.g. "text-brand-charcoal"
  bgColor?: string; // e.g. "bg-white", "bg-[#fff6f8]", "bg-[#e9edfb]"
  borderColor?: string; // e.g. "border-zinc-150/65", "border-indigo-200/60"
  shadowSize?: string; // e.g. "shadow-sm", "shadow-3xs"
  layout?: 'horizontal' | 'vertical'; // Horizontal has badge left-aligned, vertical has it stacked
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  id,
  badge,
  badgeBgColor = 'bg-indigo-100',
  badgeTextColor = 'text-indigo-950',
  tagText,
  tagTextColor = 'text-zinc-500',
  title,
  titleColor = 'text-zinc-900',
  bgColor = 'bg-white',
  borderColor = 'border-zinc-150/85',
  shadowSize = 'shadow-3xs',
  layout = 'vertical',
  children,
  footer,
  onClick,
}) => {
  const containerClasses = `${bgColor} border ${borderColor} rounded-3xl p-5 sm:p-6 ${shadowSize} hover:shadow-md transition-all duration-300 flex flex-col justify-between w-full text-left ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-99' : ''}`;

  const badgeElement = badge ? (
    <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${badgeBgColor} ${badgeTextColor} flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 shadow-3xs`}>
      {badge}
    </div>
  ) : null;

  if (layout === 'horizontal') {
    return (
      <div id={id} className={containerClasses} onClick={onClick}>
        <div className="flex items-start gap-4 h-full">
          {badgeElement}
          <div className="space-y-1.5 flex-grow min-w-0">
            {tagText && (
              <span className={`text-[10px] font-black uppercase tracking-wider ${tagTextColor} font-sans block`}>
                {tagText}
              </span>
            )}
            <h4 className={`font-serif font-black ${titleColor} text-base sm:text-lg leading-snug`}>
              {title}
            </h4>
            <div className="font-sans text-xs sm:text-[13px] text-zinc-650 leading-relaxed font-medium">
              {children}
            </div>
          </div>
        </div>
        {footer && <div className="mt-4 pt-3 border-t border-zinc-200/40 w-full">{footer}</div>}
      </div>
    );
  }

  return (
    <div id={id} className={containerClasses} onClick={onClick}>
      <div className="space-y-3.5 flex-grow">
        {badgeElement && <div className="flex justify-start">{badgeElement}</div>}
        <div className="space-y-1">
          {tagText && (
            <span className={`text-[10px] font-black uppercase tracking-wider ${tagTextColor} font-sans block`}>
              {tagText}
            </span>
          )}
          <h4 className={`font-serif font-black ${titleColor} text-base sm:text-lg leading-snug`}>
            {title}
          </h4>
        </div>
        <div className="font-sans text-xs sm:text-[13px] text-zinc-650 leading-relaxed font-medium">
          {children}
        </div>
      </div>
      {footer && <div className="mt-4 pt-3 border-t border-zinc-200/40 w-full">{footer}</div>}
    </div>
  );
};
