import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Building2,
  Landmark,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Download,
  Copy,
  Sparkles,
  Info,
  Scale,
  PieChart,
  ClipboardList,
  FileCheck,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  Stamp,
  Award,
  Hash,
  ArrowRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import {
  analyserBudgetM57,
  genererNoteDecision,
  PRESETS_COLLECTIVITES,
  DELIBERATIONS_GENNEVILLIERS_2026,
  type BudgetM57Input,
  type BudgetM57Result,
  type DeliberationBudgetInfo,
  type ChapitreMouvement
} from '../services/budgetM57Engine';

interface CalculateurBudgetM57Props {
  onClose?: () => void;
}

interface PieceCheckItem {
  id: string;
  domaine: string;
  titre: string;
  statut: 'recu' | 'manquant' | 'non_applicable';
  remarque?: string;
}

const PIECES_CRC_INITIAL: PieceCheckItem[] = [
  { id: 'perim_1', domaine: 'Périmètre & Statut', titre: 'Statut juridique, compétences, délégations et liste des budgets annexes M57', statut: 'recu' },
  { id: 'perim_2', domaine: 'Périmètre & Statut', titre: 'Organigramme général et tableau des délégations de signature du Maire/Président', statut: 'recu' },
  { id: 'budg_1', domaine: 'Budget & Délibérations', titre: 'Budget Primitif (BP) et décisions modificatives (DM) votées par l’assemblée', statut: 'recu' },
  { id: 'budg_2', domaine: 'Budget & Délibérations', titre: 'Rapport d’Orientation Budgétaire (ROB) et débat d’orientation budgétaire (DOB)', statut: 'recu' },
  { id: 'budg_3', domaine: 'Budget & Délibérations', titre: 'Tableau des restes à réaliser (RAR) en dépenses et recettes d’investissement', statut: 'recu' },
  { id: 'compt_1', domaine: 'Comptes & Clôture', titre: 'Compte Financier Unique (CFU 2025) et délibérations d’affectation du résultat', statut: 'recu' },
  { id: 'compt_2', domaine: 'Comptes & Clôture', titre: 'Balance générale des comptes au 31/12 et états de rapprochement trésorerie', statut: 'recu' },
  { id: 'dette_1', domaine: 'Patrimoine & Dette', titre: 'Tableau complet de l’encours de la dette (taux fixes, taux variables, prêts structurés)', statut: 'recu' },
  { id: 'dette_2', domaine: 'Patrimoine & Dette', titre: 'État de l’actif, inventaire physique/comptable et amortissements M57', statut: 'manquant' },
  { id: 'dette_3', domaine: 'Patrimoine & Dette', titre: 'Engagements hors bilan, garanties d’emprunt accordées aux bailleurs sociaux', statut: 'recu' },
  { id: 'ctrl_1', domaine: 'Contrôle Interne & Régies', titre: 'Cartographie des risques financiers et manuels de procédures internes', statut: 'manquant' },
  { id: 'ctrl_2', domaine: 'Contrôle Interne & Régies', titre: 'Actes de création des régies de recettes/avances et contrôles sur place effectués', statut: 'recu' },
  { id: 'achats_1', domaine: 'Commande Publique', titre: 'Registre des marchés publics notifiés et dossiers de consultation échantillonnés', statut: 'recu' },
  { id: 'achats_2', domaine: 'Commande Publique', titre: 'Certificats de service fait et circuits de visa dématérialisés (PES v2)', statut: 'recu' },
  { id: 'rh_1', domaine: 'RH & Masse Salariale', titre: 'Rapport Social Unique (RSU), tableau des emplois et lignes directrices de gestion (LDG)', statut: 'recu' },
  { id: 'rh_2', domaine: 'RH & Masse Salariale', titre: 'Délibération cadre RIFSEEP (IFSE + CIA) et critères d’attribution', statut: 'recu' },
  { id: 'rh_3', domaine: 'RH & Masse Salariale', titre: 'Suivi des heures supplémentaires, temps de travail (1 607 heures) et absences', statut: 'manquant' },
];

