"use client";

import StyledDropdown from '@/components/ui/styled-dropdown';

export interface VersionControlsProps {
  showVersionDropdown: boolean;
  selectedVersion: string | null;
  onChangeVersion: (value: string) => void;
  availableVersions: Array<{ date: string; label: string }>;
  compareLabel?: string;
  placeholder?: string;
  labelClassName?: string;
}

// Dropdown-only controls. The toggle button should be rendered by the parent.
const VersionControls = ({
  showVersionDropdown,
  selectedVersion,
  onChangeVersion,
  availableVersions,
  compareLabel = 'Compare with:',
  placeholder = 'choose a version...',
  labelClassName = 'text-xs text-gray-500 dark:text-gray-400 font-medium',
}: VersionControlsProps) => {
  return (
    <div
      className={`transition-all duration-100 ${
        showVersionDropdown && availableVersions.length > 0
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
      }`}
    >
      {showVersionDropdown && availableVersions.length > 0 && (
        <div className={`flex items-center gap-2`}>
          <label className={`${labelClassName}`}>{compareLabel}</label>
          <StyledDropdown
            value={selectedVersion || ''}
            onValueChange={(value) => onChangeVersion(value)}
            options={availableVersions.map((v) => ({ value: v.date, label: v.label }))}
            placeholder={placeholder}
            size="sm"
            triggerClassName="text-xs"
            staticWidth={true}
          />
        </div>
      )}
    </div>
  );
};

export default VersionControls;
