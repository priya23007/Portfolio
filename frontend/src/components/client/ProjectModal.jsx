import React, { useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { BulletText } from '../ui/BulletText';

export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative bg-ink-900 rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neon-cyan">~/projects/</span>
            <span className="text-slate-700 truncate">{project.slug || project.title}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-sky-50 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
          {project.imageUrl && (
            <div className="rounded-xl overflow-hidden aspect-video bg-ink-800 border border-slate-200">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.category && <span className="chip">{project.category}</span>}
              {project.featured && <span className="chip !text-neon-cyan !border-neon-cyan/30">featured</span>}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{project.title}</h3>
            <p className="text-base text-slate-600">{project.shortDescription}</p>
          </div>

          {project.fullDescription && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">// architecture &amp; implementation</h4>
              <BulletText text={project.fullDescription} />
            </div>
          )}

          {project.techStack?.length > 0 && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">// stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="chip !text-xs !px-3 !py-1.5">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {(project.liveUrl || project.githubUrl) && (
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <span>Live demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <Github className="w-4 h-4" />
                  <span>Source</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
