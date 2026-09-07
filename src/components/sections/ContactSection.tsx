import React from 'react';
import { ContactButton } from '../ui/ContactButton';
import { PROFILE } from '../../data/profile';
import { Mail, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';

interface ContactSectionProps {
  onOpenContact: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenContact }) => {
  return (
    <section id="contact" className="relative w-full py-32 sm:py-48 px-4 sm:px-6 md:px-10 bg-[#0C0C0C] border-t border-[#262A30]/60 overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-r from-[#7621B0]/20 via-[#B600A8]/20 to-[#BE4C00]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto w-full text-center relative z-10 flex flex-col items-center">
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#262A30] bg-[#12141A]/80 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
            SYSTEM AVAILABILITY: {PROFILE.status}
          </span>
        </div>

        {/* Dramatic Section Heading */}
        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none max-w-5xl">
          LET'S BUILD <br />
          <span className="text-gradient-accent">SOMETHING</span> <br />
          INTELLIGENT.
        </h2>

        {/* Supporting Copy */}
        <p className="mt-8 sm:mt-10 text-lg sm:text-2xl text-[#8E9AA4] font-light max-w-2xl leading-relaxed">
          Have a product, system, or idea worth building?
        </p>

        {/* Heroic CTA Button with Magnetic Pull */}
        <div className="mt-10 sm:mt-14">
          <ContactButton
            label="Start a Conversation"
            onClick={onOpenContact}
            className="text-base sm:text-lg"
          />
        </div>

        {/* Social Transmission Links */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[#262A30]/50 w-full max-w-4xl flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${PROFILE.socials.email}`}
              className="group flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#8E9AA4] hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
              <span>{PROFILE.socials.email}</span>
            </a>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#8E9AA4] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-[#D7E2EA] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#8E9AA4] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-[#00F0FF] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href={PROFILE.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#8E9AA4] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-[#B600A8] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X (Twitter)</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};
