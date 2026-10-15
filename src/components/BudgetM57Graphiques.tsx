import React, { useState, useMemo } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Building2,
  Landmark,
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  Percent,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  DELIBERATIONS_GENNEVILLIERS_2026,
  comparerBP2025et2026,
  analyserBudgetM57,
  PRESETS_COLLECTIVITES,
  type DeliberationBudgetInfo,
  type ChapitreMouvement
} from '../services/budgetM57Engine';

interface BudgetM57GraphiquesProps {
  onInjectIntoRatios?: (delibKey: 'bp_2026' | 'bp_2025' | 'principal' | 'restauration' | 'cinema') => void;
  onNavigateToTab?: (tab: 'deliberations' | 'ratios' | 'pieces' | 'rapport' | 'note') => void;
}

// Couleurs harmonieuses modernes pour les chapitres M57
const PALETTE_RESSOURCES: Record<string, { bg: string; fill: string; border: string; text: string }> = {
  '73': { bg: 'bg-emerald-500/15', fill: '#10b981', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  '731': { bg: 'bg-teal-500/15', fill: '#14b8a6', border: 'border-teal-500', text: 'text-teal-700 dark:text-teal-300' },
  '74': { bg: 'bg-sky-500/15', fill: '#0284c7', border: 'border-sky-500', text: 'text-sky-700 dark:text-sky-300' },
  '70': { bg: 'bg-indigo-500/15', fill: '#6366f1', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300' },
  '75': { bg: 'bg-violet-500/15', fill: '#8b5cf6', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300' },
  '013': { bg: 'bg-amber-500/15', fill: '#f59e0b', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  '77': { bg: 'bg-pink-500/15', fill: '#ec4899', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-300' },
  '16': { bg: 'bg-cyan-500/15', fill: '#06b6d4', border: 'border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300' },
  '13': { bg: 'bg-blue-500/15', fill: '#3b82f6', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  '10': { bg: 'bg-lime-500/15', fill: '#84cc16', border: 'border-lime-500', text: 'text-lime-700 dark:text-lime-300' },
  '024': { bg: 'bg-orange-500/15', fill: '#f97316', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-300' },
  '021': { bg: 'bg-purple-500/15', fill: '#a855f7', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300' },
  '040': { bg: 'bg-slate-500/15', fill: '#64748b', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-300' },
  '041': { bg: 'bg-stone-500/15', fill: '#78716c', border: 'border-stone-500', text: 'text-stone-700 dark:text-stone-300' },
  '45': { bg: 'bg-zinc-500/15', fill: '#71717a', border: 'border-zinc-500', text: 'text-zinc-700 dark:text-zinc-300' },
  default: { bg: 'bg-slate-500/15', fill: '#64748b', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-300' },
};

const PALETTE_DEPENSES: Record<string, { bg: string; fill: string; border: string; text: string }> = {
  '012': { bg: 'bg-rose-500/15', fill: '#f43f5e', border: 'border-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  '011': { bg: 'bg-amber-500/15', fill: '#f59e0b', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  '65': { bg: 'bg-purple-500/15', fill: '#a855f7', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300' },
  '66': { bg: 'bg-red-500/15', fill: '#ef4444', border: 'border-red-500', text: 'text-red-700 dark:text-red-300' },
  '67': { bg: 'bg-fuchsia-500/15', fill: '#d946ef', border: 'border-fuchsia-500', text: 'text-fuchsia-700 dark:text-fuchsia-300' },
  '68': { bg: 'bg-zinc-500/15', fill: '#71717a', border: 'border-zinc-500', text: 'text-zinc-700 dark:text-zinc-300' },
  '022': { bg: 'bg-yellow-500/15', fill: '#eab308', border: 'border-yellow-500', text: 'text-yellow-700 dark:text-yellow-300' },
  '023': { bg: 'bg-indigo-500/15', fill: '#6366f1', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300' },
  '042': { bg: 'bg-slate-500/15', fill: '#64748b', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-300' },
  '21': { bg: 'bg-blue-500/15', fill: '#3b82f6', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  '23': { bg: 'bg-cyan-500/15', fill: '#06b6d4', border: 'border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300' },
  '204': { bg: 'bg-emerald-500/15', fill: '#10b981', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  '16': { bg: 'bg-orange-500/15', fill: '#f97316', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-300' },
  '20': { bg: 'bg-teal-500/15', fill: '#14b8a6', border: 'border-teal-500', text: 'text-teal-700 dark:text-teal-300' },
  '27': { bg: 'bg-violet-500/15', fill: '#8b5cf6', border: 'border-violet-500', text: 'text-violet-700 dark:text-violet-300' },
  '041': { bg: 'bg-stone-500/15', fill: '#78716c', border: 'border-stone-500', text: 'text-stone-700 dark:text-stone-300' },
  '45': { bg: 'bg-neutral-500/15', fill: '#737373', border: 'border-neutral-500', text: 'text-neutral-700 dark:text-neutral-300' },
  default: { bg: 'bg-slate-500/15', fill: '#64748b', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-300' },
};

// Fonctions trigonométriques pour le tracé précis des camemberts/donuts SVG
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSlice(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const adjustedEndAngle = endAngle - startAngle >= 359.999 ? startAngle + 359.99 : endAngle;
  const startOuter = polarToCartesian(x, y, outerRadius, adjustedEndAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, adjustedEndAngle);

  const arcSweep = adjustedEndAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', innerRadius, innerRadius, 0, arcSweep, 1, endInner.x, endInner.y,
    'Z'
  ].join(' ');
}

interface SliceItem {
  id: string;
  chapitre: string;
  libelle: string;
  montant: number;
  pourcentage: number;
  startAngle: number;
  endAngle: number;
  color: { bg: string; fill: string; border: string; text: string };
  nature: 'REEL' | 'ORDRE';
}

export const BudgetM57Graphiques: React.FC<BudgetM57GraphiquesProps> = ({
  onInjectIntoRatios,
  onNavigateToTab
}) => {
  // Sélection du budget de référence
  const [selectedDelibKey, setSelectedDelibKey] = useState<'bp_2026' | 'bp_2025' | 'principal' | 'restauration' | 'cinema'>('bp_2026');
  
  // Section visualisée dans les camemberts : 'fonctionnement' | 'investissement' | 'consolide'
  const [sectionCamembert, setSectionCamembert] = useState<'fonctionnement' | 'investissement' | 'consolide'>('fonctionnement');
  
  // Unité d'affichage : 'millions' ou 'euros'
  const [uniteAffichage, setUniteAffichage] = useState<'millions' | 'euros'>('millions');

  // Filtre pour la vue comparative BP 2025 vs BP 2026
  const [comparatifFiltre, setComparatifFiltre] = useState<'tous' | 'fonctionnement' | 'investissement' | 'agregats'>('agregats');

  // Tranche active au survol
  const [hoveredRessource, setHoveredRessource] = useState<SliceItem | null>(null);
  const [hoveredDepense, setHoveredDepense] = useState<SliceItem | null>(null);

  // Copie de synthèse
  const [copied, setCopied] = useState<boolean>(false);

  // Données du budget actif
  const budgetActif: DeliberationBudgetInfo = DELIBERATIONS_GENNEVILLIERS_2026[selectedDelibKey];

  // Comparatif complet BP 2025 vs BP 2026
  const comparatifData = useMemo(() => comparerBP2025et2026(), []);

  // Formatage monétaire
  const formatMontant = (valeur: number, forceUnite?: 'millions' | 'euros') => {
    const mode = forceUnite || uniteAffichage;
    if (mode === 'millions') {
      const millions = valeur / 1000000;
      return `${millions.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M€`;
    }
    return `${Math.round(valeur).toLocaleString('fr-FR')} €`;
  };

  // Préparation des tranches pour les RESSOURCES
  const slicesRessources: { items: SliceItem[]; total: number } = useMemo(() => {
    let sourceList: ChapitreMouvement[] = [];
    if (sectionCamembert === 'fonctionnement') {
      sourceList = budgetActif.recettesFonctionnement;
    } else if (sectionCamembert === 'investissement') {
      sourceList = budgetActif.recettesInvestissement;
    } else {
      sourceList = [...budgetActif.recettesFonctionnement, ...budgetActif.recettesInvestissement];
    }

    const total = sourceList.reduce((acc, c) => acc + (c.totalBS ?? c.montantBS2026), 0);
    if (total <= 0) return { items: [], total: 0 };

    let currentAngle = 0;
    const items: SliceItem[] = sourceList.map((chap, idx) => {
      const montant = chap.totalBS ?? chap.montantBS2026;
      const pct = (montant / total) * 100;
      const angleSpan = (montant / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      currentAngle = endAngle;

      const color = PALETTE_RESSOURCES[chap.chapitre] || PALETTE_RESSOURCES.default;

      return {
        id: `res_${chap.chapitre}_${idx}`,
        chapitre: chap.chapitre,
        libelle: chap.libelle,
        montant,
        pourcentage: Math.round(pct * 10) / 10,
        startAngle,
        endAngle,
        color,
        nature: chap.nature
      };
    });

    return { items, total };
  }, [budgetActif, sectionCamembert]);

  // Préparation des tranches pour les DÉPENSES
  const slicesDepenses: { items: SliceItem[]; total: number } = useMemo(() => {
    let sourceList: ChapitreMouvement[] = [];
    if (sectionCamembert === 'fonctionnement') {
      sourceList = budgetActif.depensesFonctionnement;
    } else if (sectionCamembert === 'investissement') {
      sourceList = budgetActif.depensesInvestissement;
    } else {
      sourceList = [...budgetActif.depensesFonctionnement, ...budgetActif.depensesInvestissement];
    }

    const total = sourceList.reduce((acc, c) => acc + (c.totalBS ?? c.montantBS2026), 0);
    if (total <= 0) return { items: [], total: 0 };

    let currentAngle = 0;
    const items: SliceItem[] = sourceList.map((chap, idx) => {
      const montant = chap.totalBS ?? chap.montantBS2026;
      const pct = (montant / total) * 100;
      const angleSpan = (montant / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      currentAngle = endAngle;

      const color = PALETTE_DEPENSES[chap.chapitre] || PALETTE_DEPENSES.default;

      return {
        id: `dep_${chap.chapitre}_${idx}`,
        chapitre: chap.chapitre,
        libelle: chap.libelle,
        montant,
        pourcentage: Math.round(pct * 10) / 10,
        startAngle,
        endAngle,
        color,
        nature: chap.nature
      };
    });

    return { items, total };
  }, [budgetActif, sectionCamembert]);

  // Ratios calculés du budget actif
  const diagnosticActif = useMemo(() => {
    // Adapter selon le preset de la délibération
    let preset = PRESETS_COLLECTIVITES.gennevilliers_bp_2026;
    if (selectedDelibKey === 'bp_2025') {
      preset = PRESETS_COLLECTIVITES.gennevilliers_bp_2025;
    } else if (selectedDelibKey === 'principal') {
      preset = PRESETS_COLLECTIVITES.gennevilliers_principal_delib_2026;
    } else if (selectedDelibKey === 'restauration') {
      preset = PRESETS_COLLECTIVITES.gennevilliers_restauration_2026;
    } else if (selectedDelibKey === 'cinema') {
      preset = PRESETS_COLLECTIVITES.gennevilliers_cinema_2026;
    }
    return analyserBudgetM57(preset);
  }, [selectedDelibKey]);

  // Copier la synthèse dans le presse-papier
  const copierSynthese = () => {
    const texte = `SYNTHÈSE BUDGÉTAIRE M57 — VILLE DE GENNEVILLIERS (${budgetActif.titre})
- Montant Total Équilibré : ${formatMontant(budgetActif.montantTotalEquilibre, 'millions')} (${formatMontant(budgetActif.montantTotalEquilibre, 'euros')})
- Section de Fonctionnement : ${formatMontant(budgetActif.sectionFonctionnementTotal, 'millions')}
- Section d'Investissement : ${formatMontant(budgetActif.sectionInvestissementTotal, 'millions')}
- Masse salariale (Chap. 012) : ${formatMontant(diagnosticActif.drf * (diagnosticActif.poidsChargesPersonnelPct || 62) / 100, 'millions')} (${diagnosticActif.poidsChargesPersonnelPct}% des dépenses réelles de fonctionnement)
- Épargne Brute calculée : ${formatMontant(diagnosticActif.epargneBrute, 'millions')} (Taux : ${diagnosticActif.tauxEpargneBrute} %)
- Capacité de désendettement : ${diagnosticActif.capaciteDesendettementAns} années (Seuil d'alerte CRC : 12 ans)`;
    navigator.clipboard.writeText(texte);
    setCopied(true);
    toast.success('Synthèse financière M57 copiée dans le presse-papier !');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* BANNIÈRE SUPÉRIEURE DE CONTRÔLE ET SÉLECTION                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-300 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
              <PieChart className="w-3.5 h-3.5" />
              <span>Tableau de Bord Graphique & Visualisations M57</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Camemberts Budgétaires & Ratios Financiers</span>
              <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/50">
                Gennevilliers 2025-2026
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Analyse visuelle certifiée des ressources (recettes) et des emplois (dépenses), décomposition par chapitres M57, comparatifs pluriannuels et trajectoire de désendettement CRC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Bascule unité millions / euros */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setUniteAffichage('millions')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uniteAffichage === 'millions'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                En Millions (€)
              </button>
              <button
                onClick={() => setUniteAffichage('euros')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uniteAffichage === 'euros'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                En Euros précis (€)
              </button>
            </div>

            {/* Bouton de copie rapide */}
            <button
              onClick={copierSynthese}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier chiffres'}</span>
            </button>
          </div>
        </div>

        {/* Sélecteur de délibération budgétaire */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Sélectionner l'acte budgétaire officiel à visualiser :</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'bp_2026', label: 'BP 2026 (250,67 M€)', badge: 'Principal Actif' },
              { key: 'bp_2025', label: 'BP 2025 (238,28 M€)', badge: 'Historique N-1' },
              { key: 'principal', label: 'BS 2026 (+16,84 M€)', badge: 'Suppléant' },
              { key: 'restauration', label: 'Annexe Restauration (36 k€)', badge: 'Service' },
              { key: 'cinema', label: 'Annexe Vigo (24 k€)', badge: 'Culture' }
            ].map(b => (
              <button
                key={b.key}
                onClick={() => setSelectedDelibKey(b.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  selectedDelibKey === b.key
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 : LES CAMEMBERTS DES RESSOURCES & DES DÉPENSES            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              <span>Camemberts Interactifs : Ressources (Recettes) vs Dépenses</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Survolez une tranche pour inspecter les détails du chapitre M57 et son poids dans l'équilibre financier
            </p>
          </div>

          {/* Filtre de section pour les camemberts */}
          <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold shadow-xs">
            <button
              onClick={() => setSectionCamembert('fonctionnement')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sectionCamembert === 'fonctionnement'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fonctionnement (Gestion)
            </button>
            <button
              onClick={() => setSectionCamembert('investissement')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sectionCamembert === 'investissement'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Investissement (Équipement)
            </button>
            <button
              onClick={() => setSectionCamembert('consolide')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sectionCamembert === 'consolide'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Total Consolidé
            </button>
          </div>
        </div>

        {/* Double grille de camemberts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ──── CAMEMBERT 1 : RESSOURCES (RECETTES) ──── */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Ressources (Recettes)
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total recettes :</span>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatMontant(slicesRessources.total)}
                  </div>
                </div>
              </div>

              {/* Vue SVG Donut & Centre */}
              <div className="py-6 flex flex-col items-center justify-center relative">
                <svg className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-md overflow-visible" viewBox="0 0 260 260">
                  <g transform="translate(130, 130)">
                    {slicesRessources.items.map((slice) => {
                      const isHovered = hoveredRessource?.id === slice.id;
                      const outerR = isHovered ? 116 : 108;
                      const innerR = 64;
                      const d = describeDonutSlice(0, 0, innerR, outerR, slice.startAngle, slice.endAngle);

                      return (
                        <path
                          key={slice.id}
                          d={d}
                          fill={slice.color.fill}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all duration-200 cursor-pointer hover:opacity-95 dark:stroke-slate-900"
                          style={{
                            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                            transformOrigin: '0 0',
                            filter: isHovered ? 'drop-shadow(0 6px 12px rgba(16, 185, 129, 0.35))' : 'none'
                          }}
                          onMouseEnter={() => setHoveredRessource(slice)}
                          onMouseLeave={() => setHoveredRessource(null)}
                        />
                      );
                    })}

                    {/* Centre du Donut avec informations dynamiques */}
                    <circle r="60" className="fill-white dark:fill-slate-900 transition-colors" />
                    <text
                      textAnchor="middle"
                      dy="-10"
                      className="text-[11px] font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-widest"
                    >
                      {hoveredRessource ? `Chap. ${hoveredRessource.chapitre}` : 'Ressources'}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="14"
                      className="text-base sm:text-lg font-black fill-slate-900 dark:fill-white"
                    >
                      {hoveredRessource ? `${hoveredRessource.pourcentage} %` : formatMontant(slicesRessources.total, 'millions')}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="32"
                      className="text-[10px] font-medium fill-slate-600 dark:fill-slate-300"
                    >
                      {hoveredRessource ? formatMontant(hoveredRessource.montant) : `${slicesRessources.items.length} chapitres`}
                    </text>
                  </g>
                </svg>

                {/* Infobulle contextuelle au survol */}
                <div className="h-10 mt-2 flex items-center justify-center text-center">
                  {hoveredRessource ? (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-2 shadow-xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredRessource.color.fill }} />
                      <span className="font-bold">Chapitre {hoveredRessource.chapitre} :</span>
                      <span>{hoveredRessource.libelle}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">({formatMontant(hoveredRessource.montant)})</span>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400 italic">
                      Passez votre curseur sur une part du camembert pour zoomer
                    </span>
                  )}
                </div>
              </div>

              {/* Légende interactive des chapitres */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {slicesRessources.items.map((slice) => {
                  const isHovered = hoveredRessource?.id === slice.id;
                  return (
                    <div
                      key={slice.id}
                      onMouseEnter={() => setHoveredRessource(slice)}
                      onMouseLeave={() => setHoveredRessource(null)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                        isHovered
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: slice.color.fill }}
                        />
                        <span className="font-bold text-slate-900 dark:text-white shrink-0">
                          Chap. {slice.chapitre}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[170px] sm:max-w-[240px]">
                          {slice.libelle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatMontant(slice.montant)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                          {slice.pourcentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note d'analyse ressources Gennevilliers */}
            <div className="mt-4 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Point clé des ressources : </span>
                La fiscalité directe et indirecte (chapitres 73 & 731) représente le socle prépondérant des recettes avec plus de 123,6 M€, conférant une forte autonomie fiscale territoriale à Gennevilliers.
              </div>
            </div>
          </div>

          {/* ──── CAMEMBERT 2 : DÉPENSES (EMPLOIS) ──── */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Dépenses (Emplois & Charges)
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total dépenses :</span>
                  <div className="text-base font-black text-rose-600 dark:text-rose-400">
                    {formatMontant(slicesDepenses.total)}
                  </div>
                </div>
              </div>

              {/* Vue SVG Donut & Centre */}
              <div className="py-6 flex flex-col items-center justify-center relative">
                <svg className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-md overflow-visible" viewBox="0 0 260 260">
                  <g transform="translate(130, 130)">
                    {slicesDepenses.items.map((slice) => {
                      const isHovered = hoveredDepense?.id === slice.id;
                      const outerR = isHovered ? 116 : 108;
                      const innerR = 64;
                      const d = describeDonutSlice(0, 0, innerR, outerR, slice.startAngle, slice.endAngle);

                      return (
                        <path
                          key={slice.id}
                          d={d}
                          fill={slice.color.fill}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all duration-200 cursor-pointer hover:opacity-95 dark:stroke-slate-900"
                          style={{
                            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                            transformOrigin: '0 0',
                            filter: isHovered ? 'drop-shadow(0 6px 12px rgba(244, 63, 94, 0.35))' : 'none'
                          }}
                          onMouseEnter={() => setHoveredDepense(slice)}
                          onMouseLeave={() => setHoveredDepense(null)}
                        />
                      );
                    })}

                    {/* Centre du Donut avec informations dynamiques */}
                    <circle r="60" className="fill-white dark:fill-slate-900 transition-colors" />
                    <text
                      textAnchor="middle"
                      dy="-10"
                      className="text-[11px] font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-widest"
                    >
                      {hoveredDepense ? `Chap. ${hoveredDepense.chapitre}` : 'Dépenses'}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="14"
                      className="text-base sm:text-lg font-black fill-slate-900 dark:fill-white"
                    >
                      {hoveredDepense ? `${hoveredDepense.pourcentage} %` : formatMontant(slicesDepenses.total, 'millions')}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="32"
                      className="text-[10px] font-medium fill-slate-600 dark:fill-slate-300"
                    >
                      {hoveredDepense ? formatMontant(hoveredDepense.montant) : `${slicesDepenses.items.length} chapitres`}
                    </text>
                  </g>
                </svg>

                {/* Infobulle contextuelle au survol */}
                <div className="h-10 mt-2 flex items-center justify-center text-center">
                  {hoveredDepense ? (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-2 shadow-xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredDepense.color.fill }} />
                      <span className="font-bold">Chapitre {hoveredDepense.chapitre} :</span>
                      <span>{hoveredDepense.libelle}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">({formatMontant(hoveredDepense.montant)})</span>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400 italic">
                      Passez votre curseur sur une part du camembert pour zoomer
                    </span>
                  )}
                </div>
              </div>

              {/* Légende interactive des dépenses */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {slicesDepenses.items.map((slice) => {
                  const isHovered = hoveredDepense?.id === slice.id;
                  return (
                    <div
                      key={slice.id}
                      onMouseEnter={() => setHoveredDepense(slice)}
                      onMouseLeave={() => setHoveredDepense(null)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                        isHovered
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: slice.color.fill }}
                        />
                        <span className="font-bold text-slate-900 dark:text-white shrink-0">
                          Chap. {slice.chapitre}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[170px] sm:max-w-[240px]">
                          {slice.libelle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatMontant(slice.montant)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                          {slice.pourcentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note d'analyse dépenses RH Gennevilliers */}
            <div className="mt-4 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-300 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Masse Salariale (Chapitre 012) : </span>
                Avec 96,06 M€ (62,05% des dépenses réelles de fonctionnement), elle illustre l'effort territorial constant dédié aux services municipaux, aux crèches, aux écoles et à la solidarité locale.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 : COMPARATIF PLURIANNUEL GRAPHIQUE (BP 2025 vs BP 2026)    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-300 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analyse Pluriannuelle Certifiée</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Comparatif Graphique : Budget Primitif 2025 vs 2026</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Évolution des grands postes budgétaires entre le BP 2025 (238,28 M€) et le BP 2026 (250,67 M€, +5,20 %)
            </p>
          </div>

          {/* Filtres de la vue comparative */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setComparatifFiltre('agregats')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                comparatifFiltre === 'agregats'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Grands Agrégats
            </button>
            <button
              onClick={() => setComparatifFiltre('fonctionnement')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                comparatifFiltre === 'fonctionnement'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dépenses Gestion
            </button>
            <button
              onClick={() => setComparatifFiltre('investissement')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                comparatifFiltre === 'investissement'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Investissement & PPI
            </button>
          </div>
        </div>

        {/* 3 Cartes de totaux comparatifs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-800/40 border border-indigo-200 dark:border-indigo-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Total Budget Équilibré
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {formatMontant(comparatifData.totaux.budgetTotal2026)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  BP 2025 : {formatMontant(comparatifData.totaux.budgetTotal2025)}
                </div>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{comparatifData.totaux.deltaBudgetTotalPct}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/40 border border-sky-200 dark:border-sky-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Section Fonctionnement
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {formatMontant(comparatifData.totaux.fonctTotal2026)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  BP 2025 : {formatMontant(comparatifData.totaux.fonctTotal2025)}
                </div>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold">
                {comparatifData.totaux.deltaFonctPct > 0 ? '+' : ''}{comparatifData.totaux.deltaFonctPct}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/40 border border-purple-200 dark:border-purple-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Section Investissement
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {formatMontant(comparatifData.totaux.investTotal2026)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  BP 2025 : {formatMontant(comparatifData.totaux.investTotal2025)}
                </div>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{comparatifData.totaux.deltaInvestPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Barres graphiques comparatives */}
        <div className="space-y-4 pt-2">
          {comparatifFiltre === 'agregats' && (
            <div className="space-y-4">
              {[
                {
                  label: 'Masse Salariale & Personnel (Chap. 012)',
                  val25: 91397205.00,
                  val26: 96063865.00,
                  color: 'from-rose-500 to-rose-600',
                  commentaire: 'Revalorisation du point d’indice, GVT statutaire et maintien de l’emploi de proximité'
                },
                {
                  label: 'Charges Générales & Fluides (Chap. 011)',
                  val25: 41126918.97,
                  val26: 41058892.92,
                  color: 'from-amber-500 to-amber-600',
                  commentaire: 'Maîtrise remarquable des coûts de gestion (-0,17 %) malgré le contexte énergétique'
                },
                {
                  label: 'Subventions & CCAS (Chap. 65)',
                  val25: 14803771.43,
                  val26: 15754288.25,
                  color: 'from-purple-500 to-purple-600',
                  commentaire: 'Soutien renforcé aux associations locales et au Centre Communal d’Action Sociale (+6,42 %)'
                },
                {
                  label: 'Équipements & Chantiers Municipaux (Chap. 21 + 23)',
                  val25: 43451658.00,
                  val26: 53868283.00,
                  color: 'from-blue-500 to-blue-600',
                  commentaire: 'Accélération massive du PPI (+23,98 %) : transition écologique, écoles, rénovation urbaine'
                },
                {
                  label: 'Fiscalité Directe & Impôts Locaux (Chap. 73 + 731)',
                  val25: 124435640.00,
                  val26: 123622709.00,
                  color: 'from-teal-500 to-teal-600',
                  commentaire: 'Stabilité des ressources fiscales avec maintien des taux communaux'
                },
                {
                  label: 'Dotations & Participations de l’État (Chap. 74)',
                  val25: 30380700.00,
                  val26: 27757477.00,
                  color: 'from-sky-500 to-sky-600',
                  commentaire: 'Érosion des dotations nationales (-8,63 %) compensée par l’épargne brute locale'
                }
              ].map((item, idx) => {
                const maxVal = Math.max(item.val25, item.val26) * 1.15;
                const pct25 = (item.val25 / maxVal) * 100;
                const pct26 = (item.val26 / maxVal) * 100;
                const deltaEuros = item.val26 - item.val25;
                const deltaPct = Math.round(((deltaEuros / item.val25) * 100) * 10) / 10;
                const isPositive = deltaPct >= 0;

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isPositive ? '+' : ''}{deltaPct}% ({formatMontant(deltaEuros)})
                        </span>
                      </div>
                    </div>

                    {/* Barres comparatives superposées */}
                    <div className="space-y-1.5 pt-1">
                      {/* Ligne 2025 */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-14 font-mono font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                          BP 2025
                        </span>
                        <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct25}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                          />
                        </div>
                        <span className="w-24 text-right font-mono text-slate-600 dark:text-slate-400 shrink-0 font-medium">
                          {formatMontant(item.val25)}
                        </span>
                      </div>

                      {/* Ligne 2026 */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-14 font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          BP 2026
                        </span>
                        <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct26}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.07 }}
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full shadow-xs`}
                          />
                        </div>
                        <span className="w-24 text-right font-mono font-bold text-slate-900 dark:text-white shrink-0">
                          {formatMontant(item.val26)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-0.5">
                      💡 {item.commentaire}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {comparatifFiltre === 'fonctionnement' && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-1">
                Détail chapitre par chapitre des dépenses de fonctionnement :
              </div>
              {comparatifData.depensesFonctionnement.map((row, i) => {
                const max = Math.max(row.montant2025, row.montant2026) * 1.1 || 1;
                const pct = (row.montant2026 / max) * 100;
                const isPos = (row.deltaPct ?? 0) >= 0;

                return (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
                          Chap. {row.chapitre}
                        </span>
                        <span>{row.libelle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">2025: {formatMontant(row.montant2025)}</div>
                        <div className="font-bold font-mono text-slate-900 dark:text-white">2026: {formatMontant(row.montant2026)}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        isPos
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {row.deltaPct !== null ? `${isPos ? '+' : ''}${row.deltaPct}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {comparatifFiltre === 'investissement' && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-1">
                Détail chapitre par chapitre des dépenses d'investissement :
              </div>
              {comparatifData.depensesInvestissement.map((row, i) => {
                const isPos = (row.deltaPct ?? 0) >= 0;

                return (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[11px]">
                          Chap. {row.chapitre}
                        </span>
                        <span>{row.libelle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">2025: {formatMontant(row.montant2025)}</div>
                        <div className="font-bold font-mono text-slate-900 dark:text-white">2026: {formatMontant(row.montant2026)}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        isPos
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {row.deltaPct !== null ? `${isPos ? '+' : ''}${row.deltaPct}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3 : JAUGES DES RATIOS M57 & SEUILS CRC                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-300 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Grille de Régulation & Chambres Régionales des Comptes</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Jauges Ratios M57 & Zones de Sécurité Financière</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Évaluation dynamique de la solvabilité de Gennevilliers selon les normes officielles de la DGCL et de la CRC
            </p>
          </div>

          {onInjectIntoRatios && (
            <button
              onClick={() => onInjectIntoRatios(selectedDelibKey)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
            >
              <span>Simuler dans le calculateur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grille des 4 indicateurs et jauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* JAUGE 1 : CAPACITÉ DE DÉSENDETTEMENT */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Capacité de Désendettement
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {diagnosticActif.capaciteDesendettementAns !== null
                    ? `${diagnosticActif.capaciteDesendettementAns} ans`
                    : 'N/A'}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
                Situation Saine (&lt; 8 ans)
              </span>
            </div>

            {/* Barre de seuil avec zones de couleurs */}
            <div className="space-y-1.5">
              <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex">
                <div className="w-[53%] bg-emerald-500" title="Zone saine (< 8 ans)" />
                <div className="w-[13%] bg-amber-400" title="Zone de vigilance (8-10 ans)" />
                <div className="w-[14%] bg-orange-500" title="Zone d'alerte (10-12 ans)" />
                <div className="w-[20%] bg-red-600" title="Seuil critique (> 12 ans)" />
              </div>

              {/* Repères chiffrés */}
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>0 an</span>
                <span className="text-emerald-600 font-bold">8 ans (Confort)</span>
                <span className="text-amber-600 font-bold">10 ans</span>
                <span className="text-red-600 font-bold">12 ans (Alerte CRC)</span>
                <span>15+ ans</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              L’encours total de la dette peut être intégralement amorti en moins de 8 années d'autofinancement brut, maintenant la commune très en dessous du seuil critique CRC de 12 ans.
            </p>
          </div>

          {/* JAUGE 2 : TAUX D'ÉPARGNE BRUTE */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Taux d'Épargne Brute (Autofinancement)
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {diagnosticActif.tauxEpargneBrute !== null ? `${diagnosticActif.tauxEpargneBrute} %` : 'N/A'}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                (diagnosticActif.tauxEpargneBrute ?? 0) >= 10
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300/60'
                  : (diagnosticActif.tauxEpargneBrute ?? 0) >= 8
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300/60'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300/60'
              }`}>
                {(diagnosticActif.tauxEpargneBrute ?? 0) >= 8 ? 'Conforme CRC' : 'Sous Vigilance'}
              </span>
            </div>

            {/* Barre de jauge */}
            <div className="space-y-1.5">
              <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((diagnosticActif.tauxEpargneBrute ?? 0) / 20) * 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>0 %</span>
                <span className="text-red-500 font-bold">Alerte CRC &lt; 8%</span>
                <span className="text-amber-500 font-bold">10% Cible</span>
                <span className="text-emerald-500 font-bold">15%+ Excellent</span>
                <span>20 %</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              L’autofinancement brut dégagé ({formatMontant(diagnosticActif.epargneBrute)}) permet de payer le capital de la dette ({formatMontant(diagnosticActif.capitalDette)}) avec une épargne nette positive.
            </p>
          </div>

          {/* JAUGE 3 : POIDS DE LA MASSE SALARIALE */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Part de la Masse Salariale (Chap. 012 / DRF)
                </span>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {diagnosticActif.poidsChargesPersonnelPct !== null ? `${diagnosticActif.poidsChargesPersonnelPct} %` : '62.0 %'}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold border border-indigo-300/60">
                Régie Municipale Forte
              </span>
            </div>

            {/* Barre de jauge */}
            <div className="space-y-1.5">
              <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnosticActif.poidsChargesPersonnelPct || 62}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>0 %</span>
                <span>50% (Moyenne nat.)</span>
                <span className="font-bold text-rose-500">62% (Gennevilliers)</span>
                <span>80 %</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Choix politique de gestion directe des services à la population (restauration scolaire, centres de loisirs, crèches, propreté, police municipale).
            </p>
          </div>

          {/* JAUGE 4 : EFFORT D'INVESTISSEMENT RÉEL */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Équipements Bruts Réels (Chap. 21 + 23)
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  53,87 M€
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold border border-blue-300/60">
                65,3% de la Section
              </span>
            </div>

            {/* Barre de jauge */}
            <div className="space-y-1.5">
              <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65.3%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>0 %</span>
                <span>35% (Moyenne)</span>
                <span className="font-bold text-blue-500">65,3% (PPI Gennevilliers)</span>
                <span>100 %</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Le programme pluriannuel d'investissement (PPI) consacre près des deux tiers de ses crédits aux réalisations matérielles et chantiers scolaires/urbains.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4 : NAVIGATION CROISÉE VERS LES AUTRES MODULES M57          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">
              Approfondir l'analyse financière & juridique M57
            </h4>
            <p className="text-xs text-slate-400">
              Accédez aux textes intégraux des délibérations, au simulateur de prospective financière, ou au dossier des 14 pièces de contrôle CRC.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onNavigateToTab && (
            <>
              <button
                onClick={() => onNavigateToTab('deliberations')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700 cursor-pointer"
              >
                📜 Actes & Délibérations
              </button>
              <button
                onClick={() => onNavigateToTab('ratios')}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
              >
                🧮 Simulateur M57
              </button>
              <button
                onClick={() => onNavigateToTab('pieces')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700 cursor-pointer"
              >
                📑 Pièces CRC
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
