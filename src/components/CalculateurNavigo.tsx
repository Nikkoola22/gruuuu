import { useState, useMemo } from "react";
import {
  ArrowLeft,
  TrainFront,
  Calculator,
  MapPin,
  CalendarCheck,
  Percent,
  Wallet,
  Info,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Search
} from "lucide-react";

interface CalculateurNavigoProps {
  onClose?: () => void;
}

/** Lieu de travail : la Ville de Gennevilliers est en zone Navigo 3 */
const GENNEVILLIERS_ZONE = 3;
const GENNEVILLIERS_LABEL = "Gennevilliers (zone 3)";
/** Mois payés par an : le 12e mois (vacances) est offert par Île-de-France Mobilités */
const MOIS_PAYES = 11;

/** Tarifs mensuels de référence par couverture de zones (Île-de-France Mobilités, 2026) — modifiables */
const PRIX_COVERAGE: Record<number, number> = {
  1: 74.3,   // zone unique ou 1 zone
  2: 86.4,   // 2 zones contiguës (ex. zones 3-4)
  3: 88.8,   // au-delà : forfait toutes zones
  4: 88.8,
  5: 88.8
};

/** Zones Navigo par commune d'Île-de-France (zonage 1-5) — indicatif, clés sans accents/minuscules */
const ZONES_VILLES: Record<string, number> = {
  paris: 1,
  // ── Zone 2 ──
  clichy: 2, "levallois-perret": 2, "neuilly-sur-seine": 2, "boulogne-billancourt": 2,
  "issy-les-moulineaux": 2, vanves: 2, malakoff: 2, montrouge: 2, gentilly: 2,
  "le-kremlin-bicetre": 2, "saint-ouen": 2, "saint-ouen-sur-seine": 2, pantin: 2,
  "le-pre-saint-gervais": 2, "les-lilas": 2, bagnolet: 2, vincennes: 2, "saint-mande": 2,
  "ivry-sur-seine": 2,
  // ── Zone 3 ──
  gennevilliers: 3, "asnieres-sur-seine": 3, colombes: 3, "bois-colombes": 3,
  "la-garenne-colombes": 3, courbevoie: 3, puteaux: 3, nanterre: 3, "rueil-malmaison": 3,
  suresnes: 3, bezons: 3, chatou: 3, "carrieres-sur-seine": 3, houilles: 3,
  "saint-denis": 3, "villeneuve-la-garenne": 3, "epinay-sur-seine": 3, villetaneuse: 3,
  aubervilliers: 3, montreuil: 3, "rosny-sous-bois": 3, "noisy-le-sec": 3, drancy: 3,
  "le-blanc-mesnil": 3, "le-bourget": 3, dugny: 3, stains: 3, "bonneuil-sur-marne": 3,
  argenteuil: 3, meudon: 3, sevres: 3, "saint-cloud": 3, chaville: 3, "ville-d-avray": 3,
  clamart: 3, "le-plessis-robinson": 3, "fontenay-aux-roses": 3, bagneux: 3, sceaux: 3,
  "bourg-la-reine": 3, "chatenay-malabry": 3, "l-hay-les-roses": 3, cachan: 3,
  villejuif: 3, "chevilly-larue": 3, thiais: 3, "choisy-le-roi": 3, "vitry-sur-seine": 3,
  "maisons-alfort": 3, alfortville: 3, creteil: 3, "saint-maur-des-fosses": 3,
  "joinville-le-pont": 3, "champigny-sur-marne": 3, "bry-sur-marne": 3,
  "nogent-sur-marne": 3, "le-perreux-sur-marne": 3, "fontenay-sous-bois": 3,
  "villeneuve-le-roi": 3, "ablon-sur-seine": 3, "villeneuve-saint-georges": 3,
  valenton: 3, versailles: 3, viroflay: 3, "cormeilles-en-parisis": 3,
  // ── Zone 4 ──
  sannois: 4, ermont: 4, eaubonne: 4, franconville: 4, montmorency: 4,
  "deuil-la-barre": 4, montmagny: 4, groslay: 4, sarcelles: 4, "garges-les-gonesse": 4,
  "villiers-le-bel": 4, "bonneuil-en-france": 4, "pierrefitte-sur-seine": 4,
  "aulnay-sous-bois": 4, sevran: 4, "livry-gargan": 4, "clichy-sous-bois": 4,
  montfermeil: 4, coubron: 4, gagny: 4, "le-raincy": 4, villemomble: 4,
  "noisy-le-grand": 4, "villiers-sur-marne": 4, "le-plessis-trevise": 4,
  "chenneviers-sur-marne": 4, "boissy-saint-leger": 4, "sucy-en-brie": 4,
  "la-queue-en-brie": 4, orly: 4, "athis-mons": 4, "juvisy-sur-orge": 4,
  "savigny-sur-orge": 4, "viry-chatillon": 4, grigny: 4, "ris-orangis": 4, massy: 4,
  palaiseau: 4, "villebon-sur-yvette": 4, "le-chesnay": 4, louveciennes: 4,
  bougival: 4, "marly-le-roi": 4, "noisy-le-roi": 4, bailly: 4,
  "saint-germain-en-laye": 4, "le-vesinet": 4, "croissy-sur-seine": 4,
  sartrouville: 4, "maisons-laffitte": 4, "la-frette-sur-seine": 4, herblay: 4,
  taverny: 4, bessancourt: 4,
  // ── Zone 5 ──
  pontoise: 5, cergy: 5, osny: 5, "auvers-sur-oise": 5,
  "conflans-sainte-honorine": 5, andresy: 5, acheres: 5, poissy: 5, "les-mureaux": 5,
  "meulan-en-yvelines": 5, evry: 5, courcouronnes: 5, "corbeil-essonnes": 5,
  draveil: 5, "vigneux-sur-seine": 5, montgeron: 5, brunoy: 5, yerres: 5, torcy: 5,
  "bussy-saint-georges": 5, chessy: 5, noisiel: 5, lognes: 5, emerainville: 5,
  "croissy-beaubourg": 5, melun: 5, "savigny-le-temple": 5, "dammarie-les-lys": 5
};

