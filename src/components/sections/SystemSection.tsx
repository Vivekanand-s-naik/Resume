import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SYSTEM_LAYERS } from '../../data/system';
import { Terminal, Cpu, Database, Network, Layout, CheckCircle2, ChevronRight } from 'lucide-react';

export const SystemSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState(0);

  const getLayerIcon = (step: string) => {
    switch (step) {
      case '01':
        return <Cpu className="w-5 h-5 text-[#7621B0]" />;
      case '02':
        return <Database className="w-5 h-5 text-[#00F0FF]" />;
      case '03':
        return <Network className="w-5 h-5 text-[#B600A8]" />;
      default:
        return <Layout className="w-5 h-5 text-[#39FF14]" />;
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
            <div className="flex items-center gap-2 font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3">
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
                  className={`w-full text-left p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] transition-all duration-300 border flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-[#151820] border-[#D7E2EA] shadow-[0_0_30px_rgba(118,33,176,0.15)]'
                      : 'bg-[#0E1015] border-[#262A30]/80 hover:border-[#8E9AA4]/40 hover:bg-[#12141A]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl sm:text-3xl font-black font-mono transition-colors ${
                          isActive ? 'text-[#00F0FF]' : 'text-[#5A646E]'
                        }`}
                      >
                        {layer.step}
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
                          {layer.title}
                        </h3>
                        <p className="text-xs font-mono text-[#8E9AA4] tracking-wider">
                          {layer.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getLayerIcon(layer.step)}
                      <ChevronRight
                        className={`w-4 h-4 text-[#8E9AA4] transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-[#00F0FF]' : 'group-hover:translate-x-1'
                        }`}
                      />
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-[#262A30]"
                    >
                      <p className="text-xs sm:text-sm text-[#D7E2EA] font-light leading-relaxed">
                        {layer.description}
                      </p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Console & Technical Code Preview */}
          <div className="lg:col-span-7 bg-[#12141A] border-2 border-[#262A30] rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            {/* Ambient Shader Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7621B0]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Console Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#262A30]">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-[#00F0FF]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8E9AA4]">
                    LAYER {SYSTEM_LAYERS[activeLayer].step} SPECIFICATION // {SYSTEM_LAYERS[activeLayer].title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
              </div>

              {/* Layer Detailed Invariants */}
              <div className="pt-6 space-y-4">
                <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  {SYSTEM_LAYERS[activeLayer].subtitle}
                </h4>
                <p className="text-sm sm:text-base text-[#D7E2EA] font-light leading-relaxed">
                  {SYSTEM_LAYERS[activeLayer].description}
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_LAYERS[activeLayer].details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0C0D11] border border-[#262A30]/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#D7E2EA] font-mono leading-tight">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Code Snippet */}
            <div className="mt-8 pt-6 border-t border-[#262A30]">
              <div className="text-[11px] font-mono text-[#8E9AA4] mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>// RUNTIME SIGNATURE</span>
                <span className="text-[#39FF14]">SYNCHRONIZED</span>
              </div>
              <pre className="p-4 rounded-xl bg-[#090A0D] border border-[#262A30] overflow-x-auto text-xs font-mono text-[#00F0FF] leading-relaxed">
                <code>{SYSTEM_LAYERS[activeLayer].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
