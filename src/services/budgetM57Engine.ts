/**
 * Moteur d'Analyse Financière M57 & Ratios de Gestion Territoriale
 * Conforme à l'instruction budgétaire et comptable M57 (DGCL)
 * et aux seuils de contrôle des Chambres Régionales des Comptes (CRC)
 *
 * Formules officielles :
 * - Épargne Brute (Autofinancement brut) = RRF - DRF
 * - Épargne Nette = Épargne Brute - Remboursement Capital Dette
 * - Taux d'Épargne Brute (%) = (Épargne Brute / RRF) * 100
 * - Capacité de Désendettement (années) = Encours Dette / Épargne Brute
 */

export interface BudgetM57Input {
  collectiviteNom: string;
  typeCollectivite: 'commune' | 'epci' | 'departement' | 'region';
  population?: number;
  exercice: number; // ex: 2025 ou 2026
  base: 'prevision' | 'execution';
  // 4 agrégats M57 fondamentaux
  recettesReellesFonctionnement: number; // RRF (chapitre 70, 73, 74...)
  depensesReellesFonctionnement: number; // DRF (chapitres 011, 012, 65...)
  remboursementCapitalDette: number; // Chapitre 16 amortissement capital
  encoursDetteFinExercice: number; // Dette au 31/12
  // Agrégats complémentaires utiles (optionnels)
  depensesPersonnel012?: number; // Chapitre 012 charges de personnel
  depensesReellesInvestissement?: number; // DRI (hors dette)
}

export interface RatioStatus {
  niveau: 'excellent' | 'bon' | 'vigilance' | 'alerte' | 'critique';
  badgeColor: string;
  message: string;
  recommandation: string;
}

export interface BudgetM57Result {
  collectiviteNom: string;
  exercice: number;
  base: 'prevision' | 'execution';
  // Données de base
  rrf: number;
  drf: number;
  capitalDette: number;
  encoursDette: number;
  // Indicateurs clés M57
  epargneBrute: number;
  epargneNette: number;
  tauxEpargneBrute: number | null; // %
  capaciteDesendettementAns: number | null; // Années
  poidsChargesPersonnelPct: number | null; // Chapitre 012 / DRF en %
  // Diagnostics & seuils CRC
  diagnosticEpargne: RatioStatus;
  diagnosticDesendettement: RatioStatus;
  diagnosticGlobal: {
    statut: 'sain' | 'favorable' | 'sous_surveillance' | 'risque_tutelle';
    titre: string;
    description: string;
    pointsVigilance: string[];
  };
}

export const PRESETS_COLLECTIVITES: Record<string, BudgetM57Input> = {
  gennevilliers_2025: {
    collectiviteNom: 'Ville de Gennevilliers (Budget Prév. 2025)',
    typeCollectivite: 'commune',
    population: 50200,
    exercice: 2025,
    base: 'prevision',
    recettesReellesFonctionnement: 135800000,
    depensesReellesFonctionnement: 119500000,
    remboursementCapitalDette: 7800000,
    encoursDetteFinExercice: 68500000,
    depensesPersonnel012: 67200000,
  },
  commune_moyenne_fpt: {
    collectiviteNom: 'Commune Moyenne FPT (25 000 hab)',
    typeCollectivite: 'commune',
    population: 25000,
    exercice: 2025,
    base: 'execution',
    recettesReellesFonctionnement: 32000000,
    depensesReellesFonctionnement: 27500000,
    remboursementCapitalDette: 2100000,
    encoursDetteFinExercice: 18500000,
    depensesPersonnel012: 15400000,
  },
  epci_intercommunalite: {
    collectiviteNom: 'Communauté d’Agglomération / Métropole',
    typeCollectivite: 'epci',
    population: 120000,
    exercice: 2025,
    base: 'execution',
    recettesReellesFonctionnement: 95000000,
    depensesReellesFonctionnement: 81000000,
    remboursementCapitalDette: 6500000,
    encoursDetteFinExercice: 74000000,
    depensesPersonnel012: 38000000,
  },
};

