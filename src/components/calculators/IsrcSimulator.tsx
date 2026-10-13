import React, { useState, useMemo } from "react";
import {
  Handshake,
  Info,
  Calendar,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Coins,
  FileText,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  Sliders,
  Scale
} from "lucide-react";
import { toast } from "sonner";

export const IsrcSimulator: React.FC = () => {
  // Mode de saisie de la rémunération : globale ou détaillée
  const [saisieMode, setSaisieMode] = useState<"globale" | "detaillee">("globale");

  // Saisie globale
  const [rba, setRba] = useState<number | "">(36000);

  // Saisie détaillée (mensuelle N-1)
  const [traitementBrutMensuel, setTraitementBrutMensuel] = useState<number | "">(2200);
  const [nbiMensuelle, setNbiMensuelle] = useState<number | "">(0);
  const [primesEligiblesMensuelles, setPrimesEligiblesMensuelles] = useState<number | "">(600);
  const [primesExcluesMensuelles, setPrimesExcluesMensuelles] = useState<number | "">(0);

  // Ancienneté
  const [anciennete, setAnciennete] = useState<number | "">(12);

  // Négociation : curseur entre plancher (0%) et plafond (100%)
  const [negociationPct, setNegociationPct] = useState<number>(50);

  // Copies & onglets
  const [copied, setCopied] = useState<boolean>(false);
  const [showExclusions, setShowExclusions] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"calcul" | "fiscalite" | "procedure">("calcul");

  // Calcul de la rémunération brute annuelle (RBA) de référence
  const rbaCalculee = useMemo(() => {
    if (saisieMode === "globale") {
      return typeof rba === "number" ? Math.max(0, rba) : 0;
    } else {
      const tb = typeof traitementBrutMensuel === "number" ? traitementBrutMensuel : 0;
      const nbi = typeof nbiMensuelle === "number" ? nbiMensuelle : 0;
      const primes = typeof primesEligiblesMensuelles === "number" ? primesEligiblesMensuelles : 0;
      const exclues = typeof primesExcluesMensuelles === "number" ? primesExcluesMensuelles : 0;
      const baseMensuelle = Math.max(0, tb + nbi + primes - exclues);
      return baseMensuelle * 12;
    }
  }, [saisieMode, rba, traitementBrutMensuel, nbiMensuelle, primesEligiblesMensuelles, primesExcluesMensuelles]);

  // Calcul légal complet de l'ISRC (Décrets 2019-1596, 2026-745 et 2026-746)
  const calcul = useMemo(() => {
    const anneesTotales = typeof anciennete === "number" ? Math.max(0, Math.floor(anciennete)) : 0;
    // Ancienneté plafonnée à 24 ans pour le calcul
    const anneesPrisesEnCompte = Math.min(anneesTotales, 24);

    if (rbaCalculee <= 0 || anneesTotales <= 0) {
      return null;
    }

    // 1 mois de rémunération brute de référence
    const rbm = rbaCalculee / 12;

    // -------------------------------------------------------------------------
    // 1. CALCUL DU MONTANT MINIMUM (Barème par tranches d'ancienneté)
    // -------------------------------------------------------------------------
    // Tranche 1 : jusqu'à 10 ans -> 1/6 de mois brut par an
    const anneesTr1 = Math.min(anneesPrisesEnCompte, 10);
    const moisTr1 = anneesTr1 * (1 / 6);
    const montantTr1 = moisTr1 * rbm;

    // Tranche 2 : de 10 ans et jusqu'à 15 ans -> 1/5 de mois brut par an
    const anneesTr2 = anneesPrisesEnCompte > 10 ? Math.min(anneesPrisesEnCompte - 10, 5) : 0;
    const moisTr2 = anneesTr2 * (1 / 5);
    const montantTr2 = moisTr2 * rbm;

    // Tranche 3 : de 15 ans et jusqu'à 20 ans -> 1/4 de mois brut par an
    const anneesTr3 = anneesPrisesEnCompte > 15 ? Math.min(anneesPrisesEnCompte - 15, 5) : 0;
    const moisTr3 = anneesTr3 * (1 / 4);
    const montantTr3 = moisTr3 * rbm;

    // Tranche 4 : de 20 ans et jusqu'à 24 ans -> 1/3 de mois brut par an
    const anneesTr4 = anneesPrisesEnCompte > 20 ? Math.min(anneesPrisesEnCompte - 20, 4) : 0;
    const moisTr4 = anneesTr4 * (1 / 3);
    const montantTr4 = moisTr4 * rbm;

    const montantMinimum = montantTr1 + montantTr2 + montantTr3 + montantTr4;
    const moisMinimum = moisTr1 + moisTr2 + moisTr3 + moisTr4;

    // -------------------------------------------------------------------------
    // 2. CALCUL DU MONTANT MAXIMUM (Plafond légal)
    // 1/24 de la rémunération brute annuelle par année d'ancienneté (max 24 ans)
    // Soit (rbaCalculee / 24) * anneesPrisesEnCompte = 0.5 mois par an
    // -------------------------------------------------------------------------
    const montantMaximum = (rbaCalculee / 24) * anneesPrisesEnCompte;
    const moisMaximum = (anneesPrisesEnCompte / 24) * 12; // = anneesPrisesEnCompte * 0.5

    // -------------------------------------------------------------------------
    // 3. MONTANT NÉGOCIÉ (Selon accord agent / collectivité)
    // -------------------------------------------------------------------------
    const montantNegocie = montantMinimum + ((montantMaximum - montantMinimum) * (negociationPct / 100));
    const moisNegocie = moisMinimum + ((moisMaximum - moisMinimum) * (negociationPct / 100));

    // -------------------------------------------------------------------------
    // 4. RÉGIME FISCAL ET SOCIAL (Année 2026)
    // PASS 2026 estimé : 47 100 € (Plafond annuel de la Sécurité Sociale)
    // -------------------------------------------------------------------------
    const pass2026 = 47100;
    const plafondExoSecu = 2 * pass2026; // 94 200 €
    const plafondExoIR = Math.max(montantMinimum, Math.min(2 * rbaCalculee, 6 * pass2026));

    // Part exonérée d'IR
    const partImposableIR = Math.max(0, montantNegocie - plafondExoIR);
    const partExonereeIR = montantNegocie - partImposableIR;

    // Part soumise à CSG/CRDS (9,7 %)
    // La part jusqu'au montant légal minimum est exonérée de CSG/CRDS
    // La part supra-légale (au-dessus du minimum) est soumise à la CSG/CRDS (9,7 %)
    const partSupraLegale = Math.max(0, montantNegocie - montantMinimum);
    const csgCrdsEstimee = partSupraLegale * 0.097;

    // Net en poche estimé (avant impôt éventuel sur le revenu, sachant que partImposableIR = 0 dans 99,9% des cas)
    const netEstime = montantNegocie - csgCrdsEstimee;

    // Différé d'indemnisation France Travail (ARE)
    // Carence spécifique sur indemnités supra-légales (environ partSupraLegale / 107.9 €)
    const differeFranceTravailJours = Math.min(150, Math.floor(partSupraLegale / 107.9));

    return {
      anneesTotales,
      anneesPrisesEnCompte,
      rbm,
      rba: rbaCalculee,
      // Détail Tranches Plancher
      tranche1: { annees: anneesTr1, mois: moisTr1, montant: montantTr1, fraction: "1/6" },
      tranche2: { annees: anneesTr2, mois: moisTr2, montant: montantTr2, fraction: "1/5" },
      tranche3: { annees: anneesTr3, mois: moisTr3, montant: montantTr3, fraction: "1/4" },
      tranche4: { annees: anneesTr4, mois: moisTr4, montant: montantTr4, fraction: "1/3" },
      montantMinimum,
      moisMinimum,
      // Plafond
      montantMaximum,
      moisMaximum,
      // Négociation
      montantNegocie,
      moisNegocie,
      // Fiscal / Social
      partImposableIR,
      partExonereeIR,
      partSupraLegale,
      csgCrdsEstimee,
      netEstime,
      differeFranceTravailJours
    };
  }, [rbaCalculee, anciennete, negociationPct]);

  const handleCopySummary = () => {
    if (!calcul) return;
    const text = `SIMULATION RUPTURE CONVENTIONNELLE (ISRC) - Fonction Publique
Rémunération Brute Annuelle de référence (N-1) : ${calcul.rba.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (soit ${calcul.rbm.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €/mois)
Ancienneté de services effectifs : ${calcul.anneesPrisesEnCompte} an(s) (plafond 24 ans)

FOURCHETTE LÉGALE :
- Montant MINIMUM (Plancher statutaire) : ${calcul.montantMinimum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (${calcul.moisMinimum.toFixed(2)} mois de salaire)
- Montant MAXIMUM (Plafond légal 1/24 RBA/an) : ${calcul.montantMaximum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (${calcul.moisMaximum.toFixed(2)} mois de salaire)

SIMULATION NÉGOCIÉE (${negociationPct} %) :
- Montant brut conventionnel : ${calcul.montantNegocie.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (${calcul.moisNegocie.toFixed(2)} mois)
- CSG/CRDS estimée (9,7 % sur part supra-légale) : ${calcul.csgCrdsEstimee.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
- Net estimé en poche : ${calcul.netEstime.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
- Exonération d'impôt sur le revenu (IR) : 100 % exonéré (${calcul.montantNegocie.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €)

Références : Articles L. 552-1 à L. 552-5 du CGFP, Décrets n° 2019-1593, n° 2019-1596, n° 2026-745 et n° 2026-746 du 6 août 2026.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Synthèse du calcul copiée dans le presse-papier !");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER STATUTAIRE HAUTE VISIBILITÉ (Conforme CDG Occitanie & Décrets Août 2026)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl text-white shadow-md shadow-rose-500/20">
              <Handshake className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Simulateur Rupture Conventionnelle (ISRC)
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-black tracking-wide uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                  À jour Décrets 6 Août 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Barème officiel de l'Indemnité Spécifique de Rupture Conventionnelle dans la Fonction Publique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleCopySummary}
              disabled={!calcul}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Copier la synthèse chiffrée"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copié !" : "Copier le calcul"}</span>
            </button>
          </div>
        </div>

        {/* Références légales & Badge Pérennisation */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Base légale :</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">CGFP art. L. 552-1 à L. 552-5</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">Décrets n° 2019-1593 & 2019-1596</span>
          <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-200 dark:border-rose-900">
            Décrets n° 2026-745 & 2026-746 du 6 août 2026
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">Arrêté du 06/08/2026</span>
        </div>

        {/* Alerte spécifique Gennevilliers */}
        <div className="mt-5 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
            <strong>Information statutaire Ville de Gennevilliers :</strong> Le dispositif de rupture conventionnelle est{" "}
            <span className="font-black underline">NON AUTORISÉ À GENNEVILLIERS</span> par décision de la direction municipale.
            Ce simulateur officiel est fourni aux agents à titre informatif et d'aide à la décision pour faire valoir leurs droits statutaires nationaux
            (FPT, FPE, FPH).
          </div>
        </div>

        {/* Onglets de navigation interne */}
        <div className="mt-6 flex border-b border-slate-200 dark:border-slate-800 space-x-3">
          <button
            onClick={() => setActiveTab("calcul")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === "calcul"
                ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>1° Calcul de l'Indemnité (Barème CDG)</span>
          </button>
          <button
            onClick={() => setActiveTab("fiscalite")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === "fiscalite"
                ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>2° Régime Fiscal & Social (Net en poche)</span>
          </button>
          <button
            onClick={() => setActiveTab("procedure")}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === "procedure"
                ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3° Procédure & Calendrier (Décret 2026-745)</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          ONGLET 1 : CALCUL DE L'INDEMNITÉ (CONFORME FICHE CDG OCCITANIE)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "calcul" && (
        <div className="space-y-6">
          {/* Étape 1 : Éléments de calcul */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center text-xs font-black">
                  1°
                </span>
                ÉLÉMENTS DE CALCUL STATUTAIRES
              </h3>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSaisieMode("globale")}
                  className={`px-3 py-1 rounded-lg transition ${
                    saisieMode === "globale"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Saisie brute annuelle
                </button>
                <button
                  onClick={() => setSaisieMode("detaillee")}
                  className={`px-3 py-1 rounded-lg transition ${
                    saisieMode === "detaillee"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Assistant par rubriques
                </button>
              </div>
            </div>

            {/* Saisie de la Rémunération */}
            {saisieMode === "globale" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Rémunération brute annuelle perçue au cours de l'année civile N-1 (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={rba}
                      onChange={(e) => setRba(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex: 36000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Montant brut figurant sur le cumul brut annuel de décembre N-1 (hors éléments légalement exclus ci-dessous).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Équivalent mensuel statutaire
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                    {(rbaCalculee / 12).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Soit <strong>1 mois de rémunération brute de référence</strong> = Rémunération annuelle N-1 ÷ 12.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Traitement indiciaire brut (€/mois)
                    </label>
                    <input
                      type="number"
                      value={traitementBrutMensuel}
                      onChange={(e) => setTraitementBrutMensuel(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      NBI mensuelle (€/mois)
                    </label>
                    <input
                      type="number"
                      value={nbiMensuelle}
                      onChange={(e) => setNbiMensuelle(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primes éligibles RIFSEEP / IFSE (€/mois)
                    </label>
                    <input
                      type="number"
                      value={primesEligiblesMensuelles}
                      onChange={(e) => setPrimesEligiblesMensuelles(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 text-rose-600">
                      Primes exclues déduites (€/mois)
                    </label>
                    <input
                      type="number"
                      value={primesExcluesMensuelles}
                      onChange={(e) => setPrimesExcluesMensuelles(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-rose-300 dark:border-rose-900 rounded-xl px-3 py-2 text-sm font-bold text-rose-600 dark:text-rose-400"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Rémunération brute annuelle calculée (× 12 mois) :
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {rbaCalculee.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (soit {(rbaCalculee / 12).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €/mois)
                  </span>
                </div>
              </div>
            )}

            {/* Saisie de l'ancienneté */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>Durée de services effectifs accomplis (Années complètes)</span>
                    <span className="text-xs font-normal text-slate-500">Plafond : 24 ans</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="45"
                      step="1"
                      value={anciennete}
                      onChange={(e) => setAnciennete(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex: 12"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">ans</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Services effectifs continus ou discontinus accomplis dans la FPE, FPT ou FPH (titulaire et contractuel). Seules les années entières sont décomptées.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4" />
                    Règle statutaire du plafonnement à 24 ans :
                  </div>
                  <p className="leading-relaxed">
                    Même si votre carrière comporte 30 ou 35 ans de service, la loi plafonne strictement le calcul de l'indemnité à <strong>24 années d'ancienneté</strong> (articles 2 et 3 du décret n° 2019-1596).
                  </p>
                  {typeof anciennete === "number" && anciennete > 24 && (
                    <div className="mt-1 font-semibold text-rose-600 dark:text-rose-400">
                      ⚠️ Votre ancienneté saisie ({anciennete} ans) sera écrêtée à 24 ans pour le calcul légal.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Accordéon des exclusions légales */}
            <div className="pt-2">
              <button
                onClick={() => setShowExclusions(!showExclusions)}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showExclusions ? "Masquer" : "Consulter"} la liste légale des primes et indemnités exclues (Art. 3 Décret 2019-1596)</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {showExclusions && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-white">
                    * Sont formellement exclues de la rémunération brute de référence :
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>1° Les primes et indemnités qui ont le caractère de <strong>remboursement de frais</strong> (frais de mission, déplacements) ;</li>
                    <li>2° Les <strong>majorations et indexations</strong> relatives à une affectation outre-mer ;</li>
                    <li>3° L'<strong>indemnité de résidence à l'étranger</strong> ;</li>
                    <li>4° Les primes et indemnités liées au <strong>changement de résidence</strong>, à la primo-affectation, à la mobilité géographique et aux restructurations ;</li>
                    <li>5° Les <strong>indemnités d'enseignement ou de jury</strong> ainsi que les autres indemnités non directement liées à l'emploi.</li>
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-500 italic border-t border-slate-200 dark:border-slate-800">
                    <strong>Logement pour nécessité absolue de service :</strong> Pour les agents bénéficiant d'un logement NAS, le montant des primes pris en compte est celui qu'ils auraient perçu s'ils n'en avaient pas bénéficié.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Étape 2 : Tableau Comparatif Minimum / Maximum (Comme sur le simulateur officiel du CDG) */}
          {calcul && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center text-xs font-black">
                    2°
                  </span>
                  MONTANT DE L'INDEMNITÉ SPÉCIFIQUE DE RUPTURE CONVENTIONNELLE
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Base 1 mois = {calcul.rbm.toFixed(2)} €
                </span>
              </div>

              {/* Les 2 colonnes comparatives Plancher / Plafond */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLONNE GAUCHE : MONTANT MINIMUM (Barème par tranches) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-950 dark:to-rose-950/20 border-2 border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Montant Minimum Légal (Plancher)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Barème cumulatif
                    </span>
                  </div>

                  {/* Tableau des tranches */}
                  <div className="space-y-2 text-xs">
                    {/* Tranche 1 */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">1/6 mois brut jusqu'à 10 ans</div>
                        <div className="text-[11px] text-slate-400">{calcul.tranche1.annees} an(s) retenu(s) × (1/6) mois</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-right">
                        <div>{calcul.tranche1.montant.toFixed(2).replace('.', ',')} €</div>
                        <div className="text-[10px] text-slate-400">{calcul.tranche1.mois.toFixed(2)} mois</div>
                      </div>
                    </div>

                    {/* Tranche 2 */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">1/5 mois brut de 10 à 15 ans</div>
                        <div className="text-[11px] text-slate-400">{calcul.tranche2.annees} an(s) retenu(s) × (1/5) mois</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-right">
                        <div>{calcul.tranche2.montant.toFixed(2).replace('.', ',')} €</div>
                        <div className="text-[10px] text-slate-400">{calcul.tranche2.mois.toFixed(2)} mois</div>
                      </div>
                    </div>

                    {/* Tranche 3 */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">1/4 mois brut de 15 à 20 ans</div>
                        <div className="text-[11px] text-slate-400">{calcul.tranche3.annees} an(s) retenu(s) × (1/4) mois</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-right">
                        <div>{calcul.tranche3.montant.toFixed(2).replace('.', ',')} €</div>
                        <div className="text-[10px] text-slate-400">{calcul.tranche3.mois.toFixed(2)} mois</div>
                      </div>
                    </div>

                    {/* Tranche 4 */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">1/3 mois brut de 20 à 24 ans</div>
                        <div className="text-[11px] text-slate-400">{calcul.tranche4.annees} an(s) retenu(s) × (1/3) mois</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-right">
                        <div>{calcul.tranche4.montant.toFixed(2).replace('.', ',')} €</div>
                        <div className="text-[10px] text-slate-400">{calcul.tranche4.mois.toFixed(2)} mois</div>
                      </div>
                    </div>
                  </div>

                  {/* Total minimum */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Montant minimum de l'indemnité :</div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                      {calcul.montantMinimum.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Équivalent à <strong>{calcul.moisMinimum.toFixed(2).replace('.', ',')} mois</strong> de salaire brut.
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE : MONTANT MAXIMUM (Plafond légal 1/24 RBA/an) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/30 dark:from-slate-950 dark:to-pink-950/20 border-2 border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Montant Maximum Légal (Plafond)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                        1/24 RBA par an
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Le montant maximum de l'indemnité ne peut pas excéder une somme équivalente à{" "}
                        <strong>1/24 de la rémunération brute annuelle</strong> perçue par l'agent par année d'ancienneté,
                        dans la limite de <strong>24 ans d'ancienneté</strong> :
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
                        <div>Formule légale : (Rémunération annuelle ÷ 24) × {calcul.anneesPrisesEnCompte} an(s)</div>
                        <div>Soit : ({calcul.rba.toFixed(2)} € ÷ 24) × {calcul.anneesPrisesEnCompte} an(s)</div>
                        <div className="text-pink-600 dark:text-pink-400 font-bold">
                          = 0,5 mois de salaire brut × {calcul.anneesPrisesEnCompte} an(s)
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Plafond absolu à 24 ans = 12 mois de salaire (soit 1 an complet de rémunération annuelle).
                      </div>
                    </div>
                  </div>

                  {/* Total maximum */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Montant maximum de l'indemnité :</div>
                    <div className="text-2xl sm:text-3xl font-black text-pink-600 dark:text-pink-400 mt-0.5">
                      {calcul.montantMaximum.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Équivalent à <strong>{calcul.moisMaximum.toFixed(2).replace('.', ',')} mois</strong> de salaire brut.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bandeau Jaune/Or Officiel comme dans le CDG */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 shadow-md shadow-amber-500/10 text-center space-y-1">
                <div className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Accord Conventionnel de Négociation
                </div>
                <div className="text-base sm:text-xl font-black leading-tight">
                  Selon l'accord entre l'agent et l'administration, le montant de l'indemnité spécifique qui figurera dans la convention peut être établi entre :
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 pt-1">
                  {calcul.montantMinimum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € et {calcul.montantMaximum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </div>
              </div>

              {/* Curseur interactif de négociation */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Simulateur de Négociation Conventionnelle
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Positionnement négocié : <span className="text-rose-600 dark:text-rose-400">{negociationPct} %</span> de la fourchette légale
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={negociationPct}
                  onChange={(e) => setNegociationPct(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0% (Plancher légal strict)</span>
                  <span>50% (Compromis médian)</span>
                  <span>100% (Plafond légal maximal)</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Montant brut conventionnel simulé :</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {calcul.montantNegocie.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <div className="text-xs text-slate-500">Représente :</div>
                    <div className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {calcul.moisNegocie.toFixed(2)} mois de traitement brut
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          ONGLET 2 : RÉGIME FISCAL ET SOCIAL (NET EN POCHE)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "fiscalite" && calcul && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              TRAITEMENT FISCAL & SOCIAL DE L'INDEMNITÉ (2026)
            </h3>
            <span className="text-xs font-mono text-slate-400">PASS 2026 = 47 100 €</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            L'Indemnité Spécifique de Rupture Conventionnelle bénéficie d'un régime d'exonération très favorable, combinant
            exonération d'impôt sur le revenu (CGI art. 80 duodecies) et de cotisations de sécurité sociale dans les limites légales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Impôt sur le revenu */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Impôt sur le Revenu (IR)
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                100 % Exonéré
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Exonéré dans la limite du montant prévu par les décrets et jusqu'à 2 fois la rémunération annuelle brute (plafond 6 PASS).
              </p>
            </div>

            {/* Cotisations sécurité sociale */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Cotisations Sécurité Sociale
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400">
                Exonéré jusqu'à 2 PASS
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Aucune cotisation CNRACL / Sécurité Sociale jusqu'à 94 200 € (2 × PASS).
              </p>
            </div>

            {/* CSG / CRDS */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Info className="w-4 h-4 text-amber-600" />
                CSG & CRDS (9,7 %)
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">
                {calcul.csgCrdsEstimee > 0 ? `-${calcul.csgCrdsEstimee.toFixed(2)} €` : "0,00 €"}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                La part équivalente au minimum légal est exonérée de CSG/CRDS. Seule la fraction au-dessus du minimum légal (part supra-légale) est soumise à 9,7 %.
              </p>
            </div>
          </div>

          {/* Décomposition chiffrée Net en poche */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Décomposition du virement sur votre compte bancaire :
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Montant brut négocié de l'indemnité :</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  +{calcul.montantNegocie.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Fraction exonérée de CSG/CRDS (plancher légal) :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {calcul.montantMinimum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (0% CSG)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Fraction supra-légale soumise à CSG/CRDS :</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {calcul.partSupraLegale.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € (assujettie à 9,7%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800 text-rose-600">
                <span>Prélèvement CSG & CRDS (9,7 % sur part supra-légale) :</span>
                <span className="font-mono font-bold">
                  -{calcul.csgCrdsEstimee.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                <span>Net estimé versé sur votre compte :</span>
                <span className="font-mono">
                  {calcul.netEstime.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          {/* Impact sur France Travail (ARE) */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-950 dark:text-purple-200 space-y-2">
            <div className="font-bold flex items-center gap-2 text-purple-800 dark:text-purple-300">
              <Scale className="w-4 h-4 text-purple-600" />
              Droits aux allocations chômage France Travail (ARE) :
            </div>
            <p className="leading-relaxed">
              La rupture conventionnelle ouvre droit à l'Allocation de Retour à l'Emploi (ARE) versée par France Travail (ou par la collectivité en auto-assurance).
            </p>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/50 space-y-1">
              <div>
                <strong>Différé d'indemnisation spécifique :</strong> En cas de négociation au-delà du montant légal minimum,
                la part supra-légale ({calcul.partSupraLegale.toFixed(2)} €) engendre un différé d'indemnisation estimé à{" "}
                <strong className="text-purple-700 dark:text-purple-300">{calcul.differeFranceTravailJours} jour(s)</strong> (dans la limite de 150 jours),
                auquel s'ajoutent les 7 jours de délai d'attente légal et le différé pour congés payés non pris.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          ONGLET 3 : PROCÉDURE, DÉLAIS ET CALENDRIER (DÉCRET N° 2026-745 DU 6 AOÛT 2026)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "procedure" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              PROCÉDURE STATUTAIRE & CALENDRIER LÉGAL (DÉCRET 2026-745)
            </h3>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
              Procédure pérennisée
            </span>
          </div>

          <div className="space-y-4">
            {/* Étape 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">
                  Demande initiale d'ouverture de procédure
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  La rupture conventionnelle peut être initiée soit par l'agent, soit par l'autorité territoriale. La demande est transmise par lettre recommandée avec accusé de réception (LRAR) ou remise en main propre contre décharge.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Entretien préalable de négociation</span>
                  <span className="text-[11px] font-normal text-slate-500">Délai : 10 jours à 1 mois</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  L'entretien se déroule au moins 10 jours francs et au plus 1 mois après réception de la lettre. L'agent peut se faire assister par un conseiller désigné par une organisation syndicale représentative de son choix.
                </p>
                <div className="pt-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  Points abordés : motifs du départ, fixation de la date de cessation de fonctions, montant de l'ISRC, droits aux allocations chômage et conséquences statutaires.
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">
                  Signature de la convention de rupture conventionnelle
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  La convention est établie selon le modèle officiel défini par l'arrêté ministériel du 6 août 2026. Elle fixe le montant exact de l'indemnité convenue et la date de cessation définitive des fonctions.
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                4
              </span>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Délai de rétractation obligatoire</span>
                  <span className="text-[11px] font-bold text-emerald-600">15 jours francs</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Chacune des deux parties dispose d'un délai de 15 jours francs à compter du lendemain de la date de signature de la convention pour exercer son droit de rétractation, sans motif à fournir (par LRAR ou remise en main propre).
                </p>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                5
              </span>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">
                  Radiation des cadres et versement de l'indemnité
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  En l'absence de rétractation, la rupture conventionnelle entraîne la radiation définitive des cadres et la perte de la qualité de fonctionnaire (ou la fin de contrat pour un contractuel en CDI) à la date convenue. L'indemnité est versée en une fois avec le solde de tout compte.
                </p>
              </div>
            </div>
          </div>

          {/* Règle impérative des 6 ans */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 text-xs text-rose-950 dark:text-rose-200 space-y-2">
            <div className="font-black flex items-center gap-2 text-rose-800 dark:text-rose-300 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              ATTENTION : Obligation de remboursement en cas de retour dans les 6 ans (Art. L. 552-4 CGFP)
            </div>
            <p className="leading-relaxed">
              Si vous êtes recruté de nouveau en tant que fonctionnaire ou contractuel dans les <strong>6 années</strong> suivant la rupture au sein de :
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>La même collectivité territoriale ou ses établissements publics rattachés (CCAS, caisse des écoles...) ;</li>
              <li>Ou l'établissement public de coopération intercommunale (EPCI) auquel elle appartient ;</li>
            </ul>
            <p className="leading-relaxed font-semibold">
              Vous avez l'obligation légale de <strong>rembourser l'intégralité de l'indemnité perçue</strong> dans un délai maximal de 2 ans suivant votre réembauche.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
