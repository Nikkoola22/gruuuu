import React from "react";
import { ArrowLeft, Newspaper, ArrowRight } from "lucide-react";

interface IntercoNewsItem {
  title: string;
  link: string;
  pubDate: string;
  category: string;
  description: string;
  imageUrl?: string;
}

interface ActualitesProps {
  news: IntercoNewsItem[];
  onClose: () => void;
  baseUrl: string;
}

const Actualites: React.FC<ActualitesProps> = ({ news, onClose, baseUrl }) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden overscroll-contain bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950">
      {/* Intro Section */}
      <section className="relative z-40 bg-slate-800/50 py-12 text-center border-b border-slate-700 glass-banner">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-blue-400" />
              Actualités CFDT
            </h2>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              className="relative z-50 pointer-events-auto flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all text-sm glass-pill"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed text-left">
            Restez informés avec les dernières actualités syndicales et nos publications.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Colonne de gauche: Actualités */}
          <div className="lg:col-span-3 bg-gradient-to-br from-slate-800/90 via-blue-900/40 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl shadow-blue-900/20">
            <h3 className="text-3xl font-bold text-white mb-10 pb-4 border-b border-slate-700/50">
              Actualités
              <span className="relative inline-block ml-3 z-10">
                <span className="relative z-20 text-white font-black tracking-tight">Syndicales & Statutaires</span>
                <span className="absolute bottom-1.5 left-[-2%] w-[104%] h-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 opacity-90 -skew-x-12 -rotate-2 z-0 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]"></span>
              </span>
            </h3>
            
            {/* --- ACTUALITÉ STATUTAIRE CIG --- */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 border-b border-slate-700/50 pb-10 group/card">
              <div className="relative w-full md:w-72 h-48 overflow-hidden rounded-xl shrink-0 border border-slate-700 bg-slate-900/50">
                <img src="https://www.cig929394.fr/wp-content/uploads/2026/06/Emplois-superieurs-480x252.jpg" alt="Réforme encadrement" className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur text-red-300 border border-red-500/30">
                  Statutaire
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mt-1 hover:text-blue-300 transition-colors leading-snug mb-3">
                    <a href="https://www.cig929394.fr/actualites/reforme-de-lencadrement-superieur-au-1er-juillet-2026/" target="_blank" rel="noopener noreferrer">
                      Réforme de l'encadrement supérieur au 1er juillet 2026
                    </a>
                  </h4>
                  <p className="text-base text-slate-300 font-light leading-relaxed">
                    Retrouvez les détails de la réforme de l'encadrement supérieur de la fonction publique territoriale applicable au 1er juillet 2026 sur le site du CIG Petite Couronne.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                  <span>CIG Petite Couronne</span>
                  <a href="https://www.cig929394.fr/actualites/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Toutes les actus CIG <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* --- ACTUALITÉS CFDT INTERCO --- */}
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              En direct de la CFDT Interco
            </h4>

            {news.length === 0 ? (
              <div className="text-center text-slate-400 text-lg py-12">
                Aucune actualité disponible pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                {news.map((article, i) => {
                  const date = article.pubDate
                    ? new Date(article.pubDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <a
                      key={i}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/card w-full flex flex-col bg-gradient-to-br from-slate-800/80 via-blue-950/60 to-slate-800/80 backdrop-blur-md border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-150 glass-card"
                    >
                      {/* Image de l'article avec zoom au survol et fallback sur logo CFDT */}
                      <div className="relative w-full h-40 overflow-hidden bg-slate-900/50 flex-shrink-0">
                        <img
                          src={article.imageUrl || `${baseUrl}logo-cfdt.jpg`}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `${baseUrl}logo-cfdt.jpg`;
                          }}
                        />
                        {article.category && (
                          <span className="absolute top-3 left-3 inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur text-blue-300 border border-blue-500/30">
                            {article.category}
                          </span>
                        )}
                      </div>

                      {/* Détails de la carte */}
                      <div className="p-5 flex flex-col justify-between flex-grow">
                        <div>
                          <h4 className="text-white font-semibold text-base leading-snug group-hover/card:text-blue-200 transition-colors duration-150 mb-2 line-clamp-3">
                            {article.title}
                          </h4>
                          {article.description && (
                            <p className="text-slate-300 text-sm font-light line-clamp-3 mb-4">
                              {article.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/40">
                          <span className="text-xs text-slate-400 font-light">{date}</span>
                          <span className="text-sm font-medium text-blue-400 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150">
                            Lire la suite <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Colonne de droite: À lire */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-white mb-10 pb-4 border-b border-slate-700/50">
              <span className="relative inline-block z-10">
                <span className="relative z-20 text-white font-black tracking-tight">À lire</span>
                <span className="absolute bottom-1.5 left-[-4%] w-[108%] h-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 opacity-90 -skew-x-12 -rotate-2 z-0 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]"></span>
              </span>
            </h3>
            <div className="group bg-gradient-to-br from-slate-800/80 via-blue-950/60 to-slate-800/80 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 glass-card hover:border-blue-400/50 transition-all duration-300">
              <a 
                href="https://intranet.ville-gennevilliers.fr/Statics/media/syndicats/cfdt/journaux/journal-gennevilliers-printemps-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full"
              >
                <div className="overflow-hidden rounded-lg shadow-2xl mb-4 relative flex-grow min-h-[16rem]">
                  <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none rounded-lg"></div>
                  <img 
                    src={`${baseUrl}journal 2026.png`} 
                    alt="Journal CFDT" 
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 bg-slate-900/20 absolute inset-0" 
                  />
                </div>
                <div className="shrink-0 flex flex-col">
                  <h4 className="text-white text-lg font-bold mb-2">Le Journal de la CFDT</h4>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    Découvrez la dernière édition de notre journal.
                  </p>
                  <div className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5">
                    Télécharger le journal
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Actualites;
