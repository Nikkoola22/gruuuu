import React, { useState } from "react";
import { Clock, Info, Calendar, Award, HeartPulse, ChevronDown, ChevronUp, Check, Building2, Sparkles } from "lucide-react";

// Grille officielle des A.R.T.T de la Ville de Gennevilliers
// Conforme au protocole d'accord sur l'organisation du temps de travail (1607 heures)
const GENNEVILLIERS_RTT_GRID: Record<string, Record<number, number>> = {
  "100": { 35: 0, 37: 12, 37.5: 15, 38: 18, 39: 23 },
  "90":  { 35: 0, 37: 11, 37.5: 13.5, 38: 16, 39: 21 },
  "80":  { 35: 0, 37: 10, 37.5: 12, 38: 14.5, 39: 18.5 },
  "70":  { 35: 0, 37: 8.5, 37.5: 10.5, 38: 13, 39: 16 },
  "60":  { 35: 0, 37: 7.5, 37.5: 9, 38: 11, 39: 14 },
  "50":  { 35: 0, 37: 6, 37.5: 7.5, 38: 9, 39: 11.5 },
  "50_demi": { 35: 0, 37: 6, 37.5: 7.5, 38: 9, 39: 11.5 },
};

// Congés annuels (CA) à Gennevilliers : 5 x les obligations hebdomadaires
const GENNEVILLIERS_CA_GRID: Record<string, { ca: number; label: string; joursHebdo: number; subtitle?: string }> = {
  "100": { ca: 25, label: "Temps complet (100 %)", joursHebdo: 5 },
  "90":  { ca: 22.5, label: "Temps partiel 90 % (Temps annuel)", joursHebdo: 4.5 },
  "80":  { ca: 20, label: "Temps partiel 80 %", joursHebdo: 4 },
  "70":  { ca: 17.5, label: "Temps partiel 70 %", joursHebdo: 3.5 },
  "60":  { ca: 15, label: "Temps partiel 60 %", joursHebdo: 3 },
  "50":  { ca: 12.5, label: "Temps partiel 50 % (2,5 j/sem)", joursHebdo: 2.5 },
  "50_demi": { ca: 25, label: "50 % temps partiel (5 demi-journées / sem)", joursHebdo: 5, subtitle: "5 demi-journées travaillées / semaine" },
};

