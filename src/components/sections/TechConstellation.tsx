import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TECH_NODES } from '../../data/technologies';
import { TechNode } from '../../types';
import { Network, Info } from 'lucide-react';

export const TechConstellation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredNode, setHoveredNode] = useState<TechNode | null>(null);

  const categories = [
    'ALL',
    'AI / Model Layer',
    'Backend & Distributed',
    'Frontend & 3D WebGL',
    'Data & Vector Stores',
    'Cloud & Infra',
  ];

  const filteredNodes = selectedCategory === 'ALL'
    ? TECH_NODES
    : TECH_NODES.filter((n) => n.category === selectedCategory);

  return (
    <section className="relative w-full py-28 sm:py-36 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50 overflow-hidden">
      <div className="max-w-[1700px] mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 editorial-border-b mb-12 gap-6">
          <div>
            <div className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-[#00F0FF]" />
              <span>// 06 SYSTEM STACK CONSTELLATION</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              TECHNOLOGY GRAPH
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#8E9AA4] font-light leading-relaxed">
            Every technology in this graph is rooted in actual production architectures, distributed deployments, and custom shader kernels.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-[#12141A] border border-[#262A30] text-[#8E9AA4] hover:text-white hover:border-[#8E9AA4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Constellation Visual Stage */}
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-[36px] sm:rounded-[48px] bg-[#090A0D] border-2 border-[#262A30] overflow-hidden p-6 shadow-2xl">
          {/* Background Synaptic Grid */}
          <div className="absolute inset-0 editorial-grid-bg opacity-20 pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {TECH_NODES.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = TECH_NODES.find((n) => n.id === targetId);
                if (!targetNode) return null;

                const isConnected =
                  hoveredNode?.id === node.id || hoveredNode?.id === targetId;

                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isConnected ? '#00F0FF' : 'rgba(215, 226, 234, 0.1)'}
                    strokeWidth={isConnected ? 2 : 1}
                    strokeDasharray={isConnected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Dynamic Nodes */}
          {TECH_NODES.map((node) => {
            const isVisible = selectedCategory === 'ALL' || node.category === selectedCategory;
            const isHovered = hoveredNode?.id === node.id;
            const isConnected = hoveredNode?.connections.includes(node.id);

            return (
              <motion.div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                animate={{
                  scale: isHovered ? 1.25 : isConnected ? 1.1 : 1,
                  opacity: isVisible ? 1 : 0.2,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-mono whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    isHovered
                      ? 'bg-[#00F0FF] text-black font-bold border-white shadow-[0_0_20px_#00F0FF]'
                      : isConnected
                      ? 'bg-[#7621B0] text-white font-medium border-[#00F0FF] shadow-[0_0_15px_#7621B0]'
                      : 'bg-[#12141A]/90 text-[#D7E2EA] border-[#262A30] group-hover:border-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHovered
                        ? 'bg-black'
                        : isConnected
                        ? 'bg-[#00F0FF]'
                        : 'bg-[#7621B0]'
                    }`}
                  />
                  {node.name}
                </div>
              </motion.div>
            );
          })}

          {/* Bottom Telemetry HUD */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0C0C0C]/90 border border-[#262A30] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30 pointer-events-none">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span className="text-xs font-mono text-[#8E9AA4]">
                {hoveredNode
                  ? `${hoveredNode.name.toUpperCase()} // ${hoveredNode.description}`
                  : 'HOVER OVER ANY NODE TO INSPECT ARCHITECTURAL DEPENDENCY GRAPH'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#5A646E] uppercase tracking-wider">
              {filteredNodes.length} NODES MAPPED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
