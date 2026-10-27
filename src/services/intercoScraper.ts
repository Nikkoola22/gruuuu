import type { IntercoNewsItem } from '../hooks/useNewsFeeds.ts';
import { getFallbackIntercoImage } from '../hooks/useNewsFeeds.ts';

const CACHE_KEY = 'cfdt_interco_scraped_9_cards_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes de cache

interface CacheData {
  timestamp: number;
  items: IntercoNewsItem[];
}

/**
 * Scrape les 9 cartes d'actualités réelles depuis https://interco.cfdt.fr/actualites/
 * Exécuté au démarrage de l'application ATLAS.
 */
export async function scrapeInterco9Cards(baseUrl = ''): Promise<IntercoNewsItem[]> {
  // 1. Vérification du cache local instantané
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CacheData = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.items) && parsed.items.length >= 9) {
        console.log(`[ATLAS Scraper] ⚡ 9 cartes CFDT Interco chargées depuis le cache (${Math.round((Date.now() - parsed.timestamp)/1000)}s)`);
        return parsed.items.slice(0, 9);
      }
    }
  } catch {
    // Continuer vers le scraping direct
  }

  const targetUrl = 'https://interco.cfdt.fr/actualites/';
  console.log(`[ATLAS Scraper] 🚀 Lancement du scraping en direct des 9 cartes CFDT Interco...`);

  // Proxies CORS pour récupérer le HTML complet de la page
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
  ];

  let rawHtml = '';

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        if (proxyUrl.includes('allorigins')) {
          const json = await res.json();
          rawHtml = json.contents || '';
        } else {
          rawHtml = await res.text();
        }
        if (rawHtml && rawHtml.length > 500) {
          console.log(`[ATLAS Scraper] ✅ HTML récupéré via proxy (${rawHtml.length} octets)`);
          break;
        }
      }
    } catch {
      // Tenter le proxy suivant
    }
  }

  // Si on a du HTML, on utilise le DOMParser natif du navigateur pour extraire les 9 cartes
  if (rawHtml && typeof window !== 'undefined' && 'DOMParser' in window) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Sélecteurs classiques WordPress / Elementor / thèmes syndicaux
      const cardElements = Array.from(
        doc.querySelectorAll(
          'article, .post, .card, .entry, .elementor-post, .item-article, div[class*="actu"], div[class*="article"]'
        )
      );

      const scrapedCards: IntercoNewsItem[] = [];
      const seenTitles = new Set<string>();

      for (const el of cardElements) {
        if (scrapedCards.length >= 9) break;

        // 1. Titre et Lien
        const linkEl = (el.querySelector('h2 a, h3 a, h4 a, .entry-title a, a.card-title, a[href*="interco.cfdt.fr/"]') ||
          el.querySelector('a')) as HTMLAnchorElement | null;
        if (!linkEl) continue;

        const rawTitle = (linkEl.textContent || '').replace(/^•\s*/, '').trim();
        if (!rawTitle || rawTitle.length < 8 || seenTitles.has(rawTitle.toLowerCase())) continue;
        seenTitles.add(rawTitle.toLowerCase());

        let link = linkEl.getAttribute('href') || 'https://interco.cfdt.fr/actualites/';
        if (link.startsWith('/')) link = `https://interco.cfdt.fr${link}`;

        // 2. Image
        const imgEl = el.querySelector('img') as HTMLImageElement | null;
        let imageUrl: string | undefined = undefined;
        if (imgEl) {
          imageUrl = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || undefined;
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = `https://interco.cfdt.fr${imageUrl}`;
          }
        }
        // Background-image fallback
        if (!imageUrl) {
          const bgDiv = el.querySelector('[style*="background-image"]') as HTMLElement | null;
          if (bgDiv) {
            const m = bgDiv.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (m && m[1]) imageUrl = m[1];
          }
        }

        // 3. Catégorie / Badge
        const catEl = el.querySelector('.category, .cat-links, .badge, .post-category, [class*="tag"], [class*="badge"]');
        const category = (catEl?.textContent || 'Actu générale').trim();

        // 4. Description / Extrait
        const descEl = el.querySelector('.entry-summary, .post-excerpt, p, .description');
        const description = (descEl?.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 150);

        // 5. Date
        const timeEl = el.querySelector('time, .date, .post-date, [class*="date"]');
        const pubDate = timeEl?.getAttribute('datetime') || timeEl?.textContent?.trim() || new Date().toISOString();

        // Si pas d'image extraite, attribution d'une belle image officielle
        const finalImg = imageUrl && !imageUrl.includes('logo-cfdt') 
          ? imageUrl 
          : getFallbackIntercoImage(rawTitle, category, baseUrl);

        scrapedCards.push({
          title: rawTitle,
          link,
          pubDate,
          category,
          description,
          imageUrl: finalImg
        });
      }

      if (scrapedCards.length >= 3) {
        console.log(`[ATLAS Scraper] 🎯 ${scrapedCards.length} cartes scrapées avec succès en direct !`);
        // Mise en cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items: scrapedCards }));
        } catch {
          // Ignorer si localStorage plein
        }
        return scrapedCards.slice(0, 9);
      }
    } catch (parseErr) {
      console.warn('[ATLAS Scraper] Erreur parsing DOM:', parseErr);
    }
  }

  // 3. Passerelle alternative RSS vers JSON si le HTML direct est bloqué
  try {
    const rssJsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://interco.cfdt.fr/actualites/feed/');
    const res = await fetch(rssJsonUrl, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        const fromRss: IntercoNewsItem[] = data.items.slice(0, 9).map((it: any) => {
          const title = (it.title || '').replace(/^•\s*/, '').trim();
          const category = (it.categories && it.categories[0]) || 'Actu générale';
          const img = it.thumbnail || it.enclosure?.link || getFallbackIntercoImage(title, category, baseUrl);
          return {
            title,
            link: it.link || 'https://interco.cfdt.fr/actualites/',
            pubDate: it.pubDate || new Date().toISOString(),
            category,
            description: (it.description || '').replace(/<[^>]*>/g, '').trim().substring(0, 150),
            imageUrl: img
          };
        });

        console.log(`[ATLAS Scraper] 📡 ${fromRss.length} cartes récupérées via flux RSS officiel`);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items: fromRss }));
        } catch {}
        return fromRss.slice(0, 9);
      }
    }
  } catch {
    // Passer au fallback certifié
  }

  // 4. Si hors-ligne ou réseau restreint : retour des 9 cartes certifiées officielles
  return [];
}
