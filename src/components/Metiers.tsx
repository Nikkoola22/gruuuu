import React, { useState } from "react";
import { 
  ArrowLeft, FileSignature, FileBadge, Baby, UserCheck, UserPlus, 
  RefreshCw, Briefcase, LayoutList, Award, Clock, 
  Search
} from "lucide-react";
import { SimulationActeModule } from "./SimulationActeModule";

interface ActeCardProps {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  toolId: string;
  onOpen: (id: string) => void;
  badge?: string;
}

const ActeCard: React.FC<ActeCardProps> = ({ title, description, category, icon, toolId, onOpen, badge }) => {
  return (
    <div 
      className="group bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer flex flex-col h-full relative"
      onClick={() => onOpen(toolId)}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
          {badge}
        </span>
      )}
      <div className="text-4xl mb-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md shadow-purple-500/20">
        {icon}
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
        {category}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      <button className="inline-flex items-center gap-2 text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-auto">
        <span>Générer l'arrêté</span>
        <ArrowLeft className="w-4 h-4 rotate-180" />
      </button>
    </div>
  );
};

interface ActeItem {
  id: string;
  title: string;
  description: string;
  category: "carriere" | "temps" | "mobilite";
  categoryLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const ACTES_CATALOG: ActeItem[] = [
  // 1. CARRIÈRE & PROMOTION
  {
    id: "arr-nomination",
    title: "Nomination stagiaire",
    description: "Arrêté de mise en stage après concours ou promotion interne",
    category: "carriere",
    categoryLabel: "Carrière & Progression",
    icon: <UserPlus className="w-6 h-6" />,
  },
  {
    id: "arr-titularisation",
    title: "Titularisation",
    description: "Arrêté de titularisation de l'agent après la période de stage",
    category: "carriere",
    categoryLabel: "Carrière & Progression",
    icon: <FileBadge className="w-6 h-6" />,
  },
  {
    id: "arr-echelon",
    title: "Avancement d'échelon",
    description: "Arrêté d'avancement d'échelon à l'ancienneté avec indices IB/IM",
    category: "carriere",
    categoryLabel: "Carrière & Progression",
    icon: <ArrowLeft className="w-6 h-6 rotate-90" />,
  },
  {
    id: "arr-grade",
    title: "Avancement de grade",
    description: "Arrêté de promotion au grade supérieur (tableau d'avancement / examen pro)",
    category: "carriere",
    categoryLabel: "Carrière & Progression",
    icon: <Award className="w-6 h-6" />,
    badge: "Essentiel",
  },

  // 2. TEMPS DE TRAVAIL & ABSENCES
  {
    id: "arr-teletravail",
    title: "Télétravail",
    description: "Arrêté portant autorisation d'exercice en télétravail",
    category: "temps",
    categoryLabel: "Temps de travail & Absences",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: "arr-temps-partiel",
    title: "Temps partiel",
    description: "Arrêté autorisant le travail à temps partiel (de droit ou sur autorisation)",
    category: "temps",
    categoryLabel: "Temps de travail & Absences",
    icon: <Clock className="w-6 h-6" />,
    badge: "Essentiel",
  },
  {
    id: "arr-conge-parental",
    title: "Congé Parental",
    description: "Arrêté portant placement ou renouvellement en congé parental",
    category: "temps",
    categoryLabel: "Temps de travail & Absences",
    icon: <Baby className="w-6 h-6" />,
  },
  {
    id: "arr-disponibilite",
    title: "Mise en disponibilité",
    description: "Arrêté portant mise en disponibilité ou renouvellement (CGFP & décret 86-68)",
    category: "temps",
    categoryLabel: "Temps de travail & Absences",
    icon: <Clock className="w-6 h-6" />,
    badge: "Essentiel",
  },

  // 3. MOBILITÉS & MOUVEMENTS
  {
    id: "arr-mutation-interne",
    title: "Mutation Interne",
    description: "Arrêté de changement d'affectation interne au sein de la collectivité",
    category: "mobilite",
    categoryLabel: "Mobilités & Affectations",
    icon: <RefreshCw className="w-6 h-6" />,
  },
  {
    id: "arr-mutation-externe",
    title: "Mutation Externe",
    description: "Arrêté de mutation externe (entrant ou sortant d'une autre collectivité)",
    category: "mobilite",
    categoryLabel: "Mobilités & Affectations",
    icon: <RefreshCw className="w-6 h-6" />,
  },
  {
    id: "arr-detachement",
    title: "Détachement",
    description: "Arrêté de détachement entrant ou sortant (autre fonction publique / corps)",
    category: "mobilite",
    categoryLabel: "Mobilités & Affectations",
    icon: <RefreshCw className="w-6 h-6" />,
  },
  {
    id: "arr-integration",
    title: "Intégration après détachement",
    description: "Arrêté portant intégration définitive dans le cadre d'emplois d'accueil",
    category: "mobilite",
    categoryLabel: "Mobilités & Affectations",
    icon: <UserCheck className="w-6 h-6" />,
  },
  {
    id: "arr-reintegration",
    title: "Réintégration / Reprise",
    description: "Arrêté de réintégration après disponibilité, congé parental ou détachement",
    category: "mobilite",
    categoryLabel: "Mobilités & Affectations",
    icon: <RefreshCw className="w-6 h-6" />,
    badge: "Essentiel",
  },
];

const Metiers: React.FC<{ onClose: () => void; onOpenCalculator: (id: string) => void; theme?: 'light' | 'dark' }> = ({ onClose, onOpenCalculator, theme = 'dark' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredActes = ACTES_CATALOG.filter((acte) => {
    const matchCategory = selectedCategory === "all" || acte.category === selectedCategory;
    const matchSearch = searchQuery.trim() === "" || 
      acte.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acte.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acte.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-50 dark:bg-slate-900">
      
      {/* HEADER GLOBAL OUTILS RH */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </button>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Aides aux Gestionnaires</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Arrêtés administratifs pré-remplis & simulateurs RH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        
        {/* Module 1 : Actes RH (Arrêtés) */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <LayoutList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Actes RH (Arrêtés)</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Générez rapidement vos arrêtés administratifs pré-remplis (CGFP, LDG, CIG Petite Couronne)</p>
              </div>
            </div>

            {/* Barre de recherche rapide */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un arrêté..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
          </div>

          {/* Onglets / Filtres par catégorie */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Tous les arrêtés ({ACTES_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory("carriere")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "carriere"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Carrière & Progression (4)
            </button>
            <button
              onClick={() => setSelectedCategory("temps")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "temps"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Temps de travail & Absences (4)
            </button>
            <button
              onClick={() => setSelectedCategory("mobilite")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "mobilite"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Mobilités & Affectations (5)
            </button>
          </div>

          {/* Grille des arrêtés */}
          {filteredActes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredActes.map((acte) => (
                <ActeCard
                  key={acte.id}
                  title={acte.title}
                  description={acte.description}
                  category={acte.categoryLabel}
                  icon={acte.icon}
                  toolId={acte.id}
                  onOpen={onOpenCalculator}
                  badge={acte.badge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Aucun arrêté ne correspond à votre recherche "{searchQuery}".</p>
              <button 
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        {/* Module 2 : Simulation d'Actes RH */}
        <section>
          <SimulationActeModule theme={theme} />
        </section>
        
      </div>
    </div>
  );
};

export default Metiers;
