import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Project } from '../../types';
import { ArrowUpRight } from 'lucide-react';

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

  return (
    <div className="sticky top-20 sm:top-24 md:top-28 h-[85vh] flex items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(10% + ${index * 20}px)`,
        }}
        className="w-full h-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[36px] sm:rounded-[48px] md:rounded-[60px] p-6 sm:p-8 md:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-300"
      >
        {/* Ambient Subtle Gradient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7621B0]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-[#D7E2EA]/20 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-[#00F0FF]">
              {project.number}
            </span>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#8E9AA4]">
                {project.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-[#8E9AA4] px-3 py-1 rounded-full border border-[#262A30] bg-[#12141A]">
              {project.category}
            </span>
            <button
              onClick={() => onSelectProject(project)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D7E2EA] transition-all cursor-pointer group/btn"
              aria-label={`Inspect ${project.title} architecture`}
            >
              <span>Architecture Spec</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Card Body: Responsive Image Composition (40% Left 2 Stacked / 60% Right 1 Large) */}
        <div className="my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[50vh] sm:h-[55vh] items-stretch">
          {/* Left Column (40%): 2 Stacked Technical Wireframes */}
          <div className="hidden sm:flex lg:col-span-5 flex-col gap-4 h-full">
            <div className="relative flex-1 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#262A30] bg-[#12141A] group/img1">
              <img
                src={project.images.leftTop}
                alt={`${project.title} Architecture Flow`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img1:scale-105"
              />
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#8E9AA4] bg-[#0C0C0C]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                TOPOLOGY // 01
              </div>
            </div>

            <div className="relative flex-1 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#262A30] bg-[#12141A] group/img2">
              <img
                src={project.images.leftBottom}
                alt={`${project.title} Telemetry Metrics`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img2:scale-105"
              />
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#8E9AA4] bg-[#0C0C0C]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                LATENCY // P99
              </div>
            </div>
          </div>

          {/* Right Column (60%): 1 Large Primary Interactive Visual Blueprint */}
          <div className="lg:col-span-7 h-full">
            <div className="relative w-full h-full rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#262A30] bg-[#0E1015] group/img3 flex flex-col justify-between">
              <img
                src={project.images.rightMain}
                alt={`${project.title} Primary UI and System Blueprint`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img3:scale-102"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#00F0FF] bg-[#0C0C0C]/90 px-3 py-1 rounded-full border border-[#00F0FF]/30 backdrop-blur-sm">
                  ● SYSTEM ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Summary & Tech Badges */}
        <div className="pt-4 border-t border-[#D7E2EA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#8E9AA4] font-light max-w-2xl line-clamp-2">
            {project.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#D7E2EA]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[11px] font-mono text-[#8E9AA4]">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
