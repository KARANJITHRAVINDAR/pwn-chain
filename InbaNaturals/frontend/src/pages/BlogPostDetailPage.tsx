import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import LeafDivider from '../components/LeafDivider';
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from 'lucide-react';

export default function BlogPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = blogPosts.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen pb-20 bg-ivory">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sage text-sm font-semibold hover:gap-2 transition-all"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>

      {/* Main Post Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-ivory-dark p-6 sm:p-10 shadow-sm">
        {/* Category & Title */}
        <div className="text-center mb-6">
          <span className="inline-block bg-sage/10 text-sage text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-light border-t border-b border-ivory-dark py-4 mb-8">
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-sage" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} className="text-sage" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-sage" />
            4 min read
          </span>
        </div>

        {/* Hero image placeholder */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-ivory-dark shadow-inner border border-ivory-dark">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body content */}
        <div className="space-y-6 text-charcoal-light leading-relaxed text-base sm:text-lg">
          {post.body.slice(0, 2).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          {/* Pull quote */}
          {post.pullQuote && (
            <blockquote className="my-8 pl-6 border-l-4 border-terracotta italic text-charcoal font-serif text-xl md:text-2xl bg-ivory-dark p-6 rounded-r-2xl">
              "{post.pullQuote}"
            </blockquote>
          )}

          {/* Mid-article graphic */}
          <div className="w-full h-64 rounded-xl overflow-hidden my-8 bg-ivory border border-ivory-dark relative flex items-center justify-center">
            <img
              src={post.image.replace('?text=', '?text=Tips+Step+By+Step+')}
              alt="Mid-article illustration"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 bg-white/90 px-6 py-4 rounded-xl shadow-sm border border-ivory-dark max-w-xs text-center">
              <span className="text-xl">🌿</span>
              <p className="font-serif text-charcoal font-semibold mt-1">InbaNaturals Ritual</p>
              <p className="text-xs text-charcoal-light mt-0.5">Use cold-pressed oils regularly to restore density.</p>
            </div>
          </div>

          {post.body.slice(2).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </article>

      {/* Related Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-charcoal">Related Articles</h2>
          <LeafDivider />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-dark shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:scale-[1.01]"
            >
              <div>
                <Link to={`/blog/${p.id}`} className="block h-44 overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 text-sage text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-ivory-dark">
                    {p.category}
                  </span>
                </Link>
                <div className="p-5">
                  <Link to={`/blog/${p.id}`}>
                    <h4 className="font-serif font-bold text-charcoal hover:text-sage transition-colors leading-snug line-clamp-2">
                      {p.title}
                    </h4>
                  </Link>
                  <p className="text-charcoal-light text-xs mt-2 line-clamp-2 leading-relaxed">
                    {p.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2">
                <Link
                  to={`/blog/${p.id}`}
                  className="inline-flex items-center gap-1.5 text-sage text-xs font-semibold"
                >
                  Read Post <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
