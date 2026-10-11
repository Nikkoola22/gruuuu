export type WeatherSourceModel = 
  | 'best_match' 
  | 'meteofrance_seamless' 
  | 'icon_seamless' 
  | 'ecmwf_ifs025';

export interface WeatherLocation {
  id: number | string;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string; // Région / État
  admin2?: string; // Département
  latitude: number;
  longitude: number;
  timezone?: string;
  isCustom?: boolean;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  isDay: boolean;
  uvIndex?: number;
}

export interface HourlyForecastItem {
  time: string;
  hourStr: string;
  dateStr: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  relativeHumidity: number;
  uvIndex: number;
  cloudCover: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  dominantWindDirection: number;
}

export interface AirQualityData {
  time: string;
  europeanAqi: number;
  usAqi?: number;
  pm10: number;
  pm25: number;
  no2: number;
  ozone: number;
  so2: number;
  category: 'Très bon' | 'Bon' | 'Moyen' | 'Dégradé' | 'Mauvais' | 'Très mauvais';
  color: string;
  advice: string;
}

export interface SunMoonData {
  sunrise: string;
  sunset: string;
  dayLength: string;
  solarNoon: string;
  sunProgressPercent: number; // 0 to 100
  isSunUp: boolean;
  moonPhaseName: string;
  moonIlluminationPercent: number;
  moonIconName: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'danger';
  description: string;
  recommendation: string;
}

export interface WeatherSettings {
  unitTemp: 'celsius' | 'fahrenheit';
  unitSpeed: 'kmh' | 'ms' | 'mph';
  unitPressure: 'hpa' | 'inHg';
  unitPrecipitation: 'mm' | 'inch';
  darkSun: boolean; // Breezy Weather v6.2.2 feature: Dark sun in dark mode
  sourceModel: WeatherSourceModel;
  autoRefreshIntervalMinutes: number;
}
