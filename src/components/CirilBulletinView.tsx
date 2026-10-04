import React, { useState } from 'react';
import {
  FileText,
  Info,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Layers,
  Building,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronRight,
  Printer,
  Download,
  Percent,
  Coins
} from 'lucide-react';
import {
  CalculParams,
  FichePaieAnalyseResult,
  VALEUR_POINT_INDICE_MENSUEL,
  TAUX_ZONE_RESIDENCE_1,
  TAUX_CNRACL_SALARIE,
  TAUX_CNRACL_PATRONAL,
  TAUX_RAFP_SALARIE,
  TAUX_RAFP_PATRONAL,
  TAUX_CSG_DEDUCTIBLE,
  TAUX_CSG_NON_DEDUCTIBLE,
  TAUX_CRDS,
  ASSIETTE_ABATTEMENT_CSG_CRDS
} from '../services/openfiscaPayEngine';

export interface CirilBulletinViewProps {
  params: CalculParams;
  result: FichePaieAnalyseResult;
  onUpdateParam?: (key: keyof CalculParams, value: any) => void;
}

export type CalqueId = 'all' | 'statut' | 'traitement' | 'rifseep' | 'retraite' | 'csg' | 'pas' | 'net';

export interface CalqueDefinition {
  id: CalqueId;
  numero: number;
  titre: string;
  badgeLabel: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  accentBg: string;
  vulgarisationSimple: string;
  formuleChiffree: string;
  conseilCFDT: string;
  referenceLegale: string;
}

