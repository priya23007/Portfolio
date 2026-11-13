import React, { useEffect, useRef } from 'react';
import { BrainCircuit, Bot, Cpu, Sparkles, MapPin } from 'lucide-react';

const HERO_IMAGE = '/hero-cutout.webp';
const CHIP_ICONS = [BrainCircuit, Bot, Cpu];

/**
 * Animated cut-out portrait:
 *  - rises in on load, then floats gently
 *  - layered rings / glow / chips move at different depths with the mouse (parallax)
 *  - a light "scan" band sweeps through the silhouette only (masked by the photo's alpha)
 */
export const HeroVisual = ({ name, chips = [], stat, location }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', Math.max(-1, Math.min(1, x)).toFixed(3));
        el.style.setProperty('--py', Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const depth = (d) => ({
    transform: `translate3d(calc(var(--px, 0) * ${d}px), calc(var(--py, 0) * ${d}px), 0)`,
    transition: 'transform 0.3s ease-out',
  });

  const chipPos = [
    'top-[14%] -left-2 sm:-left-6',
    'top-[34%] -right-2 sm:-right-8',
    'bottom-[20%] -left-4 sm:-left-10',
  ];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px] aspect-[4/5] select-none">
      {/* soft glow */}
      <div className="absolute inset-x-[8%] bottom-[4%] top-[18%] rounded-full bg-sky-300/40 blur-[70px]" style={depth(8)} />

      {/* backdrop disc */}
      <div className="absolute left-1/2 bottom-[3%] w-[86%] aspect-square -translate-x-1/2">
        <div className="w-full h-full" style={depth(12)}>
          <div className="w-full h-full rounded-full bg-gradient-to-b from-sky-100 via-sky-50 to-white border border-sky-100 shadow-[inset_0_-30px_60px_rgba(2,132,199,0.10)] animate-[fade-up_0.8s_ease-out_both]" />
        </div>
      </div>

      {/* rings */}
      <div className="absolute left-1/2 bottom-[-2%] w-[98%] aspect-square -translate-x-1/2 pointer-events-none">
        <div className="w-full h-full" style={depth(20)}>
          <div className="w-full h-full rounded-full border border-dashed border-sky-300/70 animate-spin-slow" />
        </div>
      </div>
      <div className="absolute left-1/2 bottom-[-2%] w-[98%] aspect-square -translate-x-1/2 pointer-events-none">
        <div className="w-full h-full" style={depth(20)}>
          <div
            className="w-full h-full rounded-full animate-[spin-slow_7s_linear_infinite_reverse]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0 62%, rgba(14,165,233,0.9) 80%, rgba(37,99,235,1) 88%, transparent 89%)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            }}
          />
        </div>
      </div>

      {/* orbiting node */}
      <div className="absolute left-1/2 bottom-[-2%] w-[98%] aspect-square -translate-x-1/2 pointer-events-none animate-[spin-slow_18s_linear_infinite]">
        <span className="absolute left-1/2 -top-1.5 w-3 h-3 -translate-x-1/2 rounded-full bg-sky-500 shadow-[0_0_14px_4px_rgba(14,165,233,0.55)]" />
      </div>

      {/* portrait */}
      <div className="absolute inset-0 flex items-end justify-center" style={depth(-10)}>
        <div className="relative h-[104%] animate-[rise_1s_cubic-bezier(.2,.8,.2,1)_both]">
          <div className="relative h-full animate-float">
            <img
              src={HERO_IMAGE}
              alt={name}
              className="h-full w-auto object-contain object-bottom drop-shadow-[0_30px_35px_rgba(2,132,199,0.22)]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, #000 80%, transparent 99%)',
                maskImage: 'linear-gradient(to bottom, #000 80%, transparent 99%)',
              }}
              draggable="false"
              loading="eager"
              fetchpriority="high"
            />
            {/* scan band clipped to silhouette */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                WebkitMaskImage: `url(${HERO_IMAGE})`,
                maskImage: `url(${HERO_IMAGE})`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'bottom center',
                maskPosition: 'bottom center',
              }}
            >
              <div className="absolute inset-x-0 h-1/5 bg-gradient-to-b from-transparent via-sky-300/35 to-transparent animate-[scan_5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      {chips.slice(0, 3).map((chip, i) => {
        const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
        return (
          <div key={chip} className={`absolute ${chipPos[i]} z-10 ${i === 2 ? 'hidden sm:block' : ''}`} style={depth(28 - i * 6)}>
            <div
              className="animate-[pop_0.6s_cubic-bezier(.2,.8,.2,1)_both]"
              style={{ animationDelay: `${600 + i * 180}ms` }}
            >
              <div className="animate-float" style={{ animationDelay: `${i * -2}s` }}>
                <div className="flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-2.5 py-1.5 sm:pl-2 sm:pr-3.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur border border-sky-100 shadow-[0_10px_30px_-10px_rgba(2,132,199,0.35)]">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-semibold text-slate-800 whitespace-nowrap">{chip}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* stat / identity card */}
      <div className="absolute bottom-[8%] -right-2 sm:-right-6 z-10" style={depth(24)}>
        <div className="animate-[pop_0.6s_cubic-bezier(.2,.8,.2,1)_both]" style={{ animationDelay: '1200ms' }}>
          <div className="animate-float" style={{ animationDelay: '-1s' }}>
            <div className="rounded-2xl bg-white/90 backdrop-blur border border-sky-100 shadow-[0_10px_30px_-10px_rgba(2,132,199,0.35)] px-3 py-2 sm:px-4 sm:py-3">
              {stat ? (
                <>
                  <div className="font-display text-2xl font-bold text-gradient leading-none">{stat.value}</div>
                  <div className="text-[11px] font-medium text-slate-600 mt-1">{stat.label}</div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Sparkles className="w-4 h-4 text-sky-600" /> Building with AI
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 font-mono">
                  <MapPin className="w-3 h-3" /> {location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
