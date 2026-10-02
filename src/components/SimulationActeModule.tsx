import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  FileSignature,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Search,
  Scale,
  Download,
  Copy,
  Printer,
  BookOpen,
  FileText,
  AlertTriangle,
  FileCheck2,
  Gavel
} from "lucide-react";
import { queryStatutoryEngine } from "../services/legifrance";
import { FullLegalAuditResult } from "../services/statutoryAuditEngine";
import { OfficialDocumentPreview } from "./OfficialDocumentPreview";
import { MemoireJuridiqueGenerator } from "./MemoireJuridiqueGenerator";
import { ALL_THEMES_TEMPLATES } from "../data/allThemesTemplatesRegistry";
import { exportStatutoryActToDocx } from "../utils/docxExport";
import { toast } from "sonner";

interface QuickScenario {
  icon: string;
  title: string;
  badge: string;
  query: string;
  description: string;
}

const QUICK_SCENARIOS: QuickScenario[] = [
  {
    icon: "🏛️",
    title: "CDD Emploi Permanent",
    badge: "Art. L. 332-8 2°",
    query: "Contrat CDD sur Emploi Permanent (CGFP Art. L. 332-8 2°)",
    description: "Recrutement sur emploi permanent vacant en l'absence de fonctionnaire titulaire."
  },
  {
    icon: "👥",
    title: "CDD Remplacement",
    badge: "Art. L. 332-13",
    query: "Contrat CDD : Remplacement Temporaire d'un Agent Indisponible (L. 332-13)",
    description: "Remplacement temporaire d'un agent indisponible ou en congé."
  },
  {
    icon: "📈",
    title: "CDD Engagement Accroissement",
    badge: "Art. L. 332-23 1°",
    query: "Contrat CDD : Engagement pour Accroissement Temporaire d'Activité (L. 332-23 1°)",
    description: "Recrutement temporaire lié à un surcroît ou pic d'activité des services."
  },
  {
    icon: "🚀",
    title: "Contrat de Projet",
    badge: "Art. L. 332-24",
    query: "Contrat de Projet de Droit Public (CGFP Art. L. 332-24)",
    description: "Conduite et réalisation d'une opération ou mission stratégique spécifique."
  }
];

