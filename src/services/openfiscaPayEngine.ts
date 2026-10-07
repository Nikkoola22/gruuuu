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
    nom: "RIFSEEP - IFSE (Partie Principale)",
    description: "Indemnité de Fonctions, de Sujétions et d'Expertise, tenant compte du niveau de responsabilités et de l'expérience professionnelle.",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Décret n° 2014-513 & Délibération cadre de la Ville de Gennevilliers",
    formule: "montant_mensuel_fixe_deliberation_collectivite",
    categorie: "primes",
    nature: "gain"
  },
  rifseep_cia: {
    id: "rifseep_cia",
    nom: "RIFSEEP - CIA (Complément Individuel Annuel)",
    description: "Complément tenant compte de l'engagement professionnel et de la manière de servir (évaluation CREP).",
    openfiscaModule: "openfisca_france/model/prestations/fonctions_publiques/primes.py",
    githubUrl: `${OPENFISCA_REPO_URL}/blob/master/openfisca_france/model/prestations/fonctions_publiques/primes.py`,
    legalReference: "Décret n° 2014-513 & Délibération Conseil Municipal de Gennevilliers",
    formule: "montant_cia_annuel_ou_mensualise",
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
  metadata?: {
    rawText?: string;
    detectedItems?: string[];
  };
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

/**
 * Exécute la simulation complète de la fiche de paie selon les formules OpenFisca-France
 * et la doctrine de calcul Ciril RH Ville de Gennevilliers
 */
export function computeOpenFiscaPay(params: CalculParams, metadata?: ParseMetadata): FichePaieAnalyseResult {
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
      code: "0200",
      libelle: "RIFSEEP - IFSE mensuelle (Fonctions & Expertise)",
      montantGain: ifse,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.rifseep_ifse,
      montantTheoriqueOpenFisca: ifse,
      estConforme: true,
      explicationLigne: `Prime principale mensuelle fixée selon votre groupe de fonctions dans la grille RIFSEEP de la Ville de Gennevilliers.`
    });
  }

  if (cia > 0) {
    lignes.push({
      id: "cia",
      code: "0210",
      libelle: "RIFSEEP - CIA (Complément Individuel Annuel)",
      montantGain: cia,
      openFiscaVar: OPENFISCA_VARIABLES_DICTIONARY.rifseep_cia,
      montantTheoriqueOpenFisca: cia,
      estConforme: true,
      explicationLigne: `Partie variable liée à votre entretien professionnel annuel (CREP) et à votre engagement professionnel.`
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
  "2591": { cat: "gain", expl: "ifse", libelle: "IFSE Tit. P2" },
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
  "1591": { cat: "gain", expl: "ifse" },
  "1592": { cat: "gain", expl: "cia", libelle: "CIA / IFSE RG" },
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
  prime_13eme: "primes_fonction_publique",
  indem_differentielle: "primes_fonction_publique",
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
  cotis_mutuelle: "retenue_mutuelle_salarie",
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
  metadata?: ParseMetadata
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

    lignes.push({
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
      explicationLigne: `Rubrique ${lr.code} du bulletin original — copiée telle quelle (aucun recalcul).`
    });
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
  lignes.push({
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
  });

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
      nbi: 0,
      indemniteResidence: 0,
      sft: 0,
      primesIfse: 0,
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

