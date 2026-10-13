export interface CFDTract {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  theme: string;
  themeColor: "orange" | "blue" | "amber" | "emerald" | "rose" | "purple";
  coverImage: string;
  pdfUrl: string;
  description: string;
  keyPoints: string[];
  serviceConcerne: string;
}

export const CFDT_TRACTS: CFDTract[] = [
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
