import { useState, useEffect, useMemo } from 'react';
import { franceInfoRss } from '../data/rss-data.ts';

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
}

export interface IntercoNewsItem {
  title: string;
  link: string;
  pubDate: string;
  category: string;
  description: string;
  imageUrl?: string;
}

const BASE_URL = import.meta.env.BASE_URL;

const getApiEndpoint = (endpoint: string) => {
  return `/api/${endpoint}`;
};

export const getFallbackIntercoImage = (title = '', category = '', baseUrl = ''): string => {
  const t = (title + ' ' + category).toLowerCase();
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : (baseUrl ? baseUrl + '/' : '');

  // 1. Mobilisation / Grève 5 novembre / Salaires
  if (t.includes('5 novembre') || t.includes('grève') || t.includes('greve') || t.includes('mobilisation') || t.includes('préavis') || t.includes('preavis')) {
    return `${cleanBase}interco/actu-greve-5nov.svg`;
  }
  // 2. CFDT Police / Sécurité intérieure
  if (t.includes('police') || t.includes('sécurité') || t.includes('securite') || t.includes('gardien')) {
    return `${cleanBase}interco/actu-cfdt-police.svg`;
  }
  // 3. Soutien mairies / collectivités territoriales / violences
  if (t.includes('dégradation') || t.includes('degradation') || t.includes('violence') || t.includes('soutien') || t.includes('collectivité') || t.includes('mairie') || t.includes('hôtel de ville')) {
    return `${cleanBase}interco/actu-soutien-collectivites.svg`;
  }
  // 4. Jeunesse / Lycéens / Éducation
  if (t.includes('lycéen') || t.includes('lyceen') || t.includes('jeune') || t.includes('jeunesse') || t.includes('étude') || t.includes('etude') || t.includes('école')) {
    return `${cleanBase}interco/actu-jeunesse-lyceens.svg`;
  }
  // 5. PJJ / Protection judiciaire / Milieu ouvert
  if (t.includes('pjj') || t.includes('protection judiciaire') || t.includes('mineur') || t.includes('placement')) {
    return `${cleanBase}interco/actu-csa-pjj-octobre.svg`;
  }
  // 6. Préfectures / PSC / Protection sociale complémentaire / FPE
  if (t.includes('préfecture') || t.includes('prefecture') || t.includes('psc') || t.includes('complémentaire') || t.includes('intérieur')) {
    return `${cleanBase}interco/actu-prefectures-psc.svg`;
  }
  // 7. Égalité / Santé au travail / Femmes
  if (t.includes('égalité') || t.includes('egalite') || t.includes('femme') || t.includes('8 mars') || t.includes('santé') || t.includes('sante') || t.includes('transparence salariale')) {
    return `${cleanBase}interco/actu-egalite-sante.svg`;
  }
  // 8. CNFPT / Formation
  if (t.includes('cnfpt') || t.includes('formation')) {
    return `${cleanBase}interco/actu-cnfpt-formation.svg`;
  }
  // 9. Justice / Magistrats / Greffes
  if (t.includes('magistrat') || t.includes('justice') || t.includes('tribunal') || t.includes('juger')) {
    return `${cleanBase}interco/actu-justice-magistrats.svg`;
  }

  const list = [
    'interco/actu-greve-5nov.svg',
    'interco/actu-cfdt-police.svg',
    'interco/actu-soutien-collectivites.svg',
    'interco/actu-jeunesse-lyceens.svg',
    'interco/actu-csa-pjj-octobre.svg',
    'interco/actu-prefectures-psc.svg',
    'interco/actu-egalite-sante.svg'
  ];
  const idx = Math.abs((title || '').length) % list.length;
  return `${cleanBase}${list[idx]}`;
};

