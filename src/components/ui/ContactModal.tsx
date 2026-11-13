import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Send, Sparkles, Terminal, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROFILE } from '../../data/profile';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', topic: 'Product Engineering' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.socials.email);
    setCopied(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00FF66', '#10B981', '#FFFFFF', '#059669'],
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // 1. Direct transmission to inbox via FormSubmit API
      const res = await fetch(`https://formsubmit.co/ajax/${PROFILE.socials.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          scope: formData.topic,
          message: formData.message,
          _subject: `[PORTFOLIO TRANSMISSION] ${formData.topic} from ${formData.name}`,
        }),
      });

      if (!res.ok) {
        throw new Error('API dispatch failed');
      }
    } catch {
      // 2. Resilient fallback: open pre-filled email client so message is never lost
      const mailtoUrl = `mailto:${PROFILE.socials.email}?subject=${encodeURIComponent(
        `[PORTFOLIO TRANSMISSION] ${formData.topic} - from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Hi Vivek,\n\n${formData.message}\n\n---\nFrom: ${formData.name}\nEmail: ${formData.email}\nScope: ${formData.topic}`
      )}`;
      window.open(mailtoUrl, '_blank');
    } finally {
      setIsSending(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00FF66', '#10B981', '#FFFFFF', '#059669'],
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl bg-[#12141A] border-2 border-[#D7E2EA]/30 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#D7E2EA]/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_#00FF66]" />
                <span className="text-xs uppercase tracking-widest text-[#8E9AA4] font-mono">
                  DIRECT TRANSMISSION CHANNEL
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-[#8E9AA4] hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center mx-auto text-[#00FF66]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Transmission Dispatched
                </h3>
                <p className="text-[#8E9AA4] max-w-md mx-auto text-sm sm:text-base">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your transmission has been dispatched to{' '}
                  <span className="text-[#00FF66] font-mono">{PROFILE.socials.email}</span>.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:${PROFILE.socials.email}?subject=${encodeURIComponent(
                      `[PORTFOLIO TRANSMISSION] ${formData.topic} - from ${formData.name}`
                    )}&body=${encodeURIComponent(
                      `Hi Vivek,\n\n${formData.message}\n\n---\nFrom: ${formData.name}\nEmail: ${formData.email}\nScope: ${formData.topic}`
                    )}`}
                    className="px-5 py-2.5 rounded-full bg-[#00FF66] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#10B981] transition-colors"
                  >
                    Open in Mail App (Backup)
                  </a>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full bg-white/10 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Return to Portfolio
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6 space-y-6">
                {/* Direct Email Quick Copy & Direct Mailto Pill */}
                <div className="p-4 rounded-2xl bg-[#0C0D11] border border-[#262A30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#00FF66] shrink-0" />
                    <div>
                      <div className="text-xs text-[#8E9AA4] uppercase tracking-wider font-mono">
                        Direct Inbox
                      </div>
                      <a
                        href={`mailto:${PROFILE.socials.email}`}
                        className="text-sm font-mono text-white hover:text-[#00FF66] transition-colors select-all"
                      >
                        {PROFILE.socials.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`mailto:${PROFILE.socials.email}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00FF66]/15 hover:bg-[#00FF66]/25 text-[#00FF66] border border-[#00FF66]/30 text-xs uppercase tracking-wider font-medium transition-colors"
                      title="Open default email application"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Mail App</span>
                    </a>
                    <button
                      onClick={handleCopy}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00FF66]" />
                          <span className="text-[#00FF66]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#8E9AA4] mb-2 font-mono">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-3 rounded-xl bg-[#0C0D11] border border-[#262A30] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] text-white placeholder-[#5A646E] text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#8E9AA4] mb-2 font-mono">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ada@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#0C0D11] border border-[#262A30] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] text-white placeholder-[#5A646E] text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8E9AA4] mb-2 font-mono">
                      Domain / Collaboration Scope
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0C0D11] border border-[#262A30] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] text-white text-sm outline-none transition-all"
                    >
                      <option value="AI Systems Architecture">AI Systems Architecture & RAG</option>
                      <option value="Full-Stack Product Engineering">Full-Stack Product Engineering</option>
                      <option value="Realtime WebRTC / WebGL">Realtime WebRTC / 3D WebGL</option>
                      <option value="Technical Advisory">Technical Advisory / Consulting</option>
                      <option value="Full-time Senior Role">Full-time Lead / Senior Role</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8E9AA4] mb-2 font-mono">
                      System Requirements or Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe the system, project scope, or technical challenge..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0C0D11] border border-[#262A30] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] text-white placeholder-[#5A646E] text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-4 rounded-full bg-[#00FF66] hover:bg-[#10B981] text-black font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.35)] cursor-pointer"
                  >
                    {isSending ? (
                      <span>TRANSMITTING...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
