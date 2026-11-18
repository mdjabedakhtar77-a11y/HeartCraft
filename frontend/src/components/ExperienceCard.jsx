import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

export default function ExperienceCard({ template, categorySlug }) {
  const targetCategory = categorySlug || template.category_slug || 'birthday';
  const createUrl = `/create/${targetCategory}?templateId=${template.id}`;

  return (
    <div className="group glass-card rounded-3xl overflow-hidden border border-purple-800/30 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-card flex flex-col justify-between">
      {/* Image Preview & Badge */}
      <div className="relative h-56 overflow-hidden bg-purple-950/40">
        <img
          src={template.preview_image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600'}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-black/30" />

        {/* Category Pill */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-pink-300 border border-pink-500/30 backdrop-blur-md">
            {template.category || 'Surprise Experience'}
          </span>
        </div>

        {/* Free Tag */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/95 text-white shadow-glow backdrop-blur-md">
            Free
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-5 pt-4 border-t border-purple-900/30 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Interactive sound, animations & custom music</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant delivery via secret link & QR Code</span>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              to={createUrl}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-glow hover:shadow-pink-500/50 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <span>Personalize Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
