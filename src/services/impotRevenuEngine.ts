/**
 * Moteur de calcul d'Impôt sur le Revenu (IR) 2026 sur les revenus 2025
 * Conforme au barème officiel de la DGFiP (loi de finances) et au moteur calc_ir.py
 * 
 * Périmètre :
 * - Barème progressif par tranches d'imposition (CGI art. 197)
 * - Abattement forfaitaire de 10% pour frais professionnels (salaires / pensions)
 * - Quotient familial et plafonnement des demi-parts additionnelles (1 807 € par demi-part)
 * - Décote légale pour revenus modestes et moyens
 * - Seuil de non-recouvrement (CGI art. 1657-1 bis : 61 €)
 * - Comparaison Prélèvement à la Source (PAS) et estimation du solde DGFiP (restitutions ou reliquat)
 */

export interface BaremeTranche {
  taux: number;
  de: number;
  a: number | null; // null pour la dernière tranche (au-delà)
}

export const BAREME_IR_2026: BaremeTranche[] = [
  { de: 0, a: 11600, taux: 0 },
  { de: 11600, a: 29579, taux: 0.11 },
  { de: 29579, a: 84577, taux: 0.30 },
  { de: 84577, a: 181917, taux: 0.41 },
  { de: 181917, a: null, taux: 0.45 },
];

export const REGLES_FISCALES = {
  annee_revenus: 2025,
  annee_declaration: 2026,
  abattement_salaires_10pct: {
    taux: 0.10,
    minimum: 509,
    maximum: 14555,
  },
  quotient_familial: {
    plafond_gain_par_demi_part: 1807,
  },
  decote: {
    seuil_celibataire: 1982,
    seuil_couple: 3277,
    plafond_celibataire: 897,
    plafond_couple: 1483,
    coefficient: 0.4525,
  },
  seuil_non_recouvrement: 61,
};

export interface SituationFiscaleInput {
  situation: 'celibataire' | 'marie_pacse' | 'divorce' | 'separe';
  nbEnfants: number;
  parentIsole?: boolean; // Case T
  salaireNetFiscalAnnuelDeclarant1: number;
  salaireNetFiscalAnnuelDeclarant2?: number;
  autresRevenusImposables?: number;
  fraisReelsDeclarant1?: number; // si option frais réels plutôt que 10%
  tauxPasMensuel?: number; // Taux de PAS appliqué sur la fiche de paie en %
  montantPasPreleveAnnuel?: number; // Montant annuel déjà prélevé
}

export interface DetailTrancheResult {
  trancheLabel: string;
  taux: number;
  assietteImposable: number;
  impotTranche: number;
}

export interface SimulationIRResult {
  anneeRevenus: number;
  anneeDeclaration: number;
  // Revenus bruts & abattements
  revenuBrutGlobal: number;
  abattementDeclarant1: number;
  abattementDeclarant2: number;
  revenuNetImposable: number; // RNI
  // Quotient familial
  partsBase: number; // 1 (seul) ou 2 (couple)
  partsTotal: number;
  demiPartsAdditionnelles: number;
  quotientParPart: number;
  // Calculs d'impôt
  impotBaseParts: number; // Impôt calculé avec parts_base seulement
  impotTotalParts: number; // Impôt calculé avec toutes les parts
  gainQFReel: number;
  gainQFMax: number;
  qfPlafonne: boolean;
  impotBrutApresQF: number;
  // Décote
  decoteAppliquee: number;
  impotApresDecote: number;
  // Résultat net final
  impotNetFinal: number; // 0 si < 61 €
  tauxMoyenImposition: number; // %
  tauxMarginalImposition: number; // % (TMI)
  // Prélèvement à la source et solde DGFiP
  totalPasEstime: number;
  soldeDgfip: number; // > 0: remboursement / trop-perçu ; < 0: reste à payer
  soldeType: 'remboursement' | 'reliquat' | 'equilibre';
  // Détail par tranche
  detailsTranches: DetailTrancheResult[];
}

/**
 * Calcule l'abattement de 10% pour un déclarant
 */
