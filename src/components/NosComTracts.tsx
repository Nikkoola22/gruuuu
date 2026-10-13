import React, { useState } from "react";
import {
  ArrowLeft,
  Megaphone,
  Download,
  Eye,
  Search,
  X,
  FileText,
  Calendar,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { CFDT_TRACTS, type CFDTract } from "../data/cfdtTracts";

interface NosComTractsProps {
  onClose: () => void;
  theme?: string;
}

const BASE_URL = import.meta.env.BASE_URL;

export default function NosComTracts({ onClose }: NosComTractsProps) {
  const [selectedTract, setSelectedTract] = useState<CFDTract | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tous nos tracts", count: CFDT_TRACTS.length },
    { id: "elections", label: "Élections 2026", count: CFDT_TRACTS.filter(t => t.themeColor === "orange").length },
    { id: "carriere", label: "Carrière & SGES", count: CFDT_TRACTS.filter(t => t.themeColor === "blue").length },
    { id: "remuneration", label: "SFT & Pouvoir d'achat", count: CFDT_TRACTS.filter(t => t.themeColor === "amber").length },
    { id: "justice", label: "Victoire EPI", count: CFDT_TRACTS.filter(t => t.themeColor === "emerald").length },
    { id: "conditions", label: "SERA & Conditions", count: CFDT_TRACTS.filter(t => t.themeColor === "rose").length },
  ];

  const filteredTracts = CFDT_TRACTS.filter((tract) => {
    const matchesSearch =
      tract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tract.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tract.serviceConcerne.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tract.keyPoints.some(kp => kp.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "elections") return tract.themeColor === "orange";
    if (selectedCategory === "carriere") return tract.themeColor === "blue";
    if (selectedCategory === "remuneration") return tract.themeColor === "amber";
    if (selectedCategory === "justice") return tract.themeColor === "emerald";
    if (selectedCategory === "conditions") return tract.themeColor === "rose";

    return true;
  });

  const handleShare = (tract: CFDTract) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: tract.title,
        text: `${tract.title} - CFDT Interco Gennevilliers`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  const handleNavigateModal = (direction: "prev" | "next") => {
    if (!selectedTract) return;
    const currentIndex = CFDT_TRACTS.findIndex(t => t.id === selectedTract.id);
    if (currentIndex === -1) return;

    if (direction === "prev") {
      const prevIndex = (currentIndex - 1 + CFDT_TRACTS.length) % CFDT_TRACTS.length;
      setSelectedTract(CFDT_TRACTS[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % CFDT_TRACTS.length;
      setSelectedTract(CFDT_TRACTS[nextIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl py-3.5 sm:py-4 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* BOUTON RETOUR ROUGE */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
              title="Retour au menu principal"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </button>

            {/* Logo & Titre */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                    Nos Com · Tracts CFDT
                  </h1>
                  <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                    Gennevilliers
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                  Toutes les publications, alertes et revendications syndicales officielles
                </p>
              </div>
            </div>
          </div>

          {/* Recherche rapide */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un tract, service, mot-clé..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* BANNIÈRE VOTE 2026 */}
      <section className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/20 text-white shrink-0">
              <Calendar className="w-4 h-4" />
            </span>
            <span>
              <strong>Élections professionnelles le 10 décembre 2026</strong> — Votre voix compte : votez CFDT !
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 tracking-wide uppercase">
            Ni dociles, ni résignés !
          </span>
        </div>
      </section>

      {/* CORPS PRINCIPAL */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* FILTRES CATÉGORIES */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* GRILLE DES TRACTS */}
        {filteredTracts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Aucun tract trouvé</h3>
            <p className="text-xs text-slate-500 mt-1">Essayez de modifier votre terme de recherche ou filtre.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracts.map((tract) => (
              <article
                key={tract.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Flyer Preview */}
                  <div
                    onClick={() => setSelectedTract(tract)}
                    className="relative aspect-[4/5] bg-slate-950 overflow-hidden cursor-pointer group/image"
                  >
                    <img
                      src={`${BASE_URL}${tract.coverImage}`}
                      alt={tract.title}
                      className="w-full h-full object-cover object-top group-hover/image:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `${BASE_URL}journal-rentree-2026.png`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover/image:opacity-90 transition-opacity" />

                    {/* Badge Haut Gauche */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-sm">
                      {tract.badge}
                    </span>

                    {/* Service Haut Droite */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-slate-200 border border-white/20 backdrop-blur-xs">
                      {tract.date}
                    </span>

                    {/* Survol : bouton pour agrandir */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:scale-105 transition-transform">
                        <Eye className="w-4 h-4 text-orange-600" />
                        Lire le tract
                      </span>
                    </div>
                  </div>

                  {/* Contenu textuel */}
                  <div className="p-4 sm:p-5">
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide block mb-1">
                      {tract.serviceConcerne}
                    </span>
                    <h3
                      onClick={() => setSelectedTract(tract)}
                      className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug cursor-pointer mb-2"
                    >
                      {tract.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-3">
                      {tract.description}
                    </p>

                    {/* Points clés */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                      {tract.keyPoints.slice(0, 2).map((kp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Barre d'actions au bas de la carte */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTract(tract)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Agrandir</span>
                  </button>

                  <a
                    href={`${BASE_URL}${tract.pdfUrl}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    title="Télécharger le fichier PDF officiel"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-500" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleShare(tract)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    title="Partager ce tract"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE LECTURE PLEIN ÉCRAN */}
      {selectedTract && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header du modal */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/80">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-600 text-white shrink-0">
                  {selectedTract.badge}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                    {selectedTract.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {selectedTract.serviceConcerne} · {selectedTract.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${BASE_URL}${selectedTract.pdfUrl}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF</span>
                </a>

                {/* Bouton fermer modal en rouge harmonisé */}
                <button
                  type="button"
                  onClick={() => setSelectedTract(null)}
                  className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corps du modal : Grand Visuel Tract */}
            <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
              <img
                src={`${BASE_URL}${selectedTract.coverImage}`}
                alt={selectedTract.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />

              {/* Boutons Suivant / Précédent */}
              <button
                type="button"
                onClick={() => handleNavigateModal("prev")}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white border border-white/20 transition-all shadow-lg"
                title="Tract précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleNavigateModal("next")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white border border-white/20 transition-all shadow-lg"
                title="Tract suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pied du modal avec synthèse */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                {selectedTract.description}
              </p>
              <button
                type="button"
                onClick={() => setSelectedTract(null)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 cursor-pointer transition-all"
              >
                Fermer la vue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
