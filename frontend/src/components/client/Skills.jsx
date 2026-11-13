import React from 'react';
import { BrainCircuit, Layers, Terminal, Database, Cloud, Bot, Wrench, Smartphone } from 'lucide-react';
import { Reveal, SectionHeader } from '../ui/primitives';

const iconFor = (category = '') => {
  const c = category.toLowerCase();
  if (/(ios|mobile|swift|android)/.test(c)) return Smartphone;
  if (/(ml|machine|deep|ai|model|vision|nlp)/.test(c)) return BrainCircuit;
  if (/(llm|gen|agent|rag|prompt)/.test(c)) return Bot;
  if (/(front|ui|web)/.test(c)) return Layers;
  if (/(back|api|server|language|program)/.test(c)) return Terminal;
  if (/(data|db|sql|vector)/.test(c)) return Database;
  if (/(cloud|devops|mlops|infra|deploy)/.test(c)) return Cloud;
  return Wrench;
};

export const Skills = ({ skills }) => {
  const groups = skills || [];

  return (
    <section id="skills" className="relative py-28 border-t border-slate-200">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="02"
          label="capabilities"
          title="The stack behind the systems"
          subtitle="Languages, frameworks, databases and tools I use to design, build and ship backend systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group, idx) => {
            const Icon = iconFor(group.category);
            return (
              <Reveal key={idx} delay={(idx % 2) * 100} className="glass-card card-hover rounded-2xl p-6 sm:p-7 group">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-ink-800 border border-slate-200 flex items-center justify-center group-hover:border-neon-cyan/40 transition-colors">
                      <Icon className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{group.category}</h3>
                      {group.description && <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    [{String((group.skills || []).length).padStart(2, '0')}]
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(group.skills || []).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg text-[13px] text-slate-700 bg-white border border-slate-200 hover:border-neon-cyan/40 hover:text-slate-900 hover:bg-neon-cyan/[0.06] transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
