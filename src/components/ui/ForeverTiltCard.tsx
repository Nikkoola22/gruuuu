import React, { useRef, useState } from 'react';

export interface ForeverTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // angle d'inclinaison maximal en degrés (défaut: 10)
  shineOpacity?: number; // intensité du reflet suiveur de curseur (défaut: 0.22)
  badge?: React.ReactNode;
  floatingIcon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ForeverTiltCard — Adapté de Forever Components (3D Tilt Parallax & Spotlight Hover)
 * Carte 3D ultra-tactile inclinée vers le curseur avec reflet dynamique et profondeur Z.
 */
export const ForeverTiltCard: React.FC<ForeverTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  shineOpacity = 0.22,
  badge,
  floatingIcon,
  disabled = false,
  style = {},
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const ry = (px - 0.5) * maxTilt * 2;
    const rx = (0.5 - py) * maxTilt * 2;

    setIsLive(true);
    cardRef.current.style.setProperty('--c-rx', `${rx.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--c-ry', `${ry.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--c-mx', `${(px * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--c-my', `${(py * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--c-shine', `${shineOpacity}`);
  };

  const handlePointerEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    setIsLive(false);
    cardRef.current.style.setProperty('--c-rx', '0deg');
    cardRef.current.style.setProperty('--c-ry', '0deg');
    cardRef.current.style.setProperty('--c-shine', '0');
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group relative rounded-2xl transition-all duration-200 perspective-1000 select-none ${className}`}
      style={{
        transform: disabled ? undefined : 'rotateX(var(--c-rx, 0deg)) rotateY(var(--c-ry, 0deg))',
        transition: isLive
          ? 'transform 90ms linear, box-shadow 200ms ease-out'
          : 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease-out',
        transformStyle: 'preserve-3d',
        ...style
      }}
      {...props}
    >
      {/* Reflet radial doux qui suit la trajectoire du pointeur */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 -z-0"
        style={{
          background: 'radial-gradient(circle at var(--c-mx, 50%) var(--c-my, 50%), rgba(255, 255, 255, 0.35), transparent 50%)',
          opacity: 'var(--c-shine, 0)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Halo coloré subtil au survol */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"
        style={{
          background: 'radial-gradient(circle at var(--c-mx, 50%) var(--c-my, 50%), rgba(99, 102, 241, 0.25), transparent 60%)'
        }}
      />

      {/* Badge flottant étagé sur l'axe Z */}
      {badge && (
        <div
          className="absolute top-3.5 right-3.5 z-20 pointer-events-none transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(36px)' : 'translateZ(0px)' }}
        >
          {badge}
        </div>
      )}

      {/* Icône flottante surélevée */}
      {floatingIcon && (
        <div
          className="transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)' }}
        >
          {floatingIcon}
        </div>
      )}

      {/* Contenu principal de la carte */}
      <div
        className="relative z-10 w-full h-full transition-transform duration-200"
        style={{ transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default ForeverTiltCard;
