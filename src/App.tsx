import React, { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { Navigation } from './components/sections/Navigation';
import { Hero } from './components/sections/Hero';
import { SystemSection } from './components/sections/SystemSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectStack } from './components/sections/ProjectStack';
import { CapabilityList } from './components/sections/CapabilityList';
import { ExperimentLab } from './components/sections/ExperimentLab';
import { TechConstellation } from './components/sections/TechConstellation';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { CommandPalette } from './components/ui/CommandPalette';
import { ContactModal } from './components/ui/ContactModal';

export function App(): React.ReactElement {
  // Initialize Lenis smooth scroll with GSAP ScrollTrigger
  useLenis();

  const [contactOpen, setContactOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpenCommandPalette = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenCommandPalette);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0C0C0C] text-[#D7E2EA] selection:bg-[#7621B0] selection:text-white overflow-x-clip">
      {/* Interactive Cursor follower */}
      <CustomCursor />

      {/* Primary Sticky Editorial Header */}
      <Navigation
        onOpenContact={() => setContactOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Portfolio Sections */}
      <main>
        <Hero onOpenContact={() => setContactOpen(true)} />
        <SystemSection />
        <AboutSection />
        <ProjectStack />
        <CapabilityList />
        <ExperimentLab />
        <TechConstellation />
        <ContactSection onOpenContact={() => setContactOpen(true)} />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenContact={() => setContactOpen(true)}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}

export default App;
