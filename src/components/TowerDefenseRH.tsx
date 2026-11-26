import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Flame,
  HelpCircle,
  Maximize2,
  Minimize2,
  MapPin,
  RotateCcw,
  Shield,
  Sparkles,
  Volume2,
  X,
  Zap,
  Crosshair,
  Users,
} from "lucide-react";
import { GennevilliersLogo } from "./GennevilliersLogo.tsx";

interface TowerDefenseProps {
  onClose: () => void;
}

interface QuartierOption {
  id: string;
  label: string;
  shortLabel: string;
  boss: string;
  ambiance: string;
}

const QUARTIERS: QuartierOption[] = [
  {
    id: "random",
    label: "Quartier aléatoire (92230)",
    shortLabel: "Aléatoire",
    boss: "Rotation complète des 5 secteurs",
    ambiance: "Parcours complet à travers Gennevilliers",
  },
  {
    id: "ashen",
    label: "Parvis de la Mairie & Waldeck-Rochet",
    shortLabel: "Mairie",
    boss: "Géant de la Précarité / Ogre du Gel du Point",
    ambiance: "Esplanade minérale sous la brume nocturne",
  },
  {
    id: "frost",
    label: "Parc des Chanteraines",
    shortLabel: "Chanteraines",
    boss: "Colosse du Gel Statutaire",
    ambiance: "Allées enneigées, sapins et plan d'eau gelé",
  },
  {
    id: "fen",
    label: "Parc des Sévines",
    shortLabel: "Sévines",
    boss: "Reine de la Surcharge",
    ambiance: "Saules, mares verdoyantes et lucioles",
  },
  {
    id: "ember",
    label: "Port de Gennevilliers & Grésillons",
    shortLabel: "Port & Grésillons",
    boss: "Titan de la Surchauffe",
    ambiance: "Quais industriels et braises incandescentes",
  },
  {
    id: "dunes",
    label: "Le Luth & Les Agnettes",
    shortLabel: "Luth & Agnettes",
    boss: "Roi des Archives Oubliées",
    ambiance: "Crépuscule doré et vents chauds",
  },
];

const TOURS_CFDT = [
  {
    key: "1",
    name: "Tribune des Délégués",
    cost: "70",
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    icon: Crosshair,
    role: "Tir rapide de tracts CFDT enflammés. Cible aussi bien la route que les urgences volantes (mails de 18h, circulaires).",
  },
  {
    key: "2",
    name: "Canon du RIFSEEP",
    cost: "120",
    color: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    icon: Flame,
    role: "Lourds arrêtés explosifs à dégâts de zone. Redoutable contre les meutes et les blocages au sol.",
  },
  {
    key: "3",
    name: "Antenne Interco 92",
    cost: "110",
    color: "text-sky-300 border-sky-500/30 bg-sky-500/10",
    icon: Zap,
    role: "Éclairs statutaires (CGFP) en chaîne qui ralentissent et percent les armures au sol comme dans les airs.",
  },
  {
    key: "4",
    name: "Permanence CFDT",
    cost: "80",
    color: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    icon: Users,
    role: "Déploie des militants CFDT sur la chaussée pour retenir les vagues à portée de vos autres tours.",
  },
];

const BASE_URL = import.meta.env.BASE_URL;

