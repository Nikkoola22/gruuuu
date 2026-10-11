/**
 * Connecteur API Albert (DINUM / Etalab) & Pipeline RAG DGAFP
 * Inspiré du projet open-source officiel DGAFP/assistant-rh (Alliance DINUM × DGAFP)
 * https://github.com/DGAFP/assistant-rh
 *
 * Fonctionnalités clés :
 * 1. Interface directe avec l'API Albert souveraine (https://albert.api.etalab.gouv.fr/v1)
 * 2. QueryProcessor : Expansion des acronymes de la Fonction Publique (CGFP, RIFSEEP, CIA, CLM, GVT, NBI...)
 * 3. Triangulation juridique en 3 volets selon le standard DGAFP :
 *    - 1. Règle statutaire & Base légale (CGFP, décrets)
 *    - 2. Procédures et démarches pratiques de gestion
 *    - 3. Références juridiques officielles et traçables
 */

export interface AlbertConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  triangulationDgafp: boolean;
}

export const ALBERT_DEFAULT_BASE_URL = 'https://albert.api.etalab.gouv.fr/v1';
export const ALBERT_DEFAULT_MODEL = 'albert/albert-large';

export const ALBERT_AVAILABLE_MODELS = [
  { id: 'albert/albert-large', label: 'Albert Large (DINUM - Souverain)', description: 'Modèle de référence de l’État français optimisé pour le droit public' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct (DINUM)', description: 'Modèle français rapide et précis' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct', label: 'Llama 3.1 70B (Hébergé DINUM)', description: 'Haute capacité de raisonnement juridique' },
  { id: 'albert/albert-small', label: 'Albert Small (DINUM)', description: 'Faible latence pour questions simples' },
];

const STORAGE_KEY = 'albert_dgafp_config_v1';

export function getAlbertConfig(): AlbertConfig {
  if (typeof window === 'undefined') {
    return {
      apiKey: '',
      baseUrl: ALBERT_DEFAULT_BASE_URL,
      model: ALBERT_DEFAULT_MODEL,
      enabled: true,
      triangulationDgafp: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl || ALBERT_DEFAULT_BASE_URL,
        model: parsed.model || ALBERT_DEFAULT_MODEL,
        enabled: parsed.enabled !== false,
        triangulationDgafp: parsed.triangulationDgafp !== false,
      };
    }
  } catch (e) {
    console.warn('[Albert] Erreur lecture config:', e);
  }

  // Lecture optionnelle des variables d'environnement Vite
  const envKey = (import.meta as any).env?.VITE_ALBERT_API_KEY || '';
  const envUrl = (import.meta as any).env?.VITE_ALBERT_BASE_URL || ALBERT_DEFAULT_BASE_URL;

  return {
    apiKey: envKey,
    baseUrl: envUrl,
    model: ALBERT_DEFAULT_MODEL,
    enabled: true,
    triangulationDgafp: true,
  };
}

export function saveAlbertConfig(updates: Partial<AlbertConfig>): AlbertConfig {
  const current = getAlbertConfig();
  const updated: AlbertConfig = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[Albert] Erreur sauvegarde config:', e);
  }
  return updated;
}

/**
 * Référentiel des Acronymes RH de la Fonction Publique (DGAFP / CGFP)
 * Issu des bases RGRH et DGAFP/assistant-rh
 */
export interface AcronymeRHDef {
  terme: string;
  definition: string;
  articlesCGFP: string;
  decretsAssocies: string;
}

