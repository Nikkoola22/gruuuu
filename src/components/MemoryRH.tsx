import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  HelpCircle, 
  Check, 
  Sparkles
} from "lucide-react";

interface MemoryRHProps {
  onClose: () => void;
}

interface Card {
  id: string;      // Unique card ID e.g., "term-1" or "def-1"
  pairId: number;  // ID of the pair (1 to 6)
  type: "term" | "definition";
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const BASE_URL = import.meta.env.BASE_URL;

const ALL_PAIRS = [
  { id: 1, term: "Temps Partiel Thérapeutique 🩺", def: "Reprise progressive du travail après maladie 📈" },
  { id: 2, term: "Compte Épargne-Temps (CET) 📅", def: "Épargner des congés non pris pour plus tard 💾" },
  { id: 3, term: "Protection Fonctionnelle 🛡️", def: "Défense juridique de l'agent par l'employeur 🤝" },
  { id: 4, term: "Régime du RIFSEEP 💰", def: "Indemnités liées aux fonctions, à l'expertise et aux résultats 💵" },
  { id: 5, term: "Droit à la Déconnexion 📵", def: "Aucune sollicitation pro en dehors des heures de travail 🕰️" },
  { id: 6, term: "Télétravail à Gennevilliers 🏠", def: "Autorisé jusqu'à 2 jours par semaine par défaut 💻" },
  { id: 7, term: "NBI (Bonification Indiciaire) 📈", def: "Points d'indice en plus pour responsabilités ou technicité 🎯" },
  { id: 8, term: "Détachement Administratif ✈️", def: "Exercer temporairement dans une autre administration 🔄" },
  { id: 9, term: "Disponibilité de l'Agent ⏳", def: "Cesser ses fonctions sans traitement pour convenance personnelle 🛑" },
  { id: 10, term: "Entretien Professionnel Annuel 📋", def: "Bilan annuel d'activité et fixation d'objectifs avec le N+1 🎯" },
  { id: 11, term: "Droit de Retrait ⚠️", def: "Quitter son poste face à un danger grave et imminent 🚨" },
  { id: 12, term: "Comité Social Territorial (CST) 🤝", def: "Instance paritaire pour le dialogue social et la sécurité 🏛️" },
  { id: 13, term: "Compte Personnel de Formation (CPF) 📚", def: "Crédit d'heures annuel pour financer des formations pro 🎓" },
  { id: 14, term: "Promotion de Grade 🚀", def: "Progression de carrière au sein de son cadre d'emplois 🏆" },
  { id: 15, term: "Congé Parental 🍼", def: "Cesser de travailler sans solde pour élever son jeune enfant 🧸" },
  { id: 16, term: "Comité des Œuvres Sociales (COS) 🎭", def: "Prestations sociales, culturelles et loisirs des agents 🎫" }
];

const shuffleCards = (): Card[] => {
  // Sélectionner 6 paires aléatoires uniques de la liste
  const shuffledPairs = [...ALL_PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);

  const cards: Card[] = [];
  shuffledPairs.forEach((p) => {
    cards.push({
      id: `term-${p.id}`,
      pairId: p.id,
      type: "term",
      content: p.term,
      isFlipped: false,
      isMatched: false
    });
    cards.push({
      id: `def-${p.id}`,
      pairId: p.id,
      type: "definition",
      content: p.def,
      isFlipped: false,
      isMatched: false
    });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

// ─── Effet Confettis pour la Victoire ─────────────────────────────────────────
const VictoryConfetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 600);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || 600;
      height = canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const colors = ["#FFC107", "#FF5722", "#E91E63", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50", "#8BC34A"];

    // Confetti bursts from both corners
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: 0,
        y: height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 8 + 4,
        speedY: -(Math.random() * 12 + 10),
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        opacity: 1
      });
      particles.push({
        x: width,
        y: height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: -(Math.random() * 8 + 4),
        speedY: -(Math.random() * 12 + 10),
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        opacity: 1
      });
    }

    const gravity = 0.35;
    const friction = 0.98;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let active = false;