export function calculerAbattement10Pct(salaireBrut: number, fraisReels?: number): number {
  if (salaireBrut <= 0) return 0;
  if (fraisReels && fraisReels > 0) {
    return Math.round(fraisReels);
  }
  const cfg = REGLES_FISCALES.abattement_salaires_10pct;
  const standard = salaireBrut * cfg.taux;
  const effectif = Math.min(salaireBrut, Math.max(cfg.minimum, Math.min(cfg.maximum, standard)));
  return Math.round(effectif);
}

/**
 * Calcule le nombre de parts du foyer fiscal
 */
export function calculerPartsFiscales(
  situation: 'celibataire' | 'marie_pacse' | 'divorce' | 'separe',
  nbEnfants: number,
  parentIsole: boolean = false
): { partsBase: number; partsTotal: number; demiPartsAdditionnelles: number } {
  const partsBase = situation === 'marie_pacse' ? 2 : 1;
  let partsEnfants = 0;

  if (nbEnfants === 1) {
    partsEnfants = 0.5;
  } else if (nbEnfants === 2) {
    partsEnfants = 1.0;
  } else if (nbEnfants > 2) {
    partsEnfants = 1.0 + (nbEnfants - 2) * 1.0;
  }

  // Majoration parent isolé (case T) si célibataire/séparé avec enfant
  let majorationIsole = 0;
  if (partsBase === 1 && nbEnfants > 0 && parentIsole) {
    majorationIsole = 0.5;
  }

  const partsTotal = partsBase + partsEnfants + majorationIsole;
  const demiPartsAdditionnelles = (partsTotal - partsBase) * 2;

  return { partsBase, partsTotal, demiPartsAdditionnelles };
}

/**
 * Calcule l'impôt brut pour 1 part selon le barème progressif
 */
export function calculerImpotPourUnePart(revenuParPart: number, tranches: BaremeTranche[] = BAREME_IR_2026): {
  impot: number;
  details: DetailTrancheResult[];
  tmi: number;
} {
  let impotCumule = 0;
  let tmi = 0;
  const details: DetailTrancheResult[] = [];

  for (const tranche of tranches) {
    const low = tranche.de;
    const high = tranche.a ?? Infinity;

    if (revenuParPart <= low) {
      details.push({
        trancheLabel: tranche.a ? `${low.toLocaleString('fr-FR')} € à ${tranche.a.toLocaleString('fr-FR')} €` : `Plus de ${low.toLocaleString('fr-FR')} €`,
        taux: tranche.taux,
        assietteImposable: 0,
        impotTranche: 0,
      });
      continue;
    }

    const trancheAssiette = Math.min(revenuParPart, high) - low;
    const trancheImpot = trancheAssiette * tranche.taux;
    impotCumule += trancheImpot;

    if (trancheAssiette > 0 && tranche.taux > tmi) {
      tmi = tranche.taux;
    }

    details.push({
      trancheLabel: tranche.a ? `${low.toLocaleString('fr-FR')} € à ${tranche.a.toLocaleString('fr-FR')} €` : `Plus de ${low.toLocaleString('fr-FR')} €`,
      taux: tranche.taux,
      assietteImposable: Math.round(trancheAssiette),
      impotTranche: Math.round(trancheImpot),
    });
  }

  return { impot: impotCumule, details, tmi };
}

/**
 * Calcul complet de l'Impôt sur le Revenu
 */
