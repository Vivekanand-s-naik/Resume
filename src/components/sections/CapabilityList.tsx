import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CAPABILITIES } from '../../data/capabilities';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';

export const CapabilityList: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="capabilities" className="relative w-full py-28 sm:py-36 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50">
      <div className="max-w-[1700px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 editorial-border-b mb-12 sm:mb-16 gap-6">
          <div>
            <div className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3">
              // 04 TECHNICAL CAPABILITIES
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              WHAT I BUILD
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#8E9AA4] font-light leading-relaxed">
            A comprehensive overview of core engineering competencies, from architectural model layers to responsive digital experiences.
          </p>
        </div>

        {/* Large Editorial List */}
        <div className="space-y-0">
          {CAPABILITIES.map((cap, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={cap.number}
                className={`border-b border-[#262A30] transition-colors ${
                  isExpanded ? 'bg-[#12141A]/60' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Expandable Header Row */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full py-8 sm:py-10 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between text-left gap-4 group cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span className="text-2xl sm:text-4xl font-black font-mono text-[#5A646E] group-hover:text-[#00F0FF] transition-colors">
                      {cap.number}
                    </span>
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white group-hover:text-[#D7E2EA] transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-[#8E9AA4] mt-1">
                        {cap.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="text-xs font-mono text-[#8E9AA4] hidden lg:inline-block">
                      {cap.technologies.slice(0, 3).join(' • ')}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-[#262A30] group-hover:border-[#00F0FF] flex items-center justify-center transition-colors">
                      {isExpanded ? (
                        <Minus className="w-4 h-4 text-[#00F0FF]" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#8E9AA4] group-hover:text-white" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Architectural Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="px-4 sm:px-6 pb-10 pt-2"
                  >
                    <div className="p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-[#090A0D] border border-[#262A30] grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-5 space-y-4">
                        <div className="text-xs font-mono uppercase tracking-wider text-[#00F0FF]">
                          Architectural Scope
                        </div>
                        <p className="text-sm sm:text-base text-[#D7E2EA] font-light leading-relaxed">
                          {cap.description}
                        </p>
                      </div>

                      <div className="lg:col-span-7 space-y-4">
                        <div className="text-xs font-mono uppercase tracking-wider text-[#B600A8]">
                          Key Invariants & Strengths
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {cap.coreStrengths.map((strength, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-[#12141A] border border-[#262A30]/80"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
                              <span className="text-xs text-[#D7E2EA] font-mono leading-tight">
                                {strength}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
