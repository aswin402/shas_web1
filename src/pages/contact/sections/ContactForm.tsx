import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  inquiryOptions,
  materialOptions,
  budgetOptions,
  guidanceItems,
} from '@/data/contactData';
import { Upload, Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  material: string;
  budget: string;
  message: string;
  customGuidance: boolean;
  fileName: string;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  inquiryType: '',
  material: '',
  budget: '',
  message: '',
  customGuidance: false,
  fileName: '',
};

export function ContactForm() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, customGuidance: e.target.checked }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.fullName,
        email: form.email,
        subject: form.inquiryType || 'General Inquiry',
        message: form.message,
      });

      if (error) throw error;

      setIsSubmitted(true);
      setForm(initialFormState);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit message.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full bg-cream border border-border rounded-md px-4 py-3 text-sm font-body text-brown placeholder:text-muted-brown/50 transition-all duration-200 focus:outline-none focus:border-temple-red focus:ring-1 focus:ring-temple-red/30';

  const labelClasses =
    'block text-xs font-body font-medium uppercase tracking-[0.1em] text-brown mb-2';

  return (
    <section id="contact-form" ref={ref} className="bg-warm-beige/40 section-spacing">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left — Form */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="bg-ivory border border-border rounded-lg p-6 sm:p-8 md:p-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-deep-brown mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-muted-brown mb-8">
                Fill out the form and we'll get back to you as soon as possible.
              </p>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-cream border border-temple-red/20 rounded-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-temple-red/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-temple-red" />
                  </div>
                  <p className="text-sm text-brown">
                    Thank you! Your inquiry has been sent. We'll respond within 24 hours.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-temple-red/10 border border-temple-red/20 text-temple-red rounded-md text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className={labelClasses}>
                      Full Name <span className="text-temple-red">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`${inputClasses} ${errors.fullName ? '!border-temple-red' : ''}`}
                      disabled={loading}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-temple-red mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email Address <span className="text-temple-red">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`${inputClasses} ${errors.email ? '!border-temple-red' : ''}`}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-xs text-temple-red mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row: Phone + Inquiry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className={inputClasses}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className={labelClasses}>
                      Inquiry Type
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={handleChange}
                      className={inputClasses}
                      disabled={loading}
                    >
                      <option value="">Select type</option>
                      {inquiryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row: Material + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="material" className={labelClasses}>
                      Preferred Material
                    </label>
                    <select
                      id="material"
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      className={inputClasses}
                      disabled={loading}
                    >
                      <option value="">Select material</option>
                      {materialOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className={labelClasses}>
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className={inputClasses}
                      disabled={loading}
                    >
                      <option value="">Select budget</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelClasses}>
                    Message <span className="text-temple-red">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirement..."
                    className={`${inputClasses} resize-none ${errors.message ? '!border-temple-red' : ''}`}
                    disabled={loading}
                  />
                  {errors.message && (
                    <p className="text-xs text-temple-red mt-1">{errors.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className={labelClasses}>Upload Reference Image</label>
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center gap-3 w-full bg-cream border border-dashed border-border rounded-md px-4 py-3.5 cursor-pointer hover:border-temple-red/50 transition-colors duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Upload className="w-4 h-4 text-muted-brown shrink-0" />
                    <span className="text-sm text-muted-brown truncate">
                      {form.fileName || 'Choose a file or drag it here'}
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      disabled={loading}
                    />
                  </label>
                </div>

                {/* Checkbox */}
                <label className={`flex items-start gap-3 cursor-pointer group ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.customGuidance}
                      onChange={handleCheckbox}
                      className="sr-only peer"
                      disabled={loading}
                    />
                    <div className="w-5 h-5 border border-border rounded transition-all duration-200 peer-checked:bg-temple-red peer-checked:border-temple-red flex items-center justify-center">
                      {form.customGuidance && (
                        <Check className="w-3 h-3 text-cream" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-brown leading-snug">
                    I'm interested in custom statue guidance
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-temple-red text-cream text-sm font-body font-semibold uppercase tracking-[0.1em] rounded-md transition-all duration-300 hover:bg-deep-red active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Right — Help Panel */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="bg-warm-beige border border-border rounded-lg p-6 sm:p-8 sticky top-24">
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-deep-brown mb-3">
                Need Custom Guidance?
              </h3>
              <p className="text-sm text-muted-brown leading-relaxed mb-6">
                Share your reference image, preferred size, material, and
                placement. We'll help you choose the right statue or plan a
                custom piece.
              </p>

              {/* Checklist */}
              <div className="space-y-3 mb-8">
                {guidanceItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-temple-red/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-temple-red" />
                    </div>
                    <span className="text-sm text-brown">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-temple-red text-cream text-sm font-body font-semibold uppercase tracking-[0.1em] rounded-md transition-all duration-300 hover:bg-deep-red active:scale-[0.97] w-full sm:w-auto justify-center"
              >
                Start Custom Order
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Support Image */}
              <div className="mt-8 rounded-lg overflow-hidden border border-border">
                <img
                  src="/images/contact/contact-support.png"
                  alt="Artisan carefully packaging a handcrafted statue"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