/**
 * Diagnostic du Taux d'Épargne Brute selon les normes DGCL / Cour des Comptes
 */
export function evaluerTauxEpargneBrute(taux: number | null): RatioStatus {
  if (taux === null) {
    return {
      niveau: 'critique',
      badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
      message: 'Recettes nulles ou négatives : taux non calculable.',
      recommandation: 'Vérifier la qualification des recettes réelles de fonctionnement.',
    };
  }

  if (taux >= 15) {
    return {
      niveau: 'excellent',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      message: 'Situation très saine (Taux ≥ 15%)',
      recommandation: 'Forte capacité d’autofinancement pour financer les investissements d’avenir et préserver les primes.',
    };
  } else if (taux >= 10) {
    return {
      niveau: 'bon',
      badgeColor: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30',
      message: 'Marge de sécurité confortable (10% à 15%)',
      recommandation: 'Niveau d’épargne satisfaisant, maintien de la trajectoire budgétaire recommandé.',
    };
  } else if (taux >= 7) {
    return {
      niveau: 'vigilance',
      badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
      message: 'Zone de vigilance (7% à 10%)',
      recommandation: 'Autofinancement restreint. Surveiller la dynamique des dépenses de gestion et les charges de personnel.',
    };
  } else {
    return {
      niveau: 'alerte',
      badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
      message: 'Fragilité financière marquée (< 7%)',
      recommandation: 'Risque d’épargne nette négative : la collectivité pourrait devoir emprunter pour payer sa dette.',
    };
  }
}

/**
 * Diagnostic de la Capacité de Désendettement selon les seuils d'alerte CRC
 */
export function evaluerCapaciteDesendettement(annees: number | null): RatioStatus {
  if (annees === null) {
    return {
      niveau: 'critique',
      badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
      message: 'Épargne brute nulle ou négative : insolvabilité technique.',
      recommandation: 'Plan d’urgence requis : rétablissement prioritaire de l’autofinancement brut.',
    };
  }

  if (annees < 6) {
    return {
      niveau: 'excellent',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      message: 'Endettement très faible (< 6 ans)',
      recommandation: 'Excellente solvabilité financière, marge d’emprunt disponible pour les projets prioritaires.',
    };
  } else if (annees <= 8) {
    return {
      niveau: 'bon',
      badgeColor: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30',
      message: 'Niveau d’endettement maîtrisé (6 à 8 ans)',
      recommandation: 'Zone standard de bonne gestion territoriale, conforme aux ratios des collectivités similaires.',
    };
  } else if (annees <= 10) {
    return {
      niveau: 'vigilance',
      badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
      message: 'Vigilance financière (8 à 10 ans)',
      recommandation: 'Approche du seuil de vigilance prudentielle de la DGCL. Éviter d’alourdir le programme d’emprunt.',
    };
  } else if (annees <= 12) {
    return {
      niveau: 'alerte',
      badgeColor: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
      message: 'Seuil d’alerte CRC (10 à 12 ans)',
      recommandation: 'Seuil d’alerte des lois de programmation des finances publiques. Risque de rappel à l’ordre de la Chambre Régionale des Comptes.',
    };
  } else {
    return {
      niveau: 'critique',
      badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
      message: 'Seuil critique d’alerte dépassé (> 12 ans)',
      recommandation: 'Surendettement manifeste : risque d’inscription au Réseau d’Alerte des Finances Locales et de saisine préfectorale.',
    };
  }
}

/**
 * Calcul complet des indicateurs M57
 */
