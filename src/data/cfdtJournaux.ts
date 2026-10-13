export interface CFDTJournal {
  id: string;
  title: string;
  subtitle: string;
  season: 'Rentrée' | 'Printemps' | 'Hiver' | 'Automne' | 'Été' | 'Spécial';
  year: number;
  filename: string;
  url: string;
  badge: string;
  tabLabel: string;
  dateParution: string;
  pages?: number;
  fileSize: string;
  isLatest?: boolean;
  themes: string[];
  coverImage: string;
  description: string;
}

export const CFDT_JOURNAUX_BASE_URL =
  'https://intranet.ville-gennevilliers.fr/Statics/media/syndicats/cfdt/journaux/';

export const CFDT_JOURNAUX: CFDTJournal[] = [
  {
    id: 'rentree-2026',
    title: 'Journal CFDT Gennevilliers',
    subtitle: 'Écho des agents & grand dossier de rentrée municipale',
    season: 'Rentrée',
    year: 2026,
    filename: 'Journal-Gennevilliers-rentree-2026.pdf',
    url: `${CFDT_JOURNAUX_BASE_URL}Journal-Gennevilliers-rentree-2026.pdf`,
    badge: 'Rentrée 2026',
    tabLabel: 'Rentrée 2026',
    dateParution: 'Septembre 2026',
    pages: 32,
    fileSize: '1.28 Mo',
    isLatest: true,
    themes: [
      'RIFSEEP & Revalorisations',
      'Protocole Temps de travail',
      'Conditions de travail & Santé',
      'Actualités territoriales',
    ],
    coverImage: 'journal-rentree-2026.png',
    description:
      'Dossier complet sur les négociations locales, le pouvoir d\'achat des agents de Gennevilliers et les points de vigilance sur les carrières.',
  },
  {
    id: 'printemps-2026',
    title: 'Journal CFDT Gennevilliers',
    subtitle: 'Nouveau mandat, c\'est le temps du chamboule tout ?...',
    season: 'Printemps',
    year: 2026,
    filename: 'journal-gennevilliers-printemps-2026.pdf',
    url: `${CFDT_JOURNAUX_BASE_URL}journal-gennevilliers-printemps-2026.pdf`,
    badge: 'Printemps 2026',
    tabLabel: 'Printemps 2026',
    dateParution: 'Printemps 2026',
    pages: 28,
    fileSize: '1.19 Mo',
    themes: [
      'Édito : Chamboule tout ?',
      'Mise en disponibilité',
      'Avancement Cat B',
      'PSC & Taux CNRACL',
    ],
    coverImage: 'journal-printemps-2026.png',
    description:
      'Chamboule-tout municipal : restructuration des directions, réductions d\'effectifs annoncées, mise en disponibilité, avancements de grade et défense juridique.',
  },
  {
    id: 'hiver-2026',
    title: 'Journal CFDT Gennevilliers',
    subtitle: 'Des contrats illégaux à Gennevilliers, où sont nos valeurs ?...',
    season: 'Hiver',
    year: 2026,
    filename: 'journal-gennevilliers-hiver-2026.pdf',
    url: `${CFDT_JOURNAUX_BASE_URL}journal-gennevilliers-hiver-2026.pdf`,
    badge: 'Hiver',
    tabLabel: 'Hiver',
    dateParution: 'Hiver 2026',
    pages: 36,
    fileSize: '1.69 Mo',
    themes: [
      'Contrats de vacation illégaux',
      'Le CDI dans la FP',
      'Formation : qui paie quoi ?',
      'PSC & Cotisations CNRACL',
    ],
    coverImage: 'journal-hiver-2026.png',
    description:
      'Dénonciation des contrats de vacation précaires imposés aux animateurs et agents de Gennevilliers, revendication pour leur requalification statutaire et droit à la formation.',
  },
  {
    id: 'hiver-2025',
    title: 'Journal CFDT Gennevilliers',
    subtitle: 'Égalité professionnelle femmes-hommes, Toujours pas ...',
    season: 'Automne',
    year: 2025,
    filename: 'journal-gennevilliers-hiver-2025.pdf',
    url: `${CFDT_JOURNAUX_BASE_URL}journal-gennevilliers-hiver-2025.pdf`,
    badge: 'Automne',
    tabLabel: 'Automne',
    dateParution: 'Automne 2025',
    pages: 36,
    fileSize: '1.68 Mo',
    themes: [
      'Édito : Égalité femmes-hommes',
      'Nouvelles règles report congés',
      'Atlas : IA syndicale',
      'Défenseur juridique',
    ],
    coverImage: 'journal-hiver-2025.png',
    description:
      'Dossier sur les inégalités de rémunération et de carrière persistantes, nouvelles règles européennes sur le report des congés maladie et intelligence artificielle syndicale.',
  },
];
