import React, { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';

const NAV_LINKS = [
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Projects', id: 'projects' },
  { name: 'Contact', id: 'enquiry' },
];

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'AI';

export const Navbar = ({ content }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // scroll-spy
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const name = content?.hero?.name || 'Portfolio';
  const role = content?.hero?.title || 'AI Engineer';
  const resume = content?.resume;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ink-950/75 backdrop-blur-xl border-b border-slate-200' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-9 h-9 rounded-lg p-px bg-gradient-to-br from-neon-cyan to-neon-violet">
            <div className="w-full h-full rounded-[7px] bg-ink-950 flex items-center justify-center font-mono text-sm font-semibold text-slate-900">
              {initials(name)}
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-semibold text-slate-900 text-[15px] tracking-tight">{name}</span>
            <span className="text-[11px] font-mono text-slate-600 truncate max-w-[180px]">{role}</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => go(e, link.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                active === link.id ? 'bg-sky-50 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {resume?.isVisible && resume?.resumeUrl ? (
            <a href="/api/resume?download=1" className="btn-ghost !px-4 !py-2 !text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>{resume.buttonText || 'Resume'}</span>
            </a>
          ) : (
            <a href="#enquiry" onClick={(e) => go(e, 'enquiry')} className="btn-primary !px-4 !py-2 !text-xs">
              Let's talk
            </a>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-ink-950/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-2 pb-6 space-y-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => go(e, link.id)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-sky-50"
            >
              <span className="font-mono text-xs text-neon-cyan">0{i + 1}</span>
              {link.name}
            </a>
          ))}
          {resume?.isVisible && resume?.resumeUrl && (
            <a href="/api/resume?download=1" className="btn-primary w-full mt-3">
              <Download className="w-4 h-4" />
              <span>{resume.buttonText || 'Download Resume'}</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};
