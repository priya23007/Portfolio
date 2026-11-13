import React from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowUp, Globe } from 'lucide-react';
import { initials } from './Navbar';

export const SocialLinks = ({ socials, className = '' }) => {
  const items = [
    socials?.github && { href: socials.github, icon: Github, label: 'GitHub' },
    socials?.linkedin && { href: socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    socials?.twitter && { href: socials.twitter, icon: Twitter, label: 'X / Twitter' },
    socials?.website && { href: socials.website, icon: Globe, label: 'Website' },
    socials?.email && { href: `mailto:${socials.email}`, icon: Mail, label: 'Email' },
  ].filter(Boolean);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-neon-cyan hover:border-neon-cyan/40 flex items-center justify-center transition-all"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
};

export const Footer = ({ socials, hero }) => {
  const year = new Date().getFullYear();
  const name = hero?.name || 'Portfolio';

  return (
    <footer className="relative border-t border-slate-200 bg-ink-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl p-px bg-gradient-to-br from-neon-cyan to-neon-violet">
              <div className="w-full h-full rounded-[11px] bg-ink-950 flex items-center justify-center font-mono font-semibold text-slate-900">
                {initials(name)}
              </div>
            </div>
            <div>
              <div className="font-display font-semibold text-slate-900">{name}</div>
              <div className="text-xs font-mono text-slate-500">{hero?.title || 'AI Engineer'}</div>
            </div>
          </div>

          <SocialLinks socials={socials} />
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} {name}. Designed &amp; engineered end to end.</p>
          <div className="flex items-center gap-5 font-mono">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
              </span>
              all systems operational
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 hover:text-neon-cyan transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" /> top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
