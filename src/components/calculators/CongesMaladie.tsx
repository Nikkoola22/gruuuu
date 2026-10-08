import React, { useState } from "react";
import { Activity, Info, Calendar as CalendarIcon, BookOpen, Plus, Trash2, Clock, Building2, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";

interface Arret {
  id: string;
  debut: string;
  fin: string;
}

export type StatutAgent = "titulaire_cnracl" | "titulaire_ircantec" | "contractuel";
export type TypeConge = "cmo" | "clm" | "cld" | "cgm" | "accident";

export const CongesMaladie: React.FC = () => {
  // Statut de l'agent : CNRACL, IRCANTEC ou Contractuel (Régime Général)
  const [statut, setStatut] = useState<StatutAgent>("titulaire_cnracl");
  const [typeConge, setTypeConge] = useState<TypeConge>("cmo");
  
  // Dates
  const [dateFonction, setDateFonction] = useState<string>("");
  const [trancheAnciennete, setTrancheAnciennete] = useState<"moins_4m" | "4m_2a" | "2a_3a" | "plus_3a">("plus_3a");
  const [dateArret, setDateArret] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  
  // Onglet pour le tableau de référence
  const [activeTableTab, setActiveTableTab] = useState<"ircantec" | "contractuel" | "cnracl">("ircantec");

  // Historique des arrêts pour le calcul glissant
  const [historique, setHistorique] = useState<Arret[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleInputChange = <T,>(setter: (val: T) => void, value: T) => {
    setter(value);
    setShowResult(false);
  };

  const handleStatutChange = (newStatut: StatutAgent) => {
    setStatut(newStatut);
    setTypeConge("cmo");
    setShowResult(false);
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
    setShowResult(false);
  };

  const updateArretHistorique = (id: string, field: "debut" | "fin", value: string) => {
    setHistorique(historique.map(h => h.id === id ? { ...h, [field]: value } : h));
    setShowResult(false);
  };

  const removeArretHistorique = (id: string) => {
    setHistorique(historique.filter(h => h.id !== id));
    setShowResult(false);
  };

  // Helper pour parser la date en UTC stricte
  const parseDateUTC = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  };

  // Calcul automatique de l'ancienneté en années
  const getAncienneteYears = () => {
    if (!dateFonction) {
      // Déduction depuis la tranche sélectionnée
      switch (trancheAnciennete) {
        case "moins_4m": return 0.2;
        case "4m_2a": return 1;
        case "2a_3a": return 2.5;
        case "plus_3a": return 3.5;
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
      consomme
    };
  };

  const getDroitsSpecifiques = () => {
    // 1. TITULAIRE CNRACL
    if (statut === "titulaire_cnracl") {
      switch (typeConge) {
        case "cmo": {
          const cmo = calculateDroitsCmo(90, 270);
          return {
            title: "Maladie Ordinaire (CMO) — Titulaire CNRACL",
            dureeMax: `Arrêt de ${cmo.dureeArret} jours (décompte sur 1 an glissant)`,
            pleinTraitement: `${cmo.ptApplique} j. (à 90%)`,
            demiTraitement: `${cmo.dtApplique} j.`,
            sansTraitement: cmo.sansTraitementApplique > 0 ? `${cmo.sansTraitementApplique} j.` : null,
            total: `${cmo.ptApplique + cmo.dtApplique + cmo.sansTraitementApplique} jours évalués`,
            cmoConsomme: cmo.consomme,
            regimeInfo: "Durée max : 1 an (3 mois à 90 %, 9 mois à demi-traitement)"
          };
        }
        case "clm":
          return {
            title: "Congé de Longue Maladie (CLM)",
            dureeMax: "3 ans maximum par affection",
            pleinTraitement: "1 an",
            demiTraitement: "2 ans",
            total: "3 ans",
            regimeInfo: "Plein traitement pendant 1 an, demi-traitement pendant 2 ans"
          };
        case "cld":
          return {
            title: "Congé de Longue Durée (CLD)",
            dureeMax: "5 ans maximum par affection",
            pleinTraitement: "3 ans",
            demiTraitement: "2 ans",
            total: "5 ans",
            regimeInfo: "Plein traitement pendant 3 ans, demi-traitement pendant 2 ans"
          };
        case "accident":
          return {
            title: "Accident de service et de trajet (CITIS)",
            dureeMax: "Jusqu'à consolidation ou reprise d'activité",
            pleinTraitement: "100 % (Plein traitement continu)",
            demiTraitement: "Non applicable",
            total: "Maintien intégral du traitement jusqu'à la reprise",
            regimeInfo: "Plein traitement maintenu jusqu'à la reprise de service ou reclassement/mise en retraite"
          };
        default: return null;
      }
    } 
    
    // 2. TITULAIRE IRCANTEC (Temps non complet < 28h)
    else if (statut === "titulaire_ircantec") {
      switch (typeConge) {
        case "cmo": {
          const cmo = calculateDroitsCmo(90, 270);
          return {
            title: "Maladie Ordinaire (CMO) — Titulaire IRCANTEC",
            dureeMax: `Arrêt de ${cmo.dureeArret} jours (décompte sur 1 an glissant)`,
            pleinTraitement: `${cmo.ptApplique} j. (à 90%)`,
            demiTraitement: `${cmo.dtApplique} j.`,
            sansTraitement: cmo.sansTraitementApplique > 0 ? `${cmo.sansTraitementApplique} j.` : null,
            total: `${cmo.ptApplique + cmo.dtApplique + cmo.sansTraitementApplique} jours évalués`,
            cmoConsomme: cmo.consomme,
            regimeInfo: "Durée max : 1 an (3 mois à 90 %, 9 mois à demi-traitement)"
          };
        }
        case "cgm":
          return {
            title: "Grave Maladie — Titulaire IRCANTEC",
            dureeMax: "3 ans maximum",
            pleinTraitement: "1 an",
            demiTraitement: "2 ans",
            total: "3 ans",
            regimeInfo: "Plein traitement (1 an) puis demi-traitement (2 ans)"
          };
        case "accident":
          return {
            title: "Accident de service et de trajet — Titulaire IRCANTEC",
            dureeMax: "Tant que l'agent est inapte à ses fonctions",
            pleinTraitement: "3 ans à plein traitement",
            demiTraitement: "Pas de demi-traitement",
            total: "3 ans à plein traitement, puis IJ directes de la CPAM",
            note: "Pas de demi-traitement : au-delà de 3 ans, la CPAM verse directement à l'agent ses indemnités journalières."
          };
        default: return null;
      }
    }

    // 3. AGENT CONTRACTUEL (Régime Général de la Sécurité Sociale)
    else {
      const ancYears = getAncienneteYears();

      if (typeConge === "cgm") {
        if (ancYears < 3) {
          return {
            title: "Grave Maladie — Contractuel",
            dureeMax: "Aucun droit",
            pleinTraitement: "0",
            demiTraitement: "0",
            total: "0",
            note: "L'agent contractuel doit justifier d'au moins 3 ans de services continus pour ouvrir droit au Congé de Grave Maladie."
          };
        }
        return {
          title: "Grave Maladie — Contractuel (≥ 3 ans d'ancienneté)",
          dureeMax: "3 ans maximum",
          pleinTraitement: "1 an",
          demiTraitement: "2 ans",
          total: "3 ans",
          regimeInfo: "1 an à plein traitement, 2 ans à demi-traitement"
        };
      } else if (typeConge === "accident") {
        let ptLabel = "1 mois";
        if (ancYears >= 3) {
          ptLabel = "3 mois";
        } else if (ancYears >= 1) {
          ptLabel = "2 mois";
        }

        return {
          title: "Accident de service et de trajet — Contractuel",
          dureeMax: `Ancienneté évaluée : ${ancYears >= 3 ? "Plus de 3 ans" : ancYears >= 1 ? "De 1 à 3 ans" : "Moins d'un an"}`,
          pleinTraitement: ptLabel,
          demiTraitement: "IJ CPAM (**)",
          total: `${ptLabel} de plein traitement par la collectivité`,
          note: "Au-delà de la période de plein traitement, la CPAM verse directement à l'agent ses indemnités journalières d'accident du travail (**)."
        };
      } else {
        // CMO Contractuel
        let maxPt = 0, maxDt = 0;
        let trancheTexte = "";
        
        if (ancYears < (4/12)) {
          maxPt = 0; maxDt = 0;
          trancheTexte = "Moins de 4 mois d'ancienneté";
        } else if (ancYears < 2) {
          maxPt = 30; maxDt = 30;
          trancheTexte = "Entre 4 mois et 2 ans d'ancienneté";
        } else if (ancYears < 3) {
          maxPt = 60; maxDt = 60;
          trancheTexte = "Entre 2 ans et 3 ans d'ancienneté";
        } else {
          maxPt = 90; maxDt = 90;
          trancheTexte = "Plus de 3 ans d'ancienneté";
        }

        if (maxPt === 0) {
          return {
            title: "Maladie Ordinaire (CMO) — Contractuel",
            dureeMax: trancheTexte,
            pleinTraitement: "0 jour",
            demiTraitement: "0 jour",
            total: "0",
            note: "Ancienneté inférieure à 4 mois : aucun maintien de traitement par l'employeur. Indemnités journalières de la Sécurité Sociale (IJSS) versées directement par la CPAM sous réserve des conditions d'ouverture de droits."
          };
        }

        const cmoContractuel = calculateDroitsCmo(maxPt, maxDt);
        return {
          title: `Maladie Ordinaire (CMO) — Contractuel (${trancheTexte})`,
          dureeMax: `Arrêt de ${cmoContractuel.dureeArret} jours (Plafond : ${maxPt}j PT / ${maxDt}j DT)`,
          pleinTraitement: `${cmoContractuel.ptApplique} j. (à 90%)`,
          demiTraitement: `${cmoContractuel.dtApplique} j.`,
          sansTraitement: cmoContractuel.sansTraitementApplique > 0 ? `${cmoContractuel.sansTraitementApplique} j.` : null,
          total: `${cmoContractuel.ptApplique + cmoContractuel.dtApplique + cmoContractuel.sansTraitementApplique} jours évalués`,
          cmoConsomme: cmoContractuel.consomme
        };
      }
    }
  };

  const droits = getDroitsSpecifiques();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl text-teal-600 dark:text-teal-400">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Droits à congés maladie
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <Building2 className="w-3 h-3" /> Ville de Gennevilliers
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Évaluation des droits à plein et demi-traitement (CNRACL, IRCANTEC & Contractuels)
              </p>
            </div>
          </div>
        </div>

        {/* Bases Légales & Cadre réglementaire Gennevilliers */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-teal-600" />
            Protocole temps de travail Gennevilliers & Réglementation
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">Titulaires CNRACL</strong>
              CGFP / Décret 2025-197 : 3 mois à 90 % puis 9 mois à demi-traitement sur 12 mois glissants.
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">Titulaires IRCANTEC</strong>
              Temps non complet (&lt; 28h) : 3 mois à 90 %, 9 mois DT, grave maladie 3 ans, accident de service 3 ans PT.
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">Contractuels Régime Général</strong>
              Décret n°88-145 : droits gradués selon l'ancienneté (1 à 3 mois à 90% puis 1 à 3 mois DT).
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Statut de l'agent */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold">1</span>
              Statut de l'agent & Régime d'affiliation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleStatutChange("titulaire_cnracl")}
                className={`p-3 text-left rounded-xl transition-all border ${
                  statut === "titulaire_cnracl"
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.01]"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="font-extrabold text-xs sm:text-sm">Titulaire CNRACL</div>
                <div className={`text-[10px] mt-0.5 ${statut === "titulaire_cnracl" ? "text-teal-100" : "text-slate-400"}`}>
                  Temps complet ou non complet ≥ 28h
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleStatutChange("titulaire_ircantec")}
                className={`p-3 text-left rounded-xl transition-all border ${
                  statut === "titulaire_ircantec"
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.01]"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="font-extrabold text-xs sm:text-sm">Titulaire IRCANTEC</div>
                <div className={`text-[10px] mt-0.5 ${statut === "titulaire_ircantec" ? "text-teal-100" : "text-slate-400"}`}>
                  Temps non complet &lt; 28h / semaine
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleStatutChange("contractuel")}
                className={`p-3 text-left rounded-xl transition-all border ${
                  statut === "contractuel"
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.01]"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="font-extrabold text-xs sm:text-sm">Agent Contractuel</div>
                <div className={`text-[10px] mt-0.5 ${statut === "contractuel" ? "text-teal-100" : "text-slate-400"}`}>
                  Affilié au Régime Général CPAM
                </div>
              </button>
            </div>
          </div>

          {/* 2. Nature de l'arrêt */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold">2</span>
              Nature de l'arrêt à évaluer
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* CMO */}
              <button
                type="button"
                onClick={() => handleInputChange(setTypeConge, "cmo")}
                className={`p-3 rounded-xl text-left border transition-all ${
                  typeConge === "cmo"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="text-xs sm:text-sm font-extrabold">Maladie Ordinaire (CMO)</div>
                <div className={`text-[10px] mt-0.5 ${typeConge === "cmo" ? "text-teal-100" : "text-slate-400"}`}>
                  Arrêt maladie de droit commun
                </div>
              </button>

              {/* Titulaire CNRACL : CLM & CLD */}
              {statut === "titulaire_cnracl" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleInputChange(setTypeConge, "clm")}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      typeConge === "clm"
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-extrabold">Longue Maladie (CLM)</div>
                    <div className={`text-[10px] mt-0.5 ${typeConge === "clm" ? "text-teal-100" : "text-slate-400"}`}>
                      Jusqu'à 3 ans par affection
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange(setTypeConge, "cld")}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      typeConge === "cld"
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-extrabold">Longue Durée (CLD)</div>
                    <div className={`text-[10px] mt-0.5 ${typeConge === "cld" ? "text-teal-100" : "text-slate-400"}`}>
                      Jusqu'à 5 ans par affection
                    </div>
                  </button>
                </>
              )}

              {/* Titulaire IRCANTEC ou Contractuel : Grave Maladie */}
              {(statut === "titulaire_ircantec" || statut === "contractuel") && (
                <button
                  type="button"
                  onClick={() => handleInputChange(setTypeConge, "cgm")}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    typeConge === "cgm"
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-extrabold">Grave Maladie</div>
                  <div className={`text-[10px] mt-0.5 ${typeConge === "cgm" ? "text-teal-100" : "text-slate-400"}`}>
                    Jusqu'à 3 ans (1 an PT / 2 ans DT)
                  </div>
                </button>
              )}

              {/* Accident de service et de trajet */}
              <button
                type="button"
                onClick={() => handleInputChange(setTypeConge, "accident")}
                className={`p-3 rounded-xl text-left border transition-all ${
                  typeConge === "accident"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="text-xs sm:text-sm font-extrabold">Accident service / trajet</div>
                <div className={`text-[10px] mt-0.5 ${typeConge === "accident" ? "text-teal-100" : "text-slate-400"}`}>
                  {statut === "titulaire_cnracl" ? "CITIS (Plein traitement continu)" : statut === "titulaire_ircantec" ? "3 ans PT puis CPAM" : "1 à 3 mois PT puis CPAM"}
                </div>
              </button>
            </div>
          </div>

          {/* Ancienneté pour les agents contractuels */}
          {statut === "contractuel" && (
            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 rounded-2xl animate-fadeIn">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Ancienneté de services de l'agent contractuel
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Sélectionnez la tranche d'ancienneté ou saisissez la date d'entrée pour le calcul automatique :
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  { id: "moins_4m", label: "< 4 mois", desc: "Aucun maintien (IJSS CPAM)" },
                  { id: "4m_2a", label: "4 mois à < 2 ans", desc: "1 mois PT (90%) / 1 mois DT" },
                  { id: "2a_3a", label: "2 ans à < 3 ans", desc: "2 mois PT (90%) / 2 mois DT" },
                  { id: "plus_3a", label: "≥ 3 ans", desc: "3 mois PT (90%) / 3 mois DT" },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTrancheAnciennete(t.id as "moins_4m" | "4m_2a" | "2a_3a" | "plus_3a");
                      setDateFonction("");
                      setShowResult(false);
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      trancheAnciennete === t.id && !dateFonction
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm font-bold"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                    }`}
                  >
                    <div className="font-extrabold text-xs">{t.label}</div>
                    <div className={`text-[10px] mt-0.5 ${trancheAnciennete === t.id && !dateFonction ? "text-teal-100" : "text-slate-400"}`}>
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-500">Ou date exacte de prise de fonctions :</span>
                <input
                  type="date"
                  value={dateFonction}
                  onChange={(e) => handleInputChange(setDateFonction, e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Historique des arrêts (Affiché seulement pour le CMO) */}
          {typeConge === "cmo" && (
            <div className="p-5 bg-amber-50/40 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/50 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-800 dark:text-amber-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Historique des arrêts antérieurs (12 derniers mois)
                </h3>
                <button
                  onClick={addArretHistorique}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un arrêt
                </button>
              </div>
              
              {historique.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-amber-200 dark:border-amber-800/50 rounded-xl text-center text-xs text-amber-700/70 dark:text-amber-400/70 bg-white/50 dark:bg-slate-900/50">
                  Aucun arrêt antérieur renseigné. Cliquez sur "Ajouter un arrêt" s'il y a eu des arrêts maladie ordinaires dans les 365 jours précédents.
                </div>
              ) : (
                <div className="space-y-3">
                  {historique.map((arret, index) => (
                    <div key={arret.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-700/30 rounded-xl shadow-sm">
                      <span className="text-xs font-black text-amber-300 dark:text-amber-700 w-6">#{index + 1}</span>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Début</label>
                          <input
                            type="date"
                            value={arret.debut}
                            onChange={(e) => updateArretHistorique(arret.id, "debut", e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fin</label>
                          <input
                            type="date"
                            value={arret.fin}
                            onChange={(e) => updateArretHistorique(arret.id, "fin", e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeArretHistorique(arret.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {dateArret && showResult && (
                    <div className="mt-2 text-xs text-slate-500 flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 text-teal-500" />
                      <p>
                        Le système calcule automatiquement la part de ces arrêts qui tombe dans l'année glissante précédant le {new Date(dateArret).toLocaleDateString('fr-FR')}. 
                        <br/><strong>Jours retenus : {droits?.cmoConsomme ?? 0} jours.</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Saisie de l'arrêt à évaluer */}
          <div className="p-5 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/50 rounded-2xl">
            <h3 className="font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Dates de l'arrêt à évaluer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date de début de l'arrêt
                </label>
                <input
                  type="date"
                  value={dateArret}
                  onChange={(e) => handleInputChange(setDateArret, e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date de fin prévisionnelle de l'arrêt
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => handleInputChange(setDateFin, e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Bouton de calcul */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowResult(true)}
              disabled={!dateArret || !dateFin}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Évaluer les droits à plein / demi-traitement
            </button>
          </div>
        </div>

        {/* Résultat Dynamique */}
        <div className={`mt-8 transition-all duration-500 ${showResult ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 hidden'}`}>
          <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-50 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-slate-900/80 border-2 border-teal-300/80 dark:border-teal-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Résultat de l'évaluation
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {droits?.title}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {droits?.dureeMax}
              </div>
            </div>

            {droits?.note ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>{droits.note}</div>
              </div>
            ) : (
              <div className={`grid gap-4 ${droits?.sansTraitement ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {/* Plein traitement */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    Plein Traitement
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                    {droits?.pleinTraitement}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Salaire complet (ou 90 % en CMO)</div>
                </div>
                
                {/* Demi-traitement */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                    Demi-Traitement
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
                    {droits?.demiTraitement}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Demi-salaire (ou relais IJSS CPAM)</div>
                </div>

                {/* Sans traitement (si dépassement) */}
                {droits?.sansTraitement && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                      Sans Traitement
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400">
                      {droits?.sansTraitement}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Droits épuisés sur la période</div>
                  </div>
                )}
              </div>
            )}
            
            {droits?.total && !droits?.note && (
              <div className="mt-6 pt-4 border-t border-teal-200 dark:border-teal-800/60 text-center font-bold text-teal-900 dark:text-teal-200 text-sm">
                Bilan : {droits.total}
              </div>
            )}
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
