import React from 'react';
import { Magnetic } from './Magnetic';
import { ArrowUpRight } from 'lucide-react';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  showIcon?: boolean;
  variant?: 'monochrome' | 'industrial' | 'outline';
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = "INITIATE TRANSMISSION",
  onClick,
  className = '',
  href,
  showIcon = true,
  variant = 'monochrome',
}) => {
  const isIndustrial = variant === 'industrial';
  const isOutline = variant === 'outline';

  const baseTheme = isOutline
    ? 'bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/[0.04]'
    : isIndustrial
    ? 'bg-[#00FF66] text-black border border-[#00FF66] hover:bg-[#10B981]'
    : 'bg-white text-black border border-white hover:bg-neutral-200';

  const iconTheme = isOutline ? 'text-white' : 'text-black';

  const buttonContent = (
    <span className="relative flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5">
      <span className="font-mono font-semibold uppercase tracking-widest text-xs whitespace-nowrap">
        {label}
      </span>
      {showIcon && (
        <ArrowUpRight className={`w-3.5 h-3.5 ${iconTheme} transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
      )}
    </span>
  );

  const buttonClasses = `
    group relative inline-flex items-center justify-center rounded-none overflow-hidden cursor-pointer
    ${baseTheme}
    shadow-sm transition-all duration-150 active:translate-y-0.5
    select-none
    ${className}
  `;

  if (href) {
    return (
      <Magnetic strength={0.15}>
        <a
          href={href}
          onClick={onClick}
          className={buttonClasses}
          aria-label={label}
        >
          {buttonContent}
        </a>
      </Magnetic>
    );
  }

  return (
    <Magnetic strength={0.15}>
      <button
        type="button"
        onClick={onClick}
        className={buttonClasses}
        aria-label={label}
      >
        {buttonContent}
      </button>
    </Magnetic>
  );
};
