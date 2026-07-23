import { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import LeafDivider from '../components/LeafDivider';
import { ArrowRight, Calendar, User } from 'lucide-react';

type BlogCategory = 'All' | 'Hair Care' | 'Skin Care' | 'Wellness';

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');

  const filteredPosts = blogPosts.filter(
    (post) => activeCategory === 'All' || post.category === activeCategory
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Botanical Living</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Our Blog & Natural Tips</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Explore Ayurvedic rituals, clean beauty tips, and botanical guides for healthy skin and hair.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter pills */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {(['All', 'Hair Care', 'Skin Care', 'Wellness'] as BlogCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-ivory text-charcoal-light hover:bg-ivory-dark border border-ivory-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-ivory-dark shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:scale-[1.01]"
            >
              {/* Image */}
              <Link to={`/blog/${post.id}`} className="block h-52 overflow-hidden bg-ivory-dark relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-sage text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-ivory-dark">
                  {post.category}
                </span>
              </Link>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-charcoal-light mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </span>
                  </div>

                  <Link to={`/blog/${post.id}`}>
                    <h3 className="font-serif text-xl font-bold text-charcoal leading-snug mb-3 hover:text-sage transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-charcoal-light text-sm mb-5 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-sage hover:text-sage-dark text-sm font-semibold mt-auto"
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