export const DICTIONNAIRE_ACRONYMES_RH: Record<string, AcronymeRHDef> = {
  RIFSEEP: {
    terme: "RIFSEEP",
    definition: "Régime indemnitaire tenant compte des fonctions, des sujétions, de l'expertise et de l'engagement professionnel (composé de l'IFSE et du CIA)",
    articlesCGFP: "Art. L. 714-4 & L. 714-5 du CGFP (principe de parité avec l'État)",
    decretsAssocies: "Décret n° 2014-513 du 20 mai 2014 & Décret n° 91-875 du 6 septembre 1991"
  },
  IFSE: {
    terme: "IFSE",
    definition: "Indemnité de fonctions, de sujétions et d'expertise (part principale et mensuelle du RIFSEEP liée au groupe de fonctions)",
    articlesCGFP: "Art. L. 714-4 du CGFP",
    decretsAssocies: "Décret n° 2014-513 (Art. 2 et 3)"
  },
  CIA: {
    terme: "CIA",
    definition: "Complément indemnitaire annuel (part variable du RIFSEEP valorisant l'engagement et la manière de servir)",
    articlesCGFP: "Art. L. 714-5 du CGFP",
    decretsAssocies: "Décret n° 2014-513 (Art. 4)"
  },
  CGFP: {
    terme: "CGFP",
    definition: "Code général de la fonction publique (ordonnance n° 2021-1574 du 24 novembre 2021 et décrets d'application 2024-2026)",
    articlesCGFP: "Livres Ier à VIII du CGFP",
    decretsAssocies: "Partie législative (L) et réglementaire (R)"
  },
  NBI: {
    terme: "NBI",
    definition: "Nouvelle bonification indiciaire (points d'indice majoré attribués à certains emplois comportant une responsabilité ou technicité particulière)",
    articlesCGFP: "Art. L. 712-2 du CGFP",
    decretsAssocies: "Décret n° 2006-779 du 3 juillet 2006 (FPT)"
  },
  SFT: {
    terme: "SFT",
    definition: "Supplément familial de traitement (prestation versée aux agents ayant au moins un enfant à charge au sens des prestations familiales)",
    articlesCGFP: "Art. L. 712-8 à L. 712-11 du CGFP",
    decretsAssocies: "Décret n° 85-1148 du 24 octobre 1985 (Art. 10 à 12)"
  },
  GVT: {
    terme: "GVT",
    definition: "Glissement Vieillesse Technicité (impact financier de l'avancement d'échelon et de grade des agents sur la masse salariale)",
    articlesCGFP: "Art. L. 522-1 à L. 522-29 du CGFP (carrières et avancements)",
    decretsAssocies: "Statuts particuliers de cadres d'emplois"
  },
  PPCR: {
    terme: "PPCR",
    definition: "Parcours professionnels, carrières et rémunérations (réforme des grilles indiciaires et cadencement unique d'avancement)",
    articlesCGFP: "Art. L. 522-1 et suivants du CGFP",
    decretsAssocies: "Décrets statutaires 2016-2020 de revalorisation indiciaire"
  },
  CLM: {
    terme: "CLM",
    definition: "Congé de longue maladie (3 ans max : 1 an plein traitement, 2 ans demi-traitement pour affection constatée)",
    articlesCGFP: "Art. L. 822-4 à L. 822-5 du CGFP",
    decretsAssocies: "Décret n° 87-602 du 30 juillet 1987 (FPT)"
  },
  CLD: {
    terme: "CLD",
    definition: "Congé de longue durée (5 ans max : 3 ans plein traitement, 2 ans demi-traitement pour 5 affections spécifiques)",
    articlesCGFP: "Art. L. 822-12 à L. 822-17 du CGFP",
    decretsAssocies: "Décret n° 87-602 du 30 juillet 1987 (Art. 28 à 37)"
  },
  CGM: {
    terme: "CGM",
    definition: "Congé de grave maladie (ouvert aux agents contractuels de droit public justifiant d'au moins 3 ans de services)",
    articlesCGFP: "Art. L. 822-18 du CGFP",
    decretsAssocies: "Décret n° 88-145 du 15 février 1988 (Art. 8)"
  },
  CITIS: {
    terme: "CITIS",
    definition: "Congé pour invalidité temporaire imputable au service (accident de service, de trajet ou maladie professionnelle)",
    articlesCGFP: "Art. L. 822-21 à L. 822-25 du CGFP",
    decretsAssocies: "Décret n° 87-602 (Titre VI bis)"
  },
  TPT: {
    terme: "TPT",
    definition: "Temps partiel thérapeutique (permettant la reprise progressive du service après arrêt maladie avec maintien intégral du traitement)",
    articlesCGFP: "Art. L. 823-1 à L. 823-6 du CGFP",
    decretsAssocies: "Décret n° 2021-1462 du 8 novembre 2021"
  },
  CET: {
    terme: "CET",
    definition: "Compte épargne-temps (capitalisation de jours de congés et RTT non pris avec options d'indemnisation ou RAFP)",
    articlesCGFP: "Art. L. 621-4 du CGFP",
    decretsAssocies: "Décret n° 2004-878 du 26 août 2004 (FPT)"
  },
  CAP: {
    terme: "CAP",
    definition: "Commission administrative paritaire (instance consultative pour les décisions individuelles défavorables, licenciement, refus de titularisation)",
    articlesCGFP: "Art. L. 261-1 à L. 261-11 du CGFP",
    decretsAssocies: "Décret n° 89-229 du 17 avril 1989"
  },
  CST: {
    terme: "CST",
    definition: "Comité social territorial (instance de dialogue social sur l'organisation des services, LDG, RSU et conditions de travail)",
    articlesCGFP: "Art. L. 251-1 à L. 251-12 du CGFP",
    decretsAssocies: "Décret n° 2021-571 du 10 mai 2021"
  },
  LDG: {
    terme: "LDG",
    definition: "Lignes directrices de gestion (stratégie pluriannuelle RH de la collectivité pour l'avancement, la mobilité et la promotion interne)",
    articlesCGFP: "Art. L. 413-1 à L. 413-7 du CGFP",
    decretsAssocies: "Décret n° 2019-1265 du 29 novembre 2019"
  },
  RSU: {
    terme: "RSU",
    definition: "Rapport social unique (état des lieux annuel obligatoire des effectifs, rémunérations, santé et sécurité, formation)",
    articlesCGFP: "Art. L. 231-1 à L. 231-4 du CGFP",
    decretsAssocies: "Décret n° 2020-1493 du 30 novembre 2020"
  },
};

