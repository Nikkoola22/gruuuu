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
  Volume2,
} from "lucide-react";

import { sommaire } from "./data/sommaire.ts";
import { chapitres } from "./data/temps.ts";
import { formation } from "./data/formation.ts";
import { teletravailData } from "./data/teletravail.ts";
import { infoItems } from "./data/info-data.ts";
import { podcastEpisodes, type PodcastEpisode } from "./data/podcasts/mp3.ts";

// Interfaces
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
  currentView: "menu" | "chat";
  selectedDomain: number | null;
  messages: ChatMessage[];
  isProcessing: boolean;
}

// Constantes API et données
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = "https://api.perplexity.ai/chat/completions";

// --- DÉBUT DE VOTRE BLOC DE CODE INTÉGRÉ ---
const actualitesSecours = [
  { title: "Réforme des retraites : nouvelles négociations prévues", link: "#", pubDate: new Date( ).toISOString(), guid: "1" },
  { title: "Budget 2024 : les principales mesures votées", link: "#", pubDate: new Date().toISOString(), guid: "2" },
  { title: "Fonction publique : accord sur les salaires", link: "#", pubDate: new Date().toISOString(), guid: "3" },
];

const sommaireData = JSON.parse(sommaire);

// Fonctions utilitaires
const nettoyerChaine = (chaine: unknown): string => {
  if (typeof chaine !== "string") return "";
  return chaine.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, "").trim();
};

