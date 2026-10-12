import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calculator,
  Euro,
  HelpCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Printer,
  ChevronDown,
  Info,
  BadgePercent,
  Receipt,
  HeartHandshake
} from 'lucide-react';
import { toast } from 'sonner';
import {
  simulerImpotRevenu,
  BAREME_IR_2026,
  type SituationFiscaleInput,
  type SimulationIRResult
} from '../services/impotRevenuEngine';

interface SimulateurImpotRevenuProps {
  onClose?: () => void;
  initialNetFiscalMensuel?: number;
  initialTauxPas?: number;
}

export const SimulateurImpotRevenu: React.FC<SimulateurImpotRevenuProps> = ({
  onClose,
  initialNetFiscalMensuel,
  initialTauxPas,
}) => {
  // Mode de saisie des revenus : Mensuel ou Annuel
  const [modeSaisie, setModeSaisie] = useState<'mensuel' | 'annuel'>('mensuel');

  // État du formulaire
  const [netFiscalMensuel1, setNetFiscalMensuel1] = useState<number>(initialNetFiscalMensuel || 2150);
  const [netFiscalAnnuel1, setNetFiscalAnnuel1] = useState<number>(
    initialNetFiscalMensuel ? Math.round(initialNetFiscalMensuel * 12) : 25800
  );

  const [tauxPas, setTauxPas] = useState<number>(initialTauxPas !== undefined ? initialTauxPas : 3.5);
  const [situation, setSituation] = useState<'celibataire' | 'marie_pacse' | 'divorce' | 'separe'>('celibataire');
  const [nbEnfants, setNbEnfants] = useState<number>(0);
  const [parentIsole, setParentIsole] = useState<boolean>(false);

  // Conjoint
  const [netFiscalMensuel2, setNetFiscalMensuel2] = useState<number>(1900);
  const [netFiscalAnnuel2, setNetFiscalAnnuel2] = useState<number>(22800);

  // Frais réels optionnels
  const [utiliserFraisReels, setUtiliserFraisReels] = useState<boolean>(false);
  const [fraisReelsMontant, setFraisReelsMontant] = useState<number>(2500);

  // Cotisation syndicale (crédit d'impôt 66%)
  const [cotisationSyndicaleAnnuelle, setCotisationSyndicaleAnnuelle] = useState<number>(180);

  // Gestion de la bascule mensuel / annuel
  const handleNetFiscalMensuelChange = (val: number) => {
    setNetFiscalMensuel1(val);
    setNetFiscalAnnuel1(Math.round(val * 12));
  };

  const handleNetFiscalAnnuelChange = (val: number) => {
    setNetFiscalAnnuel1(val);
    setNetFiscalMensuel1(Math.round(val / 12));
  };

  const handleNetFiscalMensuel2Change = (val: number) => {
    setNetFiscalMensuel2(val);
    setNetFiscalAnnuel2(Math.round(val * 12));
  };

  const handleNetFiscalAnnuel2Change = (val: number) => {
    setNetFiscalAnnuel2(val);
    setNetFiscalMensuel2(Math.round(val / 12));
  };

  // Profils types rapides
  const appliquerPreset = (preset: 'celibataire_c' | 'couple_agents' | 'famille_2enf' | 'parent_isole') => {
    if (preset === 'celibataire_c') {
      setSituation('celibataire');
      setNbEnfants(0);
      setParentIsole(false);
      handleNetFiscalMensuelChange(1950);
      setTauxPas(2.5);
    } else if (preset === 'couple_agents') {
      setSituation('marie_pacse');
      setNbEnfants(0);
      setParentIsole(false);
      handleNetFiscalMensuelChange(2300);
      handleNetFiscalMensuel2Change(2100);
      setTauxPas(4.2);
    } else if (preset === 'famille_2enf') {
      setSituation('marie_pacse');
      setNbEnfants(2);
      setParentIsole(false);
      handleNetFiscalMensuelChange(2600);
      handleNetFiscalMensuel2Change(2200);
      setTauxPas(2.0);
    } else if (preset === 'parent_isole') {
      setSituation('divorce');
      setNbEnfants(1);
      setParentIsole(true);
      handleNetFiscalMensuelChange(2200);
      setTauxPas(0.0);
    }
    toast.success('Profil type appliqué !');
  };

  // Calcul du résultat
  const simulationInput: SituationFiscaleInput = useMemo(() => {
    const sal1 = netFiscalAnnuel1;
    const sal2 = situation === 'marie_pacse' ? netFiscalAnnuel2 : 0;
    return {
      situation,
      nbEnfants,
      parentIsole: situation !== 'marie_pacse' ? parentIsole : false,
      salaireNetFiscalAnnuelDeclarant1: sal1,
      salaireNetFiscalAnnuelDeclarant2: sal2,
      fraisReelsDeclarant1: utiliserFraisReels ? fraisReelsMontant : undefined,
      tauxPasMensuel: tauxPas,
    };
  }, [
    situation,
    nbEnfants,
    parentIsole,
    netFiscalAnnuel1,
    netFiscalAnnuel2,
    utiliserFraisReels,
    fraisReelsMontant,
    tauxPas,
  ]);

  const resultat: SimulationIRResult = useMemo(() => {
    return simulerImpotRevenu(simulationInput);
  }, [simulationInput]);

  // Crédit d'impôt syndical (66% selon art. 199 quater C du CGI)
  const creditImpotSyndical = useMemo(() => {
    return Math.round(cotisationSyndicaleAnnuelle * 0.66);
  }, [cotisationSyndicaleAnnuelle]);

  const coutReelCotisation = useMemo(() => {
    return cotisationSyndicaleAnnuelle - creditImpotSyndical;
  }, [cotisationSyndicaleAnnuelle, creditImpotSyndical]);

  // Impôt net après crédit syndical
  const impotApresCreditSyndical = useMemo(() => {
    return Math.max(0, resultat.impotNetFinal - creditImpotSyndical);
  }, [resultat.impotNetFinal, creditImpotSyndical]);

  // Copie de la note de synthèse
  const copierSynthese = () => {
    const texte = `SIMULATION IMPÔT SUR LE REVENU 2026 (REVENUS 2025)
Collectivité & Agent FPT - Conforme CGI & Barème DGFiP
--------------------------------------------------
• Situation : ${situation === 'marie_pacse' ? 'Marié(e) / Pacsé(e)' : 'Célibataire / Séparé(e)'}
• Nombre de parts fiscales : ${resultat.partsTotal} part(s)
• Revenu brut imposable foyer : ${resultat.revenuBrutGlobal.toLocaleString('fr-FR')} €
• Abattement 10% frais pro : -${(resultat.abattementDeclarant1 + resultat.abattementDeclarant2).toLocaleString('fr-FR')} €
• Revenu Net Imposable (RNI) : ${resultat.revenuNetImposable.toLocaleString('fr-FR')} €
• Tranche Marginale d'Imposition (TMI) : ${resultat.tauxMarginalImposition}%
• Taux moyen effectif : ${resultat.tauxMoyenImposition}%
• Impôt brut : ${resultat.impotBrutApresQF.toLocaleString('fr-FR')} €
• Décote légale : -${resultat.decoteAppliquee.toLocaleString('fr-FR')} €
• IMPÔT NET CALCULÉ : ${resultat.impotNetFinal.toLocaleString('fr-FR')} €

PRÉLÈVEMENT À LA SOURCE (PAS) :
• Taux de PAS appliqué : ${tauxPas}%
• Montant prélevé estimé sur l'année : ${resultat.totalPasEstime.toLocaleString('fr-FR')} €
• SOLDE ESTIMÉ DGFIP : ${
      resultat.soldeType === 'remboursement'
        ? `+${resultat.soldeDgfip.toLocaleString('fr-FR')} € (Remboursement / Trop-perçu à recevoir)`
        : resultat.soldeType === 'reliquat'
        ? `${resultat.soldeDgfip.toLocaleString('fr-FR')} € (Reliquat restant à payer)`
        : '0 € (Parfaitement équilibré)'
    }

ADHÉSION CFDT & CRÉDIT D'IMPÔT (66%) :
• Cotisation annuelle : ${cotisationSyndicaleAnnuelle} €
• Crédit d'impôt remboursé : -${creditImpotSyndical} €
• Coût réel de l'adhésion : seulement ${coutReelCotisation} € / an (${(coutReelCotisation / 12).toFixed(1)} € / mois) !
`;
    navigator.clipboard.writeText(texte);
    toast.success('Synthèse fiscale copiée dans le presse-papier !');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête avec bouton retour */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Calculator className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Simulateur d'Impôt sur le Revenu & Contrôle PAS
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Barème officiel 2026 (revenus 2025) • Déclaration d'impôts & Vérification du Prélèvement à la Source
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={copierSynthese}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copier la synthèse</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Profils types rapides */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Exemples & Profils types territoriaux en 1 clic
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => appliquerPreset('celibataire_c')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Agent Célibataire
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Net 1 950 €/m • 1 part</div>
            </button>
            <button
              onClick={() => appliquerPreset('couple_agents')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Couple sans enfant
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">2 agents • 2 parts</div>
            </button>
            <button
              onClick={() => appliquerPreset('famille_2enf')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Famille (2 enfants)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Couple + 2 enf. • 3 parts</div>
            </button>
            <button
              onClick={() => appliquerPreset('parent_isole')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Parent Isolé (Case T)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">1 enf. • 2 parts (majoration)</div>
            </button>
          </div>
        </div>

        {/* Grille principale : Formulaire (gauche) & Bilan / Résultats (droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Colonne gauche : Saisie des données fiscales */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-500" />
                  1. Rémunération & Net Fiscal Imposable
                </h2>
                {/* Switch Mensuel / Annuel */}
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setModeSaisie('mensuel')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      modeSaisie === 'mensuel'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeSaisie('annuel')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      modeSaisie === 'annuel'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    Annuel
                  </button>
                </div>
              </div>

              {/* Saisie Déclarant 1 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Net Fiscal Imposable (Agent Déclarant 1) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step={modeSaisie === 'mensuel' ? '10' : '100'}
                    value={modeSaisie === 'mensuel' ? netFiscalMensuel1 : netFiscalAnnuel1}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      if (modeSaisie === 'mensuel') {
                        handleNetFiscalMensuelChange(val);
                      } else {
                        handleNetFiscalAnnuelChange(val);
                      }
                    }}
                    className="w-full pl-3 pr-16 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    {modeSaisie === 'mensuel' ? '€ / mois' : '€ / an'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Présent en bas de votre bulletin de paie (« Net Imposable »)</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {modeSaisie === 'mensuel'
                      ? `~ ${netFiscalAnnuel1.toLocaleString('fr-FR')} € / an`
                      : `~ ${netFiscalMensuel1.toLocaleString('fr-FR')} € / mois`}
                  </span>
                </div>
              </div>

              {/* Taux PAS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5 text-emerald-500" />
                    Taux de Prélèvement à la Source (PAS)
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {tauxPas} %
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="0.1"
                    value={tauxPas}
                    onChange={(e) => setTauxPas(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={tauxPas}
                    onChange={(e) => setTauxPas(Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-center text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Précompté chaque mois sur votre fiche de paie : ~{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {Math.round((netFiscalAnnuel1 * (tauxPas / 100)) / 12)} € / mois
                  </span>{' '}
                  ({Math.round(netFiscalAnnuel1 * (tauxPas / 100)).toLocaleString('fr-FR')} € / an)
                </p>
              </div>

              {/* Situation Familiale */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Situation Fiscale du Foyer
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSituation('celibataire')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all text-left ${
                      situation === 'celibataire'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Célibataire / Seul(e)
                    <div className="text-[10px] font-normal text-slate-500">1 part fiscale de base</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSituation('marie_pacse')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all text-left ${
                      situation === 'marie_pacse'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Marié(e) / Pacsé(e)
                    <div className="text-[10px] font-normal text-slate-500">2 parts fiscales de base</div>
                  </button>
                </div>
              </div>

              {/* Si couple : Déclarant 2 */}
              {situation === 'marie_pacse' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Net Fiscal Annuel du Conjoint (Déclarant 2)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step={modeSaisie === 'mensuel' ? '10' : '100'}
                      value={modeSaisie === 'mensuel' ? netFiscalMensuel2 : netFiscalAnnuel2}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        if (modeSaisie === 'mensuel') {
                          handleNetFiscalMensuel2Change(val);
                        } else {
                          handleNetFiscalAnnuel2Change(val);
                        }
                      }}
                      className="w-full pl-3 pr-16 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                      {modeSaisie === 'mensuel' ? '€ / mois' : '€ / an'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Soit ~ {netFiscalAnnuel2.toLocaleString('fr-FR')} € / an ({netFiscalMensuel2.toLocaleString('fr-FR')} € / mois)
                  </div>
                </div>
              )}

              {/* Enfants à charge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Enfants à charge</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {nbEnfants === 0 ? 'Aucun' : `${nbEnfants} enfant(s)`}
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNbEnfants(num)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        nbEnfants === num
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {num === 4 ? '4+' : num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option Parent Isolé si non-couple avec enfant */}
              {situation !== 'marie_pacse' && nbEnfants > 0 && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                  <input
                    type="checkbox"
                    id="parentIsole"
                    checked={parentIsole}
                    onChange={(e) => setParentIsole(e.target.checked)}
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  <label htmlFor="parentIsole" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                    <span className="font-bold text-amber-700 dark:text-amber-300 block">
                      Case T : Parent isolé élevant seul son ou ses enfant(s)
                    </span>
                    Attribue une demi-part fiscale supplémentaire (+0,5 part) pour alléger l'impôt.
                  </label>
                </div>
              )}

              {/* Option Frais réels */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>Option Frais Réels (Trajet domicile-travail...)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={utiliserFraisReels}
                    onChange={(e) => setUtiliserFraisReels(e.target.checked)}
                    className="rounded-sm accent-emerald-500"
                  />
                </div>
                {utiliserFraisReels && (
                  <div className="mt-2 space-y-1">
                    <input
                      type="number"
                      min="0"
                      value={fraisReelsMontant}
                      onChange={(e) => setFraisReelsMontant(Number(e.target.value) || 0)}
                      placeholder="Montant total des frais réels en €"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <div className="text-[11px] text-slate-400">
                      Abattement forfaitaire automatique de 10% ({resultat.abattementDeclarant1} €) remplacé par vos frais réels déclarés.
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Colonne droite : Résultats, Solde DGFiP & Décryptage */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* CARTE 1 : Bilan DGFiP & Solde du Prélèvement à la Source */}
            <div className={`rounded-2xl p-5 border shadow-md transition-all ${
              resultat.soldeType === 'remboursement'
                ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900 border-emerald-500/30'
                : resultat.soldeType === 'reliquat'
                ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900 border-amber-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Bilan DGFiP & Régularisation Été 2026
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {resultat.partsTotal} part(s) fiscale(s)
                </span>
              </div>

              <div className="py-4 text-center space-y-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {resultat.soldeType === 'remboursement'
                    ? 'Trop-perçu par l’administration fiscale'
                    : resultat.soldeType === 'reliquat'
                    ? 'Solde résiduel restant dû à la DGFiP'
                    : 'Prélèvement parfaitement calibré'}
                </div>
                <div className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  resultat.soldeType === 'remboursement'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : resultat.soldeType === 'reliquat'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-800 dark:text-white'
                }`}>
                  {resultat.soldeType === 'remboursement' && '+ '}
                  {Math.abs(resultat.soldeDgfip).toLocaleString('fr-FR')} €
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">
                  {resultat.soldeType === 'remboursement' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Virement automatique de restitution sur votre compte bancaire en juillet / août 2026.
                    </span>
                  ) : resultat.soldeType === 'reliquat' ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Prélèvement du solde étalé de septembre à décembre 2026 par la DGFiP.
                    </span>
                  ) : (
                    'Vos retenues mensuelles correspondent exactement au barème.'
                  )}
                </div>
              </div>

              {/* Rapprochement chiffré */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-slate-500 dark:text-slate-400">PAS prélevé sur l'année</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                    {resultat.totalPasEstime.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Taux appliqué : {tauxPas}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-slate-500 dark:text-slate-400">Impôt net réel calculé</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                    {resultat.impotNetFinal.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Taux moyen réel : {resultat.tauxMoyenImposition}%
                  </div>
                </div>
              </div>
            </div>

            {/* CARTE 2 : Décomposition du calcul & Tranche Marginale (TMI) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Détail du calcul d'imposition (Barème progressif)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] border border-emerald-500/20">
                  TMI : {resultat.tauxMarginalImposition}%
                </span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Revenu Net Imposable (RNI après abattement 10%) :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {resultat.revenuNetImposable.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Quotient par part (RNI / {resultat.partsTotal}) :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {resultat.quotientParPart.toLocaleString('fr-FR')} €
                  </span>
                </div>
                {resultat.gainQFReel > 0 && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Gain fiscal lié aux enfants (QF) :</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      - {resultat.gainQFReel.toLocaleString('fr-FR')} €
                      {resultat.qfPlafonne && ' (plafonné)'}
                    </span>
                  </div>
                )}
                {resultat.decoteAppliquee > 0 && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Décote légale (revenus modestes/moyens) :</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      - {resultat.decoteAppliquee.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 font-bold text-slate-900 dark:text-white">
                  <span>Impôt Net Annuel :</span>
                  <span className="text-base text-emerald-600 dark:text-emerald-400">
                    {resultat.impotNetFinal.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              {/* Paliers du barème 2026 */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tranches progressives atteintes par votre quotient :
                </div>
                <div className="space-y-1">
                  {resultat.detailsTranches.map((t, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-1.5 rounded-lg text-[11px] ${
                        t.assietteImposable > 0
                          ? 'bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'text-slate-400 opacity-60'
                      }`}
                    >
                      <span>
                        Tranche {t.taux * 100}% ({t.trancheLabel})
                      </span>
                      <span>
                        {t.assietteImposable > 0 ? `${t.impotTranche.toLocaleString('fr-FR')} €` : '0 €'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARTE 3 : Adhésion syndicale & Crédit d'impôt 66% */}
            <div className="rounded-2xl p-5 border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white dark:from-orange-950/30 dark:via-amber-950/15 dark:to-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  Optimisation CFDT : Cotisation Syndicale Déductible à 66%
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300">
                  Art. 199 quater C CGI
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Adhérer à la CFDT ouvre droit à un <span className="font-bold text-slate-900 dark:text-white">crédit d'impôt direct de 66%</span> de votre cotisation (remboursé par chèque ou virement DGFiP même si vous n'êtes pas imposable !).
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-orange-500/20">
                  <div className="text-[10px] text-slate-500">Cotisation annuelle</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{cotisationSyndicaleAnnuelle} €</div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Crédit d'impôt (66%)</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">-{creditImpotSyndical} €</div>
                </div>
                <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30">
                  <div className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold">Coût réel pour l'agent</div>
                  <div className="font-black text-orange-600 dark:text-orange-400 mt-0.5">{coutReelCotisation} € / an</div>
                  <div className="text-[9px] text-orange-600/80">({(coutReelCotisation / 12).toFixed(1)} €/mois)</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SimulateurImpotRevenu;