/**
 * Analyseur de requête : QueryProcessor DGAFP
 * Détecte les acronymes RH et génère le contexte juridique enrichi
 */
export function expandQueryDgafp(query: string): {
  expandedPrompt: string;
  acronymesDetectes: AcronymeRHDef[];
  estQuestionContractuel: boolean;
  estQuestionTitulaire: boolean;
} {
  const qUpper = query.toUpperCase();
  const acronymesDetectes: AcronymeRHDef[] = [];

  for (const [code, def] of Object.entries(DICTIONNAIRE_ACRONYMES_RH)) {
    // Mot complet
    const regex = new RegExp(`\\b${code}\\b`, 'i');
    if (regex.test(query)) {
      acronymesDetectes.push(def);
    }
  }

  const estQuestionContractuel = /\b(contractuel|contractuelle|cdd|cdi|non[- ]titulaire|vacataire)\b/i.test(query);
  const estQuestionTitulaire = /\b(titulaire|fonctionnaire|stagiaire|concours|cadre d'emplois)\b/i.test(query);

  let expansionNotes = '';
  if (acronymesDetectes.length > 0) {
    expansionNotes = `\n\n[RÉFÉRENTIEL ACRONYMES RH DGAFP DÉTECTÉS] :\n` +
      acronymesDetectes.map(a => `- **${a.terme}** : ${a.definition} (CGFP: ${a.articlesCGFP} | Décrets: ${a.decretsAssocies})`).join('\n');
  }

  let statutNote = '';
  if (estQuestionContractuel) {
    statutNote = `\n[STATUT SPÉCIFIQUE DÉTECTÉ] : Agent contractuel de droit public territorial (mobiliser Décret n° 88-145 du 15 février 1988).`;
  } else if (estQuestionTitulaire) {
    statutNote = `\n[STATUT SPÉCIFIQUE DÉTECTÉ] : Fonctionnaire territorial titulaire ou stagiaire (mobiliser CGFP partie L et R et décrets statutaires FPT).`;
  }

  const expandedPrompt = `${query}${expansionNotes}${statutNote}`;

  return {
    expandedPrompt,
    acronymesDetectes,
    estQuestionContractuel,
    estQuestionTitulaire,
  };
}

/**
 * Formatage du Prompt Système conforme aux spécifications DGAFP/assistant-rh
 */
export function buildDgafpSystemPrompt(): string {
  return `Tu es l'Assistant RH officiel de la Fonction Publique, conçu selon les standards de la DGAFP (Direction générale de l'administration et de la fonction publique) et de la DINUM.
Tu réponds aux questions des agents et des gestionnaires RH avec rigueur, bienveillance et exactitude juridique.

CADRE RÉGLEMENTAIRE APPLICABLE :
- Code général de la fonction publique (CGFP) en vigueur (Partie Législative L. et Réglementaire R.)
- Pour la Fonction Publique Territoriale (FPT / Collectivité de Gennevilliers) : Décret 87-602 (maladie), Décret 88-145 (contractuels), Décret 91-875 (primes), Décret 2021-571 (CST).
- Règlements internes, protocoles d'accord (RIFSEEP, Télétravail, Temps de travail) et délibérations de la Ville de Gennevilliers lorsque précisés.

FORMAT DE RÉPONSE OBLIGATOIRE EN 3 VOLETS (Standard DGAFP) :
Chaque réponse DOIT être articulée rigoureusement selon les 3 volets suivants :

### 1. 📌 Règle statutaire & Base légale
- Énoncer clairement le principe juridique applicable.
- Citer expressément les articles du CGFP (ex: Art. L. 822-4) et décrets d'application.
- Distinguer clairement le cas des fonctionnaires titulaires et des agents contractuels si applicable.

### 2. 📋 Modalités pratiques & Démarches
- Préciser les conditions d'ouverture du droit, pièces justificatives requises et formulaires administratifs.
- Préciser les délais de prévenance ou de recours (ex: transmission du volet d'arrêt sous 48h, saisine du Conseil médical ou CAP).
- Indiquer les conséquences financières (traitement, IFSE, CIA, maintien ou retenue).

### 3. 🔗 Références & Contacts officiels
- Liens ou mentions Légifrance traçables (numéro et date des décrets).
- Fiches de référence Service-Public / guides pratiques DGAFP.
- Mention du service RH de proximité (Direction des Ressources Humaines de la collectivité ou représentants syndicaux).

RÈGLES D'EXCLUSION :
- Ne JAMAIS citer le Code du travail pour un agent public sauf dispositions de renvoi exprès (santé/sécurité L. 811-1 CGFP).
- Ne jamais inventer d'article de loi. En cas de doute, inviter à consulter le gestionnaire de carrière.`;
}

/**
 * Test de connectivité à l'API Albert (DINUM / Etalab)
 */
export async function testAlbertConnection(configOverrides?: Partial<AlbertConfig>): Promise<{
  success: boolean;
  latencyMs?: number;
  message: string;
  models?: string[];
}> {
  const config = { ...getAlbertConfig(), ...configOverrides };
  const startTime = Date.now();

  if (!config.apiKey || config.apiKey.trim() === '') {
    return {
      success: false,
      message: "Clé API Albert manquante. Renseignez votre clé délivrée par la DINUM (albert.api.etalab.gouv.fr) pour interroger le LLM souverain de l'État.",
    };
  }

  try {
    const url = `${config.baseUrl.replace(/\/+$/, '')}/models`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          latencyMs,
          message: "Clé API Albert non reconnue ou expirée (Code 401 Unauthorized).",
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Erreur serveur Albert (${response.status} ${response.statusText}).`,
      };
    }

    const data = await response.json();
    const modelsList: string[] = Array.isArray(data?.data) ? data.data.map((m: any) => m.id) : [];

    return {
      success: true,
      latencyMs,
      models: modelsList,
      message: `Connexion réussie à l'infrastructure souveraine Albert (DINUM) en ${latencyMs} ms.`,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      message: `Impossible de joindre le serveur Albert (${err?.message || 'Erreur réseau/CORS'}). Vérifiez votre connexion.`,
    };
  }
}

/**
 * Appel API Chat Completion vers Albert DINUM
 */
export async function callAlbertAPI(
  messages: Array<{ role: string; content: string }>,
  configOverrides?: Partial<AlbertConfig>
): Promise<string> {
  const config = { ...getAlbertConfig(), ...configOverrides };

  if (!config.apiKey || config.apiKey.trim() === '') {
    throw new Error("Clé API Albert absente.");
  }

  const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const payload = {
    model: config.model || ALBERT_DEFAULT_MODEL,
    messages: [
      { role: 'system', content: buildDgafpSystemPrompt() },
      ...messages,
    ],
    temperature: 0.1, // Rigueur juridique maximale
    max_tokens: 1500,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API Albert DINUM (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error("Réponse vide renvoyée par le modèle Albert.");
  }

  return answer;
}
