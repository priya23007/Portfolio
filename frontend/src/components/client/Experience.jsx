import React from 'react';
import { MapPin } from 'lucide-react';
import { Reveal, SectionHeader } from '../ui/primitives';
import { BulletText } from '../ui/BulletText';

export const Experience = ({ experience }) => {
  const items = experience || [];

  return (
    <section id="experience" className="relative py-28 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          label="experience"
          title="Where I've shipped"
          subtitle="Hands-on work building and maintaining backend systems used by real people."
        />

        <div className="relative">
          {/* rail */}
          <div className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px bg-gradient-to-b from-neon-cyan/60 via-neon-violet/40 to-transparent" />

          <div className="space-y-10">
            {items.map((item, idx) => (
              <Reveal key={item.id || idx} className="relative grid md:grid-cols-4 gap-4 md:gap-10 pl-8 md:pl-0">
                {/* period column */}
                <div className="md:text-right md:pr-10 pt-1">
                  <div className="font-mono text-xs text-neon-cyan">{item.period}</div>
                  {item.location && (
                    <div className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  )}
                </div>

                {/* node */}
                <span className="absolute left-0 md:left-[25%] top-1.5 w-[15px] h-[15px] rounded-full bg-ink-950 border-2 border-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

                <div className="md:col-span-3 md:pl-10">
                  <div className="glass-card card-hover rounded-2xl p-6 sm:p-7">
                    <h3 className="text-xl font-semibold text-slate-900">{item.role}</h3>
                    <div className="text-sm font-medium text-neon-violet mb-4">{item.company}</div>
                    <BulletText text={item.description} />

                    {item.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-200">
                        {item.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="chip">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
