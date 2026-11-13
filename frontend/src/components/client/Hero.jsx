import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { NeuralBackground } from '../ui/NeuralBackground';
import { useTypewriter } from '../ui/primitives';
import { SocialLinks } from '../layout/Footer';

export const Hero = ({ hero, skills, socials, stats, onExploreClick, onContactClick }) => {
  const data = hero || {};
  const name = data.name || 'Your Name';
  const groups = skills || [];
  const allSkills = groups.flatMap((g) => g.skills || []);

  const typed = useTypewriter(
    data.targetRoles?.length ? data.targetRoles : [data.title || 'AI Engineer', ...groups.map((g) => g.category)]
  );

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-noise">
      {/* background layers */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <NeuralBackground className="opacity-80" />
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-neon-cyan/[0.12] blur-[120px]" />
      <div className="absolute top-20 -right-40 w-[560px] h-[560px] rounded-full bg-neon-violet/[0.14] blur-[130px]" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            {data.badgeText && (
              <div className="animate-fade-up inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full glass-card text-xs text-slate-700 mb-8">
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-70 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
                </span>
                {data.badgeText}
              </div>
            )}

            <h1
              className="animate-fade-up text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6"
              style={{ animationDelay: '80ms' }}
            >
              Hi, I'm <br className="hidden sm:block" />
              <span className="text-gradient">{name}</span>
            </h1>

            <div
              className="animate-fade-up font-mono text-base sm:text-lg text-slate-700 mb-6 min-h-[3.5rem] sm:min-h-[1.75rem] flex items-start"
              style={{ animationDelay: '160ms' }}
            >
              <span className="text-neon-cyan mr-2">&gt;</span>
              <span>{typed}</span>
              <span className="inline-block w-[9px] h-5 ml-1 bg-neon-cyan animate-blink" />
            </div>

            {data.headline && (
              <p
                className="animate-fade-up text-lg sm:text-xl text-slate-800 leading-relaxed mb-4 max-w-2xl"
                style={{ animationDelay: '220ms' }}
              >
                {data.headline}
              </p>
            )}
            {data.subheadline && (
              <p
                className="animate-fade-up text-base text-slate-600 leading-relaxed mb-10 max-w-2xl"
                style={{ animationDelay: '280ms' }}
              >
                {data.subheadline}
              </p>
            )}

            <div className="animate-fade-up flex flex-col sm:flex-row gap-3 sm:items-center" style={{ animationDelay: '340ms' }}>
              <button onClick={onExploreClick} className="btn-primary">
                <span>{data.primaryCtaText || 'View Projects'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onContactClick} className="btn-ghost">
                <Sparkles className="w-4 h-4 text-neon-violet" />
                <span>{data.secondaryCtaText || 'Get in Touch'}</span>
              </button>
              <SocialLinks socials={socials} className="sm:ml-3 mt-2 sm:mt-0" />
            </div>
          </div>

          {/* Right: animated cut-out portrait */}
          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '150ms' }}>
            <HeroVisual
              name={name}
              chips={allSkills.slice(0, 3)}
              stat={stats?.[0]}
              location={socials?.location}
            />
          </div>
        </div>
      </div>

      {/* skills marquee */}
      {allSkills.length > 0 && (
        <div className="relative z-10 mt-16 lg:mt-20 border-y border-slate-200 bg-sky-50/50 py-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span key={i} className="flex items-center gap-10 font-mono text-sm text-slate-600 whitespace-nowrap">
                {s}
                <span className="w-1 h-1 rounded-full bg-neon-cyan/60" />
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
