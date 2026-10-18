/**
 * Service de Classement & Top 10 en Temps Réel pour Gennevilliers City
 * Synchronisé en ligne (Cloud KV partagé) avec tolérance aux pannes locale (LocalStorage).
 */

export interface LeaderboardEntry {
  id: string;
  name: string;
  role: string;
  score: number;
  monthsSurvived: number;
  budget: number;
  satisfactionAvg: number;
  isVictory: boolean;
  date: string;
  badge: string;
  isHardcoded?: boolean;
}

// Benchmark officiel initial des services municipaux de Gennevilliers
export const BENCHMARK_SCORES: LeaderboardEntry[] = [
  {
    id: "bm-1",
    name: "DGS Gennevilliers",
    role: "Direction Générale",
    score: 6500,
    monthsSurvived: 14,
    budget: 280,
    satisfactionAvg: 62,
    isVictory: false,
    date: "15/10/2026",
    badge: "Pionnier du Mandat 👑",
    isHardcoded: true,
  },
  {
    id: "bm-2",
    name: "DRH Municipale",
    role: "Ressources Humaines",
    score: 5300,
    monthsSurvived: 12,
    budget: 250,
    satisfactionAvg: 58,
    isVictory: false,
    date: "14/10/2026",
    badge: "Gestionnaire Statutaire 📋",
    isHardcoded: true,
  },
  {
    id: "bm-3",
    name: "Direction des Finances",
    role: "Finances & M57",
    score: 4400,
    monthsSurvived: 10,
    budget: 220,
    satisfactionAvg: 55,
    isVictory: false,
    date: "13/10/2026",
    badge: "Équilibrage Budgétaire ⚖️",
    isHardcoded: true,
  },
  {
    id: "bm-4",
    name: "Centre de Santé CMS",
    role: "Santé Publique",
    score: 3500,
    monthsSurvived: 8,
    budget: 190,
    satisfactionAvg: 52,
    isVictory: false,
    date: "12/10/2026",
    badge: "Praticien Territorial 🩺",
    isHardcoded: true,
  },
  {
    id: "bm-5",
    name: "Services Techniques",
    role: "Voirie & Bâtiments",
    score: 2700,
    monthsSurvived: 6,
    budget: 170,
    satisfactionAvg: 48,
    isVictory: false,
    date: "11/10/2026",
    badge: "Cadre de Vie 🏗️",
    isHardcoded: true,
  },
  {
    id: "bm-6",
    name: "Petite Enfance & Écoles",
    role: "Restauration Scolaire",
    score: 2000,
    monthsSurvived: 5,
    budget: 150,
    satisfactionAvg: 45,
    isVictory: false,
    date: "10/10/2026",
    badge: "Maintien du Service 🎒",
    isHardcoded: true,
  },
  {
    id: "bm-7",
    name: "Police Municipale",
    role: "Sécurité & Prévention",
    score: 1400,
    monthsSurvived: 4,
    budget: 130,
    satisfactionAvg: 42,
    isVictory: false,
    date: "09/10/2026",
    badge: "Tranquillité Publique 🛡️",
    isHardcoded: true,
  },
  {
    id: "bm-8",
    name: "Culture & Médiathèques",
    role: "Action Culturelle",
    score: 900,
    monthsSurvived: 3,
    budget: 110,
    satisfactionAvg: 38,
    isVictory: false,
    date: "08/10/2026",
    badge: "Médiation Citoyenne 🎭",
    isHardcoded: true,
  },
  {
    id: "bm-9",
    name: "Sports & Jeunesse",
    role: "Animation Territoriale",
    score: 500,
    monthsSurvived: 2,
    budget: 90,
    satisfactionAvg: 35,
    isVictory: false,
    date: "07/10/2026",
    badge: "Engagement Quotidien ⚽",
    isHardcoded: true,
  },
  {
    id: "bm-10",
    name: "DSI Numérique",
    role: "Systèmes d'Information",
    score: 250,
    monthsSurvived: 1,
    budget: 70,
    satisfactionAvg: 30,
    isVictory: false,
    date: "06/10/2026",
    badge: "Premiers Pas Numériques 💻",
    isHardcoded: true,
  }
];

