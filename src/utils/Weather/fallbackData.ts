import { WeatherDataResponse } from './weatherApi';
import { AirQualityData } from './types';

export function getFallbackWeatherData(cityName = 'Gennevilliers'): WeatherDataResponse {
  const now = new Date();
  const hourly = [];

  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getTime() + i * 3600000);
    const hour = d.getHours();
    const isDay = hour >= 7 && hour <= 20;
    const baseTemp = 16 + Math.sin((hour - 8) / 4) * 4;
    const rainProb = Math.max(5, Math.min(65, Math.round(25 + Math.sin(i / 3) * 30)));

    hourly.push({
      time: d.toISOString(),
      hourStr: `${hour.toString().padStart(2, '0')}:00`,
      dateStr: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      temperature: Math.round(baseTemp * 10) / 10,
      apparentTemperature: Math.round((baseTemp - 1.5) * 10) / 10,
      precipitationProbability: rainProb,
      precipitation: rainProb > 40 ? 0.8 : 0,
      weatherCode: rainProb > 50 ? 61 : rainProb > 30 ? 2 : 1,
      windSpeed: 14 + Math.round(Math.sin(i) * 6),
      windDirection: 240,
      windGusts: 26 + Math.round(Math.cos(i) * 8),
      relativeHumidity: 60 + Math.round(Math.sin(i / 2) * 15),
      uvIndex: isDay ? (hour >= 11 && hour <= 15 ? 4 : 2) : 0,
      cloudCover: 35 + Math.round(Math.sin(i) * 30),
      isDay
    });
  }

  const daily = [];
  const dayNames = ['Aujourd\'hui', 'Demain', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    daily.push({
      date: d.toISOString().split('T')[0],
      dayName: dayNames[i] || d.toLocaleDateString('fr-FR', { weekday: 'long' }),
      formattedDate: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      weatherCode: i === 0 ? 2 : i === 1 ? 61 : i === 2 ? 1 : 2,
      tempMax: 18 + (i % 3),
      tempMin: 9 + (i % 2),
      apparentMax: 17 + (i % 3),
      apparentMin: 8 + (i % 2),
      sunrise: new Date(d.setHours(7, 58)).toISOString(),
      sunset: new Date(d.setHours(19, 8)).toISOString(),
      uvIndexMax: 4,
      precipitationSum: i === 1 ? 3.4 : 0.2,
      precipitationProbabilityMax: i === 1 ? 75 : 20,
      windSpeedMax: 18,
      windGustsMax: 35,
      dominantWindDirection: 250
    });
  }

  return {
    current: {
      time: now.toISOString(),
      temperature: 16.5,
      apparentTemperature: 14.2,
      relativeHumidity: 62,
      precipitation: 0,
      rain: 0,
      weatherCode: 2,
      cloudCover: 40,
      pressure: 1016,
      surfacePressure: 1012,
      windSpeed: 15,
      windDirection: 255,
      windGusts: 28,
      isDay: true,
      uvIndex: 3
    },
    hourly,
    daily,
    sunMoon: {
      sunrise: '07:58',
      sunset: '19:08',
      dayLength: '11h 10m',
      solarNoon: '13:33',
      sunProgressPercent: 65,
      isSunUp: true,
      moonPhaseName: 'Premier quartier',
      moonIlluminationPercent: 48,
      moonIconName: 'Moon'
    },
    sourceModelUsed: 'best_match',
    fetchedAt: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  };
}

export function getFallbackAirQuality(): AirQualityData {
  return {
    time: new Date().toISOString(),
    europeanAqi: 28,
    usAqi: 32,
    pm10: 11.2,
    pm25: 4.8,
    no2: 14.5,
    ozone: 54.0,
    so2: 1.1,
    category: 'Bon',
    color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
    advice: 'Qualité satisfaisante de l\'air. Aucun impact notable pour la population générale.'
  };
}
