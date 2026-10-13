import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { CFDT_JOURNAUX, CFDT_JOURNAUX_BASE_URL, type CFDTJournal } from '../data/cfdtJournaux.ts';

interface KiosqueJournauxModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseUrl: string;
  selectedJournalId?: string;
  onSelectJournal?: (journal: CFDTJournal) => void;
}

export const KiosqueJournauxModal: React.FC<KiosqueJournauxModalProps> = ({
  isOpen,
  onClose,
  baseUrl,
  selectedJournalId,
  onSelectJournal,
}) => {
  // Fermer la modal avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquer le scroll d'arrière-plan quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 sm:py-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kiosque-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-orange-200/90 dark:border-orange-500/30 rounded-3xl shadow-2xl shadow-orange-500/10 dark:shadow-orange-950/40 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modal */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-orange-100 dark:border-slate-800 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-950/80 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
                  Kiosque des publications
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                  {CFDT_JOURNAUX.length} numéros disponibles
                </span>
              </div>
              <h3
                id="kiosque-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5"
              >
                Journaux CFDT · Ville de Gennevilliers
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps avec la liste des journaux */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consultez ou téléchargez l'ensemble des journaux d'information syndicale édités par la{' '}
            <strong className="text-orange-600 dark:text-orange-400 font-semibold">
              section CFDT de la Ville de Gennevilliers
            </strong>
            . Cliquez sur le journal de votre choix pour l'ouvrir immédiatement au format PDF.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {CFDT_JOURNAUX.map((journal) => {
              const isSelected = selectedJournalId === journal.id;
              return (
                <div
                  key={journal.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 border-2 ${
                    journal.isLatest
                      ? 'bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 dark:from-slate-800/90 dark:via-slate-900 dark:to-orange-950/20 border-orange-300 dark:border-orange-500/50 shadow-md shadow-orange-500/10'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/80 hover:border-orange-300 dark:hover:border-orange-500/40 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Badge en haut à droite */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        journal.isLatest
                          ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {journal.badge}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span>{journal.dateParution}</span>
                    </div>
                  </div>

                  {/* Contenu principal : Vignette + infos */}
                  <div className="flex gap-3.5 items-start mb-3.5">
                    {/* Vignette de couverture */}
                    <a
                      href={journal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative shrink-0 w-20 h-28 rounded-xl overflow-hidden bg-slate-900 border border-orange-200 dark:border-orange-800/50 shadow-sm hover:scale-105 transition-transform duration-300 group/thumb block"
                      title={`Ouvrir ${journal.badge}`}
                    >
                      <img
                        src={`${baseUrl}${journal.coverImage}`}
                        alt={`${journal.title} - ${journal.badge}`}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `${baseUrl}journal-rentree-2026.png`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1">
                        <span className="text-[8px] font-black text-white bg-orange-600/95 px-1 py-0.5 rounded flex items-center gap-0.5">
                          <Eye className="w-2 h-2" /> PDF
                        </span>
                      </div>
                    </a>

                    {/* Titre & description */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {journal.title}
                      </h4>
                      <p className="text-[11px] text-orange-700 dark:text-orange-300 font-bold mt-0.5 leading-snug">
                        {journal.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {journal.description}
                      </p>
                    </div>
                  </div>

                  {/* Thèmes abordés */}
                  <div className="mb-3.5 flex flex-wrap gap-1">
                    {journal.themes.map((theme, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>

                  {/* Bas de carte : métadonnées & boutons d'action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2 mt-auto">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <FileText className="w-3 h-3 text-orange-500" />
                        PDF ({journal.fileSize})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onSelectJournal && (
                        <button
                          type="button"
                          onClick={() => onSelectJournal(journal)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 text-white border-orange-600'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Sélectionné' : 'Choisir'}
                        </button>
                      )}

                      <a
                        href={journal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3 py-1.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lire le journal</span>
                      </a>

                      <a
                        href={journal.url}
                        download={journal.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-700 hover:bg-orange-100 dark:hover:bg-orange-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Télécharger le fichier PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pied de page de la modal avec lien direct vers le répertoire intranet */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">
              Documents officiels hébergés sur l'intranet de la Ville de Gennevilliers
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={CFDT_JOURNAUX_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold hover:underline"
            >
              <span>Dossier intranet complet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer ml-2"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
