import React from 'react';
import { Award, Trophy, Briefcase, BadgeCheck, Star, ExternalLink } from 'lucide-react';
import { Reveal, SectionHeader } from '../ui/primitives';
import { BulletText } from '../ui/BulletText';

const TYPE_ICON = { Certification: BadgeCheck, Hackathon: Trophy, Internship: Briefcase, Award: Award };

export const Achievements = ({ achievements }) => {
  const items = achievements || [];
  if (!items.length) return null;

  return (
    <section id="achievements" className="relative py-28 border-t border-slate-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="06"
          label="achievements"
          title="Certifications & milestones"
          subtitle="Proof of learning and building beyond the classroom."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((a, idx) => {
            const Icon = TYPE_ICON[a.type] || Star;
            return (
              <Reveal key={a.id || idx} delay={(idx % 3) * 90} className="glass-card card-hover rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-glow">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="chip">{a.type || 'Achievement'}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{a.title}</h3>
                {(a.issuer || a.date) && (
                  <div className="text-sm text-neon-violet font-medium mt-0.5">
                    {[a.issuer, a.date].filter(Boolean).join(' · ')}
                  </div>
                )}
                {a.description && <BulletText text={a.description} className="mt-3" />}
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan hover:underline"
                  >
                    View credential <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
