import { CurrentWeather, DailyForecastItem, WeatherAlert, AirQualityData, SunMoonData } from './types';

export function calculateSunMoonData(
  sunriseStr: string,
  sunsetStr: string,
  currentDate: Date = new Date()
): SunMoonData {
  const sunrise = new Date(sunriseStr);
  const sunset = new Date(sunsetStr);
  const now = currentDate.getTime();

  const sunriseTime = sunrise.getTime();
  const sunsetTime = sunset.getTime();

  let sunProgressPercent = 0;
  let isSunUp = false;

  if (now >= sunriseTime && now <= sunsetTime) {
    isSunUp = true;
    const totalDayMs = sunsetTime - sunriseTime;
    const elapsedMs = now - sunriseTime;
    sunProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDayMs) * 100)));
  } else if (now > sunsetTime) {
    sunProgressPercent = 100;
    isSunUp = false;
  } else {
    sunProgressPercent = 0;
    isSunUp = false;
  }

  // Durée du jour
  const diffHours = (sunsetTime - sunriseTime) / (1000 * 60 * 60);
  const hours = Math.floor(diffHours);
  const minutes = Math.round((diffHours - hours) * 60);
  const dayLength = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

  // Midi solaire (approx)
  const solarNoonDate = new Date(sunriseTime + (sunsetTime - sunriseTime) / 2);
  const solarNoon = solarNoonDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // Phase lunaire calculée
  const moon = getMoonPhase(currentDate);

  return {
    sunrise: sunrise.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    sunset: sunset.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    dayLength,
    solarNoon,
    sunProgressPercent,
    isSunUp,
    moonPhaseName: moon.name,
    moonIlluminationPercent: moon.illumination,
    moonIconName: moon.icon
  };
}