export function SimulationActeModule({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const isLight = theme === "light";

  // Navigation & Mode State
  const [activeTab, setActiveTab] = useState<"generator" | "catalog">("generator");
  const [activeResultTab, setActiveResultTab] = useState<"document" | "legalite" | "risques">("document");

  // Generator & Query State
  const [statutInput, setStatutInput] = useState<string>("");
  const [statutResult, setStatutResult] = useState<FullLegalAuditResult | null>(null);
  const [isStatutLoading, setIsStatutLoading] = useState<boolean>(false);

  // Catalog Filters State
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>("");

  // Modal State
  const [isMemoireOpen, setIsMemoireOpen] = useState<boolean>(false);
  const statutResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleExecuteStatut = async (queryToUse?: string) => {
    const rawQuery = queryToUse !== undefined ? queryToUse : statutInput;
    const effectiveQuery = rawQuery.trim() || "Contrat CDD sur Emploi Permanent (CGFP Art. L. 332-8 2°)";

    setIsStatutLoading(true);
    try {
      const res = await queryStatutoryEngine("contrats", effectiveQuery);
      setStatutResult(res);
      setActiveResultTab("document");
      setTimeout(() => {
        statutResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      console.error("Erreur génération acte:", err);
      toast.error("Erreur lors de la génération de l'acte statutaire.");
    } finally {
      setIsStatutLoading(false);
    }
  };

  // Flatten templates for catalog filter
  const allTemplatesList = selectedThemeFilter === "all"
    ? ALL_THEMES_TEMPLATES.flatMap(t => t.templates.map(tpl => ({ ...tpl, themeTitle: t.title })))
    : (ALL_THEMES_TEMPLATES.find(t => t.id === selectedThemeFilter)?.templates || []).map(tpl => ({
        ...tpl,
        themeTitle: ALL_THEMES_TEMPLATES.find(t => t.id === selectedThemeFilter)?.title
      }));

  const filteredTemplates = allTemplatesList.filter(tpl => {
    const matchType = selectedTypeFilter === "all" || tpl.type === selectedTypeFilter;
    const matchSearch = !templateSearchQuery.trim() ||
      tpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      tpl.cgfpRef.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      tpl.summary.toLowerCase().includes(templateSearchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const totalTemplatesCount = ALL_THEMES_TEMPLATES.reduce((acc, t) => acc + t.templates.length, 0);

  const typeColorMap: Record<string, { badge: string; border: string }> = {
    arrete: {
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      border: "hover:border-emerald-400 dark:hover:border-emerald-500"
    },
    decision: {
      badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
      border: "hover:border-rose-400 dark:hover:border-rose-500"
    },
    contrat: {
      badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
      border: "hover:border-indigo-400 dark:hover:border-indigo-500"
    },
    circulaire: {
      badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
      border: "hover:border-sky-400 dark:hover:border-sky-500"
    },
    courrier: {
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      border: "hover:border-amber-400 dark:hover:border-amber-500"
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* ─── CARTE PRINCIPALE : MODULE DE SIMULATION ─── */}
      <div className={`rounded-3xl p-5 sm:p-7 border shadow-xl relative overflow-hidden transition-all ${
        isLight
          ? "bg-white border-slate-200/90 shadow-slate-200/50"
          : "bg-slate-900/95 border-slate-800 shadow-2xl shadow-black/40"
      }`}>

        <div className="relative z-10 flex flex-col gap-6">

          {/* 1. Header épuré & Navigation 2 Modes */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-500 dark:text-indigo-400 rounded-2xl border border-indigo-500/30 shadow-inner shrink-0">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Simulation d'Actes RH
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    Modèles indicatifs (non officiels)
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                    Export .docx
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-2xl">
                  Générez et personnalisez vos projets d'arrêtés, contrats CDD et décisions municipales avec visas conformes au CGFP.
                </p>
              </div>
            </div>

            {/* Sélecteur de mode 2 onglets */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "generator"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Générateur Express</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Catalogue des Modèles</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === "catalog"
                    ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {totalTemplatesCount}
                </span>
              </button>
            </div>
          </div>

          {/* ─── ONGLET 1 : GÉNÉRATEUR EXPRESS ─── */}
          {activeTab === "generator" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Barre de saisie centrale */}
              <div className={`flex flex-col sm:flex-row gap-2.5 p-2 sm:p-2.5 rounded-2xl border-2 transition-all ${
                isLight
                  ? "bg-indigo-50/70 border-indigo-300 focus-within:border-indigo-600 shadow-md shadow-indigo-500/5 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  : "bg-slate-950/80 border-indigo-500/50 focus-within:border-indigo-400 shadow-md shadow-indigo-500/10 focus-within:ring-2 focus-within:ring-indigo-500/20"
              }`}>
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={statutInput}
                    onChange={(e) => setStatutInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleExecuteStatut();
                      }
                    }}
                    placeholder="Ex: Contrat CDD remplacement congé maternité, Arrêté nomination stagiaire, IFSE..."
                    className="w-full pl-10 pr-9 py-2.5 bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
                  />
                  {statutInput && (
                    <button
                      type="button"
                      onClick={() => setStatutInput("")}
                      className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Effacer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleExecuteStatut()}
                  disabled={isStatutLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 transform active:scale-98"
                >
                  {isStatutLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Générer l'acte</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9.5px] font-mono bg-white/20 rounded-md text-white">↵</kbd>
                </button>
              </div>

              {/* Situations Fréquentes (4 Cartes Aérées) */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Situations fréquentes en 1 clic :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {QUICK_SCENARIOS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setStatutInput(item.query);
                        handleExecuteStatut(item.query);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isLight
                          ? "bg-slate-50/80 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300"
                          : "bg-slate-950/50 hover:bg-[#141E38] border-slate-800 hover:border-indigo-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          {item.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                        <span>Générer</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── ONGLET 2 : CATALOGUE DES 38 MODÈLES ─── */}
          {activeTab === "catalog" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Barre de filtre & recherche */}
              <div className={`p-3.5 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/70 border-slate-800"
              }`}>
                {/* Recherche par mot-clé */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                    placeholder="Filtrer par titre, article CGFP ou mot-clé..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  {templateSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTemplateSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filtre par Thématique (Select compact) */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Thème :</span>
                  <select
                    value={selectedThemeFilter}
                    onChange={(e) => setSelectedThemeFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">Tous les thèmes ({totalTemplatesCount})</option>
                    {ALL_THEMES_TEMPLATES.map((thm) => (
                      <option key={thm.id} value={thm.id}>
                        {thm.icon} {thm.title.split("&")[0].trim()} ({thm.templates.length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtre Typologie rapide (Pillules compactes) */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "Tous types" },
                  { id: "arrete", label: "📜 Arrêtés" },
                  { id: "contrat", label: "📑 Contrats" },
                  { id: "decision", label: "🏛️ Décisions" },
                  { id: "courrier", label: "✉️ Courriers" },
                  { id: "circulaire", label: "📋 Notes" }
                ].map((t) => {
                  const isActive = selectedTypeFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTypeFilter(t.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xs"
                          : isLight
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                            : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}

                <span className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
                  {filteredTemplates.length} modèle{filteredTemplates.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Grille des Modèles Aérée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1 py-1 custom-scrollbar">
                {filteredTemplates.length === 0 ? (
                  <div className="col-span-full py-10 text-center flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-bold text-slate-400">Aucun modèle ne correspond à vos filtres.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedThemeFilter("all");
                        setSelectedTypeFilter("all");
                        setTemplateSearchQuery("");
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  filteredTemplates.map((tpl) => {
                    const style = typeColorMap[tpl.type] || typeColorMap.arrete;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          setStatutInput(tpl.name);
                          handleExecuteStatut(tpl.name);
                        }}
                        className={`group p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between gap-3 ${
                          style.border
                        } ${
                          isLight
                            ? "bg-white hover:bg-indigo-50/40 border-slate-200"
                            : "bg-slate-950/60 hover:bg-slate-800/80 border-slate-800"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider ${style.badge}`}>
                              {tpl.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]" title={tpl.cgfpRef}>
                              {tpl.cgfpRef.split("&")[0].trim()}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-2 leading-snug">
                            {tpl.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tpl.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                          <span className="text-slate-400 font-medium truncate max-w-[130px]">
                            {tpl.themeTitle?.split("&")[0].trim() || "Gennevilliers"}
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Générer</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─── RÉSULTAT DE LA SIMULATION : PRÉVISUALISATION ET AUDIT ─── */}
      {statutResult && (
        <div
          ref={statutResultRef}
          className={`rounded-3xl p-5 sm:p-7 border shadow-2xl flex flex-col gap-6 animate-in fade-in duration-200 ${
            isLight
              ? "bg-white border-emerald-300 shadow-emerald-100/50"
              : "bg-slate-900/95 border-emerald-500/40 shadow-black/80"
          }`}
        >
          {/* Header du Résultat avec Actions Clés */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {statutResult.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {statutResult.cgfpRef}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {statutResult.title}
              </h3>
            </div>

            {/* Boutons d'Action Rapides */}
            <div className="flex flex-wrap items-center gap-2">
              {statutResult.sampleDocument && (
                <button
                  type="button"
                  onClick={() => exportStatutoryActToDocx(statutResult)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger (.docx)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(statutResult.sampleDocument || "");
                  toast.success("Texte de l'acte copié dans le presse-papier !");
                }}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMemoireOpen(true)}
                className={`px-3.5 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border-purple-800/60"
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-purple-500" />
                <span>Mémoire Juridique</span>
              </button>
            </div>
          </div>

          {/* Onglets du Résultat (Document vs Légalité vs Risques) */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveResultTab("document")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeResultTab === "document"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Document Officiel (Vue A4)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveResultTab("legalite")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeResultTab === "legalite"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>2. Contrôle de Légalité & Visas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveResultTab("risques")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeResultTab === "risques"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3. Regard Préfet & Risques TA</span>
            </button>
          </div>

          {/* VUE 1 : DOCUMENT OFFICIEL A4 */}
          {activeResultTab === "document" && statutResult.sampleDocument && (
            <div className="animate-in fade-in duration-200">
              <OfficialDocumentPreview
                documentText={statutResult.sampleDocument}
                title={statutResult.title}
                category={statutResult.category}
              />
            </div>
          )}

          {/* VUE 2 : CONTRÔLE DE LÉGALITÉ & VISAS */}
          {activeResultTab === "legalite" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Entête d'audit & Ressort */}
              {statutResult.auditHeader && (
                <div className={`p-3.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 font-mono ${
                  isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-950 border-slate-800 text-slate-300"
                }`}>
                  <div><strong className="text-indigo-400">📅 Analyse :</strong> {statutResult.auditHeader.dateAnalyse}</div>
                  <div><strong className="text-emerald-400">📍 Champ :</strong> {statutResult.auditHeader.champTerritorial}</div>
                  <div><strong className="text-amber-400">⚖️ Juridiction :</strong> {statutResult.auditHeader.juridictionRecours}</div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Légalité Externe */}
                <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                  isLight ? "bg-emerald-50/60 border-emerald-200" : "bg-[#091A16] border-emerald-500/30"
                }`}>
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Légalité Externe (Forme & Compétence)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {statutResult.controleLegaliteExterne?.competenceSignataire && (
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">Compétence signataire :</strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteExterne.competenceSignataire.details}
                          </span>
                        </div>
                      </div>
                    )}
                    {statutResult.controleLegaliteExterne?.regulariteProcedure && (
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">Procédure & DVE :</strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteExterne.regulariteProcedure.details}
                          </span>
                        </div>
                      </div>
                    )}
                    {statutResult.controleLegaliteExterne?.clauseRecoursDelais && (
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">Voies et délais de recours :</strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteExterne.clauseRecoursDelais.details}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Légalité Interne */}
                <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                  isLight ? "bg-indigo-50/60 border-indigo-200" : "bg-[#0F142A] border-indigo-500/30"
                }`}>
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                      <Scale className="w-4 h-4" /> Légalité Interne (Fond & CGFP)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {statutResult.controleLegaliteInterne?.baseLegaleCGFP && (
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">
                            Base légale ({statutResult.controleLegaliteInterne.baseLegaleCGFP.article}) :
                          </strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteInterne.baseLegaleCGFP.details}
                          </span>
                        </div>
                      </div>
                    )}
                    {statutResult.controleLegaliteInterne?.dureeEtPlafonds && (
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">Durée & plafonds :</strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteInterne.dureeEtPlafonds.details}
                          </span>
                        </div>
                      </div>
                    )}
                    {statutResult.controleLegaliteInterne?.periodeEssai && (
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <div>
                          <strong className="block text-slate-900 dark:text-white">Période d'essai :</strong>
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>
                            {statutResult.controleLegaliteInterne.periodeEssai.details}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mentions Obligatoires et Remarques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mentions et Visas obligatoires
                  </span>
                  <ul className="text-xs space-y-1.5 font-medium text-slate-600 dark:text-slate-300">
                    {statutResult.analyseForme?.mentionsObligatoires.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        <span>{m.name} <span className="text-slate-400 font-normal">({m.note})</span></span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-500" /> Recommandations statutaires
                  </span>
                  <ul className="text-xs space-y-1.5 font-medium text-slate-600 dark:text-slate-300">
                    {statutResult.analyseFond?.remarquesFond.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* VUE 3 : REGARD PRÉFET & RISQUES TA */}
          {activeResultTab === "risques" && statutResult.autoCritiqueAdversariale && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  isLight ? "bg-amber-50/70 border-amber-200" : "bg-[#181B2B] border-amber-500/30"
                }`}>
                  <strong className="text-amber-700 dark:text-amber-400 font-black text-xs flex items-center gap-1.5 mb-1.5">
                    🏛️ Regard du Préfet (Contrôle de légalité) :
                  </strong>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {statutResult.autoCritiqueAdversariale.regardPrefecture}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isLight ? "bg-amber-50/70 border-amber-200" : "bg-[#181B2B] border-amber-500/30"
                }`}>
                  <strong className="text-amber-700 dark:text-amber-400 font-black text-xs flex items-center gap-1.5 mb-1.5">
                    ⚖️ Risque Contentieux Juge Administratif (TA Cergy) :
                  </strong>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {statutResult.autoCritiqueAdversariale.regardJugeAdministratif}
                  </p>
                </div>
              </div>

              {statutResult.autoCritiqueAdversariale.recommandationsCorrectives?.length > 0 && (
                <div className={`p-4 rounded-2xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}>
                  <strong className="text-slate-900 dark:text-white text-xs font-bold block mb-2">
                    📝 Recommandations d'amendements clause par clause :
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {statutResult.autoCritiqueAdversariale.recommandationsCorrectives.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ─── MODAL MÉMOIRE JURIDIQUE ─── */}
      {isMemoireOpen && (
        <MemoireJuridiqueGenerator onClose={() => setIsMemoireOpen(false)} />
      )}
    </div>
  );
}