export function analyserBudgetM57(input: BudgetM57Input): BudgetM57Result {
  const rrf = Math.max(0, input.recettesReellesFonctionnement || 0);
  const drf = Math.max(0, input.depensesReellesFonctionnement || 0);
  const capital = Math.max(0, input.remboursementCapitalDette || 0);
  const dette = Math.max(0, input.encoursDetteFinExercice || 0);

  const epargneBrute = rrf - drf;
  const epargneNette = epargneBrute - capital;

  const tauxEpargneBrute = rrf > 0 ? Number(((epargneBrute / rrf) * 100).toFixed(2)) : null;
  const capaciteDesendettementAns = epargneBrute > 0 ? Number((dette / epargneBrute).toFixed(2)) : null;

  const poidsPersonnel = input.depensesPersonnel012 && drf > 0
    ? Number(((input.depensesPersonnel012 / drf) * 100).toFixed(2))
    : null;

  const diagEpargne = evaluerTauxEpargneBrute(tauxEpargneBrute);
  const diagDette = evaluerCapaciteDesendettement(capaciteDesendettementAns);

  // Synthèse globale
  const pointsVigilance: string[] = [];
  if (epargneNette < 0) {
    pointsVigilance.push('Épargne nette négative : l’épargne brute ne couvre pas le remboursement du capital de la dette.');
  }
  if (capaciteDesendettementAns !== null && capaciteDesendettementAns > 10) {
    pointsVigilance.push(`Délai de désendettement de ${capaciteDesendettementAns} ans supérieur au seuil prudentiel CRC de 10 ans.`);
  }
  if (poidsPersonnel !== null && poidsPersonnel > 65) {
    pointsVigilance.push(`Le chapitre 012 représente ${poidsPersonnel}% des dépenses de fonctionnement (rigidité structurelle élevée).`);
  }
  if (tauxEpargneBrute !== null && tauxEpargneBrute < 10) {
    pointsVigilance.push(`Taux d'épargne brute de ${tauxEpargneBrute}% inférieur au standard DGCL de 10%.`);
  }

  let statut: 'sain' | 'favorable' | 'sous_surveillance' | 'risque_tutelle' = 'sain';
  let titre = 'Situation financière saine et équilibrée';
  let description = 'La collectivité dégage une épargne brute suffisante pour couvrir ses annuités de dette et financer ses équipements.';

  if (epargneBrute <= 0 || (capaciteDesendettementAns !== null && capaciteDesendettementAns > 12)) {
    statut = 'risque_tutelle';
    titre = 'Situation budgétaire critique';
    description = 'Capacité d’autofinancement dégradée ou surendettement critique. Vigilance accrue lors des contrôles CRC.';
  } else if (capaciteDesendettementAns !== null && capaciteDesendettementAns >= 10) {
    statut = 'sous_surveillance';
    titre = 'Collectivité sous surveillance prudentielle';
    description = 'Les ratios approchent des seuils d’alerte de la Chambre Régionale des Comptes. Un freinage des dépenses est requis.';
  } else if ((tauxEpargneBrute !== null && tauxEpargneBrute < 12) || (capaciteDesendettementAns !== null && capaciteDesendettementAns > 8)) {
    statut = 'favorable';
    titre = 'Situation favorable avec points de vigilance';
    description = 'Équilibre financier maintenu mais marges de manœuvre réduites face à l’inflation et aux charges obligatoires.';
  }

  return {
    collectiviteNom: input.collectiviteNom,
    exercice: input.exercice,
    base: input.base,
    rrf,
    drf,
    capitalDette: capital,
    encoursDette: dette,
    epargneBrute,
    epargneNette,
    tauxEpargneBrute,
    capaciteDesendettementAns,
    poidsChargesPersonnelPct: poidsPersonnel,
    diagnosticEpargne: diagEpargne,
    diagnosticDesendettement: diagDette,
    diagnosticGlobal: {
      statut,
      titre,
      description,
      pointsVigilance,
    },
  };
}

/**
 * Générateur de Note d'Arbitrage à l'Autorité Territoriale
 */
