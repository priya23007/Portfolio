import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, Github, Upload, Image as ImageIcon, Check, X } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ProjectManager = ({ projects: initialProjects, onProjectsUpdated }) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const emptyForm = {
    title: '',
    category: 'Full Stack',
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
    cloudinaryPublicId: '',
    techStack: ['FastAPI', 'React', 'MongoDB'],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: (projects.length + 1),
  };

  const [formData, setFormData] = useState(emptyForm);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ ...emptyForm, order: projects.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'Full Stack',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      imageUrl: project.imageUrl || '',
      cloudinaryPublicId: project.cloudinaryPublicId || '',
      techStack: project.techStack || [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: !!project.featured,
      order: project.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await portfolioApi.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.url,
        cloudinaryPublicId: res.public_id || '',
      }));
      toast.success(res.cloudinaryActive ? 'Project image uploaded to Cloudinary.' : 'Project image saved to local storage.');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Please upload or provide an image URL for the project.');
      return;
    }

    setSaving(true);
    try {
      let updatedList;
      if (editingProject) {
        const res = await portfolioApi.updateProject(editingProject.id, formData);
        updatedList = projects.map((p) => (p.id === editingProject.id ? res : p));
        toast.success('Project updated successfully in MongoDB.');
      } else {
        const res = await portfolioApi.createProject(formData);
        updatedList = [...projects, res];
        toast.success('New project created and stored in MongoDB.');
      }

      setProjects(updatedList);
      if (onProjectsUpdated) onProjectsUpdated(updatedList);
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project from the database?')) return;
    try {
      await portfolioApi.deleteProject(id);
      const updatedList = projects.filter((p) => p.id !== id);
      setProjects(updatedList);
      if (onProjectsUpdated) onProjectsUpdated(updatedList);
      toast.success('Project removed from MongoDB.');
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const list = [...projects];
    const item = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = item;

    // Update order numbers
    const orderMap = {};
    list.forEach((p, idx) => {
      p.order = idx + 1;
      orderMap[p.id] = idx + 1;
    });

    setProjects(list);
    try {
      await portfolioApi.reorderProjects(orderMap);
      if (onProjectsUpdated) onProjectsUpdated(list);
      toast.success('Projects reordered.');
    } catch (err) {
      toast.error('Failed to save new order.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-clean">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Projects Manager</h2>
          <p className="text-xs text-slate-500">
            Create, edit, reorder projects, and upload project screenshots via Cloudinary.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table / Cards List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-clean">
        {projects.map((project, idx) => (
          <div key={project.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
            
            <div className="flex items-center gap-4 min-w-0">
              {/* Order Controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveOrder(idx, -1)}
                  className="p-1 rounded text-slate-400 hover:text-sky-600 disabled:opacity-20 hover:bg-slate-100"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMoveOrder(idx, 1)}
                  className="p-1 rounded text-slate-400 hover:text-sky-600 disabled:opacity-20 hover:bg-slate-100"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{project.title}</h4>
                  {project.featured && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-700">{project.category}</span>
                  <span>•</span>
                  <span>{(project.techStack || []).slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                  title="View Live Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => openEditModal(project)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No projects stored in MongoDB. Click "Add New Project" to create your first entry.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="overflow-y-auto py-4 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Telemetry Engine"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Backend & Cloud">Backend & Cloud</option>
                    <option value="Frontend & UI">Frontend & UI</option>
                    <option value="Database & Systems">Database & Systems</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-200 w-4 h-4"
                    />
                    <span>Mark as Featured Project</span>
                  </label>
                </div>

                {/* Cloudinary Image Upload Section */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Project Cover Image (Cloudinary)
                    </label>
                    {formData.imageUrl && (
                      <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Image Attached
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {formData.imageUrl ? (
                      <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-20 rounded-lg bg-slate-200/80 border border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2 w-full">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:border-sky-400 text-slate-700 text-xs font-semibold cursor-pointer shadow-clean transition-colors">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image via Cloudinary'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary (Card Preview)</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence description shown in the gallery grid..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Architecture & Technical Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="In-depth explanation of system design, database choices, scalability, and benchmarks..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tech Stack (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.techStack.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        techStack: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="FastAPI, React, MongoDB, Redis, Docker..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Live Application URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
