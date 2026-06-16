import React, { useState, lazy, Suspense } from "react";
import { 
  ArrowLeft, 
  Gamepad2, 
  Sparkles, 
  Brain, 
  ArrowRight,
  HelpCircle,
  Zap
} from "lucide-react";

// Lazy-load les quatre jeux
const RouletteQVT = lazy(() => import("./RouletteQVT.tsx"));
const MemoryRH = lazy(() => import("./MemoryRH.tsx"));
const FAQQuiz = lazy(() => import("./FAQQuiz.tsx"));
const CasseBrique = lazy(() => import("./CasseBrique.tsx"));

interface EspaceJeuxProps {
  onClose: () => void;
}

const BASE_URL = import.meta.env.BASE_URL;

const ViewLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
    <div className="px-6 py-4 rounded-2xl border border-purple-500/30 bg-slate-900/60 text-purple-100/90 shadow-xl backdrop-blur-md animate-pulse">
      Chargement du jeu...
    </div>
  </div>
);

const EspaceJeux: React.FC<EspaceJeuxProps> = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState<"none" | "roulette" | "memory" | "quiz" | "cassebrique">("none");

  if (activeGame === "roulette") {
    return (
      <Suspense fallback={<ViewLoader />}>
        <RouletteQVT onClose={() => setActiveGame("none")} />
      </Suspense>
    );
  }

  if (activeGame === "memory") {
    return (
      <Suspense fallback={<ViewLoader />}>
        <MemoryRH onClose={() => setActiveGame("none")} />
      </Suspense>
    );
  }

  if (activeGame === "quiz") {
    return (
      <Suspense fallback={<ViewLoader />}>
        <FAQQuiz onClose={() => setActiveGame("none")} />
      </Suspense>
    );
  }

  if (activeGame === "cassebrique") {
    return (
      <Suspense fallback={<ViewLoader />}>
        <CasseBrique onClose={() => setActiveGame("none")} />
      </Suspense>
    );
  }

  return (
    <div className="relative z-30 isolate min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a0022] via-[#2a0033] to-[#3a0055] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-white">
      
      {/* Background image with transparency */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{ backgroundImage: `url('${BASE_URL}unnamed.jpg')`, opacity: 0.15 }}
      ></div>

      {/* Subtle overlay for better text readability */}
      <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none"></div>

      {/* Glow orb */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(200,0,100,0.12) 0%, rgba(110,0,160,0.06) 42%, transparent 68%)',
        filter: 'blur(24px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,28,116,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,28,116,0.015) 1px, transparent 1px)',
        backgroundSize: '70px 70px',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Retour au menu principal */}
        <div className="relative z-40 mb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all text-sm shadow-lg hover:shadow-red-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </button>
        </div>

        {/* Header Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex p-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-2xl mb-4 shadow-2xl logo-glow-ambient">
            <Gamepad2 className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-shimmer mb-3">
            Espace Jeux
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 font-light max-w-lg mx-auto">
            Détendez-vous tout en enrichissant vos connaissances professionnelles avec nos outils ludiques.
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch justify-items-center">
          
          {/* Card A: Roulette QVT */}
          <button
            onClick={() => setActiveGame("roulette")}
            className="group relative text-left bg-gradient-to-br from-slate-800/70 via-blue-900/60 to-slate-800/70 border border-blue-500/20 rounded-3xl p-8 hover:border-cyan-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[360px] w-full max-w-sm glass-card card-border-sweep card-border-sweep-blue btn-ripple"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-500/80 to-cyan-500/80 backdrop-blur rounded-2xl shadow-2xl w-16 h-16 flex items-center justify-center text-white icon-box-spring">
                <Sparkles className="w-8 h-8 group-hover:animate-spin" />
              </div>
              <div>
                <h3 className="text-2xl font-light tracking-tight text-white card-title-blue mb-2">
                  Roulette QVT
                </h3>
                <p className="text-slate-300 font-light text-sm leading-relaxed">
                  Tournez la roulette pour obtenir des idées concrètes pour votre bien-être au bureau, des gestes managériaux ou des astuces de carrière.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light text-sm mt-4">
              <span>Lancer le jeu</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card B: Memory RH */}
          <button
            onClick={() => setActiveGame("memory")}
            className="group relative text-left bg-gradient-to-br from-slate-800/70 via-purple-900/60 to-slate-800/70 border border-purple-500/20 rounded-3xl p-8 hover:border-pink-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[360px] w-full max-w-sm glass-card card-border-sweep btn-ripple"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="p-4 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur rounded-2xl shadow-2xl w-16 h-16 flex items-center justify-center text-white icon-box-spring">
                <Brain className="w-8 h-8 group-hover:animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-light tracking-tight text-white card-title-purple mb-2">
                  Memory RH
                </h3>
                <p className="text-slate-300 font-light text-sm leading-relaxed">
                  Testez votre mémoire RH ! Associez chaque terme de la fonction publique à son idée clé correspondante en retournant les cartes par paires.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light text-sm mt-4">
              <span>Lancer le jeu</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card C: Quiz FAQ */}
          <button
            onClick={() => setActiveGame("quiz")}
            className="group relative text-left bg-gradient-to-br from-slate-800/70 via-orange-950/60 to-slate-800/70 border border-orange-500/20 rounded-3xl p-8 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[360px] w-full max-w-sm glass-card card-border-sweep card-border-sweep-orange btn-ripple"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-red-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="p-4 bg-gradient-to-br from-orange-500/80 to-red-500/80 backdrop-blur rounded-2xl shadow-2xl w-16 h-16 flex items-center justify-center text-white icon-box-spring">
                <HelpCircle className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-2xl font-light tracking-tight text-white card-title-orange mb-2">
                  Quiz FAQ
                </h3>
                <p className="text-slate-300 font-light text-sm leading-relaxed">
                  Mettez au défi vos connaissances ! Répondez à 10 questions tirées au hasard sur les règlements, congés et droits de la fonction publique.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light text-sm mt-4">
              <span>Lancer le quiz</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card D: Casse-brique RH */}
          <button
            onClick={() => setActiveGame("cassebrique")}
            className="group relative text-left bg-gradient-to-br from-slate-800/70 via-orange-950/60 to-slate-800/70 border border-orange-500/20 rounded-3xl p-8 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[360px] w-full max-w-sm glass-card card-border-sweep card-border-sweep-orange btn-ripple"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-red-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="p-4 bg-gradient-to-br from-orange-500/80 to-red-500/80 backdrop-blur rounded-2xl shadow-2xl w-16 h-16 flex items-center justify-center text-white icon-box-spring">
                <Zap className="w-8 h-8 group-hover:animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-light tracking-tight text-white card-title-orange mb-2">
                  Casse-brique RH
                </h3>
                <p className="text-slate-300 font-light text-sm leading-relaxed">
                  Un casse-brique rétro aux couleurs de la CFDT ! Libérez les acquis et droits sociaux de la fonction publique en détruisant les obstacles.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light text-sm mt-4">
              <span>Lancer le jeu</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EspaceJeux;
