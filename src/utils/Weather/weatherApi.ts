import { 
  WeatherLocation, 
  CurrentWeather, 
  HourlyForecastItem, 
  DailyForecastItem, 
  AirQualityData, 
  WeatherSourceModel,
  SunMoonData
} from './types';
import { calculateSunMoonData, evaluateAirQuality } from './weatherCalculations';

export const DEFAULT_CITIES: WeatherLocation[] = [
  {
    id: 3016321,
    name: 'Gennevilliers',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    admin2: 'Hauts-de-Seine',
    latitude: 48.9333,
    longitude: 2.2933,
    timezone: 'Europe/Paris'
  },
  {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    admin2: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris'
  },
  {
    id: 2996944,
    name: 'Lyon',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Auvergne-Rhône-Alpes',
    admin2: 'Rhône',
    latitude: 45.764,
    longitude: 4.8357,
    timezone: 'Europe/Paris'
  },
  {
    id: 2995469,
    name: 'Marseille',
    country: 'France',
    countryCode: 'FR',
    admin1: "Provence-Alpes-Côte d'Azur",
    admin2: 'Bouches-du-Rhône',
    latitude: 43.2965,
    longitude: 5.3698,
    timezone: 'Europe/Paris'
  },
  {
    id: 2990969,
    name: 'Nanterre',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    admin2: 'Hauts-de-Seine',
    latitude: 48.8924,
    longitude: 2.2071,
    timezone: 'Europe/Paris'
  },
  {
    id: 3031582,
    name: 'Bordeaux',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Nouvelle-Aquitaine',
    admin2: 'Gironde',
    latitude: 44.8378,
    longitude: -0.5792,
    timezone: 'Europe/Paris'
  },
  {
    id: 2998324,
    name: 'Lille',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Hauts-de-France',
    admin2: 'Nord',
    latitude: 50.6292,
    longitude: 3.0573,
    timezone: 'Europe/Paris'
  },
  {
    id: 2990999,
    name: 'Nantes',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Pays de la Loire',
    admin2: 'Loire-Atlantique',
    latitude: 47.2184,
    longitude: -1.5536,
    timezone: 'Europe/Paris'
  },
  {
    id: 2972315,
    name: 'Toulouse',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Occitanie',
    admin2: 'Haute-Garonne',
    latitude: 43.6047,
    longitude: 1.4442,
    timezone: 'Europe/Paris'
  },
  {
    id: 2973783,
    name: 'Strasbourg',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Grand Est',
    admin2: 'Bas-Rhin',
    latitude: 48.5734,
    longitude: 7.7521,
    timezone: 'Europe/Paris'
  }
];

export async function searchCities(query: string): Promise<WeatherLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=fr&format=json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      id: item.id || `${item.latitude}_${item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code,
      admin1: item.admin1 || '',
      admin2: item.admin2 || item.admin3 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'Europe/Paris'
    }));
  } catch (err) {
    console.error('Erreur recherche de ville:', err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<WeatherLocation | null> {
  // Tentative avec OpenStreetMap Nominatim ou dérivation
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12&addressdetails=1`, {
      headers: {
        'Accept-Language': 'fr'
      }
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || 'Position actuelle';
      return {
        id: `geo_${lat.toFixed(4)}_${lon.toFixed(4)}`,
        name: cityName,
        country: addr.country || 'France',
        countryCode: addr.country_code ? addr.country_code.toUpperCase() : 'FR',
        admin1: addr.state || addr.region || '',
        admin2: addr.county || addr.department || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris',
        isCustom: true
      };
    }
  } catch {
    // Silently fallback
  }

  return {
    id: `geo_${lat.toFixed(4)}_${lon.toFixed(4)}`,
    name: 'Ma position',
    country: 'France',
    countryCode: 'FR',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris',
    isCustom: true
  };
}

