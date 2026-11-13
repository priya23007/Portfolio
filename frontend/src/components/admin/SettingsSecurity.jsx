import React, { useState } from 'react';
import { ShieldCheck, Key, Database, Cloud, Mail, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SettingsSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const { systemStatus, admin, refreshProfile } = useAuth();
  const toast = useToast();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    setUpdating(true);
    try {
      await portfolioApi.changePassword(currentPassword, newPassword);
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update password.';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* System Integration Status Overview */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Architecture & Integrations</h2>
          <p className="text-xs text-slate-500">
            Real-time status of your database, Cloudinary media storage, and Google SMTP email service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* MongoDB Cluster Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                systemStatus?.mongodbConnected
                  ? 'bg-sky-100 text-sky-800 border border-sky-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {systemStatus?.mongodbConnected ? 'Connected' : 'Cluster Setup Ready'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">MongoDB NoSQL Cluster</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {systemStatus?.mongodbConnected
                  ? 'Connected to your MongoDB Atlas cluster. All portfolio content, projects, and enquiries are stored here.'
                  : 'Local fallback active. Paste your MongoDB cluster connection string in backend/.env to connect your cluster.'}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 break-all">
              MONGODB_URI=mongodb+srv://...
            </div>
          </div>

          {/* Cloudinary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                systemStatus?.cloudinaryConfigured
                  ? 'bg-sky-100 text-sky-800 border border-sky-300'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {systemStatus?.cloudinaryConfigured ? 'Active' : 'Fallback Active'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Cloudinary Media CDN</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {systemStatus?.cloudinaryConfigured
                  ? 'Connected to your Cloudinary cloud. Image uploads & PDF resumes are stored with CDN delivery.'
                  : 'Configured in backend/.env. Enter CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET.'}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 break-all">
              CLOUDINARY_CLOUD_NAME=...
            </div>
          </div>

          {/* Google SMTP Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                systemStatus?.smtpConfigured
                  ? 'bg-sky-100 text-sky-800 border border-sky-300'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {systemStatus?.smtpConfigured ? 'Authenticated' : 'Config Setup'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Google SMTP Dispatch</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {systemStatus?.smtpConfigured
                  ? 'Authenticated. Every client enquiry is dispatched straight to your Gmail inbox.'
                  : 'Provide your Gmail and 16-character Google App Password in backend/.env to activate live dispatch.'}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 break-all">
              SMTP_USER=your_email@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Google SMTP & MongoDB Setup Instructions Guide */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Step-by-Step Configuration Reference
        </h3>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <h4 className="font-bold text-sky-900 text-sm mb-1">1. MongoDB Cluster Connection</h4>
            <p>
              In MongoDB Atlas, click <strong>Connect</strong> → <strong>Drivers (Python)</strong> and copy the connection string.
              Update your <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-800">backend/.env</code>:
            </p>
            <pre className="mt-2 p-2.5 bg-white rounded-lg border border-sky-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@your-cluster.mongodb.net/?retryWrites=true&amp;w=majority
MONGODB_DB_NAME=portfolio_db
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <h4 className="font-bold text-sky-900 text-sm mb-1">2. Google SMTP (Gmail App Password)</h4>
            <p>
              To let the backend send emails through your Gmail without sharing your real password:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-700">
              <li>Go to your Google Account (myaccount.google.com) → <strong>Security</strong>.</li>
              <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
              <li>Search for or go to <strong>App Passwords</strong>.</li>
              <li>Generate a new app password (name it e.g. "Portfolio").</li>
              <li>Copy the 16-character string into <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-800">backend/.env</code>:</li>
            </ol>
            <pre className="mt-2 p-2.5 bg-white rounded-lg border border-sky-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
NOTIFICATION_RECEIVER_EMAIL=your_email@gmail.com
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <h4 className="font-bold text-sky-900 text-sm mb-1">3. Cloudinary Image Storage</h4>
            <p>
              Sign up or log in to <a href="https://console.cloudinary.com" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold underline">console.cloudinary.com</a> and copy your credentials from the Dashboard into <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-800">backend/.env</code>:
            </p>
            <pre className="mt-2 p-2.5 bg-white rounded-lg border border-sky-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
            </pre>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
            <Key className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Change Admin Access Password</h3>
            <p className="text-xs text-slate-500">Currently signed in as: {admin?.email}</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold text-xs transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{updating ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