export const FALLBACK_INTERCO_NEWS: IntercoNewsItem[] = [
  {
    title: "Appel à la grève et mobilisation du 5 novembre 2026 : salaires et moyens pour les services publics",
    link: "https://interco.cfdt.fr/appel-a-la-greve-et-mobilisation-du-5-novembre-2026/",
    pubDate: "2026-10-24T08:00:00.000Z",
    category: "Fonction Publique",
    description: "Préavis UFFA-CFDT couvrant les 3 versants de la fonction publique pour exiger des mesures salariales générales et du pouvoir d'achat.",
    imageUrl: `${BASE_URL}interco/actu-greve-5nov.svg`
  },
  {
    title: "Création du syndicat CFDT Police au sein de la fédération CFDT Interco",
    link: "https://interco.cfdt.fr/creation-du-syndicat-cfdt-police/",
    pubDate: "2026-10-20T10:30:00.000Z",
    category: "Police & Intérieur",
    description: "La fédération officialise le retour et l'ancrage de la CFDT dans la police nationale pour défendre les agents de terrain.",
    imageUrl: `${BASE_URL}interco/actu-cfdt-police.svg`
  },
  {
    title: "Dégradations et violences urbaines : soutien total aux agents des collectivités et services publics",
    link: "https://interco.cfdt.fr/soutien-agents-collectivites-violences-urbaines/",
    pubDate: "2026-10-16T14:15:00.000Z",
    category: "Territoriale & Mairies",
    description: "Condamnation ferme des saccages dans les mairies et solidarité pleine avec les collègues territoriaux en première ligne.",
    imageUrl: `${BASE_URL}interco/actu-soutien-collectivites.svg`
  },
  {
    title: "Soutien aux revendications pour l'éducation et les conditions d'études des jeunes",
    link: "https://interco.cfdt.fr/soutien-revendications-lyceennes/",
    pubDate: "2026-10-12T09:00:00.000Z",
    category: "Jeunesse & Avenir",
    description: "Prise de position de la CFDT Interco soutenant l'expression pacifique des jeunes et leurs légitimes attentes d'avenir.",
    imageUrl: `${BASE_URL}interco/actu-jeunesse-lyceens.svg`
  },
  {
    title: "Déclaration au CSA PJJ : alerte sur la forte tension et le manque de moyens des équipes",
    link: "https://interco.cfdt.fr/declaration-csa-pjj-octobre-2026/",
    pubDate: "2026-10-06T11:00:00.000Z",
    category: "Protection Judiciaire",
    description: "La CFDT alerte solennellement sur l'épuisement des personnels et exige des recrutements pérennes en milieu ouvert.",
    imageUrl: `${BASE_URL}interco/actu-csa-pjj-octobre.svg`
  },
  {
    title: "Conditions de travail et PSC en préfectures : la CFDT exige des garanties concrètes",
    link: "https://interco.cfdt.fr/conditions-travail-psc-prefectures/",
    pubDate: "2026-09-28T16:00:00.000Z",
    category: "Préfectures & FPE",
    description: "Négociations statutaires : la CFDT porte la voix des agents de préfecture sur la complémentaire santé et la charge de travail.",
    imageUrl: `${BASE_URL}interco/actu-prefectures-psc.svg`
  },
  {
    title: "Égalité professionnelle : transparence salariale et santé au travail",
    link: "https://interco.cfdt.fr/egalite-professionnelle-transparence-salariale/",
    pubDate: "2026-09-18T08:30:00.000Z",
    category: "Égalité & Santé",
    description: "Plan d'action syndical pour supprimer les écarts de rémunération et intégrer les enjeux de santé spécifiques aux agentes.",
    imageUrl: `${BASE_URL}interco/actu-egalite-sante.svg`
  }
];