export const CALQUES_CIRIL: CalqueDefinition[] = [
  {
    id: 'statut',
    numero: 1,
    titre: "Carte d'identité statutaire (Matricule, Grade & Indice)",
    badgeLabel: "1. Statut & Échelon",
    colorBorder: "border-blue-500",
    colorBg: "bg-blue-50/70 dark:bg-blue-950/40",
    colorText: "text-blue-700 dark:text-blue-300",
    accentBg: "bg-blue-600",
    vulgarisationSimple: "C'est votre carte d'identité dans la fonction publique. Votre Indice Majoré (INM) est le chiffre magique qui détermine la valeur brute de votre travail chaque mois.",
    formuleChiffree: "Indice Brut : {IB} • Indice Majoré : {IM} • Échelon : {ECHELON} • Temps : {QUOTITE}%",
    conseilCFDT: "Vérifiez que votre échelon correspond bien à votre dernier arrêté d'avancement d'échelon. Si vous avez changé d'échelon récemment, la mairie doit effectuer un rappel de salaire.",
    referenceLegale: "Art. L. 712-1 du Code Général de la Fonction Publique (CGFP)"
  },
  {
    id: 'traitement',
    numero: 2,
    titre: "Traitement indiciaire de base & Résidence Zone 1 (3%)",
    badgeLabel: "2. Traitement & 3% Résidence",
    colorBorder: "border-emerald-500",
    colorBg: "bg-emerald-50/70 dark:bg-emerald-950/40",
    colorText: "text-emerald-700 dark:text-emerald-300",
    accentBg: "bg-emerald-600",
    vulgarisationSimple: "Votre salaire de base national. Il est égal à votre Indice Majoré multiplié par la valeur du point d'indice (4,92278 €/mois). À Gennevilliers, la ville est en Zone 1 : vous avez droit obligatoirement à 3% supplémentaires d'indemnité de résidence.",
    formuleChiffree: "{IM} × 4,92278 € = {TIB} € + (3% résidence = {RESIDENCE} €)",
    conseilCFDT: "L'indemnité de résidence de 3% est obligatoire à Gennevilliers (Île-de-France Zone 1). Elle doit figurer sur chaque bulletin sans exception.",
    referenceLegale: "Art. L. 712-1 CGFP & Circulaire ministérielle FP/7 n° 1996 du 12 mars 2001"
  },
  {
    id: 'rifseep',
    numero: 3,
    titre: "Régime Indemnitaire RIFSEEP (IFSE mensuelle & CIA annuel)",
    badgeLabel: "3. Primes RIFSEEP",
    colorBorder: "border-purple-500",
    colorBg: "bg-purple-50/70 dark:bg-purple-950/40",
    colorText: "text-purple-700 dark:text-purple-300",
    accentBg: "bg-purple-600",
    vulgarisationSimple: "Vos primes territoriales fixées par la Ville de Gennevilliers. L'IFSE est versée tous les mois selon votre cadre d'emplois et groupe de fonctions. Le CIA est un complément lié à votre évaluation professionnelle annuelle (CREP).",
    formuleChiffree: "IFSE mensuelle : {IFSE} € + CIA : {CIA} €",
    conseilCFDT: "La CFDT veille à ce que votre IFSE ne puisse jamais être diminuée sans motif valable et revendique son intégration pleine dans le calcul de vos droits à retraite.",
    referenceLegale: "Décret n° 2014-513 & Délibération cadre du Conseil Municipal de Gennevilliers"
  },
  {
    id: 'retraite',
    numero: 4,
    titre: "Cotisations Retraite (Pension CNRACL 11,10% & RAFP 5%)",
    badgeLabel: "4. Retraite CNRACL & RAFP",
    colorBorder: "border-rose-500",
    colorBg: "bg-rose-50/70 dark:bg-rose-950/40",
    colorText: "text-rose-700 dark:text-rose-300",
    accentBg: "bg-rose-600",
    vulgarisationSimple: "Votre épargne retraite obligatoire. Vous cotisez 11,10% de votre traitement brut pour votre future pension de fonctionnaire (CNRACL). En plus, la Ville de Gennevilliers verse 31,65% de cotisation patronale pour vous garantir cette pension !",
    formuleChiffree: "Retraite CNRACL (11,10%) : -{CNRACL} € • RAFP (5% primes) : -{RAFP} €",
    conseilCFDT: "Chaque trimestre travaillé à la Ville de Gennevilliers vous donne des droits à la CNRACL. Le régime additionnel RAFP (retraite par points) permet de cotiser aussi sur vos primes RIFSEEP (dans la limite de 20% du traitement).",
    referenceLegale: "Décret n° 2003-1306 du 26 décembre 2003 & Décret n° 2004-569 (RAFP)"
  },
  {
    id: 'csg',
    numero: 5,
    titre: "Sécurité Sociale & Solidarité (CSG Déductible, Non déd. & CRDS)",
    badgeLabel: "5. Sécurité Sociale & CSG",
    colorBorder: "border-amber-500",
    colorBg: "bg-amber-50/70 dark:bg-amber-950/40",
    colorText: "text-amber-700 dark:text-amber-300",
    accentBg: "bg-amber-600",
    vulgarisationSimple: "Vos contributions de solidarité nationale. Elles financent l'Assurance Maladie, la branche famille et le remboursement de la dette sociale. Elles sont calculées sur 98,25% de votre rémunération globale (abattement de 1,75% pour frais professionnels).",
    formuleChiffree: "Assiette abattue 98,25% ({ASSIETTE_CSG} €) : CSG déd. (6,8%) : -{CSG_DED} € • CSG non déd. (2,4%) : -{CSG_ND} € • CRDS (0,5%) : -{CRDS} €",
    conseilCFDT: "La CSG déductible (6,80%) est automatiquement retirée de vos revenus soumis à l'impôt. La CSG non déductible et la CRDS sont réintégrées dans votre net fiscal imposable.",
    referenceLegale: "Art. L. 136-1 à L. 136-8 du Code de la Sécurité Sociale & Ordonnance n° 96-50"
  },
  {
    id: 'pas',
    numero: 6,
    titre: "Prélèvement à la Source de l'Impôt sur le Revenu (PAS)",
    badgeLabel: "6. Impôt à la Source (PAS)",
    colorBorder: "border-orange-500",
    colorBg: "bg-orange-50/70 dark:bg-orange-950/40",
    colorText: "text-orange-700 dark:text-orange-300",
    accentBg: "bg-orange-600",
    vulgarisationSimple: "Votre impôt sur le revenu prélevé en direct. La Ville de Gennevilliers applique le taux exact que le Trésor Public (DGFiP) lui transmet chaque mois pour vous. La mairie ne connaît pas vos autres revenus, juste ce pourcentage.",
    formuleChiffree: "Net fiscal imposable ({NET_FISCAL} €) × Taux DGFiP ({TAUX_PAS}%) = -{MONTANT_PAS} €",
    conseilCFDT: "Si vos revenus familiaux changent (mariage, naissance, baisse de revenus), vous pouvez modifier votre taux en temps réel sur impots.gouv.fr sans attendre l'année suivante.",
    referenceLegale: "Art. 204 A et suivants du Code Général des Impôts (CGI)"
  },
  {
    id: 'net',
    numero: 7,
    titre: "Net à payer viré sur votre compte bancaire & Coût Employeur",
    badgeLabel: "7. Net Payé & Coût Ville",
    colorBorder: "border-indigo-500",
    colorBg: "bg-indigo-50/70 dark:bg-indigo-950/40",
    colorText: "text-indigo-700 dark:text-indigo-300",
    accentBg: "bg-indigo-600",
    vulgarisationSimple: "Le montant final viré sur votre compte bancaire par la Ville de Gennevilliers à la fin du mois. En dessous, vous pouvez aussi voir le coût réel employeur (votre salaire brut + ~37% de cotisations patronales prises en charge par la commune).",
    formuleChiffree: "Net viré en banque : {NET_A_PAYER} € • Coût total Ville de Gennevilliers : {COUT_EMPLOYEUR} €",
    conseilCFDT: "Conservez votre bulletin de paie sans limitation de durée (sous format électronique sécurisé ou papier). Il vous servira lors de votre départ en retraite.",
    referenceLegale: "Art. L. 3243-2 du Code du travail & Décret n° 2016-1073"
  }
];

