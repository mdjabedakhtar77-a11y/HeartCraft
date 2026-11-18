import React from 'react';
import { Palette, Edit3, Eye, Sparkles, Share2, HeartHandshake } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose a Theme',
      desc: 'Pick from Birthday galaxy, romantic proposal, anniversary timeline, or apology envelope.',
      icon: Palette,
      color: 'from-pink-500 to-rose-500'
    },
    {
      num: '02',
      title: 'Personalize Details',
      desc: 'Add their name, photos, heartfelt letter, custom cake styles, and optional passcode locks.',
      icon: Edit3,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      num: '03',
      title: 'Live Preview',
      desc: 'Interact with the cake, popping balloons, and letter before confirming your creation.',
      icon: Eye,
      color: 'from-fuchsia-500 to-pink-500'
    },
    {
      num: '04',
      title: '1-Click Free Publishing',
      desc: 'Publish your customized surprise instantly with 100% free access and zero payment barriers.',
      icon: Sparkles,
      color: 'from-amber-500 to-emerald-500'
    },
    {
      num: '05',
      title: 'Share Link & QR',
      desc: 'Receive an unguessable private link and QR code ready for instant WhatsApp or Instagram sharing.',
      icon: Share2,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      num: '06',
      title: 'Magic Experience',
      desc: 'The recipient opens the link without needing an account and enjoys the surprise forever.',
      icon: HeartHandshake,
      color: 'from-rose-500 to-purple-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#140822] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">Seamless 6-Step Journey</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
            How HeartCraft Works
          </h2>
          <p className="text-slate-400 text-base mt-3">
            From creation to a memorable emotional reaction in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card p-8 rounded-3xl border border-purple-800/30 hover:border-pink-500/40 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-purple-900/40 group-hover:text-pink-500/30 transition-colors font-mono">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
