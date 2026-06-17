const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/components/Calculateur13emeV2.tsx',
  'src/components/CalculateurPrimesV2.tsx',
  'src/components/CalculateurCIAV2.tsx',
  'src/components/Metiers.tsx',
  'src/components/Actualites.tsx'
];

filePaths.forEach(relPath => {
  const absPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(absPath)) return;
  
  let content = fs.readFileSync(absPath, 'utf8');
  
  // Fix double dark classes like `dark:bg-slate-800 dark:bg-slate-900` -> `dark:bg-slate-800`
  content = content.replace(/dark:bg-slate-800 dark:bg-slate-900/g, 'dark:bg-slate-800');
  content = content.replace(/dark:bg-slate-900 dark:bg-slate-900/g, 'dark:bg-slate-900');
  content = content.replace(/dark:text-slate-300 dark:text-white/g, 'dark:text-slate-300');
  content = content.replace(/dark:border-slate-700 dark:border-slate-600/g, 'dark:border-slate-700');
  
  // also wait, let's just make sure "Actualites.tsx" or others don't have bg-white/95 dark:bg-slate-900/95 dark:bg-slate-800
  content = content.replace(/dark:bg-slate-900\/95 dark:bg-slate-900/g, 'dark:bg-slate-900/95');
  
  fs.writeFileSync(absPath, content, 'utf8');
});
