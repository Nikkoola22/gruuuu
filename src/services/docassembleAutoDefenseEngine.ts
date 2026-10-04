/**
 * MOTEUR D'AUTO-DÉFENSE SYNDICALE & CONTENTIEUX ADMINISTRATIF
 * Aligné sur Docassemble (Python / YAML / Jinja2 / CJA)
 * 
 * Conforme au Code de Justice Administrative (CJA), au Code Général de la Fonction Publique (CGFP)
 * et aux exigences de Télérecours Citoyens (Art. R. 414-5 CJA).
 */

export interface RecevabiliteDelaiResult {
  dateNotification: string;
  voiesEtDelaisMentionnes: boolean;
  typeNotification: "explicite" | "implicite";
  dateLimiteInitiale: string; // calculée à J+2 mois
  dateLimiteProrogee: string; // premier jour ouvrable suivant si samedi/dimanche/férié
  dateLimiteCzabaj?: string; // 1 an raisonnable si absence de mention R. 421-5 CJA
  joursRestants: number;
  statut: "valide" | "urgent" | "forclos" | "inopposable_czabaj";
  libelleStatut: string;
  explicationJuridique: string;
  regleAppliquee: string;
  dateRecoursGracieux?: string;
  dateRejetImplicite?: string; // J+2 mois après recours gracieux
  dateLimiteContentieuseFinale?: string; // J+2 mois après rejet implicite
}

export type MotifRefus = 
  | "teletravail"
  | "temps_partiel"
  | "rupture_conventionnelle"
  | "disponibilite"
  | "crep";

export interface RecoursGracieuxFormData {
  motifRefus: MotifRefus;
  nomAgent: string;
  prenomAgent: string;
  matricule?: string;
  grade: string;
  directionService: string;
  collectivite: string;
  autoriteSignataire: string; // ex: Monsieur le Maire de Gennevilliers
  dateNotificationArrete: string;
  mentionVoiesRecours: boolean;
  dateRecoursGracieux: string;
  referenceArrete: string;
  motifsInvoquesParAdministration: string;
  argumentsAgent: string;
  demandeEntretien: boolean;
  piecesJointes: string[];
}

export type TypeAtteinteProtection = 
  | "agression_physique"
  | "menaces_intimidations"
  | "diffamation_injures"
  | "harcelement_moral"
  | "harcelement_sexuel"
  | "outrage";

export interface ProtectionFonctionnelleFormData {
  nomAgent: string;
  prenomAgent: string;
  grade: string;
  service: string;
  collectivite: string;
  autoriteDestinataire: string;
  dateDemande: string;
  typeAtteinte: TypeAtteinteProtection;
  chronologieFaits: string;
  temoinsIdentifies: string;
  depotPlainteOuMainCourante: boolean;
  referencePlainte?: string;
  arretTravailOuItt: boolean;
  dureeItt?: string;
  mesuresUrgenceDemandeess: {
    priseEnChargeFraisAvocat: boolean;
    changementAffectationConservatoire: boolean;
    signalementArt40Cpp: boolean;
    soutienPsychologique: boolean;
  };
  detailsPrejudice: string;
}

export type TypeInstanceParitaire = "cap" | "ccp" | "f3sct_cst";

export type MotifSaisineCap = 
  | "crep"
  | "refus_formation"
  | "refus_temps_partiel"
  | "refus_teletravail"
  | "licenciement_insuffisance";

export type MotifSaisineCcp = 
  | "licenciement_contractuel_insuffisance"
  | "licenciement_contractuel_suppression"
  | "licenciement_contractuel_inaptitude"
  | "licenciement_contractuel_disciplinaire"
  | "recours_crep_contractuel"
  | "non_renouvellement";

export type MotifSaisineF3sct = 
  | "danger_grave_imminent"
  | "droit_alerte_retrait"
  | "souffrance_travail_rps"
  | "insalubrite_visite_locaux";

export interface SaisineInstanceFormData {
  instance: TypeInstanceParitaire;
  nomAgent: string;
  prenomAgent: string;
  matricule?: string;
  statutAgent: "titulaire" | "stagiaire" | "contractuel_cdd" | "contractuel_cdi";
  grade: string;
  directionService: string;
  collectivite: string;
  cigRattachement: string;
  destinataireInstance: string;
  
  motifCap?: MotifSaisineCap;
  motifCcp?: MotifSaisineCcp;
  motifF3sct?: MotifSaisineF3sct;
  
  dateNotificationDecision: string;
  dateRecoursPrealable?: string;
  dateDecisionRecoursPrealable?: string;
  dateIncidentDanger?: string;
  lieuIncidentDanger?: string;
  
  faitsEtContexte: string;
  motifsInvoquesAdministration: string;
  argumentsAgent: string;
  demandesAgent: string;
  
  assistanceSyndicale: boolean;
  nomRepresentantSyndical?: string;
  
  piecesJointes: string[];
}

export interface SaisineInstanceResult {
  titre: string;
  sousTitre: string;
  texteOfficiel: string;
  delaisEtProcedure: {
    delaiLegal: string;
    autoriteCompetente: string;
    effetJuridique: string;
    avertissement?: string;
  };
  fondementsJuridiques: string[];
  piecesRequises: string[];
}

export interface RequeteContentieuseFormData {
  typeRequete: "rep_seul" | "rep_et_refere";
  juridiction: string; // ex: Tribunal Administratif de Cergy-Pontoise
  nomAgent: string;
  prenomAgent: string;
  adresseAgent: string;
  codePostalAgent: string;
  villeAgent: string;
  telephoneAgent: string;
  emailAgent: string;
  gradeAgent: string;
  collectiviteDefendeuse: string;
  adresseCollectivite: string;
  dateDecisionAttaquee: string;
  referenceDecisionAttaquee: string;
  dateNotificationDecision: string;
  mentionVoiesRecours: boolean;
  recoursGracieuxPrealable: boolean;
  dateRecoursGracieux?: string;
  dateRejetRecoursGracieux?: string;
  typeRejetRecoursGracieux?: "explicite" | "implicite";
  
  // Moyens Légalité Externe
  moyensLegaliteExterne: {
    incompetenceAuteur: boolean;
    detailsIncompetence?: string;
    viceProcedureCapCst: boolean;
    detailsViceProcedure?: string;
    viceFormeMotivation: boolean; // Art. L. 211-2 CRPA
    detailsViceForme?: string;
  };

  // Moyens Légalité Interne
  moyensLegaliteInterne: {
    erreurDeDroit: boolean;
    detailsErreurDeDroit?: string;
    erreurManifesteAppreciation: boolean;
    detailsErreurManifeste?: string;
    detournementPouvoir: boolean;
    detailsDetournement?: string;
    disproportionSanctionOuMesure: boolean;
    detailsDisproportion?: string;
  };

  // Référé Suspension L. 521-1 CJA
  elementsRefereSuspension?: {
    justificationUrgence: string;
    impactFinancierOuSante: string;
    douteSerieuxResume: string;
  };

  conclusionsAnnulation: string;
  montantFraisIrrepetibles: number; // Art. L. 761-1 CJA, défaut 1500€
  demandeInjonctionSousAstreinte: boolean;
  delaiInjonctionJours: number; // ex: 15 ou 30 jours
}

export interface PieceTeleRecours {
  id: string;
  numero: number;
  titre: string;
  nomFichier: string;
  nomNormalise: string; // Ex: PJ1_Decision_Refus_Maire.pdf
  datePiece: string;
  nbPages: number;
  categorie: "decision" | "recours" | "echange" | "medical" | "temoignage" | "autre";
}

// ─────────────────────────────────────────────────────────────
// 1. CALCULATEUR DES VOIES ET DÉLAIS DE RECOURS (CJA & CGFP)
// ─────────────────────────────────────────────────────────────

/**
 * Calcule les dates limites et contrôle de recevabilité selon R. 421-5 et R. 421-1 du CJA.
 */
