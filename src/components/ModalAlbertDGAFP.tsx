import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  BookOpen,
  Scale,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAlbertConfig,
  saveAlbertConfig,
  testAlbertConnection,
  ALBERT_DEFAULT_BASE_URL,
  ALBERT_AVAILABLE_MODELS,
  type AlbertConfig
} from '../services/albertDgafpEngine';

interface ModalAlbertDGAFPProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: (config: AlbertConfig) => void;
}

export const ModalAlbertDGAFP: React.FC<ModalAlbertDGAFPProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [config, setConfig] = useState<AlbertConfig>(getAlbertConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message: string;
    models?: string[];
  } | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getAlbertConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const saved = saveAlbertConfig(config);
    if (onConfigChanged) onConfigChanged(saved);
    toast.success("Configuration Albert DINUM enregistrée !");
    onClose();
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAlbertConnection(config);
      setTestResult(res);
      if (res.success) {
        toast.success(`Connexion Albert établie (${res.latencyMs} ms)`);
      } else {
        toast.error(res.message);
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || "Erreur de communication avec l'API Albert.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* En-tête officiel DINUM × DGAFP */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-inner text-white">
                <ShieldCheck className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    🇫🇷 DINUM × DGAFP
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open Source
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight mt-1 text-white">
                  Connecteur Albert — Assistant RH de l'État
                </h2>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  LLM souverain et pipeline RAG de la Fonction Publique (Projet Alliance DINUM / DGAFP)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps de configuration */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Note d'information sur le projet officiel */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-blue-900 dark:text-blue-200">
                Inspiré du projet DGAFP/assistant-rh
              </div>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Ce connecteur permet d'interroger directement l'infrastructure d'IA souveraine <strong>Albert</strong> hébergée par la DINUM (Direction Interministérielle du Numérique) et d'appliquer le <strong>QueryProcessor DGAFP</strong> avec expansion d'acronymes statutaires.
              </p>
              <div className="pt-1">
                <a
                  href="https://github.com/DGAFP/assistant-rh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Voir le dépôt DGAFP/assistant-rh sur GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Configuration Clé API */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                Clé d'accès API Albert (DINUM / Etalab)
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                {showKey ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="albert-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Délivrée aux administrations et agents publics par la DINUM (albert.api.etalab.gouv.fr). Si vous n'avez pas de clé, le mode simulation souverain avec triangulation CGFP reste actif en local.
            </p>
          </div>

          {/* Choix du modèle & Endpoint */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                Modèle de langage (LLM)
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-bold text-slate-900 dark:text-white"
              >
                {ALBERT_AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Point de terminaison (Base URL)
              </label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder={ALBERT_DEFAULT_BASE_URL}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Options de traitement DGAFP */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
              Pipeline de traitement & Règles de validation :
            </span>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  QueryProcessor : Expansion des acronymes RH
                </div>
                <div className="text-[10px] text-slate-500">
                  Détection et explicitation automatique : RIFSEEP, CIA, GVT, CLM, CGM, TPT, NBI, SFT...
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-500" />
                  Triangulation & Formatage en 3 volets DGAFP
                </div>
                <div className="text-[10px] text-slate-500">
                  Structure obligatoire : 1. Règle CGFP / 2. Démarches pratiques / 3. Références Légifrance
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.triangulationDgafp}
                onChange={(e) => setConfig({ ...config, triangulationDgafp: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Résultat du test de connexion */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold">{testResult.message}</div>
                {testResult.models && testResult.models.length > 0 && (
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                    Modèles disponibles : {testResult.models.slice(0, 3).join(', ')}...
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Actions du footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Test en cours...' : 'Tester la connexion API'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enregistrer & Activer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