export const FALLBACK_FP_NEWS: IntercoNewsItem[] = [
  {
    title: "Masse salariale : l'heure des choix dans les collectivités",
    link: "https://www.lettreducadre.fr/article/masse-salariale-l-heure-des-choix.55534",
    pubDate: "2026-07-10T08:00:00.000Z",
    category: "Ressources & Gestion",
    description: "Contraintes budgétaires, arbitrages RH et pilotage de la masse salariale territoriale.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/5/2/6/000032625_210x140_c.jpeg"
  },
  {
    title: "Absentéisme : l’usure professionnelle a changé de visage",
    link: "https://www.lettreducadre.fr/article/absenteisme-l-usure-professionnelle-a-change-de-visage.55537",
    pubDate: "2026-07-10T06:00:00.000Z",
    category: "Santé au travail",
    description: "Nouveaux facteurs d'usure, santé mentale et démarches de prévention pour les agents publics.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/1/2/6/000032621_210x140_c.jpeg"
  },
  {
    title: "L'absurdité invisible des grilles salariales",
    link: "https://www.lettreducadre.fr/article/l-absurdite-invisible-des-grilles-salariales.55535",
    pubDate: "2026-07-10T06:00:00.000Z",
    category: "Salaire & Primes",
    description: "Tassement des grilles, perte de repères d'avancement et défis d'attractivité de la territoriale.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/2/2/6/000032622_210x140_c.jpeg"
  },
  {
    title: "Reclassement : sortir de la gestion de crise",
    link: "https://www.lettreducadre.fr/article/reclassement-sortir-de-la-gestion-de-crise.55533",
    pubDate: "2026-07-10T06:00:00.000Z",
    category: "Carrière & Mobilité",
    description: "Accompagnement des agents inaptes, reconversion et sécurisation des parcours professionnels.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/3/2/6/000032623_210x140_c.jpeg"
  },
  {
    title: "8 chantiers RH prioritaires pour la fonction publique territoriale",
    link: "https://www.lettreducadre.fr/article/8-chantiers-rh-pour-la-territoriale.55532",
    pubDate: "2026-07-10T06:00:00.000Z",
    category: "Ressources RH",
    description: "Panorama des transformations majeures : management, attractivité, formation et conditions de travail.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/9/1/6/000032619_210x140_c.jpeg"
  },
  {
    title: "Rémunération : la FPT au bout du rouleau",
    link: "https://www.lettreducadre.fr/article/remuneration-la-fpt-au-bout-du-rouleau.55529",
    pubDate: "2026-07-08T06:00:00.000Z",
    category: "Salaire & Primes",
    description: "Grilles indiciaires décrochées, RIFSEEP au plafond et tensions salariales persistantes.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/0/2/6/000032620_210x140_c.jpeg"
  },
  {
    title: "Comment accompagner un agent bipolaire au sein de son équipe ?",
    link: "https://www.lettreducadre.fr/article/comment-accompagner-un-agent-bipolaire-au-sein-de-son-equipe.55515",
    pubDate: "2026-06-17T08:11:00.000Z",
    category: "Santé au travail",
    description: "Conseils pratiques et dialogue managérial face aux handicaps invisibles en collectivité.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/7/9/5/000032597_210x140_c.jpeg"
  },
  {
    title: "Une fresque pour parler de santé mentale au travail",
    link: "https://www.lettreducadre.fr/article/une-fresque-pour-parler-de-sante-mentale-au-travail.55522",
    pubDate: "2026-06-26T09:26:00.000Z",
    category: "Santé au travail",
    description: "Sensibilisation des managers et formation aux premiers secours en santé mentale.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/4/0/6/000032604_210x140_c.jpeg"
  },
  {
    title: "La Cour des comptes acte une mutation durable de la place des contractuels",
    link: "https://www.lettreducadre.fr/article/la-cour-des-comptes-acte-une-mutation-durable-de-la-place-des-contractuels-dans-la-territoriale.55517",
    pubDate: "2026-06-19T12:23:00.000Z",
    category: "Statut & Contrats",
    description: "L'irruption en masse des contractuels et les préconisations de la Cour des comptes.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/9/9/5/000032599_210x140_c.jpeg"
  },
  {
    title: "Ce qui change dans le statut des administrateurs territoriaux et emplois de direction",
    link: "https://www.lettreducadre.fr/article/ce-qui-change-dans-le-statut-des-administrateurs-territoriaux-et-emplois-de-direction.55528",
    pubDate: "2026-07-06T06:00:00.000Z",
    category: "Statut",
    description: "Transposition de la réforme de la haute fonction publique d'État à la territoriale.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/5/1/6/000032615_210x140_c.jpeg"
  },
  {
    title: "Charge de travail des cadres : retour d'expérience et leviers d'action",
    link: "https://www.lettreducadre.fr/article/comment-rennes-a-planche-sur-la-charge-de-travail-de-ses-cadres-et-mis-au-jour-leurs-irritants-du-quotidien.55073",
    pubDate: "2026-05-14T10:01:00.000Z",
    category: "Management",
    description: "Identifier et gommer les irritants du quotidien pour les cadres territoriaux.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/7/3/0/000032037_210x140_c.jpeg"
  },
  {
    title: "La smicardisation en marche des agents publics",
    link: "https://www.lettreducadre.fr/article/la-smicardisation-en-marche-des-agents-publics.55495",
    pubDate: "2026-06-04T06:00:00.000Z",
    category: "Salaire & Primes",
    description: "L'impact de la revalorisation du SMIC sur l'échelle indiciaire de la fonction publique.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/4/8/5/000032584_210x140_c.jpeg"
  },
  {
    title: "Douze conseils pour une fin de carrière (presque) sereine…",
    link: "https://www.lettreducadre.fr/article/douze-conseils-pour-une-fin-de-carriere-presque-sereine.55343",
    pubDate: "2026-01-22T06:00:00.000Z",
    category: "Carrière",
    description: "Anticiper et réussir sa seconde partie de carrière professionnelle.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/0/7/3/000032370_210x140_c.jpeg"
  },
  {
    title: "La décroissance démographique, une question taboue pour les territoires",
    link: "https://www.lettreducadre.fr/article/la-decroissance-demographique-une-question-largement-taboue.55474",
    pubDate: "2026-05-19T06:01:00.000Z",
    category: "Territoires",
    description: "Nouvelle ère démographique et défis d'organisation pour les services publics territoriaux.",
    imageUrl: "https://www.lettreducadre.fr/mediatheque/3/5/5/000032553_210x140_c.jpeg"
  }
];

