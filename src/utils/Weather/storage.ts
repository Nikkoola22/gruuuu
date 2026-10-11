import { WeatherLocation, WeatherSettings } from './types';
import { DEFAULT_CITIES } from './weatherApi';

const STORAGE_KEYS = {
  ACTIVE_LOCATION: 'breezy_weather_active_location_v622',
  SAVED_LOCATIONS: 'breezy_weather_saved_locations_v622',
  SETTINGS: 'breezy_weather_settings_v622',
};

export const DEFAULT_SETTINGS: WeatherSettings = {
  unitTemp: 'celsius',
  unitSpeed: 'kmh',
  unitPressure: 'hpa',
  unitPrecipitation: 'mm',
  darkSun: false, // Breezy Weather v6.2.2 feature: Dark sun in dark mode
  sourceModel: 'best_match',
  autoRefreshIntervalMinutes: 30,
};

export function getActiveLocation(): WeatherLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOCATION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture active location:', e);
  }
  return DEFAULT_CITIES[0]; // Gennevilliers
}

export function setActiveLocation(location: WeatherLocation): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LOCATION, JSON.stringify(location));
  } catch (e) {
    console.warn('Erreur écriture active location:', e);
  }
}

export function getSavedLocations(): WeatherLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Erreur lecture saved locations:', e);
  }
  return [DEFAULT_CITIES[0], DEFAULT_CITIES[1], DEFAULT_CITIES[2]];
}

export function saveLocation(loc: WeatherLocation): WeatherLocation[] {
  const current = getSavedLocations();
  const exists = current.some(c => 
    c.id === loc.id || 
    (Math.abs(c.latitude - loc.latitude) < 0.05 && Math.abs(c.longitude - loc.longitude) < 0.05)
  );
  if (!exists) {
    const updated = [loc, ...current].slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    return updated;
  }
  return current;
}

export function removeSavedLocation(locId: string | number): WeatherLocation[] {
  const current = getSavedLocations();
  const updated = current.filter(c => c.id !== locId);
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }
  return updated;
}

export function getWeatherSettings(): WeatherSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_SETTINGS;
}

export function saveWeatherSettings(settings: WeatherSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn(e);
  }
}
