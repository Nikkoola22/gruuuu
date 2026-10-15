import React from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Lock,
  EyeOff,
  Server,
  FileText,
  ExternalLink,
  Sparkles,
  Scale,
  CheckCircle2,
  Info,
  Flame,
  Building2
} from 'lucide-react';

interface ModalRgpdLlmProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const ModalRgpdLlm: React.FC<ModalRgpdLlmProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#0E121E] border-slate-800 text-slate-100'
        }`}
      >
        {/* Header Modale */}
        <div
          className={`px-5 sm:px-7 py-4 sm:py-5 border-b flex items-center justify-between gap-4 ${
            isLight
              ? 'bg-gradient-to-r from-slate-50 via-amber-50/40 to-slate-50 border-slate-200'
              : 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  Transparence IA & Conformité RGPD
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shrink-0">
                  CNIL / CGFP
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Assistant IA « Oracle » • Statutaire RH & Règlements Gennevilliers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isLight
                ? 'hover:bg-slate-200 text-slate-600'
                : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la modale scrollable */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 custom-scrollbar text-xs sm:text-sm">

          {/* SECTION 1 : Modèles LLM Utilisés */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              <h4 className="font-black text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                1. Modèles de Langage (LLM) & Sources Mobilisées
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Carte Perplexity */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-amber-500 dark:text-amber-400">
                    Sonar / Sonar-Pro
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                    Perplexity AI
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Modèle d'inférence avancé à architecture RAG (Retrieval-Augmented Generation). Interroge en temps réel les fiches BIP internes de Gennevilliers, les protocoles RIFSEEP et le temps de travail communal.
                </p>
              </div>

              {/* Carte Albert DINUM */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-blue-500 dark:text-blue-400">
                    Albert (DINUM / DGAFP)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
                    IA Souveraine 🇫🇷
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Modèle public souverain de l'État français conçu par la DINUM et la DGAFP, hébergé sur des infrastructures publiques européennes qualifiées, spécialisé sur la Fonction Publique Territoriale.
                </p>
              </div>

              {/* Carte API PISTE Légifrance */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-500 dark:text-emerald-400">
                    API PISTE Légifrance
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    DILA / État
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Requêtage direct et automatisé des textes légaux en vigueur (Code général de la fonction publique - CGFP, décrets d'application statutaires, jurisprudence administrative).
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 : Garanties RGPD & Protection des Données Personnelles */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <h4 className="font-black text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                2. Engagements & Conformité RGPD (Règlement UE 2016/679)
              </h4>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-emerald-950/20 border-emerald-800/40'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <EyeOff className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Zéro Donnée Nominative Requise
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Vous n'avez besoin de communiquer aucun nom, prénom, numéro de sécurité sociale (NIR) ou matricule RH pour utiliser l'assistant.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Server className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Zéro Conservation & Stockage (Zero Retention)
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Les requêtes sont traitées en mémoire vive de manière éphémère. Aucun historique de conversation n'est enregistré de façon persistante.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Aucun Réentraînement des Modèles Tiers
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Vos échanges ne sont jamais utilisés pour entraîner, enrichir ou réentraîner des modèles commerciaux d'IA externes.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100 font-bold">
                      Flux Sécurisés & Chiffrement TLS 1.3
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      L'ensemble des transferts est opéré via des protocoles HTTPS sécurisés et chiffrés de bout en bout.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 : Transparence Algorithmique & Droit d'Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-500" />
              <h4 className="font-black text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                3. Transparence Algorithmique (Art. L. 311-3-1 CRPA) & Finalité
              </h4>
            </div>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              isLight ? 'bg-purple-50/40 border-purple-200' : 'bg-purple-950/20 border-purple-800/40'
            }`}>
              <p className="text-slate-700 dark:text-slate-300">
                • <strong>Finalité du traitement :</strong> Outil d'orientation et de vulgarisation statutaire au service des agents territoriaux de la Ville de Gennevilliers pour les éclairer sur leurs droits, congés, carrières, primes RIFSEEP et conditions de travail.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                • <strong>Caractère purement informatif :</strong> Conformément à l'article L. 311-3-1 du Code des relations entre le public et l'administration (CRPA), l'assistant IA « Oracle » ne prend aucune décision administrative individuelle automatisée. Les arrêtés, avancements et rémunérations relèvent exclusivement de la compétence de l'autorité territoriale (Maire, DGS, DRH) et des instances paritaires (CST, CAP, CCP).
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                • <strong>Vos droits :</strong> Vous disposez d'un droit d'accès, d'information et d'opposition auprès du Délégué à la Protection des Données (DPO) ou de vos représentants syndicaux CFDT (01 40 85 64 64).
              </p>
            </div>
          </section>

        </div>

        {/* Footer Modale */}
        <div
          className={`px-5 sm:px-7 py-3 sm:py-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mairie de Gennevilliers • CFDT Territoriaux</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRgpdLlm;
