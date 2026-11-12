import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/[0.08] ${
          isScrolled
            ? 'bg-[#0C0C0C]/90 backdrop-blur-md py-3.5'
            : 'bg-[#0C0C0C]/70 backdrop-blur-sm py-4 md:py-5'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          {/* Brand Signature - Left Aligned Minimal */}
          <Magnetic strength={0.15}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 select-none"
            >
              <div className="w-2 h-2 bg-white group-hover:bg-[#00FF66] transition-colors" />
              <span className="font-mono font-bold tracking-widest uppercase text-xs sm:text-sm text-white group-hover:text-neutral-300 transition-colors">
                {PROFILE.name}
              </span>
            </a>
          </Magnetic>

          {/* Desktop Navigation - Clean Spaced Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {navItems.map((item, idx) => (
              <Magnetic key={item.label} strength={0.2}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isAction)}
                  className="text-xs font-mono uppercase tracking-[0.16em] text-neutral-400 hover:text-white transition-colors duration-150 py-1 flex items-center gap-1.5 group"
                >
                  <span className="text-neutral-600 text-[10px] group-hover:text-neutral-400 transition-colors">
                    0{idx + 1}
                  </span>
                  <span>{item.label}</span>
                </a>
              </Magnetic>
            ))}
          </nav>

          {/* Right Utilities - Minimal ⌘K Indicator + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer rounded-none group"
              title="Command Palette (⌘K)"
              aria-label="Open Command Palette"
            >
              <span className="text-[10px] text-neutral-500 group-hover:text-neutral-400 tracking-wider">COMMAND</span>
              <kbd className="px-1.5 py-0.5 border border-white/15 bg-white/10 text-[10px] text-neutral-200 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] z-30 bg-[#0C0C0C]/98 backdrop-blur-xl md:hidden px-6 py-8 flex flex-col justify-between border-t border-white/10"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isAction)}
                  className="flex items-center justify-between py-3 border-b border-white/[0.06] font-mono text-base uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-neutral-600">[0{idx + 1}]</span>
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="w-full py-3 bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                <span>OPEN COMMAND PALETTE</span>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 text-[10px]">⌘K</kbd>
              </button>
              <div className="text-[10px] text-neutral-500 font-mono text-center tracking-widest uppercase">
                [SYS_STATUS // ALL SYSTEMS ONLINE]
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