export function simulerImpotRevenu(input: SituationFiscaleInput): SimulationIRResult {
  const sal1 = Math.max(0, input.salaireNetFiscalAnnuelDeclarant1 || 0);
  const isCouple = input.situation === 'marie_pacse';
  const sal2 = isCouple ? Math.max(0, input.salaireNetFiscalAnnuelDeclarant2 || 0) : 0;
  const autres = Math.max(0, input.autresRevenusImposables || 0);

  const brutGlobal = sal1 + sal2 + autres;

  const abat1 = calculerAbattement10Pct(sal1, input.fraisReelsDeclarant1);
  const abat2 = isCouple ? calculerAbattement10Pct(sal2) : 0;

  const rni = Math.max(0, brutGlobal - (abat1 + abat2));

  // Parts
  const { partsBase, partsTotal, demiPartsAdditionnelles } = calculerPartsFiscales(
    input.situation,
    input.nbEnfants || 0,
    input.parentIsole
  );

  // Impôt avec toutes les parts
  const quotientTotal = partsTotal > 0 ? rni / partsTotal : 0;
  const resTotal = calculerImpotPourUnePart(quotientTotal);
  const impotTotalParts = Math.round(resTotal.impot * partsTotal);

  // Impôt avec parts de base (pour le plafonnement du quotient familial)
  const quotientBase = partsBase > 0 ? rni / partsBase : 0;
  const resBase = calculerImpotPourUnePart(quotientBase);
  const impotBaseParts = Math.round(resBase.impot * partsBase);

  // Plafonnement du quotient familial
  const gainReel = impotBaseParts - impotTotalParts;
  const plafondDemiPart = REGLES_FISCALES.quotient_familial.plafond_gain_par_demi_part;
  const gainMax = demiPartsAdditionnelles * plafondDemiPart;
  const qfPlafonne = gainReel > gainMax && demiPartsAdditionnelles > 0;

  const impotBrutApresQF = qfPlafonne
    ? Math.max(0, impotBaseParts - gainMax)
    : impotTotalParts;

  // Décote légale
  const cfgDecote = REGLES_FISCALES.decote;
  const seuilDecote = partsBase === 1 ? cfgDecote.seuil_celibataire : cfgDecote.seuil_couple;
  const plafondDecote = partsBase === 1 ? cfgDecote.plafond_celibataire : cfgDecote.plafond_couple;

  let decote = 0;
  if (impotBrutApresQF < seuilDecote && impotBrutApresQF > 0) {
    const rawDecote = plafondDecote - cfgDecote.coefficient * impotBrutApresQF;
    decote = Math.min(impotBrutApresQF, Math.max(0, Math.round(rawDecote)));
  }

  const impotApresDecote = Math.max(0, impotBrutApresQF - decote);

  // Seuil de non-recouvrement (61 €)
  const impotNetFinal = impotApresDecote < REGLES_FISCALES.seuil_non_recouvrement ? 0 : impotApresDecote;

  // Taux moyen et TMI
  const tauxMoyenImposition = brutGlobal > 0 ? Number(((impotNetFinal / brutGlobal) * 100).toFixed(2)) : 0;
  const tauxMarginalImposition = Number((resTotal.tmi * 100).toFixed(0));

  // Prélèvement à la source (PAS)
  let totalPasEstime = 0;
  if (input.montantPasPreleveAnnuel !== undefined && input.montantPasPreleveAnnuel >= 0) {
    totalPasEstime = Math.round(input.montantPasPreleveAnnuel);
  } else if (input.tauxPasMensuel !== undefined && input.tauxPasMensuel >= 0) {
    totalPasEstime = Math.round(brutGlobal * (input.tauxPasMensuel / 100));
  }

  // Solde DGFiP : totalPasEstime - impotNetFinal
  // Si on a payé 2000 € de PAS et qu'on doit 1500 € -> +500 € (remboursement)
  // Si on a payé 1000 € de PAS et qu'on doit 1500 € -> -500 € (reliquat à payer)
  const soldeDgfip = totalPasEstime - impotNetFinal;
  let soldeType: 'remboursement' | 'reliquat' | 'equilibre' = 'equilibre';
  if (soldeDgfip > 0) {
    soldeType = 'remboursement';
  } else if (soldeDgfip < 0) {
    soldeType = 'reliquat';
  }

  return {
    anneeRevenus: REGLES_FISCALES.annee_revenus,
    anneeDeclaration: REGLES_FISCALES.annee_declaration,
    revenuBrutGlobal: Math.round(brutGlobal),
    abattementDeclarant1: abat1,
    abattementDeclarant2: abat2,
    revenuNetImposable: Math.round(rni),
    partsBase,
    partsTotal,
    demiPartsAdditionnelles,
    quotientParPart: Math.round(quotientTotal),
    impotBaseParts,
    impotTotalParts,
    gainQFReel: Math.max(0, gainReel),
    gainQFMax: gainMax,
    qfPlafonne,
    impotBrutApresQF,
    decoteAppliquee: decote,
    impotApresDecote,
    impotNetFinal,
    tauxMoyenImposition,
    tauxMarginalImposition,
    totalPasEstime,
    soldeDgfip,
    soldeType,
    detailsTranches: resTotal.details,
  };
}
