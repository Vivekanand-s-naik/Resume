import React from 'react';
import { Magnetic } from './Magnetic';
import { ArrowUpRight } from 'lucide-react';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  showIcon?: boolean;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = "Let's Talk",
  onClick,
  className = '',
  href,
  showIcon = true,
}) => {
  const buttonContent = (
    <span className="relative flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-9 sm:py-4">
      <span className="text-white font-medium uppercase tracking-widest text-sm sm:text-base whitespace-nowrap">
        {label}
      </span>
      {showIcon && (
        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </span>
  );

  const buttonClasses = `
    group relative inline-flex items-center justify-center rounded-full overflow-hidden cursor-pointer
    contact-btn-custom
    select-none
    ${className}
  `;

  if (href) {
    return (
      <Magnetic strength={0.28}>
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
    <Magnetic strength={0.28}>
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