export interface WeatherDataResponse {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  sunMoon: SunMoonData;
  sourceModelUsed: WeatherSourceModel;
  fetchedAt: string;
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  sourceModel: WeatherSourceModel = 'best_match'
): Promise<WeatherDataResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'uv_index',
    'cloud_cover',
    'is_day'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant'
  ].join(',');

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto&forecast_days=10`;

  if (sourceModel !== 'best_match') {
    url += `&models=${sourceModel}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erreur Open-Meteo API (${res.status})`);
  }
  const data = await res.json();

  // Parse Current
  const c = data.current;
  const current: CurrentWeather = {
    time: c.time,
    temperature: Math.round(c.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(c.apparent_temperature * 10) / 10,
    relativeHumidity: Math.round(c.relative_humidity_2m),
    precipitation: c.precipitation || 0,
    rain: c.rain || 0,
    weatherCode: c.weather_code,
    cloudCover: c.cloud_cover || 0,
    pressure: Math.round(c.pressure_msl || c.surface_pressure || 1013),
    surfacePressure: Math.round(c.surface_pressure || 1013),
    windSpeed: Math.round(c.wind_speed_10m),
    windDirection: Math.round(c.wind_direction_10m),
    windGusts: Math.round(c.wind_gusts_10m),
    isDay: c.is_day === 1,
    uvIndex: 0
  };

  // Parse Hourly - filter from current hour up to 36 hours ahead
  const h = data.hourly;
  const nowIso = new Date().toISOString();
  const hourly: HourlyForecastItem[] = [];

  const totalHours = h.time.length;
  // Trouver l'index de départ le plus proche de maintenant
  let startIndex = 0;
  for (let i = 0; i < totalHours; i++) {
    if (new Date(h.time[i]).getTime() >= Date.now() - 3600000) {
      startIndex = i;
      break;
    }
  }

  const sliceEnd = Math.min(startIndex + 36, totalHours);

  for (let i = startIndex; i < sliceEnd; i++) {
    const d = new Date(h.time[i]);
    const hourStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

    hourly.push({
      time: h.time[i],
      hourStr,
      dateStr,
      temperature: Math.round(h.temperature_2m[i] * 10) / 10,
      apparentTemperature: Math.round(h.apparent_temperature[i] * 10) / 10,
      precipitationProbability: Math.round(h.precipitation_probability[i] || 0),
      precipitation: Math.round((h.precipitation[i] || 0) * 10) / 10,
      weatherCode: h.weather_code[i],
      windSpeed: Math.round(h.wind_speed_10m[i] || 0),
      windDirection: Math.round(h.wind_direction_10m[i] || 0),
      windGusts: Math.round(h.wind_gusts_10m[i] || 0),
      relativeHumidity: Math.round(h.relative_humidity_2m[i] || 0),
      uvIndex: Math.round(h.uv_index[i] || 0),
      cloudCover: Math.round(h.cloud_cover[i] || 0),
      isDay: h.is_day[i] === 1
    });
  }

  // UV index courant = première heure future
  if (hourly.length > 0) {
    current.uvIndex = hourly[0].uvIndex;
  }

  // Parse Daily
  const dl = data.daily;
  const daily: DailyForecastItem[] = [];
  const daysCount = dl.time.length;

  for (let i = 0; i < daysCount; i++) {
    const timeStr = dl.time[i];
    const d = new Date(timeStr.includes('T') ? timeStr : `${timeStr}T12:00:00`);
    const rawDayName = i === 0 ? "Aujourd'hui" : i === 1 ? 'Demain' : d.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayName = rawDayName.charAt(0).toUpperCase() + rawDayName.slice(1);
    const formattedDate = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    daily.push({
      date: dl.time[i],
      dayName,
      formattedDate,
      weatherCode: dl.weather_code[i],
      tempMax: Math.round(dl.temperature_2m_max[i] * 10) / 10,
      tempMin: Math.round(dl.temperature_2m_min[i] * 10) / 10,
      apparentMax: Math.round(dl.apparent_temperature_max[i] * 10) / 10,
      apparentMin: Math.round(dl.apparent_temperature_min[i] * 10) / 10,
      sunrise: dl.sunrise[i],
      sunset: dl.sunset[i],
      uvIndexMax: Math.round(dl.uv_index_max[i] || 0),
      precipitationSum: Math.round((dl.precipitation_sum[i] || 0) * 10) / 10,
      precipitationProbabilityMax: Math.round(dl.precipitation_probability_max[i] || 0),
      windSpeedMax: Math.round(dl.wind_speed_10m_max[i] || 0),
      windGustsMax: Math.round(dl.wind_gusts_10m_max[i] || 0),
      dominantWindDirection: Math.round(dl.wind_direction_10m_dominant[i] || 0)
    });
  }

  // Calcul Soleil & Lune à partir du lever/coucher d'aujourd'hui
  const sunMoon = calculateSunMoonData(
    daily[0]?.sunrise || new Date().toISOString(),
    daily[0]?.sunset || new Date().toISOString()
  );

  return {
    current,
    hourly,
    daily,
    sunMoon,
    sourceModelUsed: sourceModel,
    fetchedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;

    const eAqi = Math.round(c.european_aqi || 25);
    const evalData = evaluateAirQuality(eAqi);

    return {
      time: c.time,
      europeanAqi: eAqi,
      usAqi: Math.round(c.us_aqi || 30),
      pm10: Math.round((c.pm10 || 0) * 10) / 10,
      pm25: Math.round((c.pm2_5 || 0) * 10) / 10,
      no2: Math.round((c.nitrogen_dioxide || 0) * 10) / 10,
      ozone: Math.round((c.ozone || 0) * 10) / 10,
      so2: Math.round((c.sulphur_dioxide || 0) * 10) / 10,
      category: evalData.category,
      color: evalData.color,
      advice: evalData.advice
    };
  } catch (err) {
    console.error('Erreur qualité de l’air:', err);
    return null;
  }
}
