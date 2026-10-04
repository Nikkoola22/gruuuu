import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  RotateCcw,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface SimulateurCarriereProps {
  onClose: () => void;
  theme?: "light" | "dark";
  tool?: string | null;
}

const BASE_URL = import.meta.env.BASE_URL || "/";
const FRISE_URL = `${BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`}simul-agent/index.html`;
const LDG_URL = `${BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`}simul-agent/ldg/index.html`;

export const SimulateurCarriere: React.FC<SimulateurCarriereProps> = ({ onClose, tool }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // S'assurer que le scroll est remis à zéro immédiatement
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Empêcher le défilement de la page en arrière-plan pendant que la simulation est ouverte
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const currentUrl = tool === 'ldg' ? LDG_URL : FRISE_URL;

  const handleReload = () => {
    setIsLoading(true);
    const iframe = document.getElementById("simul-agent-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = currentUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none font-sans">
      {/* Header Bar - Épuré et harmonisé avec le bloc CFDT Ma Carrière Gennevilliers */}
      <header className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 z-30 transition-colors">
        
        {/* Gauche : Bouton retour & Bloc Marque CFDT Ma Carrière Gennevilliers */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>

          {/* Séparateur subtil */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

          {/* Bloc Logo CFDT « MA CARRIÈRE » Gennevilliers */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black text-[11px] sm:text-xs shadow-md shadow-orange-500/25 tracking-wider">
                CFDT
              </div>
              {/* Liseré tricolore discret */}
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex h-0.5 w-4 rounded-full overflow-hidden opacity-90">
                <span className="w-1/3 bg-blue-500"></span>
                <span className="w-1/3 bg-white"></span>
                <span className="w-1/3 bg-red-500"></span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                CFDT « MA CARRIÈRE »
              </span>
              <span className="inline-flex text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25">
                Gennevilliers
              </span>
            </div>
          </div>
        </div>

        {/* Droite : Badge CGFP & Actions (Recharger, Nouvel onglet) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Conforme CGFP & CIG Petite Couronne</span>
          </span>

          <button
            type="button"
            onClick={handleReload}
            title="Réinitialiser l'affichage du simulateur"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir dans un nouvel onglet plein écran"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Frame Container - Occupe 100% de la hauteur restante */}
      <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden">
        {/* Loading overlay avec design soigné */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white gap-4 animate-fade-in">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-100">
                Chargement du simulateur de carrière...
              </p>
              <p className="text-xs text-slate-400 font-medium">
                CFDT • Ville de Gennevilliers & CIG Petite Couronne
              </p>
            </div>
          </div>
        )}

        {/* Embedded Application */}
        <iframe
          id="simul-agent-iframe"
          src={currentUrl}
          title="Simulateur de Carrière de l'Agent"
          className="w-full h-full border-0 block"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default SimulateurCarriere;