export function calculateRecevabiliteCja(
  dateNotificationStr: string,
  mentionVoiesRecours: boolean,
  dateRecoursGracieuxStr?: string
): RecevabiliteDelaiResult {
  const dateNotif = new Date(dateNotificationStr);
  const now = new Date();
  
  if (isNaN(dateNotif.getTime())) {
    return {
      dateNotification: dateNotificationStr,
      voiesEtDelaisMentionnes: mentionVoiesRecours,
      typeNotification: "explicite",
      dateLimiteInitiale: "Date invalide",
      dateLimiteProrogee: "Date invalide",
      joursRestants: 0,
      statut: "forclos",
      libelleStatut: "Date de notification non renseignée",
      explicationJuridique: "Veuillez renseigner une date de notification valide.",
      regleAppliquee: "Art. R. 421-1 du CJA"
    };
  }

  // 1. Calcul de base : +2 mois calendaires de date à date
  const dateLimiteInitiale = new Date(dateNotif);
  dateLimiteInitiale.setMonth(dateLimiteInitiale.getMonth() + 2);

  // 2. Prorogation au 1er jour ouvrable suivant si samedi, dimanche ou jour férié
  const dateProrogee = new Date(dateLimiteInitiale);
  const jourSemaine = dateProrogee.getDay(); // 0 = dimanche, 6 = samedi
  if (jourSemaine === 6) {
    dateProrogee.setDate(dateProrogee.getDate() + 2); // décalé au lundi
  } else if (jourSemaine === 0) {
    dateProrogee.setDate(dateProrogee.getDate() + 1); // décalé au lundi
  }

  // Jours restants par rapport à aujourd'hui
  const diffTime = dateProrogee.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Règle Czabaj : 1 an si absence de mention des voies et délais
  const dateLimiteCzabaj = new Date(dateNotif);
  dateLimiteCzabaj.setFullYear(dateLimiteCzabaj.getFullYear() + 1);

  // Gestion du recours gracieux éventuel
  let dateRejetImplicite: string | undefined;
  let dateLimiteContentieuseFinale: string | undefined;

  if (dateRecoursGracieuxStr) {
    const dRecours = new Date(dateRecoursGracieuxStr);
    if (!isNaN(dRecours.getTime())) {
      // Rejet implicite = date recours gracieux + 2 mois (Art. L. 231-4 CRPA)
      const dRejetImp = new Date(dRecours);
      dRejetImp.setMonth(dRejetImp.getMonth() + 2);
      dateRejetImplicite = dRejetImp.toISOString().split("T")[0];

      // Délai contentieux = date rejet implicite + 2 mois
      const dContentieuxFinal = new Date(dRejetImp);
      dContentieuxFinal.setMonth(dContentieuxFinal.getMonth() + 2);
      // Prorogation week-end
      if (dContentieuxFinal.getDay() === 6) dContentieuxFinal.setDate(dContentieuxFinal.getDate() + 2);
      if (dContentieuxFinal.getDay() === 0) dContentieuxFinal.setDate(dContentieuxFinal.getDate() + 1);
      dateLimiteContentieuseFinale = dContentieuxFinal.toISOString().split("T")[0];
    }
  }

  // Détermination du statut
  if (!mentionVoiesRecours) {
    const diffCzabaj = Math.ceil((dateLimiteCzabaj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      dateNotification: dateNotif.toISOString().split("T")[0],
      voiesEtDelaisMentionnes: false,
      typeNotification: "explicite",
      dateLimiteInitiale: dateLimiteInitiale.toISOString().split("T")[0],
      dateLimiteProrogee: dateProrogee.toISOString().split("T")[0],
      dateLimiteCzabaj: dateLimiteCzabaj.toISOString().split("T")[0],
      joursRestants: diffCzabaj,
      statut: diffCzabaj >= 0 ? "inopposable_czabaj" : "forclos",
      libelleStatut: diffCzabaj >= 0 
        ? "Délai de 2 mois inopposable (Jurisprudence Czabaj - Délai raisonnable d'1 an actif)" 
        : "Délai raisonnable d'un an dépassé (Forclusion)",
      explicationJuridique: "L'article R. 421-5 du CJA dispose que les voies et délais de recours ne sont opposables que s'ils ont été expressément mentionnés dans la notification. En l'absence de ces mentions, le délai de 2 mois ne court pas. Toutefois, la jurisprudence d'Assemblée du Conseil d'État (CE Ass. 13 juillet 2016, Czabaj, n° 387763) limite la possibilité d'agir à un délai raisonnable de 1 an à compter de la notification.",
      regleAppliquee: "Art. R. 421-5 CJA & CE Ass. 13 juillet 2016, Czabaj n° 387763",
      dateRecoursGracieux: dateRecoursGracieuxStr,
      dateRejetImplicite,
      dateLimiteContentieuseFinale
    };
  }

  if (diffDays < 0) {
    return {
      dateNotification: dateNotif.toISOString().split("T")[0],
      voiesEtDelaisMentionnes: true,
      typeNotification: "explicite",
      dateLimiteInitiale: dateLimiteInitiale.toISOString().split("T")[0],
      dateLimiteProrogee: dateProrogee.toISOString().split("T")[0],
      joursRestants: diffDays,
      statut: "forclos",
      libelleStatut: `Délai forclos depuis ${Math.abs(diffDays)} jour(s)`,
      explicationJuridique: "Le délai de recours de deux mois est expiré. Sauf circonstance exceptionnelle de force majeure ou recours gracieux déjà déposé dans les délais ayant interrompu le délai, la décision est devenue définitive.",
      regleAppliquee: "Art. R. 421-1 du CJA",
      dateRecoursGracieux: dateRecoursGracieuxStr,
      dateRejetImplicite,
      dateLimiteContentieuseFinale
    };
  }

  if (diffDays <= 15) {
    return {
      dateNotification: dateNotif.toISOString().split("T")[0],
      voiesEtDelaisMentionnes: true,
      typeNotification: "explicite",
      dateLimiteInitiale: dateLimiteInitiale.toISOString().split("T")[0],
      dateLimiteProrogee: dateProrogee.toISOString().split("T")[0],
      joursRestants: diffDays,
      statut: "urgent",
      libelleStatut: `⚠️ URGENCE : Plus que ${diffDays} jour(s) pour agir !`,
      explicationJuridique: "Le délai arrive à échéance très rapidement. Un recours gracieux doit être expédié immédiatement avec avis de réception pour préserver et interrompre le délai contentieux de deux mois (Art. L. 411-2 CRPA).",
      regleAppliquee: "Art. R. 421-1 CJA & Art. L. 411-2 CRPA",
      dateRecoursGracieux: dateRecoursGracieuxStr,
      dateRejetImplicite,
      dateLimiteContentieuseFinale
    };
  }

  return {
    dateNotification: dateNotif.toISOString().split("T")[0],
    voiesEtDelaisMentionnes: true,
    typeNotification: "explicite",
    dateLimiteInitiale: dateLimiteInitiale.toISOString().split("T")[0],
    dateLimiteProrogee: dateProrogee.toISOString().split("T")[0],
    joursRestants: diffDays,
    statut: "valide",
    libelleStatut: `Délai ouvert : ${diffDays} jours restants`,
    explicationJuridique: "Le recours est parfaitement recevable ratione temporis. Le dépôt d'un recours gracieux avant cette date interrompra ce délai et ouvrira un nouveau délai de deux mois.",
    regleAppliquee: "Art. R. 421-1 du CJA",
    dateRecoursGracieux: dateRecoursGracieuxStr,
    dateRejetImplicite,
    dateLimiteContentieuseFinale
  };
}

// ─────────────────────────────────────────────────────────────
// 2. GÉNÉRATEURS DE RECOURS PRÉCONTENTIEUX (GRACIEUX & HIÉRARCHIQUE)
// ─────────────────────────────────────────────────────────────

export function generateRecoursGracieux(data: RecoursGracieuxFormData): {
  titre: string;
  texteCourt: string;
  texteOfficiel: string;
  fondementsJuridiques: string[];
} {
  const {
    motifRefus,
    nomAgent,
    prenomAgent,
    grade,
    directionService,
    collectivite,
    autoriteSignataire,
    dateNotificationArrete,
    referenceArrete,
    motifsInvoquesParAdministration,
    argumentsAgent,
    demandeEntretien
  } = data;

  let libelleObjet = "";
  let baseLegale = "";
  let argumentationSpecifique = "";

  switch (motifRefus) {
    case "teletravail":
      libelleObjet = "Recours gracieux contre la décision de refus d'autorisation de télétravail";
      baseLegale = "Décret n° 2016-151 du 11 février 2016 relatif au télétravail dans la fonction publique (Art. 5) ; Accord-cadre du 13 juillet 2021 relatif au télétravail dans la fonction publique ; Art. L. 611-1 du CGFP.";
      argumentationSpecifique = `Il convient de rappeler que l'article 5 du décret n° 2016-151 du 11 février 2016 dispose que : « Le refus opposé à une demande d'autorisation de télétravail doit être motivé et précédé d'un entretien ». 
En l'espèce, les missions exercées par l'agent sont parfaitement télétravaillables ainsi qu'en attestent ses fiches de poste et les conditions matérielles dont il dispose à son domicile. L'administration ne caractérise aucune contrainte objective de service ni désorganisation concrète du pôle justifiant un tel refus. Un refus stéréotypé ou non étayé est entaché d'erreur manifeste d'appréciation.`;
      break;

    case "temps_partiel":
      libelleObjet = "Recours gracieux contestant la décision de refus de travail à temps partiel";
      baseLegale = "Articles L. 612-1 à L. 612-14 du Code Général de la Fonction Publique ; Décret n° 2004-777 du 29 juillet 2004.";
      argumentationSpecifique = `Aux termes de l'article L. 612-1 du CGFP, les fonctionnaires peuvent être autorisés à accomplir un service à temps partiel sous réserve des nécessités du service.
Toutefois, la jurisprudence constante du Conseil d'État impose que le refus de temps partiel soit motivé par des nécessités de service objectives, caractérisées et non compensables par une réorganisation interne. En l'espèce, les motifs succincts avancés par la collectivité ne sauraient légalement fonder une telle décision privative.`;
      break;

    case "rupture_conventionnelle":
      libelleObjet = "Recours gracieux contestant le refus de rupture conventionnelle";
      baseLegale = "Décret n° 2019-1593 du 31 décembre 2019 relatif à la procédure de rupture conventionnelle dans la fonction publique ; Articles L. 552-1 et L. 552-2 du CGFP.";
      argumentationSpecifique = `Bien que la rupture conventionnelle procède d'un accord mutuel, le refus opposé à l'agent ne saurait être justifié par des considérations étrangères au service ou empreint d'arbitraire. 
L'agent a formalisé un projet professionnel structuré et cohérent. Le refus opposé sans ouverture d'une phase de concertation équitable méconnaît l'esprit du décret n° 2019-1593.`;
      break;

    case "disponibilite":
      libelleObjet = "Recours gracieux contre le refus de mise en disponibilité";
      baseLegale = "Articles L. 514-1 et suivants du Code Général de la Fonction Publique ; Décret n° 86-68 du 13 janvier 1986.";
      argumentationSpecifique = `En matière de disponibilité pour convenances personnelles, le Conseil d'État rappelle qu'un refus ne peut légalement intervenir que pour des nécessités de service impérieuses et avérées tenant à la continuité du service public. 
L'administration disposait d'un délai suffisant de préavis pour pourvoir au remplacement temporaire de l'agent. Le motif tiré d'une tension d'effectifs globale et non individualisée est illégal.`;
      break;

    case "crep":
      libelleObjet = "Recours hiérarchique et gracieux préalable contestant le Compte-Rendu d'Entretien Professionnel (CREP)";
      baseLegale = "Décret n° 2014-1526 du 16 décembre 2014 relatif à l'appréciation de la valeur professionnelle des fonctionnaires territoriaux (Art. 6 et 7) ; Art. L. 521-1 du CGFP.";
      argumentationSpecifique = `Conformément à l'article 7 du décret n° 2014-1526 du 16 décembre 2014, l'agent dispose d'un recours hiérarchique préalable obligatoire dans un délai de 15 jours francs suivant la notification du CREP.
En l'espèce, le compte-rendu querellé est entaché de plusieurs illégalités :
1. Discordance manifeste entre les appréciations littérales favorables et les coches/notations chiffrées dépréciées ;
2. Fixation d'objectifs sans concertation réelle lors de l'entretien ;
3. Griefs portant sur des faits extérieurs à la période d'évaluation annuelle de référence ;
4. Évaluation partiale constitutive d'un détournement de pouvoir.`;
      break;
  }

  const texteOfficiel = `${prenomAgent} ${nomAgent}
Grade : ${grade}
Service : ${directionService}
Collectivité : ${collectivite}

À l'attention de :
${autoriteSignataire}
Hôtel de Ville / Direction des Ressources Humaines
${collectivite}

Fait à ${collectivite}, le ${new Date().toLocaleDateString("fr-FR")}

LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION (LRAR)
OU REMISE EN MAIN PROPRE CONTRE DÉCHARGE

OBJET : ${libelleObjet}
RÉFÉRENCE DÉCISION : ${referenceArrete || "Décision de refus notifiée le " + dateNotificationArrete}
FONDEMENT LÉGAL : ${baseLegale}

${autoriteSignataire},

Par décision visée en référence en date du ${dateNotificationArrete}, vous m'avez notifié le refus opposé à ma demande concernant : ${libelleObjet.toLowerCase()}.

Par la présente, agissant dans le délai légal de recours prescrit par le Code de justice administrative et le Code des relations entre le public et l'administration, j'ai l'honneur de former auprès de votre haute autorité un RECOURS GRACIEUX tendant au réexamen bienveillant et au retrait de cette décision de refus.

I. RAPPEL DES FAITS ET DU CONTEXTE PROFESSIONNEL
${nomAgent} ${prenomAgent} exerce ses fonctions en qualité de ${grade} au sein de la direction/service « ${directionService} » de la collectivité ${collectivite}.
Depuis sa prise de fonctions, l'agent a constamment fait preuve d'un dévouement exemplaire, de rigueur et d'une manière de servir irréprochable au service des usagers et de l'intérêt général.

La décision contestée a motivé son refus par les éléments suivants :
« ${motifsInvoquesParAdministration || "Nécessités de service non précisées"} ».

II. DISCUSSION JURIDIQUE ET DÉMONSTRATION DU BIEN-FONDÉ DU RECOURS
${argumentationSpecifique}

Par ailleurs, l'agent fait valoir les éléments de fait et de droit suivants :
${argumentsAgent || "L'agent sollicite une prise en compte objective de ses impératifs professionnels et de son investissement quotidien."}

III. CONCLUSIONS ET DEMANDES
Au vu des moyens de droit et de fait susvisés, et dans un esprit de dialogue social et d'équité, je vous demande respectueusement de bien vouloir :

1. RAPPORTER ET RETIRER la décision de refus en date du ${dateNotificationArrete} portant refus de ma demande ;
2. ACCORDER l'autorisation sollicitée, le cas échéant selon des modalités concertées ;
${demandeEntretien ? "3. M'ACCORDER UN ENTRETIEN personnel, assisté(e) si je le souhaite d'un représentant syndical de la CFDT, afin de trouver une issue favorable et concertée à cette situation." : ""}

Il est rappelé que, conformément à l'article L. 411-2 du Code des relations entre le public et l'administration, le présent recours gracieux interrompt le délai de recours contentieux de deux mois prévu à l'article R. 421-1 du Code de justice administrative. 

Dans l'attente d'une réponse de votre part, que j'espère favorable, je vous prie d'agréer, ${autoriteSignataire}, l'expression de ma considération distinguée.


Signature :

${prenomAgent} ${nomAgent}
Copie transmise pour suivi : Section Syndicale CFDT Territoriaux`;

  return {
    titre: libelleObjet,
    texteCourt: `Recours gracieux officiel formé contre le refus de ${motifRefus} auprès de ${autoriteSignataire}.`,
    texteOfficiel,
    fondementsJuridiques: baseLegale.split(";")
  };
}

// ─────────────────────────────────────────────────────────────
// 3. GÉNÉRATEUR DE DEMANDE DE PROTECTION FONCTIONNELLE (L. 134-1 CGFP)
// ─────────────────────────────────────────────────────────────

export function generateDemandeProtectionFonctionnelle(data: ProtectionFonctionnelleFormData): {
  titre: string;
  texteOfficiel: string;
  miseEnDemeureDate: string;
  fondementsJuridiques: string[];
} {
  const {
    nomAgent,
    prenomAgent,
    grade,
    service,
    collectivite,
    autoriteDestinataire,
    typeAtteinte,
    chronologieFaits,
    temoinsIdentifies,
    depotPlainteOuMainCourante,
    referencePlainte,
    arretTravailOuItt,
    dureeItt,
    mesuresUrgenceDemandeess,
    detailsPrejudice
  } = data;

  const dNow = new Date();
  const dLimite2Mois = new Date(dNow);
  dLimite2Mois.setMonth(dLimite2Mois.getMonth() + 2);
  const miseEnDemeureDate = dLimite2Mois.toLocaleDateString("fr-FR");

  let qualificationAtteinte = "";
  switch (typeAtteinte) {
    case "agression_physique":
      qualificationAtteinte = "Violences physiques volontaires subies à l'occasion de l'exercice des fonctions (Art. L. 134-5 CGFP)";
      break;
    case "menaces_intimidations":
      qualificationAtteinte = "Menaces verbales, intimidations graves et pressions exercées contre un agent public (Art. L. 134-5 CGFP)";
      break;
    case "diffamation_injures":
      qualificationAtteinte = "Diffamation, outrages et injures publiques envers un dépositaire de l'autorité publique ou agent territorial (Art. L. 134-5 CGFP)";
      break;
    case "harcelement_moral":
      qualificationAtteinte = "Agissements répétés constitutifs de harcèlement moral au travail (Articles L. 133-2 et L. 134-5 du CGFP)";
      break;
    case "harcelement_sexuel":
      qualificationAtteinte = "Agissements constitutifs de harcèlement sexuel ou sexiste (Articles L. 133-1 et L. 134-5 du CGFP)";
      break;
    default:
      qualificationAtteinte = "Outrages et attaques dirigées contre un agent public (Art. L. 134-5 CGFP)";
  }

  const texteOfficiel = `${prenomAgent} ${nomAgent}
Grade : ${grade}
Direction / Pôle : ${service}
Collectivité : ${collectivite}

À l'attention de :
${autoriteDestinataire}
Mairie / Présidence de ${collectivite}
Direction des Ressources Humaines & Pôle Juridique

Fait à ${collectivite}, le ${dNow.toLocaleDateString("fr-FR")}

LETTRE RECOMMANDÉE AVEC DEMANDE D'AVIS DE RÉCEPTION (LRAR)
OU REMISE CONTRE DÉCHARGE RÉCÉPISSÉE

OBJET : Demande formelle d'octroi de la PROTECTION FONCTIONNELLE au titre des articles L. 134-1 à L. 134-12 du Code Général de la Fonction Publique
QUALIFICATION DES FAITS : ${qualificationAtteinte}
DATE LIMITE DE STATUER (RÈGLE DES 2 MOIS) : ${miseEnDemeureDate}

${autoriteDestinataire},

J'ai l'honneur, par la présente, de solliciter formellement de votre autorité le bénéfice de la PROTECTION FONCTIONNELLE prévue par les dispositions de l'article L. 134-1 et suivants du Code Général de la Fonction Publique.

I. CADRE JURIDIQUE STRICT
L'article L. 134-1 du CGFP énonce sans ambiguïté :
« La collectivité publique est tenue de protéger le fonctionnaire ou l'ancien fonctionnaire contre les atteintes volontaires à l'intégrité de la personne, les violences, les agissements de harcèlement moral ou sexuel, les menaces, les injures, les diffamations ou les outrages dont il pourrait être victime sans qu'une faute personnelle détachable de l'exercice de ses fonctions puisse lui être imputée. »

L'article L. 134-5 du même code dispose que la collectivité est tenue d'accorder sa protection dans les conditions fixées et de réparer, le cas échéant, le préjudice qui en est résulté. 

La jurisprudence constante du Conseil d'État confirme que l'octroi de cette protection constitue une OBLIGATION STRICTE pour la collectivité dès lors que les attaques sont subies à l'occasion des fonctions et qu'aucune faute personnelle n'est commise par l'agent victime.

II. EXPOSÉ CIRCONSTANCIÉ ET CHRONOLOGIQUE DES FAITS
Dans le cadre de mes fonctions de ${grade} au sein de ${collectivite}, j'ai été directement victime des agissements suivants :

${chronologieFaits || "Préciser les dates, heures, lieux et déroulé précis des faits."}

Témoins identifiés des faits :
${temoinsIdentifies || "Collègues de service présents sur les lieux et usagers identifiés."}

Démarches judiciaires et médicales accomplies :
${depotPlainteOuMainCourante ? `• Dépôt officiel de plainte pénale / main courante : ${referencePlainte || "Plainte déposée auprès du Commissariat de Police / Gendarmerie"}` : "• Dépôt de plainte en cours de formalisation."}
${arretTravailOuItt ? `• Constat médical légal / Interruption Totale de Travail (ITT) : ${dureeItt || "Certificat médical d'ITT délivré par l'unité médico-judiciaire"}` : ""}

Préjudices subis par l'agent :
${detailsPrejudice || "Atteinte grave à la dignité, à l'intégrité physique et psychologique, anxiété réactionnelle et perturbations de l'exercice des missions."}

III. MESURES DE PROTECTION FORMELLEMENT SOLLICITÉES
Au titre de l'obligation légale de protection pesant sur la collectivité, je vous demande expressément de diligenter sans délai les mesures suivantes :

${mesuresUrgenceDemandeess.priseEnChargeFraisAvocat ? "1. PRISE EN CHARGE INTÉGRALE des frais de justice, d'avocat et d'expertise (convention d'honoraires directe avec le conseil choisi par l'agent) pour la défense de mes intérêts devant les juridictions répressives ou civiles (Art. L. 134-6 CGFP) ;" : ""}
${mesuresUrgenceDemandeess.changementAffectationConservatoire ? "2. ADOPTION DE MESURES CONSERVATOIRES DE SÉCURITÉ immédiates visant à assurer mon intégrité physique et psychologique sur mon lieu de travail (éloignement ou sécurisation du poste) ;" : ""}
${mesuresUrgenceDemandeess.signalementArt40Cpp ? "3. SIGNALEMENT OFFICIEL PAR LA COLLECTIVITÉ auprès de Monsieur le Procureur de la République près le Tribunal Judiciaire compétent, en application de l'article 40, alinéa 2, du Code de procédure pénale ;" : ""}
${mesuresUrgenceDemandeess.soutienPsychologique ? "4. MISE EN PLACE d'un accompagnement médical et psychologique d'urgence via la médecine du travail et le service de prévention de la collectivité." : ""}

IV. RAPPEL DES VOIES DE RECOURS ET MISE EN DEMEURE
Je vous saurais gré de bien vouloir accuser réception de la présente demande et de me notifier votre décision dans le délai légal de DEUX MOIS imparti par les dispositions du Code des relations entre le public et l'administration (date limite : ${miseEnDemeureDate}).

À défaut de décision explicite d'accord dans ce délai de deux mois, un refus implicite naîtra du silence gardé par l'administration (Art. L. 231-4 CRPA), qui ouvrira immédiatement un délai de deux mois pour saisir le Tribunal Administratif territorialement compétent d'un Recours pour Excès de Pouvoir (REP) assorti d'un Référé-Suspension (Art. L. 521-1 CJA) ou d'un Référé-Liberté (Art. L. 521-2 CJA) aux fins d'injonction sous astreinte.

Comptant sur votre sens des responsabilités et sur le respect des droits statutaires fondamentaux des agents publics, je vous prie de croire, ${autoriteDestinataire}, en l'assurance de mon profond dévouement au service public.


Signature de l'agent :

${prenomAgent} ${nomAgent}
Pièces jointes justificatives annexées :
- Copie de la plainte / récépissé de dépôt de plainte
- Certificats médicaux / arrêts de travail
- Attestations de témoins`;

  return {
    titre: "Demande de Protection Fonctionnelle (Art. L. 134-1 CGFP)",
    texteOfficiel,
    miseEnDemeureDate,
    fondementsJuridiques: [
      "Articles L. 134-1 à L. 134-12 du Code Général de la Fonction Publique",
      "Article 40 alinéa 2 du Code de Procédure Pénale",
      "Article L. 231-4 du Code des relations entre le public et l'administration"
    ]
  };
}

// ─────────────────────────────────────────────────────────────
// 4. GÉNÉRATEUR DE SAISINE DES INSTANCES PARITAIRES (CAP, CCP, F3SCT / CST)
// ─────────────────────────────────────────────────────────────

export function generateSaisineInstanceParitaire(data: SaisineInstanceFormData): SaisineInstanceResult {
  const {
    instance,
    nomAgent,
    prenomAgent,
    matricule,
    statutAgent,
    grade,
    directionService,
    collectivite,
    cigRattachement,
    destinataireInstance,
    motifCap,
    motifCcp,
    motifF3sct,
    dateNotificationDecision,
    dateRecoursPrealable,
    dateDecisionRecoursPrealable,
    dateIncidentDanger,
    lieuIncidentDanger,
    faitsEtContexte,
    motifsInvoquesAdministration,
    argumentsAgent,
    demandesAgent,
    assistanceSyndicale,
    nomRepresentantSyndical,
    piecesJointes
  } = data;

  const dateAujourdhui = new Date().toLocaleDateString("fr-FR");
  let titre = "";
  let sousTitre = "";
  let texteOfficiel = "";
  let delaisEtProcedure = {
    delaiLegal: "",
    autoriteCompetente: "",
    effetJuridique: "",
    avertissement: ""
  };
  let fondementsJuridiques: string[] = [];
  let piecesRequises: string[] = [];

  // ==========================================
  // 1. CAP : COMMISSION ADMINISTRATIVE PARITAIRE
  // ==========================================
  if (instance === "cap") {
    const autoriteCible = destinataireInstance || `Monsieur / Madame le Président de la Commission Administrative Paritaire compétente (${cigRattachement || collectivite})`;

    if (motifCap === "crep") {
      titre = "Saisine de la Commission Administrative Paritaire (CAP) en révision du CREP";
      sousTitre = "Recours de l'agent en contestation de son Compte-Rendu d'Entretien Professionnel annuel (Art. L. 543-1 CGFP & Décret 2014-1526)";
      delaisEtProcedure = {
        delaiLegal: "1 mois calendaire à compter de la notification de la réponse au recours hiérarchique préalable (ou au terme des 2 mois valant rejet implicite).",
        autoriteCompetente: autoriteCible,
        effetJuridique: "La CAP émet un avis motivé proposant la révision du CREP. L'autorité territoriale communique à l'agent un compte-rendu définitif.",
        avertissement: "ATTENTION : Le recours hiérarchique préalable auprès de l'autorité territoriale dans les 15 jours francs suivant la notification initiale du CREP est une condition obligatoire de recevabilité !"
      };
      fondementsJuridiques = [
        "Article L. 543-1 du Code Général de la Fonction Publique (CGFP)",
        "Décret n° 2014-1526 du 16 décembre 2014 relatif à l'appréciation de la valeur professionnelle des fonctionnaires territoriaux (Articles 6 et 7)",
        "Décret n° 89-229 du 17 avril 1989 relatif aux commissions administratives paritaires de la FPT"
      ];
      piecesRequises = [
        "Copie intégrale du Compte-Rendu d'Entretien Professionnel (CREP) contesté revêtu des signatures",
        "Copie du recours hiérarchique préalable obligatoire adressé à l'autorité territoriale et accusé de réception",
        "Copie de la réponse de l'autorité territoriale ou justificatif de l'expiration du délai de rejet implicite",
        "Fiche de poste officielle de référence",
        "Éléments probants (rapports d'activité, bilans chiffrés, courriels de félicitations ou attestations)"
      ];

      texteOfficiel = `DOSSIER DE SAISINE DE LA COMMISSION ADMINISTRATIVE PARITAIRE (CAP)
RECOURS EN RÉVISION DU COMPTE-RENDU D'ÉVALUATION PROFESSIONNELLE (CREP)
En application de l'article L. 543-1 du CGFP et de l'article 7 du décret n° 2014-1526 du 16 décembre 2014

À l'attention de :
${autoriteCible}
Secrétariat de la Commission Administrative Paritaire

AGENT REQUÉRANT(E) :
Nom et prénom : ${prenomAgent} ${nomAgent}
Matricule : ${matricule || "Non renseigné"}
Qualité : Fonctionnaire titulaire
Grade : ${grade}
Direction / Service : ${directionService}
Collectivité employeur : ${collectivite}
Rattachement paritaire : ${cigRattachement}
Assistance syndicale souhaitée : ${assistanceSyndicale ? `OUI (défense assurée par ${nomRepresentantSyndical || "la délégation CFDT Territoriaux"})` : "NON"}

Fait à ${collectivite}, le ${dateAujourdhui}

OBJET : Saisine de la CAP compétente en révision du Compte-Rendu d'Entretien Professionnel (CREP)
RÉFÉRENCES :
- Date de notification du CREP initial contesté : ${dateNotificationDecision}
- Date du recours hiérarchique préalable obligatoire : ${dateRecoursPrealable || "Dans les 15 jours francs légaux"}
- Date de la décision de rejet (explicite ou implicite) : ${dateDecisionRecoursPrealable || "Notification reçue / Rejet implicite intervenu"}

Monsieur / Madame le Président de la Commission, Mesdames et Messieurs les Membres de la CAP,

J'ai l'honneur de saisir la Commission Administrative Paritaire compétente, en application des dispositions combinées de l'article L. 543-1 du Code Général de la Fonction Publique et de l'article 7 du décret n° 2014-1526 du 16 décembre 2014, afin de solliciter la révision de mon compte-rendu d'entretien professionnel au titre de la dernière campagne d'évaluation.

I. RECEVABILITÉ RATIONE TEMPORIS DU RECOURS DEVANT LA CAP
1. L'entretien professionnel s'est tenu et le compte-rendu m'a été notifié en date du ${dateNotificationDecision}.
2. Conformément à l'article 7 du décret n° 2014-1526, j'ai formé un recours hiérarchique préalable obligatoire auprès de l'autorité territoriale en date du ${dateRecoursPrealable || "[date du recours]"}.
3. L'autorité territoriale a rejeté ma demande en date du ${dateDecisionRecoursPrealable || "[date de rejet ou expiration du délai de 2 mois]"}.
4. La présente saisine de la CAP intervient ainsi dans le délai légal d'un mois fixé par les textes réglementaires. Elle est donc parfaitement recevable.

II. EXPOSÉ DES MOTIFS ET DISCUSSION TECHNIQUE
La révision sollicitée se fonde sur les vices et incohérences manifestes affectant l'évaluation :

1. Rappel des faits et de la manière de servir :
${faitsEtContexte || "L'agent effectue ses missions avec une constante conscience professionnelle. Aucun manquement n'a été constaté ni formalisé au cours de l'année."}

2. Motifs ou appréciations contestées :
${motifsInvoquesAdministration || "Le compte-rendu comporte des appréciations dépréciatives infondées ou des coches en régression sans justification objective."}

3. Arguments démontrant l'incohérence et l'illégalité des appréciations :
${argumentsAgent || "Discordance manifeste entre les appréciations littérales et les niveaux d'évaluation retenus. Imputation de griefs étrangers à la fiche de poste ou non abordés lors de l'entretien. Fixation d'objectifs inadaptés ou rétroactifs."}

III. CONCLUSIONS ET DEMANDES FORMÉES AUPRÈS DE LA CAP
Au vu de l'ensemble de ces éléments et des pièces probantes jointes au présent dossier, je sollicite respectueusement de la Commission Administrative Paritaire qu'elle émette :

1. UN AVIS FAVORABLE à la révision de mon Compte-Rendu d'Entretien Professionnel ;
2. UNE PROPOSITION à l'attention de l'autorité territoriale tendant à :
   - ${demandesAgent || "Rectifier les coches relatives aux compétences professionnelles et réécrire les appréciations littérales du supérieur hiérarchique direct conformément à la réalité de la manière de servir."}
3. L'autorisation d'être entendu(e) par la commission, assisté(e) de mon représentant syndical désigné.

Je vous remercie de bien vouloir inscrire l'examen de ma situation à l'ordre du jour de la prochaine séance de la CAP et de m'en notifier la date.

Signature :

${prenomAgent} ${nomAgent}

Pièces jointes annexées :
${piecesJointes.map((p, i) => `${i + 1}. ${p}`).join("\n") || "- CREP contesté\n- Recours hiérarchique préalable\n- Réponse de l'autorité / avis de réception"}`;
    } else if (motifCap === "refus_formation") {
      titre = "Saisine de la CAP suite à un refus réitéré de formation professionnelle";
      sousTitre = "Recours de l'agent en contestation de refus de formation / mobilisation CPF (Art. L. 422-1 et s. CGFP & Décret 2007-1845)";
      delaisEtProcedure = {
        delaiLegal: "Saisine possible dès notification du 2ème refus consécutif opposé à l'agent.",
        autoriteCompetente: autoriteCible,
        effetJuridique: "Avis obligatoire de la CAP avant que l'autorité ne puisse légalement opposer un second refus consécutif.",
        avertissement: "Le refus opposé à une action de formation de perfectionnement ou à une préparation aux concours après un 1er refus impose la saisine obligatoire de la CAP !"
      };
      fondementsJuridiques = [
        "Articles L. 421-1, L. 422-1 et suivants du Code Général de la Fonction Publique",
        "Décret n° 2007-1845 du 26 décembre 2007 relatif à la formation professionnelle tout au long de la vie des agents territoriaux (Articles 7, 10, 14, 25)",
        "Décret n° 89-229 du 17 avril 1989 relatif aux CAP territoriales"
      ];
      piecesRequises = [
        "Copie de la première demande de formation et de la décision de refus",
        "Copie de la seconde demande de formation et de la décision de refus",
        "Projet d'évolution professionnelle ou de préparation de concours/examen pro",
        "Fiche de poste et avis éventuel du CNFPT"
      ];

      texteOfficiel = `DOSSIER DE SAISINE DE LA COMMISSION ADMINISTRATIVE PARITAIRE (CAP)
CONTESTATION DE REFUS RÉITÉRÉ DE FORMATION PROFESSIONNELLE OU DE COMPTE PERSONNEL DE FORMATION (CPF)
Articles L. 422-1 et s. du CGFP & Décret n° 2007-1845 du 26 décembre 2007

À l'attention de :
${autoriteCible}
Secrétariat de la Commission Administrative Paritaire

AGENT REQUÉRANT(E) :
Nom et prénom : ${prenomAgent} ${nomAgent}
Matricule : ${matricule || "Non renseigné"}
Grade : ${grade}
Direction / Service : ${directionService}
Collectivité employeur : ${collectivite}
Assistance syndicale : ${assistanceSyndicale ? `Assistance demandée par ${nomRepresentantSyndical || "la CFDT Territoriaux"}` : "Sans assistance"}

Fait à ${collectivite}, le ${dateAujourdhui}

OBJET : Saisine de la CAP - Recours contre le refus répété de départ en formation professionnelle
DÉCISION CONTESTÉE : Décision de refus notifiée le ${dateNotificationDecision} (faisant suite à un précédent refus)

Monsieur / Madame le Président, Mesdames et Messieurs les Membres de la CAP,

J'ai l'honneur de saisir la Commission Administrative Paritaire en raison du refus réitéré opposé par l'autorité territoriale à mes demandes de formation professionnelle.

I. RAPPEL DU DROIT STATUTAIRE À LA FORMATION
Aux termes de l'article L. 421-1 du CGFP, les fonctionnaires ont droit à la formation professionnelle tout au long de leur carrière.
En outre, l'article 7 du décret n° 2007-1845 prévoit que le rejet d'une deuxième demande consécutive pour une formation de perfectionnement ou de préparation aux examens professionnels ne peut intervenir sans consultation préalable de la CAP.

II. EXPOSÉ DE LA SITUATION
1. Historique des demandes formulées :
${faitsEtContexte || "L'agent a sollicité une inscription à une formation indispensable à sa progression de carrière et à l'exercice de ses missions."}

2. Motifs opposés par la collectivité :
« ${motifsInvoquesAdministration || "Nécessités de service non circonstanciées ou quota dépassé."} »

3. Moyens démontrant l'infondé du refus :
${argumentsAgent || "L'absence de l'agent ne cause aucune désorganisation insurmontable du service. La session demandée est essentielle à l'adaptation aux nouvelles compétences requises par le poste."}

III. CONCLUSIONS
Le requérant sollicite qu'il plaise à la Commission Administrative Paritaire :
1. ÉMETTRE UN AVIS DÉFAVORABLE au maintien du refus opposé par l'autorité territoriale ;
2. RECOMMANDER l'autorisation de départ en formation ou la mobilisation des droits acquis au titre du CPF pour la session sollicitée ;
3. ${demandesAgent || "Demander à la collectivité d'inscrire prioritairement l'agent à la prochaine session CNFPT."}

Signature :

${prenomAgent} ${nomAgent}`;
    } else {
      titre = `Saisine de la CAP (${motifCap === "licenciement_insuffisance" ? "Défense insuffisance professionnelle" : "Contestation refus statutaire"})`;
      sousTitre = "Saisine de la Commission Administrative Paritaire de la Fonction Publique Territoriale";
      delaisEtProcedure = {
        delaiLegal: "Délai statutaire (généralement 1 à 2 mois selon la décision notifiée).",
        autoriteCompetente: autoriteCible,
        effetJuridique: "Avis obligatoire communiqué à l'autorité territoriale avant décision exécutoire.",
        avertissement: "L'avis de la CAP constitue une garantie substantielle pour l'agent (CE Danthony)."
      };
      fondementsJuridiques = [
        "Code Général de la Fonction Publique (Articles L. 261-1 et suivants)",
        "Décret n° 89-229 du 17 avril 1989 relatif aux CAP territoriales"
      ];
      piecesRequises = ["Décision contestée", "Dossier individuel de l'agent", "Observations écrites"];

      texteOfficiel = `DOSSIER DE SAISINE DE LA COMMISSION ADMINISTRATIVE PARITAIRE (CAP)
AGENT : ${prenomAgent} ${nomAgent} - Grade : ${grade}
Collectivité : ${collectivite} - CIG : ${cigRattachement}
Date : ${dateAujourdhui}

OBJET : Saisine de la CAP compétente relative à la situation statutaire de l'agent
DÉCISION DU : ${dateNotificationDecision}

Monsieur / Madame le Président, Mesdames et Messieurs les Membres de la CAP,

${faitsEtContexte}

Motifs de contestation :
${argumentsAgent}

Demandes à la CAP :
${demandesAgent}

Signature :
${prenomAgent} ${nomAgent}`;
    }
  }

  // ==========================================
  // 2. CCP : COMMISSION CONSULTATIVE PARITAIRE (CONTRACTUELS)
  // ==========================================
  else if (instance === "ccp") {
    const autoriteCible = destinataireInstance || `Monsieur / Madame le Président de la Commission Consultative Paritaire (${cigRattachement || collectivite})`;

    let libelleCcp = "";
    if (motifCcp === "licenciement_contractuel_insuffisance") libelleCcp = "Licenciement pour insuffisance professionnelle";
    else if (motifCcp === "licenciement_contractuel_suppression") libelleCcp = "Licenciement pour suppression d'emploi et manquement à l'obligation de reclassement";
    else if (motifCcp === "licenciement_contractuel_inaptitude") libelleCcp = "Licenciement pour inaptitude physique après refus/absence de reclassement";
    else if (motifCcp === "licenciement_contractuel_disciplinaire") libelleCcp = "Licenciement pour motif disciplinaire";
    else if (motifCcp === "recours_crep_contractuel") libelleCcp = "Contestation de l'évaluation professionnelle du contractuel";
    else libelleCcp = "Contestation de non-renouvellement de contrat";

    titre = `Mémoire d'observations et Saisine de la CCP - ${libelleCcp}`;
    sousTitre = "Défense de l'agent contractuel de droit public territorial (Décret n° 88-145 du 15 février 1988 & CGFP)";
    delaisEtProcedure = {
      delaiLegal: "Consultation obligatoire de la CCP préalablement à la notification du licenciement (Art. 39-1 décret 88-145). Droit de consultation du dossier et production d'observations écrites.",
      autoriteCompetente: autoriteCible,
      effetJuridique: "Avis obligatoire de la CCP. L'absence de consultation ou la méconnaissance des droits de la défense vicie substantiellement la décision de licenciement.",
      avertissement: "OBLIGATION LÉGALE : En cas de suppression de poste ou inaptitude, l'employeur DOIT justifier par écrit de l'impossibilité de reclasser l'agent (Art. 39-3 décret 88-145) !"
    };
    fondementsJuridiques = [
      "Article L. 262-1 et L. 553-1 du Code Général de la Fonction Publique",
      "Décret n° 88-145 du 15 février 1988 relatif aux agents contractuels territoriaux (Articles 39-1 à 39-5, 40 et 42)",
      "Décret n° 2016-1858 du 23 décembre 2016 relatif aux commissions consultatives paritaires de la FPT",
      "Article L. 532-4 du CGFP (Droit à la communication intégrale du dossier individuel)",
      "Jurisprudence CE, 25 septembre 2013, n° 358487 (Garanties de reclassement du contractuel)"
    ];
    piecesRequises = [
      "Copie du contrat de travail en cours et des avenants successifs",
      "Lettre de convocation à l'entretien préalable de licenciement",
      "Compte-rendu de l'entretien préalable et courrier de saisine de la CCP par l'employeur",
      "Rapport d'insuffisance professionnelle ou délibération portant suppression du poste",
      "Historique des évaluations professionnelles (CREP) et justificatifs de formations",
      "Preuve de l'absence d'offres loyales de reclassement (le cas échéant)"
    ];

    texteOfficiel = `MÉMOIRE D'OBSERVATIONS EN DÉFENSE DEVANT LA COMMISSION CONSULTATIVE PARITAIRE (CCP)
INSTANCE PRÉALABLE AU PROJET DE LICENCIEMENT D'UN AGENT CONTRACTUEL
Articles 39-1 et suivants du décret n° 88-145 du 15 février 1988 & Article L. 262-1 du CGFP

À l'attention de :
${autoriteCible}
Secrétariat de la CCP

AGENT CONCERNÉ(E) :
Nom et prénom : ${prenomAgent} ${nomAgent}
Statut : Agent contractuel de droit public territorial (${statutAgent === "contractuel_cdi" ? "CDI" : "CDD"})
Emploi / Grade d'assimilation : ${grade}
Direction et affectation : ${directionService}
Collectivité employeur : ${collectivite}
Rattachement CCP : ${cigRattachement}
Défense assurée avec l'assistance de : ${assistanceSyndicale ? (nomRepresentantSyndical || "la délégation syndicale CFDT Territoriaux") : "Personnellement"}

Fait à ${collectivite}, le ${dateAujourdhui}

OBJET : Mémoire en défense et observations présentées à la CCP concernant le projet de : ${libelleCcp}
DATE DE CONVOCATION / NOTIFICATION : ${dateNotificationDecision}

Monsieur / Madame le Président de la CCP, Mesdames et Messieurs les Représentants,

L'autorité territoriale envisage de prononcer à l'encontre de ${prenomAgent} ${nomAgent} une mesure de licenciement pour : ${libelleCcp}.
En application de l'article 39-1 du décret n° 88-145 du 15 février 1988, la présente instance a été saisie pour avis. 
Par le présent mémoire, l'agent entend faire valoir ses observations et démontrer l'infondé et l'irrégularité du projet de licenciement.

I. RAPPEL DU PARCOURS ET DU CONTEXTE PROFESSIONNEL
${prenomAgent} ${nomAgent} est employé(e) au sein de la collectivité ${collectivite} depuis plusieurs années en qualité de contractuel(le).
Au cours de son engagement contractuel, l'agent a constamment apporté sa force de travail et son professionnalisme à la réalisation des missions du service public.
${faitsEtContexte || "L'agent n'a jamais fait l'objet de sanctions disciplinaires ni d'alertes formelles préalables sur sa manière de servir."}

II. RÉFUTATION DES MOTIFS ALLÉGUÉS PAR LA COLLECTIVITÉ
L'autorité territoriale prétend justifier la rupture de contrat par les éléments suivants :
« ${motifsInvoquesAdministration || "Insuffisance professionnelle alléguée ou suppression de poste sans proposition de réaffectation."} »

Or, ces griefs ne résistent pas à une analyse factuelle et juridique rigoureuse :
${argumentsAgent || `1. Absence de caractérisation d'une insuffisance professionnelle : la collectivité n'établit aucune carence imputable à l'agent mais une surcharge structurelle de travail non compensée.
2. Manquement absolu à l'obligation de formation et d'accompagnement.
3. Absence totale de recherche de reclassement loyal et sérieux en violation de l'article 39-3 du décret 88-145.`}

${motifCcp === "licenciement_contractuel_suppression" || motifCcp === "licenciement_contractuel_inaptitude" ? `III. SUR LA VIOLATION CARACTÉRISÉE DE L'OBLIGATION LÉGALE DE RECLASSEMENT (ART. 39-3 ET 39-4 DÉCRET 88-145)
Il est de jurisprudence constante (CE 25 septembre 2013, n° 358487) que l'autorité territoriale ne peut licencier un contractuel pour suppression de poste ou inaptitude sans avoir préalablement cherché à le reclasser sur un autre emploi équivalent. 
En l'espèce, aucune proposition formelle, précise et écrite d'emploi de reclassement n'a été formulée à l'agent avant l'engagement de la présente procédure.` : ""}

IV. CONCLUSIONS ET DEMANDES SOUMISES À LA CCP
Au vu de l'ensemble des éléments de fait et de droit exposés ci-dessus, ${prenomAgent} ${nomAgent} sollicite qu'il plaise à la Commission Consultative Paritaire :

1. ÉMETTRE UN AVIS DÉFAVORABLE au projet de licenciement soumis par la collectivité ${collectivite} ;
2. RECOMMANDER À L'AUTORITÉ TERRITORIALE :
   - ${demandesAgent || "Le maintien de l'agent dans ses fonctions ou son affectation sur un poste adapté, assorti d'un plan d'accompagnement professionnel."}
3. ENJOINDRE à la collectivité, à titre subsidiaire, de mettre en œuvre sans délai une recherche active et formalisée de postes de reclassement.

Signature :

${prenomAgent} ${nomAgent}
Assistance syndicale : ${nomRepresentantSyndical || "Section CFDT Territoriaux"}

Pièces jointes annexées :
${piecesJointes.map((p, i) => `${i + 1}. ${p}`).join("\n") || "- Contrat de travail initial et avenants\n- Fiche d'évaluation\n- Courrier de convocation de l'autorité"}`;
  }

  // ==========================================
  // 3. F3SCT / CST : FORMATION SPÉCIALISÉE EN SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL
  // ==========================================
  else {
    const autoriteCible = destinataireInstance || `Monsieur le Président de la F3SCT / CST et aux Représentants du Personnel (${collectivite})`;

    let libelleF3sct = "";
    if (motifF3sct === "danger_grave_imminent") libelleF3sct = "Signalement de Danger Grave et Imminent (DGI) - Inscription au Registre Spécial";
    else if (motifF3sct === "droit_alerte_retrait") libelleF3sct = "Droit d'alerte et constat d'exercice légitime du Droit de Retrait";
    else if (motifF3sct === "souffrance_travail_rps") libelleF3sct = "Alerte pour Risques Psychosociaux (RPS), harcèlement et souffrance au travail";
    else libelleF3sct = "Insalubrité, risque amiante / toxique et demande de visite d'inspection des locaux";

    titre = `Saisine F3SCT / CST - ${libelleF3sct}`;
    sousTitre = "Procédure d'Alerte Santé, Sécurité & Enquête Conjointe F3SCT (Décret n° 85-603 du 10 juin 1985 & Décret 2021-571)";
    delaisEtProcedure = {
      delaiLegal: "URGENCE ABSOLUE : Inscription immédiate au registre DGI. Enquête conjointe immédiate obligatoire avec un membre de la F3SCT. Réunion sous 24h en cas de désaccord.",
      autoriteCompetente: `Formation Spécialisée en Santé, Sécurité et Conditions de Travail (F3SCT) du CST de ${collectivite}`,
      effetJuridique: "Déclenchement immédiat de l'enquête conjointe (Art. 5-2 décret 85-603). Protection absolue contre toute retenue ou sanction si droit de retrait exercé (Art. 5-1 al. 4).",
      avertissement: "OBLIGATION LÉGALE : Le chef de service a l'obligation de consigner le signalement au registre spécial DGI coté et paraphé sous peine de faute engageant la responsabilité de l'administration !"
    };
    fondementsJuridiques = [
      "Articles L. 136-1, L. 253-1 à L. 253-5 du Code Général de la Fonction Publique",
      "Décret n° 85-603 du 10 juin 1985 relatif à l'hygiène et à la sécurité du travail dans la FPT (Articles 5-1 à 5-4 : DGI, droit de retrait et registre)",
      "Décret n° 2021-571 du 3 décembre 2021 relatif aux comités sociaux territoriaux et formations spécialisées (Articles 60 à 68)",
      "Code du Travail (Livre III de la 4ème partie applicable par renvoi : Articles L. 4131-1 et s.)"
    ];
    piecesRequises = [
      "Fiche de signalement au Registre Spécial des DGI (coté et paraphé)",
      "Photos / constatations matérielles du danger (locaux, matériels défectueux, produits)",
      "Témoignages écrits de collègues ou d'usagers présents",
      "Avis du médecin de prévention / du travail ou certificats médicaux",
      "Historique des fiches de signalement SST antérieures restées sans suite"
    ];

    texteOfficiel = `NOTIFICATION OFFICIELLE DE SAISINE DE LA F3SCT / CST
SIGNALEMENT AU REGISTRE SPÉCIAL DES DANGERS GRAVES ET IMMINENTS (DGI)
OU DEMANDE D'ENQUÊTE CONJOINTE ET DROIT D'ALERTE EN MATIÈRE DE CONDITIONS DE TRAVAIL
Articles 5-1 à 5-4 du décret n° 85-603 du 10 juin 1985 & Articles 60 à 68 du décret n° 2021-571 du 3 décembre 2021

DESTINATAIRES CONJOINTS :
1. Monsieur / Madame le Président de la F3SCT / CST (${collectivite})
2. Monsieur / Madame le Secrétaire de la F3SCT (Représentant des personnels)
3. À l'attention de l'ACFI (Agent Chargé des Fonctions d'Inspection en Santé et Sécurité)
4. Copie officielle : Section syndicale CFDT Territoriaux (${collectivite})

SIGNALANT / AGENT CONCERNÉ :
Nom et prénom : ${prenomAgent} ${nomAgent}
Qualité : ${grade}
Direction / Affectation : ${directionService}
Poste et localisation du danger : ${lieuIncidentDanger || directionService}
Date et heure du constat : ${dateIncidentDanger || dateNotificationDecision || dateAujourdhui}
Assistance syndicale : ${assistanceSyndicale ? `Accompagné(e) par ${nomRepresentantSyndical || "un représentant syndical CFDT siégeant à la F3SCT"}` : "Démarche individuelle"}

OBJET : ${libelleF3sct.toUpperCase()}
CARACTÈRE D'URGENCE : IMMÉDIAT

Monsieur le Président, Mesdames et Messieurs les Membres de la F3SCT,

En application des prérogatives conférées par les articles 5-1 et suivants du décret n° 85-603 du 10 juin 1985 modifié, j'ai l'honneur de notifier formellement la survenance d'une situation de danger grave et imminent pour la santé physique et mentale des agents, et d'exiger le déclenchement des procédures d'enquête conjointe obligatoires.

I. DESCRIPTION CIRCONSTANCIÉE DE LA SITUATION DANGEREUSE OU DE L'ATTEINTE
1. Nature exacte du péril / risque :
${faitsEtContexte || "Présence d'un risque grave et imminent pour la sécurité des personnels ou dégradation brutale des conditions d'exercice."}

2. Localisation et postes de travail affectés :
Lieu précis : ${lieuIncidentDanger || "Locaux du service " + directionService}
Équipements, locaux ou comportements en cause : ${motifsInvoquesAdministration || "Installations non conformes, défaut d'équipements de protection ou situation de tension extrême."}

3. Conséquences immédiates sur la santé et la sécurité :
${argumentsAgent || "Risque avéré d'accident grave du travail, intoxication, défaillance matérielle ou détresse psychologique aiguë entraînant une incapacité immédiate."}

II. EXERCICE DU DROIT D'ALERTE ET DROIT DE RETRAIT (LE CAS ÉCHÉANT)
${motifF3sct === "droit_alerte_retrait" || motifF3sct === "danger_grave_imminent" ? `L'agent soussigné informe l'autorité qu'il a un motif raisonnable de penser que la situation de travail présente un danger grave et imminent pour sa vie ou sa santé.
Conformément à l'article 5-1 alinéa 4 du décret n° 85-603, AUCUNE SANCTION, NI AUCUNE RETENUE SUR TRAITEMENT OU SALAIRE ne peut être légalement appliquée à l'agent ayant exercé son droit de retrait dans ces conditions. L'agent reste à disposition de l'employeur pour toute mission compatible avec sa mise en sécurité.` : "Le présent signalement vise à prévenir la survenance d'accidents du travail ou de maladies professionnelles en exigeant une intervention paritaire de la F3SCT."}

III. DEMANDES FORMELLES ET MESURES CONSERVATOIRES D'URGENCE EXIGÉES
En application des dispositions légales impératives prévues aux articles 5-2 et 5-3 du décret n° 85-603 et du décret n° 2021-571, il est formellement requis :

1. L'INSCRIPTION IMMÉDIATE et intégrale du présent signalement sur le Registre Spécial des DGI coté et paraphé ;
2. LE DÉCLENCHEMENT SANS DÉLAI d'une ENQUÊTE CONJOINTE sur les lieux du danger associant le chef de service et le représentant désigné de la F3SCT (CFDT) ;
3. LA MISE EN SÉCURITÉ immédiate du poste de travail et l'arrêt conservatoire des opérations à risque ;
4. ${demandesAgent || "La convocation en urgence de la Formation Spécialisée (F3SCT) dans les 24 heures en cas de divergence sur les mesures à adopter, et l'information de l'ACFI."}

Fait à ${collectivite}, le ${dateAujourdhui}

Signature du déclarant / agent :

${prenomAgent} ${nomAgent}

Pour les représentants du personnel siégeant à la F3SCT :
${nomRepresentantSyndical || "Section CFDT Territoriaux"}`;
  }

  return {
    titre,
    sousTitre,
    texteOfficiel,
    delaisEtProcedure,
    fondementsJuridiques,
    piecesRequises
  };
}

// ─────────────────────────────────────────────────────────────
// 5. GÉNÉRATEUR DE REQUÊTES CONTENTIEUSES (TA / TÉLÉRECOURS)
// ─────────────────────────────────────────────────────────────

export function generateRequeteTa(data: RequeteContentieuseFormData): {
  titre: string;
  texteRep: string;
  texteRefere?: string;
  fondementsJuridiques: string[];
} {
  const {
    typeRequete,
    juridiction,
    nomAgent,
    prenomAgent,
    adresseAgent,
    codePostalAgent,
    villeAgent,
    telephoneAgent,
    emailAgent,
    gradeAgent,
    collectiviteDefendeuse,
    dateDecisionAttaquee,
    referenceDecisionAttaquee,
    dateNotificationDecision,
    recoursGracieuxPrealable,
    dateRecoursGracieux,
    dateRejetRecoursGracieux,
    typeRejetRecoursGracieux,
    moyensLegaliteExterne,
    moyensLegaliteInterne,
    elementsRefereSuspension,
    conclusionsAnnulation,
    montantFraisIrrepetibles,
    demandeInjonctionSousAstreinte,
    delaiInjonctionJours
  } = data;

  // Construction des moyens de légalité externe
  const moyensExtList: string[] = [];
  if (moyensLegaliteExterne.incompetenceAuteur) {
    moyensExtList.push(`1. Sur l'incompétence de l'auteur de l'acte contesté :
Il ressort de l'examen de la décision attaquée que son signataire ne justifie d'aucune compétence statutaire propre ni d'une délégation de signature régulièrement publiée au recueil des actes administratifs de la collectivité antérieurement à l'édiction de l'acte. En application de l'article L. 2122-18 du CGCT, l'acte est entaché d'incompétence manifeste.`);
  }
  if (moyensLegaliteExterne.viceProcedureCapCst) {
    moyensExtList.push(`2. Sur le vice de procédure tiré de l'absence de consultation des instances paritaires obligatoires :
En violation des articles L. 261-1 et suivants du CGFP, l'administration a omis de soumettre la situation litigieuse à l'avis préalable de la Commission Administrative Paritaire (CAP) ou du Comité Social Territorial (CST) alors que cette consultation revêtait un caractère obligatoire substantiel conférant une garantie à l'agent (Jurisprudence CE Danthony, 23 décembre 2011, n° 335033).`);
  }
  if (moyensLegaliteExterne.viceFormeMotivation) {
    moyensExtList.push(`3. Sur le vice de forme tiré du défaut et de l'insuffisance caractérisée de motivation :
Aux termes de l'article L. 211-2 du Code des relations entre le public et l'administration (CRPA), les décisions administratives individuelles défavorables doivent être expressément motivées en droit et en fait. En l'espèce, la décision querellée comporte des motifs purement stéréotypés et abstraits ne permettant pas à l'agent de connaître les éléments précis ayant conduit au refus.`);
  }

  // Construction des moyens de légalité interne
  const moyensIntList: string[] = [];
  if (moyensLegaliteInterne.erreurDeDroit) {
    moyensIntList.push(`1. Sur l'erreur de droit :
L'administration a méconnu les dispositions expresses du Code Général de la Fonction Publique en fondant son refus sur un critère erroné ou non prévu par les textes réglementaires régissant le statut de l'agent public.`);
  }
  if (moyensLegaliteInterne.erreurManifesteAppreciation) {
    moyensIntList.push(`2. Sur l'erreur manifeste d'appréciation :
La décision est entachée d'une disproportion manifeste et d'une appréciation erronée des faits de l'espèce. L'autorité administrative n'a pas procédé à un examen objectif de la manière de servir, des besoins réels du service et de la situation personnelle de l'agent.`);
  }
  if (moyensLegaliteInterne.detournementPouvoir) {
    moyensIntList.push(`3. Sur le détournement de pouvoir :
Il résulte de l'ensemble des pièces produites que l'acte contesté a été édicté pour des motifs totalement étrangers à l'intérêt du service public, traduisant une volonté de sanction déguisée ou une animosité personnelle de la hiérarchie directe.`);
  }

  // Requête au Fond : Recours pour Excès de Pouvoir
  const texteRep = `POUR :
${prenomAgent} ${nomAgent}
Demeurant : ${adresseAgent}, ${codePostalAgent} ${villeAgent}
Téléphone : ${telephoneAgent} • Email : ${emailAgent}
Profession / Grade : ${gradeAgent}
Ayant pour qualité : REQUÉRANT(E)

CONTRE :
La Collectivité : ${collectiviteDefendeuse}
Prise en la personne de son représentant légal en exercice
Direction des Affaires Juridiques
Ayant pour qualité : DÉFENDEUR

DEVANT :
MONSIEUR LE PRÉSIDENT ET LES MEMBRES COMPOSANT LE :
${juridiction.toUpperCase()}

RECOURS POUR EXCÈS DE POUVOIR (REP)
À L'ENCONTRE DE : La décision n° ${referenceDecisionAttaquee || "visée"} en date du ${dateDecisionAttaquee} portant : ${conclusionsAnnulation}

---

PLAISE AU TRIBUNAL :

I. FAITS ET PROCÉDURE
${prenomAgent} ${nomAgent} exerce ses fonctions en qualité de ${gradeAgent} au sein de la collectivité ${collectiviteDefendeuse}.

En date du ${dateDecisionAttaquee}, l'autorité territoriale a notifié à l'agent une décision portant : ${conclusionsAnnulation}.
${recoursGracieuxPrealable ? `Un recours gracieux préalable a été formé par le requérant le ${dateRecoursGracieux}, lequel a fait l'objet d'une décision de rejet ${typeRejetRecoursGracieux === "implicite" ? "implicite née du silence gardé pendant 2 mois" : "explicite le " + dateRejetRecoursGracieux}.` : "La présente requête est introduite directement dans le délai légal de deux mois suivant la notification de l'arrêté."}

C'est dans ces circonstances que le requérant est recevable et bien fondé à solliciter l'annulation de cette décision illégale.

II. RECEVABILITÉ
La présente requête est recevable au regard des règles du Code de justice administrative :
- La décision contestée fait grief et lèse directement les droits statutaires et la situation professionnelle du requérant ;
- La requête est introduite dans le respect des délais prévus par l'article R. 421-1 du CJA (notification intervenue le ${dateNotificationDecision}) ;
- Le timbre fiscal et les pièces justificatives numérotées sont annexés conformément à l'article R. 414-5 du CJA.

III. DISCUSSION JURIDIQUE

A. SUR LA LÉGALITÉ EXTERNE DE LA DÉCISION QUERELLÉE
${moyensExtList.join("\n\n") || "La décision querellée a été prise en méconnaissance des règles de forme et de compétence régissant les actes de la fonction publique territoriale."}

B. SUR LA LÉGALITÉ INTERNE DE LA DÉCISION QUERELLÉE
${moyensIntList.join("\n\n") || "La décision querellée repose sur des motifs matériellement inexacts et juridiquement infondés."}

IV. CONCLUSIONS
Par ces motifs, et tous autres à produire, déduire ou suppléer, le requérant conclut qu'il plaise au Tribunal administratif :

1. DÉCLARER la présente requête recevable et bien fondée ;
2. PRONONCER L'ANNULATION POUR EXCÈS DE POUVOIR de la décision attaquée du ${dateDecisionAttaquee} émanant de ${collectiviteDefendeuse} ;
${demandeInjonctionSousAstreinte ? `3. ENJOINTE à ${collectiviteDefendeuse}, sur le fondement des articles L. 911-1 et L. 911-2 du Code de justice administrative, de réexaminer la situation de ${prenomAgent} ${nomAgent} dans un délai de ${delaiInjonctionJours} jours à compter de la notification du jugement à intervenir, sous astreinte de 100 euros par jour de retard ;` : ""}
4. CONDAMNER la collectivité ${collectiviteDefendeuse} à verser à ${prenomAgent} ${nomAgent} la somme de ${montantFraisIrrepetibles} euros (au titre de l'article L. 761-1 du Code de justice administrative) au titre des frais exposés et non compris dans les dépens.

Fait à ${villeAgent}, le ${new Date().toLocaleDateString("fr-FR")}

Signature :
${prenomAgent} ${nomAgent}

Sous toutes réserves.`;

  // Requête en Référé-Suspension L. 521-1 CJA si demandée
  let texteRefere: string | undefined;
  if (typeRequete === "rep_et_refere" && elementsRefereSuspension) {
    texteRefere = `POUR :
${prenomAgent} ${nomAgent}
Profession : ${gradeAgent}
Demeurant : ${adresseAgent}, ${codePostalAgent} ${villeAgent}
Email : ${emailAgent}

CONTRE :
${collectiviteDefendeuse}

DEVANT :
LE JUGE DES RÉFÉRÉS DU ${juridiction.toUpperCase()}

REQUÊTE EN RÉFÉRÉ-SUSPENSION
(En application de l'article L. 521-1 du Code de justice administrative)
ADOSSÉE AU RECOURS EN ANNULATION AU FOND ENREGISTRÉ SOUS LE BORDEREAU CI-JOINT

---

PLAISE AU JUGE DES RÉFÉRÉS :

L'article L. 521-1 du Code de justice administrative dispose :
« Quand une décision administrative, même de rejet, fait l'objet d'une requête en annulation ou en réformation, le juge des référés, saisi d'une demande en ce sens, peut ordonner la suspension de l'exécution de cette décision, ou de certains de ses effets, lorsque l'urgence le justifie et qu'il est fait état d'un moyen propre à créer, en l'état de l'instruction, un doute sérieux quant à la légalité de la décision. »

I. SUR L'EXISTENCE D'UNE REQUÊTE AU FOND
Une requête tendant à l'annulation pour excès de pouvoir de la décision querellée a été introduite simultanément devant votre juridiction (copie intégrale annexée en PJ n°1).

II. SUR LA CONDITION D'URGENCE
La condition d'urgence au sens de l'article L. 521-1 du CJA est pleinement caractérisée dès lors que la décision contestée préjudicie de manière suffisamment grave et immédiate à la situation de l'agent :
${elementsRefereSuspension.justificationUrgence || "Atteinte grave et immédiate aux conditions d'exercice et à l'état de santé de l'agent."}
Impacts financiers et personnels majeurs :
${elementsRefereSuspension.impactFinancierOuSante || "Privation de ressources ou préjudice d'exercice irréversible."}

III. SUR L'EXISTENCE DE MOYENS PROPRES À CRÉER UN DOUTE SÉRIEUX QUANT À LA LÉGALITÉ DE L'ACTE
Il existe en l'état de l'instruction plusieurs moyens sérieux de nature à justifier l'annulation de la décision :
${elementsRefereSuspension.douteSerieuxResume || "Moyens tirés de l'incompétence de l'auteur, du vice de procédure substantiel et de l'erreur manifeste d'appréciation."}

PAR CES MOTIFS :
Le requérant conclut à ce qu'il plaise au Juge des Référés :
1. ORDONNER la SUSPENSION IMMÉDIATE de l'exécution de la décision contestée du ${dateDecisionAttaquee} ;
2. CONDAMNER ${collectiviteDefendeuse} à verser au requérant la somme de 1 000 euros au titre de l'article L. 761-1 du Code de justice administrative.

Fait à ${villeAgent}, le ${new Date().toLocaleDateString("fr-FR")}

Signature :
${prenomAgent} ${nomAgent}`;
  }

  return {
    titre: `Requête Contentieuse TA (${juridiction})`,
    texteRep,
    texteRefere,
    fondementsJuridiques: [
      "Articles R. 421-1 et suivants du Code de Justice Administrative",
      "Article L. 521-1 du Code de Justice Administrative (Référé-suspension)",
      "Articles L. 211-2 et L. 211-5 du CRPA (Motivation des actes administratifs)",
      "Articles L. 911-1 et L. 761-1 du Code de Justice Administrative"
    ]
  };
}

// ─────────────────────────────────────────────────────────────
// 5. GÉNÉRATEUR DU BORDEREAU DE PIÈCES (TÉLÉRECOURS CITOYENS)
// ─────────────────────────────────────────────────────────────

export function generateBordereauPieces(
  pieces: PieceTeleRecours[],
  nomAffaire: string,
  juridiction: string
): { titre: string; texteBordereau: string; totalPages: number } {
  const totalPages = pieces.reduce((acc, p) => acc + (p.nbPages || 1), 0);

  const lignesPieces = pieces.map((p, idx) => {
    const num = idx + 1;
    return `Pièce n° ${num} : [${p.nomNormalise}]
Intitulé exact : ${p.titre}
Date du document : ${p.datePiece || "Non précisée"}
Nombre de pages : ${p.nbPages || 1} page(s)
Catégorie : ${p.categorie.toUpperCase()}
Pertinence : Élément probant produit au soutien des prétentions du requérant.`;
  }).join("\n\n");

  const texteBordereau = `BORDEREAU D'INVENTAIRE RÉCAPITULATIF DES PIÈCES JOINTES
CONFORME AUX ARTICLES R. 414-5 ET R. 414-6 DU CODE DE JUSTICE ADMINISTRATIVE
NORME OFFICIELLE D'INDEXATION TÉLÉRECOURS CITOYENS

JURIDICTION SAISIE : ${juridiction.toUpperCase()}
AFFAIRE : ${nomAffaire}
REQUÉRANT : [Requérant désigné au mémoire]
DÉFENDEUR : [Collectivité désignée au mémoire]

Nombre total de pièces jointes produites : ${pieces.length}
Nombre total de pages annexées : ${totalPages} pages

RÈGLES DE NOMMAGE ET FORMAT TÉLÉRECOURS :
Chaque fichier déposé sur l'application Télérecours Citoyens respecte le formalisme strict de l'arrêté ministériel du 14 décembre 2018 (format PDF, désignation 'PJ n°' suivie du libellé de la pièce).

---

LISTE NUMÉROTÉE ET DESCRIPTIVE DES PIÈCES :

${lignesPieces || "Aucune pièce téléversée pour l'instant."}

---

Certifié sincère et conforme à la numérotation des fichiers versés au greffe de la juridiction.

Fait le ${new Date().toLocaleDateString("fr-FR")}
Signature du requérant`;

  return {
    titre: "Bordereau Récapitulatif Télérecours Citoyens",
    texteBordereau,
    totalPages
  };
}

// ─────────────────────────────────────────────────────────────
// 6. GÉNÉRATEUR DU CODE ET SCRIPT DOCASSEMBLE (.YML)
// ─────────────────────────────────────────────────────────────
// 6. GÉNÉRATEUR DU CODE ET SCRIPT DOCASSEMBLE (.YML)
// ─────────────────────────────────────────────────────────────

export function generateDocassembleYamlPackage(scenario: "recours_gracieux" | "requete_ta" | "protection_fonctionnelle" | "saisine_instances"): string {
  if (scenario === "recours_gracieux") {
    return `---
metadata:
  title: Guichet d'Auto-Défense Syndicale - Recours Gracieux & Recevabilité CJA
  short title: Recours Gracieux CJA
  description: Interview Docassemble d'auto-défense pour agents publics territoriaux (CGFP / CJA).
  authors:
    - name: CFDT Territoriaux
      organization: Collectivités & Défense Juridique
  version: 2.4
---
modules:
  - docassemble.base.util
  - datetime
  - dateutil.relativedelta
---
imports:
  - json
---
features:
  progress bar: True
---
objects:
  - agent: Individual
  - collectivite: Organization
  - arrete_refuse: DAFile
---
code: |
  # Règle de calcul CJA R. 421-5 et R. 421-1 en Python pur
  from datetime import date, timedelta
  from dateutil.relativedelta import relativedelta

  def compute_cja_delai(date_notif, mentions_presentes):
      # Ajout de 2 mois de date à date
      date_limite = date_notif + relativedelta(months=2)
      
      # Prorogation week-end (art. 642 CPC)
      if date_limite.weekday() == 5: # Samedi
          date_limite += timedelta(days=2)
      elif date_limite.weekday() == 6: # Dimanche
          date_limite += timedelta(days=1)
          
      jours_restants = (date_limite - date.today()).days
      
      if not mentions_presentes:
          # Règle Czabaj 1 an
          date_czabaj = date_notif + relativedelta(years=1)
          jours_czabaj = (date_czabaj - date.today()).days
          return {
              "statut": "inopposable_czabaj",
              "date_limite": date_czabaj,
              "jours": jours_czabaj,
              "mention": "Délai de 2 mois inopposable (Art. R. 421-5 CJA) - Délai raisonnable de 1 an applicable."
          }
      
      if jours_restants < 0:
          return {"statut": "forclos", "date_limite": date_limite, "jours": jours_restants, "mention": "Délai forclos"}
      elif jours_restants <= 15:
          return {"statut": "urgent", "date_limite": date_limite, "jours": jours_restants, "mention": "Urgence imminente"}
      else:
          return {"statut": "ouvert", "date_limite": date_limite, "jours": jours_restants, "mention": "Délai ouvert"}
---
question: |
  Bienvenue sur la Permanence Numérique d'Auto-Défense Syndicale
subquestion: |
  Ce guichet vous permet d'analyser la recevabilité de votre décision administrative et de générer votre recours juridique officiel en 5 minutes.
field: ready_to_start
buttons:
  - J'expose ma situation: True
---
question: |
  Quelle décision contestez-vous ?
fields:
  - Motif du refus: motif_refus
    choices:
      - Refus d'autorisation de télétravail: teletravail
      - Refus de temps partiel: temps_partiel
      - Refus de rupture conventionnelle: rupture_conventionnelle
      - Refus de disponibilité: disponibilite
      - Contestation du compte-rendu d'évaluation (CREP): crep
  - Date de notification de la décision contestée: date_notification
    datatype: date
  - Les voies et délais de recours étaient-ils mentionnés dans la lettre/arrêté ?: mentions_recours_presentes
    datatype: yesno
---
code: |
  resultat_delai = compute_cja_delai(date_notification, mentions_recours_presentes)
---
question: |
  Contrôle de Recevabilité Automatique (Art. R. 421-5 CJA)
subquestion: |
  **Statut :** \${ resultat_delai['mention'] }
  
  **Date limite calculée :** \${ resultat_delai['date_limite'] } (environ \${ resultat_delai['jours'] } jours restants).
  
  % if not mentions_recours_presentes:
  > **Note Juridique :** L'article R. 421-5 du CJA rend inopposable le délai de 2 mois lorsque la collectivité a omis de mentionner les voies et délais de recours. Vous bénéficiez du délai raisonnable d'un an (CE Ass. 13 juillet 2016, Czabaj).
  % endif
continue button field: recevabilite_validee
---
attachment:
  name: Recours_Gracieux_Officiel
  filename: Recours_Gracieux_\${ agent.name.last }.docx
  docx template file: modele_recours_gracieux.docx
---
mandatory: True
question: |
  Votre recours juridique est prêt à être téléchargé
subquestion: |
  Téléchargez votre courrier officiel conforme, imprimez-le et envoyez-le en Recommandé avec Accusé de Réception (LRAR) à votre employeur territorial.
buttons:
  - Terminer: exit
`;
  }

  if (scenario === "saisine_instances") {
    return `---
metadata:
  title: Docassemble - Saisine des Instances Paritaires (CAP, CCP, F3SCT)
  short title: Saisine Instances Paritaires
  description: Générateur automatisé de formulaires officiels de saisine de la CAP (CREP, formation), de la CCP (licenciement d'un contractuel) et de la F3SCT (dangers graves et imminents, droit d'alerte).
  authors:
    - name: CFDT Territoriaux
      organization: Fonction Publique Territoriale
  version: 3.0
---
modules:
  - docassemble.base.util
  - datetime
---
code: |
  # Moteur Python de calcul des délais de saisine paritaire
  from datetime import date, timedelta

  def verifier_delai_cap_crep(date_reponse_recours):
      # Règle statutaire : saisine de la CAP dans un délai de 30 jours (1 mois)
      date_limite = date_reponse_recours + timedelta(days=30)
      jours_restants = (date_limite - date.today()).days
      return {
          "date_limite": date_limite,
          "jours_restants": jours_restants,
          "statut": "recevable" if jours_restants >= 0 else "forclos"
      }
---
question: |
  Sélectionnez l'instance paritaire territoriale compétente
fields:
  - Instance paritaire à saisir: instance_choisie
    choices:
      - 🏛️ Commission Administrative Paritaire (CAP - Fonctionnaires titulaires) : cap
      - 🤝 Commission Consultative Paritaire (CCP - Agents contractuels de droit public) : ccp
      - 🚨 Formation Spécialisée Santé, Sécurité & Conditions de Travail (F3SCT / CST) : f3sct
---
question: |
  Objet précis de la saisine
fields:
  - Objet du recours CAP: motif_cap
    show if:
      variable: instance_choisie
      is: cap
    choices:
      - Recours en révision du Compte-Rendu d'Entretien Professionnel (CREP - Art. L. 543-1 CGFP): cap_crep
      - Refus réitéré de formation professionnelle ou de compte personnel de formation (CPF): cap_formation
      - Refus de travail à temps partiel ou d'autorisation de télétravail: cap_temps_partiel
      - Mémoire en défense lors d'un projet de licenciement pour insuffisance professionnelle: cap_insuffisance
  - Objet de la saisine CCP: motif_ccp
    show if:
      variable: instance_choisie
      is: ccp
    choices:
      - Mémoire d'observations - Licenciement contractuel pour insuffisance professionnelle: ccp_licenciement_insuffisance
      - Mémoire d'observations - Licenciement contractuel pour suppression de poste (obligation reclassement): ccp_licenciement_suppression
      - Mémoire d'observations - Licenciement contractuel pour inaptitude physique: ccp_licenciement_inaptitude
      - Recours en révision de l'évaluation professionnelle de l'agent contractuel: ccp_crep
  - Objet de l'alerte F3SCT / CST: motif_f3sct
    show if:
      variable: instance_choisie
      is: f3sct
    choices:
      - Signalement de Danger Grave et Imminent (DGI - Registre spécial obligatoire Art. 5-2): f3sct_dgi
      - Constat d'exercice du Droit de Retrait et mise en sécurité (Art. L. 136-1 CGFP): f3sct_retrait
      - Alerte pour Risques Psychosociaux (RPS), harcèlement moral et souffrance au travail: f3sct_rps
      - Demande d'inspection et de visite des locaux pour insalubrité ou danger chimique: f3sct_visite
---
question: |
  Identité de l'agent et Collectivité de rattachement
fields:
  - Nom de l'agent: agent.name.last
  - Prénom de l'agent: agent.name.first
  - Grade ou emploi: agent_grade
  - Direction ou Service d'affectation: agent_direction
  - Collectivité employeur: collectivite_nom
    default: Ville de Gennevilliers
  - Centre de gestion de rattachement (CAP/CCP): centre_gestion
    default: CIG Petite Couronne (92-93-94)
  - Date de notification de la décision contestée ou date du danger: date_evenement
    datatype: date
  - Assistance syndicale souhaitée ?: assistance_syndicale
    datatype: yesno
    default: True
---
question: |
  Exposé des faits et arguments à soumettre aux commissaires paritaires
fields:
  - Circonstances et déroulé des faits: faits_contexte
    inputtype: textarea
  - Motifs opposés par l'administration territoriale: motifs_administration
    inputtype: textarea
  - Arguments juridiques et statutaires invoqués par l'agent: arguments_defense
    inputtype: textarea
  - Demandes précises et mesures sollicitées auprès de l'instance: conclusions_demandes
    inputtype: textarea
---
attachment:
  name: Formulaire_Officiel_Saisine_Instance_Paritaire
  filename: Saisine_\${ instance_choisie }_\${ agent.name.last }.docx
  docx template file: modele_saisine_instance.docx
---
mandatory: True
question: |
  Votre formulaire officiel de saisine est prêt
subquestion: |
  Le document officiel et conforme aux dispositions du Code Général de la Fonction Publique est prêt à être transmis au secrétariat de l'instance paritaire et notifié à l'autorité territoriale.
buttons:
  - Télécharger le formulaire (.docx): exit
`;
  }

  // Requête Contentieuse TA YAML
  return `---
metadata:
  title: Docassemble - Générateur de Requête Contentieuse Tribunal Administratif
  short title: Requête TA / Télérecours
  description: Générateur de Recours pour Excès de Pouvoir (REP) et Référé-Suspension L. 521-1 CJA.
  authors:
    - name: CFDT Territoriaux
  version: 2.0
---
modules:
  - docassemble.base.util
---
question: |
  Structure de la Requête Contentieuse Administrative
subquestion: |
  Sélectionnez les moyens de légalité externe et interne constatés sur l'acte administratif attaqué.
fields:
  - Juridiction compétente: ta_competent
    choices:
      - Tribunal Administratif de Cergy-Pontoise (92, 95): ta_cergy
      - Tribunal Administratif de Paris (75): ta_paris
      - Tribunal Administratif de Montreuil (93): ta_montreuil
      - Autre Tribunal Administratif: ta_autre
  - Formuler également une requête en Référé-Suspension (L. 521-1 CJA) ?: demande_refere
    datatype: yesno
---
question: |
  Moyens de Légalité Externe (Forme & Procédure)
fields:
  - Incompétence de l'auteur (défaut de délégation régulière): moyen_incompetence
    datatype: yesno
  - Vice de procédure (omission de saisine CAP ou CST): moyen_vice_procedure
    datatype: yesno
  - Vice de forme (défaut de motivation Art. L. 211-2 CRPA): moyen_vice_motivation
    datatype: yesno
---
question: |
  Moyens de Légalité Interne (Fond & Qualification)
fields:
  - Erreur de droit: moyen_erreur_droit
    datatype: yesno
  - Erreur manifeste d'appréciation: moyen_erreur_manifeste
    datatype: yesno
  - Détournement de pouvoir: moyen_detournement
    datatype: yesno
---
attachment:
  name: Requete_Contentieuse_TA
  filename: Requete_TA_\${ ta_competent }.docx
  docx template file: modele_requete_ta.docx
---
mandatory: True
question: |
  Vos requêtes pour Télérecours Citoyens sont prêtes
buttons:
  - Télécharger le pack: exit
`;
}