export const CalculateurBudgetM57: React.FC<CalculateurBudgetM57Props> = ({ onClose }) => {
  // Onglet actif : 'deliberations' | 'ratios' | 'pieces' | 'rapport' | 'note'
  const [activeTab, setActiveTab] = useState<'deliberations' | 'ratios' | 'pieces' | 'rapport' | 'note'>('deliberations');

  // Budget de délibération sélectionné (BP 2026, BP 2025, BS 2026 Principal, Restauration, Cinéma)
  const [selectedDelibKey, setSelectedDelibKey] = useState<'bp_2026' | 'bp_2025' | 'principal' | 'restauration' | 'cinema'>('bp_2026');
  const deliberationActive: DeliberationBudgetInfo = DELIBERATIONS_GENNEVILLIERS_2026[selectedDelibKey];

  // Formulaire budget M57
  const [formData, setFormData] = useState<BudgetM57Input>(PRESETS_COLLECTIVITES.gennevilliers_bp_2026);

  // État interactif des pièces CRC
  const [piecesCRC, setPiecesCRC] = useState<PieceCheckItem[]>(PIECES_CRC_INITIAL);

  // Note de décision personnalisée
  const [noteSignataire, setNoteSignataire] = useState<string>('Direction Générale des Services');
  const [noteObjet, setNoteObjet] = useState<string>('Arbitrage budgétaire M57 et prospective financière pluriannuelle');

  // Calcul du diagnostic M57
  const resultat: BudgetM57Result = useMemo(() => {
    return analyserBudgetM57(formData);
  }, [formData]);

  // Remplacement par un preset
  const chargerPreset = (key: string) => {
    if (PRESETS_COLLECTIVITES[key]) {
      setFormData(PRESETS_COLLECTIVITES[key]);
      toast.success(`Profil « ${PRESETS_COLLECTIVITES[key].collectiviteNom} » chargé !`);
    }
  };

  // Injection directe d'une délibération dans le calculateur de ratios
  const injecterDeliberationDansRatios = (key: 'bp_2026' | 'bp_2025' | 'principal' | 'restauration' | 'cinema') => {
    if (key === 'bp_2026') {
      chargerPreset('gennevilliers_bp_2026');
    } else if (key === 'bp_2025') {
      chargerPreset('gennevilliers_bp_2025');
    } else if (key === 'principal') {
      chargerPreset('gennevilliers_principal_delib_2026');
    } else if (key === 'restauration') {
      chargerPreset('gennevilliers_restauration_2026');
    } else {
      chargerPreset('gennevilliers_cinema_2026');
    }
    setActiveTab('ratios');
    toast.success('Données officielles de la délibération injectées dans le simulateur M57 !');
  };

  // Mise à jour du statut d'une pièce
  const toggleStatutPiece = (id: string, newStatut: 'recu' | 'manquant' | 'non_applicable') => {
    setPiecesCRC(prev =>
      prev.map(item => (item.id === id ? { ...item, statut: newStatut } : item))
    );
  };

  // Markdown de la note
  const noteMarkdown = useMemo(() => {
    return genererNoteDecision(resultat, { objet: noteObjet, signataire: noteSignataire });
  }, [resultat, noteObjet, noteSignataire]);

  // Markdown du rapport d'audit CRC
  const rapportAuditMarkdown = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const piecesManquantes = piecesCRC.filter(p => p.statut === 'manquant').map(p => `- ⚠️ **${p.domaine} :** ${p.titre}`).join('\n');
    const piecesValidees = piecesCRC.filter(p => p.statut === 'recu').length;

    return `# Projet de rapport de revue publique locale & audit interne M57

**Collectivité :** ${resultat.collectiviteNom}
**Exercice examiné :** ${resultat.exercice} (${resultat.base === 'prevision' ? 'Budget Primitif' : 'Compte Financier Unique / Exécution'})
**Référentiel comptable :** Instruction M57
**Date du contrôle :** ${dateStr}
**Statut :** Travail préparatoire interne — Ne constitue ni une observation définitive de la CRC ni un déféré préfectoral.

---

## 1. État d'Avancement du Dossier Documentaire

- **Pièces obligatoires réunies :** ${piecesValidees} / ${piecesCRC.length} (${Math.round((piecesValidees / piecesCRC.length) * 100)} %)
- **Pièces manquantes ou à consolider :** ${piecesCRC.filter(p => p.statut === 'manquant').length}
- **Pièces non applicables :** ${piecesCRC.filter(p => p.statut === 'non_applicable').length}

---

## 2. Synthèse des Ratios M57 et Conformité Prudentielle

1. **Taux d'Épargne Brute (${resultat.tauxEpargneBrute ?? 'N/A'} %) :**
   - *Appréciation :* ${resultat.diagnosticEpargne.message}
   - *Préconisation :* ${resultat.diagnosticEpargne.recommandation}

2. **Capacité de Désendettement (${resultat.capaciteDesendettementAns ?? 'N/A'} ans) :**
   - *Appréciation :* ${resultat.diagnosticDesendettement.message}
   - *Préconisation :* ${resultat.diagnosticDesendettement.recommandation}

3. **Équilibre de l'Épargne Nette (${resultat.epargneNette.toLocaleString('fr-FR')} €) :**
   - ${resultat.epargneNette >= 0
     ? 'L’autofinancement net est positif et permet d’abonder la section d’investissement sans nouvel emprunt d’équilibre.'
     : 'L’autofinancement net est négatif : alerte sur le remboursement de l’annuité de la dette.'}

---

## 3. Fiches d'Observation et Pièces Restant à Réunir

### Pièces documentaires manquantes au dossier :
${piecesManquantes || '- L’ensemble des pièces obligatoires de la nomenclature a été transmis.'}

### Points d'audit prioritaires :
${resultat.diagnosticGlobal.pointsVigilance.map((pv, idx) => `**Observation n°${idx + 1} :** ${pv}`).join('\n\n')}

---

## 4. Plan d'Action Recommandé

| Domaine | Action corrective proposée | Responsable | Échéance |
|---|---|---|---|
| **Dette** | Maintien de la capacité de désendettement sous 10 ans | Direction des Finances | Trimestriel |
| **Masse salariale** | Suivi de l'impact du GVT et du RIFSEEP sur l'épargne brute | Direction des RH | Mensuel |
| **Actif** | Finalisation de l'inventaire physique des immobilisations M57 | Trésorerie / Finances | Fin exercice |
`;
  }, [resultat, piecesCRC]);

  const telechargerFichier = (contenu: string, nomFichier: string) => {
    const blob = new Blob([contenu], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomFichier;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Fichier ${nomFichier} téléchargé !`);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-3 sm:p-6 lg:p-8">
      {/* FOND COMPLÈTEMENT OPAQUE : bloque à 100% tout arrière-plan, papier peint ou formes géométriques */}
      <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête principal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Retour</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Landmark className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Finances Locales & Ratios M57 — Ville de Gennevilliers
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Instruction budgétaire M57 (DGCL) • Analyse certifiée des Délibérations du 23 Septembre 2026 (CFU 2025 & BS 2026)
              </p>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="inline-flex flex-wrap rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm text-xs font-bold">
            <button
              onClick={() => setActiveTab('deliberations')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'deliberations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Stamp className="w-3.5 h-3.5 text-amber-300" />
              <span>Délibérations & CFU (PDFs 2026)</span>
            </button>
            <button
              onClick={() => setActiveTab('ratios')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ratios'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Ratios & Diagnostics M57</span>
            </button>
            <button
              onClick={() => setActiveTab('pieces')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'pieces'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Pièces CRC ({piecesCRC.filter(p => p.statut === 'recu').length}/{piecesCRC.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rapport')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'rapport'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Rapport d'Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'note'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Note d'Arbitrage</span>
            </button>
          </div>
        </div>

        {/* Barre de profils officiels M57 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-300 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Données budgétaires officielles certifiées :
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => chargerPreset('gennevilliers_bp_2026')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                BP 2026 Primitif
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">250,67 M€ • Délib. 2026/S1/001</div>
            </button>
            <button
              onClick={() => chargerPreset('gennevilliers_bp_2025')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                BP 2025 Primitif
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">238,28 M€ • Délib. 12/02/2025</div>
            </button>
            <button
              onClick={() => chargerPreset('gennevilliers_principal_delib_2026')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                BS 2026 Principal
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">27,29 M€ • Délib. 2026/S6/004</div>
            </button>
            <button
              onClick={() => chargerPreset('gennevilliers_cfu_2025')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                CFU 2025 Exécution
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Excédent +17,39 M€ • Compte 1068</div>
            </button>
            <button
              onClick={() => chargerPreset('gennevilliers_restauration_2026')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Annexe Restauration
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">36,19 k€ • Unanimité</div>
            </button>
            <button
              onClick={() => chargerPreset('gennevilliers_cinema_2026')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Annexe Cinéma Vigo
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">24,58 k€ • Unanimité</div>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 1. ONGLET DÉLIBÉRATIONS & CFU 2026 (DONNÉES DES 6 ACTES PDF)        */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'deliberations' && (
          <div className="space-y-6">
            
            {/* Sélecteur de Délibération */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-amber-500" />
                    Actes Officiels du Conseil Municipal de Gennevilliers
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Séances du 12 février 2025, 4 février 2026 et 23 septembre 2026 • Télétransmissions Préfecture certifiées
                  </p>
                </div>

                {/* Sélecteur parmi les délibérations */}
                <div className="inline-flex flex-wrap rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold gap-1">
                  <button
                    onClick={() => setSelectedDelibKey('bp_2026')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedDelibKey === 'bp_2026'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    BP 2026 (250,67 M€)
                  </button>
                  <button
                    onClick={() => setSelectedDelibKey('bp_2025')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedDelibKey === 'bp_2025'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    BP 2025 (238,28 M€)
                  </button>
                  <button
                    onClick={() => setSelectedDelibKey('principal')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedDelibKey === 'principal'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    BS 2026 & CFU 2025
                  </button>
                  <button
                    onClick={() => setSelectedDelibKey('restauration')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedDelibKey === 'restauration'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Annexe Restauration
                  </button>
                  <button
                    onClick={() => setSelectedDelibKey('cinema')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedDelibKey === 'cinema'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Annexe Cinéma Vigo
                  </button>
                </div>
              </div>

              {/* Fiche d'identification juridique certifiée */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Acte & Référence</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{deliberationActive.numeroDelib}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{deliberationActive.titre}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Adoption & Signatures</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    Présidence : {deliberationActive.maire} (Maire)
                    {deliberationActive.secretaireSeance ? ` • Secrétaire : ${deliberationActive.secretaireSeance}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Vote : {deliberationActive.typeVote === 'unanimite' ? 'Adopté à l’unanimité' : 'Adopté à la majorité'} ({deliberationActive.votesPour} pour, {deliberationActive.votesContre} contre{deliberationActive.votesAbstention ? `, ${deliberationActive.votesAbstention} abst.` : ''})
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Télétransmission Préfecture</div>
                  <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                    AR : {deliberationActive.arPrefecture}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate" title={deliberationActive.chaineIntegrite}>
                    Empreinte : {deliberationActive.chaineIntegrite}
                  </div>
                </div>
              </div>

              {/* Bouton d'action directe : injecter dans le simulateur */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Visas CGCT L. 2121-12, L. 1612-11, L. 2311-5 & Instruction M57. Acte rendu exécutoire.
                </div>
                <button
                  onClick={() => injecterDeliberationDansRatios(selectedDelibKey)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Calculer les Ratios M57 de ce Budget</span>
                </button>
              </div>
            </div>

            {/* DASHBOARD COMPARATIF BP 2025 vs BP 2026 (Quand on consulte les budgets primitifs) */}
            {(selectedDelibKey === 'bp_2026' || selectedDelibKey === 'bp_2025') && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    Comparatif Pluriannuel Officiel : Budget Primitif 2025 ➔ Budget Primitif 2026
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Croissance budgétaire globale : +5,20 % (+12,39 M€)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Budget Global Voté</span>
                    <div className="text-base font-black text-slate-900 dark:text-white mt-1">250 668 105 €</div>
                    <div className="text-[11px] text-slate-500">BP 2025 : 238 277 172 €</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">+12,39 M€ (+5,20 %)</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Masse Salariale (Chap. 012)</span>
                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">96 063 865 €</div>
                    <div className="text-[11px] text-slate-500">BP 2025 : 91 397 205 €</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">+4,67 M€ (+5,11 %, GVT & carrières)</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Section d'Investissement</span>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">82 517 370 €</div>
                    <div className="text-[11px] text-slate-500">BP 2025 : 66 980 005 €</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">+15,54 M€ (+23,20 %, équipements)</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Équipements & Travaux (21+23)</span>
                    <div className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">53 868 283 €</div>
                    <div className="text-[11px] text-slate-500">BP 2025 : 43 451 658 €</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">+10,42 M€ (+23,98 %, chantiers publics)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cadre Clôture CFU 2025 & Affectation (Si applicable) */}
            {deliberationActive.cfu2025 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-500" />
                    Clôture du Compte Financier Unique (CFU) 2025 & Affectation Réglementaire du Résultat
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Instruction M57
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Résultat Fct. Cumulé</span>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {deliberationActive.cfu2025.fonctionnementResultatCumule >= 0 ? '+' : ''}
                      {deliberationActive.cfu2025.fonctionnementResultatCumule.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Excédent de gestion constaté au CFU</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Solde Exécution Invest.</span>
                    <div className={`text-lg font-black mt-1 ${
                      deliberationActive.cfu2025.investissementResultatCumule >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {deliberationActive.cfu2025.investissementResultatCumule.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {deliberationActive.cfu2025.investissementResultatCumule < 0 ? 'Déficit d’exécution à couvrir' : 'Excédent reporté'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Restes à Réaliser (RAR)</span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      Dépenses : {deliberationActive.cfu2025.restesARealiserDepenses.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Recettes : {deliberationActive.cfu2025.restesARealiserRecettes.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      Besoin net RAR : {(deliberationActive.cfu2025.restesARealiserDepenses - deliberationActive.cfu2025.restesARealiserRecettes).toLocaleString('fr-FR')} €
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Besoin Net Total Invest.</span>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {deliberationActive.cfu2025.besoinNetFinancement.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Déficit + solde net des restes à réaliser</div>
                  </div>
                </div>

                {/* Affectation votée */}
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                    Affectation Réglementaire du Résultat Délibérée par le Conseil Municipal :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Compte 1068 (Réserves capitalisées) :</span>
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {deliberationActive.cfu2025.affectationCompte1068.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                      <span className="text-[10px] text-slate-400">Priorité M57 pour couvrir le besoin d'investissement</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Ligne R002 (Report fonctionnement) :</span>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {deliberationActive.cfu2025.affectationLigneR002.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                      <span className="text-[10px] text-slate-400">Marge de manœuvre conservée en gestion courante</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {deliberationActive.cfu2025.affectationLigneD001 !== undefined ? 'Ligne D001 (Déficit reporté) :' : 'Ligne R001 (Excédent reporté) :'}
                      </span>
                      <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                        {(deliberationActive.cfu2025.affectationLigneD001 ?? deliberationActive.cfu2025.affectationLigneR001 ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                      <span className="text-[10px] text-slate-400">Reprise comptable en section d'investissement</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tableaux Annexes par Chapitre */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    Tableaux Officiels par Chapitre ({deliberationActive.titre})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Équilibre budgétaire général voté : <strong className="text-slate-800 dark:text-slate-200">{deliberationActive.montantTotalEquilibre.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    Fonct. : {deliberationActive.sectionFonctionnementTotal.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    Invest. : {deliberationActive.sectionInvestissementTotal.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              {/* SECTION FONCTIONNEMENT */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Section de Fonctionnement ({deliberationActive.sectionFonctionnementTotal.toLocaleString('fr-FR')} €)
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Dépenses Fonctionnement */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between">
                      <span>Dépenses de Fonctionnement</span>
                      <span>Montant Voté</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {deliberationActive.depensesFonctionnement.map((c, i) => (
                        <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div>
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mr-2">Chap. {c.chapitre}</span>
                            <span className="text-slate-700 dark:text-slate-300">{c.libelle}</span>
                            <span className="ml-2 text-[10px] text-slate-400 uppercase font-bold">({c.nature})</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                            {c.montantBS2026.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      ))}
                      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs flex justify-between">
                        <span>Total Dépenses Fonctionnement</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {deliberationActive.sectionFonctionnementTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recettes Fonctionnement */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between">
                      <span>Recettes de Fonctionnement</span>
                      <span>Montant Voté</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {deliberationActive.recettesFonctionnement.map((c, i) => (
                        <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mr-2">Chap. {c.chapitre}</span>
                            <span className="text-slate-700 dark:text-slate-300">{c.libelle}</span>
                          </div>
                          <span className={`font-mono font-bold shrink-0 ${c.montantBS2026 < 0 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                            {c.montantBS2026.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      ))}
                      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs flex justify-between">
                        <span>Total Recettes Fonctionnement</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {deliberationActive.sectionFonctionnementTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION INVESTISSEMENT */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Section d'Investissement ({deliberationActive.sectionInvestissementTotal.toLocaleString('fr-FR')} €)
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Dépenses Investissement */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between">
                      <span>Dépenses d'Investissement</span>
                      <span>Montant Voté</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {deliberationActive.depensesInvestissement.map((c, i) => (
                        <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div>
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mr-2">Chap. {c.chapitre}</span>
                            <span className="text-slate-700 dark:text-slate-300">{c.libelle}</span>
                            {c.reports2025 && c.reports2025 > 0 ? (
                              <div className="text-[10px] text-slate-400">dont RAR : {c.reports2025.toLocaleString('fr-FR')} €</div>
                            ) : null}
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                            {(c.totalBS ?? c.montantBS2026).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      ))}
                      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs flex justify-between">
                        <span>Total Dépenses Investissement</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {deliberationActive.sectionInvestissementTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recettes Investissement */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between">
                      <span>Recettes d'Investissement</span>
                      <span>Montant Voté</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {deliberationActive.recettesInvestissement.map((c, i) => (
                        <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mr-2">Chap. {c.chapitre}</span>
                            <span className="text-slate-700 dark:text-slate-300">{c.libelle}</span>
                            {c.reports2025 && c.reports2025 > 0 ? (
                              <div className="text-[10px] text-slate-400">dont RAR : {c.reports2025.toLocaleString('fr-FR')} €</div>
                            ) : null}
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                            {(c.totalBS ?? c.montantBS2026).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      ))}
                      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs flex justify-between">
                        <span>Total Recettes Investissement</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {deliberationActive.sectionInvestissementTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyse Juridique & Points Clés */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Points Clés & Analyse Juridico-Financière M57 :
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {deliberationActive.pointsClesJuridiques.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 2. ONGLET RATIOS & DIAGNOSTIC M57 (CALCULATEUR INTERACTIF)         */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'ratios' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Colonne gauche : Saisie des agrégats M57 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    Agrégats M57 de la collectivité
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Exercice {formData.exercice}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom de la collectivité ou établissement
                  </label>
                  <input
                    type="text"
                    value={formData.collectiviteNom}
                    onChange={(e) => setFormData({ ...formData, collectiviteNom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Type de structure
                    </label>
                    <select
                      value={formData.typeCollectivite}
                      onChange={(e) => setFormData({ ...formData, typeCollectivite: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="commune">Commune</option>
                      <option value="epci">EPCI / Interco</option>
                      <option value="departement">Département</option>
                      <option value="region">Région</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Base budgétaire
                    </label>
                    <select
                      value={formData.base}
                      onChange={(e) => setFormData({ ...formData, base: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="prevision">Budget Primitif (Prévision)</option>
                      <option value="execution">CFU / CA (Exécution)</option>
                    </select>
                  </div>
                </div>

                {/* 4 Agrégats fondamentaux */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Recettes Réelles de Fonctionnement (RRF) en € *
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.recettesReellesFonctionnement}
                      onChange={(e) => setFormData({ ...formData, recettesReellesFonctionnement: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Chapitres 70, 73 (impôts locaux), 74 (dotations)...</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dépenses Réelles de Fonctionnement (DRF) en € *
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.depensesReellesFonctionnement}
                      onChange={(e) => setFormData({ ...formData, depensesReellesFonctionnement: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Chapitres 011 (charges générales), 012 (personnel)...</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Remboursement du Capital de la Dette (annuité) en € *
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.remboursementCapitalDette}
                      onChange={(e) => setFormData({ ...formData, remboursementCapitalDette: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Chapitre 16 (remboursement en capital des emprunts)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Encours Total de la Dette au 31/12 en € *
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.encoursDetteFinExercice}
                      onChange={(e) => setFormData({ ...formData, encoursDetteFinExercice: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">Total du stock de dette bancaire et obligataire</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      dont Chapitre 012 (Charges de personnel & primes) en €
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.depensesPersonnel012 || 0}
                      onChange={(e) => setFormData({ ...formData, depensesPersonnel012: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite : Jauges, Ratios et Seuils d'alerte CRC */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Carte Synthèse Globale (Couleurs opaques et nettes) */}
              <div className={`rounded-2xl p-5 border shadow-sm ${
                resultat.diagnosticGlobal.statut === 'sain'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700'
                  : resultat.diagnosticGlobal.statut === 'favorable'
                  ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-300 dark:border-teal-700'
                  : resultat.diagnosticGlobal.statut === 'sous_surveillance'
                  ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700'
                  : 'bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-700'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-300/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border ${
                      resultat.diagnosticGlobal.statut === 'sain'
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-400'
                        : resultat.diagnosticGlobal.statut === 'favorable'
                        ? 'bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-400'
                        : resultat.diagnosticGlobal.statut === 'sous_surveillance'
                        ? 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-400'
                        : 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-400'
                    }`}>
                      {resultat.diagnosticGlobal.statut === 'sain' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {resultat.diagnosticGlobal.titre}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {resultat.diagnosticGlobal.description}
                      </p>
                    </div>
                  </div>
                </div>

                {resultat.diagnosticGlobal.pointsVigilance.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Observations & points d'audit identifiés :
                    </div>
                    {resultat.diagnosticGlobal.pointsVigilance.map((pv, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{pv}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4 Indicateurs Clés M57 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. Épargne Brute */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-300 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Épargne Brute (CAF)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">RRF - DRF</span>
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {resultat.epargneBrute.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs text-slate-500">
                    Taux d'Épargne Brute : <strong className="text-slate-900 dark:text-white">{resultat.tauxEpargneBrute ?? 'N/A'} %</strong>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {resultat.diagnosticEpargne.message}
                  </div>
                </div>

                {/* 2. Capacité de Désendettement */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-300 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Capacité Désendettement</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">Dette / CAF</span>
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {resultat.capaciteDesendettementAns !== null ? `${resultat.capaciteDesendettementAns} ans` : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Seuil prudentiel CRC : <strong className="text-slate-900 dark:text-white">10 à 12 ans max</strong>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {resultat.diagnosticDesendettement.message}
                  </div>
                </div>

                {/* 3. Épargne Nette */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-300 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Épargne Nette</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">CAF - Capital</span>
                  </div>
                  <div className={`text-xl font-black ${resultat.epargneNette >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {resultat.epargneNette.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs text-slate-500">
                    Capital remboursé : {resultat.capitalDette.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {resultat.epargneNette >= 0 ? 'Remboursement de la dette sécurisé' : 'Déficit d’autofinancement'}
                  </div>
                </div>

                {/* 4. Rigidité Masse Salariale */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-300 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Poids Personnel (Chap. 012)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">012 / DRF</span>
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {resultat.poidsChargesPersonnelPct !== null ? `${resultat.poidsChargesPersonnelPct} %` : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Montant 012 : {formData.depensesPersonnel012 ? formData.depensesPersonnel012.toLocaleString('fr-FR') + ' €' : 'Non précisé'}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Standard communal : 55% à 65% des DRF
                  </div>
                </div>

              </div>

              {/* Jauge visuelle de la Capacité de Désendettement */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                    Positionnement sur la jauge de désendettement CRC
                  </span>
                  <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {resultat.capaciteDesendettementAns !== null ? `${resultat.capaciteDesendettementAns} ans` : 'N/A'}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex text-[10px] font-bold text-white text-center leading-4">
                    <div style={{ width: '40%' }} className="bg-emerald-500" title="Zone saine (< 8 ans)">
                      &lt; 8 ans
                    </div>
                    <div style={{ width: '20%' }} className="bg-amber-500" title="Zone de vigilance (8 à 10 ans)">
                      8-10 ans
                    </div>
                    <div style={{ width: '20%' }} className="bg-orange-500" title="Zone d'alerte CRC (10 à 12 ans)">
                      10-12 ans
                    </div>
                    <div style={{ width: '20%' }} className="bg-red-600" title="Zone critique (> 12 ans)">
                      &gt; 12 ans
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>0 an (Désendettée)</span>
                  <span className="font-bold text-amber-600">8 ans (Vigilance)</span>
                  <span className="font-bold text-orange-600">10 ans (Alerte CRC)</span>
                  <span className="font-bold text-red-600">12 ans (Réseau d'alerte)</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 3. ONGLET PIÈCES CRC (CHECKLIST AUDIT)                              */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'pieces' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-300 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-500" />
                  Pièces Justificatives pour Audit Interne & Contrôle CRC
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Nomenclature standard de contrôle des comptes et de gestion des collectivités territoriales
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPiecesCRC(prev => prev.map(p => ({ ...p, statut: 'recu' })));
                    toast.success('Toutes les pièces marquées comme reçues');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tout valider</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {piecesCRC.map((piece) => (
                <div
                  key={piece.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {piece.domaine}
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {piece.titre}
                    </p>
                  </div>

                  <div className="inline-flex rounded-lg p-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'recu')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'recu'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Reçu
                    </button>
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'manquant')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'manquant'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Manquant
                    </button>
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'non_applicable')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'non_applicable'
                          ? 'bg-slate-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 4. ONGLET RAPPORT D'AUDIT                                           */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'rapport' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  Rapport de Revue Publique Locale & Audit M57
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Modèle standardisé de rapport d'observation financière • Prêt à l'exportation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rapportAuditMarkdown);
                    toast.success('Rapport d’audit copié !');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier Markdown</span>
                </button>
                <button
                  onClick={() => telechargerFichier(rapportAuditMarkdown, `rapport-audit-m57-${resultat.collectiviteNom.toLowerCase().replace(/\s+/g, '-')}.md`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger .md</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-slate-300 dark:border-slate-800 leading-relaxed">
              {rapportAuditMarkdown}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* 5. ONGLET NOTE D'ARBITRAGE                                          */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'note' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Projet de Note d'Arbitrage à l'Autorité Territoriale
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Note d'aide à la décision pour le Maire, Président ou DGS avec chiffrages M57
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(noteMarkdown);
                    toast.success('Note de décision copiée !');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier Markdown</span>
                </button>
                <button
                  onClick={() => telechargerFichier(noteMarkdown, `note-arbitrage-${resultat.collectiviteNom.toLowerCase().replace(/\s+/g, '-')}.md`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger .md</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Émetteur / Service
                </label>
                <input
                  type="text"
                  value={noteSignataire}
                  onChange={(e) => setNoteSignataire(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Objet de la note
                </label>
                <input
                  type="text"
                  value={noteObjet}
                  onChange={(e) => setNoteObjet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-slate-300 dark:border-slate-800 leading-relaxed">
              {noteMarkdown}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CalculateurBudgetM57;