export function getMoonPhase(date: Date) {
  // Calcul astronomique basé sur le cycle synodique de 29.53058867 jours
  // Référence connue : Nouvelle lune du 6 Janvier 2000 à 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const cycleDays = 29.53058867;
  const phaseDays = ((diffDays % cycleDays) + cycleDays) % cycleDays;
  const phaseFraction = phaseDays / cycleDays;
  const illumination = Math.round((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2 * 100);

  if (phaseDays < 1.84) {
    return { name: 'Nouvelle lune', illumination, icon: 'Circle' };
  } else if (phaseDays < 5.53) {
    return { name: 'Premier croissant', illumination, icon: 'MoonStar' };
  } else if (phaseDays < 9.22) {
    return { name: 'Premier quartier', illumination, icon: 'Moon' };
  } else if (phaseDays < 12.92) {
    return { name: 'Lune gibbeuse croissante', illumination, icon: 'Moon' };
  } else if (phaseDays < 16.61) {
    return { name: 'Pleine lune', illumination, icon: 'Sun' };
  } else if (phaseDays < 20.30) {
    return { name: 'Lune gibbeuse décroissante', illumination, icon: 'Moon' };
  } else if (phaseDays < 23.99) {
    return { name: 'Dernier quartier', illumination, icon: 'Moon' };
  } else if (phaseDays < 27.68) {
    return { name: 'Dernier croissant', illumination, icon: 'MoonStar' };
  } else {
    return { name: 'Nouvelle lune', illumination, icon: 'Circle' };
  }
}

export function getBeaufortScale(kmh: number): { force: number; term: string; desc: string } {
  if (kmh < 1) return { force: 0, term: 'Calme', desc: 'Fumée s\'élève verticalement' };
  if (kmh <= 5) return { force: 1, term: 'Très légère brise', desc: 'Fumée indique la direction' };
  if (kmh <= 11) return { force: 2, term: 'Légère brise', desc: 'Feuilles remuent, vent sur le visage' };
  if (kmh <= 19) return { force: 3, term: 'Petite brise', desc: 'Feuilles agitées sans arrêt' };
  if (kmh <= 28) return { force: 4, term: 'Jolie brise', desc: 'Poussière soulevée, branches bougent' };
  if (kmh <= 38) return { force: 5, term: 'Bonne brise', desc: 'Arbustes balancent, vagues sur l\'eau' };
  if (kmh <= 49) return { force: 6, term: 'Vent frais', desc: 'Grandes branches agitées, parapluies difficiles' };
  if (kmh <= 61) return { force: 7, term: 'Grand frais', desc: 'Arbres entiers bougent, marche difficile' };
  if (kmh <= 74) return { force: 8, term: 'Coup de vent', desc: 'Branches cassées, marche très gênée' };
  if (kmh <= 88) return { force: 9, term: 'Fort coup de vent', desc: 'Légers dégâts aux toitures' };
  if (kmh <= 102) return { force: 10, term: 'Tempête', desc: 'Dégâts importants, arbres déracinés' };
  if (kmh <= 117) return { force: 11, term: 'Violente tempête', desc: 'Ravages étendus' };
  return { force: 12, term: 'Ouragan', desc: 'Dégâts catastrophiques' };
}

export function getUvStatus(uv: number): { label: string; color: string; advice: string } {
  if (uv < 3) {
    return { label: 'Faible', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', advice: 'Aucune protection requise. Profitez du soleil en toute sécurité.' };
  }
  if (uv < 6) {
    return { label: 'Modéré', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', advice: 'Protection recommandée : lunettes de soleil et crème solaire FPS 30+ lors des expositions prolongées.' };
  }
  if (uv < 8) {
    return { label: 'Élevé', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', advice: 'Protection indispensable : chapeau, crème FPS 50, évitez l\'exposition directe entre 12h et 16h.' };
  }
  if (uv < 11) {
    return { label: 'Très élevé', color: 'text-rose-400 bg-rose-500/20 border-rose-500/30', advice: 'Risque élevé : restez à l\'ombre aux heures chaudes. Vêtements couvrants et réapplication fréquente de crème solaire.' };
  }
  return { label: 'Extrême', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', advice: 'Danger pour la peau et les yeux : évitez toute exposition directe à l\'extérieur.' };
}

export function evaluateAirQuality(europeanAqi: number): Pick<AirQualityData, 'category' | 'color' | 'advice'> {
  if (europeanAqi <= 20) {
    return {
      category: 'Très bon',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      advice: 'Air d\'excellente qualité. Parfait pour toutes les activités de plein air et aérer les locaux.'
    };
  }
  if (europeanAqi <= 40) {
    return {
      category: 'Bon',
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      advice: 'Qualité satisfaisante de l\'air. Aucun impact notable pour la population générale.'
    };
  }
  if (europeanAqi <= 60) {
    return {
      category: 'Moyen',
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      advice: 'Qualité modérée. Les personnes particulièrement sensibles aux polluants peuvent ressentir une gêne.'
    };
  }
  if (europeanAqi <= 80) {
    return {
      category: 'Dégradé',
      color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      advice: 'Sensibles : réduisez les efforts physiques intenses à l\'extérieur. Privilégiez l\'aération le matin tôt.'
    };
  }
  if (europeanAqi <= 100) {
    return {
      category: 'Mauvais',
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
      advice: 'Impact sur la santé pour toute la population. Évitez les activités sportives intenses dehors.'
    };
  }
  return {
    category: 'Très mauvais',
    color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    advice: 'Alerte pollution : limitez les déplacements non essentiels, gardez fenêtres fermées aux heures de pointe.'
  };
}

export function detectWeatherAlerts(current: CurrentWeather, daily: DailyForecastItem[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Alerte Canicule
  const maxTempToday = daily[0]?.tempMax ?? current.temperature;
  if (maxTempToday >= 35) {
    alerts.push({
      id: 'canicule-rouge',
      title: 'Vigilance Canicule Extrême',
      severity: 'danger',
      description: `Températures exceptionnelles attendues (${Math.round(maxTempToday)}°C). Risque de coup de chaleur élevé.`,
      recommendation: 'Hydratez-vous régulièrement, maintenez les locaux au frais, signalez les personnes vulnérables (Plan canicule territorial).'
    });
  } else if (maxTempToday >= 32) {
    alerts.push({
      id: 'canicule-orange',
      title: 'Vigilance Fortes Chaleurs',
      severity: 'warning',
      description: `Pic de chaleur à ${Math.round(maxTempToday)}°C. Ressenti élevé en milieu urbain.`,
      recommendation: 'Buvez de l\'eau régulièrement, évitez les sorties aux heures les plus chaudes.'
    });
  }

  // Alerte Grand Froid
  const minTempToday = daily[0]?.tempMin ?? current.temperature;
  if (minTempToday <= -5) {
    alerts.push({
      id: 'grand-froid',
      title: 'Vigilance Grand Froid & Verglas',
      severity: 'warning',
      description: `Températures minimales négatives (${Math.round(minTempToday)}°C) avec risques de verglas sur chaussées.`,
      recommendation: 'Prudence sur les routes et trottoirs, protégez les canalisations et chauffez avec aération régulière.'
    });
  }

  // Alerte Vent violent
  if (current.windGusts >= 75 || (daily[0]?.windGustsMax ?? 0) >= 80) {
    const gust = Math.max(current.windGusts, daily[0]?.windGustsMax ?? 0);
    alerts.push({
      id: 'vent-violent',
      title: 'Vigilance Coup de Vent',
      severity: 'warning',
      description: `Rafales de vent pouvant atteindre ${Math.round(gust)} km/h. Risque de chutes de branches et d'objets.`,
      recommendation: 'Sécurisez les objets extérieurs légers, limitez les déplacements sous les arbres et sur les chantiers.'
    });
  }

  // Alerte Orages
  if ([95, 96, 99].includes(current.weatherCode) || [95, 96, 99].includes(daily[0]?.weatherCode ?? 0)) {
    alerts.push({
      id: 'orages',
      title: 'Vigilance Orages & Grêle',
      severity: 'warning',
      description: 'Activité orageuse locale avec risque de précipitations intenses soudaines et foudre.',
      recommendation: 'Évitez de vous abriter sous les arbres, débranchez les équipements sensibles si nécessaire.'
    });
  }

  // Alerte Fortes Pluies / Inondation
  if ((daily[0]?.precipitationSum ?? 0) >= 25 || (daily[0]?.precipitationProbabilityMax ?? 0) >= 85) {
    alerts.push({
      id: 'pluie-inondation',
      title: 'Vigilance Précipitations Soutenues',
      severity: 'info',
      description: `Fortes pluies prévues : cumul estimé à ${daily[0]?.precipitationSum.toFixed(1)} mm avec ${daily[0]?.precipitationProbabilityMax}% de probabilité.`,
      recommendation: 'Attention aux accumulations d\'eau dans les passages souterrains et zones basses.'
    });
  }

  return alerts;
}
