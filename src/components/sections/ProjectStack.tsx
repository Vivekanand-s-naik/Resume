import React, { useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { PROJECTS } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Project } from '../../types';

export const ProjectStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="work" ref={containerRef} className="relative w-full py-28 px-4 sm:px-6 md:px-10 bg-[#0C0C0C]">
      <div className="max-w-[1700px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 editorial-border-b mb-8 sm:mb-10 gap-6">
          <div>
            <div className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3">
              // 03 FLAGSHIP SYSTEMS
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              SELECTED WORK
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#8E9AA4] font-light leading-relaxed">
            Real-world systems spanning multi-agent reasoning, high-throughput vector indexes, real-time WebRTC audio pipelines, and developer sandboxes.
          </p>
        </div>

        {/* Sticky Stacking Projects Container */}
        <div className="relative flex flex-col gap-6">
          {PROJECTS.map((project, index) => {
            const targetScale = 1 - (PROJECTS.length - 1 - index) * 0.03;
            const startRange = index / PROJECTS.length;
            const endRange = 1;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                totalCards={PROJECTS.length}
                progress={scrollYProgress}
                range={[startRange, endRange]}
                targetScale={targetScale}
                onSelectProject={setSelectedProject}
              />
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
