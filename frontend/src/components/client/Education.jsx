import React from 'react';
import { GraduationCap, School, MapPin } from 'lucide-react';
import { Reveal, SectionHeader } from '../ui/primitives';
import { BulletText } from '../ui/BulletText';

export const Education = ({ education }) => {
  const items = education || [];
  if (!items.length) return null;

  return (
    <section id="education" className="relative py-28 border-t border-slate-200">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="04"
          label="education"
          title="Learning foundations"
          subtitle="Formal education alongside hands-on engineering work."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = idx === 0 ? GraduationCap : School;
            return (
              <Reveal key={item.id || idx} delay={(idx % 2) * 100} className="glass-card card-hover rounded-2xl p-6 sm:p-7 flex flex-col">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shrink-0 shadow-glow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold text-slate-900">{item.degree}</h3>
                      <span className="font-mono text-xs text-neon-cyan whitespace-nowrap">{item.period}</span>
                    </div>
                    <div className="text-sm font-medium text-neon-violet">{item.institution}</div>
                    {item.location && (
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </div>
                    )}
                  </div>
                </div>
                {item.description && <BulletText text={item.description} className="pt-5 border-t border-slate-200" />}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
