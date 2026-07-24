import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

interface FeedbackModalProps {
  inquiryNumber: string;
  onClose: () => void;
}

const EASE_OPTIONS = ['Very easy', 'Easy', 'Okay', 'A bit difficult', 'Difficult'];
const RECOMMEND_OPTIONS = ['Definitely', 'Probably', 'Not sure', 'Probably not'];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ inquiryNumber, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [easeOfOrdering, setEaseOfOrdering] = useState('');
  const [whatCouldBeSimpler, setWhatCouldBeSimpler] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [otherComments, setOtherComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryNumber,
          rating: rating || null,
          easeOfOrdering,
          whatCouldBeSimpler,
          wouldRecommend,
          otherComments
        })
      });
      setSubmitted(true);
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      // Fail quietly — feedback is a nice-to-have, never block the order flow
      setSubmitted(true);
      setTimeout(() => onClose(), 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 cursor-pointer z-10"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-3xl">💛</div>
            <h3 className="font-serif font-black text-lg text-zinc-900">Thank you!</h3>
            <p className="text-xs text-zinc-500">Your feedback helps us make ordering better.</p>
          </div>
        ) : (
          <div className="p-6 sm:p-7 space-y-5">
            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A24467]">Order sent!</span>
              <h3 className="font-serif font-black text-xl text-zinc-900 leading-snug">
                Quick question before you go
              </h3>
              <p className="text-xs text-zinc-500">
                How was your experience designing and ordering your pad? This takes 30 seconds and really helps us improve.
              </p>
            </div>

            {/* Star rating */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Overall experience</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer p-0.5"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating || rating) >= n ? 'fill-amber-400 text-amber-400' : 'fill-zinc-100 text-zinc-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Ease of ordering */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">How easy was it to find the right size &amp; fabric?</label>
              <div className="flex flex-wrap gap-1.5">
                {EASE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEaseOfOrdering(opt)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                      easeOfOrdering === opt
                        ? 'bg-[#922B50] text-white border-[#922B50]'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* What could be simpler */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">What's one thing we could make simpler? (optional)</label>
              <textarea
                rows={2}
                value={whatCouldBeSimpler}
                onChange={(e) => setWhatCouldBeSimpler(e.target.value)}
                placeholder="E.g. picking the backing fabric felt confusing..."
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium resize-none focus:outline-hidden focus:border-[#922B50]/40"
              />
            </div>

            {/* Would recommend */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Would you recommend WonderPads to a friend?</label>
              <div className="flex flex-wrap gap-1.5">
                {RECOMMEND_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setWouldRecommend(opt)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                      wouldRecommend === opt
                        ? 'bg-brand-moss text-white border-brand-moss'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Anything else */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Anything else you'd like to share? (optional)</label>
              <textarea
                rows={2}
                value={otherComments}
                onChange={(e) => setOtherComments(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium resize-none focus:outline-hidden focus:border-[#922B50]/40"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 cursor-pointer"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (!rating && !easeOfOrdering && !wouldRecommend && !whatCouldBeSimpler && !otherComments)}
                className="flex-[2] py-2.5 bg-[#922B50] hover:bg-[#7d2444] text-white text-[11px] font-black uppercase tracking-wider rounded-xl disabled:opacity-40 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
