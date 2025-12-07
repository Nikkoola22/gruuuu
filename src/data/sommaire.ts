/**
 * SOMMAIRE UNIFIÉ - Index léger pour la recherche en 2 étapes
 * 
 * Ce fichier contient uniquement les titres et mots-clés de chaque section
 * des documents internes (temps.ts, formation.ts, teletravail.ts).
 * 
 * Stratégie :
 * 1. L'API interroge ce sommaire léger (~500 tokens) pour identifier OÙ se trouve la réponse
 * 2. Une fois la section identifiée, on charge uniquement le texte pertinent du bon fichier
 * 
 * Économie : ~90% de tokens en moins par requête
 */

export interface SectionIndex {
  id: string;
  titre: string;
  motsCles: string[];
  source: 'temps' | 'formation' | 'teletravail';
  chapitre?: number;
  resume?: string;
}

export const sommaireUnifie: SectionIndex[] = [
  // ============================================
  // TEMPS DE TRAVAIL (temps.ts - chapitres 1-4)
  // ============================================
  {
    id: 'temps_ch1_definition',
    titre: 'Définition du temps de travail',
    motsCles: ['temps de travail', 'travail effectif', '1607h', 'durée légale', 'jours travaillés', 'solidarité'],
    source: 'temps',
    chapitre: 1,
    resume: 'Définition légale du temps de travail, calcul des 1607h annuelles, journée de solidarité'
  },
  {
    id: 'temps_ch1_durees',
    titre: 'Durées et cycles de travail',
    motsCles: ['37h', '38h', '39h', 'cycle hebdomadaire', 'annualisation', 'JNT', 'crèches'],
    source: 'temps',
    chapitre: 1,
    resume: 'Cycles de travail (37h, 37.5h, 38h, 39h), annualisation, jours non travaillés'
  },
  {
    id: 'temps_ch1_plages',
    titre: 'Plages fixes et plages de souplesse',
    motsCles: ['plages fixes', 'plages souplesse', 'horaires variables', 'flexibilité', 'pause méridienne', '9h30', '16h30'],
    source: 'temps',
    chapitre: 1,
    resume: 'Horaires de présence obligatoire (9h30-12h, 14h-16h30) et plages de souplesse'
  },
  {
    id: 'temps_ch1_heures_sup',
    titre: 'Heures supplémentaires et complémentaires',
    motsCles: ['heures supplémentaires', 'heures complémentaires', 'majoration', '25%', '27%', 'récupération', 'nuit', 'dimanche'],
    source: 'temps',
    chapitre: 1,
    resume: 'Heures sup majorées 25%/27%, max 25h/mois, récupération ou indemnisation'
  },
  {
    id: 'temps_ch1_temps_partiel',
    titre: 'Temps partiel',
    motsCles: ['temps partiel', '50%', '60%', '70%', '80%', '90%', 'droit', 'autorisation', 'rémunération', 'retraite'],
    source: 'temps',
    chapitre: 1,
    resume: 'Temps partiel de droit (enfant, handicap) ou sur autorisation, quotités 50-90%'
  },
  {
    id: 'temps_ch2_conges_annuels',
    titre: 'Congés annuels',
    motsCles: ['congés annuels', 'congé annuel', 'congés', 'vacances', '25 jours', 'CA', 'planning', 'estivaux', 'report'],
    source: 'temps',
    chapitre: 2,
    resume: '25 jours ouvrés/an, règles de pose, priorités, report exceptionnel'
  },
  {
    id: 'temps_ch2_rtt',
    titre: 'Jours RTT / ARTT',
    motsCles: ['RTT', 'ARTT', 'réduction temps travail', '12 jours', '15 jours', '18 jours', '23 jours', 'maladie'],
    source: 'temps',
    chapitre: 2,
    resume: 'RTT selon cycle (12j à 37h, 15j à 37.5h, 18j à 38h, 23j à 39h), déduction si maladie'
  },
  {
    id: 'temps_ch2_naissance',
    titre: 'Congés maternité et paternité',
    motsCles: ['maternité', 'paternité', 'naissance', 'accouchement', 'grossesse', '16 semaines', '25 jours'],
    source: 'temps',
    chapitre: 2,
    resume: 'Maternité 16 semaines, paternité 25 jours calendaires'
  },
  {
    id: 'temps_ch3_garde_enfant',
    titre: 'Garde d\'enfant malade',
    motsCles: ['garde enfant', 'enfant malade', 'nourrice', 'école fermée', '6 jours', '16 ans', 'grève'],
    source: 'temps',
    chapitre: 3,
    resume: '6 jours/an (doublés si parent seul), jusqu\'aux 16 ans de l\'enfant'
  },
  {
    id: 'temps_ch3_deces',
    titre: 'Décès d\'un membre de la famille',
    motsCles: ['décès', 'obsèques', 'deuil', 'conjoint', 'parent', 'enfant', '5 jours', '14 jours'],
    source: 'temps',
    chapitre: 3,
    resume: '5j conjoint/parents, 14j enfant <25 ans, 3j grands-parents/frères/soeurs'
  },
  {
    id: 'temps_ch3_mariage',
    titre: 'Mariage ou PACS',
    motsCles: ['mariage', 'PACS', 'union', 'cérémonie', '7 jours', '3 jours', '1 jour'],
    source: 'temps',
    chapitre: 3,
    resume: '7 jours pour l\'agent, 3 jours pour enfant, 1 jour pour autres proches'
  },
  {
    id: 'temps_ch4_maladie',
    titre: 'Congé maladie',
    motsCles: ['maladie', 'arrêt', 'carence', '48h', 'contrôle', 'contre-visite', 'CMO'],
    source: 'temps',
    chapitre: 4,
    resume: 'Transmission sous 48h, 1 jour de carence, contre-visite possible'
  },

  // ============================================
  // FORMATION (formation.ts)
  // ============================================
  {
    id: 'formation_cpf',
    titre: 'Compte Personnel de Formation (CPF)',
    motsCles: ['CPF', 'compte formation', 'heures', '25 heures', '150 heures', 'diplôme', 'certification'],
    source: 'formation',
    resume: '25h/an (plafond 150h), formations diplômantes ou certifiantes'
  },
  {
    id: 'formation_conge_pro',
    titre: 'Congé de formation professionnelle',
    motsCles: ['congé formation', '3 ans', '85%', 'traitement', 'projet professionnel'],
    source: 'formation',
    resume: 'Max 3 ans sur carrière, rémunéré 85% la 1ère année'
  },
  {
    id: 'formation_vae',
    titre: 'Validation des Acquis de l\'Expérience (VAE)',
    motsCles: ['VAE', 'validation acquis', 'expérience', 'diplôme', '24 heures'],
    source: 'formation',
    resume: '24h de congé pour obtenir un diplôme via expérience'
  },
  {
    id: 'formation_bilan',
    titre: 'Bilan de compétences',
    motsCles: ['bilan compétences', '24 heures', 'projet professionnel', 'reconversion'],
    source: 'formation',
    resume: '24h tous les 5 ans'
  },

  // ============================================
  // TÉLÉTRAVAIL (teletravail.ts)
  // ============================================
  {
    id: 'teletravail_principes',
    titre: 'Principes du télétravail',
    motsCles: ['télétravail', 'principes', 'volontariat', 'réversibilité', 'confiance', 'déconnexion'],
    source: 'teletravail',
    resume: 'Volontaire, réversible, droit à la déconnexion'
  },
  {
    id: 'teletravail_quotite',
    titre: 'Quotité et forfait télétravail',
    motsCles: ['forfait', 'jours télétravail', '15 jours', '1 jour par semaine', '3 jours par mois', 'quotité', 'annuel'],
    source: 'teletravail',
    resume: '1 jour fixe/semaine + forfait 15 jours/an (max 3j/mois), présence obligatoire 3j/semaine'
  },
  {
    id: 'teletravail_demijournee',
    titre: 'Demi-journée télétravail',
    motsCles: ['demi-journée', 'demie journée', 'pas autorisé', 'interdit', 'journée complète'],
    source: 'teletravail',
    resume: 'Le télétravail n\'est pas autorisé pour une demi-journée'
  },
  {
    id: 'teletravail_presence',
    titre: 'Présence obligatoire sur site',
    motsCles: ['présence', 'site', 'obligatoire', '3 jours', 'minimum', 'semaine'],
    source: 'teletravail',
    resume: 'La présence de l\'agent sur site est obligatoire 3 jours par semaine'
  },
  {
    id: 'teletravail_demande',
    titre: 'Procédure de demande télétravail',
    motsCles: ['demande', 'formulaire', 'autorisation', 'refus', 'entretien', 'CAP'],
    source: 'teletravail',
    resume: 'Demande écrite, entretien préalable, refus motivé contestable en CAP'
  }
];

/**
 * Fonction utilitaire pour rechercher dans le sommaire
 * Retourne les sections les plus pertinentes pour une question donnée
 */
export function rechercherDansSommaire(question: string, maxResults = 3): SectionIndex[] {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const scored = sommaireUnifie.map(section => {
    let score = 0;
    
    // Vérifier les mots-clés
    for (const motCle of section.motsCles) {
      const mcNorm = motCle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q.includes(mcNorm)) {
        score += 10;
      }
      const mots = mcNorm.split(' ');
      for (const mot of mots) {
        if (mot.length > 3 && q.includes(mot)) {
          score += 3;
        }
      }
    }
    
    // Vérifier le titre
    const titreNorm = section.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (q.includes(titreNorm)) {
      score += 15;
    }
    for (const mot of titreNorm.split(' ')) {
      if (mot.length > 3 && q.includes(mot)) {
        score += 2;
      }
    }
    
    return { section, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.section);
}
