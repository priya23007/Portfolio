import React, { useEffect, useRef, useState } from 'react';

/** Fades/slides children in when they scroll into view. */
export const Reveal = ({ children, delay = 0, className = '', as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

/** Consistent section heading: mono index + gradient rule + title. */
export const SectionHeader = ({ index, label, title, subtitle, align = 'left', children }) => (
  <Reveal className={`mb-14 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl`}>
    <div className={`flex items-center gap-3 mb-4 font-mono text-xs tracking-widest uppercase ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="text-neon-cyan">{index}</span>
      <span className="h-px w-10 bg-gradient-to-r from-neon-cyan/70 to-transparent" />
      <span className="text-slate-500">{label}</span>
    </div>
    <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-[1.1] mb-4">{title}</h2>
    {subtitle && <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{subtitle}</p>}
    {children}
  </Reveal>
);

/** Typewriter that cycles through a list of phrases. */
export const useTypewriter = (phrases, { typeSpeed = 55, deleteSpeed = 30, hold = 1800 } = {}) => {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const list = phrases.filter(Boolean);
  const key = list.join('|');

  useEffect(() => {
    if (!list.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(list[0]);
      return;
    }
    const current = list[i % list.length];
    let t;
    if (!deleting && text === current) {
      if (list.length === 1) return;
      t = setTimeout(() => setDeleting(true), hold);
    } else if (deleting && text === '') {
      setDeleting(false);
      setI((v) => (v + 1) % list.length);
    } else {
      t = setTimeout(
        () => setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed
      );
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, deleting, i, key]);

  return text;
};
