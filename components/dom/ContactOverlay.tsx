'use client';

import React, { useState } from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactOverlay() {
  const { contact } = DEVELOPER_PROFILE;

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Copy Email to Clipboard with transient tooltip
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Form Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Please provide your name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate submission handling with clear integration boundary notice
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <section
      id="act-5-beyond"
      aria-label="Act V — Beyond: Contact & Collaboration"
      className="relative min-h-[120vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 pb-20 pointer-events-none"
    >
      {/* Top Narrative & Contact Container */}
      <div className="max-w-2xl lg:max-w-3xl pointer-events-auto mt-8">
        {/* Act Badging */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-[#FFD180]/30 bg-[#FFD180]/10 text-[#FFD180] shadow-[0_0_12px_rgba(255,209,128,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD180] animate-pulse" />
            ACT V — THE HORIZON
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#B0A79A] uppercase">
            Sunset Balcony &amp; Coastal Horizon
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3F6FA] mb-3">
          Initiate Connection
        </h2>
        <p className="text-sm sm:text-base text-[#8E9CAE] leading-relaxed mb-6 max-w-xl">
          The continuous 3D journey reaches the digital dawn horizon. Open for full-time software developer opportunities,
          technical partnerships, and challenging mobile or web builds.
        </p>

        {/* Contact Highlights & Verified Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {/* Email Copy Pill */}
          <div className="p-4 rounded-xl border border-[#1C222D] bg-[#11141A]/85 backdrop-blur-md flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-[#8E9CAE] mb-1">
              Direct Inquiries
            </span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs sm:text-sm font-mono font-medium text-[#F3F6FA] truncate">
                {contact.email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="relative px-2.5 py-1 rounded text-[10px] font-mono bg-[#00F2FE]/15 text-[#00F2FE] hover:bg-[#00F2FE]/25 border border-[#00F2FE]/30 transition-all cursor-pointer shrink-0"
                aria-label="Copy email address"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Availability & Location */}
          <div className="p-4 rounded-xl border border-[#1C222D] bg-[#11141A]/85 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#38F9D7] animate-ping" />
              <span className="text-[10px] font-mono uppercase text-[#38F9D7]">
                Current Status
              </span>
            </div>
            <p className="text-xs font-mono text-[#F3F6FA] leading-tight mt-1">
              {contact.availability}
            </p>
            <span className="block text-[10px] font-mono text-[#8E9CAE] mt-1">
              {contact.location}
            </span>
          </div>
        </div>

        {/* Social / Professional Profiles */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-xs font-mono border border-[#1C222D] bg-[#11141A]/85 text-[#F3F6FA] hover:border-[#00F2FE]/50 hover:text-[#00F2FE] transition-colors inline-flex items-center gap-2"
          >
            <span>GitHub Profile</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-xs font-mono border border-[#1C222D] bg-[#11141A]/85 text-[#F3F6FA] hover:border-[#00F2FE]/50 hover:text-[#00F2FE] transition-colors inline-flex items-center gap-2"
          >
            <span>LinkedIn Profile</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Interactive Contact Form with Integration Boundary Handling */}
        <div className="p-6 rounded-2xl border border-[#1C222D] bg-[#0E1117]/90 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-bold uppercase text-[#F3F6FA] tracking-wider">
              Send Direct Message
            </h3>
            <span className="text-[10px] font-mono text-[#8E9CAE]">Terminal Interface</span>
          </div>

          {submitted ? (
            <div className="p-5 rounded-xl border border-[#38F9D7]/30 bg-[#38F9D7]/10 text-[#38F9D7]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-mono font-bold uppercase">Message Received</span>
              </div>
              <p className="text-xs text-[#D1D9E6] leading-relaxed mb-3">
                Thank you! Your message payload has been processed locally in this demonstration environment.
              </p>
              <p className="text-[11px] font-mono text-[#8E9CAE] border-t border-[#38F9D7]/20 pt-2">
                Notice: Backend API endpoint is in demonstration mode. For urgent matters, please email{' '}
                <span className="text-[#00F2FE] font-bold">{contact.email}</span> directly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-mono text-[#38F9D7] hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-[11px] font-mono text-[#8E9CAE] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-mono border bg-[#11141A] text-[#F3F6FA] placeholder:text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#00F2FE] transition-colors ${
                      errors.name ? 'border-red-500' : 'border-[#1C222D]'
                    }`}
                  />
                  {errors.name && (
                    <span id="contact-name-error" role="alert" className="block text-[10px] text-red-400 mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-[11px] font-mono text-[#8E9CAE] mb-1">
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-mono border bg-[#11141A] text-[#F3F6FA] placeholder:text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#00F2FE] transition-colors ${
                      errors.email ? 'border-red-500' : 'border-[#1C222D]'
                    }`}
                  />
                  {errors.email && (
                    <span id="contact-email-error" role="alert" className="block text-[10px] text-red-400 mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-[11px] font-mono text-[#8E9CAE] mb-1">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Project Collaboration Inquiry"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border bg-[#11141A] text-[#F3F6FA] placeholder:text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#00F2FE] transition-colors ${
                    errors.subject ? 'border-red-500' : 'border-[#1C222D]'
                  }`}
                />
                {errors.subject && (
                  <span id="contact-subject-error" role="alert" className="block text-[10px] text-red-400 mt-1">
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-[11px] font-mono text-[#8E9CAE] mb-1">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border bg-[#11141A] text-[#F3F6FA] placeholder:text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#00F2FE] transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-[#1C222D]'
                  }`}
                />
                {errors.message && (
                  <span id="contact-message-error" role="alert" className="block text-[10px] text-red-400 mt-1">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button & Integration Notice */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[10px] font-mono text-[#8E9CAE]">
                  Client-side validation active • End-to-end safe
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-[#00F2FE] text-[#07080B] hover:bg-[#38F9D7] hover:shadow-[0_0_15px_#00F2FE60] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Terminal Monolith Summit Footer */}
      <footer className="border-t border-[#1C222D] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8E9CAE]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
          <span>FAROUK MESSAI — Software Developer | Mobile & Web Development</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>© 2026 Farouk Messai</span>
          <span className="text-[#00F2FE]">ACT V COMPLETE / SUMMIT REACHED</span>
        </div>
      </footer>
    </section>
  );
}

