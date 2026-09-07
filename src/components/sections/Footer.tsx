import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { Magnetic } from '../ui/Magnetic';

export const Footer: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-8 px-4 sm:px-6 md:px-10 bg-[#080808] border-t border-[#262A30] text-xs font-mono text-[#8E9AA4]">
      <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Identity & Copyright */}
        <div className="flex items-center gap-4">
          <span className="text-white font-bold tracking-widest">{PROFILE.name}</span>
          <span className="text-[#5A646E]">/</span>
          <span>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>

        {/* Center: Live Local Clock & Systems */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-white">{time || '00:00:00 UTC'}</span>
          <span className="text-[#5A646E] hidden sm:inline">&bull; LOW LATENCY CORE</span>
        </div>

        {/* Right: Scroll to top */}
        <Magnetic strength={0.3}>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#D7E2EA] hover:text-white transition-colors cursor-pointer group"
            aria-label="Scroll to top of page"
          >
            <span>BACK TO TOP</span>
            <div className="w-6 h-6 rounded-full border border-[#262A30] group-hover:border-white flex items-center justify-center transition-colors">
              <ArrowUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
            </div>
          </button>
        </Magnetic>
      </div>
    </footer>
  );
};
