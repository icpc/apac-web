import React from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  text: string;
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  alignment?: 'center' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  show = false,
  position = 'top',
  alignment = 'center',
  className = ''
}) => {
  const getPositionClasses = () => {
    const positionClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
    };

    const alignmentClasses = {
      center: {
        top: 'left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2',
        bottom: 'left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2',
        left: 'top-1/2 transform -translate-y-1/2 sm:top-1/2 sm:transform sm:-translate-y-1/2',
        right: 'top-1/2 transform -translate-y-1/2 sm:top-1/2 sm:transform sm:-translate-y-1/2'
      },
      left: {
        top: 'left-0 sm:left-0',
        bottom: 'left-0 sm:left-0',
        left: 'top-0 sm:top-0',
        right: 'top-0 sm:top-0'
      },
      right: {
        top: 'left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0',
        bottom: 'left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0',
        left: 'top-0 sm:top-0',
        right: 'top-0 sm:top-0'
      }
    };

    return `${positionClasses[position]} ${alignmentClasses[alignment][position]}`;
  };

  return (
    <span className="relative group">
      {children}
      <span className={`absolute ${getPositionClasses()} px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none ${
        show ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } ${className}`}>
        {text}
      </span>
    </span>
  );
};

export interface CopyTooltipProps {
  onCopy: (e: React.MouseEvent) => void;
  showCopiedTooltip: boolean;
  children: React.ReactNode;
  tooltipText?: string;
  copiedText?: string;
  className?: string;
  alignment?: 'center' | 'left' | 'right';
}

export const CopyTooltip: React.FC<CopyTooltipProps> = ({
  onCopy,
  showCopiedTooltip,
  children,
  tooltipText = 'Copy URL to this section',
  copiedText = 'URL copied',
  className = '',
  alignment = 'center'
}) => {
  return (
    <Tooltip
      text={showCopiedTooltip ? copiedText : tooltipText}
      show={showCopiedTooltip}
      alignment={alignment}
      className={className}
    >
      <button 
        onClick={onCopy}
        className="header-link p-0 bg-transparent border-none cursor-pointer"
      >
        {children}
      </button>
    </Tooltip>
  );
};

export interface InfoTooltipProps {
  text: string;
  children: React.ReactNode;
  alignment?: 'center' | 'left' | 'right';
  className?: string;
  forceShow?: boolean;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  children,
  alignment = 'center',
  className = '',
  forceShow = false
}) => {
  return (
    <Tooltip
      text={text}
      alignment={alignment}
      show={false}
      className={`${className} ${forceShow ? 'sm:opacity-0 opacity-100' : ''}`}
    >
      {children}
    </Tooltip>
  );
};