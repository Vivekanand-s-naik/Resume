import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import { GraduationCap, Award, Trophy } from 'lucide-react';

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ word, progress, range }) => {
  // Strictly clamp range to [0, 1] to guarantee Web Animations API compliance
  const start = Math.max(0, Math.min(0.92, range[0]));
  const end = Math.max(start + 0.05, Math.min(1.0, range[1]));
  const mid = start + (end - start) * 0.45;

  // Kinetic color wave: Dim Gray -> Emerald Green Flash -> Locked White
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const color = useTransform(progress, [start, mid, end], ['#4A5560', '#00FF66', '#FFFFFF']);
  const y = useTransform(progress, [start, end], [4, 0]);

  return (
    <motion.span
      style={{
        opacity,
        color,
        y,
        transition: 'none'
      }}
      className="inline-block whitespace-nowrap mr-[0.25em] font-bold select-text"
    >
      {word}
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const text = PROFILE.aboutParagraph;
  const words = text.split(' ');

  // Direct screen-level synchronization:
  // Starts illuminating as the paragraph enters view (85% from top),
  // and reaches 100% full brightness as it scrolls through the focal reading level (35% from top).
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full py-24 sm:py-36 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/50 overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-8 editorial-border-b mb-12 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00FF66] font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
            [02 // PERSPECTIVE &amp; PHILOSOPHY]
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8E9AA4] hidden sm:inline-block">
            STATEFUL WORKFLOWS → DISTRIBUTED ARCHITECTURE
          </span>
        </div>

        {/* Big Editorial Heading */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#8E9AA4]">
            ABOUT ME
          </h2>
          <div className="text-xs font-mono text-[#00FF66]/80 uppercase tracking-wider mt-2 flex items-center gap-2">
            <span>● SCREEN-SYNCED KINETIC SPECIFICATION</span>
          </div>
        </div>

        {/* Scroll Word-by-Word Animated Paragraph synced to screen level */}
        <div ref={paragraphRef} className="max-w-5xl my-6 sm:my-10">
          <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.3] sm:leading-[1.2] flex flex-wrap select-text">
            {words.map((word, i) => {
              const total = Math.max(1, words.length);
              // Distribute smoothly across scroll window so words light up in sync with screen position
              const start = (i / total) * 0.85;
              const end = Math.min(1.0, start + 0.12);
              return (
                <Word
                  key={i}
                  word={word}
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