      particles.forEach((p) => {
        p.speedY += gravity;
        p.speedX *= friction;
        p.speedY *= friction;
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.opacity > 0 && p.y < height + 50) {
          active = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full rounded-3xl z-0"
    />
  );
};

// ─── Composant Principal MemoryRH ─────────────────────────────────────────────
const MemoryRH: React.FC<MemoryRHProps> = ({ onClose }) => {
  const [cards, setCards] = useState<Card[]>(() => shuffleCards());
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [victory, setVictory] = useState(false);

  // Gérer le clic sur une carte
  const handleCardClick = (idx: number) => {
    if (locked || cards[idx].isFlipped || cards[idx].isMatched) return;

    // Flip card
    const updatedCards = [...cards];
    updatedCards[idx].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedIndices, idx];
    setSelectedIndices(newSelected);

    // Si on a retourné 2 cartes
    if (newSelected.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      const firstCard = cards[newSelected[0]];
      const secondCard = cards[idx];

      // Vérifier la correspondance
      if (firstCard.pairId === secondCard.pairId) {
        // MATCH !
        setTimeout(() => {
          setCards((prev) => {
            const temp = [...prev];
            temp[newSelected[0]].isMatched = true;
            temp[idx].isMatched = true;
            return temp;
          });
          setMatches((m) => m + 1);
          setSelectedIndices([]);
          setLocked(false);
        }, 400);
      } else {
        // NO MATCH ! Retourner les cartes après 1.2s
        setTimeout(() => {
          setCards((prev) => {
            const temp = [...prev];
            temp[newSelected[0]].isFlipped = false;
            temp[idx].isFlipped = false;
            return temp;
          });
          setSelectedIndices([]);
          setLocked(false);
        }, 1200);
      }
    }
  };

  // Détecter la victoire
  useEffect(() => {
    if (matches === 6) {
      setVictory(true);
    }
  }, [matches]);

  // Recommencer une partie
  const handleRestart = () => {
    setCards(shuffleCards());
    setSelectedIndices([]);
    setLocked(false);
    setMoves(0);
    setMatches(0);
    setVictory(false);
  };

  return (
    <div className="relative z-30 isolate min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a0022] via-[#2a0033] to-[#3a0055] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-white">
      
      {/* Background image overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{ backgroundImage: `url('${BASE_URL}unnamed.jpg')`, opacity: 0.15 }}
      ></div>

      {/* Subtle overlay for text readability */}
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

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Retour button */}
        <div className="relative z-40 mb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all text-sm shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        {/* Title & Stats */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-shimmer mb-2">
            Memory RH
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light max-w-lg mx-auto mb-6">
            Associez chaque terme de la fonction publique (carte foncée) avec sa définition correspondante (carte claire) !
          </p>

          <div className="flex justify-center items-center gap-6 text-sm font-bold">
            <span className="bg-slate-900/60 px-4 py-2 rounded-full shadow border border-purple-500/20 text-slate-100">
              Coups joués : <span className="text-pink-400 text-base font-extrabold">{moves}</span>
            </span>
            <span className="bg-slate-900/60 px-4 py-2 rounded-full shadow border border-purple-500/20 text-slate-100">
              Paires trouvées : <span className="text-cyan-400 text-base font-extrabold">{matches} / 6</span>
            </span>
          </div>
        </div>

        {/* Card Grid */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/80 via-purple-900/40 to-slate-800/80 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/30 relative">
          {victory && <VictoryConfetti />}

          {victory ? (
            // Victory Screen
            <div className="text-center py-12 relative z-10 animate-scale-up">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-extrabold text-white mb-2 font-light">Félicitations ! 🎉</h2>
              <p className="text-slate-300 max-w-sm mx-auto mb-8 text-sm">
                Vous avez associé toutes les paires RH avec brio en seulement <span className="font-bold text-cyan-400">{moves} coups</span> !
              </p>

              <button
                onClick={handleRestart}
                className="mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-95 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 btn-shine"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Recommencer une partie</span>
              </button>
            </div>
          ) : (
            // Cards game board
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center items-stretch">
                {cards.map((card, idx) => {
                  const isFlipped = card.isFlipped || card.isMatched;
                  const isTerm = card.type === "term";
                  
                  return (
                    <div 
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className="h-28 perspective cursor-pointer select-none"
                    >
                      <div 
                        className={`w-full h-full relative duration-500 transform-style-3d ${
                          isFlipped ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Card Back (Face cachée) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-950 border-2 border-purple-500/20 rounded-2xl flex flex-col items-center justify-center text-white backface-hidden shadow-md hover:shadow-lg transition-all duration-150">
                          <HelpCircle className="w-8 h-8 text-purple-400/80 animate-pulse" />
                        </div>

                        {/* Card Front (Face visible) */}
                        <div className={`absolute inset-0 border-2 rounded-2xl p-3 flex flex-col items-center justify-center text-center text-xs font-semibold backface-hidden rotate-y-180 shadow-md ${
                          card.isMatched
                            ? "bg-green-950/50 border-green-500 text-green-200"
                            : isTerm
                              ? "bg-gradient-to-br from-purple-950/70 to-slate-900 border-purple-500/60 text-white"
                              : "bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-cyan-500/60 text-cyan-100"
                        }`}>
                          {card.isMatched && (
                            <span className="absolute top-1.5 right-1.5 bg-green-500 text-white p-0.5 rounded-full shadow">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                          <p className="leading-tight break-words max-w-full font-light">{card.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-slate-900/60 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 text-sm border border-purple-500/20 glass-pill"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default MemoryRH;