export function useNewsFeeds() {
  const [rssItems, setRssItems] = useState<RssItem[]>([]);
  const [rssLoading, setRssLoading] = useState(true);

  const [intercoNews, setIntercoNews] = useState<IntercoNewsItem[]>([]);
  const [intercoLoading, setIntercoLoading] = useState(true);

  const [fpNews, setFpNews] = useState<IntercoNewsItem[]>([]);
  const [fpLoading, setFpLoading] = useState(true);

  const fallbackInterco = useMemo(() => FALLBACK_INTERCO_NEWS, []);
  const fallbackFp = useMemo(() => FALLBACK_FP_NEWS, []);

  // 1. General RSS
  useEffect(() => {
    let isMounted = true;
    const fetchRssFeeds = async () => {
      try {
        setRssLoading(true);
        if (BASE_URL !== '/') {
          if (isMounted) {
            setRssItems(franceInfoRss);
            setRssLoading(false);
          }
          return;
        }

        const apiUrl = getApiEndpoint('rss');
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
        const data = await response.json();
        const items = data.items || [];

        if (isMounted) {
          if (items.length > 0) {
            const formattedItems = items.slice(0, 5).map((item: { title?: string; link?: string; pubDate?: string }) => ({
              title: (item.title || '').replace(/^•\s*/, '').trim(),
              link: item.link || '#',
              pubDate: item.pubDate || new Date().toISOString(),
            }));
            setRssItems(formattedItems);
          } else {
            setRssItems(franceInfoRss);
          }
        }
      } catch {
        if (isMounted) setRssItems(franceInfoRss);
      } finally {
        if (isMounted) setRssLoading(false);
      }
    };

    fetchRssFeeds();
    const interval = setInterval(fetchRssFeeds, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. CFDT Interco News
  useEffect(() => {
    let isMounted = true;
        const fetchIntercoNews = async () => {
      try {
        setIntercoLoading(true);
        let items: IntercoNewsItem[] = [];

        // 1. Tentative API serveur locale (si Express est actif)
        try {
          const apiUrl = getApiEndpoint('interco-rss');
          const response = await fetch(apiUrl, { signal: AbortSignal.timeout(3000) });
          if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
              items = data.items;
            }
          }
        } catch {
          // Ignorer et passer aux sources directes du navigateur
        }

        // 2. Si non disponible, tentative directe via passerelle RSS/JSON sécurisée
        if (items.length === 0) {
          try {
            const rssGateways = [
              'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Finterco.cfdt.fr%2Factualites%2Ffeed%2F',
              'https://api.allorigins.win/get?url=' + encodeURIComponent('https://interco.cfdt.fr/actualites/feed/')
            ];

            for (const gw of rssGateways) {
              try {
                const res = await fetch(gw, { signal: AbortSignal.timeout(4000) });
                if (res.ok) {
                  const json = await res.json();
                  if (json.items && json.items.length > 0) {
                    items = json.items.map((it: { title?: string; link?: string; pubDate?: string; categories?: string[]; description?: string; thumbnail?: string; enclosure?: { link?: string } }) => {
                      const cleanTitle = (it.title || '').replace(/^•\s*/, '').trim();
                      const category = (it.categories && it.categories[0]) || 'Actu Interco';
                      const img = it.thumbnail || it.enclosure?.link || getFallbackIntercoImage(cleanTitle, category, BASE_URL);
                      return {
                        title: cleanTitle,
                        link: it.link || 'https://interco.cfdt.fr/actualites/',
                        pubDate: it.pubDate || new Date().toISOString(),
                        category,
                        description: (it.description || '').replace(/<[^>]*>/g, '').trim().substring(0, 160),
                        imageUrl: img
                      };
                    });
                    break;
                  }
                }
              } catch {
                // Continuer vers le fallback
              }
            }
          } catch {
            // Passer au fallback
          }
        }

        // 3. Application des articles trouvés ou du fallback à jour
        if (isMounted) {
          if (items.length > 0) {
            const enriched = items.map(item => ({
              ...item,
              title: item.title.replace(/^•\s*/, '').trim(),
              imageUrl: item.imageUrl && !item.imageUrl.includes('logo-cfdt') 
                ? item.imageUrl 
                : getFallbackIntercoImage(item.title, item.category, BASE_URL)
            }));
            setIntercoNews(enriched);
          } else {
            setIntercoNews(fallbackInterco);
          }
        }
      } catch {
        if (isMounted) setIntercoNews(fallbackInterco);
      } finally {
        if (isMounted) setIntercoLoading(false);
      }
    };

    fetchIntercoNews();
    const interval = setInterval(fetchIntercoNews, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fallbackInterco]);

  // 3. FP News (Lettre du Cadre & AMF)
  useEffect(() => {
    let isMounted = true;
    const fetchFpNews = async () => {
      try {
        setFpLoading(true);
        const apiUrl = getApiEndpoint('fp-rss');
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
        const data = await response.json();
        if (isMounted) {
          setFpNews(data.items && data.items.length > 0 ? data.items : fallbackFp);
        }
      } catch {
        if (isMounted) setFpNews(fallbackFp);
      } finally {
        if (isMounted) setFpLoading(false);
      }
    };

    fetchFpNews();
    const interval = setInterval(fetchFpNews, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fallbackFp]);

  return {
    rssItems,
    rssLoading,
    intercoNews,
    intercoLoading,
    fpNews,
    fpLoading,
  };
}
