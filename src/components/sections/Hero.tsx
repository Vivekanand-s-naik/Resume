import React from 'react';
import { motion } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import { DigitalHumanCanvas } from '../3d/DigitalHumanCanvas';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const scrollToWork = () => {
    document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-16 sm:pt-20 bg-[#0C0C0C] border-b border-white/10 overflow-hidden font-sans">
      {/* Background Architectural Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 editorial-grid-bg" />

      {/* Top Monospace Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full border-b border-white/10 px-4 sm:px-6 md:px-10 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3 z-10 bg-[#0C0C0C]/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold tracking-wider">[01 // INTRODUCTION]</span>
          <span className="text-neutral-600 hidden sm:inline">/</span>
          <span className="text-neutral-400 uppercase tracking-widest text-[11px] hidden sm:inline">
            SYSTEM ARCHITECTURE &amp; SPECIFICATION
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
          <span className="inline-flex items-center gap-1.5 text-neutral-300">
            <span className="w-1.5 h-1.5 bg-[#00FF66] inline-block" />
            <span>STATUS: PRODUCTION_READY</span>
          </span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline">LATENCY: &lt;16MS</span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="hidden md:inline">REGION: GLOBAL / REMOTE</span>
        </div>
      </motion.div>

      {/* Asymmetric Editorial Grid Main Body */}
      <div className="max-w-[1700px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 z-10">
        {/* Left Editorial Cell - Typographic Hierarchy & Positioning */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:border-r border-white/10"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6">
              <span className="text-white font-bold">[01.0 // TECHNICAL POSITIONING]</span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-neutral-400">DEV_IDENTITY: 0xVN</span>
            </div>

            {/* Heavy High-Contrast Sans-Serif Headline with Tight Tracking */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.25rem] font-black uppercase tracking-tight leading-[0.88] text-white font-display select-none">
              {PROFILE.heroHeadingPrefix}
              <br />
              <span className="text-neutral-300">{PROFILE.heroHeadingName}.</span>
            </h1>

            {/* Specific Grounded Technical Positioning */}
            <div className="mt-6 sm:mt-8 max-w-2xl">
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-normal leading-relaxed tracking-tight">
                {PROFILE.heroTagline}
              </p>
            </div>
          </div>

          <div>
            {/* Architectural Monospace Matrix with subtle borders */}
            <div className="mt-8 pt-6 border-t border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="py-3 sm:py-0 sm:pr-4">
                <span className="block font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                  [01.1 // ORCHESTRATION]
                </span>
                <span className="font-mono text-xs text-white font-medium mt-1 block">
                  LangGraph &amp; Stateful Agents
                </span>
              </div>
              <div className="py-3 sm:py-0 sm:px-4">
                <span className="block font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                  [01.2 // CONCURRENCY]
                </span>
                <span className="font-mono text-xs text-white font-medium mt-1 block">
                  High-Throughput Async Pipelines
                </span>
              </div>
              <div className="py-3 sm:py-0 sm:pl-4">
                <span className="block font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                  [01.3 // INTERFACE]
                </span>
                <span className="font-mono text-xs text-white font-medium mt-1 block">
                  Sub-16ms Reactive Systems
                </span>
              </div>
            </div>

            {/* High-Contrast Monochrome Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenContact}
                className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold border border-white hover:bg-neutral-200 transition-all duration-150 cursor-pointer select-none active:translate-y-0.5 rounded-none"
                aria-label="Initiate contact"
              >
                <span>INITIATE CONTACT</span>
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </button>

              <button
                type="button"
                onClick={scrollToWork}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 border border-white/20 hover:border-white text-white hover:bg-white/[0.04] font-mono text-xs uppercase tracking-widest transition-all duration-150 cursor-pointer select-none rounded-none"
                aria-label="Inspect architecture systems"
              >
                <span>INSPECT SYSTEMS</span>
                <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <div className="hidden xl:flex items-center gap-2 pl-2 text-xs font-mono text-neutral-500 select-none">
                <span>[COMMAND]</span>
                <kbd className="px-1.5 py-0.5 border border-white/15 bg-white/[0.04] text-neutral-300 text-[10px] rounded-none">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Editorial Cell - Functional Interactive Agentic 3D Viewport */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-5 xl:col-span-5 flex flex-col bg-[#0F1115]/50 relative border-t lg:border-t-0 border-white/10"
        >
          {/* Viewport Top Header */}
          <div className="w-full border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono bg-black/40 z-10">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">[NODE_01 // AGENTIC_SIMULATION]</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66]" />
              <span className="text-[#00FF66] text-[10px]">LIVE_KINEMATICS</span>
            </div>
          </div>

          {/* Viewport Canvas Frame */}
          <div className="relative flex-1 min-h-[400px] sm:min-h-[480px] lg:min-h-0 overflow-hidden">
            {/* Sharp Corner Grid Markers */}
            <span className="absolute top-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none z-10">
              +
            </span>
            <span className="absolute top-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none z-10">
              +
            </span>
            <span className="absolute bottom-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none z-10">
              +
            </span>
            <span className="absolute bottom-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none z-10">
              +
            </span>

            {/* Precision Interactive 3D Canvas Centered in Viewport */}
            <DigitalHumanCanvas centered={true} />

            {/* Realtime Telemetry HUD Overlay */}
            <div className="absolute top-5 left-5 z-10 font-mono text-[10px] space-y-1 bg-black/75 backdrop-blur-sm border border-white/10 p-3 text-neutral-400 select-none pointer-events-none">
              <div className="text-white font-medium tracking-wide">// AGENTIC GRAPH STATE</div>
              <div>
                RUNTIME: <span className="text-white">LANGGRAPH_v0.2</span>
              </div>
              <div>
                WORKFLOW: <span className="text-white">STATEFUL_DAG</span>
              </div>
              <div>
                TRACKING: <span className="text-[#00FF66]">SYNCHRONIZED</span>
              </div>
            </div>

            {/* Bottom-Right Interactive Kinematics Indicator */}
            <div className="absolute bottom-5 right-5 z-10 font-mono text-[10px] bg-black/75 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-neutral-400 flex items-center gap-2 select-none pointer-events-none">
              <span className="w-1.5 h-1.5 bg-[#00FF66] animate-pulse" />
              <span>INTERACTIVE 3D KINEMATICS</span>
            </div>
          </div>

          {/* Viewport Bottom Footer */}
          <div className="w-full border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-500 bg-black/40 z-10">
            <span>PIPELINE: EVALUATE → ROUTE → STREAM</span>
            <span>CONCURRENCY: HIGH</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Full-Width Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full border-t border-white/10 px-4 sm:px-6 md:px-10 py-3 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500 gap-3 z-10 bg-[#0C0C0C]/80 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="text-neutral-300 font-semibold">[01.4 // CORE_STACK]</span>
          <span className="hidden sm:inline">
            LANGGRAPH &bull; FASTAPI &bull; TYPESCRIPT &bull; PYTHON &bull; REACT &bull; THREE.JS &bull; POSTGRES &bull; REDIS
          </span>
          <span className="sm:hidden">LANGGRAPH &bull; TYPESCRIPT &bull; PYTHON</span>
        </div>

        <button
          type="button"
          onClick={scrollToWork}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer select-none"
        >
          <span>PROCEED TO ARCHITECTURE</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </section>
  );
};
