import React, { useRef, useState } from 'react';

export interface ForeverMagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // Force d'attraction (0.25 à 0.5)
  glowColor?: string; // Couleur du halo (ex: 'rgba(99, 102, 241, 0.4)')
  disabled?: boolean;
}

/**
 * ForeverMagneticButton — Adapté de Forever Components (Magnetic Button & Async Action)
 * Bouton pillule / arrondi attiré magnétiquement par le curseur avec effet d'inner-parallax.
 */
export const ForeverMagneticButton: React.FC<ForeverMagneticButtonProps> = ({
  children,
  strength = 0.35,
  glowColor = 'rgba(99, 102, 241, 0.45)',
  className = '',
  disabled = false,
  style = {},
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    btnRef.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    if (labelRef.current) {
      labelRef.current.style.transform = `translate(${x * strength * 0.45}px, ${y * strength * 0.45}px)`;
    }
  };

  const handlePointerEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate(0px, 0px)';
    }
    if (labelRef.current) {
      labelRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  return (
    <button
      ref={btnRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-medium transition-transform duration-200 ease-out will-change-transform cursor-pointer disabled:cursor-not-allowed select-none ${className}`}
      style={{
        boxShadow: isHovered && !disabled ? `0 6px 20px -4px ${glowColor}` : undefined,
        ...style
      }}
      {...props}
    >
      <span
        ref={labelRef}
        className="inline-flex items-center gap-2 transition-transform duration-200 ease-out will-change-transform pointer-events-none"
      >
        {children}
      </span>
    </button>
  );
};

export default ForeverMagneticButton;
