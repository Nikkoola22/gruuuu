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

export interface ChapitreMouvement {
  nature: 'REEL' | 'ORDRE';
  chapitre: string;
  libelle: string;
  montantBS2026: number;
  reports2025?: number;
  totalBS?: number;
}

export interface DeliberationBudgetInfo {
  id: string;
  numeroDelib: string;
  titre: string;
  budgetType: 'bp_2026' | 'bp_2025' | 'principal' | 'annexe_restauration' | 'annexe_cinema';
  dateConseil: string;
  dateTransmissionPrefecture: string;
  chaineIntegrite: string;
  arPrefecture: string;
  maire: string;
  secretaireSeance?: string;
  votesPour: number;
  votesContre: number;
  votesAbstention?: number;
  typeVote: 'unanimite' | 'majorite';
  montantTotalEquilibre: number;
  sectionFonctionnementTotal: number;
  sectionInvestissementTotal: number;
  cfu2025?: {
    fonctionnementResultatCumule: number;
    investissementResultatCumule: number;
    restesARealiserDepenses: number;
    restesARealiserRecettes: number;
    besoinNetFinancement: number;
    affectationCompte1068: number;
    affectationLigneR002: number;
    affectationLigneD001?: number;
    affectationLigneR001?: number;
  };
  depensesFonctionnement: ChapitreMouvement[];
  recettesFonctionnement: ChapitreMouvement[];
  depensesInvestissement: ChapitreMouvement[];
  recettesInvestissement: ChapitreMouvement[];
  pointsClesJuridiques: string[];
  detailsVote?: {
    quorumTexte?: string;
    votantsTotal?: number;
    contreNoms?: string[];
    abstentionNoms?: string[];
  };
  delegationArticle2?: string;
  delaiRecours?: string;
}

