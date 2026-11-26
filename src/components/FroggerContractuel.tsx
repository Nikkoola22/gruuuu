import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Car,
  HelpCircle,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { GennevilliersLogo } from "./GennevilliersLogo.tsx";

interface FroggerContractuelProps {
  onClose: () => void;
}

const BASE_URL = import.meta.env.BASE_URL;

const PALIERS_CDI = [
  { step: "Départ", label: "Permanence CFDT & Ferme des Chanteraines" },
  { step: "10 étapes", label: "1er CDD renouvelé · Cap sur Les Agnettes" },
  { step: "20 étapes", label: "Avis favorable CFDT en CST · Le Luth" },
  { step: "35 étapes", label: "Stage probatoire validé · Parc des Sévines" },
  { step: "50 étapes", label: "CDI / Titularisation signé à la Mairie (92230) !" },
  { step: "75+ étapes", label: "Avancement d'échelon · Port & Grésillons" },
];

const FroggerContractuel: React.FC<FroggerContractuelProps> = ({ onClose }) => {
  const [runKey, setRunKey] = useState<number>(1);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const focusGame = useCallback(() => {
    window.setTimeout(() => {
      iframeRef.current?.focus();
    }, 60);
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const d = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      setIsFullscreen(Boolean(d.fullscreenElement || d.webkitFullscreenElement));
      focusGame();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, [focusGame]);

  const toggleFullscreen = async () => {
    const el = containerRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> })
      | null;
    const d = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      webkitFullscreenElement?: Element | null;
    };
    if (!el) return;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        if (d.exitFullscreen) await d.exitFullscreen();
        else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      }
    } catch {
      // Certains navigateurs mobiles restreignent Fullscreen API
    }
  };

  const handleRestart = () => {
    setRunKey((n) => n + 1);
    focusGame();
  };

  const iframeSrc = `${BASE_URL}crossy-cdi-gennevilliers.html?run=${runKey}`;

  return (
    <div
      ref={containerRef}
      className={`relative z-30 isolate flex flex-col w-full bg-[#0d1726] text-white select-none overflow-hidden ${
        isFullscreen ? "h-dvh" : "h-[calc(100dvh-4.75rem)] min-h-[560px]"
      }`}
    >
      {/* Barre supérieure compacte CFDT · Chasse au CDI */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-950/95 border-b border-orange-500/25 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 border border-red-400/30 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retour aux jeux</span>
            <span className="inline sm:hidden">Retour</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <img
              src={`${BASE_URL}logo-cfdt.jpg`}
              alt="Logo CFDT"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-orange-400/50 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-orange-400 shrink-0 hidden sm:inline" />
                <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white truncate">
                  Chasse au CDI 3D <span className="text-orange-400">· CFDT Gennevilliers</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden md:block">
                Traversez les Chanteraines, la Seine et le 92230 sans stagner en CDD — débloquez les 12 véhicules CTM &amp; CFDT !
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center pl-2 border-l border-white/10">
            <GennevilliersLogo variant="white" className="h-5 w-auto opacity-80" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showGuide
                ? "bg-orange-500 text-slate-950 border-orange-300 shadow-lg shadow-orange-500/25"
                : "bg-slate-900 hover:bg-slate-800 text-orange-200 border-orange-500/30"
            }`}
            title="Afficher les règles et paliers CDI"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide CDI</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title="Retourner à l'écran titre du jeu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Menu du jeu</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span className="hidden lg:inline">
              {isFullscreen ? "Réduire" : "Plein écran"}
            </span>
          </button>
        </div>
      </header>

      {/* Scène 3D Voxel Crossy-CDI */}
      <div className="relative flex-1 w-full h-full bg-[#8fd3ff]" onClick={focusGame}>
        <iframe
          key={runKey}
          ref={iframeRef}
          src={iframeSrc}
          onLoad={focusGame}
          title="Chasse au CDI 3D — CFDT Gennevilliers"
          allow="fullscreen"
          className="w-full h-full border-0 block bg-[#8fd3ff]"
        />

        {showGuide && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900/95 border border-orange-500/35 shadow-2xl p-5 sm:p-7 text-left max-h-full overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={`${BASE_URL}logo-cfdt.jpg`}
                    alt="CFDT Gennevilliers"
                    className="w-11 h-11 rounded-xl object-cover border border-orange-400/50"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      Section CFDT Mairie de Gennevilliers · 92230
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Chasse au CDI 3D · Mode d&apos;emploi
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowGuide(false);
                    focusGame();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Fermer le guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Prenez le volant depuis la <strong className="text-orange-300">Permanence CFDT &amp; la Ferme pédagogique des Chanteraines</strong> ! Esquivez les troupeaux en goguette, empruntez les passerelles flottantes sur les bras de la Seine, récoltez les <strong className="text-amber-300">primes IFSE/CIA</strong> pour débloquer les 12 véhicules du <strong className="text-white">Parc Auto CTM &amp; CFDT</strong> (dont le Tracteur des Chanteraines, la Patrouille PM 92230, le Car Interco 92 et la Citerne du 13e Mois) et ne stagnez jamais sur place sous peine de fin de CDD !
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    Étapes vers le CDI &amp; la Titularisation
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {PALIERS_CDI.map((p) => (
                      <li key={p.step} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-orange-400 shrink-0">
                          {p.step} :
                        </span>
                        <span>{p.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-sky-300 mb-2.5 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" />
                    Commandes
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>
                      <strong className="text-white">Flèches / ZQSD / WASD :</strong> bondir d&apos;une case (avant, gauche, droite, arrière)
                    </li>
                    <li>
                      <strong className="text-white">Espace / Clic / Tap :</strong> bondir vers l&apos;avant
                    </li>
                    <li>
                      <strong className="text-white">Glisser (mobile / tactile) :</strong> se déplacer dans la direction du geste
                    </li>
                    <li>
                      <strong className="text-white">Feux rouges clignotants :</strong> attention à la ruée imminente sur la piste !
                    </li>
                    <li>
                      <strong className="text-white">Anti-stagnation :</strong> ne restez pas immobile en CDD, sinon la soucoupe de fin de contrat intervient !
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Moteur 3D adapté de Crossy Farm (fable-arcade) — Édition française CFDT Mairie de Gennevilliers.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowGuide(false);
                    focusGame();
                  }}
                  className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                >
                  Reprendre la route du CDI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FroggerContractuel;
