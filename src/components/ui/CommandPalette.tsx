import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Sparkles, FolderGit2, Cpu, FlaskConical, Mail } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenContact,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          const evt = new CustomEvent('open-command-palette');
          window.dispatchEvent(evt);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    {
      id: 'work',
      title: 'View Selected Work',
      subtitle: 'Browse 4 flagship architectural AI & full-stack systems',
      icon: FolderGit2,
      action: () => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'systems',
      title: 'Inspect System Architecture',
      subtitle: 'From Intelligence (Model) to Interface (Pixel)',
      icon: Cpu,
      action: () => {
        document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'capabilities',
      title: 'What I Build (Capabilities)',
      subtitle: 'Explore 5 core engineering domains',
      icon: Sparkles,
      action: () => {
        document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'lab',
      title: 'Experiment Lab',
      subtitle: 'Live WebGL shaders, vector fields & agent sandboxes',
      icon: FlaskConical,
      action: () => {
        document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'contact',
      title: "Initiate Transmission (Let's Talk)",
      subtitle: 'Open direct communication channel',
      icon: Mail,
      action: () => {
        onClose();
        onOpenContact();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-[#12141A] border-2 border-[#D7E2EA]/30 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D7E2EA]/10">
              <Search className="w-5 h-5 text-[#8E9AA4]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to section, inspect systems, or talk..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder-[#5A646E]"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-[#8E9AA4]">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>

            {/* List */}
            <div className="p-2 max-h-80 overflow-y-auto">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#7621B0]/30 text-[#D7E2EA] group-hover:text-[#00F0FF] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-[#00F0FF] transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-[#8E9AA4]">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5A646E] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
