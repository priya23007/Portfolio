import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, Clock, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Reveal, SectionHeader } from '../ui/primitives';

const emptyValues = (cfg) => {
  const v = {};
  (cfg?.fields || []).forEach((f) => {
    if (f.enabled) v[f.name] = '';
  });
  return v;
};

export const EnquiryForm = ({ socials, formConfig: initialConfig }) => {
  const [config, setConfig] = useState(initialConfig || null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setFormData(emptyValues(initialConfig));
      return;
    }
    portfolioApi
      .getFormConfig()
      .then((res) => {
        setConfig(res);
        setFormData(emptyValues(res));
      })
      .catch((err) => console.error('Failed to load form config:', err));
  }, [initialConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await portfolioApi.submitEnquiry(formData);
      setSubmitted(true);
      setSubmissionId(res.enquiryId || '');
      toast.success('Message sent — I will get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not send your message. Please check the required fields.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmissionId('');
    setFormData(emptyValues(config));
  };

  const enabledFields = (config?.fields || [])
    .filter((f) => f.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const channels = [
    socials?.email && {
      icon: Mail,
      label: 'Email',
      value: socials.email,
      href: `mailto:${socials.email}`,
    },
    socials?.location && { icon: MapPin, label: 'Based in', value: socials.location },
    { icon: Clock, label: 'Response time', value: 'Usually within 24 hours' },
  ].filter(Boolean);

  return (
    <section id="enquiry" className="relative py-28 border-t border-slate-200 overflow-hidden">
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[400px] rounded-full bg-neon-cyan/[0.07] blur-[140px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              index="07"
              label="contact"
              title={config?.title || "Let's build something intelligent"}
              subtitle={
                config?.subtitle ||
                'Have an AI product, research idea, or role in mind? Send a message and I will respond shortly.'
              }
            />

            <div className="space-y-3 -mt-4">
              {channels.map(({ icon: Icon, label, value, href }, i) => {
                const inner = (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-ink-800 border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-neon-cyan" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
                      <div className="text-sm font-medium text-slate-900 truncate">{value}</div>
                    </div>
                  </>
                );
                return (
                  <Reveal key={label} delay={i * 80}>
                    {href ? (
                      <a href={href} className="glass-card card-hover rounded-xl p-4 flex items-center gap-4">
                        {inner}
                      </a>
                    ) : (
                      <div className="glass-card rounded-xl p-4 flex items-center gap-4">{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="gradient-border glass-card rounded-[1.25rem] p-7 sm:p-10">
              {submitted ? (
                <div className="py-10 text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-neon-green" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-2xl font-semibold text-slate-900">Message received</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {config?.successMessage || 'Thanks for reaching out — I will be in touch shortly.'}
                    </p>
                  </div>
                  {submissionId && (
                    <div className="inline-block px-4 py-2 rounded-lg bg-ink-950/60 border border-slate-200 text-xs font-mono text-slate-600">
                      ref: <span className="text-neon-cyan">{submissionId}</span>
                    </div>
                  )}
                  <div>
                    <button onClick={resetForm} className="btn-ghost !py-2.5 !text-xs">
                      <span>Send another message</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                  {enabledFields.map((field) => {
                    const value = formData[field.name] || '';
                    const wide = field.type === 'textarea' || field.type === 'select';
                    const set = (e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }));

                    return (
                      <div key={field.id || field.name} className={`space-y-2 ${wide ? 'sm:col-span-2' : ''}`}>
                        <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-600">
                          {field.label}
                          {field.required && <span className="text-neon-cyan ml-1">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                          <textarea
                            rows={5}
                            required={field.required}
                            value={value}
                            placeholder={field.placeholder || ''}
                            onChange={set}
                            className="input-dark resize-y"
                          />
                        ) : field.type === 'select' ? (
                          <div className="relative">
                            <select
                              required={field.required}
                              value={value}
                              onChange={set}
                              className="input-dark appearance-none cursor-pointer pr-10 [&>option]:bg-ink-900"
                            >
                              <option value="">{field.placeholder || 'Select an option…'}</option>
                              {(field.options || []).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
                          </div>
                        ) : (
                          <input
                            type={field.type || 'text'}
                            required={field.required}
                            value={value}
                            placeholder={field.placeholder || ''}
                            onChange={set}
                            className="input-dark"
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="sm:col-span-2 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-60">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>{config?.submitButtonText || 'Send message'}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
