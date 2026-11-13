import React, { useState } from 'react';
import { Save, Plus, Trash2, Upload, Check, RefreshCw, Layers, User, Briefcase, Share2, GraduationCap, Award } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ContentManager = ({ initialContent, onContentSaved }) => {
  const [content, setContent] = useState(initialContent || {});
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const toast = useToast();

  const handleHeroChange = (key, val) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...(prev.hero || {}), [key]: val },
    }));
  };

  const handleAboutChange = (key, val) => {
    setContent((prev) => ({
      ...prev,
      about: { ...(prev.about || {}), [key]: val },
    }));
  };

  const handleSocialsChange = (key, val) => {
    setContent((prev) => ({
      ...prev,
      socials: { ...(prev.socials || {}), [key]: val },
    }));
  };

  // Avatar upload via Cloudinary
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await portfolioApi.uploadImage(file);
      handleHeroChange('avatarUrl', res.url);
      if (res.public_id) handleHeroChange('avatarPublicId', res.public_id);
      toast.success(res.cloudinaryActive ? 'Avatar uploaded to Cloudinary.' : 'Avatar uploaded to local storage.');
    } catch (err) {
      toast.error('Failed to upload avatar image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Stats operations
  const handleStatChange = (index, key, val) => {
    const stats = [...(content.about?.stats || [])];
    stats[index] = { ...stats[index], [key]: val };
    handleAboutChange('stats', stats);
  };

  const addStat = () => {
    const stats = [...(content.about?.stats || []), { label: 'New Metric', value: '100+', description: '' }];
    handleAboutChange('stats', stats);
  };

  const removeStat = (index) => {
    const stats = (content.about?.stats || []).filter((_, i) => i !== index);
    handleAboutChange('stats', stats);
  };

  // Highlights operations
  const handleHighlightChange = (index, key, val) => {
    const highlights = [...(content.about?.highlights || [])];
    highlights[index] = { ...highlights[index], [key]: val };
    handleAboutChange('highlights', highlights);
  };

  // Skills operations
  const handleSkillGroupChange = (gIndex, key, val) => {
    const skills = [...(content.skills || [])];
    skills[gIndex] = { ...skills[gIndex], [key]: val };
    setContent((prev) => ({ ...prev, skills }));
  };

  const handleSkillTagsChange = (gIndex, tagsString) => {
    const tags = tagsString.split(',').map((t) => t.trim()).filter(Boolean);
    handleSkillGroupChange(gIndex, 'skills', tags);
  };

  const addSkillGroup = () => {
    const skills = [...(content.skills || []), { category: 'New Category', description: '', skills: ['Tool 1', 'Tool 2'] }];
    setContent((prev) => ({ ...prev, skills }));
  };

  const removeSkillGroup = (index) => {
    const skills = (content.skills || []).filter((_, i) => i !== index);
    setContent((prev) => ({ ...prev, skills }));
  };

  // Experience operations
  const handleExpChange = (index, key, val) => {
    const exp = [...(content.experience || [])];
    exp[index] = { ...exp[index], [key]: val };
    setContent((prev) => ({ ...prev, experience: exp }));
  };

  const addExperienceItem = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Full Stack Engineer',
      company: 'Company Name',
      period: '2024 - Present',
      location: 'Remote / City',
      description: 'Key deliverables, technical achievements, and milestones...',
      technologies: ['FastAPI', 'React', 'MongoDB'],
    };
    setContent((prev) => ({ ...prev, experience: [...(prev.experience || []), newExp] }));
  };

  const removeExperienceItem = (index) => {
    const exp = (content.experience || []).filter((_, i) => i !== index);
    setContent((prev) => ({ ...prev, experience: exp }));
  };

  // Education operations
  const handleEduChange = (index, key, val) => {
    const edu = [...(content.education || [])];
    edu[index] = { ...edu[index], [key]: val };
    setContent((prev) => ({ ...prev, education: edu }));
  };

  const addEducationItem = () => {
    const item = { id: `edu-${Date.now()}`, degree: 'Degree / Certificate', institution: 'Institution', period: '2024 - 2028', location: '', description: '' };
    setContent((prev) => ({ ...prev, education: [...(prev.education || []), item] }));
  };

  const removeEducationItem = (index) => {
    setContent((prev) => ({ ...prev, education: (prev.education || []).filter((_, i) => i !== index) }));
  };

  // Achievements operations
  const handleAchChange = (index, key, val) => {
    const list = [...(content.achievements || [])];
    list[index] = { ...list[index], [key]: val };
    setContent((prev) => ({ ...prev, achievements: list }));
  };
  const addAchievement = () => {
    const item = { id: `ach-${Date.now()}`, title: 'Achievement title', type: 'Certification', issuer: '', date: '', description: '', url: '' };
    setContent((prev) => ({ ...prev, achievements: [...(prev.achievements || []), item] }));
  };
  const removeAchievement = (index) => {
    setContent((prev) => ({ ...prev, achievements: (prev.achievements || []).filter((_, i) => i !== index) }));
  };

  // Save full content
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await portfolioApi.updatePortfolioContent(content);
      setContent(res);
      if (onContentSaved) onContentSaved(res);
      toast.success('Portfolio content successfully saved to MongoDB database.');
    } catch (err) {
      toast.error('Failed to save content to database.');
    } finally {
      setSaving(false);
    }
  };

  const hero = content.hero || {};
  const about = content.about || {};
  const socials = content.socials || {};

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-clean">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Portfolio Content Editor</h2>
          <p className="text-xs text-slate-500">Edit any text, biography, skills, and links stored in your MongoDB database.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold text-xs transition-all shadow-sm"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving to MongoDB...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Content to Database</span>
            </>
          )}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl">
        {[
          { id: 'hero', label: 'Hero & Intro', icon: User },
          { id: 'about', label: 'About & Stats', icon: Layers },
          { id: 'skills', label: 'Skills Matrix', icon: Check },
          { id: 'experience', label: 'Work Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'socials', label: 'Socials & Contact', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-sky-600" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab: HERO */}
      {activeSubTab === 'hero' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Hero Section Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                value={hero.name || ''}
                onChange={(e) => handleHeroChange('name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title</label>
              <input
                type="text"
                value={hero.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Headline</label>
              <textarea
                rows={2}
                value={hero.headline || ''}
                onChange={(e) => handleHeroChange('headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subheadline / Supporting Description</label>
              <textarea
                rows={2}
                value={hero.subheadline || ''}
                onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Roles (comma-separated — shown in the hero typing line and the hiring snapshot)</label>
              <input
                type="text"
                value={(hero.targetRoles || []).join(', ')}
                onChange={(e) => handleHeroChange('targetRoles', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                placeholder="Backend Developer Intern, AI/ML Engineer Intern"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Availability (e.g. Available now)</label>
              <input
                type="text"
                value={hero.availability || ''}
                onChange={(e) => handleHeroChange('availability', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode (e.g. Remote · Hybrid · On-site in Delhi NCR)</label>
              <input
                type="text"
                value={hero.workMode || ''}
                onChange={(e) => handleHeroChange('workMode', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Badge Text</label>
              <input
                type="text"
                value={hero.badgeText || ''}
                onChange={(e) => handleHeroChange('badgeText', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Button Text</label>
              <input
                type="text"
                value={hero.primaryCtaText || ''}
                onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Avatar Uploader with Cloudinary */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
                <img
                  src={hero.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Profile Portrait (Cloudinary Upload)</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:border-sky-400 text-slate-700 text-xs font-semibold cursor-pointer shadow-clean transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>{uploadingAvatar ? 'Uploading to Cloudinary...' : 'Upload New Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={hero.avatarUrl || ''}
                    onChange={(e) => handleHeroChange('avatarUrl', e.target.value)}
                    placeholder="Or paste direct image URL"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none min-w-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: ABOUT */}
      {activeSubTab === 'about' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">About & Metrics</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary</label>
              <textarea
                rows={2}
                value={about.summary || ''}
                onChange={(e) => handleAboutChange('summary', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio Paragraph 1</label>
              <textarea
                rows={3}
                value={about.bioParagraph1 || ''}
                onChange={(e) => handleAboutChange('bioParagraph1', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio Paragraph 2</label>
              <textarea
                rows={3}
                value={about.bioParagraph2 || ''}
                onChange={(e) => handleAboutChange('bioParagraph2', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats editor */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Numerical Stats (Grid Counters)</h4>
              <button
                onClick={addStat}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stat Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(about.stats || []).map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 5+)"
                        className="w-1/3 px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs font-bold text-sky-700 focus:border-sky-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Years Exp)"
                        className="flex-1 px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={stat.description || ''}
                      onChange={(e) => handleStatChange(idx, 'description', e.target.value)}
                      placeholder="Subtext description"
                      className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] text-slate-500 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: SKILLS */}
      {activeSubTab === 'skills' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Skills Matrix Categories</h3>
              <p className="text-xs text-slate-500">Categories and comma-separated tags rendered on your client portfolio.</p>
            </div>
            <button
              onClick={addSkillGroup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill Category</span>
            </button>
          </div>

          <div className="space-y-4">
            {(content.skills || []).map((group, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={group.category}
                    onChange={(e) => handleSkillGroupChange(idx, 'category', e.target.value)}
                    placeholder="Category Title"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:border-sky-500 focus:outline-none flex-1 max-w-xs"
                  />
                  <button
                    onClick={() => removeSkillGroup(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={group.description || ''}
                  onChange={(e) => handleSkillGroupChange(idx, 'description', e.target.value)}
                  placeholder="Category description"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus:border-sky-500 focus:outline-none"
                />

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Skills / Technologies (Comma-Separated)
                  </label>
                  <textarea
                    rows={2}
                    value={(group.skills || []).join(', ')}
                    onChange={(e) => handleSkillTagsChange(idx, e.target.value)}
                    placeholder="React, FastAPI, MongoDB, Docker..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: EXPERIENCE */}
      {activeSubTab === 'experience' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Work Experience Track Record</h3>
              <p className="text-xs text-slate-500">Roles, companies, dates, and responsibilities shown on the timeline.</p>
            </div>
            <button
              onClick={addExperienceItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {(content.experience || []).map((exp, idx) => (
              <div key={exp.id || idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExpChange(idx, 'role', e.target.value)}
                      placeholder="Role (e.g. Senior Full Stack Engineer)"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                      placeholder="Company"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-sky-700 font-semibold focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleExpChange(idx, 'period', e.target.value)}
                      placeholder="Period (e.g. 2023 - Present)"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => handleExpChange(idx, 'location', e.target.value)}
                      placeholder="Location (e.g. Bengaluru / Remote)"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeExperienceItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={exp.description}
                    onChange={(e) => handleExpChange(idx, 'description', e.target.value)}
                    placeholder="Description of role and impact..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Technologies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(exp.technologies || []).join(', ')}
                    onChange={(e) => handleExpChange(idx, 'technologies', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                    placeholder="FastAPI, React, MongoDB..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: EDUCATION */}
      {activeSubTab === 'education' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Education</h3>
              <p className="text-xs text-slate-500">Degrees and schooling shown in the Education section. One point per line in the details box.</p>
            </div>
            <button
              onClick={addEducationItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-4">
            {(content.education || []).map((edu, idx) => (
              <div key={edu.id || idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    {[
                      ['degree', 'Degree (e.g. B.Tech in AI)', 'font-bold text-slate-900'],
                      ['institution', 'Institution', 'text-sky-700 font-semibold'],
                      ['period', 'Period (e.g. Aug 2025 - Apr 2029)', 'text-slate-600'],
                      ['location', 'Location (optional)', 'text-slate-600'],
                    ].map(([key, ph, cls]) => (
                      <input
                        key={key}
                        type="text"
                        value={edu[key] || ''}
                        onChange={(e) => handleEduChange(idx, key, e.target.value)}
                        placeholder={ph}
                        className={`px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs ${cls} focus:border-sky-500 focus:outline-none`}
                      />
                    ))}
                  </div>
                  <button onClick={() => removeEducationItem(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={edu.description || ''}
                  onChange={(e) => handleEduChange(idx, 'description', e.target.value)}
                  placeholder="Highlights, one per line..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: ACHIEVEMENTS */}
      {activeSubTab === 'achievements' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Achievements, Certifications & Hackathons</h3>
              <p className="text-xs text-slate-500">Proof points recruiters look for. Add a credential/certificate link where you have one.</p>
            </div>
            <button
              onClick={addAchievement}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          </div>

          <div className="space-y-4">
            {(content.achievements || []).map((a, idx) => (
              <div key={a.id || idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <input type="text" value={a.title || ''} onChange={(e) => handleAchChange(idx, 'title', e.target.value)} placeholder="Title (e.g. Smart India Hackathon — Finalist)" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-sky-500 focus:outline-none" />
                    <select value={a.type || 'Achievement'} onChange={(e) => handleAchChange(idx, 'type', e.target.value)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none">
                      {['Certification', 'Hackathon', 'Internship', 'Award', 'Achievement'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="text" value={a.issuer || ''} onChange={(e) => handleAchChange(idx, 'issuer', e.target.value)} placeholder="Issuer / Organiser (e.g. Google)" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-sky-700 font-semibold focus:border-sky-500 focus:outline-none" />
                    <input type="text" value={a.date || ''} onChange={(e) => handleAchChange(idx, 'date', e.target.value)} placeholder="Date (e.g. Mar 2026)" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus:border-sky-500 focus:outline-none" />
                    <input type="url" value={a.url || ''} onChange={(e) => handleAchChange(idx, 'url', e.target.value)} placeholder="Certificate / proof link (optional)" className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 focus:border-sky-500 focus:outline-none" />
                  </div>
                  <button onClick={() => removeAchievement(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea rows={2} value={a.description || ''} onChange={(e) => handleAchChange(idx, 'description', e.target.value)} placeholder="What you did / what you learned (one point per line)" className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: SOCIALS */}
      {activeSubTab === 'socials' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Social Links & Contact Coordinates</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={socials.email || ''}
                onChange={(e) => handleSocialsChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={socials.location || ''}
                onChange={(e) => handleSocialsChange('location', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={socials.github || ''}
                onChange={(e) => handleSocialsChange('github', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={socials.linkedin || ''}
                onChange={(e) => handleSocialsChange('linkedin', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Website (Optional)</label>
              <input
                type="url"
                value={socials.website || ''}
                onChange={(e) => handleSocialsChange('website', e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter / X URL (Optional)</label>
              <input
                type="url"
                value={socials.twitter || ''}
                onChange={(e) => handleSocialsChange('twitter', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
