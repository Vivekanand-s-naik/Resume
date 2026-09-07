import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { Magnetic } from '../ui/Magnetic';

interface NavigationProps {
  onOpenContact: () => void;
  onOpenCommandPalette: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenContact,
  onOpenCommandPalette,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Systems', href: '#systems' },
    { label: 'Experiments', href: '#lab' },
    { label: 'Contact', href: '#contact', isAction: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isAction?: boolean) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isAction) {
      onOpenContact();
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0C0C0C]/80 backdrop-blur-md editorial-border-b py-4'
            : 'pt-6 md:pt-8 pb-4'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Brand Signature */}
          <Magnetic strength={0.2}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-3 select-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] group-hover:scale-125 group-hover:bg-[#B600A8] transition-all duration-300 shadow-[0_0_10px_#00F0FF]" />
              <span className="font-bold tracking-widest uppercase text-sm sm:text-base text-[#D7E2EA] group-hover:text-white transition-colors">
                {PROFILE.name}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#8E9AA4] px-2 py-0.5 rounded border border-[#262A30] bg-[#12141A]">
                AI × FULL-STACK
              </span>
            </a>
          </Magnetic>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12" aria-label="Main Navigation">
            {navItems.map((item) => (
              <Magnetic key={item.label} strength={0.25}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isAction)}
                  className="text-sm md:text-lg lg:text-[1.4rem] uppercase tracking-wider font-medium text-[#D7E2EA] hover:opacity-70 transition-opacity duration-200"
                >
                  {item.label}
                </a>
              </Magnetic>
            ))}
          </nav>

          {/* Right Utilities (Command Palette Shortcut + Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#262A30] bg-[#12141A]/70 hover:border-[#7621B0] text-xs font-mono text-[#8E9AA4] hover:text-white transition-all cursor-pointer"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>CMD + K</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#D7E2EA] hover:text-white hover:bg-white/5 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[70px] z-30 bg-[#0C0C0C]/95 backdrop-blur-xl md:hidden px-6 py-8 flex flex-col justify-between border-t border-[#262A30]"
          >
            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isAction)}
                  className="text-2xl font-bold uppercase tracking-wider text-[#D7E2EA] hover:text-[#00F0FF] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-[#262A30] space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="w-full py-3 rounded-xl bg-[#12141A] border border-[#262A30] text-xs font-mono text-[#D7E2EA] flex items-center justify-center gap-2"
              >
                <Command className="w-4 h-4 text-[#00F0FF]" />
                <span>OPEN QUICK JUMP PALETTE</span>
              </button>
              <div className="text-xs text-[#8E9AA4] font-mono text-center">
                ● STATUS: ALL SYSTEMS OPERATIONAL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
