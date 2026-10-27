export interface CFDTract {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  theme: string;
  themeColor: "orange" | "blue" | "amber" | "emerald" | "rose" | "purple" | "teal" | "cyan";
  coverImage: string;
  pdfUrl: string;
  description: string;
  keyPoints: string[];
  serviceConcerne: string;
  isGuide?: boolean;
  pagesCount?: number;
  tableOfContents?: string[];
}

export const CFDT_TRACTS: CFDTract[] = [
  {
    id: "guide-agent-public-2026",
    title: "Guide de l'agent public 2026",
    subtitle: "Édition fédérale CFDT Interco — Le statut général de référence (68 pages)",
    badge: "Guide Fédéral 2026",
    date: "Juin 2026",
    theme: "Statut & Droits Généraux",
    themeColor: "purple",
    coverImage: "tracts/guide-agent-public-cover.png",
    pdfUrl: "tracts/guide-agent-public-2026.pdf",
    isGuide: true,
    pagesCount: 68,
    description: "L'ouvrage de référence statutaire indispensable publié par la Fédération CFDT Interco pour tous les agents de la fonction publique (FPE, FPT, FPH). À jour des réformes législatives et du Code Général de la Fonction Publique (CGFP) : rémunération, droits et devoirs, carrière, temps de travail, congés, discipline, instances paritaires (CST, CAP, F3SCT) et protection sociale.",
    keyPoints: [
      "Code Général de la Fonction Publique (CGFP) et grands principes des 3 versants",
      "Rémunération : point d'indice, RIFSEEP, SFT, NBI, CTI et nouvelle PSC santé/prévoyance",
      "Carrière & formation : avancement d'échelon/grade, promotion interne (LDG), VAE, CPA/CPF",
      "Positions statutaires : détachement, disponibilité sans délai de 18 mois (décret déc. 2025)",
      "Temps de travail, congés pour raison de santé (maintien 90%), autorisations d'absence et instances (CST, CAP, F3SCT)"
    ],
    tableOfContents: [
      "Les grands principes de la fonction publique & organisation du CGFP (p. 5)",
      "L'organisation des emplois : catégories A, B, C, cadres d'emplois et grades (p. 6)",
      "Le personnel : stagiaires, titulaires, contractuels et travailleurs handicapés (p. 7)",
      "La rémunération : traitement indiciaire brut, IR, SFT, RIFSEEP, NBI, CTI, PSC (p. 9)",
      "Les droits des agents : opinion, grève, non-discrimination, protection fonctionnelle (p. 11)",
      "Les obligations des agents : obéissance, probité, cumul d'activités, réserve, laïcité (p. 18)",
      "La carrière : dossier individuel, entretien annuel (CREP), avancement, promotion interne, LDG (p. 21)",
      "La formation : CEP, certification CléA, bilan de compétences, VAE, CPF et CEC (p. 24)",
      "Les positions administratives : activité, mise à disposition, mutation, détachement, disponibilité (p. 30)",
      "La cessation de fonctions : démission, licenciement, inaptitude, rupture conventionnelle, retraite (p. 35)",
      "Le temps de travail : base 1 607 h, ARTT, astreintes, temps non complet, temps partiel, télétravail (p. 40)",
      "Les congés et autorisations d'absence : congés annuels, bonifiés, CET, maternité, paternité, maladie ordinaire, CLM, CLD, CITIS (p. 46)",
      "La discipline : 4 groupes de sanctions, procédure et conseil de discipline (p. 58)",
      "Les instances représentatives du personnel : CCFP, CSFPE, CSFPT, CAP, CCP, CS/CST, F3SCT (p. 60)",
      "La CFDT et vous : rôle du syndicat, accompagnement et avantages adhérents (p. 64)"
    ],
    serviceConcerne: "Tous les agents de la fonction publique (FPE, FPT, FPH)"
  },
  {
    id: "guide-agent-contractuel-2026",
    title: "Guide de l'agent contractuel 2026",
    subtitle: "Édition fédérale CFDT Interco — Connaître vos droits et opportunités (40 pages)",
    badge: "Guide Contractuels 2026",
    date: "Juin 2026",
    theme: "Agents Contractuels de Droit Public",
    themeColor: "emerald",
    coverImage: "tracts/guide-agent-contractuel-cover.png",
    pdfUrl: "tracts/guide-agent-contractuel-2026.pdf",
    isGuide: true,
    pagesCount: 40,
    description: "Le guide complet conçu par la CFDT Interco pour défendre et accompagner les agents contractuels de droit public dans la fonction publique territoriale et d'État : règles de recrutement (CDD, projet, remplacement), droits au CDI après 6 ans, période d'essai, réévaluation salariale obligatoire, congés pour maladie ou maternité, indemnité de fin de contrat (prime de précarité 10%) et rôle de la Commission Consultative Paritaire (CCP).",
    keyPoints: [
      "Tous les cas de recrutement : remplacement, accroissement, contrat de projet, vacance",
      "Conditions d'accès au CDI (6 ans de services) et portabilité entre employeurs",
      "Rémunération et réévaluation obligatoire au moins tous les 3 ans",
      "Droits à congés (maladie ordinaire, grave maladie, accident du travail) et préavis",
      "Indemnité de fin de contrat (prime de précarité de 10%) et saisine de la CCP"
    ],
    tableOfContents: [
      "Introduction & champ d'application FPE / FPT (p. 4)",
      "Les cas de recrutement : CDD de droit public, contrat de projet, vacance, PACTE, handicap (p. 4)",
      "Les contrats et leur durée : CDD temporaires, emplois permanents, mentions obligatoires (p. 9)",
      "Le CDI et la titularisation : passage en CDI après 6 ans, portabilité et congé mobilité (p. 13)",
      "La période d'essai : barèmes de durée et modalités de renouvellement (p. 16)",
      "Le temps de travail : 35h, 1 607 h, annualisation, temps partiel et temps partiel thérapeutique (p. 17)",
      "La formation professionnelle : formations statutaires, compte CPA/CPF et congés formation (p. 20)",
      "La rémunération : fixation, SMIC, réévaluation obligatoire tous les 3 ans, RIFSEEP (p. 21)",
      "L'entretien professionnel : compte-rendu annuel (CREP) et voies de recours (p. 22)",
      "Les congés : congés annuels, report de 15 mois, CET, maladie ordinaire, congé de grave maladie (p. 24)",
      "Les autorisations d'absence : motifs familiaux, garde d'enfant, grossesse, mandats syndicaux (p. 28)",
      "Droits, obligations & discipline : devoirs de l'agent, échelle des sanctions contractuels (p. 29)",
      "La fin de contrat : non-renouvellement, prime de précarité (10%), démission, licenciement, rupture conventionnelle (p. 31)",
      "Les instances représentatives : rôle déterminant de la Commission Consultative Paritaire (CCP) et du CST (p. 36)"
    ],
    serviceConcerne: "Agents contractuels de droit public (CDD, CDI, contrat de projet, PACTE)"
  },
  {
    id: "elections-2026-medecins",
    title: "Élections professionnelles le 10 décembre 2026",
    subtitle: "Pensez au vote par correspondance ! (Collègues médecins)",
    badge: "Élections 2026",
    date: "Octobre 2026",
    theme: "Démocratie Sociale",
    themeColor: "orange",
    coverImage: "tracts/tract-1.jpg",
    pdfUrl: "tracts/tract-1-elections-medecins.pdf",
    description: "Chères et chers collègues médecins : le 10 décembre 2026, faisons entendre notre voix ! Entre consultations et obligations professionnelles, optez pour la solution simple et pratique du vote par correspondance (recensement auprès de la DRH avant le 16 octobre 2026). Chaque voix compte !",
    keyPoints: [
      "Vote par correspondance pour les médecins territoriaux",
      "Recensement DRH avant le 16 octobre 2026",
      "Élections du 10 décembre 2026 : Ni dociles, ni résignés !"
    ],
    serviceConcerne: "Santé & Centres Médicaux municipaux"
  },
  {
    id: "sges-agents-exploitation",
    title: "SGES : Les agents d'exploitation",
    subtitle: "Un nouveau profil de poste ? La CFDT soutient le passage au grade d'agent de maîtrise !",
    badge: "Carrière & Grades",
    date: "2026",
    theme: "SGES & Sports",
    themeColor: "blue",
    coverImage: "tracts/tract-2.jpg",
    pdfUrl: "tracts/tract-2-sges-agents-exploitation.pdf",
    description: "Service ouvert de 6h à 22h30, 7j/7, dimanche de compétitions, 2,6 équipements sportifs pour 1 000 habitants à Gennevilliers contre 1,6 en Île-de-France, modernisation des accès (QR codes, caméras, PC déporté). La CFDT revendique la reconnaissance des compétences et le passage au grade d'agent de maîtrise.",
    keyPoints: [
      "Compétence technique accrue et modernisation numérique des accès",
      "Véritable évolution de carrière face au tassement des grilles en C",
      "Engagement fort des équipes dans les gymnases et complexes sportifs"
    ],
    serviceConcerne: "Service des Équipements Sportifs (SGES)"
  },
  {
    id: "supplement-familial-traitement",
    title: "Le Supplément Familial de Traitement (SFT)",
    subtitle: "Un droit pour les collègues de la FPT : c'est votre pouvoir d'achat !",
    badge: "Pouvoir d'Achat",
    date: "2026",
    theme: "Rémunération & Droits",
    themeColor: "amber",
    coverImage: "tracts/tract-3.jpg",
    pdfUrl: "tracts/tract-3-supplement-familial-traitement.pdf",
    description: "Tout comprendre sur le SFT : part fixe, part proportionnelle au traitement brut, planchers et plafonds réglementaires (Décret n° 85-1148). Exemple pour 2 enfants : entre 77,71 € et 117,29 € par mois. Testez vos montants avec notre simulateur CFDT !",
    keyPoints: [
      "Barèmes officiels complets de 1 à 3+ enfants",
      "Calcul personnalisé selon l'indice majoré (plancher IB 454 / plafond IB 722)",
      "Vérification des fiches de paie et alertes sur les incidents de calcul"
    ],
    serviceConcerne: "Tous les agents territoriaux avec enfants à charge"
  },
  {
    id: "dossier-epi-justice",
    title: "Le dossier EPI : La CFDT a gagné au Tribunal !",
    subtitle: "La CFDT a porté ce dossier en justice... et a obtenu gain de cause !",
    badge: "Victoire Juridique",
    date: "2026",
    theme: "Justice & Sécurité",
    themeColor: "emerald",
    coverImage: "tracts/tract-4.jpg",
    pdfUrl: "tracts/tract-4-dossier-epi-victoire-justice.pdf",
    description: "Rappel des faits : la CFDT a porté le dossier des Équipements de Protection Individuelle (EPI) au tribunal et a gagné. Aujourd'hui, des collègues du SERA, de la Régie municipale et d'autres services sont toujours dans l'attente de leurs courriers. La CFDT dit stop et exige la régularisation immédiate.",
    keyPoints: [
      "Jugement favorable obtenu en justice par la CFDT",
      "Agents du SERA, de la Régie municipale et services techniques concernés",
      "Exigence d'information immédiate et de règlement des situations sans délai"
    ],
    serviceConcerne: "SERA, Régie Municipale & Services Techniques"
  },
  {
    id: "equipes-sera-surcharge",
    title: "Les équipes du SERA n'en peuvent plus !",
    subtitle: "75 % de couverture, mais à quel prix ? Respecter 75 % ne doit pas signifier surcharger les collègues !",
    badge: "Conditions de Travail",
    date: "2026",
    theme: "Conditions de Travail",
    themeColor: "rose",
    coverImage: "tracts/tract-5.jpg",
    pdfUrl: "tracts/tract-5-equipes-sera-surcharge.pdf",
    description: "Le chiffre de 75 % ne fait pas tout : classes supplémentaires à répartir entre les agents, charge de travail en forte hausse au quotidien, entretien des locaux plus difficile, effectifs ATSEM particulièrement tendus. La CFDT demande des moyens supplémentaires et des remplacements pérennes.",
    keyPoints: [
      "Dénonciation de la surcharge liée au taux de couverture de 75 %",
      "Manque de moyens et nombre d'ATSEM insuffisant au regard des classes",
      "Revendication de recrutements et de remplacements pour garantir de bonnes conditions"
    ],
    serviceConcerne: "Service Éducation Restauration Animation (SERA) & ATSEM"
  }
];
