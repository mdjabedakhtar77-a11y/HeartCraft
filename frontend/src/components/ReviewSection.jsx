import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';

export default function ReviewSection({ reviews = [] }) {
  const fallbackReviews = [
    {
      id: 1,
      author_name: 'Aarav & Meera',
      rating: 5,
      comment: 'The interactive proposal was completely magical! She laughed so hard trying to click the "No" button, and cried happy tears when she clicked "Yes". 10/10 recommend!',
      occasion: 'Romantic Proposal'
    },
    {
      id: 2,
      author_name: 'Priya Sharma',
      rating: 5,
      comment: 'The birthday cake cutting and balloon popping sound effects felt so real! My best friend called me immediately crying tears of joy from across the country.',
      occasion: 'Birthday Surprise'
    },
    {
      id: 3,
      author_name: 'Rohan Verma',
      rating: 5,
      comment: 'The wax seal apology card helped me resolve a huge fight with my girlfriend. She said it was the most thoughtful gesture she had ever seen.',
      occasion: 'Apology Card'
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-pink-400" />
            <span>Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Loved By Over 50,000+ Couples & Friends
          </h2>
          <p className="text-slate-400 text-base mt-3">
            Real reactions from people who made their loved ones feel truly special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-8 rounded-3xl border border-purple-800/30 flex flex-col justify-between hover:border-pink-500/40 transition-all duration-300 relative group"
            >
              <div>
                <Quote className="w-8 h-8 text-pink-500/20 mb-4" />
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-900/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.author_name}</h4>
                  <p className="text-xs text-pink-400">{rev.occasion || 'Verified Surprise'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xs font-bold text-pink-300">
                  {rev.author_name[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