const TowerDefenseRH: React.FC<TowerDefenseProps> = ({ onClose }) => {
  const [selectedBiome, setSelectedBiome] = useState<string>("random");
  const [runSeed, setRunSeed] = useState<number>(1);
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
      const d = document as Document & { webkitFullscreenElement?: Element | null };
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
    const el = containerRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }) | null;
    const d = document as Document & { webkitExitFullscreen?: () => Promise<void>; webkitFullscreenElement?: Element | null };
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
    setRunSeed((prev) => prev + 1);
    focusGame();
  };

  const handleBiomeChange = (biomeId: string) => {
    setSelectedBiome(biomeId);
    setRunSeed((prev) => prev + 1);
    focusGame();
  };

  const hashParams = selectedBiome === "random" ? "" : `#biome=${selectedBiome}`;
  const iframeSrc = `${BASE_URL}cinderwatch-gennevilliers.html?run=${runSeed}${hashParams}`;

  return (
    <div
      ref={containerRef}
      className={`relative z-30 isolate flex flex-col w-full bg-[#020308] text-white select-none overflow-hidden ${
        isFullscreen ? "h-dvh" : "h-[calc(100dvh-4.75rem)] min-h-[560px]"
      }`}
    >
      {/* Barre supérieure compacte CFDT Gennevilliers */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-950/95 border-b border-orange-500/25 backdrop-blur-md shrink-0">
        {/* Gauche : Retour + Identité CFDT & Ville de Gennevilliers */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 border border-red-400/30 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Retour aux jeux</span>
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
                <Shield className="w-3.5 h-3.5 text-orange-400 shrink-0 hidden sm:inline" />
                <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white truncate">
                  Bastion CFDT <span className="text-orange-400">· Gennevilliers</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden md:block">
                Défendez la flamme sociale du 92230 — la section CFDT joue seule tant que vous observez !
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center pl-2 border-l border-white/10">
            <GennevilliersLogo variant="white" className="h-5 w-auto opacity-80" />
          </div>
        </div>

        {/* Droite : Sélecteur de quartier de Gennevilliers + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="text-[11px] text-slate-400 hidden lg:inline">Secteur :</span>
            <select
              value={selectedBiome}
              onChange={(e) => handleBiomeChange(e.target.value)}
              aria-label="Choisir le quartier de Gennevilliers"
              className="bg-transparent text-xs font-semibold text-amber-200 focus:outline-none cursor-pointer pr-1"
            >
              {QUARTIERS.map((q) => (
                <option key={q.id} value={q.id} className="bg-slate-900 text-white">
                  {q.shortLabel}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showGuide
                ? "bg-orange-500 text-slate-950 border-orange-300 shadow-lg shadow-orange-500/25"
                : "bg-slate-900 hover:bg-slate-800 text-orange-200 border-orange-500/30"
            }`}
            title="Afficher le guide des tours CFDT et des commandes"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide CFDT</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title="Relancer une nouvelle carte"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Nouvelle carte</span>
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
            <span className="hidden lg:inline">{isFullscreen ? "Réduire" : "Plein écran"}</span>
          </button>
        </div>
      </header>

      {/* Scène 3D Cinderwatch francisée Gennevilliers & CFDT */}
      <div className="relative flex-1 w-full h-full bg-[#020308]" onClick={focusGame}>
        <iframe
          key={`${selectedBiome}-${runSeed}`}
          ref={iframeRef}
          src={iframeSrc}
          onLoad={focusGame}
          title="Bastion CFDT Gennevilliers — Tower Defense 3D"
          allow="fullscreen"
          className="w-full h-full border-0 block bg-[#020308]"
        />

        {/* Modal / Panneau Guide Syndical & Commandes */}
        {showGuide && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900/95 border border-orange-500/35 shadow-2xl p-5 sm:p-7 text-left max-h-full overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/10">
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
                      Guide de Défense · Bastion CFDT
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
                Protégez la <strong className="text-orange-300">Flamme Sociale de l&apos;Hôtel de Ville</strong> face aux vagues de dossiers en retard, mails urgents de 18h, clauses abusives et blocages budgétaires ! Dès l&apos;ouverture, le <strong className="text-amber-300">Pilote auto CFDT</strong> assure la permanence : cliquez ou touchez n&apos;importe quel socle pour prendre la direction des opérations (ou cliquez en haut à droite pour lui rendre le relai).
              </p>

              {/* Les 4 Tours CFDT */}
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-2.5">
                Les 4 Bastions Syndicaux (3 niveaux chacun)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                {TOURS_CFDT.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.key}
                      className={`rounded-2xl border p-3 ${t.color}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm flex items-center gap-2 text-white">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>
                            [{t.key}] {t.name}
                          </span>
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {t.cost} or
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{t.role}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quartiers & Commandes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Les 5 Secteurs de Gennevilliers
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {QUARTIERS.filter((q) => q.id !== "random").map((q) => (
                      <li key={q.id} className="flex flex-col">
                        <span className="font-bold text-white">{q.label}</span>
                        <span className="text-[11px] text-slate-400">
                          Boss (vague 5) : {q.boss}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-sky-300 mb-2.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    Raccourcis & Contrôles
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>
                      <strong className="text-white">Clic / Tap sur un socle :</strong> construire, améliorer ou vendre une tour
                    </li>
                    <li>
                      <strong className="text-white">Touches 1 à 4 :</strong> sélectionner directement une tour CFDT
                    </li>
                    <li>
                      <strong className="text-white">U / X (×2) :</strong> améliorer la tour / confirmer la vente
                    </li>
                    <li>
                      <strong className="text-white">Espace :</strong> appeler la vague suivante en avance (+bonus d&apos;or)
                    </li>
                    <li>
                      <strong className="text-white">C :</strong> passer la main au Pilote auto CFDT ou reprendre la main
                    </li>
                    <li>
                      <strong className="text-white">P / Tab / M :</strong> pause, vitesse (1x, 2x, 3x), couper/activer le son
                    </li>
                    <li>
                      <strong className="text-white">Glisser / ZQSD / Molette / F :</strong> déplacer la caméra, zoomer, recentrer
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Moteur 3D adapté de Cinderwatch (MIT) — Édition française CFDT Mairie de Gennevilliers.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowGuide(false);
                    focusGame();
                  }}
                  className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                >
                  Reprendre la défense
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerDefenseRH;
