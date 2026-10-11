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
  Printer,
  Sparkles,
  Info,
  Scale,
  DollarSign,
  PieChart,
  ClipboardList,
  Layers,
  FileCheck,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import {
  analyserBudgetM57,
  genererNoteDecision,
  PRESETS_COLLECTIVITES,
  type BudgetM57Input,
  type BudgetM57Result
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
  { id: 'budg_3', domaine: 'Budget & Délibérations', titre: 'Tableau des restes à réaliser (RAR) en dépenses et recettes d’investissement', statut: 'manquant' },
  { id: 'compt_1', domaine: 'Comptes & Clôture', titre: 'Compte Financier Unique (CFU) ou Compte Administratif + Compte de Gestion', statut: 'recu' },
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
  // Onglet actif : 'ratios' | 'pieces' | 'rapport' | 'note'
  const [activeTab, setActiveTab] = useState<'ratios' | 'pieces' | 'rapport' | 'note'>('ratios');

  // Formulaire budget
  const [formData, setFormData] = useState<BudgetM57Input>(PRESETS_COLLECTIVITES.gennevilliers_2025);

  // État interactif des pièces à réunir
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

  // Markdown de la revue d'audit CRC
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

## 1. Périmètre et Données Examinées

- **Recettes Réelles de Fonctionnement (RRF) :** ${resultat.rrf.toLocaleString('fr-FR')} €
- **Dépenses Réelles de Fonctionnement (DRF) :** ${resultat.drf.toLocaleString('fr-FR')} €
- **Épargne Brute :** ${resultat.epargneBrute.toLocaleString('fr-FR')} €
- **Annuité en capital de la dette :** ${resultat.capitalDette.toLocaleString('fr-FR')} €
- **Encours de dette au 31/12 :** ${resultat.encoursDette.toLocaleString('fr-FR')} €
- **Dossier documentaire :** ${piecesValidees}/${piecesCRC.length} pièces réunies et vérifiées.

---

## 2. Synthèse des Constats et Ratios de Contrôle CRC

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
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
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Landmark className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Santé Financière & Ratios M57 de la Collectivité
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Instruction budgétaire M57 (DGCL) • Seuils d'alerte CRC (Chambres Régionales des Comptes) • Kit d'Audit
              </p>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
            <button
              onClick={() => setActiveTab('ratios')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ratios'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Ratios & Diagnostics</span>
            </button>
            <button
              onClick={() => setActiveTab('pieces')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'pieces'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Note d'Arbitrage</span>
            </button>
          </div>
        </div>

        {/* Presets rapides */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Charger les budgets de démonstration M57 :
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => chargerPreset('gennevilliers_2025')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Ville de Gennevilliers
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">BP 2025 • RRF 135,8 M€ • Dette 68,5 M€</div>
            </button>
            <button
              onClick={() => chargerPreset('commune_moyenne_fpt')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Commune Moyenne FPT
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">25 000 hab • RRF 32 M€ • Dette 18,5 M€</div>
            </button>
            <button
              onClick={() => chargerPreset('epci_intercommunalite')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Agglomération / EPCI
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">120 000 hab • RRF 95 M€ • Dette 74 M€</div>
            </button>
          </div>
        </div>

        {/* CONTENU SELON L'ONGLET ACTIF */}

        {/* 1. ONGLET RATIOS & DIAGNOSTIC M57 */}
        {activeTab === 'ratios' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Colonne gauche : Saisie des agrégats M57 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    Agrégats M57 de la collectivité
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="prevision">Budget Primitif (Prévision)</option>
                      <option value="execution">CFU / CA (Exécution)</option>
                    </select>
                  </div>
                </div>

                {/* 4 Agrégats fondamentaux */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Recettes Réelles de Fonctionnement (RRF) en € *
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.recettesReellesFonctionnement}
                      onChange={(e) => setFormData({ ...formData, recettesReellesFonctionnement: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite : Jauges, Ratios et Seuils d'alerte CRC */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Carte Synthèse Globale */}
              <div className={`rounded-2xl p-5 border shadow-sm ${
                resultat.diagnosticGlobal.statut === 'sain'
                  ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/30 dark:via-teal-950/15 dark:to-slate-900 border-emerald-500/30'
                  : resultat.diagnosticGlobal.statut === 'favorable'
                  ? 'bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-white dark:from-teal-950/30 dark:via-cyan-950/15 dark:to-slate-900 border-teal-500/30'
                  : resultat.diagnosticGlobal.statut === 'sous_surveillance'
                  ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:from-amber-950/30 dark:via-orange-950/15 dark:to-slate-900 border-amber-500/30'
                  : 'bg-gradient-to-br from-red-500/10 via-rose-500/5 to-white dark:from-red-950/30 dark:via-rose-950/15 dark:to-slate-900 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-500" />
                    Diagnostic Global de Solvabilité
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                    resultat.diagnosticGlobal.statut === 'sain'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : resultat.diagnosticGlobal.statut === 'favorable'
                      ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30'
                      : resultat.diagnosticGlobal.statut === 'sous_surveillance'
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30'
                  }`}>
                    {resultat.diagnosticGlobal.titre}
                  </span>
                </div>

                <div className="py-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {resultat.diagnosticGlobal.description}
                  </p>
                  {resultat.diagnosticGlobal.pointsVigilance.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        Points de vigilance relevés :
                      </div>
                      {resultat.diagnosticGlobal.pointsVigilance.map((pv, i) => (
                        <div key={i} className="text-xs text-slate-600 dark:text-slate-300 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-amber-500">
                          {pv}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Les 4 Indicateurs Clés M57 en cartes */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. Épargne Brute */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Épargne Brute (Autofinancement)
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {resultat.epargneBrute.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-[11px] text-slate-400">
                    RRF - DRF ({resultat.tauxEpargneBrute ?? 0}% des recettes)
                  </div>
                </div>

                {/* 2. Épargne Nette */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Épargne Nette
                  </span>
                  <div className={`text-xl sm:text-2xl font-black ${
                    resultat.epargneNette >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {resultat.epargneNette.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Après remboursement capital dette ({resultat.capitalDette.toLocaleString('fr-FR')} €)
                  </div>
                </div>

                {/* 3. Taux d'Épargne Brute */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Taux d'Épargne Brute
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${resultat.diagnosticEpargne.badgeColor}`}>
                      {resultat.diagnosticEpargne.niveau.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {resultat.tauxEpargneBrute !== null ? `${resultat.tauxEpargneBrute} %` : 'N/A'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Standard DGCL : &gt; 10% (optimal &gt; 15%)
                  </div>
                </div>

                {/* 4. Capacité de Désendettement */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Désendettement (CRC)
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${resultat.diagnosticDesendettement.badgeColor}`}>
                      {resultat.diagnosticDesendettement.niveau.toUpperCase()}
                    </span>
                  </div>
                  <div className={`text-xl sm:text-2xl font-black ${
                    resultat.capaciteDesendettementAns === null
                      ? 'text-red-600'
                      : resultat.capaciteDesendettementAns > 10
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {resultat.capaciteDesendettementAns !== null ? `${resultat.capaciteDesendettementAns} ans` : 'Critique'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Seuil alerte CRC : 10 à 12 années
                  </div>
                </div>

              </div>

              {/* Jauge des Seuils d'Alerte CRC */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Barème des Chambres Régionales des Comptes (Capacité de désendettement)
                  </h3>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Dette / Épargne brute
                  </span>
                </div>

                {/* Barre de progression des 4 zones CRC */}
                <div className="space-y-1.5">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex text-[10px] font-bold text-white text-center leading-4">
                    <div style={{ width: '40%' }} className="bg-emerald-500" title="Zone saine (< 8 ans)">
                      &lt; 8 ans (Sain)
                    </div>
                    <div style={{ width: '20%' }} className="bg-amber-500" title="Zone de vigilance (8 à 10 ans)">
                      8-10 ans
                    </div>
                    <div style={{ width: '20%' }} className="bg-orange-500" title="Zone d'alerte CRC (10 à 12 ans)">
                      10-12 ans (Alerte)
                    </div>
                    <div style={{ width: '20%' }} className="bg-red-600" title="Zone critique (> 12 ans)">
                      &gt; 12 ans
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>0 an</span>
                    <span>8 ans (Vigilance)</span>
                    <span className="font-bold text-orange-600">10 ans (Seuil CRC)</span>
                    <span>12 ans (Réseau d'alerte)</span>
                    <span>15+ ans</span>
                  </div>
                </div>

                {/* Poids du chapitre 012 */}
                {resultat.poidsChargesPersonnelPct !== null && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Poids de la masse salariale (Chapitre 012 / DRF) :
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {resultat.poidsChargesPersonnelPct} %
                      <span className="text-[11px] font-normal text-slate-400 ml-1">
                        (Moyenne nationale : ~ 55% à 65%)
                      </span>
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2. ONGLET PIÈCES CRC À RÉUNIR */}
        {activeTab === 'pieces' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-500" />
                  Checklist Interactive : Pièces Utiles au Contrôle CRC / Revue M57
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Conforme au standard d'audit des finances publiques locales • Sélectionner le statut de chaque document
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = piecesCRC.map(p => `[${p.statut.toUpperCase()}] ${p.domaine} : ${p.titre}`).join('\n');
                    navigator.clipboard.writeText(text);
                    toast.success('Liste des pièces copiée !');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier la liste</span>
                </button>
              </div>
            </div>

            {/* Liste des pièces groupées */}
            <div className="space-y-3">
              {piecesCRC.map((piece) => (
                <div
                  key={piece.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {piece.domaine}
                    </span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">
                      {piece.titre}
                    </div>
                  </div>

                  {/* Boutons d'état : Reçu / Manquant / Non applicable */}
                  <div className="inline-flex rounded-lg p-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'recu')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'recu'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      ✓ Reçu
                    </button>
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'manquant')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'manquant'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      ⚠ Manquant
                    </button>
                    <button
                      onClick={() => toggleStatutPiece(piece.id, 'non_applicable')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        piece.statut === 'non_applicable'
                          ? 'bg-slate-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
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

        {/* 3. ONGLET RAPPORT D'AUDIT */}
        {activeTab === 'rapport' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
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
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
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

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-slate-200 dark:border-slate-800 leading-relaxed">
              {rapportAuditMarkdown}
            </div>
          </div>
        )}

        {/* 4. ONGLET NOTE D'ARBITRAGE */}
        {activeTab === 'note' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
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
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-slate-200 dark:border-slate-800 leading-relaxed">
              {noteMarkdown}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CalculateurBudgetM57;
