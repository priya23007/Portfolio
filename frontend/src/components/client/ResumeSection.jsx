import React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { Reveal } from '../ui/primitives';

export const ResumeSection = ({ resume }) => {
  if (!resume || !resume.isVisible || !resume.resumeUrl) return null;

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="gradient-border relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-8 sm:p-12">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-neon-cyan/10 blur-[90px]" />
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(90deg,transparent,black)]" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white border border-slate-200 items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-neon-cyan mb-2">resume.pdf</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">The full picture, on one page</h2>
                <p className="text-slate-600 max-w-xl">
                  Experience, education and skills — in a one-page PDF that's easy to share with your hiring team.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="/api/resume?download=1" className="btn-primary">
                <Download className="w-4 h-4" />
                <span>{resume.buttonText || 'Download Resume'}</span>
              </a>
              <a href="/api/resume" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
