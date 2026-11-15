import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import { GraduationCap, Award, Trophy } from 'lucide-react';

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  index: number;
}

const Character: React.FC<CharacterProps> = ({ char, progress, range, index }) => {
  // Add slight delay for each character based on index
  const adjustedRange: [number, number] = [
    range[0] + index * 0.001,
    range[1] + index * 0.001
  ];

  const opacity = useTransform(progress, adjustedRange, [0.15, 1]);
  const color = useTransform(progress, adjustedRange, ['#5A646E', '#FFFFFF']);
  const y = useTransform(progress, adjustedRange, [8, 0]);
  const scale = useTransform(progress, adjustedRange, [0.95, 1]);

  return (
    <motion.span
      style={{
        opacity,
        color,
        y,
        scale,
        transition: 'none'
      }}
      className="inline-block"
    >
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
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full py-32 sm:py-44 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50 overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-8 editorial-border-b mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-white font-medium">
            [02 // PERSPECTIVE &amp; PHILOSOPHY]
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8E9AA4]">
            STATEFUL WORKFLOWS → DISTRIBUTED ARCHITECTURE
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
          <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.15] flex flex-wrap select-none [word-spacing:0.15em]">
            {characters.map((char, i) => {
              const total = characters.length;
              // Distribute across 75% of scroll for smoother animation
              const start = (i / total) * 0.75;
              const end = ((i + 1) / total) * 0.75 + 0.02;
              return (
                <Character
                  key={i}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                  index={i}
                />
              );
            })}
          </p>
        </div>

        {/* Architectural Principles Grid */}
        <div className="mt-20 pt-12 border-t border-[#262A30]/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROFILE.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-[#12141A]/60 border border-[#262A30] hover:border-[#00FF66]/50 transition-colors"
            >
              <div className="text-xs font-mono text-[#00FF66] uppercase tracking-widest mb-2">
                0{idx + 1} &bull; {stat.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education, Certifications & Achievements Section */}
        <div className="mt-16 pt-12 border-t border-[#262A30]/80 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-7 rounded-[28px] bg-[#101217] border border-[#262A30] space-y-5"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#262A30]">
              <div className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#00FF66] uppercase tracking-wider block">ACADEMIC BACKGROUND</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">EDUCATION</h4>
              </div>
            </div>
            <div className="space-y-4 font-mono">
              {PROFILE.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0A0B0E] border border-[#262A30]/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-bold">{edu.degree}</span>
                    <span className="text-[#00FF66] font-bold text-[11px] px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/20">
                      {edu.grade}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E9AA4] font-sans font-light">{edu.institution}</p>
                  <span className="text-[10px] text-[#5A646E] uppercase tracking-wider block">{edu.period}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-7 rounded-[28px] bg-[#101217] border border-[#262A30] space-y-5"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#262A30]">
              <div className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#00FF66] uppercase tracking-wider block">VERIFIED CREDENTIALS</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">CERTIFICATIONS</h4>
              </div>
            </div>
            <div className="space-y-3 font-mono">
              {PROFILE.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0A0B0E] border border-[#262A30]/60">
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shrink-0" />
                  <span className="text-xs text-[#D7E2EA] font-medium leading-relaxed">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-7 rounded-[28px] bg-[#101217] border border-[#262A30] space-y-5"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#262A30]">
              <div className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#00FF66] uppercase tracking-wider block">RECOGNITION &amp; IMPACT</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">ACHIEVEMENTS</h4>
              </div>
            </div>
            <div className="space-y-3 font-mono">
              {PROFILE.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0A0B0E] border border-[#262A30]/60">
                  <span className="text-xs text-[#00FF66] font-bold shrink-0 mt-0.5">0{idx + 1}</span>
                  <span className="text-xs text-[#D7E2EA] font-sans font-light leading-relaxed">{ach}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};