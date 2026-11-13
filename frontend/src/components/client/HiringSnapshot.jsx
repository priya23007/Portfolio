import React from 'react';
import { Briefcase, CalendarCheck, MapPin, GraduationCap, Code2, Download, Mail, Linkedin, Github } from 'lucide-react';
import { Reveal } from '../ui/primitives';

/**
 * Recruiter-first summary right under the hero: everything needed to shortlist
 * (roles, availability, location, education, core stack) plus one-click actions.
 */
export const HiringSnapshot = ({ hero, education, skills, socials, resume }) => {
  const roles = hero?.targetRoles || [];
  const edu = education?.[0];
  const stack = (skills?.[0]?.skills || []).slice(0, 5);

  const facts = [
    hero?.availability && { icon: CalendarCheck, label: 'Availability', value: hero.availability, accent: true },
    (socials?.location || hero?.workMode) && {
      icon: MapPin,
      label: 'Location',
      value: [socials?.location, hero?.workMode].filter(Boolean).join(' · '),
    },
    edu && { icon: GraduationCap, label: 'Education', value: `${edu.degree}${edu.period ? ` · ${edu.period.split('-').pop().trim()}` : ''}` },
    stack.length > 0 && { icon: Code2, label: 'Core stack', value: stack.join(', ') },
  ].filter(Boolean);

  if (!roles.length && !facts.length) return null;

  const hasResume = resume?.isVisible && resume?.resumeUrl;

  return (
    <section aria-label="Hiring snapshot" className="relative -mt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="gradient-border glass-card rounded-[1.25rem] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-neon-cyan" />
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500">hiring snapshot</span>
              </div>

              {roles.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-semibold text-slate-900 mb-2.5">Open to</div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <span key={r} className="px-3 py-1.5 rounded-full text-[13px] font-medium text-sky-800 bg-sky-50 border border-sky-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {facts.map(({ icon: Icon, label, value, accent }) => (
                  <div key={label} className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent ? 'bg-emerald-50 border border-emerald-200' : 'bg-sky-50 border border-sky-100'}`}>
                      <Icon className={`w-4 h-4 ${accent ? 'text-emerald-600' : 'text-neon-cyan'}`} />
                    </div>
                    <div className="min-w-0">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{label}</dt>
                      <dd className={`text-sm font-medium ${accent ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-60 shrink-0">
              {hasResume && (
                <a href="/api/resume?download=1" className="btn-primary w-full">
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}
              {socials?.email && (
                <a href={`mailto:${socials.email}?subject=${encodeURIComponent('Internship opportunity')}`} className="btn-ghost w-full">
                  <Mail className="w-4 h-4" /> Email me
                </a>
              )}
              <div className="flex gap-3">
                {socials?.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 !px-3">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {socials?.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 !px-3">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
