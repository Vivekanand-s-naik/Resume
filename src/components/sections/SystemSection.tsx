import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SYSTEM_LAYERS } from '../../data/system';
import { Terminal, Cpu, Database, Network, Layout, CheckCircle2, ChevronRight } from 'lucide-react';

export const SystemSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState(0);

  const getLayerIcon = (step: string) => {
    switch (step) {
      case '01':
        return <Cpu className="w-4 h-4 text-[#00FF66]" />;
      case '02':
        return <Database className="w-4 h-4 text-white" />;
      case '03':
        return <Network className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Layout className="w-4 h-4 text-neutral-300" />;
    }
  };

  return (
    <section id="systems" className="relative w-full py-28 sm:py-36 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50 overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 editorial-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-[1700px] mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 sm:pb-16 editorial-border-b gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#00FF66] uppercase tracking-widest mb-3">
              <span>// 01 ARCHITECTURE PHILOSOPHY</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              FROM INTELLIGENCE <br className="hidden sm:block" />
              <span className="text-[#8E9AA4]">TO INTERFACE</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#8E9AA4] font-light leading-relaxed">
            Bridging probabilistic foundation models, high-throughput distributed backends, and low-latency interactive frontends into a cohesive product organism.
          </p>
        </div>

        {/* Visual Layer System Interactive Interface */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Layers Interactive Selector */}
          <div className="lg:col-span-5 space-y-3">
            {SYSTEM_LAYERS.map((layer, index) => {
              const isActive = activeLayer === index;
              return (
                <button
                  key={layer.step}
                  onClick={() => setActiveLayer(index)}
                  className={`w-full text-left p-6 sm:p-7 transition-all duration-200 border flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-[#151515] border-white/40 border-l-2 border-l-[#00FF66]'
                      : 'bg-[#0E0E0E] border-white/10 hover:border-white/25 hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl sm:text-3xl font-black font-mono transition-colors ${
                          isActive ? 'text-[#00FF66]' : 'text-neutral-600'
                        }`}
                      >
                        {layer.step}
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                          {layer.title}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400 tracking-wider">
                          {layer.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getLayerIcon(layer.step)}
                      <ChevronRight
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                          isActive ? 'rotate-90 text-[#00FF66]' : 'group-hover:translate-x-1'
                        }`}
                      />
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                        {layer.description}
                      </p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Console & Technical Code Preview */}
          <div className="lg:col-span-7 bg-[#0E0E0E] border border-white/15 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Console Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-[#00FF66]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                    LAYER {SYSTEM_LAYERS[activeLayer].step} SPECIFICATION // {SYSTEM_LAYERS[activeLayer].title}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 uppercase">
                  <span className="w-2 h-2 bg-[#00FF66]" />
                  <span className="text-[#00FF66] font-semibold">ONLINE</span>
                </div>
              </div>

              {/* Layer Detailed Invariants */}
              <div className="pt-6 space-y-4 relative z-10">
                <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  {SYSTEM_LAYERS[activeLayer].subtitle}
                </h4>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                  {SYSTEM_LAYERS[activeLayer].description}
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_LAYERS[activeLayer].details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-black/60 border border-white/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                      <span className="text-xs text-neutral-300 font-mono leading-tight">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Code Snippet */}
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>// RUNTIME SIGNATURE</span>
                <span className="text-[#00FF66] font-bold">SYNCHRONIZED</span>
              </div>
              <pre className="p-4 bg-black border border-white/10 overflow-x-auto text-xs font-mono text-[#00FF66] leading-relaxed">
                <code>{SYSTEM_LAYERS[activeLayer].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
