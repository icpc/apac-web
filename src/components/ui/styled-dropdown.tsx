import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

interface StyledDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  itemsClassName?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function StyledDropdown({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className = '',
  triggerClassName = '',
  itemsClassName = 'rounded-sm font-normal text-xs',
  size = 'default'
}: StyledDropdownProps) {
  const selectedOption = options.find(option => option.value === value);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateWidth = () => {
      let triggerW = 0;
      let contentW = 0;
      
      if (triggerRef.current) {
        triggerW = triggerRef.current.getBoundingClientRect().width;
      }
      if (contentRef.current) {
        contentW = contentRef.current.getBoundingClientRect().width;
      }
      
      setMaxWidth(Math.max(triggerW, contentW));
    };
    
    // Initial measurement
    updateWidth();
    
    // Re-measure after a short delay to ensure content is rendered
    const timeoutId = setTimeout(updateWidth, 50);
    
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timeoutId);
    };
  }, [options]);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          ref={triggerRef}
          style={{ width: maxWidth, boxSizing: 'border-box' }}
          className={`${sizeClasses[size]} font-normal text-text-header-secondary bg-white border rounded-md data-[state=open]:rounded-b-none data-[state=open]:border-b-1 ${triggerClassName}`}
        >
          <span className="mr-2">{selectedOption?.label || placeholder}</span>
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        ref={contentRef}
        align="start"
        sideOffset={0}
        style={{ width: maxWidth, boxSizing: 'border-box' }}
        className={`z-[9999] bg-white text-black shadow-none border rounded-md rounded-t-none border-t-0 mt-0 p-0
          data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-1 duration-50
          ${className}`}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onValueChange(option.value)}
            className={`cursor-pointer ${sizeClasses[size]} ${itemsClassName}
              hover:text-text-header-secondary hover:bg-primaryAccent/10 dark:hover:bg-primaryAccent-dark/10
            `}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}