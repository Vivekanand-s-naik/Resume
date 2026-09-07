import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import { InteractiveCanvas } from '../3d/InteractiveCanvas';
import { LabExperiment } from '../../types';
import { FlaskConical, Code2, Play, X, Terminal } from 'lucide-react';

export const ExperimentLab: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState<LabExperiment>(LAB_EXPERIMENTS[0]);
  const [showCodeModal, setShowCodeModal] = useState<LabExperiment | null>(null);

  return (
    <section id="lab" className="relative w-full py-28 sm:py-36 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50">
      <div className="max-w-[1700px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 editorial-border-b mb-12 sm:mb-16 gap-6">
          <div>
            <div className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#00F0FF]" />
              <span>// 05 DIGITAL LAB & PROTOTYPES</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              EXPERIMENT LAB
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#8E9AA4] font-light leading-relaxed">
            Exploratory WebGL shaders, agent execution sandboxes, GPU particle dynamics, and kinetic interaction prototypes.
          </p>
        </div>

        {/* Lab Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Live Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-[#101217] border-2 border-[#D7E2EA]/30 rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[480px]">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Viewport Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262A30] z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded-md border border-[#00F0FF]/30">
                  {activeExperiment.number}
                </span>
                <span className="text-sm sm:text-base font-bold uppercase tracking-tight text-white">
                  {activeExperiment.title}
                </span>
              </div>
              <button
                onClick={() => setShowCodeModal(activeExperiment)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-[#8E9AA4] hover:text-white transition-colors cursor-pointer border border-[#262A30]"
              >
                <Code2 className="w-3.5 h-3.5 text-[#B600A8]" />
                <span>INSPECT GLSL/CODE</span>
              </button>
            </div>

            {/* Live Interactive WebGL Viewport */}
            <div className="my-6 w-full h-[320px] sm:h-[380px] rounded-2xl bg-[#08090C] border border-[#262A30] overflow-hidden relative group">
              <InteractiveCanvas type={activeExperiment.type} />
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#8E9AA4] bg-[#0C0C0C]/80 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                POINTER INTERACTION ACTIVE • 60 FPS
              </div>
            </div>

            {/* Viewport Footer Description */}
            <div className="pt-2 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#8E9AA4] font-light max-w-xl">
                {activeExperiment.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeExperiment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#D7E2EA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Selector List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {LAB_EXPERIMENTS.map((exp) => {
              const isSelected = activeExperiment.id === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveExperiment(exp)}
                  className={`w-full text-left p-5 sm:p-6 rounded-[24px] sm:rounded-[30px] border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-[#151820] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                      : 'bg-[#0E1015] border-[#262A30] hover:border-[#8E9AA4]/40 hover:bg-[#12141A]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-mono font-bold ${
                        isSelected ? 'text-[#00F0FF]' : 'text-[#5A646E]'
                      }`}
                    >
                      {exp.number}
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs font-mono text-[#8E9AA4]">
                        {exp.category}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#262A30] group-hover:border-[#00F0FF] flex items-center justify-center transition-colors">
                    <Play
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-[#00F0FF] fill-[#00F0FF]' : 'text-[#8E9AA4]'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GLSL Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCodeModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#12141A] border-2 border-[#D7E2EA]/30 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#262A30]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#00F0FF]" />
                  <span className="font-mono text-xs uppercase text-white font-bold">
                    {showCodeModal.title} // SHADER CODE
                  </span>
                </div>
                <button
                  onClick={() => setShowCodeModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#8E9AA4] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-4">
                <pre className="p-4 rounded-xl bg-[#090A0D] border border-[#262A30] overflow-x-auto text-xs font-mono text-[#39FF14] leading-relaxed">
                  <code>{showCodeModal.codeSnippet}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
