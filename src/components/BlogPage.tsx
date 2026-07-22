import React from 'react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
}

interface BlogPageProps {
  onNavigate: (path: string) => void;
  blogPosts: BlogPost[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, blogPosts }) => {
  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-fadeIn text-left">
      {/* Header Banner — soft amber accent */}
      <div className="-mx-4 sm:-mx-8 -mt-3 bg-[#FBEFD9] border-b border-amber-200/40 px-6 py-12 sm:py-16 text-center relative overflow-hidden rounded-b-3xl shadow-3xs animate-fadeIn">
        <button
          onClick={() => onNavigate('/')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center font-bold text-base shadow-sm border border-zinc-200 transition-all active:scale-95 cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
        <div className="max-w-2xl mx-auto space-y-3.5 relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-700 font-sans block">
            THE JOURNAL
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight">
            From the studio
          </h2>
          <p className="font-sans text-xs sm:text-[14px] text-zinc-600 max-w-lg mx-auto leading-relaxed font-medium">
            Fabric updates, care tips, and stories from behind the sewing machine.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-1 sm:px-4">
        {blogPosts.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-500 font-medium">
            No posts yet — check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white border border-zinc-150/85 rounded-3xl overflow-hidden shadow-3xs flex flex-col">
                {post.imageUrl && (
                  <div className="h-40 w-full bg-zinc-100">
                    <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="p-5 space-y-2 flex-1 flex flex-col">
                  <h4 className="font-serif font-black text-zinc-900 text-base leading-snug">{post.title}</h4>
                  <p className="font-sans text-xs text-zinc-600 leading-relaxed font-medium flex-1 line-clamp-4">{post.content}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pt-1">By {post.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
