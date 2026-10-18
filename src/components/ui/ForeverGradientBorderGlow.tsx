import React from 'react';

export interface ForeverGradientBorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string; // ex: 'from-indigo-500 via-purple-500 to-pink-500'
  glowBlur?: string; // ex: 'blur-md'
  speed?: string; // ex: '8s'
  borderWidth?: number; // en px (défaut: 2)
  containerClassName?: string;
}

/**
 * ForeverGradientBorderGlow — Adapté de Forever Components (Gradient-Border Glow)
 * Cadre animé par un dégradé conique rotatif continu avec halo diffus lumineux d'arrière-plan.
 */
export const ForeverGradientBorderGlow: React.FC<ForeverGradientBorderGlowProps> = ({
  children,
  className = '',
  gradientColors = 'conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #06b6d4, #6366f1)',
  glowBlur = 'blur-md',
  speed = '6s',
  borderWidth = 2,
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`relative p-[${borderWidth}px] rounded-3xl overflow-hidden group ${containerClassName}`}>
      {/* Halo lumineux diffus derrière la bordure */}
      <div
        className={`absolute inset-0 rounded-[inherit] opacity-60 group-hover:opacity-95 transition-opacity duration-500 ${glowBlur} -z-10`}
        style={{
          background: gradientColors,
          animation: `forever-spin-conic ${speed} linear infinite`
        }}
      />

      {/* Trait de bordure rotatif conique net */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-10 pointer-events-none"
        style={{
          background: gradientColors,
          animation: `forever-spin-conic ${speed} linear infinite`
        }}
      />

      {/* Contenu interne opaque préservé */}
      <div
        className={`relative rounded-[calc(1.5rem-${borderWidth}px)] bg-white dark:bg-slate-900 h-full w-full ${className}`}
        {...props}
      >
        {children}
      </div>

      <style>
        {`
          @keyframes forever-spin-conic {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ForeverGradientBorderGlow;
