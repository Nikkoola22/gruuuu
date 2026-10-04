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
// 4. GÉNÉRATEUR DE REQUÊTES CONTENTIEUSES (TA / TÉLÉRECOURS)
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

export function generateDocassembleYamlPackage(scenario: "recours_gracieux" | "requete_ta" | "protection_fonctionnelle"): string {
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
