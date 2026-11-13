import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { Reveal, SectionHeader } from '../ui/primitives';

export const Projects = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const items = projects || [];
  const categories = ['All', ...new Set(items.map((p) => p.category).filter(Boolean))];
  const filtered = activeCategory === 'All' ? items : items.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-28 border-t border-slate-200 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-neon-violet/[0.07] blur-[140px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeader
            index="05"
            label="selected work"
            title="Projects & experiments"
            subtitle="Things I have designed and built — open any project to see how it works."
          />

          {categories.length > 2 && (
            <Reveal className="flex flex-wrap gap-1 p-1 rounded-xl glass-card self-start lg:self-auto mb-14">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat ? 'bg-neon-cyan text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </Reveal>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, idx) => (
            <Reveal key={project.id} delay={(idx % 3) * 90}>
              <article
                onClick={() => setSelectedProject(project)}
                className="group h-full cursor-pointer glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-neon-cyan/30 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${['from-sky-500 via-sky-600 to-blue-700', 'from-blue-600 via-blue-700 to-indigo-800', 'from-cyan-500 via-sky-600 to-blue-800'][idx % 3]} flex flex-col items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:28px_28px]" />
                      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-white/30" />
                      <div className="absolute -right-2 -bottom-2 w-32 h-32 rounded-full border border-white/20" />
                      <span className="relative font-display font-bold text-white text-2xl sm:text-[1.7rem] leading-tight px-6 text-center drop-shadow-sm">
                        {project.title.split(/\s+[—-]\s+/)[0]}
                      </span>
                      <span className="relative mt-2 font-mono text-[11px] text-white/80 px-6 text-center">
                        {(project.techStack || []).slice(0, 3).join(' · ')}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.category && (
                      <span className="px-2.5 py-1 rounded-md bg-ink-950/70 backdrop-blur text-[11px] font-mono text-slate-800 border border-slate-200">
                        {project.category}
                      </span>
                    )}
                    {project.featured && (
                      <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-neon-cyan to-neon-violet text-[11px] font-semibold text-ink-950">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-sky-50 backdrop-blur border border-slate-200 flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-slate-900" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-neon-cyan transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2">{project.shortDescription}</p>

                  <div className="mt-auto flex items-end justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.techStack || []).slice(0, 3).map((tech, i) => (
                        <span key={i} className="chip">{tech}</span>
                      ))}
                      {(project.techStack || []).length > 3 && (
                        <span className="chip text-neon-cyan">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors" title="Source code">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-neon-cyan transition-colors" title="Live demo">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500 glass-card rounded-2xl font-mono text-sm">
            // no projects in this category yet
          </div>
        )}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};
