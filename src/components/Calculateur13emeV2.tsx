import { useState, useMemo } from 'react'
import { 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  Euro, 
  ArrowLeft, 
  Info,
  Sparkles,
  Calculator,
  BarChart3,
  CalendarDays,
  Clock,
  User,
  Briefcase,
  HelpCircle
} from 'lucide-react'

interface Calculateur13emeProps {
  onClose?: () => void
}

type AgentType = 'indiciaire' | 'horaire' | ''
type IndiciaireProfile = 'permanent' | 'medecin' | 'assistante' | ''
type HoraireBase = 'indice' | 'taux' | ''
type HorairePeriode = 'juin' | 'novembre'

// Constantes
const HOURS_CAP = 910
const HOURS_MIN = 455
const SMIC_MENSUEL = 1801.8
const INDICE_POINT_VALUE = 4.92278
const IR_RATE = 0.03

const INDICIAIRE_SCHEDULE: Record<string, { month: string; part: number; note?: string }[]> = {
  permanent: [
    { month: 'Juin', part: 6, note: 'Versement principal (6/12)' },
    { month: 'Novembre', part: 5, note: 'Complément (5/12)' },
    { month: 'Décembre', part: 1, note: 'Solde (1/12)' },
  ],
  medecin: [
    { month: 'Juin', part: 6, note: 'Versement principal (6/12)' },
    { month: 'Novembre', part: 6, note: 'Versement complémentaire (6/12)' },
  ],
  assistante: [
    { month: 'Juin', part: 6, note: 'Calendrier spécifique assistantes' },
    { month: 'Novembre', part: 6 },
  ],
}

// Définition des étapes du wizard
const STEPS_INDICIAIRE = [
  { id: 1, title: 'Type d\'agent', icon: User, description: 'Choisissez votre mode de rémunération' },
  { id: 2, title: 'Profil', icon: Briefcase, description: 'Sélectionnez votre profil' },
  { id: 3, title: 'Données', icon: Calculator, description: 'Renseignez vos indices' },
  { id: 4, title: 'Temps', icon: Clock, description: 'Temps de travail et ancienneté' },
  { id: 5, title: 'Résultat', icon: Euro, description: 'Votre 13ème mois estimé' },
]

const STEPS_HORAIRE = [
  { id: 1, title: 'Type d\'agent', icon: User, description: 'Choisissez votre mode de rémunération' },
  { id: 2, title: 'Mode calcul', icon: Calculator, description: 'Indice ou taux horaire' },
  { id: 3, title: 'Période', icon: CalendarDays, description: 'Période de versement' },
  { id: 4, title: 'Heures', icon: Clock, description: 'Heures travaillées' },
  { id: 5, title: 'Résultat', icon: Euro, description: 'Votre 13ème mois estimé' },
]

// Utilitaires
const formatEUR = (value: number) =>
  value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })

const sanitizeNumber = (value: string | number) => {
  if (typeof value === 'number') return value
  if (!value) return 0
  return Number(value.replace(',', '.')) || 0
}

const indiceToEuro = (indice: string) => sanitizeNumber(indice) * INDICE_POINT_VALUE

// Tips pour chaque étape
const getTip = (step: number, agentType: AgentType) => {
  if (agentType === 'indiciaire') {
    switch (step) {
      case 1:
        return "Le mode indiciaire concerne les agents sur emploi permanent rémunérés sur la base d'un indice."
      case 2:
        return "Votre profil détermine le calendrier de versement de votre 13ème mois."
      case 3:
        return "Retrouvez votre Indice Majoré (IM) et NBI sur votre fiche de paie. La conversion utilise le point d'indice à 4,92278€."
      case 4:
        return "Le 13ème mois est proratisé selon votre temps de travail et le nombre de mois travaillés dans l'année."
      case 5:
        return "Ce montant est une estimation. Seule la GCR effectue le calcul officiel."
      default:
        return ""
    }
  } else {
    switch (step) {
      case 1:
        return "Le mode horaire concerne les animateurs, écoles, crèches, vacataires..."
      case 2:
        return "Choisissez selon que vous êtes rémunéré sur un indice de référence ou un taux horaire fixe."
      case 3:
        return "Juin = heures de Nov à Avril. Novembre = heures de Mai à Octobre."
      case 4:
        return "Minimum 455h sur la période pour être éligible. Maximum plafonné à 910h (équivalent 6 mois temps complet)."
      case 5:
        return "Ce montant est une estimation. Seule la GCR effectue le calcul officiel."
      default:
        return ""
    }
  }
}

