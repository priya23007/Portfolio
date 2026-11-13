import React, { useState } from 'react';
import { FileText, Upload, Download, ExternalLink, Check, Copy, Eye, Image as ImageIcon, ShieldCheck, RefreshCw } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ResumeMediaManager = ({ resumeConfig, onResumeUpdated }) => {
  const [resume, setResume] = useState(resumeConfig || {});
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const toast = useToast();

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Resume must be a PDF document.');
      return;
    }

    setUploadingResume(true);
    try {
      const res = await portfolioApi.uploadResume(file);
      const updated = {
        ...resume,
        resumeUrl: res.url,
        fileName: res.fileName || file.name,
        uploadedAt: new Date().toISOString(),
      };
      setResume(updated);
      if (onResumeUpdated) onResumeUpdated(updated);
      toast.success(res.cloudinaryActive ? 'Resume uploaded to Cloudinary.' : 'Resume stored in local storage.');
    } catch (err) {
      toast.error('Failed to upload resume document.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleGeneralMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const res = await portfolioApi.uploadImage(file);
      const newAsset = {
        url: res.url,
        name: file.name,
        public_id: res.public_id,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleTimeString(),
      };
      setUploadedAssets((prev) => [newAsset, ...prev]);
      toast.success('Image successfully uploaded to Cloudinary.');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Asset URL copied to clipboard.');
  };

  const handleSaveResumeSettings = async () => {
    setSavingSettings(true);
    try {
      const fullContent = await portfolioApi.getAdminContent();
      fullContent.resume = resume;
      const res = await portfolioApi.updatePortfolioContent(fullContent);
      setResume(res.resume || resume);
      if (onResumeUpdated) onResumeUpdated(res.resume);
      toast.success('Resume settings updated.');
    } catch (err) {
      toast.error('Failed to save resume settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Resume Management Card */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Resume & CV Upload Space</h3>
              <p className="text-xs text-slate-500">Upload your PDF resume to Cloudinary for instant client download.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resume.resumeUrl && (
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                <span>Preview Current</span>
              </a>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="p-6 rounded-2xl bg-sky-50/50 border-2 border-dashed border-sky-200 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-sm">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900">Upload New Resume (PDF)</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Select your updated resume document. The file will be processed and stored in your Cloudinary repository.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs cursor-pointer shadow-md transition-all">
            <span>{uploadingResume ? 'Uploading to Cloudinary...' : 'Select PDF Resume'}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
              className="hidden"
            />
          </label>

          {resume.fileName && (
            <div className="text-xs text-slate-600 font-medium pt-1">
              Active File: <span className="font-semibold text-slate-900">{resume.fileName}</span>
            </div>
          )}
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Download Button Label</label>
            <input
              type="text"
              value={resume.buttonText || 'Download Resume'}
              onChange={(e) => setResume({ ...resume, buttonText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={resume.isVisible !== false}
                onChange={(e) => setResume({ ...resume, isVisible: e.target.checked })}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-200 w-4 h-4"
              />
              <span>Display Resume Section on Client Portfolio</span>
            </label>

            <button
              onClick={handleSaveResumeSettings}
              disabled={savingSettings}
              className="ml-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Cloudinary General Image Uploader & Media Vault */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cloudinary Image Media Vault</h3>
              <p className="text-xs text-slate-500">Upload standalone images to Cloudinary and get one-click CDN links.</p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs cursor-pointer shadow-sm transition-all self-start sm:self-auto">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploadingMedia ? 'Uploading Image...' : 'Upload Image to Cloudinary'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleGeneralMediaUpload}
              disabled={uploadingMedia}
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded Assets List */}
        {uploadedAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedAssets.map((asset, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{asset.name}</p>
                  <p className="text-[11px] text-slate-400">{asset.size} • {asset.uploadedAt}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(asset.url)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white border border-slate-300 hover:border-sky-400 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Copy className="w-3 h-3 text-sky-600" />
                  <span>Copy Cloudinary URL</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            Any images uploaded here will appear with a one-click copy button for use in projects, blog posts, or hero banners.
          </div>
        )}
      </div>

    </div>
  );
};
