import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, Trash2, ExternalLink, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const toast = useToast();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminEnquiries();
      setEnquiries(res);
    } catch (err) {
      toast.error('Failed to load enquiries from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await portfolioApi.updateEnquiryStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Enquiry marked as ${newStatus}.`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client enquiry from the database?')) return;
    try {
      await portfolioApi.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null);
      toast.success('Enquiry removed from database.');
    } catch (err) {
      toast.error('Failed to delete enquiry.');
    }
  };

  const filtered = activeFilter === 'all'
    ? enquiries
    : enquiries.filter((e) => e.status === activeFilter);

  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-clean">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900">Client Enquiries Inbox</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Messages dispatched from your portfolio enquiry form and backed up in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'unread', 'read', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeFilter === status
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={fetchEnquiries}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Enquiry List */}
        <div className={`space-y-3 ${selectedEnquiry ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          {filtered.map((enq) => {
            const isSelected = selectedEnquiry && selectedEnquiry.id === enq.id;
            const dateStr = enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : '';

            return (
              <div
                key={enq.id}
                onClick={() => {
                  setSelectedEnquiry(enq);
                  if (enq.status === 'unread') handleStatusChange(enq.id, 'read');
                }}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/50 border-sky-300 shadow-sm'
                    : enq.status === 'unread'
                    ? 'bg-white border-sky-200 shadow-clean'
                    : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {enq.clientName || 'Anonymous'}
                      </h4>
                      {enq.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-sky-700 font-medium truncate">{enq.email || 'No email'}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1 truncate">{enq.subject}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{enq.message}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">{dateStr}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      enq.status === 'unread'
                        ? 'bg-sky-100 text-sky-800'
                        : enq.status === 'read'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No enquiries found in this view.</p>
            </div>
          )}
        </div>

        {/* Selected Enquiry Detailed Drawer */}
        {selectedEnquiry && (
          <div className="lg:col-span-6 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-clean space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">ID: {selectedEnquiry.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedEnquiry.clientName}</h3>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-xs font-semibold text-sky-600 hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Submission Key-Values */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Dynamic Submission Details
              </h4>
              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                {Object.entries(selectedEnquiry.data || {}).map(([k, v]) => (
                  <div key={k} className="p-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-slate-50/50">
                    <span className="font-semibold text-slate-500 sm:w-1/3 uppercase text-[11px] tracking-wide">
                      {k.replace('_', ' ')}
                    </span>
                    <span className="text-slate-900 font-medium sm:w-2/3 break-words whitespace-pre-wrap">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedEnquiry.id, selectedEnquiry.status === 'read' ? 'unread' : 'read')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Mark as {selectedEnquiry.status === 'read' ? 'Unread' : 'Read'}
                </button>
                <button
                  onClick={() => handleStatusChange(selectedEnquiry.id, 'archived')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Archive
                </button>
              </div>

              {selectedEnquiry.email && (
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re:%20${encodeURIComponent(selectedEnquiry.subject || 'Portfolio Inquiry')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
