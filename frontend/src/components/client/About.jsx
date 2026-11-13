import React from 'react';
import { BrainCircuit, Workflow, Cpu, Network, Bot, Database } from 'lucide-react';
import { Reveal, SectionHeader } from '../ui/primitives';

const HIGHLIGHT_ICONS = [BrainCircuit, Workflow, Cpu, Network, Bot, Database];

export const About = ({ about }) => {
  const data = about || {};
  const stats = data.stats || [];
  const highlights = data.highlights || [];

  return (
    <section id="about" className="relative py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader index="01" label="about" title="Reliable backends today, intelligent systems next" subtitle={data.summary} />

        {stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-slate-200 shadow-sm border border-slate-200 mb-20">
            {stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 80} className="bg-ink-950 p-6 sm:p-8 group">
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-2 whitespace-nowrap">{stat.value}</div>
                <div className="text-sm font-medium text-slate-900">{stat.label}</div>
                {stat.description && <div className="text-xs text-slate-500 mt-1">{stat.description}</div>}
              </Reveal>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5 space-y-5 text-slate-700 leading-relaxed">
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">// background</div>
            {data.bioParagraph1 && <p>{data.bioParagraph1}</p>}
            {data.bioParagraph2 && <p className="text-slate-600">{data.bioParagraph2}</p>}
          </Reveal>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {highlights.map((h, idx) => {
              const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
              return (
                <Reveal
                  key={idx}
                  delay={idx * 90}
                  className={`glass-card card-hover rounded-2xl p-6 ${highlights.length % 2 === 1 && idx === highlights.length - 1 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-violet/15 border border-slate-200 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5">{h.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{h.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
