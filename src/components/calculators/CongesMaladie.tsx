import React, { useState } from "react";
import {
  Activity,
  Info,
  Calendar as CalendarIcon,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Building2,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  FileCheck2,
  Stethoscope,
  ArrowRight,
  X
} from "lucide-react";

interface Arret {
  id: string;
  debut: string;
  fin: string;
}

export type StatutAgent = "titulaire_cnracl" | "titulaire_ircantec" | "contractuel";
export type TypeConge = "cmo" | "clm" | "cld" | "cgm" | "accident";

// Données pédagogiques pour accompagner l'agent à chaque étape
const STATUT_GUIDE: Record<
  StatutAgent,
  {
    label: string;
    shortLabel: string;
    subtitle: string;
    caisse: string;
    explication: string;
    commentSavoir: string;
    bulletPoints: string[];
  }
> = {
  titulaire_cnracl: {
    label: "Fonctionnaire Titulaire ou Stagiaire ≥ 28h/semaine (CNRACL)",
    shortLabel: "Titulaire / Stagiaire CNRACL (≥ 28h)",
    subtitle: "Agent nommé sur un emploi permanent à temps complet (35h) ou temps non complet ≥ 28h hebdomadaires",
    caisse: "Régime spécial de la Fonction Publique (CNRACL)",
    explication:
      "Vous relevez du régime spécial des fonctionnaires territoriaux. C'est la Ville de Gennevilliers qui vous verse directement votre traitement pendant vos congés maladie (sans passer par les indemnités journalières de la CPAM).",
    commentSavoir:
      "Sur votre bulletin de paie, vérifiez la ligne des cotisations retraite : il est inscrit « CNRACL ».",
    bulletPoints: [
      "Congé de Maladie Ordinaire (CMO) : 3 mois à 90 % puis 9 mois à 50 % sur 12 mois glissants",
      "Congés graves / longs : accès au CLM (3 ans) et au CLD (5 ans) après avis du Conseil Médical",
      "Accident de service / trajet (CITIS) : maintien à 100 % jusqu'à la reprise ou consolidation"
    ]
  },
  titulaire_ircantec: {
    label: "Fonctionnaire Titulaire ou Stagiaire < 28h/semaine (IRCANTEC)",
    shortLabel: "Titulaire / Stagiaire IRCANTEC (< 28h)",
    subtitle: "Agent nommé sur un emploi à temps non complet effectuant moins de 28h par semaine",
    caisse: "Régime Général (CPAM) + Retraite IRCANTEC",
    explication:
      "Bien que fonctionnaire, votre durée de travail inférieure à 28h/semaine vous affilie au régime général pour la maladie (Décret n°91-298). Vous bénéficiez du maintien de salaire par la Ville complété par les indemnités journalières de la CPAM.",
    commentSavoir:
      "Sur votre bulletin de paie, vous cotisez à l'IRCANTEC et au Régime Général (URSSAF / Maladie).",
    bulletPoints: [
      "Maladie Ordinaire (CMO) : 3 mois à 90 % puis 9 mois à demi-traitement",
      "Congé de Grave Maladie (CGM) : jusqu'à 3 ans (1 an plein traitement + 2 ans demi-traitement)",
      "Accident de service / trajet : plein traitement pendant 3 ans maximum, puis relais CPAM"
    ]
  },
  contractuel: {
    label: "Agent Contractuel de droit public (CDD ou CDI — Régime Général)",
    shortLabel: "Agent Contractuel (CDD / CDI)",
    subtitle: "Agent recruté par contrat (CDD ou CDI), affilié au Régime Général de la Sécurité Sociale (CPAM)",
    caisse: "Régime Général (CPAM) + IRCANTEC",
    explication:
      "Vos droits au maintien de rémunération par la Ville de Gennevilliers dépendent de votre ancienneté de services publics (Décret n°88-145). En parallèle, la CPAM verse des Indemnités Journalières (IJSS).",
    commentSavoir:
      "Vous avez signé un contrat de travail (CDD ou CDI) avec la collectivité et cotisez à l'IRCANTEC.",
    bulletPoints: [
      "Droits en maladie ordinaire progressifs selon l'ancienneté (dès 4 mois de services)",
      "Congé de Grave Maladie (CGM) ouvert à partir de 3 ans d'ancienneté continue",
      "Important : transmettez vos volets d'arrêt à la fois à la DRH (volet 3) ET à la CPAM (volets 1 et 2)"
    ]
  }
};

const TYPE_CONGE_GUIDE: Record<
  TypeConge,
  {
    label: string;
    badge: string;
    definition: string;
    demarches: string;
    carenceEtPrimes: string;
    conseilMedical: string;
  }
> = {
  cmo: {
    label: "Congé de Maladie Ordinaire (CMO) — Arrêt maladie courant",
    badge: "Le plus fréquent",
    definition:
      "Arrêt prescrit par votre médecin traitant ou hospitalier pour une affection courante ne relevant pas d'une longue maladie ou d'un accident du travail.",
    demarches:
      "Envoyez le volet 3 de votre avis d'arrêt de travail à la DRH sous 48 heures maximum. (Si vous êtes contractuel ou IRCANTEC, envoyez aussi les volets 1 et 2 à votre CPAM).",
    carenceEtPrimes:
      "1 jour de carence s'applique le 1er jour de l'arrêt (sauf prolongation ou 2e arrêt lié à une ALD). Depuis le 1er mars 2025 (Décret n° 2025-197), les 3 premiers mois sont rémunérés à 90 % du traitement indiciaire.",
    conseilMedical:
      "Pas d'avis du Conseil Médical pour les 6 premiers mois. Au-delà de 12 mois consécutifs, l'avis du Conseil Médical est obligatoire pour reprendre ou prolonger."
  },
  clm: {
    label: "Congé de Longue Maladie (CLM) — Affection invalidante et grave",
    badge: "Titulaires CNRACL • Max 3 ans",
    definition:
      "Destiné aux affections graves et invalidantes nécessitant un traitement et des soins prolongés (liste indicative fixée par arrêté du 14 mars 1986 ou hors liste après avis du Conseil Médical).",
    demarches:
      "Vous devez adresser un courrier de demande de CLM à la DRH accompagné d'un certificat de votre médecin traitant et d'un pli confidentiel médical destiné au Conseil Médical.",
    carenceEtPrimes:
      "Aucun jour de carence (si le CMO est requalifié rétroactivement en CLM, le jour de carence prélevé vous est remboursé). Rémunération : 1 an à 100 % (plein traitement) puis 2 ans à 50 %.",
    conseilMedical:
      "Octroi et renouvellement par périodes de 3 à 6 mois après avis obligatoire du Conseil Médical."
  },
  cld: {
    label: "Congé de Longue Durée (CLD) — 5 groupes d'affections spécifiques",
    badge: "Titulaires CNRACL • Max 5 ans",
    definition:
      "Réservé à 5 catégories d'affections : affection cancéreuse, maladie mentale, tuberculose, poliomyélite ou déficit immunitaire grave et acquis. Accordé en général après la 1re année à plein traitement de CLM.",
    demarches:
      "Demande écrite de l'agent + certificat médical sous pli confidentiel soumis au Conseil Médical. Attention : un CLD n'est accordé qu'une seule fois par groupe d'affection au cours de toute la carrière.",
    carenceEtPrimes:
      "Aucun jour de carence. Rémunération très protectrice : 3 ans à 100 % (plein traitement) puis 2 ans à 50 % (demi-traitement).",
    conseilMedical:
      "Avis obligatoire du Conseil Médical pour l'octroi, le renouvellement et la réintégration."
  },
  cgm: {
    label: "Congé de Grave Maladie (CGM) — Affection grave (IRCANTEC / Contractuel)",
    badge: "IRCANTEC & Contractuels • Max 3 ans",
    definition:
      "Équivalent du CLM pour les titulaires à temps non complet (< 28h) et les agents contractuels (justifiant d'au moins 3 ans de services continus). Concerne une affection caractère invalidant et de gravité confirmée.",
    demarches:
      "Demande écrite à l'autorité territoriale accompagnée d'un certificat médical détaillé sous pli confidentiel.",
    carenceEtPrimes:
      "1 an à plein traitement (100 %) suivi de 2 ans à demi-traitement (50 %), sous déduction des indemnités journalières (IJSS) de la CPAM.",
    conseilMedical:
      "Accordé par périodes de 3 à 6 mois sur avis du Conseil Médical."
  },
  accident: {
    label: "Accident de service, de mission ou de trajet / Maladie pro. (CITIS)",
    badge: "Imputable au service",
    definition:
      "Accident survenu sur le lieu et le temps de travail, en mission, ou sur le trajet direct domicile-travail, ou maladie contractée dans l'exercice des fonctions.",
    demarches:
      "Déclaration d'accident de service à transmettre sous 15 jours (2 ans maximum) avec le certificat médical initial CERFA décrivant les lésions.",
    carenceEtPrimes:
      "Aucun jour de carence ! Prise en charge à 100 % du traitement (selon la durée prévue par votre statut) ainsi que le remboursement des frais médicaux liés à l'accident.",
    conseilMedical:
      "En cas de doute sur l'imputabilité au service ou d'arrêt prolongé, l'employeur peut diligenter une expertise médicale agréée et saisir le Conseil Médical."
  }
};

