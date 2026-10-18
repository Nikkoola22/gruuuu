import React from 'react';
import { motion } from 'framer-motion';

export interface ForeverToggleOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

export interface ForeverGooeyToggleProps<T extends string = string> {
  options: ForeverToggleOption<T>[];
  value: T;
  onChange: (newValue: T) => void;
  className?: string;
  pillColor?: string; // ex: 'bg-indigo-600 text-white'
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ForeverGooeyToggle — Adapté de Forever Components (Gooey Liquid Toggle & Dawn to Dusk Segmented)
 * Sélecteur multi-options ultra-fluide avec pillule d'activation animée par ressort (layoutId).
 */
export function ForeverGooeyToggle<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  pillColor = 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25',
  size = 'md'
}: ForeverGooeyToggleProps<T>) {
  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs sm:text-sm',
    lg: 'p-1.5 text-sm sm:text-base'
  }[size];

  const itemPadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2'
  }[size];

  // Identifiant unique pour le layoutId Framer Motion
  const layoutGroupId = React.useId();

  return (
    <div
      className={`inline-flex items-center rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-inner select-none ${sizeClasses} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative rounded-xl font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer z-10 shrink-0 whitespace-nowrap ${itemPadding} ${
              isSelected
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={`forever-toggle-indicator-${layoutGroupId}`}
                className={`absolute inset-0 rounded-xl -z-10 ${pillColor}`}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32
                }}
              />
            )}
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
            {opt.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ForeverGooeyToggle;