export const RttCalculator: React.FC = () => {
  // États de sélection
  const [heuresParSemaine, setHeuresParSemaine] = useState<number>(37.5);
  const [quotite, setQuotite] = useState<string>("100");
  const [fractionnement, setFractionnement] = useState<number>(0);

  // Simulateur d'absence maladie (spécifique Gennevilliers - quotient Q)
  const [showMaladieSimu, setShowMaladieSimu] = useState<boolean>(false);
  const [joursMaladie, setJoursMaladie] = useState<number>(0);

  // Toggle affichage du tableau officiel Gennevilliers
  const [showTable, setShowTable] = useState<boolean>(true);

  // Calcul des droits
  const caInfo = GENNEVILLIERS_CA_GRID[quotite] || { ca: 25, label: "Temps plein", joursHebdo: 5 };
  const ca = caInfo.ca;

  // Calcul des RTT selon la matrice officielle Gennevilliers (9 ARTT pour 38h à 50% 5 demi-journées)
  const rttTheorique = GENNEVILLIERS_RTT_GRID[quotite]?.[heuresParSemaine] ?? (
    heuresParSemaine > 35 ? Math.round(((heuresParSemaine - 35) * 45) / (heuresParSemaine / 5)) : 0
  );

  // Règle d'abattement maladie de Gennevilliers :
  // Q = 228 jours travaillés / Nb de RTT attribués annuellement (arrondi sup)
  const Q = rttTheorique > 0 ? Math.ceil(228 / rttTheorique) : 0;
  const rttPerdus = Q > 0 ? Math.min(rttTheorique, Math.floor(joursMaladie / Q)) : 0;
  const rttNet = Math.max(0, rttTheorique - rttPerdus);

  // Total jours de congés et repos annuels
  const totalDroits = ca + rttNet + fractionnement;

  // Définition des cycles proposés à Gennevilliers
  const cyclesGennevilliers = [
    { heures: 37, label: "37h00", badge: "12 RTT (100%)", desc: "Cycle hebdomadaire 37h" },
    { heures: 37.5, label: "37h30", badge: "15 RTT (100%)", desc: "Cycle classique le plus courant" },
    { heures: 38, label: "38h00", badge: "18 RTT (100%)", desc: "Cycle hebdomadaire 38h" },
    { heures: 39, label: "39h00", badge: "23 RTT (100%)", desc: "Spécifique agents de crèches" },
    { heures: 35, label: "35h00", badge: "0 RTT", desc: "Durée légale sans dépassement" },
  ];

  const quotites = [
    { val: "100", label: "100 %", sousLabel: "Temps complet (5 j/sem)" },
    { val: "90",  label: "90 %",  sousLabel: "Temps annuel (4,5 j/sem)" },
    { val: "80",  label: "80 %",  sousLabel: "Temps partiel (4 j/sem)" },
    { val: "70",  label: "70 %",  sousLabel: "Temps partiel (3,5 j/sem)" },
    { val: "60",  label: "60 %",  sousLabel: "Temps partiel (3 j/sem)" },
    { val: "50",  label: "50 % (2,5 j)", sousLabel: "2,5 journées / sem" },
    { val: "50_demi", label: "50 % (5 demi-j)", sousLabel: "5 demi-j / sem (25 CA — 9 ARTT à 38h)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-700 dark:text-emerald-400">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Calculateur de CA & RTT
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Building2 className="w-3 h-3" /> Ville de Gennevilliers
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Barème officiel des A.R.T.T et congés annuels selon le protocole temps de travail
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de configuration */}
        <div className="space-y-6">
          
          {/* 1. Choix de la durée hebdomadaire */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                Durée hebdomadaire de travail (Cycle)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Protocole 1607 h</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {cyclesGennevilliers.map(c => {
                const isSelected = heuresParSemaine === c.heures;
                return (
                  <button
                    key={c.heures}
                    type="button"
                    onClick={() => setHeuresParSemaine(c.heures)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-base">{c.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-100" />}
                    </div>
                    <div className={`text-xs font-semibold ${isSelected ? "text-emerald-100" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {c.badge}
                    </div>
                    <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? "text-emerald-100/90" : "text-slate-400 dark:text-slate-500"}`}>
                      {c.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Choix de la quotité / Régime */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                Quotité de temps de travail (Temps complet ou partiel)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Congés annuels = 5 × obligations hebdo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
              {quotites.map(q => {
                const isSelected = quotite === q.val;
                return (
                  <button
                    key={q.val}
                    type="button"
                    onClick={() => {
                      setQuotite(q.val);
                      if (q.val === "50_demi") {
                        setHeuresParSemaine(38);
                      }
                    }}
                    className={`py-2.5 px-2.5 rounded-xl text-center transition-all border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                    }`}
                  >
                    <div className="font-extrabold text-sm">{q.label}</div>
                    <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-emerald-100" : "text-slate-400 dark:text-slate-500"}`}>
                      {q.sousLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Note explicative pour 50% 5 demi-journées */}
            {quotite === "50_demi" && (
              <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 animate-fadeIn">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <strong>Option 50 % en 5 demi-journées / semaine :</strong>
                  <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">
                    L'agent travaillant 5 demi-journées par semaine, chaque jour de congé posé correspond à une demi-journée travaillée : l'agent dispose ainsi de <strong>25 jours de C.A</strong>.
                    Pour les A.R.T.T, les droits sont de <strong>9 jours d'A.R.T.T sur le cycle 38h</strong> (7,5 j à 37h30, 6 j à 37h et 11,5 j à 39h).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Jours de fractionnement (optionnel) */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              Jours de fractionnement éventuels (Prise de CA hors saison)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Congés annuels pris entre le 1er novembre et le 30 avril (hors période estivale) :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { val: 0, label: "0 jour", desc: "Moins de 5 jours de CA hors saison" },
                { val: 1, label: "+1 jour de fractionnement", desc: "5 à 7 jours de CA pris hors saison" },
                { val: 2, label: "+2 jours de fractionnement", desc: "8 jours et plus de CA pris hors saison" },
              ].map(f => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setFractionnement(f.val)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs ${
                    fractionnement === f.val
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm font-bold"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300"
                  }`}
                >
                  <div className="font-bold text-sm mb-0.5">{f.label}</div>
                  <div className={`text-[11px] ${fractionnement === f.val ? "text-amber-50" : "text-slate-400 dark:text-slate-500"}`}>
                    {f.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Simulateur abattement maladie (Spécifique Gennevilliers Art. 3) */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMaladieSimu(!showMaladieSimu)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Décompte des A.R.T.T en cas de congés maladie (Facultatif)
                </span>
                {rttPerdus > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                    -{rttPerdus} RTT déduit{rttPerdus > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {showMaladieSimu ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showMaladieSimu && (
              <div className="p-5 bg-white dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Selon le protocole du temps de travail de Gennevilliers (Circulaire du 18 janvier 2012), les absences pour raison de santé réduisent proportionnellement les A.R.T.T.
                  Pour votre situation ({heuresParSemaine}h, {rttTheorique} RTT), le quotient de réduction est de{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">Q = {Q} jours</strong> d'absence maladie par jour de RTT amputé (formule : 228 jours travaillés / {rttTheorique} RTT).
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nombre total de jours d'arrêt maladie sur l'année :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={joursMaladie}
                      onChange={(e) => setJoursMaladie(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-sm font-bold text-center text-slate-900 dark:text-white"
                    />
                    <span className="text-xs text-slate-500">jour(s)</span>
                  </div>
                </div>

                {joursMaladie > 0 && (
                  <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                    {rttPerdus > 0 ? (
                      <p>
                        Avec <strong>{joursMaladie} jours</strong> d'arrêt maladie (seuil de {Q} j atteint {rttPerdus} fois), votre crédit RTT est amputé de <strong>{rttPerdus} jour{rttPerdus > 1 ? "s" : ""}</strong>. RTT restants : <strong>{rttNet} jours</strong>.
                      </p>
                    ) : (
                      <p>
                        Avec {joursMaladie} jours d'arrêt, vous n'atteignez pas le seuil de {Q} jours d'absence : <strong>aucun RTT n'est déduit</strong>.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Résultat visuel & Synthèse */}
        <div className="mt-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900/80 border-2 border-emerald-300/80 dark:border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Synthèse de vos droits à repos annuels
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Situation : {heuresParSemaine}h / semaine — {caInfo.label}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Congés Annuels */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700">
              <div className="text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-400 mb-1">
                {ca}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Jours de C.A
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {quotite === "50_demi" ? "5 demi-journées × 5" : `Congés Annuels (${caInfo.joursHebdo} j × 5)`}
              </div>
            </div>
            
            {/* Jours RTT Gennevilliers */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700 relative overflow-hidden">
              <div className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 mb-1">
                {rttNet}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Jours d'A.R.T.T
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {quotite === "50_demi" ? (
                  <span>{heuresParSemaine === 38 ? "9 ARTT (Cycle 38h)" : `Barème Gennevilliers (${heuresParSemaine}h)`}</span>
                ) : rttPerdus > 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    ({rttTheorique} initiaux - {rttPerdus} maladie)
                  </span>
                ) : (
                  <span>Barème Gennevilliers</span>
                )}
              </div>
              {heuresParSemaine === 39 && (
                <div className="absolute top-2 right-2 text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-1.5 py-0.5 rounded">
                  Crèche
                </div>
              )}
            </div>

            {/* Fractionnement */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm border border-slate-200/80 dark:border-slate-700">
              <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                {fractionnement > 0 ? `+${fractionnement}` : "0"}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Fractionnement
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {fractionnement > 0 ? "Congés pris hors saison" : "Non applicable"}
              </div>
            </div>
          </div>

          {/* Total bandeau */}
          <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 dark:bg-slate-800/70 p-4 rounded-2xl">
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total annuel de jours d'absence rémunérés
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                (Hors autorisations spéciales d'absence, CET et récupération)
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 dark:text-emerald-300">
              {totalDroits} jours
            </div>
          </div>
        </div>

        {/* 5. TABLEAU OFFICIEL DE GENNEVILLIERS (REPRODUCTION DE LA MATRICE) */}
        <div className="mt-8 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-900/80 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Tableau officiel des jours A.R.T.T — Ville de Gennevilliers
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arrondi officiel à la demi-journée supérieure (cliquez sur une case pour la sélectionner)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
            >
              {showTable ? "Masquer" : "Afficher"}
            </button>
          </div>

          {showTable && (
            <div className="p-4 sm:p-6 overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full border-collapse text-xs sm:text-sm text-center">
                <thead>
                  <tr>
                    <th className="bg-[#4d826f] text-white p-3 font-bold text-left rounded-tl-xl border border-[#3b6657] w-1/3">
                      Durée hebdomadaire de travail
                    </th>
                    {[37, 37.5, 38, 39].map((h, idx) => (
                      <th
                        key={h}
                        onClick={() => setHeuresParSemaine(h)}
                        className={`bg-[#e5a000] text-white p-3 font-extrabold cursor-pointer border border-[#c48800] transition-colors hover:bg-[#d69500] ${
                          idx === 3 ? "rounded-tr-xl" : ""
                        } ${heuresParSemaine === h ? "ring-2 ring-white ring-inset shadow-inner bg-[#b87f00]" : ""}`}
                      >
                        <div className="text-sm sm:text-base">{h === 37.5 ? "37,5 h" : `${h} h`}</div>
                        {heuresParSemaine === h && (
                          <div className="text-[10px] font-normal tracking-wide text-amber-100">● Sélectionné</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { q: "100", label: "NB de Jours A.R.T.T pour un agent à temps complet" },
                    { q: "90",  label: "Temps partiel 90 % (Temps annuel)" },
                    { q: "80",  label: "Temps partiel 80 %" },
                    { q: "70",  label: "Temps partiel 70 %" },
                    { q: "60",  label: "Temps partiel 60 %" },
                    { q: "50",  label: "Temps partiel 50 % (2,5 jours entiers / sem)" },
                    { q: "50_demi", label: "50 % temps partiel (5 demi-journées / sem — 25 CA & 9 ARTT)" },
                  ].map((row, rowIdx) => {
                    const isCurrentQuotite = quotite === row.q;
                    return (
                      <tr key={row.q} className={isCurrentQuotite ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""}>
                        <td
                          onClick={() => setQuotite(row.q)}
                          className={`p-3 text-left font-bold border border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 transition-colors ${
                            isCurrentQuotite
                              ? "bg-[#4d826f]/15 dark:bg-[#4d826f]/30 text-emerald-950 dark:text-emerald-200 font-extrabold"
                              : "text-slate-800 dark:text-slate-200"
                          } ${rowIdx === 6 ? "rounded-bl-xl" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            {isCurrentQuotite && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                            <span>{row.label}</span>
                          </div>
                        </td>

                        {[37, 37.5, 38, 39].map((h, colIdx) => {
                          const val = GENNEVILLIERS_RTT_GRID[row.q][h];
                          const isExactCell = isCurrentQuotite && heuresParSemaine === h;
                          return (
                            <td
                              key={h}
                              onClick={() => {
                                setQuotite(row.q);
                                setHeuresParSemaine(h);
                              }}
                              className={`p-3 font-extrabold border border-slate-300 dark:border-slate-700 cursor-pointer transition-all ${
                                isExactCell
                                  ? "bg-emerald-600 text-white shadow-md text-base scale-[1.03] z-10 relative rounded-lg"
                                  : "text-slate-900 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-950/30"
                              } ${rowIdx === 6 && colIdx === 3 ? "rounded-br-xl" : ""}`}
                            >
                              {val.toString().replace(".", ",")} jours
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mentions informatives spécifiques Gennevilliers */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">Arrondi à la demi-journée supérieure :</strong>
                    <br />
                    Pour faciliter la gestion des absences, la Ville de Gennevilliers applique un arrondi systématique à la demi-journée supérieure pour les temps partiels.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">50 % en 5 demi-journées :</strong>
                    <br />
                    L'agent bénéficie du volant complet de <strong>25 jours de CA</strong> (5 demi-j × 5), et les ARTT sont calculés selon le cycle choisi : <strong>9 jours d'ARTT à 38h</strong> (7,5 j à 37h30, 6 j à 37h, 11,5 j à 39h).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