const normaliser = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Communes disposant d'une liaison directe vers Gennevilliers SANS passer par Paris
 * (RER C nord-ouest, ligne 13, tram T1/T2, ligne L ouest, bus nord-ouest).
 * Pour toutes les autres communes (sud, est…), l'itinéraire transite par Paris (zone 1)
 * : le forfait doit alors inclure la zone 1.
 */
const LIAISON_DIRECTE = new Set([
  "gennevilliers", "asnieres-sur-seine", "colombes", "bois-colombes",
  "la-garenne-colombes", "courbevoie", "puteaux", "nanterre", "rueil-malmaison",
  "suresnes", "bezons", "chatou", "carrieres-sur-seine", "houilles",
  "sartrouville", "maisons-laffitte", "le-vesinet", "saint-germain-en-laye",
  "marly-le-roi", "noisy-le-roi", "bailly", "le-chesnay", "la-celle-saint-cloud",
  "vaucresson", "marnes-la-coquette", "garches", "meudon", "sevres",
  "saint-cloud", "chaville", "ville-d-avray", "villeneuve-la-garenne",
  "l-ile-saint-denis", "saint-denis", "epinay-sur-seine", "villetaneuse",
  "stains", "le-bourget", "dugny", "clichy", "levallois-perret", "malakoff",
  "vanves", "montrouge", "chatillon"
]);

const VILLES_TRIEES = Object.keys(ZONES_VILLES)
  .map(k => ({ cle: k, zone: ZONES_VILLES[k], label: k.replace(/(^|\s|-)\w/g, c => c.toUpperCase()) }))
  .sort((a, b) => a.label.localeCompare(b.label, "fr"));