export const DELIBERATIONS_GENNEVILLIERS_2026: Record<string, DeliberationBudgetInfo> = {
  bp_2026: {
    id: 'bp_2026',
    numeroDelib: 'Délibération n°2026/S1/001',
    titre: 'Vote du Budget Primitif 2026 de la Commune (250,67 M€)',
    budgetType: 'bp_2026',
    dateConseil: '4 février 2026',
    dateTransmissionPrefecture: '10 février 2026',
    chaineIntegrite: '0B 57 E3 DD 19 FF FA 5A DD F0 12 85 D4 45 84 87',
    arPrefecture: '092-219200367-20260209-deliberation1-DE',
    maire: 'Patrice LECLERC',
    secretaireSeance: 'Khalid DAMOUN',
    votesPour: 35,
    votesContre: 1,
    votesAbstention: 1,
    typeVote: 'majorite',
    detailsVote: {
      quorumTexte: "Quorum atteint (Art. L.2121-17 CGCT) — 29 présents, 8 représentés, 6 absents excusés",
      votantsTotal: 37,
      contreNoms: ["Laëtitia GHIRARDI"],
      abstentionNoms: ["Sinan KARAKUS"]
    },
    delegationArticle2: "Autorise Monsieur le Maire à procéder à des mouvements de crédits de chapitre à chapitre (hors personnel et concours aux associations) dans une limite de 7,5 % des dépenses réelles de chaque section à compter du 1er janvier 2026.",
    delaiRecours: "Recours pour excès de pouvoir (REP) devant le Tribunal administratif de Cergy-Pontoise dans un délai de 2 mois à compter de la publication.",
    montantTotalEquilibre: 250668105.30,
    sectionFonctionnementTotal: 168150735.30,
    sectionInvestissementTotal: 82517370.00,
    depensesFonctionnement: [
      { nature: 'ORDRE', chapitre: '023', libelle: "Virement à la section d'investissement", montantBS2026: 2452764.65, totalBS: 2452764.65 },
      { nature: 'ORDRE', chapitre: '042', libelle: "Opérations d'ordre de transfert entre sections", montantBS2026: 10869724.48, totalBS: 10869724.48 },
      { nature: 'REEL', chapitre: '011', libelle: 'Charges à caractère général', montantBS2026: 41058892.92, totalBS: 41058892.92 },
      { nature: 'REEL', chapitre: '012', libelle: 'Charges de personnel et frais assimilés', montantBS2026: 96063865.00, totalBS: 96063865.00 },
      { nature: 'REEL', chapitre: '65', libelle: 'Autres charges de gestion courante', montantBS2026: 15754288.25, totalBS: 15754288.25 },
      { nature: 'REEL', chapitre: '66', libelle: 'Charges financières (intérêts dette)', montantBS2026: 1750000.00, totalBS: 1750000.00 },
      { nature: 'REEL', chapitre: '67', libelle: 'Charges spécifiques', montantBS2026: 201200.00, totalBS: 201200.00 },
    ],
    recettesFonctionnement: [
      { nature: 'REEL', chapitre: '013', libelle: 'Atténuations de charges', montantBS2026: 935000.00, totalBS: 935000.00 },
      { nature: 'REEL', chapitre: '70', libelle: 'Produits des services, domaine et ventes diverses', montantBS2026: 11284661.00, totalBS: 11284661.00 },
      { nature: 'REEL', chapitre: '731', libelle: 'Fiscalité locale', montantBS2026: 56456741.00, totalBS: 56456741.00 },
      { nature: 'REEL', chapitre: '73', libelle: 'Impôts et taxes', montantBS2026: 67165968.00, totalBS: 67165968.00 },
      { nature: 'REEL', chapitre: '74', libelle: 'Dotations et participations', montantBS2026: 27757477.00, totalBS: 27757477.00 },
      { nature: 'REEL', chapitre: '75', libelle: 'Autres produits de gestion courante', montantBS2026: 4350888.30, totalBS: 4350888.30 },
      { nature: 'REEL', chapitre: '77', libelle: 'Produits spécifiques', montantBS2026: 200000.00, totalBS: 200000.00 },
    ],
    depensesInvestissement: [
      { nature: 'ORDRE', chapitre: '041', libelle: 'Opérations patrimoniales', montantBS2026: 2000000.00, totalBS: 2000000.00 },
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées (remboursement capital)', montantBS2026: 9626700.00, totalBS: 9626700.00 },
      { nature: 'REEL', chapitre: '204', libelle: "Subventions d'équipement versées", montantBS2026: 11356002.00, totalBS: 11356002.00 },
      { nature: 'REEL', chapitre: '20', libelle: 'Immobilisations incorporelles', montantBS2026: 4776385.00, totalBS: 4776385.00 },
      { nature: 'REEL', chapitre: '21', libelle: 'Immobilisations corporelles (équipements)', montantBS2026: 26790927.00, totalBS: 26790927.00 },
      { nature: 'REEL', chapitre: '23', libelle: 'Immobilisations en cours (chantiers pluriannuels)', montantBS2026: 27077356.00, totalBS: 27077356.00 },
      { nature: 'REEL', chapitre: '27', libelle: 'Autres immobilisations financières', montantBS2026: 650000.00, totalBS: 650000.00 },
      { nature: 'REEL', chapitre: '45', libelle: 'Opérations pour compte de tiers', montantBS2026: 240000.00, totalBS: 240000.00 },
    ],
    recettesInvestissement: [
      { nature: 'ORDRE', chapitre: '041', libelle: 'Opérations patrimoniales', montantBS2026: 2000000.00, totalBS: 2000000.00 },
      { nature: 'ORDRE', chapitre: '021', libelle: 'Virement de la section de fonctionnement', montantBS2026: 2452764.65, totalBS: 2452764.65 },
      { nature: 'ORDRE', chapitre: '040', libelle: "Opérations d'ordre de transfert entre sections", montantBS2026: 10869724.48, totalBS: 10869724.48 },
      { nature: 'REEL', chapitre: '024', libelle: "Produits des cessions d'immobilisations", montantBS2026: 2640000.00, totalBS: 2640000.00 },
      { nature: 'REEL', chapitre: '10', libelle: 'Dotations, fonds divers et réserves (FCTVA, TLE)', montantBS2026: 5989673.00, totalBS: 5989673.00 },
      { nature: 'REEL', chapitre: '13', libelle: "Subventions d'investissement", montantBS2026: 13276991.65, totalBS: 13276991.65 },
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées', montantBS2026: 45048216.22, totalBS: 45048216.22 },
      { nature: 'REEL', chapitre: '45', libelle: 'Opérations pour compte de tiers', montantBS2026: 240000.00, totalBS: 240000.00 },
    ],
    pointsClesJuridiques: [
      "Budget Primitif 2026 voté le 4 février 2026 équilibré à 250 668 105,30 € (hausse de +5,20 % par rapport au BP 2025).",
      "Section d'investissement majeure à 82,52 M€ (+23,20 %) avec 53,87 M€ de travaux d'équipement (chapitres 21 et 23).",
      "Charges de personnel (012) à 96,06 M€ (62,05 % des dépenses réelles de gestion), reflétant le maintien du service public territorial.",
      "Autofinancement brut dégagé : 13,32 M€ d'épargne brute permettant de couvrir l'annuité en capital (9,63 M€) avec une épargne nette positive (+3,70 M€).",
      "Adopté à la majorité (35 pour, 1 contre, 1 abstention), télétransmis le 10/02/2026 (AR 092-219200367-20260209-deliberation1-DE)."
    ],
  },
  bp_2025: {
    id: 'bp_2025',
    numeroDelib: 'Délibération du 12 février 2025',
    titre: 'Vote du Budget Primitif 2025 de la Commune (238,28 M€)',
    budgetType: 'bp_2025',
    dateConseil: '12 février 2025',
    dateTransmissionPrefecture: '17 février 2025',
    chaineIntegrite: 'E7 B8 9F 94 59 77 9E 01 3C 33 C6 81 9E C7 19 4D',
    arPrefecture: '092-219200367-20250217-delib1-2025-DE',
    maire: 'Patrice LECLERC',
    votesPour: 35,
    votesContre: 0,
    votesAbstention: 3,
    typeVote: 'unanimite',
    detailsVote: {
      quorumTexte: "Quorum atteint (Art. L.2121-17 CGCT) — 26 présents, 11 représentés, 5 absents excusés",
      votantsTotal: 38,
      contreNoms: [],
      abstentionNoms: ["Laëtitia GHIRARDI", "Sinan KARUKUS", "Christelle NEDELEC (représentée par Sinan KARAKUS)"]
    },
    delegationArticle2: "Autorise Monsieur le Maire à procéder à des mouvements de crédits de chapitre à chapitre (hors personnel et concours aux associations) dans une limite de 7,5 % des dépenses réelles de chaque section à compter du 1er janvier 2025.",
    delaiRecours: "Recours pour excès de pouvoir (REP) auprès du Tribunal administratif de Cergy-Pontoise dans un délai de 2 mois à compter de sa publication.",
    montantTotalEquilibre: 238277172.33,
    sectionFonctionnementTotal: 171297167.00,
    sectionInvestissementTotal: 66980005.33,
    depensesFonctionnement: [
      { nature: 'ORDRE', chapitre: '023', libelle: "Virement à la section d'investissement", montantBS2026: 14727597.60, totalBS: 14727597.60 },
      { nature: 'ORDRE', chapitre: '042', libelle: "Opérations d'ordre de transfert entre sections", montantBS2026: 7000000.00, totalBS: 7000000.00 },
      { nature: 'REEL', chapitre: '011', libelle: 'Charges à caractère général', montantBS2026: 41126918.97, totalBS: 41126918.97 },
      { nature: 'REEL', chapitre: '012', libelle: 'Charges de personnel et frais assimilés', montantBS2026: 91397205.00, totalBS: 91397205.00 },
      { nature: 'REEL', chapitre: '65', libelle: 'Autres charges de gestion courante', montantBS2026: 14803771.43, totalBS: 14803771.43 },
      { nature: 'REEL', chapitre: '66', libelle: 'Charges financières', montantBS2026: 1820474.00, totalBS: 1820474.00 },
      { nature: 'REEL', chapitre: '67', libelle: 'Charges spécifiques', montantBS2026: 151200.00, totalBS: 151200.00 },
      { nature: 'REEL', chapitre: '68', libelle: 'Dotations aux provisions et dépréciations', montantBS2026: 270000.00, totalBS: 270000.00 },
    ],
    recettesFonctionnement: [
      { nature: 'REEL', chapitre: '013', libelle: 'Atténuations de charges', montantBS2026: 900000.00, totalBS: 900000.00 },
      { nature: 'REEL', chapitre: '70', libelle: 'Produits des services, domaine et ventes diverses', montantBS2026: 10994071.00, totalBS: 10994071.00 },
      { nature: 'REEL', chapitre: '731', libelle: 'Fiscalité locale', montantBS2026: 57462313.00, totalBS: 57462313.00 },
      { nature: 'REEL', chapitre: '73', libelle: 'Impôts et taxes', montantBS2026: 66973327.00, totalBS: 66973327.00 },
      { nature: 'REEL', chapitre: '74', libelle: 'Dotations et participations', montantBS2026: 30380700.00, totalBS: 30380700.00 },
      { nature: 'REEL', chapitre: '75', libelle: 'Autres produits de gestion courante', montantBS2026: 4436756.00, totalBS: 4436756.00 },
      { nature: 'REEL', chapitre: '77', libelle: 'Produits spécifiques', montantBS2026: 150000.00, totalBS: 150000.00 },
    ],
    depensesInvestissement: [
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées (remboursement capital)', montantBS2026: 8428581.33, totalBS: 8428581.33 },
      { nature: 'REEL', chapitre: '204', libelle: "Subventions d'équipement versées", montantBS2026: 10596276.00, totalBS: 10596276.00 },
      { nature: 'REEL', chapitre: '20', libelle: 'Immobilisations incorporelles', montantBS2026: 3723490.00, totalBS: 3723490.00 },
      { nature: 'REEL', chapitre: '21', libelle: 'Immobilisations corporelles', montantBS2026: 24029165.00, totalBS: 24029165.00 },
      { nature: 'REEL', chapitre: '23', libelle: 'Immobilisations en cours', montantBS2026: 19422493.00, totalBS: 19422493.00 },
      { nature: 'REEL', chapitre: '27', libelle: 'Autres immobilisations financières', montantBS2026: 600000.00, totalBS: 600000.00 },
      { nature: 'REEL', chapitre: '4541101', libelle: "Travaux exécutés d'office", montantBS2026: 180000.00, totalBS: 180000.00 },
    ],
    recettesInvestissement: [
      { nature: 'ORDRE', chapitre: '021', libelle: 'Virement de la section de fonctionnement', montantBS2026: 14727597.60, totalBS: 14727597.60 },
      { nature: 'ORDRE', chapitre: '040', libelle: "Opérations d'ordre de transfert entre sections", montantBS2026: 7000000.00, totalBS: 7000000.00 },
      { nature: 'REEL', chapitre: '024', libelle: "Produits des cessions d'immobilisations", montantBS2026: 1226000.00, totalBS: 1226000.00 },
      { nature: 'REEL', chapitre: '10', libelle: 'Dotations, fonds divers et réserves', montantBS2026: 800000.00, totalBS: 800000.00 },
      { nature: 'REEL', chapitre: '13', libelle: "Subventions d'investissement", montantBS2026: 7533691.99, totalBS: 7533691.99 },
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées', montantBS2026: 35322715.74, totalBS: 35322715.74 },
      { nature: 'REEL', chapitre: '204', libelle: "Subventions d'équipement versées", montantBS2026: 190000.00, totalBS: 190000.00 },
      { nature: 'REEL', chapitre: '4541101', libelle: "Travaux exécutés d'office", montantBS2026: 180000.00, totalBS: 180000.00 },
    ],
    pointsClesJuridiques: [
      "Budget Primitif 2025 voté le 12 février 2025 équilibré à 238 277 172,33 €.",
      "Épargne brute remarquable de 21,73 M€ permettant un virement direct de 14,73 M€ (chapitre 023) à la section d'investissement.",
      "Charges de personnel (012) à 91,40 M€ pour un total de dépenses réelles de gestion de 149,57 M€.",
      "Autofinancement net après remboursement de la dette (8,43 M€) s'élevant à +13,30 M€.",
      "Adopté à l'unanimité (35 voix pour, 3 abstentions), télétransmis le 17/02/2025."
    ],
  },
  principal: {
    id: 'principal',
    numeroDelib: 'Délibération n°2026/S6/004',
    titre: 'Budget Supplémentaire 2026 de la Commune & Affectation du CFU 2025',
    budgetType: 'principal',
    dateConseil: '23 septembre 2026',
    dateTransmissionPrefecture: '29 septembre 2026',
    chaineIntegrite: '43 40 2F 09 90 69 5E 5D 59 3A B7 50 3A 9A BB E5',
    arPrefecture: '092-219200367-20260925-2236-DE',
    maire: 'Patrice LECLERC',
    votesPour: 40,
    votesContre: 4,
    typeVote: 'majorite',
    montantTotalEquilibre: 27289807.92,
    sectionFonctionnementTotal: 1790209.00,
    sectionInvestissementTotal: 25499598.92,
    cfu2025: {
      fonctionnementResultatCumule: 17399407.33,
      investissementResultatCumule: -13402616.24,
      restesARealiserDepenses: 15075223.80,
      restesARealiserRecettes: 12103104.02,
      besoinNetFinancement: 16374736.02,
      affectationCompte1068: 16399407.33,
      affectationLigneR002: 1000000.00,
      affectationLigneD001: 10430496.46,
    },
    depensesFonctionnement: [
      { nature: 'ORDRE', chapitre: '023', libelle: "Virement à la section d'investissement", montantBS2026: 283749.59, reports2025: 0, totalBS: 283749.59 },
      { nature: 'REEL', chapitre: '011', libelle: 'Charges à caractère général', montantBS2026: 1063249.98, reports2025: 0, totalBS: 1063249.98 },
      { nature: 'REEL', chapitre: '65', libelle: 'Autres charges de gestion courante', montantBS2026: 243209.43, reports2025: 0, totalBS: 243209.43 },
      { nature: 'REEL', chapitre: '66', libelle: 'Charges financières (intérêts dette)', montantBS2026: 200000.00, reports2025: 0, totalBS: 200000.00 },
    ],
    recettesFonctionnement: [
      { nature: 'REEL', chapitre: '002', libelle: 'Résultat de fonctionnement reporté (R002)', montantBS2026: 1000000.00, reports2025: 0, totalBS: 1000000.00 },
      { nature: 'REEL', chapitre: '70', libelle: 'Produits des services, domaine et ventes diverses', montantBS2026: -20000.00, reports2025: 0, totalBS: -20000.00 },
      { nature: 'REEL', chapitre: '73', libelle: 'Impôts et taxes', montantBS2026: -453396.00, reports2025: 0, totalBS: -453396.00 },
      { nature: 'REEL', chapitre: '731', libelle: 'Fiscalité locale', montantBS2026: 108257.00, reports2025: 0, totalBS: 108257.00 },
      { nature: 'REEL', chapitre: '74', libelle: 'Dotations et participations', montantBS2026: 885289.00, reports2025: 0, totalBS: 885289.00 },
      { nature: 'REEL', chapitre: '75', libelle: 'Autres produits de gestion courante', montantBS2026: 270059.00, reports2025: 0, totalBS: 270059.00 },
    ],
    depensesInvestissement: [
      { nature: 'REEL', chapitre: '001', libelle: "Solde d'exécution d'investissement reporté (D001)", montantBS2026: 10430496.46, reports2025: 0, totalBS: 10430496.46 },
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées', montantBS2026: -77000.00, reports2025: 0, totalBS: -77000.00 },
      { nature: 'REEL', chapitre: '20', libelle: 'Immobilisations incorporelles', montantBS2026: -714000.00, reports2025: 1965898.77, totalBS: 1251898.77 },
      { nature: 'REEL', chapitre: '204', libelle: "Subventions d'équipement versées", montantBS2026: -318121.34, reports2025: 0, totalBS: -318121.34 },
      { nature: 'REEL', chapitre: '21', libelle: 'Immobilisations corporelles (équipements)', montantBS2026: -17500.00, reports2025: 7143922.35, totalBS: 7126422.35 },
      { nature: 'REEL', chapitre: '23', libelle: 'Immobilisations en cours (travaux pluriannuels)', montantBS2026: 0.00, reports2025: 5965402.68, totalBS: 5965402.68 },
      { nature: 'REEL', chapitre: '27', libelle: 'Autres immobilisations financières', montantBS2026: 1120500.00, reports2025: 0, totalBS: 1120500.00 },
    ],
    recettesInvestissement: [
      { nature: 'ORDRE', chapitre: '021', libelle: 'Virement de la section de fonctionnement (021)', montantBS2026: 283749.59, reports2025: 0, totalBS: 283749.59 },
      { nature: 'REEL', chapitre: '10', libelle: 'Dotations, fonds divers et réserves (Compte 1068)', montantBS2026: 16399407.33, reports2025: 0, totalBS: 16399407.33 },
      { nature: 'REEL', chapitre: '13', libelle: "Subventions d'investissement", montantBS2026: -1343744.00, reports2025: 4103104.02, totalBS: 2759360.02 },
      { nature: 'REEL', chapitre: '16', libelle: 'Emprunts et dettes assimilées', montantBS2026: -3063418.02, reports2025: 8000000.00, totalBS: 4936581.98 },
      { nature: 'REEL', chapitre: '27', libelle: 'Autres immobilisations financières', montantBS2026: 1120500.00, reports2025: 0, totalBS: 1120500.00 },
    ],
    pointsClesJuridiques: [
      "Conformité CGCT L. 2121-12 et L. 1612-11 : reprise obligatoire des résultats du CFU 2025 au budget supplémentaire.",
      "Affectation M57 du résultat : l'excédent de fonctionnement (+17,39 M€) couvre le besoin net d'investissement via le compte 1068 (16,39 M€).",
      "Le reliquat de 1,00 M€ est inscrit en report de fonctionnement R002 comme marge de manœuvre.",
      "La section d'investissement intègre 15,08 M€ de restes à réaliser (RAR) en dépenses (chap. 20, 21, 23) et 12,10 M€ en recettes déjà notifiées.",
      "Séance publique du 23/09/2026, transmis en préfecture le 29/09/2026 sous le visa AR 092-219200367-20260925-2236-DE."
    ],
  },
  restauration: {
    id: 'restauration',
    numeroDelib: 'Délibérations n°2026/S6/002 & n°2026/S6/005',
    titre: 'Budget Annexe Restauration du Personnel — CFU 2025 & BS 2026',
    budgetType: 'annexe_restauration',
    dateConseil: '23 septembre 2026',
    dateTransmissionPrefecture: '29 septembre 2026',
    chaineIntegrite: '05 1D BC 0E F9 F8 4E DE 38 44 45 CC 6B BF 2A F5',
    arPrefecture: '092-219200367-20260925-2441-DE',
    maire: 'Patrice LECLERC',
    votesPour: 44,
    votesContre: 0,
    typeVote: 'unanimite',
    montantTotalEquilibre: 36195.54,
    sectionFonctionnementTotal: 22000.00,
    sectionInvestissementTotal: 14195.54,
    cfu2025: {
      fonctionnementResultatCumule: 41526.07,
      investissementResultatCumule: -14195.54,
      restesARealiserDepenses: 0.00,
      restesARealiserRecettes: 0.00,
      besoinNetFinancement: 14195.54,
      affectationCompte1068: 14195.54,
      affectationLigneR002: 27330.53,
      affectationLigneD001: 14195.54,
    },
    depensesFonctionnement: [
      { nature: 'REEL', chapitre: '011', libelle: 'Charges à caractère général', montantBS2026: 22000.00, reports2025: 0, totalBS: 22000.00 },
    ],
    recettesFonctionnement: [
      { nature: 'REEL', chapitre: '002', libelle: 'Résultat de fonctionnement reporté (R002)', montantBS2026: 27330.53, reports2025: 0, totalBS: 27330.53 },
      { nature: 'REEL', chapitre: '74', libelle: 'Dotations et participations', montantBS2026: -5330.53, reports2025: 0, totalBS: -5330.53 },
    ],
    depensesInvestissement: [
      { nature: 'REEL', chapitre: '001', libelle: "Solde d'exécution d'investissement reporté (D001)", montantBS2026: 14195.54, reports2025: 0, totalBS: 14195.54 },
    ],
    recettesInvestissement: [
      { nature: 'REEL', chapitre: '10', libelle: 'Dotations, fonds divers et réserves (Compte 1068)', montantBS2026: 14195.54, reports2025: 0, totalBS: 14195.54 },
    ],
    pointsClesJuridiques: [
      "Budget annexe M57 dédié à la restauration des agents de la collectivité.",
      "Exécution 2025 : Recettes de 558 320,30 € contre 542 782,54 € de dépenses (excédent de gestion de +15 537,76 €).",
      "Résultat cumulé de fonctionnement : 41 526,07 € permettant d'apurer entièrement le déficit cumulé d'investissement (-14 195,54 €) via le compte 1068.",
      "Solde de report R002 maintenu à 27 330,53 €. Vote à l'unanimité (44 voix)."
    ],
  },
  cinema: {
    id: 'cinema',
    numeroDelib: 'Délibérations n°2026/S6/003 & n°2026/S6/006',
    titre: 'Budget Annexe Cinéma Jean Vigo — CFU 2025 & BS 2026',
    budgetType: 'annexe_cinema',
    dateConseil: '23 septembre 2026',
    dateTransmissionPrefecture: '29 septembre 2026',
    chaineIntegrite: '09 EE 84 72 B5 1C 66 9A B5 4A D4 D2 23 F4 0A 1B',
    arPrefecture: '092-219200367-20260925-2440-DE',
    maire: 'Patrice LECLERC',
    votesPour: 44,
    votesContre: 0,
    typeVote: 'unanimite',
    montantTotalEquilibre: 24582.22,
    sectionFonctionnementTotal: 6858.00,
    sectionInvestissementTotal: 17724.22,
    cfu2025: {
      fonctionnementResultatCumule: 25987.52,
      investissementResultatCumule: 17724.22,
      restesARealiserDepenses: 0.00,
      restesARealiserRecettes: 0.00,
      besoinNetFinancement: 0.00,
      affectationCompte1068: 0.00,
      affectationLigneR002: 25987.52,
      affectationLigneR001: 17724.22,
    },
    depensesFonctionnement: [
      { nature: 'REEL', chapitre: '012', libelle: 'Charges de personnel et frais assimilés', montantBS2026: 6858.00, reports2025: 0, totalBS: 6858.00 },
    ],
    recettesFonctionnement: [
      { nature: 'REEL', chapitre: '002', libelle: 'Résultat de fonctionnement reporté (R002)', montantBS2026: 25987.52, reports2025: 0, totalBS: 25987.52 },
      { nature: 'REEL', chapitre: '74', libelle: 'Dotations et participations', montantBS2026: -19129.52, reports2025: 0, totalBS: -19129.52 },
    ],
    depensesInvestissement: [
      { nature: 'REEL', chapitre: '21', libelle: 'Immobilisations corporelles (matériel cinéma)', montantBS2026: 17724.22, reports2025: 0, totalBS: 17724.22 },
    ],
    recettesInvestissement: [
      { nature: 'REEL', chapitre: '001', libelle: "Solde d'exécution d'investissement reporté (R001 - excédent)", montantBS2026: 17724.22, reports2025: 0, totalBS: 17724.22 },
    ],
    pointsClesJuridiques: [
      "Budget annexe M57 du Cinéma municipal Jean Vigo.",
      "Situation équilibrée : 0 € de besoin net d'investissement (aucun prélèvement obligatoire au compte 1068).",
      "L'intégralité du résultat de fonctionnement (+25 987,52 €) est conservée en report R002.",
      "L'excédent d'investissement (+17 724,22 €) est reporté en R001 et affecté à l'achat d'immobilisations corporelles (chapitre 21).",
      "Adopté à l'unanimité (44 voix pour, 0 contre) le 23/09/2026."
    ],
  },
};

