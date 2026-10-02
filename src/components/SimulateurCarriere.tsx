import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Briefcase, 
  RotateCcw,
  Compass,
  Award,
  ExternalLink,
  CheckCircle2,
  X
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
  const [activeTab, setActiveTab] = useState<'frise' | 'ldg'>(tool === 'ldg' ? 'ldg' : 'frise');
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

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

  // Synchronisation si le paramètre tool change dynamiquement
  useEffect(() => {
    if (tool === 'ldg') {
      setActiveTab('ldg');
      setIsLoading(true);
    } else if (tool === 'frise') {
      setActiveTab('frise');
      setIsLoading(true);
    }
  }, [tool]);

  const currentUrl = activeTab === 'ldg' ? LDG_URL : FRISE_URL;

  const handleSwitchTab = (tab: 'frise' | 'ldg') => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
  };

  const handleReload = () => {
    setIsLoading(true);
    const iframe = document.getElementById("simul-agent-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = currentUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none font-sans">
      {/* Header Bar - Épinglé en haut avec style moderne et harmonisé */}
      <header className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30 transition-colors">
        
        {/* Gauche : Bouton retour & Titre */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                  Simulateur & Guide Carrière de l'Agent
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  CFDT 2026-2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate hidden sm:block">
                Échelon • Avancement de Grade • Points Promotion Interne LDG-PI • Reclassement
              </p>
            </div>
          </div>
        </div>

        {/* Centre : Sélecteur d'onglets ergonomique (Frise / LDG) */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-center">
          <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-inner flex items-center gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSwitchTab('frise')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === 'frise'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Frise & Échelons</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('ldg')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === 'ldg'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Promotion Interne LDG-PI</span>
              <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded-md bg-white/20 dark:bg-slate-900/40 text-current">
                175 pts
              </span>
            </button>
          </div>
        </div>

        {/* Droite : Outils d'action (Badge CIG, Recharger, Nouvel onglet) */}
        <div className="order-2 sm:order-3 flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" />
            CIG Petite Couronne
          </span>

          <button
            type="button"
            onClick={handleReload}
            title="Réinitialiser l'affichage du simulateur"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir dans un nouvel onglet plein écran"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-colors shadow-2xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Info Banner Pédagogique */}
      {showInfoBanner && (
        <div className="shrink-0 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 border-b border-orange-200/60 dark:border-orange-500/20 px-3 sm:px-6 py-2 text-xs flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-orange-500/15 text-orange-600 dark:text-orange-400 shrink-0 font-bold text-[11px]">
              💡 {activeTab === 'frise' ? 'Mode Frise de Carrière' : 'Mode Barème LDG-PI'}
            </span>
            <p className="truncate font-medium text-xs">
              {activeTab === 'frise' ? (
                <>
                  <strong className="text-slate-900 dark:text-white">Frise chronologique interactive :</strong> projetez vos dates d'échelon, cadences, indices majorés et simulez des événements de vie (congé parental, dispo, temps partiel).
                </>
              ) : (
                <>
                  <strong className="text-slate-900 dark:text-white">Barème officiel de promotion interne :</strong> calculez vos points sur les 6 critères officiels du CIG Petite Couronne et éditez votre fiche récapitulative pour la DRH.
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInfoBanner(false)}
            title="Masquer cette bannière"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Frame Container - Occupe 100% de la hauteur restante */}
      <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden">
        {/* Loading overlay avec design soigné */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white gap-4 animate-fade-in">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-slate-100">
                {activeTab === 'frise' ? 'Chargement de la frise de carrière...' : 'Chargement du barème LDG-PI...'}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Conforme Ville de Gennevilliers & CIG Petite Couronne
              </p>
            </div>
          </div>
        )}

        {/* Embedded Application */}
        <iframe
          key={activeTab}
          id="simul-agent-iframe"
          src={currentUrl}
          title={activeTab === 'frise' ? "Frise Interactive de Carrière" : "Simulateur Promotion Interne LDG-PI"}
          className="w-full h-full border-0 block"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default SimulateurCarriere;