export const CongesMaladie: React.FC = () => {
  // Statut de l'agent : CNRACL, IRCANTEC ou Contractuel (Régime Général)
  const [statut, setStatut] = useState<StatutAgent>("titulaire_cnracl");
  const [typeConge, setTypeConge] = useState<TypeConge>("cmo");

  // Bulles d'aide ouvertes
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  // Dates
  const [dateFonction, setDateFonction] = useState<string>("");
  const [trancheAnciennete, setTrancheAnciennete] = useState<"moins_4m" | "4m_2a" | "2a_3a" | "plus_3a">("plus_3a");
  const [dateArret, setDateArret] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");

  // Onglet pour le tableau de référence
  const [activeTableTab, setActiveTableTab] = useState<"ircantec" | "contractuel" | "cnracl">("cnracl");

  // Historique des arrêts pour le calcul glissant
  const [historique, setHistorique] = useState<Arret[]>([]);
  const [showResult, setShowResult] = useState<boolean>(true);

  const toggleHelp = (id: string) => {
    setActiveHelp(prev => (prev === id ? null : id));
  };

  const handleInputChange = <T,>(setter: (val: T) => void, value: T) => {
    setter(value);
    setShowResult(true);
  };

  const handleStatutChange = (newStatut: StatutAgent) => {
    setStatut(newStatut);
    setTypeConge("cmo");
    setShowResult(true);
    if (newStatut === "titulaire_ircantec") {
      setActiveTableTab("ircantec");
    } else if (newStatut === "contractuel") {
      setActiveTableTab("contractuel");
    } else {
      setActiveTableTab("cnracl");
    }
  };

  const addArretHistorique = () => {
    setHistorique([...historique, { id: Date.now().toString(), debut: "", fin: "" }]);
    setShowResult(true);
  };

  const updateArretHistorique = (id: string, field: "debut" | "fin", value: string) => {
    setHistorique(historique.map(h => (h.id === id ? { ...h, [field]: value } : h)));
    setShowResult(true);
  };

  const removeArretHistorique = (id: string) => {
    setHistorique(historique.filter(h => h.id !== id));
    setShowResult(true);
  };

  // Helper pour parser la date en UTC stricte
  const parseDateUTC = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    return new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  };

  // Calcul automatique de l'ancienneté en années
  const getAncienneteYears = () => {
    if (!dateFonction) {
      switch (trancheAnciennete) {
        case "moins_4m":
          return 0.2;
        case "4m_2a":
          return 1;
        case "2a_3a":
          return 2.5;
        case "plus_3a":
          return 3.5;
      }
    }
    const dFonc = parseDateUTC(dateFonction);
    const dArr = dateArret ? parseDateUTC(dateArret) : new Date();
    if (!dFonc || !dArr) return 3;

    let months = (dArr.getUTCFullYear() - dFonc.getUTCFullYear()) * 12;
    months -= dFonc.getUTCMonth();
    months += dArr.getUTCMonth();
    return Math.max(0, months / 12);
  };

  const getDureeArret = () => {
    if (!dateArret || !dateFin) return 0;
    const debut = parseDateUTC(dateArret);
    const fin = parseDateUTC(dateFin);
    if (!debut || !fin || fin.getTime() < debut.getTime()) return 0;
    const diffTime = fin.getTime() - debut.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calcule les jours de CMO consommés dans l'année glissante précédant le NOUVEL arrêt
  const getCmoConsomme = () => {
    if (!dateArret) return 0;
    const dateNouvelArret = parseDateUTC(dateArret);
    if (!dateNouvelArret) return 0;

    const dateReference = new Date(dateNouvelArret);
    dateReference.setUTCFullYear(dateReference.getUTCFullYear() - 1);

    let joursConsommes = 0;

    historique.forEach(h => {
      if (h.debut && h.fin) {
        const dDebut = parseDateUTC(h.debut);
        const dFin = parseDateUTC(h.fin);

        if (dDebut && dFin && dFin.getTime() >= dDebut.getTime()) {
          const intersectionDebut = dDebut.getTime() > dateReference.getTime() ? dDebut : dateReference;
          const veilleNouvelArret = new Date(dateNouvelArret);
          veilleNouvelArret.setUTCDate(veilleNouvelArret.getUTCDate() - 1);

          const intersectionFin = dFin.getTime() < veilleNouvelArret.getTime() ? dFin : veilleNouvelArret;

          if (intersectionFin.getTime() >= intersectionDebut.getTime()) {
            const diffTime = intersectionFin.getTime() - intersectionDebut.getTime();
            joursConsommes += Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
          }
        }
      }
    });

    return joursConsommes;
  };

  const calculateDroitsCmo = (maxPt: number, maxDt: number) => {
    const consomme = getCmoConsomme();
    const dureeArret = getDureeArret();

    // Avant cet arrêt
    const restePtAvant = Math.max(0, maxPt - consomme);
    const dtDejaConsomme = Math.max(0, consomme - maxPt);
    const resteDtAvant = Math.max(0, maxDt - dtDejaConsomme);

    // Application sur l'arrêt actuel
    const ptApplique = Math.min(dureeArret, restePtAvant);
    const joursRestantsApresPT = dureeArret - ptApplique;
    const dtApplique = Math.min(joursRestantsApresPT, resteDtAvant);
    const sansTraitementApplique = joursRestantsApresPT - dtApplique;

    return {
      dureeArret,
      ptApplique,
      dtApplique,
      sansTraitementApplique,
      consomme,
      restePtAvant,
      resteDtAvant,
      maxPt,
      maxDt
    };
  };

  const getDroitsSpecifiques = () => {
    const hasDates = Boolean(dateArret && dateFin && getDureeArret() > 0);

    // 1. TITULAIRE CNRACL
    if (statut === "titulaire_cnracl") {
      switch (typeConge) {
        case "cmo": {
          const cmo = calculateDroitsCmo(90, 270);
          return {
            title: "Maladie Ordinaire (CMO) — Titulaire CNRACL",
            dureeMax: hasDates
              ? `Simulation pour votre arrêt de ${cmo.dureeArret} jour(s) (sur 12 mois glissants)`
              : "Plafond légal : 1 an maximum sur 12 mois glissants (90 jours à 90 % + 270 jours à 50 %)",
            pleinTraitement: hasDates ? `${cmo.ptApplique} j. (à 90 %)` : "90 jours (3 mois à 90 %)",
            demiTraitement: hasDates ? `${cmo.dtApplique} j. (à 50 %)` : "270 jours (9 mois à 50 %)",
            sansTraitement: hasDates && cmo.sansTraitementApplique > 0 ? `${cmo.sansTraitementApplique} j.` : null,
            total: hasDates
              ? `${cmo.ptApplique + cmo.dtApplique + cmo.sansTraitementApplique} jour(s) d'arrêt analysés (dont 1er jour de carence éventuel)`
              : "12 mois de droits sur une période de 365 jours glissants",
            cmoConsomme: cmo.consomme,
            regimeInfo: "Durée max : 1 an (3 mois à 90 %, 9 mois à demi-traitement)"
          };
        }
        case "clm":
          return {
            title: "Congé de Longue Maladie (CLM) — Titulaire CNRACL",
            dureeMax: hasDates
              ? `Durée de l'arrêt saisi : ${getDureeArret()} jour(s) • Plafond : 3 ans par affection`
              : "Durée maximale : 3 ans par affection",
            pleinTraitement: "1 an (100 %)",
            demiTraitement: "2 ans (50 %)",
            total: "3 ans maximum (accordé par périodes de 3 à 6 mois par le Conseil Médical)",
            regimeInfo: "Plein traitement pendant 1 an, demi-traitement pendant 2 ans"
          };
        case "cld":
          return {
            title: "Congé de Longue Durée (CLD) — Titulaire CNRACL",
            dureeMax: hasDates
              ? `Durée de l'arrêt saisi : ${getDureeArret()} jour(s) • Plafond : 5 ans sur la carrière`
              : "Durée maximale : 5 ans pour l'ensemble de la carrière (par groupe d'affections)",
            pleinTraitement: "3 ans (100 %)",
            demiTraitement: "2 ans (50 %)",
            total: "5 ans maximum",
            regimeInfo: "Plein traitement pendant 3 ans, demi-traitement pendant 2 ans"
          };
        case "accident":
          return {
            title: "Accident de service et de trajet (CITIS) — Titulaire CNRACL",
            dureeMax: hasDates
              ? `Durée de l'arrêt saisi : ${getDureeArret()} jour(s) • Couverture jusqu'à guérison ou consolidation`
              : "Jusqu'à la reprise de service, la guérison ou la consolidation",
            pleinTraitement: "100 % (Continu)",
            demiTraitement: "Non applicable (maintien à 100 %)",
            total: "Maintien intégral du traitement indiciaire et remboursement des honoraires médicaux",
            regimeInfo: "Plein traitement maintenu jusqu'à la reprise de service ou reclassement/mise en retraite"
          };
        default:
          return null;
      }
    }

    // 2. TITULAIRE IRCANTEC (Temps non complet < 28h)
    else if (statut === "titulaire_ircantec") {
      switch (typeConge) {
        case "cmo": {
          const cmo = calculateDroitsCmo(90, 270);
          return {
            title: "Maladie Ordinaire (CMO) — Titulaire IRCANTEC (< 28h)",
            dureeMax: hasDates
              ? `Simulation pour votre arrêt de ${cmo.dureeArret} jour(s) (sur 12 mois glissants)`
              : "Plafond légal : 1 an maximum sur 12 mois glissants",
            pleinTraitement: hasDates ? `${cmo.ptApplique} j. (à 90 %)` : "90 jours (3 mois à 90 %)",
            demiTraitement: hasDates ? `${cmo.dtApplique} j. (à 50 %)` : "270 jours (9 mois à 50 %)",
            sansTraitement: hasDates && cmo.sansTraitementApplique > 0 ? `${cmo.sansTraitementApplique} j.` : null,
            total: hasDates
              ? `${cmo.ptApplique + cmo.dtApplique + cmo.sansTraitementApplique} jour(s) d'arrêt analysés`
              : "12 mois de droits sur 365 jours glissants",
            cmoConsomme: cmo.consomme,
            regimeInfo: "Durée max : 1 an (3 mois à 90 %, 9 mois à demi-traitement)"
          };
        }
        case "cgm":
          return {
            title: "Congé de Grave Maladie (CGM) — Titulaire IRCANTEC",
            dureeMax: "3 ans maximum",
            pleinTraitement: "1 an (100 %)",
            demiTraitement: "2 ans (50 %)",
            total: "3 ans (après avis du Conseil Médical)",
            regimeInfo: "Plein traitement (1 an) puis demi-traitement (2 ans)"
          };
        case "accident":
          return {
            title: "Accident de service et de trajet — Titulaire IRCANTEC",
            dureeMax: "Tant que l'agent est inapte à ses fonctions",
            pleinTraitement: "3 ans à 100 %",
            demiTraitement: "Relais IJSS CPAM au-delà de 3 ans",
            total: "3 ans à plein traitement par la Ville, puis IJ directes de la CPAM",
            note: "Au-delà de 3 ans, il n'y a pas de demi-traitement employeur : la CPAM verse directement à l'agent ses indemnités journalières."
          };
        default:
          return null;
      }
    }

    // 3. AGENT CONTRACTUEL (Régime Général de la Sécurité Sociale)
    else {
      const ancYears = getAncienneteYears();

      if (typeConge === "cgm") {
        if (ancYears < 3) {
          return {
            title: "Congé de Grave Maladie (CGM) — Agent Contractuel",
            dureeMax: "Condition d'ancienneté non remplie (< 3 ans)",
            pleinTraitement: "0 jour employeur",
            demiTraitement: "0 jour employeur",
            total: "Relais IJSS CPAM uniquement",
            note: "Attention : l'agent contractuel doit justifier d'au moins 3 ans de services continus pour ouvrir droit au Congé de Grave Maladie rémunéré par l'employeur (en deçà, seules les IJSS de la CPAM sont perçues)."
          };
        }
        return {
          title: "Congé de Grave Maladie (CGM) — Contractuel (≥ 3 ans d'ancienneté)",
          dureeMax: "3 ans maximum",
          pleinTraitement: "1 an (100 %)",
          demiTraitement: "2 ans (50 %)",
          total: "3 ans maximum (sous déduction des IJSS CPAM)",
          regimeInfo: "1 an à plein traitement, 2 ans à demi-traitement"
        };
      } else if (typeConge === "accident") {
        let ptLabel = "1 mois (30 jours)";
        if (ancYears >= 3) {
          ptLabel = "3 mois (90 jours)";
        } else if (ancYears >= 1) {
          ptLabel = "2 mois (60 jours)";
        }

        return {
          title: "Accident du travail ou de trajet — Agent Contractuel",
          dureeMax: `Ancienneté retenue : ${ancYears >= 3 ? "3 ans et plus" : ancYears >= 1 ? "De 1 à 3 ans" : "Moins d'un an"}`,
          pleinTraitement: `${ptLabel} à 100 %`,
          demiTraitement: "Relais IJSS CPAM (**)",
          total: `${ptLabel} de plein traitement maintenu par la Ville, puis relais par les indemnités journalières AT/MP de la CPAM`,
          regimeInfo: "Maintien à 100 % selon l'ancienneté puis versement direct des IJ CPAM"
        };
      } else {
        // CMO Contractuel
        let maxPt = 0,
          maxDt = 0;
        let trancheTexte = "";

        if (ancYears < 4 / 12) {
          maxPt = 0;
          maxDt = 0;
          trancheTexte = "Moins de 4 mois d'ancienneté";
        } else if (ancYears < 2) {
          maxPt = 30;
          maxDt = 30;
          trancheTexte = "Entre 4 mois et 2 ans d'ancienneté";
        } else if (ancYears < 3) {
          maxPt = 60;
          maxDt = 60;
          trancheTexte = "Entre 2 ans et 3 ans d'ancienneté";
        } else {
          maxPt = 90;
          maxDt = 90;
          trancheTexte = "3 ans d'ancienneté et plus";
        }

        if (maxPt === 0) {
          return {
            title: "Maladie Ordinaire (CMO) — Contractuel (< 4 mois)",
            dureeMax: trancheTexte,
            pleinTraitement: "0 jour",
            demiTraitement: "0 jour",
            total: "Indemnités Journalières CPAM uniquement",
            note: "Avec moins de 4 mois de services, l'employeur public ne maintient pas le salaire. Vous percevez directement les Indemnités Journalières de la Sécurité Sociale (IJSS) versées par votre CPAM (sous réserve des conditions d'ouverture de droits)."
          };
        }

        const cmoContractuel = calculateDroitsCmo(maxPt, maxDt);
        return {
          title: `Maladie Ordinaire (CMO) — Contractuel (${trancheTexte})`,
          dureeMax: hasDates
            ? `Arrêt de ${cmoContractuel.dureeArret} jour(s) (Plafond annuel : ${maxPt}j à 90 % / ${maxDt}j à 50 %)`
            : `Plafond selon votre ancienneté : ${maxPt} jours à 90 % puis ${maxDt} jours à 50 %`,
          pleinTraitement: hasDates ? `${cmoContractuel.ptApplique} j. (à 90 %)` : `${maxPt} jours (à 90 %)`,
          demiTraitement: hasDates ? `${cmoContractuel.dtApplique} j. (à 50 %)` : `${maxDt} jours (à 50 %)`,
          sansTraitement:
            hasDates && cmoContractuel.sansTraitementApplique > 0 ? `${cmoContractuel.sansTraitementApplique} j.` : null,
          total: hasDates
            ? `${cmoContractuel.ptApplique + cmoContractuel.dtApplique + cmoContractuel.sansTraitementApplique} jour(s) évalués`
            : `${maxPt + maxDt} jours de maintien de salaire sur 12 mois glissants`,
          cmoConsomme: cmoContractuel.consomme
        };
      }
    }
  };

  const droits = getDroitsSpecifiques();
  const currentStatutGuide = STATUT_GUIDE[statut];
  const currentCongeGuide = TYPE_CONGE_GUIDE[typeConge];

  // Liste des options de congés disponibles selon le statut choisi
  const availableConges: { value: TypeConge; label: string }[] =
    statut === "titulaire_cnracl"
      ? [
          { value: "cmo", label: "🩺 Congé de Maladie Ordinaire (CMO) — Arrêt maladie courant" },
          { value: "clm", label: "🏥 Congé de Longue Maladie (CLM) — Jusqu'à 3 ans (1 an à 100%, 2 ans à 50%)" },
          { value: "cld", label: "🛡️ Congé de Longue Durée (CLD) — Jusqu'à 5 ans (3 ans à 100%, 2 ans à 50%)" },
          { value: "accident", label: "🚑 Accident de service / trajet ou Maladie pro. (CITIS) — Maintien à 100%" }
        ]
      : [
          { value: "cmo", label: "🩺 Congé de Maladie Ordinaire (CMO) — Arrêt maladie courant" },
          {
            value: "cgm",
            label:
              statut === "contractuel"
                ? "🏥 Congé de Grave Maladie (CGM) — Jusqu'à 3 ans (si ≥ 3 ans d'ancienneté)"
                : "🏥 Congé de Grave Maladie (CGM) — Jusqu'à 3 ans (1 an à 100%, 2 ans à 50%)"
          },
          {
            value: "accident",
            label:
              statut === "contractuel"
                ? "🚑 Accident du travail ou de trajet — 1 à 3 mois à 100% puis relais CPAM"
                : "🚑 Accident de service ou de trajet — 3 ans à 100% puis relais CPAM"
          }
        ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fadeIn pb-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {/* En-tête didactique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-white shadow-md shadow-teal-500/20 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Assistant Didactique — Droits à Congés Maladie
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <Building2 className="w-3 h-3" /> Ville de Gennevilliers
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Répondez pas à pas aux questions ci-dessous : nous vous expliquons vos droits, votre maintien de salaire et vos démarches.
              </p>
            </div>
          </div>
        </div>

        {/* Bandeau de progression pédagogique */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0">
              1
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">Étape 1</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Votre statut</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0">
              2
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">Étape 2</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Nature de l'arrêt</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0">
              3
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">Étape 3</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Vos droits & dates</div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* =====================================================================
              ÉTAPE 1 : QUEL EST VOTRE STATUT ? (MENU DÉROULANT + BULLE D'AIDE)
          ===================================================================== */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <label
                htmlFor="select-statut-agent"
                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5"
              >
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  1
                </span>
                Quel est votre statut au sein de la collectivité ?
              </label>

              <button
                type="button"
                onClick={() => toggleHelp("statut")}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                  activeHelp === "statut"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50"
                }`}
                title="Afficher l'aide sur le choix du statut"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Comment connaître mon statut ?</span>
              </button>
            </div>

            {/* Bulle d'aide interactive Étape 1 */}
            {activeHelp === "statut" && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50/90 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700 text-xs text-slate-700 dark:text-slate-200 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Astuce : où vérifier votre régime sur votre fiche de paie ?
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveHelp(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1.5 pl-1">
                  <li>
                    • <strong>Titulaire ou Stagiaire CNRACL (≥ 28h/semaine) :</strong> Vous avez été nommé par arrêté municipal (stagiaire ou titulaire) et travaillez au moins 28h par semaine (ex: temps complet 35h ou temps partiel sur un poste à temps complet). Votre fiche de paie mentionne la cotisation <strong>CNRACL</strong>.
                  </li>
                  <li>
                    • <strong>Titulaire ou Stagiaire IRCANTEC (&lt; 28h/semaine) :</strong> Vous êtes fonctionnaire nommé sur un poste à <em>temps non complet</em> de moins de 28h hebdomadaires. Vous cotisez à l'<strong>IRCANTEC</strong> et dépendez de la CPAM.
                  </li>
                  <li>
                    • <strong>Agent Contractuel (CDD / CDI) :</strong> Vous avez signé un contrat de travail avec la Mairie (remplacement, accroissement temporaire, emploi permanent). Vous cotisez à l'<strong>IRCANTEC</strong> et au Régime Général (CPAM).
                  </li>
                </ul>
              </div>
            )}

            {/* Menu déroulant du statut */}
            <div className="relative">
              <select
                id="select-statut-agent"
                value={statut}
                onChange={e => handleStatutChange(e.target.value as StatutAgent)}
                className="w-full appearance-none bg-gradient-to-r from-teal-50 via-emerald-50/80 to-teal-100/70 dark:from-teal-950/70 dark:via-slate-900 dark:to-teal-950/70 hover:from-teal-100 hover:via-emerald-100 hover:to-teal-100 dark:hover:from-teal-900/80 dark:hover:via-slate-800 dark:hover:to-teal-900/80 border-2 border-teal-500 dark:border-teal-400 hover:border-teal-600 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/25 rounded-xl px-4 py-3.5 pr-28 text-sm sm:text-base font-black text-slate-900 dark:text-white shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <option value="titulaire_cnracl" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  🏛️ Fonctionnaire Titulaire ou Stagiaire — Temps complet ou ≥ 28h/semaine (CNRACL)
                </option>
                <option value="titulaire_ircantec" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  🏛️ Fonctionnaire Titulaire ou Stagiaire — Temps non complet &lt; 28h/semaine (IRCANTEC)
                </option>
                <option value="contractuel" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  📄 Agent Contractuel (CDD ou CDI) — Affilié au Régime Général (CPAM)
                </option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
                <span className="hidden sm:inline-flex items-center text-[11px] font-black uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                  Choisir
                </span>
                <ChevronDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>

            {/* Encart pédagogique dynamique sur le statut choisi */}
            <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 shrink-0" />
                  Ce qu'implique votre statut : {currentStatutGuide.shortLabel}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                  {currentStatutGuide.caisse}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentStatutGuide.explication}</p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                💡 <strong>Vérification rapide :</strong> {currentStatutGuide.commentSavoir}
              </div>
            </div>
          </div>

          {/* =====================================================================
              SOUS-ÉTAPE 1B (SI CONTRACTUEL) : ANCIENNETÉ AVEC MENU DÉROULANT + BULLE D'AIDE
          ===================================================================== */}
          {statut === "contractuel" && (
            <div className="p-4 sm:p-5 bg-teal-50/60 dark:bg-teal-950/25 border-2 border-teal-200 dark:border-teal-800/70 rounded-2xl space-y-3.5 animate-fadeIn">
              <div className="flex items-start justify-between gap-2">
                <label
                  htmlFor="select-anciennete-contractuel"
                  className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <UserCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  Quelle est votre ancienneté de services publics ?
                </label>

                <button
                  type="button"
                  onClick={() => toggleHelp("anciennete")}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                    activeHelp === "anciennete"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Comment est calculée mon ancienneté ?</span>
                </button>
              </div>

              {activeHelp === "anciennete" && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-xs text-slate-700 dark:text-slate-200 space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-teal-800 dark:text-teal-300 flex items-center justify-between">
                    <span>Calcul de l'ancienneté (Décret n°88-145)</span>
                    <button type="button" onClick={() => setActiveHelp(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p>
                    Pour un agent contractuel, la durée de maintien de salaire dépend de votre durée de services effectifs auprès de la collectivité (contrats renouvelés sans interruption ou avec une interruption inférieure à 4 mois).
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Choisissez votre tranche d'ancienneté :
                  </label>
                  <div className="relative">
                    <select
                      id="select-anciennete-contractuel"
                      value={trancheAnciennete}
                      onChange={e => {
                        setTrancheAnciennete(e.target.value as "moins_4m" | "4m_2a" | "2a_3a" | "plus_3a");
                        setDateFonction("");
                        setShowResult(true);
                      }}
                      className="w-full appearance-none bg-gradient-to-r from-teal-50 via-emerald-50/80 to-teal-100/70 dark:from-teal-950/70 dark:via-slate-900 dark:to-teal-950/70 hover:from-teal-100 hover:via-emerald-100 hover:to-teal-100 dark:hover:from-teal-900/80 dark:hover:via-slate-800 dark:hover:to-teal-900/80 border-2 border-teal-500 dark:border-teal-400 hover:border-teal-600 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/25 rounded-xl px-3.5 py-3 pr-24 text-xs sm:text-sm font-black text-slate-900 dark:text-white shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <option value="moins_4m" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">⏳ Moins de 4 mois d'ancienneté (IJSS CPAM uniquement)</option>
                      <option value="4m_2a" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">📅 De 4 mois à moins de 2 ans (1 mois à 90% + 1 mois à 50%)</option>
                      <option value="2a_3a" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">📅 De 2 ans à moins de 3 ans (2 mois à 90% + 2 mois à 50%)</option>
                      <option value="plus_3a" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">⭐ 3 ans d'ancienneté et plus (3 mois à 90% + 3 mois à 50%)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
                      <span className="hidden sm:inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                        Choisir
                      </span>
                      <ChevronDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ou indiquez votre date d'entrée (calcul auto) :
                  </label>
                  <input
                    type="date"
                    value={dateFonction}
                    onChange={e => handleInputChange(setDateFonction, e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              ÉTAPE 2 : NATURE DE L'ARRÊT (MENU DÉROULANT + BULLE D'AIDE)
          ===================================================================== */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <label
                htmlFor="select-nature-arret"
                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5"
              >
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  2
                </span>
                Quelle est la nature de votre arrêt de travail ?
              </label>

              <button
                type="button"
                onClick={() => toggleHelp("nature")}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                  activeHelp === "nature"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50"
                }`}
                title="Afficher les différences entre CMO, CLM, CLD, CGM et CITIS"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quelle différence entre ces congés ?</span>
              </button>
            </div>

            {/* Bulle d'aide comparative sur les types d'arrêts */}
            {activeHelp === "nature" && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50/90 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700 text-xs text-slate-700 dark:text-slate-200 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Guide rapide pour bien choisir la nature de votre arrêt :
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveHelp(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1.5 pl-1">
                  <li>
                    • <strong>Maladie Ordinaire (CMO) :</strong> C'est l'arrêt de travail classique prescrit par votre médecin (grippe, opération, lumbago, fatigue, etc.).
                  </li>
                  {statut === "titulaire_cnracl" ? (
                    <>
                      <li>
                        • <strong>Longue Maladie (CLM — jusqu'à 3 ans) :</strong> Pour une maladie grave et invalidante nécessitant des soins prolongés, après accord du Conseil Médical.
                      </li>
                      <li>
                        • <strong>Longue Durée (CLD — jusqu'à 5 ans) :</strong> Réservé à 5 pathologies lourdes (cancer, maladie mentale, tuberculose, poliomyélite, déficit immunitaire grave).
                      </li>
                    </>
                  ) : (
                    <li>
                      • <strong>Grave Maladie (CGM — jusqu'à 3 ans) :</strong> Pour une affection invalidante et de gravité confirmée nécessitant des soins prolongés (accordé après avis du Conseil Médical).
                    </li>
                  )}
                  <li>
                    • <strong>Accident de service / trajet (CITIS / AT) :</strong> Si l'arrêt fait suite à un accident survenu au travail, sur le trajet domicile-travail, ou à une maladie professionnelle reconnue.
                  </li>
                </ul>
              </div>
            )}

            {/* Menu déroulant de la nature de l'arrêt */}
            <div className="relative">
              <select
                id="select-nature-arret"
                value={typeConge}
                onChange={e => handleInputChange(setTypeConge, e.target.value as TypeConge)}
                className="w-full appearance-none bg-gradient-to-r from-teal-50 via-emerald-50/80 to-teal-100/70 dark:from-teal-950/70 dark:via-slate-900 dark:to-teal-950/70 hover:from-teal-100 hover:via-emerald-100 hover:to-teal-100 dark:hover:from-teal-900/80 dark:hover:via-slate-800 dark:hover:to-teal-900/80 border-2 border-teal-500 dark:border-teal-400 hover:border-teal-600 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/25 rounded-xl px-4 py-3.5 pr-28 text-sm sm:text-base font-black text-slate-900 dark:text-white shadow-sm hover:shadow transition-all cursor-pointer"
              >
                {availableConges.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
                <span className="hidden sm:inline-flex items-center text-[11px] font-black uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                  Choisir
                </span>
                <ChevronDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>

            {/* Fiche didactique sur l'arrêt sélectionné */}
            <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>À savoir sur : {currentCongeGuide.label}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300">
                  {currentCongeGuide.badge}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{currentCongeGuide.definition}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700">
                  <div className="font-bold text-teal-700 dark:text-teal-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Démarche & Délai
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentCongeGuide.demarches}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Carence & Rémunération
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentCongeGuide.carenceEtPrimes}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700">
                  <div className="font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Contrôle & Conseil Médical
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentCongeGuide.conseilMedical}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              ÉTAPE 3 : SYNTHÈSE IMMÉDIATE DES DROITS + CALCULATEUR SUR DATES (OPTIONNEL)
          ===================================================================== */}
          <div className="bg-gradient-to-br from-teal-50 via-emerald-50/80 to-slate-50 dark:from-teal-950/40 dark:via-slate-900/70 dark:to-slate-900 border-2 border-teal-400/80 dark:border-teal-700 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/80 dark:border-teal-800/60 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white mb-2 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Étape 3 • Vos droits applicables
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{droits?.title}</h3>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">{droits?.dureeMax}</div>
              </div>
            </div>

            {droits?.note ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <div className="leading-relaxed">{droits.note}</div>
              </div>
            ) : (
              <div
                className={`grid gap-3.5 ${
                  droits?.sansTraitement ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {/* Plein traitement / 90% */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 text-center shadow-sm border border-teal-200 dark:border-teal-800/60">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    {typeConge === "cmo" ? "Traitement à 90 % (1re période)" : "Plein Traitement (100 %)"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                    {droits?.pleinTraitement}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {typeConge === "cmo"
                      ? "90 % du traitement indiciaire (Réforme du 1er mars 2025)"
                      : "100 % du traitement indiciaire maintenu"}
                  </div>
                </div>

                {/* Demi-traitement */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 text-center shadow-sm border border-amber-200 dark:border-amber-800/60">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    Demi-Traitement (2e période)
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
                    {droits?.demiTraitement}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    50 % du traitement (ou relais IJSS CPAM selon statut)
                  </div>
                </div>

                {/* Sans traitement (si dépassement) */}
                {droits?.sansTraitement && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 text-center shadow-sm border border-rose-200 dark:border-rose-800/60">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                      Droits Épuisés / Sans Traitement
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400">
                      {droits?.sansTraitement}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Disponibilité d'office pour raison de santé ou relais CPAM
                    </div>
                  </div>
                )}
              </div>
            )}

            {droits?.total && !droits?.note && (
              <div className="p-3 rounded-xl bg-teal-100/70 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-center font-bold text-teal-900 dark:text-teal-200 text-xs sm:text-sm">
                📌 Synthèse : {droits.total}
              </div>
            )}

            {/* Simulateur précis jour par jour (Dates + Année glissante) */}
            <div className="pt-3 border-t border-teal-200/80 dark:border-teal-800/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-teal-600" />
                  Simuler un arrêt précis avec vos dates (optionnel)
                </h4>

                {typeConge === "cmo" && (
                  <button
                    type="button"
                    onClick={() => toggleHelp("glissant")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      activeHelp === "glissant"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Qu'est-ce que le calcul sur « 12 mois glissants » ?</span>
                  </button>
                )}
              </div>

              {activeHelp === "glissant" && typeConge === "cmo" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/50 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-600 text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-3 animate-fadeIn shadow-sm">
                  <div className="font-extrabold text-amber-950 dark:text-amber-200 flex items-center justify-between border-b border-amber-200 dark:border-amber-800 pb-2">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Comprendre la règle des 365 jours glissants en Maladie Ordinaire (CMO)
                    </span>
                    <button type="button" onClick={() => setActiveHelp(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Réponse directe et sans ambiguïté à la question statutaire */}
                  <div className="p-3 bg-amber-100/80 dark:bg-amber-900/40 rounded-xl border border-amber-300 dark:border-amber-700 font-bold text-amber-950 dark:text-amber-100 flex items-start gap-2.5">
                    <span className="text-base shrink-0">🎯</span>
                    <div>
                      <strong className="block text-amber-900 dark:text-amber-200">
                        À quelle date commence et s'applique la période des 365 jours ?
                      </strong>
                      <p className="font-normal text-xs mt-1 leading-relaxed text-slate-800 dark:text-slate-200">
                        La règle s'applique <strong>AU JOUR LE JOUR pour CHAQUE JOUR de votre nouvel arrêt</strong> (et non pas une seule fois au 1er jour, ni rétroactivement à la fin de l'arrêt) !
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                      <strong>1. Comment la DRH évalue-t-elle concrètement chaque journée ?</strong><br />
                      Pour <strong>chaque jour J d'absence</strong> (du premier au dernier jour de votre arrêt), la collectivité regarde la fenêtre des <strong>365 jours calendaires qui précèdent immédiatement cette date</strong> (de <em>J - 365 jours</em> à <em>J - 1 jour</em>) :
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-300">
                      <li>Si le cumul des arrêts sur cette période de 365 jours est <strong>inférieur à 90 jours</strong> : la journée J est indemnisée à <strong>90 %</strong> (ou 100 % selon le régime).</li>
                      <li>Dès que le cumul de 90 jours est atteint : les journées suivantes basculent à <strong>demi-traitement (50 %)</strong>.</li>
                      <li>Au-delà de 360 jours cumulés sur la fenêtre glissante : les droits à maintien de salaire sont épuisés.</li>
                    </ul>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/80 space-y-1.5">
                      <strong className="text-amber-900 dark:text-amber-300 font-bold flex items-center gap-1.5">
                        💡 Pourquoi l'évaluation au jour le jour est très avantageuse pour l'agent ?
                      </strong>
                      <p className="text-slate-600 dark:text-slate-300">
                        Pendant que votre arrêt se déroule, le calendrier avance : des arrêts maladie pris il y a plus d'un an (366 jours ou plus) <strong>sortent progressivement de la fenêtre glissante</strong> !
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        <strong>Exemple concret :</strong> Si vous avez eu 30 jours d'arrêt en mai de l'année précédente et que vous êtes à nouveau arrêté en mai de cette année, dès le 31 mai, vos 30 jours de l'an dernier s'effacent de la période de référence. Vous pouvez ainsi <strong>reconstituer des jours à plein traitement (ou 90 %) en cours d'arrêt sans avoir repris le travail</strong> !
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date de début de votre arrêt
                  </label>
                  <input
                    type="date"
                    value={dateArret}
                    onChange={e => handleInputChange(setDateArret, e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date de fin prévisionnelle de l'arrêt
                  </label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={e => handleInputChange(setDateFin, e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Historique des arrêts (Affiché seulement pour le CMO) */}
              {typeConge === "cmo" && (
                <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-600 rounded-3xl shadow-md shadow-amber-500/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/30 shrink-0 mt-0.5">
                        <Clock className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm sm:text-base font-black text-amber-950 dark:text-amber-200">
                            Avez-vous déjà eu d'autres arrêts maladie dans les 12 derniers mois ?
                          </h5>
                          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full border border-amber-300 dark:border-amber-700">
                            Règle de l'année glissante
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                          Ajoutez vos arrêts antérieurs pour déduire automatiquement les jours déjà consommés sur l'année glissante (en l'espèce, <strong>jusqu'à 365 jours à la date du dernier jour du dernier arrêt</strong>).
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addArretHistorique}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md shadow-amber-500/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Ajouter un arrêt précédent</span>
                    </button>
                  </div>

                  {/* Précision expresse de la date : jusqu'à 365 jours à la date du dernier jour de l'arrêt */}
                  <div className="p-3.5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200">
                      <CalendarIcon className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Périmètre des dates à déclarer (jusqu'à 365 jours à la date du dernier jour du dernier arrêt) :</span>
                    </div>
                    {dateArret && dateFin ? (
                      <p className="leading-relaxed">
                        Pour votre arrêt du <strong>{new Date(dateArret).toLocaleDateString("fr-FR")}</strong> au <strong>{new Date(dateFin).toLocaleDateString("fr-FR")}</strong>, 
                        vous devez renseigner tous vos arrêts survenus <strong>jusqu'à 365 jours à la date du dernier jour de cet arrêt</strong> (soit du{" "}
                        <strong className="text-amber-700 dark:text-amber-400">
                          {(() => {
                            const d = parseDateUTC(dateFin);
                            if (!d) return "...";
                            d.setUTCFullYear(d.getUTCFullYear() - 1);
                            return d.toLocaleDateString("fr-FR");
                          })()}
                        </strong>{" "}
                        au{" "}
                        <strong className="text-amber-700 dark:text-amber-400">
                          {new Date(dateFin).toLocaleDateString("fr-FR")}
                        </strong>
                        ). Chaque jour de votre arrêt est examiné individuellement au regard des 365 jours qui le précèdent.
                      </p>
                    ) : dateArret ? (
                      <p className="leading-relaxed">
                        Pour votre arrêt débutant le <strong>{new Date(dateArret).toLocaleDateString("fr-FR")}</strong>, 
                        renseignez tous vos arrêts survenus depuis le{" "}
                        <strong className="text-amber-700 dark:text-amber-400">
                          {(() => {
                            const d = parseDateUTC(dateArret);
                            if (!d) return "...";
                            d.setUTCFullYear(d.getUTCFullYear() - 1);
                            return d.toLocaleDateString("fr-FR");
                          })()}
                        </strong>{" "}
                        et jusqu'à 365 jours à la date du dernier jour de votre arrêt (en cas de prolongation).
                      </p>
                    ) : (
                      <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                        Indiquez tous vos arrêts maladie intervenus <strong>jusqu'à 365 jours à la date du dernier jour de votre dernier arrêt</strong>. 
                        <em>(Renseignez les dates de début et de fin de votre arrêt ci-dessus pour afficher la période calendaire exacte).</em>
                      </p>
                    )}
                  </div>

                  {historique.length > 0 ? (
                    <div className="space-y-3 pt-2 border-t border-amber-200/80 dark:border-amber-800/60">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                        <span>Arrêts précédents déclarés ({historique.length}) :</span>
                        <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                          Les dates servent à calculer vos droits restants à plein / demi-traitement
                        </span>
                      </div>

                      {historique.map((arret, index) => (
                        <div
                          key={arret.id}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-800/70 rounded-2xl shadow-xs"
                        >
                          <span className="text-xs font-black text-amber-700 dark:text-amber-400 px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg">
                            #{index + 1}
                          </span>
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Date de début
                              </label>
                              <input
                                type="date"
                                value={arret.debut}
                                onChange={e => updateArretHistorique(arret.id, "debut", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Date de fin
                              </label>
                              <input
                                type="date"
                                value={arret.fin}
                                onChange={e => updateArretHistorique(arret.id, "fin", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeArretHistorique(arret.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer mt-3"
                            title="Supprimer cet arrêt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {dateArret && (
                        <div className="p-3.5 rounded-2xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 flex items-center gap-3">
                          <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                          <div className="leading-snug">
                            Jours d'arrêt déjà consommés sur les 12 mois précédant le{" "}
                            <strong>{new Date(dateArret).toLocaleDateString("fr-FR")}</strong> :{" "}
                            <span className="font-black text-amber-700 dark:text-amber-300 text-sm">
                              {droits?.cmoConsomme ?? 0} jour(s)
                            </span>.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-100/40 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                      <span>💡 Si vous n'avez pas eu d'arrêt dans l'année écoulée, vos droits sont intacts (0 jour déduit).</span>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">0 jour consommé</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. TABLEAUX OFFICIELS DE GENNEVILLIERS (REPRODUCTION FIDÈLE DES MATRICES) */}
        <div className="mt-10 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-900/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                <ShieldAlert className="w-4 h-4 text-teal-600" />
                Barèmes officiels de prise en charge de la rémunération — Ville de Gennevilliers
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Protocole temps de travail (Article 3 : Prise en charge de la rémunération)
              </p>
            </div>
            
            {/* Onglets des 3 tableaux */}
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTableTab("ircantec")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTableTab === "ircantec"
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Titulaires IRCANTEC
              </button>
              <button
                type="button"
                onClick={() => setActiveTableTab("contractuel")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTableTab === "contractuel"
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Contractuels Régime Général
              </button>
              <button
                type="button"
                onClick={() => setActiveTableTab("cnracl")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTableTab === "cnracl"
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Titulaires CNRACL
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 overflow-x-auto">
            {/* TABLEAU 1 : POUR LES AGENTS TITULAIRES AFFILIES A L'IRCANTEC */}
            {activeTableTab === "ircantec" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-red-600 uppercase tracking-wide border-b-2 border-red-500 pb-1">
                  POUR LES AGENTS TITULAIRES AFFILIÉS À L'IRCANTEC
                </div>
                <table className="w-full border-collapse text-xs sm:text-sm text-center">
                  <thead>
                    <tr>
                      <th className="bg-[#4d826f] text-white p-3 font-bold text-left rounded-tl-xl border border-[#3b6657] w-1/4">
                        Nature de l'arrêt
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Durée maximum
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Plein traitement (salaire complet)
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] rounded-tr-xl w-1/4">
                        Demi-traitement (demi-salaire)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        Maladie ordinaire
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">1 an</td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">
                        3 mois à 90%
                      </td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">
                        9 mois
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        Grave maladie
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">3 ans</td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">
                        1 an
                      </td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">
                        2 ans
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-bl-xl">
                        Accident de service et de trajet
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">
                        Tant que l'agent est inapte à ses fonctions
                      </td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">
                        3 ans
                      </td>
                      <td className="p-3 text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-br-xl font-medium">
                        Pas de demi-traitement, la CPAM versera directement à l'agent ses indemnités journalières
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLEAU 2 : POUR LES AGENTS CONTRACTUELS AFFILIES AU REGIME GENERAL */}
            {activeTableTab === "contractuel" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-red-600 uppercase tracking-wide border-b-2 border-red-500 pb-1">
                  POUR LES AGENTS CONTRACTUELS AFFILIÉS AU RÉGIME GÉNÉRAL DE LA SÉCURITÉ SOCIALE
                </div>
                <table className="w-full border-collapse text-xs sm:text-sm text-center">
                  <thead>
                    <tr>
                      <th className="bg-[#4d826f] text-white p-3 font-bold text-left rounded-tl-xl border border-[#3b6657] w-1/4">
                        Nature de l'arrêt
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Ancienneté de l'agent
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Plein traitement (salaire complet)
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] rounded-tr-xl w-1/4">
                        Demi-traitement (demi-salaire)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Maladie ordinaire 4 tranches */}
                    <tr>
                      <td rowSpan={4} className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20 align-middle">
                        Maladie ordinaire
                      </td>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&lt; 4 mois</td>
                      <td colSpan={2} className="p-2.5 text-xs text-slate-500 border border-slate-300 dark:border-slate-700 italic">
                        Aucun maintien employeur (IJSS CPAM uniquement)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&gt; 4 mois &lt; 2 ans</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">1 mois à 90%</td>
                      <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">1 mois</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">2 ans &lt; 3 ans</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">2 mois à 90%</td>
                      <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">2 mois</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&gt; 3 ans</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">3 mois à 90%</td>
                      <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">3 mois</td>
                    </tr>

                    {/* Grave maladie */}
                    <tr>
                      <td rowSpan={2} className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20 align-middle">
                        Grave maladie
                      </td>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&lt; 3 ans</td>
                      <td colSpan={2} className="p-2.5 text-xs text-slate-500 border border-slate-300 dark:border-slate-700 italic">
                        Aucun droit au CGM (3 ans de services requis)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">3 ans et plus</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">1 an</td>
                      <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">2 ans</td>
                    </tr>

                    {/* Accident de service et de trajet */}
                    <tr>
                      <td rowSpan={3} className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-bl-xl align-middle">
                        Accident de service et de trajet
                      </td>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&lt; 1 an</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">1 mois</td>
                      <td rowSpan={3} className="p-3 text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-br-xl font-medium align-middle">
                        (**) Relais par la CPAM en indemnités journalières
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">1 =&gt; 3 ans</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">2 mois</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700">&gt; 3 ans</td>
                      <td className="p-2.5 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">3 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLEAU 3 : POUR LES AGENTS TITULAIRES AFFILIES A LA CNRACL */}
            {activeTableTab === "cnracl" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-red-600 uppercase tracking-wide border-b-2 border-red-500 pb-1">
                  POUR LES AGENTS TITULAIRES AFFILIÉS À LA CNRACL (RÉGIME SPÉCIAL)
                </div>
                <table className="w-full border-collapse text-xs sm:text-sm text-center">
                  <thead>
                    <tr>
                      <th className="bg-[#4d826f] text-white p-3 font-bold text-left rounded-tl-xl border border-[#3b6657] w-1/4">
                        Nature de l'arrêt
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Durée maximum
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] w-1/4">
                        Plein traitement (salaire complet)
                      </th>
                      <th className="bg-[#e5a000] text-white p-3 font-extrabold border border-[#c48800] rounded-tr-xl w-1/4">
                        Demi-traitement (demi-salaire)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        Maladie ordinaire (CMO)
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">1 an</td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">3 mois à 90%</td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">9 mois</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        Longue maladie (CLM)
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">3 ans</td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">1 an</td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">2 ans</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        Longue durée (CLD)
                      </td>
                      <td className="p-3 font-bold border border-slate-300 dark:border-slate-700">5 ans</td>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700">3 ans</td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700">2 ans</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-left font-bold border border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-bl-xl">
                        Accident de service et de trajet (CITIS)
                      </td>
                      <td colSpan={3} className="p-3 font-bold text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700 rounded-br-xl">
                        Plein traitement jusqu'à la reprise de son activité
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
