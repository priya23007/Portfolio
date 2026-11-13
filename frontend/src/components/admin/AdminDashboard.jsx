import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileEdit,
  FolderGit2,
  FileText,
  Sliders,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContentManager } from './ContentManager';
import { ProjectManager } from './ProjectManager';
import { ResumeMediaManager } from './ResumeMediaManager';
import { FormBuilder } from './FormBuilder';
import { EnquiryManager } from './EnquiryManager';
import { SettingsSecurity } from './SettingsSecurity';

export const AdminDashboard = ({
  content,
  projects,
  onCloseAdmin,
  onContentUpdated,
  onProjectsUpdated
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { admin, logout, systemStatus } = useAuth();

  const handleLogout = () => {
    logout();
    onCloseAdmin();
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Status', icon: LayoutDashboard },
    { id: 'content', label: 'Portfolio Content', icon: FileEdit },
    { id: 'projects', label: 'Projects & Media', icon: FolderGit2 },
    { id: 'resume', label: 'Resume & Assets', icon: FileText },
    { id: 'form', label: 'Enquiry Form Builder', icon: Sliders },
    { id: 'enquiries', label: 'Client Inquiries', icon: Mail },
    { id: 'settings', label: 'Security & Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-clean">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Portfolio Admin Center</h1>
              <p className="text-[11px] text-slate-500">MongoDB • Cloudinary • Google SMTP</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
              {admin?.email}
            </span>

            <button
              onClick={onCloseAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Work Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Greeting Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft-blue flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                  Phase 2 Control Center
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Welcome back, Admin
                </h2>
                <p className="text-sm text-slate-600 max-w-xl">
                  Manage your complete portfolio content, upload projects and resumes via Cloudinary, configure your dynamic client enquiry form, and inspect client leads.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('content')}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  Edit Portfolio Content
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                >
                  Manage Projects
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clean">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {(projects || []).length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Managed in MongoDB</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clean">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Resume Status</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900 truncate">
                  {content?.resume?.resumeUrl ? 'Active & Published' : 'Pending Upload'}
                </div>
                <p className="text-xs text-slate-500 mt-1">Cloudinary storage ready</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clean">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Database Layer</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {systemStatus?.mongodbConnected ? 'MongoDB Cluster' : 'Cluster Config Ready'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {systemStatus?.mongodbConnected ? 'Connected via Motor' : 'Fallback repository active'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clean">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Email Pipeline</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base font-bold text-slate-900">
                  Google SMTP
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {systemStatus?.smtpConfigured ? 'Dispatched to your mail' : 'Set credentials in .env'}
                </p>
              </div>

            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('content')}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-soft-blue transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3">
                  <FileEdit className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Customize Portfolio Content
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Update your bio, headline, skills matrix, career timeline, and social media profile links.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('projects')}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-soft-blue transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Add / Edit Projects
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload project screenshots to Cloudinary, configure tech stacks, and update live preview URLs.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('form')}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-soft-blue transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Customize Enquiry Form
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Add questions, budget ranges, or project scopes to your client enquiry form.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <ContentManager
            initialContent={content}
            onContentSaved={onContentUpdated}
          />
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <ProjectManager
            projects={projects}
            onProjectsUpdated={onProjectsUpdated}
          />
        )}

        {/* RESUME & MEDIA TAB */}
        {activeTab === 'resume' && (
          <ResumeMediaManager
            resumeConfig={content?.resume}
            onResumeUpdated={(updatedResume) => {
              if (onContentUpdated) {
                onContentUpdated({ ...content, resume: updatedResume });
              }
            }}
          />
        )}

        {/* DYNAMIC FORM BUILDER TAB */}
        {activeTab === 'form' && <FormBuilder />}

        {/* CLIENT INQUIRIES TAB */}
        {activeTab === 'enquiries' && <EnquiryManager />}

        {/* SECURITY & CONFIG TAB */}
        {activeTab === 'settings' && <SettingsSecurity />}

      </main>

    </div>
  );
};
