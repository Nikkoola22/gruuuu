// --- TYPES ---
export interface PodcastEpisode {
  id: number
  title: string
  url: string
  duration?: string
  description?: string
  date?: string
}

// --- ÉPISODES DE PODCAST AVEC URLS ---
export const podcastEpisodes: PodcastEpisode[] = [
  { 
    id: 1, 
    title: "Les informés de franceinfo - 10/09/2025", 
    url: "https://media.radiofrance-podcast.net/podcast09/11548-06.09.2025-ITEMA_24237901-2025F18386S0249-NET_MFI_3E105361-19F3-4A2A-BF6D-1CAB7D05CA24-27.m4a",
    duration: "02:25", 
    description: "La retraite progressive",
    date: "10/09/2025"
  },
  { 
       id: 2, 
    title: "Podcast Naudrh - Arret maladie Baisse a 90%", 
    url: "https://audio.ausha.co/yk4aasqX1w8m.mp3", // Remplacez par votre URL
    duration: "6:45", 
    description: "Baisse de rémunération en cas de congés pour maladie ordinaire (CMO) !",
    date: "19/08/2025"
  },
  { 
    id: 3, 
    title: "Podcast Radio france  - Depense publique stop ou encore ?", 
    url: "https://media.radiofrance-podcast.net/podcast09/24408-05.05.2025-ITEMA_24123940-2025F51881S0125-NET_MFI_2B52238C-DD76-4DED-A1BD-C848BABD1642-27.m4a", // Remplacez par votre URL
    duration: "18:20", 
    description: "Tout savoir sur la depense ",
    date: "18/08/2025"
  },
  { 
    id: 4, 
    title: "Podcast Radio France - Perte d'Attractivite ", 
    url: "https://media.radiofrance-podcast.net/2025/6/3/NET_MFO_f2992cf3-ede2-46ba-a173-110376f3b3f3.mp3", // Remplacez par votre URL
    duration: "25:10", 
    description: "Les opportunités de formation",
    date: "17/08/2025"
  },
  { 
    id: 5,  
    title: "Podcast Citoyen - Les types de prisons", 
url:"https://open.acast.com/public/streams/63f887026c3fc00011d022e2/episodes/6621010d4df82b0013c839a0.mp3", // Remplacez par votre URL
    duration: "20:15", 
    description: "Les types de prisons",
    date: "16/08/2025"
  }
];