const KV_ENDPOINT = "https://kvdb.io/GLq4PTLEWpa71q2VHUJoDt/gennevilliers_city_top10";
const LOCAL_STORAGE_KEY = "gennevilliers_city_custom_scores";

/**
 * Récupère le Top 10 depuis le stockage local (cache résilient)
 */
export const getLocalScores = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[Leaderboard] Erreur lecture locale:", e);
  }
  return [...BENCHMARK_SCORES];
};

/**
 * Sauvegarde les scores dans le cache local
 */
export const saveLocalScores = (entries: LeaderboardEntry[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("[Leaderboard] Erreur sauvegarde locale:", e);
  }
};

/**
 * Récupère le Top 10 en temps réel depuis l'API en ligne partagée
 */
export const fetchOnlineLeaderboard = async (): Promise<{ entries: LeaderboardEntry[]; isOnline: boolean }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(KV_ENDPOINT, {
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Trier par score décroissant
        const sorted = data.sort((a, b) => b.score - a.score).slice(0, 50);
        saveLocalScores(sorted);
        return { entries: sorted, isOnline: true };
      }
    }
  } catch (err) {
    console.warn("[Leaderboard] API en ligne indisponible ou hors-ligne, utilisation du cache local:", err);
  }

  // Fallback local
  return { entries: getLocalScores(), isOnline: false };
};

/**
 * Envoie un nouveau score au classement en ligne partagé
 */
export const submitOnlineScore = async (
  newEntry: LeaderboardEntry
): Promise<{ entries: LeaderboardEntry[]; isOnline: boolean; rank: number }> => {
  // 1. Sauvegarde locale prioritaire immédiate
  const localList = getLocalScores();
  // Fusionner sans doublon d'ID
  const filteredLocal = localList.filter(e => e.id !== newEntry.id);
  const updatedLocal = [newEntry, ...filteredLocal].sort((a, b) => b.score - a.score).slice(0, 50);
  saveLocalScores(updatedLocal);
  const localRank = updatedLocal.findIndex(e => e.id === newEntry.id) + 1;

  // 2. Tenter d'envoyer en ligne
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Récupérer la version en ligne la plus fraîche
    const getRes = await fetch(KV_ENDPOINT, { signal: controller.signal });
    let currentOnline: LeaderboardEntry[] = [];
    if (getRes.ok) {
      const data = await getRes.json();
      if (Array.isArray(data)) currentOnline = data;
    }

    const filteredOnline = currentOnline.filter(e => e.id !== newEntry.id);
    const updatedOnline = [newEntry, ...filteredOnline].sort((a, b) => b.score - a.score).slice(0, 50);

    const postRes = await fetch(KV_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOnline)
    });
    clearTimeout(timeoutId);

    if (postRes.ok) {
      saveLocalScores(updatedOnline);
      const onlineRank = updatedOnline.findIndex(e => e.id === newEntry.id) + 1;
      return { entries: updatedOnline, isOnline: true, rank: onlineRank };
    }
  } catch (e) {
    console.warn("[Leaderboard] Envoi en ligne échoué, score sauvegardé localement:", e);
  }

  return { entries: updatedLocal, isOnline: false, rank: localRank };
};

/**
 * Réinitialise le classement vers les benchmarks officiels
 */
export const resetOnlineLeaderboard = async (): Promise<{ entries: LeaderboardEntry[]; isOnline: boolean }> => {
  saveLocalScores(BENCHMARK_SCORES);
  try {
    const res = await fetch(KV_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(BENCHMARK_SCORES)
    });
    if (res.ok) {
      return { entries: BENCHMARK_SCORES, isOnline: true };
    }
  } catch (e) {
    console.warn("[Leaderboard] Échec réinitialisation en ligne:", e);
  }
  return { entries: BENCHMARK_SCORES, isOnline: false };
};