export default function CalculateurNavigo({ onClose }: CalculateurNavigoProps) {
  // Ville de domicile (saisie libre avec suggestions) → zone automatique
  const [ville, setVille] = useState("Montmorency");
  const [zoneDomicile, setZoneDomicile] = useState<number | null>(4);
  const [villeReconnue, setVilleReconnue] = useState(true);
  // Override manuel du passage par Paris (null = détection automatique selon la commune)
  const [viaParisOverride, setViaParisOverride] = useState<boolean | null>(null);

  const [taux, setTaux] = useState(75);

  const fmt = (v: number) =>
    v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const viaParis = useMemo(() => {
    if (viaParisOverride !== null) return viaParisOverride;
    return !LIAISON_DIRECTE.has(normaliser(ville));
  }, [ville, viaParisOverride]);

  const couverture = useMemo(() => {
    if (zoneDomicile === null) return null;
    // Si l'itinéraire passe par Paris (zone 1), le forfait doit inclure la zone 1
    const min = viaParis ? 1 : Math.min(GENNEVILLIERS_ZONE, zoneDomicile);
    const max = Math.max(GENNEVILLIERS_ZONE, zoneDomicile);
    return { min, max, nbZones: max - min + 1, inclutParis: min === 1 };
  }, [zoneDomicile, viaParis]);

  const prixAuto = useMemo(() => {
    if (!couverture) return 86.4;
    // Les forfaits zonés ne couvrent que 2 zones contiguës (2-3, 3-4, 4-5) ;
    // au-delà (dont toute couverture incluant Paris), c'est le forfait toutes zones
    if (couverture.inclutParis || couverture.nbZones >= 3) return 88.8;
    return PRIX_COVERAGE[couverture.nbZones] ?? 88.8;
  }, [couverture]);

  // Prix effectif : le barème automatique, sauf si l'utilisateur a saisi un montant
  const prixMensuel = prixAuto;

  const rechercherVille = (saisie: string) => {
    setVille(saisie);
    const cle = normaliser(saisie);
    const zone = ZONES_VILLES[cle] ?? null;
    setVilleReconnue(zone !== null);
    setZoneDomicile(zone);
    setViaParisOverride(null);
  };

  const definirZoneManuelle = (zone: number | null) => {
    setZoneDomicile(zone);
    setViaParisOverride(null);
  };

  const reset = () => {
    setVille("Montmorency");
    setZoneDomicile(4);
    setVilleReconnue(true);
    setViaParisOverride(null);
    setTaux(75);
  };

  const coutAnnuel = prixMensuel * MOIS_PAYES;
  const mensualise = MOIS_PAYES > 0 ? coutAnnuel / 12 : 0;
  const remboursementMensuel = mensualise * (taux / 100);
  const remboursementAnnuel = remboursementMensuel * 12;
  const resteACharge = mensualise - remboursementMensuel;

  const forfaitLabel = !couverture
    ? null
    : viaParis
      ? couverture.max >= 5 || couverture.min <= 2
        ? "Toutes zones (via Paris)"
        : `Zones 1-${couverture.max} (via Paris)`
      : couverture.nbZones >= 5 || (couverture.min === 1 && couverture.max === 5)
        ? "Toutes zones"
        : couverture.min === couverture.max
          ? `Zone ${couverture.min}`
          : `Zones ${couverture.min}-${couverture.max}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <TrainFront className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Remboursement Carte Navigo
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Saisissez votre ville de domicile : la zone et le calcul sont automatiques
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={reset}
              title="Reprendre l'exemple Montmorency ⇄ Gennevilliers"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Exemple type</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
                title="Retour aux calculateurs"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Réglages ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
            <Search className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
            Votre domicile
          </h2>
        </div>

        {/* Ville de domicile */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Ville de domicile
          </label>
          <input
            type="text"
            list="villes-navigo"
            value={ville}
            onChange={(e) => rechercherVille(e.target.value)}
            placeholder="Ex: Montmorency, Sarcelles, Paris..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
          />
          <datalist id="villes-navigo">
            {VILLES_TRIEES.map(v => (
              <option key={v.cle} value={v.label} />
            ))}
          </datalist>

          {/* Résultat de détection */}
          {zoneDomicile !== null && (
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/30 px-3 py-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="text-xs sm:text-sm text-teal-900 dark:text-teal-200 font-semibold">
                Zone Navigo détectée : <b>zone {zoneDomicile}</b>
                {!villeReconnue && <span className="font-normal text-slate-500 dark:text-slate-400"> (saisie manuelle)</span>}
              </span>
            </div>
          )}
          {zoneDomicile === null && (
            <div className="mt-2.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
              <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold">
                Ville non reconnue dans la table — choisissez votre zone manuellement :
              </p>
              <select
                value=""
                onChange={(e) => definirZoneManuelle(e.target.value ? parseInt(e.target.value) : null)}
                className="mt-2 w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold cursor-pointer"
              >
                <option value="">— Sélectionnez la zone de votre commune —</option>
                {[1, 2, 3, 4, 5].map(z => (
                  <option key={z} value={z}>Zone {z}</option>
                ))}
              </select>
              <p className="text-[10px] text-amber-800 dark:text-amber-300/70 mt-1.5">
                Astuce : votre zone figure sur navigo.fr ou sur votre abonnement.
              </p>
            </div>
          )}
        </div>

        {/* Lieu de travail : Gennevilliers */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            Lieu de travail
          </span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            {GENNEVILLIERS_LABEL}
          </span>
        </div>

        {/* Passage par Paris : le forfait doit couvrir toutes les zones traversées */}
        {zoneDomicile !== null && (
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={viaParis}
              onChange={(e) => setViaParisOverride(e.target.checked)}
              className="mt-0.5 accent-teal-600 cursor-pointer shrink-0"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <b className="text-slate-800 dark:text-slate-200">Mon trajet passe par Paris (zone 1)</b> —
              cochez si votre itinéraire emprunte Paris (ex. RER B ou A avec correspondance).
              Le forfait doit alors couvrir la zone 1.
              {!viaParis && viaParisOverride === null && (
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Détection automatique : liaison directe vers Gennevilliers connue depuis {ville || "votre commune"}.
                </span>
              )}
            </span>
          </label>
        )}

        {/* Paramètres automatiques (non modifiables) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Wallet className="w-3 h-3" />
              Pass mensuel
            </span>
            <span className="block font-black text-slate-900 dark:text-white text-base mt-1">
              {fmt(prixMensuel)} €
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">{forfaitLabel ?? ""}</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <CalendarCheck className="w-3 h-3" />
              Mois payés / an
            </span>
            <span className="block font-black text-slate-900 dark:text-white text-base mt-1">
              {MOIS_PAYES} mois
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">12e mois offert</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Percent className="w-3 h-3" />
              Prise en charge
            </span>
            <span className="block font-black text-slate-900 dark:text-white text-base mt-1">
              {taux} %
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Taux employeur public</span>
          </div>
        </div>
      </div>

      {/* ── Résultats ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
            Votre remboursement{ville ? ` — ${ville}` : ""}
          </h2>
        </div>

        {/* Mise en avant : remboursement mensuel */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-100 block">
              Prise en charge mensuelle
            </span>
            <span className="text-xs text-teal-100">
              {taux} % de {fmt(mensualise)} € (pass mensualisé){forfaitLabel ? ` — ${forfaitLabel}` : ""}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            {fmt(remboursementMensuel)} €
            <span className="text-sm font-bold text-teal-100"> /mois</span>
          </div>
        </div>

        {/* Détail du calcul */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Pass mensuel", value: fmt(prixMensuel) + " €", note: forfaitLabel ?? "" },
            { label: "Coût annuel", value: fmt(coutAnnuel) + " €", note: `${MOIS_PAYES} mois payés (12e offert)` },
            { label: "Mensualisé", value: fmt(mensualise) + " €", note: "Annuel ÷ 12 mois" },
            { label: "Remboursement annuel", value: fmt(remboursementAnnuel) + " €", note: `${taux} % × 12 mois` },
          ].map(c => (
            <div key={c.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.label}</span>
              <span className="block font-black text-slate-900 dark:text-white text-lg mt-0.5">{c.value}</span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{c.note}</span>
            </div>
          ))}
        </div>

        {/* Reste à charge */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Reste à charge mensuel</span>
          <span className="font-black text-slate-900 dark:text-white font-mono">{fmt(resteACharge)} €</span>
        </div>
      </div>

      {/* ── Explication de la méthode ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
            Comment le calcul est-il fait ?
          </h2>
        </div>
        <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-none">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>
              <b>La prise en compte porte sur le trajet domicile ⇄ travail</b> : la zone Navigo
              de votre commune est détectée automatiquement, puis comparée à celle de
              Gennevilliers (zone {GENNEVILLIERS_ZONE}).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>
              <b>Le forfait couvre les zones entre votre domicile et Gennevilliers</b>
              {couverture ? ` : ici zones ${couverture.min}${couverture.max !== couverture.min ? `-${couverture.max}` : ""}` : ""} —
              le forfait annuel compte 11 mois payés : {fmt(prixMensuel)} € × {MOIS_PAYES} ={" "}
              <b>{fmt(coutAnnuel)} € / an</b> (le 12e mois, vacances, est offert).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>
              <b>Mensualisation</b> : {fmt(coutAnnuel)} € ÷ 12 = <b>{fmt(mensualise)} € / mois</b>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>
              <b>Prise en charge à {taux} %</b> : {fmt(mensualise)} € × {taux / 100} ={" "}
              <b className="text-teal-600 dark:text-teal-400">{fmt(remboursementMensuel)} € / mois</b>{" "}
              versés directement sur votre bulletin de paie.
            </span>
          </li>
        </ol>
        <div className="flex items-start gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 p-3 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
          <span>
            <b>Cadre légal :</b> la prise en charge d'au moins 75 % du prix de l'abonnement de
            transport est <b>obligatoire pour les employeurs publics</b> (décret n° 2023-812 du
            21 août 2023). Cette part est exonérée de cotisations sociales dans la limite de 50 % ;
            la fraction au-delà de 50 % reste soumise à CSG/CRDS. Zones et tarifs : Île-de-France
            Mobilités (tarifs 2026 — vérifiez sur iledefrance-mobilites.fr).
          </span>
        </div>
      </div>
    </div>
  );
}
