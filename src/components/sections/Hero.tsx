import React from 'react';
import { motion } from 'framer-motion';
import { PROFILE } from '../../data/profile';
import { DigitalHumanCanvas } from '../3d/DigitalHumanCanvas';
import { ContactButton } from '../ui/ContactButton';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const scrollToWork = () => {
    document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 md:pt-28 md:pb-12 px-4 sm:px-6 md:px-10 overflow-hidden bg-[#0C0C0C]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DigitalHumanCanvas />
      </div>

      {/* Keep type readable without covering the character */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#0C0C0C] via-[#0C0C0C]/75 to-transparent md:via-[#0C0C0C]/45 md:to-transparent" />

      <div className="relative z-10 max-w-[1700px] mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#262A30] bg-[#12141A]/80 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#D7E2EA]">
            {PROFILE.role}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:flex items-center gap-6 text-xs font-mono text-[#8E9AA4]"
        >
          {PROFILE.disciplines.map((disc, idx) => (
            <span key={disc} className="flex items-center gap-2">
              {idx > 0 && <span className="text-[#262A30]">/</span>}
              <span className="hover:text-white transition-colors">{disc}</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto w-full my-auto py-6 sm:py-10 flex flex-col items-start justify-center md:max-w-[46%] md:mr-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full select-none"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8E9AA4] mb-4">
            Digital Human Interface
          </p>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl lg:text-[5.75rem]">
            {PROFILE.heroHeadingPrefix}
            <br />
            {PROFILE.heroHeadingName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-5 sm:mt-7 max-w-xl"
        >
          <p className="text-base sm:text-xl md:text-2xl text-[#D7E2EA] font-light leading-relaxed">
            {PROFILE.heroTagline}
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ContactButton label="Let's Talk" onClick={onOpenContact} />
        </motion.div>

        <motion.button
          onClick={scrollToWork}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="group flex items-center gap-3 text-xs uppercase tracking-widest text-[#8E9AA4] hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll to system architecture"
        >
          <span className="font-mono">DISCOVER ARCHITECTURE</span>
          <div className="w-8 h-8 rounded-full border border-[#262A30] group-hover:border-[#00F0FF] flex items-center justify-center transition-all group-hover:translate-y-1">
            <ArrowDown className="w-3.5 h-3.5 text-[#00F0FF]" />
          </div>
        </motion.button>
      </div>
    </section>
  );
};