export const PRESETS_COLLECTIVITES: Record<string, BudgetM57Input> = {
  gennevilliers_bp_2026: {
    collectiviteNom: 'Gennevilliers — BP 2026 Primitif (Délib. 2026/S1/001)',
    typeCollectivite: 'commune',
    population: 51200,
    exercice: 2026,
    base: 'prevision',
    recettesReellesFonctionnement: 168150735,
    depensesReellesFonctionnement: 154828246,
    remboursementCapitalDette: 9626700,
    encoursDetteFinExercice: 72400000,
    depensesPersonnel012: 96063865,
  },
  gennevilliers_bp_2025: {
    collectiviteNom: 'Gennevilliers — BP 2025 Primitif (Délib. 12/02/2025)',
    typeCollectivite: 'commune',
    population: 50200,
    exercice: 2025,
    base: 'prevision',
    recettesReellesFonctionnement: 171297167,
    depensesReellesFonctionnement: 149569569,
    remboursementCapitalDette: 8428581,
    encoursDetteFinExercice: 68500000,
    depensesPersonnel012: 91397205,
  },
  gennevilliers_principal_delib_2026: {
    collectiviteNom: 'Gennevilliers — BS 2026 Principal (Délib. 2026/S6/004)',
    typeCollectivite: 'commune',
    population: 51200,
    exercice: 2026,
    base: 'execution',
    recettesReellesFonctionnement: 141200000,
    depensesReellesFonctionnement: 123800000,
    remboursementCapitalDette: 8200000,
    encoursDetteFinExercice: 69400000,
    depensesPersonnel012: 68900000,
  },
  gennevilliers_cfu_2025: {
    collectiviteNom: 'Gennevilliers — CFU 2025 Exécution (Délib. 2026/S6/004)',
    typeCollectivite: 'commune',
    population: 50200,
    exercice: 2025,
    base: 'execution',
    recettesReellesFonctionnement: 138650000,
    depensesReellesFonctionnement: 121250592,
    remboursementCapitalDette: 7900000,
    encoursDetteFinExercice: 68100000,
    depensesPersonnel012: 67400000,
  },
  gennevilliers_restauration_2026: {
    collectiviteNom: 'Gennevilliers — Annexe Restauration (Délib. 2026/S6/005)',
    typeCollectivite: 'commune',
    population: 51200,
    exercice: 2026,
    base: 'execution',
    recettesReellesFonctionnement: 558320,
    depensesReellesFonctionnement: 542782,
    remboursementCapitalDette: 0,
    encoursDetteFinExercice: 0,
    depensesPersonnel012: 320000,
  },
  gennevilliers_cinema_2026: {
    collectiviteNom: 'Gennevilliers — Annexe Cinéma Vigo (Délib. 2026/S6/006)',
    typeCollectivite: 'commune',
    population: 51200,
    exercice: 2026,
    base: 'execution',
    recettesReellesFonctionnement: 689051,
    depensesReellesFonctionnement: 722135,
    remboursementCapitalDette: 0,
    encoursDetteFinExercice: 0,
    depensesPersonnel012: 410000,
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

export interface ChapitreComparatifRow {
  chapitre: string;
  libelle: string;
  section: 'fonctionnement' | 'investissement';
  sens: 'depense' | 'recette';
  montant2025: number;
  montant2026: number;
  deltaEuros: number;
  deltaPct: number | null;
}

export function comparerBP2025et2026(): {
  depensesFonctionnement: ChapitreComparatifRow[];
  recettesFonctionnement: ChapitreComparatifRow[];
  depensesInvestissement: ChapitreComparatifRow[];
  recettesInvestissement: ChapitreComparatifRow[];
  totaux: {
    budgetTotal2025: number;
    budgetTotal2026: number;
    deltaBudgetTotal: number;
    deltaBudgetTotalPct: number;
    fonctTotal2025: number;
    fonctTotal2026: number;
    deltaFonctPct: number;
    investTotal2025: number;
    investTotal2026: number;
    deltaInvestPct: number;
    chargesPersonnel2025: number;
    chargesPersonnel2026: number;
    deltaPersonnelPct: number;
  };
} {
  const bp25 = DELIBERATIONS_GENNEVILLIERS_2026.bp_2025;
  const bp26 = DELIBERATIONS_GENNEVILLIERS_2026.bp_2026;

  const compareList = (
    list25: ChapitreMouvement[],
    list26: ChapitreMouvement[],
    section: 'fonctionnement' | 'investissement',
    sens: 'depense' | 'recette'
  ): ChapitreComparatifRow[] => {
    const map25 = new Map<string, ChapitreMouvement>();
    for (const item of list25) map25.set(item.chapitre, item);

    const map26 = new Map<string, ChapitreMouvement>();
    for (const item of list26) map26.set(item.chapitre, item);

    const allKeys = Array.from(new Set([...Array.from(map25.keys()), ...Array.from(map26.keys())]));

    return allKeys.map(chap => {
      const it25 = map25.get(chap);
      const it26 = map26.get(chap);
      const m25 = it25 ? (it25.totalBS ?? it25.montantBS2026) : 0;
      const m26 = it26 ? (it26.totalBS ?? it26.montantBS2026) : 0;
      const delta = m26 - m25;
      const pct = m25 > 0 ? (delta / m25) * 100 : null;
      return {
        chapitre: chap,
        libelle: it26?.libelle || it25?.libelle || `Chapitre ${chap}`,
        section,
        sens,
        montant2025: m25,
        montant2026: m26,
        deltaEuros: delta,
        deltaPct: pct !== null ? Math.round(pct * 100) / 100 : null,
      };
    });
  };

  const bTotal25 = bp25.montantTotalEquilibre;
  const bTotal26 = bp26.montantTotalEquilibre;
  const dTotal = bTotal26 - bTotal25;

  const p25 = bp25.depensesFonctionnement.find(c => c.chapitre === '012')?.montantBS2026 || 0;
  const p26 = bp26.depensesFonctionnement.find(c => c.chapitre === '012')?.montantBS2026 || 0;

  return {
    depensesFonctionnement: compareList(bp25.depensesFonctionnement, bp26.depensesFonctionnement, 'fonctionnement', 'depense'),
    recettesFonctionnement: compareList(bp25.recettesFonctionnement, bp26.recettesFonctionnement, 'fonctionnement', 'recette'),
    depensesInvestissement: compareList(bp25.depensesInvestissement, bp26.depensesInvestissement, 'investissement', 'depense'),
    recettesInvestissement: compareList(bp25.recettesInvestissement, bp26.recettesInvestissement, 'investissement', 'recette'),
    totaux: {
      budgetTotal2025: bTotal25,
      budgetTotal2026: bTotal26,
      deltaBudgetTotal: dTotal,
      deltaBudgetTotalPct: Math.round(((dTotal / bTotal25) * 100) * 100) / 100,
      fonctTotal2025: bp25.sectionFonctionnementTotal,
      fonctTotal2026: bp26.sectionFonctionnementTotal,
      deltaFonctPct: Math.round((((bp26.sectionFonctionnementTotal - bp25.sectionFonctionnementTotal) / bp25.sectionFonctionnementTotal) * 100) * 100) / 100,
      investTotal2025: bp25.sectionInvestissementTotal,
      investTotal2026: bp26.sectionInvestissementTotal,
      deltaInvestPct: Math.round((((bp26.sectionInvestissementTotal - bp25.sectionInvestissementTotal) / bp25.sectionInvestissementTotal) * 100) * 100) / 100,
      chargesPersonnel2025: p25,
      chargesPersonnel2026: p26,
      deltaPersonnelPct: Math.round((((p26 - p25) / p25) * 100) * 100) / 100,
    }
  };
}
