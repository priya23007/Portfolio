import React, { useState, useEffect, useCallback } from 'react';
import { portfolioApi } from './services/api';
import { useAuth } from './context/AuthContext';
import { usePathname, navigate } from './hooks/useRouter';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/client/Hero';
import { About } from './components/client/About';
import { Skills } from './components/client/Skills';
import { Experience } from './components/client/Experience';
import { Education } from './components/client/Education';
import { HiringSnapshot } from './components/client/HiringSnapshot';
import { Achievements } from './components/client/Achievements';
import { Projects } from './components/client/Projects';
import { ResumeSection } from './components/client/ResumeSection';
import { EnquiryForm } from './components/client/EnquiryForm';
import { Footer } from './components/layout/Footer';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const BootScreen = ({ label = 'Loading model weights' }) => (
  <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center gap-5">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan border-r-neon-violet animate-spin" />
    </div>
    <div className="font-mono text-xs text-slate-600 tracking-wider">
      {label}<span className="animate-blink">_</span>
    </div>
  </div>
);

export function App() {
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [contentData, projectsData, formData] = await Promise.all([
        portfolioApi.getPortfolioContent(),
        portfolioApi.getProjects(),
        portfolioApi.getFormConfig(),
      ]);
      setContent(contentData);
      setProjects(projectsData);
      setFormConfig(formData);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Page title follows the owner's name / admin context
  useEffect(() => {
    const name = content?.hero?.name;
    const title = content?.hero?.title;
    document.title = isAdminRoute
      ? `Admin · ${name || 'Portfolio'}`
      : name
      ? `${name}${title ? ` — ${title}` : ''}`
      : 'Portfolio';
  }, [content, isAdminRoute]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ---------- /admin route ----------
  if (isAdminRoute) {
    if (authLoading || loading) return <BootScreen label="Authenticating session" />;

    if (!isAuthenticated) {
      return <AdminLoginPage ownerName={content?.hero?.name} />;
    }

    return (
      <div className="text-slate-900">
        <AdminDashboard
          content={content}
          projects={projects}
          onCloseAdmin={() => navigate('/')}
          onContentUpdated={(updated) => setContent(updated)}
          onProjectsUpdated={(updatedProjs) => setProjects(updatedProjs)}
        />
      </div>
    );
  }

  // ---------- Public portfolio ----------
  if (loading) return <BootScreen />;

  return (
    <div className="min-h-screen bg-ink-950 text-slate-800 flex flex-col">
      <Navbar content={content} />

      <main className="flex-1">
        <Hero
          hero={content?.hero}
          skills={content?.skills}
          socials={content?.socials}
          stats={content?.about?.stats}
          onExploreClick={() => scrollToSection('projects')}
          onContactClick={() => scrollToSection('enquiry')}
        />
        <HiringSnapshot
          hero={content?.hero}
          education={content?.education}
          skills={content?.skills}
          socials={content?.socials}
          resume={content?.resume}
        />
        <About about={content?.about} />
        <Skills skills={content?.skills} />
        <Experience experience={content?.experience} />
        <Education education={content?.education} />
        <Projects projects={projects} />
        <Achievements achievements={content?.achievements} />
        <ResumeSection resume={content?.resume} />
        <EnquiryForm socials={content?.socials} formConfig={formConfig} />
      </main>

      <Footer socials={content?.socials} hero={content?.hero} />
    </div>
  );
}

export default App;
