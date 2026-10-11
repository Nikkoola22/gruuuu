export interface WeatherConditionInfo {
  code: number;
  label: string;
  iconName: 'Sun' | 'Moon' | 'CloudSun' | 'CloudMoon' | 'Cloud' | 'CloudRain' | 'CloudDrizzle' | 'CloudLightning' | 'CloudSnow' | 'CloudFog' | 'Wind';
  themeClass: string;
  badgeColor: string;
}

export function getWeatherConditionInfo(code: number, isDay: boolean = true, darkSun: boolean = false): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Ciel dégagé' : 'Nuit claire',
        iconName: isDay ? (darkSun ? 'Sun' : 'Sun') : 'Moon',
        themeClass: isDay ? 'from-amber-500/20 via-sky-500/10 to-blue-600/20' : 'from-slate-900 via-indigo-950 to-slate-950',
        badgeColor: isDay ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      };
    case 1:
      return {
        code,
        label: isDay ? 'Ensoleillé avec rares nuages' : 'Nuit peu nuageuse',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        themeClass: isDay ? 'from-amber-400/20 via-sky-500/10 to-blue-500/20' : 'from-slate-900 via-slate-800 to-indigo-950',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
      };
    case 2:
      return {
        code,
        label: 'Éclaircies et passages nuageux',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        themeClass: 'from-blue-500/20 via-slate-600/15 to-slate-800/20',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      };
    case 3:
      return {
        code,
        label: 'Couvert',
        iconName: 'Cloud',
        themeClass: 'from-slate-700/25 via-slate-800/25 to-slate-900/30',
        badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Brouillard givrant' : 'Brouillard',
        iconName: 'CloudFog',
        themeClass: 'from-zinc-700/25 via-slate-700/20 to-slate-900/30',
        badgeColor: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Bruine légère' : code === 53 ? 'Bruine modérée' : 'Bruine dense',
        iconName: 'CloudDrizzle',
        themeClass: 'from-cyan-600/20 via-blue-700/15 to-slate-900/25',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Bruine verglaçante',
        iconName: 'CloudSnow',
        themeClass: 'from-teal-600/20 via-blue-800/20 to-slate-900/30',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Pluie faible' : code === 63 ? 'Pluie modérée' : 'Pluie forte',
        iconName: 'CloudRain',
        themeClass: 'from-blue-600/25 via-indigo-900/20 to-slate-900/30',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Pluie verglaçante',
        iconName: 'CloudSnow',
        themeClass: 'from-sky-700/25 via-slate-800/20 to-indigo-950/30',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Neige légère' : code === 73 ? 'Chute de neige modérée' : 'Forte chute de neige',
        iconName: 'CloudSnow',
        themeClass: 'from-slate-200/15 via-blue-300/10 to-slate-800/30',
        badgeColor: 'bg-slate-200/20 text-slate-100 border-slate-300/30'
      };
    case 77:
      return {
        code,
        label: 'Grains de neige',
        iconName: 'CloudSnow',
        themeClass: 'from-slate-300/15 via-blue-400/10 to-slate-800/30',
        badgeColor: 'bg-blue-300/20 text-blue-200 border-blue-400/30'
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 80 ? 'Averses éparses' : code === 81 ? 'Averses modérées' : 'Averses violentes',
        iconName: 'CloudRain',
        themeClass: 'from-blue-700/25 via-indigo-900/25 to-slate-950/30',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Averses de neige',
        iconName: 'CloudSnow',
        themeClass: 'from-blue-400/20 via-slate-600/20 to-slate-900/30',
        badgeColor: 'bg-blue-400/20 text-blue-200 border-blue-400/30'
      };
    case 95:
      return {
        code,
        label: 'Orages',
        iconName: 'CloudLightning',
        themeClass: 'from-amber-600/25 via-purple-900/25 to-slate-950/35',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      };
    case 96:
    case 99:
      return {
        code,
        label: code === 96 ? 'Orage avec grêle légère' : 'Orage violent avec fortes grêles',
        iconName: 'CloudLightning',
        themeClass: 'from-rose-600/25 via-purple-950/30 to-slate-950/40',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      };
    default:
      return {
        code,
        label: 'Conditions variables',
        iconName: 'Cloud',
        themeClass: 'from-blue-500/20 via-slate-700/15 to-slate-900/25',
        badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
      };
  }
}
