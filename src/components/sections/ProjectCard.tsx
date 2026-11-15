import React, { useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Project } from '../../types';
import { ArrowUpRight, Layers, BarChart2, Cpu } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  onSelectProject: (p: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  progress,
  range,
  targetScale,
  onSelectProject,
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  const stackOffset = index * 28;
  const [mobileTab, setMobileTab] = useState<'blueprint' | 'topology' | 'latency'>('blueprint');

  // Fallback map in case of network interruption
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

  const handleImgError = (key: string) => {
    setImgError((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div
      className="sticky"
      style={{ top: `calc(5.5rem + ${stackOffset}px)` }}
    >
      <motion.div
        style={{
          scale,
          transformOrigin: 'center top',
        }}
        className="w-full max-h-[calc(100svh-7.25rem)] bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[32px] sm:rounded-[48px] md:rounded-[60px] p-4 sm:p-7 md:p-9 flex flex-col gap-3.5 sm:gap-5 shadow-2xl relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF66]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-[#D7E2EA]/20 gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono text-[#00FF66]">
              {project.number}
            </span>
            <div>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white group-hover:text-[#00FF66] transition-colors leading-tight">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#8E9AA4]">
                {project.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="hidden lg:inline-block text-xs font-mono text-[#8E9AA4] px-3 py-1 rounded-full border border-[#262A30] bg-[#12141A]">
              {project.category}
            </span>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all border border-white/15 hover:border-[#00FF66]/50 shadow-sm"
                aria-label={`View ${project.title} on GitHub`}
              >
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Code</span>
              </a>
            )}
            <button
              onClick={() => onSelectProject(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#00FF66] hover:bg-[#10B981] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer group/btn shadow-[0_0_15px_rgba(0,255,102,0.25)]"
              aria-label={`Inspect ${project.title} architecture`}
            >
              <span>Architecture Spec</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden items-center justify-between p-1 bg-[#12141A] rounded-xl border border-[#262A30] text-[10px] font-mono shrink-0">
          <button
            onClick={() => setMobileTab('blueprint')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
              mobileTab === 'blueprint' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#8E9AA4]'
            }`}
          >
            BLUEPRINT
          </button>
          <button
            onClick={() => setMobileTab('topology')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
              mobileTab === 'topology' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#8E9AA4]'
            }`}
          >
            TOPOLOGY
          </button>
          <button
            onClick={() => setMobileTab('latency')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
              mobileTab === 'latency' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#8E9AA4]'
            }`}
          >
            LATENCY
          </button>
        </div>

        {/* Visual Panels: Responsive 3-Panel on Desktop / Tabbed on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 min-h-[190px] h-[min(38vh,380px)] items-stretch">
          {/* Desktop Left Column: Topology & Latency */}
          <div className="hidden sm:flex lg:col-span-5 flex-col gap-3 sm:gap-4 h-full min-h-0">
            <div className="relative flex-1 min-h-0 rounded-[20px] sm:rounded-[32px] overflow-hidden border border-[#262A30] bg-[#0C0E12] group/img1">
              {!imgError['leftTop'] ? (
                <img
                  src={project.images.leftTop}
                  alt={`${project.title} Architecture Flow`}
                  onError={() => handleImgError('leftTop')}
                  className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover/img1:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#0F1117] text-center font-mono">
                  <Layers className="w-8 h-8 text-[#00FF66] mb-2" />
                  <span className="text-xs text-white uppercase">{project.title} TOPOLOGY</span>
                </div>
              )}
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-[#00FF66] bg-[#0C0C0C]/85 px-2 py-0.5 rounded border border-[#00FF66]/20 backdrop-blur-sm">
                TOPOLOGY // 01
              </div>
            </div>

            <div className="relative flex-1 min-h-0 rounded-[20px] sm:rounded-[32px] overflow-hidden border border-[#262A30] bg-[#0C0E12] group/img2">
              {!imgError['leftBottom'] ? (
                <img
                  src={project.images.leftBottom}
                  alt={`${project.title} Telemetry Metrics`}
                  onError={() => handleImgError('leftBottom')}
                  className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover/img2:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#0F1117] text-center font-mono">
                  <BarChart2 className="w-8 h-8 text-[#00FF66] mb-2" />
                  <span className="text-xs text-white uppercase">{project.title} METRICS</span>
                </div>
              )}
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-[#00FF66] bg-[#0C0C0C]/85 px-2 py-0.5 rounded border border-[#00FF66]/20 backdrop-blur-sm">
                LATENCY // P99
              </div>
            </div>
          </div>

          {/* Right Main / Mobile Active Viewport */}
          <div className="lg:col-span-7 h-full min-h-0">
            <div className="relative w-full h-full rounded-[20px] sm:rounded-[36px] overflow-hidden border border-[#262A30] bg-[#0C0E12] group/img3">
              {/* Desktop Always Shows Blueprint; Mobile Shows Selected Tab */}
              <div className="sm:hidden w-full h-full">
                {mobileTab === 'blueprint' && (
                  <img
                    src={project.images.rightMain}
                    alt={`${project.title} Primary System Blueprint`}
                    onError={() => handleImgError('rightMain')}
                    className="w-full h-full object-contain p-2"
                  />
                )}
                {mobileTab === 'topology' && (
                  <img
                    src={project.images.leftTop}
                    alt={`${project.title} Topology Diagram`}
                    onError={() => handleImgError('leftTop')}
                    className="w-full h-full object-contain p-2"
                  />
                )}
                {mobileTab === 'latency' && (
                  <img
                    src={project.images.leftBottom}
                    alt={`${project.title} Latency Benchmarks`}
                    onError={() => handleImgError('leftBottom')}
                    className="w-full h-full object-contain p-2"
                  />
                )}
              </div>

              {/* Tablet & Desktop View */}
              <div className="hidden sm:block w-full h-full">
                {!imgError['rightMain'] ? (
                  <img
                    src={project.images.rightMain}
                    alt={`${project.title} Primary UI and System Blueprint`}
                    onError={() => handleImgError('rightMain')}
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover/img3:scale-102"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0E1015] text-center font-mono">
                    <Cpu className="w-10 h-10 text-[#00FF66] mb-3" />
                    <span className="text-sm text-white uppercase">{project.title} ARCHITECTURE BLUEPRINT</span>
                  </div>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-mono text-[#00FF66] bg-[#0C0C0C]/90 px-2.5 py-0.5 rounded-full border border-[#00FF66]/40 backdrop-blur-sm">
                  ● SYSTEM ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 sm:pt-4 border-t border-[#D7E2EA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <p className="text-xs sm:text-sm text-[#8E9AA4] font-light max-w-2xl line-clamp-2">
            {project.summary}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#D7E2EA]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] sm:text-[11px] font-mono text-[#8E9AA4]">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
