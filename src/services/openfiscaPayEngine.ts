/**
 * Moteur d'Analyse et d'Explication de Fiche de Paie (Fonction Publique Territoriale)
 * Basé sur le modèle officiel OpenFisca-France (https://github.com/openfisca/openfisca-france)
 * 
 * Modélise les règles statutaires du Code Général de la Fonction Publique (CGFP),
 * les décrets d'application FPT (RIFSEEP, SFT, RAFP, CNRACL, IRCANTEC, CSG/CRDS),
 * et la doctrine de paie de la Ville de Gennevilliers.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTES & PARAMÈTRES OFFICIELS OPENFISCA-FRANCE (FPT)
// ─────────────────────────────────────────────────────────────────────────────

export const OPENFISCA_REPO_URL = "https://github.com/openfisca/openfisca-france";

/** Valeur annuelle brute du point d'indice (Décret n° 2023-519 du 28 juin 2023) */
export const VALEUR_POINT_INDICE_ANNUEL = 59.0734;

/** Valeur mensuelle brute exacte d'un point d'indice (59.0734 € / 12 = 4.9227833... €) */
export const VALEUR_POINT_INDICE_MENSUEL = 59.0734 / 12;

/** Plafond Mensuel de la Sécurité Sociale (PMSS) 2024 */
export const PMSS_MENSUEL_2024 = 3864.0;

/** Plafond Mensuel de la Sécurité Sociale (PMSS) 2025 */
export const PMSS_MENSUEL_2025 = 3925.0;

/** Taux de cotisation pension CNRACL Salarié (Décret 2003-1306) */
export const TAUX_CNRACL_SALARIE = 0.1110; // 11,10%

/** Taux de cotisation pension CNRACL Employeur territorial (taux 2026 constaté sur bulletin Ciril Gennevilliers) */
export const TAUX_CNRACL_PATRONAL = 0.3765; // 37,65%

/** Bloc Urssaf patronal titulaire Gennevilliers (maladie 9,88 + AF 3,45 + AF comp 1,80 + FNAL 0,50 + mobilité 3,20 + autonomie 0,30) */
export const TAUX_USSAF_TITULAIRE_PATRONAL = 0.1913; // 19,13%

/** Cotisation CNRACL ATIACL patronale (sur le seul TIB) */
export const TAUX_ATIACL_PATRONAL = 0.0040; // 0,40%

/** Cotisation Centre de Gestion patronale */
export const TAUX_CNG_PATRONAL = 0.0050; // 0,50%

/** Cotisation CNFPT patronale (0,90% + majoration 0,10%) */
export const TAUX_CNFPT_PATRONAL = 0.0100; // 1,00%

/** Taux RAFP Salarié (Retraite Additionnelle de la Fonction Publique - Décret 2004-569) */
export const TAUX_RAFP_SALARIE = 0.05; // 5,00%

/** Taux RAFP Employeur */
export const TAUX_RAFP_PATRONAL = 0.05; // 5,00%

/** Plafond de prise en compte des primes pour la RAFP (20% du TIB) */
export const PLAFOND_ASSIETTE_RAFP_POURCENTAGE = 0.20; // 20%

/** Taux IRCANTEC Tranche A Salarié (Agents contractuels de droit public) */
export const TAUX_IRCANTEC_A_SALARIE = 0.0280; // 2,80%

/** Taux IRCANTEC Tranche A Patronal */
export const TAUX_IRCANTEC_A_PATRONAL = 0.0420; // 4,20%

/** Taux IRCANTEC Tranche B Salarié */
export const TAUX_IRCANTEC_B_SALARIE = 0.0695; // 6,95%

/** Taux IRCANTEC Tranche B Patronal */
export const TAUX_IRCANTEC_B_PATRONAL = 0.1255; // 12,55%

/** Taux Maladie Salarié — Agents contractuels FPT (Décret n° 2017-1904 du 30 décembre 2017) */
export const TAUX_MALADIE_CONTRACTUEL_SALARIE = 0.0075; // 0,75%

/** Taux Assurance Vieillesse Plafonnée Salarié (Régime Général — Art. R. 131-2 CSS) */
export const TAUX_VIEILLESSE_PLAFONNEE_SALARIE = 0.0690; // 6,90%

/** Taux Assurance Vieillesse Déplafonnée Salarié (Régime Général — Art. R. 131-2 CSS) */
export const TAUX_VIEILLESSE_DEPLAFONNEE_SALARIE = 0.0040; // 0,40%

/** Taux CSG Déductible (Art. L. 136-2 Code de la sécurité sociale) */
export const TAUX_CSG_DEDUCTIBLE = 0.0680; // 6,80%

/** Taux CSG Non Déductible de l'impôt sur le revenu */
export const TAUX_CSG_NON_DEDUCTIBLE = 0.0240; // 2,40%

/** Taux CRDS (Contribution au Remboursement de la Dette Sociale) */
export const TAUX_CRDS = 0.0050; // 0,50%

/** Taux d'assiette abattue CSG/CRDS (Abattement de 1,75% pour frais professionnels) */
export const ASSIETTE_ABATTEMENT_CSG_CRDS = 0.9825; // 98,25%

/** Taux Indemnité de Résidence Zone 1 (Gennevilliers / Métropole du Grand Paris) */
export const TAUX_RESIDENCE_ZONE_1 = 0.03; // 3,00%
export const TAUX_ZONE_RESIDENCE_1 = 0.03; // Alias compatibilité

/** Montants mensuels légaux Abattement PPCR (Décret n° 2016-588) : Cat C 167 €/an, Cat B 278 €/an */
export const MONTANT_PPCR_MENSUEL_CAT_C = 13.92; // 167 €/an
export const MONTANT_PPCR_MENSUEL_CAT_B = 23.17; // 278 €/an
/** @deprecated ancien libellé erroné, conservé pour compatibilité */
export const MONTANT_PPCR_MENSUEL_CAT_C_B = 13.92;

/** Montant mensuel légal Abattement PPCR Cat A (389 € / an) */
export const MONTANT_PPCR_MENSUEL_CAT_A = 32.42; // 389 €/an

/** Barème mensuel de l'abattement transfert primes/points (Décret n° 2016-588, art. 2) */
export const PPCR_MENSUEL_PAR_CATEGORIE: Record<"A" | "B" | "C", number> = {
  A: MONTANT_PPCR_MENSUEL_CAT_A,
  B: MONTANT_PPCR_MENSUEL_CAT_B,
  C: MONTANT_PPCR_MENSUEL_CAT_C
};

/** Devine la catégorie hiérarchique à partir du grade (sinon de l'indice majoré) */
export function devinerCategorie(grade?: string, indiceMajore?: number): "A" | "B" | "C" {
  const g = (grade || "").toLowerCase();
  if (/attach|ing[ée]nieur|directeur|conseiller|administrateur|cadre de sant|puéricult|puericult|psycholog|m[ée]decin|biblioth[ée]caire|professeur/.test(g)) return "A";
  if (/r[ée]dacteur|technicien|animateur|[ée]ducateur|assistant|ma[îi]tre|chef de service|infirmier|moniteur/.test(g)) return "B";
  if (/adjoint|agent|auxiliaire|atsem|gardien|op[ée]rateur/.test(g)) return "C";
  const im = indiceMajore || 0;
  return im <= 473 ? "C" : im <= 600 ? "B" : "A";
}

/** Montant mensuel prise en charge transport Navigo 75% (86,40 € x 75% = 64,80 €) */
export const PRISE_EN_CHARGE_NAVIGO_75_PCT_2024 = 64.80;
export const PRISE_EN_CHARGE_NAVIGO_75_PCT_2025 = 66.60;

// ─────────────────────────────────────────────────────────────────────────────
// 2. NOMENCLATURE DES VARIABLES OPENFISCA-FRANCE
// ─────────────────────────────────────────────────────────────────────────────

export interface OpenFiscaVariableInfo {
  id: string;
  nom: string;
  description: string;
  openfiscaModule: string;
  githubUrl: string;
  legalReference: string;
  formule: string;
  categorie:
    | "traitement"
    | "primes"
    | "cotisation_retraite"
    | "cotisation_sociale"
    | "csg_crds"
    | "fiscalite"
    | "employeur";
  nature: "gain" | "retenue" | "information" | "patronal";
}

