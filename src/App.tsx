import type React from "react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import {
  Clock,
  GraduationCap,
  Users,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  ArrowLeft,
  Home,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { sommaire } from "./data/sommaire.ts";
import { chapitres } from "./data/temps.ts";
import { formation } from "./data/formation.ts";
import { teletravailData } from "./data/teletravail.ts";
import { infoItems as defaultInfoItems } from "./data/info-data.ts";
import { podcastEpisodes, type PodcastEpisode } from "./data/podcasts/mp3.ts";
import LoginModal from "./components/LoginModal";

interface ChatMessage {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface InfoItem {
  id: number;
  title: string;
  content: string;
}

interface ChatbotState {
  currentView: "menu" | "chat" | "public";
  selectedDomain: number | null;
  messages: ChatMessage[];
  isProcessing: boolean;
}

const API_KEY = import.meta.env.VITE_APP_PERPLEXITY_KEY;
const API_URL = "https://api.perplexity.ai/chat/completions";

const proxyUrl = "https://api.allorigins.win/get?url=";
const FLUX_ACTUALITES_URL = proxyUrl + encodeURIComponent(fluxOriginal);
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const NewsTicker: React.FC = () => {
  const [actualites, setActualites] = useState(actualitesSecours);
  const [loading, setLoading] = useState(true);

  const chargerFlux = async () => {
    try {
      const res = await fetch(FLUX_ACTUALITES_URL);
      if (!res.ok) throw new Error("Failed to fetch RSS feed");
      const data = await res.json(); // AllOrigins renvoie { contents: "...RSS..." }
      const doc = new DOMParser().parseFromString(data.contents, "text/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, 10).map((item, i) => ({
        title: item.querySelector("title")?.textContent || `Actualité ${i + 1}`,
        link: item.querySelector("link")?.textContent || "#",
        pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
        guid: item.querySelector("guid")?.textContent || `${i}`,
      }));
      if (items.length) setActualites(items);
    } catch (err) {
      console.error("Erreur lors du chargement du flux RSS :", err);
      setActualites(actualitesSecours); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chargement initial
    chargerFlux();

    // Mise à jour automatique toutes les 5 minutes
    const intervalId = setInterval(chargerFlux, REFRESH_INTERVAL_MS);

    // Nettoyage à la destruction du composant
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-900/80 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        <span className="ml-2 text-white text-sm">Chargement des actualités...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-900/80 rounded-lg overflow-hidden border border-blue-500/30 shadow-inner">
      <div className="flex items-center whitespace-nowrap py-3 ticker-container">
        <div className="flex animate-ticker hover:[animation-play-state:paused]">
          {[...actualites, ...actualites].map((item, idx) => (
            <a
              key={`${item.guid}-${idx}`}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center mx-6 text-white hover:text-blue-200 transition-colors no-underline"
            >
              <span className="mr-2 text-yellow-300">📰</span>
              <span className="font-medium text-xl sm:text-2xl">{item.title}</span>
              <span className="mx-4 text-blue-300">•</span>
            </a>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-container { overflow: hidden; white-space: nowrap; }
        .animate-ticker { display: inline-flex; animation: ticker 60s linear infinite; }
      `}</style>
    </div>
  );
};

const trouverContextePertinent = (question: string): string => {
  const qNet = nettoyerChaine(question);
  const mots = qNet.split(/\s+/).filter(Boolean);
  const scores = new Map<number, number>();

  sommaireData.chapitres.forEach((chap: any, i: number) => {
    let score = 0;
    const keys = [...(chap.mots_cles || []), ...(chap.articles?.flatMap((a: any) => a.mots_cles) || [])];
    keys.forEach((mc: string) => {
      const m = nettoyerChaine(mc);
      if (mots.includes(m)) score += 10;
      else if (qNet.includes(m)) score += 5;
    });
    if (score) scores.set(i + 1, (scores.get(i + 1) || 0) + score);
  });

  if (!scores.size) {
    return "Aucun chapitre spécifique trouvé. Thèmes : " + sommaireData.chapitres.map((c: any) => c.titre).join(", ");
  }

  const top = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => {
      const titre = sommaireData.chapitres[id - 1].titre;
      const contenu = (chapitres as Record<number, string>)[id] || "";
      return `Source: ${titre}\nContenu: ${contenu}`;
    });

  return top.join("\n\n---\n\n");
};

const PodcastPlayer: React.FC = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      const currentIndex = podcastEpisodes.findIndex((e) => e.id === currentEpisode?.id);
      if (currentIndex !== -1 && currentIndex < podcastEpisodes.length - 1) {
        setCurrentEpisode(podcastEpisodes[currentIndex + 1]);
      }
    };
    const handleError = () => {
      setIsPlaying(false);
      setError("Impossible de charger ce podcast. Vérifiez votre connexion.");
    };

    const handlers: { [key: string]: EventListener } = {
      timeupdate: updateTime,
      loadedmetadata: updateDuration,
      canplay: () => {},
      ended: handleEnded,
      error: handleError,
      loadstart: () => {},
      waiting: () => {},
      playing: () => {
        setIsPlaying(true);
      },
      pause: () => setIsPlaying(false),
    };

    Object.entries(handlers).forEach(([evt, fn]) => audio.addEventListener(evt, fn));
    audio.volume = 1;
    if (currentEpisode) audio.load();

    return () => {
      Object.entries(handlers).forEach(([evt, fn]) => audio.removeEventListener(evt, fn));
    };
  }, [currentEpisode]);

  const playPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setError(null);
        await audio.play();
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      setError("Impossible de lire ce podcast.");
      setIsPlaying(false);
    }
  };

  const selectEpisode = (episode: PodcastEpisode) => {
    if (currentEpisode?.id !== episode.id) {
      setCurrentEpisode(episode);
      setIsPlaying(false); // Let useEffect handle loading and playing
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`fixed right-4 bottom-4 z-50 transition-all duration-300 ${isMinimized ? "w-64 h-24" : "w-96 h-auto"}`}>
      <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden p-3">
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-700 p-1.5 hover:bg-gray-100 rounded-full border-2 border-orange-500">
            {isMinimized ? <ChevronUp className="w-4 h-4 text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-700" />}
          </button>
          {currentEpisode && (
            <button onClick={playPause} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
          )}
          <div className="flex-grow flex flex-col items-center justify-center">
            <img 
              src="./podcast.jpg" 
              alt="Podcast" 
              className="w-8 h-8 rounded-full object-cover mb-1"
            />
            <span className="text-gray-800 font-semibold text-sm">Podcast CFDT</span>
          </div>
        </div>
        <audio ref={audioRef} src={currentEpisode?.url} preload="metadata" style={{ display: "none" }} crossOrigin="anonymous" />
        {!isMinimized && (
          <div className="mt-4">
            {/* Affichage de la vignette du podcast */}
            <div className="flex flex-col items-center mb-4">
              <img 
                src="./podcast.jpg"  // <- Chemin identique, image dans 'public'
                alt="Illustration Podcast"
                className="w-32 h-32 object-cover rounded-full shadow-md border-2 border-purple-400"
              />
              <h4 className="text-white font-bold text-center mt-2">Épisodes disponibles</h4>
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {podcastEpisodes.map(episode => (
                <li key={episode.id}>
                  <button
                    onClick={() => selectEpisode(episode)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm text-white mb-1 transition-colors ${
                      currentEpisode?.id === episode.id ? "bg-purple-700 font-semibold" : "bg-purple-800/60 hover:bg-purple-700/80"
                    }`}
                  >
                    {episode.title}
                  </button>
                </li>
              ))}
            </ul>
            {currentEpisode && (
              <div className="mt-2 px-2 text-xs text-purple-200">
                <p className="truncate">Lecture : {currentEpisode.title}</p>
                <div>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                {error && <div className="text-red-300 mt-1">{error}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default function App() {
  // if (DEBUG_IMAGES) {
  //   return <ImageTroubleshooter />;
  // }
  
  // Charger les informations depuis le localStorage ou utiliser les données par défaut
  const [infoItems, setInfoItems] = useState<InfoItem[]>(() => {
    const savedInfo = localStorage.getItem('cfdt-info-items');
    return savedInfo ? JSON.parse(savedInfo) : defaultInfoItems;
  });
  
  const [chatState, setChatState] = useState<ChatbotState>({
    currentView: "menu",
    selectedDomain: null,
    messages: [],
    isProcessing: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Écouter les changements dans le localStorage pour mettre à jour les informations
  useEffect(() => {
    const handleStorageChange = () => {
      const savedInfo = localStorage.getItem('cfdt-info-items');
      if (savedInfo) {
        setInfoItems(JSON.parse(savedInfo));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fonction de vérification des identifiants
  const handleLogin = (username: string, password: string): boolean => {
    // Identifiants par défaut (dans un vrai projet, ceci serait vérifié côté serveur)
    const validCredentials = [
      { username: "admin", password: "cfdt2025" },
      { username: "cfdt", password: "admin123" },
      { username: "gennevilliers", password: "cfdt2025" }
    ];
    
    return validCredentials.some(cred => 
      cred.username === username && cred.password === password
    );
  };

  const scrollToChat = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDomainSelection = (domainId: number) => {
    const welcomes: Record<number, string> = {
      0: "Bonjour ! Je peux vous aider avec vos questions sur les horaires, congés, ARTT, temps partiel, heures supplémentaires, absences, etc.",
      1: "Bonjour ! Je peux vous renseigner sur le CPF, les congés de formation, la VAE, les concours, les bilans de compétences, etc. Quelle est votre question ?",
      2: "Bonjour ! Je suis l'assistant spécialiste du télétravail. Posez-moi vos questions sur la charte, les jours autorisés, les indemnités, etc.",
    };
    setChatState({
      currentView: "chat",
      selectedDomain: domainId,
      messages: [{ type: "assistant", content: welcomes[domainId], timestamp: new Date() }],
      isProcessing: false,
    });
    scrollToChat();
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const returnToMenu = () => {
    setChatState({ currentView: "menu", selectedDomain: null, messages: [], isProcessing: false });
    setInputValue("");
    setSelectedInfo(null);
  };

  const appelPerplexity = async (messages: any[]): Promise<string> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "sonar-pro", messages }),
    });
    if (!response.ok) {
      const err = await response.text();
      console.error("Détail de l'erreur API:", err);
      throw new Error(`Erreur API (${response.status})`);
    }
    const json = await response.json();
    return json.choices[0].message.content;
  };

  const traiterQuestion = async (question: string): Promise<string> => {
    let contexte = "";
    if (chatState.selectedDomain === 0) contexte = trouverContextePertinent(question);
    else if (chatState.selectedDomain === 1) contexte = JSON.stringify(formation, null, 2);
    else if (chatState.selectedDomain === 2) contexte = teletravailData;

    const systemPrompt = `
Tu es un collègue syndical spécialiste pour la mairie de Gennevilliers.
Ta mission est de répondre aux questions des agents en te basant EXCLUSIVEMENT sur la documentation fournie ci-dessous.
NE JAMAIS utiliser tes connaissances générales.
Si la réponse ne se trouve pas dans la documentation, réponds : "Je ne trouve pas l'information dans les documents à ma disposition. Veuillez contacter le 64 64 pour plus de détails."
Sois précis, utilise un ton AMICAL et cite le titre du chapitre si possible.
--- DEBUT DE LA DOCUMENTATION PERTINENTE ---
${contexte}
--- FIN DE LA DOCUMENTATION PERTINENTE ---
    `;
    const history = chatState.messages.slice(1).map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));
    const apiMessages = [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: question }];
    return await appelPerplexity(apiMessages);
  };

  const handleSendMessage = async (): Promise<void> => {
    const q = inputValue.trim();
    if (!q || chatState.isProcessing) return;
    const userMsg: ChatMessage = { type: "user", content: q, timestamp: new Date() };
    setChatState((p) => ({ ...p, messages: [...p.messages, userMsg], isProcessing: true }));
    setInputValue("");
    
    try {
      const reply = await traiterQuestion(q);
      
      // Créer un message assistant vide pour l'affichage progressif
      const assistantMsg: ChatMessage = { type: "assistant", content: "", timestamp: new Date() };
      setChatState((p) => ({ ...p, messages: [...p.messages, assistantMsg] }));
      
      // Afficher la réponse progressivement
      let currentText = "";
      const messageIndex = chatState.messages.length; // Index du nouveau message
      
      for (let i = 0; i <= reply.length; i++) {
        currentText = reply.slice(0, i);
        setChatState((p) => {
          const newMessages = [...p.messages];
          newMessages[messageIndex] = { ...newMessages[messageIndex], content: currentText };
          return { ...p, messages: newMessages };
        });
        
        // Délai variable selon le caractère (plus rapide pour les espaces)
        const delay = currentText.endsWith(' ') ? 20 : 30;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      setChatState((p) => ({ ...p, isProcessing: false }));
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        type: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer ou contacter un représentant si le problème persiste.",
        timestamp: new Date(),
      };
      setChatState((p) => ({ ...p, messages: [...p.messages, errMsg], isProcessing: false }));
    } finally {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('./mairie.jpeg')" }} />
      <div className="fixed inset-0 bg-black/10 z-0" />
      <PodcastPlayer />

      <header className="relative bg-white/90 backdrop-blur-sm shadow-lg border-b-4 border-orange-500 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-full blur-lg opacity-70 animate-pulse" />
              <div className="relative p-6 bg-gradient-to-br from-white to-orange-50 rounded-full shadow-2xl">
                <Users className="w-20 h-20 text-orange-500" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
                Atlas: Chatbot CFDT
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mairie de GENNEVILLIERS
              </h2>
              <p className="mt-4 flex justify-center sm:justify-start items-center gap-2 text-lg text-gray-700">
                <Users className="text-orange-500 w-5 h-5 animate-pulse" />
                Assistant syndical CFDT pour les agents municipaux
              </p>
            </div>
          </div>
          <div className="relative shrink-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 rounded-full blur-2xl opacity-80 animate-pulse"></div>
            <div className="relative bg-white rounded-full w-40 h-40 sm:w-48 sm:h-48 shadow-lg overflow-hidden">
              <img
                src="./logo-cfdt.jpg"
                alt="Logo CFDT"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {chatState.currentView === "menu" ? (
          <>
            <section className="relative bg-orange-300 text-black overflow-hidden mx-auto max-w-5xl rounded-2xl shadow-lg z-10">
              <div className="relative h-20 flex items-center overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-40 flex items-center justify-center bg-orange-400 z-20 shadow-md">
                  <span className="text-2xl font-bold">NEWS FPT:</span>
                </div>
                <div className="animate-marquee whitespace-nowrap flex items-center pl-44" style={{ animation: "marquee 45s linear infinite" }}>
                  {[...infoItems, ...infoItems].map((info, idx) => (
                    <button
                      key={`${info.id}-${idx}`}
                      onClick={() => setSelectedInfo(info)}
                      className="text-2xl font-medium mx-8 hover:text-blue-200 transition-colors underline decoration-dotted cursor-pointer"
                    >
                      #{info.id}: {info.title}
                    </button>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
            </section>

            {selectedInfo && (
              <section className="info-detail bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md mt-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold mb-4">{selectedInfo.title}</h3>
                <p className="whitespace-pre-wrap">{selectedInfo.content}</p>
                <button onClick={() => setSelectedInfo(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Fermer
                </button>
              </section>
            )}

            <section className="text-center my-12">
              <h3 className="text-4xl font-bold text-orange-500 mb-4">
                Choisissez votre domaine d'assistance
              </h3>
              <p className="text-xl text-orange-500 max-w-3xl mx-auto">
              Exclusivement a partir des documents de la mairie.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <button
                onClick={() => handleDomainSelection(0)}
                className="group relative overflow-hidden bg-white/95 border-2 border-orange-200 rounded-3xl p-8 transition-all duration-500 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-orange-700">Temps de Travail</h4>
                  <p className="text-center text-gray-600">Horaires, congés, ARTT, temps partiel, absences…</p>
                </div>
              </button>

              <button
                onClick={() => handleDomainSelection(1)}
                className="group relative overflow-hidden bg-white/95 border-2 border-purple-200 rounded-3xl p-8 transition-all duration-500 hover:border-purple-400 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-purple-700">Formation</h4>
                  <p className="text-center text-gray-600">CPF, VAE, concours, bilans de compétences…</p>
                </div>
              </button>
              
              <button
                onClick={() => handleDomainSelection(2)}
                className="group relative overflow-hidden bg-white/95 border-2 border-green-200 rounded-3xl p-8 transition-all duration-500 hover:border-green-400 hover:shadow-2xl hover:-translate-y-2 md:col-span-2 lg:col-span-1"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl shadow-xl group-hover:rotate-3 group-hover:scale-110 transition-transform">
                    <Home className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 group-hover:text-green-700">Télétravail</h4>
                  <p className="text-center text-gray-600">Charte, jours autorisés, indemnités, modalités…</p>
                </div>
              </button>
            </div>
            
             <div className="bg-white/95 border-2 border-blue-200 rounded-3xl p-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  <h4 className="text-2xl font-bold text-gray-800 text-blue-700">Actualités Nationales</h4>
                  <div className="w-full">
                    <NewsTicker />
                  </div>
                </div>
              </div>

          </>
        ) : (
          <div ref={chatContainerRef} className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={returnToMenu} className="text-white hover:text-orange-200 p-2 rounded-full hover:bg-white/10">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {chatState.selectedDomain === 0 && "Assistant Temps de Travail"}
                    {chatState.selectedDomain === 1 && "Assistant Formation"}
                    {chatState.selectedDomain === 2 && "Assistant Télétravail"}
                  </h3>
                  <p className="text-orange-100 text-sm">Posez vos questions, je suis là pour vous aider</p>
                </div>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
            
            {/* Zone avec message de bienvenue et GIF */}
            <div className="flex items-center justify-between py-4 bg-gray-50/50 px-6">
              {/* Message de bienvenue à gauche */}
              <div className="flex-1 pr-6">
                {chatState.messages.length > 0 && chatState.messages[0].type === 'assistant' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>
                    <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 shadow-md max-w-2xl">
                      <p className="text-lg sm:text-xl leading-relaxed">{chatState.messages[0].content}</p>
                      <p className="text-xs mt-2 opacity-70 text-right">{chatState.messages[0].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* GIF à droite */}
              <div className="flex-shrink-0">
                <img
                  src="./cfdtmanga.gif"
                  alt="CFDT Manga"
                  className="w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-cover rounded-2xl shadow-lg border-2 border-orange-300"
                />
              </div>
            </div>

            {/* Bloc principal en flex horizontal */}
            <div className="flex flex-row">
              {/* Zone des messages/questions */}
              <div className="flex-1 min-h-[15vh] max-h-[40vh] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {chatState.messages.slice(1).map((msg, i) => (
                  <div key={i + 1} className={`flex items-end gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.type === 'assistant' && <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>}
                    <div
                      className={`max-w-sm lg:max-w-xl px-4 py-3 rounded-2xl shadow-md ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-2 opacity-70 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}

                {chatState.isProcessing && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md rounded-bl-none max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">CFDT écrit</span>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-200 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre question ici..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={chatState.isProcessing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatState.isProcessing}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative bg-gray-900 text-white py-12 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Contact CFDT
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>01 40 85 64 64</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <a 
                    href="mailto:cfdt-interco@ville-gennevilliers.fr"
                    className="text-white hover:text-orange-300 transition-colors"
                  >
                    cfdt-interco@ville-gennevilliers.fr
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Mairie de Gennevilliers</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Services
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>Santé</li>
                <li>Retraite</li>
                <li>Juridique</li>
                <li>Accompagnement syndical</li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Horaires
              </h4>
              <div className="space-y-2 text-gray-300">
                <div>Lundi - Vendredi</div>
                <div className="font-semibold text-white">9h00/12h00 - 13h30/17h00
                </div>
                <div className="text-sm">Permanences sur RDV</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center">
            <p className="text-gray-400">© 2025 CFDT Gennevilliers - Assistant IA pour les agents municipaux</p>
            <div className="mt-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
                title="Administrer les actualités et informations"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modal de connexion */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