// =======================
//  Composant NewsTicker
// =======================
const NewsTicker: React.FC = () => {
  const [actualites, setActualites] = useState(actualitesSecours);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerFlux = async () => {
      const fluxOriginal = "https://www.franceinfo.fr/politique.rss";
      const estEnProduction = import.meta.env.PROD;
      const FLUX_ACTUALITES_URL = estEnProduction
        ? `https://gruuuu.vercel.app/api/proxy?url=${encodeURIComponent(fluxOriginal )}`
        : `/proxy/politique.rss`;

      console.log("NewsTicker - Mode:", estEnProduction ? "Production" : "Développement");
      console.log("NewsTicker - URL utilisée:", FLUX_ACTUALITES_URL);

      try {
        const res = await fetch(FLUX_ACTUALITES_URL);
        if (!res.ok) throw new Error(`Échec de la récupération du flux RSS, statut: ${res.status}`);
        
        const xml = await res.text();
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        
        const parserError = doc.querySelector("parsererror");
        if (parserError) {
          console.error("Erreur de parsing XML:", parserError.textContent);
          throw new Error("Le document RSS reçu est invalide.");
        }

        const items = Array.from(doc.querySelectorAll("item")).slice(0, 10).map((item, i) => ({
          title: (item.querySelector("title")?.textContent || `Actualité ${i + 1}`).trim(),
          link: (item.querySelector("link")?.textContent || "#").trim(),
          pubDate: (item.querySelector("pubDate")?.textContent || new Date().toISOString()).trim(),
          guid: (item.querySelector("guid")?.textContent || `${Date.now()}-${i}`).trim(),
        }));

        if (items.length > 0) {
          setActualites(items);
        } else {
          throw new Error("Le flux RSS est vide.");
        }
      } catch (error) {
        console.error("Impossible de charger le flux RSS, utilisation des données de secours.", error);
      } finally {
        setLoading(false);
      }
    };
    
    chargerFlux();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-900/80 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        <span className="ml-2 text-white text-base font-medium">Chargement des actualités...</span>
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
              rel="noopener noreferrer"
              className="flex items-center mx-8 text-white hover:text-blue-200 transition-colors no-underline"
            >
              <span className="mr-2 text-yellow-300 text-xl">📰</span>
              <span className="font-semibold text-lg sm:text-xl">{item.title}</span>
              <span className="mx-6 text-blue-300 text-xl">•</span>
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-container { overflow: hidden; white-space: nowrap; }
        .animate-ticker { display: inline-flex; animation: ticker 40s linear infinite; }
      `}</style>
    </div>
  );
};

// =======================
//  Composant TrouverContexte
// =======================
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

  const top = Array.from(scores.entries()).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id]) => {
    const titre = sommaireData.chapitres[id - 1].titre;
    const contenu = (chapitres as Record<number, string>)[id] || "";
    return `Source: ${titre}\nContenu: ${contenu}`;
  });

  return top.join("\n\n---\n\n");
};

// =======================
//  Composant PodcastPlayer
// =======================
const PodcastPlayer: React.FC = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMinimized, setIsMinimized] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [volume]);

  useEffect(() => {
    if (currentEpisode) {
      audioRef.current?.load();
      playPause();
    }
  }, [currentEpisode]);

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Erreur de lecture audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const selectEpisode = (episode: PodcastEpisode) => {
    if (currentEpisode?.id !== episode.id) {
      setCurrentEpisode(episode);
      setIsPlaying(false); // La lecture commencera via le useEffect
    } else {
      playPause();
    }
  };

  const formatTime = (time: number) => new Date(time * 1000).toISOString().substr(14, 5);

  return (
    <div className={`fixed right-4 bottom-4 z-50 transition-all duration-300 ${isMinimized ? "w-48 h-14" : "w-80"}`}>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl shadow-lg p-2">
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-white p-1.5 hover:bg-white/10 rounded-full">{isMinimized ? "🔼" : "🔽"}</button>
          <img src="./podcast.jpg" alt="Podcast" className="w-8 h-8 rounded-full border border-white/20" />
          <div className="text-white text-xs font-medium truncate max-w-[7.5rem]">{currentEpisode?.title ?? "Podcast CFDT"}</div>
          {currentEpisode && <button onClick={playPause} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>}
        </div>
        <audio ref={audioRef} src={currentEpisode?.url} preload="metadata" style={{ display: "none" }} />
        {!isMinimized && (
          <div className="mt-4">
            <ul className="max-h-48 overflow-y-auto">
              {podcastEpisodes.map(ep => <li key={ep.id}><button onClick={() => selectEpisode(ep)} className={`w-full text-left p-2 rounded text-sm text-white ${currentEpisode?.id === ep.id ? "bg-purple-700" : "hover:bg-purple-700/80"}`}>{ep.title}</button></li>)}
            </ul>
            {currentEpisode && <div className="mt-2 px-2 text-xs text-purple-200">{formatTime(currentTime)} / {formatTime(duration)}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
// =======================
// App principale
// =======================
export default function App() {
  const [chatState, setChatState] = useState<ChatbotState>({
    currentView: "menu",
    selectedDomain: null,
    messages: [],
    isProcessing: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

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
      console.error("Erreur API:", err);
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
Réponds uniquement en utilisant la documentation ci-dessous.
Si la réponse n'est pas présente, dis : "Je ne trouve pas l'information. Contactez le 64 64."
Réponds comme si tu parlais a un collegue que tu connais, et propose lui a la fin de contacter la CFDT au 01 40 85 64 64.
--- DOCUMENTATION ---
${contexte}
--- FIN DOCUMENTATION ---
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
      const assistantMsg: ChatMessage = { type: "assistant", content: reply, timestamp: new Date() };
      setChatState((p) => ({ ...p, messages: [...p.messages, assistantMsg], isProcessing: false }));
    } catch {
      const errMsg: ChatMessage = {
        type: "assistant",
        content: "Erreur lors du traitement. Veuillez réessayer.",
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
      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('./unnamed.jpg')" }} />
      <div className="fixed inset-0 bg-black/10 z-0" />

      {/* Podcast Player */}
      <PodcastPlayer />

{/* Header */}
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
    <div className="relative shrink-0 w-40 h-40 sm:w-48 sm:h-48">
      {/* Halo orange autour du cercle */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(255,165,0,0.9)] animate-pulse"></div>
      {/* Cercle blanc de fond */}
      <div className="absolute inset-0 bg-white rounded-full"></div>
      {/* Logo CFDT rempli dans le cercle */}
      <img
        src="./logo-cfdt.jpg"
        alt="Logo CFDT"
        className="relative w-full h-full object-cover rounded-full"
      />
    </div>
  </div>
</header>
      {/* Main */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {chatState.currentView === "menu" ? (
          <>
            {/* Bandeau défilant custom (NEWS FTP:) */}
            <section className="relative bg-orange-300 text-black overflow-hidden mx-auto max-w-5xl rounded-2xl shadow-lg z-10">
              <div className="relative h-20 flex items-center overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-40 flex items-center justify-center bg-orange-400 z-20 shadow-md">
                  <span className="text-2xl font-bold">NEWS FPT:</span>
                </div>
                <div className="animate-marquee whitespace-nowrap flex items-center pl-44" style={{ animation: "marquee 30s linear infinite" }}>
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
              <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
            </section>

            {/* Détail info */}
            {selectedInfo && (
              <section className="info-detail bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md mt-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold mb-4">{selectedInfo.title}</h3>
                <p className="whitespace-pre-wrap">{selectedInfo.content}</p>
                <button onClick={() => setSelectedInfo(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Fermer
                </button>
              </section>
            )}

            {/* Choix domaine */}
            <section className="text-center my-12">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 text-center">
  Choisissez votre domaine d'assistance
</h3>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Nos assistants IA spécialisés vous aideront.
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
            
            {/* Bloc actus (RSS) */}
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
          // Vue Chat
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

            <div className="h-[60vh] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {chatState.messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                   {msg.type === 'assistant' && <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs mt-2 opacity-70 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}

              {chatState.isProcessing && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">CFDT</div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
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

{/* Footer */}
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
              className="text-white hover:underline"
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
          <div className="font-semibold text-white">9h00 - 17h00</div>
          <div className="text-sm">Permanences sur RDV</div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-6 text-center">
      <p className="text-gray-400">
        © 2025 CFDT Gennevilliers - Assistant IA pour les agents municipaux
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}