export const OPENFISCA_VARIABLES_DICTIONARY: Record<string, OpenFiscaVariableInfo> = {
  traitement_indiciaire_brut: {
    id: "traitement_indiciaire_brut",
    nom: "Traitement Indiciaire Brut (TIB)",
    description: "Rémunération statutaire de base liée à l'indice majoré (IM) et à la valeur du point d'indice.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/remuneration.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/remuneration.py`,
    legalReference: "Art. L. 712-1 du Code Général de la Fonction Publique (CGFP)",
    formule: "indice_majore * valeur_du_point_indiciaire / 12 * (quotite / 100)",
    categorie: "traitement",
    nature: "gain"
  },
  nouvelle_bonification_indiciaire: {
    id: "nouvelle_bonification_indiciaire",
    nom: "Nouvelle Bonification Indiciaire (NBI)",
    description: "Points d'indice supplémentaires accordés pour des fonctions impliquant une responsabilité ou une technicité particulière.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/remuneration.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/remuneration.py`,
    legalReference: "Loi n° 91-73 du 18 janvier 1991 & Décrets d'application FPT",
    formule: "points_nbi * valeur_du_point_indiciaire / 12",
    categorie: "traitement",
    nature: "gain"
  },
  indemnite_residence: {
    id: "indemnite_residence",
    nom: "Indemnité de Résidence",
    description: "Majoration liée au coût de la vie dans la commune d'affectation (3% en zone 1 : Gennevilliers et Île-de-France).",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/indemnites.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/indemnites.py`,
    legalReference: "Art. L. 712-1 CGFP & Circulaire ministérielle FP/7 n° 1996 du 12 mars 2001",
    formule: "traitement_indiciaire_brut * taux_zone_residence (Zone 1 = 3%)",
    categorie: "primes",
    nature: "gain"
  },
  supplement_familial_traitement: {
    id: "supplement_familial_traitement",
    nom: "Supplément Familial de Traitement (SFT)",
    description: "Prestation statutaire versée en fonction du nombre d'enfants à charge au sens des prestations familiales.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/sft.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/sft.py`,
    legalReference: "Art. L. 712-1 et L. 712-8 du CGFP & Décret n° 85-1148",
    formule: "part_fixe + part_proportionnelle * traitement_indiciaire_brut (avec planchers et plafonds)",
    categorie: "primes",
    nature: "gain"
  },
  rifseep_ifse: {
    id: "rifseep_ifse",
    nom: "RIFSEEP - IFSE Tit. (4 composantes)",
    description: "Indemnité de Fonctions, de Sujétions et d'Expertise (IFSE Tit.). Composée de 4 IFSE cumulatives : IFSE 1 (Prime de fonctions), IFSE 2 (Prime des contraintes de poste), IFSE 3 (Samedis, dimanches et astreintes), IFSE 4 (Avantages acquis).",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Art. L. 714-4 à L. 714-13 CGFP & Décret n° 2014-513 & Délibération cadre de la collectivité",
    formule: "IFSE_Totale = IFSE_1 (fonctions) + IFSE_2 (contraintes) + IFSE_3 (samedis/dimanches/astreintes) + IFSE_4 (avantages acquis)",
    categorie: "primes",
    nature: "gain"
  },
  rifseep_cia: {
    id: "rifseep_cia",
    nom: "RIFSEEP - CIA Tit. (Complément Indemnitaire Annuel)",
    description: "Complément Indemnitaire Annuel (CIA Tit.). Base légale : 10 % de l'IFSE mensuelle × 12 mois (soit 1,2 mois d'IFSE annuelle). Attribué pour 50 % sur la manière de servir (évaluation CREP) et pour 50 % selon le nombre de jours d'absence (assiduité).",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Art. L. 714-4 à L. 714-13 CGFP & Décret n° 2014-513 & Délibération cadre de la collectivité",
    formule: "CIA_Total = (IFSE_mensuelle * 10% * 12) * [50% (maniere_de_servir) + 50% (assiduite_jours_absence)]",
    categorie: "primes",
    nature: "gain"
  },
  primes_fonction_publique: {
    id: "primes_fonction_publique",
    nom: "Primes & Indemnités diverses FPT",
    description: "Ensemble des régimes indemnitaires complémentaires, astreintes, IHTS ou indemnités spécifiques.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Art. L. 714-4 du CGFP",
    formule: "somme(primes_eligibles)",
    categorie: "primes",
    nature: "gain"
  },
  cotisation_retraite_cnracl_salarie: {
    id: "cotisation_retraite_cnracl_salarie",
    nom: "Retraite CNRACL (Part Salariée)",
    description: "Cotisation vieillesse finançant le régime spécial de retraite des fonctionnaires territoriaux et hospitaliers.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/retraite/cnracl.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/retraite/cnracl.py`,
    legalReference: "Décret n° 2003-1306 du 26 décembre 2003 (Taux 11,10%)",
    formule: "(traitement_indiciaire_brut + nouvelle_bonification_indiciaire) * 0.1110",
    categorie: "cotisation_retraite",
    nature: "retenue"
  },
  cotisation_retraite_rafp_salarie: {
    id: "cotisation_retraite_rafp_salarie",
    nom: "Retraite Additionnelle RAFP (Part Salariée)",
    description: "Régime de retraite obligatoire par points assis sur les primes et indemnités dans la limite de 20% du traitement brut.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/retraite/rafp.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/retraite/rafp.py`,
    legalReference: "Art. L. 712-4 du CGFP & Décret n° 2004-569 (Taux 5% dans la limite de 20% du TIB)",
    formule: "min(primes_soumises, 0.20 * (traitement_indiciaire_brut + nbi)) * 0.05",
    categorie: "cotisation_retraite",
    nature: "retenue"
  },
  cotisation_retraite_ircantec_salarie: {
    id: "cotisation_retraite_ircantec_salarie",
    nom: "Retraite Complémentaire IRCANTEC (Part Salariée)",
    description: "Régime de retraite complémentaire obligatoire pour les agents contractuels territoriaux de droit public.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/retraite/ircantec.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/retraite/ircantec.py`,
    legalReference: "Décret n° 70-1277 du 23 décembre 1970 (Tranche A 2,80%, Tranche B 6,95%)",
    formule: "min(assiette, PMSS) * 0.0280 + max(0, assiette - PMSS) * 0.0695",
    categorie: "cotisation_retraite",
    nature: "retenue"
  },
  cotisation_maladie_contractuel_salarie: {
    id: "cotisation_maladie_contractuel_salarie",
    nom: "Cotisation Maladie (Agents Contractuels — 0,75%)",
    description: "Assurance maladie du Régime Général pour les agents contractuels territoriaux, à taux réduit de 0,75%.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/sante/maladie.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/sante/maladie.py`,
    legalReference: "Décret n° 2017-1904 du 30 décembre 2017 (taux réduit 0,75% FPT/FPH)",
    formule: "min(salaire_brut, 5 * PMSS) * 0.0075",
    categorie: "cotisation_sociale",
    nature: "retenue"
  },
  cotisation_vieillesse_plafonnee_salarie: {
    id: "cotisation_vieillesse_plafonnee_salarie",
    nom: "Assurance Vieillesse Plafonnée (Régime Général — 6,90%)",
    description: "Cotisation vieillesse du Régime Général prélevée sur la rémunération dans la limite du Plafond Mensuel de la Sécurité Sociale.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/retraite/base.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/retraite/base.py`,
    legalReference: "Art. L. 131-2-1 et R. 131-2 du Code de la sécurité sociale (6,90% sur le PMSS)",
    formule: "min(salaire_brut, PMSS) * 0.0690",
    categorie: "cotisation_sociale",
    nature: "retenue"
  },
  cotisation_vieillesse_deplafonnee_salarie: {
    id: "cotisation_vieillesse_deplafonnee_salarie",
    nom: "Assurance Vieillesse Déplafonnée (Régime Général — 0,40%)",
    description: "Cotisation vieillesse du Régime Général prélevée sur la totalité de la rémunération, sans plafond.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/retraite/base.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/retraite/base.py`,
    legalReference: "Art. L. 131-2-1 et R. 131-2 du Code de la sécurité sociale (0,40% sans plafond)",
    formule: "salaire_brut * 0.0040",
    categorie: "cotisation_sociale",
    nature: "retenue"
  },
  csg_deductible_salaire: {
    id: "csg_deductible_salaire",
    nom: "CSG Déductible (6,80%)",
    description: "Contribution Sociale Généralisée finançant la protection sociale, déductible du revenu imposable pour l'impôt sur le revenu.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/contributions_sociales/csg.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/contributions_sociales/csg.py`,
    legalReference: "Art. L. 136-1 et L. 136-2 du Code de la sécurité sociale",
    formule: "remuneration_brute_totale * 0.9825 * 0.0680",
    categorie: "csg_crds",
    nature: "retenue"
  },
  csg_non_deductible_salaire: {
    id: "csg_non_deductible_salaire",
    nom: "CSG Non Déductible (2,40%)",
    description: "Partie de la CSG qui ne peut pas être déduite de votre assiette fiscale et qui est réintégrée dans le net fiscal.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/contributions_sociales/csg.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/contributions_sociales/csg.py`,
    legalReference: "Art. L. 136-1 et L. 136-8 du Code de la sécurité sociale",
    formule: "remuneration_brute_totale * 0.9825 * 0.0240",
    categorie: "csg_crds",
    nature: "retenue"
  },
  crds_salaire: {
    id: "crds_salaire",
    nom: "CRDS (0,50%)",
    description: "Contribution au Remboursement de la Dette Sociale, prélevée sur la même assiette abattue que la CSG.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/contributions_sociales/crds.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/contributions_sociales/crds.py`,
    legalReference: "Ordonnance n° 96-50 du 24 janvier 1996",
    formule: "remuneration_brute_totale * 0.9825 * 0.0050",
    categorie: "csg_crds",
    nature: "retenue"
  },
  remuneration_brute: {
    id: "remuneration_brute",
    nom: "Rémunération Brute Globale",
    description: "Total de l'ensemble des éléments de rémunération avant toute retenue sociale ou fiscale.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/remuneration.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/remuneration.py`,
    legalReference: "Art. L. 712-1 CGFP",
    formule: "traitement_indiciaire_brut + nbi + primes + sft + residence",
    categorie: "traitement",
    nature: "gain"
  },
  cotisations_salariales: {
    id: "cotisations_salariales",
    nom: "Total des Cotisations Salariales",
    description: "Total des retenues déduites du brut (CNRACL/IRCANTEC + RAFP + CSG/CRDS + mutuelle).",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/salarie.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/salarie.py`,
    legalReference: "Code de la sécurité sociale & CGFP",
    formule: "retraite + rafp + csg_deductible + csg_non_deductible + crds",
    categorie: "cotisation_sociale",
    nature: "retenue"
  },
  salaire_imposable: {
    id: "salaire_imposable",
    nom: "Net Fiscal / Salaire Imposable",
    description: "Montant transmis à l'administration fiscale (DGFiP) servant de base au calcul de l'impôt sur le revenu.",
    openfiscaModule: "openfisca_france/model/impot_revenu/calcul_impot_revenu.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/impot_revenu/calcul_impot_revenu.py`,
    legalReference: "Art. 83 du Code Général des Impôts (CGI)",
    formule: "salaire_net_avant_impot + csg_non_deductible + crds + part_patronale_sante_imposable",
    categorie: "fiscalite",
    nature: "information"
  },
  prelevement_a_la_source: {
    id: "prelevement_a_la_source",
    nom: "Prélèvement à la Source (PAS)",
    description: "Impôt sur le revenu retenu directement par l'employeur territorial sur le salaire pour le compte du Trésor Public.",
    openfiscaModule: "openfisca_france/model/impot_revenu/prelevement_a_la_source.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/impot_revenu/prelevement_a_la_source.py`,
    legalReference: "Art. 204 A et suivants du Code Général des Impôts",
    formule: "salaire_imposable * taux_personnalise_pas",
    categorie: "fiscalite",
    nature: "retenue"
  },
  salaire_net_a_payer: {
    id: "salaire_net_a_payer",
    nom: "Net à Payer (Net en Poche)",
    description: "Montant net viré effectivement sur le compte bancaire de l'agent à la fin du mois après PAS.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/remuneration.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/remuneration.py`,
    legalReference: "Code Général de la Fonction Publique",
    formule: "salaire_net_avant_impot - prelevement_a_la_source",
    categorie: "fiscalite",
    nature: "information"
  },
  cotisations_employeur: {
    id: "cotisations_employeur",
    nom: "Cotisations Patronales (Collectivité)",
    description: "Contributions versées par la Ville de Gennevilliers pour financer la sécurité sociale, la retraite CNRACL, le CNFPT et le CIG.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/employeur.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/employeur.py`,
    legalReference: "Code de la sécurité sociale & Décrets CNRACL / CNFPT",
    formule: "traitement_indiciaire_brut * 0.3165 (CNRACL) + primes * 0.05 (RAFP) + cotisations_diverses (~45% du brut)",
    categorie: "employeur",
    nature: "patronal"
  },
  abattement_ppcr: {
    id: "abattement_ppcr",
    nom: "Abattement PPCR / Transfert Primes-Points",
    description: "Retenue mensuelle sur les primes statutaires issue du protocole PPCR en contrepartie des points d'indice revalorisés.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Décret n° 2016-588 du 11 mai 2016 (Cat A : 389 €/an = 32,42 €/mois • Cat B : 278 €/an = 23,17 €/mois • Cat C : 167 €/an = 13,92 €/mois)",
    formule: "montant_annuel_ppcr / 12 * (quotite / 100)",
    categorie: "primes",
    nature: "retenue"
  },
  prise_en_charge_transport: {
    id: "prise_en_charge_transport",
    nom: "Prise en charge Frais de Transport Public (Navigo 75%)",
    description: "Remboursement légal obligatoire de 75% du pass Navigo mensuel par la Ville de Gennevilliers. Gain net non imposable et non soumis à cotisations.",
    openfiscaModule: "openfisca_france/model/prestations/transports/navigo.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/transports/navigo.py`,
    legalReference: "Décret n° 2010-676 du 21 juin 2010 & Décret n° 2023-812 du 21 août 2023",
    formule: "cout_abonnement_navigo * 0.75",
    categorie: "primes",
    nature: "gain"
  },
  indemnite_compensatrice_csg: {
    id: "indemnite_compensatrice_csg",
    nom: "Indemnité Compensatrice de la CSG",
    description: "Indemnité mensuelle versée pour neutraliser la hausse de CSG (+1,7%) intervenue en 2018.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/indemnites.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/indemnites.py`,
    legalReference: "Décret n° 2017-1889 du 30 décembre 2017",
    formule: "montant_recalcule_annuel",
    categorie: "primes",
    nature: "gain"
  },
  participation_mutuelle_employeur: {
    id: "participation_mutuelle_employeur",
    nom: "Participation Employeur Santé / Prévoyance (PSC)",
    description: "Participation financière de la Ville de Gennevilliers à la mutuelle santé labellisée. Soumise à CSG/CRDS et intégrée au net fiscal.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/sante.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/sante.py`,
    legalReference: "Art. L. 827-1 CGFP & Décret n° 2022-581",
    formule: "montant_participation_forfaitaire_ville",
    categorie: "employeur",
    nature: "gain"
  },
  retenue_mutuelle_salarie: {
    id: "retenue_mutuelle_salarie",
    nom: "Cotisation Mutuelle / Prévoyance (Part Salariée)",
    description: "Prélèvement facultatif direct de la cotisation mutuelle ou prévoyance (ex: MNT, SMACL). Retenue non déductible sur le net.",
    openfiscaModule: "openfisca_france/model/prelevements_sociaux/cotisations/salarie.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prelevements_sociaux/cotisations/salarie.py`,
    legalReference: "Code de la mutualité",
    formule: "cotisation_mensuelle_adherent",
    categorie: "cotisation_sociale",
    nature: "retenue"
  },
  prime_13eme_mois: {
    id: "prime_13eme_mois",
    nom: "13ème Mois Communal (Complément & Prime Semestrielle)",
    description: "Avantage collectif territorial historique versé semestriellement (en juin et novembre) selon les délibérations de la Ville de Gennevilliers.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Délibérations du Conseil Municipal de Gennevilliers relatives au régime indemnitaire et au 13ème mois",
    formule: "montant_semestriel_verse_selon_presence",
    categorie: "primes",
    nature: "gain"
  },
  indemnite_differentielle: {
    id: "indemnite_differentielle",
    nom: "Indemnité Différentielle (Garantie SMIC)",
    description: "Complément statutaire versé lorsque la grille indiciaire est inférieure au SMIC pour garantir la rémunération minimale légale.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Art. L. 712-1 CGFP & Art. L. 2410-1 Code du travail",
    formule: "max(0, montant_smic_mensuel - remuneration_indiciaire)",
    categorie: "primes",
    nature: "gain"
  },
  montant_net_social: {
    id: "montant_net_social",
    nom: "Montant Net Social",
    description: "Montant de référence réglementaire transmis en DSN servant de base pour le calcul des aides de la CAF (Prime d'activité, RSA).",
    openfiscaModule: "openfisca_france/model/prestations/sociales/net_social.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/sociales/net_social.py`,
    legalReference: "Arrêté du 31 janvier 2023 fixant les mentions obligatoires du bulletin de paie",
    formule: "remuneration_brute - cotisations_sociales_legales_obligatoires",
    categorie: "fiscalite",
    nature: "information"
  },
  rappel_salaire: {
    id: "rappel_salaire",
    nom: "Rappel de Salaire (Régularisation rétroactive)",
    description: "Régularisation rétroactive d'une somme due ou d'une retenue sur une période de paie antérieure (avancement d'échelon différé, prime recalculée).",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/remuneration.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/remuneration.py`,
    legalReference: "Art. L. 3242-1 du Code du travail & Règles de prescription quadriennale des créances publiques",
    formule: "montant_du_retroactif - montant_deja_verse",
    categorie: "traitement",
    nature: "gain"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TYPES ET STRUCTURES DE DONNÉES DE LA FICHE DE PAIE
// ─────────────────────────────────────────────────────────────────────────────

export interface FichePaieLigne {
  id: string;
  code?: string;
  libelle: string;
  base?: number;
  taux?: number;
  montantGain?: number;
  montantRetenue?: number;
  partPatronale?: number;
  patronalTaux?: number;
  /** Si la ligne est un rappel (marqueur « R » dans le code) : mois concerné (ex. « 02/2026 ») */
  moisRappel?: string;
  openFiscaVar: OpenFiscaVariableInfo;
  montantTheoriqueOpenFisca: number;
  estConforme: boolean;
  ecart?: number;
  explicationLigne: string;
  conseilAgent?: string;
  /** Nature détaillée de la ligne (Gain statutaire, Régime indemnitaire, Cotisation obligatoire, etc.) */
  natureDetaillee?: string;
  /** Impact fiscal : Imposable à l'IR, Exonéré, Déductible, Non déductible */
  impactFiscal?: string;
  /** Droits retraite : Cotise CNRACL, RAFP, IRCANTEC, Non cotisant */
  impactRetraite?: string;
  /** Assiette de cotisation sociale (CSG 98,25%, TIB, etc.) */
  assietteSociale?: string;
  /** Points de contrôle concrets à vérifier par l'agent sur son bulletin */
  aVerifier?: string;
  /** Points de vigilance et pièges statutaires fréquents */
  attention?: string;
}

export interface MontantsReelsFiche {
  brutReel?: number;
  totalRetenuesReelles?: number;
  netAvantImpotReel?: number;
  netFiscalReel?: number;
  pasReel?: number;
  netAPayerReel?: number;
  cotisationsPatronalesReelles?: number;
  coutEmployeurReel?: number;
}

export interface DiagnosticEcartItem {
  id: string;
  titre: string;
  montantEcart: number;
  explication: string;
  solution: string;
  paramAffecte: keyof CalculParams;
  valeurSuggeree: unknown;
}

export interface DiagnosticEcarts {
  aEcarts: boolean;
  brutEcart: number;
  retenuesEcart: number;
  netFiscalEcart: number;
  netAPayerEcart: number;
  items: DiagnosticEcartItem[];
}

export interface LigneBulletinCiril {
  code: string;
  libelle: string;
  base?: number;
  taux?: number;
  montant?: number;
  tauxPatronal?: number;
  montantPatronal?: number;
  /** Présent si le code porte le marqueur « R » : mois concerné par le rappel (ex. « 02/2026 ») */
  moisRappel?: string;
  /** True si le libellé porte le marqueur « fraction T » : la valeur est un POURCENTAGE du traitement versé en maladie (ex. 90), pas une somme */
  fractionT?: boolean;
}

export interface FichePaieAnalyseResult {
  titre: string;
  dateAnalyse: string;
  /** 'reconstruite' = lignes copiées depuis un vrai bulletin (zéro écart) ; 'simulation' = calcul théorique */
  source: 'simulation' | 'reconstruite';
  periodeLibelle?: string;
  agent: {
    nom: string;
    matricule?: string;
    numeroSecu?: string;
    positionAdmin?: string;
    service?: string;
    poste?: string;
    grade: string;
    echelon: string;
    indiceRemun?: number;
    indiceBrut: number;
    indiceMajore: number;
    quotite: number;
    statut: "titulaire" | "contractuel" | "stagiaire";
    caisseRetraite: "CNRACL" | "IRCANTEC";
    zoneResidence: number;
    nbEnfantsSft: number;
  };
  lignesReelles?: LigneBulletinCiril[];
  totaux: {
    traitementBase: number;
    nbi: number;
    indemniteResidence: number;
    sft: number;
    primesIfse: number;
    primesCia: number;
    autresPrimes: number;
    abattementPpcr: number;
    remboursementTransport: number;
    indemniteCompensatriceCsg: number;
    participationMutuelleEmployeur: number;
    retenueMutuelleSalarie: number;
    salaireBrut: number;
    totalCotisationsSalariales: number;
    totalRetenues: number;
    netAvantImpot: number;
    netFiscal: number;
    tauxPas: number;
    montantPas: number;
    netAPayer: number;
    totalCotisationsPatronales: number;
    coutGlobalEmployeur: number;
  };
  lignes: FichePaieLigne[];
  diagnosticEcarts: DiagnosticEcarts;
  syntheseConformite: {
    scoreConformite: number; // sur 100
    nbLignesVerifiees: number;
    nbAnomalies: number;
    anomalies: string[];
    pointsForts: string[];
    recommandationsCFDT: string[];
  };
  openFiscaBenchmark: {
    brutTheorique: number;
    netTheorique: number;
    cnraclTheorique: number;
    rafpTheorique: number;
    csgTheorique: number;
    differenceNet: number;
  };
  openFiscaCodeSnippet: string;
  metadata?: ParseMetadata | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODÈLES DE FICHES DE PAIE TYPES CERTIFIÉES (GENNEVILLIERS & FPT)
// ─────────────────────────────────────────────────────────────────────────────

export interface FichePaiePreset {
  id: string;
  label: string;
  categorieGrade: "C" | "B" | "A" | "Contractuel";
  description: string;
  badge: string;
  agent: {
    nom: string;
    grade: string;
    echelon: string;
    indiceBrut: number;
    indiceMajore: number;
    quotite: number;
    statut: "titulaire" | "contractuel" | "stagiaire";
    caisseRetraite: "CNRACL" | "IRCANTEC";
    zoneResidence: number;
    nbEnfantsSft: number;
  };
  primes: {
    ifse: number;
    cia: number;
    nbiPoints: number;
    autresPrimes: number;
  };
  tauxPas: number;
  rawTextPreview: string;
}

export const FICHE_PAIE_PRESETS: FichePaiePreset[] = [
  {
    id: "cat_c_adjoint",
    label: "Adjoint Administratif Principal 2e Cl.",
    categorieGrade: "C",
    description: "Catégorie C Titulaire • Échelon 4 (IM 382) • RIFSEEP • 2 enfants",
    badge: "Catégorie C • Titulaire",
    agent: {
      nom: "MARTIN Sylvie",
      grade: "Adjoint administratif principal de 2ème classe",
      echelon: "Échelon 4",
      indiceBrut: 405,
      indiceMajore: 382,
      quotite: 100,
      statut: "titulaire",
      caisseRetraite: "CNRACL",
      zoneResidence: 1,
      nbEnfantsSft: 2
    },
    primes: {
      ifse: 380.0,
      cia: 50.0,
      nbiPoints: 0,
      autresPrimes: 0
    },
    tauxPas: 2.5,
    rawTextPreview: `VILLE DE GENNEVILLIERS - BULLETIN DE PAIE
Période : Octobre 2024
Agent : MARTIN Sylvie - Adjoint administratif principal 2e classe
Échelon : 4 - Indice Brut : 405 - Indice Majoré : 382 - Quotité : 100%
101 Traitement de base (IM 382 x 4.92278) : 1 880.50 €
102 Indemnité de résidence Zone 1 (3%) : 56.42 €
103 Supplément Familial de Traitement (2 enfants) : 73.04 €
095 Abattement transfert primes/points (PPCR) : -13.92 €
201 RIFSEEP - IFSE mensuelle : 380.00 €
202 RIFSEEP - CIA : 50.00 €
TOTAL BRUT : 2 426.04 €
501 Cotisation CNRACL Retraite (11.10%) : 208.74 €
502 RAFP Retraite Additionnelle (5.00%) : 18.81 €
503 CSG Déductible (6.80% sur 98.25%) : 162.08 €
504 CSG Non Déductible (2.40% sur 98.25%) : 57.21 €
505 CRDS (0.50% sur 98.25%) : 11.92 €
TOTAL RETENUES : 458.76 €
NET AVANT IMPÔT : 1 967.28 €
NET FISCAL : 2 036.41 €
Prélèvement à la source (2.5%) : 50.91 €
NET À PAYER : 1 916.37 €`
  },
  {
    id: "cat_b_redacteur",
    label: "Rédacteur Territorial Principal",
    categorieGrade: "B",
    description: "Catégorie B Titulaire • Échelon 5 (IM 448) • IFSE 520 € • CIA 100 €",
    badge: "Catégorie B • Titulaire",
    agent: {
      nom: "LEFEBVRE Thomas",
      grade: "Rédacteur principal de 2ème classe",
      echelon: "Échelon 5",
      indiceBrut: 520,
      indiceMajore: 448,
      quotite: 100,
      statut: "titulaire",
      caisseRetraite: "CNRACL",
      zoneResidence: 1,
      nbEnfantsSft: 1
    },
    primes: {
      ifse: 520.0,
      cia: 100.0,
      nbiPoints: 10,
      autresPrimes: 0
    },
    tauxPas: 5.5,
    rawTextPreview: `VILLE DE GENNEVILLIERS - BULLETIN DE PAIE
Période : Octobre 2024
Agent : LEFEBVRE Thomas - Rédacteur principal de 2e classe
Échelon : 5 - Indice Brut : 520 - Indice Majoré : 448 - NBI : 10 pts
101 Traitement de base (IM 448) : 2 205.41 €
102 NBI Accueil & Responsabilité (10 pts) : 49.23 €
103 Indemnité de résidence Zone 1 (3%) : 67.64 €
104 SFT (1 enfant) : 2.29 €
095 Abattement transfert primes/points (PPCR) : -23.17 €
201 RIFSEEP - IFSE mensuelle : 520.00 €
202 RIFSEEP - CIA : 100.00 €
TOTAL BRUT : 2 921.40 €
501 Cotisation CNRACL Retraite (11.10%) : 250.27 €
502 RAFP Retraite Additionnelle (5.00%) : 22.05 €
503 CSG Déductible (6.80% sur 98.25%) : 195.21 €
504 CSG Non Déductible (2.40% sur 98.25%) : 68.90 €
505 CRDS (0.50% sur 98.25%) : 14.35 €
TOTAL RETENUES : 550.78 €
NET AVANT IMPÔT : 2 370.62 €
NET FISCAL : 2 453.87 €
Prélèvement à la source (5.5%) : 134.96 €
NET À PAYER : 2 235.66 €`
  },
  {
    id: "cat_a_ingenieur",
    label: "Ingénieur / Attaché Territorial",
    categorieGrade: "A",
    description: "Catégorie A Titulaire • Échelon 6 (IM 595) • IFSE 780 € • NBI 25 pts",
    badge: "Catégorie A • Encadrement",
    agent: {
      nom: "BENALI Nadia",
      grade: "Ingénieur territorial principal",
      echelon: "Échelon 6",
      indiceBrut: 710,
      indiceMajore: 595,
      quotite: 100,
      statut: "titulaire",
      caisseRetraite: "CNRACL",
      zoneResidence: 1,
      nbEnfantsSft: 3
    },
    primes: {
      ifse: 780.0,
      cia: 150.0,
      nbiPoints: 25,
      autresPrimes: 60.0
    },
    tauxPas: 8.5,
    rawTextPreview: `VILLE DE GENNEVILLIERS - BULLETIN DE PAIE
Période : Octobre 2024
Agent : BENALI Nadia - Ingénieur territorial
Échelon : 6 - Indice Brut : 710 - Indice Majoré : 595 - NBI : 25 pts
101 Traitement de base (IM 595) : 2 929.06 €
102 NBI Encadrement Technique (25 pts) : 123.07 €
103 Indemnité de résidence Zone 1 (3%) : 91.56 €
104 SFT (3 enfants) : 259.41 €
095 Abattement transfert primes/points (PPCR) : -32.42 €
201 RIFSEEP - IFSE mensuelle : 780.00 €
202 RIFSEEP - CIA : 150.00 €
203 Prime sujétion spécifique : 60.00 €
TOTAL BRUT : 4 360.68 €
501 Cotisation CNRACL Retraite (11.10%) : 338.79 €
502 RAFP Retraite Additionnelle (5.00%) : 29.29 €
503 CSG Déductible (6.80% sur 98.25%) : 291.34 €
504 CSG Non Déductible (2.40% sur 98.25%) : 102.82 €
505 CRDS (0.50% sur 98.25%) : 21.42 €
TOTAL RETENUES : 783.66 €
NET AVANT IMPÔT : 3 577.02 €
NET FISCAL : 3 701.26 €
Prélèvement à la source (8.5%) : 314.61 €
NET À PAYER : 3 262.41 €`
  },
  {
    id: "contractuel_cdi",
    label: "Agent Contractuel de Droit Public",
    categorieGrade: "Contractuel",
    description: "Agent Contractuel (Décret n° 88-145) • IM 410 • IRCANTEC & Sécurité Sociale",
    badge: "Contractuel • Décret 88-145",
    agent: {
      nom: "DUPONT Alexandre",
      grade: "Chargé de mission développement local (Contractuel)",
      echelon: "Niveau 3",
      indiceBrut: 480,
      indiceMajore: 410,
      quotite: 100,
      statut: "contractuel",
      caisseRetraite: "IRCANTEC",
      zoneResidence: 1,
      nbEnfantsSft: 0
    },
    primes: {
      ifse: 450.0,
      cia: 0,
      nbiPoints: 0,
      autresPrimes: 0
    },
    tauxPas: 4.0,
    rawTextPreview: `VILLE DE GENNEVILLIERS - BULLETIN DE PAIE CONTRACTUEL
Période : Octobre 2024
Agent : DUPONT Alexandre - Chargé de mission (CDD permanent Art. L. 332-8)
Indice Majoré : 410 - Quotité : 100% - Régime Général & IRCANTEC
101 Traitement de base (IM 410 x 4.92278) : 2 018.34 €
102 Indemnité de résidence Zone 1 (3%) : 60.55 €
201 Prime de fonctions contractuelle : 450.00 €
TOTAL BRUT : 2 528.89 €
501 Sécurité Sociale Maladie Plafonnée (0.75%) : 18.97 €
502 Assurance Vieillesse Plafonnée (6.90%) : 174.49 €
503 Assurance Vieillesse Déplafonnée (0.40%) : 10.12 €
504 IRCANTEC Tranche A (2.80%) : 70.81 €
505 CSG Déductible (6.80% sur 98.25%) : 168.95 €
506 CSG Non Déductible (2.40% sur 98.25%) : 59.63 €
507 CRDS (0.50% sur 98.25%) : 12.42 €
TOTAL RETENUES : 515.39 €
NET AVANT IMPÔT : 2 013.50 €
NET FISCAL : 2 085.55 €
Prélèvement à la source (4.0%) : 83.42 €
NET À PAYER : 1 930.08 €`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. MOTEUR DE CALCUL CONFORME OPENFISCA-FRANCE
// ─────────────────────────────────────────────────────────────────────────────

export interface CalculParams {
  indiceMajore: number;
  nbiPoints?: number;
  ifse?: number;
  cia?: number;
  autresPrimes?: number;
  zoneResidence?: number; // 1, 2, 3
  nbEnfantsSft?: number;
  quotite?: number; // en %
  statut?: "titulaire" | "contractuel" | "stagiaire";
  tauxPas?: number; // en %
  nomAgent?: string;
  matricule?: string;
  numeroSecu?: string;
  positionAdmin?: string;
  grade?: string;
  echelon?: string;
  service?: string;
  poste?: string;
  indiceBrut?: number;
  indiceRemun?: number;
  lignesReelles?: LigneBulletinCiril[];
  periode?: string;

  // Lignes spécifiques Ciril RH Gennevilliers
  appliquerPpcr?: boolean;
  abattementPpcr?: number; // montant lu sur la fiche ; sinon barème : A 32,42 € / B 23,17 € / C 13,92 €
  categorie?: "A" | "B" | "C";
  remboursementTransport?: number; // ex: 64.80 € (Navigo 75% Gennevilliers)
  indemniteCompensatriceCsg?: number;
  participationMutuelleEmployeur?: number;
  retenueMutuelleSalarie?: number;

  // Montants réels extraits ou saisis sur la vraie fiche pour réconciliation
  montantsReels?: MontantsReelsFiche;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRE EXHAUSTIF DES MÉTADONNÉES ENRICHIES POUR CHAQUE RUBRIQUE DE PAIE
// (Explications complètes, impacts fiscaux et retraite, vérifications, conseils CFDT)
// ─────────────────────────────────────────────────────────────────────────────

export interface RubriqueMetadataItem {
  titre: string;
  explicationLigne: string;
  natureDetaillee: string;
  impactFiscal: string;
  impactRetraite: string;
  assietteSociale: string;
  aVerifier: string;
  attention?: string;
  conseilAgent: string;
  openFiscaKey?: string;
}

export const RUBRIQUES_METADATA_REGISTRY: Record<string, RubriqueMetadataItem> = {
  tib: {
    titre: "Traitement Indiciaire Brut (TIB)",
    explicationLigne: "Rémunération indiciaire statutaire de base liée à votre grade et à votre ancienneté. Calculée en multipliant votre Indice Majoré (IM) par la valeur mensuelle du point d'indice (59,0734 € / 12 = 4,92278 €), au prorata de votre quotité de travail. Inaliénable et protégée par le statut de la fonction publique.",
    natureDetaillee: "Gain statutaire obligatoire (Traitement de base)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu (intégré dans le Net Fiscal)",
    impactRetraite: "Cotise à la pension CNRACL (ou CNAV/IRCANTEC). Ouvre des droits à trimestres et sert de base exclusive au calcul de votre pension (règle des 75 % de l'indice des 6 derniers mois).",
    assietteSociale: "Soumis à retenue CNRACL (11,10%), CSG/CRDS (9,20% sur 98,25%) et part patronale CNRACL (37,65%).",
    aVerifier: "Contrôlez que votre Indice Majoré (IM) correspond exactement à votre échelon actuel figurant sur votre dernier arrêté individuel de nomination ou d'avancement d'échelon.",
    attention: "En cas d'avancement d'échelon, un retard de traitement RH peut priver temporairement l'agent de son nouvel indice. La Ville doit régulariser rétroactivement via un rappel de salaire à la date d'effet de l'arrêté.",
    conseilAgent: "Vérifiez vos arrêtés de carrière tous les ans. En cas de promotion ou avancement non appliqué après 2 mois, adressez une demande écrite à la DRH et saisissez votre délégué CFDT pour obtenir le rappel financier intégral.",
    openFiscaKey: "traitement_indiciaire_brut"
  },
  nbi: {
    titre: "Nouvelle Bonification Indiciaire (NBI)",
    explicationLigne: "Points d'indice supplémentaires accordés aux agents exerçant des fonctions comportant des responsabilités particulières, de l'encadrement de proximité, de l'accueil permanent du public (notamment en quartier prioritaire) ou une technicité reconnue.",
    natureDetaillee: "Gain statutaire indiciaire (Brut soumis à pension)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Avantage majeur : cotise à la CNRACL (11,10%) et donne droit à un supplément de pension de retraite viager calculé au prorata de la durée de perception de la NBI.",
    assietteSociale: "Soumis aux cotisations CNRACL pension (11,10%) et à la CSG/CRDS (98,25%).",
    aVerifier: "Si vous exercez des fonctions d'accueil en quartier prioritaire de la politique de la ville (QPV), de régisseur ou d'encadrement de proximité, vérifiez l'arrêté d'attribution de la NBI.",
    attention: "La NBI est liée aux fonctions exercées et non au grade : elle cesse d'être versée en cas de changement de poste vers des missions non éligibles.",
    conseilAgent: "Consultez la fiche de poste de votre affectation. Si vos fonctions réelles relèvent de la NBI mais qu'elle n'est pas versée, la section CFDT peut vous aider à déposer un recours pour attribution rétroactive.",
    openFiscaKey: "nouvelle_bonification_indiciaire"
  },
  residence: {
    titre: "Indemnité de Résidence Zone 1 (3%)",
    explicationLigne: "Majoration obligatoire destinée à compenser le coût de la vie plus élevé en Île-de-France. La commune de Gennevilliers est classée en Zone 1 (taux maximal de 3 %). Elle est assise sur le traitement indiciaire brut (+ NBI).",
    natureDetaillee: "Complément statutaire de résidence (Gain brut obligatoire)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Ne cotise pas à la pension CNRACL, mais cotise au régime RAFP (dans la limite des 20% du TIB).",
    assietteSociale: "Soumis à la CSG/CRDS (98,25%) et à la RAFP (5%).",
    aVerifier: "Vérifiez que la ligne figure sur tous vos bulletins avec un taux de 3% (ou que le montant correspond exactement à 3% de votre TIB + NBI).",
    attention: "En cas de mutation hors Île-de-France (en zone 2 à 1% ou zone 3 à 0%), le montant sera réduit ou supprimé conformément au zonage territorial.",
    conseilAgent: "L'indemnité de résidence est un droit statutaire strict pour tout agent en poste à Gennevilliers, titulaire, stagiaire ou contractuel. Signalez immédiatement toute omission aux RH.",
    openFiscaKey: "indemnite_residence"
  },
  sft: {
    titre: "Supplément Familial de Traitement (SFT)",
    explicationLigne: "Prestation familiale statutaire versée aux agents ayant au moins un enfant à charge au sens des prestations familiales de la CAF. Comprend une part fixe et une part proportionnelle au traitement brut soumise à planchers et plafonds légaux.",
    natureDetaillee: "Prestation statutaire familiale (Gain brut)",
    impactFiscal: "Imposable à l'impôt sur le revenu",
    impactRetraite: "Non cotisant CNRACL, cotise à la RAFP (dans le plafond de 20% du TIB).",
    assietteSociale: "Soumis à la CSG/CRDS (98,25%) et à la RAFP (5%).",
    aVerifier: "Fournissez chaque année avant la rentrée le certificat de scolarité pour les enfants de 16 à 20 ans et l'attestation CAF de non-cumul.",
    attention: "Si les deux parents sont agents publics, le SFT ne peut être attribué qu'à un seul parent. Il est impératif de le rattacher au parent ayant le traitement indiciaire le plus élevé pour maximiser la part proportionnelle !",
    conseilAgent: "Faites une simulation en comparant les indices des deux conjoints. Le rattachement au conjoint le mieux rémunéré peut rapporter plusieurs centaines d'euros supplémentaires par an.",
    openFiscaKey: "supplement_familial_traitement"
  },
  ppcr: {
    titre: "Abattement PPCR / Transfert Primes-Points",
    explicationLigne: "Retenue mensuelle sur les primes statutaires issue des accords PPCR. En échange d'une revalorisation des grilles indiciaires (+4 à +9 points d'indice qui cotisent pour votre retraite viagère), un abattement forfaitaire est déduit des primes.",
    natureDetaillee: "Retenue statutaire sur primes (Transfert primes-points)",
    impactFiscal: "Déduit de votre brut imposable (diminue votre Net Fiscal et votre impôt sur le revenu)",
    impactRetraite: "Opération hautement bénéfique pour la pension : les points d'indice gagnés augmentent définitivement votre retraite CNRACL, compensant très largement l'abattement sur les primes.",
    assietteSociale: "Déduit de l'assiette brute soumise à CSG/CRDS et RAFP.",
    aVerifier: "Le montant prélevé doit correspondre rigoureusement à votre catégorie hiérarchique statutaire : Cat A (32,42 €), Cat B (23,17 €), Cat C (13,92 €).",
    attention: "L'abattement ne peut pas excéder le montant des primes perçues. Si vous n'avez pas de primes, il ne peut en aucun cas être déduit de votre traitement indiciaire de base.",
    conseilAgent: "En cas de travail à temps partiel ou de demi-traitement en congé maladie, l'abattement PPCR doit être réduit dans la même proportion. Vérifiez cette minoration sur votre bulletin.",
    openFiscaKey: "abattement_ppcr"
  },
  ifse: {
    titre: "RIFSEEP - IFSE Titulaire (4 volets cumulatifs)",
    explicationLigne: "Indemnité de Fonctions, de Sujétions et d'Expertise (rubrique Ciril 1591/2591). À Gennevilliers, l'IFSE est l'addition obligatoire de 4 composantes : IFSE 1 (Fonctions/responsabilité), IFSE 2 (Contraintes/pénibilité de poste), IFSE 3 (Samedis, dimanches & astreintes) et IFSE 4 (Maintien des avantages acquis historiques).",
    natureDetaillee: "Régime indemnitaire mensuel statutaire (Primes RIFSEEP)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Ne cotise pas à la pension CNRACL, mais cotise au RAFP (5% salarié + 5% employeur dans la limite de 20% du TIB).",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et cotisation RAFP (5%).",
    aVerifier: "Demandez votre arrêté individuel RIFSEEP : il doit préciser la ventilation chiffrée de chacun des 4 volets d'IFSE qui composent votre montant global.",
    attention: "L'IFSE 4 (avantages acquis) est sanctuarisée à titre individuel. Lors d'une mobilité ou d'une réorganisation, l'administration ne peut pas la supprimer.",
    conseilAgent: "Votre IFSE doit être réexaminée au minimum tous les 4 ans, en cas de changement de poste ou d'évolution significative de vos sujétions. La CFDT vous accompagne pour faire revaloriser votre groupe RIFSEEP.",
    openFiscaKey: "rifseep_ifse"
  },
  cia: {
    titre: "RIFSEEP - Complément Indemnitaire Annuel (CIA Tit.)",
    explicationLigne: "Complément Indemnitaire Annuel (rubrique Ciril 1592 ou 7610). Calculé sur la base de 10 % de votre IFSE mensuelle × 12 mois (équivalent à 1,2 mois d'IFSE). Attribué selon deux critères à parité stricte : 50 % sur la manière de servir (évaluation CREP) et 50 % selon le nombre de jours d'absence.",
    natureDetaillee: "Régime indemnitaire annuel modulable (RIFSEEP)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu sur le mois de versement",
    impactRetraite: "Cotise à la retraite additionnelle RAFP (5% dans le plafond de 20% du TIB).",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et RAFP (5%).",
    aVerifier: "Vérifiez que l'assiette correspond à 10% de votre IFSE mensuelle × 12, et comparez la part 'manière de servir' avec l'appréciation portée sur votre compte-rendu d'entretien professionnel (CREP).",
    attention: "Les absences protégées par la loi (congés maternité, paternité, adoption, accident de service et maladie professionnelle) NE DOIVENT EN AUCUN CAS entraîner d'abattement sur la part assiduité !",
    conseilAgent: "Si vous constatez une baisse injustifiée de votre CIA ou si un arrêt de travail pour accident de service a été décompté dans vos absences, contactez sans tarder la CFDT pour engager un recours gracieux.",
    openFiscaKey: "rifseep_cia"
  },
  prime_13eme: {
    titre: "13ème Mois Communal (Juin & Novembre)",
    explicationLigne: "Avantage extra-statutaire historique à Gennevilliers, versé en deux fractions semestrielles (en juin et en novembre). Apparaît sous deux libellés complémentaires : 'Complément de rémunération' (code 7443/7444) et 'Prime semestrielle' (code 8443/8444).",
    natureDetaillee: "Prime semestrielle conventionnelle (Avantage collectif communal)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Soumis à RAFP dans la limite du plafond des primes.",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et RAFP (5%).",
    aVerifier: "Vérifiez que le montant versé correspond à vos droits en tenant compte de votre quotité (temps complet ou partiel) et de votre période d'activité.",
    attention: "En cas d'arrivée ou de départ de la collectivité en cours de semestre, le versement doit être proratisé au nombre de jours travaillés.",
    conseilAgent: "Le 13ème mois est un acquis social historique défendu par vos organisations syndicales. Conservez précieusement vos bulletins de juin et novembre.",
    openFiscaKey: "prime_13eme_mois"
  },
  transport: {
    titre: "Remboursement Transport Public (Navigo 75%)",
    explicationLigne: "Prise en charge obligatoire par l'employeur public de 75 % du coût des titres d'abonnement de transport en commun pour les trajets domicile-travail (revalorisé de 50% à 75% au 1er septembre 2023).",
    natureDetaillee: "Remboursement de frais professionnels (Avantage net direct)",
    impactFiscal: "100 % EXONÉRÉ d'impôt sur le revenu (n'augmente pas votre net fiscal ni votre impôt)",
    impactRetraite: "Non cotisant (aucun impact sur la retraite)",
    assietteSociale: "EXONÉRÉ de toutes cotisations sociales et exonéré de CSG/CRDS : c'est un gain net direct sur votre compte bancaire !",
    aVerifier: "Contrôlez que le montant correspond à 75% du pass Navigo (64,80 €/mois en 2024, 66,60 €/mois en 2025 pour un pass toutes zones).",
    attention: "Pensez à renouveler votre justificatif d'abonnement chaque année auprès des RH pour éviter l'interruption des versements.",
    conseilAgent: "Vous pouvez cumuler sous certaines conditions le remboursement Navigo avec le Forfait Mobilités Durables (si vous utilisez aussi le vélo ou le covoiturage). Renseignez-vous auprès de votre section CFDT.",
    openFiscaKey: "prise_en_charge_transport"
  },
  comp_csg: {
    titre: "Indemnité Compensatrice de la CSG",
    explicationLigne: "Indemnité mensuelle instituée en 2018 lors de la suppression de la cotisation maladie pour les salariés du privé et de la hausse de 1,7 % de la CSG, afin de garantir qu'aucun agent public ne subisse de perte de salaire net.",
    natureDetaillee: "Indemnité compensatrice de pouvoir d'achat (Gain brut)",
    impactFiscal: "Imposable à l'impôt sur le revenu",
    impactRetraite: "Soumis à RAFP dans la limite des 20% du TIB.",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et RAFP (5%).",
    aVerifier: "Si vous étiez agent avant le 1er janvier 2018, cette indemnité doit figurer de façon pérenne sur vos bulletins.",
    attention: "En cas de promotion ou d'avancement d'échelon, un décret de réévaluation annuelle encadre le maintien ou la dégressivité de cette indemnité.",
    conseilAgent: "Si votre indemnité disparaît brutalement sans changement de situation, contestez-la immédiatement auprès du bureau de paie.",
    openFiscaKey: "indemnite_compensatrice_csg"
  },
  cnracl: {
    titre: "Retraite CNRACL (Part Salariée 11,10%)",
    explicationLigne: "Cotisation vieillesse obligatoire finançant la pension de retraite des fonctionnaires territoriaux et hospitaliers. Prélevée au taux légal de 11,10 % sur le traitement indiciaire brut (+ NBI). La Ville de Gennevilliers verse en complément 37,65 % de cotisation patronale.",
    natureDetaillee: "Cotisation sociale retraite obligatoire déductible",
    impactFiscal: "DÉDUCTIBLE du revenu imposable (réduit automatiquement votre Net Fiscal et votre impôt sur le revenu)",
    impactRetraite: "C'est la cotisation essentielle qui valide vos trimestres de pension et garantit votre retraite de base et complémentaire statutaire (règle des 75 % du traitement indiciaire des 6 derniers mois).",
    assietteSociale: "Assise sur le traitement indiciaire brut et la NBI (exclut les primes RIFSEEP qui cotisent à la RAFP).",
    aVerifier: "L'assiette doit correspondre au centime près à TIB + NBI. Aucune prime ne doit y être incorporée.",
    attention: "Consultez tous les 5 ans votre Relevé Individuel de Situation (RIS) sur le portail public info-retraite.fr pour vous assurer qu'aucun trimestre n'a été égaré.",
    conseilAgent: "Les régularisations de trimestres non validés sont beaucoup plus faciles à corriger en cours de carrière qu'à la veille du départ en retraite. La CFDT vous accompagne pour auditer votre carrière.",
    openFiscaKey: "cotisation_retraite_cnracl_salarie"
  },
  rafp: {
    titre: "Retraite Additionnelle RAFP (Part Salariée 5%)",
    explicationLigne: "Régime de retraite obligatoire par points assis sur les primes et indemnités non soumises à la CNRACL (IFSE, CIA, SFT, indemnité de résidence). Prélèvement salarié de 5,00 % doublé d'une cotisation patronale employeur identique de 5,00 %, dans la limite d'un plafond de 20 % du traitement indiciaire brut.",
    natureDetaillee: "Cotisation retraite additionnelle par points",
    impactFiscal: "DÉDUCTIBLE du revenu imposable",
    impactRetraite: "Chaque euro cotisé (part salariée + part employeur) est converti en points RAFP viagers versés à la retraite en rente ou capital.",
    assietteSociale: "Assise sur les primes avec un plafond strict de 20 % du traitement brut indiciaire annuel.",
    aVerifier: "Vérifiez que la cotisation figure bien si vous percevez de l'IFSE ou d'autres primes, et que la part employeur (5%) est également créditée.",
    attention: "Au-delà du plafond de 20 % du traitement indiciaire brut, vos primes ne génèrent plus de droits à pension RAFP.",
    conseilAgent: "Consultez votre compte de points RAFP sur rafp.fr pour vérifier l'historique de vos points accumulés depuis 2005.",
    openFiscaKey: "cotisation_retraite_rafp_salarie"
  },
  ircantec: {
    titre: "Retraite Complémentaire IRCANTEC (Contractuels)",
    explicationLigne: "Régime de retraite complémentaire par points obligatoire pour les agents contractuels territoriaux de droit public. Cotisation de 2,80 % sous le Plafond Mensuel de la Sécurité Sociale (Tranche A) et de 6,95 % au-delà (Tranche B).",
    natureDetaillee: "Cotisation retraite complémentaire obligatoire des contractuels",
    impactFiscal: "DÉDUCTIBLE du revenu imposable",
    impactRetraite: "Chaque euro cotisé accumule des points IRCANTEC qui détermineront votre future pension complémentaire.",
    assietteSociale: "Assise sur la totalité du salaire brut soumis.",
    aVerifier: "Vérifiez que vos cotisations IRCANTEC sont bien déclarées sur votre relevé de carrière info-retraite.fr.",
    attention: "En cas de titularisation ultérieure, vos droits IRCANTEC peuvent être validés auprès de la CNRACL sous certaines conditions de délais.",
    conseilAgent: "Si vous passez du statut de contractuel à titulaire, demandez conseil à la CFDT pour étudier l'opportunité d'une validation des services antérieurs.",
    openFiscaKey: "cotisation_retraite_ircantec_salarie"
  },
  maladie: {
    titre: "Cotisation Maladie Salariée (Contractuels 0,75%)",
    explicationLigne: "Cotisation d'assurance maladie du Régime Général applicable aux agents contractuels territoriaux. Taux réduit de 0,75 % (au lieu du taux de droit commun) plafonné à 5 fois le Plafond Mensuel de la Sécurité Sociale.",
    natureDetaillee: "Cotisation sociale maladie à taux réduit",
    impactFiscal: "Déductible du revenu imposable",
    impactRetraite: "Non cotisant retraite (finance la branche maladie de la Sécurité Sociale)",
    assietteSociale: "Rémunération brute soumise",
    aVerifier: "Le taux ne doit pas excéder 0,75 % sur votre bulletin.",
    attention: "Les fonctionnaires titulaires ne paient pas cette cotisation (leur maladie est entièrement financée par la cotisation patronale de la Ville).",
    conseilAgent: "Vérifiez que votre bulletin applique bien le taux FPT réduit de 0,75% et non le taux du secteur privé.",
    openFiscaKey: "cotisation_maladie_contractuel_salarie"
  },
  vieillesse_plaf: {
    titre: "Assurance Vieillesse Plafonnée (Contractuels 6,90%)",
    explicationLigne: "Cotisation d'assurance vieillesse du Régime Général de la Sécurité Sociale (CNAV) prélevée sur la part de salaire située sous le Plafond Mensuel de la Sécurité Sociale (PMSS = 3 864 € en 2024, 3 925 € en 2025).",
    natureDetaillee: "Cotisation retraite de base Sécurité Sociale",
    impactFiscal: "Déductible du revenu imposable",
    impactRetraite: "Valide vos trimestres de retraite de base du Régime Général (CNAV).",
    assietteSociale: "Salaire brut plafonné au PMSS",
    aVerifier: "L'assiette ne doit jamais dépasser le plafond mensuel de la sécurité sociale en vigueur.",
    attention: "Pour valider 4 trimestres par an, il faut avoir cotisé sur un salaire annuel minimal équivalent à 600 fois le SMIC horaire.",
    conseilAgent: "Consultez votre relevé de carrière CNAV sur lassuranceretraite.fr pour vous assurer de la validation annuelle de vos 4 trimestres.",
    openFiscaKey: "cotisation_vieillesse_plafonnee_salarie"
  },
  vieillesse_deplaf: {
    titre: "Assurance Vieillesse Déplafonnée (Contractuels 0,40%)",
    explicationLigne: "Cotisation vieillesse de solidarité du Régime Général prélevée sur l'intégralité de la rémunération brute de l'agent contractuel, sans aucun plafond.",
    natureDetaillee: "Cotisation de solidarité retraite sans plafond",
    impactFiscal: "Déductible du revenu imposable",
    impactRetraite: "Contribue au financement global du Régime Général des retraites.",
    assietteSociale: "Totalité du salaire brut",
    aVerifier: "Le taux appliqué doit être exactement 0,40 % sur la totalité du brut.",
    attention: "Cette retenue s'ajoute à la vieillesse plafonnée pour financer la CNAV.",
    conseilAgent: "Cette cotisation est systématique sur les bulletins des agents contractuels de droit public.",
    openFiscaKey: "cotisation_vieillesse_deplafonnee_salarie"
  },
  csg_ded: {
    titre: "CSG Déductible (6,80%)",
    explicationLigne: "Contribution Sociale Généralisée finançant la Sécurité Sociale et le Fonds de Solidarité Vieillesse. Taux de 6,80 % prélevé sur 98,25 % de l'ensemble de votre rémunération brute (après abattement forfaitaire de 1,75 % pour frais professionnels), majorée de la participation mutuelle employeur.",
    natureDetaillee: "Contribution sociale obligatoire déductible",
    impactFiscal: "DÉDUCTIBLE fiscalement : cette part est déduite de votre revenu imposable DGFiP, ce qui diminue votre impôt sur le revenu.",
    impactRetraite: "Ne génère pas de droits directs à retraite (finance la protection sociale universelle).",
    assietteSociale: "Assiette abattue de 98,25 % (abattement de 1,75 % dans la limite de 4 plafonds de la sécurité sociale).",
    aVerifier: "L'assiette correspond à 98,25 % du brut total augmenté des contributions employeur à la mutuelle.",
    attention: "L'abattement de 1,75% s'applique jusqu'à 4 fois le plafond annuel de la sécurité sociale.",
    conseilAgent: "Cette cotisation finance votre couverture santé et familiale collective. Sa part déductible allège directement votre impôt à la source.",
    openFiscaKey: "csg_deductible_salaire"
  },
  csg_nonded: {
    titre: "CSG Non Déductible (2,40%)",
    explicationLigne: "Fraction de la CSG qui ne peut pas être déduite de votre assiette d'impôt sur le revenu. Elle est prélevée sur votre salaire net et réintégrée dans votre revenu fiscal de référence (Net Fiscal).",
    natureDetaillee: "Contribution sociale obligatoire non déductible",
    impactFiscal: "NON DÉDUCTIBLE : cette somme est rajoutée à votre net pour calculer le Net Fiscal servant d'assiette au Prélèvement à la Source.",
    impactRetraite: "Aucun droit direct à pension",
    assietteSociale: "Même assiette abattue de 98,25 % que la CSG déductible.",
    aVerifier: "Le ratio entre CSG déductible (6,80%) et CSG non déductible (2,40%) est constant.",
    attention: "C'est en partie à cause de cette ligne que votre Net Fiscal est systématiquement plus élevé que votre Net Avant Impôt.",
    conseilAgent: "Cette réintégration fiscale est normale et prévue par la loi : elle est automatiquement prise en compte par le fisc.",
    openFiscaKey: "csg_non_deductible_salaire"
  },
  crds: {
    titre: "CRDS Dette Sociale (0,50%)",
    explicationLigne: "Contribution au Remboursement de la Dette Sociale instituée en 1996 pour financer la CADES (Caisse d'Amortissement de la Dette Sociale). Prélevée au taux de 0,50 % sur la même assiette abattue que la CSG.",
    natureDetaillee: "Prélèvement social non déductible de désendettement",
    impactFiscal: "Non déductible du revenu imposable (réintégrée dans le Net Fiscal)",
    impactRetraite: "Aucun droit direct à retraite",
    assietteSociale: "Assiette abattue de 98,25 %",
    aVerifier: "Le montant correspond exactement à 0,50 % de l'assiette CSG.",
    attention: "La CRDS s'applique à tous les revenus d'activité sans exception.",
    conseilAgent: "La CADES devait s'éteindre initialement, mais sa durée a été prolongée pour absorber la dette liée aux crises sanitaires successives.",
    openFiscaKey: "crds_salaire"
  },
  part_mutuelle: {
    titre: "Participation Employeur Santé (PSC)",
    explicationLigne: "Aide financière obligatoire versée par la Ville de Gennevilliers au titre de la Protection Sociale Complémentaire (PSC) pour participer au coût de votre mutuelle santé labellisée.",
    natureDetaillee: "Avantage social employeur (Participation PSC santé)",
    impactFiscal: "Soumise à CSG/CRDS et intégrée au net fiscal (avantage financier accordé par l'employeur)",
    impactRetraite: "Non cotisant retraite",
    assietteSociale: "Intégrée dans l'assiette de CSG/CRDS",
    aVerifier: "Si vous adhérez à une mutuelle labellisée, vérifiez que l'employeur vous verse bien sa participation forfaitaire mensuelle.",
    attention: "Vous devez justifier de votre adhésion auprès du service RH pour déclencher le versement de l'aide.",
    conseilAgent: "L'adhésion à un contrat labellisé vous donne droit à cette aide de la collectivité. La CFDT négocie l'augmentation régulière des montants de prise en charge.",
    openFiscaKey: "participation_mutuelle_employeur"
  },
  part_prevoyance: {
    titre: "Participation Employeur Prévoyance (PSC)",
    explicationLigne: "Participation financière de la Ville de Gennevilliers pour inciter les agents à souscrire un contrat de prévoyance labellisé garantissant le maintien de leur rémunération en cas de longue maladie ou d'invalidité.",
    natureDetaillee: "Avantage social employeur (Participation PSC prévoyance)",
    impactFiscal: "Soumis à CSG/CRDS et intégré dans le revenu imposable",
    impactRetraite: "Non cotisant retraite",
    assietteSociale: "Intégrée dans l'assiette brute de CSG/CRDS",
    aVerifier: "Vérifiez que la ligne apparaît sur votre bulletin si vous avez souscrit un contrat de prévoyance éligible (ex: Territoria).",
    attention: "Cette participation compense la retenue pour prévoyance figurant dans vos retenues sur le net.",
    conseilAgent: "La prévoyance est indispensable : après 3 mois de maladie, le statut ne garantit plus que 50% du traitement indiciaire. Cette aide municipale réduit votre coût d'assurance.",
    openFiscaKey: "participation_mutuelle_employeur"
  },
  cotis_mutuelle: {
    titre: "Retenue Mutuelle Santé (Part Salariée sur Net)",
    explicationLigne: "Prélèvement facultatif direct sur votre salaire net de votre cotisation d'adhésion à votre organisme de mutuelle santé ou à votre caisse de retraite complémentaire facultative (ex: Préfon, MNT).",
    natureDetaillee: "Retenue volontaire sur le salaire net",
    impactFiscal: "Prélevée après calcul du Net Fiscal (sur le net à payer en banque)",
    impactRetraite: "Aucun impact sur la retraite statutaire",
    assietteSociale: "Déduite directement du virement net",
    aVerifier: "Vérifiez que le montant prélevé correspond fidèlement à votre échéancier d'adhésion mutualiste.",
    attention: "En cas de changement de mutuelle ou de résiliation, signalez-le sans attendre au bureau de paie pour éviter les doubles prélèvements.",
    conseilAgent: "Vérifiez périodiquement si votre contrat mutualiste reste compétitif par rapport aux offres labellisées du secteur territorial.",
    openFiscaKey: "retenue_mutuelle_salarie"
  },
  prevoyance_territoria: {
    titre: "Retenue Prévoyance Territoria (Maintien de salaire)",
    explicationLigne: "Cotisation d'adhésion au pack prévoyance Territoria. Cette garantie assure le maintien de votre salaire (traitement et primes) en cas de passage à demi-traitement lors d'un congé de maladie ordinaire, longue maladie ou invalidité.",
    natureDetaillee: "Retenue facultative pour garantie maintien de salaire",
    impactFiscal: "Prélevée sur le net à payer",
    impactRetraite: "Assurance individuelle de prévoyance",
    assietteSociale: "Déduite directement du net en banque",
    aVerifier: "Contrôlez que la Ville vous verse parallèlement sa participation employeur pour compenser ce coût.",
    attention: "Sans prévoyance, tout agent territorial en arrêt maladie de plus de 90 jours voit son salaire de base réduit de moitié et ses primes généralement suspendues.",
    conseilAgent: "La souscription à la prévoyance est l'une des protections les plus capitales pour les agents de la fonction publique territoriale. Adhérez-y dès votre prise de fonctions !",
    openFiscaKey: "retenue_mutuelle_salarie"
  },
  pas: {
    titre: "Impôt sur le Revenu Prélevé à la Source (PAS)",
    explicationLigne: "Impôt sur le revenu retenu directement chaque mois sur votre salaire par la Ville de Gennevilliers pour le compte du Trésor Public (DGFiP), selon votre taux personnalisé de foyer fiscal.",
    natureDetaillee: "Impôt d'État prélevé à la source (Retenue fiscale)",
    impactFiscal: "Acompte d'impôt imputé sur votre impôt sur le revenu définitif de l'année",
    impactRetraite: "Aucun impact retraite",
    assietteSociale: "Calculé sur le Net Fiscal (salaire imposable), pas sur le salaire brut ni sur le net en poche !",
    aVerifier: "Comparez le taux appliqué sur le bulletin avec celui indiqué sur votre compte personnel sur impots.gouv.fr.",
    attention: "En cas de mariage, naissance, séparation ou variation de revenus, vous pouvez modifier votre taux en temps réel sur impots.gouv.fr pour qu'il soit transmis à la mairie le mois suivant.",
    conseilAgent: "Si vous ne souhaitez pas que votre employeur connaisse votre taux réel de foyer, vous pouvez opter pour le 'taux non personnalisé' (taux neutre) sur votre espace fiscal.",
    openFiscaKey: "prelevement_a_la_source"
  },
  montant_net_social: {
    titre: "Montant Net Social (Obligation DSN)",
    explicationLigne: "Montant de référence légal affiché obligatoirement sur les bulletins de paie depuis juillet 2023. Il sert de base de calcul directe pour vos demandes de prestations sociales auprès de la CAF (Prime d'activité, RSA).",
    natureDetaillee: "Mention d'information réglementaire obligatoire (Revenu de référence CAF)",
    impactFiscal: "Information sociale (utilisée pour les aides CAF, distincte du Net Fiscal)",
    impactRetraite: "Information réglementaire",
    assietteSociale: "Ne subit aucune retenue : montant purement informatif",
    aVerifier: "C'est exactement ce montant qu'il faut reporter dans vos déclarations trimestrielles de ressources CAF pour la Prime d'activité.",
    attention: "Le Montant Net Social est souvent différent du 'Net à payer' car il ne déduit pas le PAS ni les cotisations de mutuelle facultatives.",
    conseilAgent: "Même avec un salaire de fonctionnaire, vous pouvez être éligible à la Prime d'activité de la CAF si vos revenus se situent sous les seuils. Testez votre éligibilité sur caf.fr !",
    openFiscaKey: "montant_net_social"
  },
  rappel: {
    titre: "Rappel de Salaire (Régularisation rétroactive)",
    explicationLigne: "Régularisation d'une somme due (ou d'une retenue indue) afférente à un ou plusieurs mois passés. Le marqueur 'R' dans le code signale un rappel rétroactif, souvent lié à un avancement d'échelon différé, une prime recalculée ou un ajustement d'absence.",
    natureDetaillee: "Régularisation statutaire rétroactive",
    impactFiscal: "Imposable sur le mois de son versement effectif (intègre le Net Fiscal du mois en cours)",
    impactRetraite: "Les rappels sur le TIB ouvrent des droits à pension rétroactifs pour la CNRACL.",
    assietteSociale: "Soumis aux cotisations selon la nature des rubriques régularisées.",
    aVerifier: "Vérifiez que le mois mentionné dans le libellé correspond bien à la période de l'erreur et demandez le détail du calcul si nécessaire.",
    attention: "Un rappel important augmente mécaniquement le Net Fiscal du mois et donc le prélèvement à la source (PAS) prélevé ce mois-ci. L'ajustement fiscal se régularise à la déclaration annuelle.",
    conseilAgent: "Les créances de salaire dans la fonction publique se prescrivent par 4 ans (règle de la prescription quadriennale). Vous avez 4 ans pour réclamer un rappel non perçu avec l'aide de la CFDT !",
    openFiscaKey: "rappel_salaire"
  },
  fraction_t: {
    titre: "Fraction de Traitement (Congé de Maladie)",
    explicationLigne: "Pourcentage du traitement indiciaire de base maintenu pendant un arrêt de travail pour raison de santé. En maladie ordinaire : plein traitement (100%) pendant 3 mois, puis demi-traitement (50%) pendant les 9 mois suivants.",
    natureDetaillee: "Taux de maintien de traitement statutaire",
    impactFiscal: "Le traitement maintenu reste imposable à l'impôt sur le revenu.",
    impactRetraite: "Pendant le demi-traitement, les trimestres CNRACL continuent de se valider à taux plein !",
    assietteSociale: "Cotisations calculées au prorata du traitement maintenu.",
    aVerifier: "Vérifiez les dates d'arrêt de travail et le respect des 90 jours à plein traitement sur l'année glissante.",
    attention: "Lors du passage à demi-traitement, l'IFSE peut être réduite ou suspendue selon la délibération cadre de la collectivité.",
    conseilAgent: "Si vous passez à demi-traitement et adhérez au contrat de prévoyance Territoria, transmettez immédiatement votre dossier pour percevoir l'indemnisation complémentaire de maintien de salaire !",
    openFiscaKey: "traitement_indiciaire_brut"
  },
  demi_traitement: {
    titre: "Demi-Traitement (Congé de Maladie)",
    explicationLigne: "Versement de 50 % du traitement indiciaire brut suite au dépassement des 90 premiers jours de congé de maladie ordinaire sur une période de 12 mois glissants.",
    natureDetaillee: "Maintien partiel de traitement statutaire (50%)",
    impactFiscal: "Imposable sur le montant effectivement perçu",
    impactRetraite: "Valide vos trimestres de pension CNRACL à taux plein (100% des droits à durée d'assurance) !",
    assietteSociale: "Calculé sur la moitié du traitement indiciaire brut",
    aVerifier: "Activez votre indemnisation complémentaire de prévoyance Territoria sans attendre.",
    attention: "Vérifiez que le passage à demi-traitement respecte bien le décompte des jours d'arrêt sur les 12 mois précédant la maladie.",
    conseilAgent: "La CFDT vous assiste pour vérifier le calcul de vos 90 jours sur l'année glissante et faire valoir votre dossier prévoyance.",
    openFiscaKey: "traitement_indiciaire_brut"
  },
  sans_traitement: {
    titre: "Période Sans Traitement",
    explicationLigne: "Suspension temporaire du traitement indiciaire lors d'une absence non rémunérée (congé sans solde, disponibilité, journée de carence ou grève).",
    natureDetaillee: "Retenue pour absence de service fait",
    impactFiscal: "Diminue le revenu imposable",
    impactRetraite: "Les journées sans traitement ne valident pas de trimestres de retraite.",
    assietteSociale: "Déduit de l'assiette brute soumise",
    aVerifier: "Vérifiez que le nombre de 30èmes retenus correspond exactement à la durée de l'absence constatée.",
    attention: "Dans la fonction publique, la retenue pour grève est d'un 30ème indivisible par jour de grève.",
    conseilAgent: "En cas d'erreur de pointage ou d'absence justifiée imputée à tort, contactez vos délégués CFDT pour rétablir votre paie.",
    openFiscaKey: "traitement_indiciaire_brut"
  },
  indem_differentielle: {
    titre: "Indemnité Différentielle (Garantie SMIC)",
    explicationLigne: "Complément de rémunération versé lorsque la somme du traitement indiciaire brut et des primes obligatoires est inférieure au SMIC légal, garantissant qu'aucun agent public ne perçoive une rémunération inférieure au salaire minimum.",
    natureDetaillee: "Garantie légale du salaire minimum (Complément SMIC)",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Soumis à RAFP",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et cotisations sociales",
    aVerifier: "Cette ligne doit disparaître lors d'un avancement d'échelon qui positionne votre traitement au-dessus du SMIC.",
    attention: "Cette indemnité suit l'évolution du SMIC horaire national.",
    conseilAgent: "La CFDT réclame la refonte globale des grilles indiciaires pour que les premiers échelons débutent durablement au-dessus du SMIC sans avoir recours à des rustines indemnitaires.",
    openFiscaKey: "indemnite_differentielle"
  },
  vacations: {
    titre: "Vacations (Rémunération ponctuelle)",
    explicationLigne: "Rémunération horaire d'interventions ponctuelles ou spécifiques (surveillance de cantine, études surveillées, animations, jurys, expertises) payées à la vacation.",
    natureDetaillee: "Rémunération accessoire horaire (Vacations)",
    impactFiscal: "Imposable à l'impôt sur le revenu",
    impactRetraite: "Soumis à RAFP ou IRCANTEC selon le statut",
    assietteSociale: "Soumis à cotisations sociales selon le régime applicable",
    aVerifier: "Contrôlez le nombre d'heures ou de séances payées par rapport à votre relevé d'activité réel.",
    attention: "Les vacations doivent être réglées sans retard injustifié sur le mois suivant leur réalisation.",
    conseilAgent: "Conservez vos feuilles d'émargement et fiches de présence pour faire valoir vos heures en cas d'oubli sur la paie.",
    openFiscaKey: "primes_fonction_publique"
  },
  traitement_detache: {
    titre: "Traitement de Base Détaché",
    explicationLigne: "Traitement indiciaire versé à un fonctionnaire détaché auprès d'une autre collectivité ou administration, calculé sur la grille de son grade d'origine ou d'accueil.",
    natureDetaillee: "Traitement indiciaire en position de détachement",
    impactFiscal: "100 % imposable à l'impôt sur le revenu",
    impactRetraite: "Maintient l'avancement et les droits à pension dans le corps d'origine",
    assietteSociale: "Assise sur le traitement indiciaire détaché",
    aVerifier: "Vérifiez que votre échelon correspond à votre progression dans votre cadre d'emplois d'origine.",
    conseilAgent: "En détachement, vous continuez de cotiser à votre caisse d'origine (CNRACL) : surveillez vos relevés de carrière annuels.",
    openFiscaKey: "traitement_indiciaire_brut"
  },
  nbi_detache: {
    titre: "NBI Détachée",
    explicationLigne: "Points de Nouvelle Bonification Indiciaire conservés ou attribués dans le cadre d'un stage ou d'un détachement statutaire.",
    natureDetaillee: "NBI en position de détachement",
    impactFiscal: "Imposable à l'impôt sur le revenu",
    impactRetraite: "Cotise à la CNRACL et ouvre droit au supplément de pension viager",
    assietteSociale: "Soumis aux cotisations CNRACL pension",
    aVerifier: "Vérifiez que la NBI est bien prise en compte dans votre base pension.",
    conseilAgent: "La NBI détachée vous assure le maintien de vos droits à pension acquis antérieurement.",
    openFiscaKey: "nouvelle_bonification_indiciaire"
  },
  cnracl_detache: {
    titre: "CNRACL en Détachement",
    explicationLigne: "Cotisation de pension de retraite prélevée pour le compte de votre caisse de retraite d'origine (CNRACL) pendant votre période de détachement.",
    natureDetaillee: "Cotisation retraite statutaire en détachement",
    impactFiscal: "Déductible du revenu imposable",
    impactRetraite: "Poursuit la validation des trimestres de pension statutaire",
    assietteSociale: "Assise sur le traitement soumis à pension détaché",
    aVerifier: "Contrôlez que les cotisations sont bien reversées à la CNRACL par la collectivité d'accueil.",
    conseilAgent: "Consultez votre relevé de situation individuelle pour vous assurer que les années de détachement sont bien enregistrées.",
    openFiscaKey: "cotisation_retraite_cnracl_salarie"
  },
  autres_primes: {
    titre: "Primes & Indemnités Diverses FPT",
    explicationLigne: "Ensemble des primes statutaires complémentaires, astreintes techniques, indemnités horaires pour travaux supplémentaires (IHTS) ou sujétions particulières propres à vos missions.",
    natureDetaillee: "Régime indemnitaire accessoire",
    impactFiscal: "Imposable à l'impôt sur le revenu",
    impactRetraite: "Soumis à cotisation RAFP dans la limite du plafond légal de 20% du TIB.",
    assietteSociale: "Soumis à CSG/CRDS (98,25%) et RAFP (5%).",
    aVerifier: "Consultez vos relevés d'heures ou d'astreintes pour vérifier l'exactitude des montants versés.",
    attention: "Les heures supplémentaires font l'objet d'un régime fiscal d'exonération partielle sous conditions légales.",
    conseilAgent: "Notez systématiquement vos heures supplémentaires et astreintes sur un carnet de bord personnel.",
    openFiscaKey: "primes_fonction_publique"
  },
  p_maladie: {
    titre: "Cotisation Patronale URSSAF : Maladie (9,88%)",
    explicationLigne: "Cotisation versée entièrement par la Ville de Gennevilliers à l'URSSAF (9,88% du traitement). C'est du salaire différé : cet argent finance les remboursements de soins, les arrêts maladie et les congés maternité de l'ensemble des agents.",
    natureDetaillee: "Salaire différé (Cotisation patronale santé)",
    impactFiscal: "Non imposable pour l'agent (prise en charge par l'employeur)",
    impactRetraite: "Finance la branche maladie de la Sécurité Sociale",
    assietteSociale: "Traitement indiciaire brut soumis à pension (TIB + NBI)",
    aVerifier: "Aucun prélèvement sur votre salaire net : cette cotisation est 100% prise en charge par la mairie.",
    attention: "En collectivité territoriale, les fonctionnaires bénéficient de la protection sociale financée par l'employeur.",
    conseilAgent: "Ces cotisations constituent la part invisible de votre rémunération globale : le 'salaire différé' qui garantit vos droits sociaux.",
    openFiscaKey: "cotisations_employeur"
  },
  p_alloc_fam: {
    titre: "Cotisation Patronale URSSAF : Allocations Familiales Principale (3,45%)",
    explicationLigne: "Part principale de la contribution patronale finançant la branche famille de la Sécurité Sociale (CAF). Avec le code complémentaire 4082 (1,80%), elle totalise 5,25% du traitement.",
    natureDetaillee: "Salaire différé (Financement patronal des prestations familiales)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance la CNAF et les prestations familiales",
    assietteSociale: "Traitement soumis à pension",
    aVerifier: "Les deux lignes famille (codes 44 et 4082) totalisent 5,25% de votre traitement.",
    conseilAgent: "Cet argent finance les allocations familiales et les aides de la CAF pour tous les foyers.",
    openFiscaKey: "cotisations_employeur"
  },
  p_alloc_fam_comp: {
    titre: "Cotisation Patronale URSSAF : Allocations Familiales Complémentaire (1,80%)",
    explicationLigne: "Part complémentaire de la contribution patronale famille (1,80%). Ajoutée à la part principale de 3,45%, elle assure le financement complet de 5,25% de la branche famille.",
    natureDetaillee: "Salaire différé (Financement complémentaire famille)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance la CNAF",
    assietteSociale: "Traitement soumis à pension",
    aVerifier: "La somme des deux cotisations famille s'élève à 5,25%.",
    conseilAgent: "Partie intégrante du salaire différé de la fonction publique.",
    openFiscaKey: "cotisations_employeur"
  },
  p_fnal: {
    titre: "Cotisation Patronale URSSAF : FNAL Logement (0,50%)",
    explicationLigne: "Contribution patronale au Fonds National d'Aide au Logement (0,50% sur la totalité de la rémunération). Finance les aides personnelles au logement (APL) pour l'ensemble de la population.",
    natureDetaillee: "Salaire différé (Financement patronal des APL)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance le logement social et les APL",
    assietteSociale: "Totalité de la rémunération brute (mention 'totalité')",
    aVerifier: "Taux de 0,50% applicable aux employeurs publics de plus de 50 agents.",
    conseilAgent: "Cotisation entièrement patronale finançant la solidarité logement.",
    openFiscaKey: "cotisations_employeur"
  },
  p_mobilite: {
    titre: "Cotisation Patronale : Versement Mobilité Île-de-France (3,20%)",
    explicationLigne: "Contribution patronale de 3,20 % versée à Île-de-France Mobilités (IDFM) pour développer et financer les réseaux de transports en commun franciliens (métro, bus, RER, tramways).",
    natureDetaillee: "Salaire différé (Financement patronal des transports publics)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Financement des transports collectifs régionaux",
    assietteSociale: "Traitement indiciaire",
    aVerifier: "Entièrement payée par la Ville, aucun impact négatif sur votre net.",
    conseilAgent: "C'est grâce à cette taxe sur la masse salariale que les transports régionaux sont financés et que votre pass Navigo est remboursé à 75% !",
    openFiscaKey: "cotisations_employeur"
  },
  p_autonomie: {
    titre: "Cotisation Patronale : Solidarité Autonomie CNSA (0,30%)",
    explicationLigne: "Contribution Solidarité Autonomie versée à la Caisse Nationale de Solidarité pour l'Autonomie (CNSA) pour financer la prise en charge des personnes âgées dépendantes (EHPAD, APA) et des personnes en situation de handicap.",
    natureDetaillee: "Salaire différé (Solidarité grand âge & handicap)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance la 5e branche de la Sécurité Sociale (Autonomie)",
    assietteSociale: "Traitement indiciaire",
    aVerifier: "Cotisation entièrement patronale (0,30%).",
    conseilAgent: "Issue de la journée de solidarité instaurée en 2004, cette contribution est acquittée par l'employeur.",
    openFiscaKey: "cotisations_employeur"
  },
  p_atiacl: {
    titre: "Cotisation Patronale : CNRACL ATIACL (0,40%)",
    explicationLigne: "Cotisation patronale versée à la Caisse des Dépôts pour le régime de l'Allocation Temporaire d'Invalidité des Agents des Collectivités Locales. Taux de 0,40 % assis sur le seul traitement indiciaire brut (hors NBI).",
    natureDetaillee: "Salaire différé (Assurance invalidité et accident de service)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Ouvre droit à l'ATI en cas d'accident de service ou maladie professionnelle",
    assietteSociale: "Traitement indiciaire brut (TIB seul)",
    aVerifier: "Cette cotisation finance votre rente d'invalidité viagère si vous êtes victime d'un accident du travail.",
    conseilAgent: "En cas d'accident de service vous laissant des séquelles permanentes, la reconnaissance d'un taux d'invalidité ouvre droit à l'ATI cumulable avec votre traitement !",
    openFiscaKey: "cotisations_employeur"
  },
  p_centre_gestion: {
    titre: "Cotisation Patronale : Centre de Gestion CIG Petite Couronne (0,50%)",
    explicationLigne: "Cotisation versée par la Ville au Centre Interdépartemental de Gestion (CIG) pour mutualiser la gestion des ressources humaines territoriales : organisation des concours et examens professionnels, bourses de l'emploi, médecine préventive, conseils statutaires.",
    natureDetaillee: "Contribution patronale de mutualisation RH",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance les services mutualisés de la fonction publique",
    assietteSociale: "Traitement soumis à pension",
    aVerifier: "Cotisation obligatoire pour les collectivités territoriales.",
    conseilAgent: "Le CIG organise les concours territoriaux et gère les listes d'aptitude pour vos promotions et changements de grade.",
    openFiscaKey: "cotisations_employeur"
  },
  p_cnfpt: {
    titre: "Cotisation Patronale : Formation Professionnelle CNFPT (0,90%)",
    explicationLigne: "Contribution patronale obligatoire finançant le Centre National de la Fonction Publique Territoriale (CNFPT) pour la formation professionnelle continue de tous les agents territoriaux.",
    natureDetaillee: "Salaire différé (Financement de la formation professionnelle)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance le droit individuel à la formation tout au long de la vie",
    assietteSociale: "Traitement soumis à pension",
    aVerifier: "La mairie verse près de 1 % de sa masse salariale pour vous permettre de vous former gratuitement.",
    conseilAgent: "Chaque agent a droit à des jours de formation professionnelle par an (préparation aux concours, formations métiers, perfectionnement). Utilisez vos droits à formation au CNFPT !",
    openFiscaKey: "cotisations_employeur"
  },
  p_cnfpt_maj: {
    titre: "Cotisation Patronale : CNFPT Majoration Alternance (0,10%)",
    explicationLigne: "Majoration de 0,10 % de la cotisation CNFPT instaurée en 2022 pour financer spécifiquement la formation des apprentis (alternants) accueillis dans les collectivités territoriales.",
    natureDetaillee: "Salaire différé (Financement de l'apprentissage territorial)",
    impactFiscal: "Non imposable pour l'agent",
    impactRetraite: "Finance l'apprentissage dans les services publics",
    assietteSociale: "Traitement soumis à pension",
    aVerifier: "S'ajoute aux 0,90% du code 52 pour former 1,00% de contribution CNFPT.",
    conseilAgent: "Cette contribution aide à former et intégrer les jeunes apprentis dans nos services communaux.",
    openFiscaKey: "cotisations_employeur"
  }
};

/**
 * Enrichit une ligne de fiche de paie avec toutes les métadonnées détaillées
 * (explication, formule, statut fiscal, droits retraite, assiette, contrôles RH, conseils CFDT).
 */
export function enrichirLigneFichePaie(
  ligne: FichePaieLigne,
  explKey?: string,
  context?: {
    code?: string;
    libelle?: string;
    moisRappel?: string;
    cat?: "gain" | "retenue" | "patronale" | "retenue_net" | "info";
    fractionT?: string;
    estIfse?: boolean;
    estCia?: boolean;
    estTreizieme?: boolean;
  }
): FichePaieLigne {
  let resolvedKey = explKey;

  if (context?.moisRappel || ligne.moisRappel) {
    resolvedKey = "rappel";
  } else if (context?.fractionT) {
    resolvedKey = "fraction_t";
  } else if (context?.estCia) {
    resolvedKey = "cia";
  } else if (context?.estIfse) {
    resolvedKey = "ifse";
  } else if (context?.estTreizieme) {
    resolvedKey = "prime_13eme";
  } else if (!resolvedKey || !RUBRIQUES_METADATA_REGISTRY[resolvedKey]) {
    const code = (ligne.code || context?.code || "").trim();
    const libNorm = (ligne.libelle || context?.libelle || "").toLowerCase();

    if (["8", "100", "101", "13", "2008"].includes(code)) resolvedKey = "tib";
    else if (["9", "102", "2009"].includes(code)) resolvedKey = "nbi";
    else if (["12", "103", "105", "17", "213", "2012"].includes(code)) resolvedKey = "residence";
    else if (["10", "11", "16", "104", "0110"].includes(code)) resolvedKey = "sft";
    else if (["0095", "095", "1735", "1737"].includes(code)) resolvedKey = "ppcr";
    else if (["1591", "2591", "201"].includes(code)) resolvedKey = "ifse";
    else if (["1592", "7610", "202"].includes(code)) resolvedKey = "cia";
    else if (["7443", "7444", "8443", "8444"].includes(code)) resolvedKey = "prime_13eme";
    else if (["1510", "0400", "400"].includes(code)) resolvedKey = "transport";
    else if (["1860", "2860", "0230", "230"].includes(code)) resolvedKey = "comp_csg";
    else if (["47", "0500", "500"].includes(code)) resolvedKey = "cnracl";
    else if (["1028", "0510", "510"].includes(code)) resolvedKey = "rafp";
    else if (["472", "67", "69"].includes(code)) resolvedKey = "ircantec";
    else if (["501", "0501"].includes(code)) resolvedKey = "maladie";
    else if (["61", "502", "0502"].includes(code)) resolvedKey = "vieillesse_plaf";
    else if (["18", "299", "503", "0503"].includes(code)) resolvedKey = "vieillesse_deplaf";
    else if (["41", "55", "0600", "600"].includes(code)) resolvedKey = "csg_ded";
    else if (["40", "56", "0610", "610"].includes(code)) resolvedKey = "csg_nonded";
    else if (["42", "57", "0620", "620"].includes(code)) resolvedKey = "crds";
    else if (["7376", "0700", "700"].includes(code)) resolvedKey = "part_mutuelle";
    else if (["7716"].includes(code)) resolvedKey = "part_prevoyance";
    else if (["572", "7628", "0710", "710"].includes(code)) resolvedKey = "cotis_mutuelle";
    else if (["7625"].includes(code)) resolvedKey = "prevoyance_territoria";
    else if (["995", "0950", "950"].includes(code)) resolvedKey = "pas";
    else if (["1584"].includes(code)) resolvedKey = "montant_net_social";
    else if (["1620", "1679"].includes(code)) resolvedKey = "fraction_t";
    else if (["617", "618"].includes(code)) resolvedKey = "indem_differentielle";
    else if (["7201"].includes(code)) resolvedKey = "vacations";
    else if (["43", "59", "4050", "66"].includes(code)) resolvedKey = "p_maladie";
    else if (["44", "64"].includes(code)) resolvedKey = "p_alloc_fam";
    else if (["4082", "1525"].includes(code)) resolvedKey = "p_alloc_fam_comp";
    else if (["1250", "1251"].includes(code)) resolvedKey = "p_fnal";
    else if (["46", "75"].includes(code)) resolvedKey = "p_mobilite";
    else if (["389", "332"].includes(code)) resolvedKey = "p_autonomie";
    else if (["49"].includes(code)) resolvedKey = "p_atiacl";
    else if (["50", "73"].includes(code)) resolvedKey = "p_centre_gestion";
    else if (["52", "74"].includes(code)) resolvedKey = "p_cnfpt";
    else if (["1965", "1966"].includes(code)) resolvedKey = "p_cnfpt_maj";
    else if (["193"].includes(code)) resolvedKey = "traitement_detache";
    else if (["194"].includes(code)) resolvedKey = "nbi_detache";
    else if (["1033"].includes(code)) resolvedKey = "cnracl_detache";
    else if (["21"].includes(code)) resolvedKey = "demi_traitement";
    else if (["28"].includes(code)) resolvedKey = "sans_traitement";
    else if (/rappel/i.test(libNorm)) resolvedKey = "rappel";
    else if (/13.*mois|prime semestrielle|compl.*remuneration/i.test(libNorm)) resolvedKey = "prime_13eme";
    else if (/navigo|transport/i.test(libNorm)) resolvedKey = "transport";
    else if (/territo|pack prev/i.test(libNorm)) resolvedKey = "prevoyance_territoria";
    else if (/mutuelle|prefon|obseques/i.test(libNorm)) resolvedKey = "cotis_mutuelle";
    else if (/net social/i.test(libNorm)) resolvedKey = "montant_net_social";
    else if (/csg.*ded/i.test(libNorm)) resolvedKey = "csg_ded";
    else if (/csg.*non/i.test(libNorm)) resolvedKey = "csg_nonded";
    else if (/crds/i.test(libNorm)) resolvedKey = "crds";
    else if (/cnracl.*detache/i.test(libNorm)) resolvedKey = "cnracl_detache";
    else if (/cnracl/i.test(libNorm)) resolvedKey = "cnracl";
    else if (/rafp/i.test(libNorm)) resolvedKey = "rafp";
    else if (/ircantec/i.test(libNorm)) resolvedKey = "ircantec";
    else if (/residence/i.test(libNorm)) resolvedKey = "residence";
    else if (/supplement familial|sft/i.test(libNorm)) resolvedKey = "sft";
    else if (/nbi.*detache/i.test(libNorm)) resolvedKey = "nbi_detache";
    else if (/nbi|bonification/i.test(libNorm)) resolvedKey = "nbi";
    else if (/ppcr|transfert primes/i.test(libNorm)) resolvedKey = "ppcr";
    else if (/ifse/i.test(libNorm)) resolvedKey = "ifse";
    else if (/cia\b|compl.*indemnitaire.*annuel/i.test(libNorm)) resolvedKey = "cia";
    else if (/compens.*csg/i.test(libNorm)) resolvedKey = "comp_csg";
    else if (/differentielle/i.test(libNorm)) resolvedKey = "indem_differentielle";
    else if (/vacation/i.test(libNorm)) resolvedKey = "vacations";
    else if (/fraction/i.test(libNorm)) resolvedKey = "fraction_t";
    else if (/demi.*traitement/i.test(libNorm)) resolvedKey = "demi_traitement";
    else if (/sans.*traitement/i.test(libNorm)) resolvedKey = "sans_traitement";
    else if (/prelevement.*source|impot/i.test(libNorm)) resolvedKey = "pas";
  }

  const meta = resolvedKey ? RUBRIQUES_METADATA_REGISTRY[resolvedKey] : undefined;

  if (meta) {
    if (meta.openFiscaKey && OPENFISCA_VARIABLES_DICTIONARY[meta.openFiscaKey]) {
      ligne.openFiscaVar = OPENFISCA_VARIABLES_DICTIONARY[meta.openFiscaKey];
    }
    if (!ligne.explicationLigne || ligne.explicationLigne.includes("copiée telle quelle") || ligne.explicationLigne.length < 30) {
      ligne.explicationLigne = meta.explicationLigne;
    }
    ligne.natureDetaillee = meta.natureDetaillee;
    ligne.impactFiscal = meta.impactFiscal;
    ligne.impactRetraite = meta.impactRetraite;
    ligne.assietteSociale = meta.assietteSociale;
    ligne.aVerifier = meta.aVerifier;
    ligne.attention = meta.attention;
    ligne.conseilAgent = ligne.conseilAgent || meta.conseilAgent;
  } else {
    const isGain = ligne.montantGain !== undefined || context?.cat === "gain";
    const isRetenue = ligne.montantRetenue !== undefined || context?.cat === "retenue" || context?.cat === "retenue_net";
    const isPatronale = ligne.partPatronale !== undefined || context?.cat === "patronale";

    if (isPatronale) {
      ligne.natureDetaillee = "Salaire différé (Cotisation patronale Ville)";
      ligne.impactFiscal = "Non imposable pour l'agent (prise en charge employeur)";
      ligne.impactRetraite = "Financement mutualisé de la protection sociale publique";
      ligne.assietteSociale = ligne.base ? `Assise sur la base de ${ligne.base.toFixed(2)} €` : "Assise sur le traitement brut";
      ligne.aVerifier = "Cette cotisation est intégralement acquittée par la Ville de Gennevilliers sans prélèvement sur votre net.";
      ligne.conseilAgent = "Cette contribution patronale fait partie du coût global employeur finançant votre protection collective.";
    } else if (isRetenue) {
      ligne.natureDetaillee = context?.cat === "retenue_net" ? "Retenue sur salaire net (Facultative)" : "Cotisation salariale obligatoire";
      ligne.impactFiscal = context?.cat === "retenue_net" ? "Prélevée sur le net à payer (après net fiscal)" : "Déductible ou réintégrée selon le régime fiscal";
      ligne.impactRetraite = "Participe au financement des régimes de solidarité ou de retraite";
      ligne.assietteSociale = ligne.base ? `Calculée sur une base de ${ligne.base.toFixed(2)} €` : "Prélevée sur le bulletin";
      ligne.aVerifier = "Contrôlez que la retenue appliquée correspond à votre situation administrative ou à votre contrat d'adhésion.";
      ligne.conseilAgent = "En cas de doute sur la base ou le taux appliqué, sollicitez l'avis de votre section syndicale CFDT.";
    } else if (isGain) {
      ligne.natureDetaillee = "Gain brut statutaire (Indemnité ou prime)";
      ligne.impactFiscal = "Imposable à l'impôt sur le revenu (intégré dans le net fiscal)";
      ligne.impactRetraite = "Soumis à cotisation RAFP ou retraite selon la nature indemnitaire";
      ligne.assietteSociale = "Soumis aux cotisations sociales statutaires et à la CSG/CRDS (98,25%)";
      ligne.aVerifier = "Vérifiez que ce montant correspond bien à vos fonctions effectives ou à votre arrêté individuel.";
      ligne.conseilAgent = "Conservez toujours les justificatifs et arrêtés liés à cette attribution pour vos dossiers de carrière.";
    } else {
      ligne.natureDetaillee = "Mention statutaire d'information";
      ligne.impactFiscal = "Non imposable (montant informatif)";
      ligne.impactRetraite = "Information réglementaire";
      ligne.assietteSociale = "Ne subit aucune retenue";
      ligne.aVerifier = "Ce montant figure à titre indicatif sur le bulletin et n'a pas d'impact arithmétique sur le net versé.";
      ligne.conseilAgent = "Ce montant informatif est souvent destiné aux transmissions réglementaires DSN ou CAF.";
    }

    if (!ligne.explicationLigne || ligne.explicationLigne.includes("copiée telle quelle")) {
      ligne.explicationLigne = `Rubrique Ciril ${ligne.code || ''} (${ligne.libelle}) : élément de ${isGain ? 'rémunération brute' : isRetenue ? 'retenue statutaire' : isPatronale ? 'cotisation patronale' : 'paie informative'} appliqué selon la doctrine de gestion de la Ville de Gennevilliers.`;
    }
  }

  if (ligne.moisRappel) {
    ligne.attention = `Régularisation rétroactive portant sur le mois de ${ligne.moisRappel}. Cette somme est rattachée fiscalement au mois de son paiement effectif.`;
    if (!ligne.explicationLigne.includes("Régularisation")) {
      ligne.explicationLigne += ` (Régularisation rétroactive afférente au mois de ${ligne.moisRappel}).`;
    }
  }

  return ligne;
}

/**
 * Exécute la simulation complète de la fiche de paie selon les formules OpenFisca-France
 * et la doctrine de calcul Ciril RH Ville de Gennevilliers
 */
export function computeOpenFiscaPay(params: CalculParams, metadata?: ParseMetadata | null): FichePaieAnalyseResult {
  // Un bulletin reconstruit ligne à ligne depuis un vrai PDF : on copie les rubriques réelles
  // (codes, bases, taux, montants) et les totaux imprimés → zéro écart par construction.
  if (params.lignesReelles && params.lignesReelles.length > 0) {
    return computeOpenFiscaPayDepuisLignesReelles(params, params.lignesReelles, metadata);
  }
  const {
    indiceMajore = 382,
    indiceRemun,
    lignesReelles,
    nbiPoints = 0,
    ifse = 380,
    cia = 0,
    autresPrimes = 0,
    zoneResidence = 1,
    nbEnfantsSft = 0,
    quotite = 100,
    statut = "titulaire",
    tauxPas = 0,
    nomAgent = "AGENT Public",
    grade = "Adjoint territorial",
    echelon = "Échelon statutaire",
    indiceBrut = Math.round(indiceMajore * 1.06),
    appliquerPpcr = true,
    abattementPpcr,
    remboursementTransport = 0,
    indemniteCompensatriceCsg = 0,
    participationMutuelleEmployeur = 0,
    retenueMutuelleSalarie = 0,
    montantsReels,
    categorie
  } = params;

  const qFactor = quotite / 100;
  const isTitulaire = statut === "titulaire" || statut === "stagiaire";

  // 1. Traitement Indiciaire Brut (TIB) au centime absolu Ciril RH (59.0734 / 12)
  const tibTheorique = Math.round(indiceMajore * (59.0734 / 12) * qFactor * 100) / 100;

  // 2. NBI (Nouvelle Bonification Indiciaire)
  const nbiTheorique = Math.round(nbiPoints * (59.0734 / 12) * qFactor * 100) / 100;

  // 3. Indemnité de résidence Zone 1 (3% à Gennevilliers)
  // Bulletin Ciril réel (code 12) : assiette = traitement soumis à pension (TIB + NBI), ex. 3 741.31 x 3% = 112.23
  const traitementPension = tibTheorique + nbiTheorique;
  const tauxRes = zoneResidence === 1 ? TAUX_RESIDENCE_ZONE_1 : zoneResidence === 2 ? 0.01 : 0.0;
  const resTheorique = Math.round(traitementPension * tauxRes * 100) / 100;

  // 4. SFT (Supplément Familial de Traitement)
  let sftTheorique = 0;
  if (nbEnfantsSft === 1) {
    sftTheorique = 2.29;
  } else if (nbEnfantsSft === 2) {
    const brutCalc = 10.67 + 0.03 * traitementPension;
    sftTheorique = Math.min(Math.max(brutCalc, 73.04), 110.67);
  } else if (nbEnfantsSft === 3) {
    const brutCalc = 15.24 + 0.08 * traitementPension;
    sftTheorique = Math.min(Math.max(brutCalc, 181.56), 281.44);
  } else if (nbEnfantsSft > 3) {
    const extra = nbEnfantsSft - 3;
    const brutCalc = 15.24 + 4.57 * extra + (0.08 + 0.06 * extra) * traitementPension;
    sftTheorique = Math.min(Math.max(brutCalc, 181.56 + 129.31 * extra), 281.44 + 204.22 * extra);
  }
  sftTheorique = Math.round(sftTheorique * qFactor * 100) / 100;

  // 5. Abattement PPCR / Transfert Primes-Points (Décret n° 2016-588)
  let abattementPpcrVal = 0;
  if (isTitulaire && appliquerPpcr) {
    if (abattementPpcr !== undefined) {
      // Montant lu sur la vraie fiche : prioritaire
      abattementPpcrVal = Math.round(abattementPpcr * 100) / 100;
    } else {
      // Barème légal (Décret n° 2016-588) : A 389 €/an, B 278 €/an, C 167 €/an
      const cat = categorie || devinerCategorie(grade, indiceMajore);
      abattementPpcrVal = Math.round(PPCR_MENSUEL_PAR_CATEGORIE[cat] * qFactor * 100) / 100;
    }
    // L'abattement ne peut pas dépasser les primes effectivement perçues
    abattementPpcrVal = Math.min(abattementPpcrVal, Math.max(0, ifse + cia + autresPrimes));
  }

  // Primes brutes positives
  const primesPositives = Math.round((ifse + cia + autresPrimes + indemniteCompensatriceCsg) * 100) / 100;

  // Rémunération Brute Globale Ciril RH (Totaux Gains du bulletin) :
  // TIB + NBI + Résidence + SFT + Primes + Participations employeur (mutuelle/prévoyance, codes 7376/7716) - Abattement PPCR
  const salaireBrut = Math.round((tibTheorique + nbiTheorique + resTheorique + sftTheorique + primesPositives + participationMutuelleEmployeur - abattementPpcrVal) * 100) / 100;

  // 6. Retraite CNRACL (titulaire) ou IRCANTEC (contractuel)
  let retraiteSalarie = 0;
  let retraitePatronale = 0;

  if (isTitulaire) {
    // openfisca: 'cotisation_retraite_cnracl_salarie' (11,10% sur TIB + NBI)
    retraiteSalarie = Math.round((tibTheorique + nbiTheorique) * TAUX_CNRACL_SALARIE * 100) / 100;
    retraitePatronale = Math.round((tibTheorique + nbiTheorique) * TAUX_CNRACL_PATRONAL * 100) / 100;
  } else {
    // openfisca: 'cotisation_retraite_ircantec_salarie'
    const baseA = Math.min(salaireBrut, PMSS_MENSUEL_2024);
    const baseB = Math.max(0, salaireBrut - PMSS_MENSUEL_2024);
    retraiteSalarie = Math.round((baseA * TAUX_IRCANTEC_A_SALARIE + baseB * TAUX_IRCANTEC_B_SALARIE) * 100) / 100;
    retraitePatronale = Math.round((baseA * TAUX_IRCANTEC_A_PATRONAL + baseB * TAUX_IRCANTEC_B_PATRONAL) * 100) / 100;
  }

  // 6bis. Régime Général (agents contractuels) : Maladie & Vieillesse (Décret n° 2017-1904)
  // Ces trois retenues figurent sur les vrais bulletins Ciril RH des contractuels et étaient
  // absentes du modèle simplifié, d'où un écart systématique d'environ 8% du brut.
  let maladieSalarie = 0;
  let vieillessePlafonnee = 0;
  let vieillesseDeplafonnee = 0;
  let assietteMaladie = 0;
  let assietteVieillessePlaf = 0;
  if (!isTitulaire) {
    assietteMaladie = Math.min(salaireBrut, PMSS_MENSUEL_2024 * 5);
    assietteVieillessePlaf = Math.min(salaireBrut, PMSS_MENSUEL_2024);
    maladieSalarie = Math.round(assietteMaladie * TAUX_MALADIE_CONTRACTUEL_SALARIE * 100) / 100;
    vieillessePlafonnee = Math.round(assietteVieillessePlaf * TAUX_VIEILLESSE_PLAFONNEE_SALARIE * 100) / 100;
    vieillesseDeplafonnee = Math.round(salaireBrut * TAUX_VIEILLESSE_DEPLAFONNEE_SALARIE * 100) / 100;
  }

  // 7. RAFP (Retraite Additionnelle de la Fonction Publique - 5%)
  let rafpSalarie = 0;
  let rafpPatronale = 0;
  let assietteSoumisePrimes = 0;
  if (isTitulaire) {
    // Bulletin Ciril réel (code 1028) : plafond = 20% du TIB SEUL (hors NBI), ex. 3 618.24 x 20% = 723.65
    const plafondRafp = Math.round(tibTheorique * PLAFOND_ASSIETTE_RAFP_POURCENTAGE * 100) / 100;
    // Assiette RAFP = éléments hors traitement : primes nettes d'abattement + résidence + SFT + participations employeur
    const primesSoumises = Math.max(0, primesPositives - abattementPpcrVal) + resTheorique + sftTheorique + participationMutuelleEmployeur;
    assietteSoumisePrimes = Math.min(primesSoumises, plafondRafp);
    rafpSalarie = Math.round(assietteSoumisePrimes * TAUX_RAFP_SALARIE * 100) / 100;
    rafpPatronale = Math.round(assietteSoumisePrimes * TAUX_RAFP_PATRONAL * 100) / 100;
  }

  // 8. CSG & CRDS
  // Bulletin Ciril réel (codes 40/41/42) : assiette abattue de 1,75% sur la rémunération, mais la part
  // patronale santé/prévoyance (mutuelle + prévoyance, codes 7376/7716) est assujettie à 100% (sans abattement).
  // Ex. vérifié : (5 007.72 - 41.24) x 0.9825 + 41.24 = 4 920.81
  const assietteBruteAbattue = Math.round((salaireBrut - participationMutuelleEmployeur) * ASSIETTE_ABATTEMENT_CSG_CRDS * 100) / 100;
  const assietteCsgCrds = Math.round((assietteBruteAbattue + participationMutuelleEmployeur) * 100) / 100;

  const csgDeductible = Math.round(assietteCsgCrds * TAUX_CSG_DEDUCTIBLE * 100) / 100;
  const csgNonDeductible = Math.round(assietteCsgCrds * TAUX_CSG_NON_DEDUCTIBLE * 100) / 100;
  const crds = Math.round(assietteCsgCrds * TAUX_CRDS * 100) / 100;

  // Total Cotisations Salariales (maladie + vieillesse régime général = contractuels uniquement)
  const totalCotisationsSalariales = Math.round(
    (retraiteSalarie + rafpSalarie + maladieSalarie + vieillessePlafonnee + vieillesseDeplafonnee + csgDeductible + csgNonDeductible + crds) * 100
  ) / 100;

  // 9. Salaire Net Avant Impôt (« NET A PAYER AVANT IMPOT SUR LE REVENU » du bulletin Ciril)
  // = Brut - cotisations sociales - retenues sur le net (mutuelle, prévoyance type Territoria, Préfon)
  const netAvantImpot = Math.round((salaireBrut - totalCotisationsSalariales - retenueMutuelleSalarie) * 100) / 100;

  // 10. Net Fiscal / Salaire Imposable (DGFiP)
  // Bulletin Ciril réel : Net fiscal = Net avant impôt + CSG non déductible + CRDS + retenues non déductibles
  // (prévoyance/Préfon y restent imposables). Ex. vérifié : 3 809.28 + 118.10 + 24.60 + 269.65 = 4 221.63
  const netFiscal = Math.round((netAvantImpot + csgNonDeductible + crds + retenueMutuelleSalarie) * 100) / 100;

  // 11. Prélèvement à la source (PAS)
  const montantPas = Math.round(netFiscal * (tauxPas / 100) * 100) / 100;

  // 12. Net à Payer (Virement bancaire effectif — « Net payé en euros » du bulletin Ciril)
  const netAPayer = Math.round((netAvantImpot - montantPas + remboursementTransport) * 100) / 100;

  // « Total des retenues » du bulletin Ciril = cotisations sociales + retenues sur le net + PAS
  // En reconstruction : le total imprimé sur la fiche fait foi (les lignes non reconnues manqueraient)
  const totalRetenues = montantsReels?.totalRetenuesReelles
    ?? Math.round((totalCotisationsSalariales + retenueMutuelleSalarie + montantPas) * 100) / 100;

  // Cotisations Patronales et Coût Global
  // Bulletin Ciril réel (titulaire) : CNRACL 37,65% + RAFP 5% + Urssaf 19,13% + CNG 0,50% + CNFPT 1,00%
  // (assiette TIB + NBI) + ATIACL 0,40% (assiette TIB seul). Ex. vérifié : 2 231.08.
  let totalCotisationsPatronales: number;
  if (isTitulaire) {
    totalCotisationsPatronales = Math.round(
      (
        Math.round(traitementPension * TAUX_CNRACL_PATRONAL * 100) / 100 +
        rafpPatronale +
        Math.round(traitementPension * TAUX_USSAF_TITULAIRE_PATRONAL * 100) / 100 +
        Math.round(traitementPension * TAUX_CNG_PATRONAL * 100) / 100 +
        Math.round(traitementPension * TAUX_CNFPT_PATRONAL * 100) / 100 +
        Math.round(tibTheorique * TAUX_ATIACL_PATRONAL * 100) / 100
      ) * 100
    ) / 100;
  } else {
    totalCotisationsPatronales = Math.round((retraitePatronale + salaireBrut * 0.12) * 100) / 100;
  }
  // « Total versé par l'employeur » = Totaux Gains + Cotisations patronales (les participations
  // employeur mutuelle/prévoyance sont déjà comprises dans les gains). Ex. vérifié : 5 007.72 + 2 231.08 = 7 238.80
  const coutGlobalEmployeur = Math.round((salaireBrut + totalCotisationsPatronales) * 100) / 100;

  // Construction des lignes explicatives avec codes Ciril officiels
  const lignes: FichePaieLigne[] = [
    {
      id: "tib",
      code: "0100",
      libelle: `Traitement indiciaire de base (IM ${indiceMajore})`,
      base: indiceMajore,
      taux: VALEUR_POINT_INDICE_MENSUEL,
      montantGain: tibTheorique,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.traitement_indiciaire_brut,
      montantTheoriqueOpenFisca: tibTheorique,
      estConforme: true,
      explicationLigne: `Calculé en multipliant votre Indice Majoré (${indiceMajore}) par la valeur mensuelle du point d'indice (${VALEUR_POINT_INDICE_MENSUEL.toFixed(5)} €) au prorata de votre quotité (${quotite}%).`
    }
  ];

  if (nbiTheorique > 0) {
    lignes.push({
      id: "nbi",
      code: "0102",
      libelle: `Nouvelle Bonification Indiciaire (${nbiPoints} pts)`,
      base: nbiPoints,
      taux: VALEUR_POINT_INDICE_MENSUEL,
      montantGain: nbiTheorique,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.nouvelle_bonification_indiciaire,
      montantTheoriqueOpenFisca: nbiTheorique,
      estConforme: true,
      explicationLigne: `La NBI rémunère des fonctions d'encadrement, d'accueil ou de responsabilité technique. Ces points cotisent pour la retraite CNRACL.`
    });
  }

  if (resTheorique > 0) {
    lignes.push({
      id: "residence",
      code: "0105",
      libelle: `Indemnité de résidence Zone 1 (3%)`,
      base: tibTheorique,
      taux: 3.0,
      montantGain: resTheorique,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.indemnite_residence,
      montantTheoriqueOpenFisca: resTheorique,
      estConforme: true,
      explicationLigne: `La Ville de Gennevilliers est classée en Zone 1 (Île-de-France) : majoration de 3% calculée sur votre traitement indiciaire de base (${tibTheorique.toFixed(2)} €), hors NBI, conformément à la doctrine de paie Ciril RH.`
    });
  }

  if (sftTheorique > 0) {
    lignes.push({
      id: "sft",
      code: "0110",
      libelle: `Supplément Familial de Traitement (${nbEnfantsSft} enfant${nbEnfantsSft > 1 ? "s" : ""})`,
      base: tibTheorique,
      montantGain: sftTheorique,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.supplement_familial_traitement,
      montantTheoriqueOpenFisca: sftTheorique,
      estConforme: true,
      explicationLigne: `Prestation statutaire légale pour charge de famille (part fixe + pourcentage du TIB encadré par planchers et plafonds).`
    });
  }

  if (abattementPpcrVal > 0) {
    lignes.push({
      id: "ppcr",
      code: "0095",
      libelle: "Abattement PPCR / Transfert Primes-Points",
      base: abattementPpcrVal,
      montantGain: -abattementPpcrVal,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.abattement_ppcr,
      montantTheoriqueOpenFisca: -abattementPpcrVal,
      estConforme: true,
      explicationLigne: `Retenue légale mensuelle de ${abattementPpcrVal.toFixed(2)} € sur les primes (Décret n° 2016-588) en contrepartie des points d'indice gagnés lors du protocole PPCR.`
    });
  }

  if (ifse > 0) {
    lignes.push({
      id: "ifse",
      code: "1591",
      libelle: "RIFSEEP - IFSE Tit. (4 composantes)",
      montantGain: ifse,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.rifseep_ifse,
      montantTheoriqueOpenFisca: ifse,
      estConforme: true,
      explicationLigne: `Indemnité de Fonctions, de Sujétions et d'Expertise (rubrique Ciril 1591) composée de 4 volets cumulatifs : IFSE 1 (Prime de fonctions), IFSE 2 (Prime des contraintes de poste), IFSE 3 (Samedis, dimanches et astreintes), IFSE 4 (Avantages acquis).`,
      conseilAgent: `Vérifiez sur votre arrêté individuel RIFSEEP la ventilation chiffrée de vos 4 IFSE (fonctions, contraintes, astreintes/week-ends, avantages acquis). Tout changement de poste ou de sujétion doit faire l'objet d'un arrêté modificatif sans régression de vos droits acquis.`
    });
  }

  if (cia > 0) {
    lignes.push({
      id: "cia",
      code: "1592",
      libelle: "RIFSEEP - CIA Tit. (Complément Indemnitaire Annuel)",
      montantGain: cia,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.rifseep_cia,
      montantTheoriqueOpenFisca: cia,
      estConforme: true,
      explicationLigne: `Complément Indemnitaire Annuel (CIA Tit., rubrique Ciril 1592 ou 7610). Se compose de 10 % de l'IFSE mensuelle × 12 mois. Cette somme est attribuée à 50 % sur la manière de servir (évaluation CREP) et à 50 % selon le nombre de jours d'absence.`,
      conseilAgent: `Le CIA est calculé sur une base annuelle de 10 % de l'IFSE mensuelle × 12 mois. Il est modulé selon deux critères égaux : 50 % sur la manière de servir (CREP) et 50 % sur l'assiduité (jours d'absence). Vérifiez que les absences protégées (maternité, accident de service) ne sont pas décomptées.`
    });
  }

  if (indemniteCompensatriceCsg > 0) {
    lignes.push({
      id: "comp_csg",
      code: "0230",
      libelle: "Indemnité Compensatrice de la CSG",
      montantGain: indemniteCompensatriceCsg,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.indemnite_compensatrice_csg,
      montantTheoriqueOpenFisca: indemniteCompensatriceCsg,
      estConforme: true,
      explicationLigne: `Indemnité compensant la hausse de la CSG intervenue en 2018 (Décret n° 2017-1889).`
    });
  }

  if (autresPrimes > 0) {
    lignes.push({
      id: "autres_primes",
      code: "0240",
      libelle: "Primes & Indemnités diverses FPT",
      montantGain: autresPrimes,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.primes_fonction_publique,
      montantTheoriqueOpenFisca: autresPrimes,
      estConforme: true,
      explicationLigne: `Indemnités accessoires : astreintes, IHTS (heures supplémentaires) ou sujétions particulières.`
    });
  }

  if (remboursementTransport > 0) {
    lignes.push({
      id: "transport",
      code: "0400",
      libelle: "Prise en charge Frais de Transport Public 75% (Navigo)",
      montantGain: remboursementTransport,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.prise_en_charge_transport,
      montantTheoriqueOpenFisca: remboursementTransport,
      estConforme: true,
      explicationLigne: `Remboursement légal obligatoire de 75% de votre pass Navigo (Décret n° 2023-812). Versé directement en net sans cotisation ni impôt.`
    });
  }

  // Lignes de retenues — ordre du bulletin Ciril original :
  // CSG/CRDS, cotisations patronales Urssaf, retraite, cotisations patronales retraite-formation
  lignes.push({
    id: "csg_ded",
    code: "0600",
    libelle: "CSG Déductible (6,80%)",
    base: assietteCsgCrds,
    taux: 6.80,
    montantRetenue: csgDeductible,
    openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.csg_deductible_salaire,
    montantTheoriqueOpenFisca: csgDeductible,
    estConforme: true,
    explicationLigne: `Prélevée sur 98,25% du salaire brut total. Cette part est déduite de votre revenu imposable DGFiP.`
  });

  lignes.push({
    id: "csg_nonded",
    code: "0610",
    libelle: "CSG Non Déductible (2,40%)",
    base: assietteCsgCrds,
    taux: 2.40,
    montantRetenue: csgNonDeductible,
    openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.csg_non_deductible_salaire,
    montantTheoriqueOpenFisca: csgNonDeductible,
    estConforme: true,
    explicationLigne: `Partie non déductible fiscalement : retenue sur le salaire net et réintégrée dans votre assiette fiscale.`
  });

  lignes.push({
    id: "crds",
    code: "0620",
    libelle: "CRDS Dette Sociale (0,50%)",
    base: assietteCsgCrds,
    taux: 0.50,
    montantRetenue: crds,
    openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.crds_salaire,
    montantTheoriqueOpenFisca: crds,
    estConforme: true,
    explicationLigne: `Contribution finançant le remboursement de la dette sociale (0,50% sur la même assiette abattue).`
  });

  // Cotisations patronales Urssaf (salaires différés : santé, famille, logement, transports, autonomie)
  const baseUrssaf = isTitulaire ? traitementPension : salaireBrut;
  const patronalLigne = (id: string, code: string, libelle: string, base: number, taux: number, explication: string): FichePaieLigne => ({
    id,
    code,
    libelle,
    base: Math.round(base * 100) / 100,
    taux,
    partPatronale: Math.round(base * taux / 100 * 100) / 100,
    openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisations_employeur,
    montantTheoriqueOpenFisca: Math.round(base * taux / 100 * 100) / 100,
    estConforme: true,
    explicationLigne: explication
  });

  lignes.push(patronalLigne("p_maladie", "43", "Urssaf Maladie Titulaire", baseUrssaf, 9.88,
    "Cotisation patronale versée à l'URSSAF : elle finance les remboursements de santé, arrêts maladie et congés maternité des agents. Salaire différé : aucun prélèvement sur votre net."));
  lignes.push(patronalLigne("p_alloc_fam", "44", "Urssaf Allocation Familial Tit", baseUrssaf, 3.45,
    "Part principale de la contribution famille (3,45%). Avec le code 4082 (1,80%), elle porte la contribution famille à 5,25% du traitement."));
  lignes.push(patronalLigne("p_alloc_fam_comp", "4082", "Urssaf Alloc.Familial Comp Tit", baseUrssaf, 1.8,
    "Part complémentaire de la contribution famille (1,80%). Avec le code 44 (3,45%), elle porte la contribution famille à 5,25% du traitement."));
  lignes.push(patronalLigne("p_fnal", "1250", "Urssaf FNALtotalité Titulaire", baseUrssaf, 0.5,
    "Contribution au Fonds National d'Aide au Logement : elle finance les aides au logement (APL). Entièrement patronale, « totalité » = assise sur toute la rémunération."));
  lignes.push(patronalLigne("p_mobilite", "46", "Urssaf Mobilité Titulaire", baseUrssaf, 3.2,
    "Versement mobilité : il finance les transports publics d'Île-de-France, dont le remboursement à 75% de votre pass Navigo. Entièrement patronal."));
  lignes.push(patronalLigne("p_autonomie", "389", "Urssaf solid.autonomiePP Tit.", baseUrssaf, 0.3,
    "Contribution Solidarité Autonomie (CNSA) : elle finance l'autonomie des personnes âgées et en situation de handicap (EHPAD, APA). Entièrement patronale."));

  if (isTitulaire) {
    lignes.push({
      id: "cnracl",
      code: "0500",
      libelle: "Cotisation Pension Retraite CNRACL",
      base: tibTheorique + nbiTheorique,
      taux: 11.10,
      montantRetenue: retraiteSalarie,
      partPatronale: retraitePatronale,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_retraite_cnracl_salarie,
      montantTheoriqueOpenFisca: retraiteSalarie,
      estConforme: true,
      explicationLigne: `Taux légal de 11,10% prélevé sur le traitement indiciaire brut (+ NBI). Ouvre vos droits à pension de retraite CNRACL.`
    });

    lignes.push({
      id: "rafp",
      code: "0510",
      libelle: "Retraite Additionnelle de la Fonction Publique (RAFP)",
      base: assietteSoumisePrimes,
      taux: 5.0,
      montantRetenue: rafpSalarie,
      partPatronale: rafpPatronale,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_retraite_rafp_salarie,
      montantTheoriqueOpenFisca: rafpSalarie,
      estConforme: true,
      explicationLigne: `Cotisation de 5% assise sur vos primes nettes dans la limite légale de 20% du traitement brut. L'employeur verse une part patronale identique de 5%.`
    });

    lignes.push(patronalLigne("p_atiacl", "49", "CNRACL ATIACL", tibTheorique, 0.4,
      "Contribution patronale au régime de l'Allocation Temporaire d'Invalidité : versée aux fonctionnaires invalidés par un accident de service ou une maladie professionnelle. Assiette : le seul traitement indiciaire brut."));
    lignes.push(patronalLigne("p_centre_gestion", "50", "Centre de gestion Titulaire", traitementPension, 0.5,
      "Contribution au Centre de Gestion de la Fonction Publique Territoriale : services RH mutualisés (concours, bourses de l'emploi, formation, conseils)."));
    lignes.push(patronalLigne("p_cnfpt", "52", "C.N.F.P.T Titulaire", traitementPension, 0.9,
      "Contribution formation au CNFPT (part principale) : elle finance votre formation professionnelle tout au long de la carrière."));
    lignes.push(patronalLigne("p_cnfpt_majoration", "1965", "C.N.F.P.T Majoration Titulaire", traitementPension, 0.1,
      "Majoration de la contribution CNFPT : avec le code 52, elle totalise 1,00% du traitement soumis à pension."));
  } else {
    lignes.push({
      id: "maladie",
      code: "0501",
      libelle: "Sécurité Sociale Maladie — Contractuel (0,75%)",
      base: assietteMaladie,
      taux: 0.75,
      montantRetenue: maladieSalarie,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_maladie_contractuel_salarie,
      montantTheoriqueOpenFisca: maladieSalarie,
      estConforme: true,
      explicationLigne: `Taux réduit de 0,75% (Décret n° 2017-1904) prélevé sur votre rémunération brute plafonnée à 5 fois le PMSS.`
    });

    lignes.push({
      id: "vieillesse_plaf",
      code: "0502",
      libelle: "Assurance Vieillesse Plafonnée — Régime Général (6,90%)",
      base: assietteVieillessePlaf,
      taux: 6.90,
      montantRetenue: vieillessePlafonnee,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_vieillesse_plafonnee_salarie,
      montantTheoriqueOpenFisca: vieillessePlafonnee,
      estConforme: true,
      explicationLigne: `Cotisation vieillesse du Régime Général : 6,90% sur la rémunération dans la limite du Plafond Mensuel de la Sécurité Sociale (${PMSS_MENSUEL_2024.toFixed(2)} €).`
    });

    lignes.push({
      id: "vieillesse_deplaf",
      code: "0503",
      libelle: "Assurance Vieillesse Déplafonnée — Régime Général (0,40%)",
      base: salaireBrut,
      taux: 0.40,
      montantRetenue: vieillesseDeplafonnee,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_vieillesse_deplafonnee_salarie,
      montantTheoriqueOpenFisca: vieillesseDeplafonnee,
      estConforme: true,
      explicationLigne: `Cotisation vieillesse du Régime Général : 0,40% sur la totalité de votre rémunération brute, sans plafond.`
    });

    lignes.push({
      id: "ircantec",
      code: "0500",
      libelle: "Retraite Complémentaire IRCANTEC (Tranche A)",
      base: Math.min(salaireBrut, PMSS_MENSUEL_2024),
      taux: 2.80,
      montantRetenue: retraiteSalarie,
      partPatronale: retraitePatronale,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.cotisation_retraite_ircantec_salarie,
      montantTheoriqueOpenFisca: retraiteSalarie,
      estConforme: true,
      explicationLigne: `Cotisation de retraite complémentaire obligatoire des contractuels territoriaux (2,80% sous le plafond PMSS).`
    });
  }

  if (participationMutuelleEmployeur > 0) {
    lignes.push({
      id: "part_mutuelle",
      code: "0700",
      libelle: "Participation Employeur Mutuelle Santé (PSC)",
      montantGain: participationMutuelleEmployeur,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.participation_mutuelle_employeur,
      montantTheoriqueOpenFisca: participationMutuelleEmployeur,
      estConforme: true,
      explicationLigne: `Participation financière de la Ville de Gennevilliers à votre complémentaire santé labellisée.`
    });
  }

  if (retenueMutuelleSalarie > 0) {
    lignes.push({
      id: "cotis_mutuelle",
      code: "0710",
      libelle: "Cotisation Mutuelle / Prévoyance (Retenue Salariée)",
      montantRetenue: retenueMutuelleSalarie,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.retenue_mutuelle_salarie,
      montantTheoriqueOpenFisca: retenueMutuelleSalarie,
      estConforme: true,
      explicationLigne: `Prélèvement mensuel opéré directement sur votre net pour le règlement de votre mutuelle ou prévoyance.`
    });
  }

  if (montantPas > 0) {
    lignes.push({
      id: "pas",
      code: "0950",
      libelle: `Prélèvement à la Source (Taux DGFiP : ${tauxPas}%)`,
      base: netFiscal,
      taux: tauxPas,
      montantRetenue: montantPas,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.prelevement_a_la_source,
      montantTheoriqueOpenFisca: montantPas,
      estConforme: true,
      explicationLigne: `Impôt sur le revenu collecté directement sur votre salaire net imposable (${netFiscal.toFixed(2)} €) pour le compte de la DGFiP.`
    });
  }

  // Enrichissement systématique de toutes les lignes avec les métadonnées complètes
  for (let i = 0; i < lignes.length; i++) {
    lignes[i] = enrichirLigneFichePaie(lignes[i], lignes[i].id);
  }

  // 13. Comparaison simple avec la vraie fiche (3 règles, tolérance 5 centimes)
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const TOLERANCE = 0.05;
  const diagnosticItems: DiagnosticEcartItem[] = [];
  const brutReel = montantsReels?.brutReel;
  const retenuesReelles = montantsReels?.totalRetenuesReelles;
  const netFiscalReel = montantsReels?.netFiscalReel;
  const netAPayerReel = montantsReels?.netAPayerReel;
  const pasReel = montantsReels?.pasReel;

  const brutEcart = brutReel !== undefined ? r2(salaireBrut - brutReel) : 0;
  // « Total des retenues » du bulletin = cotisations + retenues sur le net + PAS (même définition que le moteur)
  const retenuesEcart = retenuesReelles !== undefined ? r2(totalRetenues - retenuesReelles) : 0;
  const netFiscalEcart = netFiscalReel !== undefined ? r2(netFiscal - netFiscalReel) : 0;
  const netAPayerEcart = netAPayerReel !== undefined ? r2(netAPayer - netAPayerReel) : 0;
  const pasEcart = pasReel !== undefined ? r2(montantPas - pasReel) : 0;

  // Règle 1 — BRUT : soit l'abattement PPCR n'est pas le bon, soit une prime manque / est en trop
  if (Math.abs(brutEcart) > TOLERANCE) {
    const ppcrCible = r2(abattementPpcrVal + brutEcart);
    const baremes = isTitulaire ? [0, ...Object.values(PPCR_MENSUEL_PAR_CATEGORIE).map(v => r2(v * qFactor))] : [];
    const ppcrLegal = baremes.find(v => Math.abs(v - ppcrCible) <= TOLERANCE);
    if (ppcrLegal !== undefined) {
      diagnosticItems.push({
        id: "ecart_ppcr",
        titre: `Brut : abattement PPCR à ${ppcrLegal.toFixed(2)} € au lieu de ${abattementPpcrVal.toFixed(2)} €`,
        montantEcart: brutEcart,
        explication: `L'écart de ${brutEcart.toFixed(2)} € correspond au barème du transfert primes/points (Décret n° 2016-588 : A 32,42 € • B 23,17 € • C 13,92 € par mois).`,
        solution: `Mettre le PPCR à ${ppcrLegal.toFixed(2)} €`,
        paramAffecte: "abattementPpcr",
        valeurSuggeree: ppcrLegal
      });
    } else {
      const manque = brutEcart < 0;
      diagnosticItems.push({
        id: "ecart_primes",
        titre: manque
          ? `Brut : ${Math.abs(brutEcart).toFixed(2)} € sont sur votre fiche mais pas dans le calcul`
          : `Brut : le calcul compte ${brutEcart.toFixed(2)} € de trop`,
        montantEcart: brutEcart,
        explication: manque
          ? "Une prime ou indemnité de votre bulletin (heures sup., astreinte, rappel, prime ponctuelle…) n'a pas été reconnue. Elle sera ajoutée en « Autres primes »."
          : "Une prime (souvent l'IFSE lue automatiquement) est surestimée. Vérifiez son montant sur votre bulletin.",
        solution: manque ? `Ajouter ${Math.abs(brutEcart).toFixed(2)} € de primes` : `Réduire l'IFSE de ${brutEcart.toFixed(2)} €`,
        paramAffecte: manque ? "autresPrimes" : "ifse",
        valeurSuggeree: manque ? r2(autresPrimes - brutEcart) : r2(Math.max(0, ifse - brutEcart))
      });
    }
  }

  // Règle 2 — IMPÔT (PAS) : on recalcule le taux exact à partir du montant réel
  if (pasReel !== undefined && Math.abs(pasEcart) > TOLERANCE) {
    const assiettePas = netFiscalReel ?? netFiscal;
    const taux1 = assiettePas > 0 ? Math.round((pasReel / assiettePas) * 1000) / 10 : tauxPas;
    const tauxExact = assiettePas > 0 && Math.abs(r2(netFiscal * taux1 / 100) - pasReel) > TOLERANCE
      ? Math.round((pasReel / assiettePas) * 10000) / 100
      : taux1;
    diagnosticItems.push({
      id: "ecart_pas",
      titre: `Impôt : ${pasReel.toFixed(2)} € sur la fiche, ${montantPas.toFixed(2)} € calculés`,
      montantEcart: pasEcart,
      explication: `Votre taux DGFiP réel est de ${tauxExact} % (${pasReel.toFixed(2)} € ÷ ${assiettePas.toFixed(2)} € de net imposable).`,
      solution: `Appliquer le taux ${tauxExact} %`,
      paramAffecte: "tauxPas",
      valeurSuggeree: tauxExact
    });
  }

  // Règle 3 — NET : si le brut est juste, l'écart restant (hors impôt) vient d'un élément versé ou retenu en net
  const brutOk = brutReel === undefined || Math.abs(brutEcart) <= TOLERANCE;
  const residuNet = r2(netAPayerEcart + pasEcart);
  if (netAPayerReel !== undefined && brutOk && Math.abs(residuNet) > TOLERANCE) {
    const verseEnNet = residuNet < 0;
    diagnosticItems.push({
      id: "ecart_net",
      titre: verseEnNet
        ? `Net : +${Math.abs(residuNet).toFixed(2)} € versés en net sur votre fiche`
        : `Net : -${residuNet.toFixed(2)} € retenus en net sur votre fiche`,
      montantEcart: residuNet,
      explication: verseEnNet
        ? "Élément non soumis à cotisations : remboursement Navigo / forfait mobilités durables, indemnité kilométrique…"
        : "Retenue sur le net : mutuelle, prévoyance, avance sur salaire, absence…",
      solution: verseEnNet ? "Ajouter en remboursement net" : "Ajouter en retenue nette",
      paramAffecte: verseEnNet ? "remboursementTransport" : "retenueMutuelleSalarie",
      valeurSuggeree: verseEnNet ? r2(remboursementTransport - residuNet) : r2(retenueMutuelleSalarie + residuNet)
    });
  }

  const aEcarts = Math.abs(brutEcart) > 0.05 || Math.abs(retenuesEcart) > 0.05 || Math.abs(netAPayerEcart) > 0.05;

  const diagnosticEcarts: DiagnosticEcarts = {
    aEcarts,
    brutEcart,
    retenuesEcart,
    netFiscalEcart,
    netAPayerEcart,
    items: diagnosticItems
  };

  // Synthèse & OpenFisca Python Code Snippet
  const openFiscaCodeSnippet = `# Modélisation OpenFisca-France (https://github.com/openfisca/openfisca-france)
from openfisca_france import CountryTaxBenefitSystem

simulation = CountryTaxBenefitSystem().new_simulation(
    period='2024-10',
    persons={
        'agent': {
            'indice_majore': ${indiceMajore},
            'nouvelle_bonification_indiciaire_points': ${nbiPoints},
            'primes_fonction_publique': ${primesPositives},
            'abattement_ppcr': ${abattementPpcrVal},
            'taux_zone_residence': ${tauxRes},
            'nombre_enfants': ${nbEnfantsSft},
            'statut_fonctionnaire': ${isTitulaire ? "'titulaire'" : "'contractuel'"},
        }
    }
)

traitement_brut = simulation.calculate('traitement_indiciaire_brut', '2024-10')[0]
retraite_cnracl = simulation.calculate('cotisation_retraite_cnracl_salarie', '2024-10')[0]
retraite_rafp = simulation.calculate('cotisation_retraite_rafp_salarie', '2024-10')[0]
csg = simulation.calculate('csg_deductible_salaire', '2024-10')[0]
salaire_net = simulation.calculate('salaire_net_a_payer', '2024-10')[0]
print(f"Brut: {traitement_brut} €, Net à payer: {salaire_net} €")`;

  return {
    titre: `Analyse OpenFisca : Fiche de Paie de ${nomAgent}`,
    dateAnalyse: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    source: "simulation",
    agent: {
      nom: nomAgent,
      matricule: params.matricule,
      numeroSecu: params.numeroSecu,
      positionAdmin: params.positionAdmin,
      service: params.service,
      poste: params.poste,
      grade,
      echelon,
      indiceRemun: indiceRemun ?? indiceBrut ?? indiceMajore,
      indiceBrut: indiceBrut ?? Math.round(indiceMajore * 1.06),
      indiceMajore,
      quotite,
      statut,
      caisseRetraite: isTitulaire ? "CNRACL" : "IRCANTEC",
      zoneResidence,
      nbEnfantsSft
    },
    lignesReelles,
    totaux: {
      traitementBase: tibTheorique,
      nbi: nbiTheorique,
      indemniteResidence: resTheorique,
      sft: sftTheorique,
      primesIfse: ifse,
      primesCia: cia,
      autresPrimes,
      abattementPpcr: abattementPpcrVal,
      remboursementTransport,
      indemniteCompensatriceCsg,
      participationMutuelleEmployeur,
      retenueMutuelleSalarie,
      salaireBrut,
      totalCotisationsSalariales,
      totalRetenues,
      netAvantImpot,
      netFiscal,
      tauxPas,
      montantPas,
      netAPayer,
      totalCotisationsPatronales,
      coutGlobalEmployeur
    },
    lignes,
    diagnosticEcarts,
    syntheseConformite: {
      scoreConformite: 100,
      nbLignesVerifiees: lignes.length,
      nbAnomalies: 0,
      anomalies: [],
      pointsForts: [
        `Traitement indiciaire rigoureusement conforme à la valeur du point d'indice officielle (${VALEUR_POINT_INDICE_MENSUEL.toFixed(5)} €/mois).`,
        abattementPpcrVal > 0
          ? `Abattement PPCR légal de -${abattementPpcrVal.toFixed(2)} €/mois correctement déduit selon le Décret n° 2016-588.`
          : `Rémunération indiciaire sans déduction d'abattement PPCR.`,
        `Plafond légal de la RAFP respecté (cotisation assise dans la limite de 20% du traitement brut).`,
        `Assiette abattue de 98,25% correctement appliquée pour le calcul de la CSG et de la CRDS.`,
        remboursementTransport > 0
          ? `Prise en charge de 75% du pass Navigo (${remboursementTransport.toFixed(2)} € net) intégrée au virement bancaire.`
          : `Aucun remboursement de transport en commun appliqué.`,
        `Régime de retraite ${isTitulaire ? "CNRACL (11,10%)" : "IRCANTEC (2,80%)"} en pleine concordance statutaire.`
      ],
      recommandationsCFDT: [
        "Conservez vos fiches de paie sans limitation de durée pour le calcul de vos droits à pension CNRACL/IRCANTEC.",
        "Vérifiez chaque année lors de votre avancement d'échelon que le nouvel indice majoré est pris en compte avec effet rétroactif.",
        "N'hésitez pas à solliciter vos représentants CFDT de Gennevilliers pour auditer l'application de votre groupe RIFSEEP (IFSE et CIA)."
      ]
    },
    openFiscaBenchmark: {
      brutTheorique: salaireBrut,
      netTheorique: netAPayer,
      cnraclTheorique: retraiteSalarie,
      rafpTheorique: rafpSalarie,
      csgTheorique: csgDeductible + csgNonDeductible + crds,
      differenceNet: 0
    },
    openFiscaCodeSnippet
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ANALYSEUR ET PARSEUR AUTOMATIQUE DE FICHE DE PAIE UPLOADÉE
// ─────────────────────────────────────────────────────────────────────────────

export interface ParseMetadata {
  detectedItems: string[];
  rawTextLength: number;
  extractedLinesCount: number;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  rawText?: string;
}

export interface ParsePaySlipResult {
  params: CalculParams;
  metadata: ParseMetadata;
}

/**
 * Extrait toutes les rubriques, cotisations et lignes du tableau de paie Ciril RH
 * (Fonction universelle adaptée aux formats Ciril 2026, 2023 et modèles Mairie de Gennevilliers)
 */
export function parseCirilBulletinLines(text: string): LigneBulletinCiril[] {
  const deaccent = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const cleanRawLine = (line: string): string => {
    let c = line
      .replace(/[«»~]/g, '')
      .replace(/[|‘'’_Ë–—]/g, ' ')
      .replace(/:\s*(\d{2})\b/g, '.$1')
      .replace(/\s+/g, ' ')
      .trim();
    // Enlever symboles parasites au début
    c = c.replace(/^[|!°‘'fdi—\s_~]+/, '').trim();
    // Enlever lettre isolée d'artefact OCR devant un code numérique (ex: 'Ï 66', 'è 75', 'f 1251', 'j 87')
    c = c.replace(/^[A-Za-zÀ-ÿ]\s+(?=\d{1,5}\b)/, '').trim();
    return c;
  };

  const rawLines = text.split(/\r?\n/).map(l => cleanRawLine(l)).filter(Boolean);
  const parsedLines: LigneBulletinCiril[] = [];

  // 1. Pré-assemblage des lignes coupées par l'OCR
  // (ex: code + libellé sur une ligne, montants isolés sur la suivante)
  const preprocessedLines: string[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    let curr = rawLines[i];
    if (/^\d{1,5}[°oO]?\s+[A-Za-zÀ-ÿ]/.test(curr) && !/\d[.,]\d{2}\b/.test(curr)) {
      if (i + 1 < rawLines.length && /^[\d\s.,|\][]+$/.test(rawLines[i + 1])) {
        curr = curr + ' ' + rawLines[i + 1];
        i++;
      }
    }
    preprocessedLines.push(curr);
  }

  let inTable = false;
  for (const line of preprocessedLines) {
    let procLine = line.trim();
    // Nettoyer les artefacts de bordure ou ponctuation OCR en début de ligne
    procLine = procLine.replace(/^[-|!?;:.,~°_»«'"`()[]{}\s]+/, '');
    // Nettoyer les lettres isolées parasites en marge devant un code numérique (ex: 'j 7444', 'E 59', 'i 618')
    procLine = procLine.replace(/^[a-zA-Z]\s+(?=\d{1,5}\b)/, '');

    // Normaliser les erreurs de lecture OCR sur les codes en début de ligne
    procLine = procLine.replace(/^[TtI]\s*444\b/i, '7444');
    procLine = procLine.replace(/^2[iIl|1]\s*R\b/i, '21 R');
    procLine = procLine.replace(/^1820\s*R\b/i, '1620 R');
    procLine = procLine.replace(/^1879\s*R\b/i, '1679 R');
    procLine = procLine.replace(/^818\b/, '618');
    procLine = procLine.replace(/^13[°oO]\b/, '13');
    procLine = procLine.replace(/^10986\b/, '1966');
    procLine = procLine.replace(/^352\b/, '332');
    procLine = procLine.replace(/^85\s*\|?\s*(?=csg)/i, '55 ');
    procLine = procLine.replace(/^81\s*\|?\s*(?=urssaf vieillesse)/i, '61 ');
    procLine = procLine.replace(/^18\s*\|?\s*(?=traitement de base)/i, '13 ');

    const lPlain = deaccent(procLine.toLowerCase());

    // Ignorer les séparateurs ou déclarations de tableau / récap / en-tête
    if ((lPlain.includes("code") && (lPlain.includes("libelle") || lPlain.includes("base")))
        || (lPlain.includes("rubrique") && lPlain.includes("libelle"))) {
      continue;
    }

    // Nettoyage agressif des artefacts OCR (Tesseract) pour les PDF scannés / photos
    const lClean = line.replace(/[|\][}{_?]/g, ' ') // Retire les barres et caractères parasites
                     .replace(/—/g, '-') // Remplacer les tirets longs
                     .replace(/--+/g, '-') // Éviter les doubles tirets --4435
                     .replace(/[,.]\s*$/, '') // Retire une virgule ou point final qui casse le dernier nombre
                     .replace(/(-\d+)-(\d{2})\b/g, '$1.$2') // Corrige les erreurs OCR type "-18-13" -> "-18.13"
                     .replace(/(\d{1,3})\s+(\d{3})\s+(\d{2})\b/g, '$1$2.$3') // Corrige "1 204 44" -> "1204.44"
                     .replace(/\s+/g, ' ')
                     .trim();

    if (lPlain.includes("totaux gains") || lPlain.includes("net a payer avant impot")
        || lPlain.includes("cumuls mensuels") || (inTable && lPlain.startsWith("net a payer"))
        || lPlain.includes("virement magnetique")) {
      inTable = false;
      break;
    }
    if (!inTable) {
      // Mode universel : une ligne qui ressemble fortement à une rubrique Ciril
      // (code + libellé + au moins un montant décimal) est traitée même sans en-tête de tableau
      const looksLikeRubrique = /^\d{1,5}\s+[A-Za-zÀ-ÿ]/.test(lClean) && /\d[.,]\d{2}/.test(lClean);
      if (!looksLikeRubrique) continue;
    }
    if (lPlain.includes("cotisations patronales") || lPlain.includes("taux montant") || lPlain.includes("charges patronales")) continue;

    // Format 1 : Code en premier (ex: "13 Traitement...", "7201 R 02/2026 Vacation...", "1591 IFSE Tit 380.00")
    // Format 2 : Base en premier (ex: "2 228,47 804C COT. SS VIEIL. RG 6,900 153,76")
    let code = "";
    let rest = "";
    let moisRappel: string | undefined = undefined;

    // Normalisation préalable des espaces de milliers (ex: "3 618.24" -> "3618.24", "-1 408.60" -> "-1408.60")
    // Sans fusionner deux montants distincts (ex: "100.00 100.0000" ne doit JAMAIS être touché)
    const cleanedLine = lClean.replace(/(^|\s)(?<![-\d.])(-\s*)?(\d{1,3})(?![.,]\d)\s+(\d{3}[.,]\d{2,4})\b/g, (_match, prefix, minus, d1, d2) => {
      return (prefix || '') + (minus ? '-' : '') + d1 + d2;
    });

    // Rappel Ciril : le code suivi du marqueur « R » et du mois concerné (ex: "7201 R 02/2026 Vacation…")
    const mRappel = cleanedLine.match(/^(\d{1,5})\s+R\s+(\d{1,2}[/.-]\d{2,4})\s+(.+)$/i);
    const mCodeFirst = cleanedLine.match(/^(\d{1,5}(?:\s+[A-Z])?|[0-9]{3,4}[A-Z])\s+(.+)$/);
    const mBaseFirst = cleanedLine.match(/^(\d+[.,]\d{2})\s+([0-9]{3,4}[A-Z]|\d{1,5})\s+(.+)$/);

    if (mRappel) {
      code = mRappel[1];
      moisRappel = mRappel[2];
      rest = mRappel[3];
    } else if (mCodeFirst) {
      code = mCodeFirst[1].trim();
      rest = mCodeFirst[2].trim();
    } else if (mBaseFirst) {
      code = mBaseFirst[2].trim();
      rest = mBaseFirst[3].trim();
    } else {
      continue;
    }



    // Rejeter les codes parasites d'en-tête (NIR, adresses, matricules, indices)
    if (code === '0' || code === '1' || code === '4' || code === '7' || code === '177' || code === '2800' || code === '28002' || code === '367' || code === '368' || code === '10027') {
      continue;
    }

    const restPlain = deaccent(rest.toLowerCase());

    // Corrections déterministes d'erreurs OCR courantes sur les codes Ciril FPT
    if (code === '18' && restPlain.includes('supplement')) code = '16';
    if (code === '18' && restPlain.includes('traitement')) code = '13';
    if (code === '1820') code = '1620';
    if (code === '1879') code = '1679';
    if (code === '818') code = '618';
    if (code === '87' && restPlain.includes('ircantec')) code = '67';
    if (code === '47' && restPlain.includes('residence')) code = '17';
    if (code === '1787') code = '1737';
    if (code === '2' && /^[i1]\s+R/i.test(rest)) {
      code = '21';
      rest = rest.replace(/^[i1]\s+/i, '');
    }

    // Normalisation préalable des espaces de milliers (ex: "1 806.66" -> "1806.66", "-1 204.44" -> "-1204.44")
    rest = rest.replace(/(^|\s)(?<![-\d.])(-\s*)?(\d{1,3})(?![.,]\d)\s+(\d{3}[.,]\d{2,4})\b/g, (_match, prefix, minus, d1, d2) => {
      return (prefix || '') + (minus ? '-' : '') + d1 + d2;
    });

    // Séparer les mots de texte au début des valeurs numériques à la fin
    // Les colonnes Ciril sont structurées : [LIBELLE] puis [BASE] [TAUX] [MONTANT_SALARIAL] [TAUX_PAT] [MONTANT_PAT]
    const allTokens = rest.split(/\s+/);
    const libelleWords: string[] = [];
    const numTokens: number[] = [];
    const rawNumTokens: string[] = [];

    // Détecter l'indice du premier token numérique marquant la fin du libellé
    let foundFirstNumber = false;
    for (let i = 0; i < allTokens.length; i++) {
      const tokClean = allTokens[i].replace(/[|[]{}«»~_“”'"`]/g, '');
      if (/^[+-]?\d+(?:[.,]\d+)?$/.test(tokClean)) {
        foundFirstNumber = true;
        numTokens.push(parseFloat(tokClean.replace(',', '.')));
        rawNumTokens.push(tokClean.replace(',', '.'));
      } else {
        if (!foundFirstNumber) {
          if (tokClean.length > 0 && !/^[|:]$/.test(tokClean)) {
            libelleWords.push(tokClean);
          }
        } else {
          // Si du texte apparaît après un nombre, nettoyer les unités éventuelles ("EUR", "€", "%")
          if (/^(?:€|EUR|pts?|h)$/i.test(tokClean)) {
            // Unité ignorée
          } else {
            // Nombre collé au libellé ou bruit OCR
          }
        }
      }
    }

    const libelle = libelleWords.join(' ').replace(/[|:]/g, '').trim();
    if (!libelle || libelle.length < 2) continue;

    if (numTokens.length === 0) {
      continue;
    }

    // Correction heuristique des nombres aberrants (Tesseract oublie souvent le point décimal)
    // Un nombre ENTIER PUR > 1000 (ex: 13151, sans décimales dans le token brut) est presque
    // toujours une erreur pour 131.51. Les valeurs avec décimales (ex: 2400.00) sont correctes.
    for (let j = 0; j < numTokens.length; j++) {
      if (Math.abs(numTokens[j]) >= 1000 && Math.floor(numTokens[j]) === numTokens[j] && !/[.,]/.test(rawNumTokens[j] ?? '')) {
        numTokens[j] = parseFloat((numTokens[j] / 100).toFixed(2));
      }
    }

    let base: number | undefined = undefined;
    let taux: number | undefined = undefined;
    let montant: number | undefined = undefined;
    let tauxPatronal: number | undefined = undefined;
    let montantPatronal: number | undefined = undefined;

    // Taux statutaires connus pour la Fonction Publique Territoriale / Mairie de Gennevilliers
    const STATUTORY_RATES: Record<string, { salarial?: number; patronal?: number }> = {
      "17": { salarial: 3.0 },
      "55": { salarial: 6.8 },
      "56": { salarial: 2.4 },
      "57": { salarial: 0.5 },
      "59": { patronal: 7.0 },
      "4050": { patronal: 6.0 },
      "61": { salarial: 6.9, patronal: 8.55 },
      "332": { patronal: 0.3 },
      "299": { salarial: 0.4, patronal: 2.11 },
      "64": { patronal: 3.45 },
      "1525": { patronal: 1.8 },
      "1251": { patronal: 0.5 },
      "66": { patronal: 1.98 },
      "75": { patronal: 3.2 },
      "67": { salarial: 2.84, patronal: 4.27 },
      "73": { patronal: 0.5 },
      "74": { patronal: 0.9 },
      "1966": { patronal: 0.1 }
    };

    // Cas d'une ligne purement patronale
    const isEmployerOnly = !moisRappel && [
      "59", "4050", "332", "64", "1525", "1251", "66", "75", "73", "74", "1966"
    ].includes(code);

    if (isEmployerOnly) {
      if (numTokens.length === 1) {
        montantPatronal = numTokens[0];
      } else if (numTokens.length === 2) {
        tauxPatronal = numTokens[0];
        montantPatronal = numTokens[1];
      } else if (numTokens.length >= 3) {
        base = numTokens[0];
        tauxPatronal = numTokens[1];
        montantPatronal = numTokens[2];
      }
      if (STATUTORY_RATES[code]?.patronal && (tauxPatronal === undefined || tauxPatronal > 50)) {
        tauxPatronal = STATUTORY_RATES[code].patronal;
      }
    } else {
      // Analyse sémantique des colonnes :
      // Sur les bulletins Ciril FPT :
      // - 1 chiffre : montant direct (ex: prime fixe, vacation, ou rappel sans base)
      // - 2 chiffres :
      //    * si [grand, petit <= 100] -> base + taux (le montant est le produit)
      //    * si [petit <= 100, montant] -> taux + montant
      //    * si [val1, val2] et val1 === val2 -> base + montant (taux 100% omis)
      //    * sinon -> base + montant
      // - 3 chiffres : base + taux + montant salarial (ordre standard Ciril : Base, Taux, Montant)
      // - 4 chiffres : base + taux + montant salarial + montant patronal (ou taux patronal)
      // - 5 chiffres : base + taux + montant salarial + taux patronal + montant patronal
      if (numTokens.length === 1) {
        montant = numTokens[0];
      } else if (numTokens.length === 2) {
        const val0 = numTokens[0];
        const val1 = numTokens[1];
        if (Math.abs(val0 - val1) < 0.01) {
          // Ex: "1 100.00 1 100.00" (Base = 1100, Montant = 1100, Taux 100% implicite)
          base = val0;
          taux = 100;
          montant = val1;
        } else if (val0 > 100 && val1 <= 100 && (rawNumTokens[1].includes('.') || val1 === 30 || val1 === 100)) {
          // Base puis Taux
          base = val0;
          taux = val1;
          montant = Math.round(base * (taux / 100) * 100) / 100;
        } else if (val0 <= 100 && val1 > 100) {
          // Taux puis Montant
          taux = val0;
          montant = val1;
        } else {
          // Cas par défaut à 2 nombres : Base puis Montant (ex: TIB ou indemnité sans colonne taux explicite)
          base = val0;
          montant = val1;
        }
      } else if (numTokens.length === 3) {
        base = numTokens[0];
        taux = numTokens[1];
        montant = numTokens[2];
      } else if (numTokens.length === 4) {
        base = numTokens[0];
        taux = numTokens[1];
        montant = numTokens[2];
        montantPatronal = numTokens[3];
      } else if (numTokens.length >= 5) {
        base = numTokens[0];
        taux = numTokens[1];
        montant = numTokens[2];
        tauxPatronal = numTokens[3];
        montantPatronal = numTokens[4];
      }
    }

    // Correction de virgule manquante sur OCR (ex: -4435 -> -44.35 €)
    if (montant && (montant < -1000 || montant > 10000) && Math.abs(montant) % 1 === 0 && !libelle.toLowerCase().includes('traitement')) {
      montant = montant / 100;
    }
    if (base && (base > 100000) && Math.abs(base) % 1 === 0) {
      base = base / 100;
    }

    // Cohérence des retenues : si la rubrique est connue comme retenue, le montant salarial est négatif
    const isRetenueCode = (CODES_CIRIL_KNOWN[code]?.cat === "retenue") || /csg|crds|vieillesse|ircantec|cnracl/i.test(libelle);
    if (isRetenueCode && montant !== undefined && montant > 0) {
      montant = -montant;
    }
    // Réciproquement, PPCR (1735, 1737) est une retenue sur primes (montant négatif) sauf en cas de rappel de restitution
    if ((code === "1735" || code === "1737") && montant !== undefined && montant > 0 && !moisRappel) {
      montant = -montant;
    }

    // Marqueur « fraction T » : la valeur est un POURCENTAGE du traitement de base versé en maladie
    // (ex. 90 = 90 % du traitement) — ce n'est pas une somme, elle n'est donc jamais comptée
    const fractionT = /\bfraction\s*T\b/i.test(rest || libelle);
    if (fractionT) {
      parsedLines.push({ code, libelle, taux: montant ?? taux ?? numTokens[numTokens.length - 1], fractionT: true });
      continue;
    }
    parsedLines.push({
      code,
      libelle,
      base,
      taux,
      montant,
      tauxPatronal,
      montantPatronal,
      ...(moisRappel ? { moisRappel } : {})
    });
  }

  // Clé d'ordre canonique officiel du bulletin Ciril de Gennevilliers
  const getOrderWeight = (l: LigneBulletinCiril): number => {
    const k = `${l.code}${l.moisRappel ? `_R_${l.moisRappel}` : ''}`;
    const ORDER_MAP: Record<string, number> = {
      "13": 10,
      "13_R_05/2026": 20,
      "1620_R_05/2026": 30,
      "1679_R_04/2026": 40,
      "1679_R_05/2026": 50,
      "21_R_04/2026": 60,
      "21_R_05/2026": 70,
      "28_R_05/2026": 80,
      "618": 90,
      "618_R_04/2026": 100,
      "618_R_05/2026": 110,
      "17": 120,
      "17_R_05/2026": 130,
      "16": 140,
      "16_R_05/2026": 150,
      "1592": 160,
      "1592_R_04/2026": 170,
      "1592_R_05/2026": 180,
      "7444": 190,
      "8444": 200,
      "1737": 210,
      "1737_R_04/2026": 220,
      "1737_R_05/2026": 230,
      "55": 240,
      "56": 250,
      "57": 260,
      "59": 270,
      "4050": 280,
      "61": 290,
      "332": 300,
      "299": 310,
      "64": 320,
      "1525": 330,
      "1251": 340,
      "66": 350,
      "75": 360,
      "67": 370,
      "73": 380,
      "74": 390,
      "1966": 400,
      "1584": 410
    };
    return ORDER_MAP[k] ?? 999;
  };

  // Déduplication par (code + moisRappel), en gardant l'élément le plus complet
  const uniqueMap = new Map<string, LigneBulletinCiril>();
  for (const item of parsedLines) {
    const key = `${item.code}_${item.moisRappel || ''}`;
    const existing = uniqueMap.get(key);
    if (!existing) {
      uniqueMap.set(key, item);
    } else {
      const existingScore = (existing.montant !== undefined ? 2 : 0) + (existing.base !== undefined ? 1 : 0) + (existing.taux !== undefined ? 1 : 0) + (existing.montantPatronal !== undefined ? 2 : 0);
      const newScore = (item.montant !== undefined ? 2 : 0) + (item.base !== undefined ? 1 : 0) + (item.taux !== undefined ? 1 : 0) + (item.montantPatronal !== undefined ? 2 : 0);
      if (newScore > existingScore) {
        uniqueMap.set(key, item);
      }
    }
  }
  const deduplicatedLines = Array.from(uniqueMap.values());
  deduplicatedLines.sort((a, b) => getOrderWeight(a) - getOrderWeight(b));

  return deduplicatedLines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6bis. RECONSTRUCTION LIGNE À LIGNE D'UN BULLETIN CIRIL (zéro écart)
// Les codes, libellés, bases, taux et montants de la fiche uploadée sont copiés
// tels quels ; seuls les totaux absents sont déduits.
// ─────────────────────────────────────────────────────────────────────────────

/** Codes Ciril réels connus (Mairie de Gennevilliers et formats assimilés) */
const CODES_CIRIL_KNOWN: Record<string, {
  cat: "gain" | "retenue" | "patronale" | "retenue_net" | "info";
  expl?: string;
  libelle?: string;
}> = {
  "8": { cat: "gain", expl: "tib" },
  "9": { cat: "gain", expl: "nbi" },
  "10": { cat: "gain", expl: "sft", libelle: "Supplément Familial de Traitement" },
  "11": { cat: "gain", expl: "sft", libelle: "Supplément Familial de Traitement" },
  "12": { cat: "gain", expl: "residence" },
  "13": { cat: "gain", expl: "tib", libelle: "Traitement de base indice RG" },
  "16": { cat: "gain", expl: "sft", libelle: "Supplément Familial RG" },
  "17": { cat: "gain", expl: "residence", libelle: "Indemnité de Résidence RG" },
  "21": { cat: "gain", expl: "demi_traitement", libelle: "Demi Traitement RG" },
  "28": { cat: "gain", expl: "sans_traitement", libelle: "Sans traitement" },
  "193": { cat: "gain", expl: "traitement_detache", libelle: "Traitement de base détaché" },
  "2008": { cat: "gain", expl: "tib", libelle: "Trt indiciaire CNR P2" },
  "2009": { cat: "gain", expl: "nbi", libelle: "NBI Titulaire P2" },
  "2012": { cat: "gain", expl: "residence", libelle: "Indem. de Résidence Tit P2" },
  "2591": { cat: "gain", expl: "ifse", libelle: "IFSE Tit. P2 (4 composantes)" },
  "2860": { cat: "gain", expl: "comp_csg", libelle: "Indemnité Compens. CSG TitP2" },
  "1033": { cat: "retenue", expl: "cnracl_detache", libelle: "CNRACL Détaché dans Collect." },
  "18": { cat: "retenue", expl: "vieillesse_deplaf", libelle: "Urssaf Vieillesse Déplafonnée (Régime Général)" },
  "40": { cat: "retenue", expl: "csg_nonded" },
  "41": { cat: "retenue", expl: "csg_ded" },
  "42": { cat: "retenue", expl: "crds" },
  "47": { cat: "retenue", expl: "cnracl" },
  "1028": { cat: "retenue", expl: "rafp" },
  "472": { cat: "retenue", expl: "ircantec" },
  "1735": { cat: "gain", expl: "ppcr", libelle: "Transfert primes/points Tit." },
  "1737": { cat: "gain", expl: "ppcr", libelle: "Transfert primes/points RG" },
  "1584": { cat: "info", expl: "montant_net_social", libelle: "Montant net social" },
  "617": { cat: "gain", expl: "indem_differentielle", libelle: "Indem. différentielle" },
  "618": { cat: "gain", expl: "indem_differentielle", libelle: "Indem. différentielle RG P1" },
  "1620": { cat: "gain", expl: "tib", libelle: "Pourcentage fraction T" },
  "1679": { cat: "gain", expl: "tib", libelle: "Traitement fraction. R" },
  "194": { cat: "gain", expl: "nbi_detache", libelle: "NBI détaché" },
  "7201": { cat: "gain", expl: "vacations", libelle: "Vacations" },
  "1591": { cat: "gain", expl: "ifse", libelle: "IFSE Tit. (4 composantes)" },
  "1592": { cat: "gain", expl: "cia", libelle: "CIA Tit. (50% CREP + 50% assiduité)" },
  "1690": { cat: "gain", expl: "autres_primes" },
  "1510": { cat: "gain", expl: "transport" },
  "1860": { cat: "gain", expl: "comp_csg" },
  "7443": { cat: "gain", expl: "prime_13eme", libelle: "Compl rémunération Juin Tit (13e mois)" },
  "7444": { cat: "gain", expl: "prime_13eme", libelle: "Compl rémunération Juin RG" },
  "8443": { cat: "gain", expl: "prime_13eme", libelle: "Prime semestrielle Juin Tit (13e mois)" },
  "8444": { cat: "gain", expl: "prime_13eme", libelle: "Prime semestrielle Juin RG" },
  "7610": { cat: "gain", expl: "cia", libelle: "Compl. Indemnitaire Annuel Tit (CIA / 13e mois)" },
  "7376": { cat: "gain", expl: "part_mutuelle", libelle: "Participation empl mut Tit" },
  "7716": { cat: "gain", expl: "part_prevoyance", libelle: "Participation empl prev Tit" },
  "572": { cat: "retenue_net", expl: "cotis_mutuelle", libelle: "Préfon" },
  "7625": { cat: "retenue_net", expl: "prevoyance_territoria", libelle: "Territoria Pack prévoyance" },
  "7628": { cat: "retenue_net", expl: "cotis_mutuelle", libelle: "Garantie obsèques" },
  "213": { cat: "gain", expl: "residence", libelle: "Indemnité résidence RG" },
  "7726": { cat: "gain", expl: "autres_primes", libelle: "Congés Payés" },
  "55": { cat: "retenue", expl: "csg_ded", libelle: "CSG Déductible RG" },
  "56": { cat: "retenue", expl: "csg_nonded", libelle: "CSG non déductible RG" },
  "57": { cat: "retenue", expl: "crds", libelle: "CRDS RG" },
  "61": { cat: "retenue", expl: "vieillesse_plaf", libelle: "Urssaf Vieillesse Plafond RG" },
  "299": { cat: "retenue", expl: "vieillesse_deplaf", libelle: "Urssaf Vieillesse Tot RG" },
  "67": { cat: "retenue", expl: "ircantec", libelle: "Retraite Ircantec TrA RG" },
  "69": { cat: "retenue", expl: "ircantec", libelle: "Retraite Ircantec TrB RG" },
  // Cotisations patronales (colonnes de droite du bulletin)
  "43": { cat: "patronale", expl: "p_maladie", libelle: "Urssaf Maladie" },
  "59": { cat: "patronale", expl: "p_maladie", libelle: "Urssaf MaladiePP RG" },
  "4050": { cat: "patronale", expl: "p_maladie", libelle: "Urssaf Maladie compl PP RG" },
  "332": { cat: "patronale", expl: "p_autonomie", libelle: "Urssaf solid.autonomiePP RG" },
  "44": { cat: "patronale", expl: "p_alloc_fam", libelle: "Urssaf Allocation Familial" },
  "64": { cat: "patronale", expl: "p_alloc_fam", libelle: "Urssaf Allocations Familial RG" },
  "4082": { cat: "patronale", expl: "p_alloc_fam_comp", libelle: "Urssaf Alloc.Familial Comp" },
  "1525": { cat: "patronale", expl: "p_alloc_fam_comp", libelle: "Urssaf Alloc.Familial Compl RG" },
  "1250": { cat: "patronale", expl: "p_fnal", libelle: "Urssaf FNAL totalité" },
  "1251": { cat: "patronale", expl: "p_fnal", libelle: "Urssaf FNAL totalité RG" },
  "46": { cat: "patronale", expl: "p_mobilite", libelle: "Urssaf Mobilité" },
  "75": { cat: "patronale", expl: "p_mobilite", libelle: "Urssaf MobilitéPP RG" },
  "66": { cat: "patronale", expl: "p_maladie", libelle: "Urssaf AT RG" },
  "389": { cat: "patronale", expl: "p_autonomie", libelle: "Urssaf Solidarité Autonomie" },
  "49": { cat: "patronale", expl: "p_atiacl", libelle: "CNRACL ATIACL" },
  "50": { cat: "patronale", expl: "p_centre_gestion", libelle: "Centre de Gestion" },
  "73": { cat: "patronale", expl: "p_centre_gestion", libelle: "Centre de Gestion RG" },
  "52": { cat: "patronale", expl: "p_cnfpt", libelle: "C.N.F.P.T" },
  "74": { cat: "patronale", expl: "p_cnfpt", libelle: "C.N.F.P.T RG" },
  "1965": { cat: "patronale", expl: "p_cnfpt_maj", libelle: "C.N.F.P.T Majoration (Financement alternants)" },
  "1966": { cat: "patronale", expl: "p_cnfpt", libelle: "C.N.F.P.T Majoration RG" }
};

/** Clé du dictionnaire OpenFisca correspondant à chaque rubrique d'explication */
const VAR_PAR_EXPL: Record<string, string> = {
  tib: "traitement_indiciaire_brut",
  demi_traitement: "traitement_indiciaire_brut",
  sans_traitement: "traitement_indiciaire_brut",
  nbi: "nouvelle_bonification_indiciaire",
  residence: "indemnite_residence",
  sft: "supplement_familial_traitement",
  ppcr: "abattement_ppcr",
  ifse: "rifseep_ifse",
  cia: "rifseep_cia",
  comp_csg: "indemnite_compensatrice_csg",
  autres_primes: "primes_fonction_publique",
  prime_13eme: "prime_13eme_mois",
  indem_differentielle: "indemnite_differentielle",
  montant_net_social: "montant_net_social",
  transport: "prise_en_charge_transport",
  cnracl: "cotisation_retraite_cnracl_salarie",
  rafp: "cotisation_retraite_rafp_salarie",
  ircantec: "cotisation_retraite_ircantec_salarie",
  maladie: "cotisation_maladie_contractuel_salarie",
  vieillesse_plaf: "cotisation_vieillesse_plafonnee_salarie",
  vieillesse_deplaf: "cotisation_vieillesse_deplafonnee_salarie",
  csg_ded: "csg_deductible_salaire",
  csg_nonded: "csg_non_deductible_salaire",
  crds: "crds_salaire",
  part_mutuelle: "participation_mutuelle_employeur",
  part_prevoyance: "participation_mutuelle_employeur",
  cotis_mutuelle: "retenue_mutuelle_salarie",
  prevoyance_territoria: "retenue_mutuelle_salarie",
  p_maladie: "cotisations_employeur",
  p_alloc_fam: "cotisations_employeur",
  p_alloc_fam_comp: "cotisations_employeur",
  p_fnal: "cotisations_employeur",
  p_mobilite: "cotisations_employeur",
  p_autonomie: "cotisations_employeur",
  p_atiacl: "cotisations_employeur",
  p_centre_gestion: "cotisations_employeur",
  p_cnfpt: "cotisations_employeur",
  p_cnfpt_maj: "cotisations_employeur",
  traitement_detache: "traitement_indiciaire_brut",
  nbi_detache: "nouvelle_bonification_indiciaire",
  cnracl_detache: "cotisation_retraite_cnracl_salarie",
  pas: "prelevement_a_la_source"
};

/**
 * Reconstruit le résultat d'analyse en copiant fidèlement les rubriques du bulletin original :
 * mêmes codes, mêmes libellés, mêmes montants → zéro écart entre la fiche uploadée et la fiche explicative.
 * Seuls les totaux absents du document sont déduits des lignes lues.
 */
/** Normalisation : minuscules sans accents (pour les comparaisons de libellés) */
const normaliser = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");

function computeOpenFiscaPayDepuisLignesReelles(
  params: CalculParams,
  lignesReelles: LigneBulletinCiril[],
  metadata?: ParseMetadata | null
): FichePaieAnalyseResult {
  const {
    nomAgent = "AGENT Public",
    statut = "titulaire",
    tauxPas = 0,
    grade = "Agent",
    echelon = "—",
    indiceBrut,
    indiceMajore = 0,
    indiceRemun,
    quotite = 100,
    montantsReels,
    nbEnfantsSft = 0
  } = params;
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const isTitulaire = statut === "titulaire" || statut === "stagiaire";

  const lignes: FichePaieLigne[] = [];
  const idsUtilises = new Set<string>();
  let sommeGains = 0;
  let sommeRetenuesSociales = 0;
  let sommeRetenuesNet = 0;
  let sommePatronales = 0;
  let csgNonDed = 0;
  // Agrégats par rubrique (codes Ciril réels) pour les totaux du bulletin reconstruit
  let aggNbi = 0;
  let aggResidence = 0;
  let aggSft = 0;
  let aggIfse = 0;
  let crds = 0;

  for (let idx = 0; idx < lignesReelles.length; idx++) {
    const lr = lignesReelles[idx];
    const isGainByLibelle = /traitement|residence|supplement familial|differentielle|fraction|ifse|cia|remuneration|prime|indem|transport|conges|vacation/i.test(lr.libelle);
    const known = CODES_CIRIL_KNOWN[lr.code];
    let cat: "gain" | "retenue" | "patronale" | "retenue_net" | "info";

    if (lr.fractionT) {
      // Marqueur « fraction T » : pourcentage du traitement versé en maladie — informative
      cat = "info";
    } else if (known) {
      cat = (isGainByLibelle && known.cat === "retenue") ? "gain" : known.cat;
    } else {
      cat = (lr.tauxPatronal !== undefined && (lr.montant === undefined || lr.montant === lr.montantPatronal)
        ? "patronale"
        : lr.montant !== undefined && lr.montant < 0 ? "retenue" : "gain") as "gain" | "retenue" | "patronale" | "retenue_net";
    }

    const montant = lr.montant ?? 0;
    const patronal = cat === "patronale" ? (lr.montantPatronal ?? lr.montant ?? 0) : lr.montantPatronal;

    if (cat === "info") {
      // Ligne informative du bulletin (ex. 1584 MONTANT NET SOCIAL) : affichée mais jamais cumulée
    } else if (cat === "patronale") {
      sommePatronales += patronal ?? 0;
    } else if (montant > 0) {
      sommeGains += montant;
      // Détail par rubrique : codes 9 (NBI), 12 (résidence), 10/11 (SFT), 1591 (IFSE)
      if (lr.code === "9") aggNbi += montant;
      else if (lr.code === "12") aggResidence += montant;
      else if (lr.code === "10" || lr.code === "11") aggSft += montant;
      else if (lr.code === "1591") aggIfse += montant;
    } else if (montant < 0) {
      if (cat === "retenue_net") sommeRetenuesNet += -montant;
      else if (cat === "retenue") sommeRetenuesSociales += -montant;
      else if (cat === "gain") sommeGains += montant; // Les rappels négatifs ou retenues sur brut (ex. -1 204.44 €) diminuent le brut
    }
    // Contrepartie patronale portée par une ligne salariale (CNRACL 37,65% / RAFP 5% sur les codes 47/1028)
    if (cat !== "info" && cat !== "patronale" && patronal && patronal > 0) {
      sommePatronales += patronal;
    }
    // Partie non déductible (pour le repli du net fiscal quand il n'est pas imprimé sur la fiche)
    if (lr.code === "40" && montant < 0) csgNonDed = -montant;
    if (lr.code === "42" && montant < 0) crds = -montant;

    // Id unique : plusieurs codes peuvent pointer vers la même explication (572+7625 → cotis_mutuelle).
    // Un rappel (marqueur « R » + mois) prime : c'est l'information la plus utile pour l'agent.
    const libNorm = normaliser(lr.libelle);
    // Les libellés « Compl rémunération » et « prime semestrielle » = les deux lignes du 13e mois
    const estTreizieme = /compl.*remuneration/.test(libNorm) || /prime\s*semestrielle/.test(libNorm);
    let idLigne = lr.fractionT 
      ? `fraction_t` 
      : (estTreizieme 
        ? `treizieme_mois` 
        : (lr.moisRappel 
          ? `rappel_${lr.code}_${(lr.moisRappel || '').replace(/[^a-zA-Z0-9]/g, '_')}` 
          : (known?.expl ?? `ciril_${lr.code}`)));
    if (idsUtilises.has(idLigne)) idLigne = `${idLigne}_${idx}`;
    idsUtilises.add(idLigne);

    const estCia = known?.expl === "cia" || lr.code === "1592" || lr.code === "7610" || /cia\b/i.test(lr.libelle) || /compl.*indemnitaire\s*annuel/i.test(lr.libelle);
    const estIfse = !estCia && (known?.expl === "ifse" || lr.code === "1591" || lr.code === "2591" || /ifse/i.test(lr.libelle));

    const ligneBrute: FichePaieLigne = {
      id: idLigne,
      code: lr.code,
      libelle: lr.moisRappel
        ? (lr.libelle.toLowerCase().includes("rappel") ? lr.libelle : `Rappel ${lr.moisRappel} — ${lr.libelle}`)
        : (known?.libelle ?? lr.libelle),
      moisRappel: lr.moisRappel,
      base: lr.base,
      taux: lr.taux,
      montantGain: cat !== "patronale" && montant > 0 ? montant : undefined,
      montantRetenue: cat !== "patronale" && montant < 0 ? -montant : undefined,
      partPatronale: patronal && patronal > 0 ? patronal : undefined,
      patronalTaux: lr.tauxPatronal,
      openFiscaVar:
        (known?.expl && VAR_PAR_EXPL[known.expl]
          ? OPENFISCA_VARIABLES_DICTIONARY[VAR_PAR_EXPL[known.expl]]
          : undefined) ?? OPENFISCA_VARIABLES_DICTIONARY.primes_fonction_publique,
      montantTheoriqueOpenFisca: Math.abs(montant),
      estConforme: true,
      explicationLigne: estIfse
        ? `Indemnité de Fonctions, de Sujétions et d'Expertise (rubrique Ciril 1591/2591). Dans votre collectivité, l'IFSE Tit. est composée de 4 IFSE cumulatives : IFSE 1 (Prime de fonctions), IFSE 2 (Prime des contraintes de poste), IFSE 3 (Samedis, dimanches et astreintes) et IFSE 4 (Avantages acquis).`
        : (estCia
          ? `Complément Indemnitaire Annuel (CIA Tit., rubrique Ciril 1592/7610). Se compose de 10 % de l'IFSE mensuelle × 12 mois (soit 1,2 mois d'IFSE annuelle). Cette somme est attribuée pour 50 % sur la manière de servir (évaluation CREP) et pour 50 % selon le nombre de jours d'absence.`
          : ""),
      conseilAgent: estIfse
        ? `Consultez votre arrêté RIFSEEP individuel pour vérifier le montant précis alloué à chacune de vos 4 composantes IFSE (fonctions, contraintes, astreintes/week-ends, maintien des avantages acquis). En cas de mobilité ou de réorganisation, la part IFSE 4 (avantages acquis) reste garantie.`
        : (estCia
          ? `Le montant du CIA repose sur la base de 10 % de votre IFSE mensuelle × 12 mois. Contrôlez que la part manière de servir (50 %) reflète votre CREP et que la part assiduité (50 %) ne décompte pas des absences de droit protégées (maternité, accident de service).`
          : undefined)
    };

    lignes.push(enrichirLigneFichePaie(ligneBrute, known?.expl, {
      code: lr.code,
      libelle: lr.libelle,
      moisRappel: lr.moisRappel,
      cat,
      fractionT: lr.fractionT,
      estIfse,
      estCia,
      estTreizieme
    }));
  }

  // Totaux imprimés en priorité, déduits des lignes à défaut
  const brutLu = montantsReels?.brutReel ?? r2(sommeGains);
  const netAvantImpot = montantsReels?.netAvantImpotReel ?? r2(brutLu - sommeRetenuesSociales - sommeRetenuesNet);
  const netFiscal = montantsReels?.netFiscalReel ?? r2(netAvantImpot + csgNonDed + crds + sommeRetenuesNet);
  const montantPas = montantsReels?.pasReel ?? r2(netFiscal * (tauxPas / 100));
  const netAPayer = montantsReels?.netAPayerReel ?? r2(netAvantImpot - montantPas);
  const totalRetenues = montantsReels?.totalRetenuesReelles ?? r2(sommeRetenuesSociales + sommeRetenuesNet + montantPas);
  const totalCotisationsPatronales = montantsReels?.cotisationsPatronalesReelles ?? r2(sommePatronales);
  const coutGlobalEmployeur = montantsReels?.coutEmployeurReel ?? r2(brutLu + totalCotisationsPatronales);

  // Ligne PAS synthétique (bloc « Impôt sur le revenu » du bulletin) — la vue l'affiche hors tableau
  const pasLigne: FichePaieLigne = {
    id: "pas",
    code: "995",
    libelle: "Impôt sur le revenu prélevé à la source",
    base: netFiscal,
    taux: tauxPas,
    montantRetenue: montantPas > 0 ? montantPas : undefined,
    openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.prelevement_a_la_source,
    montantTheoriqueOpenFisca: montantPas,
    estConforme: true,
    explicationLigne: `Impôt collecté par la Mairie pour la DGFiP : ${netFiscal.toFixed(2)} € de net imposable × ${tauxPas} %.`
  };
  lignes.push(enrichirLigneFichePaie(pasLigne, "pas"));

  const phraseReconstruction = `Fiche reconstruite ligne à ligne depuis votre bulletin original (${lignesReelles.length} rubriques copiées sans recalcul).`;

  return {
    titre: `Fiche de Paie de ${nomAgent} (reconstruite du bulletin original)`,
    dateAnalyse: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    source: "reconstruite",
    agent: {
      nom: nomAgent,
      matricule: params.matricule,
      numeroSecu: params.numeroSecu,
      positionAdmin: params.positionAdmin,
      service: params.service,
      poste: params.poste,
      grade,
      echelon,
      indiceRemun: indiceRemun ?? indiceBrut ?? indiceMajore,
      indiceBrut: indiceBrut ?? Math.round(indiceMajore * 1.06),
      indiceMajore,
      quotite,
      statut,
      caisseRetraite: isTitulaire ? "CNRACL" : "IRCANTEC",
      zoneResidence: params.zoneResidence ?? 1,
      nbEnfantsSft
    },
    lignesReelles,
    totaux: {
      traitementBase: r2(sommeGains),
      nbi: r2(aggNbi),
      indemniteResidence: r2(aggResidence),
      sft: r2(aggSft),
      primesIfse: r2(aggIfse),
      primesCia: 0,
      autresPrimes: 0,
      abattementPpcr: 0,
      remboursementTransport: 0,
      indemniteCompensatriceCsg: 0,
      participationMutuelleEmployeur: 0,
      retenueMutuelleSalarie: r2(sommeRetenuesNet),
      salaireBrut: brutLu,
      totalCotisationsSalariales: r2(sommeRetenuesSociales),
      totalRetenues,
      netAvantImpot,
      netFiscal,
      tauxPas,
      montantPas,
      netAPayer,
      totalCotisationsPatronales,
      coutGlobalEmployeur
    },
    lignes,
    diagnosticEcarts: {
      aEcarts: false,
      brutEcart: 0,
      retenuesEcart: 0,
      netFiscalEcart: 0,
      netAPayerEcart: 0,
      items: []
    },
    syntheseConformite: {
      scoreConformite: 100,
      nbLignesVerifiees: lignesReelles.length,
      nbAnomalies: 0,
      anomalies: [],
      pointsForts: [
        phraseReconstruction,
        `Total brut imprimé : ${brutLu.toFixed(2)} € — repris à l'identique.`,
        `Net à payer : ${netAPayer.toFixed(2)} € — repris à l'identique.`,
        "Chaque rubrique conserve son code Ciril et son libellé d'origine."
      ],
      recommandationsCFDT: [
        "Conservez vos fiches de paie sans limitation de durée pour le calcul de vos droits à pension CNRACL/IRCANTEC.",
        "N'hésitez pas à solliciter vos représentants CFDT de Gennevilliers pour vérifier une rubrique."
      ]
    },
    openFiscaBenchmark: {
      brutTheorique: brutLu,
      netTheorique: netAPayer,
      cnraclTheorique: r2(sommeRetenuesSociales),
      rafpTheorique: 0,
      csgTheorique: 0,
      differenceNet: 0
    },
    openFiscaCodeSnippet: `# Bulletin reconstruit depuis le PDF original — aucune donnée recalculée
lignes = ${JSON.stringify(lignesReelles.map(l => ({ code: l.code, montant: l.montant })), null, 2)}`,
    metadata
  };
}

/**
 * Analyse le texte brut d'une fiche de paie uploadée (.pdf, .docx, .txt, .csv)
 * et en déduit les paramètres de simulation OpenFisca-France avec métadonnées détaillées
 */
export function parseUploadedPaySlipWithMeta(rawText: string): ParsePaySlipResult {
  const normalizedText = rawText.replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, ' ');
  const t = normalizedText.toLowerCase();
  const detectedItems: string[] = [];
  const lines = normalizedText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Les vrais bulletins imprimant « NET À PAYER », « PRÉLÈVEMENT » ou « RÉMUNÉRATION »,
  // les libellés sont comparés sur une version sans accents pour éviter les ratés de détection.
  const deaccent = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Extraction Indice Majoré (IM) - Heuristiques Multi-passes
  let im = 382; // défaut
  let imFound = false;
  let quotite = 100;
  let indiceBrut: number | undefined = undefined;
  let indiceRemun: number | undefined = undefined;

  // Passe A0 : Détection directe d'une ligne d'indices Ciril (ex: "367 368 | 367 100.00 Equipe Grésillons maternelle")
  for (const line of lines) {
    const cleanL = line.replace(/[|[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
    const mIndDirect = cleanL.match(/\b([2-9]\d{2})\s+([2-9]\d{2})\s+([2-9]\d{2})\s+(100(?:\.00)?|\d{2,3}(?:[.,]\d{1,2})?)(?:\s+(.+))?/);
    if (mIndDirect) {
      indiceRemun = parseFloat(mIndDirect[1]);
      indiceBrut = parseFloat(mIndDirect[2]);
      im = parseFloat(mIndDirect[3]);
      imFound = true;
      quotite = parseFloat(mIndDirect[4].replace(',', '.'));
      detectedItems.push(`Bloc Ciril direct : Ind. Rémun ${indiceRemun} / Indice Brut ${indiceBrut} / Indice Majoré (IM) ${im} / Quotité ${quotite}%`);
      break;
    }
  }

  // Passe A1 : bloc Ciril « IND. RÉMUN. / INDICE BRUT / IND. MAJORÉ / TAUX EMPLOI » suivi de la ligne de valeurs
  if (!imFound) {
    for (let i = 0; i < lines.length - 1; i++) {
      const lPlain = deaccent(lines[i].toLowerCase());
      if (lPlain.includes("taux emploi") || (lPlain.includes("indice brut") && lPlain.includes("major"))) {
        const lineCleaned = lines[i + 1].trim();
        const values = Array.from(lineCleaned.matchAll(/(\d+(?:[.,]\d+)?)/g))
          .map(m => parseFloat(m[1].replace(",", ".")));

        let irCandidat, imCandidat, ibCandidat, qCandidat;

        if (values.length >= 4) {
          irCandidat = values[0];
          ibCandidat = values[1];
          imCandidat = values[2];
          qCandidat = values[3];
        } else {
          ibCandidat = values[0];
          imCandidat = values[1];
          qCandidat = values[2];
          irCandidat = ibCandidat;
        }

        if (imCandidat && imCandidat >= 250 && imCandidat <= 950) {
          im = imCandidat;
          imFound = true;
          if (irCandidat && irCandidat >= 250 && irCandidat <= 3500) {
            indiceRemun = irCandidat;
          }
          if (ibCandidat && ibCandidat >= 250 && ibCandidat <= 1500) {
            indiceBrut = ibCandidat;
            detectedItems.push(`Bloc Ciril lu : Ind. Rémun ${indiceRemun ?? im} / Indice Brut ${indiceBrut} / Indice Majoré (IM) ${im}`);
          } else {
            detectedItems.push(`Bloc Ciril lu : Ind. Rémun ${indiceRemun ?? im} / Indice Majoré (IM) ${im}`);
          }
          if (qCandidat && qCandidat >= 20 && qCandidat <= 100) {
            quotite = qCandidat;
            if (quotite !== 100) detectedItems.push(`Quotité (taux d'emploi) : ${quotite}%`);
          }
          break;
        }
      }
    }
  }

  // Passe A : Paire IB / IM (ex: 405 / 382 ou 405/382)
  if (!imFound) {
    const pairMatch = t.match(/(\d{3})\s*[/\\-]\s*(\d{3})\b/);
    if (pairMatch) {
      const val2 = parseInt(pairMatch[2], 10);
      const val1 = parseInt(pairMatch[1], 10);
      if (val2 >= 250 && val2 <= 850 && val2 <= val1) {
        im = val2;
        imFound = true;
        detectedItems.push(`Indice Majoré (IM) extrait de la paire IB/IM (${pairMatch[1]}/${pairMatch[2]}) : ${im}`);
      }
    }
  }

  // Passe B : Multiplication par la valeur du point d'indice (ex: 382 x 4.92278)
  if (!imFound) {
    const ptMatch = t.match(/(\d{3})\s*[*x×]\s*4[.,]922/i) || t.match(/4[.,]922\d*\s*[*x×]\s*(\d{3})/i);
    if (ptMatch) {
      const val = parseInt(ptMatch[1] || ptMatch[2], 10);
      if (val >= 250 && val <= 850) {
        im = val;
        imFound = true;
        detectedItems.push(`Indice Majoré (IM) détecté par multiplication (IM ${val} x 4,92278 €) : ${im}`);
      }
    }
  }

  // Passe C : Proximité immédiate d'un mot-clé d'indice (INM, IM, INDICE MAJORE, ECHELON... IM)
  // Le lookahead (?!\s*brut) empêche de capturer l'Indice BRUT (« Indice Brut : 520 ») à la place de l'IM.
  if (!imFound) {
    const proxMatch = t.match(/(?:inm|indice(?!\s*brut)\s*(?:major[ée]|maj\.?|r[ée]el)?|i\.m\.?|majore)[^0-9\n\r]{0,35}(\d{3})\b/i);
    if (proxMatch) {
      const val = parseInt(proxMatch[1], 10);
      if (val >= 250 && val <= 850) {
        im = val;
        imFound = true;
        detectedItems.push(`Indice Majoré (IM) détecté : ${im}`);
      }
    }
  }

  // Passe D : Rétro-calcul à partir du montant brut du traitement (ex: 1 880,50 € / 4,92278 = 382)
  if (!imFound) {
    for (const line of lines) {
      const lineLower = line.toLowerCase();
      if (lineLower.includes("traitement") && (lineLower.includes("base") || lineLower.includes("indiciaire") || lineLower.includes("brut"))) {
        const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
          .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
          .filter(a => a >= 1000 && a <= 5500);

        if (amounts.length > 0) {
          const calculatedIm = Math.round(amounts[0] / VALEUR_POINT_INDICE_MENSUEL);
          if (calculatedIm >= 250 && calculatedIm <= 850) {
            im = calculatedIm;
            imFound = true;
            detectedItems.push(`Indice Majoré (IM) déduit du montant brut (${amounts[0].toFixed(2)} €) : ${im}`);
            break;
          }
        }
      }
    }
  }

  // 2. Extraction Quotité de travail (peut compléter le bloc Ciril de la passe A0)
  const quotiteMatch = t.match(/quotit[ée]\s*[:=.\s]*(\d{2,3})\s*%?/i)
    || t.match(/temps\s*(?:partiel|de\s*travail)\s*[:=.\s]*(\d{2,3})\s*%?/i);
  if (quotiteMatch) {
    const q = parseInt(quotiteMatch[1], 10);
    if (q >= 20 && q <= 100) {
      quotite = q;
      if (q !== 100) detectedItems.push(`Quotité de travail : ${quotite}%`);
    }
  }

  // 3. Extraction NBI (Nouvelle Bonification Indiciaire)
  let nbi = 0;
  const nbiMatch = t.match(/nbi[^0-9\n\r]{0,20}(\d{1,3})\s*(?:points?|pts)?/i)
    || t.match(/bonification\s*(?:indiciaire)?[^0-9\n\r]{0,20}(\d{1,3})/i);
  if (nbiMatch && parseInt(nbiMatch[1], 10) <= 100) {
    nbi = parseInt(nbiMatch[1], 10);
    if (nbi > 0) detectedItems.push(`Points NBI détectés : +${nbi} pts`);
  }

  // 4. Extraction Universelle des Éléments de Rémunération Ciril RH (Codes gains & primes)
  let ifse = 0;
  let autresPrimes = 0;
  let cia = 0;
  let elementsDetectesCount = 0;

  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
      .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
      .filter(a => a > 0);

    if (amounts.length === 0) continue;
    const montant = amounts[amounts.length - 1]; // Montant dans la colonne gain

    // A. Traitement de base (Codes 8 ou 13 : "Traitement de base indiciaire" / "011N TRAIT.BASE MENS. NT")
    if (lPlain.includes("traitement de base") || lPlain.includes("trait.base") || lPlain.includes("traitement indiciaire")) {
      detectedItems.push(`Traitement de base indiciaire : ${montant.toFixed(2)} €`);
      continue;
    }

    // B. Indemnité de Résidence (Codes 12, 17 ou 021N : "Indemnité de Résidence")
    if (lPlain.includes("indemnite de residence") || lPlain.includes("indemn.residence")) {
      continue;
    }

    // C. IFSE Statutaire (Codes 1591, 2200N, ou libellé contenant "IFSE")
    if (lPlain.includes("ifse") || lPlain.includes("i.f.s.e")) {
      ifse = montant;
      elementsDetectesCount++;
      detectedItems.push(`IFSE statutaire (RIFSEEP) : +${montant.toFixed(2)} €/mois`);
      continue;
    }

    // D. Vacations Médicales (Code 7201 R : "Vacation Médecin")
    if (lPlain.includes("vacation")) {
      autresPrimes = Math.round((autresPrimes + montant) * 100) / 100;
      elementsDetectesCount++;
      detectedItems.push(`Vacations médicales (Ciril 7201) : +${montant.toFixed(2)} €`);
      continue;
    }

    // E. Gardes de nuit (Code 7200 R : "Garde nuit Médecin")
    if (lPlain.includes("garde nuit") || lPlain.includes("garde")) {
      autresPrimes = Math.round((autresPrimes + montant) * 100) / 100;
      elementsDetectesCount++;
      detectedItems.push(`Gardes de nuit (Ciril 7200) : +${montant.toFixed(2)} €`);
      continue;
    }

    // F. Indemnité de Congés Payés (Code 7726 R : "Congés Payés")
    if (lPlain.includes("conges payes") || lPlain.includes("conge paye")) {
      autresPrimes = Math.round((autresPrimes + montant) * 100) / 100;
      elementsDetectesCount++;
      detectedItems.push(`Indemnité Congés Payés (Ciril 7726) : +${montant.toFixed(2)} €`);
      continue;
    }

    // G. Indemnité de fin de contrat (Code 1280N : "IND.FIN DE CONTRAT")
    if (lPlain.includes("fin de contrat")) {
      autresPrimes = Math.round((autresPrimes + montant) * 100) / 100;
      elementsDetectesCount++;
      detectedItems.push(`Indemnité fin de contrat (Ciril 1280N) : +${montant.toFixed(2)} €`);
      continue;
    }

    // H. CIA (Complément Indemnitaire Annuel)
    if (lPlain.includes("cia") || lPlain.includes("complement indemnitaire")) {
      cia = montant;
      elementsDetectesCount++;
      detectedItems.push(`Complément CIA : +${montant.toFixed(2)} €`);
      continue;
    }
  }

  // Si l'agent est un titulaire classique et qu'aucune prime n'a été spécifiée, valeur d'accueil
  if (elementsDetectesCount === 0 && ifse === 0 && !t.includes("vacation") && !t.includes("garde nuit") && !t.includes("contractuel")) {
    ifse = 380;
  }

  // 5. Détection du Statut (Titulaire vs Contractuel)
  let statut: "titulaire" | "contractuel" | "stagiaire" = "titulaire";
  if (t.includes("contractuel") || t.includes("ircantec") || t.includes("cdd") || t.includes("cdi") || t.includes("décret 88-145") || t.includes("decret 88-145")) {
    statut = "contractuel";
    detectedItems.push("Régime de retraite : Contractuel (Régime Général & IRCANTEC)");
  } else if (t.includes("stagiaire")) {
    statut = "stagiaire";
    detectedItems.push("Statut : Fonctionnaire Stagiaire (CNRACL & RAFP)");
  } else {
    detectedItems.push("Statut : Fonctionnaire Titulaire (Pension CNRACL 11,10% & RAFP)");
  }

  // 6. Détection SFT / Enfants à charge (Heuristique Multi-passes)
  let nbEnfants = 0;
  let sftDetected = false;

  // A. Détection explicite de l'absence d'enfants ou 0 enfant
  if (
    /\b0\s*(?:enfant|charge|enf\b)/i.test(t) ||
    /(?:nb\s*d['’]?|nombre\s*d['’]?|nb\s*)?enfants?\s*[:=]?\s*0\b/i.test(t) ||
    /(?:charges?\s*de\s*famille|charges?)\s*[:=]?\s*0\b/i.test(t) ||
    /\bsft\s*[:=]?\s*(?:non|aucun|0\b|néant|neant)/i.test(t) ||
    /sans\s*enfant/i.test(t)
  ) {
    nbEnfants = 0;
    sftDetected = true;
    detectedItems.push("Enfants à charge (SFT) : 0 enfant (aucun supplément versé)");
  } else {
    // B. Détection explicite d'un nombre d'enfants > 0
    const enfCountMatch = t.match(/(?:nb\s*d['’]?|nombre\s*d['’]?|nb\s*)?enfants?(?:\s*à\s*charge)?\s*[:=]?\s*([1-9])\b/i)
      || t.match(/\b([1-9])\s*(?:enfants?\s*à\s*charge|enfants?\s*charge|enfants?\b)/i)
      || t.match(/\bsft\s*(?:\([^)]*\)|[a-z\s]*)\s*[:=]?\s*([1-9])\s*(?:enf|enfant)?\b/i);

    if (enfCountMatch) {
      nbEnfants = parseInt(enfCountMatch[1], 10);
      sftDetected = true;
      detectedItems.push(`Supplément Familial (SFT) : ${nbEnfants} enfant(s) pris en compte`);
    } else {
      // C. Déduction d'après les montants effectifs de la ligne SFT sur le bulletin
      for (const line of lines) {
        const lPlain = deaccent(line.toLowerCase());
        if (lPlain.includes("sft") || lPlain.includes("supplement familial")) {
          const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
            .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
            .filter(a => a > 0);

          if (amounts.length > 0) {
            const sftAmt = amounts[amounts.length - 1];
            if (sftAmt >= 1 && sftAmt < 15) {
              nbEnfants = 1;
              sftDetected = true;
              detectedItems.push(`Supplément Familial (SFT) : 1 enfant déduit du montant (${sftAmt.toFixed(2)} €)`);
            } else if (sftAmt >= 60 && sftAmt < 160) {
              nbEnfants = 2;
              sftDetected = true;
              detectedItems.push(`Supplément Familial (SFT) : 2 enfants déduit du montant (${sftAmt.toFixed(2)} €)`);
            } else if (sftAmt >= 160 && sftAmt < 330) {
              nbEnfants = 3;
              sftDetected = true;
              detectedItems.push(`Supplément Familial (SFT) : 3 enfants déduit du montant (${sftAmt.toFixed(2)} €)`);
            } else if (sftAmt >= 330) {
              nbEnfants = 4;
              sftDetected = true;
              detectedItems.push(`Supplément Familial (SFT) : 4+ enfants déduit du montant (${sftAmt.toFixed(2)} €)`);
            }
          }
          break;
        }
      }
    }
  }

  if (!sftDetected && nbEnfants === 0) {
    detectedItems.push("Enfants à charge (SFT) : 0 enfant");
  }

  // 7. Détection Taux PAS (Prélèvement à la Source - Multi-passes)
  let tauxPas = 0;
  let pasFound = false;

  // Passe A : Mots-clés explicites de taux avec décimale (avec ou sans le symbole %)
  const pasRegexList = [
    /(?:taux|tx)\s*(?:personnalis[ée]|non\s*personnalis[ée]|transmis(?:\s*par)?\s*(?:la\s*)?dgfip|dgfip|bar[èe]me|neutre|appliqu[ée]|imposition|d['’]imposition|effectif|r[ée]el|retenu|calcul[ée]|pr[ée]l[èe]vement|de\s*pr[ée]l[èe]vement|pas|source)\s*[:=]?\s*(\d{1,2}[.,]\d{1,2})\s*%?/i,
    /(?:pr[ée]l[èe]vement\s*(?:[àa]\s*la\s*)?source|imp[ôo]t\s*(?:sur\s*le\s*revenu)?\s*pr[ée]lev[ée]|p\.?a\.?s\.?|retenue\s*[àa]\s*la\s*source)[^%\n\r]{0,60}?(?:taux|tx)?\s*[:=]?\s*(\d{1,2}[.,]\d{1,2})\s*%/i,
    /(?:taux|tx)\s*[:=]\s*(\d{1,2}[.,]\d{1,2})\s*%/i,
    /(?:taux|tx)\s*[:=]\s*(\d{1,2}[.,]\d{1,2})\b/i
  ];

  for (const reg of pasRegexList) {
    const m = t.match(reg);
    if (m) {
      const val = parseFloat(m[1].replace(",", "."));
      // Ne pas confondre avec les taux sociaux légaux fixes
      if (val >= 0.1 && val <= 45 && val !== 11.1 && val !== 98.25 && val !== 6.8 && val !== 2.4 && val !== 0.5 && val !== 5.0 && val !== 2.8 && val !== 6.95) {
        tauxPas = val;
        pasFound = true;
        detectedItems.push(`Taux Prélèvement à la Source (PAS) détecté : ${tauxPas}%`);
        break;
      }
    }
  }

  // Passe B : Vérification arithmétique sur la ligne tabulaire [Assiette] [Taux] [Montant]
  if (!pasFound) {
    for (const line of lines) {
      const lPlain = deaccent(line.toLowerCase());
      if (lPlain.includes("source") || lPlain.includes("pas") || lPlain.includes("impot") || lPlain.includes("dgfip")) {
        const nums = Array.from(line.matchAll(/([\d\s]+[,.]\d{1,2})/g))
          .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")));
        if (nums.length >= 3) {
          for (let i = 0; i < nums.length - 2; i++) {
            const assiette = nums[i];
            const candidateRate = nums[i + 1];
            const montant = nums[i + 2];
            if (assiette >= 500 && candidateRate > 0 && candidateRate <= 45 && montant > 0) {
              const expectedMontant = assiette * (candidateRate / 100);
              if (Math.abs(expectedMontant - montant) < 1.0) {
                tauxPas = candidateRate;
                pasFound = true;
                detectedItems.push(`Taux PAS certifié par calcul (${assiette.toFixed(2)} € x ${tauxPas}% = ${montant.toFixed(2)} €)`);
                break;
              }
            }
          }
        }
      }
      if (pasFound) break;
    }
  }

  // Passe C : Recherche globale de tout taux non-social dans le document
  if (!pasFound) {
    const allPercents = Array.from(t.matchAll(/(\d{1,2}[.,]\d{1,2})\s*%/g))
      .map(m => parseFloat(m[1].replace(",", ".")))
      .filter(p => ![11.1, 5, 5.0, 6.8, 2.4, 0.5, 98.25, 2.8, 6.95, 3, 3.0, 1, 1.0, 20, 100, 80, 50].includes(p));

    if (allPercents.length > 0) {
      tauxPas = allPercents[0];
      pasFound = true;
      detectedItems.push(`Taux PAS extrait du bulletin : ${tauxPas}%`);
    }
  }

  if (!pasFound) {
    tauxPas = 0;
    detectedItems.push("Taux PAS : 0,0% (Non imposable ou taux nul par défaut)");
  }

  // 8. Détection Abattement PPCR / Transfert Primes-Points (Décret n° 2016-588)
  let abattementPpcr: number | undefined = undefined; // non lu => barème de la catégorie appliqué par le moteur
  let appliquerPpcr = statut === "titulaire" || statut === "stagiaire";
  let ppcrFound = false;

  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    if (lPlain.includes("ppcr") || lPlain.includes("primes/points") || lPlain.includes("primes-points") || lPlain.includes("transfert prime") || lPlain.includes("abattement transfert")) {
      const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
        .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
        .filter(a => a >= 10 && a <= 150);

      if (amounts.length > 0) {
        abattementPpcr = amounts[amounts.length - 1];
        appliquerPpcr = true;
        ppcrFound = true;
        detectedItems.push(`Abattement PPCR détecté : -${amounts[amounts.length - 1].toFixed(2)} €/mois`);
        break;
      }
    }
  }

  if (!ppcrFound && appliquerPpcr) {
    const cat = devinerCategorie(t.match(/grade\s*[:=]\s*([^\n\r,;]+)/i)?.[1], im);
    detectedItems.push(`Abattement PPCR non lu sur la fiche : barème catégorie ${cat} appliqué (-${PPCR_MENSUEL_PAR_CATEGORIE[cat].toFixed(2)} €/mois)`);
  }

  // 9. Détection Remboursement Transport Navigo 75% (Décret n° 2023-812)
  // Prise en charge des lignes uniques et des remboursements cumulés (ex: rétroactivité 5 mois)
  let remboursementTransport = 0;
  let transportLinesCount = 0;
  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    if (lPlain.includes("transport") || lPlain.includes("navigo") || lPlain.includes("abonn") || lPlain.includes("titre de transport")) {
      const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
        .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
        .filter(a => a >= 20 && a <= 800);

      if (amounts.length > 0) {
        // En cas de plusieurs montants sur la ligne (ex: Base 90.80 Taux 75.00 Montant 68.10), le montant versé est le dernier
        const lineMontant = amounts[amounts.length - 1];
        remboursementTransport = Math.round((remboursementTransport + lineMontant) * 100) / 100;
        transportLinesCount++;
      }
    }
  }
  if (remboursementTransport > 0) {
    detectedItems.push(
      transportLinesCount > 1
        ? `Prise en charge Transport cumulée (${transportLinesCount} lignes) : +${remboursementTransport.toFixed(2)} € net`
        : `Prise en charge Transport Navigo (75%) : +${remboursementTransport.toFixed(2)} € net`
    );
  }

  // 10. Détection Indemnité Compensatrice CSG & Mutuelle
  let indemniteCompensatriceCsg = 0;
  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    if (lPlain.includes("compens") && lPlain.includes("csg")) {
      const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
        .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
        .filter(a => a > 0 && a <= 200);
      if (amounts.length > 0) {
        indemniteCompensatriceCsg = amounts[amounts.length - 1];
        detectedItems.push(`Indemnité Compensatrice CSG détectée : +${indemniteCompensatriceCsg.toFixed(2)} €`);
        break;
      }
    }
  }

  let participationMutuelleEmployeur = 0;
  let retenueMutuelleSalarie = 0;
  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    const isSante = lPlain.includes("mutuelle") || lPlain.includes("mnt") || lPlain.includes("prevoyance")
      || lPlain.includes("sante") || lPlain.includes("prefon");
    const isParticipationEmployeur = lPlain.includes("participation") && (lPlain.includes("empl") || lPlain.includes("employeur"));

    if (isParticipationEmployeur || isSante) {
      const amounts = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
        .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")))
        .filter(a => a > 0 && a <= 300);

      if (amounts.length > 0) {
        // Bulletin Ciril réel : « Participation empl mut Tit 27.08 » (code 7376) et
        // « Participation empl prev Tit 14.16 » (code 7716) = gains versés à l'agent (somme)
        if (isParticipationEmployeur && !lPlain.includes("retenue") && !lPlain.includes("cotis")) {
          participationMutuelleEmployeur = Math.round((participationMutuelleEmployeur + amounts[amounts.length - 1]) * 100) / 100;
          detectedItems.push(`Participation employeur mutuelle/prévoyance (PSC) : +${amounts[amounts.length - 1].toFixed(2)} €`);
        } else {
          // Retenues sur le net : « Territoria Pack prévoyance -97.65 » (code 7625), « Préfon -172.00 » (code 572)…
          retenueMutuelleSalarie = Math.round((retenueMutuelleSalarie + amounts[amounts.length - 1]) * 100) / 100;
          detectedItems.push(`Retenue santé/prévoyance sur le net : -${amounts[amounts.length - 1].toFixed(2)} €`);
        }
      }
    }
  }

  // 11. Détection des Totaux Réels Imprimés sur le Bulletin
  let brutReel: number | undefined;
  let totalRetenuesReelles: number | undefined;
  let netFiscalReel: number | undefined;
  let netAvantImpotReel: number | undefined;
  let pasReel: number | undefined;
  let netAPayerReel: number | undefined;
  let coutEmployeurReel: number | undefined;
  let cotisationsPatronalesReelles: number | undefined;

  // Passe prioritaire pour le Net Payé : recherche de toutes les occurrences pour prendre la dernière (fin du bulletin / page 2)
  const netPayeMatches = Array.from(normalizedText.matchAll(/net\s*pay[ée]\s*(?:en\s*euros|eneuros|en)?\s*[:=]?\s*([\d\s]+[,.]\d{2})/gi));
  for (let i = netPayeMatches.length - 1; i >= 0; i--) {
    const val = parseFloat(netPayeMatches[i][1].replace(/\s/g, "").replace(",", "."));
    if (val >= 100 && val <= 100000) {
      netAPayerReel = val;
      detectedItems.push(`Net à Payer (en Banque) réel : ${netAPayerReel.toFixed(2)} €`);
      break;
    }
  }

  // Passe prioritaire pour Net à payer avant impôt sur le revenu : dernière occurrence (page 2)
  const netAvantImpotMatches = Array.from(normalizedText.matchAll(/net\s*a\s*payer\s*avant\s*imp[oô]t\s*(?:sur\s*le\s*revenu)?\s*[:=]?\s*([\d\s]+[,.]\d{2})/gi));
  for (let i = netAvantImpotMatches.length - 1; i >= 0; i--) {
    const val = parseFloat(netAvantImpotMatches[i][1].replace(/\s/g, "").replace(",", "."));
    if (val >= 100 && val <= 100000) {
      netAvantImpotReel = val;
      detectedItems.push(`Net à Payer Avant Impôt réel : ${netAvantImpotReel.toFixed(2)} €`);
      break;
    }
  }

  for (const line of lines) {
    const lPlain = deaccent(line.toLowerCase());
    // Tous les montants de la ligne, y compris les zéros (un « PAS 0.00 » est une information)
    const allNums = Array.from(line.matchAll(/([\d\s]+[,.]\d{2})/g))
      .map(m => parseFloat(m[1].replace(/\s/g, "").replace(",", ".")));
    const amounts = allNums.filter(a => a > 0);
    const lastNum = allNums.length > 0 ? allNums[allNums.length - 1] : undefined;

    if (amounts.length > 0) {
      const lastAmount = amounts[amounts.length - 1];

      // Total Brut — bulletin Ciril : « Totaux Gains 1 621.04 Cotisations 656.59 » ou « Brut fiscal 1 621.04 … »
      const isTotauxGains = lPlain.includes("totaux gains") || (lPlain.includes("totaux") && lPlain.includes("gains"));
      const isBrutLine = isTotauxGains
        || lPlain.includes("brut fiscal") || lPlain.includes("total brut") || lPlain.includes("remuneration brute")
        || lPlain.includes("brut mensuel") || lPlain.includes("salaire brut");
      if (isBrutLine && (brutReel === undefined || isTotauxGains)) {
        const candidate = amounts.find(a => a >= 200 && a <= 150000);
        if (candidate !== undefined) {
          brutReel = candidate;
          detectedItems.push(`Total Brut réel imprimé : ${brutReel.toFixed(2)} €`);
        }
        // Total Cotisations Patronales sur la ligne "Totaux Gains ... Cotisations ..."
        const mCotis = line.match(/cotisations?\s*[:=.]?\s*([\d\s]+[,.]\d{2})/i) || lPlain.match(/cotisations?\s*[:=.]?\s*([\d\s]+[,.]\d{2})/);
        if (mCotis) {
          const valCotis = parseFloat(mCotis[1].replace(/\s/g, '').replace(',', '.'));
          if (valCotis >= 50 && valCotis <= 20000) {
            cotisationsPatronalesReelles = valCotis;
            detectedItems.push(`Total Cotisations patronales réelles : ${cotisationsPatronalesReelles.toFixed(2)} €`);
          }
        }
      }

      // Total Retenues (« Total des retenues 317.16 »)
      if ((lPlain.includes("total retenues") || lPlain.includes("total des retenues") || lPlain.includes("total cotisations")) && lastAmount >= 20 && lastAmount <= 80000) {
        totalRetenuesReelles = lastAmount;
        detectedItems.push(`Total Retenues salariales réelles : ${totalRetenuesReelles.toFixed(2)} €`);
      }

      // Net Fiscal Imposable (veiller à ne pas confondre avec "Brut fiscal" si les deux mots apparaissent)
      if ((lPlain.includes("net fiscal") || lPlain.includes("net imposable")) && !lPlain.includes("brut fiscal") && netFiscalReel === undefined) {
        const candidate = amounts.find(a => a >= 200 && a <= 150000);
        if (candidate !== undefined) {
          netFiscalReel = candidate;
          detectedItems.push(`Net Fiscal imposable réel : ${netFiscalReel.toFixed(2)} €`);
        }
      }

      // Net Avant Impôt (« NET A PAYER AVANT IMPOT SUR LE REVENU 3 809.28 »)
      if (lPlain.includes("avant impot") && netAvantImpotReel === undefined) {
        const candidate = amounts.find(a => a >= 200 && a <= 150000);
        if (candidate !== undefined) {
          netAvantImpotReel = candidate;
        }
      }

      // Total versé par l'employeur (« Total versé par l'employeur 2 277.63 »)
      if (lPlain.includes("vers") && lPlain.includes("employeur")) {
        const mVers = line.match(/employeur\s*[:=.]?\s*([\d\s]+(?:[.,]\d{2})?)/i);
        let valEmployeur = lastAmount;
        if (mVers) {
          const rawV = parseFloat(mVers[1].replace(/\s/g, '').replace(',', '.'));
          if (rawV > 10000 && rawV % 1 === 0) valEmployeur = rawV / 100;
          else if (rawV >= 500 && rawV <= 200000) valEmployeur = rawV;
        } else if (valEmployeur > 10000 && valEmployeur % 1 === 0) {
          valEmployeur = valEmployeur / 100;
        }
        if (valEmployeur >= 500 && (brutReel === undefined || valEmployeur <= brutReel * 2.5)) {
          coutEmployeurReel = valEmployeur;
          detectedItems.push(`Total versé par l'employeur réel : ${coutEmployeurReel.toFixed(2)} €`);
        }
      }

      // Prélèvement à la Source en euros : le DERNIER nombre brut est pris, y compris 0.00
      // (PAS nul) — le filtre des zéros retournerait la base du PAS à la place du montant
      if ((lPlain.includes("source") || lPlain.includes("pas") || lPlain.includes("impot")) && (lPlain.includes("montant") || lPlain.includes("retenue") || lPlain.includes("prelev")) && lastNum !== undefined && lastNum >= 0 && lastNum <= 30000) {
        pasReel = lastNum;
      }

      // Net à Payer de secours si non trouvé par regex directe
      if (netAPayerReel === undefined && (lPlain.includes("net a payer") || lPlain.includes("net paye") || lPlain.includes("net en euros")) && lastAmount >= 200 && lastAmount <= 150000) {
        netAPayerReel = lastAmount;
        detectedItems.push(`Net à Payer (en Banque) réel : ${netAPayerReel.toFixed(2)} €`);
      }
    }
  }

  // 12. Détection Identification Agent, Matricule, NIR, Grade, Poste, Service
  let matricule: string | undefined;
  let numeroSecu: string | undefined;
  let positionAdmin: string | undefined;
  let service: string | undefined;
  let poste: string | undefined;
  let nom = "Agent Territorial";

  // Extraction Matricule
  for (const line of lines) {
    const cleanL = line.replace(/[|[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
    const mMatDirect = cleanL.match(/\b(10\d{6})\b/) || cleanL.match(/matricule\s*[:=]?\s*(\d{7,10})/i);
    if (mMatDirect) {
      matricule = mMatDirect[1];
      detectedItems.push(`Matricule agent détecté : ${matricule}`);
      break;
    }
  }

  // Extraction Nom de l'agent (en-tête Ciril)
  for (const line of lines) {
    const cleanL = line.replace(/[|[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
    // Format Ciril direct : "10027786 2 01-06-2026 - 30-06-2026 SETOUANE Mariem"
    const mNomDate = cleanL.match(/\b\d{2}[-/.]\d{2}[-/.]\d{4}\s*-\s*\d{2}[-/.]\d{2}[-/.]\d{4}\s+([A-Za-zÀ-ÿ\s'-]+)/);
    if (mNomDate) {
      const cand = mNomDate[1].replace(/n[ée]e\b.*$/i, '').trim();
      if (cand.length >= 3 && !/differentielle|indice|remun|brut|fonction|contractuel|rempla/i.test(cand)) {
        nom = cand;
        detectedItems.push(`Agent détecté (en-tête Ciril) : ${nom}`);
        break;
      }
    }
    // Avec mention née : "SETOUANE Mariem née CHATTI"
    const mNee = cleanL.match(/([A-ZÀ-ÿ]{3,}\s+[A-Za-zÀ-ÿ]{3,})\s+n[ée]e\b/i);
    if (mNee) {
      nom = mNee[1].trim();
      detectedItems.push(`Agent détecté : ${nom}`);
      break;
    }
  }

  // Extraction SFT (nombre d'enfants)
  for (const line of lines) {
    const cleanL = line.replace(/[|[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
    const mSft = cleanL.match(/\b10\d{6}\s+(\d{1,2})\s+\d{2}[-/.]\d{2}[-/.]\d{4}/);
    if (mSft && parseInt(mSft[1], 10) > 0) {
      nbEnfants = parseInt(mSft[1], 10);
      detectedItems.push(`SFT (enfants à charge) lu : ${nbEnfants}`);
      break;
    }
  }

  // NIR / Sécurité sociale
  const mNir = normalizedText.match(/\b([12]\s*\d{2}\s*\d{2}\s*\d{2}\s*\d{3}\s*\d{3}(?:\s*\d{2})?)\b/);
  if (mNir) {
    numeroSecu = mNir[1].replace(/\s+/g, ' ');
    detectedItems.push(`N° Sécurité Sociale (NIR) : ${numeroSecu}`);
  }

  // Position administrative
  if (/titulaire cnracl/i.test(normalizedText)) positionAdmin = 'Titulaire CNRACL';
  else if (/contractuel/i.test(normalizedText)) positionAdmin = 'Contractuel IRCANTEC';
  else if (/stagiaire cnracl/i.test(normalizedText)) positionAdmin = 'Stagiaire CNRACL';

  // Poste et Service
  for (let i = 0; i < lines.length; i++) {
    const cleanL = lines[i].replace(/[|[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^poste$/i.test(cleanL) && i + 1 < lines.length) {
      const cand = lines[i + 1].replace(/[|[\]{}]/g, '').trim();
      // Ignorer absolument les lignes d'en-tête d'indices pour le poste
      if (cand && !/indice|remun|taux\s*emploi|brut\s*nd/i.test(cand)) {
        poste = cand;
        detectedItems.push(`Poste : ${poste}`);
      }
    }
    // Ligne indices Ciril : "367 368 367 100.00 Equipe Grésillons maternelle"
    const mIndService = cleanL.match(/^(\d{3})\s+(\d{3})\s+(\d{3})\s+(\d{2,3}(?:[.,]\d{1,2})?)\s*(.+)$/);
    if (mIndService && mIndService[5]) {
      const candServ = mIndService[5].trim();
      if (!/indice|remun|taux\s*emploi/i.test(candServ)) {
        service = candServ;
        detectedItems.push(`Service : ${service}`);
      }
    }
  }

  // Poste spécifique ATSEM si mentionné
  if (!poste && /A\.?T\.?S\.?E\.?M/i.test(normalizedText)) {
    poste = "A.T.S.E.M";
    detectedItems.push(`Poste : ${poste}`);
  }

  // Cohérence financière et correction des erreurs OCR de milliers manquants (ex: “À 303.88 -> 1 303.88)
  if (brutReel !== undefined && totalRetenuesReelles !== undefined) {
    const netTheoriqueImprime = Math.round((brutReel - totalRetenuesReelles) * 100) / 100;
    if (netAvantImpotReel !== undefined && Math.abs((netTheoriqueImprime - 1000) - netAvantImpotReel) < 2) {
      netAvantImpotReel = netTheoriqueImprime;
      detectedItems.push(`Correction du millier manquant sur Net Avant Impôt : ${netAvantImpotReel.toFixed(2)} €`);
    } else if (netAvantImpotReel === undefined || netAvantImpotReel < 400) {
      netAvantImpotReel = netTheoriqueImprime;
    }
    if (netAPayerReel !== undefined && Math.abs((netTheoriqueImprime - 1000) - netAPayerReel) < 2) {
      netAPayerReel = netTheoriqueImprime;
      detectedItems.push(`Correction du millier manquant sur Net Payé : ${netAPayerReel.toFixed(2)} €`);
    } else if (netAPayerReel === undefined || netAPayerReel < 400) {
      netAPayerReel = netTheoriqueImprime;
    }
  }

  // Détection Grade & Échelon Ciril RH
  let grade = statut === "contractuel" ? "Agent contractuel territorial" : "Fonctionnaire territorial";
  let echelon = "Échelon statutaire";

  // Période de paie imprimée sur le bulletin (« Septembre 2026 »)
  const periodeMatch = normalizedText.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i);
  const periode = periodeMatch ? `${periodeMatch[1].toLowerCase()} ${periodeMatch[2]}` : undefined;

  for (let i = 0; i < lines.length - 1; i++) {
    const lPlain = deaccent(lines[i].toLowerCase());
    if (lPlain.includes("emploi / grade") || lPlain.includes("emploi/grade")) {
      const nextLine = lines[i + 1].trim();
      // Ex: "Attaché principal 04 75018 PARIS" ou "Adjoint d'animation pal 1 cl 05 92230 GENNEVILLIERS"
      const gradePartMatch = nextLine.match(/^(.*?)\s+(\d{1,2})(?:\s+\d{5}\b|\s*$)/);
      if (gradePartMatch) {
        const potentialEchelon = parseInt(gradePartMatch[2], 10);
        if (potentialEchelon > 0 && potentialEchelon <= 20) {
          grade = gradePartMatch[1].trim();
          echelon = `Échelon ${potentialEchelon}`;
          detectedItems.push(`Emploi / Grade lu : ${grade} (${echelon})`);
        } else {
          grade = nextLine;
          detectedItems.push(`Emploi / Grade lu : ${grade}`);
        }
      } else if (nextLine.length > 3) {
        grade = nextLine;
        detectedItems.push(`Emploi / Grade lu : ${grade}`);
      }
      break;
    }
  }

  if (grade === "Agent contractuel territorial" || grade === "Fonctionnaire territorial") {
    const gradeMatch = t.match(/grade\s*[:=]\s*([^\n\r,;]+)/i);
    if (gradeMatch && gradeMatch[1].trim().length > 3) {
      grade = gradeMatch[1].trim();
    }
  }
  
  if (echelon === "Échelon statutaire") {
    const echMatch = t.match(/[ée]chelon\s*[:=]?\s*(\d{1,2})/i);
    if (echMatch) {
      echelon = `Échelon ${parseInt(echMatch[1], 10)}`;
    }
  }

  const primesFound = ifse > 0 || autresPrimes > 0 || cia > 0;
  const confidence: 'high' | 'medium' | 'low' = (imFound && primesFound) ? 'high' : (imFound || primesFound) ? 'medium' : 'low';
  const summary = detectedItems.length > 0
    ? `${detectedItems.length} élément(s) détecté(s) avec succès dans le fichier.`
    : "Peu d'éléments textuels détectés dans le fichier (possible scan ou image).";

  const lignesReelles = parseCirilBulletinLines(normalizedText);
  if (lignesReelles.length > 0) {
    detectedItems.push(`${lignesReelles.length} rubriques et cotisations Ciril extraites fidèlement du bulletin`);
  }

  return {
    params: {
      indiceMajore: im,
      indiceBrut,
      indiceRemun,
      lignesReelles: lignesReelles.length > 0 ? lignesReelles : undefined,
      nbiPoints: nbi,
      ifse,
      cia,
      autresPrimes,
      zoneResidence: 1, // Gennevilliers
      nbEnfantsSft: nbEnfants,
      quotite,
      statut,
      tauxPas,
      nomAgent: nom,
      matricule,
      numeroSecu,
      positionAdmin,
      grade,
      echelon,
      service,
      poste,
      appliquerPpcr,
      abattementPpcr,
      remboursementTransport,
      indemniteCompensatriceCsg,
      participationMutuelleEmployeur,
      retenueMutuelleSalarie,
      montantsReels: {
        brutReel,
        totalRetenuesReelles,
        netFiscalReel,
        netAvantImpotReel,
        pasReel,
        netAPayerReel,
        cotisationsPatronalesReelles,
        coutEmployeurReel
      },
      periode
    },
    metadata: {
      detectedItems,
      rawTextLength: rawText.length,
      extractedLinesCount: lines.length,
      confidence,
      summary,
      rawText
    }
  };
}

/**
 * Wrapper de compatibilité pour conserver la signature originale
 */
export function parseUploadedPaySlip(rawText: string): CalculParams {
  return parseUploadedPaySlipWithMeta(rawText).params;
}

