import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import { X, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-4xl bg-[#101217] border-2 border-[#D7E2EA]/40 rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#262A30]">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-[#00F0FF]">
                {project.number}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8E9AA4] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {project.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#8E9AA4] hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="pt-6">
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {project.title}
            </h3>
            <p className="text-base sm:text-lg text-[#8E9AA4] font-light mt-1">
              {project.subtitle}
            </p>
          </div>

          {/* Role & Period Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-[#090A0D] border border-[#262A30] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-[#8E9AA4]">ROLE: </span>
              <span className="text-white font-semibold">{project.role}</span>
            </div>
            <div>
              <span className="text-[#8E9AA4]">TIMELINE: </span>
              <span className="text-[#00F0FF]">{project.period}</span>
            </div>
          </div>

          {/* Architecture Deep Dive */}
          <div className="mt-8 space-y-6">
            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#151820]/70 border border-[#262A30]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#FF5F56] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                  Problem Definition
                </div>
                <p className="text-xs sm:text-sm text-[#D7E2EA] font-light leading-relaxed">
                  {project.problem}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#151820]/70 border border-[#262A30]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#39FF14] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                  Engineering Solution
                </div>
                <p className="text-xs sm:text-sm text-[#D7E2EA] font-light leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* AI & Systems Highlights */}
            {project.aiComponent && (
              <div className="p-5 rounded-2xl bg-[#18011F]/50 border border-[#7621B0]/40">
                <div className="text-xs font-mono uppercase tracking-wider text-[#B600A8] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B600A8]" />
                  AI & Model Layer Architecture
                </div>
                <p className="text-xs sm:text-sm text-[#D7E2EA] font-light leading-relaxed">
                  {project.aiComponent}
                </p>
              </div>
            )}

            {/* Metrics */}
            {project.metrics && (
              <div className="p-4 rounded-2xl bg-[#090A0D] border border-[#00F0FF]/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#00F0FF] shrink-0" />
                <span className="text-xs sm:text-sm text-[#D7E2EA] font-mono">
                  {project.metrics}
                </span>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8E9AA4] mb-3">
                Technologies & Protocols
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D7E2EA]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-8 pt-6 border-t border-[#262A30] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D7E2EA] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Preview
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider transition-colors border border-white/10"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Source Code
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#262A30] text-xs font-mono text-[#8E9AA4] hover:text-white transition-colors"
            >
              CLOSE SPECIFICATION
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