export function genererNoteDecision(result: BudgetM57Result, options: { objet?: string; signataire?: string }): string {
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const objet = options.objet || `Arbitrage budgétaire M57 et trajectoire financière ${result.exercice}`;
  const signataire = options.signataire || 'Direction Générale des Services / Direction des Finances';

  return `# Projet de note à l'autorité territoriale

**Destinataire :** Monsieur / Madame le Maire / Président(e)
**Émetteur :** ${signataire}
**Date :** ${dateStr}
**Objet :** ${objet}
**Collectivité :** ${result.collectiviteNom} (Exercice ${result.exercice} - Base ${result.base})
**Statut :** Document de travail et d'arbitrage interne — Ne constitue pas un acte exécutoire

---

## 1. Synthèse des Équilibres M57

| Indicateur M57 | Valeur constatée | Référence DGCL / CRC | Diagnostic |
|---|---|---|---|
| **Recettes Réelles de Fonctionnement (RRF)** | ${result.rrf.toLocaleString('fr-FR')} € | Base de calcul | - |
| **Dépenses Réelles de Fonctionnement (DRF)** | ${result.drf.toLocaleString('fr-FR')} € | Maîtrise des charges | - |
| **Épargne Brute (Autofinancement)** | ${result.epargneBrute.toLocaleString('fr-FR')} € | RRF - DRF | ${result.diagnosticEpargne.message} |
| **Épargne Nette (après capital dette)** | ${result.epargneNette.toLocaleString('fr-FR')} € | Doit être positive | ${result.epargneNette >= 0 ? 'Couverture assurée' : 'Déficit d’autofinancement'} |
| **Taux d'Épargne Brute** | ${result.tauxEpargneBrute !== null ? result.tauxEpargneBrute + ' %' : 'N/A'} | Objectif : > 10 % (idéal > 15 %) | ${result.diagnosticEpargne.niveau.toUpperCase()} |
| **Capacité de Désendettement** | ${result.capaciteDesendettementAns !== null ? result.capaciteDesendettementAns + ' années' : 'Incalculable'} | Seuil alerte CRC : 10 - 12 ans | ${result.diagnosticDesendettement.niveau.toUpperCase()} |
| **Encours total de la dette au 31/12** | ${result.encoursDette.toLocaleString('fr-FR')} € | Annuité capital : ${result.capitalDette.toLocaleString('fr-FR')} € | - |

---

## 2. Points de Vigilance et Risques Juridiques / Financiers

${result.diagnosticGlobal.pointsVigilance.length > 0
  ? result.diagnosticGlobal.pointsVigilance.map(p => `- ⚠️ **${p}**`).join('\n')
  : '- Aucun signal d’alerte critique relevé sur les ratios M57 de l’exercice.'}

---

## 3. Options Soumises à l'Arbitrage de l'Exécutif

| Option | Intérêt stratégique | Incidence budgétaire documentée | Risques & Contraintes |
|---|---|---|---|
| **Option A : Maintien strict de la trajectoire** | Préserve les équilibres et le niveau de notation bancaire | Gel des dépenses de fonctionnement hors GVT | Tension possible sur les moyens des services |
| **Option B : Réajustement des investissements (PPI)** | Réduit le besoin d'emprunt nouveau | Étalement pluriannuel des travaux non urgents | Décalage des livraisons d’équipements publics |
| **Option C : Revalorisation du régime indemnitaire (RIFSEEP)** | Attractivité RH et fidélisation des agents territoriaux | +${Math.round(result.drf * 0.015).toLocaleString('fr-FR')} € estimé en masse salariale | Nécessite de gager la dépense sur les frais généraux |

---

## 4. Recommandations de la Direction

1. **Surveillance du ratio de désendettement :** Veiller à maintenir le ratio sous le seuil d’alerte de 10 ans pour prévenir toute saisine de la CRC.
2. **Consolidation du CFU (Compte Financier Unique) :** Fiabiliser les rattachements de fin d’exercice et les restes à réaliser (RAR).
3. **Dialogue de gestion RH :** Articuler les créations de postes et l'évolution du CIA avec la trajectoire d'épargne brute.
`;
}
