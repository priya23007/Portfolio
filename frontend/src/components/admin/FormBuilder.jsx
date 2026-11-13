import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Trash2, Save, CheckCircle2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const FormBuilder = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    portfolioApi.getAdminFormConfig()
      .then((res) => setConfig(res))
      .catch((err) => toast.error('Failed to load enquiry form configuration.'))
      .finally(() => setLoading(false));
  }, []);

  const handleConfigChange = (key, val) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleFieldChange = (index, key, val) => {
    const fields = [...(config?.fields || [])];
    fields[index] = { ...fields[index], [key]: val };
    setConfig((prev) => ({ ...prev, fields }));
  };

  const addField = () => {
    const id = `f-${Date.now()}`;
    const newField = {
      id,
      name: `custom_field_${(config?.fields?.length || 0) + 1}`,
      label: 'New Field Label',
      type: 'text',
      placeholder: 'Enter details...',
      required: false,
      options: [],
      order: (config?.fields?.length || 0) + 1,
      enabled: true,
    };
    setConfig((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }));
  };

  const removeField = (index) => {
    const fields = (config?.fields || []).filter((_, i) => i !== index);
    setConfig((prev) => ({ ...prev, fields }));
  };

  const handleOptionsChange = (index, optionsStr) => {
    const options = optionsStr.split(',').map((o) => o.trim()).filter(Boolean);
    handleFieldChange(index, 'options', options);
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await portfolioApi.updateAdminFormConfig(config);
      setConfig(res);
      toast.success('Dynamic Enquiry Form saved to MongoDB database.');
    } catch (err) {
      toast.error('Failed to save form configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <span>Loading Form Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-clean">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dynamic Enquiry Form Builder</h2>
          <p className="text-xs text-slate-500">
            Customize the fields, labels, questions, and responses for the client enquiry form.
          </p>
        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Form to MongoDB'}</span>
        </button>
      </div>

      {/* Global Form Headings */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-clean">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
          Form Title & Response Messages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={config?.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Submit Button Text</label>
            <input
              type="text"
              value={config?.submitButtonText || ''}
              onChange={(e) => handleConfigChange('submitButtonText', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Instructions</label>
            <textarea
              rows={2}
              value={config?.subtitle || ''}
              onChange={(e) => handleConfigChange('subtitle', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Success Confirmation Message</label>
            <textarea
              rows={2}
              value={config?.successMessage || ''}
              onChange={(e) => handleConfigChange('successMessage', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Field Editor */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-clean">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Form Fields Management
            </h3>
            <p className="text-xs text-slate-500">
              Configure each field rendered on your client portfolio enquiry section.
            </p>
          </div>

          <button
            onClick={addField}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Field</span>
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {(config?.fields || []).map((field, idx) => (
            <div
              key={field.id || idx}
              className={`p-4 rounded-xl border transition-all ${
                field.enabled !== false ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Field Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                    placeholder="Field Label"
                    className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Variable Name (Key)</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                    placeholder="field_key"
                    className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs font-mono text-slate-700 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Input Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="text">Text (Single Line)</option>
                    <option value="email">Email</option>
                    <option value="select">Select Dropdown</option>
                    <option value="textarea">Textarea (Multi Line)</option>
                    <option value="tel">Phone / Tel</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => handleFieldChange(idx, 'placeholder', e.target.value)}
                    placeholder="Placeholder"
                    className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700" title="Required input">
                    <input
                      type="checkbox"
                      checked={!!field.required}
                      onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                    />
                    <span>Req</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700" title="Visible on client form">
                    <input
                      type="checkbox"
                      checked={field.enabled !== false}
                      onChange={(e) => handleFieldChange(idx, 'enabled', e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                    />
                    <span>Active</span>
                  </label>

                  <button
                    onClick={() => removeField(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* If Select type, show Options input */}
                {field.type === 'select' && (
                  <div className="sm:col-span-12 pt-2 border-t border-slate-200/80">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Dropdown Options (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={(field.options || []).join(', ')}
                      onChange={(e) => handleOptionsChange(idx, e.target.value)}
                      placeholder="Option 1, Option 2, Option 3..."
                      className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
