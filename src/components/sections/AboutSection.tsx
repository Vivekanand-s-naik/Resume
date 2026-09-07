import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { PROFILE } from '../../data/profile';

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(progress, range, ['#5A646E', '#FFFFFF']);

  return (
    <motion.span style={{ opacity, color }} className="inline-block transition-colors">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = PROFILE.aboutParagraph;
  const characters = text.split('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  return (
    <section id="about" ref={containerRef} className="relative w-full py-32 sm:py-44 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50 overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-8 editorial-border-b mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00F0FF]">
            // 02 PERSPECTIVE & PHILOSOPHY
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8E9AA4]">
            MODEL LAYER → PIXEL
          </span>
        </div>

        {/* Big Editorial Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#8E9AA4]">
            ABOUT ME
          </h2>
        </div>

        {/* Scroll Character-by-Character Animated Paragraph */}
        <div className="max-w-5xl my-8">
          <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.15] flex flex-wrap select-none">
            {characters.map((char, i) => {
              const start = i / characters.length;
              const end = start + 1 / characters.length;
              return (
                <Character
                  key={i}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </p>
        </div>

        {/* Architectural Principles Grid */}
        <div className="mt-20 pt-12 border-t border-[#262A30]/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROFILE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12141A]/60 border border-[#262A30] hover:border-[#7621B0]/50 transition-colors"
            >
              <div className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-2">
                0{idx + 1} &bull; {stat.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