export default function Calculateur13emeV2({ onClose }: Calculateur13emeProps) {
  // État du wizard
  const [currentStep, setCurrentStep] = useState(1)
  
  // État agent
  const [agentType, setAgentType] = useState<AgentType>('')
  
  // État indiciaire
  const [indiciaireProfile, setIndiciaireProfile] = useState<IndiciaireProfile>('')
  const [im, setIm] = useState('')
  const [nbi, setNbi] = useState('')
  const [tempsEmploi, setTempsEmploi] = useState(100)
  const [monthsWorked, setMonthsWorked] = useState(12)
  const [rubrique7587, setRubrique7587] = useState('')
  
  // État horaire
  const [horaireBaseType, setHoraireBaseType] = useState<HoraireBase>('')
  const [horaireIM, setHoraireIM] = useState('')
  const [horaireTaux, setHoraireTaux] = useState('')
  const [horaireConges, setHoraireConges] = useState(10)
  const [horaireHours, setHoraireHours] = useState(HOURS_MIN)
  const [horairePeriode, setHorairePeriode] = useState<HorairePeriode>('juin')
  const [horaireAnciennete, setHoraireAnciennete] = useState(6)

  // Calculs dérivés
  const indiciaireTI = indiceToEuro(im)
  const indiciaireNBIValue = indiceToEuro(nbi)
  const indiciaireIRValue = (indiciaireTI + indiciaireNBIValue) * IR_RATE  // IR sur (TI + NBI) selon procédure officielle
  const horaireTI = indiceToEuro(horaireIM)
  const horaireIRValue = horaireTI * IR_RATE

  // Steps dynamiques selon le type d'agent
  const STEPS = agentType === 'horaire' ? STEPS_HORAIRE : STEPS_INDICIAIRE

  // Calcul du résultat indiciaire
  const computeIndiciaire = useMemo(() => {
    if (agentType !== 'indiciaire' || !indiciaireProfile) return null;

    const tiValue = indiciaireTI;
    const nbiValue = indiciaireNBIValue;
    const irValue = indiciaireIRValue;
    const baseRub = sanitizeNumber(rubrique7587);

    // Vérification éligibilité
    const base = indiciaireProfile === 'assistante' ? baseRub : tiValue + nbiValue;
    if (base <= 0) return null;
    if (monthsWorked < 3) return null;

    let total, breakdown, compRem, primeSem;
    const tempsRatio = Math.max(0, Math.min(1, tempsEmploi / 100));
    const prorataAnnee = Math.max(0, Math.min(1, monthsWorked / 12));
    const prorataGlobal = tempsRatio * prorataAnnee;
    if (indiciaireProfile === 'medecin') {
      // Coefficients pour obtenir la décomposition souhaitée avec le SMIC actuel
      const COEF_SMIC = 1.94;
      const COEF_INDICIAIRE = 0.1707;
      // Prime SMIC
      const primeSmic = (SMIC_MENSUEL / 12) * 3 * (tempsEmploi / 100) * COEF_SMIC;
      // Prime indiciaire
      const primeIndiciaire = (tiValue + nbiValue + irValue) * COEF_INDICIAIRE;
      // Total par versement (juin ou novembre)
      const montantVersement = +(primeSmic + primeIndiciaire).toFixed(2);
      total = montantVersement * 2;
      compRem = primeSmic;
      primeSem = primeIndiciaire;
      breakdown = [
        { month: 'Juin', ratio: 0.5, note: 'Prime SMIC + Prime indiciaire', amount: montantVersement, details: { primeSmic: +primeSmic.toFixed(2), primeIndiciaire: +primeIndiciaire.toFixed(2) } },
        { month: 'Novembre', ratio: 0.5, note: 'Prime SMIC + Prime indiciaire', amount: montantVersement, details: { primeSmic: +primeSmic.toFixed(2), primeIndiciaire: +primeIndiciaire.toFixed(2) } }
      ];
    } else {
      const remunerationBase = indiciaireProfile === 'assistante'
        ? (baseRub / 2)
        : (tiValue + nbiValue + irValue);
      const fixedPart = prorataGlobal * SMIC_MENSUEL;
      const smicVerse = prorataGlobal * SMIC_MENSUEL;
      const remunerationProratisee = prorataGlobal * remunerationBase;
      const variableBase = remunerationProratisee - smicVerse;
      const variablePart = variableBase > 0 ? variableBase : 0;
      total = fixedPart + variablePart;
      compRem = fixedPart;
      primeSem = variablePart;
      const schedule = INDICIAIRE_SCHEDULE[indiciaireProfile];
      const parts = schedule.reduce((sum, item) => sum + item.part, 0);
      breakdown = schedule.map(item => ({
        month: item.month,
        ratio: item.part / parts,
        note: item.note,
        amount: +(total * (item.part / parts)).toFixed(2),
      }));
    }
    return {
      total,
      compRem,
      primeSem,
      breakdown,
      context: {
        baseMensuelle: tiValue + nbiValue + irValue,
        tempsRatio,
        prorataAnnee,
        prorataGlobal,
        tiValue,
        nbiValue,
        irValue,
      },
    };
  }, [agentType, indiciaireProfile, indiciaireTI, indiciaireNBIValue, indiciaireIRValue, rubrique7587, tempsEmploi, monthsWorked])

  // Calcul du résultat horaire
  const computeHoraire = useMemo(() => {
    if (agentType !== 'horaire' || !horaireBaseType) return null
    if (horaireHours < HOURS_MIN) return null
    if (horaireAnciennete < 3) return null
    if (horaireBaseType === 'indice' && horaireTI <= 0) return null
    if (horaireBaseType === 'taux' && sanitizeNumber(horaireTaux) === 0) return null

    const heuresRetenues = Math.min(horaireHours, HOURS_CAP)
    const ratioHeures = heuresRetenues / HOURS_CAP
    const tiHoraire = horaireTI
    const autoIRHoraire = horaireIRValue
    const tauxHoraire = sanitizeNumber(horaireTaux)

    let baseReference = 0
    let total = 0
    let compRem = 0
    let primeSem = 0
    let baseSixMois = 0
    let basePS = 0
    const crBase = SMIC_MENSUEL / 2

    if (horaireBaseType === 'indice') {
      baseReference = tiHoraire + autoIRHoraire
      baseSixMois = baseReference / 2
      basePS = Math.max(baseSixMois - crBase, 0)
      compRem = ratioHeures * crBase
      primeSem = ratioHeures * basePS
      total = compRem + primeSem
    } else {
      const tauxMajore = tauxHoraire * (1 + horaireConges / 100)
      baseReference = tauxMajore
      const mensualise = tauxMajore * 151.67
      baseSixMois = mensualise / 2
      basePS = Math.max(baseSixMois - crBase, 0)
      compRem = ratioHeures * crBase
      primeSem = ratioHeures * basePS
      total = compRem + primeSem
    }

    return {
      total,
      compRem,
      primeSem,
      breakdown: [
        {
          month: horairePeriode === 'juin' ? 'Versement de Juin' : 'Versement de Novembre',
          ratio: ratioHeures,
          amount: total,
          note: `${horaireHours}h déclarées / ${HOURS_CAP}h max`,
        },
      ],
      context: {
        ratioHeures,
        baseReference,
        heuresRetenues,
        periode: horairePeriode === 'juin' ? 'Nov → Avril' : 'Mai → Octobre',
      },
    }
  }, [agentType, horaireBaseType, horaireHours, horaireAnciennete, horaireTI, horaireIRValue, horaireTaux, horaireConges, horairePeriode])

  // Résultat final
  const result = agentType === 'indiciaire' ? computeIndiciaire : computeHoraire

  // Calcul du total pour le badge flottant
  const totalEstime = result?.total || 0

  // Navigation
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return agentType !== ''
      case 2:
        if (agentType === 'indiciaire') return indiciaireProfile !== ''
        return horaireBaseType !== ''
      case 3:
        if (agentType === 'indiciaire') {
          if (indiciaireProfile === 'assistante') return sanitizeNumber(rubrique7587) > 0
          return indiciaireTI > 0
        }
        return true // Période toujours valide
      case 4:
        if (agentType === 'horaire') {
          if (horaireBaseType === 'indice') return horaireTI > 0 && horaireHours >= HOURS_MIN
          return sanitizeNumber(horaireTaux) > 0 && horaireHours >= HOURS_MIN
        }
        return monthsWorked >= 3
      default:
        return true
    }
  }

  const goNext = () => {
    if (currentStep < 5 && canGoNext()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setAgentType('')
    setIndiciaireProfile('')
    setIm('')
    setNbi('')
    setTempsEmploi(100)
    setMonthsWorked(12)
    setRubrique7587('')
    setHoraireBaseType('')
    setHoraireIM('')
    setHoraireTaux('')
    setHoraireConges(10)
    setHoraireHours(HOURS_MIN)
    setHorairePeriode('juin')
    setHoraireAnciennete(6)
  }

  // Rendu des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStepType()
      case 2:
        return agentType === 'indiciaire' ? renderStepProfile() : renderStepHoraireMode()
      case 3:
        return agentType === 'indiciaire' ? renderStepDonnees() : renderStepPeriode()
      case 4:
        return agentType === 'indiciaire' ? renderStepTemps() : renderStepHeures()
      case 5:
        return renderStepResultat()
      default:
        return null
    }
  }

  // Étape 1 : Type d'agent
  const renderStepType = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-light text-white mb-2">Quel est votre mode de rémunération ?</h2>
        <p className="text-emerald-300/70 text-sm">Cela détermine le mode de calcul de votre 13ème mois</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setAgentType('indiciaire')}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
            agentType === 'indiciaire'
              ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-emerald-500/50 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${agentType === 'indiciaire' ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`}>
              <Briefcase className={`w-6 h-6 ${agentType === 'indiciaire' ? 'text-emerald-300' : 'text-slate-400'}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-medium mb-1 ${agentType === 'indiciaire' ? 'text-emerald-300' : 'text-white'}`}>
                Indiciaire
              </h3>
              <p className="text-sm text-slate-400">
                Agent sur emploi permanent rémunéré sur indice
              </p>
            </div>
            {agentType === 'indiciaire' && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
          </div>
        </button>

        <button
          onClick={() => setAgentType('horaire')}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
            agentType === 'horaire'
              ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${agentType === 'horaire' ? 'bg-purple-500/30' : 'bg-slate-700/50'}`}>
              <Clock className={`w-6 h-6 ${agentType === 'horaire' ? 'text-purple-300' : 'text-slate-400'}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-medium mb-1 ${agentType === 'horaire' ? 'text-purple-300' : 'text-white'}`}>
                Horaire
              </h3>
              <p className="text-sm text-slate-400">
                Animateurs, écoles, crèches, vacataires...
              </p>
            </div>
            {agentType === 'horaire' && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  )

  // Étape 2 Indiciaire : Profil
  const renderStepProfile = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-light text-white mb-2">Quel est votre profil ?</h2>
        <p className="text-emerald-300/70 text-sm">Le profil détermine le calendrier de versement</p>
      </div>

      <div className="space-y-3">
        {[
          { id: 'permanent', label: 'Agent permanent', desc: 'Versement en Juin, Novembre et Décembre' },
          { id: 'medecin', label: 'Médecin', desc: 'Versement en Juin et Novembre (50%/50%)' },
          { id: 'assistante', label: 'Assistante maternelle', desc: 'Calcul spécifique (rubrique 7587)' },
        ].map(profile => (
          <button
            key={profile.id}
            onClick={() => setIndiciaireProfile(profile.id as IndiciaireProfile)}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
              indiciaireProfile === profile.id
                ? 'border-emerald-400 bg-emerald-500/20'
                : 'border-slate-600/50 bg-slate-800/30 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${indiciaireProfile === profile.id ? 'text-emerald-300' : 'text-white'}`}>
                  {profile.label}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{profile.desc}</p>
              </div>
              {indiciaireProfile === profile.id && (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // Étape 2 Horaire : Mode de calcul
  const renderStepHoraireMode = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-light text-white mb-2">Mode de calcul</h2>
        <p className="text-purple-300/70 text-sm">Comment êtes-vous rémunéré(e) ?</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setHoraireBaseType('indice')}
          className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
            horaireBaseType === 'indice'
              ? 'border-purple-400 bg-purple-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${horaireBaseType === 'indice' ? 'text-purple-300' : 'text-white'}`}>
                En référence à un indice
              </h3>
              <p className="text-sm text-slate-400 mt-1">Ex: indice 366</p>
            </div>
            {horaireBaseType === 'indice' && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>
        </button>

        <button
          onClick={() => setHoraireBaseType('taux')}
          className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
            horaireBaseType === 'taux'
              ? 'border-purple-400 bg-purple-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${horaireBaseType === 'taux' ? 'text-purple-300' : 'text-white'}`}>
                Sur la base d'un taux horaire
              </h3>
              <p className="text-sm text-slate-400 mt-1">Ex: 11,50 €/h</p>
            </div>
            {horaireBaseType === 'taux' && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  )

  // Étape 3 Indiciaire : Données
  const renderStepDonnees = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-white mb-2">Vos données indiciaires</h2>
        <p className="text-emerald-300/70 text-sm">Retrouvez ces informations sur votre fiche de paie</p>
      </div>

      {indiciaireProfile === 'assistante' ? (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
            <label className="block text-sm font-medium text-emerald-300 mb-3">
              Montant rubrique 7587
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={rubrique7587}
                onChange={(e) => setRubrique7587(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none glass-pill"
                placeholder="Montant brut"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Le 13ème mois = rubrique 7587 / 2 (proratisé)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Indice Majoré */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
            <label className="block text-sm font-medium text-emerald-300 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-emerald-500/30 rounded-full text-xs">1</span>
              Indice Majoré (IM)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={im}
              onChange={(e) => setIm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none glass-pill"
              placeholder="ex: 366"
            />
            {indiciaireTI > 0 && (
              <p className="text-sm text-emerald-400 mt-2">
                = {formatEUR(indiciaireTI)} (TI mensuel)
              </p>
            )}
          </div>

          {/* NBI */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
            <label className="block text-sm font-medium text-emerald-300 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-emerald-500/30 rounded-full text-xs">2</span>
              Nouvelle Bonification Indiciaire (NBI)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={nbi}
              onChange={(e) => setNbi(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none glass-pill"
              placeholder="ex: 10 (0 si aucune)"
            />
            {indiciaireNBIValue > 0 && (
              <p className="text-sm text-emerald-400 mt-2">
                = {formatEUR(indiciaireNBIValue)}
              </p>
            )}
          </div>

          {/* Récapitulatif */}
          {indiciaireTI > 0 && (
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 glass-card">
              <p className="text-sm font-medium text-emerald-300 mb-3">📊 Récapitulatif mensuel</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Traitement indiciaire (TI)</span>
                  <span className="text-emerald-400">{formatEUR(indiciaireTI)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>NBI</span>
                  <span className="text-emerald-400">{formatEUR(indiciaireNBIValue)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Indemnité résidence (3%)</span>
                  <span className="text-emerald-400">{formatEUR(indiciaireIRValue)}</span>
                </div>
                <div className="border-t border-emerald-500/30 pt-2 mt-2 flex justify-between font-medium">
                  <span className="text-white">Total base</span>
                  <span className="text-emerald-300">{formatEUR(indiciaireTI + indiciaireNBIValue + indiciaireIRValue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Étape 3 Horaire : Période
  const renderStepPeriode = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-light text-white mb-2">Période de versement</h2>
        <p className="text-purple-300/70 text-sm">Chaque période correspond à 6 mois de travail</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setHorairePeriode('juin')}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left glass-card ${
            horairePeriode === 'juin'
              ? 'border-purple-400 bg-purple-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${horairePeriode === 'juin' ? 'text-purple-300' : 'text-white'}`}>
                Versement de Juin
              </h3>
              <p className="text-sm text-slate-400 mt-1">Heures de Novembre à Avril</p>
            </div>
            {horairePeriode === 'juin' && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>
        </button>

        <button
          onClick={() => setHorairePeriode('novembre')}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left glass-card ${
            horairePeriode === 'novembre'
              ? 'border-purple-400 bg-purple-500/20'
              : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${horairePeriode === 'novembre' ? 'text-purple-300' : 'text-white'}`}>
                Versement de Novembre
              </h3>
              <p className="text-sm text-slate-400 mt-1">Heures de Mai à Octobre</p>
            </div>
            {horairePeriode === 'novembre' && (
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  )

  // Étape 4 Indiciaire : Temps de travail
  const renderStepTemps = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-white mb-2">Temps de travail et ancienneté</h2>
        <p className="text-emerald-300/70 text-sm">Ces éléments proratisent votre 13ème mois</p>
      </div>

      <div className="space-y-5">
        {/* Temps de travail */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
          <label className="block text-sm font-medium text-emerald-300 mb-4">
            Temps de travail
          </label>
          <input
            type="range"
            min={50}
            max={100}
            value={tempsEmploi}
            onChange={(e) => setTempsEmploi(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-500">50%</span>
            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-medium rounded-full text-sm">
              {tempsEmploi}%
            </span>
            <span className="text-xs text-slate-500">100%</span>
          </div>
        </div>

        {/* Mois travaillés */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
          <label className="block text-sm font-medium text-emerald-300 mb-3">
            Mois travaillés sur l'année
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMonthsWorked(prev => Math.max(0, prev - 1))}
              className="w-12 h-12 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors text-xl font-light glass-pill"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-light text-white">{monthsWorked}</span>
              <span className="text-lg text-slate-400 ml-1">/ 12</span>
            </div>
            <button
              onClick={() => setMonthsWorked(prev => Math.min(12, prev + 1))}
              className="w-12 h-12 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors text-xl font-light glass-pill"
            >
              +
            </button>
          </div>
          {monthsWorked < 3 && (
            <p className="text-xs text-amber-400 mt-3 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Minimum 3 mois requis pour être éligible
            </p>
          )}
        </div>

        {/* Prorata calculé */}
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
          <p className="text-sm text-emerald-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Prorata appliqué : <strong>{((tempsEmploi / 100) * (monthsWorked / 12) * 100).toFixed(1)}%</strong>
          </p>
        </div>
      </div>
    </div>
  )

  // Étape 4 Horaire : Heures et données
  const renderStepHeures = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-white mb-2">Heures travaillées</h2>
        <p className="text-purple-300/70 text-sm">Sur la période {horairePeriode === 'juin' ? 'Nov → Avril' : 'Mai → Octobre'}</p>
      </div>

      <div className="space-y-5">
        {/* Heures */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
          <label className="block text-sm font-medium text-purple-300 mb-3">
            Nombre d'heures rémunérées
          </label>
          <input
            type="number"
            min={0}
            value={horaireHours}
            onChange={(e) => setHoraireHours(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none glass-pill"
          />
          <div className="flex justify-between mt-3 text-xs text-slate-400">
            <span>Minimum : {HOURS_MIN}h</span>
            <span>Maximum : {HOURS_CAP}h</span>
          </div>
          {horaireHours < HOURS_MIN && (
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Minimum {HOURS_MIN}h requis pour être éligible
            </p>
          )}
          {horaireHours > HOURS_CAP && (
            <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Plafonné à {HOURS_CAP}h pour le calcul
            </p>
          )}
        </div>

        {/* Indice ou Taux */}
        {horaireBaseType === 'indice' ? (
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Indice majoré (IM)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={horaireIM}
              onChange={(e) => setHoraireIM(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none glass-pill"
              placeholder="ex: 366"
            />
            {horaireTI > 0 && (
              <div className="mt-3 text-sm text-purple-400 space-y-1">
                <p>TI mensuel : {formatEUR(horaireTI)}</p>
                <p>IR (3%) : {formatEUR(horaireIRValue)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
              <label className="block text-sm font-medium text-purple-300 mb-3">
                Taux horaire brut (€/h)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={horaireTaux}
                  onChange={(e) => setHoraireTaux(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-lg font-light focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none glass-pill"
                  placeholder="ex: 11,50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€/h</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
              <label className="block text-sm font-medium text-purple-300 mb-3">
                Majoration congés payés
              </label>
              <input
                type="range"
                min={0}
                max={15}
                value={horaireConges}
                onChange={(e) => setHoraireConges(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-500">0%</span>
                <span className="px-4 py-1.5 bg-purple-500/20 text-purple-300 font-medium rounded-full text-sm">
                  +{horaireConges}%
                </span>
                <span className="text-xs text-slate-500">15%</span>
              </div>
            </div>
          </div>
        )}

        {/* Ratio calculé */}
        {horaireHours >= HOURS_MIN && (
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 glass-card">
            <p className="text-sm text-purple-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Ratio heures : <strong>{((Math.min(horaireHours, HOURS_CAP) / HOURS_CAP) * 100).toFixed(1)}%</strong>
              <span className="text-slate-400 text-xs">
                ({Math.min(horaireHours, HOURS_CAP)}h / {HOURS_CAP}h)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // Étape 5 : Résultat
  const renderStepResultat = () => {
    if (!result) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Données insuffisantes</h3>
          <p className="text-slate-400 text-sm">
            Veuillez compléter les étapes précédentes pour obtenir votre estimation.
          </p>
          <button
            onClick={() => setCurrentStep(1)}
            className="mt-6 px-6 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors glass-pill"
          >
            Recommencer
          </button>
        </div>
      )
    }

    const accentColor = agentType === 'indiciaire' ? 'emerald' : 'purple'

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <Sparkles className={`w-12 h-12 mx-auto mb-4 text-${accentColor}-400`} />
          <h2 className="text-xl font-light text-white mb-2">Votre 13ème mois estimé</h2>
          <p className={`text-${accentColor}-300/70 text-sm`}>
            {agentType === 'indiciaire' ? `Profil : ${indiciaireProfile}` : `Mode : ${horaireBaseType}`}
          </p>
        </div>

        {/* Total principal */}
        <div className={`bg-gradient-to-br from-${accentColor}-500/20 to-${accentColor}-600/10 rounded-2xl p-6 border border-${accentColor}-500/30 glass-card`}>
          <p className={`text-xs uppercase tracking-wider text-${accentColor}-300 mb-2`}>Total estimé</p>
          <p className="text-5xl font-light text-white">{formatEUR(result.total)}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-900/30 rounded-xl p-4 glass-card">
              <p className="text-xs text-slate-400">Complément de rémunération</p>
              <p className={`text-lg font-medium text-${accentColor}-300`}>{formatEUR(result.compRem)}</p>
            </div>
            <div className="bg-slate-900/30 rounded-xl p-4 glass-card">
              <p className="text-xs text-slate-400">Prime semestrielle</p>
              <p className={`text-lg font-medium text-${accentColor}-300`}>{formatEUR(result.primeSem)}</p>
            </div>
          </div>

          {/* Détail des deux composants */}
          <div className="mt-6 bg-slate-900/20 rounded-xl p-4 border border-slate-700/30 glass-card">
            <p className="text-sm text-white mb-2 font-medium">Détail des composants :</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>
                <strong>Complément de rémunération :</strong> Ce montant correspond à la part fixe, généralement basée sur le SMIC ou la base indiciaire, proratisée selon votre temps de travail et votre ancienneté.
              </li>
              <li>
                <strong>Prime semestrielle :</strong> Ce montant correspond à la part variable, calculée selon votre base indiciaire ou autres critères spécifiques au profil.
              </li>
            </ul>
          </div>
        </div>

        {/* Ventilation */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600/30 glass-card">
          <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            Ventilation par échéance (montants en BRUT)
          </p>
          <div className="space-y-3">
            {indiciaireProfile === 'permanent' ? (
              result.breakdown.map((item: { month: string; ratio: number; amount: number; note?: string }, index: number) => {
                // Calcul des montants TIT pour chaque part
                const totalPart = item.amount;
                // Répartition TIT :
                // Complément rémunération TIT (rubrique 7447) = part fixe
                // Prime semestrielle TIT (rubrique 8445) = part variable
                const partFixe = result.compRem * item.ratio;
                const partVariable = result.primeSem * item.ratio;
                return (
                  <div key={index} className="bg-slate-900/30 rounded-lg p-3 glass-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.month}</p>
                        <p className="text-xs text-slate-400">{item.note || `${(item.ratio * 100).toFixed(0)}%`}</p>
                      </div>
                      <p className={`text-lg font-medium text-${accentColor}-400`}>{formatEUR(totalPart)}</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-300 space-y-1">
                      <div>
                        <strong>Rubrique 7447 (Compl. rémunération TIT):</strong> {formatEUR(partFixe)}
                      </div>
                      <div>
                        <strong>Rubrique 8445 (Prime semestrielle TIT):</strong> {formatEUR(partVariable)}
                      </div>
                      <div>
                        <strong>Total par échéance:</strong> {formatEUR(partFixe + partVariable)}
                      </div>
                      <div>
                        <strong>Soit environ :</strong> {formatEUR(partFixe + partVariable)} x 0.82 = {formatEUR((partFixe + partVariable) * 0.82)} net
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              result.breakdown.map((item: { month: string; ratio: number; amount: number; note?: string }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg glass-card">
                  <div>
                    <p className="text-white font-medium">{item.month}</p>
                    <p className="text-xs text-slate-400">{item.note || `${(item.ratio * 100).toFixed(0)}%`}</p>
                  </div>
                  <p className={`text-lg font-medium text-${accentColor}-400`}>{formatEUR(item.amount)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Détails du calcul */}
        {result.context && (
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 glass-card">
            <p className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Détails du calcul
            </p>
            <div className="text-xs text-blue-200/80 space-y-1">
              {agentType === 'indiciaire' && 'baseMensuelle' in result.context ? (
                <>
                  <p>• Base mensuelle : {formatEUR(result.context.baseMensuelle)}</p>
                  <p>• Prorata temps : {(result.context.tempsRatio * 100).toFixed(0)}%</p>
                  <p>• Prorata année : {(result.context.prorataAnnee * 100).toFixed(0)}%</p>
                  <p>• Prorata global : {(result.context.prorataGlobal * 100).toFixed(1)}%</p>
                </>
              ) : 'heuresRetenues' in result.context ? (
                <>
                  <p>• Heures retenues : {result.context.heuresRetenues}h / {HOURS_CAP}h max</p>
                  <p>• Ratio : {(result.context.ratioHeures * 100).toFixed(1)}%</p>
                  <p>• Période : {result.context.periode}</p>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Avertissement */}
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
          <p className="text-sm text-amber-300 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Simulateur informatif uniquement</strong><br />
              <span className="text-amber-200/70 text-xs">
                Seuls les collègues de la GCR effectuent le calcul officiel.
              </span>
            </span>
          </p>
        </div>

        {/* Bouton nouvelle simulation */}
        <button
          onClick={handleReset}
          className="w-full py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors font-light"
        >
          ↻ Nouvelle simulation
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/95 to-emerald-900/95 backdrop-blur-md py-6 border-b border-emerald-500/30 shadow-xl glass-banner">
        <div className="px-4 sm:px-6 flex flex-col gap-4 max-w-6xl mx-auto sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-4 bg-gradient-to-br from-emerald-500/80 to-green-500/80 rounded-2xl shadow-2xl">
              <Euro className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-light text-white">Calculateur 13ème Mois</h1>
              <p className="text-emerald-300/80 text-sm font-light mt-1">Simulation pas à pas</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-light transition-all duration-150 border border-red-500/50 glass-pill sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 py-4 px-6 glass-banner">
        <div className="max-w-3xl mx-auto overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[520px]">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const accentColor = agentType === 'horaire' ? 'purple' : 'emerald'
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                    disabled={!isCompleted}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                      isCompleted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? `bg-${accentColor}-500 text-white shadow-lg shadow-${accentColor}-500/30`
                        : isCompleted
                          ? `bg-${accentColor}-500/30 text-${accentColor}-300`
                          : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-light hidden sm:block ${
                      isActive ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-all duration-200 ${
                      currentStep > step.id ? `bg-${accentColor}-500/50` : 'bg-slate-700/50'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Tip de l'étape */}
          {currentStep < 5 && (
            <div className={`mb-6 p-4 rounded-xl border glass-card ${
              agentType === 'horaire' 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <p className={`text-sm flex items-start gap-2 ${
                agentType === 'horaire' ? 'text-purple-300' : 'text-emerald-300'
              }`}>
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{getTip(currentStep, agentType)}</span>
              </p>
            </div>
          )}

          {/* Contenu de l'étape */}
          <div className="bg-slate-800/30 rounded-2xl p-4 sm:p-6 border border-slate-700/50 glass-card">
            {renderStep()}
          </div>

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex flex-col-reverse items-stretch mt-6 gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={goPrev}
                disabled={currentStep === 1}
                className={`flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-light transition-all duration-150 sm:w-auto ${
                  currentStep === 1
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className={`flex w-full items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-light transition-all duration-150 sm:w-auto ${
                  canGoNext()
                    ? agentType === 'horaire'
                      ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/30'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentStep === 4 ? 'Voir le résultat' : 'Suivant'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Récapitulatif du total */}
      {totalEstime > 0 && currentStep < 5 && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className={`max-w-2xl mx-auto px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-sm ${
            agentType === 'horaire'
              ? 'bg-purple-600/95 border-purple-400/30'
              : 'bg-emerald-600/95 border-emerald-400/30'
          }`}>
            <p className="text-xs text-white/70 mb-0.5">13ème mois estimé</p>
            <p className="text-xl font-light text-white">{formatEUR(totalEstime)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
