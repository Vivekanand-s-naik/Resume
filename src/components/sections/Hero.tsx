import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import {
  DigitalHumanCanvas,
  CharacterRenderMode,
  CameraPreset,
  GesturePose,
  getNextGestureInCycle,
} from '../3d/DigitalHumanCanvas';
import {
  ArrowDown,
  ArrowUpRight,
  Play,
  Activity,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
}

const SPEC_DETAILS = [
  {
    tag: '[01.1 // ORCHESTRATION]',
    title: 'LangGraph & Stateful Agents',
    summary: 'Cyclic graph orchestration with checkpointed state graphs, memory persistence, and tool dispatch.',
    metric: 'STATEFUL_CYCLES // 0_DROPPED_FRAMES',
    suggestedPose: 'thoughtful' as GesturePose,
  },
  {
    tag: '[01.2 // CONCURRENCY]',
    title: 'High-Throughput Async Pipelines',
    summary: 'Non-blocking I/O event streaming handling 1,000+ concurrent agent workers with low tail latency.',
    metric: 'CONCURRENCY: 1,024 OPS // P99 < 16MS',
    suggestedPose: 'crossedArms' as GesturePose,
  },
  {
    tag: '[01.3 // INTERFACE]',
    title: 'Sub-16ms Reactive Systems',
    summary: 'Sub-16ms React 19 + Three.js rendering pipelines with zero layout thrash and synchronized telemetry.',
    metric: 'FPS: 60 // GLSL 3.0 // DETERMINISTIC_UI',
    suggestedPose: 'explaining' as GesturePose,
  },
];

const SIMULATION_STEPS = [
  { time: '[00:00.012]', text: 'GRAPH_INIT: Checkpointed stateful graph loaded from PostgreSQL' },
  { time: '[00:00.048]', text: 'DISPATCH: 1,024 async concurrent worker tasks spawned across Redis queue' },
  { time: '[00:00.095]', text: 'ORCHESTRATION: Evaluating Multi-Agent feedback loop consensus' },
  { time: '[00:00.142]', text: 'METRICS: P99 latency measured at 11.4ms // zero frame drops' },
  { time: '[00:00.180]', text: 'STATUS: WORKFLOW_CONVERGED [SUCCESS]' },
];