export default function CirilBulletinView({ params, result, onUpdateParam }: CirilBulletinViewProps) {
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [activeCalqueId, setActiveCalqueId] = useState<CalqueId>('all');
  const [selectedZone, setSelectedZone] = useState<CalqueId | null>('statut');

  const { agent, totaux } = result;

  // Calculs formatés pour les calques
  const formatCur = (val: number) => val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const activeCalqueDef = CALQUES_CIRIL.find(c => c.id === (selectedZone || 'statut')) || CALQUES_CIRIL[0];

  // Remplacement dynamique des variables dans les formules des calques
  const getRenderedFormule = (calque: CalqueDefinition) => {
    return calque.formuleChiffree
      .replace('{IB}', String(agent.indiceBrut || Math.round(agent.indiceMajore * 1.06)))
      .replace('{IM}', String(agent.indiceMajore))
      .replace('{ECHELON}', agent.echelon)
      .replace('{QUOTITE}', String(agent.quotite))
      .replace('{TIB}', formatCur(totaux.traitementBase))
      .replace('{RESIDENCE}', formatCur(totaux.indemniteResidence))
      .replace('{IFSE}', formatCur(totaux.ifse))
      .replace('{CIA}', formatCur(totaux.cia))
      .replace('{CNRACL}', formatCur(totaux.retraiteSalarie))
      .replace('{RAFP}', formatCur(totaux.rafpSalarie))
      .replace('{ASSIETTE_CSG}', formatCur(totaux.assietteCsgCrds))
      .replace('{CSG_DED}', formatCur(totaux.csgDeductible))
      .replace('{CSG_ND}', formatCur(totaux.csgNonDeductible))
      .replace('{CRDS}', formatCur(totaux.crds))
      .replace('{NET_FISCAL}', formatCur(totaux.netFiscal))
      .replace('{TAUX_PAS}', String(totaux.tauxPas))
      .replace('{MONTANT_PAS}', formatCur(totaux.montantPas))
      .replace('{NET_A_PAYER}', formatCur(totaux.netAPayer))
      .replace('{COUT_EMPLOYEUR}', formatCur(totaux.coutGlobalEmployeur));
  };

  const isZoneActive = (zoneId: CalqueId) => {
    if (!showOverlays) return false;
    if (activeCalqueId === 'all') return true;
    return activeCalqueId === zoneId;
  };

  const isZoneSelected = (zoneId: CalqueId) => {
    return selectedZone === zoneId;
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. BANDEAU DE COMMANDE DES CALQUES D'EXPLICATION
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  Bulletin Officiel Ciril RH • Ville de Gennevilliers
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Civil RH / Ciril GROUP
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cliquez sur n'importe quel calque ou zone surlignée du bulletin pour afficher son explication simple et son calcul certifié.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowOverlays(prev => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showOverlays
                  ? 'bg-orange-600 text-white shadow-sm hover:bg-orange-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {showOverlays ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{showOverlays ? 'Calques Activés' : 'Bulletin Vierge Pur'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer"
              title="Imprimer le bulletin annoté"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Boutons de sélection rapide des calques */}
        {showOverlays && (
          <div className="pt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Filtrer les repères explicatifs :
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { setActiveCalqueId('all'); setSelectedZone(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCalqueId === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                👁️ Tous les 7 calques
              </button>
              {CALQUES_CIRIL.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCalqueId(c.id);
                    setSelectedZone(c.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedZone === c.id
                      ? `${c.accentBg} text-white shadow-sm ring-2 ring-offset-1 ring-orange-400`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    {c.numero}
                  </span>
                  <span>{c.badgeLabel}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. LE VÉRITABLE BULLETIN DE PAIE CIRIL RH (CIVIL RH GENNEVILLIERS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Principale : Fiche Ciril RH A4 Réaliste */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden font-mono text-slate-900 dark:text-slate-100">
          {/* Bandeau d'en-tête supérieur Ciril */}
          <div className="p-5 border-b-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
                  <span className="font-black text-sm tracking-wider uppercase text-slate-900 dark:text-white">
                    VILLE DE GENNEVILLIERS
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                  <p>177, avenue Gabriel Péri - 92230 GENNEVILLIERS</p>
                  <p>SIRET : 219 200 368 00014 • APE : 8411Z • URSSAF : 920 120 000</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Direction des Ressources Humaines • Gestion de la Paie
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right w-full sm:w-auto p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs">
                <div className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  BULLETIN DE PAIE
                </div>
                <div className="text-[11px] text-orange-600 font-bold mt-0.5">
                  Logiciel : Ciril Civil RH
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Période : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-400">
                  Règlement : Virement fin de mois
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────────────
              CARTOUCHE 1 : SITUATION ADMINISTRATIVE CIRIL (CALQUE 1)
          ───────────────────────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedZone('statut')}
            className={`p-4 border-b-2 border-slate-300 dark:border-slate-700 transition-all cursor-pointer relative ${
              isZoneActive('statut')
                ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70'
                : 'hover:bg-slate-50 dark:hover:bg-slate-900'
            } ${isZoneSelected('statut') ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/80 dark:bg-blue-950/40' : ''}`}
          >
            {showOverlays && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs animate-pulse">
                <span>Calque 1</span>
                <HelpCircle className="w-3 h-3" />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Matricule</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">014829</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-400 block uppercase">Nom et Prénom</span>
                <span className="font-extrabold text-slate-900 dark:text-white uppercase">
                  {agent.nom || "MARTIN Sylvie"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Temps / Quotité</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{agent.quotite}% (35h00)</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-400 block uppercase">Grade / Emploi</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {agent.grade || "Adjoint administratif territorial"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Échelon</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {agent.echelon || "Échelon 4"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Indice Brut / INM</span>
                <span className="font-black text-orange-600 dark:text-orange-400 text-sm">
                  {agent.indiceBrut || Math.round(agent.indiceMajore * 1.06)} / {agent.indiceMajore}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Caisse Retraite</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{agent.caisseRetraite}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Zone Résidence</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Zone 1 (3%)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Enfants SFT</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{agent.nbEnfantsSft || 0} enfant(s)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Statut Statutaire</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{agent.statut}</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────────────
              CORPS DU TABLEAU : RUBRIQUES DE PAIE CIRIL RH
          ───────────────────────────────────────────────────────────────────────────── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
                  <th className="py-2.5 px-3 w-14">Code</th>
                  <th className="py-2.5 px-3">Désignation de la Rubrique</th>
                  <th className="py-2.5 px-2 text-right">Base</th>
                  <th className="py-2.5 px-2 text-right">Taux Sal.</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">Part Salariale (Gain)</th>
                  <th className="py-2.5 px-3 text-right text-rose-700 dark:text-rose-400">Retenue</th>
                  <th className="py-2.5 px-2 text-right hidden sm:table-cell">Taux Pat.</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-500">Charges Pat.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {/* ─────────────────────────────────────────────────────────────
                    SECTION 1 : TRAITEMENT DE BASE & RÉSIDENCE (CALQUE 2)
                ───────────────────────────────────────────────────────────── */}
                <tr
                  onClick={() => setSelectedZone('traitement')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('traitement')
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('traitement') ? 'bg-emerald-100/70 dark:bg-emerald-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0100</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {showOverlays && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          2
                        </span>
                      )}
                      <span>Traitement de base (IM {agent.indiceMajore})</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">{agent.indiceMajore}</td>
                  <td className="py-2 px-2 text-right font-mono text-[11px]">{VALEUR_POINT_INDICE_MENSUEL.toFixed(4)}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCur(totaux.traitementBase)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                <tr
                  onClick={() => setSelectedZone('traitement')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('traitement')
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('traitement') ? 'bg-emerald-100/70 dark:bg-emerald-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0105</td>
                  <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                    Indemnité de résidence Zone 1
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.traitementBase)}</td>
                  <td className="py-2 px-2 text-right">3,000 %</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCur(totaux.indemniteResidence)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                {totaux.sft > 0 && (
                  <tr
                    onClick={() => setSelectedZone('traitement')}
                    className={`transition-colors cursor-pointer ${
                      isZoneActive('traitement')
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-slate-400">0110</td>
                    <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                      Supplément Familial de Traitement ({agent.nbEnfantsSft} enf.)
                    </td>
                    <td className="py-2 px-2 text-right">{formatCur(totaux.traitementBase)}</td>
                    <td className="py-2 px-2 text-right">-</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCur(totaux.sft)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">-</td>
                    <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                    <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                  </tr>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    SECTION 2 : RIFSEEP (IFSE & CIA) (CALQUE 3)
                ───────────────────────────────────────────────────────────── */}
                <tr
                  onClick={() => setSelectedZone('rifseep')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('rifseep')
                      ? 'bg-purple-50/50 dark:bg-purple-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('rifseep') ? 'bg-purple-100/70 dark:bg-purple-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0200</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {showOverlays && (
                        <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          3
                        </span>
                      )}
                      <span className="font-semibold">RIFSEEP - IFSE mensuelle</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">Fixe</td>
                  <td className="py-2 px-2 text-right">-</td>
                  <td className="py-2 px-3 text-right font-bold text-purple-600 dark:text-purple-400">
                    {formatCur(totaux.ifse)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                {totaux.cia > 0 && (
                  <tr
                    onClick={() => setSelectedZone('rifseep')}
                    className={`transition-colors cursor-pointer ${
                      isZoneActive('rifseep')
                        ? 'bg-purple-50/50 dark:bg-purple-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-slate-400">0210</td>
                    <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                      RIFSEEP - CIA (Complément Individuel Annuel)
                    </td>
                    <td className="py-2 px-2 text-right">-</td>
                    <td className="py-2 px-2 text-right">-</td>
                    <td className="py-2 px-3 text-right font-bold text-purple-600 dark:text-purple-400">
                      {formatCur(totaux.cia)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">-</td>
                    <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                    <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                  </tr>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    SECTION 3 : COTISATIONS RETRAITE (CALQUE 4)
                ───────────────────────────────────────────────────────────── */}
                <tr
                  onClick={() => setSelectedZone('retraite')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('retraite')
                      ? 'bg-rose-50/50 dark:bg-rose-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('retraite') ? 'bg-rose-100/70 dark:bg-rose-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0500</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {showOverlays && (
                        <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          4
                        </span>
                      )}
                      <span>Retraite CNRACL (Pension)</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.traitementBase)}</td>
                  <td className="py-2 px-2 text-right">11,100 %</td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCur(totaux.retraiteSalarie)}
                  </td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-600">31,650 %</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell font-mono text-slate-600">
                    {formatCur(totaux.traitementBase * TAUX_CNRACL_PATRONAL)}
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedZone('retraite')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('retraite')
                      ? 'bg-rose-50/50 dark:bg-rose-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('retraite') ? 'bg-rose-100/70 dark:bg-rose-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0510</td>
                  <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                    Retraite Additionnelle RAFP (Primes)
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.ifse + totaux.cia)}</td>
                  <td className="py-2 px-2 text-right">5,000 %</td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCur(totaux.rafpSalarie)}
                  </td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-600">5,000 %</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell font-mono text-slate-600">
                    {formatCur(totaux.rafpSalarie)}
                  </td>
                </tr>

                {/* ─────────────────────────────────────────────────────────────
                    SECTION 4 : SÉCURITÉ SOCIALE CSG / CRDS (CALQUE 5)
                ───────────────────────────────────────────────────────────── */}
                <tr
                  onClick={() => setSelectedZone('csg')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('csg')
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('csg') ? 'bg-amber-100/70 dark:bg-amber-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0600</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {showOverlays && (
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          5
                        </span>
                      )}
                      <span>CSG Déductible (6,80%)</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.assietteCsgCrds)}</td>
                  <td className="py-2 px-2 text-right">6,800 %</td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCur(totaux.csgDeductible)}
                  </td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                <tr
                  onClick={() => setSelectedZone('csg')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('csg')
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('csg') ? 'bg-amber-100/70 dark:bg-amber-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0610</td>
                  <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                    CSG Non Déductible (2,40%)
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.assietteCsgCrds)}</td>
                  <td className="py-2 px-2 text-right">2,400 %</td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCur(totaux.csgNonDeductible)}
                  </td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                <tr
                  onClick={() => setSelectedZone('csg')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('csg')
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('csg') ? 'bg-amber-100/70 dark:bg-amber-950/50 font-bold' : ''}`}
                >
                  <td className="py-2 px-3 font-mono text-slate-400">0620</td>
                  <td className="py-2 px-3 pl-8 text-slate-700 dark:text-slate-300">
                    CRDS Dette Sociale (0,50%)
                  </td>
                  <td className="py-2 px-2 text-right">{formatCur(totaux.assietteCsgCrds)}</td>
                  <td className="py-2 px-2 text-right">0,500 %</td>
                  <td className="py-2 px-3 text-right text-slate-300">-</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCur(totaux.crds)}
                  </td>
                  <td className="py-2 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>

                {/* ─────────────────────────────────────────────────────────────
                    SECTION 5 : PRÉLÈVEMENT À LA SOURCE (CALQUE 6)
                ───────────────────────────────────────────────────────────── */}
                <tr
                  onClick={() => setSelectedZone('pas')}
                  className={`transition-colors cursor-pointer ${
                    isZoneActive('pas')
                      ? 'bg-orange-50/50 dark:bg-orange-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${isZoneSelected('pas') ? 'bg-orange-100/70 dark:bg-orange-950/50 font-bold' : ''}`}
                >
                  <td className="py-2.5 px-3 font-mono text-slate-400">0950</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {showOverlays && (
                        <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          6
                        </span>
                      )}
                      <span className="font-bold text-slate-900 dark:text-white">
                        Prélèvement à la Source (Taux DGFiP : {totaux.tauxPas}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold">{formatCur(totaux.netFiscal)}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-orange-600 dark:text-orange-400">
                    {totaux.tauxPas}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">-</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                    {formatCur(totaux.montantPas)}
                  </td>
                  <td className="py-2.5 px-2 text-right hidden sm:table-cell text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────────────
              PIED DU BULLETIN CIRIL RH : ENCADRÉ NET & TOTAUX (CALQUE 7)
          ───────────────────────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedZone('net')}
            className={`p-4 border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 transition-all cursor-pointer relative ${
              isZoneActive('net') ? 'hover:bg-indigo-50/50' : ''
            } ${isZoneSelected('net') ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40' : ''}`}
          >
            {showOverlays && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs animate-pulse">
                <span>Calque 7</span>
                <HelpCircle className="w-3 h-3" />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Brut</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {formatCur(totaux.salaireBrut)} €
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Retenues Salariales</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                  -{formatCur(totaux.totalCotisationsSalariales)} €
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Net Imposable (Fiscal)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatCur(totaux.netFiscal)} €
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Net Avant Impôt</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatCur(totaux.netAvantImpot)} €
                </span>
              </div>
            </div>

            {/* ENCADRÉ OFFICIEL CIRIL : LE NET PAYÉ EN EUROS */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100 block">
                  NET PAYÉ EN EUROS (Virement Bancaire)
                </span>
                <span className="text-[11px] text-emerald-200">
                  Montant viré sur votre compte bancaire à la fin du mois
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {formatCur(totaux.netAPayer)} €
              </div>
            </div>

            {/* Coût employeur & Charges patronales */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
              <div>
                Charges Patronales Ville de Gennevilliers : <span className="font-bold text-slate-700 dark:text-slate-300">{formatCur(totaux.totalCotisationsPatronales)} €</span>
              </div>
              <div>
                Coût Global Employeur : <span className="font-bold text-slate-700 dark:text-slate-300">{formatCur(totaux.coutGlobalEmployeur)} €</span>
              </div>
            </div>

            {/* Mention légale Ciril */}
            <div className="text-[9px] text-slate-400 text-center pt-2 italic">
              « Pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée » — Art. L. 3243-2 Code du travail
            </div>
          </div>
        </div>

        {/* Colonne Droite : Le Calque Explicatif Actif (Panneau Pédagogique) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-2xl border-2 ${activeCalqueDef.colorBorder} ${activeCalqueDef.colorBg} shadow-md space-y-4 sticky top-6`}>
            <div className="flex items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full ${activeCalqueDef.accentBg} text-white flex items-center justify-center text-xs font-black`}>
                  {activeCalqueDef.numero}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Explication du Calque {activeCalqueDef.numero}/7
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-slate-900/80 ${activeCalqueDef.colorText} border border-current`}>
                {activeCalqueDef.badgeLabel}
              </span>
            </div>

            <div>
              <h4 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                {activeCalqueDef.titre}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                {activeCalqueDef.vulgarisationSimple}
              </p>
            </div>

            {/* Formule Chiffrée Réelle */}
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calcul exact sur votre bulletin :
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-xs break-words">
                {getRenderedFormule(activeCalqueDef)}
              </div>
            </div>

            {/* Conseil CFDT Gennevilliers */}
            <div className="p-3 bg-orange-50/80 dark:bg-orange-950/40 rounded-xl border border-orange-200 dark:border-orange-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-orange-800 dark:text-orange-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Point de vigilance CFDT Gennevilliers :</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                {activeCalqueDef.conseilCFDT}
              </p>
            </div>

            {/* Référence légale */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <Scale className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="italic">{activeCalqueDef.referenceLegale}</span>
            </div>

            {/* Navigation rapide entre les 7 calques */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = CALQUES_CIRIL.findIndex(c => c.id === activeCalqueDef.id);
                  const prevIdx = (idx - 1 + CALQUES_CIRIL.length) % CALQUES_CIRIL.length;
                  setSelectedZone(CALQUES_CIRIL[prevIdx].id);
                }}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                ← Précédent
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {activeCalqueDef.numero} / 7
              </span>
              <button
                onClick={() => {
                  const idx = CALQUES_CIRIL.findIndex(c => c.id === activeCalqueDef.id);
                  const nextIdx = (idx + 1) % CALQUES_CIRIL.length;
                  setSelectedZone(CALQUES_CIRIL[nextIdx].id);
                }}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
