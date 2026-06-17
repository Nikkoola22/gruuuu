const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/components/Calculateur13emeV2.tsx',
  'src/components/CalculateurPrimesV2.tsx',
  'src/components/CalculateurCIAV2.tsx',
  'src/components/Metiers.tsx',
  'src/components/Actualites.tsx'
];

const replacements = [
  { regex: /\bbg-slate-50\b(?!\s*dark:bg-)/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /\bbg-white\b(?!\s*dark:bg-)/g, replacement: 'bg-white dark:bg-slate-800' },
  { regex: /\btext-slate-800\b(?!\s*dark:text-)/g, replacement: 'text-slate-800 dark:text-white' },
  { regex: /\btext-slate-600\b(?!\s*dark:text-)/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /\btext-slate-500\b(?!\s*dark:text-)/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /\border-slate-200\b(?!\s*dark:border-)/g, replacement: 'border-slate-200 dark:border-slate-700' },
  { regex: /\bbg-slate-100\b(?!\s*dark:bg-)/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { regex: /\bbg-slate-800\b(?!\s*dark:bg-)/g, replacement: 'bg-slate-800 dark:bg-slate-900' }, // Be careful if already dark:bg-slate-800
];

filePaths.forEach(relPath => {
  const absPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(absPath)) {
    console.error('File not found:', absPath);
    return;
  }
  
  let content = fs.readFileSync(absPath, 'utf8');
  
  // Custom manual replacements for overly specific things first
  content = content.replace(/bg-white\/95/g, 'bg-white/95 dark:bg-slate-900/95');
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  fs.writeFileSync(absPath, content, 'utf8');
  console.log('Updated:', relPath);
});