const DAG_GRAPH_NODES = [
  { id: 'init', label: 'STATE_LOAD', meta: 'POSTGRES' },
  { id: 'dispatch', label: 'DISPATCH', meta: '1,024 OPS' },
  { id: 'loop', label: 'CONSENSUS', meta: 'LANGGRAPH' },
  { id: 'telemetry', label: 'TELEMETRY', meta: 'P99 < 16MS' },
  { id: 'converged', label: 'CONVERGED', meta: 'EXIT 0' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const [renderMode, setRenderMode] = useState<CharacterRenderMode>('agent');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [currentGesture, setCurrentGesture] = useState<GesturePose>('idle');
  const [activeSpecIndex, setActiveSpecIndex] = useState<number | null>(null);

  // Live Agentic Simulation Engine State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    };
  }, []);

  const scrollToWork = () => {
    document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Run Interactive DAG Simulation Sequence safely without unhandled errors
  const handleExecuteDAG = () => {
    if (isSimulating) return;
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);

    setIsSimulating(true);
    setSimLogs([]);
    setSimStep(0);
    setCurrentGesture('explaining');

    let current = 0;
    simIntervalRef.current = setInterval(() => {
      if (current < SIMULATION_STEPS.length) {
        const step = SIMULATION_STEPS[current];
        if (step) {
          setSimLogs((prev) => [...prev, `${step.time} ${step.text}`]);
        }
        current++;
        setSimStep(current);
      } else {
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
        simTimeoutRef.current = setTimeout(() => {
          setIsSimulating(false);
          setCurrentGesture('crossedArms');
        }, 1200);
      }
    }, 600);
  };

  // Cycle gestures manually along the non-repeating cycle
  const handleCycleGesture = () => {
    const nextPose = getNextGestureInCycle(currentGesture);
    setCurrentGesture(nextPose);
  };

  // Select Spec Tab
  const handleSelectSpec = (idx: number) => {
    if (activeSpecIndex === idx) {
      setActiveSpecIndex(null);
    } else {
      setActiveSpecIndex(idx);
      setCurrentGesture(SPEC_DETAILS[idx].suggestedPose);
    }
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
        {/* Left Editorial Cell - Typographic Hierarchy & Interactive Simulation */}
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
            <div className="mt-6 sm:mt-7 max-w-2xl">
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-normal leading-relaxed tracking-tight">
                {PROFILE.heroTagline}
              </p>
            </div>
          </div>

          <div>
            {/* Architectural Matrix with Interactive Tab Selection */}
            <div className="mt-6 pt-5 border-t border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {SPEC_DETAILS.map((spec, idx) => {
                const isSelected = activeSpecIndex === idx;
                return (
                  <button
                    key={spec.tag}
                    type="button"
                    onClick={() => handleSelectSpec(idx)}
                    className={`py-3 sm:py-2.5 sm:px-3 text-left transition-all cursor-pointer group select-none ${
                      isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block font-mono text-[10px] text-neutral-500 uppercase tracking-widest group-hover:text-neutral-300">
                        {spec.tag}
                      </span>
                      {isSelected && <span className="w-1.5 h-1.5 bg-[#00FF66]" />}
                    </div>
                    <span className="font-mono text-xs text-white font-medium mt-1 block group-hover:text-[#00FF66] transition-colors">
                      {spec.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expanded Spec Inspection Drawer */}
            <AnimatePresence>
              {activeSpecIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-b border-white/10 bg-white/[0.03] p-4 font-mono text-xs text-neutral-300 space-y-1"
                >
                  <div className="text-[#00FF66] font-semibold text-[11px]">
                    {SPEC_DETAILS[activeSpecIndex].metric}
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    {SPEC_DETAILS[activeSpecIndex].summary}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* UNIQUE INTERACTIVE FEATURE: Live Agentic DAG Execution Console */}
            <div className="mt-5 p-4 bg-black/60 border border-white/10 font-mono text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'text-[#00FF66] animate-spin' : 'text-neutral-400'}`} />
                  <span className="text-white font-semibold text-[11px] tracking-wider">
                    [LIVE_RUNTIME // LANGGRAPH_DAG]
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteDAG}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-[#00FF66] hover:bg-[#10B981] disabled:opacity-50 text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-[0_0_20px_rgba(0,255,102,0.35)] border border-[#00FF66]"
                  aria-label="Simulate LangGraph agent workflow"
                >
                  <Play className="w-3 h-3 fill-black text-black" />
                  <span>{isSimulating ? 'EXECUTING GRAPH...' : 'SIMULATE AGENT WORKFLOW'}</span>
                </button>
              </div>

              {/* Visual Node-Link DAG Topological Pipeline */}
              <div className="py-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center min-w-[500px] justify-between gap-1.5">
                  {DAG_GRAPH_NODES.map((node, idx) => {
                    const isCompleted = simStep > idx;
                    const isActive = isSimulating && simStep === idx;
                    return (
                      <React.Fragment key={node.id}>
                        <div
                          className={`flex-1 p-2 border transition-all duration-300 font-mono ${
                            isCompleted
                              ? 'border-[#00FF66] bg-[#00FF66]/10 text-white shadow-[0_0_10px_rgba(0,255,102,0.15)]'
                              : isActive
                              ? 'border-[#00FF66] bg-black text-[#00FF66] shadow-[0_0_14px_rgba(0,255,102,0.35)]'
                              : 'border-white/10 bg-white/[0.02] text-neutral-500'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[9px] mb-0.5">
                            <span className="opacity-60">0{idx + 1}</span>
                            <span
                              className={`w-1.5 h-1.5 rounded-none ${
                                isCompleted
                                  ? 'bg-[#00FF66]'
                                  : isActive
                                  ? 'bg-[#00FF66] animate-pulse'
                                  : 'bg-neutral-700'
                              }`}
                            />
                          </div>
                          <div className="text-[10px] font-bold tracking-wider truncate">
                            {node.label}
                          </div>
                          <div className="text-[9px] text-neutral-400 opacity-75 truncate">
                            {node.meta}
                          </div>
                        </div>

                        {idx < DAG_GRAPH_NODES.length - 1 && (
                          <div
                            className={`text-[10px] font-mono px-0.5 transition-colors duration-300 ${
                              simStep > idx ? 'text-[#00FF66]' : 'text-neutral-700'
                            }`}
                          >
                            →
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Console Log Feed or Standby State */}
              <div className="min-h-[56px] text-[11px] space-y-1">
                {simLogs.length === 0 ? (
                  <div className="text-neutral-500 flex items-center justify-between py-1">
                    <span>&gt; Standby. Click "SIMULATE AGENT WORKFLOW" to test live stateful orchestration...</span>
                    <span className="text-[#00FF66] text-[10px] font-bold">READY</span>
                  </div>
                ) : (
                  simLogs.map((log, i) => (
                    <motion.div
                      key={`sim-log-${i}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${i === simLogs.length - 1 ? 'text-[#00FF66] font-semibold' : 'text-neutral-400'}`}
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Progress indicator during simulation */}
              {isSimulating && (
                <div className="w-full bg-white/10 h-1 overflow-hidden">
                  <motion.div
                    className="bg-[#00FF66] h-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, Math.round((simStep / SIMULATION_STEPS.length) * 100))}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              )}
            </div>

            {/* High-Contrast Monochrome CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
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
          {/* Viewport Top Header with Interactive Render Mode & Camera Director */}
          <div className="w-full border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono bg-black/40 z-10 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">[NODE_01 // AGENT_VIEWPORT]</span>
            </div>

            {/* Interactive Mode & Camera Controls */}
            <div className="flex items-center gap-2">
              {/* Camera Presets */}
              <div className="flex items-center border border-white/10 bg-black/40">
                {(['front', 'angled', 'close'] as const).map((cam) => (
                  <button
                    key={cam}
                    type="button"
                    onClick={() => setCameraPreset(cam)}
                    className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      cameraPreset === cam ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={`Camera angle: ${cam}`}
                  >
                    {cam}
                  </button>
                ))}
              </div>

              {/* Render Modes */}
              <div className="flex items-center border border-white/10 bg-black/40">
                {(['agent', 'holo', 'wireframe'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRenderMode(m)}
                    className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      renderMode === m ? 'bg-[#00FF66] text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={`Render mode: ${m}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Viewport Canvas Frame - Generous height guaranteeing centered fit */}
          <div className="relative flex-1 min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] overflow-hidden">
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

            {/* Precision Centered Interactive 3D Canvas with Organic Arm & Hand Gestures */}
            <DigitalHumanCanvas
              centered={true}
              mode={renderMode}
              cameraPreset={cameraPreset}
              activeGesture={currentGesture}
              isSimulating={isSimulating}
              onPoseChange={(p) => setCurrentGesture(p)}
            />

            {/* Realtime Telemetry HUD Overlay */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[10px] space-y-1.5 bg-black/85 backdrop-blur-sm border border-white/10 p-3 text-neutral-400 select-none pointer-events-none max-w-[230px]">
              <div className="text-white font-medium tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00FF66]" />
                <span className="text-white font-bold">// AGENTIC NODE HUD</span>
              </div>
              <div>
                STATUS: <span className="text-[#00FF66]">ONLINE &bull; SYNCHRONIZED</span>
              </div>
              <div>
                ACTIVE POSE: <span className="text-white uppercase font-bold">{currentGesture}</span>
              </div>
              <div>
                SKELETAL MOCAP: <span className="text-neutral-300 font-medium">53 BONES ACTIVE</span>
              </div>
              <div>
                FPS: <span className="text-[#00FF66]">60</span> &bull; LATENCY: <span className="text-neutral-300">&lt;16MS</span>
              </div>
            </div>

            {/* Top-Right Manual Gesture Cycling Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={handleCycleGesture}
                className="px-2.5 py-1.5 bg-black/80 hover:bg-black border border-white/20 hover:border-[#00FF66] text-[10px] font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Click to trigger next human arm gesture"
                aria-label="Cycle next gesture"
              >
                <RotateCcw className="w-3 h-3 text-[#00FF66]" />
                <span className="uppercase">CYCLE GESTURE</span>
              </button>
            </div>

            {/* Bottom-Right Interactive Kinematics Indicator */}
            <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] bg-black/85 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-neutral-400 flex items-center gap-2 select-none pointer-events-none">
              <span className="w-1.5 h-1.5 bg-[#00FF66] animate-pulse" />
              <span>CLICK TO TRIGGER GESTURE &amp; QUANTUM PULSE</span>
            </div>
          </div>

          {/* Viewport Bottom Footer */}
          <div className="w-full border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-500 bg-black/40 z-10">
            <span>PIPELINE: EVALUATE → ROUTE → STREAM</span>
            <span>FPS: 60 // P99 &lt;16MS</span>
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
