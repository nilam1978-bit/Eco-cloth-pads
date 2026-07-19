import React from 'react';
import { Info, Sparkles, CheckCircle2, ArrowRight, Home, Scissors, Layers, HelpCircle } from 'lucide-react';
import { UnifiedCard } from './UnifiedCard';

interface SizingGuideViewProps {
  onNavigate: (path: string) => void;
  onStartCustomizer: (flow: 'fabric' | 'size') => void;
}

export const SizingGuideView: React.FC<SizingGuideViewProps> = ({
  onNavigate,
  onStartCustomizer,
}) => {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* 1. Header Banner Style matching other pages */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#e9edfb]/85 border-b border-indigo-200/50 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close Guide"
        >
          ✕
        </button>

        {/* Subtle paper texture overlay */}
        <div 
          className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} 
        />
        
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#4F46E5] font-sans block">
            SIZING &amp; PRICING DETAILS
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-indigo-950 leading-tight">
            Pad Sizing &amp; Pricing Guide
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            We offer a wide range of customisable sizes and shapes to fit your body and your routine. Learn about our dimensions, transparent pricing, and pad design layers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-1 sm:px-4 space-y-12 sm:space-y-16">
        
        {/* 2. Sizing & Pricing Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-150/80 shadow-3xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 font-sans">DIMENSIONS &amp; COST</span>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-zinc-900">Compare Our Cloth Pad Sizes</h3>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 text-[11px] font-medium text-indigo-950 leading-tight max-w-xs">
              💡 <strong>Length Variety:</strong> Every pad is hand-crafted and can be customized with various length choices during your design process!
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-100">
            <table className="w-full text-left font-sans text-xs sm:text-[13px] text-zinc-700 leading-relaxed border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  <th className="py-3 px-4">Size Category</th>
                  <th className="py-3 px-4 text-center">Available Lengths</th>
                  <th className="py-3 px-4">Best Suited For</th>
                  <th className="py-3 px-4 text-right">Starting Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-zinc-900 text-sm">Liner</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-indigo-700 font-bold">6&quot; - 9”</td>
                  <td className="py-3.5 px-4 text-zinc-600">Daily backup, vaginal discharge, and very light leaks</td>
                  <td className="py-3.5 px-4 text-right font-black text-zinc-900 whitespace-nowrap">from S$5.50</td>
                </tr>
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-zinc-900 text-sm">Light</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-indigo-700 font-bold">8&quot; - 10”</td>
                  <td className="py-3.5 px-4 text-zinc-600">Light flow days, spotting, and cup or tampon backup</td>
                  <td className="py-3.5 px-4 text-right font-black text-zinc-900 whitespace-nowrap">from S$8.00</td>
                </tr>
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-zinc-900 text-sm">Moderate</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-indigo-700 font-bold">10&quot; - 14”</td>
                  <td className="py-3.5 px-4 text-zinc-600">Medium cycle days, active daytime protection, and regular flow</td>
                  <td className="py-3.5 px-4 text-right font-black text-zinc-900 whitespace-nowrap">from S$11.00</td>
                </tr>
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-zinc-900 text-sm">Heavy</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-indigo-700 font-bold">12&quot; - 14”</td>
                  <td className="py-3.5 px-4 text-zinc-600">Active heavy flow days, post-partum backup, and overnight security</td>
                  <td className="py-3.5 px-4 text-right font-black text-zinc-900 whitespace-nowrap">from S$14.00</td>
                </tr>
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-zinc-900 text-sm">Extra Long</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-indigo-700 font-bold">15&quot; - 20”</td>
                  <td className="py-3.5 px-4 text-zinc-600">Deep sleep overnight coverage, maximum posture/movement protection</td>
                  <td className="py-3.5 px-4 text-right font-black text-zinc-900 whitespace-nowrap">from S$15.00+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Pad Layers Section */}
        <section className="space-y-6 animate-fadeIn">
          <div className="space-y-1 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-650 font-sans block">ANATOMY OF A WONDER PAD</span>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-zinc-900">How Our Pads Are Built</h3>
            <p className="font-sans text-xs sm:text-[13px] text-zinc-500 leading-relaxed font-medium max-w-2xl">
              Each reusable pad consists of three thoughtfully curated layers that work together to provide leakproof confidence, softness, and durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layer 1 */}
            <UnifiedCard
              badge="🌸"
              badgeBgColor="bg-pink-100/80"
              badgeTextColor="text-[#8C2346]"
              bgColor="bg-[#fff6f8]"
              borderColor="border-pink-150/60"
              tagText="YOUR CHOSEN COTTON PRINT"
              tagTextColor="text-pink-600"
              title="1. The Topper"
              titleColor="text-[#8C2346]"
            >
              The top layer sits directly against your skin. It is made of breathable premium woven cotton, flannel, or knit fabric featuring gorgeous, colourful prints to keep your cycle joyful and rash-free.
            </UnifiedCard>

            {/* Layer 2 */}
            <UnifiedCard
              badge="💚"
              badgeBgColor="bg-emerald-100/80"
              badgeTextColor="text-emerald-700"
              bgColor="bg-[#f0f9f1]"
              borderColor="border-emerald-150/60"
              tagText="ABSORBENT SHIELD"
              tagTextColor="text-emerald-600"
              title="2. The Core"
              titleColor="text-emerald-950"
            >
              The middle layers provide reliable liquid absorption. Depending on your chosen size, we stack organic bamboo terry, absorbent cotton flannel, or hemp layers to lock in moisture securely without any bulk.
            </UnifiedCard>

            {/* Layer 3 */}
            <UnifiedCard
              badge="💙"
              badgeBgColor="bg-blue-100/80"
              badgeTextColor="text-blue-700"
              bgColor="bg-[#f0f4fd]"
              borderColor="border-blue-150/60"
              tagText="WATERPROOF ANTI-SLIP BARRIER"
              tagTextColor="text-blue-600"
              title="3. The Backer"
              titleColor="text-blue-950"
            >
              Our waterproof backer stops leaks in their tracks. We use soft-shell fleece backing (white or black depending on the size) which grips your underwear beautifully, preventing slipping, bunching, or shifting.
            </UnifiedCard>
          </div>
        </section>

        {/* 4. How Ordering Works */}
        <section className="space-y-6 animate-fadeIn">
          <div className="space-y-1 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-650 font-sans block">EASY 4-STEP PROCESS</span>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-zinc-900">How Ordering Works</h3>
            <p className="font-sans text-xs sm:text-[13px] text-zinc-500 leading-relaxed font-medium max-w-2xl">
              We handcraft every single order individually. Here is how your pad goes from an idea in our studio to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <UnifiedCard
              badge="1"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-800"
              tagText="STEP 1"
              tagTextColor="text-indigo-600"
              title="Choose Options"
              titleColor="text-zinc-900"
              bgColor="bg-zinc-50/70"
              borderColor="border-zinc-200/50"
            >
              Browse our Ready-to-Ship stock, or head over to the Customizer Studio to choose your exact size, shape, prints, and custom backings.
            </UnifiedCard>

            {/* Step 2 */}
            <UnifiedCard
              badge="2"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-800"
              tagText="STEP 2"
              tagTextColor="text-indigo-600"
              title="Build Routines"
              titleColor="text-zinc-900"
              bgColor="bg-zinc-50/70"
              borderColor="border-zinc-200/50"
            >
              Add several items to your cart, matching prints or mixing and matching different absorbencies to build a robust menstrual care routine.
            </UnifiedCard>

            {/* Step 3 */}
            <UnifiedCard
              badge="3"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-800"
              tagText="STEP 3"
              tagTextColor="text-indigo-600"
              title="Submit Inquiry"
              titleColor="text-zinc-900"
              bgColor="bg-zinc-50/70"
              borderColor="border-zinc-200/50"
            >
              Input your delivery details securely with no account or advance payment required. Review your summary and send the inquiry.
            </UnifiedCard>

            {/* Step 4 */}
            <UnifiedCard
              badge="4"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-800"
              tagText="STEP 4"
              tagTextColor="text-indigo-600"
              title="Nilam Handcrafts"
              titleColor="text-zinc-900"
              bgColor="bg-zinc-50/70"
              borderColor="border-zinc-200/50"
            >
              Inquiry details are forwarded to Nilam over WhatsApp/email. She confirms fabric availability and starts sewing your customized pads!
            </UnifiedCard>
          </div>
        </section>

        {/* 5. How to Measure & Choose Your Size */}
        <section className="space-y-6 animate-fadeIn">
          <div className="space-y-1 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-650 font-sans block">GUIDE &amp; ADVICE</span>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-zinc-900">How to Measure &amp; Choose Your Ideal Size</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UnifiedCard
              badge="📏"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-950"
              title="Measure Your Disposable Pad"
              titleColor="text-indigo-950"
              bgColor="bg-indigo-50/30"
              borderColor="border-indigo-150/45"
            >
              <p className="mb-2">
                To get a solid baseline, look at the disposable pads or liners you currently use. Lay one flat and measure its length in inches. Select the closest size category in our customizer:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-zinc-700 font-medium">
                <li><strong>Liners:</strong> 6&quot; to 9” (perfect for everyday)</li>
                <li><strong>Light/Moderate:</strong> 8&quot; to 14” (standard daytime use)</li>
                <li><strong>Heavy/Extra Long:</strong> 12&quot; to 20” (overnight protection)</li>
              </ul>
            </UnifiedCard>

            <UnifiedCard
              badge="👙"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-950"
              title="Consider Your Underwear Style"
              titleColor="text-indigo-950"
              bgColor="bg-indigo-50/30"
              borderColor="border-indigo-150/45"
            >
              Shorter pads (6&quot; to 8&quot;) fit narrower underwear styles better. If you prefer high-waisted briefs or boyshorts, or want absolute leakproof sleeping coverage, choose wider flare shapes (like our Hourglass or Flare shape options) paired with longer lengths (14&quot; to 18&quot;).
            </UnifiedCard>

            <UnifiedCard
              badge="🩸"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-950"
              title="Align Length with Flow Strength"
              titleColor="text-indigo-950"
              bgColor="bg-indigo-50/30"
              borderColor="border-indigo-150/45"
            >
              <p className="mb-2">
                Flow is rarely uniform. Choose a mix of sizes to create an efficient routine:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-zinc-700 font-medium">
                <li><strong>Spotting/Start &amp; End of cycle:</strong> Liners or Light pads.</li>
                <li><strong>Regular flow daytime:</strong> Moderate pads (10&quot; or 11&quot; are our most popular standard options).</li>
                <li><strong>Gushy / Heavy flow / Sitting down:</strong> Heavy pads (12&quot; or 14&quot;) for enhanced front-to-back backup.</li>
                <li><strong>Nighttime sleep:</strong> Extra Long (15&quot; to 20&quot;) to avoid any rear leaks.</li>
              </ul>
            </UnifiedCard>

            <UnifiedCard
              badge="🛒"
              badgeBgColor="bg-indigo-100"
              badgeTextColor="text-indigo-950"
              title="Try a Starter Bundle Approach"
              titleColor="text-indigo-950"
              bgColor="bg-indigo-50/30"
              borderColor="border-indigo-150/45"
            >
              <p className="mb-2">
                If you are transitioning to cloth pads for the first time, don't worry about getting it 100% right immediately! We recommend starting with a diverse set:
              </p>
              <p className="font-bold text-indigo-900 mb-2">
                💡 Recommendation: 1 Liner, 2 Moderate, and 1 Heavy pad.
              </p>
              <p className="text-[11.5px] text-zinc-500 leading-snug">
                This lets you experience different thicknesses and lengths during your cycle, so you know exactly what to reorder in the future.
              </p>
            </UnifiedCard>
          </div>
        </section>

        {/* 6. Centered Call-To-Action to Start Designing */}
        <section className="bg-[#fcf8f5] rounded-3xl p-8 sm:p-10 border border-brand-pink/20 text-center space-y-5 shadow-3xs">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8A5A87] font-sans">GET STARTED</span>
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-zinc-900">Ready to Custom-Design Yours?</h3>
            <p className="font-sans text-xs sm:text-[14px] text-zinc-600 leading-relaxed font-medium">
              Head into our Design Studio to choose your prints, customize backing fleeces, pick sizes, and build your bespoke reusable routine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onStartCustomizer('fabric');
                onNavigate('/');
              }}
              className="w-full sm:w-auto bg-[#8A5A87] hover:bg-[#744572] text-white text-xs font-black py-4 px-8 rounded-full uppercase tracking-widest shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Scissors className="h-4 w-4" />
              <span>Fabric-First Customizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            
            <button
              type="button"
              onClick={() => {
                onStartCustomizer('size');
                onNavigate('/');
              }}
              className="w-full sm:w-auto bg-brand-moss hover:bg-brand-moss/90 text-white text-xs font-black py-4 px-8 rounded-full uppercase tracking-widest shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Layers className="h-4 w-4" />
              <span>Size-First Customizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
