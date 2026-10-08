/**
 * Types de carrière FPT — cadres d'emplois, grades, échelons et perspectives
 * d'avancement. Consommé par src/data/gradesData.ts.
 */

/** Un échelon d'un grade, avec sa durée moyenne d'avancement et ses indices. */
export interface EchelonDefinition {
  numero: number;
  /** Durée moyenne réglementaire dans l'échelon (années). */
  dureeAnnees: number;
  indiceBrut: number;
  indiceMajore: number;
  description?: string;
}

/** Une voie d'accès possible vers un grade cible (examen, au choix, concours…). */
export interface ConditionAvancement {
  typeVoie: string;
  descriptionVoie: string;
  echelonMinimum?: number;
  ancienneteEchelonAnnees?: number;
  ancienneteGradeAnnees?: number;
  /** Ancienneté requise dans le cadre d'emplois (voie « au choix »). */
  ancienneteCadreAnnees?: number;
  /** Ancienneté requise dans les services publics (concours / examen). */
  ancienneteServicesPublicsAnnees?: number;
  examenProfessionnelRequis?: boolean;
  piecesRequises?: string[];
  actesAdministratifs?: string[];
}

/** Une perspective d'avancement de grade depuis un grade donné. */
export interface PerspectiveAvancement {
  gradeCibleId: string;
  nomGradeCible: string;
  categorieCible: string;
  typePerspective: string;
  ratioPromusPromouvablesExplication: string;
  modaliteReclassement: string;
  explicationReclassement: string;
  conditions: ConditionAvancement[];
}

/** Un grade au sein d'un cadre d'emplois. */
export interface GradeDefinition {
  id: string;
  nom: string;
  filiere: string;
  categorie: string;
  descriptionGrade: string;
  echelons: EchelonDefinition[];
  perspectives: PerspectiveAvancement[];
}

/** Un cadre d'emplois de la FPT (ex. Adjoint administratif territorial). */
export interface CadreEmploiDefinition {
  id: string;
  nom: string;
  filiere: string;
  categorie: string;
  decretReference: string;
  grades: GradeDefinition[];
}
